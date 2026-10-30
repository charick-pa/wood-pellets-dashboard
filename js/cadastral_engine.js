/**
 * Cadastral Engine: KML & GeoJSON Parsing, Thai Area Formatting & Geodesic Calculation
 * Supports Google Earth KML and EUDR TracesNT GeoJSON
 * File size target: < 400 lines (Strictly verified)
 */

window.cadastralPlots = window.cadastralPlots || [];
window.activeCadastralPlotId = null;
window.cadastralMapInstance = null;
window.cadastralPolygonLayer = null;
window.cadastralCornerMarkersLayer = null;
window.showCornerPins = true;
window.currentCadastralTileType = "satellite";

const DEMO_EUDR_PLOTS = [
  {
    id: "demo_plot_hatyai_01",
    name: "แปลงสวนไม้ยางพาราหาดใหญ่ แปลงที่ 1 (Hat Yai Plot #01A)",
    fileType: "KML",
    fileName: "MO-202610-001_hatyai_plot_01.kml",
    linkedMoNo: "MO-672649852",
    uploadedAt: "2026-10-23 10:00",
    description: "สวนไม้ยางพาราแปลงหลักอายุ 22 ปี พร้อมตัดโค่น แปรรูปเป็น Wood Pellets ตามข้อกำหนด EUDR",
    attributes: {
      "Land Title No.": "NS4J-Hatyai-10425",
      "Title Deed No.": "10425 (น.ส. 4 จ.)",
      "Are chemicals (herbicides/pesticides) such as paraquat, glyphosate, and chlorpyrifos used": "N",
      "Are male and female workers treated equally": "Y",
      "Are there policies/regulations for the prevention of corruption and misconduct": "Y",
      "Are workers aged 18 employed and required to do heavy work": "N",
      "Are workers under 15 years of age employed at the site": "N",
      "Area (rai)": "37",
      "Certificate No.": "N",
      "Do the foreign workers have social security": "N",
      "Do the workers have social security": "Y"
    },
    coordinates: [[6.942, 100.362], [6.9455, 100.368], [6.943, 100.3725], [6.9385, 100.37], [6.938, 100.3635]]
  },
  {
    id: "demo_plot_hatyai_01b",
    name: "แปลงสวนไม้ยางพาราหาดใหญ่ แปลงย่อย 2 (Hat Yai Plot #01B)",
    fileType: "KML",
    fileName: "MO-202610-001_hatyai_plot_02.kml",
    linkedMoNo: "MO-672649852",
    uploadedAt: "2026-10-23 10:02",
    description: "สวนไม้ยางพาราแปลงย่อยที่ 2 เชื่อมโยงคำสั่งซื้อเดียวกัน (MO-672649852)",
    attributes: { "Land Title No.": "NS4J-Hatyai-10426", "Title Deed No.": "10426 (น.ส. 4 จ.)", "Area (rai)": "14", "Deforestation Risk": "Zero (Pre-2020 Baseline)", "Legality Ownership Verified": "Y" },
    coordinates: [[6.947, 100.374], [6.951, 100.381], [6.9485, 100.385], [6.944, 100.382], [6.9435, 100.3755]]
  },
  {
    id: "demo_plot_sadao_02",
    name: "แปลงสหกรณ์ชาวสวนยางสะเดา (Plot #02 - Sadao)",
    fileType: "GeoJSON",
    fileName: "MO-202610-002_sadao_coop.geojson",
    linkedMoNo: "MO-672649852",
    uploadedAt: "2026-10-23 10:05",
    description: "แปลงยางพาราสะเดา ได้รับการรับรอง SBP & GGL ผ่านการตรวจสอบพิกัด Geolocation",
    attributes: { "Land Title No.": "NS4J-Sadao-8891", "Title Deed No.": "8891 (น.ส. 4 จ.)", "Coop Member ID": "CP-SAD-0842", "Rubber Tree Age": "24 Years", "FSC/SBP Certified": "Y", "Area (rai)": "28" },
    coordinates: [[6.638, 100.421], [6.6435, 100.427], [6.641, 100.433], [6.635, 100.43], [6.634, 100.423]]
  },
  {
    id: "demo_plot_trang_03",
    name: "แปลงไม้ยางพาราวังวิเศษ (Plot #03 - Trang)",
    fileType: "KML",
    fileName: "MO-202610-003_wangwiset.kml",
    linkedMoNo: "MO-202610-003",
    uploadedAt: "2026-10-23 10:10",
    description: "แปลงไม้ยางพารา จ.ตรัง มีเอกสารสิทธิ์โฉนดที่ดินถูกต้อง 100% สอดคล้องตาม EU Regulation 2023/1115",
    attributes: { "Deed Title No": "NS-4J-Trang-4102", "EUDR Status": "Compliant", "Surveyor": "K. Anan S." },
    coordinates: [[7.685, 99.412], [7.691, 99.419], [7.689, 99.426], [7.682, 99.423], [7.681, 99.415]]
  }
];

