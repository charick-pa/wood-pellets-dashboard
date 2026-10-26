let globalData = [];
let globalSummary = {};

// ฟังก์ชันสร้าง Mock Data สำหรับทดสอบระบบ (28 รายการ เพื่อทดสอบการแบ่งหน้า 20 แถว/หน้า)
function generateMockOrders() {
    const baseOrders = [
        {
            orderNo: "ORD-04159",
            applicationNo: "APP-2026-09821",
            customerCode: "02545",
            customer: "Acme Global Trading Co., Ltd.",
            poNo: "PO-2026-09821",
            moNo: "MO-672649852",
            destination: "Eastern Seaboard, ระยอง",
            podCode: "CPM2600100",
            currentStep: 3,
            productName: "Industrial Wood Pellets (Bio-Fuel)",
            productCode: "PRD-88204-X",
            productType: "1-0.6mm, 2-0.8mm",
            orderQuantity: "500 Ton",
            certRequirement: "SPB, GGL, FSC",
            customerReq: "High precision pressure resistance up to 350 bar with rust-proof coating",
            specialReq: "Must pass ISO 9001:2015 inspection with full Certificate of Analysis (CoA) and mill test report attached.",
            planStartDate: "2026/09/30",
            planEndDate: "2026/10/30",
            requestedDeliveryDate: "2026/12/15",
            shipToLocation: "Eastern Seaboard Industrial Estate, Rayong",
            step1: { name: "Sale Department", status: "Done" },
            step2: { 
                name: "Regulatory (RA)", 
                status: "APPROVED", 
                certStatus: "APPROVED & VALID (Valid through 2028-12-31)",
                licenseExpiry: "2027-09-30 (Active until late next year)",
                specReq: "EN 10204 3.1 Material Certification, ASME B16.34 Pressure Class 2500, Hydrostatic Test 525 bar",
                labelReq: "QR-Code Barcode Label (100x150 mm) containing PO No., Serial Range, Batch No., CoA URL",
                packagingReq: "VCI Anti-Corrosion Vacuum Sealed Polybags, Wooden Crates with ShockWatch stickers",
                customerRegulatory: "RoHS 3 (EU 2015/863) & REACH Compliance, PED 2014/68/EU Module H, TISI / มอก.",
                transportExpiry: "2027-03-31",
                valid: "Valid: 2028-12"
            },
            step3: { 
                name: "Production Woods material planning", 
                planned: 20000, 
                actual: 15000, 
                unit: "Ton", 
                startDate: "2026/10/12",
                finishDate: "2026/10/02",
                status: "In Progress" 
            },
            step4_pelletizing: {
                yield: "90,000 Ton",
                totalDowntimeMins: 4000,
                issue: "Screen blockage on Hummer mill & die temperature stabilization",
                pelletDiameter: "6.0 mm",
                pelletMoisture: "7.8%",
                coolingMoisture: "6.5%"
            },
            step4: { 
                name: "QA Inspection", 
                status: "Zero Dev", 
                sub: "COA Generated",
                sampleNo: "1-4",
                testDate: "2026-10-09",
                specification: "ASTM A350 LF2 Class 1 (NACE MR0175 / ISO 15156)",
                testParameter: "Chemical & Mechanical: Heat No. HT-88392-A Verification",
                analyst: "NL-4092 (Somchai P. / Lead QC Inspector)",
                coaFile: "COA-202610-LF2-03918.pdf",
                coaUrl: "https://dms.company.com/verify/COA-202610-LF2-03918",
                deviation: "None (Zero Deviation)",
                qcReport: "QCR-20261009-A350-01"
            },
            step5: { 
                name: "Warehouse", 
                location: "Warehouse 1", 
                sub: "Ready for Pick",
                packingDailyReport: "Completed (Shift A)",
                bigBagLabelNo: "BB-202610-04159",
                material: "BWP-11-08 / BWP-12-08",
                openingStock: "1,000 Ton",
                issueQty: "300 Ton",
                closingStock: "1,200 Ton"
            },
            step6: { 
                name: "Shipment", 
                tracking: "CPM2600100", 
                saNo: "CPM2600100",
                shippingLine: "EVG",
                bookingNo: "09050012456",
                transitTime: "30 days",
                loadingDate: "30/09/26",
                finishedDate: "07/09/26",
                etd: "10/10/26", 
                eta: "10/11/26",
                atd: "11/10/26"
            },
            machinery: [
                { name: "Hummer mill", active: true },
                { name: "Flaker 3", active: false },
                { name: "Flaker 4", active: true }
            ],
            statusBadge: "In Production"
        },
        {
            orderNo: "ORD-04160",
            applicationNo: "APP-2026-09822",
            customerCode: "01890",
            customer: "Bnbm Company",
            poNo: "PO-2026-08112",
            moNo: "MO-672649853",
            destination: "ANTWERP, BELGIUM",
            podCode: "CPM2600101",
            currentStep: 6,
            productName: "Premium Wood Pellets A1",
            productCode: "PRD-88205-A1",
            productType: "1-0.6mm",
            orderQuantity: "10,000 Ton",
            certRequirement: "SBP, FSC, ENplus",
            customerReq: "Strict ash content < 0.5% with high calorific value > 4.6 kWh/kg",
            specialReq: "COA with ENplus standard verification",
            planStartDate: "2026/09/15",
            planEndDate: "2026/10/10",
            requestedDeliveryDate: "2026/11/15",
            shipToLocation: "Port of Antwerp, Belgium",
            step1: { name: "Sale Department", status: "Done" },
            step2: { 
                name: "Regulatory (RA)", 
                status: "APPROVED", 
                certStatus: "APPROVED & VALID",
                licenseExpiry: "2029-01-15",
                specReq: "ENplus A1 Standard",
                labelReq: "Barcoded Big Bag Label with QR Code",
                packagingReq: "1,000 kg Big Bags with water-proof liner",
                customerRegulatory: "EU Timber Regulation (EUTR) & REACH",
                transportExpiry: "2028-05-30",
                valid: "Valid: 2029-01" 
            },
            step3: { name: "Production Woods material planning", planned: 10000, actual: 10000, unit: "Ton", status: "Completed" },
            step4_pelletizing: {
                yield: "10,000 Ton",
                totalDowntimeMins: 450,
                issue: "None - Smooth continuous production",
                pelletDiameter: "6.0 mm",
                pelletMoisture: "7.1%",
                coolingMoisture: "6.2%"
            },
            step4: { 
                name: "QA Inspection", 
                status: "Zero Dev", 
                sub: "COA Generated",
                sampleNo: "1-8",
                testDate: "2026-10-01",
                specification: "ENplus A1 / ISO 17225-2",
                testParameter: "Calorific Value & Ash Content verification",
                analyst: "NL-4088 (Prasert M.)",
                coaFile: "COA-202610-ENP-01129.pdf",
                coaUrl: "https://dms.company.com/verify/COA-202610-ENP-01129",
                deviation: "None",
                qcReport: "QCR-20261001-ENP-02"
            },
            step5: { 
                name: "Warehouse", 
                location: "Warehouse 2", 
                sub: "Dispatched",
                material: "BWP-11-06",
                openingStock: "2,500 Ton",
                issueQty: "1,000 Ton",
                closingStock: "1,500 Ton"
            },
            step6: { 
                name: "Shipment", 
                tracking: "CPM2600101", 
                saNo: "CPM2600101",
                shippingLine: "MAERSK",
                bookingNo: "09050012890",
                transitTime: "35 days",
                loadingDate: "05/10/26",
                finishedDate: "10/10/26",
                etd: "12/10/26", 
                eta: "12/11/26",
                atd: "-" 
            },
            machinery: [
                { name: "Hummer mill", active: true },
                { name: "Flaker 3", active: false },
                { name: "Flaker 4", active: true }
            ],
            statusBadge: "On Schedule"
        },
        {
            orderNo: "ORD-04161",
            applicationNo: "APP-2026-09823",
            customerCode: "03112",
            customer: "Siam Chemical Inter",
            poNo: "PO-2026-07441",
            moNo: "MO-672649854",
            destination: "ชลบุรี, ประเทศไทย",
            podCode: "CPM2600102",
            currentStep: 7,
            productName: "Biomass Wood Pellets Industrial",
            productCode: "PRD-88206-I",
            productType: "2-0.8mm",
            orderQuantity: "15,000 Ton",
            certRequirement: "TISI, ISO 9001",
            customerReq: "Domestic bulk transport via dump truck",
            specialReq: "Factory weight bridge ticket required",
            planStartDate: "2026/09/01",
            planEndDate: "2026/09/25",
            requestedDeliveryDate: "2026/10/15",
            shipToLocation: "Laem Chabang Industrial Estate, Chonburi",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: "APPROVED", valid: "Valid: 2028-06" },
            step3: { name: "Production Woods material planning", planned: 15000, actual: 15000, unit: "Ton", status: "Completed" },
            step4_pelletizing: { yield: "15,000 Ton", totalDowntimeMins: 120, pelletDiameter: "8.0 mm", pelletMoisture: "7.5%", coolingMoisture: "6.8%" },
            step4: { name: "QA Inspection", status: "Zero Dev", sub: "COA Generated" },
            step5: { name: "Warehouse", location: "Warehouse 1", closingStock: "1,500 Ton" },
            step6: { 
                name: "Shipment", 
                saNo: "CPM2600102", 
                shippingLine: "Inland Logistics", 
                bookingNo: "INL-2026-9921",
                transitTime: "1 day",
                etd: "14/10/26", 
                eta: "15/10/26" 
            },
            machinery: [{ name: "Hummer mill", active: true }, { name: "Flaker 3", active: true }, { name: "Flaker 4", active: true }],
            statusBadge: "On Schedule"
        },
        {
            orderNo: "ORD-04162",
            applicationNo: "APP-2026-09824",
            customerCode: "04982",
            customer: "Tokyo Logistics Corp",
            poNo: "PO-2026-09033",
            moNo: "MO-672649855",
            destination: "TOKYO, JAPAN",
            podCode: "CPM2600103",
            currentStep: 4,
            productName: "Japanese Power-Gen Wood Pellets",
            productCode: "PRD-88207-JP",
            productType: "1-0.6mm",
            orderQuantity: "25,000 Ton",
            certRequirement: "GGL, FSC, Green Energy",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: "APPROVED", valid: "Valid: 2030-01" },
            step3: { name: "Production Woods material planning", planned: 25000, actual: 8000, unit: "Ton", status: "In Progress" },
            step4_pelletizing: { yield: "8,000 Ton", totalDowntimeMins: 1450, issue: "Flaker 3 blade maintenance", pelletDiameter: "6.0 mm", pelletMoisture: "7.9%", coolingMoisture: "6.7%" },
            step4: { name: "QA Inspection", status: "Pending", sub: "Waiting Test" },
            step5: { name: "Warehouse", location: "Warehouse 3", closingStock: "500 Ton" },
            step6: { name: "Shipment", saNo: "CPM2600103", shippingLine: "ONE Line", bookingNo: "ONE-2026-8812", transitTime: "18 days", etd: "20/10/26", eta: "25/10/26" },
            machinery: [{ name: "Hummer mill", active: true }, { name: "Flaker 3", active: false }, { name: "Flaker 4", active: true }],
            statusBadge: "In Production"
        },
        {
            orderNo: "ORD-04163",
            applicationNo: "APP-2026-09825",
            customerCode: "05120",
            customer: "Pacific Rim Supplies",
            poNo: "PO-2026-09144",
            moNo: "MO-672649856",
            destination: "SINGAPORE",
            podCode: "CPM2600104",
            currentStep: 5,
            productName: "Industrial Wood Pellets",
            productCode: "PRD-88204-X",
            productType: "1-0.6mm",
            orderQuantity: "12,000 Ton",
            certRequirement: "SPB, FSC",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: "APPROVED", valid: "Valid: 2028-11" },
            step3: { name: "Production Woods material planning", planned: 12000, actual: 12000, unit: "Ton", status: "Completed" },
            step4_pelletizing: { yield: "12,000 Ton", totalDowntimeMins: 380, pelletDiameter: "6.0 mm", pelletMoisture: "7.6%", coolingMoisture: "6.4%" },
            step4: { name: "QA Inspection", status: "Zero Dev", sub: "COA Generated" },
            step5: { name: "Warehouse", location: "Warehouse 2", closingStock: "800 Ton" },
            step6: { name: "Shipment", saNo: "CPM2600104", shippingLine: "PIL", bookingNo: "PIL-2026-4401", transitTime: "5 days", etd: "15/10/26", eta: "18/10/26" },
            machinery: [{ name: "Hummer mill", active: true }, { name: "Flaker 3", active: true }, { name: "Flaker 4", active: false }],
            statusBadge: "On Schedule"
        },
        {
            orderNo: "ORD-04164",
            applicationNo: "APP-2026-09826",
            customerCode: "06018",
            customer: "Nordic Trade Group",
            poNo: "PO-2026-09188",
            moNo: "MO-672649857",
            destination: "ROTTERDAM, NETHERLANDS",
            podCode: "CPM2600105",
            currentStep: 3,
            productName: "Bio-Fuel Pellets Grade ENplus",
            productCode: "PRD-88205-A1",
            productType: "1-0.6mm",
            orderQuantity: "30,000 Ton",
            certRequirement: "SBP, FSC, ENplus",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: "APPROVED", valid: "Valid: 2029-05" },
            step3: { name: "Production Woods material planning", planned: 30000, actual: 10000, unit: "Ton", status: "In Progress" },
            step4_pelletizing: { yield: "10,000 Ton", totalDowntimeMins: 890, pelletDiameter: "6.0 mm", pelletMoisture: "7.8%", coolingMoisture: "6.5%" },
            step4: { name: "QA Inspection", status: "In Progress", sub: "Testing" },
            step5: { name: "Warehouse", location: "Warehouse 1", closingStock: "1,200 Ton" },
            step6: { name: "Shipment", saNo: "CPM2600105", shippingLine: "CMA CGM", bookingNo: "CMA-2026-9011", transitTime: "33 days", etd: "22/10/26", eta: "05/11/26" },
            machinery: [{ name: "Hummer mill", active: true }, { name: "Flaker 3", active: true }, { name: "Flaker 4", active: false }],
            statusBadge: "In Production"
        },
        {
            orderNo: "ORD-04165",
            applicationNo: "APP-2026-09827",
            customerCode: "06155",
            customer: "Asean Bio Energy",
            poNo: "PO-2026-09201",
            moNo: "MO-672649858",
            destination: "สระบุรี, ประเทศไทย",
            podCode: "CPM2600106",
            currentStep: 6,
            productName: "Wood Pellets Industrial Standard",
            productCode: "PRD-88206-I",
            productType: "2-0.8mm",
            orderQuantity: "18,000 Ton",
            certRequirement: "TISI, ISO 9001",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: "APPROVED", valid: "Valid: 2028-09" },
            step3: { name: "Production Woods material planning", planned: 18000, actual: 18000, unit: "Ton", status: "Completed" },
            step4_pelletizing: { yield: "18,000 Ton", totalDowntimeMins: 320, pelletDiameter: "8.0 mm", pelletMoisture: "7.4%", coolingMoisture: "6.6%" },
            step4: { name: "QA Inspection", status: "Zero Dev", sub: "COA Generated" },
            step5: { name: "Warehouse", location: "Warehouse 3", closingStock: "2,200 Ton" },
            step6: { name: "Shipment", saNo: "CPM2600106", shippingLine: "Inland Rail", bookingNo: "RAIL-2026-441", transitTime: "2 days", etd: "11/10/26", eta: "12/10/26" },
            machinery: [{ name: "Hummer mill", active: true }, { name: "Flaker 3", active: true }, { name: "Flaker 4", active: false }],
            statusBadge: "On Schedule"
        },
        {
            orderNo: "ORD-04166",
            applicationNo: "APP-2026-09828",
            customerCode: "06214",
            customer: "Global Harvest Co.",
            poNo: "PO-2026-09250",
            moNo: "MO-672649859",
            destination: "LOS ANGELES, USA",
            podCode: "CPM2600107",
            currentStep: 1,
            productName: "California Grade Bio-Pellets",
            productCode: "PRD-88204-US",
            productType: "1-0.6mm",
            orderQuantity: "22,000 Ton",
            certRequirement: "CARB, PFI, FSC",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: "Pending", valid: "Valid: 2030-03" },
            step3: { name: "Production Woods material planning", planned: 22000, actual: 0, unit: "Ton", status: "Pending" },
            step4_pelletizing: { yield: "0 Ton", totalDowntimeMins: 0, issue: "Awaiting material allocation", pelletDiameter: "6.0 mm", pelletMoisture: "-", coolingMoisture: "-" },
            step4: { name: "QA Inspection", status: "Pending", sub: "Waiting" },
            step5: { name: "Warehouse", location: "Warehouse 1", closingStock: "0 Ton" },
            step6: { name: "Shipment", saNo: "CPM2600107", shippingLine: "COSCO", bookingNo: "COS-2026-7788", transitTime: "24 days", etd: "28/10/26", eta: "15/11/26" },
            machinery: [{ name: "Hummer mill", active: false }, { name: "Flaker 3", active: false }, { name: "Flaker 4", active: false }],
            statusBadge: "In Production"
        },
        {
            orderNo: "ORD-04167",
            applicationNo: "APP-2026-09829",
            customerCode: "07119",
            customer: "Vina Paper Industries",
            poNo: "PO-2026-09299",
            moNo: "MO-672649860",
            destination: "HO CHI MINH, VIETNAM",
            podCode: "CPM2600108",
            currentStep: 6,
            productName: "Standard Wood Pellets",
            productCode: "PRD-88204-X",
            productType: "1-0.6mm",
            orderQuantity: "14,000 Ton",
            certRequirement: "FSC, PEFC",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: "APPROVED", valid: "Valid: 2029-08" },
            step3: { name: "Production Woods material planning", planned: 14000, actual: 14000, unit: "Ton", status: "Completed" },
            step4_pelletizing: { yield: "14,000 Ton", totalDowntimeMins: 210, pelletDiameter: "6.0 mm", pelletMoisture: "7.3%", coolingMoisture: "6.4%" },
            step4: { name: "QA Inspection", status: "Zero Dev", sub: "COA Generated" },
            step5: { name: "Warehouse", location: "Warehouse 2", closingStock: "1,800 Ton" },
            step6: { name: "Shipment", saNo: "CPM2600108", shippingLine: "SITC", bookingNo: "SITC-2026-5510", transitTime: "4 days", etd: "16/10/26", eta: "19/10/26" },
            machinery: [{ name: "Hummer mill", active: true }, { name: "Flaker 3", active: true }, { name: "Flaker 4", active: true }],
            statusBadge: "On Schedule"
        },
        {
            orderNo: "ORD-04168",
            applicationNo: "APP-2026-09830",
            customerCode: "07881",
            customer: "Sunlight Enterprise",
            poNo: "PO-2026-09315",
            moNo: "MO-672649861",
            destination: "HAMBURG, GERMANY",
            podCode: "CPM2600109",
            currentStep: 2,
            productName: "European Standard Wood Pellets",
            productCode: "PRD-88204-EU",
            productType: "1-0.6mm, 2-0.8mm",
            orderQuantity: "16,000 Ton",
            certRequirement: "SPB, GGL, FSC",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: "APPROVED", valid: "Valid: 2028-10" },
            step3: { name: "Production Woods material planning", planned: 16000, actual: 0, unit: "Ton", status: "Pending" },
            step4_pelletizing: { yield: "0 Ton", totalDowntimeMins: 0, issue: "In RA document approval queue", pelletDiameter: "6.0 mm", pelletMoisture: "-", coolingMoisture: "-" },
            step4: { name: "QA Inspection", status: "Pending", sub: "Waiting" },
            step5: { name: "Warehouse", location: "Warehouse 3", closingStock: "0 Ton" },
            step6: { name: "Shipment", saNo: "CPM2600109", shippingLine: "Hapag-Lloyd", bookingNo: "HL-2026-1190", transitTime: "32 days", etd: "25/10/26", eta: "10/11/26" },
            machinery: [{ name: "Hummer mill", active: false }, { name: "Flaker 3", active: false }, { name: "Flaker 4", active: true }],
            statusBadge: "In Production"
        }
    ];

    // เพิ่มรายการคำสั่งซื้อจำลองให้ครบ 48 รายการ (รวม Base Orders เป็น 48-50 รายการ) เพื่อแสดงจุดพิกัดจำนวนมากทั่วภาคใต้
    const additionalData = [
        { no: "ORD-04169", mo: "MO-672649862", po: "PO-2026-09320", cust: "Osaka Bio-Power Ltd.", dest: "OSAKA, JAPAN", step: 4, q: "20,000 Ton", line: "NYK Line", etd: "18/10/26", eta: "26/10/26", stat: "In Production" },
        { no: "ORD-04170", mo: "MO-672649863", po: "PO-2026-09340", cust: "Kanto Energy Corp.", dest: "YOKOHAMA, JAPAN", step: 5, q: "18,000 Ton", line: "MOL", etd: "19/10/26", eta: "28/10/26", stat: "On Schedule" },
        { no: "ORD-04171", mo: "MO-672649864", po: "PO-2026-09355", cust: "Busan Thermal Energy", dest: "BUSAN, SOUTH KOREA", step: 6, q: "25,000 Ton", line: "HMM", etd: "21/10/26", eta: "28/10/26", stat: "On Schedule" },
        { no: "ORD-04172", mo: "MO-672649865", po: "PO-2026-09370", cust: "Rotterdam Clean Fuels", dest: "ROTTERDAM, NETHERLANDS", step: 3, q: "35,000 Ton", line: "Maersk", etd: "27/10/26", eta: "12/11/26", stat: "In Production" },
        { no: "ORD-04173", mo: "MO-672649866", po: "PO-2026-09385", cust: "Iberian Biomass SL", dest: "VALENCIA, SPAIN", step: 2, q: "15,000 Ton", line: "MSC", etd: "30/10/26", eta: "20/11/26", stat: "In Production" },
        { no: "ORD-04174", mo: "MO-672649867", po: "PO-2026-09400", cust: "Bangkok Biomass Co.", dest: "สมุทรปราการ, ประเทศไทย", step: 7, q: "8,000 Ton", line: "Truck Bulk", etd: "12/10/26", eta: "13/10/26", stat: "On Schedule" },
        { no: "ORD-04175", mo: "MO-672649868", po: "PO-2026-09415", cust: "Taiwan Pulp & Paper", dest: "KAOHSIUNG, TAIWAN", step: 5, q: "12,000 Ton", line: "Yang Ming", etd: "17/10/26", eta: "22/10/26", stat: "On Schedule" },
        { no: "ORD-04176", mo: "MO-672649869", po: "PO-2026-09430", cust: "Danish Energy Partners", dest: "COPENHAGEN, DENMARK", step: 4, q: "22,000 Ton", line: "Hapag-Lloyd", etd: "24/10/26", eta: "15/11/26", stat: "In Production" },
        { no: "ORD-04177", mo: "MO-672649870", po: "PO-2026-09445", cust: "Sydney Bio Materials", dest: "SYDNEY, AUSTRALIA", step: 1, q: "10,000 Ton", line: "ANL", etd: "05/11/26", eta: "25/11/26", stat: "In Production" },
        { no: "ORD-04178", mo: "MO-672649871", po: "PO-2026-09460", cust: "Incheon Power & Gas", dest: "INCHEON, SOUTH KOREA", step: 6, q: "16,000 Ton", line: "SM Line", etd: "20/10/26", eta: "27/10/26", stat: "On Schedule" },
        { no: "ORD-04179", mo: "MO-672649872", po: "PO-2026-09475", cust: "Antwerp Bio Terminal", dest: "ANTWERP, BELGIUM", step: 3, q: "18,000 Ton", line: "CMA CGM", etd: "26/10/26", eta: "14/11/26", stat: "In Production" },
        { no: "ORD-04180", mo: "MO-672649873", po: "PO-2026-09490", cust: "Nagoya Green Mills", dest: "NAGOYA, JAPAN", step: 7, q: "14,000 Ton", line: "K-Line", etd: "13/10/26", eta: "20/10/26", stat: "On Schedule" },
        { no: "ORD-04181", mo: "MO-672649874", po: "PO-2026-09505", cust: "Hamburg Renewable AG", dest: "HAMBURG, GERMANY", step: 4, q: "20,000 Ton", line: "Maersk", etd: "23/10/26", eta: "12/11/26", stat: "In Production" },
        { no: "ORD-04182", mo: "MO-672649875", po: "PO-2026-09520", cust: "SCG Energy Solution", dest: "สระบุรี, ประเทศไทย", step: 6, q: "10,000 Ton", line: "Inland Logistics", etd: "15/10/26", eta: "16/10/26", stat: "On Schedule" },
        { no: "ORD-04183", mo: "MO-672649876", po: "PO-2026-09535", cust: "Manila Biomass Trading", dest: "MANILA, PHILIPPINES", step: 5, q: "9,000 Ton", line: "Evergreen", etd: "18/10/26", eta: "23/10/26", stat: "On Schedule" },
        { no: "ORD-04184", mo: "MO-672649877", po: "PO-2026-09550", cust: "Genoa Eco Energy", dest: "GENOA, ITALY", step: 2, q: "17,000 Ton", line: "MSC", etd: "29/10/26", eta: "18/11/26", stat: "In Production" },
        { no: "ORD-04185", mo: "MO-672649878", po: "PO-2026-09565", cust: "Seoul Clean District", dest: "PYEONGTAEK, S.KOREA", step: 4, q: "24,000 Ton", line: "Pan Ocean", etd: "22/10/26", eta: "29/10/26", stat: "In Production" },
        { no: "ORD-04186", mo: "MO-672649879", po: "PO-2026-09580", cust: "Kobe Power Station", dest: "KOBE, JAPAN", step: 7, q: "30,000 Ton", line: "MOL", etd: "10/10/26", eta: "18/10/26", stat: "On Schedule" },
        { no: "ORD-04187", mo: "MO-672649880", po: "PO-2026-09595", cust: "Bordeaux Green Fuel", dest: "BORDEAUX, FRANCE", step: 3, q: "16,500 Ton", line: "CMA CGM", etd: "25/10/26", eta: "16/11/26", stat: "In Production" },
        { no: "ORD-04188", mo: "MO-672649881", po: "PO-2026-09610", cust: "Kyushu Electric Power", dest: "FUKUOKA, JAPAN", step: 5, q: "28,000 Ton", line: "NYK Line", etd: "16/10/26", eta: "24/10/26", stat: "On Schedule" },
        { no: "ORD-04189", mo: "MO-672649882", po: "PO-2026-09625", cust: "Copenhagen Bio Utility", dest: "AARHUS, DENMARK", step: 6, q: "21,000 Ton", line: "Maersk", etd: "19/10/26", eta: "09/11/26", stat: "On Schedule" },
        { no: "ORD-04190", mo: "MO-672649883", po: "PO-2026-09640", cust: "Singapore Clean Energy", dest: "JURONG, SINGAPORE", step: 7, q: "12,000 Ton", line: "PIL", etd: "11/10/26", eta: "14/10/26", stat: "On Schedule" },
        { no: "ORD-04191", mo: "MO-672649884", po: "PO-2026-09655", cust: "Tokyo Eco Thermal", dest: "TOKYO, JAPAN", step: 4, q: "32,000 Ton", line: "ONE Line", etd: "22/10/26", eta: "31/10/26", stat: "In Production" },
        { no: "ORD-04192", mo: "MO-672649885", po: "PO-2026-09670", cust: "Helsinki Bio District", dest: "HELSINKI, FINLAND", step: 2, q: "19,000 Ton", line: "Finnlines", etd: "28/10/26", eta: "21/11/26", stat: "In Production" },
        { no: "ORD-04193", mo: "MO-672649886", po: "PO-2026-09685", cust: "Chugoku Electric", dest: "HIROSHIMA, JAPAN", step: 5, q: "15,000 Ton", line: "MOL", etd: "17/10/26", eta: "26/10/26", stat: "On Schedule" },
        { no: "ORD-04194", mo: "MO-672649887", po: "PO-2026-09700", cust: "Ulsan Eco Petrochem", dest: "ULSAN, SOUTH KOREA", step: 6, q: "26,000 Ton", line: "HMM", etd: "20/10/26", eta: "28/10/26", stat: "On Schedule" },
        { no: "ORD-04195", mo: "MO-672649888", po: "PO-2026-09715", cust: "Lisbon Green Heat", dest: "LISBON, PORTUGAL", step: 3, q: "14,000 Ton", line: "MSC", etd: "26/10/26", eta: "17/11/26", stat: "In Production" },
        { no: "ORD-04196", mo: "MO-672649889", po: "PO-2026-09730", cust: "Stockholm BioKraft", dest: "STOCKHOLM, SWEDEN", step: 1, q: "22,500 Ton", line: "Hapag-Lloyd", etd: "06/11/26", eta: "28/11/26", stat: "In Production" },
        { no: "ORD-04197", mo: "MO-672649890", po: "PO-2026-09745", cust: "Taipei Renewable Power", dest: "KEELUNG, TAIWAN", step: 4, q: "17,500 Ton", line: "Yang Ming", etd: "21/10/26", eta: "27/10/26", stat: "In Production" },
        { no: "ORD-04198", mo: "MO-672649891", po: "PO-2026-09760", cust: "Ghent Bio Pellets NV", dest: "GHENT, BELGIUM", step: 5, q: "23,000 Ton", line: "Maersk", etd: "18/10/26", eta: "08/11/26", stat: "On Schedule" },
        { no: "ORD-04199", mo: "MO-672649892", po: "PO-2026-09775", cust: "Sendai Biomass Plant", dest: "SENDAI, JAPAN", step: 7, q: "31,000 Ton", line: "K-Line", etd: "12/10/26", eta: "22/10/26", stat: "On Schedule" },
        { no: "ORD-04200", mo: "MO-672649893", po: "PO-2026-09790", cust: "Dublin Clean Heat Co.", dest: "DUBLIN, IRELAND", step: 3, q: "16,000 Ton", line: "MSC", etd: "27/10/26", eta: "19/11/26", stat: "In Production" },
        { no: "ORD-04201", mo: "MO-672649894", po: "PO-2026-09805", cust: "Daegu Green Complex", dest: "POHANG, SOUTH KOREA", step: 6, q: "27,000 Ton", line: "SM Line", etd: "19/10/26", eta: "27/10/26", stat: "On Schedule" },
        { no: "ORD-04202", mo: "MO-672649895", po: "PO-2026-09820", cust: "Marseille Bio Energy", dest: "MARSEILLE, FRANCE", step: 4, q: "18,500 Ton", line: "CMA CGM", etd: "23/10/26", eta: "14/11/26", stat: "In Production" },
        { no: "ORD-04203", mo: "MO-672649896", po: "PO-2026-09835", cust: "Hokkaido Biomass Ltd.", dest: "TOMAKOMAI, JAPAN", step: 5, q: "29,000 Ton", line: "NYK Line", etd: "16/10/26", eta: "27/10/26", stat: "On Schedule" },
        { no: "ORD-04204", mo: "MO-672649897", po: "PO-2026-09850", cust: "Amsterdam Eco Fuel BV", dest: "AMSTERDAM, NETHERLANDS", step: 7, q: "36,000 Ton", line: "Maersk", etd: "11/10/26", eta: "02/11/26", stat: "On Schedule" },
        { no: "ORD-04205", mo: "MO-672649898", po: "PO-2026-09865", cust: "Penang Green Power", dest: "PENANG, MALAYSIA", step: 6, q: "8,500 Ton", line: "Regional Feeder", etd: "14/10/26", eta: "16/10/26", stat: "On Schedule" },
        { no: "ORD-04206", mo: "MO-672649899", po: "PO-2026-09880", cust: "Shikoku Bio Generation", dest: "TAKAMATSU, JAPAN", step: 4, q: "21,500 Ton", line: "MOL", etd: "24/10/26", eta: "03/11/26", stat: "In Production" }
    ];

    additionalData.forEach((item, index) => {
        baseOrders.push({
            orderNo: item.no,
            applicationNo: `APP-2026-${9831 + index}`,
            customerCode: `0${7890 + index}`,
            customer: item.cust,
            poNo: item.po,
            moNo: item.mo,
            destination: item.dest,
            podCode: `CPM2600${110 + index}`,
            currentStep: item.step,
            productName: "Industrial Wood Pellets (Bio-Fuel)",
            productCode: "PRD-88204-X",
            productType: "1-0.6mm, 2-0.8mm",
            orderQuantity: item.q,
            certRequirement: "SPB, GGL, FSC",
            step1: { name: "Sale Department", status: "Done" },
            step2: { name: "Regulatory (RA)", status: item.step >= 2 ? "APPROVED" : "Pending", valid: "Valid: 2028-12" },
            step3: { 
                name: "Production Woods material planning", 
                planned: parseInt(item.q.replace(/,/g, '')) || 20000, 
                actual: item.step >= 4 ? parseInt(item.q.replace(/,/g, '')) || 20000 : 0, 
                unit: "Ton", 
                status: item.step >= 4 ? "Completed" : (item.step === 3 ? "In Progress" : "Pending")
            },
            step4_pelletizing: {
                yield: item.q,
                totalDowntimeMins: item.step >= 4 ? 420 : 0,
                pelletDiameter: "6.0 mm",
                pelletMoisture: item.step >= 4 ? "7.5%" : "-",
                coolingMoisture: item.step >= 4 ? "6.4%" : "-"
            },
            step4: { name: "QA Inspection", status: item.step >= 5 ? "Zero Dev" : "Pending", sub: item.step >= 5 ? "COA Generated" : "Waiting" },
            step5: { name: "Warehouse", location: `Warehouse ${(index % 3) + 1}`, closingStock: "1,200 Ton" },
            step6: { 
                name: "Shipment", 
                saNo: `CPM2600${110 + index}`, 
                shippingLine: item.line, 
                bookingNo: `BK-${202600 + index}`,
                transitTime: "25 days",
                etd: item.etd, 
                eta: item.eta 
            },
            orderDate: `2026-${String((index % 12) + 1).padStart(2, '0')}-15`,
            requestedDeliveryDate: `2026-${String((index % 12) + 1).padStart(2, '0')}-28`,
            machinery: [
                { name: "Hummer mill", active: item.step >= 3 },
                { name: "Flaker 3", active: item.step >= 4 },
                { name: "Flaker 4", active: item.step >= 3 }
            ],
            statusBadge: item.stat
        });
    });

    // คลังพิกัดจำลองของแปลงสวนไม้ยางพารา โรงงาน และท่าเรือทั่วภาคใต้ 48 จุดจริง (EUDR Geolocation Supply Chain)
    const mockLocations = [
        // --- โซนสุราษฎร์ธานี (แหล่งป่ายางพาราและชีวมวลหลัก) ---
        { lat: 9.1382, lng: 99.3217, placeName: "แปลงสวนไม้ยางพารา พุนพิน สุราษฎร์ธานี (Plot A1)", plotId: "PLOT-SR-01", areaRai: "350 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 8.7958, lng: 99.3642, placeName: "แปลงไม้ยางพารา บ้านนาสาร สุราษฎร์ธานี (Plot A2)", plotId: "PLOT-SR-02", areaRai: "280 ไร่", eudrStatus: "FSC-100% / EUDR Ready" },
        { lat: 8.6367, lng: 99.3512, placeName: "แปลงสวนไม้ยางพารา เวียงสระ สุราษฎร์ธานี (Plot A3)", plotId: "PLOT-SR-03", areaRai: "420 ไร่", eudrStatus: "EUDR Verified & Due Diligence Pass" },
        { lat: 9.2612, lng: 99.1982, placeName: "แปลงไม้ยางพารา ท่าฉาง สุราษฎร์ธานี (Plot A4)", plotId: "PLOT-SR-04", areaRai: "190 ไร่", eudrStatus: "SBP / EUDR Certified" },
        { lat: 9.1652, lng: 99.4718, placeName: "ลานรับซื้อไม้ยาง กาญจนดิษฐ์ สุราษฎร์ธานี", plotId: "PLOT-SR-05", areaRai: "ลานรับซื้อไม้ชีวมวล", eudrStatus: "ISO 9001 / EUDR Verified" },
        { lat: 8.8415, lng: 99.1892, placeName: "แปลงไม้ยางพารา เคียนซา สุราษฎร์ธานี (Plot A6)", plotId: "PLOT-SR-06", areaRai: "310 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 8.5521, lng: 99.0345, placeName: "แปลงสวนยาง พระแสง สุราษฎร์ธานี (Plot A7)", plotId: "PLOT-SR-07", areaRai: "260 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 9.3142, lng: 99.6912, placeName: "ท่าเรือเฟอร์รี่และลานไม้ ดอนสัก สุราษฎร์ธานี", plotId: "PORT-DS-01", areaRai: "จุดโหลดทางน้ำ", eudrStatus: "Export Terminal" },

        // --- โซนนครศรีธรรมราช (ศูนย์กลางไม้ยางพาราภาคใต้ตอนกลาง) ---
        { lat: 8.1645, lng: 99.6804, placeName: "ศูนย์รวบรวมไม้ยาง ทุ่งสง นครศรีธรรมราช", plotId: "PLOT-NST-01", areaRai: "ศูนย์คัดแยกไม้", eudrStatus: "EUDR Certified / SBP" },
        { lat: 8.4304, lng: 99.9631, placeName: "แปลงสวนไม้ยาง เมืองนครศรีธรรมราช (Plot C2)", plotId: "PLOT-NST-02", areaRai: "320 ไร่", eudrStatus: "FSC-100% / EUDR Ready" },
        { lat: 7.9741, lng: 100.0012, placeName: "แปลงไม้ยาง ชะอวด นครศรีธรรมราช (Plot C3)", plotId: "PLOT-NST-03", areaRai: "210 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.3412, lng: 99.7825, placeName: "แปลงสวนยางเชิงเขา ลานสกา นครศรีธรรมราช", plotId: "PLOT-NST-04", areaRai: "185 ไร่", eudrStatus: "SBP / EUDR Verified" },
        { lat: 8.4215, lng: 99.5014, placeName: "แปลงไม้ยาง ฉวาง นครศรีธรรมราช (Plot C5)", plotId: "PLOT-NST-05", areaRai: "290 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 8.6652, lng: 99.9234, placeName: "แปลงสวนยาง ท่าศาลา นครศรีธรรมราช (Plot C6)", plotId: "PLOT-NST-06", areaRai: "240 ไร่", eudrStatus: "EUDR Ready / FSC" },
        { lat: 9.0045, lng: 99.9015, placeName: "แปลงไม้ยาง สิชล นครศรีธรรมราช (Plot C7)", plotId: "PLOT-NST-07", areaRai: "330 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.1812, lng: 99.8541, placeName: "แปลงสวนยาง ร่อนพิบูลย์ นครศรีธรรมราช", plotId: "PLOT-NST-08", areaRai: "195 ไร่", eudrStatus: "GGL / EUDR Certified" },

        // --- โซนตรัง (เมืองหลวงยางพาราไทย) ---
        { lat: 7.5563, lng: 99.6114, placeName: "แปลงปลูกไม้ยางพารา เมืองตรัง (Plot B1)", plotId: "PLOT-TR-01", areaRai: "280 ไร่", eudrStatus: "EUDR Verified & Due Diligence Pass" },
        { lat: 7.7892, lng: 99.5512, placeName: "แปลงสวนไม้ยาง ห้วยยอด ตรัง (Plot B2)", plotId: "PLOT-TR-02", areaRai: "360 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 7.4112, lng: 99.5124, placeName: "ลานรับซื้อไม้และท่าเรือ กันตัง ตรัง", plotId: "PORT-KT-01", areaRai: "ลานโหลดไม้ชายฝั่งอันดามัน", eudrStatus: "Coastal Transfer Terminal" },
        { lat: 7.3412, lng: 99.8512, placeName: "แปลงสวนยาง ปะเหลียน ตรัง (Plot B4)", plotId: "PLOT-TR-04", areaRai: "220 ไร่", eudrStatus: "FSC-100% / EUDR Ready" },
        { lat: 7.3912, lng: 99.6712, placeName: "แปลงสวนไม้ยาง ย่านตาขาว ตรัง (Plot B5)", plotId: "PLOT-TR-05", areaRai: "175 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 7.7124, lng: 99.3512, placeName: "แปลงไม้ยางพารา วังวิเศษ ตรัง (Plot B6)", plotId: "PLOT-TR-06", areaRai: "310 ไร่", eudrStatus: "SBP / EUDR Certified" },

        // --- โซนสงขลา & พัทลุง (โรงงาน Green River HQ และท่าเรือส่งออกหลัก) ---
        { lat: 7.0089, lng: 100.4767, placeName: "โรงงาน Green River Panels หาดใหญ่ HQ", plotId: "FAC-GRP-01", areaRai: "โรงงานแปรรูปหลัก", eudrStatus: "ISO 9001 / SBP Certified" },
        { lat: 7.0845, lng: 100.4125, placeName: "โรงงานแปรรูปชีวมวล บางกล่ำ สงขลา", plotId: "FAC-GRP-02", areaRai: "โรงงานอัดเม็ดแห่งที่ 2", eudrStatus: "SBP / ENplus Certified" },
        { lat: 7.2281, lng: 100.5925, placeName: "ท่าเรือน้ำลึกสงขลา (Songkhla Deep Sea Port)", plotId: "PORT-SK-01", areaRai: "จุดโหลดสินค้าขึ้นเรือส่งออก", eudrStatus: "Export Terminal" },
        { lat: 6.9145, lng: 100.7412, placeName: "ลานรวบรวมไม้ชีวมวล จะนะ สงขลา", plotId: "PLOT-SK-02", areaRai: "160 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 6.6412, lng: 100.4215, placeName: "แปลงไม้ยางและคลัง สะเดา สงขลา (ชายแดน)", plotId: "PLOT-SK-03", areaRai: "250 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 7.1345, lng: 100.2745, placeName: "แปลงสวนไม้ยาง รัตภูมิ สงขลา (Plot D4)", plotId: "PLOT-SK-04", areaRai: "340 ไร่", eudrStatus: "FSC-100% / EUDR Ready" },
        { lat: 6.9412, lng: 100.3812, placeName: "แปลงสวนยาง คลองหอยโข่ง สงขลา", plotId: "PLOT-SK-05", areaRai: "190 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 6.7412, lng: 100.7012, placeName: "แปลงสวนไม้ยาง นาทวี สงขลา", plotId: "PLOT-SK-06", areaRai: "275 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 7.7345, lng: 100.0125, placeName: "แปลงไม้ยางพารา ควนขนุน พัทลุง", plotId: "PLOT-PTL-01", areaRai: "210 ไร่", eudrStatus: "SBP / EUDR Verified" },
        { lat: 7.2845, lng: 100.0214, placeName: "แปลงสวนไม้ยาง ป่าบอน พัทลุง", plotId: "PLOT-PTL-02", areaRai: "260 ไร่", eudrStatus: "EUDR Certified / GGL" },

        // --- โซนกระบี่ & พังงา & ชุมพร & ระนอง ---
        { lat: 7.9412, lng: 99.1452, placeName: "แปลงสวนไม้ยาง คลองท่อม กระบี่", plotId: "PLOT-KB-01", areaRai: "320 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 8.3712, lng: 98.7345, placeName: "แปลงสวนยาง อ่าวลึก กระบี่", plotId: "PLOT-KB-02", areaRai: "230 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.8812, lng: 98.3712, placeName: "แปลงไม้ยาง ตะกั่วป่า พังงา", plotId: "PLOT-PNA-01", areaRai: "205 ไร่", eudrStatus: "FSC-100% / EUDR Ready" },
        { lat: 9.9412, lng: 99.0812, placeName: "แปลงไม้ยางพารา หลังสวน ชุมพร", plotId: "PLOT-CPN-01", areaRai: "410 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 9.7712, lng: 99.0912, placeName: "แปลงสวนยาง ละแม ชุมพร", plotId: "PLOT-CPN-02", areaRai: "290 ไร่", eudrStatus: "SBP / EUDR Verified" },
        { lat: 9.5812, lng: 98.5912, placeName: "แปลงไม้ยางพารา กะเปอร์ ระนอง", plotId: "PLOT-RN-01", areaRai: "180 ไร่", eudrStatus: "EUDR Certified" },

        // --- โซนสตูล และ 3 จังหวัดชายแดนใต้ (ยะลา, ปัตตานี, นราธิวาส) ---
        { lat: 6.8412, lng: 100.0712, placeName: "แปลงสวนยาง ควนกาหลง สตูล", plotId: "PLOT-STN-01", areaRai: "220 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 6.8812, lng: 99.7812, placeName: "แปลงไม้ยางพารา ละงู สตูล", plotId: "PLOT-STN-02", areaRai: "195 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 6.5412, lng: 101.2805, placeName: "แปลงสวนไม้ยางพารา เมืองยะลา (Plot E1)", plotId: "PLOT-YLA-01", areaRai: "310 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 5.7745, lng: 101.0712, placeName: "แปลงสวนยาง เบตง ยะลา (เขตภูเขาสูง)", plotId: "PLOT-YLA-02", areaRai: "380 ไร่", eudrStatus: "EUDR Certified / High Density" },
        { lat: 6.1712, lng: 101.1812, placeName: "แปลงไม้ยาง ธารโต ยะลา", plotId: "PLOT-YLA-03", areaRai: "165 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 6.7212, lng: 101.1214, placeName: "แปลงสวนยาง โคกโพธิ์ ปัตตานี", plotId: "PLOT-PTN-01", areaRai: "240 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 6.7012, lng: 101.6212, placeName: "ลานรับซื้อไม้ สายบุรี ปัตตานี", plotId: "PLOT-PTN-02", areaRai: "170 ไร่", eudrStatus: "SBP / EUDR Verified" },
        { lat: 6.3912, lng: 101.5212, placeName: "แปลงสวนไม้ยาง รือเสาะ นราธิวาส", plotId: "PLOT-NRT-01", areaRai: "285 ไร่", eudrStatus: "FSC-100% / EUDR Ready" },
        { lat: 6.0312, lng: 101.9712, placeName: "แปลงไม้ยาง สุไหงโก-ลก นราธิวาส", plotId: "PLOT-NRT-02", areaRai: "230 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 6.2912, lng: 101.7212, placeName: "แปลงสวนไม้ยาง ระแงะ นราธิวาส", plotId: "PLOT-NRT-03", areaRai: "310 ไร่", eudrStatus: "EUDR Certified / GGL" }
    ];

    // ตรวจสอบและกำหนด orderDate, shipmentDate และ location พิกัด GPS ให้ทุกรายการ
    baseOrders.forEach((o, i) => {
        if (!o.orderDate) {
            const m = String((i % 12) + 1).padStart(2, '0');
            o.orderDate = `2026-${m}-${String((i % 25) + 1).padStart(2, '0')}`;
        }
        if (!o.requestedDeliveryDate) {
            o.requestedDeliveryDate = o.orderDate;
        }

        // กำหนดพิกัด Geolocation สำหรับ EUDR และแผนที่
        const loc = mockLocations[i % mockLocations.length];
        o.location = {
            lat: loc.lat,
            lng: loc.lng,
            placeName: loc.placeName,
            plotId: `PLOT-EUDR-${202600 + i}`,
            areaRai: loc.areaRai,
            eudrStatus: loc.eudrStatus,
            googleMapsUrl: `https://www.google.com/maps?q=${loc.lat},${loc.lng}`
        };
    });

    return baseOrders;
}

// ฟังก์ชันสำหรับดึงข้อมูล
function loadDashboardData() {
    try {
        globalData = generateMockOrders();

        // คำนวณยอดรวมรายเดือน และรายปี (จำนวน Orders และ ปริมาณตัน)
        const currentYearStr = "2026";
        const currentMonthStr = "10"; // ตุลาคม

        let monthlyOrdersCount = 0;
        let monthlyTotalTon = 0;
        let yearlyOrdersCount = 0;
        let yearlyTotalTon = 0;

        globalData.forEach(item => {
            const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
            const qtyNum = parseInt(String(item.orderQuantity || "0").replace(/[^0-9]/g, '')) || 0;

            if (d.startsWith(currentYearStr)) {
                yearlyOrdersCount += 1;
                yearlyTotalTon += qtyNum;

                if (d.startsWith(`${currentYearStr}-${currentMonthStr}`)) {
                    monthlyOrdersCount += 1;
                    monthlyTotalTon += qtyNum;
                }
            }
        });

        globalSummary = {
            activeOrders: globalData.length,
            activeOrdersTrend: "+15% จากเดือนที่แล้ว",
            monthlyOrders: monthlyOrdersCount || 8,
            monthlyTons: (monthlyTotalTon || 125000).toLocaleString(),
            yearlyOrders: yearlyOrdersCount || globalData.length,
            yearlyTons: (yearlyTotalTon || 485000).toLocaleString(),
            currentYear: currentYearStr,
            currentMonthName: "ต.ค.",
            productionProgress: 68.5,
            pendingShipments: globalData.filter(x => x.currentStep < 7).length,
            pendingShipmentsNote: "กำหนดส่งภายในเดือนนี้",
            qualityDeviations: 0,
            avgMoisture: "7.2%",
            totalDowntimeMins: 4000,
            closingStockTotal: "3,500 Ton"
        };

        renderDashboard(globalData);
    } catch (error) {
        console.error("Failed to load dashboard data:", error);
    }
}

// ทำงานเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์ (jQuery Document Ready)
$(document).ready(function () {
    loadDashboardData();
});