/**
 * Component: Production Summary & Dashboard Table Row
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    renderProduction: function (item) {
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};

        if (!item) {
            return `<div class="text-center text-xs text-slate-400 py-4">${t.no_production_data || 'ไม่พบข้อมูลการผลิต'}</div>`;
        }

        const planned = item.step3?.planned || 20000;
        const actual = item.step3?.actual || 15000;
        const percent = Math.min(100, Math.round((actual / planned) * 100));
        const s3 = item.step3 || {};
        const qc = item.step4_qc || {};
        const qa = item.step5_qa || {};
        const wh = item.step6_storage || {};
        const ship = item.step8_shipping || item.step6 || {};

        return `
            <!-- Header Summary Row -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                <div class="flex items-center space-x-2.5">
                    <div class="bg-amber-500/10 text-amber-700 p-2 rounded-xl border border-amber-200/50">
                        <i class="fa-solid fa-industry text-base"></i>
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h2 class="text-sm font-bold text-slate-900 leading-tight">
                                ${t.prod_section_title || 'สรุปการผลิตและการทำงาน'}: <span class="text-indigo-600 font-mono">${item.orderNo}</span>
                            </h2>
                            <span class="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">${item.moNo || item.planMoNo || 'MO-672649852'}</span>
                        </div>
                        <p class="text-[11px] text-slate-500">${item.customer} &bull; ${item.productName || 'Wood Pellets'} (${item.productType || '1. 0.6mm±1mm, 2. 0.8mm±1mm'})</p>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <span class="text-[11px] font-bold px-2.5 py-1 ${item.statusBadge === 'On Schedule' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'} rounded-lg border">
                        ${item.statusBadge || 'In Production'} (Step ${item.currentStep || 3})
                    </span>
                    <button onclick="openBpmModal('${item.orderNo}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg shadow-xs text-xs flex items-center transition-all">
                        <i class="fa-solid fa-file-invoice mr-1.5 text-xs"></i>
                        ${t.btn_view_bpm || 'ดูฟอร์ม BPM'}
                    </button>
                </div>
            </div>

            <!-- 4-Card Operational Matrix (Sale & Plan, Production Exec, QC/QA Quality, Storage/Shipment) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <!-- Card 1: Sale & Planning (Step 1) -->
                <div class="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 space-y-2">
                    <div class="flex items-center justify-between text-[11px] font-bold text-blue-900 border-b border-slate-200/60 pb-1.5">
                        <span class="flex items-center"><i class="fa-solid fa-cart-shopping mr-1.5 text-blue-600"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? '1. ฝ่ายขาย & วางแผน' : '1. Sale & Planning'}</span>
                        <span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">Step 1</span>
                    </div>
                    <div class="space-y-1 text-[11px]">
                        <div class="flex justify-between"><span class="text-slate-500">PO / PI No:</span><span class="font-mono font-bold text-slate-800 truncate">${item.customerPoNo || item.poNo || '-'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Production Batch:</span><span class="font-mono font-semibold text-indigo-700 truncate">${item.planBatchNo || 'SBP-xx-YY-02-3003'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Plan Dates:</span><span class="text-slate-700">${item.planDateStart || '2026/09/28'} &rarr; ${item.planDateFinish || '2026/09/30'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Scheme & Spec:</span><span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold text-[10px]">${item.planCertScheme || 'SBP, GGL'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'กำหนดส่งมอบ:' : 'Req Delivery:'}</span><span class="text-emerald-700 font-semibold">${item.deliveryDateReq || item.requestedDeliveryDate || '-'}</span></div>
                    </div>
                </div>

                <!-- Card 2: Production Execution (Step 3) -->
                <div class="bg-amber-50/30 p-3 rounded-xl border border-amber-200/60 space-y-2">
                    <div class="flex items-center justify-between text-[11px] font-bold text-amber-900 border-b border-amber-200/60 pb-1.5">
                        <span class="flex items-center"><i class="fa-solid fa-tree mr-1.5 text-amber-600"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? '3. การผลิตจริง' : '3. Production Execution'}</span>
                        <span class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">Step 3</span>
                    </div>
                    <div class="space-y-1 text-[11px]">
                        <div class="flex justify-between"><span class="text-slate-500">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'แผน / ผลิตจริง:' : 'Plan / Actual:'}</span><span class="font-bold text-slate-800">${planned.toLocaleString()} / <strong class="text-amber-700">${actual.toLocaleString()} Ton</strong></span></div>
                        <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${percent}%"></div>
                        </div>
                        <div class="flex justify-between"><span class="text-slate-500">Yield Output:</span><span class="font-bold text-slate-800">${s3.yield || '90,000 Ton'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Uptime / Downtime:</span><span class="font-semibold text-slate-700">${s3.totalUptime || '5760m'} / <span class="text-rose-600 font-bold">${s3.totalDowntime || '40m'}</span></span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Supervisor:</span><span class="text-slate-700 truncate">${s3.plantSupervisor || 'Operations Lead'}</span></div>
                    </div>
                </div>

                <!-- Card 3: Quality In-Line & Lab (Step 4 & 5) -->
                <div class="bg-orange-50/30 p-3 rounded-xl border border-orange-200/60 space-y-2">
                    <div class="flex items-center justify-between text-[11px] font-bold text-orange-900 border-b border-orange-200/60 pb-1.5">
                        <span class="flex items-center"><i class="fa-solid fa-flask-vial mr-1.5 text-orange-600"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? '4-5. คุณภาพ (QC & QA)' : '4-5. Quality (QC & QA)'}</span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">Passed</span>
                    </div>
                    <div class="space-y-1 text-[11px]">
                        <div class="flex justify-between"><span class="text-slate-500">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'QC หน้างาน 5 จุด:' : 'In-line QC 5 Pts:'}</span><span class="text-emerald-700 font-bold text-[10px]"><i class="fa-solid fa-check-double mr-0.5"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'ตรวจผ่าน 100%' : '100% Passed'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">After Dryer / Mag:</span><span class="font-bold text-indigo-700">14% / 13.5%</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Durability (>97.5%):</span><span class="font-bold text-emerald-700">97.8% (Pass)</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Ash (<2%) / Fines:</span><span class="font-semibold text-slate-700">1.5% / 0.8%</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">COA File:</span><span class="text-indigo-600 font-mono font-semibold truncate text-[10px]">${qa.coaFile || 'COA-202610.pdf'}</span></div>
                    </div>
                </div>

                <!-- Card 4: Storage & Shipping (Step 6 & 8) -->
                <div class="bg-teal-50/30 p-3 rounded-xl border border-teal-200/60 space-y-2">
                    <div class="flex items-center justify-between text-[11px] font-bold text-teal-900 border-b border-teal-200/60 pb-1.5">
                        <span class="flex items-center"><i class="fa-solid fa-boxes-packing mr-1.5 text-teal-600"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? '6,8. คลัง & ขนส่ง' : '6,8. Storage & Shipping'}</span>
                        <span class="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-semibold">Dispatched</span>
                    </div>
                    <div class="space-y-1 text-[11px]">
                        <div class="flex justify-between"><span class="text-slate-500">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'จุดจัดเก็บคลัง:' : 'Warehouse Loc:'}</span><span class="font-semibold text-slate-800">${wh.storageLocation || 'Warehouse 1'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'สต็อกคงเหลือยกไป:' : 'Closing Stock:'}</span><span class="font-bold text-emerald-700">${wh.closingStock || '1,200 Ton'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">SA / Booking:</span><span class="font-mono text-slate-800 truncate">${ship.saNumber || ship.saNo || 'SA-03918'} (${ship.bookingNo || '-'})</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Shipping Line:</span><span class="font-bold text-indigo-700">${ship.shippingLine || 'EVG'} (${ship.transitTime || '30d'})</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">ETD &rarr; ETA:</span><span class="font-semibold text-emerald-700">${ship.etd || '-'} &rarr; ${ship.eta || '-'}</span></div>
                    </div>
                </div>
            </div>

            <!-- Customer Post-Delivery Feedback & Complaints Panel -->
            <div class="mt-3 pt-3 border-t border-slate-100">
                <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div class="flex items-center space-x-2">
                        <span class="w-5 h-5 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs">
                            <i class="fa-solid fa-comments"></i>
                        </span>
                        <div>
                            <h3 class="text-xs font-bold text-slate-800">
                                ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'ข้อร้องเรียนและข้อเสนอแนะลูกค้า' : 'Customer Complaints & Claims'}
                            </h3>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onclick="openComplaintModal('${item.orderNo}')" 
                        class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition-all flex items-center shadow-xs hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <i class="fa-solid fa-plus mr-1 text-[10px]"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'บันทึกข้อร้องเรียน' : 'Log Complaint'}
                    </button>
                </div>
                ${typeof renderComplaintsListHtml === "function" ? renderComplaintsListHtml(item.orderNo) : ''}
            </div>
        `;
    },

    renderTableRow: function (item, isSelected = false, rowIndex = 1) {
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};
        const statusText = item.statusBadge === "On Schedule" ? (t.status_onschedule || 'ตามกำหนด') : (t.status_inproduction || 'กำลังผลิต');
        const selectedClass = isSelected ? "bg-indigo-50/80 border-l-4 border-indigo-600 font-semibold" : "hover:bg-slate-50/85";
        const ship = item.step6 || {};
        const complaints = typeof getComplaintsForOrder === "function" ? getComplaintsForOrder(item.orderNo) : [];
        const complaintBadge = complaints.length > 0 
            ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300" title="Has ${complaints.length} customer complaint(s)"><i class="fa-solid fa-triangle-exclamation mr-1"></i>${complaints.length} Complain</span>`
            : '';

        return `
            <tr id="order-row-${item.orderNo}" class="${selectedClass} cursor-pointer transition-colors" onclick="handleSelectOrder('${item.orderNo}')">
                <td class="py-3 px-3 text-center font-bold text-slate-500">
                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        ${rowIndex}
                    </span>
                </td>
                <td class="py-3 px-3 font-medium text-slate-900">
                    <span class="text-indigo-600 hover:underline font-bold">${item.orderNo}</span>
                    <span class="text-[10px] font-mono text-slate-500 ml-1">(${item.moNo || '-'})</span><br>
                    <span class="text-[11px] text-slate-400 font-normal">${item.customer}</span>
                </td>
                <td class="py-3 px-3 text-slate-600">
                    <div>${item.destination}</div>
                    <div class="text-[11px] text-slate-400">${ship.shippingLine ? `Line: ${ship.shippingLine}` : ''} ${ship.bookingNo ? `(${ship.bookingNo})` : ''}</div>
                </td>
                <td class="py-3 px-3 text-emerald-600 font-semibold">${ship.etd || '-'}</td>
                <td class="py-3 px-3 text-slate-600">
                    <div>${ship.eta || '-'}</div>
                    <div class="text-[10px] text-indigo-500">${ship.transitTime ? `Transit: ${ship.transitTime}` : ''}</div>
                </td>
                <td class="py-3 px-3 text-right">
                    <div class="inline-flex items-center space-x-1.5">
                        ${complaintBadge}
                        <span class="px-2.5 py-1 ${item.statusBadge === "On Schedule" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"} rounded-full text-[10px] font-semibold">
                            ${statusText}
                        </span>
                        <!-- ปุ่มบันทึก Customer Complaint สำหรับฝ่ายขาย -->
                        <button onclick="event.stopPropagation(); openComplaintModal('${item.orderNo}');" title="Log Customer Complaint (Post-Delivery)" class="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition-all shadow-xs flex items-center">
                            <i class="fa-solid fa-comment-medical mr-1 text-rose-600"></i> Complain
                        </button>
                        <!-- ปุ่มพิกัด GPS / แผนที่ -->
                        <button onclick="event.stopPropagation(); openMapModal('${item.orderNo}');" title="ดูพิกัดแปลง/โรงงานบนแผนที่ (GPS)" class="p-1 px-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[11px] font-bold transition-all shadow-xs flex items-center">
                            <i class="fa-solid fa-location-dot mr-1 text-rose-500"></i> GPS
                        </button>
                        <!-- ปุ่มดูฟอร์ม BPM -->
                        <button onclick="event.stopPropagation(); openBpmModal('${item.orderNo}');" title="ดูข้อมูลฟอร์มฉบับเต็ม" class="text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors">
                            <i class="fa-solid fa-circle-info text-sm"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    renderDashboardPaginationControls: function (currentPage, totalPages, totalRecords, pageSize) {
        if (totalRecords === 0) return '';
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};
        const start = Math.min((currentPage - 1) * pageSize + 1, totalRecords);
        const end = Math.min(currentPage * pageSize, totalRecords);
        const template = t.pagination_info || "แสดง {start}-{end} จากทั้งหมด {total} รายการ";
        const infoText = template
            .replace("{start}", start)
            .replace("{end}", end)
            .replace("{total}", totalRecords);

        let pageButtons = '';
        for (let p = 1; p <= totalPages; p++) {
            if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
                const isActive = p === currentPage;
                pageButtons += `
                    <button onclick="goToDashboardPage(${p})" class="px-3 py-1 text-xs font-bold rounded-lg transition-all ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'}">
                        ${p}
                    </button>
                `;
            } else if (p === currentPage - 3 || p === currentPage + 3) {
                pageButtons += `<span class="px-1 text-slate-400 text-xs">...</span>`;
            }
        }

        return `
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div class="text-slate-500 font-medium">
                    ${infoText}
                </div>

                <div class="flex items-center space-x-1.5">
                    <button onclick="goToDashboardPage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 font-semibold transition-all ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700'}">
                        <i class="fa-solid fa-chevron-left mr-1"></i> ก่อนหน้า
                    </button>

                    ${pageButtons}

                    <button onclick="goToDashboardPage(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 font-semibold transition-all ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700'}">
                        ถัดไป <i class="fa-solid fa-chevron-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    }
});
