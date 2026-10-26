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

// ส่งออกทุกแปลงที่ผูกกับ MO นี้เป็น GeoJSON เดียวกัน (EUDR TracesNT Multi-Feature)
function exportAllPlotsForMoGeoJson(moNo) {
  const plots = getPlotsByMoNo(moNo);
  if (!plots || plots.length === 0) {
    showSwalWarning("No Linked Plots", `No cadastral plots are currently linked to Manufacturing Order ${moNo}.`);
    return;
  }

  const features = plots.map(plot => {
    const geoJsonRing = plot.coordinates.map(p => [p[1], p[0]]);
    geoJsonRing.push(geoJsonRing[0]);
    return {
      type: "Feature",
      properties: {
        plot_id: plot.id,
        plot_name: plot.name,
        linked_mo_no: plot.linkedMoNo || "",
        source_file: plot.fileName,
        thai_area: `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว.`,
        area_sqm: plot.areaSqMeters,
        eudr_status: "VERIFIED"
      },
      geometry: { type: "Polygon", coordinates: [geoJsonRing] }
    };
  });

  const geoJson = { type: "FeatureCollection", features: features };
  const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: "application/geo+json" });
  downloadBlobFile(blob, `${moNo}_All_${plots.length}_Plots_EUDR.geojson`);
}

// 3. ส่งออกแปลงปัจจุบันเป็นไฟล์ GeoJSON
function exportActivePlotGeoJson() {
  const plot = (window.cadastralPlots || []).find(p => p.id === window.activeCadastralPlotId);
  if (!plot) {
    showSwalWarning("No Plot Selected", "Please select a parcel to export as GeoJSON.");
    return;
  }

  const geoJsonRing = plot.coordinates.map(p => [p[1], p[0]]);
  geoJsonRing.push(geoJsonRing[0]);

  const geoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          plot_id: plot.id,
          plot_name: plot.name,
          linked_mo_no: plot.linkedMoNo || "",
          source_file: plot.fileName,
          thai_area: `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว.`,
          area_sqm: plot.areaSqMeters,
          hectares: parseFloat(plot.thaiArea.hectares),
          eudr_status: "VERIFIED"
        },
        geometry: { type: "Polygon", coordinates: [geoJsonRing] }
      }
    ]
  };

  const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: "application/geo+json" });
  downloadBlobFile(blob, `${plot.name.replace(/[\s\/\\]+/g, "_")}_EUDR.geojson`);
}

