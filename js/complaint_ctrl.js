/**
 * Customer Complaint & SweetAlert2 Universal Controller
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: <= 400 lines (Strictly verified)
 */

const COMPLAINTS_STORAGE_KEY = "greenriver_customer_complaints_v1";

// 1. Universal SweetAlert2 Wrappers
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
  }
  alert(`${title}\n\n${text}`);
}

function showSwalSuccess(title, text) { return showSwalAlert(title, text, "success"); }
function showSwalWarning(title, text) { return showSwalAlert(title, text, "warning"); }
function showSwalError(title, text) { return showSwalAlert(title, text, "error"); }

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
      if (result.isConfirmed && typeof onConfirm === "function") onConfirm();
    });
  }
  if (confirm(`${title}\n\n${text}`) && typeof onConfirm === "function") onConfirm();
}

// Override native window.alert to route through SweetAlert2
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

// 2. Storage Helpers & Formatters
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

function formatCurrentDateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// 3. Step 1: Sale Logs Customer Complaint (Triggers Email to QA)
function openComplaintModal(orderNo) {
  const dataset = typeof globalData !== "undefined" ? globalData : [];
  const order = dataset.find((o) => o.orderNo === orderNo) || { orderNo: orderNo, customer: "Customer", moNo: "-" };
  const lastSaleName = localStorage.getItem("last_sale_name") || "Somchai P. (Senior Sale Executive)";
  const currentTimestamp = formatCurrentDateTime();

  const formHtml = `
    <div class="text-left font-sans text-xs space-y-3 pt-1">
      <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
        <span>Order: <strong class="text-indigo-600 font-mono">${order.orderNo}</strong> (MO: ${order.moNo || '-'})</span>
        <span class="text-slate-500 font-medium truncate max-w-[180px]">${order.customer}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-user-pen text-indigo-500 mr-1"></i> Recorded By (Sale) *</label>
          <input type="text" id="swalComplaintSaleName" value="${lastSaleName}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-envelope text-indigo-500 mr-1"></i> Notify QA Email *</label>
          <input type="text" id="swalComplaintQaEmail" value="qa-woodpellets@greenriverpanels.com" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-slate-700" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1"></i> Complaint Category *</label>
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
          <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-gauge-high text-rose-500 mr-1"></i> Severity Level *</label>
          <select id="swalComplaintSeverity" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-bold">
            <option value="Medium">Medium (Moderate issue - QA investigation required)</option>
            <option value="High">High (Critical - Claim risk or partial rejection)</option>
            <option value="Low">Low (Minor inquiry or cosmetic observation)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-comment-dots text-indigo-500 mr-1"></i> Customer Complaint Description *</label>
        <textarea id="swalComplaintDesc" rows="3" placeholder="Enter exact feedback or claim details received from customer after goods receipt..." class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"></textarea>
      </div>

      <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center">
        <i class="fa-solid fa-bell text-amber-500 text-sm mr-2 shrink-0"></i>
        <span>Upon saving, status will be set to <strong>Pending QA Investigation</strong> and an automated dispatch notice will be sent to QA.</span>
      </div>
    </div>
  `;

  Swal.fire({
    title: `<span class="text-base font-bold text-slate-900"><i class="fa-solid fa-comment-medical text-rose-600 mr-2"></i>Log Customer Complaint (Post-Delivery)</span>`,
    html: formHtml,
    width: 580,
    showCancelButton: true,
    confirmButtonColor: "#059669",
    cancelButtonColor: "#64748b",
    confirmButtonText: `<i class="fa-solid fa-paper-plane mr-1.5"></i> Save & Notify QA`,
    cancelButtonText: `Cancel`,
    focusConfirm: false,
    customClass: { popup: "rounded-3xl shadow-2xl p-5" },
    preConfirm: () => {
      const saleName = ($("#swalComplaintSaleName").val() || "").trim();
      const qaEmail = ($("#swalComplaintQaEmail").val() || "").trim();
      const desc = ($("#swalComplaintDesc").val() || "").trim();
      if (!saleName) { Swal.showValidationMessage("Please enter the name of the Sale Representative."); return false; }
      if (!desc) { Swal.showValidationMessage("Please provide customer complaint details."); return false; }

      return {
        id: `CMP-${Date.now().toString().slice(-6)}`,
        orderNo: orderNo,
        recordedBy: saleName,
        qaEmail: qaEmail || "qa-woodpellets@greenriverpanels.com",
        timestamp: currentTimestamp,
        category: $("#swalComplaintType").val(),
        severity: $("#swalComplaintSeverity").val(),
        description: desc,
        status: "Pending QA Investigation",
        qaOfficer: null,
        rootCause: null,
        actionTaken: null,
        resolvedAt: null
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
        "Complaint Logged & QA Notified!",
        `Complaint ticket [${complaint.id}] recorded by ${complaint.recordedBy}.\n\n📧 Notification email dispatched to QA: ${complaint.qaEmail}`
      );
      refreshComplaintViews(orderNo);
    }
  });
}

