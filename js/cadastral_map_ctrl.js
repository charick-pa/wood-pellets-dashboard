/**
 * Cadastral Map Controller: Leaflet Map Management, Tile Switching, Polygon Drawing & Fullscreen
 * File size target: < 400 lines (Strictly verified)
 */

let isCadastralFullscreen = false;

// เรนเดอร์หน้าจอ Cadastral Boundary View
function renderCadastralView() {
  ensureCadastralPlotsInitialized();

  if (window.Components && typeof window.Components.renderCadastralView === "function") {
    if (!$("#cadastralViewContainer").length && $("#cadastralView").length) {
      $("#cadastralView").html('<div id="cadastralViewContainer"></div>');
    }
    $("#cadastralViewContainer").html(
      window.Components.renderCadastralView(window.cadastralPlots, window.activeCadastralPlotId)
    );

    setTimeout(() => {
      initCadastralMap();
    }, 120);

    if (typeof setupCadastralDragAndDrop === "function") {
      setupCadastralDragAndDrop();
    }
  }
}

// สร้างแผนที่ Leaflet ในหน้า Cadastral View
function initCadastralMap() {
  const mapElement = document.getElementById("cadastralLeafletMap");
  if (!mapElement) return;

  if (window.cadastralMapInstance) {
    window.cadastralMapInstance.remove();
    window.cadastralMapInstance = null;
  }

  window.cadastralMapInstance = L.map("cadastralLeafletMap", {
    center: [7.0089, 100.4767],
    zoom: 14,
    minZoom: 6,
    maxZoom: 19,
    zoomControl: true
  });

  setCadastralTileLayer(window.currentCadastralTileType || "satellite");

  if (window.activeCadastralPlotId) {
    drawCadastralPlot(window.activeCadastralPlotId);
  }

  // รีเฟรช Viewport สำหรับ Full Width 100%
  setTimeout(() => {
    if (window.cadastralMapInstance) {
      window.cadastralMapInstance.invalidateSize();
      fitCadastralBounds();
    }
  }, 180);
}

// สลับเลเยอร์แผนที่ในหน้า Cadastral (Satellite vs Street)
function setCadastralTileLayer(type) {
  window.currentCadastralTileType = type;
  if (!window.cadastralMapInstance) return;

  if (window.cadastralBaseTileLayer) {
    window.cadastralMapInstance.removeLayer(window.cadastralBaseTileLayer);
  }

  if (type === "satellite") {
    window.cadastralBaseTileLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS",
        maxZoom: 19
      }
    );
    $("#btnCadastralSatellite").addClass("bg-emerald-600 text-white font-bold").removeClass("bg-slate-100 text-slate-600");
    $("#btnCadastralStreet").removeClass("bg-emerald-600 text-white font-bold").addClass("bg-slate-100 text-slate-600");
  } else {
    window.cadastralBaseTileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    });
    $("#btnCadastralStreet").addClass("bg-emerald-600 text-white font-bold").removeClass("bg-slate-100 text-slate-600");
    $("#btnCadastralSatellite").removeClass("bg-emerald-600 text-white font-bold").addClass("bg-slate-100 text-slate-600");
  }

  window.cadastralBaseTileLayer.addTo(window.cadastralMapInstance);
}

