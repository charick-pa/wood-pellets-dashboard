/**
 * Customer Complaint & SweetAlert2 Universal Controller
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines (Strictly verified)
 */

const COMPLAINTS_STORAGE_KEY = "greenriver_customer_complaints_v1";

// 1. Universal SweetAlert2 Wrappers & Native Alert Override
function showSwalAlert(title, text, icon = "info") {
  if (typeof Swal !== "undefined") {
    return Swal.fire({
      title: title || "Notification",
      text: text || "",
      icon: icon,
      confirmButtonColor: "#059669",
      confirmButtonText: "OK",
      customClass: { popup: "rounded-2xl shadow-2xl font-sans" }
    });
  } else {
    alert(`${title}\n\n${text}`);
  }
}

function showSwalSuccess(title, text) {
  return showSwalAlert(title, text, "success");
}

function showSwalWarning(title, text) {
  return showSwalAlert(title, text, "warning");
}

function showSwalError(title, text) {
  return showSwalAlert(title, text, "error");
}

function showSwalConfirm(title, text, onConfirm, confirmText = "Yes, Proceed", cancelText = "Cancel") {
  if (typeof Swal !== "undefined") {
    return Swal.fire({
      title: title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass: { popup: "rounded-2xl shadow-2xl font-sans" }
    }).then((result) => {
      if (result.isConfirmed && typeof onConfirm === "function") {
        onConfirm();
      }
    });
  } else {
    if (confirm(`${title}\n\n${text}`)) {
      if (typeof onConfirm === "function") onConfirm();
    }
  }
}

// Override native window.alert to automatically route through SweetAlert2 in English!
if (typeof window !== "undefined") {
  window.nativeAlert = window.alert;
  window.alert = function (message) {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "Green River Panels System",
        text: String(message),
        icon: "info",
        confirmButtonColor: "#059669",
        confirmButtonText: "OK",
        customClass: { popup: "rounded-2xl shadow-2xl font-sans" }
      });
    } else {
      window.nativeAlert(message);
    }
  };
}

// 2. Storage Helpers for Customer Complaints
function loadAllComplaintsFromStorage() {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    }
  } catch (e) {
    console.warn("[Complaint Storage Error]", e);
  }
  return {};
}

function saveAllComplaintsToStorage(data) {
  try {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[Complaint Save Error]", e);
  }
}

function getComplaintsForOrder(orderNo) {
  if (!orderNo) return [];
  const all = loadAllComplaintsFromStorage();
  return Array.isArray(all[orderNo]) ? all[orderNo] : [];
}

// Format Date & Time: YYYY-MM-DD HH:mm:ss
function formatCurrentDateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

