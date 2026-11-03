/**
 * Shipping Controller: Logistics & Vessel Departure (ATD) Management
 * Allows Shipping Department to update Actual Time of Departure (ATD) directly on Dashboard
 * File size target: < 400 lines (Strictly verified)
 */

const SHIPPING_ATD_STORAGE_KEY = "greenriver_shipping_atd_overrides_v1";

function loadShippingAtdOverrides() {
  try {
    const raw = localStorage.getItem(SHIPPING_ATD_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    console.warn("[Shipping ATD] Failed to load overrides:", e);
    return {};
  }
}

function saveShippingAtdOverride(orderNo, atdDate, remark) {
  try {
    const data = loadShippingAtdOverrides();
    data[orderNo] = {
      atd: atdDate,
      remark: remark || "",
      updatedAt: new Date().toLocaleString("en-GB")
    };
    localStorage.setItem(SHIPPING_ATD_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[Shipping ATD] Failed to save override:", e);
  }
}

function applyShippingAtdOverridesToDataset(dataset) {
  if (!dataset || !Array.isArray(dataset)) return;
  const overrides = loadShippingAtdOverrides();
  dataset.forEach(item => {
    if (item && item.orderNo && overrides[item.orderNo]) {
      item.step6 = item.step6 || {};
      item.step6.atd = overrides[item.orderNo].atd;
      if (overrides[item.orderNo].remark) {
        item.step6.atdRemark = overrides[item.orderNo].remark;
      }
      if (item.step8_shipping) {
        item.step8_shipping.atd = overrides[item.orderNo].atd;
        if (overrides[item.orderNo].remark) {
          item.step8_shipping.atdRemark = overrides[item.orderNo].remark;
        }
      }
    }
  });
}

function openUpdateAtdModal(orderNo) {
  if (!orderNo) return;
  const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
  const dataset = typeof globalData !== "undefined" ? globalData : [];
  const order = dataset.find(o => o.orderNo === orderNo);
  if (!order) {
    if (typeof showSwalWarning === "function") {
      showSwalWarning("Order Not Found", `Unable to find order ${orderNo}`);
    }
    return;
  }

  const ship = order.step6 || {};
  const currentAtd = (ship.atd && ship.atd !== "-") ? ship.atd.replace(/\//g, "-") : "";
  const currentRemark = ship.atdRemark || "";

  const titleText = isTh ? `⚓ อัปเดตวันเรือออกจริง (ATD) — ${orderNo}` : `⚓ Update Actual Time of Departure (ATD) — ${orderNo}`;
  const htmlContent = `
    <div class="text-left space-y-3.5 text-xs text-slate-700">
      <div class="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-[11px] space-y-1">
        <div class="flex justify-between"><span><strong>${isTh ? 'ลูกค้า:' : 'Customer:'}</strong> ${order.customer || '-'}</span><span><strong>${isTh ? 'ปลายทาง:' : 'POD:'}</strong> <span class="text-indigo-700 font-bold">${order.destination || '-'}</span></span></div>
        <div class="flex justify-between"><span><strong>${isTh ? 'สายการเดินเรือ:' : 'Shipping Line:'}</strong> ${ship.shippingLine || 'EVG'}</span><span><strong>${isTh ? 'Booking No:' : 'Booking:'}</strong> <span class="font-mono">${ship.bookingNo || '-'}</span></span></div>
        <div class="flex justify-between pt-1 border-t border-indigo-200/50"><span><strong>ETD (ประมาณการ):</strong> <span class="text-emerald-700 font-bold">${ship.etd || '-'}</span></span><span><strong>ETA:</strong> ${ship.eta || '-'}</span></div>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">
          <i class="fa-solid fa-calendar-check text-emerald-600 mr-1"></i>
          ${isTh ? 'วันเรือออกจากท่าเรือจริง (ATD)*:' : 'Actual Departure Date (ATD)*:'}
        </label>
        <input type="date" id="swalInputAtdDate" value="${currentAtd || new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" />
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">
          <i class="fa-solid fa-comment-dots text-indigo-600 mr-1"></i>
          ${isTh ? 'หมายเหตุจากท่าเรือ / สถานะเรือ:' : 'Port Departure Remarks:'}
        </label>
        <input type="text" id="swalInputAtdRemark" value="${currentRemark}" placeholder="${isTh ? 'เช่น เรือออกจากท่าเรียบร้อย, คลื่นลมปกติ...' : 'e.g., Vessel departed port on schedule...'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" />
      </div>

      <div class="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center">
        <i class="fa-solid fa-circle-info text-indigo-500 mr-1.5 shrink-0"></i>
        <span>${isTh ? 'ข้อมูล ATD จะซิงก์ขึ้น Dashboard ทันที และบันทึกเป็นสถิติการส่งออกจริง' : 'ATD will immediately sync to the Dashboard and record confirmed departure'}</span>
      </div>
    </div>
  `;

  Swal.fire({
    title: `<span class="text-base font-bold text-slate-900">${titleText}</span>`,
    html: htmlContent,
    showCancelButton: true,
    confirmButtonText: isTh ? '<i class="fa-solid fa-check mr-1"></i> บันทึก ATD' : '<i class="fa-solid fa-check mr-1"></i> Confirm ATD',
    cancelButtonText: isTh ? 'ยกเลิก' : 'Cancel',
    confirmButtonColor: '#059669',
    cancelButtonColor: '#64748b',
    focusConfirm: false,
    preConfirm: () => {
      const atdVal = document.getElementById("swalInputAtdDate").value;
      const remarkVal = document.getElementById("swalInputAtdRemark").value;
      if (!atdVal) {
        Swal.showValidationMessage(isTh ? 'กรุณาระบุวันเรือออกจริง (ATD)' : 'Please select the Actual Departure Date (ATD)');
        return false;
      }
      return { atd: atdVal.replace(/-/g, "/"), remark: remarkVal };
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      const formattedDate = result.value.atd;
      const remarkText = result.value.remark;

      // 1. Update in memory
      order.step6 = order.step6 || {};
      order.step6.atd = formattedDate;
      order.step6.atdRemark = remarkText;
      if (order.step8_shipping) {
        order.step8_shipping.atd = formattedDate;
        order.step8_shipping.atdRemark = remarkText;
      }

      // 2. Persist to storage
      saveShippingAtdOverride(orderNo, formattedDate, remarkText);

      // 3. Update BPM modal if currently open
      const $modalDisplay = $("#bpmModalAtdDisplay");
      if ($modalDisplay.length) {
        $modalDisplay.text(formattedDate).removeClass("text-amber-600 italic font-semibold").addClass("text-emerald-700 font-bold");
      }

      // 4. Re-render Dashboard or Query if visible
      if (typeof currentView !== "undefined") {
        if (currentView === "dashboard" && typeof renderDashboard === "function") {
          renderDashboard(globalData);
        } else if (currentView === "query" && typeof renderOrderQueryView === "function") {
          renderOrderQueryView();
        }
      }

      if (typeof showSwalSuccess === "function") {
        showSwalSuccess(
          isTh ? "อัปเดต ATD สำเร็จ" : "ATD Updated",
          isTh ? `บันทึกวันเรือออกจริงของ ${orderNo} เป็น ${formattedDate} เรียบร้อยแล้ว` : `Actual departure date for ${orderNo} set to ${formattedDate}`
        );
      }
    }
  });
}

// Auto-apply on ready
$(document).ready(function() {
  if (typeof globalData !== "undefined") {
    applyShippingAtdOverridesToDataset(globalData);
  }
});
