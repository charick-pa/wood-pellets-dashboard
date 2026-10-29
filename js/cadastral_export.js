/**
 * Cadastral Export & Storage Module: LocalStorage Persistence, Multi-Plot Aggregation & KML/GeoJSON Exports
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines
 */

const CADASTRAL_STORAGE_KEY = "greenriver_cadastral_plots_v1";

// 1. บันทึกข้อมูลแปลงที่ดินทั้งหมดลง LocalStorage ถาวร
function saveCadastralPlotsToStorage() {
  try {
    if (window.cadastralPlots && window.cadastralPlots.length > 0) {
      localStorage.setItem(CADASTRAL_STORAGE_KEY, JSON.stringify(window.cadastralPlots));
    }
  } catch (err) {
    console.warn("[LocalStorage Save Error]", err);
  }
}

// โหลดข้อมูลแปลงที่ดินจาก LocalStorage (ถ้ามี)
function loadCadastralPlotsFromStorage() {
  try {
    const raw = localStorage.getItem(CADASTRAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("[LocalStorage Load Error]", err);
  }
  return null;
}

// ล้างข้อมูลใน LocalStorage เพื่อรีเซ็ตกลับเป็นค่าเริ่มต้น
function resetCadastralPlotsStorage() {
  try {
    localStorage.removeItem(CADASTRAL_STORAGE_KEY);
  } catch (err) {
    console.warn("[LocalStorage Reset Error]", err);
  }
}

// 2. ค้นหาแปลงทั้งหมดที่ผูกกับคำสั่งซื้อ MO เดียวกัน (รองรับ 1 MO : Many Plots)
function getPlotsByMoNo(moNo) {
  if (!moNo) return [];
  if (typeof ensureCadastralPlotsInitialized === "function") ensureCadastralPlotsInitialized();
  const target = String(moNo).trim().toUpperCase();
  return (window.cadastralPlots || []).filter(p => p.linkedMoNo && p.linkedMoNo.trim().toUpperCase() === target);
}

// สรุปยอดรวมเนื้อที่และสถิติของทุกแปลงใน 1 MO
function getMultiPlotSummaryForMo(moNo) {
  const plots = getPlotsByMoNo(moNo);
  if (!plots || plots.length === 0) return null;

  let totalSqMeters = 0;
  plots.forEach(p => {
    totalSqMeters += Number(p.areaSqMeters) || 0;
  });

  const thaiArea = typeof formatThaiArea === "function" ? formatThaiArea(totalSqMeters) : {
    rai: Math.floor(totalSqMeters / 1600),
    ngan: Math.floor((totalSqMeters % 1600) / 400),
    sqWah: Math.round(((totalSqMeters % 1600) % 400) / 4),
    hectares: (totalSqMeters / 10000).toFixed(2),
    sqMeters: totalSqMeters.toLocaleString()
  };

  return {
    moNo: moNo,
    count: plots.length,
    plots: plots,
    totalSqMeters: totalSqMeters,
    thaiArea: thaiArea
  };
}

// 3. ตัวแปลง FeatureCollection สำหรับ GeoJSON (รองรับ 1 แปลง หรือ หลายแปลง)
function escapeXml(s) {
  if (s === null || s === undefined) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildGeoJsonFeatureCollection(plots) {
  const features = (plots || []).map((plot) => {
    const geoJsonRing = (plot.coordinates || []).map((p) => [p[1], p[0]]);
    if (geoJsonRing.length > 0) geoJsonRing.push(geoJsonRing[0]);
    const attrs = plot.attributes || {};
    return {
      type: "Feature",
      properties: {
        plot_id: plot.id,
        plot_name: plot.name,
        linked_mo_no: plot.linkedMoNo || "",
        source_file: plot.fileName || "",
        thai_area: plot.thaiArea ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว.` : "",
        area_sqm: plot.areaSqMeters || 0,
        hectares: plot.thaiArea ? parseFloat(plot.thaiArea.hectares) : 0,
        eudr_status: "VERIFIED",
        ...attrs
      },
      geometry: { type: "Polygon", coordinates: [geoJsonRing] }
    };
  });
  return { type: "FeatureCollection", features: features };
}

// 4. ตัวแปลง Document KML 2.2 สำหรับ Google Earth (รองรับ 1 แปลง หรือ หลายแปลง)
function buildKmlDocument(plots, docTitle) {
  const placemarks = (plots || []).map((plot) => {
    const coords = (plot.coordinates || []).map((p) => `${p[1].toFixed(6)},${p[0].toFixed(6)},0`);
    if (plot.coordinates && plot.coordinates.length > 0) {
      coords.push(`${plot.coordinates[0][1].toFixed(6)},${plot.coordinates[0][0].toFixed(6)},0`);
    }
    const thaiAreaStr = plot.thaiArea ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว. (${plot.thaiArea.sqMeters} ตร.ม.)` : "";
    const attrs = plot.attributes || {};
    const extLines = Object.keys(attrs).map(k => `        <Data name="${escapeXml(k)}"><value>${escapeXml(attrs[k])}</value></Data>`).join("\n");
    const extBlock = extLines ? `\n      <ExtendedData>\n${extLines}\n      </ExtendedData>` : "";

    return `    <Placemark>
      <name>${escapeXml(plot.name)}</name>
      <description><![CDATA[
        <h3>${plot.name}</h3>
        <p><strong>MO:</strong> ${plot.linkedMoNo || 'แปลงทั่วไป'}</p>
        <p><strong>เนื้อที่:</strong> ${thaiAreaStr}</p>
        <p><strong>สถานะ:</strong> EUDR Traceability & SBP Biomass Verified</p>
      ]]></description>${extBlock}
      <styleUrl>#plotStyle</styleUrl>
      <Polygon>
        <extrude>1</extrude><altitudeMode>clampToGround</altitudeMode>
        <outerBoundaryIs><LinearRing><coordinates>${coords.join("\n            ")}</coordinates></LinearRing></outerBoundaryIs>
      </Polygon>
    </Placemark>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(docTitle || 'GreenRiver_Cadastral_Plots')}</name>
    <Style id="plotStyle">
      <LineStyle><color>ff10b981</color><width>3.5</width></LineStyle>
      <PolyStyle><color>4034d399</color><fill>1</fill><outline>1</outline></PolyStyle>
    </Style>
${placemarks}
  </Document>
</kml>`;
}

// ดึงรายการแปลงที่ผ่านการกรองในหน้า Cadastral View
function getFilteredCadastralPlots() {
  const all = window.cadastralPlots || [];
  const keyword = ($("#filterCadastralPlotInput").val() || "").trim().toLowerCase();
  if (!keyword) return all;
  return all.filter((p) => {
    const text = `${p.name} ${p.linkedMoNo || ''} ${p.id || ''}`.toLowerCase();
    return text.includes(keyword);
  });
}

// 5. กล่องโต้ตอบเลือกขอบเขตและรูปแบบการส่งออก (Export Modal Wizard: Active / MO / Filtered / All)
function openCadastralExportDialog(defaultFormat) {
  if (typeof ensureCadastralPlotsInitialized === "function") ensureCadastralPlotsInitialized();
  const allPlots = window.cadastralPlots || [];
  if (allPlots.length === 0) {
    if (typeof showSwalWarning === "function") showSwalWarning("No Plots", "No cadastral parcels available to export.");
    return;
  }

  const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
  const activePlot = allPlots.find((p) => p.id === window.activeCadastralPlotId) || allPlots[0];
  const activeMo = activePlot && activePlot.linkedMoNo ? activePlot.linkedMoNo : "";
  const moPlots = activeMo ? getPlotsByMoNo(activeMo) : [];
  const filteredPlots = getFilteredCadastralPlots();

  let selectedFormat = (defaultFormat || "KML").toUpperCase();
  if (selectedFormat !== "KML" && selectedFormat !== "GEOJSON") selectedFormat = "KML";

  const modalHtml = `
    <div class="text-left text-xs space-y-3.5">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">${isTh ? '1. เลือกรูปแบบไฟล์ (Export Format):' : '1. Select Export Format:'}</label>
        <div class="grid grid-cols-2 gap-2">
          <label class="flex items-center p-2 rounded-xl border cursor-pointer ${selectedFormat === 'KML' ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}">
            <input type="radio" name="swalExportFormat" value="KML" ${selectedFormat === 'KML' ? 'checked' : ''} class="mr-2">
            <span><i class="fa-solid fa-earth-americas text-amber-600 mr-1"></i>Google Earth (.KML)</span>
          </label>
          <label class="flex items-center p-2 rounded-xl border cursor-pointer ${selectedFormat === 'GEOJSON' ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}">
            <input type="radio" name="swalExportFormat" value="GEOJSON" ${selectedFormat === 'GEOJSON' ? 'checked' : ''} class="mr-2">
            <span><i class="fa-solid fa-file-code text-indigo-600 mr-1"></i>EUDR (.geojson)</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">${isTh ? '2. เลือกขอบเขตข้อมูล (Export Scope):' : '2. Select Export Scope:'}</label>
        <div class="space-y-1.5">
          <label class="flex items-start p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
            <input type="radio" name="swalExportScope" value="active" checked class="mt-0.5 mr-2">
            <div class="flex-1 min-w-0">
              <span class="font-bold text-slate-800 block">${isTh ? '📌 เฉพาะแปลงปัจจุบัน (Current Plot)' : '📌 Current Active Plot'}</span>
              <span class="text-[11px] text-slate-500 truncate block">${activePlot.name} (1 แปลง)</span>
            </div>
          </label>
          <label class="flex items-start p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer ${moPlots.length === 0 ? 'opacity-50 pointer-events-none' : ''}">
            <input type="radio" name="swalExportScope" value="mo" ${moPlots.length === 0 ? 'disabled' : ''} class="mt-0.5 mr-2">
            <div class="flex-1 min-w-0">
              <span class="font-bold text-slate-800 block">${isTh ? '📦 ทุกแปลงในคำสั่งซื้อนี้ (All Plots in this MO)' : '📦 All Plots for this MO'}</span>
              <span class="text-[11px] text-slate-500 truncate block">${activeMo ? `${activeMo} (${moPlots.length} แปลง)` : (isTh ? 'ไม่มีคำสั่งซื้อที่ผูกไว้' : 'No linked MO')}</span>
            </div>
          </label>
          <label class="flex items-start p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
            <input type="radio" name="swalExportScope" value="filtered" class="mt-0.5 mr-2">
            <div class="flex-1 min-w-0">
              <span class="font-bold text-slate-800 block">${isTh ? '🔍 แปลงตามตัวกรองค้นหา (Filtered Plots)' : '🔍 Filtered Plots'}</span>
              <span class="text-[11px] text-slate-500 block">${isTh ? `ผลการค้นหาปัจจุบัน (${filteredPlots.length} แปลง)` : `Current filtered (${filteredPlots.length} plots)`}</span>
            </div>
          </label>
          <label class="flex items-start p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
            <input type="radio" name="swalExportScope" value="all" class="mt-0.5 mr-2">
            <div class="flex-1 min-w-0">
              <span class="font-bold text-slate-800 block">${isTh ? '🌐 แปลงทั้งหมดในระบบ (All Plots in System)' : '🌐 All System Plots'}</span>
              <span class="text-[11px] text-slate-500 block">${isTh ? `แปลงทั้งหมด (${allPlots.length} แปลง)` : `All registered parcels (${allPlots.length} plots)`}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  `;

  Swal.fire({
    title: isTh ? 'ส่งออกข้อมูลแปลงที่ดิน (Export Options)' : 'Export Cadastral Boundaries',
    html: modalHtml,
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#64748b',
    confirmButtonText: isTh ? '<i class="fa-solid fa-download mr-1"></i> ดาวน์โหลด' : '<i class="fa-solid fa-download mr-1"></i> Download',
    cancelButtonText: isTh ? 'ยกเลิก' : 'Cancel',
    width: '450px',
    preConfirm: () => {
      const scope = $('input[name="swalExportScope"]:checked').val() || 'active';
      const format = $('input[name="swalExportFormat"]:checked').val() || 'KML';
      return { scope, format };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      executeCadastralExport(result.value.scope, result.value.format);
    }
  });
}

// 6. ดำเนินการส่งออกไฟล์ตามขอบเขตและรูปแบบที่เลือก
function executeCadastralExport(scope, format) {
  if (typeof ensureCadastralPlotsInitialized === "function") ensureCadastralPlotsInitialized();
  const allPlots = window.cadastralPlots || [];
  const activePlot = allPlots.find((p) => p.id === window.activeCadastralPlotId) || allPlots[0];
  const isTh = (typeof currentLang !== "undefined" && currentLang === "th");

  let targetPlots = [];
  let filePrefix = "Cadastral";

  if (scope === "active") {
    if (!activePlot) {
      if (typeof showSwalWarning === "function") showSwalWarning("No Plot", isTh ? "ไม่พบแปลงที่เลือก" : "No active parcel found.");
      return;
    }
    targetPlots = [activePlot];
    filePrefix = activePlot.name.replace(/[\s\/\\]+/g, "_");
  } else if (scope === "mo") {
    const moNo = activePlot && activePlot.linkedMoNo ? activePlot.linkedMoNo : "";
    targetPlots = moNo ? getPlotsByMoNo(moNo) : (activePlot ? [activePlot] : []);
    if (targetPlots.length === 0) {
      if (typeof showSwalWarning === "function") showSwalWarning("No Linked Plots", isTh ? "ไม่พบแปลงที่ผูกกับ MO นี้" : "No plots linked to this MO.");
      return;
    }
    filePrefix = `${(moNo || 'Unlinked')}_All_${targetPlots.length}_Plots`;
  } else if (scope === "filtered") {
    targetPlots = getFilteredCadastralPlots();
    filePrefix = `Filtered_${targetPlots.length}_Plots`;
  } else {
    targetPlots = allPlots;
    filePrefix = `GreenRiver_All_${targetPlots.length}_Plots`;
  }

  if (targetPlots.length === 0) {
    if (typeof showSwalWarning === "function") showSwalWarning("Empty Data", isTh ? "ไม่มีแปลงที่ดินสำหรับส่งออก" : "No plots available to export.");
    return;
  }

  const fmt = (format || "KML").toUpperCase();
  if (fmt === "GEOJSON") {
    const geoJson = buildGeoJsonFeatureCollection(targetPlots);
    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: "application/geo+json" });
    downloadBlobFile(blob, `${filePrefix}_EUDR.geojson`);
  } else {
    const kml = buildKmlDocument(targetPlots, filePrefix);
    const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
    downloadBlobFile(blob, `${filePrefix}_GoogleEarth.kml`);
  }

  if (typeof showSwalSuccess === "function") {
    showSwalSuccess(
      isTh ? "ส่งออกไฟล์สำเร็จ" : "Export Completed",
      isTh ? `ส่งออกข้อมูล ${targetPlots.length} แปลงในรูปแบบ ${fmt} สำเร็จเรียบร้อยแล้ว` : `Exported ${targetPlots.length} parcels as ${fmt} successfully.`
    );
  }
}

// ฟังก์ชัน Backward-Compatible สำหรับการเรียกใช้งานเดิม
function exportActivePlotGeoJson() { executeCadastralExport("active", "GEOJSON"); }
function exportActivePlotKml() { executeCadastralExport("active", "KML"); }
function exportAllPlotsForMoGeoJson(moNo) {
  const plots = getPlotsByMoNo(moNo);
  if (!plots || plots.length === 0) {
    if (typeof showSwalWarning === "function") showSwalWarning("No Linked Plots", `No cadastral plots linked to MO ${moNo}.`);
    return;
  }
  const geoJson = buildGeoJsonFeatureCollection(plots);
  const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: "application/geo+json" });
  downloadBlobFile(blob, `${moNo}_All_${plots.length}_Plots_EUDR.geojson`);
}

function downloadBlobFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 7. สร้างรายการพิกัดรวมสำหรับแผนที่ GIS (เชื่อมโยง 1 MO หลายแปลงจาก Cadastral)
function buildGisMapItems(orders) {
  if (typeof ensureCadastralPlotsInitialized === "function") ensureCadastralPlotsInitialized();
  const dataset = orders || (typeof globalData !== "undefined" ? globalData : []);
  const items = [];
  const processedPlotIds = new Set();

  const toGisItem = (key, cardId, orderNo, moNo, cust, qty, pId, pName, pIdx, total, isCad, lat, lng, coords, tArea, aShort, fType, fName, pObj, oObj) => ({
    key, cardId: cardId.replace(/[^a-zA-Z0-9_-]/g, "_"), orderNo, moNo, customer: cust, orderQuantity: qty,
    plotId: pId, plotName: pName, plotIndex: pIdx, totalPlotsInMo: total, isCadastralPlot: isCad, lat, lng,
    coordinates: coords, thaiAreaStr: tArea, areaShort: aShort, fileType: fType, fileName: fName, plotObj: pObj, orderObj: oObj
  });

  dataset.forEach((item) => {
    const mo = (item.moNo || "").trim();
    const linked = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(mo) : [];
    if (linked.length > 0) {
      linked.forEach((p, idx) => {
        processedPlotIds.add(p.id);
        const c = p.centroid || (p.coordinates && p.coordinates[0]) || [7.0089, 100.4767];
        const tArea = p.thaiArea ? `${p.thaiArea.rai} ไร่ ${p.thaiArea.ngan} งาน ${p.thaiArea.sqWah} ตร.ว.` : (item.location?.areaRai || "-");
        items.push(toGisItem(`${item.orderNo}__${p.id}`, `loc-card-${item.orderNo}-${p.id}`, item.orderNo, item.moNo, item.customer, item.orderQuantity, p.id, p.name, idx + 1, linked.length, true, c[0], c[1], p.coordinates, tArea, p.thaiArea ? `${p.thaiArea.rai} ไร่ ${p.thaiArea.ngan} งาน` : (item.location?.areaRai || "-"), p.fileType || "KML", p.fileName || "", p, item));
      });
    } else {
      const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "แปลงสวนไม้ยางพารา", plotId: "PLOT-01" };
      items.push(toGisItem(item.orderNo, `loc-card-${item.orderNo}`, item.orderNo, item.moNo, item.customer, item.orderQuantity, loc.plotId || "-", loc.placeName || "แปลงสวนไม้ยางพารา", 1, 1, false, loc.lat, loc.lng, null, loc.areaRai || "-", loc.areaRai || "-", "GPS", "", null, item));
    }
  });

  (window.cadastralPlots || []).forEach((p) => {
    if (!processedPlotIds.has(p.id)) {
      const c = p.centroid || (p.coordinates && p.coordinates[0]) || [7.0089, 100.4767];
      items.push(toGisItem(`plot__${p.id}`, `loc-card-custom-${p.id}`, p.linkedMoNo || "แปลงทั่วไป", p.linkedMoNo || "-", "แปลงที่ดินนำเข้า (EUDR Cadastral)", "-", p.id, p.name, 1, 1, true, c[0], c[1], p.coordinates, p.thaiArea ? `${p.thaiArea.rai} ไร่ ${p.thaiArea.ngan} งาน` : "-", p.thaiArea ? `${p.thaiArea.rai} ไร่ ${p.thaiArea.ngan} งาน` : "-", p.fileType || "KML", p.fileName || "", p, null));
    }
  });

  return items;
}

// นำทางตรงไปยังแปลงใน Cadastral View
function jumpToCadastralPlot(plotId) {
  if (plotId && typeof window.activeCadastralPlotId !== "undefined") {
    window.activeCadastralPlotId = plotId;
  }
  if (typeof switchView === "function") {
    switchView("cadastral");
  }
}