function calculatePolygonAreaSqMeters(coords) {
  if (!coords || coords.length < 3) return 0;
  const radius = 6378137;
  let area = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    const p1 = coords[i], p2 = coords[(i + 1) % n];
    const lat1 = (p1[0] * Math.PI) / 180, lat2 = (p2[0] * Math.PI) / 180;
    const lng1 = (p1[1] * Math.PI) / 180, lng2 = (p2[1] * Math.PI) / 180;
    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  area = Math.abs((area * radius * radius) / 2);
  return Math.round(area * 100) / 100;
}

function formatThaiArea(sqMeters) {
  if (!sqMeters || isNaN(sqMeters) || sqMeters <= 0) {
    return { rai: 0, ngan: 0, sqWah: 0, sqMeters: 0, hectares: 0 };
  }
  const totalSqWah = sqMeters / 4;
  const rai = Math.floor(totalSqWah / 400);
  const rem1 = totalSqWah % 400;
  const ngan = Math.floor(rem1 / 100);
  const sqWah = Math.round((rem1 % 100) * 10) / 10;
  const hectares = Math.round((sqMeters / 10000) * 100) / 100;
  return { rai, ngan, sqWah, sqMeters: sqMeters.toLocaleString("en-US", { maximumFractionDigits: 1 }), hectares: hectares.toFixed(2) };
}

function calculateCentroid(coords) {
  if (!coords || coords.length === 0) return [7.0, 100.47];
  let latSum = 0, lngSum = 0;
  coords.forEach(pt => { latSum += pt[0]; lngSum += pt[1]; });
  return [latSum / coords.length, lngSum / coords.length];
}

function extractVertices(coords) {
  if (!coords) return [];
  return coords.map((p, idx) => ({ no: idx + 1, lat: p[0], lng: p[1] }));
}

function createPlotObject(id, name, fileType, fileName, desc, coords, moNo, uploadedAt, attributes) {
  const sqMeters = calculatePolygonAreaSqMeters(coords);
  return {
    id, name, fileType,
    fileName: fileName || `imported.${fileType.toLowerCase()}`,
    linkedMoNo: moNo || null,
    uploadedAt: uploadedAt || new Date().toLocaleString("th-TH"),
    description: desc || "พิกัดแปลงนำเข้าตามมาตรฐาน EUDR",
    coordinates: coords,
    centroid: calculateCentroid(coords),
    areaSqMeters: sqMeters,
    thaiArea: formatThaiArea(sqMeters),
    vertices: extractVertices(coords),
    attributes: (typeof attributes === "object" && attributes !== null) ? attributes : {}
  };
}

function ensureCadastralPlotsInitialized() {
  if (!window.cadastralPlots || window.cadastralPlots.length === 0) {
    const saved = typeof loadCadastralPlotsFromStorage === "function" ? loadCadastralPlotsFromStorage() : null;
    if (saved && saved.length > 0) {
      window.cadastralPlots = saved;
    } else {
      window.cadastralPlots = DEMO_EUDR_PLOTS.map(r =>
        createPlotObject(r.id, r.name, r.fileType, r.fileName, r.description, r.coordinates, r.linkedMoNo, r.uploadedAt, r.attributes)
      );
      if (typeof saveCadastralPlotsToStorage === "function") saveCadastralPlotsToStorage();
    }
  }
  if (!window.activeCadastralPlotId && window.cadastralPlots.length > 0) {
    window.activeCadastralPlotId = window.cadastralPlots[0].id;
  }
}

