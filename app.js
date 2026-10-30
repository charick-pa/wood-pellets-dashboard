/**
 * Green River Panels — Wood Pellets Operations Dashboard
 * Core Application Router & Lifecycle Management
 * Modularized Architecture (< 400 lines per file)
 */

var currentView = window.currentView || "dashboard";
var currentSelectedOrderNo = window.currentSelectedOrderNo || "SA-202610-001";

// สลับมุมมองหน้าจอระหว่าง Dashboard, Order Query, GIS Map, และ Cadastral Boundary
function switchView(viewName) {
  currentView = viewName;

  // ซ่อนทุกวิว
  $("#dashboardView, #queryView, #mapView, #cadastralView")
    .addClass("hidden")
    .removeClass("page-fade-in");

  // รีเซ็ตสไตล์ปุ่ม Nav ทั้งด้านบนและ Bottom Dock
  $("#navDashboardBtn, #navQueryBtn, #navMapBtn, #navCadastralBtn, #dockDashboardBtn, #dockQueryBtn, #dockMapBtn, #dockCadastralBtn")
    .removeClass("glass-pill-active bg-white text-indigo-700 text-emerald-700 shadow-sm font-bold")
    .addClass("text-slate-600 font-semibold hover:text-slate-900");
  $("#navDashboardBtn i, #navQueryBtn i, #dockDashboardBtn i, #dockQueryBtn i").removeClass("text-emerald-600 text-indigo-600").addClass("text-slate-400");
  $("#navMapBtn i, #dockMapBtn i").removeClass("text-rose-600 text-emerald-600").addClass("text-slate-400");
  $("#navCadastralBtn i, #dockCadastralBtn i").removeClass("text-emerald-700 text-emerald-600").addClass("text-slate-400");

  if (viewName === "dashboard") {
    $("#dashboardView").removeClass("hidden").addClass("page-fade-in");
    $("#navDashboardBtn, #dockDashboardBtn").addClass("glass-pill-active font-bold").removeClass("text-slate-600");
    $("#navDashboardBtn i, #dockDashboardBtn i").removeClass("text-slate-400").addClass("text-emerald-600");
    if (typeof renderDashboard === "function") renderDashboard(typeof globalData !== "undefined" ? globalData : []);
  } else if (viewName === "query") {
    $("#queryView").removeClass("hidden").addClass("page-fade-in");
    $("#navQueryBtn, #dockQueryBtn").addClass("glass-pill-active font-bold").removeClass("text-slate-600");
    $("#navQueryBtn i, #dockQueryBtn i").removeClass("text-slate-400").addClass("text-emerald-600");
    if (typeof renderOrderQueryView === "function") renderOrderQueryView();
  } else if (viewName === "map") {
    $("#mapView").removeClass("hidden").addClass("page-fade-in");
    $("#navMapBtn, #dockMapBtn").addClass("glass-pill-active font-bold").removeClass("text-slate-600");
    $("#navMapBtn i, #dockMapBtn i").removeClass("text-slate-400").addClass("text-rose-500");
    if (typeof renderMapOverview === "function") renderMapOverview();
  } else if (viewName === "cadastral") {
    $("#cadastralView").removeClass("hidden").addClass("page-fade-in");
    $("#navCadastralBtn, #dockCadastralBtn").addClass("glass-pill-active font-bold").removeClass("text-slate-600");
    $("#navCadastralBtn i, #dockCadastralBtn i").removeClass("text-slate-400").addClass("text-emerald-600");
    if (typeof renderCadastralView === "function") renderCadastralView();
  }

  // รีสตาร์ตแอนิเมชัน stagger-in ให้การ์ดค่อยๆ ลอยขึ้นมาใหม่อย่างนุ่มนวลช้าๆ
  var $activeView = $("#" + viewName + "View");
  $activeView.find(".stagger-in").each(function () {
    var el = this;
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = "";
  });
}

// เริ่มต้นระบบเมื่อ Document พร้อม
$(document).ready(function () {
  if (typeof applyLanguage === "function") {
    applyLanguage(currentLang);
  }

  if (typeof globalData !== "undefined" && globalData.length > 0) {
    currentSelectedOrderNo = globalData[0].orderNo;
    if (typeof renderDashboard === "function") {
      renderDashboard(globalData);
    }
  }

  if (typeof ensureCadastralPlotsInitialized === "function") {
    ensureCadastralPlotsInitialized();
  }

  // ดึงตัวเลือก Filter ทั้งหมดจาก mockdata ตั้งแต่ต้น (และพร้อมสลับไปดึงจากฐานข้อมูลจริงทันทีเมื่อเชื่อมต่อ)
  if (typeof populateQueryFilters === "function") {
    populateQueryFilters(typeof globalData !== "undefined" ? globalData : []);
  }

  // รองรับการเปิดวิวผ่าน URL Query หรือ Hash เช่น ?view=query หรือ #map
  var urlParams = new URLSearchParams(window.location.search);
  var targetView = urlParams.get("view") || (window.location.hash || "").replace("#", "").toLowerCase();
  if (["query", "map", "cadastral"].indexOf(targetView) !== -1) {
    switchView(targetView);
  }

  // ปิด Modal เมื่อคลิกพื้นหลัง
  $("#bpmModal").on("click", function (e) {
    if (e.target === this) closeBpmModal();
  });
  $("#mapModal").on("click", function (e) {
    if (e.target === this) closeMapModal();
  });
  $("#cadastralImportModal").on("click", function (e) {
    if (e.target === this) closeCadastralImportModal();
  });

  // ปิด Modal หรือ Fullscreen ด้วยปุ่ม ESC
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      if (typeof closeBpmModal === "function") closeBpmModal();
      if (typeof closeMapModal === "function") closeMapModal();
      if (typeof closeCadastralImportModal === "function") closeCadastralImportModal();
      if (typeof isCadastralFullscreen !== "undefined" && isCadastralFullscreen) {
        toggleCadastralFullscreen();
      }
      if (typeof isMapFullscreen !== "undefined" && isMapFullscreen) {
        toggleMapFullscreen();
      }
    }
  });
});