// 4. Step 2: QA Investigates, Resolves & Approves Complaint
function openQaReviewModal(orderNo, complaintId) {
  const complaints = getComplaintsForOrder(orderNo);
  const complaint = complaints.find((c) => c.id === complaintId);
  if (!complaint) return showSwalError("Error", "Complaint not found!");

  const lastQaName = localStorage.getItem("last_qa_name") || "Kanchana T. (QA Senior Specialist)";
  const currentTimestamp = formatCurrentDateTime();

  const qaHtml = `
    <div class="text-left font-sans text-xs space-y-3 pt-1">
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
        <div class="flex items-center justify-between font-bold text-slate-800">
          <span>Ticket: <strong class="text-indigo-600 font-mono">${complaint.id}</strong> (Order: ${orderNo})</span>
          <span class="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 border border-rose-300 font-bold">${complaint.category} (${complaint.severity})</span>
        </div>
        <p class="text-slate-600 italic text-[11px]">"${complaint.description}"</p>
        <div class="text-[10px] text-slate-400">Reported by: ${complaint.recordedBy} at ${complaint.timestamp}</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-user-check text-emerald-600 mr-1"></i> QA Reviewer Name *</label>
          <input type="text" id="swalQaOfficerName" value="${complaint.qaOfficer || lastQaName}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 font-medium" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-clock text-emerald-600 mr-1"></i> Action Timestamp</label>
          <input type="text" id="swalQaTimestamp" value="${currentTimestamp}" readonly class="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-600 cursor-not-allowed" />
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-magnifying-glass text-indigo-500 mr-1"></i> Root Cause Analysis (สาเหตุที่แท้จริง) *</label>
        <textarea id="swalQaRootCause" rows="2" placeholder="e.g. Dryer zone 2 temperature dropped due to thermocouple calibration..." class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500">${complaint.rootCause || ""}</textarea>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-wrench text-emerald-600 mr-1"></i> Corrective & Preventive Action (CAPA / มาตรการแก้ไข) *</label>
        <textarea id="swalQaActionTaken" rows="2" placeholder="e.g. Replaced thermocouple sensor, re-tested moisture (6.4%), updated SOP..." class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500">${complaint.actionTaken || ""}</textarea>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-stamp text-emerald-600 mr-1"></i> QA Approval Decision *</label>
        <select id="swalQaDecision" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 font-bold">
          <option value="Resolved / Corrective Action Agreed" selected>Approve & Confirm Resolved (อนุมัติปิดเคส)</option>
          <option value="Under Joint Review (Sale & QA)">Keep in Joint Review (กำลังอยู่ระหว่างตรวจสอบร่วม)</option>
          <option value="Pending QA Investigation">Return to Investigation (ยังไม่เรียบร้อย)</option>
        </select>
      </div>
    </div>
  `;

  Swal.fire({
    title: `<span class="text-base font-bold text-slate-900"><i class="fa-solid fa-clipboard-check text-emerald-600 mr-2"></i>QA Investigation & Case Approval</span>`,
    html: qaHtml,
    width: 600,
    showCancelButton: true,
    confirmButtonColor: "#059669",
    cancelButtonColor: "#64748b",
    confirmButtonText: `<i class="fa-solid fa-circle-check mr-1.5"></i> Confirm QA Approval`,
    cancelButtonText: `Cancel`,
    focusConfirm: false,
    customClass: { popup: "rounded-3xl shadow-2xl p-5" },
    preConfirm: () => {
      const qaOfficer = ($("#swalQaOfficerName").val() || "").trim();
      const rootCause = ($("#swalQaRootCause").val() || "").trim();
      const actionTaken = ($("#swalQaActionTaken").val() || "").trim();
      if (!qaOfficer) { Swal.showValidationMessage("Please enter QA Officer name."); return false; }
      if (!rootCause) { Swal.showValidationMessage("Please enter Root Cause Analysis."); return false; }
      if (!actionTaken) { Swal.showValidationMessage("Please provide Corrective & Preventive Action."); return false; }

      return {
        qaOfficer: qaOfficer,
        rootCause: rootCause,
        actionTaken: actionTaken,
        status: $("#swalQaDecision").val(),
        resolvedAt: $("#swalQaTimestamp").val() || currentTimestamp
      };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const updateData = result.value;
      localStorage.setItem("last_qa_name", updateData.qaOfficer);

      const all = loadAllComplaintsFromStorage();
      if (Array.isArray(all[orderNo])) {
        const idx = all[orderNo].findIndex((c) => c.id === complaintId);
        if (idx !== -1) {
          all[orderNo][idx] = { ...all[orderNo][idx], ...updateData };
          saveAllComplaintsToStorage(all);
        }
      }

      showSwalSuccess(
        "QA Approval Recorded Successfully!",
        `Complaint [${complaintId}] has been approved by ${updateData.qaOfficer}.\n\n📧 Confirmation dispatch sent back to Sale (${complaint.recordedBy}).`
      );
      refreshComplaintViews(orderNo);
    }
  });
}