// สกัด ExtendedData / SchemaData / HTML Table จาก Placemark ใน KML
function extractKmlAttributes(blockXml) {
  const attrs = {};
  if (!blockXml) return attrs;
  let m;
  const dRegex = /<Data\s+name=["'](.*?)["']>[\s\S]*?<value>([\s\S]*?)<\/value>[\s\S]*?<\/Data>/gi;
  while ((m = dRegex.exec(blockXml)) !== null) {
    const k = m[1].trim(), v = m[2].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim();
    if (k) attrs[k] = v;
  }
  const sRegex = /<SimpleData\s+name=["'](.*?)["']>([\s\S]*?)<\/SimpleData>/gi;
  while ((m = sRegex.exec(blockXml)) !== null) {
    const k = m[1].trim(), v = m[2].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim();
    if (k && !attrs[k]) attrs[k] = v;
  }
  if (!Object.keys(attrs).length) {
    const rRegex = /<tr[^>]*>[\s\S]*?<td[^>]*>(.*?)<\/td>[\s\S]*?<td[^>]*>(.*?)<\/td>[\s\S]*?<\/tr>/gi;
    while ((m = rRegex.exec(blockXml)) !== null) {
      const k = m[1].replace(/<[^>]+>/g, "").trim(), v = m[2].replace(/<[^>]+>/g, "").trim();
      if (k && v && !/^(attribute|name|fid)$/i.test(k)) attrs[k] = v;
    }
  }
  return attrs;
}

function parseKmlFileText(kmlString, fileName) {
  if (!kmlString) return [];
  kmlString = kmlString.replace(/^\uFEFF/, "").trim();
  const newPlots = [];

  try {
    let blocks = kmlString.match(/<Placemark[\s\S]*?<\/Placemark>/gi);
    if (!blocks || blocks.length === 0) blocks = [kmlString];

    blocks.forEach((block, idx) => {
      const nameMatch = block.match(/<name>([\s\S]*?)<\/name>/i);
      const descMatch = block.match(/<description>([\s\S]*?)<\/description>/i);
      const coordsMatch = block.match(/<coordinates>([\s\S]*?)<\/coordinates>/i);
      if (!coordsMatch) return;

      const name = nameMatch ? nameMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim() : `${fileName ? fileName.replace(/\.[^/.]+$/, "") : "แปลง KML"} #${idx + 1}`;
      const desc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim() : "นำเข้าจาก Google Earth KML";
      const rawCoords = coordsMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim().replace(/\s*,\s*/g, ",");
      const tokens = rawCoords.split(/\s+/);
      const polygonCoords = [];

      tokens.forEach(tok => {
        if (!tok) return;
        const parts = tok.split(",");
        if (parts.length >= 2) {
          const lng = parseFloat(parts[0]), lat = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lng)) polygonCoords.push([lat, lng]);
        }
      });

      if (polygonCoords.length >= 3) {
        if (polygonCoords[0][0] === polygonCoords[polygonCoords.length - 1][0] && polygonCoords[0][1] === polygonCoords[polygonCoords.length - 1][1]) {
          polygonCoords.pop();
        }
        if (polygonCoords.length >= 3) {
          const attrs = extractKmlAttributes(block);
          newPlots.push(createPlotObject("kml_" + Date.now() + "_" + idx, name, "KML", fileName, desc, polygonCoords, null, null, attrs));
        }
      }
    });

    // Fallback: DOMParser
    if (newPlots.length === 0) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(kmlString, "text/xml");
      const pms = xmlDoc.querySelectorAll("Placemark");
      (pms.length ? pms : [xmlDoc]).forEach((pm, idx) => {
        const cEl = pm.querySelector ? pm.querySelector("coordinates") : xmlDoc.querySelector("coordinates");
        if (!cEl) return;
        const nEl = pm.querySelector ? pm.querySelector("name") : null;
        const dEl = pm.querySelector ? pm.querySelector("description") : null;
        const name = nEl ? nEl.textContent.trim() : `${fileName ? fileName.replace(/\.[^/.]+$/, "") : "แปลง KML"} #${idx + 1}`;
        const desc = dEl ? dEl.textContent.trim() : "นำเข้าจาก Google Earth";
        const attrs = extractKmlAttributes(pm.innerHTML || pm.textContent || "");
        const rawCoords = cEl.textContent.trim().replace(/\s*,\s*/g, ",");
        const tokens = rawCoords.split(/\s+/);
        const polygonCoords = [];
        tokens.forEach(tok => {
          const parts = tok.split(",");
          if (parts.length >= 2) {
            const lng = parseFloat(parts[0]), lat = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) polygonCoords.push([lat, lng]);
          }
        });
        if (polygonCoords.length >= 3) {
          if (polygonCoords[0][0] === polygonCoords[polygonCoords.length - 1][0] && polygonCoords[0][1] === polygonCoords[polygonCoords.length - 1][1]) polygonCoords.pop();
          if (polygonCoords.length >= 3) {
            newPlots.push(createPlotObject("kml_dom_" + Date.now() + "_" + idx, name, "KML", fileName, desc, polygonCoords, null, null, attrs));
          }
        }
      });
    }

    return newPlots;
  } catch (err) {
    console.error("[KML Parser Error]", err);
    showSwalError("KML Parsing Error", "An error occurred while reading the KML file: " + err.message);
    return [];
  }
}

