/**
 * Component: KPI Cards, Wood Pellets Quick Summary Bar & 8-Step Pipeline
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines (Strictly verified)
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    renderKPICards: function (summaryData, activeItem) {
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};
        const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
        const _kpiNow = new Date();
        const _kpiYear = _kpiNow.getFullYear();
        const _kpiMonth = isTh ? ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][_kpiNow.getMonth()] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][_kpiNow.getMonth()];
        const progress = activeItem && typeof calculateProductionProgress === "function" 
            ? calculateProductionProgress(activeItem) 
            : (summaryData?.productionProgress || 0);
        const isCompleted = progress === 100;
        const progressBarColor = isCompleted ? "bg-emerald-500" : "bg-amber-500";
        const stepNames = {
            1: "Step 1: Sale", 2: "Step 2: RA", 3: "Step 3: Production", 4: "Step 4: QC",
            5: "Step 5: QA", 6: "Step 6: Storage", 7: "Step 7: RA Verification", 8: "Step 8: Shipment"
        };
        const orderInfo = activeItem ? `${activeItem.orderNo} (${stepNames[activeItem.currentStep] || 'Step ' + activeItem.currentStep})` : "";

        // คำนวณค่าแจ้งเตือนด่วนแบบไดนามิกจากชุดข้อมูลจริง (mockdata หรือ ฐานข้อมูลจริง)
        const allOrders = (typeof globalData !== "undefined" && Array.isArray(globalData)) ? globalData : [];
        const targetItem = activeItem || allOrders[0] || {};
        
        // ข้อมูลเรือขนส่ง ท่าเรือ และกำหนดส่ง (ดึงจาก step6 ของ Order จริง)
        const shippingLine = targetItem.step6?.shippingLine ? `${targetItem.step6.shippingLine} Line` : "Shipping Carrier";
        const etdDate = targetItem.step6?.etd || "2026/10/29";
        const destPort = targetItem.destination || "Songkhla Port";
        const orderRef = targetItem.orderNo || "Order Ref";
        
        // คำนวณสัดส่วนความถูกต้อง EUDR DDS จากออเดอร์ทั้งหมด
        const approvedEudr = allOrders.filter(x => (x.step2?.status || "").toUpperCase() === "APPROVED").length;
        const eudrPercent = allOrders.length > 0 ? Math.round((approvedEudr / allOrders.length) * 100) : 100;
        const ddsRef = `DDS-2026-TH-${targetItem.moNo ? targetItem.moNo.replace(/[^0-9]/g, '').slice(-5) : '00412'}`;

        // ค่าผลผลิต (Yield) และใบรับรองจริงของออเดอร์
        const liveYield = targetItem.step4_pelletizing?.yield || summaryData?.avgYield || "94.2%";
        const certList = targetItem.certRequirement || "ISO 9001 / SBP / FSC";

        return `
            <!-- Executive Operations Alert Bar (Dynamic Live Ops Brief) -->
            <div class="mb-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-sm border border-indigo-900/40 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
                <div class="flex items-center space-x-2.5 min-w-0">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-400 text-slate-950 shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping mr-1.5"></span>LIVE OPS BRIEF
                    </span>
                    <p class="text-xs text-slate-200 font-medium truncate">
                        <span class="text-amber-300 font-bold">🚢 ${shippingLine}</span> ${isTh ? `ส่งออก ${destPort} (ETD: ${etdDate}) [${orderRef}]` : `Dispatch to ${destPort} (ETD: ${etdDate}) [${orderRef}]`}
                        <span class="mx-2 text-slate-500">•</span>
                        <span class="text-emerald-400 font-bold">🛡️ EUDR DDS</span> ${isTh ? `ตรวจสอบย้อนกลับสมบูรณ์ ${eudrPercent}% (${ddsRef})` : `${eudrPercent}% Traceability Verified (${ddsRef})`}
                    </p>
                </div>
                <div class="flex items-center space-x-2 shrink-0 self-end md:self-auto text-[11px]">
                    <span class="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">Yield: <strong class="text-emerald-400">${liveYield}</strong></span>
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 truncate max-w-[150px]" title="${certList}">${certList}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Card 1: Active Orders with Inline SVG Sparkline -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="flex items-center space-x-1.5">
                                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_active || 'ยอดรวมคำสั่งซื้อ'}</p>
                                <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">+12.5%</span>
                            </div>
                            <h3 class="text-2xl font-black text-slate-900 mt-1">${summaryData.activeOrders}</h3>
                        </div>
                        <div class="flex flex-col items-end">
                            <div class="bg-blue-50 text-blue-600 p-2.5 rounded-xl mb-1">
                                <i class="fa-solid fa-cart-shopping text-base"></i>
                            </div>
                            <!-- Inline SVG Trend Sparkline -->
                            <svg class="w-14 h-6 text-emerald-500" viewBox="0 0 80 32" fill="none">
                                <path d="M0,26 Q20,22 35,14 T55,12 T80,4 L80,32 L0,32 Z" fill="#10b981" fill-opacity="0.15"/>
                                <path d="M0,26 Q20,22 35,14 T55,12 T80,4" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                            </svg>
                        </div>
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                            <span class="text-[10px] text-slate-400 font-medium block"><i class="fa-solid fa-calendar-day text-indigo-500 mr-1"></i>${isTh ? `รายเดือน (${_kpiMonth})` : `Monthly (${_kpiMonth})`}</span>
                            <div class="flex items-baseline space-x-1 mt-0.5">
                                <strong class="text-sm font-bold text-indigo-600">${summaryData.monthlyOrders || 8}</strong>
                                <span class="text-[10px] text-slate-500">${isTh ? 'ออเดอร์' : 'Orders'}</span>
                            </div>
                            <span class="text-[10px] text-slate-500 block font-mono mt-0.5">${summaryData.monthlyTons || '125,000'} T</span>
                        </div>
                        <div class="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                            <span class="text-[10px] text-slate-400 font-medium block"><i class="fa-solid fa-calendar text-emerald-500 mr-1"></i>${isTh ? `รายปี (${_kpiYear})` : `Yearly (${_kpiYear})`}</span>
                            <div class="flex items-baseline space-x-1 mt-0.5">
                                <strong class="text-sm font-bold text-emerald-600">${summaryData.yearlyOrders || summaryData.activeOrders}</strong>
                                <span class="text-[10px] text-slate-500">${isTh ? 'ออเดอร์' : 'Orders'}</span>
                            </div>
                            <span class="text-[10px] text-slate-500 block font-mono mt-0.5">${summaryData.yearlyTons || '485,000'} T</span>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Production Progress -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-1.5">
                                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_prod || 'ความคืบหน้าการผลิต'}</p>
                                <span class="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded">Live Batch</span>
                            </div>
                            <div class="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
                                <i class="fa-solid fa-gears text-base"></i>
                            </div>
                        </div>
                        <h3 id="production-progress-text" class="text-2xl font-black text-slate-900">${progress}%</h3>
                        <div class="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden shadow-inner">
                            <div id="production-progress-bar" class="${progressBarColor} h-2.5 rounded-full transition-all duration-500 shadow-sm" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <p id="production-progress-sub" class="text-[11px] text-slate-500 font-medium mt-3 truncate bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <i class="fa-solid fa-industry text-indigo-500 mr-1"></i>${orderInfo}
                    </p>
                </div>

                <!-- Card 3: Pending Shipments with Inline SVG Sparkline -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="flex items-center space-x-1.5">
                                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_ship || (isTh ? 'จัดส่งแล้ว' : 'Shipped')}</p>
                                <span class="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">${targetItem.statusBadge || 'On Schedule'}</span>
                            </div>
                            <h3 class="text-2xl font-black text-slate-900 mt-1">${summaryData.pendingShipments || '41'}</h3>
                            <p class="text-xs text-indigo-600 font-medium mt-1">${t.etd_label || 'ETD'}: <span class="font-bold font-mono text-indigo-700">${etdDate}</span></p>
                        </div>
                        <div class="flex flex-col items-end">
                            <div class="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl mb-1">
                                <i class="fa-solid fa-truck-fast text-base"></i>
                            </div>
                            <svg class="w-14 h-6 text-indigo-500" viewBox="0 0 80 32" fill="none">
                                <path d="M0,28 Q25,18 45,22 T70,10 T80,6 L80,32 L0,32 Z" fill="#6366f1" fill-opacity="0.15"/>
                                <path d="M0,28 Q25,18 45,22 T70,10 T80,6" stroke="#6366f1" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                            </svg>
                        </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                        <span class="truncate mr-2">${isTh ? 'ท่าเรือส่งออก:' : 'Port:'} <strong class="text-slate-800">${destPort}</strong></span>
                        <span class="text-emerald-600 font-semibold shrink-0">${targetItem.step6?.shippingLine ? `${targetItem.step6.shippingLine} Booked` : 'Vessel Booked'}</span>
                    </div>
                </div>

                <!-- Card 4: Wood Pellets Moisture & Quality Control (Option 2) -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="flex items-center space-x-1.5">
                                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${t.kpi_moisture || (isTh ? 'ควบคุมความชื้นเฉลี่ย' : 'Avg Moisture Control')}</p>
                                <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">${isTh ? 'เกณฑ์ < 8%' : 'Target < 8%'}</span>
                            </div>
                            <h3 class="text-2xl font-black text-cyan-700 mt-1">${summaryData.avgMoisture || '6.8%'}</h3>
                        </div>
                        <div class="flex flex-col items-end">
                            <div class="bg-cyan-50 text-cyan-600 p-2.5 rounded-xl mb-1">
                                <i class="fa-solid fa-droplet text-base"></i>
                            </div>
                            <!-- Inline SVG Trend Sparkline for Moisture Stability -->
                            <svg class="w-14 h-6 text-cyan-500" viewBox="0 0 80 32" fill="none">
                                <path d="M0,18 Q20,14 35,16 T55,15 T80,14 L80,32 L0,32 Z" fill="#06b6d4" fill-opacity="0.15"/>
                                <path d="M0,18 Q20,14 35,16 T55,15 T80,14" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                            </svg>
                        </div>
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-slate-100">
                        <p class="text-xs text-slate-600 font-medium flex items-center">
                            <i class="fa-solid fa-circle-check text-emerald-500 mr-1.5"></i> ${t.kpi_moisture_sub || (isTh ? 'ได้มาตรฐาน ENplus A1 / ISO 17225-2' : 'Compliant with ENplus A1 / ISO 17225-2')}
                        </p>
                        <p class="text-[10px] text-slate-500 mt-0.5">${isTh ? 'อัตราผลผลิต Yield รวม: 94.2% • ขนาด Ø 6.0 mm' : 'Plant Yield: 94.2% • Pellet Size Ø 6.0 mm'}</p>
                    </div>
                </div>
            </div>
        `;
    },

    // แถบ Quick Summary เฉพาะทาง Wood Pellets (Executive Clean White / Slate Theme)
    renderWoodPelletsQuickBar: function (item) {
        if (!item) return '';

        const pz = item.step4_pelletizing || {
            yield: "90,000 Ton", totalDowntimeMins: 4000, pelletDiameter: "6.0 mm", pelletMoisture: "7.8%", coolingMoisture: "6.5%"
        };
        const wh = item.step5 || {
            location: "Warehouse 1", openingStock: "1,000 Ton", issueQty: "300 Ton", closingStock: "1,200 Ton"
        };

        const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
        const barTitle = isTh ? "พารามิเตอร์การผลิตและสต็อกเฉพาะทาง:" : "Specialized Production & Stock Parameters:";

        return `
            <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-3">
                    <div class="flex flex-wrap items-center gap-2 min-w-0">
                        <span class="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0">WOOD PELLETS BPM</span>
                        <span class="hidden md:inline-flex items-center text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <i class="fa-solid fa-shield-halved text-emerald-500 mr-1"></i>DDS-2026-TH-00412 Verified
                        </span>
                        <h3 class="text-sm font-bold text-slate-900 tracking-wide truncate">
                            ${barTitle} <span class="text-indigo-600 font-mono font-bold">${item.orderNo}</span> <span class="text-slate-500 font-normal">(${item.customer})</span>
                        </h3>
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    <!-- Widget 1: Wood Pellet Specs & Certs -->
                    <div class="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-colors">
                        <div class="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-medium">
                            <span>${isTh ? 'สเปก & ใบรับรอง' : 'Specs & Certificates'}</span>
                            <i class="fa-solid fa-certificate text-blue-600"></i>
                        </div>
                        <p class="text-sm font-bold text-slate-900">${pz.pelletDiameter} <span class="text-xs text-slate-500 font-normal">(${item.productType || '1-0.6mm'})</span></p>
                        <div class="flex items-center space-x-1 mt-2">
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">SBP</span>
                            <span class="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded border border-blue-200">GGL</span>
                            <span class="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">FSC</span>
                        </div>
                    </div>

                    <!-- Widget 2: Moisture Control -->
                    <div class="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 hover:border-cyan-300 transition-colors">
                        <div class="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-medium">
                            <span>${isTh ? 'ควบคุมความชื้น' : 'Moisture Control'}</span>
                            <i class="fa-solid fa-droplet text-cyan-600"></i>
                        </div>
                        <div class="flex items-baseline space-x-2">
                            <span class="text-sm font-bold text-cyan-700">${pz.pelletMoisture}</span>
                            <span class="text-[11px] text-slate-500">${isTh ? 'ระบายความร้อน:' : 'Cooling:'} <strong class="text-slate-800">${pz.coolingMoisture}</strong></span>
                        </div>
                        <p class="text-[10px] text-emerald-700 font-semibold mt-2 flex items-center">
                            <i class="fa-solid fa-circle-check mr-1 text-emerald-500"></i> ${isTh ? 'ตามเกณฑ์ < 8%' : 'Compliant < 8%'}
                        </p>
                    </div>

                    <!-- Widget 3: Yield & Machine Downtime -->
                    <div class="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 hover:border-amber-300 transition-colors">
                        <div class="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-medium">
                            <span>${isTh ? 'ประสิทธิภาพ & Downtime' : 'Yield & Downtime'}</span>
                            <i class="fa-solid fa-chart-line text-amber-600"></i>
                        </div>
                        <p class="text-sm font-bold text-slate-900">${isTh ? 'ผลผลิต:' : 'Yield:'} <span class="text-amber-700 font-bold">${pz.yield}</span></p>
                        <p class="text-[10px] text-rose-600 font-semibold mt-2 flex items-center truncate">
                            <i class="fa-solid fa-triangle-exclamation mr-1 text-rose-500"></i> ${isTh ? `หยุดเครื่อง: <strong>${(pz.totalDowntimeMins || 0).toLocaleString()} นาที</strong>` : `Downtime: <strong>${(pz.totalDowntimeMins || 0).toLocaleString()} mins</strong>`}
                        </p>
                    </div>

                    <!-- Widget 4: Warehouse Stock Movement -->
                    <div class="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-colors">
                        <div class="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-medium">
                            <span>${isTh ? `สต็อก (${wh.location || 'WH 1'})` : `Stock (${wh.location || 'WH 1'})`}</span>
                            <i class="fa-solid fa-warehouse text-indigo-600"></i>
                        </div>
                        <p class="text-sm font-bold text-slate-900">${isTh ? 'คงเหลือ:' : 'Closing:'} <span class="text-emerald-700 font-bold">${wh.closingStock || '1,200 Ton'}</span></p>
                        <p class="text-[10px] text-slate-500 mt-2 truncate">
                            ${isTh ? `ยกมา ${wh.openingStock || '1,000T'} • จ่ายออก ${wh.issueQty || '300T'}` : `Opening ${wh.openingStock || '1,000T'} • Issue ${wh.issueQty || '300T'}`}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    // แสดงสถานะ 8-Step Lifecycle Pipeline
    renderPipeline: function (item) {
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};
        if (!item) return `<div class="text-center text-xs text-slate-400 py-4 w-full">${t.no_order_data || 'ไม่พบข้อมูลคำสั่งซื้อ'}</div>`;

        const currentStep = item.currentStep || 1;
        const promptStatus = (item.ResultPrompt || "Approved").trim().toUpperCase();
        const arrow = `<div class="hidden lg:flex items-center justify-center text-slate-300 px-1"><i class="fa-solid fa-arrow-right text-sm"></i></div>`;

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

        const isThPipe = (typeof currentLang !== "undefined" && currentLang === "th");
        const steps = [
            { id: 1, step: "Step 1", title: t.step1_name || (isThPipe ? "ฝ่ายขาย" : "Sale"), val: item.orderNo, sub: item.customer, status: "DONE" },
            { id: 2, step: "Step 2", title: t.step2_name || (isThPipe ? "ฝ่ายกำกับดูแล" : "RA"), val: promptStatus === "APPROVED" ? (t.approved_badge || "APPROVED") : promptStatus, sub: item.step2?.valid || item.step2?.licenseExpiry || 'EUDR Pass', status: promptStatus === "APPROVED" ? "COMPLETED" : promptStatus },
            { id: 3, step: "Step 3", title: t.step3_name || (isThPipe ? "ฝ่ายผลิต" : "Production"), val: `${(item.step3?.actual || 0).toLocaleString()} / ${((item.step3?.planned || 0) / 1000).toFixed(0)}k T`, sub: isThPipe ? 'วัตถุดิบไม้ยางพารา' : 'Woods Material', status: item.step3?.status || 'IN PROGRESS' },
            { id: 4, step: "Step 4", title: t.step4_name || (isThPipe ? "ควบคุมคุณภาพหน้างาน" : "QC In-line"), val: item.step4_pelletizing ? item.step4_pelletizing.pelletDiameter : "6.0 mm", sub: item.step4_pelletizing ? `M: ${item.step4_pelletizing.pelletMoisture}` : (isThPipe ? "5 จุดตรวจ" : "5 Checkpoints"), status: item.currentStep >= 4 ? "IN PROGRESS" : "PENDING" },
            { id: 5, step: "Step 5", title: t.step5_name || (isThPipe ? "ประกันคุณภาพ" : "QA Lab"), val: item.step4?.status || 'Zero Dev', sub: item.step4?.sub || 'COA Ready', status: item.step4?.status || 'PENDING' },
            { id: 6, step: "Step 6", title: t.step6_name || (isThPipe ? "คลังสินค้า" : "Storage"), val: item.step5?.location || 'Warehouse 1', sub: item.step5?.closingStock ? `Stock: ${item.step5.closingStock}` : (isThPipe ? 'บันทึกบรรจุ' : 'Packing Log'), status: item.step5?.sub ? item.step5.sub.toUpperCase() : "PENDING" },
            { id: 7, step: "Step 7", title: t.step7_name || (isThPipe ? "ตรวจสอบเอกสาร" : "RA Verification"), val: "Dossier Ready", sub: "GGL / SBP / EUDR", status: item.currentStep >= 7 ? "COMPLETED" : "PENDING" },
            { id: 8, step: "Step 8", title: t.step8_name || (isThPipe ? "จัดส่งสินค้า" : "Shipment"), val: item.step6?.tracking || item.step6?.saNo || item.step6?.bookingNo || 'SA Issued', sub: `ETD: ${item.step6?.etd || '-'}`, status: item.statusBadge ? item.statusBadge.toUpperCase() : "PENDING" }
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
            } else if (s.id > currentStep && !isRejected && !isWithdrawn) {
                displayStatus = "PENDING";
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
                    badgeBg = "bg-purple-600 text-white"; cardStyle = "bg-purple-50/70 border-purple-200 text-purple-900"; textCol = "text-purple-700 font-medium";
                } else {
                    badgeBg = "bg-emerald-600 text-white"; cardStyle = "bg-emerald-50/70 border-emerald-200 text-emerald-900"; textCol = "text-emerald-700 font-medium";
                }
            } else {
                badgeBg = theme.badge; cardStyle = theme.card; textCol = theme.text;
                if (s.id > currentStep) displayStatus = "PENDING";
            }

            html += `
                <div class="flex-1 ${cardStyle} p-3 rounded-xl border text-center relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
                    <span class="absolute -top-3 left-1/2 -translate-x-1/2 ${badgeBg} text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">${s.step}</span>
                    <p class="text-[11px] font-semibold mt-1 ${s.id === currentStep && !isRejected && !isWithdrawn ? 'text-rose-900 font-bold' : 'text-slate-700'}">${s.title}</p>
                    <p class="text-xs ${textCol} mt-1 truncate font-medium">${s.val}</p>
                    ${s.sub ? `<p class="text-[10px] text-slate-500 truncate mt-0.5">${s.sub}</p>` : ''}
                    <p class="text-[10px] font-bold tracking-wide uppercase opacity-90 mt-1 pt-1 border-t border-current/10">${displayStatus}</p>
                </div>
            `;
            if (index < steps.length - 1) html += arrow;
        });

        html += '</div>';
        return html;
    }
});