function refreshComplaintViews(orderNo) {
  if (typeof renderDashboard === "function" && typeof globalData !== "undefined") renderDashboard(globalData);
  if (typeof renderProductionDetail === "function") renderProductionDetail(orderNo);
  if (typeof filterDashboardTable === "function") filterDashboardTable();
  if (typeof filterQueryTable === "function") filterQueryTable();
}

// 5. Render Complaints List HTML for Dashboard Step 8 & Modals
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
    <div class="space-y-2.5">
      ${complaints.map((c) => {
        let badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
        if (c.severity === "High") badgeColor = "bg-rose-100 text-rose-800 border-rose-300";
        if (c.severity === "Low") badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";

        const isResolved = c.status && c.status.toLowerCase().includes("resolved");

        return `
          <div class="p-3 bg-white rounded-xl border ${isResolved ? 'border-emerald-200 shadow-2xs' : 'border-amber-300 shadow-sm'} space-y-2 text-xs">
            <div class="flex items-center justify-between flex-wrap gap-1">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}">
                <i class="fa-solid fa-triangle-exclamation mr-1"></i>${c.category} (${c.severity})
              </span>
              <span class="text-[10px] font-mono text-slate-400">
                <i class="fa-solid fa-clock mr-1"></i>${c.timestamp}
              </span>
            </div>
            
            <p class="text-slate-800 text-xs font-medium leading-relaxed">${c.description}</p>
            
            <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
              <span><i class="fa-solid fa-user-pen mr-1 text-indigo-500"></i>Sale: <strong class="text-slate-800 font-semibold">${c.recordedBy}</strong></span>
              <span class="font-bold ${isResolved ? 'text-emerald-600' : 'text-amber-600'}">
                <i class="fa-solid ${isResolved ? 'fa-circle-check text-emerald-500' : 'fa-hourglass-half text-amber-500 animate-pulse'} mr-1"></i>${c.status}
              </span>
            </div>

            ${isResolved && c.qaOfficer ? `
              <div class="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-[11px] text-emerald-950 space-y-1 mt-1">
                <div class="flex items-center justify-between text-emerald-800 font-bold text-[10px]">
                  <span><i class="fa-solid fa-certificate text-emerald-600 mr-1"></i>QA Resolution & Approval</span>
                  <span class="text-slate-400 font-normal font-mono">${c.resolvedAt || '-'}</span>
                </div>
                <div><span class="font-semibold text-emerald-900">Root Cause:</span> ${c.rootCause || '-'}</div>
                <div><span class="font-semibold text-emerald-900">Corrective Action (CAPA):</span> ${c.actionTaken || '-'}</div>
                <div class="flex items-center justify-between pt-1 border-t border-emerald-200/60 text-[10px] text-slate-500">
                  <span>Approved by QA: <strong class="text-emerald-800 font-bold">${c.qaOfficer}</strong></span>
                  <button onclick="openQaReviewModal('${orderNo}', '${c.id}')" class="text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer">Edit QA CAPA</button>
                </div>
              </div>
            ` : `
              <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[10px] text-amber-700 italic"><i class="fa-solid fa-bell text-amber-500 mr-1"></i>Awaiting QA review & CAPA input</span>
                <button onclick="openQaReviewModal('${orderNo}', '${c.id}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center transition cursor-pointer">
                  <i class="fa-solid fa-clipboard-check mr-1.5"></i> QA Review & Approve
                </button>
              </div>
            `}
          </div>
        `;
      }).join("")}
    </div>
  `;
}