function parseGeoJsonFileText(geoJsonString, fileName) {
  if (!geoJsonString) return [];
  geoJsonString = geoJsonString.replace(/^\uFEFF/, "").trim();

  try {
    const geoData = JSON.parse(geoJsonString);
    const newPlots = [];
    let features = [];
    if (geoData.type === "FeatureCollection" && Array.isArray(geoData.features)) features = geoData.features;
    else if (geoData.type === "Feature") features = [geoData];
    else if (geoData.coordinates) features = [{ type: "Feature", geometry: geoData, properties: {} }];
    else if (Array.isArray(geoData)) features = geoData;

    features.forEach((feat, idx) => {
      const geom = feat.geometry || feat;
      if (!geom) return;
      const props = feat.properties || {};
      const cleanProps = {};
      Object.keys(props).forEach(k => {
        const cleanK = k.replace(/[\r\n\t]/g, "").trim();
        let val = props[k];
        if (typeof val === "string") val = val.replace(/[\r\n\t]/g, "").trim().replace(/^NULL/i, "").trim();
        if (cleanK && val !== null && val !== undefined) cleanProps[cleanK] = val;
      });
      const farmerName = cleanProps["Farmer Name"] || cleanProps["Farmer"] || "";
      const placeCode = cleanProps["Production Place"] || cleanProps["Plot Code"] || "";
      const titleNo = cleanProps["Land Title No."] || cleanProps["Title No"] || "";
      const areaRai = cleanProps["Area (rai)"] || "";
      let autoName = props.name || props.plot_name || props.Plot_ID || props.Name || props.title;
      if (!autoName && (farmerName || placeCode)) {
        autoName = `${placeCode ? `[${placeCode}] ` : ""}${farmerName}${titleNo ? ` (โฉนด ${titleNo})` : ""}${areaRai ? ` - ${areaRai} ไร่` : ""}`;
      }
      const name = autoName || `${fileName ? fileName.replace(/\.[^/.]+$/, "") : "GeoJSON แปลงที่"} #${idx + 1}`;
      const desc = props.description || props.desc || props.remark || "นำเข้าตามมาตรฐาน EUDR GeoJSON";
      const autoMo = cleanProps["Production Order (MO)"] || cleanProps["MO No"] || cleanProps["MO"] || null;

      let polygonRings = [];
      if (geom.type === "Polygon") polygonRings = geom.coordinates;
      else if (geom.type === "MultiPolygon" && geom.coordinates && geom.coordinates.length > 0) polygonRings = geom.coordinates[0];
      else if (geom.type === "LineString") polygonRings = [geom.coordinates];

      if (polygonRings && polygonRings.length > 0) {
        const outerRing = polygonRings[0];
        const polygonCoords = [];
        outerRing.forEach(pt => {
          if (!Array.isArray(pt) || pt.length < 2) return;
          const lng = parseFloat(pt[0]), lat = parseFloat(pt[1]);
          if (!isNaN(lat) && !isNaN(lng)) polygonCoords.push([lat, lng]);
        });

        if (polygonCoords.length >= 3) {
          if (polygonCoords[0][0] === polygonCoords[polygonCoords.length - 1][0] && polygonCoords[0][1] === polygonCoords[polygonCoords.length - 1][1]) polygonCoords.pop();
          if (polygonCoords.length >= 3) {
            newPlots.push(createPlotObject("geojson_" + Date.now() + "_" + idx, name, "GeoJSON", fileName, desc, polygonCoords, autoMo, null, cleanProps));
          }
        }
      }
    });

    return newPlots;
  } catch (err) {
    console.error("[GeoJSON Parser Error]", err);
    showSwalError("GeoJSON Parsing Error", "An error occurred while reading the GeoJSON file: " + err.message);
    return [];
  }
}