// วาดเส้นขอบแปลงจริง (Polygon) และหมุดมุมแปลง
function drawCadastralPlot(plotId) {
  if (!window.cadastralMapInstance) return;

  const plot = (window.cadastralPlots || []).find(p => p.id === plotId);
  if (!plot || !plot.coordinates || plot.coordinates.length < 3) return;

  window.activeCadastralPlotId = plotId;
  updateSiblingPlotPillHighlight(plotId);

  if (window.cadastralPolygonLayer) {
    window.cadastralMapInstance.removeLayer(window.cadastralPolygonLayer);
    window.cadastralPolygonLayer = null;
  }
  if (window.cadastralCornerMarkersLayer) {
    window.cadastralMapInstance.removeLayer(window.cadastralCornerMarkersLayer);
    window.cadastralCornerMarkersLayer = null;
  }

  // วาด Polygon
  window.cadastralPolygonLayer = L.polygon(plot.coordinates, {
    color: "#10b981",
    weight: 3.5,
    opacity: 0.95,
    fillColor: "#34d399",
    fillOpacity: 0.25
  }).addTo(window.cadastralMapInstance);

  window.cadastralPolygonLayer.bindPopup(`
    <div class="text-xs p-1 font-sans">
      <div class="font-bold text-slate-900 border-b pb-1 mb-1.5 flex items-center">
        <i class="fa-solid fa-draw-polygon text-emerald-600 mr-1.5"></i> ${plot.name}
      </div>
      <p class="text-slate-600 mb-1"><strong>เนื้อที่:</strong> ${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว.</p>
      <p class="text-slate-500 text-[11px]">(${plot.thaiArea.sqMeters} ตร.ม. / ${plot.thaiArea.hectares} Ha)</p>
      <div class="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">EUDR Geolocation Traceability Passed</div>
      ${plot.attributes && Object.keys(plot.attributes).length > 0 ? `<div class="mt-1 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded flex items-center justify-between"><span><i class="fa-solid fa-clipboard-question mr-1"></i>ExtendedData:</span><strong>${Object.keys(plot.attributes).length} Attributes</strong></div>` : ''}
    </div>
  `);

  // ปักหมุดมุมแปลง
  if (window.showCornerPins) {
    window.cadastralCornerMarkersLayer = L.layerGroup();
    plot.vertices.forEach(v => {
      const pinIcon = L.divIcon({
        className: "corner-vertex-pin",
        html: `
          <div class="flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div class="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg border-2 border-white">
              ${v.no}
            </div>
          </div>
        `,
        iconSize: [20, 20]
      });

      const marker = L.marker([v.lat, v.lng], { icon: pinIcon });
      marker.bindTooltip(`หมุดที่ #${v.no}<br>Lat: ${v.lat.toFixed(6)}<br>Lng: ${v.lng.toFixed(6)}`, {
        direction: "top",
        offset: [0, -10]
      });
      window.cadastralCornerMarkersLayer.addLayer(marker);
    });
    window.cadastralCornerMarkersLayer.addTo(window.cadastralMapInstance);
  }

  fitCadastralBounds();
}

function fitCadastralBounds() {
  if (window.cadastralMapInstance && window.cadastralPolygonLayer) {
    window.cadastralMapInstance.fitBounds(window.cadastralPolygonLayer.getBounds(), {
      padding: [45, 45],
      maxZoom: 17,
      animate: true
    });
  }
}

// วาดทุกแปลงที่ผูกกับคำสั่งซื้อ MO เดียวกันขึ้นบนแผนที่พร้อมกัน (1 MO : Many Plots)
function drawAllPlotsForMo(moNo) {
  if (!window.cadastralMapInstance) return;
  const plots = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(moNo) : [];
  if (!plots || plots.length === 0) {
    showSwalWarning("No Linked Plots", `No cadastral plots are currently linked to Manufacturing Order ${moNo}.`);
    return;
  }

  if (window.cadastralPolygonLayer) {
    window.cadastralMapInstance.removeLayer(window.cadastralPolygonLayer);
    window.cadastralPolygonLayer = null;
  }
  if (window.cadastralCornerMarkersLayer) {
    window.cadastralMapInstance.removeLayer(window.cadastralCornerMarkersLayer);
    window.cadastralCornerMarkersLayer = null;
  }

  const colors = ["#10b981", "#6366f1", "#f59e0b", "#06b6d4", "#ec4899", "#8b5cf6"];
  const group = L.featureGroup();
  window.cadastralMoPolygons = {};

  plots.forEach((p, idx) => {
    const col = colors[idx % colors.length];
    const poly = L.polygon(p.coordinates, {
      color: col,
      weight: 3.5,
      opacity: 0.95,
      fillColor: col,
      fillOpacity: 0.25
    });

    poly._origColor = col;
    window.cadastralMoPolygons = window.cadastralMoPolygons || {};
    window.cadastralMoPolygons[p.id] = poly;
    poly.on("click", () => { selectCadastralPlot(p.id); });

    poly.bindPopup(`
      <div class="text-xs p-1 font-sans">
        <div class="font-bold text-slate-900 border-b pb-1 mb-1.5 flex items-center">
          <i class="fa-solid fa-draw-polygon mr-1.5" style="color:${col};"></i> ${p.name}
        </div>
        <p class="text-slate-600 mb-1"><strong>คำสั่งซื้อ:</strong> <span class="text-indigo-700 font-bold">${p.linkedMoNo}</span> (แปลงที่ ${idx + 1}/${plots.length})</p>
        <p class="text-slate-600 mb-1"><strong>เนื้อที่:</strong> ${p.thaiArea.rai} ไร่ ${p.thaiArea.ngan} งาน ${p.thaiArea.sqWah} ตร.ว.</p>
        <div class="mt-2 text-center">
          <button onclick="selectCadastralPlot('${p.id}')" class="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 shadow-xs">
            ดูเจาะจงแปลงนี้
          </button>
        </div>
      </div>
    `);

    group.addLayer(poly);
  });

  window.cadastralPolygonLayer = group.addTo(window.cadastralMapInstance);
  window.cadastralMapInstance.fitBounds(group.getBounds(), { padding: [40, 40], animate: true });

  const summary = typeof getMultiPlotSummaryForMo === "function" ? getMultiPlotSummaryForMo(moNo) : null;
  const areaStr = summary ? `${summary.thaiArea.rai} ไร่ ${summary.thaiArea.ngan} งาน` : '';
  $("#cadastralMapStatusText").html(`
    <span class="text-indigo-700 font-bold">แสดงครบ ${plots.length} แปลง</span> ของ ${moNo} ${areaStr ? `(รวม ${areaStr})` : ''}
  `);
}

