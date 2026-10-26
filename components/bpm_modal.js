/**
 * Component: BPM Master Modal Form (8-Step Full Lifecycle)
 * Green River Panels Wood Pellets Master Form per Latest SA Specification
 * File size target: < 400 lines (Strictly verified)
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    renderBpmModalContent: function (item) {
        if (!item) return '';

        const s1 = item;
        const ra = item.step2 || {};
        const s3 = item.step3 || {};
        const qc = item.step4_qc || {};
        const qa = item.step5_qa || item.step4 || {};
        const wh = item.step6_storage || item.step5 || {};
        const rd = item.step7_ra_dossier || {};
        const ship = item.step8_shipping || item.step6 || {};

        return `
            <div class="p-5 md:p-7 space-y-4 bpm-print-container">
                <!-- 0. Header ของเอกสาร BPM (ใบฟอร์มทางการ) -->
                <div class="bpm-doc-header border-b-2 border-slate-900 pb-3 mb-3">
                    <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div class="space-y-1">
                            <div class="flex items-center space-x-2">
                                <span class="text-xs font-black tracking-widest text-indigo-900 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                    ${item.company || 'GREEN RIVER PANELS (THAILAND) CO., LTD'}
                                </span>
                                <span class="text-[10px] text-slate-500 font-mono">ISO 9001:2015 / SBP-Certified</span>
                            </div>
                            <h1 class="text-lg md:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                                WOOD PELLETS OPERATIONS BPM MASTER FORM
                            </h1>
                            <p class="text-[11px] text-slate-600">
                                ใบติดตามกระบวนการดำเนินงานและควบคุมคุณภาพเม็ดไม้ชีวมวลครบวงจร (8-Step Full Lifecycle: Sale &rarr; RA &rarr; Production &rarr; QC &rarr; QA &rarr; Storage &rarr; RA Verification &rarr; Shipment)
                            </p>
                        </div>

                        <!-- กล่องข้อมูลเลขอ้างอิงหัวเอกสาร (M-Table System Fields) -->
                        <div class="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs min-w-[260px] shadow-2xs">
                            <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                                <span class="text-slate-500 font-medium">Application No:</span>
                                <span class="text-slate-900 font-bold font-mono text-right">${item.applicationNo || 'APP-2026-09821'}</span>

                                <span class="text-slate-500 font-medium">Application Date:</span>
                                <span class="text-slate-900 font-semibold text-right">${item.applicationDate || '2026/09/28'}</span>

                                <span class="text-slate-500 font-medium">Applicant:</span>
                                <span class="text-slate-800 text-right truncate font-medium">${item.applicant || 'Sompong K. (Ops)'}</span>

                                <span class="text-slate-500 font-medium">Requestor:</span>
                                <span class="text-slate-800 text-right truncate font-medium">${item.requestor || 'Natrutdin Y. (Sales)'}</span>

                                <span class="text-slate-500 font-medium">Importance / Status:</span>
                                <span class="text-right">
                                    <span class="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${item.statusBadge === 'On Schedule' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                                        ${item.statusBadge || 'In Production'} (Step ${item.currentStep || 3})
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 1. Sale Department & Planning (Step 1) -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                    <div class="bpm-step-header bg-slate-800 text-white px-3.5 py-1.5 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-cart-shopping mr-2 text-blue-400"></i> 1. SALE DEPARTMENT — ข้อมูลคำสั่งซื้อและลูกค้า</span>
                        <span class="text-[10px] bg-blue-600 px-2 py-0.2 rounded font-semibold text-white">Step 1</span>
                    </div>
                    <div class="bpm-step-content p-3.5 grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs bg-white">
                        <div><strong class="text-slate-500 block text-[11px]">Customer Code:</strong> <span class="text-slate-800 font-mono font-bold">${s1.customerCode || '02545'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500 block text-[11px]">Customer Name:</strong> <span class="text-slate-900 font-bold">${s1.customer}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">From Country:</strong> <span class="text-slate-800 font-semibold">${s1.fromCountry || 'US'}</span></div>

                        <div><strong class="text-slate-500 block text-[11px]">PO No.:</strong> <span class="text-indigo-700 font-bold font-mono">${s1.customerPoNo || s1.poNo || 'PO-ABC-2026-001'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">PI NO.:</strong> <span class="text-indigo-700 font-bold font-mono">${s1.piNo || 'PO-ABC-2026-001'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Order No.:</strong> <span class="text-slate-900 font-bold font-mono">${s1.orderNo}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Quantity:</strong> <span class="text-amber-700 font-bold font-mono">${s1.quantity || s1.orderQuantity || '5000 MT'}</span></div>

                        <div><strong class="text-slate-500 block text-[11px]">Product Code:</strong> <span class="text-slate-800 font-mono">${s1.productCode || 'WP-001'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Product Name:</strong> <span class="text-slate-800 font-medium">${s1.productName || 'Wood Pellets'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Product Type:</strong> <span class="text-slate-800">${s1.productType || '1. 0.6mm±1mm, 2. 0.8mm±1mm'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Ship-to Location:</strong> <span class="text-slate-900 font-semibold">${s1.shipToLocation || s1.destination || 'Port of Japan'}</span></div>

                        <div class="md:col-span-2"><strong class="text-slate-500 block text-[11px]">Contact & Email:</strong> <span class="text-slate-800">${s1.contactPerson || 'Thomason'} &bull; ${s1.emailTel || 'sales@greenriverholding.com'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500 block text-[11px]">Certificate Scheme:</strong> <span class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold border border-slate-200">${s1.certRequirement || 'SBP, GGL'}</span> <span class="text-slate-500 text-[11px]">(${s1.otherCertificate || 'FSC-100%'})</span></div>

                        <div class="md:col-span-4 border-t border-slate-100 pt-1.5"><strong class="text-slate-500 text-[11px]">Customer Requirement:</strong> <span class="text-slate-700 text-[11px]">${s1.customerReq || 'Rubberwood, Pellet Diameter 0.6mm±1mm, Moisture ≤10%, Ash ≤3%, Calorie ≥4,000 kcal/kg, Density ≥600 kg/m³, Fines ≤1%, Bulk Shipment, COA, Inspection'}</span></div>
                        <div class="md:col-span-4"><strong class="text-slate-500 text-[11px]">Special Requirement:</strong> <span class="text-slate-700 text-[11px]">${s1.specialReq || 'ต้องแจ้งลูกค้าหากคุณภาพของสินค้าไม่เป็นไปตามข้อกำหนด, Moisture ≤8%, ตรวจทุก Batch, ส่ง COA ก่อนโหลด, Weather Protection'}</span></div>

                        <!-- ท่อน Planning ใน Step 1 -->
                        <div class="md:col-span-4 bg-blue-50/60 border border-blue-200/80 rounded-lg p-2.5 mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div class="col-span-full font-bold text-blue-900 flex items-center border-b border-blue-200/60 pb-1">
                                <i class="fa-solid fa-calendar-check mr-1 text-blue-600"></i> Planning (การวางแผนการผลิตและเลขที่ออเดอร์)
                            </div>
                            <div><strong class="text-slate-500 block">PI NO. / MO No.:</strong> <span class="font-mono font-bold text-slate-800">${s1.planPiNo || s1.piNo || '-'} / ${s1.planMoNo || s1.moNo || 'MP202600XX'}</span></div>
                            <div><strong class="text-slate-500 block">Plan Dates:</strong> <span class="text-slate-800">${s1.planDateStart || '2026/09/28'} - ${s1.planDateFinish || '2026/09/30'}</span></div>
                            <div><strong class="text-slate-500 block">Production Batch:</strong> <span class="font-mono font-bold text-indigo-700">${s1.planBatchNo || 'SBP-xx-YY-02-3003'}</span></div>
                            <div><strong class="text-slate-500 block">Volume & Scheme:</strong> <span class="font-bold text-amber-700">${s1.planVolume || '5,000 MT'} (${s1.planCertScheme || 'SBP, GGL'})</span></div>
                        </div>

                        <!-- Customer Post-Delivery Complaints in Step 1 -->
                        <div class="md:col-span-4 border-t border-slate-100 pt-2">
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="font-bold text-slate-800 flex items-center text-xs">
                                    <i class="fa-solid fa-comments text-rose-500 mr-1.5"></i> Customer Complaints & Claims (ข้อร้องเรียนหลังรับมอบสินค้า):
                                </span>
                                <button type="button" onclick="openComplaintModal('${s1.orderNo}')" class="px-2 py-0.8 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-bold shadow-2xs transition-all flex items-center">
                                    <i class="fa-solid fa-plus mr-1"></i> Log Complaint
                                </button>
                            </div>
                            ${typeof renderComplaintsListHtml === "function" ? renderComplaintsListHtml(s1.orderNo) : ''}
                        </div>
                    </div>
                </div>

                <!-- 2. RA — Regulatory / Requirement (Step 2) -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                    <div class="bpm-step-header bg-slate-800 text-white px-3.5 py-1.5 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-stamp mr-2 text-indigo-400"></i> 2. RA — REGULATORY & COMPLIANCE REQUIREMENTS (ใบอนุญาตและข้อกำหนด)</span>
                        <span class="text-[10px] bg-indigo-600 px-2 py-0.2 rounded font-semibold text-white">Step 2</span>
                    </div>
                    <div class="bpm-step-content p-3.5 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-white">
                        <div><strong class="text-slate-500 block text-[11px]">Certificate Status:</strong> <span class="text-emerald-700 font-bold">${ra.certStatus || 'APPROVED & VALID (Valid through 2028-12-31)'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">License / Permit Expired:</strong> <span class="text-slate-800 font-semibold">${ra.licenseExpiry || '2027-09-30 (Active until late next year)'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500 text-[11px]">Specification Req:</strong> <span class="text-slate-800 text-[11px]">${ra.specReq || 'EN 10204 3.1 Material Certification, ASME B16.34 Pressure Class 2500, and 100% Hydrostatic Test at 525 bar'}</span></div>
                        <div class="md:col-span-2"><strong class="text-slate-500 text-[11px]">Label & Packaging:</strong> <span class="text-slate-800 text-[11px]">${ra.labelReq || 'QR-Code Barcode Label (100x150 mm)'} &bull; ${ra.packagingReq || 'VCI Vacuum Sealed Polybags, ISPM-15 Wooden Crates'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Customer Regulatory Req:</strong> <span class="text-slate-800 text-[11px]">${ra.customerRegulatory || 'RoHS 3 (EU 2015/863) & REACH Compliance, PED 2014/68/EU Module H, TISI / มอก.'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Transportation Expiry:</strong> <span class="text-rose-700 font-semibold">${ra.transportExpiry || '2027-03-31 (Active transport permit)'}</span></div>
                    </div>
                </div>

                <!-- 3. Production — Woods material planning (Step 3) -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                    <div class="bpm-step-header bg-slate-800 text-white px-3.5 py-1.5 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-tree mr-2 text-amber-400"></i> 3. PRODUCTION — WOODS MATERIAL PLANNING & EXECUTION (การวางแผนวัตถุดิบไม้และการผลิต)</span>
                        <span class="text-[10px] bg-amber-600 px-2 py-0.2 rounded font-semibold text-white">Step 3</span>
                    </div>
                    <div class="bpm-step-content p-3.5 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-white">
                        <div><strong class="text-slate-500 block text-[11px]">Planned Quantity:</strong> <span class="text-slate-900 font-bold">${(s3.planned || 20000).toLocaleString()} Ton</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Actual Quantity:</strong> <span class="text-amber-700 font-bold">${(s3.actual || 15000).toLocaleString()} Ton</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Yield Output:</strong> <span class="text-slate-900 font-bold">${s3.yield || '90,000 Ton'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Uptime / Downtime:</strong> <span class="font-semibold text-slate-800">${s3.totalUptime || '5760 mins.'} / <span class="text-rose-600 font-bold">${s3.totalDowntime || '40 mins.'}</span></span></div>

                        <div><strong class="text-slate-500 block text-[11px]">Start Date Time:</strong> <span class="text-slate-800">${s3.startDate || '2026/09/28'} ${s3.startTime || '02:00'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Finish Date Time:</strong> <span class="text-slate-800">${s3.finishDate || '2026/09/30'} ${s3.finishTime || '07:00'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Material Code:</strong> <span class="text-indigo-700 font-mono font-bold">${s3.materialCode || 'BWP-11-08 / BWP-12-08'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Plant Supervisor:</strong> <span class="text-slate-800 font-medium">${s3.plantSupervisor || 'Operations Lead'}</span></div>

                        <div class="col-span-full border-t border-slate-100 pt-1.5"><strong class="text-slate-500 text-[11px]">Raw Material Requirement:</strong> <span class="text-slate-800 text-[11px] font-medium">${s3.rawMaterialReq || 'Log amount: 12,000 Ton | Slab amount: 5,000 Ton | Sawdust amount: 3,000 Ton'}</span></div>
                        <div class="col-span-full"><strong class="text-slate-500 text-[11px]">Production Issue:</strong> <span class="text-rose-700 text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-100 inline-block">${s3.productionIssue || 'It couldn’t be pressed into solid bar because raw materials were too dry (moisture adjusted).'}</span></div>
                        <div class="col-span-2"><strong class="text-slate-500 text-[11px]">Factory 1 Utilities:</strong> <span class="text-slate-700 text-[11px]">${s3.fac1StatusUtil || 'Downtime: 40 mins | Cause: Raw material dry | Fuels: 1,200 L | Electricity: 85,000 kWh'}</span></div>
                        <div class="col-span-2"><strong class="text-slate-500 text-[11px]">Factory 2 Utilities:</strong> <span class="text-slate-700 text-[11px]">${s3.fac2StatusUtil || 'Downtime: 0 mins | Cause: None | Fuels: 950 L | Electricity: 78,000 kWh'}</span></div>
                    </div>
                </div>

                <!-- 4. QC — In-line Quality Control (Step 4) -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                    <div class="bpm-step-header bg-slate-800 text-white px-3.5 py-1.5 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-gauge mr-2 text-orange-400"></i> 4. QC — IN-LINE QUALITY CONTROL (ผลการตรวจสอบกระบวนการผลิตหน้างาน 5 จุด)</span>
                        <span class="text-[10px] bg-orange-600 px-2 py-0.2 rounded font-semibold text-white">Step 4</span>
                    </div>
                    <div class="bpm-step-content p-3.5 space-y-2 text-xs bg-white">
                        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-1.5 text-[11px]">
                            <div><strong class="text-slate-500">Batch No.:</strong> <span class="font-mono font-bold text-slate-800 ml-1">${qc.batchNo || '1-4'}</span></div>
                            <div><strong class="text-slate-500">Test Date:</strong> <span class="text-slate-800 font-semibold ml-1">${qc.testDate || '2026/10/10'}</span></div>
                            <div><span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-300"><i class="fa-solid fa-check-circle mr-1"></i>${qc.status || '5 Checkpoints Passed (ISO 9001)'}</span></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
                            <div class="bg-slate-50 p-2 rounded border border-slate-200">
                                <strong class="text-slate-600 block">1. Logs & Slab:</strong>
                                <span class="text-slate-800">${qc.paramLogsSlab || 'Cleanliness (%): Refer wood spec | Moisture: 60% (≤70%)'}</span>
                            </div>
                            <div class="bg-slate-50 p-2 rounded border border-slate-200">
                                <strong class="text-slate-600 block">2. Raw Sawdust:</strong>
                                <span class="text-slate-800">${qc.paramSawdust || 'Moisture content: 64% (≤60%)'}</span>
                            </div>
                            <div class="bg-slate-50 p-2 rounded border border-slate-200">
                                <strong class="text-slate-600 block">3. Chipper:</strong>
                                <span class="text-slate-800">${qc.paramChipper || 'Moisture content: 64% (≤60%)'}</span>
                            </div>
                            <div class="bg-slate-50 p-2 rounded border border-slate-200">
                                <strong class="text-slate-600 block">4. After Dryer:</strong>
                                <span class="text-slate-800">${qc.paramAfterDryer || 'Moisture content: 14% (≤12 - 14%)'}</span>
                            </div>
                            <div class="bg-slate-50 p-2 rounded border border-slate-200 md:col-span-2">
                                <strong class="text-slate-600 block">5. After Magnetic Separator:</strong>
                                <span class="text-slate-800">${qc.paramAfterMagnetic || 'Diameter & length: Verified | Moisture: 14% (≤12 - 14%)'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 5. QA — Quality Assurance & Laboratory (Step 5) -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                    <div class="bpm-step-header bg-slate-800 text-white px-3.5 py-1.5 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-flask-vial mr-2 text-purple-400"></i> 5. QA — FINAL QUALITY ASSURANCE & COA (ผลการตรวจสอบห้องแล็บและออกใบรับรอง)</span>
                        <span class="text-[10px] bg-purple-600 px-2 py-0.2 rounded font-semibold text-white">Step 5</span>
                    </div>
                    <div class="bpm-step-content p-3.5 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs bg-white">
                        <div><strong class="text-slate-500 block text-[11px]">Lab Test Date:</strong> <span class="text-slate-800 font-semibold">${qa.testDate || '2026/10/10'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">QA Analyst:</strong> <span class="text-slate-800 font-medium">${qa.analyst || 'Somchai P. / Lead QC Inspector'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">COA File Reference:</strong> <span class="text-indigo-700 font-mono font-bold">${qa.coaFile || 'COA-202610-LF2-03918.pdf'}</span></div>

                        <div class="md:col-span-3 border-t border-slate-100 pt-1.5"><strong class="text-slate-500 text-[11px]">Wood Pellets After Magnetic Separator:</strong> 
                            <div class="text-slate-800 text-[11px] bg-purple-50/50 p-2 rounded border border-purple-100 mt-1">
                                ${qa.paramMagneticPellets || 'Diameter (8±1 mm): 8 mm | Length (25±15mm): 26 mm | Moisture (<10%): 7% | Bulk density (>600kg/m³): 600 kg/m³ | Fines (<1.0%): 1.0% | Ash (<2%): 1.5% | Mechanical durability (>97.5%): 97.5%'}
                            </div>
                        </div>

                        <div><strong class="text-slate-500 block text-[11px]">Raw Material Sawdust:</strong> <span class="text-slate-800 text-[11px]">${qa.sawdustMoisture || 'Moisture: 47%'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Chipper Chips Dimensions:</strong> <span class="text-slate-800 text-[11px]">${qa.paramChipper || '30±10mm / 25±5mm / ≤8mm'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Hammer Mill Sieves:</strong> <span class="text-slate-800 text-[11px]">${qa.paramHammerMill || 'Length 25±15 / Width 25±5 / Thickness ≤8mm'}</span></div>

                        <div class="md:col-span-2"><strong class="text-slate-500 block text-[11px]">Bulk Storage Warehouses:</strong> <span class="text-slate-800 text-[11px]">${qa.bulkWarehouses || 'Moisture (20±10%): 27% | Bulk density (>600kg/m³): 650 | Fines: 1.0%'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Non-Compliance / Standard:</strong> <span class="text-emerald-700 font-bold">${qa.nonCompliance || 'GGL, SBP (None - Fully Compliant)'}</span></div>
                    </div>
                </div>

                <!-- 6. Storage — Warehouse & Packing (Step 6) -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                    <div class="bpm-step-header bg-slate-800 text-white px-3.5 py-1.5 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-warehouse mr-2 text-cyan-400"></i> 6. STORAGE — WAREHOUSE & PACKING (คลังสินค้าและการบรรจุ)</span>
                        <span class="text-[10px] bg-cyan-600 px-2 py-0.2 rounded font-semibold text-white">Step 6</span>
                    </div>
                    <div class="bpm-step-content p-3.5 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-white">
                        <div><strong class="text-slate-500 block text-[11px]">Packing Daily Report:</strong> <span class="text-slate-800 font-mono font-bold">${wh.packingDailyReport || 'PDR-202610-A01'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Packing Dates:</strong> <span class="text-slate-800">${wh.packingDateStart || '2026-10-20'} &rarr; ${wh.packingDateFinish || '2026-12-30'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Storage Location:</strong> <span class="text-slate-900 font-bold">${wh.storageLocation || 'Warehouse 1'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Inventory Controller:</strong> <span class="text-slate-800">${wh.inventoryController || 'Warehouse Manager'}</span></div>

                        <div class="col-span-full border-t border-slate-100 pt-1.5"><strong class="text-slate-500 text-[11px]">Big Bag Label No.:</strong> <span class="text-slate-800 font-mono text-[11px]">${wh.bigBagLabelNo || 'factory 1 : BB-GRP1-2026-001 | factory 2 : BB-GRP2-2026-002'}</span></div>

                        <div class="col-span-full bg-slate-50 p-2 rounded border border-slate-200 grid grid-cols-4 gap-2 text-center text-[11px]">
                            <div><span class="text-slate-500 block">Opening Stock (ยอดยกมา)</span><span class="font-bold text-slate-800">${wh.openingStock || '1000 Ton'}</span></div>
                            <div><span class="text-slate-500 block">Total Receipt (รับเข้า)</span><span class="font-bold text-emerald-700">${wh.totalReceiptQties || '500 Ton'}</span></div>
                            <div><span class="text-slate-500 block">Total Issue (จ่ายออก)</span><span class="font-bold text-rose-700">${wh.totalIssueQties || '300 Ton'}</span></div>
                            <div><span class="text-slate-500 block">Closing Stock (คงเหลือ)</span><span class="font-black text-indigo-700">${wh.closingStock || '1200 Ton'}</span></div>
                        </div>
                    </div>
                </div>

                <!-- 7. RA — Gather Information (Step 7) -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                    <div class="bpm-step-header bg-slate-800 text-white px-3.5 py-1.5 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-folder-tree mr-2 text-emerald-400"></i> 7. RA — GATHER INFORMATION & DOSSIER (รวบรวมข้อมูลส่ง Sales เมื่อร้องขอ)</span>
                        <span class="text-[10px] bg-emerald-600 px-2 py-0.2 rounded font-semibold text-white">Step 7</span>
                    </div>
                    <div class="bpm-step-content p-3.5 space-y-2 text-xs bg-white">
                        <div class="bg-emerald-50/50 p-2 rounded border border-emerald-200/70 text-[11px]">
                            <strong class="text-emerald-900 block mb-1">1. GGL (PDF) FIT/FIP:</strong>
                            <span class="text-slate-700">[ ■ ] Cover letter &bull; [ ■ ] Transaction Statement &bull; [ ■ ] TC from CU &bull; [ ■ ] Transport Docs &bull; [ ■ ] Cert Cleanliness &bull; [ ■ ] GeoJSON &bull; [ ■ ] Non Compliance: GGL, SBP</span>
                        </div>
                        <div class="bg-indigo-50/50 p-2 rounded border border-indigo-200/70 text-[11px]">
                            <strong class="text-indigo-900 block mb-1">2. GGL SDE++:</strong>
                            <span class="text-slate-700">[ ■ ] Cover Letter &bull; [ ■ ] Transaction Statement &bull; [ ■ ] Transaction Certificate &bull; [ ■ ] Transport Documents &bull; [ ■ ] Certificate of Cleanliness &bull; [ ■ ] EUDR Data Sheet &bull; [ ■ ] GeoJSON</span>
                        </div>
                        <div class="bg-teal-50/50 p-2 rounded border border-teal-200/70 text-[11px]">
                            <strong class="text-teal-900 block mb-1">3. SBP / EUDR:</strong>
                            <span class="text-slate-700">[ ■ ] Refer 1. (PDF) &bull; [ ■ ] EUDR Data Sheet &bull; [ ■ ] GeoJSON (Refer Email รอเมื่อขนส่งเสร็จ)</span>
                        </div>
                    </div>
                </div>

                <!-- 8. Shipment — Shipping (Step 8) -->
                <div class="bpm-step-card border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                    <div class="bpm-step-header bg-slate-800 text-white px-3.5 py-1.5 font-bold text-xs flex items-center justify-between border-b border-slate-700">
                        <span class="flex items-center"><i class="fa-solid fa-ship mr-2 text-teal-400"></i> 8. SHIPMENT — การจัดส่ง ข้อมูลระวางเรือ และตารางเดินเรือ</span>
                        <span class="text-[10px] bg-teal-600 px-2 py-0.2 rounded font-semibold text-white">Step 8</span>
                    </div>
                    <div class="bpm-step-content p-3.5 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-white">
                        <div><strong class="text-slate-500 block text-[11px]">SA Number:</strong> <span class="text-slate-900 font-mono font-bold">${ship.saNumber || ship.saNo || 'SA-202610-03918-ISO'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Customer Name:</strong> <span class="text-slate-800 font-bold">${ship.customerName || s1.customer || 'Bnbm company'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">POD (Port of Discharge):</strong> <span class="text-indigo-700 font-bold">${ship.pod || s1.destination || 'ANTWERP (or Port of Japan)'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Shipping Line:</strong> <span class="text-slate-900 font-bold">${ship.shippingLine || 'EVG'}</span></div>

                        <div><strong class="text-slate-500 block text-[11px]">Booking No:</strong> <span class="text-slate-800 font-mono">${ship.bookingNo || '09050012456'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Transit Time:</strong> <span class="text-indigo-700 font-semibold">${ship.transitTime || '30 days'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Loading Date:</strong> <span class="text-slate-800">${ship.loadingDate || '2026/09/30'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Finished Date:</strong> <span class="text-slate-800">${ship.finishedDate || '2026/07/09'}</span></div>

                        <div><strong class="text-slate-500 block text-[11px]">ETD:</strong> <span class="text-emerald-700 font-bold">${ship.etd || '2026/10/10'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">ETA:</strong> <span class="text-slate-800 font-semibold">${ship.eta || '2026/11/10'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">ATD:</strong> <span class="text-emerald-700 font-bold">${ship.atd || '2026/11/10'}</span></div>
                        <div><strong class="text-slate-500 block text-[11px]">Shipment Status:</strong> <span class="text-emerald-700 font-bold text-[10px]"><i class="fa-solid fa-circle-check mr-1"></i> Dispatched & Closed</span></div>
                    </div>
                </div>
            </div>
        `;
    }
});