function deleteActiveCadastralPlot() {
  const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
  const plots = window.cadastralPlots || [];
  if (!plots.length) {
    if (typeof showSwalWarning === "function") showSwalWarning(isTh ? "ไม่พบแปลงที่ดิน" : "No Plot Selected", isTh ? "ยังไม่มีข้อมูลแปลงที่ดินในระบบ" : "No parcel data available.");
    return;
  }
  const activePlot = plots.find((p) => p.id === window.activeCadastralPlotId) || plots[0];
  if (!activePlot) return;

  Swal.fire({
    title: isTh ? "ยืนยันการลบแปลงที่ดิน?" : "Delete Cadastral Parcel?",
    html: isTh ? `คุณต้องการลบแปลง <strong>"${activePlot.name}"</strong> ใช่หรือไม่?<br><span class="text-xs text-rose-600 mt-1 block">ข้อมูลพิกัดและเนื้อที่จะถูกนำออกจากระบบถาวร</span>`
               : `Are you sure you want to delete <strong>"${activePlot.name}"</strong>?<br><span class="text-xs text-rose-600 mt-1 block">Boundary coordinates and area will be permanently deleted.</span>`,
    icon: "warning", showCancelButton: true, confirmButtonColor: "#e11d48", cancelButtonColor: "#64748b",
    confirmButtonText: isTh ? '<i class="fa-solid fa-trash-can mr-1"></i> ใช่, ลบแปลงนี้' : '<i class="fa-solid fa-trash-can mr-1"></i> Yes, Delete Parcel',
    cancelButtonText: isTh ? "ยกเลิก" : "Cancel"
  }).then((res) => {
    if (res.isConfirmed) {
      window.cadastralPlots = window.cadastralPlots.filter((p) => p.id !== activePlot.id);
      if (typeof saveCadastralPlotsToStorage === "function") saveCadastralPlotsToStorage();
      const rem = window.cadastralPlots || [];
      window.activeCadastralPlotId = rem.length ? rem[0].id : null;
      if (!$("#cadastralViewContainer").length && $("#cadastralView").length) $("#cadastralView").html('<div id="cadastralViewContainer"></div>');
      if (typeof renderCadastralView === "function") renderCadastralView();
      if (typeof showSwalSuccess === "function") showSwalSuccess(isTh ? "ลบแปลงสำเร็จ" : "Plot Deleted", isTh ? `ลบแปลง "${activePlot.name}" ออกเรียบร้อย` : `Parcel "${activePlot.name}" removed.`);
    }
  });
}
