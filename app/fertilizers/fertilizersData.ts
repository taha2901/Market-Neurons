import type { CountryRow, CropRow, Route, Stock } from "./types";

export const CHART_X_LABELS = ["Jun", "Aug", "Oct", "Dec", "2026", "Apr"];

/** Same length series as `fertilizers.html` line 1707 (truncates at 692). */
export const PRICE_DATA = [
  480, 472, 468, 461, 455, 448, 440, 432, 425, 418, 410, 400, 392, 383, 375, 368, 365, 367, 370, 375, 380, 388, 393, 400, 408, 415, 420, 428, 435, 442, 448, 455, 462, 468, 472, 478, 480, 475, 470, 465, 460, 456, 452, 448, 445, 442, 440, 438, 436, 433, 430, 428, 425, 422, 418, 415, 412, 410, 408, 406, 404, 402, 400, 398, 396, 394, 392, 390, 388, 386, 384, 382, 380, 379, 378, 377, 376, 375, 376, 377, 378, 380, 382, 385, 388, 390, 392, 395, 398, 400, 402, 404, 406, 408, 410, 408, 405, 402, 398, 395, 392, 388, 385, 382, 380, 378, 376, 375, 374, 373, 372, 371, 370, 370, 369, 368, 368, 367, 366, 365, 364, 362, 360, 358, 357, 356, 355, 354, 354, 353, 352, 351, 350, 350, 351, 352, 353, 355, 357, 360, 363, 367, 370, 374, 378, 383, 388, 394, 400, 408, 416, 424, 432, 440, 445, 448, 450, 452, 454, 456, 458, 460, 462, 455, 450, 445, 442, 440, 445, 452, 460, 468, 475, 480, 478, 475, 472, 470, 468, 465, 468, 472, 478, 485, 492, 500, 508, 516, 525, 535, 545, 555, 562, 568, 574, 580, 585, 590, 594, 598, 600, 598, 595, 598, 602, 605, 608, 615, 625, 635, 648, 660, 672, 682, 690, 700, 710, 718, 725, 720, 715, 710, 705, 700, 698, 695, 692,
];

export const ROWS_PER_PAGE = 10;

export const stocksData: Stock[] = [
  { symbol: "ABUK", price: 100, change: 5, mktCap: 100, ranking: 90, exposure: 60 },
  { symbol: "MPCO", price: 70, change: 1, mktCap: 150, ranking: 100, exposure: 50 },
  { symbol: "YAR", price: 20, change: 2, mktCap: 20, ranking: 70, exposure: 70 },
  { symbol: "2020", price: 30, change: -1, mktCap: 30, ranking: 60, exposure: 50 },
  { symbol: "CF", price: 28, change: -5, mktCap: 60, ranking: 20, exposure: 30 },
  { symbol: "ABUK", price: 100, change: 5, mktCap: 100, ranking: 90, exposure: 60 },
  { symbol: "MPCO", price: 70, change: 1, mktCap: 150, ranking: 100, exposure: 50 },
  { symbol: "YAR", price: 20, change: 2, mktCap: 20, ranking: 70, exposure: 70 },
];

