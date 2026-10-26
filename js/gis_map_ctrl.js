/**
 * GIS Map Points Controller: Full GIS Map Overview with Staggered Dispersion Animation, Multi-Plot Engine & Polygons
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines (Strictly verified)
 */

let leafletMapInstance = null;
let leafletMarkersMap = {}; // key -> { marker, targetLat, targetLng, item, index }
let currentTileLayer = null;
let currentTileType = "osm"; // 'osm' | 'satellite'
let dispersionAnimFrameId = null;
let isMapFullscreen = false;
let currentGisItems = [];
let currentGisPolygonLayers = [];

function clearGisPolygons() {
  if (leafletMapInstance && currentGisPolygonLayers.length > 0) {
    currentGisPolygonLayers.forEach(l => leafletMapInstance.removeLayer(l));
  }
  currentGisPolygonLayers = [];
}

// เรนเดอร์หน้าจอ GIS Map Overview & เริ่มต้น Leaflet Map
function renderMapOverview() {
  const orders = typeof globalData !== "undefined" ? globalData : [];
  if (window.Components && typeof window.Components.renderMapOverviewView === "function") {
    $("#mapViewContainer").html(window.Components.renderMapOverviewView(orders));
    setTimeout(() => { initGisLeafletMap(orders); }, 150);
  }
}

// เริ่มต้นระบบแผนที่ Leaflet และวาดหมุดจุดทั้งหมด (รวมทุกแปลงของ 1 MO)
function initGisLeafletMap(orders) {
  const mapEl = document.getElementById("leafletMap");
  if (!mapEl) return;
  if (leafletMapInstance) { leafletMapInstance.remove(); leafletMapInstance = null; }
  currentGisPolygonLayers = [];

  leafletMapInstance = L.map("leafletMap", {
    center: [8.1, 100.2], zoom: 8, minZoom: 6, maxZoom: 18, zoomControl: true
  });
  setLeafletTileLayer(currentTileType);

  const centerLat = 7.0089, centerLng = 100.4767;
  const hubIcon = L.divIcon({
    className: "leaflet-hub-icon",
    html: `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span class="w-14 h-14 rounded-full bg-indigo-500/25 border border-indigo-400/50 animate-ping absolute"></span>
        <span class="w-9 h-9 rounded-full bg-indigo-600/40 border border-indigo-400/70 animate-pulse absolute"></span>
        <div class="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl border-2 border-indigo-300 z-10">
          <i class="fa-solid fa-bullseye text-[10px]"></i>
        </div>
      </div>
    `,
    iconSize: [28, 28]
  });
  L.marker([centerLat, centerLng], { icon: hubIcon, zIndexOffset: 50 }).addTo(leafletMapInstance);

  leafletMarkersMap = {};
  currentGisItems = typeof buildGisMapItems === "function" ? buildGisMapItems(orders) : (orders || []);

  currentGisItems.forEach((item, index) => {
    let bgClass = "bg-emerald-600", borderClass = "border-emerald-400", ringClass = "bg-emerald-400", iconClass = "fa-tree";
    const name = item.plotName || "";
    if (name.includes("โรงงาน")) {
      bgClass = "bg-indigo-600"; borderClass = "border-indigo-400"; ringClass = "bg-indigo-400"; iconClass = "fa-industry";
    } else if (name.includes("ท่าเรือ")) {
      bgClass = "bg-cyan-600"; borderClass = "border-cyan-400"; ringClass = "bg-cyan-400"; iconClass = "fa-ship";
    }

    const pinLabel = item.totalPlotsInMo > 1 ? `${item.moNo || item.orderNo} #${item.plotIndex}` : (item.moNo || item.orderNo);
    const safeKeyClass = item.key.replace(/[^a-zA-Z0-9_-]/g, '_');

    const customDivIcon = L.divIcon({
      className: `custom-map-pin-icon pin-${safeKeyClass}`,
      html: `
        <div id="pin-el-${safeKeyClass}" class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <span class="absolute -inset-1 rounded-full ${ringClass} opacity-40 animate-ping group-hover:opacity-80"></span>
          <div class="relative w-8 h-8 rounded-full ${bgClass} text-white flex items-center justify-center shadow-lg border-2 ${borderClass} transition-transform duration-200 group-hover:scale-125">
            <i class="fa-solid ${iconClass} text-xs"></i>
          </div>
          <div class="whitespace-nowrap bg-slate-900/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-slate-700 mt-1 pointer-events-none group-hover:scale-110 transition-transform">
            ${pinLabel}
          </div>
        </div>
      `,
      iconSize: [32, 48]
    });

    const marker = L.marker([centerLat, centerLng], { icon: customDivIcon, zIndexOffset: 100 + index });
    marker.addTo(leafletMapInstance);
    marker.on("click", function () { focusGisItem(item.key); });

    leafletMarkersMap[item.key] = {
      marker: marker,
      startLat: centerLat,
      startLng: centerLng,
      targetLat: item.lat,
      targetLng: item.lng,
      item: item,
      index: index
    };
  });

  setTimeout(() => {
    if (leafletMapInstance) {
      leafletMapInstance.invalidateSize();
      triggerMapDispersionAnimation();
    }
  }, 250);
}

