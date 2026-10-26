/**
 * Component: GIS Map Overview & GPS Modal Content
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    // เรนเดอร์เนื้อหา Modal สำหรับตรวจสอบพิกัด GPS ของแต่ละออเดอร์
    renderMapModalContent: function (item) {
        if (!item) return '';

        const loc = item.location || {
            lat: 7.0089,
            lng: 100.4767,
            placeName: "โรงงาน Green River Panels (สำนักงานใหญ่)",
            plotId: "GRP-HQ-01",
            areaRai: "120 ไร่",
            subdistrict: "คอหงส์",
            district: "หาดใหญ่",
            province: "สงขลา",
            eudrStatus: "EUDR Compliant (Verified)"
        };

        return `
            <div class="space-y-4">
                <!-- ส่วนหัวและข้อมูลสถานที่ -->
                <div class="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                ${loc.eudrStatus}
                            </span>
                        </div>
                        <h3 class="text-base font-bold text-slate-900 mt-1">${loc.placeName}</h3>
                        <p class="text-xs text-slate-500">ต.${loc.subdistrict || 'คอหงส์'} อ.${loc.district || 'หาดใหญ่'} จ.${loc.province || 'สงขลา'}</p>
                    </div>

                    <div class="text-right">
                        <span class="text-[10px] text-slate-400 font-mono block">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'รหัสคำสั่งซื้อ' : 'Order Reference'}</span>
                        <span class="text-xs font-bold text-indigo-700 font-mono">${item.orderNo}</span>
                        <span class="text-[10px] text-slate-500 block font-mono">MO: ${item.moNo || '-'}</span>
                    </div>
                </div>

                <!-- Leaflet Interactive Map Viewport -->
                <div class="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
                    <div id="modalLeafletMap" class="w-full h-full z-10" style="min-height: 320px; height: 320px;"></div>
                </div>

                <!-- ข้อมูลสรุปพารามิเตอร์ของแปลง -->
                <div class="grid grid-cols-3 gap-2 text-xs">
                    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span class="text-[10px] text-slate-400 block font-medium">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'รหัสแปลง' : 'Plot ID'}</span>
                        <span class="font-mono font-bold text-slate-800 mt-0.5 block">${loc.plotId || '-'}</span>
                    </div>
                    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span class="text-[10px] text-slate-400 block font-medium">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'ขนาดพื้นที่แปลง' : 'Area Size'}</span>
                        <span class="font-bold text-emerald-700 mt-0.5 block">${loc.areaRai || '-'}</span>
                    </div>
                    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span class="text-[10px] text-slate-400 block font-medium">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'พิกัดดาวเทียม' : 'Geolocation Coordinates'}</span>
                        <span class="font-mono font-bold text-slate-800 mt-0.5 block">${loc.lat}, ${loc.lng}</span>
                    </div>
                </div>

                <!-- ข้อความอธิบาย EUDR Traceability -->
                <div class="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start space-x-2">
                    <i class="fa-solid fa-circle-info text-indigo-500 mt-0.5 shrink-0"></i>
                    <span>${(typeof currentLang !== "undefined" && currentLang === "th") ? 'ข้อมูลพิกัดภูมิศาสตร์สำหรับการตรวจสอบย้อนกลับตามข้อบังคับสินค้าปลอดการทำลายป่าไม้ของสหภาพยุโรป (EUDR DDS)' : 'Geolocation Traceability data for Due Diligence Statement (DDS) compliance under EU Deforestation Regulation (EUDR).'}</span>
                </div>
            </div>
        `;
    },

    // เรนเดอร์หน้าแผนที่พิกัดรวมทั้งหมด (All Locations GIS Map with Dispersion Animation)
    renderMapOverviewView: function (orders) {
        const t = (typeof translations !== "undefined" && translations[currentLang]) || {};
        const dataList = orders || [];
        const gisItems = typeof buildGisMapItems === "function" ? buildGisMapItems(dataList) : dataList;
        const totalPlots = gisItems.length;

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

        // รายการการ์ดสถานที่ใน Sidebar ด้านข้าง (รองรับ 1 MO หลายแปลง)
        const locationCardsHtml = gisItems.map((item, idx) => {
            const theme = getMarkerTheme(item.plotName || "");
            const multiPlotBadge = item.totalPlotsInMo > 1 ? `
                <div class="mb-1.5 flex items-center justify-between">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center">
                        <i class="fa-solid fa-layer-group mr-1.5 text-indigo-500"></i>
                        แปลงที่ ${item.plotIndex}/${item.totalPlotsInMo} (MO เดียวกัน)
                    </span>
                    <span class="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <i class="fa-solid fa-draw-polygon mr-1"></i>${item.fileType}
                    </span>
                </div>
            ` : "";

            return `
                <div 
                    id="${item.cardId}" 
                    data-gis-key="${item.key}"
                    onclick="focusGisItem('${item.key}')"
                    class="p-3 bg-white hover:bg-indigo-50/70 border border-slate-200 rounded-xl cursor-pointer transition-all hover:border-indigo-300 shadow-2xs group relative"
                >
                    ${multiPlotBadge}
                    <div class="flex items-start justify-between gap-1">
                        <div class="flex items-center space-x-2">
                            <span class="w-6 h-6 rounded-lg ${theme.bg} text-white flex items-center justify-center text-[10px] shrink-0">
                                <i class="fa-solid ${theme.icon}"></i>
                            </span>
                            <div>
                                <span class="font-bold text-slate-800 text-xs block group-hover:text-indigo-600 transition-colors truncate max-w-[170px]" title="${item.plotName}">
                                    ${item.plotName}
                                </span>
                                <span class="text-[10px] text-slate-400 font-mono">${item.moNo || item.orderNo}</span>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">
                            ${item.orderQuantity || '500T'}
                        </span>
                    </div>

                    <div class="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>เนื้อที่: <strong class="text-emerald-700 font-semibold">${item.areaShort}</strong></span>
                        <span class="text-[10px] text-emerald-600 font-medium">📍 ${typeof item.lat === 'number' ? item.lat.toFixed(4) : item.lat}, ${typeof item.lng === 'number' ? item.lng.toFixed(4) : item.lng}</span>
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
                                ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'แผนที่พิกัดรวมแหล่งกำเนิดไม้และโรงงาน' : 'EUDR Master GIS Overview'}
                            </h2>
                            <p class="text-xs text-slate-500 mt-1">
                                ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'แผนที่ดาวเทียมและภูมิศาสตร์แบบโต้ตอบ จุดพิกัดขยับและซูมตามตำแหน่งจริง พร้อมระบบแอนิเมชันกระจายหมุดพิกัด' : 'Interactive GIS Map with dynamic pin animations and real-world satellite coordinates'}
                            </p>
                        </div>

                        <!-- Action Controls: Header only keeps Return to Dashboard -->
                        <div class="flex items-center space-x-2.5 shrink-0">
                            <button 
                                type="button" 
                                onclick="switchView('dashboard')" 
                                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center shadow-2xs whitespace-nowrap"
                            >
                                <i class="fa-solid fa-arrow-left mr-1.5"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'กลับหน้าหลัก' : 'Back to Dashboard'}
                            </button>
                        </div>
                    </div>

                    <!-- 4 Quick Stats Badges -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span class="text-slate-400 text-[11px] block font-medium">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'จำนวนพิกัดในระบบ' : 'Total Coordinates'}</span>
                            <span class="text-lg font-black text-slate-900 mt-0.5 block">${totalPlots} ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'จุดพิกัด' : 'Points'}</span>
                        </div>
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span class="text-slate-400 text-[11px] block font-medium">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'ปริมาณไม้ยางพารารวม' : 'Biomass Volume'}</span>
                            <span class="text-lg font-black text-amber-600 mt-0.5 block">${totalTon.toLocaleString()} ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'ตัน' : 'Tons'}</span>
                        </div>
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span class="text-slate-400 text-[11px] block font-medium">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'พื้นที่แปลงสวนยาง' : 'Plantation Area'}</span>
                            <span class="text-lg font-black text-emerald-600 mt-0.5 block">${displayAreaRai}</span>
                        </div>
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span class="text-slate-400 text-[11px] block font-medium">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'สถานะการรับรอง EUDR' : 'EUDR Compliance Status'}</span>
                            <span class="text-lg font-black text-indigo-600 mt-0.5 block">${(typeof currentLang !== "undefined" && currentLang === "th") ? '100% รับรองแล้ว' : '100% Verified'}</span>
                        </div>
                    </div>
                </div>

                <!-- Main Interactive Map Canvas + Location Sidebar -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- แผนที่ Leaflet GIS Map Canvas (3 ส่วน) -->
                    <div id="gisMapBoxWrapper" class="lg:col-span-3 bg-slate-950 rounded-3xl p-4 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col transition-all">
                        
                        <!-- Top Map Toolbar & Map Legend & Tile Switcher -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800 text-xs z-30 shrink-0">
                            <div class="flex items-center space-x-2 text-white">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span class="font-bold">Southern Thailand Wood Supply Chain & Export Corridor</span>
                                <span id="fullscreenNoticeBadge" class="hidden text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/50 px-2 py-0.5 rounded-full font-semibold">
                                    <i class="fa-solid fa-expand mr-1"></i> เต็มจอ (กด Esc หรือปุ่มย่อเพื่อออก)
                                </span>
                            </div>

                            <!-- Map Action Controls -->
                            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <button 
                                    type="button" 
                                    onclick="triggerMapDispersionAnimation()" 
                                    class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-all flex items-center border border-indigo-400/50 hover:scale-105 active:scale-95"
                                    title="เล่นแอนิเมชันรวมศูนย์และกระจายหมุดพิกัดอีกครั้ง"
                                >
                                    <i class="fa-solid fa-play mr-1.5 text-[10px] text-white"></i> Replay Animation (เล่นแอนิเมชัน)
                                </button>

                                <button 
                                    type="button" 
                                    onclick="resetLeafletMapView()" 
                                    class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-semibold shadow-xs transition-colors flex items-center hover:border-slate-500"
                                    title="รีเซ็ตมุมมองแผนที่ภาคใต้"
                                >
                                    <i class="fa-solid fa-arrows-rotate mr-1 text-[10px] text-slate-400"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'รีเซ็ต' : 'Reset'}
                                </button>

                                <!-- ตัวสลับ Street / Satellite -->
                                <div class="bg-slate-900 border border-slate-700 rounded-xl p-0.5 flex items-center space-x-1 text-[11px]">
                                    <button type="button" onclick="switchLeafletTile('osm')" id="btnTileOsm" class="px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white transition-all flex items-center whitespace-nowrap">
                                        <i class="fa-solid fa-map mr-1 text-xs"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'แผนที่ถนน' : 'Street'}
                                    </button>
                                    <button type="button" onclick="switchLeafletTile('satellite')" id="btnTileSat" class="px-2.5 py-1 rounded-lg font-medium text-slate-300 hover:text-white transition-all flex items-center whitespace-nowrap">
                                        <i class="fa-solid fa-satellite mr-1 text-xs"></i> ${(typeof currentLang !== "undefined" && currentLang === "th") ? 'ภาพถ่ายดาวเทียม' : 'Satellite'}
                                    </button>
                                </div>

                                <button 
                                    type="button" 
                                    id="btnToggleMapFullscreen" 
                                    onclick="toggleMapFullscreen()" 
                                    class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-[11px] font-bold transition-all flex items-center shadow-xs hover:border-slate-500 whitespace-nowrap"
                                >
                                    <i id="btnFullscreenIcon" class="fa-solid fa-expand mr-1 text-indigo-400 text-xs"></i> 
                                    <span id="btnFullscreenText">${(typeof currentLang !== "undefined" && currentLang === "th") ? 'เต็มจอ' : 'Fullscreen'}</span>
                                </button>
                            </div>
                        </div>

                        <!-- The Animated Leaflet Map Container -->
                        <div id="gisMapViewport" class="relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
                            <div id="leafletMap" class="w-full h-full z-10"></div>

                            <button 
                                type="button" 
                                id="floatingFullscreenBtn"
                                onclick="toggleMapFullscreen()" 
                                class="absolute top-3 right-3 z-30 bg-slate-900/90 hover:bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
                                title="ขยาย/ย่อเต็มหน้าจอ (Toggle Fullscreen)"
                            >
                                <i id="floatingFullscreenIcon" class="fa-solid fa-expand text-xs text-indigo-300"></i>
                            </button>

                            <div id="mapFloatingQuickControls" class="absolute top-3 left-14 z-30 flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl">
                                <button 
                                    type="button" 
                                    onclick="triggerMapDispersionAnimation()" 
                                    class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-all flex items-center border border-indigo-400/50 hover:scale-105 active:scale-95"
                                    title="เล่นแอนิเมชันรวมศูนย์และกระจายหมุดพิกัดอีกครั้ง"
                                >
                                    <i class="fa-solid fa-play mr-1.5 text-[10px] text-white"></i> เล่นแอนิเมชัน (Replay)
                                </button>
                                <button 
                                    type="button" 
                                    onclick="resetLeafletMapView()" 
                                    class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-semibold transition-all flex items-center border border-slate-600 hover:border-slate-400 shadow-xs"
                                    title="รีเซ็ตมุมมองแผนที่ภาคใต้"
                                >
                                    <i class="fa-solid fa-arrows-rotate mr-1 text-[10px] text-slate-400"></i> รีเซ็ต
                                </button>
                                <div class="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-cyan-950/70 border border-cyan-500/40 rounded-xl text-[10px] text-cyan-300 font-medium">
                                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                                    <span>🛰️ Sentinel-2 / Landsat-9: Active • Cloud &lt; 5%</span>
                                </div>
                            </div>

                            <!-- การ์ด Modal รายละเอียดเมื่อคลิกหมุด (Marker Detail Popup Card) -->
                            <div id="markerDetailPopup" class="hidden absolute bottom-5 left-5 right-5 sm:right-auto sm:w-96 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700 z-50 transition-all">
                                <div id="markerDetailPopupContent"></div>
                            </div>

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
                                    Location Registry (รายการพิกัด <span id="mapSidebarCount">${totalPlots}</span>)
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
                                    placeholder="Search plot, MO, customer (ค้นหาชื่อแปลง, MO)..." 
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
});