export const cropData: CropRow[] = [
  {
    crop: "Wheat",
    consumption: 40,
    price: 300,
    change: 5,
    ureaRatio: 50,
    topConsumers: [
      { c: "Egypt", v: "20" },
      { c: "China", v: "18" },
      { c: "India", v: "15" },
      { c: "Russia", v: "12" },
      { c: "US", v: "10" },
    ],
    topProducers: [
      { c: "Russia", v: "300" },
      { c: "China", v: "280" },
      { c: "India", v: "250" },
      { c: "US", v: "50" },
      { c: "Europe", v: "45" },
    ],
    topExporters: [
      { c: "US", v: "400" },
      { c: "Russia", v: "350" },
      { c: "Europe", v: "200" },
      { c: "Ukraine", v: "10" },
      { c: "Brazil", v: "8" },
    ],
    topImporters: [
      { c: "Egypt", v: "100" },
      { c: "China", v: "80" },
      { c: "Brazil", v: "50" },
      { c: "Saudi Arabia", v: "40" },
      { c: "India", v: "30" },
    ],
  },
  {
    crop: "Corn",
    consumption: 60,
    price: 500,
    change: 2,
    ureaRatio: 10,
    topConsumers: [
      { c: "China", v: "200" },
      { c: "US", v: "180" },
      { c: "Brazil", v: "120" },
      { c: "Europe", v: "100" },
      { c: "India", v: "80" },
    ],
    topProducers: [
      { c: "US", v: "50" },
      { c: "China", v: "45" },
      { c: "Brazil", v: "40" },
      { c: "Europe", v: "30" },
      { c: "India", v: "25" },
    ],
    topExporters: [
      { c: "Ukraine", v: "10" },
      { c: "US", v: "9" },
      { c: "Brazil", v: "8" },
      { c: "Russia", v: "5" },
      { c: "Europe", v: "3" },
    ],
    topImporters: [
      { c: "China", v: "500" },
      { c: "Europe", v: "300" },
      { c: "Egypt", v: "200" },
      { c: "Saudi Arabia", v: "150" },
      { c: "India", v: "100" },
    ],
  },
  {
    crop: "Soybeans",
    consumption: 70,
    price: 500,
    change: 2,
    ureaRatio: 70,
    topConsumers: [
      { c: "China", v: "250" },
      { c: "US", v: "200" },
      { c: "Brazil", v: "150" },
      { c: "Europe", v: "120" },
      { c: "India", v: "100" },
    ],
    topProducers: [
      { c: "US", v: "60" },
      { c: "Brazil", v: "55" },
      { c: "China", v: "40" },
      { c: "India", v: "30" },
      { c: "Europe", v: "20" },
    ],
    topExporters: [
      { c: "US", v: "400" },
      { c: "Brazil", v: "350" },
      { c: "Europe", v: "200" },
      { c: "China", v: "150" },
      { c: "India", v: "100" },
    ],
    topImporters: [
      { c: "China", v: "600" },
      { c: "Europe", v: "400" },
      { c: "Egypt", v: "250" },
      { c: "Saudi Arabia", v: "180" },
      { c: "India", v: "120" },
    ],
  },
  {
    crop: "Sugar",
    consumption: 100,
    price: 200,
    change: -2,
    ureaRatio: 40,
    topConsumers: [
      { c: "Brazil", v: "180" },
      { c: "India", v: "160" },
      { c: "China", v: "140" },
      { c: "US", v: "120" },
      { c: "Europe", v: "100" },
    ],
    topProducers: [
      { c: "Brazil", v: "80" },
      { c: "India", v: "70" },
      { c: "China", v: "60" },
      { c: "US", v: "40" },
      { c: "Europe", v: "30" },
    ],
    topExporters: [
      { c: "Brazil", v: "500" },
      { c: "India", v: "400" },
      { c: "US", v: "300" },
      { c: "China", v: "200" },
      { c: "Europe", v: "150" },
    ],
    topImporters: [
      { c: "Europe", v: "350" },
      { c: "China", v: "300" },
      { c: "Egypt", v: "200" },
      { c: "Saudi Arabia", v: "150" },
      { c: "US", v: "100" },
    ],
  },
  {
    crop: "Rice",
    consumption: 200,
    price: 300,
    change: -4,
    ureaRatio: 60,
    topConsumers: [
      { c: "China", v: "300" },
      { c: "India", v: "280" },
      { c: "Brazil", v: "150" },
      { c: "US", v: "120" },
      { c: "Europe", v: "100" },
    ],
    topProducers: [
      { c: "China", v: "90" },
      { c: "India", v: "85" },
      { c: "Brazil", v: "60" },
      { c: "US", v: "40" },
      { c: "Europe", v: "30" },
    ],
    topExporters: [
      { c: "India", v: "450" },
      { c: "China", v: "400" },
      { c: "Brazil", v: "300" },
      { c: "US", v: "200" },
      { c: "Europe", v: "150" },
    ],
    topImporters: [
      { c: "Egypt", v: "400" },
      { c: "Saudi Arabia", v: "350" },
      { c: "Europe", v: "280" },
      { c: "US", v: "200" },
      { c: "Brazil", v: "150" },
    ],
  },
];

