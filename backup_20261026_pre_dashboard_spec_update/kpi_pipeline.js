/**
 * Component: KPI Cards, Wood Pellets Quick Summary Bar & 8-Step Pipeline
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    renderKPICards: function (summaryData, activeItem) {
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};
        const progress = activeItem && typeof calculateProductionProgress === "function" 
            ? calculateProductionProgress(activeItem) 
            : (summaryData?.productionProgress || 0);
        const isCompleted = progress === 100;
        const progressBarColor = isCompleted ? "bg-emerald-500" : "bg-amber-500";
        const stepNames = {
            1: "Step 1: Sale",
            2: "Step 2: RA",
            3: "Step 3: Production",
            4: "Step 4: QC",
            5: "Step 5: QA",
            6: "Step 6: Storage",
            7: "Step 7: RA Verification",
            8: "Step 8: Shipment"
        };
        const orderInfo = activeItem 
            ? `${activeItem.orderNo} (${stepNames[activeItem.currentStep] || 'Step ' + activeItem.currentStep})`
            : "";

        return `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Card 1: Active Orders (ยอดรวมคำสั่งซื้อ พร้อมแบ่งรายเดือนและรายปี) -->
                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_active || 'ยอดรวมคำสั่งซื้อ'}</p>
                            <h3 class="text-2xl font-bold text-slate-900 mt-0.5">${summaryData.activeOrders}</h3>
                        </div>
                        <div class="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                            <i class="fa-solid fa-cart-shopping text-lg"></i>
                        </div>
                    </div>

                    <!-- แถบแสดงยอดรายเดือน และ รายปี -->
                    <div class="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                            <span class="text-[10px] text-slate-400 font-medium block">
                                <i class="fa-solid fa-calendar-day text-indigo-500 mr-1"></i>รายเดือน (ต.ค.)
                            </span>
                            <div class="flex items-baseline space-x-1 mt-0.5">
                                <strong class="text-sm font-bold text-indigo-600">${summaryData.monthlyOrders || 8}</strong>
                                <span class="text-[10px] text-slate-500">ออเดอร์</span>
                            </div>
                            <span class="text-[10px] text-slate-500 block font-mono mt-0.5">${summaryData.monthlyTons || '125,000'} T</span>
                        </div>
                        <div class="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                            <span class="text-[10px] text-slate-400 font-medium block">
                                <i class="fa-solid fa-calendar text-emerald-500 mr-1"></i>รายปี (2026)
                            </span>
                            <div class="flex items-baseline space-x-1 mt-0.5">
                                <strong class="text-sm font-bold text-emerald-600">${summaryData.yearlyOrders || summaryData.activeOrders}</strong>
                                <span class="text-[10px] text-slate-500">ออเดอร์</span>
                            </div>
                            <span class="text-[10px] text-slate-500 block font-mono mt-0.5">${summaryData.yearlyTons || '485,000'} T</span>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Production Progress (อัปเดตตาม Step ของ Order) -->
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_prod || 'ความคืบหน้าการผลิต'}</p>
                        <div class="bg-amber-50 text-amber-600 p-2 rounded-xl">
                            <i class="fa-solid fa-gears text-base"></i>
                        </div>
                    </div>
                    <h3 id="production-progress-text" class="text-2xl font-bold text-slate-900">${progress}%</h3>
                    <div class="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                        <div id="production-progress-bar" class="${progressBarColor} h-2 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                    <p id="production-progress-sub" class="text-[11px] text-slate-400 font-medium mt-2 truncate">${orderInfo}</p>
                </div>

                <!-- Card 3: Pending Shipments -->
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_ship || 'รอส่งออก'}</p>
                        <h3 class="text-2xl font-bold text-slate-900 mt-1">${summaryData.pendingShipments}</h3>
                        <p class="text-xs text-indigo-600 font-medium mt-1">${t.etd_label || 'ETD'}: ${t.kpi_ship_sub || '2026/10/29'}</p>
                    </div>
                    <div class="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl">
                        <i class="fa-solid fa-truck-fast text-xl"></i>
                    </div>
                </div>

                <!-- Card 4: Quality Deviations -->
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_qa || 'การเบี่ยงเบนคุณภาพ'}</p>
                        <h3 class="text-2xl font-bold text-emerald-600 mt-1">${summaryData.qualityDeviations} ${t.kpi_qa_cases || 'รายการ'}</h3>
                        <p class="text-xs text-slate-500 font-medium mt-1 flex items-center">
                            <i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> ${t.kpi_qa_sub || 'ผ่านเกณฑ์มาตรฐาน ISO 9001'}
                        </p>
                    </div>
                    <div class="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl">
                        <i class="fa-solid fa-shield-halved text-xl"></i>
                    </div>
                </div>
            </div>
        `;
    },

    // แถบ Quick Summary เฉพาะทาง Wood Pellets (ดึงจากฟอร์ม BPM)
    renderWoodPelletsQuickBar: function (item) {
        if (!item) return '';

        const pz = item.step4_pelletizing || {
            yield: "90,000 Ton",
            totalDowntimeMins: 4000,
            pelletDiameter: "6.0 mm",
            pelletMoisture: "7.8%",
            coolingMoisture: "6.5%"
        };
        const wh = item.step5 || {
            location: "Warehouse 1",
            openingStock: "1,000 Ton",
            issueQty: "300 Ton",
            closingStock: "1,200 Ton"
        };
        const ship = item.step6 || {
            shippingLine: "EVG",
            bookingNo: "09050012456",
            transitTime: "30 days"
        };

        return `
            <div class="bg-white border border-slate-100 text-white rounded-2xl p-5 shadow-md">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
                    <div class="flex items-center space-x-2">
                        <span class="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">WOOD PELLETS BPM</span>
                        <h3 class="text-sm font-bold text-slate-900 tracking-wide">
                            พารามิเตอร์การผลิตและสต็อกเฉพาะทาง: <span class="text-amber-400">${item.orderNo}</span> (${item.customer})
                        </h3>
                    </div>
                    <button onclick="openBpmModal('${item.orderNo}')" class="inline-flex items-center text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                        <i class="fa-solid fa-expand mr-1.5 text-[11px]"></i> ดูฟอร์ม BPM เต็ม
                    </button>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <!-- Widget 1: Wood Pellet Specs & Certs -->
                    <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                        <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                            <span>สเปก & ใบรับรอง</span>
                            <i class="fa-solid fa-certificate text-amber-400"></i>
                        </div>
                        <p class="text-sm font-bold text-white">${pz.pelletDiameter} (${item.productType || '1-0.6mm'})</p>
                        <div class="flex items-center space-x-1 mt-1.5">
                            <span class="text-[9px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded">SBP</span>
                            <span class="text-[9px] bg-blue-500/20 text-blue-300 font-semibold px-1.5 py-0.5 rounded">GGL</span>
                            <span class="text-[9px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded">FSC</span>
                        </div>
                    </div>

                    <!-- Widget 2: Moisture Control -->
                    <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                        <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                            <span>การคุมความชื้น (Moisture)</span>
                            <i class="fa-solid fa-droplet text-cyan-400"></i>
                        </div>
                        <div class="flex items-baseline space-x-2">
                            <span class="text-sm font-bold text-cyan-300">${pz.pelletMoisture}</span>
                            <span class="text-[11px] text-slate-400">Cooling: <strong class="text-white">${pz.coolingMoisture}</strong></span>
                        </div>
                        <p class="text-[10px] text-emerald-400 mt-1 flex items-center">
                            <i class="fa-solid fa-check mr-1"></i> ต่ำกว่าเกณฑ์มาตรฐาน 8%
                        </p>
                    </div>

                    <!-- Widget 3: Yield & Machine Downtime -->
                    <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                        <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                            <span>Yield & Downtime</span>
                            <i class="fa-solid fa-clock-rotate-left text-rose-400"></i>
                        </div>
                        <p class="text-sm font-bold text-white">Yield: <span class="text-amber-400">${pz.yield}</span></p>
                        <p class="text-[10px] text-rose-300 mt-1 flex items-center">
                            <i class="fa-solid fa-triangle-exclamation mr-1 text-rose-400"></i> Downtime: <strong>${(pz.totalDowntimeMins || 0).toLocaleString()} นาที</strong>
                        </p>
                    </div>

                    <!-- Widget 4: Warehouse Stock Movement -->
                    <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                        <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                            <span>คลังสินค้า (${wh.location || 'WH 1'})</span>
                            <i class="fa-solid fa-warehouse text-indigo-400"></i>
                        </div>
                        <p class="text-sm font-bold text-white">คงเหลือ: <span class="text-emerald-400">${wh.closingStock || '1,200 Ton'}</span></p>
                        <p class="text-[10px] text-slate-400 mt-1">
                            ยกมา ${wh.openingStock || '1,000T'} &bull; จ่ายออก ${wh.issueQty || '300T'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    // แสดงสถานะ 8-Step Lifecycle Pipeline (Sale -> RA -> Production -> QC -> QA -> Storage -> RA Verification -> Shipment)
    renderPipeline: function (item) {
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};

        if (!item) {
            return `
                <div class="text-center text-xs text-slate-400 py-4 w-full">
                    ${t.no_order_data || 'ไม่พบข้อมูลคำสั่งซื้อ'}
                </div>
            `;
        }

        const currentStep = item.currentStep || 1;
        const promptStatus = (item.ResultPrompt || "Approved").trim().toUpperCase();

        const arrow = `
            <div class="hidden lg:flex items-center justify-center text-slate-300 px-1">
                <i class="fa-solid fa-arrow-right text-sm"></i>
            </div>
        `;

        const stepThemes = {
            1: { badge: "bg-blue-600 text-white", card: "bg-blue-50/60 border-blue-200 text-blue-900", text: "text-blue-700" },
            2: { badge: "bg-indigo-600 text-white", card: "bg-indigo-50/60 border-indigo-200 text-indigo-900", text: "text-indigo-700" },
            3: { badge: "bg-amber-600 text-white", card: "bg-amber-50/60 border-amber-200 text-amber-900", text: "text-amber-700" },
            4: { badge: "bg-orange-600 text-white", card: "bg-orange-50/60 border-orange-200 text-orange-900", text: "text-orange-700" },
            5: { badge: "bg-purple-600 text-white", card: "bg-purple-50/60 border-purple-200 text-purple-900", text: "text-purple-700" },
            6: { badge: "bg-cyan-600 text-white", card: "bg-cyan-50/60 border-cyan-200 text-cyan-900", text: "text-cyan-700" },
            7: { badge: "bg-emerald-600 text-white", card: "bg-emerald-50/60 border-emerald-200 text-emerald-900", text: "text-emerald-700" },
            8: { badge: "bg-teal-600 text-white", card: "bg-teal-50/60 border-teal-200 text-teal-900", text: "text-teal-700" }
        };

        const steps = [
            {
                id: 1, step: "Step 1", title: "Sale",
                val: item.orderNo, sub: item.customer,
                status: "DONE"
            },
            {
                id: 2, step: "Step 2", title: "RA",
                val: promptStatus === "APPROVED" ? "APPROVED" : promptStatus,
                sub: item.step2?.valid || item.step2?.licenseExpiry || 'EUDR Pass',
                status: promptStatus === "APPROVED" ? "COMPLETED" : promptStatus
            },
            {
                id: 3, step: "Step 3", title: "Production",
                val: `${(item.step3?.actual || 0).toLocaleString()} / ${((item.step3?.planned || 0) / 1000).toFixed(0)}k T`,
                sub: 'Woods Material',
                status: item.step3?.status || 'IN PROGRESS'
            },
            {
                id: 4, step: "Step 4", title: "QC",
                val: item.step4_pelletizing ? item.step4_pelletizing.pelletDiameter : "6.0 mm",
                sub: item.step4_pelletizing ? `M: ${item.step4_pelletizing.pelletMoisture}` : "5 Checkpoints",
                status: item.currentStep >= 4 ? "IN PROGRESS" : "PENDING"
            },
            {
                id: 5, step: "Step 5", title: "QA",
                val: item.step4?.status || 'Zero Dev', sub: item.step4?.sub || 'COA Ready',
                status: item.step4?.status || 'PENDING'
            },
            {
                id: 6, step: "Step 6", title: "Storage",
                val: item.step5?.location || 'Warehouse 1', sub: item.step5?.closingStock ? `Stock: ${item.step5.closingStock}` : 'Packing Log',
                status: item.step5?.sub ? item.step5.sub.toUpperCase() : "PENDING"
            },
            {
                id: 7, step: "Step 7", title: "RA Verification",
                val: "Dossier Ready", sub: "GGL / SBP / EUDR",
                status: item.currentStep >= 7 ? "COMPLETED" : "PENDING"
            },
            {
                id: 8, step: "Step 8", title: "Shipment",
                val: item.step6?.tracking || item.step6?.saNo || item.step6?.bookingNo || 'SA Issued', sub: `ETD: ${item.step6?.etd || '-'}`,
                status: item.statusBadge ? item.statusBadge.toUpperCase() : "PENDING"
            }
        ];

        const isRejected = promptStatus === "REJECTED" || promptStatus === "REJECT";
        const isWithdrawn = promptStatus === "WITHDRAW" || promptStatus === "WITHDRAWN";

        let html = '<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">';

        steps.forEach((s, index) => {
            let badgeBg, cardStyle, textCol;
            let displayStatus = s.status;
            const theme = stepThemes[s.id];

            if (s.id === currentStep) {
                if (isRejected) displayStatus = "REJECTED";
                if (isWithdrawn) displayStatus = "WITHDRAWN";
            } else if (s.id > currentStep || isRejected || isWithdrawn) {
                if (s.id > currentStep && !isRejected && !isWithdrawn) {
                    displayStatus = "PENDING";
                }
            }

            if (s.id === currentStep && !isRejected && !isWithdrawn) {
                badgeBg = "bg-rose-600 text-white shadow-sm";
                cardStyle = "bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/40 shadow-md";
                textCol = "text-rose-700 font-bold";
            } else if ((s.id === currentStep) && (isRejected || isWithdrawn)) {
                badgeBg = "bg-amber-600 text-white";
                cardStyle = "bg-amber-50/80 border-amber-300 text-amber-900 ring-2 ring-amber-400/30";
                textCol = "text-amber-700 font-bold";
            } else if (s.id < currentStep && !isRejected && !isWithdrawn) {
                if (s.id === 5) {
                    badgeBg = "bg-purple-600 text-white";
                    cardStyle = "bg-purple-50/70 border-purple-200 text-purple-900";
                    textCol = "text-purple-700 font-medium";
                } else {
                    badgeBg = "bg-emerald-600 text-white";
                    cardStyle = "bg-emerald-50/70 border-emerald-200 text-emerald-900";
                    textCol = "text-emerald-700 font-medium";
                }
            } else {
                badgeBg = theme.badge;
                cardStyle = theme.card;
                textCol = theme.text;
                if (s.id > currentStep) displayStatus = "PENDING";
            }

            html += `
                <div class="flex-1 ${cardStyle} p-3 rounded-xl border text-center relative transition-all duration-300">
                    <span class="absolute -top-3 left-1/2 -translate-x-1/2 ${badgeBg} text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">${s.step}</span>
                    <p class="text-[11px] font-semibold mt-1 ${s.id === currentStep && !isRejected && !isWithdrawn ? 'text-rose-900 font-bold' : 'text-slate-700'}">${s.title}</p>
                    <p class="text-xs ${textCol} mt-1 truncate">${s.val}</p>
                    ${s.sub ? `<p class="text-[10px] text-slate-500 truncate mt-0.5">${s.sub}</p>` : ''}
                    <p class="text-[10px] font-bold tracking-wide uppercase opacity-90 mt-1 pt-1 border-t border-current/10">${displayStatus}</p>
                </div>
            `;

            if (index < steps.length - 1) {
                html += arrow;
            }
        });

        html += '</div>';
        return html;
    }
});
