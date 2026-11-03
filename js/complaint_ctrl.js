/**
 * Customer Complaint, Simulated Role Access (User/Admin) & Alert Controller
 * Green River Panels Wood Pellets Operations Dashboard
 * Enforces: Pending-Email State & Admin-Only Complaint Deletion Policy.
 * File size target: <= 400 lines (Strictly verified)
 */
const COMPLAINTS_STORAGE_KEY = "greenriver_customer_complaints_v1";
const SIM_ADMIN_STORAGE_KEY = "greenriver_sim_admin_mode";
const DEFAULT_ADMIN_EMAIL = "it.admin@greenriverpanels.com";

// Global VisionOS Glassmorphism Theme Interceptor for all SweetAlert2 dialogs across Dashboard
if (typeof Swal !== "undefined" && !Swal.__grpThemed) {
  const _origSwalFire = Swal.fire.bind(Swal);
  Swal.fire = function (...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object" && !args[0].toast) {
      const opts = { ...args[0] }, col = String(opts.confirmButtonColor || "").toLowerCase(), prev = opts.customClass || {}, prevWillClose = opts.willClose;
      const isDanger = ["#e11d48", "#ef4444", "#dc2626", "#be123c"].includes(col) || opts.icon === "error";
      const btnCls = col === "#94a3b8" ? "swal-btn-locked" : isDanger ? "swal-btn-danger" : ["#4f46e5", "#6366f1", "#4338ca"].includes(col) ? "swal-btn-indigo" : "swal-btn-emerald";
      opts.customClass = { ...prev, popup: `${prev.popup || "font-sans"} ${isDanger ? "swal-theme-danger" : "swal-theme-emerald"}`.trim(), confirmButton: `${prev.confirmButton || ""} ${btnCls}`.trim(), cancelButton: `${prev.cancelButton || ""} swal-btn-glass-cancel`.trim() };
      opts.willClose = (popup) => { if (typeof prevWillClose === "function") prevWillClose(popup); setTimeout(() => { if (popup && popup.isConnected) popup.dispatchEvent(new Event("animationend")); }, 200); };
      delete opts.confirmButtonColor; delete opts.cancelButtonColor;
      return _origSwalFire(opts);
    }
    return _origSwalFire(...args);
  };
  Swal.__grpThemed = true;
}

const showSwalAlert = (title, text, icon = "info") => typeof Swal !== "undefined" ? Swal.fire({ title: title || "Notification", text: text || "", icon, confirmButtonText: "OK" }) : alert(`${title}\n\n${text}`);
const showSwalSuccess = (t, m) => showSwalAlert(t, m, "success");
const showSwalWarning = (t, m) => showSwalAlert(t, m, "warning");
const showSwalError = (t, m) => showSwalAlert(t, m, "error");

function showSwalConfirm(title, text, onConfirm, confirmText = "Yes, Proceed", cancelText = "Cancel") {
  if (typeof Swal !== "undefined") {
    return Swal.fire({ title, text, icon: "question", showCancelButton: true, confirmButtonText, cancelButtonText })
      .then((res) => { if (res.isConfirmed && typeof onConfirm === "function") onConfirm(); });
  }
  if (confirm(`${title}\n\n${text}`) && typeof onConfirm === "function") onConfirm();
}

if (typeof window !== "undefined") {
  window.nativeAlert = window.alert;
  window.alert = (msg) => (typeof Swal !== "undefined") ? Swal.fire({ title: "Green River Panels System", text: String(msg), icon: "info", confirmButtonText: "OK" }) : window.nativeAlert(msg);
}

// ================= Storage Helpers (Auto-normalizes Legacy / Missing IDs) =================
function loadAllComplaintsFromStorage() {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    let mutated = false;
    Object.keys(parsed).forEach((ord) => {
      if (Array.isArray(parsed[ord])) {
        parsed[ord].forEach((item) => {
          if (!item || typeof item !== "object") return;
          if (!item.id || item.id === "undefined" || item.id === "null") {
            item.id = `CMP-${Math.floor(100000 + Math.random() * 900000)}`;
            mutated = true;
          } else if (typeof item.id !== "string") {
            item.id = String(item.id);
            mutated = true;
          }
        });
      }
    });
    if (mutated) localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  } catch (e) {
    console.warn("[Complaint Storage Error]", e);
    return {};
  }
}