/** Exact 32-row array from `fertilizers.html`. */
export const countryData: CountryRow[] = [
  { country: "Brazil", production: 5, consumption: 2, imports: 1, exports: 3 },
  { country: "China", production: 60, consumption: 30, imports: 2, exports: 30 },
  { country: "Russia", production: 80, consumption: 40, imports: 0, exports: 40 },
  { country: "Saudi Arabia", production: 200, consumption: 160, imports: 0, exports: 40 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "China", production: 60, consumption: 30, imports: 2, exports: 30 },
  { country: "Russia", production: 80, consumption: 40, imports: 0, exports: 40 },
  { country: "Saudi Arabia", production: 200, consumption: 160, imports: 0, exports: 40 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "China", production: 60, consumption: 30, imports: 2, exports: 30 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "Russia", production: 80, consumption: 40, imports: 0, exports: 40 },
  { country: "Saudi Arabia", production: 200, consumption: 160, imports: 0, exports: 40 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "China", production: 60, consumption: 30, imports: 2, exports: 30 },
  { country: "Russia", production: 80, consumption: 40, imports: 0, exports: 40 },
  { country: "Russia", production: 80, consumption: 40, imports: 0, exports: 40 },
  { country: "Russia", production: 80, consumption: 40, imports: 0, exports: 40 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "China", production: 60, consumption: 30, imports: 2, exports: 30 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "Russia", production: 80, consumption: 40, imports: 0, exports: 40 },
  { country: "Saudi Arabia", production: 200, consumption: 160, imports: 0, exports: 40 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "China", production: 60, consumption: 30, imports: 2, exports: 30 },
  { country: "Saudi Arabia", production: 200, consumption: 160, imports: 0, exports: 40 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "China", production: 60, consumption: 30, imports: 2, exports: 30 },
  { country: "Saudi Arabia", production: 200, consumption: 160, imports: 0, exports: 40 },
  { country: "Egypt", production: 70, consumption: 50, imports: 0.5, exports: 20 },
  { country: "China", production: 60, consumption: 30, imports: 2, exports: 30 },
  { country: "Brazil", production: 5, consumption: 2, imports: 1, exports: 3 },
];

export const ROUTES: Route[] = [
  { id: "SMR", name: "Steam Methane Reforming", shortName: "SMR", desc: "Natural Gas · Traditional", category: "natural-gas", color: "#08306B" },
  { id: "ATR", name: "Autothermal Reforming", shortName: "ATR", desc: "Natural Gas · Traditional", category: "natural-gas", color: "#08306B" },
  { id: "MethPyrolysis", name: "Methane Pyrolysis", shortName: "Methane Pyrolysis", desc: "Natural Gas · Green (Turquoise H₂)", category: "natural-gas", tag: "Green", color: "#08306B" },
  { id: "ATR_CCS", name: "ATR with CCS", shortName: "ATR + CCS", desc: "Natural Gas · Blue H₂", category: "natural-gas", tag: "CCS", color: "#08306B" },
  { id: "SMR_CCS", name: "SMR with CCS", shortName: "SMR + CCS", desc: "Natural Gas · Blue H₂", category: "natural-gas", tag: "CCS", color: "#08306B" },
  { id: "CoalGasification", name: "Coal Gasification", shortName: "Coal Gas.", desc: "Coal · Traditional", category: "coal", color: "#374151" },
  { id: "Coal_CCS", name: "Coal with CCS", shortName: "Coal + CCS", desc: "Coal · Carbon Capture", category: "coal", tag: "CCS", color: "#374151" },
  { id: "Electrolysis", name: "Water Electrolysis", shortName: "Electrolysis", desc: "Green · Renewable H₂", category: "green", tag: "Green", color: "#0d7a5f" },
  { id: "BiomassGas", name: "Biomass Gasification", shortName: "Biomass Gas.", desc: "Green · Bio H₂", category: "green", tag: "Bio", color: "#0d7a5f" },
];

export const CROP_ICONS: Record<string, string> = {
  Wheat: "🌾",
  Corn: "🌽",
  Soybeans: "🫘",
  Sugar: "🍋",
  Rice: "🍚",
};

export const CROP_BG: Record<string, string> = {
  Wheat: "#fef3c7",
  Corn: "#fef9c3",
  Soybeans: "#d0f0e8",
  Sugar: "#ede9fe",
  Rice: "#e8f0fb",
};

export const FLAG: Record<string, string> = {
  Brazil: "🇧🇷",
  China: "🇨🇳",
  Russia: "🇷🇺",
  "Saudi Arabia": "🇸🇦",
  Egypt: "🇪🇬",
  India: "🇮🇳",
  US: "🇺🇸",
  Ukraine: "🇺🇦",
  Europe: "🇪🇺",
};