function setLeafletTileLayer(type) {
  currentTileType = type;
  if (!leafletMapInstance) return;
  if (currentTileLayer) leafletMapInstance.removeLayer(currentTileLayer);

  if (type === "satellite") {
    currentTileLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      maxZoom: 18
    });
  } else {
    currentTileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    });
  }
  currentTileLayer.addTo(leafletMapInstance);
}

function switchLeafletTile(type) {
  setLeafletTileLayer(type);
  if (type === "satellite") {
    $("#btnTileSat").addClass("bg-indigo-600 text-white font-bold").removeClass("text-slate-300 font-medium");
    $("#btnTileOsm").removeClass("bg-indigo-600 text-white font-bold").addClass("text-slate-300 font-medium");
  } else {
    $("#btnTileOsm").addClass("bg-indigo-600 text-white font-bold").removeClass("text-slate-300 font-medium");
    $("#btnTileSat").removeClass("bg-indigo-600 text-white font-bold").addClass("text-slate-300 font-medium");
  }
}

function resetLeafletMapView() {
  if (!leafletMapInstance) return;
  clearGisPolygons();
  leafletMapInstance.setView([8.1, 100.2], 8, { animate: true });
}

// แอนิเมชันบินพุ่งกระจายตัว (Staggered Dispersion Animation)
function triggerMapDispersionAnimation() {
  if (dispersionAnimFrameId) cancelAnimationFrame(dispersionAnimFrameId);
  $("#markerDetailPopup").addClass("hidden");
  clearGisPolygons();

  const keys = Object.keys(leafletMarkersMap);
  if (keys.length === 0) return;
  const centerLat = 7.0089, centerLng = 100.4767;

  keys.forEach((key) => { leafletMarkersMap[key].marker.setLatLng([centerLat, centerLng]); });

  const animationDuration = 1200;
  const startTime = performance.now() + 200;
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

  function animateLoop(now) {
    let allFinished = true;
    keys.forEach((key) => {
      const entry = leafletMarkersMap[key];
      const markerDelay = entry.index * 35;
      const markerStart = startTime + markerDelay;

      if (now < markerStart) {
        entry.marker.setLatLng([centerLat, centerLng]);
        allFinished = false;
      } else {
        const elapsed = now - markerStart;
        const progress = Math.min(1, elapsed / animationDuration);
        const ease = easeOutCubic(progress);
        const cLat = entry.startLat + (entry.targetLat - entry.startLat) * ease;
        const cLng = entry.startLng + (entry.targetLng - entry.startLng) * ease;
        entry.marker.setLatLng([cLat, cLng]);
        if (progress < 1) allFinished = false;
      }
    });
    if (!allFinished) dispersionAnimFrameId = requestAnimationFrame(animateLoop);
  }
  dispersionAnimFrameId = requestAnimationFrame(animateLoop);
}

