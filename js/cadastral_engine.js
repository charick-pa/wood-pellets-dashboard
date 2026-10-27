/**
 * Cadastral Engine: KML & GeoJSON Parsing, Thai Area Formatting & Geodesic Calculation
 * Supports Google Earth KML and EUDR TracesNT GeoJSON
 * File size target: < 400 lines (Strictly verified)
 */

// Global State สำหรับโมดูล Cadastral
window.cadastralPlots = window.cadastralPlots || [];
window.activeCadastralPlotId = null;
window.cadastralMapInstance = null;
window.cadastralPolygonLayer = null;
window.cadastralCornerMarkersLayer = null;
window.showCornerPins = true;
window.currentCadastralTileType = "satellite";

// แปลงสาธิตไม้ยางพาราในภาคใต้ 4 แปลงเริ่มต้น (Preloaded Demo EUDR Plots — รองรับ 1 MO หลายแปลง)
const DEMO_EUDR_PLOTS = [
  {
    id: "demo_plot_hatyai_01",
    name: "แปลงสวนไม้ยางพาราหาดใหญ่ แปลงที่ 1 (Hat Yai Plot #01A)",
    fileType: "KML",
    fileName: "MO-202610-001_hatyai_plot_01.kml",
    linkedMoNo: "MO-672649852",
    uploadedAt: "2026-10-23 10:00",
    description: "สวนไม้ยางพาราแปลงหลักอายุ 22 ปี พร้อมตัดโค่น แปรรูปเป็น Wood Pellets ตามข้อกำหนด EUDR",
    coordinates: [
      [6.942000, 100.362000], [6.945500, 100.368000], [6.943000, 100.372500], [6.938500, 100.370000], [6.938000, 100.363500]
    ]
  },
  {
    id: "demo_plot_hatyai_01b",
    name: "แปลงสวนไม้ยางพาราหาดใหญ่ แปลงย่อย 2 (Hat Yai Plot #01B)",
    fileType: "KML",
    fileName: "MO-202610-001_hatyai_plot_02.kml",
    linkedMoNo: "MO-672649852",
    uploadedAt: "2026-10-23 10:02",
    description: "สวนไม้ยางพาราแปลงย่อยที่ 2 เชื่อมโยงคำสั่งซื้อเดียวกัน (MO-672649852)",
    coordinates: [
      [6.947000, 100.374000], [6.951000, 100.381000], [6.948500, 100.385000], [6.944000, 100.382000], [6.943500, 100.375500]
    ]
  },
  {
    id: "demo_plot_sadao_02",
    name: "แปลงสหกรณ์ชาวสวนยางสะเดา (Plot #02 - Sadao)",
    fileType: "GeoJSON",
    fileName: "MO-202610-002_sadao_coop.geojson",
    linkedMoNo: "MO-672649852",
    uploadedAt: "2026-10-23 10:05",
    description: "แปลงยางพาราสะเดา ได้รับการรับรอง SBP & GGL ผ่านการตรวจสอบพิกัด Geolocation",
    coordinates: [
      [6.638000, 100.421000], [6.643500, 100.427000], [6.641000, 100.433000], [6.635000, 100.430000], [6.634000, 100.423000]
    ]
  },
  {
    id: "demo_plot_trang_03",
    name: "แปลงไม้ยางพาราวังวิเศษ (Plot #03 - Trang)",
    fileType: "KML",
    fileName: "MO-202610-003_wangwiset.kml",
    linkedMoNo: "MO-202610-003",
    uploadedAt: "2026-10-23 10:10",
    description: "แปลงไม้ยางพารา จ.ตรัง มีเอกสารสิทธิ์โฉนดที่ดินถูกต้อง 100% สอดคล้องตาม EU Regulation 2023/1115",
    coordinates: [
      [7.685000, 99.412000], [7.691000, 99.419000], [7.689000, 99.426000], [7.682000, 99.423000], [7.681000, 99.415000]
    ]
  }
];