// 3. Open SweetAlert2 Modal to Log a Post-Delivery Complaint
function openComplaintModal(orderNo) {
  const dataset = typeof globalData !== "undefined" ? globalData : [];
  const order = dataset.find((o) => o.orderNo === orderNo) || { orderNo: orderNo, customer: "Customer", moNo: "-" };
  const lastSaleName = localStorage.getItem("last_sale_name") || "Somchai P. (Senior Sale Executive)";
  const currentTimestamp = formatCurrentDateTime();

  const formHtml = `
    <div class="text-left font-sans text-xs space-y-3 pt-1">
      <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div class="flex items-center justify-between text-[11px]">
          <span>Order: <strong class="text-indigo-600 font-mono">${order.orderNo}</strong> (MO: ${order.moNo || '-'})</span>
          <span class="text-slate-500 font-medium truncate max-w-[180px]">${order.customer}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">
            <i class="fa-solid fa-user-pen text-indigo-500 mr-1"></i> Recorded / Updated By *
          </label>
          <input 
            type="text" 
            id="swalComplaintSaleName" 
            value="${lastSaleName}" 
            placeholder="Sale Name / Staff ID" 
            class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">
            <i class="fa-solid fa-clock text-indigo-500 mr-1"></i> Recorded Timestamp
          </label>
          <input 
            type="text" 
            id="swalComplaintTimestamp" 
            value="${currentTimestamp}" 
            readonly 
            class="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-600 cursor-not-allowed"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">
            <i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1"></i> Complaint Category *
          </label>
          <select id="swalComplaintType" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium">
            <option value="Quality (Moisture / Ash / Density)">Quality (Moisture / Ash / Calorific Value)</option>
            <option value="Packaging & Transport Damage">Packaging & Transport (Torn Big Bag / Water ingress)</option>
            <option value="Weight & Quantity Discrepancy">Weight & Quantity Discrepancy (Metric Ton deficit)</option>
            <option value="Delivery Schedule Delay">Delivery Schedule (Late arrival at destination)</option>
            <option value="Documentation & COA / EUDR">Documentation & Certificate (COA / EUDR issue)</option>
            <option value="Other Post-Delivery Issue">Other Customer Feedback</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">
            <i class="fa-solid fa-gauge-high text-rose-500 mr-1"></i> Severity Level *
          </label>
          <select id="swalComplaintSeverity" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-bold">
            <option value="Medium">Medium (Moderate issue - QA investigation required)</option>
            <option value="High">High (Critical - Claim risk or partial rejection)</option>
            <option value="Low">Low (Minor inquiry or cosmetic observation)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">
          <i class="fa-solid fa-comment-dots text-indigo-500 mr-1"></i> Customer Complaint Description *
        </label>
        <textarea 
          id="swalComplaintDesc" 
          rows="3" 
          placeholder="Enter exact feedback or claim details received from customer after goods receipt..."
          class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">
          <i class="fa-solid fa-list-check text-emerald-600 mr-1"></i> Initial Follow-up Status
        </label>
        <select id="swalComplaintStatus" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium">
          <option value="Pending QA Investigation">Pending QA Investigation</option>
          <option value="Under Joint Review (Sale & QA)">Under Joint Review (Sale & QA)</option>
          <option value="Resolved / Corrective Action Agreed">Resolved / Corrective Action Agreed</option>
        </select>
      </div>
    </div>
  `;

  Swal.fire({
    title: `<span class="text-base font-bold text-slate-900"><i class="fa-solid fa-comment-medical text-rose-600 mr-2"></i>Log Customer Complaint (Post-Delivery)</span>`,
    html: formHtml,
    width: 560,
    showCancelButton: true,
    confirmButtonColor: "#059669",
    cancelButtonColor: "#64748b",
    confirmButtonText: `<i class="fa-solid fa-floppy-disk mr-1.5"></i> Save Complaint`,
    cancelButtonText: `Cancel`,
    focusConfirm: false,
    customClass: { popup: "rounded-3xl shadow-2xl p-5" },
    preConfirm: () => {
      const saleName = ($("#swalComplaintSaleName").val() || "").trim();
      const desc = ($("#swalComplaintDesc").val() || "").trim();
      const type = $("#swalComplaintType").val();
      const severity = $("#swalComplaintSeverity").val();
      const status = $("#swalComplaintStatus").val();
      const timestamp = $("#swalComplaintTimestamp").val() || formatCurrentDateTime();

      if (!saleName) {
        Swal.showValidationMessage("Please enter the name of the Sale Representative who recorded this complaint.");
        return false;
      }
      if (!desc) {
        Swal.showValidationMessage("Please provide customer complaint details.");
        return false;
      }

      return {
        id: `CMP-${Date.now().toString().slice(-6)}`,
        orderNo: orderNo,
        recordedBy: saleName,
        timestamp: timestamp,
        category: type,
        severity: severity,
        description: desc,
        status: status
      };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const complaint = result.value;
      localStorage.setItem("last_sale_name", complaint.recordedBy);

      const all = loadAllComplaintsFromStorage();
      if (!Array.isArray(all[orderNo])) all[orderNo] = [];
      all[orderNo].unshift(complaint);
      saveAllComplaintsToStorage(all);

      showSwalSuccess(
        "Complaint Logged Successfully!",
        `Customer complaint for ${orderNo} has been recorded by ${complaint.recordedBy} at ${complaint.timestamp}.`
      );

      // Refresh Dashboard and UI
      if (typeof renderDashboard === "function" && typeof globalData !== "undefined") {
        renderDashboard(globalData);
      }
      if (typeof renderProductionDetail === "function") {
        renderProductionDetail(orderNo);
      }
      if (typeof filterDashboardTable === "function") {
        filterDashboardTable();
      }
      if (typeof filterQueryTable === "function") {
        filterQueryTable();
      }
    }
  });
}

// 4. Render Complaints List HTML for Dashboard and BPM Form
function renderComplaintsListHtml(orderNo) {
  const complaints = getComplaintsForOrder(orderNo);
  if (!complaints || complaints.length === 0) {
    return `
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
        <i class="fa-solid fa-shield-check text-emerald-500 mr-1.5"></i> No customer complaints recorded for this order.
      </div>
    `;
  }

  return `
    <div class="space-y-2">
      ${complaints.map((c) => {
        let badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
        if (c.severity === "High") badgeColor = "bg-rose-100 text-rose-800 border-rose-300";
        if (c.severity === "Low") badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";

        return `
          <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 text-xs">
            <div class="flex items-center justify-between flex-wrap gap-1">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}">
                <i class="fa-solid fa-triangle-exclamation mr-1"></i>${c.category} (${c.severity})
              </span>
              <span class="text-[10px] font-mono text-slate-400">
                <i class="fa-solid fa-clock mr-1"></i>${c.timestamp}
              </span>
            </div>
            <p class="text-slate-700 text-xs font-medium">${c.description}</p>
            <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
              <span><i class="fa-solid fa-user-pen mr-1 text-indigo-500"></i>Recorded by: <strong class="text-slate-800 font-semibold">${c.recordedBy}</strong></span>
              <span class="font-bold text-indigo-600">${c.status}</span>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}
