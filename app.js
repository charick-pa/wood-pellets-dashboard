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

  // รีเซ็ตสไตล์ปุ่ม Nav ทั้งหมด
  $("#navDashboardBtn, #navQueryBtn, #navMapBtn, #navCadastralBtn")
    .removeClass("bg-white text-indigo-700 text-emerald-700 shadow-sm font-bold")
    .addClass("text-slate-600 font-semibold");
  $("#navDashboardBtn i").removeClass("text-indigo-600");
  $("#navMapBtn i").removeClass("text-rose-600").addClass("text-rose-500");
  $("#navCadastralBtn i").removeClass("text-emerald-700").addClass("text-emerald-600");

  if (viewName === "dashboard") {
    $("#dashboardView").removeClass("hidden").addClass("page-fade-in");
    $("#navDashboardBtn")
      .addClass("bg-white text-indigo-700 shadow-sm font-bold")
      .removeClass("text-slate-600 font-semibold");
    $("#navDashboardBtn i").addClass("text-indigo-600");
    if (typeof renderDashboard === "function") {
      renderDashboard(typeof globalData !== "undefined" ? globalData : []);
    }
  } else if (viewName === "query") {
    $("#queryView").removeClass("hidden").addClass("page-fade-in");
    $("#navQueryBtn")
      .addClass("bg-white text-indigo-700 shadow-sm font-bold")
      .removeClass("text-slate-600 font-semibold");
    if (typeof renderOrderQueryView === "function") {
      renderOrderQueryView();
    }
  } else if (viewName === "map") {
    $("#mapView").removeClass("hidden").addClass("page-fade-in");
    $("#navMapBtn")
      .addClass("bg-white text-indigo-700 shadow-sm font-bold")
      .removeClass("text-slate-600 font-semibold");
    $("#navMapBtn i").removeClass("text-rose-500").addClass("text-rose-600");
    if (typeof renderMapOverview === "function") {
      renderMapOverview();
    }
  } else if (viewName === "cadastral") {
    $("#cadastralView").removeClass("hidden").addClass("page-fade-in");
    $("#navCadastralBtn")
      .addClass("bg-white text-emerald-700 shadow-sm font-bold")
      .removeClass("text-slate-600 font-semibold");
    $("#navCadastralBtn i").removeClass("text-emerald-600").addClass("text-emerald-700");
    if (typeof renderCadastralView === "function") {
      renderCadastralView();
    }
  }
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
