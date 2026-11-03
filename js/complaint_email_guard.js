/**
 * Customer Complaint Pending-Email State Guard, Multi-Channel Mailer & List Renderer
 * Enforces: Status NEVER transitions to Notified/Resolved until email is confirmed sent.
 * Supports 4 Email Channels (Outlook App, Outlook Web M365, Gmail Web, Copy to Clipboard) for GitHub Pages & Local.
 * File size target: <= 400 lines (Strictly verified)
 */

function hasPendingComplaintEmail(c) {
  return c && (c.emailStatus === "PENDING_SALE_EMAIL" || c.emailStatus === "PENDING_QA_EMAIL");
}

function getPendingEmailsForOrder(orderNo) {
  return getComplaintsForOrder(orderNo).filter(hasPendingComplaintEmail);
}

function buildEmailChannelLinks(to, cc, subjectRaw, bodyRaw) {
  const safeTo = (to || "").trim();
  const safeCc = (cc || "").trim();
  const encTo = encodeURIComponent(safeTo);
  const encSubj = encodeURIComponent(subjectRaw);
  const encBodyFull = encodeURIComponent(bodyRaw);
  // ป้องกันความยาว URL mailto: ทะลุขีดจำกัด ~2,000 ตัวอักษรของ Windows Desktop
  const shortBodyRaw = encBodyFull.length > 1350 ? (bodyRaw.slice(0, 420) + "\n\n[...ดูรายละเอียดฉบับเต็มในระบบ Wood Pellets Dashboard]") : bodyRaw;
  let mailtoUrl = `mailto:${safeTo}?subject=${encSubj}&body=${encodeURIComponent(shortBodyRaw)}`;
  if (safeCc) mailtoUrl += `&cc=${encodeURIComponent(safeCc)}`;

  const outlookWebUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encTo}${safeCc ? `&cc=${encodeURIComponent(safeCc)}` : ""}&subject=${encSubj}&body=${encBodyFull}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encTo}${safeCc ? `&cc=${encodeURIComponent(safeCc)}` : ""}&su=${encSubj}&body=${encBodyFull}`;
  const copyText = `To: ${safeTo}${safeCc ? `\nCC: ${safeCc}` : ""}\nSubject: ${subjectRaw}\n\n${bodyRaw}`;
  return { mailtoUrl, outlookWebUrl, gmailUrl, copyText };
}

function buildComplaintEmailChannels(order, c, isQaPhase) {
  if (isQaPhase) {
    const targetDecision = c.qaTargetStatus || c.status || "Resolved / Corrective Action Agreed";
    const isResolved = targetDecision.includes("Resolved");
    const subj = `[${isResolved ? "RESOLVED & APPROVED" : "QA UPDATE"}] Customer Complaint Resolution - Order ${c.orderNo || order.orderNo} (${c.category})`;
    const body =
      `Dear Sale Representative & Operations Team,\n\nThe customer complaint for Order ${c.orderNo || order.orderNo} has been REVIEWED and APPROVED by QA.\n\n` +
      `• Ticket ID: ${c.id}\n• Order No: ${c.orderNo || order.orderNo} (Customer: ${(order && order.customer) || "Customer"})\n` +
      `• Category: ${c.category} (${c.severity})\n• QA Approver: ${c.qaOfficer}\n` +
      `• Decision: ${targetDecision}\n• Reviewed Time: ${c.qaReviewedAt || c.resolvedAt || "-"}\n\n` +
      `[1] Root Cause Analysis:\n"${c.rootCause || "-"}"\n\n[2] Corrective & Preventive Action (CAPA):\n"${c.actionTaken || "-"}"\n\n` +
      `Regards,\n${c.qaOfficer}\nQuality Assurance Division, Green River Panels`;
    return buildEmailChannelLinks(c.resolutionTo, c.resolutionCc, subj, body);
  }
  const subj = `[URGENT] Customer Complaint - Order ${c.orderNo || order.orderNo} (${c.category})`;
  const body =
    `Dear QA Quality Assurance Team,\n\nA customer complaint has been logged by Sale: ${c.recordedBy}\n\n` +
    `• Ticket ID: ${c.id}\n• Order No: ${c.orderNo || order.orderNo}\n• Customer: ${(order && order.customer) || "Customer"}\n` +
    `• Category: ${c.category}\n• Severity: ${c.severity}\n• Recorded Time: ${c.timestamp}\n` +
    `• Reported By: ${c.recordedBy} (${c.saleEmail})\n\nComplaint Details:\n"${c.description}"\n\n` +
    `Please investigate, input Root Cause & CAPA, and Approve in the Wood Pellets Dashboard.\n\nRegards,\n${c.recordedBy}\nSales Division, Green River Panels`;
  return buildEmailChannelLinks(c.qaEmail, "", subj, body);
}

function copyTextToClipboardSafe(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).catch(() => fallbackExecCopy(text));
  }
  return Promise.resolve(fallbackExecCopy(text));
}

function fallbackExecCopy(text) {
  const ta = Object.assign(document.createElement("textarea"), { value: text });
  ta.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand("copy"); } catch (e) { console.warn(e); }
  document.body.removeChild(ta);
}

function markMailClientOpenedInStorage(orderNo, complaintId, fallbackIdx = -1) {
  const all = loadAllComplaintsFromStorage();
  if (!Array.isArray(all[orderNo])) return;
  const idx = findComplaintIndex(all[orderNo], complaintId, fallbackIdx);
  if (idx !== -1) { all[orderNo][idx].mailClientOpened = true; saveAllComplaintsToStorage(all); }
}

function markComplaintEmailDispatched(orderNo, complaintId, phase, fallbackIdx = -1) {
  const all = loadAllComplaintsFromStorage();
  if (!Array.isArray(all[orderNo])) return;
  const idx = findComplaintIndex(all[orderNo], complaintId, fallbackIdx);
  if (idx === -1) return;

  const nowStr = formatCurrentDateTime();
  const item = all[orderNo][idx];
  item.mailClientOpened = false;
  if (phase === "QA") {
    item.emailStatus = "SENT";
    item.qaEmailSentAt = nowStr;
    item.resolvedAt = nowStr;
    item.status = item.qaTargetStatus || "Resolved / Corrective Action Agreed";
  } else {
    item.emailStatus = "SENT";
    item.saleEmailSentAt = nowStr;
    item.status = "Pending QA Investigation";
  }
  all[orderNo][idx] = item;
  saveAllComplaintsToStorage(all);
  renderUnsentEmailTopBanner();
  refreshComplaintViews(orderNo);
}

function discardUnsentComplaintDraft(orderNo, complaintId, fallbackIdx = -1, fromModal = false) {
  Swal.fire({
    title: "ยกเลิกร่างที่ยังไม่ได้ส่งอีเมล?",
    text: "หากยืนยัน รายการร่างที่ยังไม่ได้ส่งอีเมลนี้จะถูกลบออก (หรือย้อนกลับสถานะก่อนหน้า)",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48",
    cancelButtonColor: "#64748b",
    confirmButtonText: `<i class="fa-solid fa-trash-can mr-1.5"></i> ใช่, ลบร่างที่ค้าง`,
    cancelButtonText: fromModal ? "กลับไปหน้าส่งอีเมล" : "ปิด",
    customClass: { popup: "rounded-2xl shadow-2xl font-sans" }
  }).then((res) => {
    if (res.isConfirmed) {
      const all = loadAllComplaintsFromStorage();
      if (!Array.isArray(all[orderNo])) return;
      const idx = findComplaintIndex(all[orderNo], complaintId, fallbackIdx);
      if (idx === -1) return;
      const item = all[orderNo][idx];
      if (item.emailStatus === "PENDING_QA_EMAIL") {
        item.emailStatus = "SENT";
        item.status = "Pending QA Investigation";
        item.mailClientOpened = false;
      } else {
        all[orderNo].splice(idx, 1);
        if (all[orderNo].length === 0) delete all[orderNo];
      }
      saveAllComplaintsToStorage(all);
      renderUnsentEmailTopBanner();
      refreshComplaintViews(orderNo);
      showSwalSuccess("ยกเลิกร่างสำเร็จ", `ลบร่างที่ค้างส่งอีเมลของออเดอร์ ${orderNo} เรียบร้อยแล้ว`);
    } else if (fromModal) {
      resumePendingComplaintEmail(orderNo, complaintId, fallbackIdx);
    }
  });
}

// หน้าต่างบังคับส่งอีเมล 2 จังหวะ พร้อมตัวเลือกช่องทางส่งอีเมล 4 ช่องทาง (รองรับทั้ง GitHub Pages, Webmail และ Desktop)
function resumePendingComplaintEmail(orderNo, complaintId, fallbackIdx = -1) {
  const complaints = getComplaintsForOrder(orderNo);
  const idx = findComplaintIndex(complaints, complaintId, fallbackIdx);
  if (idx === -1) return;
  const c = complaints[idx];

  const dataset = typeof globalData !== "undefined" ? globalData : [];
  const order = dataset.find((o) => o.orderNo === orderNo) || { orderNo, customer: "Customer" };
  const isQaPhase = c.emailStatus === "PENDING_QA_EMAIL";
  const isTh = (typeof currentLang === "undefined" || currentLang === "th");

  const ch = buildComplaintEmailChannels(order, c, isQaPhase);
  const titleText = isQaPhase
    ? (isTh ? "บันทึกผล QA ไว้ชั่วคราว — เลือกช่องทางส่งอีเมล" : "QA Draft Saved — Choose Email Channel")
    : (isTh ? "บันทึกข้อความไว้ชั่วคราว — เลือกช่องทางส่งอีเมลแจ้ง QA" : "Draft Saved — Choose Email Channel to Notify QA");
  const targetStatusLabel = isQaPhase ? (c.qaTargetStatus || "Resolved / Corrective Action Agreed") : "Pending QA Investigation";
  const recipientEmail = isQaPhase ? `${c.resolutionTo}${c.resolutionCc ? ` (CC: ${c.resolutionCc})` : ""}` : c.qaEmail;
  const senderDisplay = isQaPhase ? c.qaOfficer : `${c.recordedBy} (${c.saleEmail})`;

  Swal.fire({
    html: `
      <div class="text-left font-sans text-xs space-y-3 pt-1 text-slate-700">
        <div class="text-center pb-0.5">
          <div class="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 text-amber-600 mb-1.5">
            <i class="fa-solid fa-envelope-open-text text-xl"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900">${titleText}</h3>
        </div>
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
          <div class="flex justify-between"><span><span class="text-slate-400">Ticket:</span> <strong class="font-mono text-indigo-700">[${c.id}]</strong></span><span class="font-mono text-slate-500">Order: ${orderNo}</span></div>
          <div><span class="text-slate-400">${isQaPhase ? "To (Sale):" : "To (QA):"}</span> <strong class="text-indigo-600 font-mono">${recipientEmail}</strong></div>
          <div><span class="text-slate-400">Sender:</span> <strong class="text-slate-800">${senderDisplay}</strong></div>
          <div class="pt-1 border-t border-slate-200 flex items-center justify-between">
            <span class="text-slate-500 font-semibold">${isTh ? "สถานะปัจจุบัน:" : "Current State:"}</span>
            <span id="modalLiveStateBadge" class="px-2 py-0.5 rounded text-[10px] bg-rose-600 text-white font-bold">⚠️ ${isTh ? "รอส่งอีเมล (EMAIL_PENDING)" : "EMAIL_PENDING"}</span>
          </div>
        </div>
        <div class="space-y-2 pt-0.5">
          <div class="text-[11px] font-bold text-slate-800 flex items-center">
            <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] mr-1.5 shrink-0">1</span>
            <span>${isTh ? "ขั้นตอนที่ 1: เลือกช่องทางส่งอีเมลที่คุณสะดวก (คลิก 1 ปุ่ม)" : "Step 1: Choose an email channel to send"}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a id="btnMailChDesktop" href="${ch.mailtoUrl}" class="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold transition shadow-sm flex items-center justify-center no-underline cursor-pointer">
              <i class="fa-solid fa-desktop mr-2"></i>${isTh ? "Outlook ในเครื่อง (App)" : "Outlook Desktop App"}
            </a>
            <a id="btnMailChM365" href="${ch.outlookWebUrl}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-[11px] font-bold transition shadow-sm flex items-center justify-center no-underline cursor-pointer">
              <i class="fa-solid fa-globe mr-2"></i>${isTh ? "Outlook Web (Office 365)" : "Outlook Web (M365)"}
            </a>
            <a id="btnMailChGmail" href="${ch.gmailUrl}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold transition shadow-sm flex items-center justify-center no-underline cursor-pointer">
              <i class="fa-solid fa-envelope mr-2"></i>${isTh ? "Gmail (เปิดบนเว็บ)" : "Gmail (Web Browser)"}
            </a>
            <button type="button" id="btnMailChCopy" class="py-2.5 px-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition shadow-sm flex items-center justify-center cursor-pointer">
              <i class="fa-solid fa-copy mr-2"></i><span id="btnMailChCopyLabel">${isTh ? "คัดลอกเนื้อหาอีเมล" : "Copy Email Content"}</span>
            </button>
          </div>
        </div>
        <div id="enforcedMailStatusText" class="text-center text-[11px] text-rose-600 font-semibold pt-0.5"></div>
        <div class="text-center pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <button type="button" onclick="discardUnsentComplaintDraft('${orderNo}', '${c.id}', ${idx}, true)" class="text-rose-500 hover:text-rose-700 font-semibold underline cursor-pointer">
            <i class="fa-solid fa-trash-can mr-1"></i>${isTh ? "ยกเลิก / ลบร่างนี้" : "Discard Draft"}
          </button>
          <button type="button" id="btnManualUnlockAlreadySent" class="text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer">
            ${isTh ? "ส่งอีเมลไปแล้วก่อนหน้านี้? คลิกปลดล็อกปุ่มปิดทันที" : "Already sent the email? Click here to unlock"}
          </button>
        </div>
      </div>`,
    width: 560, showConfirmButton: true,
    confirmButtonText: `<i class="fa-solid fa-lock mr-1.5"></i> ${isTh ? "2. ยืนยันส่งเมลแล้ว (กรุณาเลือกช่องทางในข้อ 1 ก่อน)" : "2. Email Sent — Close (Select Step 1 first)"}`,
    confirmButtonColor: "#94a3b8", allowOutsideClick: false, allowEscapeKey: false,
    customClass: { popup: "rounded-3xl shadow-2xl p-5" },
    didOpen: () => {
      const confirmBtn = Swal.getConfirmButton();
      const unlockStep2Button = (viaLabel) => {
        confirmBtn.disabled = false;
        confirmBtn.style.cursor = "pointer";
        confirmBtn.style.opacity = "1";
        if (confirmBtn.classList) {
          confirmBtn.classList.remove("swal-btn-locked");
          confirmBtn.classList.add("swal-btn-emerald");
        }
        confirmBtn.innerHTML = `<i class="fa-solid fa-circle-check mr-1.5"></i> ${isTh ? "2. ส่งอีเมลเรียบร้อยแล้ว — ปิดและอัปเดตสถานะ" : "2. Email Sent — Close & Update Status"}`;
        $("#modalLiveStateBadge").removeClass("bg-rose-600").addClass("bg-emerald-600").html(`✓ ${isTh ? "พร้อมเปลี่ยนเป็น: " : "Ready: "}${targetStatusLabel}`);
        const viaNote = viaLabel ? ` (${viaLabel})` : "";
        $("#enforcedMailStatusText").html(`<span class="text-emerald-700 font-bold"><i class="fa-solid fa-circle-check mr-1"></i> ${isTh ? `เปิดช่องทางส่งเมลแล้ว${viaNote} — เมื่อกด Send เสร็จ คลิกปุ่มสีเขียวด้านล่างได้เลย!` : `Channel ready${viaNote} — Once sent, click the green button below!`}</span>`);
      };

      if (c.mailClientOpened) {
        unlockStep2Button("");
      } else {
        confirmBtn.disabled = true;
        confirmBtn.style.cursor = "not-allowed";
        confirmBtn.style.opacity = "0.45";
        $("#enforcedMailStatusText").html(`<i class="fa-solid fa-lock mr-1"></i> ${isTh ? "ปุ่มยืนยันถูกล็อกอยู่ — กรุณาคลิกเลือกช่องทางส่งอีเมลในข้อ 1 ก่อน" : "Locked — Please select an email channel in Step 1 first"}`);
      }

      $("#btnMailChDesktop").on("click", () => { markMailClientOpenedInStorage(orderNo, c.id, idx); unlockStep2Button("Outlook App"); });
      $("#btnMailChM365").on("click", () => { markMailClientOpenedInStorage(orderNo, c.id, idx); unlockStep2Button("Outlook Web"); });
      $("#btnMailChGmail").on("click", () => { markMailClientOpenedInStorage(orderNo, c.id, idx); unlockStep2Button("Gmail Web"); });
      $("#btnMailChCopy").on("click", () => {
        copyTextToClipboardSafe(ch.copyText).then(() => {
          markMailClientOpenedInStorage(orderNo, c.id, idx);
          $("#btnMailChCopy").removeClass("bg-slate-700 hover:bg-slate-800").addClass("bg-emerald-600 hover:bg-emerald-700");
          $("#btnMailChCopyLabel").text(isTh ? "คัดลอกแล้ว! (นำไปวางส่งได้)" : "Copied to Clipboard!");
          unlockStep2Button(isTh ? "คัดลอกข้อความ" : "Clipboard");
        });
      });
      $("#btnManualUnlockAlreadySent").on("click", () => { markMailClientOpenedInStorage(orderNo, c.id, idx); unlockStep2Button(""); });
    }
  }).then((res) => {
    if (res.isConfirmed) markComplaintEmailDispatched(orderNo, c.id, isQaPhase ? "QA" : "SALE", idx);
  });
}

function resumeFirstPendingEmail(orderNo) {
  const pending = getPendingEmailsForOrder(orderNo);
  if (pending.length > 0) resumePendingComplaintEmail(orderNo, pending[0].id);
}

function renderUnsentEmailTopBanner() {
  const all = loadAllComplaintsFromStorage();
  const pendingItems = [];
  Object.keys(all).forEach((ordNo) => {
    if (Array.isArray(all[ordNo])) {
      all[ordNo].forEach((c, idx) => {
        if (hasPendingComplaintEmail(c)) pendingItems.push({ orderNo: ordNo, complaint: c, idx });
      });
    }
  });

  $("#unsentComplaintGlobalBanner").remove();
  if (pendingItems.length === 0) return pendingItems;

  const first = pendingItems[0];
  const isTh = (typeof currentLang === "undefined" || currentLang === "th");
  const bannerHtml = `
    <div id="unsentComplaintGlobalBanner" class="no-print sticky top-0 z-50 bg-rose-600 text-white px-4 py-2.5 shadow-lg flex flex-wrap items-center justify-between gap-2 text-xs">
      <div class="flex items-center space-x-2">
        <i class="fa-solid fa-bell text-amber-300 animate-bounce text-sm"></i>
        <span>
          <strong>${isTh ? `พบรายการรอส่ง/ยืนยันอีเมล ${pendingItems.length} รายการ!` : `${pendingItems.length} Pending Email Confirmation(s)!`}</strong>
          (Order ${first.orderNo} [${first.complaint.id}])
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button type="button" onclick="discardUnsentComplaintDraft('${first.orderNo}', '${first.complaint.id}', ${first.idx})" class="px-2.5 py-1 bg-rose-800/80 hover:bg-rose-900 text-rose-100 font-semibold rounded-lg cursor-pointer transition">
          <i class="fa-solid fa-trash-can mr-1"></i> ${isTh ? "ยกเลิกร่าง" : "Discard"}
        </button>
        <button type="button" onclick="markComplaintEmailDispatched('${first.orderNo}', '${first.complaint.id}', '${first.complaint.emailStatus === 'PENDING_QA_EMAIL' ? 'QA' : 'SALE'}', ${first.idx})" class="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-xs cursor-pointer transition">
          <i class="fa-solid fa-check mr-1"></i> ${isTh ? "ส่งเมลไปแล้ว (กดยืนยันจบงาน)" : "Already Sent (Confirm)"}
        </button>
        <button type="button" onclick="resumePendingComplaintEmail('${first.orderNo}', '${first.complaint.id}', ${first.idx})" class="px-3 py-1 bg-white text-rose-700 hover:bg-amber-100 font-bold rounded-lg shadow-xs cursor-pointer transition">
          <i class="fa-solid fa-paper-plane mr-1"></i> ${isTh ? "เปิดหน้าต่างส่งเมล" : "Open Email Modal"}
        </button>
      </div>
    </div>`;
  $("body").prepend(bannerHtml);
  return pendingItems;
}

function checkUnsentComplaintEmailsOnLoad() {
  const pendingItems = renderUnsentEmailTopBanner();
  if (pendingItems.length > 0) {
    const first = pendingItems[0];
    setTimeout(() => { resumePendingComplaintEmail(first.orderNo, first.complaint.id, first.idx); }, 450);
  }
}

function renderComplaintsListHtml(orderNo) {
  const complaints = getComplaintsForOrder(orderNo);
  const isAdmin = typeof isSimulatedAdmin === "function" && isSimulatedAdmin();
  if (!complaints || complaints.length === 0) {
    return `<div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-400 text-xs"><i class="fa-solid fa-shield-check text-emerald-500 mr-1.5"></i> No customer complaints recorded for this order.</div>`;
  }

  return `
    <div class="mb-2 px-2.5 py-1.5 rounded-lg border ${isAdmin ? "bg-purple-50 border-purple-200 text-purple-900" : "bg-slate-50 border-slate-200 text-slate-600"} flex items-center justify-between flex-wrap gap-1.5 text-[11px]">
      <div class="flex items-center space-x-1.5">
        <i class="fa-solid ${isAdmin ? "fa-user-shield text-purple-600" : "fa-lock text-slate-400"}"></i>
        <span>${isAdmin ? "<strong>โหมด Admin (จำลอง):</strong> สามารถลบรายการข้อร้องเรียนได้ทันที" : "<strong>สิทธิ์ User ทั่วไป:</strong> ลบประวัติเองไม่ได้ (กด <strong>แจ้ง Admin ขอลบ</strong> หรือสลับเป็น Admin จำลอง)"}</span>
      </div>
      <div class="flex items-center space-x-1.5">
        ${isAdmin ? `<button type="button" onclick="event.stopPropagation(); adminClearOrderComplaints('${orderNo}');" class="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[10px] cursor-pointer shadow-2xs"><i class="fa-solid fa-broom mr-1"></i>ล้างทั้งหมด (${complaints.length})</button>` : ""}
        <button type="button" onclick="event.stopPropagation(); toggleSimulatedAdminRole();" class="px-2 py-0.5 ${isAdmin ? "bg-white text-purple-700 border border-purple-300" : "bg-purple-600 hover:bg-purple-700 text-white"} rounded font-semibold text-[10px] cursor-pointer transition">
          <i class="fa-solid fa-repeat mr-1"></i>${isAdmin ? "สลับกลับเป็น User" : "จำลองเป็น Admin"}
        </button>
      </div>
    </div>
    <div class="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
      ${complaints.map((c, idx) => {
        const isPendingMail = hasPendingComplaintEmail(c);
        const isResolved = !isPendingMail && c.status && c.status.toLowerCase().includes("resolved");
        let sevBadge = "bg-amber-100 text-amber-800 border-amber-300";
        if (c.severity === "High") sevBadge = "bg-rose-100 text-rose-800 border-rose-300";
        if (c.severity === "Low") sevBadge = "bg-emerald-100 text-emerald-800 border-emerald-300";
        const roleActionBtn = isAdmin
          ? `<button type="button" onclick="event.stopPropagation(); adminDeleteComplaint('${orderNo}', '${c.id}', ${idx});" title="ลบรายการนี้ (เฉพาะ Admin)" class="px-2 py-0.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 rounded text-[10px] font-bold transition cursor-pointer"><i class="fa-solid fa-trash-can mr-1"></i>ลบ (Admin)</button>`
          : `<button type="button" onclick="event.stopPropagation(); requestAdminDeleteComplaint('${orderNo}', '${c.id}', ${idx});" title="แจ้ง Admin ให้ลบรายการนี้" class="px-2 py-0.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 rounded text-[10px] font-medium transition cursor-pointer"><i class="fa-solid fa-user-lock mr-1"></i>แจ้ง Admin ขอลบ</button>`;

        return `
          <div class="p-3 bg-white rounded-xl border ${isPendingMail ? "border-2 border-rose-400 bg-rose-50/30 shadow-sm" : (isResolved ? "border-emerald-200 shadow-2xs" : "border-amber-300 shadow-sm")} space-y-2 text-xs">
            <div class="flex items-center justify-between flex-wrap gap-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">[${c.id}]</span>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${sevBadge}"><i class="fa-solid fa-triangle-exclamation mr-1"></i>${c.category} (${c.severity})</span>
                ${isPendingMail ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white animate-pulse"><i class="fa-solid fa-envelope mr-1"></i>รอส่ง/ยืนยันอีเมล</span>` : ""}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-mono text-slate-400"><i class="fa-solid fa-clock mr-1"></i>${c.timestamp}</span>
                ${roleActionBtn}
              </div>
            </div>
            <p class="text-slate-800 text-xs font-medium leading-relaxed">${c.description}</p>
            <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 flex-wrap gap-1">
              <span><i class="fa-solid fa-user-pen mr-1 text-indigo-500"></i>Sale: <strong class="text-slate-800 font-semibold">${c.recordedBy}</strong> ${c.saleEmailSentAt ? `<span class="text-emerald-600 font-semibold ml-1">(✉️ ส่งเมลแล้ว ${c.saleEmailSentAt})</span>` : ""}</span>
              <span class="font-bold ${isPendingMail ? "text-rose-600" : (isResolved ? "text-emerald-600" : "text-amber-600")}">
                <i class="fa-solid ${isPendingMail ? "fa-lock" : (isResolved ? "fa-circle-check" : "fa-hourglass-half")} mr-1"></i>${c.status}
              </span>
            </div>
            ${isPendingMail ? `
              <div class="p-2.5 bg-rose-100/80 border border-rose-300 rounded-lg flex items-center justify-between flex-wrap gap-2">
                <span class="text-[11px] font-bold text-rose-900"><i class="fa-solid fa-circle-exclamation mr-1 text-rose-600"></i>สถานะยังไม่เปลี่ยนจนกว่าจะยืนยันการส่งอีเมล</span>
                <div class="flex items-center gap-1.5">
                  <button type="button" onclick="event.stopPropagation(); discardUnsentComplaintDraft('${orderNo}', '${c.id}', ${idx});" class="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 rounded-lg text-[10px] font-bold cursor-pointer"><i class="fa-solid fa-trash-can mr-1"></i>ยกเลิกร่าง</button>
                  <button type="button" onclick="event.stopPropagation(); markComplaintEmailDispatched('${orderNo}', '${c.id}', '${c.emailStatus === 'PENDING_QA_EMAIL' ? 'QA' : 'SALE'}', ${idx});" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs cursor-pointer"><i class="fa-solid fa-check mr-1"></i> ส่งเมลไปแล้ว (ยืนยัน)</button>
                  <button type="button" onclick="event.stopPropagation(); resumePendingComplaintEmail('${orderNo}', '${c.id}', ${idx});" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center cursor-pointer"><i class="fa-solid fa-paper-plane mr-1.5"></i> เลือกส่งเมล</button>
                </div>
              </div>
            ` : isResolved && c.qaOfficer ? `
              <div class="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-[11px] text-emerald-950 space-y-1 mt-1">
                <div class="flex items-center justify-between text-emerald-800 font-bold text-[10px]">
                  <span><i class="fa-solid fa-certificate text-emerald-600 mr-1"></i>QA Resolution & Approval (Closed)</span>
                  <span class="text-emerald-700 font-mono">${c.qaEmailSentAt ? `✉️ ส่งเมลแจ้งผลแล้ว ${c.qaEmailSentAt}` : (c.resolvedAt || "-")}</span>
                </div>
                <div><span class="font-semibold text-emerald-900">Root Cause:</span> ${c.rootCause || "-"}</div>
                <div><span class="font-semibold text-emerald-900">Corrective Action (CAPA):</span> ${c.actionTaken || "-"}</div>
                <div class="flex items-center justify-between pt-1 border-t border-emerald-200/60 text-[10px] text-slate-500">
                  <span>Approved by QA: <strong class="text-emerald-800 font-bold">${c.qaOfficer}</strong></span>
                  <button type="button" onclick="event.stopPropagation(); openQaReviewModal('${orderNo}', '${c.id}', ${idx});" class="text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer">Edit QA CAPA / Resend</button>
                </div>
              </div>
            ` : `
              <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[10px] text-amber-700 italic"><i class="fa-solid fa-bell text-amber-500 mr-1"></i>Awaiting QA review & CAPA input</span>
                <button type="button" onclick="event.stopPropagation(); openQaReviewModal('${orderNo}', '${c.id}', ${idx});" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center transition cursor-pointer">
                  <i class="fa-solid fa-clipboard-check mr-1.5"></i> QA Review & Approve
                </button>
              </div>
            `}
          </div>`;
      }).join("")}
    </div>`;
}