// โฟกัสแปลง/หมุดพิกัด GIS เมื่อคลิกจากการ์ดหรือหมุด
function focusGisItem(key) {
  let entry = leafletMarkersMap[key];
  if (!entry) {
    const fallbackKey = Object.keys(leafletMarkersMap).find(k => k === key || k.startsWith(key + "__") || k.includes(key));
    if (fallbackKey) entry = leafletMarkersMap[fallbackKey];
  }
  if (!entry) return;

  const item = entry.item;
  leafletMapInstance.setView([item.lat, item.lng], 13, { animate: true });

  $(".custom-map-pin-icon").removeClass("z-[999]");
  $(`.pin-${item.key.replace(/[^a-zA-Z0-9_-]/g, '_')}`).addClass("z-[999]");

  // วาดเส้นรูปแปลง Polygon ทันทีบนแผนที่ GIS
  clearGisPolygons();
  if (item.coordinates && item.coordinates.length >= 3) {
    const poly = L.polygon(item.coordinates, {
      color: "#059669", weight: 3, fillColor: "#10b981", fillOpacity: 0.35
    }).addTo(leafletMapInstance);
    currentGisPolygonLayers.push(poly);
  }

  // สร้าง Sibling Plot Switchers หากคำสั่งซื้อนี้มีหลายแปลง
  let siblingHtml = "";
  if (item.totalPlotsInMo > 1) {
    const siblings = currentGisItems.filter(s => s.moNo === item.moNo);
    const pills = siblings.map(s => `
      <button 
        onclick="focusGisItem('${s.key}')" 
        class="px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${s.key === item.key ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}"
      >
        แปลง ${s.plotIndex}
      </button>
    `).join("");

    siblingHtml = `
      <div class="mb-2.5 p-2 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between gap-1 text-[11px]">
        <span class="text-indigo-300 font-bold"><i class="fa-solid fa-layer-group mr-1"></i> แปลงใน MO นี้ (${siblings.length}):</span>
        <div class="flex items-center space-x-1">${pills}</div>
      </div>
    `;
  }

  const popupHtml = `
    <div class="flex items-start justify-between mb-2 pb-2 border-b border-slate-700">
      <div>
        <div class="flex items-center space-x-1.5 mb-1">
          <span class="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            ${item.plotId || 'EUDR Validated'}
          </span>
          ${item.totalPlotsInMo > 1 ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">แปลงที่ ${item.plotIndex}/${item.totalPlotsInMo}</span>` : ''}
        </div>
        <h4 class="text-xs sm:text-sm font-bold text-white leading-snug">${item.plotName}</h4>
      </div>
      <button onclick="closeMarkerPopup()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>
    </div>

    ${siblingHtml}

    <div class="grid grid-cols-2 gap-2 text-xs mb-3 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
      <div><span class="text-slate-400 block text-[10px]">Order No.:</span> <strong class="text-white">${item.orderNo}</strong></div>
      <div><span class="text-slate-400 block text-[10px]">MO No.:</span> <strong class="text-indigo-300 font-mono">${item.moNo || '-'}</strong></div>
      <div><span class="text-slate-400 block text-[10px]">เนื้อที่:</span> <strong class="text-emerald-400">${item.thaiAreaStr}</strong></div>
      <div><span class="text-slate-400 block text-[10px]">ปริมาณ:</span> <strong class="text-amber-400">${item.orderQuantity || '500 Ton'}</strong></div>
      <div class="col-span-2 pt-1 border-t border-slate-700 flex items-center justify-between text-[11px]">
        <span class="text-slate-400">พิกัด GPS:</span>
        <span class="font-mono text-emerald-400 font-bold">${typeof item.lat === 'number' ? item.lat.toFixed(4) : item.lat}, ${typeof item.lng === 'number' ? item.lng.toFixed(4) : item.lng}</span>
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <button onclick="openBpmModal('${item.orderNo}')" class="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center">
        <i class="fa-solid fa-file-invoice mr-1.5 text-[11px]"></i> ดูฟอร์ม BPM
      </button>
      <button onclick="jumpToCadastralPlot('${item.plotId || item.orderNo}')" class="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center">
        <i class="fa-solid fa-draw-polygon mr-1.5 text-[11px]"></i> ดูเส้นรูปแปลง
      </button>
    </div>
  `;

  $("#markerDetailPopupContent").html(popupHtml);
  $("#markerDetailPopup").removeClass("hidden").addClass("animate-in fade-in zoom-in-95 duration-200");
}

function focusMapMarker(orderNo) {
  focusGisItem(orderNo);
}

function closeMarkerPopup() {
  $("#markerDetailPopup").addClass("hidden");
}

// กรองและค้นหารายการแปลงใน GIS Sidebar (รองรับค้นหา MO แล้วพบทุกแปลงที่ผูกไว้)
function filterMapSidebar() {
  const keyword = ($("#mapSearchInput").val() || "").toLowerCase().trim();
  const items = currentGisItems || [];
  let visibleCount = 0;
  const visibleBounds = [];

  items.forEach((item) => {
    const cardId = item.cardId || `loc-card-${item.key.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const $card = $(`#${cardId}`);
    const entry = leafletMarkersMap[item.key];

    const match =
      !keyword ||
      (item.orderNo && item.orderNo.toLowerCase().includes(keyword)) ||
      (item.moNo && item.moNo.toLowerCase().includes(keyword)) ||
      (item.customer && item.customer.toLowerCase().includes(keyword)) ||
      (item.plotName && item.plotName.toLowerCase().includes(keyword)) ||
      (item.plotId && String(item.plotId).toLowerCase().includes(keyword)) ||
      (item.fileName && item.fileName.toLowerCase().includes(keyword));

    if (match) {
      $card.removeClass("hidden");
      visibleCount++;
      if (entry && entry.marker && leafletMapInstance) {
        if (!leafletMapInstance.hasLayer(entry.marker)) entry.marker.addTo(leafletMapInstance);
        visibleBounds.push([item.lat, item.lng]);
      }
    } else {
      $card.addClass("hidden");
      if (entry && entry.marker && leafletMapInstance) {
        if (leafletMapInstance.hasLayer(entry.marker)) leafletMapInstance.removeLayer(entry.marker);
      }
    }
  });

  $("#mapSidebarCount").text(keyword ? `${visibleCount} / ${items.length}` : `${items.length}`);

  // ซูมเข้าหาแปลงที่ค้นพบทั้งหมดอัตโนมัติ (เช่น ค้นหา MO-672649852 จะเห็นทั้ง 3 แปลงพร้อมกัน)
  if (keyword && visibleBounds.length > 0 && leafletMapInstance) {
    if (visibleBounds.length === 1) {
      leafletMapInstance.setView(visibleBounds[0], 13, { animate: true });
    } else {
      leafletMapInstance.fitBounds(visibleBounds, { padding: [40, 40], maxZoom: 14 });
    }
  }
}