// ฟังก์ชันคำนวณพื้นที่รูปหลายเหลี่ยมบนพื้นผิวโลก (Geodesic Spherical Polygon Area in Sq. Meters)
function calculatePolygonAreaSqMeters(coords) {
  if (!coords || coords.length < 3) return 0;
  const radius = 6378137; // รัศมีทรงกลมโลกเฉลี่ย (WGS84)
  let area = 0;
  const n = coords.length;

  for (let i = 0; i < n; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % n];
    const radLat1 = (p1[0] * Math.PI) / 180;
    const radLat2 = (p2[0] * Math.PI) / 180;
    const radLngDiff = ((p2[1] - p1[1]) * Math.PI) / 180;
    area += radLngDiff * (2 + Math.sin(radLat1) + Math.sin(radLat2));
  }
  area = Math.abs((area * radius * radius) / 2);
  return Math.round(area * 100) / 100;
}

// แปลงหน่วยพื้นที่เป็น ไร่-งาน-ตารางวา (Thai Land Area Units)
function formatThaiArea(sqMeters) {
  if (!sqMeters || isNaN(sqMeters) || sqMeters < 0) {
    return { rai: 0, ngan: 0, sqWah: 0, hectares: "0.00", sqMeters: "0" };
  }
  const SQ_METER_PER_RAI = 1600;
  const SQ_METER_PER_NGAN = 400;
  const SQ_METER_PER_WAH = 4;

  const rai = Math.floor(sqMeters / SQ_METER_PER_RAI);
  const rem1 = sqMeters % SQ_METER_PER_RAI;
  const ngan = Math.floor(rem1 / SQ_METER_PER_NGAN);
  const rem2 = rem1 % SQ_METER_PER_NGAN;
  const sqWah = Math.round(rem2 / SQ_METER_PER_WAH);
  const hectares = (sqMeters / 10000).toFixed(2);

  return {
    rai,
    ngan,
    sqWah,
    hectares,
    sqMeters: Math.round(sqMeters).toLocaleString()
  };
}

// ฟังก์ชันคำนวณจุดกึ่งกลางแปลง (Centroid Lat/Lng)
function calculateCentroid(coords) {
  if (!coords || coords.length === 0) return [7.0089, 100.4767];
  let latSum = 0;
  let lngSum = 0;
  coords.forEach(p => {
    latSum += p[0];
    lngSum += p[1];
  });
  return [latSum / coords.length, lngSum / coords.length];
}

// ฟังก์ชันสกัดจุดยอดมุมแปลง (Vertex Coordinates Table Data)
function extractVertices(coords) {
  if (!coords) return [];
  return coords.map((p, idx) => ({ no: idx + 1, lat: p[0], lng: p[1] }));
}

// Helper สร้างโครงสร้าง Object ของแปลงมาตรฐาน
function createPlotObject(id, name, fileType, fileName, desc, coords, moNo, uploadedAt) {
  const sqMeters = calculatePolygonAreaSqMeters(coords);
  return {
    id: id,
    name: name,
    fileType: fileType,
    fileName: fileName || `imported.${fileType.toLowerCase()}`,
    linkedMoNo: moNo || null,
    uploadedAt: uploadedAt || new Date().toLocaleString("th-TH"),
    description: desc || "พิกัดแปลงนำเข้าตามมาตรฐาน EUDR",
    coordinates: coords,
    centroid: calculateCentroid(coords),
    areaSqMeters: sqMeters,
    thaiArea: formatThaiArea(sqMeters),
    vertices: extractVertices(coords)
  };
}

// กำหนดแปลงเริ่มต้นหากยังไม่มีในระบบ (โหลดจาก LocalStorage ก่อนเป็นอันดับแรก)
function ensureCadastralPlotsInitialized() {
  if (!window.cadastralPlots || window.cadastralPlots.length === 0) {
    const saved = typeof loadCadastralPlotsFromStorage === "function" ? loadCadastralPlotsFromStorage() : null;
    if (saved && saved.length > 0) {
      window.cadastralPlots = saved;
    } else {
      window.cadastralPlots = DEMO_EUDR_PLOTS.map(raw =>
        createPlotObject(raw.id, raw.name, raw.fileType, raw.fileName, raw.description, raw.coordinates, raw.linkedMoNo, raw.uploadedAt)
      );
      if (typeof saveCadastralPlotsToStorage === "function") saveCadastralPlotsToStorage();
    }
  }
  if (!window.activeCadastralPlotId && window.cadastralPlots.length > 0) {
    window.activeCadastralPlotId = window.cadastralPlots[0].id;
  }
}

