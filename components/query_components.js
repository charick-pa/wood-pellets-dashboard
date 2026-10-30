/**
 * Component: Order Query Table Row (11 Columns) & Pagination Controls
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    // เรนเดอร์แถวใน Order Query Table ครบ 11 คอลัมน์สมบูรณ์แบบ
    renderQueryRow: function (item, rowIndex = 1) {
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};
        const statusText = item.statusBadge === "On Schedule" 
            ? (t.status_onschedule || 'ตามกำหนดการ') 
            : (t.status_inproduction || 'อยู่ระหว่างการผลิต');
        const statusBadgeClass = item.statusBadge === "On Schedule" 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
            : "bg-amber-50 text-amber-700 border-amber-200";
        const progress = typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 0;
        const ship = item.step6 || {};

        const stepThemes = {
            1: "bg-blue-50 text-blue-700 border-blue-200",
            2: "bg-indigo-50 text-indigo-700 border-indigo-200",
            3: "bg-amber-50 text-amber-700 border-amber-200",
            4: "bg-orange-50 text-orange-700 border-orange-200",
            5: "bg-purple-50 text-purple-700 border-purple-200",
            6: "bg-cyan-50 text-cyan-700 border-cyan-200",
            7: "bg-emerald-50 text-emerald-700 border-emerald-200",
            8: "bg-teal-50 text-teal-700 border-teal-200"
        };
        const stepNames = {
            1: "1. Sale",
            2: "2. RA",
            3: "3. Production",
            4: "4. QC",
            5: "5. QA",
            6: "6. Storage",
            7: "7. RA Verification",
            8: "8. Shipment"
        };
        const stepClass = stepThemes[item.currentStep] || "bg-slate-50 text-slate-700 border-slate-200";
        const stepName = stepNames[item.currentStep] || `Step ${item.currentStep || 1}`;

        return `
            <tr class="hover:bg-indigo-50/40 transition-colors border-b border-slate-100">
                <td class="py-3 px-3 text-center font-bold text-slate-500">
                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        ${rowIndex}
                    </span>
                </td>
                <td class="py-3 px-3">
                    <span class="font-bold text-indigo-600 hover:underline cursor-pointer" onclick="jumpToDashboardOrder('${item.orderNo}')">${item.orderNo}</span>
                </td>
                <td class="py-3 px-3">
                    <div class="flex items-center space-x-1">
                        <span class="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">${item.moNo || '-'}</span>
                        <button onclick="openMapModal('${item.orderNo}')" title="ดูพิกัดแปลง/โรงงาน (GPS)" class="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1 rounded transition-colors text-[10px]">
                            <i class="fa-solid fa-location-dot"></i>
                        </button>
                    </div>
                    ${item.location ? `<div class="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5 cursor-pointer hover:text-rose-600" onclick="openMapModal('${item.orderNo}')" title="${item.location.placeName}">📍 ${item.location.placeName.split('(')[0]}</div>` : ''}
                    ${(() => {
                        const plots = (typeof window.cadastralPlots !== "undefined" && Array.isArray(window.cadastralPlots))
                            ? window.cadastralPlots.filter(p => p.linkedMoNo && p.linkedMoNo.trim().toUpperCase() === String(item.moNo || '').trim().toUpperCase())
                            : [];
                        if (plots.length === 0) return '';
                        const firstPlot = plots[0];
                        const deed = firstPlot.attributes?.['Land Title No.'] || firstPlot.attributes?.['Title Deed No.'] || firstPlot.attributes?.['Deed Title No'] || '';
                        const plotLabel = deed ? `โฉนด: ${deed}` : (plots.length === 1 ? firstPlot.name.split('(')[0] : `${plots.length} แปลง EUDR`);
                        return `<div class="mt-1"><button onclick="openPlotInCadastralView('${firstPlot.id}')" title="เปิดดูแปลงที่ดิน & แบบประเมิน EUDR: ${plots.map(p => p.name).join(', ')}" class="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors truncate max-w-[150px]"><i class="fa-solid fa-draw-polygon text-emerald-600 mr-1 text-[8.5px]"></i><span class="truncate">${plotLabel}</span></button></div>`;
                    })()}
                </td>
                <td class="py-3 px-3">
                    <div class="font-semibold text-slate-800">${item.customer}</div>
                    <div class="text-[11px] text-slate-400">PO: ${item.poNo || '-'}</div>
                </td>
                <td class="py-3 px-3 text-slate-600">
                    <div>${item.productName || 'Wood Pellets'}</div>
                    <div class="text-[11px] text-amber-600 font-medium">${item.orderQuantity || '-'} (${item.productType || ''})</div>
                </td>
                <td class="py-3 px-3 text-slate-600">
                    <div>${item.destination}</div>
                    <div class="text-[11px] text-slate-400">${ship.shippingLine ? `${ship.shippingLine}` : ''} ${ship.bookingNo ? `(${ship.bookingNo})` : ''}</div>
                </td>
                <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-md text-[11px] font-bold border ${stepClass}">
                        ${stepName}
                    </span>
                </td>
                <td class="py-3 px-3">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-xs text-slate-700 w-8">${progress}%</span>
                        <div class="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div class="${progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'} h-1.5 rounded-full" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-3 text-xs">
                    <div class="text-emerald-600 font-semibold">ETD: ${ship.etd || '-'}</div>
                    <div class="text-slate-400 text-[10px]">ETA: ${ship.eta || '-'}</div>
                </td>
                <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="py-3 px-3 text-right">
                    <div class="flex items-center justify-end space-x-1.5">
                        <button onclick="openComplaintModal('${item.orderNo}')" title="Log Customer Complaint (Post-Delivery)" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center">
                            <i class="fa-solid fa-comment-medical mr-1 text-[11px] text-rose-600"></i> Complain
                        </button>
                        <button onclick="openMapModal('${item.orderNo}')" title="ดูพิกัดแปลง/โรงงานบนแผนที่ (GPS)" class="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center">
                            <i class="fa-solid fa-location-dot mr-1 text-[11px] text-rose-500"></i> GPS
                        </button>
                        ${(() => {
                            const plots = (typeof window.cadastralPlots !== "undefined" && Array.isArray(window.cadastralPlots))
                                ? window.cadastralPlots.filter(p => p.linkedMoNo && p.linkedMoNo.trim().toUpperCase() === String(item.moNo || '').trim().toUpperCase())
                                : [];
                            return plots.length > 0 ? `<button onclick="openPlotInCadastralView('${plots[0].id}')" title="เปิดดูแปลงที่ดิน & แบบประเมิน EUDR" class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center"><i class="fa-solid fa-draw-polygon mr-1 text-[11px] text-emerald-600"></i> EUDR</button>` : '';
                        })()}
                        <button onclick="openBpmModal('${item.orderNo}')" title="${t.btn_view_bpm || 'ดูเอกสาร BPM'}" class="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-600 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center">
                            <i class="fa-solid fa-file-invoice mr-1 text-[11px]"></i> BPM
                        </button>
                        <button onclick="jumpToDashboardOrder('${item.orderNo}')" title="${t.btn_view_in_dashboard || 'เปิดดูใน Dashboard'}" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center">
                            <i class="fa-solid fa-chart-pie mr-1 text-[11px]"></i> View
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    // แถบควบคุม Pagination Bar สำหรับ Order Query
    renderPaginationControls: function (currentPage, totalPages, totalRecords, pageSize) {
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
                    <button onclick="goToQueryPage(${p})" class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'}">
                        ${p}
                    </button>
                `;
            } else if (p === currentPage - 3 || p === currentPage + 3) {
                pageButtons += `<span class="px-1 text-slate-400 text-xs">...</span>`;
            }
        }

        return `
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs">
                <div class="text-slate-500 font-medium">
                    ${infoText}
                </div>

                <div class="flex items-center space-x-1.5">
                    <button onclick="goToQueryPage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold transition-all ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700'}">
                        <i class="fa-solid fa-chevron-left mr-1"></i> ก่อนหน้า
                    </button>

                    ${pageButtons}

                    <button onclick="goToQueryPage(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold transition-all ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700'}">
                        ถัดไป <i class="fa-solid fa-chevron-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    }
});