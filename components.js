const Components = {
    renderKPICards: function (summaryData, activeItem) {
        const t = translations[currentLang];
        const progress = activeItem && typeof calculateProductionProgress === "function" 
            ? calculateProductionProgress(activeItem) 
            : (summaryData?.productionProgress || 0);
        const isCompleted = progress === 100;
        const progressBarColor = isCompleted ? "bg-emerald-500" : "bg-amber-500";
        const stepNames = {
            1: "Step 1: Sale",
            2: "Step 2: RA",
            3: "Step 3: Woods Planning",
            4: "Step 4: Pelletizing",
            5: "Step 5: QA",
            6: "Step 6: Warehouse",
            7: "Step 7: Shipment"
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
                            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_active}</p>
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
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_prod}</p>
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
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_ship}</p>
                        <h3 class="text-2xl font-bold text-slate-900 mt-1">${summaryData.pendingShipments}</h3>
                        <p class="text-xs text-indigo-600 font-medium mt-1">${t.etd_label}: ${t.kpi_ship_sub}</p>
                    </div>
                    <div class="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl">
                        <i class="fa-solid fa-truck-fast text-xl"></i>
                    </div>
                </div>

                <!-- Card 4: Quality Deviations -->
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_qa}</p>
                        <h3 class="text-2xl font-bold text-emerald-600 mt-1">${summaryData.qualityDeviations} ${t.kpi_qa_cases}</h3>
                        <p class="text-xs text-slate-500 font-medium mt-1 flex items-center">
                            <i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> ${t.kpi_qa_sub}
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
            <div class="bg-white border-slate-100 text-white rounded-2xl p-5 shadow-md">
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

    renderPipeline: function (item) {
        const t = translations[currentLang];

        if (!item) {
            return `
                <div class="text-center text-xs text-slate-400 py-4 w-full">
                    ${t.no_order_data}
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
            7: { badge: "bg-teal-600 text-white", card: "bg-teal-50/60 border-teal-200 text-teal-900", text: "text-teal-700" }
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
                sub: item.step2?.valid || item.step2?.licenseExpiry || '',
                status: promptStatus === "APPROVED" ? "COMPLETED" : promptStatus
            },
            {
                id: 3, step: "Step 3", title: "Woods Planning",
                val: `${(item.step3?.actual || 0).toLocaleString()} / ${((item.step3?.planned || 0) / 1000).toFixed(0)}k Ton`,
                sub: '',
                status: item.step3?.status || 'IN PROGRESS'
            },
            {
                id: 4, step: "Step 4", title: "Pelletizing",
                val: item.step4_pelletizing ? item.step4_pelletizing.pelletDiameter : "6.0 mm",
                sub: item.step4_pelletizing ? `M: ${item.step4_pelletizing.pelletMoisture}` : "Active",
                status: item.currentStep >= 4 ? "IN PROGRESS" : "PENDING"
            },
            {
                id: 5, step: "Step 5", title: "QA",
                val: item.step4?.status || 'Zero Dev', sub: item.step4?.sub || 'COA Ready',
                status: item.step4?.status || 'PENDING'
            },
            {
                id: 6, step: "Step 6", title: "Warehouse",
                val: item.step5?.location || 'Warehouse 1', sub: item.step5?.closingStock ? `Stock: ${item.step5.closingStock}` : '',
                status: item.step5?.sub ? item.step5.sub.toUpperCase() : "PENDING"
            },
            {
                id: 7, step: "Step 7", title: "Shipment",
                val: item.step6?.tracking || item.step6?.saNo || '-', sub: `ETD: ${item.step6?.etd || '-'}`,
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
    },

    renderProduction: function (item) {
        const t = translations[currentLang];

        if (!item) {
            return `<div class="text-center text-xs text-slate-400 py-4">${t.no_production_data}</div>`;
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
                            ${t.prod_section_title}: <span class="text-indigo-600">${item.orderNo}</span>
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
                        ${t.btn_view_bpm}
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
                        <span>${t.prod_planned}</span>
                        <span class="font-bold text-slate-800">${planned.toLocaleString()} Ton</span>
                    </div>
                    <div class="flex justify-between text-xs text-slate-500">
                        <span>${t.prod_actual}</span>
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
                        ${t.wood_pellets_qc_title}
                    </p>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-white p-2 rounded-lg border border-amber-100/70">
                            <span class="text-[10px] text-slate-400 block">${t.pellet_diameter}</span>
                            <span class="font-bold text-slate-800">${pz.pelletDiameter}</span>
                        </div>
                        <div class="bg-white p-2 rounded-lg border border-amber-100/70">
                            <span class="text-[10px] text-slate-400 block">${t.pellet_moisture}</span>
                            <span class="font-bold text-indigo-600">${pz.pelletMoisture}</span>
                        </div>
                        <div class="bg-white p-2 rounded-lg border border-amber-100/70">
                            <span class="text-[10px] text-slate-400 block">${t.cooling_moisture}</span>
                            <span class="font-bold text-emerald-600">${pz.coolingMoisture}</span>
                        </div>
                        <div class="bg-white p-2 rounded-lg border border-amber-100/70">
                            <span class="text-[10px] text-slate-400 block">${t.total_downtime}</span>
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
                        ${t.raw_material_title}
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
        `;
    },

    renderTableRow: function (item, isSelected = false, rowIndex = 1) {
        const t = translations[currentLang];
        const statusText = item.statusBadge === "On Schedule" ? t.status_onschedule : t.status_inproduction;
        const selectedClass = isSelected ? "bg-indigo-50/80 border-l-4 border-indigo-600 font-semibold" : "hover:bg-slate-50/85";
        const ship = item.step6 || {};
        const loc = item.location || {};

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
                        <span class="px-2.5 py-1 ${item.statusBadge === "On Schedule" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"} rounded-full text-[10px] font-semibold">
                            ${statusText}
                        </span>
                        <!-- ปุ่มพิกัด GPS / แผนที่ -->
                        <button onclick="event.stopPropagation(); openMapModal('${item.orderNo}');" title="ดูพิกัดแปลง/โรงงานบนแผนที่ (GPS)" class="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[11px] font-bold transition-all shadow-xs flex items-center">
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

    // Modal เรนเดอร์ฟอร์ม BPM ฉบับเต็มตาม Green River Panels Wood Pellets Form
    renderBpmModalContent: function (item) {
        if (!item) return '';

        const ra = item.step2 || {};
        const pz = item.step4_pelletizing || {};
        const qa = item.step4 || {};
        const wh = item.step5 || {};
        const ship = item.step6 || {};

        return `
            <div class="p-6 md:p-8 space-y-5 bpm-print-container">
                <!-- Header ของเอกสาร BPM (ใบฟอร์มทางการ) -->
                <div class="bpm-doc-header border-b-2 border-slate-900 pb-4 mb-4">
                    <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div class="space-y-1">
                            <div class="flex items-center space-x-2">
                                <span class="text-xs font-black tracking-widest text-indigo-900 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                    GREEN RIVER PANELS (THAILAND) CO., LTD
                                </span>
                                <span class="text-[10px] text-slate-500 font-mono">ISO 9001:2015 / SBP-Certified</span>
                            </div>
                            <h1 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
                                WOOD PELLETS OPERATIONS BPM MASTER FORM
                            </h1>
                            <p class="text-xs text-slate-600">
                                ใบติดตามกระบวนการดำเนินงานและควบคุมคุณภาพเม็ดไม้ชีวมวลครบวงจร (7-Step Lifecycle)
                            </p>
                        </div>

                        <!-- กล่องข้อมูลเลขอ้างอิงหัวเอกสาร -->
                        <div class="bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs min-w-[240px] shadow-sm">
                            <div class="grid grid-cols-2 gap-x-2 gap-y-1">
                                <span class="text-slate-500 font-medium">Application No:</span>
                                <span class="text-slate-900 font-bold font-mono text-right">${item.applicationNo || 'APP-2026-09821'}</span>

                                <span class="text-slate-500 font-medium">Issue Date:</span>
                                <span class="text-slate-900 font-semibold text-right">2026/10/07</span>

                                <span class="text-slate-500 font-medium">Current Status:</span>
                                <span class="text-right">
                                    <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${item.statusBadge === 'On Schedule' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                                        ${item.statusBadge || 'In Production'} (Step ${item.currentStep || 1})
                                    </span>
                                </span>

                                <span class="text-slate-500 font-medium">Applicant:</span>
                                <span class="text-slate-700 text-right text-[11px] truncate">Operations Dept.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 1. Sale Department -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-cart-shopping mr-2 text-blue-400 no-print"></i> 1. SALE DEPARTMENT — ข้อมูลคำสั่งซื้อและลูกค้า</span>
                        <span class="text-[10px] bg-blue-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 1</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Customer Code:</strong> <span class="text-slate-800 font-medium">${item.customerCode || '02545'}</span></div>
                        <div><strong class="text-slate-500 block">Customer Name:</strong> <span class="text-slate-900 font-bold">${item.customer}</span></div>
                        <div><strong class="text-slate-500 block">PO No.:</strong> <span class="text-indigo-700 font-bold font-mono text-sm">${item.poNo || 'PO-2026-09821'}</span></div>

                        <div><strong class="text-slate-500 block">Order No.:</strong> <span class="text-slate-900 font-bold font-mono">${item.orderNo}</span></div>
                        <div><strong class="text-slate-500 block">MO No.:</strong> <span class="text-slate-800 font-mono">${item.moNo || 'MO-672649852'}</span></div>
                        <div><strong class="text-slate-500 block">Product Name:</strong> <span class="text-slate-800 font-medium">${item.productName || 'Industrial Wood Pellets (Bio-Fuel)'}</span></div>

                        <div><strong class="text-slate-500 block">Product Code:</strong> <span class="text-slate-800 font-mono">${item.productCode || 'PRD-88204-X'}</span></div>
                        <div><strong class="text-slate-500 block">Order Quantity:</strong> <span class="text-amber-700 font-bold text-sm">${item.orderQuantity || '500 Ton'}</span></div>
                        <div><strong class="text-slate-500 block">Product Type:</strong> <span class="text-slate-800">${item.productType || '1-0.6mm, 2-0.8mm'}</span></div>

                        <div class="md:col-span-3 border-t border-slate-100 pt-2"><strong class="text-slate-500">Certificates Required:</strong> <span class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold border border-slate-200 ml-1">${item.certRequirement || 'SPB, GGL, FSC-100%'}</span></div>
                        <div class="md:col-span-3"><strong class="text-slate-500">Customer Specification:</strong> <span class="text-slate-700">${item.customerReq || 'High precision pressure resistance up to 350 bar with rust-proof coating'}</span></div>
                        <div class="md:col-span-3"><strong class="text-slate-500">Delivery Schedule & Destination:</strong> <span class="text-slate-900 font-semibold">${item.requestedDeliveryDate || '2026/12/15'} &bull; ${item.shipToLocation || item.destination}</span></div>
                    </div>
                </div>

                <!-- 2. RA — Regulatory / Requirement -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-stamp mr-2 text-indigo-400 no-print"></i> 2. RA — REGULATORY & COMPLIANCE REQUIREMENTS (ใบอนุญาตและข้อกำหนด)</span>
                        <span class="text-[10px] bg-indigo-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 2</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Certificate Status:</strong> <span class="text-emerald-700 font-bold">${ra.certStatus || 'APPROVED & VALID (Valid through 2028-12-31)'}</span></div>
                        <div><strong class="text-slate-500 block">License / Permit Expired:</strong> <span class="text-slate-800">${ra.licenseExpiry || '2027-09-30'} (Active)</span></div>

                        <!-- กล่อง EUDR Due Diligence & Geolocation Verification -->
                        <div class="md:col-span-2 bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <span class="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block mb-1">
                                    <i class="fa-solid fa-earth-europe mr-1"></i> EUDR Geolocation Verified
                                </span>
                                <div class="text-xs font-bold text-slate-800">
                                    พิกัดแปลง/โรงงาน: <span class="font-mono text-indigo-700">${item.location?.lat || 7.0089}, ${item.location?.lng || 100.4767}</span>
                                    <span class="font-normal text-slate-600 ml-1">(${item.location?.placeName || 'โรงงาน Green River Panels'})</span>
                                </div>
                                <div class="text-[11px] text-slate-500">รหัสแปลง: <span class="font-mono font-semibold">${item.location?.plotId || 'PLOT-EUDR-202601'}</span> &bull; สถานะ: <span class="text-emerald-700 font-semibold">${item.location?.eudrStatus || 'Verified'}</span></div>
                            </div>
                            <button type="button" onclick="openMapModal('${item.orderNo}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center shrink-0">
                                <i class="fa-solid fa-location-dot mr-1.5"></i> ตรวจสอบแผนที่ GPS
                            </button>
                        </div>

                        <div class="md:col-span-2"><strong class="text-slate-500">Specification Req:</strong> <span class="text-slate-800">${ra.specReq || 'EN 10204 3.1 Material Certification, ASME B16.34 Class 2500, Hydrostatic Test 525 bar'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500">Label Requirement:</strong> <span class="text-slate-800">${ra.labelReq || 'QR-Code Barcode Label (100x150 mm) containing PO No., Serial Range, Batch No., CoA URL'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500">Packaging Requirement:</strong> <span class="text-slate-800">${ra.packagingReq || 'VCI Anti-Corrosion Vacuum Sealed Polybags, Wooden Crates with ShockWatch stickers'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500">Customer Regulatory:</strong> <span class="text-slate-800">${ra.customerRegulatory || 'RoHS 3 (EU 2015/863) & REACH Compliance, PED 2014/68/EU Module H, TISI / มอก.'}</span></div>
                        <div><strong class="text-slate-500">Transportation Permit Expiry:</strong> <span class="text-rose-700 font-semibold">${ra.transportExpiry || '2027-03-31'}</span></div>
                    </div>
                </div>

                <!-- 3. Production — Woods material planning -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-tree mr-2 text-amber-400 no-print"></i> 3. PRODUCTION — WOODS MATERIAL PLANNING (การวางแผนวัตถุดิบไม้)</span>
                        <span class="text-[10px] bg-amber-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 3</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Planned Quantity:</strong> <span class="text-slate-900 font-bold">${(item.step3?.planned || 20000).toLocaleString()} Ton</span></div>
                        <div><strong class="text-slate-500 block">Actual Quantity:</strong> <span class="text-amber-700 font-bold">${(item.step3?.actual || 15000).toLocaleString()} Ton</span></div>
                        <div><strong class="text-slate-500 block">Start Date:</strong> <span class="text-slate-800">${item.step3?.startDate || '2026/10/12'}</span></div>
                        <div><strong class="text-slate-500 block">Finish Date:</strong> <span class="text-slate-800">${item.step3?.finishDate || '2026/10/02'}</span></div>

                        <div class="md:col-span-4 border-t border-slate-100 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <strong class="text-slate-500">แหล่งกำเนิดแปลงไม้ (Plot Source):</strong> 
                                <span class="text-slate-900 font-semibold ml-1">${item.location?.placeName || 'แปลงสวนไม้ยางพารา สุราษฎร์ธานี'}</span>
                                <span class="text-slate-500 ml-1">(${item.location?.areaRai || '250 ไร่'})</span>
                                <span class="font-mono text-indigo-600 ml-1 font-semibold">[GPS: ${item.location?.lat || '-'}, ${item.location?.lng || '-'}]</span>
                            </div>
                            <button type="button" onclick="openMapModal('${item.orderNo}')" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center shrink-0">
                                <i class="fa-solid fa-map-location-dot mr-1 text-amber-600"></i> ดูแผนที่แปลงไม้
                            </button>
                        </div>

                        <div class="md:col-span-4 border-t border-slate-100 pt-2"><strong class="text-slate-500">Raw Material Machinery:</strong> 
                            <span class="text-slate-800 ml-1">Hummer mill (Active), Flaker 3 (Standby), Flaker 4 (Active)</span>
                        </div>
                    </div>
                </div>

                <!-- 4. Production Pelletizing (QC) — ผลิตจริง -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-gauge mr-2 text-orange-400 no-print"></i> 4. PRODUCTION PELLETIZING & IN-LINE QC (การอัดเม็ดไม้และควบคุมคุณภาพหน้าเตา)</span>
                        <span class="text-[10px] bg-orange-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 4</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Yield Output:</strong> <span class="text-slate-900 font-bold">${pz.yield || '90,000 Ton'}</span></div>
                        <div><strong class="text-slate-500 block">Total Downtime:</strong> <span class="text-rose-700 font-bold">${(pz.totalDowntimeMins || 4000).toLocaleString()} นาที</span></div>
                        <div><strong class="text-slate-500 block">Wood Pellet Diameter:</strong> <span class="text-indigo-700 font-bold">${pz.pelletDiameter || '6.0 mm'}</span></div>
                        <div><strong class="text-slate-500 block">Pellet Moisture:</strong> <span class="text-cyan-700 font-bold">${pz.pelletMoisture || '7.8%'}</span></div>

                        <div><strong class="text-slate-500 block">Cooling Moisture:</strong> <span class="text-emerald-700 font-bold">${pz.coolingMoisture || '6.5%'}</span></div>
                        <div class="md:col-span-3"><strong class="text-slate-500 block">Production Downtime / Note:</strong> <span class="text-slate-700 bg-rose-50/70 border border-rose-200 px-2 py-0.5 rounded inline-block text-[11px]">${pz.issue || 'Screen blockage on Hummer mill & die temperature check'}</span></div>
                    </div>
                </div>

                <!-- 5. QA — ผลการตรวจสอบคุณภาพ -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-microscope mr-2 text-purple-400 no-print"></i> 5. QUALITY ASSURANCE (QA) & CERTIFICATE OF ANALYSIS (COA)</span>
                        <span class="text-[10px] bg-purple-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 5</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Sample No:</strong> <span class="text-slate-800 font-mono">${qa.sampleNo || '1-4'}</span></div>
                        <div><strong class="text-slate-500 block">Test Date:</strong> <span class="text-slate-800">${qa.testDate || '2026-10-09'}</span></div>
                        <div><strong class="text-slate-500 block">Lead QC Analyst:</strong> <span class="text-slate-800 font-medium">${qa.analyst || 'NL-4092 (Somchai P.)'}</span></div>

                        <div class="md:col-span-3 border-t border-slate-100 pt-2"><strong class="text-slate-500">Specification Standard:</strong> <span class="text-slate-800">${qa.specification || 'ASTM A350 LF2 Class 1 (NACE MR0175 / ISO 15156)'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500">COA File Reference:</strong> <span class="text-indigo-700 font-bold font-mono">${qa.coaFile || 'COA-202610-LF2-03918.pdf'}</span></div>
                        <div><strong class="text-slate-500">Deviation / OOS:</strong> <span class="text-emerald-700 font-bold">${qa.deviation || 'None (Zero Deviation)'}</span></div>
                    </div>
                </div>

                <!-- 6. Warehouse / Storage — คลังสินค้า -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-warehouse mr-2 text-cyan-400 no-print"></i> 6. WAREHOUSE & STOCK MOVEMENT (คลังสินค้าและการจัดเก็บ)</span>
                        <span class="text-[10px] bg-cyan-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 6</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Storage Location:</strong> <span class="text-slate-900 font-bold">${wh.location || 'Warehouse 1 (Dry Bulk Bay)'}</span></div>
                        <div><strong class="text-slate-500 block">Big Bag Label No:</strong> <span class="text-slate-800 font-mono">${wh.bigBagLabelNo || 'BB-202610-04159'}</span></div>
                        <div><strong class="text-slate-500 block">Material Code:</strong> <span class="text-slate-800 font-mono">${wh.material || 'BWP-11-08 / BWP-12-08'}</span></div>

                        <div><strong class="text-slate-500 block">Opening Stock (ยอดยกมา):</strong> <span class="text-slate-800 font-semibold">${wh.openingStock || '1,000 Ton'}</span></div>
                        <div><strong class="text-slate-500 block">Total Issue (จ่ายออก):</strong> <span class="text-rose-700 font-semibold">${wh.issueQty || '300 Ton'}</span></div>
                        <div><strong class="text-slate-500 block">Closing Stock (คงเหลือ):</strong> <span class="text-emerald-700 font-bold">${wh.closingStock || '1,200 Ton'}</span></div>
                    </div>
                </div>

                <!-- 7. Shipment — ขนส่งและโลจิสติกส์ -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-ship mr-2 text-teal-400 no-print"></i> 7. SHIPMENT & EXPORT LOGISTICS (การจัดส่งและส่งออกทางเรือ)</span>
                        <span class="text-[10px] bg-teal-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 7</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">SA Number:</strong> <span class="text-slate-900 font-bold font-mono">${ship.saNo || 'CPM2600100'}</span></div>
                        <div><strong class="text-slate-500 block">Destination Port (POD):</strong> <span class="text-slate-900 font-bold">${item.destination}</span></div>
                        <div><strong class="text-slate-500 block">Shipping Line:</strong> <span class="text-indigo-700 font-bold">${ship.shippingLine || 'EVG'}</span></div>
                        <div><strong class="text-slate-500 block">Booking No.:</strong> <span class="text-slate-900 font-mono">${ship.bookingNo || '09050012456'}</span></div>

                        <div><strong class="text-slate-500 block">Loading Date:</strong> <span class="text-slate-800">${ship.loadingDate || '30/09/26'}</span></div>
                        <div><strong class="text-slate-500 block">ETD (Estimated Departure):</strong> <span class="text-emerald-700 font-bold">${ship.etd || '10/10/26'}</span></div>
                        <div><strong class="text-slate-500 block">ETA (Estimated Arrival):</strong> <span class="text-slate-800">${ship.eta || '10/11/26'}</span></div>
                        <div><strong class="text-slate-500 block">Transit Time:</strong> <span class="text-indigo-700 font-semibold">${ship.transitTime || '30 days'}</span></div>
                    </div>
                </div>

                <!-- ช่องลงนามอนุมัติเอกสาร (Sign-off & Approval Section) -->
                <!--<div class="bpm-step-card border border-slate-400 rounded-lg p-4 bg-slate-50/50 mt-4 page-break-inside:avoid">
                    <p class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
                        บันทึกการตรวจสอบและอนุมัติ (Verification & Approval Signatures)
                    </p>
                    <div class="grid grid-cols-3 gap-4 text-center text-xs">
                        <div class="border border-dashed border-slate-300 rounded p-3 bg-white">
                            <p class="text-[10px] text-slate-500 font-semibold">ผู้จัดทำ (Prepared By)</p>
                            <div class="h-10 border-b border-slate-300 my-2"></div>
                            <p class="font-bold text-slate-800">เจ้าหน้าที่ฝ่ายผลิต / วางแผน</p>
                            <p class="text-[10px] text-slate-400">วันที่: ..... / ..... / .........</p>
                        </div>
                        <div class="border border-dashed border-slate-300 rounded p-3 bg-white">
                            <p class="text-[10px] text-slate-500 font-semibold">ผู้ตรวจสอบคุณภาพ (Verified By QA)</p>
                            <div class="h-10 border-b border-slate-300 my-2"></div>
                            <p class="font-bold text-slate-800">หัวหน้าฝ่ายควบคุมคุณภาพ (QA Lead)</p>
                            <p class="text-[10px] text-slate-400">วันที่: ..... / ..... / .........</p>
                        </div>
                        <div class="border border-dashed border-slate-300 rounded p-3 bg-white">
                            <p class="text-[10px] text-slate-500 font-semibold">ผู้อนุมัติขั้นสุดท้าย (Approved By)</p>
                            <div class="h-10 border-b border-slate-300 my-2"></div>
                            <p class="font-bold text-slate-800">ผู้จัดการฝ่ายปฏิบัติการ (Operations Mgr)</p>
                            <p class="text-[10px] text-slate-400">วันที่: ..... / ..... / .........</p>
                        </div>
                    </div>
                </div>
                -->

                <!-- Footer ท้ายหน้าพิมพ์ -->
                <div class="text-[9px] text-slate-400 flex items-center justify-between border-t border-slate-200 pt-2">
                    <span>Green River Panels (Thailand) Co., Ltd — Wood Pellets Operations BPM</span>
                    <span>Printed Date: ${new Date().toLocaleDateString('th-TH')} &bull; Document Confidential</span>
                </div>
            </div>
        `;
    },

    // สร้างหน้าเอกสารทางการ Green River Panels Wood Pellets BPM Master Form สำหรับพิมพ์ A4 Portrait สะอาดบริสุทธิ์ 100%
    renderBpmPrintDocument: function (item) {
        if (!item) return '';

        const ra = item.step2 || {};
        const pz = item.step4_pelletizing || {};
        const qa = item.step4 || {};
        const wh = item.step5 || {};
        const ship = item.step6 || {};
        const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "Green River Panels Hat Yai", plotId: "FAC-GRP-01", areaRai: "โรงงานแปรรูป" };
        const progress = typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 50;

        return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>BPM_Master_Form_${item.orderNo}_${item.moNo || 'MO'}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 8mm 10mm 10mm 10mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 8px 12px;
            font-size: 11px;
            line-height: 1.4;
        }
        .bpm-print-wrap {
            width: 100%;
            max-width: 100%;
            background: #ffffff;
        }
        .header-box {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 8px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .company-name {
            font-size: 11px;
            font-weight: 900;
            color: #312e81;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .doc-title {
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
            margin: 2px 0;
            letter-spacing: -0.3px;
        }
        .doc-sub {
            font-size: 10px;
            color: #475569;
        }
        .meta-card {
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 10px;
            min-width: 230px;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
        }
        .meta-label {
            color: #64748b;
            font-weight: 600;
        }
        .meta-val {
            font-weight: 700;
            color: #0f172a;
            text-align: right;
        }
        .step-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            margin-bottom: 7px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .step-header {
            background: #1e293b;
            color: #ffffff;
            padding: 4px 10px;
            font-size: 10px;
            font-weight: 800;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .step-badge {
            background: #4f46e5;
            color: #ffffff;
            font-size: 9px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 4px;
        }
        .step-body {
            padding: 6px 10px;
            background: #ffffff;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px 12px;
            font-size: 10px;
        }
        .step-body.grid-2 {
            grid-template-columns: repeat(2, 1fr);
        }
        .step-body.grid-4 {
            grid-template-columns: repeat(4, 1fr);
        }
        .field-col {
            display: flex;
            flex-direction: column;
        }
        .field-col.col-span-2 {
            grid-column: span 2;
        }
        .field-col.col-span-3 {
            grid-column: span 3;
        }
        .field-col.col-span-4 {
            grid-column: span 4;
        }
        .field-label {
            color: #64748b;
            font-size: 9px;
            font-weight: 600;
            margin-bottom: 1px;
        }
        .field-value {
            color: #0f172a;
            font-weight: 600;
        }
        .highlight-val {
            color: #4338ca;
            font-weight: 800;
        }
        .highlight-qty {
            color: #b45309;
            font-weight: 800;
        }
        .highlight-ok {
            color: #047857;
            font-weight: 700;
        }
        .eudr-box {
            grid-column: span 2;
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            border-radius: 5px;
            padding: 5px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .footer-note {
            margin-top: 8px;
            border-top: 1px solid #e2e8f0;
            padding-top: 4px;
            display: flex;
            justify-content: space-between;
            font-size: 8.5px;
            color: #94a3b8;
        }
        .print-btn-float {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 9999;
            background: #4f46e5;
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        @media print {
            .print-btn-float { display: none !important; }
        }
    </style>
</head>
<body>
    <button class="print-btn-float" onclick="window.print()">🖨️ สั่งพิมพ์เอกสาร / บันทึกเป็น PDF</button>

    <div class="bpm-print-wrap">
        <!-- Header -->
        <div class="header-box">
            <div>
                <div class="company-name">GREEN RIVER PANELS (THAILAND) CO., LTD</div>
                <h1 class="doc-title">WOOD PELLETS OPERATIONS BPM MASTER FORM</h1>
                <div class="doc-sub">เอกสารควบคุมกระบวนการผลิตและตรวจสอบย้อนกลับชีวมวลอัดเม็ดครบวงจร (7-Step Lifecycle)</div>
            </div>
            <div class="meta-card">
                <div class="meta-row"><span class="meta-label">Application No:</span><span class="meta-val">${item.applicationNo || 'APP-2026-09821'}</span></div>
                <div class="meta-row"><span class="meta-label">Order No:</span><span class="meta-val highlight-val">${item.orderNo}</span></div>
                <div class="meta-row"><span class="meta-label">MO Number:</span><span class="meta-val">${item.moNo || '-'}</span></div>
                <div class="meta-row"><span class="meta-label">Issue Date:</span><span class="meta-val">${new Date().toLocaleDateString('th-TH')}</span></div>
                <div class="meta-row"><span class="meta-label">Lifecycle Status:</span><span class="meta-val highlight-ok">Step ${item.currentStep || 1} (${progress}%)</span></div>
            </div>
        </div>

        <!-- 1. Sale Department -->
        <div class="step-card">
            <div class="step-header">
                <span>1. SALE DEPARTMENT — ข้อมูลคำสั่งซื้อและลูกค้า</span>
                <span class="step-badge">Step 1</span>
            </div>
            <div class="step-body">
                <div class="field-col"><span class="field-label">Customer Name:</span><span class="field-value">${item.customer}</span></div>
                <div class="field-col"><span class="field-label">Customer Code:</span><span class="field-value">${item.customerCode || '02545'}</span></div>
                <div class="field-col"><span class="field-label">PO Number:</span><span class="field-value highlight-val">${item.poNo || 'PO-2026-09821'}</span></div>

                <div class="field-col"><span class="field-label">Product Name:</span><span class="field-value">${item.productName || 'Industrial Wood Pellets (Bio-Fuel)'}</span></div>
                <div class="field-col"><span class="field-label">Product Code:</span><span class="field-value">${item.productCode || 'PRD-88204-X'}</span></div>
                <div class="field-col"><span class="field-label">Order Quantity:</span><span class="field-value highlight-qty">${item.orderQuantity || '500 Ton'}</span></div>

                <div class="field-col"><span class="field-label">Product Specification:</span><span class="field-value">${item.productType || '1-0.6mm, 2-0.8mm'}</span></div>
                <div class="field-col"><span class="field-label">Requested Delivery Date:</span><span class="field-value highlight-ok">${item.requestedDeliveryDate || item.orderDate || '2026/12/15'}</span></div>
                <div class="field-col"><span class="field-label">Destination (POD):</span><span class="field-value">${item.destination}</span></div>

                <div class="field-col col-span-3"><span class="field-label">Certificates Required:</span><span class="field-value">${item.certRequirement || 'SBP, GGL, FSC-100%'}</span></div>
            </div>
        </div>

        <!-- 2. RA Regulatory & EUDR -->
        <div class="step-card">
            <div class="step-header">
                <span>2. RA — REGULATORY & COMPLIANCE REQUIREMENTS (ใบอนุญาตและข้อกำหนด EUDR)</span>
                <span class="step-badge">Step 2</span>
            </div>
            <div class="step-body grid-2">
                <div class="field-col"><span class="field-label">Certificate Status:</span><span class="field-value highlight-ok">${ra.certStatus || 'APPROVED & VALID (Valid through 2028-12-31)'}</span></div>
                <div class="field-col"><span class="field-label">License / Permit Expiry:</span><span class="field-value">${ra.licenseExpiry || '2027-09-30 (Active)'}</span></div>

                <div class="eudr-box">
                    <div>
                        <div style="font-weight: 800; color: #065f46; font-size: 9.5px;">🌲 EUDR GEOLOCATION VERIFIED & DUE DILIGENCE READY</div>
                        <div style="color: #047857; font-size: 9px; margin-top: 1px;">
                            แปลง: <strong>${loc.placeName}</strong> &bull; รหัสแปลง: <strong>${loc.plotId}</strong> &bull; พื้นที่: <strong>${loc.areaRai}</strong>
                        </div>
                    </div>
                    <div style="text-align: right; font-family: monospace; font-weight: bold; color: #065f46; font-size: 9px;">
                        📍 ${loc.lat}, ${loc.lng}
                    </div>
                </div>

                <div class="field-col col-span-2"><span class="field-label">Packaging & Labeling Specification:</span><span class="field-value">${ra.packagingReq || '1,000 kg UV-Resistant Big Bag with Inner Liner, QR-Code Traceability Label'}</span></div>
            </div>
        </div>

        <!-- 3. Woods Planning -->
        <div class="step-card">
            <div class="step-header">
                <span>3. PRODUCTION — WOODS MATERIAL PLANNING (การวางแผนวัตถุดิบไม้)</span>
                <span class="step-badge">Step 3</span>
            </div>
            <div class="step-body">
                <div class="field-col"><span class="field-label">Planned Quantity:</span><span class="field-value highlight-val">20,000 Ton</span></div>
                <div class="field-col"><span class="field-label">Actual Quantity:</span><span class="field-value highlight-qty">15,000 Ton</span></div>
                <div class="field-col"><span class="field-label">Production Period:</span><span class="field-value">2026/10/02 - 2026/10/12</span></div>

                <div class="field-col col-span-3"><span class="field-label">Wood Source & Plantation Site:</span><span class="field-value">${loc.placeName} (${loc.areaRai}) &bull; พิกัด: [${loc.lat}, ${loc.lng}] &bull; ไม้ยางพารา (Hevea Brasiliensis)</span></div>
                <div class="field-col col-span-3"><span class="field-label">Active Machinery:</span><span class="field-value">Hummer mill (Active), Flaker 3 (Standby), Flaker 4 (Active)</span></div>
            </div>
        </div>

        <!-- 4. Pelletizing & In-Line QC -->
        <div class="step-card">
            <div class="step-header">
                <span>4. PRODUCTION PELLETIZING & IN-LINE QC (การอัดเม็ดไม้และควบคุมคุณภาพหน้าเตา)</span>
                <span class="step-badge">Step 4</span>
            </div>
            <div class="step-body grid-4">
                <div class="field-col"><span class="field-label">Yield Output:</span><span class="field-value highlight-ok">${pz.yield || '90,000 Ton'}</span></div>
                <div class="field-col"><span class="field-label">Pellet Diameter:</span><span class="field-value">${pz.pelletDiameter || '6.0 mm'}</span></div>
                <div class="field-col"><span class="field-label">Pellet Moisture:</span><span class="field-value">${pz.pelletMoisture || '7.8%'} (&lt; 8%)</span></div>
                <div class="field-col"><span class="field-label">Cooling Moisture:</span><span class="field-value">${pz.coolingMoisture || '6.5%'}</span></div>
                <div class="field-col col-span-4"><span class="field-label">Maintenance & Downtime:</span><span class="field-value">Total Downtime: ${pz.totalDowntimeMins || 420} นาที &bull; Issue: ${pz.issue || 'Die temperature stabilization and normal maintenance'}</span></div>
            </div>
        </div>

        <!-- 5. QA Lab Inspection -->
        <div class="step-card">
            <div class="step-header">
                <span>5. QA — LAB QUALITY ASSURANCE (ผลตรวจวิเคราะห์ในห้องปฏิบัติการ)</span>
                <span class="step-badge">Step 5</span>
            </div>
            <div class="step-body">
                <div class="field-col"><span class="field-label">Inspection Status:</span><span class="field-value highlight-ok">${qa.status || 'Zero Deviation (Pass)'}</span></div>
                <div class="field-col"><span class="field-label">COA Number:</span><span class="field-value highlight-val">${qa.coaFile || 'COA-202610-LF2-03918'}</span></div>
                <div class="field-col"><span class="field-label">Lead Inspector:</span><span class="field-value">${qa.analyst || 'NL-4092 Somchai P. / Lead QC'}</span></div>

                <div class="field-col"><span class="field-label">Net Calorific Value:</span><span class="field-value highlight-ok">&gt; 16.8 MJ/kg (Standard: &gt; 16.5 MJ/kg)</span></div>
                <div class="field-col"><span class="field-label">Ash Content:</span><span class="field-value highlight-ok">0.68% (Standard: &lt; 1.5%)</span></div>
                <div class="field-col"><span class="field-label">Fines Content (เม็ดแตก):</span><span class="field-value highlight-ok">0.45% (Standard: &lt; 1.0%)</span></div>
            </div>
        </div>

        <!-- 6. Warehouse & Packing -->
        <div class="step-card">
            <div class="step-header">
                <span>6. WAREHOUSE & PACKING (คลังสินค้าและการบรรจุ)</span>
                <span class="step-badge">Step 6</span>
            </div>
            <div class="step-body grid-4">
                <div class="field-col"><span class="field-label">Warehouse No:</span><span class="field-value">${wh.location || 'Warehouse 1'}</span></div>
                <div class="field-col"><span class="field-label">Opening Stock:</span><span class="field-value">${wh.openingStock || '1,000 Ton'}</span></div>
                <div class="field-col"><span class="field-label">Issue Quantity:</span><span class="field-value highlight-qty">${wh.issueQty || '300 Ton'}</span></div>
                <div class="field-col"><span class="field-label">Closing Stock:</span><span class="field-value highlight-ok">${wh.closingStock || '1,200 Ton'}</span></div>
            </div>
        </div>

        <!-- 7. Shipment & Logistics -->
        <div class="step-card">
            <div class="step-header">
                <span>7. SHIPMENT & EXPORT LOGISTICS (การจัดส่งและส่งออกทางเรือ)</span>
                <span class="step-badge">Step 7</span>
            </div>
            <div class="step-body grid-4">
                <div class="field-col"><span class="field-label">SA Number:</span><span class="field-value highlight-val">${ship.saNo || 'CPM2600100'}</span></div>
                <div class="field-col"><span class="field-label">Shipping Line:</span><span class="field-value">${ship.shippingLine || 'EVG'}</span></div>
                <div class="field-col"><span class="field-label">Booking No:</span><span class="field-value">${ship.bookingNo || '09050012456'}</span></div>
                <div class="field-col"><span class="field-label">Transit Time:</span><span class="field-value">${ship.transitTime || '30 days'}</span></div>

                <div class="field-col"><span class="field-label">Loading Date:</span><span class="field-value">${ship.loadingDate || '30/09/26'}</span></div>
                <div class="field-col"><span class="field-label">ETD (Estimated Departure):</span><span class="field-value highlight-ok">${ship.etd || '10/10/26'}</span></div>
                <div class="field-col"><span class="field-label">ETA (Estimated Arrival):</span><span class="field-value">${ship.eta || '10/11/26'}</span></div>
                <div class="field-col"><span class="field-label">Destination Port (POD):</span><span class="field-value highlight-val">${item.destination}</span></div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer-note">
            <span>GREEN RIVER PANELS (THAILAND) CO., LTD &bull; WOOD PELLETS OPERATIONS BPM MASTER SYSTEM</span>
            <span>Printed Date: ${new Date().toLocaleDateString('th-TH')} &bull; Official Document (Confidential)</span>
        </div>
    </div>

    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 300);
        };
    </script>
</body>
</html>
        `;
    },

    // เรนเดอร์แถวในหน้า Order Query Table (เพิ่มคอลัมน์ลำดับหน้าสุด)
    renderQueryRow: function (item, rowIndex = 1) {
        const t = translations[currentLang];
        const statusText = item.statusBadge === "On Schedule" ? t.status_onschedule : t.status_inproduction;
        const statusBadgeClass = item.statusBadge === "On Schedule" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200";
        const progress = typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 0;
        const ship = item.step6 || {};

        const stepThemes = {
            1: "bg-blue-50 text-blue-700 border-blue-200",
            2: "bg-indigo-50 text-indigo-700 border-indigo-200",
            3: "bg-amber-50 text-amber-700 border-amber-200",
            4: "bg-orange-50 text-orange-700 border-orange-200",
            5: "bg-purple-50 text-purple-700 border-purple-200",
            6: "bg-cyan-50 text-cyan-700 border-cyan-200",
            7: "bg-teal-50 text-teal-700 border-teal-200"
        };
        const stepNames = {
            1: "1. Sale",
            2: "2. RA",
            3: "3. Woods Planning",
            4: "4. Pelletizing",
            5: "5. QA",
            6: "6. Warehouse",
            7: "7. Shipment"
        };
        const stepClass = stepThemes[item.currentStep] || "bg-slate-50 text-slate-700 border-slate-200";
        const stepName = stepNames[item.currentStep] || `Step ${item.currentStep}`;

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
                        <button onclick="openMapModal('${item.orderNo}')" title="คลิกดูพิกัดแปลง/โรงงาน (GPS)" class="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1 rounded transition-colors text-[10px]">
                            <i class="fa-solid fa-location-dot"></i>
                        </button>
                    </div>
                    ${item.location ? `<div class="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5 cursor-pointer hover:text-rose-600" onclick="openMapModal('${item.orderNo}')" title="${item.location.placeName}">📍 ${item.location.placeName.split('(')[0]}</div>` : ''}
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
                        <button onclick="openMapModal('${item.orderNo}')" title="ดูพิกัดแปลง/โรงงานบนแผนที่ (GPS)" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center">
                            <i class="fa-solid fa-location-dot mr-1 text-[11px]"></i> GPS
                        </button>
                        <button onclick="openBpmModal('${item.orderNo}')" title="${t.btn_view_bpm}" class="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-600 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center">
                            <i class="fa-solid fa-file-invoice mr-1 text-[11px]"></i> BPM
                        </button>
                        <button onclick="jumpToDashboardOrder('${item.orderNo}')" title="${t.btn_view_in_dashboard}" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center">
                            <i class="fa-solid fa-chart-pie mr-1 text-[11px]"></i> View
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    // เรนเดอร์ Pagination Control Bar
    renderPaginationControls: function (currentPage, totalPages, totalRecords, pageSize) {
        if (totalRecords === 0) return '';
        const t = translations[currentLang];
        const start = Math.min((currentPage - 1) * pageSize + 1, totalRecords);
        const end = Math.min(currentPage * pageSize, totalRecords);
        const infoText = t.pagination_info
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
                    <!-- Previous Button -->
                    <button onclick="goToQueryPage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold transition-all ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700'}">
                        <i class="fa-solid fa-chevron-left mr-1"></i> ก่อนหน้า
                    </button>

                    ${pageButtons}

                    <!-- Next Button -->
                    <button onclick="goToQueryPage(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold transition-all ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700'}">
                        ถัดไป <i class="fa-solid fa-chevron-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    },

    // เรนเดอร์ Pagination สำหรับตาราง Shipment ในหน้า Dashboard
    renderDashboardPaginationControls: function (currentPage, totalPages, totalRecords, pageSize) {
        if (totalRecords === 0) return '';
        const t = translations[currentLang];
        const start = Math.min((currentPage - 1) * pageSize + 1, totalRecords);
        const end = Math.min(currentPage * pageSize, totalRecords);
        const infoText = t.pagination_info
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
                    <!-- Previous Button -->
                    <button onclick="goToDashboardPage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 font-semibold transition-all ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700'}">
                        <i class="fa-solid fa-chevron-left mr-1"></i> ก่อนหน้า
                    </button>

                    ${pageButtons}

                    <!-- Next Button -->
                    <button onclick="goToDashboardPage(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 font-semibold transition-all ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700'}">
                        ถัดไป <i class="fa-solid fa-chevron-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    },

    // เรนเดอร์หน้าต่าง Modal แผนที่พิกัด GPS สำหรับ MO/Order
    renderMapModalContent: function (item) {
        if (!item) return '';
        const loc = item.location || {
            lat: 7.0089,
            lng: 100.4767,
            placeName: "โรงงาน Green River Panels หาดใหญ่-สงขลา",
            plotId: "FAC-GRP-01",
            areaRai: "โรงงานแปรรูป",
            eudrStatus: "EUDR Verified"
        };

        const bboxDelta = 0.035;
        const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - bboxDelta}%2C${loc.lat - bboxDelta}%2C${loc.lng + bboxDelta}%2C${loc.lat + bboxDelta}&layer=mapnik&marker=${loc.lat}%2C${loc.lng}`;
        const googleMapsUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;

        return `
            <div class="space-y-4">
                <!-- แถบข้อมูลสรุปคำสั่งซื้อและ EUDR Compliance -->
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div class="space-y-1">
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                MO: ${item.moNo || '-'}
                            </span>
                            <span class="text-xs font-bold text-slate-800">
                                Order: ${item.orderNo}
                            </span>
                            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-300">
                                <i class="fa-solid fa-shield-halved mr-1"></i> ${loc.eudrStatus}
                            </span>
                        </div>
                        <p class="text-xs text-slate-600">
                            ลูกค้า: <strong>${item.customer}</strong> &bull; ปริมาณ: <strong class="text-amber-700">${item.orderQuantity || '500 Ton'}</strong> &bull; ปลายทาง: ${item.destination}
                        </p>
                    </div>

                    <!-- ปุ่มลัดเปิด Google Maps จริง -->
                    <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0">
                        <i class="fa-solid fa-map-location-dot mr-2 text-sm"></i> เปิดดูใน Google Maps
                        <i class="fa-solid fa-arrow-up-right-from-square ml-1.5 text-[10px]"></i>
                    </a>
                </div>

                <!-- กรอบแผนที่ Interactive (OpenStreetMap Embed) -->
                <div class="relative w-full h-[360px] md:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        scrolling="no" 
                        marginheight="0" 
                        marginwidth="0" 
                        src="${osmEmbedUrl}"
                        class="w-full h-full"
                        title="Interactive Map"
                    ></iframe>

                    <!-- แถบหมุดลอยตัวบอกตำแหน่งมุมบนขวา -->
                    <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-300 shadow-md text-xs font-bold text-slate-800 flex items-center space-x-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                        <span>หมุดพิกัด: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</span>
                    </div>
                </div>

                <!-- แผงการ์ดข้อมูลพิกัด Geolocation ละเอียด -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <span class="text-[10px] text-slate-400 block font-medium">ชื่อสถานที่ / แหล่งกำเนิดไม้</span>
                        <span class="font-bold text-slate-800 mt-0.5 block truncate" title="${loc.placeName}">
                            ${loc.placeName}
                        </span>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <span class="text-[10px] text-slate-400 block font-medium">รหัสแปลงที่ดิน (Plot ID)</span>
                        <span class="font-mono font-bold text-indigo-700 mt-0.5 block">
                            ${loc.plotId}
                        </span>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <span class="text-[10px] text-slate-400 block font-medium">ขนาดพื้นที่แปลงเพาะปลูก</span>
                        <span class="font-bold text-emerald-700 mt-0.5 block">
                            ${loc.areaRai}
                        </span>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <span class="text-[10px] text-slate-400 block font-medium">พิกัด GPS (Lat, Lng)</span>
                        <span class="font-mono font-bold text-slate-800 mt-0.5 block">
                            ${loc.lat}, ${loc.lng}
                        </span>
                    </div>
                </div>

                <!-- ข้อความอธิบาย EUDR Traceability -->
                <div class="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start space-x-2">
                    <i class="fa-solid fa-circle-info text-indigo-500 mt-0.5 shrink-0"></i>
                    <span>ข้อมูลพิกัด Geolocation นี้ใช้สำหรับตรวจสอบย้อนกลับ (Traceability) และจัดทำเอกสาร Due Diligence Statement (DDS) ตามข้อบังคับสหภาพยุโรปว่าด้วยสินค้าที่ปลอดจากการทำลายป่าไม้ (EU Deforestation Regulation — EUDR)</span>
                </div>
            </div>
        `;
    },

    // เรนเดอร์หน้าแผนที่พิกัดรวมทั้งหมด (All Locations GIS Map with Dispersion Animation)
    renderMapOverviewView: function (orders) {
        const t = translations[currentLang];
        const dataList = orders || [];
        const totalPlots = dataList.length;

        // คำนวณสรุปตัวเลข
        let totalTon = 0;
        let totalAreaRai = 0;
        dataList.forEach(item => {
            const qtyNum = parseInt(String(item.orderQuantity || "0").replace(/[^0-9]/g, '')) || 0;
            totalTon += qtyNum;
            const loc = item.location || {};
            const raiNum = parseInt(String(loc.areaRai || "0").replace(/[^0-9]/g, '')) || 0;
            totalAreaRai += raiNum;
        });
        const displayAreaRai = totalAreaRai > 0 ? `${totalAreaRai.toLocaleString()} ไร่` : "14,500+ ไร่";

        // ช่วงพิกัดภูมิศาสตร์ภาคใต้ (Min/Max Lat-Lng สำหรับคำนวณตำแหน่ง %)
        const minLat = 5.8;
        const maxLat = 10.2;
        const minLng = 98.2;
        const maxLng = 102.2;

        // จุดศูนย์กลางรวมเริ่มต้น (Hat Yai Plant: Lat 7.0089, Lng 100.4767)
        const centerLat = 7.0089;
        const centerLng = 100.4767;
        const centerPercentX = (((centerLng - minLng) / (maxLng - minLng)) * 75 + 12).toFixed(2);
        const centerPercentY = (((maxLat - centerLat) / (maxLat - minLat)) * 75 + 12).toFixed(2);

        // สีและไอคอนแยกตามประเภทสถานที่
        const getMarkerTheme = (placeName) => {
            if (placeName.includes("โรงงาน")) {
                return { bg: "bg-indigo-600", text: "text-indigo-400", border: "border-indigo-400", ring: "bg-indigo-400", icon: "fa-industry", type: "Factory / Plant" };
            } else if (placeName.includes("ท่าเรือ")) {
                return { bg: "bg-cyan-600", text: "text-cyan-400", border: "border-cyan-400", ring: "bg-cyan-400", icon: "fa-ship", type: "Export Terminal" };
            } else {
                return { bg: "bg-emerald-600", text: "text-emerald-400", border: "border-emerald-400", ring: "bg-emerald-400", icon: "fa-tree", type: "Rubberwood Plantation" };
            }
        };

        // เรนเดอร์ Element หมุดแต่ละจุด
        const markersHtml = dataList.map((item, index) => {
            const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "Green River Hat Yai", plotId: "PLOT-01", areaRai: "200 ไร่" };
            
            // เพิ่มการกระจายตัวแบบสมจริงเพื่อไม่ให้หมุดซ้อนทับกันเป๊ะ
            const jitterX = ((index % 5) - 2) * 1.8;
            const jitterY = (((index * 3) % 5) - 2) * 1.5;

            // คำนวณตำแหน่งเป้าหมาย (%)
            let targetX = (((loc.lng - minLng) / (maxLng - minLng)) * 75 + 12 + jitterX);
            let targetY = (((maxLat - loc.lat) / (maxLat - minLat)) * 75 + 12 + jitterY);
            targetX = Math.max(8, Math.min(92, targetX)).toFixed(2);
            targetY = Math.max(8, Math.min(92, targetY)).toFixed(2);

            const theme = getMarkerTheme(loc.placeName);
            const delayMs = 250 + (index * 55); // Stagger Delay ให้ค่อยๆ กระจายตัวทีละจุด

            return `
                <div 
                    id="map-pin-${item.orderNo}"
                    class="map-marker-pin absolute cursor-pointer select-none z-20 group"
                    style="left: ${centerPercentX}%; top: ${centerPercentY}%; transform: translate(-50%, -50%) scale(0.6); opacity: 0; transition: all 1.35s cubic-bezier(0.34, 1.45, 0.64, 1); transition-delay: ${delayMs}ms;"
                    data-order="${item.orderNo}"
                    data-target-x="${targetX}"
                    data-target-y="${targetY}"
                    data-center-x="${centerPercentX}"
                    data-center-y="${centerPercentY}"
                    onclick="handleMarkerClick('${item.orderNo}')"
                >
                    <!-- ตัวหมุดและไอคอน -->
                    <div class="relative flex items-center justify-center">
                        <span class="absolute -inset-1 rounded-full ${theme.ring} opacity-40 animate-ping group-hover:opacity-80"></span>
                        <div class="relative w-8 h-8 rounded-full ${theme.bg} text-white flex items-center justify-center shadow-lg border-2 ${theme.border} transition-transform duration-200 group-hover:scale-125">
                            <i class="fa-solid ${theme.icon} text-xs"></i>
                        </div>
                    </div>

                    <!-- ป้ายชื่อกำกับสั้นๆ -->
                    <div class="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-slate-700 pointer-events-none group-hover:scale-110 transition-transform">
                        <span>${item.moNo || item.orderNo}</span>
                    </div>

                    <!-- Popover Tooltip แสดงข้อมูลด่วนเมื่อ Hover -->
                    <div class="hidden group-hover:block absolute bottom-11 left-1/2 -translate-x-1/2 w-56 bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none text-left animate-in fade-in zoom-in-95 duration-150">
                        <div class="text-[10px] font-black uppercase text-amber-400 mb-0.5">${theme.type}</div>
                        <div class="text-xs font-bold text-white truncate">${loc.placeName}</div>
                        <div class="text-[11px] text-slate-300 mt-1">
                            <div>MO: <strong class="text-indigo-300 font-mono">${item.moNo || '-'}</strong></div>
                            <div>Order: <strong class="text-white">${item.orderNo}</strong> (${item.customer.split(' ')[0]})</div>
                            <div>พิกัด: <strong class="text-emerald-300 font-mono">${loc.lat}, ${loc.lng}</strong></div>
                        </div>
                        <div class="text-[9px] text-emerald-400 mt-1.5 pt-1 border-t border-slate-800 flex items-center">
                            <i class="fa-solid fa-check mr-1"></i> ${loc.eudrStatus}
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // รายการการ์ดสถานที่ใน Sidebar ด้านข้าง
        const locationCardsHtml = dataList.map((item, idx) => {
            const loc = item.location || {};
            const theme = getMarkerTheme(loc.placeName || "");
            return `
                <div 
                    id="loc-card-${item.orderNo}" 
                    onclick="focusMapMarker('${item.orderNo}')"
                    class="p-3 bg-white hover:bg-indigo-50/70 border border-slate-200 rounded-xl cursor-pointer transition-all hover:border-indigo-300 shadow-2xs group"
                >
                    <div class="flex items-start justify-between gap-1">
                        <div class="flex items-center space-x-2">
                            <span class="w-6 h-6 rounded-lg ${theme.bg} text-white flex items-center justify-center text-[10px] shrink-0">
                                <i class="fa-solid ${theme.icon}"></i>
                            </span>
                            <div>
                                <span class="font-bold text-slate-800 text-xs block group-hover:text-indigo-600 transition-colors truncate max-w-[170px]" title="${loc.placeName}">
                                    ${loc.placeName || 'แปลงสวนไม้ยางพารา'}
                                </span>
                                <span class="text-[10px] text-slate-400 font-mono">${item.moNo || item.orderNo}</span>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">
                            ${item.orderQuantity || '500T'}
                        </span>
                    </div>

                    <div class="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>รหัส: <strong class="font-mono text-slate-700">${loc.plotId || '-'}</strong></span>
                        <span class="text-[10px] text-emerald-600 font-medium">📍 ${loc.lat}, ${loc.lng}</span>
                    </div>
                </div>
            `;
        }).join("");

        return `
            <div class="space-y-6">
                <!-- Header Card & Quick KPI Summary -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                                    <i class="fa-solid fa-satellite mr-1"></i> GIS MAPPING & TRACEABILITY
                                </span>
                                <span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-300">
                                    EUDR Compliance Ready
                                </span>
                            </div>
                            <h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center">
                                <i class="fa-solid fa-map-location-dot text-rose-500 mr-2.5"></i>
                                แผนที่พิกัดรวมแหล่งกำเนิดไม้และโรงงาน (EUDR Master GIS Overview)
                            </h2>
                            <p class="text-xs text-slate-500 mt-1">
                                แผนที่ดาวเทียมและภูมิศาสตร์แบบโต้ตอบ (Interactive GIS Map) จุดพิกัดขยับและซูมตามตำแหน่งจริง พร้อมระบบแอนิเมชันกระจายหมุดพิกัด
                            </p>
                        </div>

                        <!-- Action Controls: Header only keeps Return to Dashboard -->
                        <div class="flex items-center space-x-2.5 shrink-0">
                            <button 
                                type="button" 
                                onclick="switchView('dashboard')" 
                                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center shadow-2xs"
                            >
                                <i class="fa-solid fa-arrow-left mr-1.5"></i> กลับแดชบอร์ด
                            </button>
                        </div>
                    </div>

                    <!-- 4 Quick Stats Badges -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span class="text-slate-400 text-[11px] block font-medium">จำนวนพิกัดในระบบ</span>
                            <span class="text-lg font-black text-slate-900 mt-0.5 block">${totalPlots} จุดพิกัด</span>
                        </div>
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span class="text-slate-400 text-[11px] block font-medium">ปริมาณไม้ยางพารารวม</span>
                            <span class="text-lg font-black text-amber-600 mt-0.5 block">${totalTon.toLocaleString()} Ton</span>
                        </div>
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span class="text-slate-400 text-[11px] block font-medium">พื้นที่แปลงสวนไม้ยางพารา</span>
                            <span class="text-lg font-black text-emerald-600 mt-0.5 block">${displayAreaRai}</span>
                        </div>
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span class="text-slate-400 text-[11px] block font-medium">สถานะการรับรอง EUDR</span>
                            <span class="text-lg font-black text-indigo-600 mt-0.5 block">100% Verified</span>
                        </div>
                    </div>
                </div>

                <!-- Main Interactive Map Canvas + Location Sidebar -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- แผนที่ Leaflet GIS Map Canvas (3 ส่วน) -->
                    <div id="gisMapBoxWrapper" class="lg:col-span-3 bg-slate-950 rounded-3xl p-4 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col transition-all">
                        
                        <!-- Top Map Toolbar & Map Legend & Tile Switcher — วางปุ่มควบคุมและแอนิเมชันติดประชิดแผนที่ -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800 text-xs z-30 shrink-0">
                            <div class="flex items-center space-x-2 text-white">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span class="font-bold">Southern Thailand Wood Supply Chain & Export Corridor</span>
                                <span id="fullscreenNoticeBadge" class="hidden text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/50 px-2 py-0.5 rounded-full font-semibold">
                                    <i class="fa-solid fa-expand mr-1"></i> เต็มจอ (กด Esc หรือปุ่มย่อเพื่อออก)
                                </span>
                            </div>

                            <!-- Map Action Controls: ปุ่มเล่นแอนิเมชัน + รีเซ็ต + สลับแผนที่ + ขยายเต็มจอ (ติดกับแผนที่โดยตรง) -->
                            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <!-- ปุ่มเล่นแอนิเมชันกระจายหมุด (ติดกับแผนที่) -->
                                <button 
                                    type="button" 
                                    onclick="triggerMapDispersionAnimation()" 
                                    class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-all flex items-center border border-indigo-400/50 hover:scale-105 active:scale-95"
                                    title="เล่นแอนิเมชันรวมศูนย์และกระจายหมุดพิกัดอีกครั้ง"
                                >
                                    <i class="fa-solid fa-play mr-1.5 text-[10px] text-white"></i> เล่นแอนิเมชัน (Replay)
                                </button>

                                <!-- ปุ่มรีเซ็ตมุมมอง (ติดกับแผนที่) -->
                                <button 
                                    type="button" 
                                    onclick="resetLeafletMapView()" 
                                    class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-semibold shadow-xs transition-colors flex items-center hover:border-slate-500"
                                    title="รีเซ็ตมุมมองแผนที่ภาคใต้"
                                >
                                    <i class="fa-solid fa-arrows-rotate mr-1 text-[10px] text-slate-400"></i> รีเซ็ต
                                </button>

                                <!-- ตัวสลับ Street / Satellite -->
                                <div class="bg-slate-900 border border-slate-700 rounded-xl p-0.5 flex items-center space-x-1 text-[11px]">
                                    <button type="button" onclick="switchLeafletTile('osm')" id="btnTileOsm" class="px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white transition-all flex items-center">
                                        <i class="fa-solid fa-map mr-1 text-xs"></i> ถนน
                                    </button>
                                    <button type="button" onclick="switchLeafletTile('satellite')" id="btnTileSat" class="px-2.5 py-1 rounded-lg font-medium text-slate-300 hover:text-white transition-all flex items-center">
                                        <i class="fa-solid fa-satellite mr-1 text-xs"></i> ดาวเทียม
                                    </button>
                                </div>

                                <!-- ปุ่มขยายเต็มจอ (Fullscreen Button) -->
                                <button 
                                    type="button" 
                                    id="btnToggleMapFullscreen" 
                                    onclick="toggleMapFullscreen()" 
                                    class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-[11px] font-bold transition-all flex items-center shadow-xs hover:border-slate-500"
                                    title="ขยายแผนที่เต็มหน้าจอ (Fullscreen / F11 Mode)"
                                >
                                    <i id="btnFullscreenIcon" class="fa-solid fa-expand mr-1 text-indigo-400 text-xs"></i> 
                                    <span id="btnFullscreenText">เต็มจอ</span>
                                </button>
                            </div>
                        </div>

                        <!-- The Animated Leaflet Map Container (หมุดติดแน่นกับพิกัดจริง 100%) -->
                        <div id="gisMapViewport" class="relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
                            
                            <!-- Leaflet Container -->
                            <div id="leafletMap" class="w-full h-full z-10"></div>

                            <!-- Floating Quick Fullscreen Button บนมุมขวาบนของ Map Viewport -->
                            <button 
                                type="button" 
                                id="floatingFullscreenBtn"
                                onclick="toggleMapFullscreen()" 
                                class="absolute top-3 right-3 z-30 bg-slate-900/90 hover:bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
                                title="ขยาย/ย่อเต็มหน้าจอ (Toggle Fullscreen)"
                            >
                                <i id="floatingFullscreenIcon" class="fa-solid fa-expand text-xs text-indigo-300"></i>
                            </button>

                            <!-- Floating Quick Action Controls: Replay & Reset ติดบนผืนแผนที่โดยตรง (เด่นชัดตลอดเวลา) -->
                            <div id="mapFloatingQuickControls" class="absolute top-3 left-14 z-30 flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl">
                                <button 
                                    type="button" 
                                    onclick="triggerMapDispersionAnimation()" 
                                    class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-all flex items-center border border-indigo-400/50 hover:scale-105 active:scale-95"
                                    title="เล่นแอนิเมชันรวมศูนย์และกระจายหมุดพิกัดอีกครั้ง"
                                >
                                    <i class="fa-solid fa-play mr-1.5 text-[10px] text-white"></i> เล่นแอนิเมชันกระจายหมุด (Replay)
                                </button>
                                <button 
                                    type="button" 
                                    onclick="resetLeafletMapView()" 
                                    class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-semibold transition-all flex items-center border border-slate-600 hover:border-slate-400 shadow-xs"
                                    title="รีเซ็ตมุมมองแผนที่ภาคใต้"
                                >
                                    <i class="fa-solid fa-arrows-rotate mr-1 text-[10px] text-slate-400"></i> รีเซ็ต
                                </button>
                            </div>

                            <!-- การ์ด Modal รายละเอียดเมื่อคลิกหมุด (Marker Detail Popup Card) -->
                            <div id="markerDetailPopup" class="hidden absolute bottom-5 left-5 right-5 sm:right-auto sm:w-96 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700 z-50 transition-all">
                                <div id="markerDetailPopupContent"></div>
                            </div>

                            <!-- แถบคำแนะนำการใช้งานมุมล่างขวา -->
                            <div class="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm text-slate-300 text-[10px] px-3 py-1 rounded-xl border border-slate-700 pointer-events-none z-30 flex items-center space-x-1.5 shadow-md">
                                <i class="fa-solid fa-hand-pointer text-indigo-400"></i>
                                <span>คลิกหมุดดูรายละเอียด & ซูมเข้า-ออกหมุดจะขยับตามพิกัดจริง</span>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar: รายชื่อแปลงและโรงงานทั้งหมด (1 ส่วน) -->
                    <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col h-[600px] lg:h-[685px]">
                        <div class="pb-3 border-b border-slate-100 space-y-2">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center justify-between">
                                <span class="flex items-center">
                                    <i class="fa-solid fa-list-check text-indigo-600 mr-2"></i>
                                    รายการพิกัด (${totalPlots})
                                </span>
                                <span class="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                                    EUDR Ready
                                </span>
                            </h3>

                            <!-- ช่องค้นหาภายในหน้าแผนที่ -->
                            <div class="relative">
                                <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                                <input 
                                    type="text" 
                                    id="mapSearchInput" 
                                    onkeyup="filterMapSidebar()"
                                    placeholder="ค้นหาชื่อแปลง, MO, ลูกค้า..." 
                                    class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <!-- ลิสต์รายการพิกัด (Scrollable) -->
                        <div id="mapLocationListContainer" class="flex-1 overflow-y-auto pt-3 space-y-2.5 pr-1">
                            ${locationCardsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};