function toggleCadastralFullscreen() {
  const $wrapper = $("#cadastralMapBoxWrapper"), $viewport = $("#cadastralMapViewport");
  const wrapperEl = document.getElementById("cadastralMapBoxWrapper");
  if (!$wrapper.length || !$viewport.length) return;
  isCadastralFullscreen = !isCadastralFullscreen;

  if (isCadastralFullscreen) {
    $wrapper.addClass("fixed inset-0 z-[99999] w-screen h-screen rounded-none p-4 bg-slate-950 m-0").removeClass("w-full rounded-3xl");
    $viewport.removeClass("h-[580px]").addClass("flex-1 h-full min-h-[85vh]");
    $("#cadastralFullscreenText").text("ย่อหน้าจอ");
    $("#cadastralFullscreenIcon").removeClass("fa-expand text-emerald-300").addClass("fa-compress text-rose-400");
    $("body").addClass("overflow-hidden");
    if (wrapperEl && wrapperEl.requestFullscreen && !document.fullscreenElement) wrapperEl.requestFullscreen().catch(() => {});
  } else {
    $wrapper.removeClass("fixed inset-0 z-[99999] w-screen h-screen rounded-none p-4 bg-slate-950 m-0").addClass("w-full rounded-3xl");
    $viewport.addClass("h-[580px]").removeClass("flex-1 h-full min-h-[85vh]");
    $("#cadastralFullscreenText").text("เต็มจอ");
    $("#cadastralFullscreenIcon").removeClass("fa-compress text-rose-400").addClass("fa-expand text-emerald-300");
    $("body").removeClass("overflow-hidden");
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  if (window.cadastralMapInstance) {
    setTimeout(() => {
      if (window.cadastralMapInstance) {
        window.cadastralMapInstance.invalidateSize();
        fitCadastralBounds();
      }
    }, 150);
  }
}

function toggleCadastralCornerPins() {
  window.showCornerPins = !window.showCornerPins;
  const $btn = $("#btnToggleCornerPins");
  if (window.showCornerPins) {
    $btn.addClass("bg-indigo-50 text-indigo-700 border-indigo-200").removeClass("bg-slate-100 text-slate-500");
  } else {
    $btn.removeClass("bg-indigo-50 text-indigo-700 border-indigo-200").addClass("bg-slate-100 text-slate-500");
  }
  if (window.activeCadastralPlotId) {
    drawCadastralPlot(window.activeCadastralPlotId);
  }
}

// ไฮไลต์ปุ่ม Pill ของแปลงที่เลือกในกล่อง Sibling Plots
function updateSiblingPlotPillHighlight(plotId) {
  $(".sibling-plot-pill").each(function () {
    const pid = $(this).attr("data-plot-id");
    if (pid === plotId) {
      $(this).removeClass("bg-white hover:bg-indigo-100 text-slate-700 border-slate-200")
             .addClass("bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-300");
    } else {
      $(this).removeClass("bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-300")
             .addClass("bg-white hover:bg-indigo-100 text-slate-700 border border-slate-200");
    }
  });
}

// อัปเดตข้อมูลในการ์ดและตารางพิกัดมุมแปลงแบบไดนามิก
function updateCadastralDetailsCards(plot) {
  if (!plot) return;
  const isTh = (typeof currentLang !== "undefined" && currentLang === "th");
  $("#cadastralMapStatusText").text(plot.name);
  if (plot.thaiArea) {
    const aText = isTh ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน ${plot.thaiArea.sqWah} ตร.ว.` : `${plot.thaiArea.rai} Rai ${plot.thaiArea.ngan} Ngan ${plot.thaiArea.sqWah} Sq.w.`;
    $("#activePlotThaiArea").text(aText);
    $("#activePlotSqMeters").text(`${plot.thaiArea.sqMeters} ${isTh ? 'ตร.ม.' : 'Sq.m.'}`);
    $("#activePlotHectares").text(`${plot.thaiArea.hectares} ${isTh ? 'เฮกตาร์ (Ha)' : 'Hectares (Ha)'}`);
  }
  $("#activePlotSourceFile").text(plot.fileName || plot.fileType || "-");
  $("#activePlotUploadedAt").text(plot.uploadedAt || "-");
  $("#activePlotVertexCount").text(`${plot.vertices ? plot.vertices.length : 0} ${isTh ? 'จุดมุมแปลง' : 'Vertices'}`);

  if (plot.vertices && plot.vertices.length > 0) {
    let rHtml = "";
    plot.vertices.forEach((v, vIdx) => {
      rHtml += `<tr class="hover:bg-slate-50 transition-colors border-b border-slate-100 text-xs">
        <td class="py-1.5 px-3 font-bold text-center text-slate-700">#${v.no || (vIdx + 1)}</td>
        <td class="py-1.5 px-3 font-mono text-emerald-700 font-medium">${Number(v.lat).toFixed(6)}</td>
        <td class="py-1.5 px-3 font-mono text-indigo-700 font-medium">${Number(v.lng).toFixed(6)}</td>
      </tr>`;
    });
    $("#cadastralVertexTableBody").html(rHtml);
  }
}

// เลือกแปลงที่ดิน: ไฮไลต์ปุ่ม, ซิงก์ Dropdown, โฟกัสแผนที่, และอัปเดตการ์ดข้อมูล
function selectCadastralPlot(plotId) {
  if (!plotId) return;
  window.activeCadastralPlotId = plotId;
  const plot = (window.cadastralPlots || []).find(p => p.id === plotId);
  if (!plot) return;

  // 1. ไฮไลต์ปุ่ม Pill ทันที
  updateSiblingPlotPillHighlight(plotId);

  // 2. ซิงก์ตัวเลือกใน Dropdown หลัก
  $("#cadastralPlotSelect").val(plotId);

  // 3. ไฮไลต์บนแผนที่
  if (window.cadastralMoPolygons && window.cadastralMoPolygons[plotId]) {
    Object.keys(window.cadastralMoPolygons).forEach(id => {
      const lyr = window.cadastralMoPolygons[id];
      if (lyr && lyr._origColor) lyr.setStyle({ color: lyr._origColor, weight: 3.5, fillOpacity: 0.25 });
    });
    const targetPoly = window.cadastralMoPolygons[plotId];
    targetPoly.setStyle({ color: "#f59e0b", weight: 6, fillOpacity: 0.65 });
    targetPoly.bringToFront();
    targetPoly.openPopup();
    if (window.cadastralMapInstance) {
      window.cadastralMapInstance.panTo(targetPoly.getBounds().getCenter(), { animate: true });
    }
  } else {
    drawCadastralPlot(plotId);
  }

  // 4. อัปเดตรายละเอียดการ์ดและตารางมุมแปลง
  updateCadastralDetailsCards(plot);
}

function onCadastralPlotSelectChange(plotId) {
  if (!plotId) return;
  selectCadastralPlot(plotId);
}

function handleKmlMarkerClick(plotId) {
  const plot = (window.cadastralPlots || []).find(p => p.id === plotId);
  if (!plot) return;
  $("#markerDetailPopupContent").html(`
    <div class="space-y-2 text-xs">
      <div class="flex items-center justify-between border-b border-slate-700 pb-1">
        <span class="text-[10px] text-emerald-300 font-bold">[${plot.fileType}] ${plot.name}</span>
        <button onclick="$('#markerDetailPopup').addClass('hidden')" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <p class="text-slate-300 text-[11px]">${plot.description || 'พิกัดแปลงนำเข้า EUDR'}</p>
      <div class="text-emerald-400 font-bold">${plot.thaiArea ? `${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน` : ''}</div>
      <button type="button" onclick="openPlotInCadastralView('${plot.id}')" class="w-full py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">ดูเส้นรูปแปลงจริง</button>
    </div>
  `);
  $("#markerDetailPopup").removeClass("hidden");
}

function openPlotInCadastralView(plotId) {
  window.activeCadastralPlotId = plotId;
  switchView("cadastral");
}