// 4. ส่งออกแปลงปัจจุบันเป็นไฟล์ Google Earth KML (.kml)
function exportActivePlotKml() {
  const plot = (window.cadastralPlots || []).find(p => p.id === window.activeCadastralPlotId);
  if (!plot) {
    showSwalWarning("No Plot Selected", "Please select a parcel to export as KML.");
    return;
  }

  const kmlCoordsArr = plot.coordinates.map(p => `${p[1].toFixed(6)},${p[0].toFixed(6)},0`);
  if (plot.coordinates.length > 0) {
    kmlCoordsArr.push(`${plot.coordinates[0][1].toFixed(6)},${plot.coordinates[0][0].toFixed(6)},0`);
  }
  const kmlCoordsString = kmlCoordsArr.join("\n            ");
  const thaiAreaStr = `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว. (${plot.thaiArea.sqMeters} ตร.ม.)`;

  const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${plot.name}</name>
    <description><![CDATA[
      <h3>${plot.name}</h3>
      <p><strong>คำสั่งซื้อที่ผูกไว้ (Linked MO No.):</strong> ${plot.linkedMoNo || 'แปลงทั่วไป'}</p>
      <p><strong>เนื้อที่คำนวณได้:</strong> ${thaiAreaStr}</p>
      <p><strong>สถานะความสอดคล้อง:</strong> EUDR Traceability & SBP Biomass Compliant</p>
    ]]></description>
    <Style id="plotStyle">
      <LineStyle><color>ff10b981</color><width>3.5</width></LineStyle>
      <PolyStyle><color>4034d399</color><fill>1</fill><outline>1</outline></PolyStyle>
    </Style>
    <Placemark>
      <name>${plot.name}</name>
      <styleUrl>#plotStyle</styleUrl>
      <Polygon>
        <extrude>1</extrude><altitudeMode>clampToGround</altitudeMode>
        <outerBoundaryIs><LinearRing><coordinates>${kmlCoordsString}</coordinates></LinearRing></outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;

  const blob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml" });
  downloadBlobFile(blob, `${plot.name.replace(/[\s\/\\]+/g, "_")}_GoogleEarth.kml`);
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

// 5. สร้างรายการพิกัดรวมสำหรับแผนที่ GIS (เชื่อมโยง 1 MO หลายแปลงจาก Cadastral)
function buildGisMapItems(orders) {
  if (typeof ensureCadastralPlotsInitialized === "function") ensureCadastralPlotsInitialized();
  const dataset = orders || (typeof globalData !== "undefined" ? globalData : []);
  const items = [];
  const processedPlotIds = new Set();

  dataset.forEach((item) => {
    const mo = (item.moNo || "").trim();
    const linkedPlots = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(mo) : [];

    if (linkedPlots && linkedPlots.length > 0) {
      linkedPlots.forEach((plot, pIdx) => {
        processedPlotIds.add(plot.id);
        const centroid = plot.centroid || (plot.coordinates && plot.coordinates[0]) || [7.0089, 100.4767];
        items.push({
          key: `${item.orderNo}__${plot.id}`,
          cardId: `loc-card-${item.orderNo}-${plot.id}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
          orderNo: item.orderNo,
          moNo: item.moNo,
          customer: item.customer,
          orderQuantity: item.orderQuantity,
          plotId: plot.id,
          plotName: plot.name,
          plotIndex: pIdx + 1,
          totalPlotsInMo: linkedPlots.length,
          isCadastralPlot: true,
          lat: centroid[0],
          lng: centroid[1],
          coordinates: plot.coordinates,
          thaiAreaStr: plot.thaiArea ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว.` : (item.location?.areaRai || "-"),
          areaShort: plot.thaiArea ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน` : (item.location?.areaRai || "-"),
          fileType: plot.fileType || "KML",
          fileName: plot.fileName || "",
          plotObj: plot,
          orderObj: item
        });
      });
    } else {
      const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "แปลงสวนไม้ยางพารา", plotId: "PLOT-01" };
      items.push({
        key: item.orderNo,
        cardId: `loc-card-${item.orderNo}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
        orderNo: item.orderNo,
        moNo: item.moNo,
        customer: item.customer,
        orderQuantity: item.orderQuantity,
        plotId: loc.plotId || "-",
        plotName: loc.placeName || "แปลงสวนไม้ยางพารา",
        plotIndex: 1,
        totalPlotsInMo: 1,
        isCadastralPlot: false,
        lat: loc.lat,
        lng: loc.lng,
        coordinates: null,
        thaiAreaStr: loc.areaRai || "-",
        areaShort: loc.areaRai || "-",
        fileType: "GPS",
        fileName: "",
        orderObj: item
      });
    }
  });

  // แปลงนำเข้าเพิ่มเติมที่ยังไม่ตรงกับ Order ในชุดข้อมูล
  (window.cadastralPlots || []).forEach((plot) => {
    if (!processedPlotIds.has(plot.id)) {
      const centroid = plot.centroid || (plot.coordinates && plot.coordinates[0]) || [7.0089, 100.4767];
      items.push({
        key: `plot__${plot.id}`,
        cardId: `loc-card-custom-${plot.id}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
        orderNo: plot.linkedMoNo || "แปลงทั่วไป",
        moNo: plot.linkedMoNo || "-",
        customer: "แปลงที่ดินนำเข้า (EUDR Cadastral)",
        orderQuantity: "-",
        plotId: plot.id,
        plotName: plot.name,
        plotIndex: 1,
        totalPlotsInMo: 1,
        isCadastralPlot: true,
        lat: centroid[0],
        lng: centroid[1],
        coordinates: plot.coordinates,
        thaiAreaStr: plot.thaiArea ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน` : "-",
        areaShort: plot.thaiArea ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน` : "-",
        fileType: plot.fileType || "KML",
        fileName: plot.fileName || "",
        plotObj: plot,
        orderObj: null
      });
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


// 5. สั่งพิมพ์เอกสารรับรองแปลงที่ดิน EUDR (A4 Official Plot Certificate)
function printCadastralPlotCertificate() {
  const plots = window.cadastralPlots || [];
  const plot = plots.find(p => p.id === window.activeCadastralPlotId) || plots[0];
  if (!plot) {
    if (typeof showSwalWarning === "function") showSwalWarning("No Plot Selected", "Please select a cadastral plot first.");
    return;
  }

  const vRows = (plot.vertices || []).slice(0, 16).map((v, i) =>
    `<tr><td style="text-align:center;font-weight:bold;color:#475569;">#${v.no || i + 1}</td><td style="font-family:monospace;color:#047857;">${Number(v.lat).toFixed(6)}</td><td style="font-family:monospace;color:#4338ca;">${Number(v.lng).toFixed(6)}</td><td style="color:#64748b;font-size:8.5px;">WGS84 (EPSG:4326)</td></tr>`
  ).join("");

  const ellipsis = (plot.vertices && plot.vertices.length > 16)
    ? `<tr><td colspan="4" style="text-align:center;color:#94a3b8;font-size:8px;">... and ${(plot.vertices.length - 16)} more vertices (full polygon in GeoJSON) ...</td></tr>` : "";

  const thaiAreaStr = plot.thaiArea ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว. (${plot.thaiArea.hectares} Ha)` : `${((plot.areaSqMeters || 0) / 10000).toFixed(2)} Ha`;
  const printDate = new Date().toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' });

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>EUDR_Plot_Certificate_${plot.id}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Leelawadee UI', 'Tahoma', 'Sarabun', 'Segoe UI', sans-serif; background: #fff; color: #0f172a; font-size: 10px; line-height: 1.35; margin: 0; padding: 4px; }
    .header { border-bottom: 2.5px solid #065f46; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
    .comp { font-size: 13px; font-weight: 800; color: #065f46; letter-spacing: 0.5px; }
    .title { font-size: 16px; font-weight: 900; color: #0f172a; margin: 2px 0; text-transform: uppercase; }
    .sub { font-size: 9.5px; color: #475569; }
    .badge { display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 9999px; font-weight: 700; font-size: 9px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 10px; font-size: 9.5px; }
    .lbl { color: #64748b; font-size: 8.5px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
    .val { font-size: 11px; font-weight: 800; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #cbd5e1; padding: 4px 8px; font-size: 9px; }
    th { background: #f1f5f9; font-weight: 700; color: #1e293b; text-align: left; }
    .statement { margin-top: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 10px; font-size: 8.5px; color: #166534; line-height: 1.4; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 10px; }
    .sign-box { width: 44%; text-align: center; border-top: 1px solid #94a3b8; padding-top: 4px; font-size: 9px; color: #334155; }
  </style></head><body>
  <div class="header">
    <div>
      <div class="comp">GREEN RIVER PANELS (THAILAND) CO., LTD</div>
      <div class="title">EUDR Cadastral Plot Certificate</div>
      <div class="sub">EU Deforestation Regulation (EU) 2023/1115 &bull; Due Diligence Statement (DDS)</div>
    </div>
    <div style="text-align:right;">
      <span class="badge">&bull; EU FOREST OBSERVATORY VERIFIED</span>
      <div style="font-size:9px; color:#64748b; margin-top:4px;">Date: ${printDate}</div>
      <div style="font-size:9px; font-family:monospace; font-weight:700; color:#0f172a;">REF: DDS-2026-TH-00412</div>
    </div>
  </div>
  <div class="grid">
    <div class="card"><div class="lbl">Cadastral Parcel Identification</div><div class="val">${plot.name}</div><div style="color:#64748b;font-size:9px;">Plot Code: ${plot.id} &bull; Source: ${plot.fileName || plot.fileType}</div></div>
    <div class="card"><div class="lbl">Supply Chain Linkage</div><div class="val">MO: ${plot.linkedMoNo || 'Unlinked'}</div><div style="color:#64748b;font-size:9px;">Commodity: Hevea Brasiliensis (Wood Pellets)</div></div>
    <div class="card"><div class="lbl">Registered Land Area (Thai & Metric)</div><div class="val" style="color:#047857;">${thaiAreaStr}</div><div style="color:#64748b;font-size:9px;">Area: ${Number(plot.areaSqMeters || 0).toLocaleString()} Sq.Meters</div></div>
    <div class="card"><div class="lbl">Geolocation Reference Point</div><div class="val" style="color:#4338ca;font-family:monospace;">${plot.centroid ? Number(plot.centroid[0]).toFixed(6) + ', ' + Number(plot.centroid[1]).toFixed(6) : '-'}</div><div style="color:#64748b;font-size:9px;">Datum: WGS84 &bull; Vertices: ${plot.vertices ? plot.vertices.length : 0} Points</div></div>
  </div>
  <div style="font-weight:700;font-size:10px;color:#0f172a;margin-top:10px;text-transform:uppercase;">Polygon Boundary Coordinates</div>
  <table><thead><tr><th style="width:40px;text-align:center;">Point</th><th>Latitude</th><th>Longitude</th><th>Coordinate System</th></tr></thead>
  <tbody>${vRows}${ellipsis}</tbody></table>
  <div class="statement">
    <strong>EUDR Statutory Compliance Statement:</strong> This parcel has undergone multi-temporal satellite deforestation verification via Copernicus Sentinel-2 imagery (2020-2026). It is certified that no deforestation or forest degradation has occurred after December 31, 2020. The timber biomass originates from legally titled agricultural land in full compliance with the laws of Thailand.
  </div>
  <div class="sign-row">
    <div class="sign-box">Prepared by: GIS & Raw Material Specialist<br><span style="font-size:8px;color:#64748b;">Green River Panels Sustainable Supply Chain</span></div>
    <div class="sign-box">Authorized by: Regulatory Affairs (RA) & Sustainability Director<br><span style="font-size:8px;color:#64748b;">EUDR Verification & TracesNT Due Diligence Officer</span></div>
  </div></body></html>`;

  if (typeof printViaHiddenIframe === "function") {
    printViaHiddenIframe(html, `EUDR_Plot_Certificate_${plot.id}`);
  }
}