function saveAllComplaintsToStorage(data) {
  try { localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.warn("[Complaint Save Error]", e); }
}

function getComplaintsForOrder(orderNo) {
  if (!orderNo) return [];
  const all = loadAllComplaintsFromStorage();
  return Array.isArray(all[orderNo]) ? all[orderNo] : [];
}

function findComplaintIndex(list, complaintId, fallbackIdx) {
  if (!Array.isArray(list)) return -1;
  const targetId = String(complaintId || "");
  if (targetId && targetId !== "undefined" && targetId !== "null") {
    const byId = list.findIndex((x) => x && String(x.id) === targetId);
    if (byId !== -1) return byId;
  }
  const numIdx = Number(fallbackIdx);
  if (!Number.isNaN(numIdx) && numIdx >= 0 && numIdx < list.length) return numIdx;
  return -1;
}

function formatCurrentDateTime() {
  const now = new Date(), pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// ================= Simulated User / Admin Role Engine =================
function isSimulatedAdmin() {
  return localStorage.getItem(SIM_ADMIN_STORAGE_KEY) === "1";
}

function syncAdminRoleButtons() {
  const isAdmin = isSimulatedAdmin(), $btn = $("#sim-role-toggle-btn");
  if (!$btn.length) return;
  if (isAdmin) {
    $btn.removeClass("bg-white/80 hover:bg-slate-100 text-slate-700 border-slate-200").addClass("bg-purple-600 hover:bg-purple-700 text-white border-purple-700 shadow-sm");
    $("#sim-role-icon").attr("class", "fa-solid fa-user-shield text-amber-300 mr-1.5");
    $("#sim-role-label").text("Admin (จำลอง)");
  } else {
    $btn.removeClass("bg-purple-600 hover:bg-purple-700 text-white border-purple-700 shadow-sm").addClass("bg-white/80 hover:bg-slate-100 text-slate-700 border-slate-200");
    $("#sim-role-icon").attr("class", "fa-solid fa-user text-slate-500 mr-1.5");
    $("#sim-role-label").text("User");
  }
}

function toggleSimulatedAdminRole(silent = false) {
  const nextAdmin = !isSimulatedAdmin();
  localStorage.setItem(SIM_ADMIN_STORAGE_KEY, nextAdmin ? "1" : "0");
  syncAdminRoleButtons();
  refreshComplaintViews(typeof currentSelectedOrderNo !== "undefined" ? currentSelectedOrderNo : "");
  if (!silent && typeof Swal !== "undefined") {
    Swal.fire({
      toast: true, position: "top-end", timer: 2000, showConfirmButton: false, icon: nextAdmin ? "success" : "info",
      title: nextAdmin ? "🛡️ โหมด Admin (จำลอง): เปิดปุ่มลบรายการแล้ว" : "👤 โหมด User ทั่วไป: ต้องแจ้ง Admin เพื่อขอลบ"
    });
  }
}

function executeComplaintDeletion(orderNo, complaintId, fallbackIdx) {
  const all = loadAllComplaintsFromStorage();
  if (!Array.isArray(all[orderNo])) return false;
  const idx = findComplaintIndex(all[orderNo], complaintId, fallbackIdx);
  if (idx === -1) return false;
  all[orderNo].splice(idx, 1);
  if (all[orderNo].length === 0) delete all[orderNo];
  saveAllComplaintsToStorage(all);
  if (typeof renderUnsentEmailTopBanner === "function") renderUnsentEmailTopBanner();
  refreshComplaintViews(orderNo);
  return true;
}

// User ทั่วไปกดขอลบรายการ -> ส่งอีเมลแจ้ง Admin (พร้อมปุ่มสลับเป็น Admin จำลองแล้วลบทันทีสำหรับทดสอบ)
function requestAdminDeleteComplaint(orderNo, complaintId, fallbackIdx = -1) {
  const list = getComplaintsForOrder(orderNo);
  const idx = findComplaintIndex(list, complaintId, fallbackIdx);
  if (idx === -1) return showSwalError("ไม่พบรายการ", "ไม่พบข้อร้องเรียนที่ต้องการแจ้งลบ");
  const c = list[idx];

  Swal.fire({
    title: `<span class="text-base font-bold text-slate-900"><i class="fa-solid fa-user-lock text-indigo-600 mr-2"></i>แจ้งผู้ดูแลระบบ (Admin) เพื่อขอลบรายการ</span>`,
    html: `
      <div class="text-left font-sans text-xs space-y-2.5 pt-1 text-slate-700">
        <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
          <strong>นโยบายระบบ:</strong> ผู้ใช้งานทั่วไป (User) ลบประวัติข้อร้องเรียนเองไม่ได้ กรุณาส่งคำขอแจ้ง <strong>Admin</strong> ให้เป็นผู้ลบ
        </div>
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1">
          <div>Ticket ID: <strong class="font-mono text-indigo-700">[${c.id}]</strong> (Order: <strong>${orderNo}</strong>)</div>
          <div>หัวข้อ: <strong>${c.category}</strong></div>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Admin Email *</label>
          <input type="email" id="swalReqDelAdminMail" value="${localStorage.getItem("last_admin_email") || DEFAULT_ADMIN_EMAIL}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">เหตุผลที่แจ้งขอลบ (Reason) *</label>
          <input type="text" id="swalReqDelReason" placeholder="เช่น บันทึกข้อมูลผิดออเดอร์ / บันทึกซ้ำ / ข้อมูลทดสอบ" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg" />
        </div>
        <div class="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
          <span class="text-[10px] text-slate-400">สำหรับผู้ทดสอบระบบ:</span>
          <button type="button" id="btnQuickSimAdminDelete" class="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold cursor-pointer shadow-xs">
            <i class="fa-solid fa-user-shield mr-1"></i> สลับเป็น Admin (จำลอง) แล้วลบทันที
          </button>
        </div>
      </div>`,
    width: 490, showCancelButton: true, confirmButtonColor: "#4f46e5",
    confirmButtonText: `<i class="fa-solid fa-paper-plane mr-1.5"></i> ส่งเมลแจ้ง Admin ให้ลบ`, cancelButtonText: "ปิด",
    didOpen: () => {
      $("#btnQuickSimAdminDelete").on("click", function () {
        localStorage.setItem(SIM_ADMIN_STORAGE_KEY, "1");
        syncAdminRoleButtons();
        const ok = executeComplaintDeletion(orderNo, c.id, idx);
        if (ok) showSwalSuccess("ลบรายการเรียบร้อย (Admin Mode)", `ลบเคส [${c.id}] ของออเดอร์ ${orderNo} สำเร็จแล้ว`);
      });
    },
    preConfirm: () => {
      const reason = ($("#swalReqDelReason").val() || "").trim();
      const adminMail = ($("#swalReqDelAdminMail").val() || "").trim() || DEFAULT_ADMIN_EMAIL;
      if (!reason) { Swal.showValidationMessage("กรุณาระบุเหตุผลที่ขอลบรายการ"); return false; }
      return { reason, adminMail };
    }
  }).then((res) => {
    if (res.isConfirmed && res.value) {
      localStorage.setItem("last_admin_email", res.value.adminMail);
      const subjRaw = `[Request Delete Complaint] Ticket ${c.id} - Order ${orderNo}`;
      const bodyRaw = `เรียน ผู้ดูแลระบบ (System Admin),\n\nขอความอนุเคราะห์ลบรายการบันทึกข้อร้องเรียนลูกค้า ดังนี้:\n• Ticket ID: ${c.id}\n• Order No: ${orderNo}\n• Category: ${c.category}\n• Recorded By: ${c.recordedBy}\n• เหตุผลที่ขอลบ: ${res.value.reason}\n\nขอบคุณครับ/ค่ะ`;
      const ch = typeof buildEmailChannelLinks === "function" ? buildEmailChannelLinks(res.value.adminMail, "", subjRaw, bodyRaw) : { mailtoUrl: `mailto:${res.value.adminMail}?subject=${encodeURIComponent(subjRaw)}&body=${encodeURIComponent(bodyRaw)}`, outlookWebUrl: "#", gmailUrl: "#", copyText: bodyRaw };
      Swal.fire({
        title: "เลือกช่องทางส่งอีเมลแจ้ง Admin", width: 480, showConfirmButton: true, confirmButtonText: "ปิดหน้าต่าง",
        html: `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
          <a href="${ch.mailtoUrl}" class="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center no-underline"><i class="fa-solid fa-desktop mr-2"></i>Outlook ในเครื่อง</a>
          <a href="${ch.outlookWebUrl}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center justify-center no-underline"><i class="fa-solid fa-globe mr-2"></i>Outlook Web (M365)</a>
          <a href="${ch.gmailUrl}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center no-underline"><i class="fa-solid fa-envelope mr-2"></i>Gmail (บนเว็บ)</a>
          <button type="button" onclick="if(typeof copyTextToClipboardSafe==='function') copyTextToClipboardSafe(decodeURIComponent('${encodeURIComponent(ch.copyText).replace(/'/g, "%27")}')); this.innerText='✓ คัดลอกแล้ว!';" class="py-2.5 px-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center cursor-pointer"><i class="fa-solid fa-copy mr-2"></i>คัดลอกข้อความ</button>
        </div>`
      });
    }
  });
}

// เฉพาะ Admin ลบรายการทีละเคส (รองรับทั้ง ID และลำดับ Index 100%)
function adminDeleteComplaint(orderNo, complaintId, fallbackIdx = -1) {
  if (!isSimulatedAdmin()) return requestAdminDeleteComplaint(orderNo, complaintId, fallbackIdx);
  const list = getComplaintsForOrder(orderNo);
  const idx = findComplaintIndex(list, complaintId, fallbackIdx);
  if (idx === -1) return showSwalError("ไม่พบรายการ", "ไม่พบข้อร้องเรียนที่ต้องการลบ หรือถูกลบไปแล้ว");
  const c = list[idx];

  Swal.fire({
    title: `[Admin] ยืนยันลบเคส ${c.id}?`,
    text: `ต้องการลบข้อร้องเรียน "${c.category}" ของออเดอร์ ${orderNo} ออกจากระบบใช่หรือไม่?`,
    icon: "warning", showCancelButton: true, confirmButtonColor: "#e11d48", cancelButtonColor: "#64748b",
    confirmButtonText: `<i class="fa-solid fa-trash-can mr-1.5"></i> ยืนยันลบรายการ`, cancelButtonText: "ยกเลิก",
    customClass: { popup: "rounded-2xl shadow-2xl font-sans" }
  }).then((res) => {
    if (res.isConfirmed && executeComplaintDeletion(orderNo, c.id, idx)) {
      showSwalSuccess("ลบสำเร็จ", `ลบรายการ [${c.id}] ออกจากออเดอร์ ${orderNo} เรียบร้อยแล้ว`);
    }
  });
}

function adminClearOrderComplaints(orderNo) {
  if (!isSimulatedAdmin()) return showSwalWarning("จำกัดสิทธิ์เฉพาะ Admin", "กรุณาสลับเป็นโหมด Admin ก่อนล้างข้อมูล");
  const list = getComplaintsForOrder(orderNo);
  if (!list.length) return;
  Swal.fire({
    title: `[Admin] ล้างทั้งหมด ${list.length} รายการ?`,
    text: `ยืนยันการลบข้อร้องเรียนทั้งหมดของออเดอร์ ${orderNo} ใช่หรือไม่?`,
    icon: "warning", showCancelButton: true, confirmButtonColor: "#e11d48", cancelButtonColor: "#64748b",
    confirmButtonText: "ใช่, ล้างทั้งหมด", cancelButtonText: "ยกเลิก", customClass: { popup: "rounded-2xl shadow-2xl font-sans" }
  }).then((res) => {
    if (res.isConfirmed) {
      const all = loadAllComplaintsFromStorage();
      delete all[orderNo];
      saveAllComplaintsToStorage(all);
      if (typeof renderUnsentEmailTopBanner === "function") renderUnsentEmailTopBanner();
      refreshComplaintViews(orderNo);
      showSwalSuccess("ล้างข้อมูลสำเร็จ", `ลบข้อร้องเรียนทั้งหมดของ ${orderNo} เรียบร้อยแล้ว`);
    }
  });
}

// Step 1: Sale Logs Customer Complaint
function openComplaintModal(orderNo) {
  const dataset = typeof globalData !== "undefined" ? globalData : [];
  const order = dataset.find((o) => o.orderNo === orderNo) || { orderNo, customer: "Customer", moNo: "-" };
  const lastSaleName = localStorage.getItem("last_sale_name") || "Somchai P. (Senior Sale Executive)";
  const lastSaleEmail = localStorage.getItem("last_sale_email") || "thepunk500181@gmail.com";
  const defaultQaEmail = localStorage.getItem("last_qa_email") || "thepunk500181@gmail.com";
  const currentTimestamp = formatCurrentDateTime();

  const formHtml = `
    <div class="text-left font-sans text-xs space-y-3 pt-1">
      <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
        <span>Order: <strong class="text-indigo-600 font-mono">${order.orderNo}</strong> (MO: ${order.moNo || "-"})</span>
        <span class="text-slate-500 font-medium truncate max-w-[180px]">${order.customer}</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div><label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-user-pen text-indigo-500 mr-1"></i> Recorded By (Sale) *</label><input type="text" id="swalComplaintSaleName" value="${lastSaleName}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium" /></div>
        <div><label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-at text-indigo-500 mr-1"></i> Sale Email (Reply-To) *</label><input type="email" id="swalComplaintSaleEmail" value="${lastSaleEmail}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700" /></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div><label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-envelope text-indigo-500 mr-1"></i> Notify QA Email *</label><input type="email" id="swalComplaintQaEmail" value="${defaultQaEmail}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700" /></div>
        <div><label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-gauge-high text-rose-500 mr-1"></i> Severity Level *</label><select id="swalComplaintSeverity" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold">${["Medium (Moderate - QA investigation)", "High (Critical - Claim risk)", "Low (Minor inquiry/cosmetic)"].map((s) => `<option value="${s.split(" ")[0]}">${s}</option>`).join("")}</select></div>
      </div>
      <div><label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1"></i> Complaint Category *</label><select id="swalComplaintType" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium">${["Quality (Moisture / Ash / Calorific Value)", "Packaging & Transport Damage", "Weight & Quantity Discrepancy", "Delivery Schedule Delay", "Documentation & COA / EUDR", "Other Post-Delivery Issue"].map((o) => `<option value="${o}">${o}</option>`).join("")}</select></div>
      <div><label class="block text-[11px] font-bold text-slate-700 mb-1"><i class="fa-solid fa-comment-dots text-indigo-500 mr-1"></i> Customer Complaint Description *</label><textarea id="swalComplaintDesc" rows="4" placeholder="Enter customer feedback or claim details..." class="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg min-h-[90px] leading-relaxed resize-y"></textarea></div>
      <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center"><i class="fa-solid fa-lock text-amber-600 text-sm mr-2 shrink-0"></i><span>สถานะจะถูกบันทึกเป็น <strong>รอส่งอีเมล (EMAIL_PENDING)</strong> ก่อน และจะเปลี่ยนเป็นแจ้ง QA สำเร็จเมื่อกดส่งอีเมลแล้วเท่านั้น</span></div>
    </div>`;

  Swal.fire({
    title: `<span class="text-base font-bold text-slate-900"><i class="fa-solid fa-comment-medical text-rose-600 mr-2"></i>Log Customer Complaint (Post-Delivery)</span>`,
    html: formHtml, width: 580, showCancelButton: true, confirmButtonColor: "#059669", cancelButtonColor: "#64748b",
    confirmButtonText: `<i class="fa-solid fa-paper-plane mr-1.5"></i> Save Draft & Proceed to Email`, cancelButtonText: `Cancel`, focusConfirm: false,
    customClass: { popup: "rounded-3xl shadow-2xl p-5" },
    preConfirm: () => {
      const saleName = ($("#swalComplaintSaleName").val() || "").trim(), desc = ($("#swalComplaintDesc").val() || "").trim();
      if (!saleName) { Swal.showValidationMessage("Please enter Sale Representative name."); return false; }
      if (!desc) { Swal.showValidationMessage("Please provide customer complaint details."); return false; }
      return {
        id: `CMP-${Date.now().toString().slice(-6)}`, orderNo, recordedBy: saleName,
        saleEmail: ($("#swalComplaintSaleEmail").val() || "").trim() || "thepunk500181@gmail.com",
        qaEmail: ($("#swalComplaintQaEmail").val() || "").trim() || "thepunk500181@gmail.com",
        timestamp: currentTimestamp, category: $("#swalComplaintType").val(), severity: $("#swalComplaintSeverity").val(),
        description: desc, status: "Draft (Awaiting Sale Email Dispatch)", emailStatus: "PENDING_SALE_EMAIL",
        saleEmailSentAt: null, qaOfficer: null, rootCause: null, actionTaken: null, resolvedAt: null
      };
    }
  }).then((res) => {
    if (res.isConfirmed && res.value) {
      const c = res.value;
      localStorage.setItem("last_sale_name", c.recordedBy);
      localStorage.setItem("last_sale_email", c.saleEmail);
      localStorage.setItem("last_qa_email", c.qaEmail);
      const all = loadAllComplaintsFromStorage();
      if (!Array.isArray(all[orderNo])) all[orderNo] = [];
      all[orderNo].unshift(c);
      saveAllComplaintsToStorage(all);
      if (typeof renderUnsentEmailTopBanner === "function") renderUnsentEmailTopBanner();
      refreshComplaintViews(orderNo);
      if (typeof resumePendingComplaintEmail === "function") resumePendingComplaintEmail(orderNo, c.id, 0);
    }
  });
}

// Step 2: QA Investigates, Resolves & Prepares Email
function openQaReviewModal(orderNo, complaintId, fallbackIdx = -1) {
  const list = getComplaintsForOrder(orderNo);
  const foundIdx = findComplaintIndex(list, complaintId, fallbackIdx);
  if (foundIdx === -1) return showSwalError("Error", "Complaint not found!");
  const complaint = list[foundIdx];
  const lastQaName = localStorage.getItem("last_qa_name") || "Kanchana T. (QA Senior Specialist)";
  const defaultToEmail = complaint.saleEmail || localStorage.getItem("last_sale_email") || "thepunk500181@gmail.com";
  const defaultCcEmail = localStorage.getItem("last_qa_cc_emails") || "plant.mgr@greenriverpanels.com, qa.head@greenriverpanels.com";
  const currentTimestamp = formatCurrentDateTime();

  const qaHtml = `
    <div class="text-left font-sans text-xs space-y-3 pt-1">
      <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
        <div class="flex items-center justify-between font-bold text-slate-800">
          <span>Ticket: <strong class="text-indigo-600 font-mono">${complaint.id}</strong> (Order: ${orderNo})</span>
          <span class="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 border border-rose-300 font-bold">${complaint.category} (${complaint.severity})</span>
        </div>
        <p class="text-slate-600 italic text-[11px]">"${complaint.description}"</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div><label class="block text-[11px] font-bold text-slate-700 mb-1">QA Reviewer Name *</label><input type="text" id="swalQaOfficerName" value="${complaint.qaOfficer || lastQaName}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium" /></div>
        <div><label class="block text-[11px] font-bold text-slate-700 mb-1">QA Approval Decision *</label><select id="swalQaDecision" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold"><option value="Resolved / Corrective Action Agreed" selected>Approve & Confirm Resolved (อนุมัติปิดเคส)</option><option value="Under Joint Review (Sale & QA)">Keep in Joint Review</option><option value="Pending QA Investigation">Return to Investigation</option></select></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
        <div><label class="block text-[11px] font-bold text-slate-700 mb-1">Email To: (Sale/Reporter) *</label><input type="email" id="swalQaNotifyTo" value="${complaint.resolutionTo || defaultToEmail}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700" /></div>
        <div><label class="block text-[11px] font-bold text-slate-700 mb-1">CC To: (Plant/QA Head)</label><input type="text" id="swalQaNotifyCc" value="${complaint.resolutionCc || defaultCcEmail}" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700" /></div>
      </div>
      <div><label class="block text-[11px] font-bold text-slate-700 mb-1">Root Cause Analysis (สาเหตุที่แท้จริง) *</label><textarea id="swalQaRootCause" rows="3" class="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg min-h-[75px]">${complaint.rootCause || ""}</textarea></div>
      <div><label class="block text-[11px] font-bold text-slate-700 mb-1">Corrective & Preventive Action (CAPA / มาตรการแก้ไข) *</label><textarea id="swalQaActionTaken" rows="4" class="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg min-h-[90px]">${complaint.actionTaken || ""}</textarea></div>
    </div>`;

  Swal.fire({
    title: `<span class="text-base font-bold text-slate-900"><i class="fa-solid fa-clipboard-check text-emerald-600 mr-2"></i>QA Review, Root Cause & CAPA Approval</span>`,
    html: qaHtml, width: 600, showCancelButton: true, confirmButtonColor: "#059669", cancelButtonColor: "#64748b",
    confirmButtonText: `<i class="fa-solid fa-stamp mr-1.5"></i> Save QA Draft & Proceed to Email`, cancelButtonText: `Cancel`, focusConfirm: false,
    customClass: { popup: "rounded-3xl shadow-2xl p-5" },
    preConfirm: () => {
      const qaName = ($("#swalQaOfficerName").val() || "").trim(), rc = ($("#swalQaRootCause").val() || "").trim(), capa = ($("#swalQaActionTaken").val() || "").trim();
      if (!qaName || !rc || !capa) { Swal.showValidationMessage("กรุณากรอกข้อมูลชื่อผู้ตรวจ, Root Cause และ CAPA ให้ครบถ้วน"); return false; }
      return {
        qaOfficer: qaName, qaTargetStatus: $("#swalQaDecision").val(), status: "QA Reviewed (Awaiting Email to Sale)",
        emailStatus: "PENDING_QA_EMAIL", qaReviewedAt: currentTimestamp, qaEmailSentAt: null,
        resolutionTo: ($("#swalQaNotifyTo").val() || "").trim() || defaultToEmail,
        resolutionCc: ($("#swalQaNotifyCc").val() || "").trim(), rootCause: rc, actionTaken: capa
      };
    }
  }).then((res) => {
    if (res.isConfirmed && res.value) {
      const up = res.value;
      localStorage.setItem("last_qa_name", up.qaOfficer);
      if (up.resolutionCc) localStorage.setItem("last_qa_cc_emails", up.resolutionCc);
      const all = loadAllComplaintsFromStorage();
      if (Array.isArray(all[orderNo])) {
        const idx = findComplaintIndex(all[orderNo], complaint.id, foundIdx);
        if (idx !== -1) { all[orderNo][idx] = { ...all[orderNo][idx], ...up }; saveAllComplaintsToStorage(all); }
      }
      if (typeof renderUnsentEmailTopBanner === "function") renderUnsentEmailTopBanner();
      refreshComplaintViews(orderNo);
      if (typeof resumePendingComplaintEmail === "function") resumePendingComplaintEmail(orderNo, complaint.id, foundIdx);
    }
  });
}

function refreshComplaintViews(orderNo) {
  syncAdminRoleButtons();
  const activeData = (typeof dashboardFilteredData !== "undefined" && dashboardFilteredData.length > 0)
    ? dashboardFilteredData
    : (typeof globalData !== "undefined" ? globalData : []);
  if (typeof renderDashboard === "function") renderDashboard(activeData);
  if (typeof filterQueryTable === "function") filterQueryTable();
  const activeModalOrder = (typeof currentBpmModalOrderNo !== "undefined" && currentBpmModalOrderNo) ? currentBpmModalOrderNo : orderNo;
  if (activeModalOrder && !$("#bpmModal").hasClass("hidden") && typeof openBpmModal === "function") {
    openBpmModal(activeModalOrder);
  }
}
