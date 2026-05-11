export type Stock = {
  symbol: string;
  price: number;
  change: number;
  mktCap: number;
  ranking: number;
  exposure: number;
};

export type CropBreakdown = { c: string; v: string };

export type CropRow = {
  crop: string;
  consumption: number;
  price: number;
  change: number;
  ureaRatio: number;
  topConsumers: CropBreakdown[];
  topProducers: CropBreakdown[];
  topExporters: CropBreakdown[];
  topImporters: CropBreakdown[];
};

export type CountryRow = {
  country: string;
  production: number;
  consumption: number;
  imports: number;
  exports: number;
};

export type RouteCategory = "natural-gas" | "coal" | "green";

export type Route = {
  id: string;
  name: string;
  shortName: string;
  desc: string;
  category: RouteCategory;
  color: string;
  tag?: string;
};

export type RouteInputRow = { label: string; value: string };
export type RouteTotalRow = { label: string; value: string; bold?: boolean };
export type RouteStep = { title: string; body: string };

export type RouteDetail = {
  title: string;
  subtitle: string;
  color: string;
  inputs: {
    direct: RouteInputRow[];
    ammonia: RouteInputRow[];
    totals: RouteTotalRow[];
    activeIngredient: { name: string; pct: number };
  };
  overview: string;
  soilUse: string;
  steps: RouteStep[];
};