// แปลงไฟล์ KML (XML String) เป็นรายการแปลงรูปหลายเหลี่ยม
function parseKmlFileText(kmlString, fileName) {
  if (!kmlString) return [];
  kmlString = kmlString.replace(/^\uFEFF/, "").trim();
  const newPlots = [];

  try {
    let blocks = kmlString.match(/<Placemark[\s\S]*?<\/Placemark>/gi);
    if (!blocks || blocks.length === 0) {
      blocks = [kmlString];
    }

    blocks.forEach((block, idx) => {
      const nameMatch = block.match(/<name>([\s\S]*?)<\/name>/i);
      const descMatch = block.match(/<description>([\s\S]*?)<\/description>/i);
      const coordsMatch = block.match(/<coordinates>([\s\S]*?)<\/coordinates>/i);

      if (!coordsMatch) return;

      const name = nameMatch ? nameMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim() : `${fileName ? fileName.replace(/\.[^/.]+$/, "") : "แปลง KML"} #${idx + 1}`;
      const desc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim() : "นำเข้าจาก Google Earth KML";
      const rawCoords = coordsMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim();
      const cleanedCoords = rawCoords.replace(/\s*,\s*/g, ",");
      const tokens = cleanedCoords.split(/\s+/);
      const polygonCoords = [];

      tokens.forEach(tok => {
        if (!tok) return;
        const parts = tok.split(",");
        if (parts.length >= 2) {
          const lng = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lng)) polygonCoords.push([lat, lng]);
        }
      });

      if (polygonCoords.length >= 3) {
        if (polygonCoords[0][0] === polygonCoords[polygonCoords.length - 1][0] && polygonCoords[0][1] === polygonCoords[polygonCoords.length - 1][1]) {
          polygonCoords.pop();
        }
        if (polygonCoords.length >= 3) {
          newPlots.push(createPlotObject("kml_" + Date.now() + "_" + idx, name, "KML", fileName, desc, polygonCoords));
        }
      }
    });

    // Fallback: DOMParser
    if (newPlots.length === 0) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(kmlString, "text/xml");
      const coordEls = xmlDoc.querySelectorAll("coordinates");

      coordEls.forEach((el, idx) => {
        const rawCoords = el.textContent.trim();
        const cleanedCoords = rawCoords.replace(/\s*,\s*/g, ",");
        const tokens = cleanedCoords.split(/\s+/);
        const polygonCoords = [];

        tokens.forEach(tok => {
          const parts = tok.split(",");
          if (parts.length >= 2) {
            const lng = parseFloat(parts[0]);
            const lat = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) polygonCoords.push([lat, lng]);
          }
        });

        if (polygonCoords.length >= 3) {
          if (polygonCoords[0][0] === polygonCoords[polygonCoords.length - 1][0] && polygonCoords[0][1] === polygonCoords[polygonCoords.length - 1][1]) {
            polygonCoords.pop();
          }
          if (polygonCoords.length >= 3) {
            newPlots.push(createPlotObject("kml_dom_" + Date.now() + "_" + idx, `${fileName ? fileName.replace(/\.[^/.]+$/, "") : "แปลง KML"} #${idx + 1}`, "KML", fileName, "นำเข้าจาก Google Earth", polygonCoords));
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

// แปลงไฟล์ GeoJSON เป็นรายการแปลงรูปหลายเหลี่ยม
function parseGeoJsonFileText(geoJsonString, fileName) {
  if (!geoJsonString) return [];
  geoJsonString = geoJsonString.replace(/^\uFEFF/, "").trim();

  try {
    const geoData = JSON.parse(geoJsonString);
    const newPlots = [];

    let features = [];
    if (geoData.type === "FeatureCollection" && Array.isArray(geoData.features)) {
      features = geoData.features;
    } else if (geoData.type === "Feature") {
      features = [geoData];
    } else if (geoData.coordinates) {
      features = [{ type: "Feature", geometry: geoData, properties: {} }];
    } else if (Array.isArray(geoData)) {
      features = geoData;
    }

    features.forEach((feat, idx) => {
      const geom = feat.geometry || feat;
      if (!geom) return;

      const props = feat.properties || {};
      const name = props.name || props.plot_name || props.Plot_ID || props.Name || props.title || `${fileName ? fileName.replace(/\.[^/.]+$/, "") : "GeoJSON แปลงที่"} #${idx + 1}`;
      const desc = props.description || props.desc || props.remark || "นำเข้าตามมาตรฐาน EUDR GeoJSON";

      let polygonRings = [];
      if (geom.type === "Polygon") {
        polygonRings = geom.coordinates;
      } else if (geom.type === "MultiPolygon" && geom.coordinates && geom.coordinates.length > 0) {
        polygonRings = geom.coordinates[0];
      } else if (geom.type === "LineString") {
        polygonRings = [geom.coordinates];
      }

      if (polygonRings && polygonRings.length > 0) {
        const outerRing = polygonRings[0];
        const polygonCoords = [];

        outerRing.forEach(pt => {
          if (!Array.isArray(pt) || pt.length < 2) return;
          const lng = parseFloat(pt[0]);
          const lat = parseFloat(pt[1]);
          if (!isNaN(lat) && !isNaN(lng)) polygonCoords.push([lat, lng]);
        });

        if (polygonCoords.length >= 3) {
          if (polygonCoords[0][0] === polygonCoords[polygonCoords.length - 1][0] && polygonCoords[0][1] === polygonCoords[polygonCoords.length - 1][1]) {
            polygonCoords.pop();
          }
          if (polygonCoords.length >= 3) {
            newPlots.push(createPlotObject("geojson_" + Date.now() + "_" + idx, name, "GeoJSON", fileName, desc, polygonCoords));
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


// ลบแปลงที่ดินที่กำลังเลือกอยู่ พร้อมกล่องยืนยัน SweetAlert2
function deleteActiveCadastralPlot() {
  const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
  const plots = window.cadastralPlots || [];
  if (!plots.length) {
    if (typeof showSwalWarning === "function") {
      showSwalWarning(isTh ? "ไม่พบแปลงที่ดิน" : "No Plot Selected", isTh ? "ยังไม่มีข้อมูลแปลงที่ดินในระบบ" : "No parcel data available.");
    }
    return;
  }

  const activePlot = plots.find((p) => p.id === window.activeCadastralPlotId) || plots[0];
  if (!activePlot) return;

  Swal.fire({
    title: isTh ? "ยืนยันการลบแปลงที่ดิน?" : "Delete Cadastral Parcel?",
    html: isTh 
      ? `คุณต้องการลบแปลง <strong>"${activePlot.name}"</strong> ใช่หรือไม่?<br><span class="text-xs text-rose-600 mt-1 block">ข้อมูลพิกัดและเนื้อที่จะถูกนำออกจากระบบถาวร</span>`
      : `Are you sure you want to delete <strong>"${activePlot.name}"</strong>?<br><span class="text-xs text-rose-600 mt-1 block">Boundary coordinates and area will be permanently deleted.</span>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48",
    cancelButtonColor: "#64748b",
    confirmButtonText: isTh ? '<i class="fa-solid fa-trash-can mr-1"></i> ใช่, ลบแปลงนี้' : '<i class="fa-solid fa-trash-can mr-1"></i> Yes, Delete Parcel',
    cancelButtonText: isTh ? "ยกเลิก" : "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      window.cadastralPlots = window.cadastralPlots.filter((p) => p.id !== activePlot.id);
      if (typeof saveCadastralPlotsToStorage === "function") saveCadastralPlotsToStorage();

      const remainingPlots = window.cadastralPlots || [];
      const nextPlot = remainingPlots[0] || null;
      window.activeCadastralPlotId = nextPlot ? nextPlot.id : null;

      if (!$("#cadastralViewContainer").length && $("#cadastralView").length) {
        $("#cadastralView").html('<div id="cadastralViewContainer"></div>');
      }
      if (typeof renderCadastralView === "function") {
        renderCadastralView();
      }

      if (typeof showSwalSuccess === "function") {
        showSwalSuccess(
          isTh ? "ลบแปลงสำเร็จ" : "Plot Deleted",
          isTh ? `ลบแปลง "${activePlot.name}" ออกจากระบบเรียบร้อยแล้ว` : `Parcel "${activePlot.name}" has been removed.`
        );
      }
    }
  });
}
