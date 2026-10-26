/**
 * Component: Cadastral Boundary View (KML / GeoJSON Polygon View)
 * Includes Real-time Filters for Plots and MO Linkage, and Export KML / GeoJSON
 * File size target: < 400 lines (Strictly verified)
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    renderCadastralView: function (plots, activePlotId) {
        plots = plots || [];
        const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
        const activePlot = plots.find(p => p.id === activePlotId) || plots[0] || null;
        const totalPlotsCount = plots.length;

        // คำนวณพื้นที่รวมทั้งหมด
        let totalSqMeters = 0;
        plots.forEach(p => { totalSqMeters += (p.areaSqMeters || 0); });
        const totalThai = typeof formatThaiArea === "function" ? formatThaiArea(totalSqMeters) : { rai: 0, ngan: 0, sqWah: 0, sqMeters: "0", hectares: "0" };

        // Dropdown options แปลงที่ดิน
        let plotOptionsHtml = "";
        plots.forEach((p, idx) => {
            const isSelected = activePlot && p.id === activePlot.id ? "selected" : "";
            const moBadge = p.linkedMoNo ? ` [${p.linkedMoNo}]` : "";
            const areaLabel = p.thaiArea ? (isTh ? ` (${p.thaiArea.rai} ไร่ ${p.thaiArea.ngan} งาน)` : ` (${p.thaiArea.rai} Rai ${p.thaiArea.ngan} Ngan)`) : "";
            plotOptionsHtml += `<option value="${p.id}" ${isSelected}>[${idx + 1}]${moBadge} ${p.name}${areaLabel}</option>`;
        });

        // Dropdown options รหัสคำสั่งซื้อ MO
        let moSelectOptionsHtml = "";
        if (typeof globalData !== "undefined" && Array.isArray(globalData)) {
            globalData.forEach(item => {
                const isMoSelected = activePlot && activePlot.linkedMoNo === item.moNo ? "selected" : "";
                moSelectOptionsHtml += `<option value="${item.moNo}" ${isMoSelected}>${item.moNo} — ${item.customerName || item.customer || 'Customer'} (${item.location?.placeName || ''})</option>`;
            });
        }

        // ตารางพิกัดจุดตัดมุมแปลง
        let vertexRowsHtml = "";
        if (activePlot && activePlot.vertices && activePlot.vertices.length > 0) {
            activePlot.vertices.forEach((v, vIdx) => {
                vertexRowsHtml += `
                    <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100 text-xs">
                        <td class="py-1.5 px-3 font-bold text-center text-slate-700">#${v.no || (vIdx + 1)}</td>
                        <td class="py-1.5 px-3 font-mono text-emerald-700 font-medium">${Number(v.lat).toFixed(6)}</td>
                        <td class="py-1.5 px-3 font-mono text-indigo-700 font-medium">${Number(v.lng).toFixed(6)}</td>
                    </tr>`;
            });
        } else {
            const emptyNotice = isTh ? "เลือกแปลงเพื่อแสดงพิกัดมุมแปลง" : "Select plot to display EUDR polygon vertices";
            vertexRowsHtml = `<tr><td colspan="3" class="py-6 text-center text-slate-400 text-xs"><i class="fa-solid fa-draw-polygon text-2xl text-slate-300 mb-1.5 block"></i>${emptyNotice}</td></tr>`;
        }

        const plotTitle = activePlot ? activePlot.name : (isTh ? "ยังไม่มีแปลงที่เลือก" : "No Plot Selected");
        const plotTypeBadge = activePlot && activePlot.fileType === "KML" 
            ? `<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300"><i class="fa-solid fa-earth-americas mr-1"></i>Google Earth KML</span>`
            : `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-300"><i class="fa-solid fa-file-code mr-1"></i>EUDR GeoJSON</span>`;

        return `
            <div class="space-y-6 page-fade-in">
                <!-- Toolbar ด้านบน: Action Buttons, Upload & Filter (ผูก MO ทันที) -->
                <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
                        <div class="flex items-center space-x-2">
                            <span class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                                <i class="fa-solid fa-draw-polygon text-sm"></i>
                            </span>
                            <div>
                                <h2 class="text-base font-bold text-slate-900">${isTh ? 'ตรวจสอบรูปแปลงที่ดิน (KML / GeoJSON)' : 'Cadastral Boundary Verification'}</h2>
                                <p class="text-xs text-slate-500">${isTh ? 'นำเข้าไฟล์ขอบเขตแปลงที่ดิน ตรวจสอบพิกัด และยืนยันความถูกต้องตามเกณฑ์ EUDR' : 'Geometric polygon boundary matching Google Earth and EUDR standards'}</p>
                            </div>
                        </div>

                        <!-- Action Toolbar (ปุ่มนำเข้า, Export KML, Export GeoJSON, ล้างแปลงซ้ำ, ตัวอย่าง) -->
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 shadow-2xs">
                                <span class="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center"><i class="fa-solid fa-link text-indigo-600 mr-1.5"></i>${isTh ? 'ผูก MO:' : 'Link MO:'}</span>
                                <input type="text" id="filterUploadMoInput" oninput="filterUploadMoSelect(this.value)" placeholder="${isTh ? '🔍 กรอง...' : '🔍 Filter...'}" class="w-20 px-1.5 py-0.5 text-[11px] bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-indigo-500" />
                                <select id="cadastralUploadTargetMo" class="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 max-w-[180px] truncate">
                                    <option value="AUTO">${isTh ? '🔍 ตรวจจับอัตโนมัติ' : '🔍 Auto-Detect'}</option>
                                    ${moSelectOptionsHtml}
                                    <option value="NONE">${isTh ? '-- แปลงทั่วไป (ยังไม่ผูก MO) --' : '-- Unlinked / General Plot --'}</option>
                                </select>
                            </div>

                            <button type="button" onclick="document.getElementById('cadastralDirectFileInput').click()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center shadow-md whitespace-nowrap">
                                <i class="fa-solid fa-file-arrow-up mr-1.5 text-white"></i> ${isTh ? 'นำเข้า KML / GeoJSON' : 'Import KML / GeoJSON'}
                            </button>
                            <input type="file" id="cadastralDirectFileInput" accept=".kml,.geojson,.json" class="hidden" onchange="handleDirectCadastralFileSelect(event)" />


                            <button type="button" onclick="exportActivePlotKml()" class="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center shadow-md whitespace-nowrap">
                                <i class="fa-solid fa-earth-americas mr-1.5 text-white"></i> ${isTh ? 'ส่งออก KML' : 'Export KML'}
                            </button>

                            <button type="button" onclick="exportActivePlotGeoJson()" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center shadow-md whitespace-nowrap">
                                <i class="fa-solid fa-file-arrow-down mr-1.5 text-white"></i> ${isTh ? 'ส่งออก GeoJSON' : 'Export GeoJSON'}
                            </button>

                            <button type="button" onclick="printCadastralPlotCertificate()" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center shadow-md whitespace-nowrap">
                                <i class="fa-solid fa-stamp mr-1.5 text-white"></i> ${isTh ? 'พิมพ์ใบรับรอง EUDR' : 'Print EUDR Cert'}
                            </button>

                            <button type="button" onclick="cleanDuplicateCadastralPlots()" class="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center border border-slate-200 whitespace-nowrap">
                                <i class="fa-solid fa-broom text-amber-600 mr-1.5"></i> ${isTh ? 'ตรวจแปลงซ้ำ' : 'Check Duplicates'}
                            </button>

                            <button type="button" onclick="loadDemoCadastralPlots()" class="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center border border-slate-200 whitespace-nowrap">
                                <i class="fa-solid fa-flask text-indigo-600 mr-1.5"></i> ${isTh ? 'ตัวอย่างสาธิต' : 'Demo Sample'}
                            </button>
                        </div>
                    </div>

                    <!-- แถวที่ 2: Dropdown เลือกแปลง พร้อมช่อง Filter ค้นหาด่วน และสถิติ -->
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <div class="flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
                            <label class="text-xs font-bold text-slate-700 whitespace-nowrap shrink-0 flex items-center">
                                <i class="fa-solid fa-map-pin text-rose-500 mr-1.5"></i>${isTh ? 'เลือกแปลงที่ดิน:' : 'Select Plot:'}
                            </label>
                            <input type="text" id="filterCadastralPlotInput" oninput="filterCadastralPlotSelect(this.value)" placeholder="${isTh ? '🔍 กรองแปลง / MO...' : '🔍 Filter Plot / MO...'}" class="w-36 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors shrink-0" />
                            <div class="flex-1 min-w-0">
                                <select id="cadastralPlotSelect" onchange="onCadastralPlotSelectChange(this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors truncate">
                                    ${plotOptionsHtml || (isTh ? '<option value="">-- ยังไม่มีข้อมูลแปลงที่ดิน --</option>' : '<option value="">-- No Plot Data Available --</option>')}
                                </select>
                            </div>
                            ${activePlot ? `
                            <button type="button" onclick="deleteActiveCadastralPlot()" class="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center shadow-2xs whitespace-nowrap shrink-0" title="${isTh ? 'ลบแปลงที่ดินนี้ออกจากระบบ' : 'Delete this parcel from system'}">
                                <i class="fa-solid fa-trash-can mr-1.5 text-rose-600"></i> ${isTh ? 'ลบแปลงนี้' : 'Delete Plot'}
                            </button>
                            ` : ''}
                        </div>
                        <div class="flex items-center gap-2.5 shrink-0">
                            <div class="bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs">
                                <span class="text-xs text-emerald-800 font-medium whitespace-nowrap"><i class="fa-solid fa-layer-group text-emerald-600 mr-1"></i>${isTh ? 'แปลงที่นำเข้า:' : 'Imported Plots:'}</span>
                                <strong class="text-xs font-bold text-emerald-700 whitespace-nowrap">${totalPlotsCount} ${isTh ? 'แปลง' : 'Plots'}</strong>
                            </div>
                            <div class="bg-indigo-50/80 border border-indigo-200 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs">
                                <span class="text-xs text-indigo-800 font-medium whitespace-nowrap"><i class="fa-solid fa-chart-area text-indigo-600 mr-1"></i>${isTh ? 'เนื้อที่รวม:' : 'Total Area:'}</span>
                                <strong class="text-xs font-bold text-indigo-700 whitespace-nowrap">${isTh ? `${totalThai.rai} ไร่ ${totalThai.ngan} งาน` : `${totalThai.rai} Rai ${totalThai.ngan} Ngan`}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 1. ผืนแผนที่ดาวเทียม Leaflet กว้างเต็มหน้าจอ (Full Width 100%) -->
                <div id="cadastralMapBoxWrapper" class="w-full bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col space-y-3 transition-all duration-300">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span class="text-xs font-bold text-slate-800" id="cadastralMapStatusText">${plotTitle}</span>
                            ${plotTypeBadge}
                            ${activePlot && activePlot.linkedMoNo ? (() => {
                                const siblingPlots = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(activePlot.linkedMoNo) : [];
                                return `
                                    <span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-200">
                                        <i class="fa-solid fa-link mr-1"></i>${activePlot.linkedMoNo}${siblingPlots.length > 1 ? (isTh ? ` (${siblingPlots.length} แปลง)` : ` (${siblingPlots.length} Plots)`) : ''}
                                    </span>
                                    ${siblingPlots.length > 1 ? `
                                        <button type="button" onclick="drawAllPlotsForMo('${activePlot.linkedMoNo}')" class="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold shadow-xs transition-all flex items-center whitespace-nowrap">
                                            <i class="fa-solid fa-shapes mr-1"></i> ${isTh ? `แสดงทุกแปลง (${siblingPlots.length})` : `Show All ${siblingPlots.length} Plots`}
                                        </button>
                                    ` : ''}
                                `;
                            })() : ''}
                        </div>

                        <!-- ตัวสลับเลเยอร์แผนที่ + ปุ่มซูมครอบแปลง + ปุ่มหมุดมุม + ปุ่มเต็มจอ -->
                        <div class="flex items-center space-x-2">
                            <button type="button" id="btnCadastralSatellite" onclick="setCadastralTileLayer('satellite')" class="px-2.5 py-1 text-xs rounded-lg font-bold transition-all bg-emerald-600 text-white shadow-xs whitespace-nowrap">
                                <i class="fa-solid fa-satellite mr-1"></i> ${isTh ? 'ภาพถ่ายดาวเทียม' : 'Satellite'}
                            </button>
                            <button type="button" id="btnCadastralStreet" onclick="setCadastralTileLayer('street')" class="px-2.5 py-1 text-xs rounded-lg font-semibold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 whitespace-nowrap">
                                <i class="fa-solid fa-road mr-1"></i> ${isTh ? 'แผนที่ถนน' : 'Street Map'}
                            </button>
                            <button type="button" onclick="fitCadastralBounds()" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs" title="Fit Bounds"><i class="fa-solid fa-crosshairs"></i></button>
                            <button type="button" id="btnToggleCornerPins" onclick="toggleCadastralCornerPins()" class="px-2.5 py-1 text-xs rounded-lg font-semibold transition-all bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 whitespace-nowrap" title="Corner Pins"><i class="fa-solid fa-location-pin mr-1"></i> ${isTh ? 'หมุดมุมแปลง' : 'Corner Pins'}</button>
                            <button type="button" id="btnCadastralFullscreen" onclick="toggleCadastralFullscreen()" class="px-2.5 py-1 text-xs rounded-lg font-bold transition-all bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 shadow-xs flex items-center whitespace-nowrap">
                                <i id="cadastralFullscreenIcon" class="fa-solid fa-expand text-xs mr-1 text-emerald-300"></i><span id="cadastralFullscreenText">${isTh ? 'เต็มจอ' : 'Fullscreen'}</span>
                            </button>
                        </div>
                    </div>

                    <!-- แผนที่ Leaflet Viewport (h-[580px]) -->
                    <div id="cadastralMapViewport" class="relative w-full h-[580px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
                        <div id="cadastralLeafletMap" class="w-full h-full z-10"></div>
                        <div id="cadastralDropZoneOverlay" class="hidden absolute inset-0 bg-emerald-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white border-4 border-dashed border-emerald-400 m-4 rounded-2xl transition-all">
                            <i class="fa-solid fa-cloud-arrow-up text-5xl text-emerald-400 mb-3 animate-bounce"></i>
                            <h4 class="text-base font-bold">${isTh ? 'ปล่อยไฟล์ .KML หรือ .GeoJSON ที่นี่' : 'Drop .KML or .GeoJSON File Here'}</h4>
                            <p class="text-xs text-emerald-200 mt-1">${isTh ? 'ระบบจะอ่านพิกัดและวาดขอบแปลงที่ดินลงบนแผนที่ให้อัตโนมัติ' : 'System will parse coordinates and draw boundaries automatically'}</p>
                        </div>
                        <div class="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-xl border border-slate-700 z-20 flex items-center space-x-2 shadow-lg">
                            <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block border border-white"></span>
                            <span>${isTh ? 'เส้นขอบเขตแปลงจริง' : 'Cadastral Boundary'}</span><span class="text-slate-400">|</span>
                            <span class="text-emerald-300">High Precision EUDR Traceability</span>
                        </div>
                        <div id="cadastralFullscreenFloatingInfo" class="hidden absolute top-3 right-3 z-30 bg-slate-950/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-700 shadow-2xl max-w-xs text-xs space-y-1.5">
                            <div class="font-bold text-emerald-300 flex items-center justify-between">
                                <span>${plotTitle}</span>
                                <button onclick="toggleCadastralFullscreen()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-compress"></i></button>
                            </div>
                            <div class="text-[11px] text-slate-300">${isTh ? 'เนื้อที่:' : 'Area:'} <strong class="text-white">${activePlot && activePlot.thaiArea ? (isTh ? `${activePlot.thaiArea.rai} ไร่ ${activePlot.thaiArea.ngan} งาน` : `${activePlot.thaiArea.rai} Rai ${activePlot.thaiArea.ngan} Ngan`) : '-'}</strong></div>
                            ${activePlot && activePlot.linkedMoNo ? `<div class="text-[10px] text-indigo-300">Order: <strong>${activePlot.linkedMoNo}</strong></div>` : ''}
                        </div>
                    </div>
                </div>

                <!-- 2. แผงข้อมูลรายละเอียดแปลงและพิกัดมุมแปลง (วางใต้แผนที่ กว้างเต็มหน้าจอ จัดเรียงเป็น 3 คอลัมน์) -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Col 1: คำสั่งซื้อที่ผูกไว้ (Linked MO No.) -->
                    <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h4 class="text-xs font-bold text-slate-900 flex items-center"><i class="fa-solid fa-link text-indigo-600 mr-1.5"></i>${isTh ? 'คำสั่งซื้อที่ผูกไว้' : 'Linked MO No.'}</h4>
                                <span class="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-200">EUDR Mapping</span>
                            </div>
                            <div class="space-y-2 mt-3">
                                <div class="flex items-center justify-between">
                                    <label class="text-[11px] font-semibold text-slate-600 block">${isTh ? 'เปลี่ยนคำสั่งซื้อที่ผูก:' : 'Change Linked MO:'}</label>
                                    <input type="text" id="filterActivePlotMoInput" oninput="filterActivePlotMoSelect(this.value)" placeholder="${isTh ? '🔍 กรอง MO...' : '🔍 Filter MO...'}" class="w-28 px-1.5 py-0.5 text-[10px] bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-indigo-500" />
                                </div>
                                <select id="activePlotMoSelect" onchange="updatePlotLinkedMo(this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors">
                                    <option value="">${isTh ? '-- แปลงทั่วไป (ยังไม่ผูก MO) --' : '-- Unlinked / General Plot --'}</option>
                                    ${moSelectOptionsHtml}
                                </select>
                                ${activePlot && activePlot.linkedMoNo ? (() => {
                                    const siblingPlots = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(activePlot.linkedMoNo) : [];
                                    const totalRai = siblingPlots.reduce((sum, p) => sum + (p.thaiArea ? p.thaiArea.rai : 0), 0);
                                    return `
                                    <div class="flex items-center justify-between text-xs bg-indigo-50/80 p-2.5 rounded-2xl border border-indigo-100">
                                        <span class="text-indigo-900 font-medium">${isTh ? 'ผูกกับ:' : 'Linked to:'} <strong class="text-indigo-700 font-bold">${activePlot.linkedMoNo}</strong></span>
                                        <button type="button" onclick="viewOrderInDashboard('${activePlot.linkedMoNo}')" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-all whitespace-nowrap">${isTh ? 'เปิดใน Dashboard →' : 'View in Dashboard →'}</button>
                                    </div>
                                    ${siblingPlots.length > 1 ? `
                                    <div class="mt-2 p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs space-y-1.5">
                                        <div class="flex items-center justify-between text-indigo-900 font-bold text-[11px]">
                                            <span><i class="fa-solid fa-shapes mr-1 text-indigo-600"></i> ${isTh ? `${siblingPlots.length} แปลงในคำสั่งซื้อนี้` : `${siblingPlots.length} Plots in this MO`}</span>
                                            <span class="text-emerald-700 font-bold">${isTh ? `รวม ${totalRai} ไร่` : `Total ${totalRai} Rai`}</span>
                                        </div>
                                        <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto pt-0.5">
                                            ${siblingPlots.map((sp, sIdx) => `
                                                <button type="button" onclick="drawCadastralPlot('${sp.id}')" class="px-2 py-0.5 text-[10px] rounded-md font-semibold transition-all ${sp.id === activePlot.id ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white hover:bg-indigo-100 text-slate-700 border border-slate-200'}">
                                                    Plot ${sIdx + 1} (${sp.thaiArea ? sp.thaiArea.rai : 0} R.)
                                                </button>
                                            `).join('')}
                                        </div>
                                        <button type="button" onclick="drawAllPlotsForMo('${activePlot.linkedMoNo}')" class="w-full mt-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs flex items-center justify-center whitespace-nowrap">
                                            <i class="fa-solid fa-layer-group mr-1.5"></i> ${isTh ? `วาดทุกแปลง (${siblingPlots.length} แปลง)` : `Draw All ${siblingPlots.length} Plots on Map`}
                                        </button>
                                    </div>
                                    ` : ''}
                                    `;
                                })() : `
                                    <div class="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center"><i class="fa-solid fa-circle-info text-slate-400 mr-2"></i> ${isTh ? 'เลือก MO เพื่อผูกแปลงที่ดินกับคำสั่งซื้อ' : 'Select MO to link this plot with order'}</div>`}
                            </div>
                        </div>
                        <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                            <div class="flex justify-between"><span>${isTh ? 'ไฟล์ต้นทาง:' : 'Source File:'}</span><span class="font-mono text-slate-700 truncate max-w-[170px]" title="${activePlot ? activePlot.fileName : '-'}">${activePlot ? activePlot.fileName : '-'}</span></div>
                            <div class="flex justify-between"><span>${isTh ? 'วันที่นำเข้า:' : 'Uploaded At:'}</span><span class="text-slate-700">${activePlot ? activePlot.uploadedAt : '-'}</span></div>
                        </div>
                    </div>

                    <!-- Col 2: บัตรคำนวณขนาดพื้นที่ดินจริง -->
                    <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                                    <i class="fa-solid fa-chart-pie text-emerald-600 mr-1.5"></i>${isTh ? 'ขนาดเนื้อที่คำนวณ' : 'Calculated Area'}
                                </h3>
                                <span class="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">WGS84 Ellipsoid</span>
                            </div>
                            <div class="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-md mt-3">
                                <span class="text-[11px] text-emerald-100 font-medium">${isTh ? 'เนื้อที่ตามมาตราวัดไทย:' : 'Thai Area Unit:'}</span>
                                <div class="text-2xl font-bold mt-0.5 tracking-tight">${activePlot && activePlot.thaiArea ? (isTh ? `${activePlot.thaiArea.rai} ไร่ ${activePlot.thaiArea.ngan} งาน ${activePlot.thaiArea.sqWah} ตร.ว.` : `${activePlot.thaiArea.rai} Rai ${activePlot.thaiArea.ngan} Ngan ${activePlot.thaiArea.sqWah} Sq.w.`) : '-'}</div>
                                <div class="mt-2.5 pt-2 border-t border-emerald-400/40 flex items-center justify-between text-xs text-emerald-100">
                                    <span>${activePlot && activePlot.thaiArea ? activePlot.thaiArea.sqMeters : '0'} ${isTh ? 'ตร.ม.' : 'Sq.m.'}</span>
                                    <span>${activePlot && activePlot.thaiArea ? activePlot.thaiArea.hectares : '0'} ${isTh ? 'เฮกตาร์ (Ha)' : 'Hectares (Ha)'}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                            <div class="text-[11px] font-bold text-slate-700 flex items-center justify-between"><span>${isTh ? 'สถานะการตรวจสอบ EUDR' : 'EUDR Compliance Status'}</span><span class="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px]">VERIFIED</span></div>
                            <div class="space-y-1 text-slate-600 text-[11px]">
                                <div class="flex items-center text-emerald-700"><i class="fa-solid fa-circle-check mr-1.5 text-emerald-500"></i> ${isTh ? 'จุดพิกัดมุมแปลงครบถ้วน (>4 จุด)' : 'Polygon vertices verified (>4 corners)'}</div>
                                <div class="flex items-center text-emerald-700"><i class="fa-solid fa-circle-check mr-1.5 text-emerald-500"></i> ${isTh ? 'ไม่อยู่ในเขตทำลายป่าไม้ (ตรวจผ่านดาวเทียม)' : 'Zero deforestation verified by satellite'}</div>
                                <div class="flex items-center text-emerald-700"><i class="fa-solid fa-circle-check mr-1.5 text-emerald-500"></i> ${isTh ? 'เป็นไปตามเกณฑ์ EU Regulation 2023/1115' : 'EU Regulation 2023/1115 Compliant'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Col 3: ตารางแสดงพิกัดจุดตัดมุมแปลง (EUDR Vertices) -->
                    <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
                        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h4 class="text-xs font-bold text-slate-900 flex items-center"><i class="fa-solid fa-table-cells text-indigo-600 mr-1.5"></i>${isTh ? 'พิกัดมุมแปลง EUDR' : 'Polygon Corner Vertices'}</h4>
                                <span class="text-[10px] text-slate-400">${activePlot && activePlot.vertices ? activePlot.vertices.length : 0} ${isTh ? 'จุดมุมแปลง' : 'Vertices'}</span>
                            </div>
                            <button type="button" onclick="copyActivePlotCoordinates()" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center border border-slate-200 shadow-2xs whitespace-nowrap">
                                <i class="fa-regular fa-copy mr-1 text-indigo-600"></i> ${isTh ? 'คัดลอกพิกัด' : 'Copy Coordinates'}
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto pt-2">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase border-b border-slate-200 sticky top-0">
                                        <th class="py-1.5 px-3 text-center">${isTh ? 'หมุดที่' : 'Point #'}</th>
                                        <th class="py-1.5 px-3">Latitude</th>
                                        <th class="py-1.5 px-3">Longitude</th>
                                    </tr>
                                </thead>
                                <tbody id="cadastralVertexTableBody">${vertexRowsHtml}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});


// ฟังก์ชันอัปเดตตัวเลือก MO ในหน้าแปลงที่ดินแบบไดนามิกเมื่อข้อมูลเปลี่ยน (mockdata หรือ DB)
function updateCadastralMoOptions(data) {
    const $select = $("#cadastralUploadTargetMo");
    if (!$select.length) return;
    const dataset = data || (typeof globalData !== "undefined" ? globalData : []);
    const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
    let html = `<option value="AUTO">${isTh ? '🔍 ตรวจจับอัตโนมัติ' : '🔍 Auto-Detect'}</option>`;
    dataset.forEach((item) => {
        html += `<option value="${item.moNo}">${item.moNo} — ${item.customerName || item.customer || 'Customer'} (${item.location?.placeName || ''})</option>`;
    });
    html += `<option value="NONE">${isTh ? '-- แปลงทั่วไป (ยังไม่ผูก MO) --' : '-- Unlinked / General Plot --'}</option>`;
    $select.html(html);
}
