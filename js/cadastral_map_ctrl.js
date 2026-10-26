/**
 * Cadastral Map Controller: Leaflet Map Management, Tile Switching, Polygon Drawing & Fullscreen
 * File size target: < 400 lines (Strictly verified)
 */

let isCadastralFullscreen = false;

// เรนเดอร์หน้าจอ Cadastral Boundary View
function renderCadastralView() {
  ensureCadastralPlotsInitialized();

  if (window.Components && typeof window.Components.renderCadastralView === "function") {
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
      <div class="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
        EUDR Geolocation Traceability Passed
      </div>
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

  plots.forEach((p, idx) => {
    const col = colors[idx % colors.length];
    const poly = L.polygon(p.coordinates, {
      color: col,
      weight: 3.5,
      opacity: 0.95,
      fillColor: col,
      fillOpacity: 0.25
    });

    poly.bindPopup(`
      <div class="text-xs p-1 font-sans">
        <div class="font-bold text-slate-900 border-b pb-1 mb-1.5 flex items-center">
          <i class="fa-solid fa-draw-polygon mr-1.5" style="color:${col};"></i> ${p.name}
        </div>
        <p class="text-slate-600 mb-1"><strong>คำสั่งซื้อ:</strong> <span class="text-indigo-700 font-bold">${p.linkedMoNo}</span> (แปลงที่ ${idx + 1}/${plots.length})</p>
        <p class="text-slate-600 mb-1"><strong>เนื้อที่:</strong> ${p.thaiArea.rai} ไร่ ${p.thaiArea.ngan} งาน ${p.thaiArea.sqWah} ตร.ว.</p>
        <div class="mt-2 text-center">
          <button onclick="drawCadastralPlot('${p.id}')" class="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800">
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
  const $wrapper = $("#cadastralMapBoxWrapper");
  const $viewport = $("#cadastralMapViewport");
  const wrapperEl = document.getElementById("cadastralMapBoxWrapper");

  if (!$wrapper.length || !$viewport.length) return;

  isCadastralFullscreen = !isCadastralFullscreen;

  if (isCadastralFullscreen) {
    $wrapper
      .addClass("fixed inset-0 z-[99999] w-screen h-screen rounded-none p-4 bg-slate-950 m-0")
      .removeClass("w-full rounded-3xl");
    $viewport
      .removeClass("h-[580px]")
      .addClass("flex-1 h-full min-h-[85vh]");

    $("#cadastralFullscreenText").text("ย่อหน้าจอ");
    $("#cadastralFullscreenIcon").removeClass("fa-expand text-emerald-300").addClass("fa-compress text-rose-400");
    $("#cadastralFullscreenFloatingInfo").removeClass("hidden");
    $("body").addClass("overflow-hidden");

    if (wrapperEl && wrapperEl.requestFullscreen && !document.fullscreenElement) {
      wrapperEl.requestFullscreen().catch(() => {});
    }
  } else {
    $wrapper
      .removeClass("fixed inset-0 z-50 w-screen h-screen rounded-none p-4 bg-slate-950 m-0")
      .addClass("w-full rounded-3xl");
    $viewport
      .addClass("h-[580px]")
      .removeClass("flex-1 h-full min-h-[85vh]");

    $("#cadastralFullscreenText").text("เต็มจอ");
    $("#cadastralFullscreenIcon").removeClass("fa-compress text-rose-400").addClass("fa-expand text-emerald-300");
    $("#cadastralFullscreenFloatingInfo").addClass("hidden");
    $("body").removeClass("overflow-hidden");

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  if (window.cadastralMapInstance) {
    window.cadastralMapInstance.invalidateSize();
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

function onCadastralPlotSelectChange(plotId) {
  if (!plotId) return;
  window.activeCadastralPlotId = plotId;
  renderCadastralView();
}

function handleKmlMarkerClick(plotId) {
  const plot = (window.cadastralPlots || []).find(p => p.id === plotId);
  if (!plot) return;

  const $popup = $("#markerDetailPopup");
  const $content = $("#markerDetailPopupContent");

  $content.html(`
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-slate-700 pb-2">
        <span class="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full font-bold">
          <i class="fa-solid fa-draw-polygon mr-1"></i> [${plot.fileType}] แปลงไม้ยางพารา
        </span>
        <button onclick="$('#markerDetailPopup').addClass('hidden')" class="text-slate-400 hover:text-white text-xs">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div>
        <h4 class="text-sm font-bold text-white">${plot.name}</h4>
        <p class="text-xs text-slate-300 mt-0.5">${plot.description || 'พิกัดแปลงนำเข้าตามเกณฑ์ EUDR'}</p>
        ${plot.linkedMoNo ? `
          <div class="mt-1 inline-block bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <i class="fa-solid fa-link mr-1"></i> ผูกกับคำสั่งซื้อ: ${plot.linkedMoNo}
          </div>
        ` : ''}
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
        <div>
          <span class="text-[10px] text-slate-400 block">เนื้อที่คำนวณได้:</span>
          <strong class="text-emerald-400">${plot.thaiArea.rai} ไร่ ${plot.thaiArea.ngan} งาน</strong>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 block">จุดพิกัดมุมแปลง:</span>
          <strong class="text-indigo-400">${plot.vertices ? plot.vertices.length : 0} มุม</strong>
        </div>
      </div>

      <div class="pt-2 flex items-center space-x-2">
        <button 
          type="button" 
          onclick="openPlotInCadastralView('${plot.id}')"
          class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-lg hover:scale-[1.02] active:scale-95"
        >
          <i class="fa-solid fa-vector-square mr-1.5 text-emerald-200"></i> ดูเส้นรูปแปลงจริง
        </button>
        ${plot.linkedMoNo ? `
          <button 
            type="button" 
            onclick="viewOrderInDashboard('${plot.linkedMoNo}')"
            class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-lg hover:scale-[1.02] active:scale-95"
            title="ดูคำสั่งซื้อใน Dashboard"
          >
            <i class="fa-solid fa-chart-pie"></i>
          </button>
        ` : ''}
      </div>
    </div>
  `);

  $popup.removeClass("hidden");
}

function openPlotInCadastralView(plotId) {
  window.activeCadastralPlotId = plotId;
  switchView("cadastral");
}
