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

        const planned = item.step3?.planned || 1;
        const actual = item.step3?.actual || 0;
        const percent = Math.min(100, Math.round((actual / planned) * 100));

        const pz = item.step4_pelletizing || {
            yield: "90,000 Ton",
            totalDowntimeMins: 4000,
            issue: "Screen blockage on Hummer mill",
            pelletDiameter: "6.0 mm",
            pelletMoisture: "7.8%",
            coolingMoisture: "6.5%"
        };

        return `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
                <div class="flex items-center space-x-2">
                    <div class="bg-amber-50 text-amber-600 p-2 rounded-xl">
                        <i class="fa-solid fa-industry text-base"></i>
                    </div>
                    <div>
                        <h2 class="text-base font-bold text-slate-900 leading-tight">
                            ${t.prod_section_title || 'สรุปการผลิตและการทำงาน'}: <span class="text-indigo-600">${item.orderNo}</span>
                        </h2>
                        <p class="text-xs text-slate-500">${item.customer} &bull; ${item.productName || 'Industrial Wood Pellets'}</p>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <span class="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                        ${item.statusBadge || 'In Production'}
                    </span>
                    <button onclick="openBpmModal('${item.orderNo}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3.5 rounded-xl shadow-sm text-xs flex items-center transition-all">
                        <i class="fa-solid fa-file-invoice mr-1.5 text-xs"></i>
                        ${t.btn_view_bpm || 'ดูฟอร์ม BPM'}
                    </button>
                </div>
            </div>

            <!-- 3-Column Responsive Grid Layout -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Col 1: Planning & Actual Volume -->
                <div class="bg-slate-50/80 p-4 rounded-xl border border-slate-100 space-y-3">
                    <p class="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center">
                        <i class="fa-solid fa-chart-column text-indigo-500 mr-1.5"></i>
                        แผนและยอดผลิตจริง (Production Volume)
                    </p>
                    <div class="flex justify-between text-xs text-slate-500">
                        <span>${t.prod_planned || 'แผนผลิต'}</span>
                        <span class="font-bold text-slate-800">${planned.toLocaleString()} Ton</span>
                    </div>
                    <div class="flex justify-between text-xs text-slate-500">
                        <span>${t.prod_actual || 'ยอดจริง'}</span>
                        <span class="font-bold text-amber-600">${actual.toLocaleString()} Ton (${percent}%)</span>
                    </div>
                    <div class="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
                        <div class="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style="width: ${percent}%"></div>
                    </div>
                    <div class="pt-2 border-t border-slate-200/60 flex justify-between text-[11px] text-slate-400">
                        <span>เริ่ม: ${item.step3?.startDate || item.planStartDate || '2026/09/30'}</span>
                        <span>เสร็จ: ${item.step3?.finishDate || item.planEndDate || '2026/10/30'}</span>
                    </div>
                </div>

                <!-- Col 2: Pelletizing In-line QC -->
                <div class="bg-amber-50/40 p-4 rounded-xl border border-amber-100 space-y-2.5">
                    <p class="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center">
                        <i class="fa-solid fa-gauge-high text-amber-600 mr-1.5"></i>
                        ${t.wood_pellets_qc_title || 'ควบคุมคุณภาพการอัดเม็ด'}
                    </p>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-white p-2 rounded-lg border border-amber-100/70">
                            <span class="text-[10px] text-slate-400 block">${t.pellet_diameter || 'ขนาดเม็ด'}</span>
                            <span class="font-bold text-slate-800">${pz.pelletDiameter}</span>
                        </div>
                        <div class="bg-white p-2 rounded-lg border border-amber-100/70">
                            <span class="text-[10px] text-slate-400 block">${t.pellet_moisture || 'ความชื้นเม็ด'}</span>
                            <span class="font-bold text-indigo-600">${pz.pelletMoisture}</span>
                        </div>
                        <div class="bg-white p-2 rounded-lg border border-amber-100/70">
                            <span class="text-[10px] text-slate-400 block">${t.cooling_moisture || 'ความชื้นหลังหล่อเย็น'}</span>
                            <span class="font-bold text-emerald-600">${pz.coolingMoisture}</span>
                        </div>
                        <div class="bg-white p-2 rounded-lg border border-amber-100/70">
                            <span class="text-[10px] text-slate-400 block">${t.total_downtime || 'เวลารวมหยุดเครื่อง'}</span>
                            <span class="font-bold text-rose-600">${(pz.totalDowntimeMins || 0).toLocaleString()} m</span>
                        </div>
                    </div>
                    ${pz.issue && pz.issue !== 'None' ? `
                        <div class="text-[10px] text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-100 flex items-start">
                            <i class="fa-solid fa-triangle-exclamation mr-1.5 mt-0.5 text-rose-500"></i>
                            <span class="truncate"><strong>Issue:</strong> ${pz.issue}</span>
                        </div>
                    ` : ''}
                </div>

                <!-- Col 3: Machinery Status -->
                <div class="bg-slate-50/80 p-4 rounded-xl border border-slate-100 space-y-2.5">
                    <p class="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center">
                        <i class="fa-solid fa-gears text-indigo-500 mr-1.5"></i>
                        ${t.raw_material_title || 'สถานะเครื่องจักร'}
                    </p>
                    <div class="space-y-1.5 text-xs">
                        ${(item.machinery || []).map((m) => `
                            <div class="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200/70">
                                <span class="text-slate-700 font-medium flex items-center">
                                    <span class="w-2 h-2 rounded-full mr-2 ${m.active ? 'bg-emerald-500' : 'bg-slate-300'}"></span>
                                    ${m.name}
                                </span>
                                <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}">
                                    ${m.active ? 'Running' : 'Standby'}
                                </span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>

            <!-- Customer Post-Delivery Feedback & Complaints Panel -->
            <div class="mt-4 pt-4 border-t border-slate-100">
                <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div class="flex items-center space-x-2">
                        <span class="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs">
                            <i class="fa-solid fa-comments"></i>
                        </span>
                        <div>
                            <h3 class="text-xs font-bold text-slate-800">
                                Customer Complaints & Post-Delivery Claims (ข้อร้องเรียนลูกค้าหลังรับสินค้า)
                            </h3>
                            <p class="text-[10px] text-slate-500">Record and monitor post-delivery claims or quality feedback</p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onclick="openComplaintModal('${item.orderNo}')" 
                        class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center shadow-sm hover:scale-105 active:scale-95"
                    >
                        <i class="fa-solid fa-plus mr-1.5 text-[10px]"></i> Log Complaint
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
