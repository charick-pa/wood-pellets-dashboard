/**
 * Component: BPM Master Modal Form (8-Step Full Lifecycle)
 * Green River Panels Wood Pellets Master Form
 * File size target: < 400 lines
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    renderBpmModalContent: function (item) {
        if (!item) return '';

        const ra = item.step2 || {};
        const pz = item.step4_pelletizing || {};
        const qa = item.step4 || {};
        const wh = item.step5 || {};
        const ship = item.step6 || {};

        return `
            <div class="p-6 md:p-8 space-y-5 bpm-print-container">
                <!-- Header ของเอกสาร BPM (ใบฟอร์มทางการ) -->
                <div class="bpm-doc-header border-b-2 border-slate-900 pb-4 mb-4">
                    <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div class="space-y-1">
                            <div class="flex items-center space-x-2">
                                <span class="text-xs font-black tracking-widest text-indigo-900 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                    GREEN RIVER PANELS (THAILAND) CO., LTD
                                </span>
                                <span class="text-[10px] text-slate-500 font-mono">ISO 9001:2015 / SBP-Certified</span>
                            </div>
                            <h1 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
                                WOOD PELLETS OPERATIONS BPM MASTER FORM
                            </h1>
                            <p class="text-xs text-slate-600">
                                ใบติดตามกระบวนการดำเนินงานและควบคุมคุณภาพเม็ดไม้ชีวมวลครบวงจร (8-Step Full Lifecycle: Sale ➔ RA ➔ Production ➔ QC ➔ QA ➔ Storage ➔ RA Verification ➔ Shipment)
                            </p>
                        </div>

                        <!-- กล่องข้อมูลเลขอ้างอิงหัวเอกสาร -->
                        <div class="bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs min-w-[240px] shadow-sm">
                            <div class="grid grid-cols-2 gap-x-2 gap-y-1">
                                <span class="text-slate-500 font-medium">Application No:</span>
                                <span class="text-slate-900 font-bold font-mono text-right">${item.applicationNo || 'APP-2026-09821'}</span>

                                <span class="text-slate-500 font-medium">Issue Date:</span>
                                <span class="text-slate-900 font-semibold text-right">2026/10/07</span>

                                <span class="text-slate-500 font-medium">Current Status:</span>
                                <span class="text-right">
                                    <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${item.statusBadge === 'On Schedule' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                                        ${item.statusBadge || 'In Production'} (Step ${item.currentStep || 1})
                                    </span>
                                </span>

                                <span class="text-slate-500 font-medium">Applicant:</span>
                                <span class="text-slate-700 text-right text-[11px] truncate">Operations Dept.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 1. Sale Department -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-cart-shopping mr-2 text-blue-400 no-print"></i> 1. SALE DEPARTMENT — ข้อมูลคำสั่งซื้อและลูกค้า</span>
                        <span class="text-[10px] bg-blue-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 1</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Customer Code:</strong> <span class="text-slate-800 font-medium">${item.customerCode || '02545'}</span></div>
                        <div><strong class="text-slate-500 block">Customer Name:</strong> <span class="text-slate-900 font-bold">${item.customer}</span></div>
                        <div><strong class="text-slate-500 block">PO No.:</strong> <span class="text-indigo-700 font-bold font-mono text-sm">${item.poNo || 'PO-2026-09821'}</span></div>

                        <div><strong class="text-slate-500 block">Order No.:</strong> <span class="text-slate-900 font-bold font-mono">${item.orderNo}</span></div>
                        <div><strong class="text-slate-500 block">MO No.:</strong> <span class="text-slate-800 font-mono">${item.moNo || 'MO-672649852'}</span></div>
                        <div><strong class="text-slate-500 block">Product Name:</strong> <span class="text-slate-800 font-medium">${item.productName || 'Industrial Wood Pellets (Bio-Fuel)'}</span></div>

                        <div><strong class="text-slate-500 block">Product Code:</strong> <span class="text-slate-800 font-mono">${item.productCode || 'PRD-88204-X'}</span></div>
                        <div><strong class="text-slate-500 block">Order Quantity:</strong> <span class="text-amber-700 font-bold text-sm">${item.orderQuantity || '500 Ton'}</span></div>
                        <div><strong class="text-slate-500 block">Product Type:</strong> <span class="text-slate-800">${item.productType || '1-0.6mm, 2-0.8mm'}</span></div>

                        <div class="md:col-span-3 border-t border-slate-100 pt-2"><strong class="text-slate-500">Certificates Required:</strong> <span class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold border border-slate-200 ml-1">${item.certRequirement || 'SPB, GGL, FSC-100%'}</span></div>
                        <div class="md:col-span-3"><strong class="text-slate-500">Customer Specification:</strong> <span class="text-slate-700">${item.customerReq || 'High precision pressure resistance up to 350 bar with rust-proof coating'}</span></div>
                        <div class="md:col-span-3"><strong class="text-slate-500">Delivery Schedule & Destination:</strong> <span class="text-slate-900 font-semibold">${item.requestedDeliveryDate || '2026/12/15'} &bull; ${item.shipToLocation || item.destination}</span></div>

                        <!-- Customer Post-Delivery Complaints in Step 1 -->
                        <div class="md:col-span-3 border-t border-slate-100 pt-3">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-bold text-slate-800 flex items-center text-xs">
                                    <i class="fa-solid fa-comments text-rose-500 mr-1.5"></i> Customer Complaints & Post-Delivery Claims (ข้อร้องเรียนหลังรับสินค้า):
                                </span>
                                <button type="button" onclick="openComplaintModal('${item.orderNo}')" class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all flex items-center">
                                    <i class="fa-solid fa-plus mr-1"></i> Log Complaint
                                </button>
                            </div>
                            ${typeof renderComplaintsListHtml === "function" ? renderComplaintsListHtml(item.orderNo) : ''}
                        </div>
                    </div>
                </div>

                <!-- 2. RA — Regulatory / Requirement -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-stamp mr-2 text-indigo-400 no-print"></i> 2. RA — REGULATORY & COMPLIANCE REQUIREMENTS (ใบอนุญาตและข้อกำหนด)</span>
                        <span class="text-[10px] bg-indigo-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 2</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Certificate Status:</strong> <span class="text-emerald-700 font-bold">${ra.certStatus || 'APPROVED & VALID (Valid through 2028-12-31)'}</span></div>
                        <div><strong class="text-slate-500 block">License / Permit Expired:</strong> <span class="text-slate-800">${ra.licenseExpiry || '2027-09-30'} (Active)</span></div>

                        <!-- กล่อง EUDR Due Diligence & Geolocation Verification -->
                        <div class="md:col-span-2 bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <span class="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block mb-1">
                                    <i class="fa-solid fa-earth-europe mr-1"></i> EUDR Geolocation Verified
                                </span>
                                <div class="text-xs font-bold text-slate-800">
                                    พิกัดแปลง/โรงงาน: <span class="font-mono text-indigo-700">${item.location?.lat || 7.0089}, ${item.location?.lng || 100.4767}</span>
                                    <span class="font-normal text-slate-600 ml-1">(${item.location?.placeName || 'โรงงาน Green River Panels'})</span>
                                </div>
                                <div class="text-[11px] text-slate-500">รหัสแปลง: <span class="font-mono font-semibold">${item.location?.plotId || 'PLOT-EUDR-202601'}</span> &bull; สถานะ: <span class="text-emerald-700 font-semibold">${item.location?.eudrStatus || 'Verified'}</span></div>
                            </div>
                            <button type="button" onclick="openMapModal('${item.orderNo}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center shrink-0">
                                <i class="fa-solid fa-location-dot mr-1.5"></i> ตรวจสอบแผนที่ GPS
                            </button>
                        </div>

                        ${(() => {
                            const moPlots = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(item.moNo) : [];
                            if (moPlots.length === 0) return '';
                            const totalRai = moPlots.reduce((sum, p) => sum + (p.thaiArea ? p.thaiArea.rai : 0), 0);
                            return `
                                <div class="md:col-span-2 bg-indigo-50/80 border border-indigo-200 rounded-lg p-2.5 space-y-1.5">
                                    <div class="flex items-center justify-between">
                                        <span class="text-[10px] font-black uppercase text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-300">
                                            <i class="fa-solid fa-shapes mr-1"></i> ผูกแปลงที่ดิน KML (${moPlots.length} แปลง รวม ${totalRai} ไร่)
                                        </span>
                                        <button type="button" onclick="viewMoPlotsInCadastral('${item.moNo}')" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold shadow-xs transition-all flex items-center">
                                            <i class="fa-solid fa-layer-group mr-1"></i> ดูเส้นแปลงใน KML Map &rarr;
                                        </button>
                                    </div>
                                    <div class="text-[11px] text-slate-700 flex flex-wrap gap-1.5 pt-0.5">
                                        ${moPlots.map((p, idx) => `
                                            <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                                                ${idx + 1}. ${p.name} <strong class="text-emerald-700">(${p.thaiArea ? p.thaiArea.rai : 0} ไร่)</strong>
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        })()}

                        <div class="md:col-span-2"><strong class="text-slate-500">Specification Req:</strong> <span class="text-slate-800">${ra.specReq || 'EN 10204 3.1 Material Certification, ASME B16.34 Class 2500, Hydrostatic Test 525 bar'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500">Label Requirement:</strong> <span class="text-slate-800">${ra.labelReq || 'QR-Code Barcode Label (100x150 mm) containing PO No., Serial Range, Batch No., CoA URL'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500">Packaging Requirement:</strong> <span class="text-slate-800">${ra.packagingReq || 'VCI Anti-Corrosion Vacuum Sealed Polybags, Wooden Crates with ShockWatch stickers'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500">Customer Regulatory:</strong> <span class="text-slate-800">${ra.customerRegulatory || 'RoHS 3 (EU 2015/863) & REACH Compliance, PED 2014/68/EU Module H, TISI / มอก.'}</span></div>
                        <div><strong class="text-slate-500">Transportation Permit Expiry:</strong> <span class="text-rose-700 font-semibold">${ra.transportExpiry || '2027-03-31'}</span></div>
                    </div>
                </div>

                <!-- 3. Production — Woods material planning -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-tree mr-2 text-amber-400 no-print"></i> 3. PRODUCTION — WOODS MATERIAL PLANNING (การวางแผนวัตถุดิบไม้)</span>
                        <span class="text-[10px] bg-amber-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 3</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Planned Quantity:</strong> <span class="text-slate-900 font-bold">${(item.step3?.planned || 20000).toLocaleString()} Ton</span></div>
                        <div><strong class="text-slate-500 block">Actual Quantity:</strong> <span class="text-amber-700 font-bold">${(item.step3?.actual || 15000).toLocaleString()} Ton</span></div>
                        <div><strong class="text-slate-500 block">Start Date:</strong> <span class="text-slate-800">${item.step3?.startDate || '2026/10/12'}</span></div>
                        <div><strong class="text-slate-500 block">Finish Date:</strong> <span class="text-slate-800">${item.step3?.finishDate || '2026/10/02'}</span></div>

                        <div class="md:col-span-4 border-t border-slate-100 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <strong class="text-slate-500">แหล่งกำเนิดแปลงไม้ (Plot Source):</strong> 
                                <span class="text-slate-900 font-semibold ml-1">${item.location?.placeName || 'แปลงสวนไม้ยางพารา สุราษฎร์ธานี'}</span>
                                <span class="text-slate-500 ml-1">(${item.location?.areaRai || '250 ไร่'})</span>
                                <span class="font-mono text-indigo-600 ml-1 font-semibold">[GPS: ${item.location?.lat || '-'}, ${item.location?.lng || '-'}]</span>
                            </div>
                            <button type="button" onclick="openMapModal('${item.orderNo}')" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center shrink-0">
                                <i class="fa-solid fa-map-location-dot mr-1 text-amber-600"></i> ดูแผนที่แปลงไม้
                            </button>
                        </div>

                        <div class="md:col-span-4 border-t border-slate-100 pt-2"><strong class="text-slate-500">Raw Material Machinery:</strong> 
                            <span class="text-slate-800 ml-1">Hummer mill (Active), Flaker 3 (Standby), Flaker 4 (Active)</span>
                        </div>
                    </div>
                </div>

                <!-- 4. QC — In-line Quality Control -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-gauge mr-2 text-orange-400 no-print"></i> 4. QC — IN-LINE QUALITY CONTROL & PELLETIZING (การควบคุมคุณภาพหน้าเตาและอัดเม็ด)</span>
                        <span class="text-[10px] bg-orange-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 4</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Yield Output:</strong> <span class="text-slate-900 font-bold">${pz.yield || '90,000 Ton'}</span></div>
                        <div><strong class="text-slate-500 block">Total Downtime:</strong> <span class="text-rose-700 font-bold">${(pz.totalDowntimeMins || 4000).toLocaleString()} นาที</span></div>
                        <div><strong class="text-slate-500 block">Wood Pellet Diameter:</strong> <span class="text-indigo-700 font-bold">${pz.pelletDiameter || '6.0 mm'}</span></div>
                        <div><strong class="text-slate-500 block">Pellet Moisture:</strong> <span class="text-cyan-700 font-bold">${pz.pelletMoisture || '7.8%'}</span></div>

                        <div><strong class="text-slate-500 block">Cooling Moisture:</strong> <span class="text-emerald-700 font-bold">${pz.coolingMoisture || '6.5%'}</span></div>
                        <div class="md:col-span-3"><strong class="text-slate-500 block">In-line QC Checkpoints & Note:</strong> <span class="text-slate-700 bg-rose-50/70 border border-rose-200 px-2 py-0.5 rounded inline-block text-[11px]">${pz.issue || 'Screen blockage on Hummer mill & die temperature check'}</span></div>
                    </div>
                </div>

                <!-- 5. QA — Quality Assurance & Laboratory -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-microscope mr-2 text-purple-400 no-print"></i> 5. QA — QUALITY ASSURANCE & CERTIFICATE OF ANALYSIS (COA)</span>
                        <span class="text-[10px] bg-purple-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 5</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Sample No:</strong> <span class="text-slate-800 font-mono">${qa.sampleNo || '1-4'}</span></div>
                        <div><strong class="text-slate-500 block">Test Date:</strong> <span class="text-slate-800">${qa.testDate || '2026-10-09'}</span></div>
                        <div><strong class="text-slate-500 block">Lead QA Analyst:</strong> <span class="text-slate-800 font-medium">${qa.analyst || 'NL-4092 (Somchai P.)'}</span></div>

                        <div class="md:col-span-3 border-t border-slate-100 pt-2"><strong class="text-slate-500">Specification Standard:</strong> <span class="text-slate-800">${qa.specification || 'ISO 17225-2 Class A1 / ENplus-A1 Wood Pellets'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500">COA File Reference:</strong> <span class="text-indigo-700 font-bold font-mono">${qa.coaFile || 'COA-202610-LF2-03918.pdf'}</span></div>
                        <div><strong class="text-slate-500">Deviation / OOS:</strong> <span class="text-emerald-700 font-bold">${qa.deviation || 'None (Zero Deviation)'}</span></div>
                    </div>
                </div>

                <!-- 6. Storage — Warehouse & Packaging -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-warehouse mr-2 text-cyan-400 no-print"></i> 6. STORAGE — WAREHOUSE & STOCK MOVEMENT (คลังสินค้าและการจัดเก็บ)</span>
                        <span class="text-[10px] bg-cyan-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 6</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">Storage Location:</strong> <span class="text-slate-900 font-bold">${wh.location || 'Warehouse 1 (Dry Bulk Bay)'}</span></div>
                        <div><strong class="text-slate-500 block">Big Bag Label No:</strong> <span class="text-slate-800 font-mono">${wh.bigBagLabelNo || 'BB-202610-04159'}</span></div>
                        <div><strong class="text-slate-500 block">Material Code:</strong> <span class="text-slate-800 font-mono">${wh.material || 'BWP-11-08 / BWP-12-08'}</span></div>

                        <div><strong class="text-slate-500 block">Opening Stock (ยอดยกมา):</strong> <span class="text-slate-800 font-semibold">${wh.openingStock || '1,000 Ton'}</span></div>
                        <div><strong class="text-slate-500 block">Total Issue (จ่ายออก):</strong> <span class="text-rose-700 font-semibold">${wh.issueQty || '300 Ton'}</span></div>
                        <div><strong class="text-slate-500 block">Closing Stock (คงเหลือ):</strong> <span class="text-emerald-700 font-bold">${wh.closingStock || '1,200 Ton'}</span></div>
                    </div>
                </div>

                <!-- 7. RA Verification — Pre-Shipment Regulatory Audit -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-file-circle-check mr-2 text-emerald-400 no-print"></i> 7. RA VERIFICATION — REGULATORY VERIFICATION DOSSIER (การตรวจสอบเอกสารและใบรับรองขั้นสุดท้าย)</span>
                        <span class="text-[10px] bg-emerald-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 7</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">EUDR Due Diligence Statement:</strong> <span class="text-emerald-700 font-bold">DDS-2026-TH-0924 (VALID)</span></div>
                        <div><strong class="text-slate-500 block">SBP Claim:</strong> <span class="text-slate-800 font-medium">SBP-Compliant Biomass (FSC 100%)</span></div>
                        <div><strong class="text-slate-500 block">GGL Certificate No:</strong> <span class="text-slate-800 font-mono">GGL-GRP-2026-8812</span></div>
                        <div class="md:col-span-3 border-t border-slate-100 pt-2"><strong class="text-slate-500">Verification Result:</strong> <span class="text-emerald-700 font-semibold">ผ่านการตรวจสอบความสอดคล้องตามเกณฑ์ SBP Standard 1, GGL Track & Trace, และ EU Deforestation Regulation พร้อมส่งมอบเพื่อการส่งออก 100%</span></div>
                    </div>
                </div>

                <!-- 8. Shipment — Export Logistics -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                    <div class="bpm-step-header bg-slate-800 text-white px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-ship mr-2 text-teal-400 no-print"></i> 8. SHIPMENT & EXPORT LOGISTICS (การจัดส่งและส่งออกทางเรือ)</span>
                        <span class="text-[10px] bg-teal-600 px-2.5 py-0.5 rounded font-semibold text-white tracking-wide">Step 8</span>
                    </div>
                    <div class="bpm-step-content p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-white">
                        <div><strong class="text-slate-500 block">SA Number:</strong> <span class="text-slate-900 font-bold font-mono">${ship.saNo || 'CPM2600100'}</span></div>
                        <div><strong class="text-slate-500 block">Destination Port (POD):</strong> <span class="text-slate-900 font-bold">${item.destination}</span></div>
                        <div><strong class="text-slate-500 block">Shipping Line:</strong> <span class="text-indigo-700 font-bold">${ship.shippingLine || 'EVG'}</span></div>
                        <div><strong class="text-slate-500 block">Booking No.:</strong> <span class="text-slate-900 font-mono">${ship.bookingNo || '09050012456'}</span></div>

                        <div><strong class="text-slate-500 block">Loading Date:</strong> <span class="text-slate-800">${ship.loadingDate || '30/09/26'}</span></div>
                        <div><strong class="text-slate-500 block">ETD (Estimated Departure):</strong> <span class="text-emerald-700 font-bold">${ship.etd || '10/10/26'}</span></div>
                        <div><strong class="text-slate-500 block">ETA (Estimated Arrival):</strong> <span class="text-slate-800">${ship.eta || '10/11/26'}</span></div>
                        <div><strong class="text-slate-500 block">Transit Time:</strong> <span class="text-indigo-700 font-semibold">${ship.transitTime || '30 days'}</span></div>
                    </div>
                </div>
            </div>
        `;
    }
});
