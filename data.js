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
            certRequirement: "SBP, GGL",
            customerReq: "100% Rubberwood, Pellet Diameter 6.0mm, Moisture ≤8.0%, Ash ≤1.5%, Durability ≥97.5%",
            specialReq: "Must comply with GGL & SBP sustainability standards with full Certificate of Analysis (CoA) attached.",
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
                specReq: "GGL & SBP Certified Biomass Specification, Moisture ≤8.0%, Ash ≤1.5%, Durability ≥97.5%",
                labelReq: "SBP / GGL QR-Code Barcode Label (100x150 mm) containing PO No., Batch No., CoA URL",
                packagingReq: "1,000 kg Jumbo Big Bags with moisture-proof liner / Bulk Vessel Hold",
                customerRegulatory: "GGL & SBP Biomass Sustainability Certification, EU Deforestation Regulation (EUDR 2023/1115)",
                transportExpiry: "2027-03-31",
                valid: "Valid: 2028-12"
            },
            step3: { 
                name: "Production Woods material planning", 
                planned: 20000, 
                actual: 15000, 
                unit: "Ton", 
                startDate: "2026/10/12",
                finishDate: "2026/10/02", rawLogTon: 12000, rawSlabTon: 5000, rawSawdustTon: 3000,
                status: "In Progress" 
            },
            step4_pelletizing: {
                yield: "90,000 Ton",
                totalDowntimeMins: 40,
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
            certRequirement: "SBP, GGL",
            customerReq: "Strict ash content < 0.5% with high calorific value > 4.6 kWh/kg",
            specialReq: "COA with SBP & GGL sustainability verification",
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
                specReq: "SBP & GGL Biomass Standard",
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
                specification: "SBP / GGL Biomass Standard",
                testParameter: "Calorific Value & Ash Content verification",
                analyst: "NL-4088 (Prasert M.)",
                coaFile: "COA-202610-SBP-01129.pdf",
                coaUrl: "https://dms.company.com/verify/COA-202610-SBP-01129",
                deviation: "None",
                qcReport: "QCR-20261001-SBP-02"
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
            certRequirement: "SBP",
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
            certRequirement: "GGL, SBP",
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
            certRequirement: "SBP",
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
            productName: "Bio-Fuel Pellets (SBP / GGL Grade)",
            productCode: "PRD-88205-A1",
            productType: "1-0.6mm",
            orderQuantity: "30,000 Ton",
            certRequirement: "SBP, GGL",
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
            certRequirement: "GGL",
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
            certRequirement: "SBP, GGL",
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
            certRequirement: "GGL",
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
            certRequirement: "SBP, GGL",
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

    // เพิ่มรายการคำสั่งซื้อจำลองให้ครบ 68 รายการ (Base Orders 10 + Additional 58 = 68 รายการ) เพื่อแสดงข้อมูลและจุดพิกัดทั่วภาคใต้
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
        { no: "ORD-04206", mo: "MO-672649899", po: "PO-2026-09880", cust: "Shikoku Bio Generation", dest: "TAKAMATSU, JAPAN", step: 4, q: "21,500 Ton", line: "MOL", etd: "24/10/26", eta: "03/11/26", stat: "In Production" },
        { no: "ORD-04207", mo: "MO-672649900", po: "PO-2026-09895", cust: "Baltic Green Energy Sp.", dest: "GDANSK, POLAND", step: 6, q: "24,000 Ton", line: "MSC", etd: "18/10/26", eta: "15/11/26", stat: "On Schedule" },
        { no: "ORD-04208", mo: "MO-672649901", po: "PO-2026-09910", cust: "Humber Bio-Thermal UK", dest: "HULL, UNITED KINGDOM", step: 7, q: "33,000 Ton", line: "Maersk", etd: "12/10/26", eta: "08/11/26", stat: "On Schedule" },
        { no: "ORD-04209", mo: "MO-672649902", po: "PO-2026-09925", cust: "Niigata Clean Power Co.", dest: "NIIGATA, JAPAN", step: 5, q: "19,500 Ton", line: "NYK Line", etd: "20/10/26", eta: "29/10/26", stat: "On Schedule" },
        { no: "ORD-04210", mo: "MO-672649903", po: "PO-2026-09940", cust: "Adriatic Eco Fuels Srl", dest: "TRIESTE, ITALY", step: 3, q: "21,000 Ton", line: "CMA CGM", etd: "26/10/26", eta: "19/11/26", stat: "In Production" },
        { no: "ORD-04211", mo: "MO-672649904", po: "PO-2026-09955", cust: "Gwangyang Bio Utility", dest: "GWANGYANG, SOUTH KOREA", step: 8, q: "28,500 Ton", line: "HMM", etd: "09/10/26", eta: "17/10/26", stat: "On Schedule" },
        { no: "ORD-04212", mo: "MO-672649905", po: "PO-2026-09970", cust: "Gothenburg District Heat", dest: "GOTHENBURG, SWEDEN", step: 4, q: "26,500 Ton", line: "Hapag-Lloyd", etd: "24/10/26", eta: "18/11/26", stat: "In Production" },
        { no: "ORD-04213", mo: "MO-672649906", po: "PO-2026-09985", cust: "Chiba Bay Biomass Corp.", dest: "CHIBA, JAPAN", step: 6, q: "30,000 Ton", line: "ONE Line", etd: "17/10/26", eta: "26/10/26", stat: "On Schedule" },
        { no: "ORD-04214", mo: "MO-672649907", po: "PO-2026-10000", cust: "Rayong Cogeneration PLC", dest: "ระยอง, ประเทศไทย", step: 8, q: "11,000 Ton", line: "Inland Logistics", etd: "08/10/26", eta: "09/10/26", stat: "On Schedule" },
        { no: "ORD-04215", mo: "MO-672649908", po: "PO-2026-10015", cust: "Bilbao Renewable Iberica", dest: "BILBAO, SPAIN", step: 2, q: "17,500 Ton", line: "MSC", etd: "29/10/26", eta: "22/11/26", stat: "In Production" },
        { no: "ORD-04216", mo: "MO-672649909", po: "PO-2026-10030", cust: "Taichung Green Thermal", dest: "TAICHUNG, TAIWAN", step: 5, q: "15,500 Ton", line: "Evergreen", etd: "19/10/26", eta: "25/10/26", stat: "On Schedule" },
        { no: "ORD-04217", mo: "MO-672649910", po: "PO-2026-10045", cust: "Bremerhaven BioKraft GmbH", dest: "BREMERHAVEN, GERMANY", step: 7, q: "34,000 Ton", line: "Hapag-Lloyd", etd: "13/10/26", eta: "09/11/26", stat: "On Schedule" },
        { no: "ORD-04218", mo: "MO-672649911", po: "PO-2026-10060", cust: "Kitakyushu Eco Station", dest: "KITAKYUSHU, JAPAN", step: 4, q: "22,000 Ton", line: "MOL", etd: "23/10/26", eta: "31/10/26", stat: "In Production" },
        { no: "ORD-04219", mo: "MO-672649912", po: "PO-2026-10075", cust: "Zeebrugge Biomass NV", dest: "ZEEBRUGGE, BELGIUM", step: 1, q: "19,000 Ton", line: "CMA CGM", etd: "04/11/26", eta: "27/11/26", stat: "In Production" },
        { no: "ORD-04220", mo: "MO-672649913", po: "PO-2026-10090", cust: "Dangjin Eco Energy Co.", dest: "DANGJIN, SOUTH KOREA", step: 6, q: "27,500 Ton", line: "Pan Ocean", etd: "18/10/26", eta: "26/10/26", stat: "On Schedule" },
        { no: "ORD-04221", mo: "MO-672649914", po: "PO-2026-10105", cust: "Toyama Hokuriku Power", dest: "TOYAMA, JAPAN", step: 5, q: "16,500 Ton", line: "K-Line", etd: "20/10/26", eta: "29/10/26", stat: "On Schedule" },
        { no: "ORD-04222", mo: "MO-672649915", po: "PO-2026-10120", cust: "Le Havre Bio Terminal", dest: "LE HAVRE, FRANCE", step: 3, q: "23,500 Ton", line: "CMA CGM", etd: "27/10/26", eta: "20/11/26", stat: "In Production" },
        { no: "ORD-04223", mo: "MO-672649916", po: "PO-2026-10135", cust: "Ayutthaya Clean Steam", dest: "พระนครศรีอยุธยา, ประเทศไทย", step: 7, q: "9,500 Ton", line: "Inland Logistics", etd: "14/10/26", eta: "15/10/26", stat: "On Schedule" },
        { no: "ORD-04224", mo: "MO-672649917", po: "PO-2026-10150", cust: "Esbjerg Nordic Bio A/S", dest: "ESBJERG, DENMARK", step: 6, q: "25,500 Ton", line: "Maersk", etd: "17/10/26", eta: "11/11/26", stat: "On Schedule" },
        { no: "ORD-04225", mo: "MO-672649918", po: "PO-2026-10165", cust: "Muroran North Biomass", dest: "MURORAN, JAPAN", step: 4, q: "20,500 Ton", line: "NYK Line", etd: "25/10/26", eta: "04/11/26", stat: "In Production" },
        { no: "ORD-04226", mo: "MO-672649919", po: "PO-2026-10180", cust: "Eemshaven Green Grid BV", dest: "EEMSHAVEN, NETHERLANDS", step: 8, q: "38,000 Ton", line: "Maersk", etd: "07/10/26", eta: "01/11/26", stat: "On Schedule" }
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
            certRequirement: ["SBP, GGL", "GGL, SBP", "SBP", "GGL"][index % 4],
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

    // คลังพิกัดจำลองของแปลงสวนไม้ยางพารา โรงงาน และท่าเรือทั่วภาคใต้ 68 จุดจริง (EUDR Geolocation Supply Chain)
    const mockLocations = [
        // --- โซนสุราษฎร์ธานี (แหล่งป่ายางพาราและชีวมวลหลัก) ---
        { lat: 9.1382, lng: 99.3217, placeName: "แปลงสวนไม้ยางพารา พุนพิน สุราษฎร์ธานี (Plot A1)", plotId: "PLOT-SR-01", areaRai: "350 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 8.7958, lng: 99.3642, placeName: "แปลงไม้ยางพารา บ้านนาสาร สุราษฎร์ธานี (Plot A2)", plotId: "PLOT-SR-02", areaRai: "280 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 8.6367, lng: 99.3512, placeName: "แปลงสวนไม้ยางพารา เวียงสระ สุราษฎร์ธานี (Plot A3)", plotId: "PLOT-SR-03", areaRai: "420 ไร่", eudrStatus: "EUDR Verified & Due Diligence Pass" },
        { lat: 9.2612, lng: 99.1982, placeName: "แปลงไม้ยางพารา ท่าฉาง สุราษฎร์ธานี (Plot A4)", plotId: "PLOT-SR-04", areaRai: "190 ไร่", eudrStatus: "SBP / EUDR Certified" },
        { lat: 9.1652, lng: 99.4718, placeName: "ลานรับซื้อไม้ยาง กาญจนดิษฐ์ สุราษฎร์ธานี", plotId: "PLOT-SR-05", areaRai: "ลานรับซื้อไม้ชีวมวล", eudrStatus: "SBP & GGL / EUDR Verified" },
        { lat: 8.8415, lng: 99.1892, placeName: "แปลงไม้ยางพารา เคียนซา สุราษฎร์ธานี (Plot A6)", plotId: "PLOT-SR-06", areaRai: "310 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 8.5521, lng: 99.0345, placeName: "แปลงสวนยาง พระแสง สุราษฎร์ธานี (Plot A7)", plotId: "PLOT-SR-07", areaRai: "260 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 9.3142, lng: 99.6912, placeName: "ท่าเรือเฟอร์รี่และลานไม้ ดอนสัก สุราษฎร์ธานี", plotId: "PORT-DS-01", areaRai: "จุดโหลดทางน้ำ", eudrStatus: "Export Terminal" },

        // --- โซนนครศรีธรรมราช (ศูนย์กลางไม้ยางพาราภาคใต้ตอนกลาง) ---
        { lat: 8.1645, lng: 99.6804, placeName: "ศูนย์รวบรวมไม้ยาง ทุ่งสง นครศรีธรรมราช", plotId: "PLOT-NST-01", areaRai: "ศูนย์คัดแยกไม้", eudrStatus: "EUDR Certified / SBP" },
        { lat: 8.4304, lng: 99.9631, placeName: "แปลงสวนไม้ยาง เมืองนครศรีธรรมราช (Plot C2)", plotId: "PLOT-NST-02", areaRai: "320 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 7.9741, lng: 100.0012, placeName: "แปลงไม้ยาง ชะอวด นครศรีธรรมราช (Plot C3)", plotId: "PLOT-NST-03", areaRai: "210 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.3412, lng: 99.7825, placeName: "แปลงสวนยางเชิงเขา ลานสกา นครศรีธรรมราช", plotId: "PLOT-NST-04", areaRai: "185 ไร่", eudrStatus: "SBP / EUDR Verified" },
        { lat: 8.4215, lng: 99.5014, placeName: "แปลงไม้ยาง ฉวาง นครศรีธรรมราช (Plot C5)", plotId: "PLOT-NST-05", areaRai: "290 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 8.6652, lng: 99.9234, placeName: "แปลงสวนยาง ท่าศาลา นครศรีธรรมราช (Plot C6)", plotId: "PLOT-NST-06", areaRai: "240 ไร่", eudrStatus: "GGL / EUDR Ready" },
        { lat: 9.0045, lng: 99.9015, placeName: "แปลงไม้ยาง สิชล นครศรีธรรมราช (Plot C7)", plotId: "PLOT-NST-07", areaRai: "330 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.1812, lng: 99.8541, placeName: "แปลงสวนยาง ร่อนพิบูลย์ นครศรีธรรมราช", plotId: "PLOT-NST-08", areaRai: "195 ไร่", eudrStatus: "GGL / EUDR Certified" },

        // --- โซนตรัง (เมืองหลวงยางพาราไทย) ---
        { lat: 7.5563, lng: 99.6114, placeName: "แปลงปลูกไม้ยางพารา เมืองตรัง (Plot B1)", plotId: "PLOT-TR-01", areaRai: "280 ไร่", eudrStatus: "EUDR Verified & Due Diligence Pass" },
        { lat: 7.7892, lng: 99.5512, placeName: "แปลงสวนไม้ยาง ห้วยยอด ตรัง (Plot B2)", plotId: "PLOT-TR-02", areaRai: "360 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 7.4112, lng: 99.5124, placeName: "ลานรับซื้อไม้และท่าเรือ กันตัง ตรัง", plotId: "PORT-KT-01", areaRai: "ลานโหลดไม้ชายฝั่งอันดามัน", eudrStatus: "Coastal Transfer Terminal" },
        { lat: 7.3412, lng: 99.8512, placeName: "แปลงสวนยาง ปะเหลียน ตรัง (Plot B4)", plotId: "PLOT-TR-04", areaRai: "220 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 7.3912, lng: 99.6712, placeName: "แปลงสวนไม้ยาง ย่านตาขาว ตรัง (Plot B5)", plotId: "PLOT-TR-05", areaRai: "175 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 7.7124, lng: 99.3512, placeName: "แปลงไม้ยางพารา วังวิเศษ ตรัง (Plot B6)", plotId: "PLOT-TR-06", areaRai: "310 ไร่", eudrStatus: "SBP / EUDR Certified" },

        // --- โซนสงขลา & พัทลุง (โรงงาน Green River HQ และท่าเรือส่งออกหลัก) ---
        { lat: 7.0089, lng: 100.4767, placeName: "โรงงาน Green River Panels หาดใหญ่ HQ", plotId: "FAC-GRP-01", areaRai: "โรงงานแปรรูปหลัก", eudrStatus: "SBP & GGL Certified" },
        { lat: 7.0845, lng: 100.4125, placeName: "โรงงานแปรรูปชีวมวล บางกล่ำ สงขลา", plotId: "FAC-GRP-02", areaRai: "โรงงานอัดเม็ดแห่งที่ 2", eudrStatus: "GGL & SBP Certified" },
        { lat: 7.2281, lng: 100.5925, placeName: "ท่าเรือน้ำลึกสงขลา (Songkhla Deep Sea Port)", plotId: "PORT-SK-01", areaRai: "จุดโหลดสินค้าขึ้นเรือส่งออก", eudrStatus: "Export Terminal" },
        { lat: 6.9145, lng: 100.7412, placeName: "ลานรวบรวมไม้ชีวมวล จะนะ สงขลา", plotId: "PLOT-SK-02", areaRai: "160 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 6.6412, lng: 100.4215, placeName: "แปลงไม้ยางและคลัง สะเดา สงขลา (ชายแดน)", plotId: "PLOT-SK-03", areaRai: "250 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 7.1345, lng: 100.2745, placeName: "แปลงสวนไม้ยาง รัตภูมิ สงขลา (Plot D4)", plotId: "PLOT-SK-04", areaRai: "340 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 6.9412, lng: 100.3812, placeName: "แปลงสวนยาง คลองหอยโข่ง สงขลา", plotId: "PLOT-SK-05", areaRai: "190 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 6.7412, lng: 100.7012, placeName: "แปลงสวนไม้ยาง นาทวี สงขลา", plotId: "PLOT-SK-06", areaRai: "275 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 7.7345, lng: 100.0125, placeName: "แปลงไม้ยางพารา ควนขนุน พัทลุง", plotId: "PLOT-PTL-01", areaRai: "210 ไร่", eudrStatus: "SBP / EUDR Verified" },
        { lat: 7.2845, lng: 100.0214, placeName: "แปลงสวนไม้ยาง ป่าบอน พัทลุง", plotId: "PLOT-PTL-02", areaRai: "260 ไร่", eudrStatus: "EUDR Certified / GGL" },

        // --- โซนกระบี่ & พังงา & ชุมพร & ระนอง ---
        { lat: 7.9412, lng: 99.1452, placeName: "แปลงสวนไม้ยาง คลองท่อม กระบี่", plotId: "PLOT-KB-01", areaRai: "320 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 8.3712, lng: 98.7345, placeName: "แปลงสวนยาง อ่าวลึก กระบี่", plotId: "PLOT-KB-02", areaRai: "230 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.8812, lng: 98.3712, placeName: "แปลงไม้ยาง ตะกั่วป่า พังงา", plotId: "PLOT-PNA-01", areaRai: "205 ไร่", eudrStatus: "GGL / EUDR Verified" },
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
        { lat: 6.3912, lng: 101.5212, placeName: "แปลงสวนไม้ยาง รือเสาะ นราธิวาส", plotId: "PLOT-NRT-01", areaRai: "285 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 6.0312, lng: 101.9712, placeName: "แปลงไม้ยาง สุไหงโก-ลก นราธิวาส", plotId: "PLOT-NRT-02", areaRai: "230 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 6.2912, lng: 101.7212, placeName: "แปลงสวนไม้ยาง ระแงะ นราธิวาส", plotId: "PLOT-NRT-03", areaRai: "310 ไร่", eudrStatus: "EUDR Certified / GGL" },
        { lat: 8.9124, lng: 98.8852, placeName: "แปลงสวนไม้ยาง บ้านตาขุน สุราษฎร์ธานี", plotId: "PLOT-SR-08", areaRai: "270 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 8.8542, lng: 98.8115, placeName: "แปลงไม้ยางพารา พนม สุราษฎร์ธานี", plotId: "PLOT-SR-09", areaRai: "245 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 8.4612, lng: 99.0754, placeName: "แปลงสวนยาง ชัยบุรี สุราษฎร์ธานี", plotId: "PLOT-SR-10", areaRai: "315 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.5814, lng: 99.6412, placeName: "แปลงสวนไม้ยาง พิปูน นครศรีธรรมราช", plotId: "PLOT-NST-09", areaRai: "230 ไร่", eudrStatus: "SBP / EUDR Certified" },
        { lat: 8.2564, lng: 99.5842, placeName: "แปลงไม้ยางพารา นาบอน นครศรีธรรมราช", plotId: "PLOT-NST-10", areaRai: "390 ไร่", eudrStatus: "EUDR Certified / GGL" },
        { lat: 8.0345, lng: 99.4812, placeName: "แปลงสวนยาง บางขัน นครศรีธรรมราช", plotId: "PLOT-NST-11", areaRai: "265 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.2945, lng: 99.3624, placeName: "แปลงไม้ยางพารา ทุ่งใหญ่ นครศรีธรรมราช", plotId: "PLOT-NST-12", areaRai: "340 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 7.9685, lng: 99.6542, placeName: "แปลงสวนไม้ยาง รัษฎา ตรัง", plotId: "PLOT-TR-07", areaRai: "255 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 7.5612, lng: 99.7545, placeName: "แปลงสวนยางเชิงเขา นาโยง ตรัง", plotId: "PLOT-TR-08", areaRai: "210 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 7.5742, lng: 99.3845, placeName: "แปลงไม้ยางพารา สิเกา ตรัง", plotId: "PLOT-TR-09", areaRai: "285 ไร่", eudrStatus: "GGL / EUDR Certified" },
        { lat: 7.4125, lng: 99.9412, placeName: "แปลงสวนไม้ยาง กงหรา พัทลุง", plotId: "PLOT-PTL-03", areaRai: "225 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 7.6945, lng: 99.8812, placeName: "แปลงสวนยาง ศรีบรรพต พัทลุง", plotId: "PLOT-PTL-04", areaRai: "195 ไร่", eudrStatus: "SBP / EUDR Verified" },
        { lat: 6.6185, lng: 100.9512, placeName: "แปลงไม้ยางพารา สะบ้าย้อย สงขลา", plotId: "PLOT-SK-07", areaRai: "305 ไร่", eudrStatus: "EUDR Certified" },
        { lat: 6.7845, lng: 100.9112, placeName: "ลานรวบรวมไม้ยาง เทพา สงขลา", plotId: "PLOT-SK-08", areaRai: "240 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 8.5312, lng: 98.8645, placeName: "แปลงสวนไม้ยาง ปลายพระยา กระบี่", plotId: "PLOT-KB-03", areaRai: "330 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 8.2615, lng: 99.0485, placeName: "แปลงสวนยาง เขาพนม กระบี่", plotId: "PLOT-KB-04", areaRai: "275 ไร่", eudrStatus: "EUDR Verified" },
        { lat: 8.4512, lng: 98.3125, placeName: "แปลงไม้ยางพารา ท้ายเหมือง พังงา", plotId: "PLOT-PNA-02", areaRai: "215 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 10.6542, lng: 99.1412, placeName: "แปลงสวนไม้ยาง ท่าแซะ ชุมพร", plotId: "PLOT-CPN-03", areaRai: "360 ไร่", eudrStatus: "EUDR Certified / SBP" },
        { lat: 10.2312, lng: 99.0845, placeName: "แปลงไม้ยางพารา สวี ชุมพร", plotId: "PLOT-CPN-04", areaRai: "295 ไร่", eudrStatus: "GGL / EUDR Verified" },
        { lat: 8.3742, lng: 99.5685, placeName: "แปลงสวนไม้ยาง ช้างกลาง นครศรีธรรมราช", plotId: "PLOT-NST-13", areaRai: "260 ไร่", eudrStatus: "EUDR Certified / SBP" }
    ];

    // ตรวจสอบและกำหนด orderDate, shipmentDate และ location พิกัด GPS ให้ทุกรายการ
    baseOrders.forEach((o, i) => {
        let yr = "2026";
        if (i % 7 === 1) yr = "2027";
        else if (i % 7 === 2) yr = "2028";
        else if (i % 7 === 3) yr = "2025";

        const m = String((i % 12) + 1).padStart(2, '0');
        const day = String((i % 25) + 1).padStart(2, '0');
        o.orderDate = `${yr}-${m}-${day}`;
        o.requestedDeliveryDate = `${yr}-${m}-${day}`;
        if (!o.step6) o.step6 = {};
        o.step6.etd = `${yr}/${m}/${day}`;

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

        // --- เพิ่มข้อมูลตามสเปกทางการล่าสุด (BPM Full 8-Step Lifecycle Specification) ---
        // Header Fields
        o.applicationNo = o.applicationNo || `APP-2026-${String(9820 + i)}`;
        o.applicationDate = o.orderDate || "2026/09/28";
        o.applicant = o.applicant || "Sompong K. (Operations Coordinator)";
        o.applicantDept = o.applicantDept || "Operations Department";
        o.requestor = o.requestor || "Natrutdin Y. (Regional Sales Director)";
        o.requestorDept = o.requestorDept || "Sales & Supply Chain";
        o.company = o.company || "Green River Panels (Thailand) Co., Ltd.";
        o.importance = o.importance || "Normal";
        o.justification = o.justification || "Export contract fulfilment and scheduled biomass dispatch";

        // Step 1: Sale Department & Planning
        o.customerCode = o.customerCode || `0${2540 + (i % 20)}`;
        o.fromCountry = o.fromCountry || (i % 3 === 0 ? "US" : (i % 3 === 1 ? "JP" : "NL"));
        o.address = o.address || "99/1 Moo 2, Asian Highway 2, Hat Yai, Songkhla 90110";
        o.contactPerson = o.contactPerson || "Mr. Thomason / International Trading Lead";
        o.emailTel = o.emailTel || "sales@greenriverholding.com / +66 74 890 123";
        o.customerPoNo = o.customerPoNo || o.poNo || `PO-ABC-2026-00${(i % 9) + 1}`;
        o.piNo = o.piNo || `PO-ABC-2026-00${(i % 9) + 1}`;
        o.productCode = o.productCode || (i % 2 === 0 ? "WP-001" : "WP-002");
        o.productName = o.productName || "Wood Pellets (Bio-Fuel)";
        o.productType = o.productType || "1. 0.6mm±1mm, 2. 0.8mm±1mm";
        o.shipToLocation = o.shipToLocation || o.destination || "Port of Japan";
        o.deliveryDateReq = o.requestedDeliveryDate;
        o.deliveryDateTarget = o.deliveryDateTarget || o.requestedDeliveryDate;
        o.certRequirement = o.certRequirement || "SBP, GGL";
        o.otherCertificate = o.otherCertificate || "-";
        o.customerReq = o.customerReq || "Rubberwood, Pellet Diameter 0.6mm±1mm, Moisture ≤10%, Ash ≤3%, Calorie ≥4,000 kcal/kg, Density ≥600 kg/m³, Fines ≤1%, Bulk Shipment, COA, Inspection";
        o.specialReq = o.specialReq || "ต้องแจ้งลูกค้าหากคุณภาพของสินค้าไม่เป็นไปตามข้อกำหนด, Moisture ≤8%, ตรวจทุก Batch, ส่ง COA ก่อนโหลด, Weather Protection";

        // Planning
        o.planPiNo = o.piNo;
        o.planMoNo = o.moNo || `MP202600${String(10 + (i % 90))}`;
        o.planDateStart = o.planStartDate || "2026/09/28";
        o.planDateFinish = o.planEndDate || "2026/09/30";
        o.planBatchNo = o.planBatchNo || `SBP-xx-YY-02-${String(3000 + i)}`;
        o.planProdDesc = o.planProdDesc || "Rubber wood pellets";
        o.planCertScheme = o.planCertScheme || o.certRequirement || "SBP, GGL";
        o.planProductCode = o.planProductCode || "Bwp.12-08";
        o.planVolume = o.planVolume || o.orderQuantity || "5,000 MT";

        // Step 2: RA Regulatory & Requirements
        o.step2 = Object.assign({
            name: "Regulatory (RA)",
            status: "APPROVED",
            regCertStatus: "APPROVED & VALID (Valid through 2028-12-31)",
            certStatus: "APPROVED & VALID (Valid through 2028-12-31)",
            licenseExpiry: "2027-09-30 (Active until late next year)",
            specReq: "GGL & SBP Sustainability Biomass Standard, Pellet Moisture ≤8.0%, Ash ≤1.5%, Mechanical Durability ≥97.5%.",
            labelReq: "SBP / GGL QR-Code Barcode Label (100x150 mm) containing PO No., Batch No., GGL/SBP Claim, and Direct CoA Download link.",
            packagingReq: "1,000 kg Jumbo Big Bags with moisture-proof liner (ISPM-15 palletized where required) or Clean Dry Bulk Vessel Hold.",
            customerRegulatory: "GGL (Green Gold Label) & SBP (Sustainable Biomass Program) Certification, EU Deforestation Regulation (EUDR 2023/1115) Geolocation Verified.",
            transportExpiry: "2027-03-31 (Active transport permit; renewal required 30 days prior to expiration)",
            infoSupplier: "As Attachment (Verified Supplier Dossier)"
        }, o.step2 || {});

        // Step 3: Production Woods Material Planning & Factory Execution
        o.step3 = Object.assign({
            name: "Production Woods material planning",
            planned: parseInt(String(o.orderQuantity || "5000").replace(/[^0-9]/g, '')) || 20000,
            actual: Math.round((parseInt(String(o.orderQuantity || "5000").replace(/[^0-9]/g, '')) || 20000) * 0.82),
            unit: "Ton",
            yield: "90,000 Ton",
            totalUptime: "5760 mins.",
            totalDowntime: "40 mins.",
            startDate: o.planDateStart,
            startTime: "02:00",
            finishDate: o.planDateFinish,
            finishTime: "07:00",
            materialCode: "BWP-11-08 / BWP-12-08",
            plantSupervisor: "Operations Lead",
            rawLogTon: Math.round(((o.step3 && Number(o.step3.planned)) || parseInt(String(o.orderQuantity || "5000").replace(/[^0-9]/g, '')) || 20000) * ([0.50, 0.52, 0.48, 0.53, 0.47][i % 5])),
            rawSlabTon: Math.round(((o.step3 && Number(o.step3.planned)) || parseInt(String(o.orderQuantity || "5000").replace(/[^0-9]/g, '')) || 20000) * ([0.30, 0.28, 0.32, 0.29, 0.31][i % 5])),
            rawSawdustTon: Math.round(((o.step3 && Number(o.step3.planned)) || parseInt(String(o.orderQuantity || "5000").replace(/[^0-9]/g, '')) || 20000) * ([0.20, 0.20, 0.20, 0.18, 0.22][i % 5])),
            rawMaterialReq: "Log amount: 12,000 Ton | Slab amount: 5,000 Ton | Sawdust amount: 3,000 Ton",
            productionIssue: "It couldn’t be pressed into solid bar because raw materials were too dry (moisture adjusted).",
            fac1StatusUtil: "Downtime: 40 mins | Cause: Raw material dry | Fuels: 1,200 L | Electricity: 85,000 kWh",
            fac2StatusUtil: "Downtime: 0 mins | Cause: None | Fuels: 950 L | Electricity: 78,000 kWh",
            feedLines: ["Hammer mill", "Flaker 3", "Flaker 4"]
        }, o.step3 || {});
        o.step3.prod_raw_log_ton = Number(o.step3.rawLogTon) || 0;
        o.step3.prod_raw_slab_ton = Number(o.step3.rawSlabTon) || 0;
        o.step3.prod_raw_sawdust_ton = Number(o.step3.rawSawdustTon) || 0;
        o.step3.rawMaterialReq = `Log: ${o.step3.prod_raw_log_ton.toLocaleString()} Ton | Slab: ${o.step3.prod_raw_slab_ton.toLocaleString()} Ton | Sawdust: ${o.step3.prod_raw_sawdust_ton.toLocaleString()} Ton`;
        o.step3.prod_yield_ton = Number(o.step3.prod_yield_ton) || Math.round((Number(o.step3.actual) || 15000) * 0.95);
        o.step3.prod_uptime_mins = Number(o.step3.prod_uptime_mins) || (5760 - (i % 5) * 60);
        o.step3.prod_downtime_mins = Number(o.step3.prod_downtime_mins ?? o.step4_pelletizing?.totalDowntimeMins ?? [40, 120, 65, 35, 80][i % 5]);
        o.step3.yield = `${o.step3.prod_yield_ton.toLocaleString()} Ton`;
        o.step3.totalUptime = `${o.step3.prod_uptime_mins.toLocaleString()} mins`;
        o.step3.totalDowntime = `${o.step3.prod_downtime_mins.toLocaleString()} mins`;

        // Step 4: QC In-line 5 Checkpoints
        o.step4_qc = {
            batchNo: o.step3.batchNo || "1-4",
            testDate: o.step3.finishDate || "2026/10/10",
            paramLogsSlab: "Cleanliness (%): Refer wood spec | Moisture content (≤ 70%): 60%",
            paramSawdust: "Moisture content (≤ 60%): 64%",
            paramChipper: "Moisture content (≤ 60%): 64%",
            paramAfterDryer: "Moisture content (≤12 - 14 %): 14%",
            paramAfterMagnetic: "Diameter and length: Verified | Moisture content (≤12 - 14 %): 14%",
            qc_logs_slab_cleanliness: "Refer wood spec (Verified)",
            qc_logs_slab_moisture_pct: [60.0, 59.5, 61.0, 58.5, 60.5][i % 5],
            qc_sawdust_moisture_pct: [58.0, 57.5, 59.0, 56.5, 58.5][i % 5],
            qc_chipper_moisture_pct: [58.0, 57.0, 58.5, 56.0, 57.5][i % 5],
            qc_after_dryer_moisture_pct: [13.5, 13.2, 13.8, 12.9, 13.4][i % 5],
            qc_after_mag_moisture_pct: [13.0, 12.8, 13.2, 12.5, 12.9][i % 5],
            qc_after_mag_dim_check: "Diameter and length: Verified",
            status: "5 Checkpoints In-Line Verified (Zero Dev)"
        };

        // Step 5: QA Laboratory Results & Final COA
        o.step5_qa = {
            testDate: o.step3.finishDate || "2026/10/10",
            sawdustMoisture: "Moisture: 47%",
            paramChipper: "Chips length (30±10): 30 mm | width (25±5): 25.5 mm | Thickness (≤8): 8 mm",
            paramHammerMill: "Length (25±15): 30 mm | width (25±5): 25.5 mm | Thickness (≤8): 8 mm",
            paramMagneticPellets: "Diameter (8±1 mm): 8 mm | Length (25±15mm): 26 mm | Moisture (<10%): 7% | Bulk density (>600kg/m3): 600 kg/m3 | Fines below (>1.0%): 1.0% | Ash content (<2%): 1.5% | Mechanical durability (>97.5%): 97.5%",
            nonCompliance: "GGL, SBP (None - Fully Compliant)",
            bulkWarehouses: "Moisture content (20±10%): 27% | Bulk density (>600kg/m3): 650 | Fines below (> 1.0): 1.0%",
            coaReferenced: "COA: Customer’s requirements | Referenced TPC test report: TPC-2026-WP-098",
            analyst: "Somchai P. / Lead QC Inspector",
            qa_sawdust_moisture_pct: 47.0,
            qa_pellet_diameter_mm: (String(o.productType || "").includes("2-0.8") && !String(o.productType || "").includes("1-0.6")) ? 8.0 : 6.0,
            qa_pellet_length_mm: 26.0,
            qa_pellet_moisture_pct: parseFloat(String(o.step4_pelletizing?.pelletMoisture || "").replace(/[^0-9.]/g, '')) || [7.8, 7.1, 7.5, 7.9, 7.4][i % 5],
            qa_bulk_density_kgm3: [650.0, 660.0, 645.0, 655.0, 648.0][i % 5],
            qa_ash_pct: [1.5, 0.5, 1.4, 1.3, 1.2][i % 5],
            qa_fines_pct: [0.8, 0.6, 0.9, 0.7, 0.8][i % 5],
            qa_durability_pct: [97.8, 98.2, 97.6, 98.0, 97.9][i % 5],
            coaFile: `COA-202610-LF2-0${String(3918 + i)}.pdf`
        };

        // Step 6: Storage & Warehouse
        o.step6_storage = Object.assign({
            packingDailyReport: `PDR-202610-A0${(i % 5) + 1}`,
            packingDateStart: "2026-10-20",
            packingDateFinish: "2026-12-30",
            packingMtdQties: "4,850 MT",
            bigBagLabelNo: "factory 1 : BB-GRP1-2026-001 | factory 2 : BB-GRP2-2026-002",
            selectionDateFrom: "2026-10-20",
            selectionDateTo: "2026-12-30",
            material: "BWP-11-08 / BWP-12-08",
            storageLocation: (i % 2 === 0 ? "Warehouse 1" : "Warehouse 2"),
            openingStock: "1000 Ton (ยอดยกมา)",
            totalReceiptQties: "500 Ton (จำนวนที่รับเข้า)",
            totalIssueQties: "300 Ton (จำนวนที่จ่ายออก)",
            closingStock: "1200 Ton (สินค้าคงเหลือยกไป)",
            inventoryController: "Warehouse Manager"
        }, o.step5 || {});
        o.step6_storage.wh_storage_location = o.step6_storage.location || o.step6_storage.storageLocation || "Warehouse 1";
        o.step6_storage.wh_opening_stock = parseFloat(String(o.step6_storage.openingStock || "1000").replace(/[^0-9.]/g, '')) || 1000;
        o.step6_storage.wh_receipt_qty = parseFloat(String(o.step6_storage.totalReceiptQties || "500").replace(/[^0-9.]/g, '')) || 500;
        o.step6_storage.wh_issue_qty = parseFloat(String(o.step6_storage.issueQty || o.step6_storage.totalIssueQties || "300").replace(/[^0-9.]/g, '')) || 300;
        o.step6_storage.wh_closing_stock = parseFloat(String(o.step6_storage.closingStock || "").replace(/[^0-9.]/g, '')) || (o.step6_storage.wh_opening_stock + o.step6_storage.wh_receipt_qty - o.step6_storage.wh_issue_qty);

        // Step 7: RA Gather Info (Compliance Dossier Checklists)
        o.step7_ra_dossier = {
            gglFitFip: [
                { name: "Cover letter", checked: true },
                { name: "Transaction Statement", checked: true },
                { name: "Transaction Certificate from CU", checked: true },
                { name: "Transport Documents from Shipping", checked: true },
                { name: "Certificate of Cleanliness from Shipping", checked: true },
                { name: "GeoJSON", checked: true },
                { name: "Non Compliance Document : GGL, SBP", checked: true }
            ],
            gglSde: [
                { name: "Cover Letter", checked: true },
                { name: "Transaction Statement", checked: true },
                { name: "Transaction Certificate", checked: true },
                { name: "Transport Documents", checked: true },
                { name: "Certificate of Cleanliness", checked: true },
                { name: "EUDR Data Sheet", checked: true },
                { name: "GeoJSON (Refer Email)", checked: true }
            ],
            sbpEudr: [
                { name: "Refer 1. (PDF)", checked: true },
                { name: "EUDR Data Sheet", checked: true },
                { name: "GeoJSON (Refer Email)", checked: true }
            ]
        };

        // Step 8: Shipment & Shipping
        o.step8_shipping = Object.assign({
            saNumber: `SA-202610-0${String(3918 + i)}-SBP`,
            customerName: o.customer || "Bnbm company (ABC Biomass)",
            pod: o.destination || "ANTWERP (or Port of Japan)",
            shippingLine: o.step6?.shippingLine || (i % 2 === 0 ? "EVG" : "MAERSK"),
            bookingNo: o.step6?.bookingNo || "09050012456",
            transitTime: o.step6?.transitTime || "30 days",
            loadingDate: `${yr}/09/30`,
            finishedDate: `${yr}/07/09`,
            etd: o.step6?.etd || `${yr}/${m}/${day}`,
            eta: o.step6?.eta || `${yr}/${String(Math.min(12, parseInt(m) + 1)).padStart(2, '0')}/${day}`,
            atd: `${yr}/11/10`
        }, o.step6 || {});
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
        window.globalSummary = globalSummary;
        window.globalData = globalData;

        renderDashboard(globalData);
    } catch (error) {
        console.error("Failed to load dashboard data:", error);
    }
}

// ทำงานเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์ (jQuery Document Ready)
$(document).ready(function () {
    loadDashboardData();
});