// เปิด/ปิดแผนที่ GIS เต็มจอ (Fullscreen Mode)
function toggleMapFullscreen(forceState) {
  const wrapper = document.getElementById("gisMapBoxWrapper");
  const viewport = document.getElementById("gisMapViewport");
  if (!wrapper || !viewport) return;

  isMapFullscreen = typeof forceState === "boolean" ? forceState : !isMapFullscreen;
  const $wrapper = $(wrapper);
  const $viewport = $(viewport);

  if (isMapFullscreen) {
    $wrapper.addClass("is-map-fullscreen fixed inset-0 z-[99999] w-screen h-screen m-0 p-3.5 bg-slate-950 flex flex-col rounded-none").removeClass("lg:col-span-3 rounded-3xl");
    $viewport.addClass("flex-1 w-full h-full min-h-[85vh]").removeClass("h-[540px] md:h-[620px] rounded-2xl");
    $("#btnFullscreenText").text("ย่อจอ");
    $("#btnFullscreenIcon, #floatingFullscreenIcon").removeClass("fa-expand text-indigo-400 text-indigo-300").addClass("fa-compress text-rose-400");
    $("#fullscreenNoticeBadge").removeClass("hidden");
    $("body").addClass("overflow-hidden");
    if (wrapper.requestFullscreen && !document.fullscreenElement) wrapper.requestFullscreen().catch(() => {});
  } else {
    $wrapper.removeClass("is-map-fullscreen fixed inset-0 z-[99999] w-screen h-screen m-0 p-3.5 rounded-none").addClass("lg:col-span-3 rounded-3xl p-4");
    $viewport.removeClass("flex-1 w-full h-full min-h-[85vh]").addClass("h-[540px] md:h-[620px] rounded-2xl");
    $("#btnFullscreenText").text("เต็มจอ");
    $("#btnFullscreenIcon").removeClass("fa-compress text-rose-400").addClass("fa-expand text-indigo-400");
    $("#floatingFullscreenIcon").removeClass("fa-compress text-rose-400").addClass("fa-expand text-indigo-300");
    $("#fullscreenNoticeBadge").addClass("hidden");
    $("body").removeClass("overflow-hidden");
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  if (leafletMapInstance) {
    leafletMapInstance.invalidateSize();
    setTimeout(() => { if (leafletMapInstance) leafletMapInstance.invalidateSize(); }, 150);
  }
}

$(document).on("fullscreenchange webkitfullscreenchange mozfullscreenchange", function () {
  if (!document.fullscreenElement && isMapFullscreen) toggleMapFullscreen(false);
});
$(document).on("keydown", function (e) {
  if (e.key === "Escape" && isMapFullscreen) toggleMapFullscreen(false);
});

function jumpToCadastralView(orderNo) {
  if (typeof switchView === "function") switchView("cadastral");
}
