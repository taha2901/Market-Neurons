export type Ticker = { sym: string; val: string; chg: string; pos: boolean };

export const TICKERS: Ticker[] = [
  { sym: "ABUK", val: "EGP 100", chg: "+5.0%", pos: true },
  { sym: "NVDA", val: "$877.80", chg: "+2.3%", pos: true },
  { sym: "TSLA", val: "$170.18", chg: "-3.2%", pos: false },
  { sym: "Urea", val: "$692/T", chg: "+1.2%", pos: true },
  { sym: "DAP", val: "$624/T", chg: "-0.8%", pos: false },
  { sym: "CF", val: "$28.00", chg: "-5.0%", pos: false },
  { sym: "YAR", val: "$20.00", chg: "+2.1%", pos: true },
  { sym: "MU", val: "$414.43", chg: "+1.8%", pos: true },
  { sym: "MSFT", val: "$421.77", chg: "+0.8%", pos: true },
  { sym: "BTC", val: "$67,200", chg: "+3.4%", pos: true },
  { sym: "Gold", val: "$2,340", chg: "+0.6%", pos: true },
  { sym: "Oil", val: "$85.45", chg: "+1.3%", pos: true },
];

export const SPARK_GREEN = [30, 32, 31, 29, 33, 35, 38, 36, 40, 42, 39, 44, 43, 47, 50];
export const SPARK_RED = [50, 48, 49, 47, 45, 44, 46, 43, 41, 42, 40, 38, 39, 37, 35];
export const SPARK_MIX = [40, 38, 42, 44, 41, 43, 46, 44, 48, 45, 49, 47, 50, 48, 52];
