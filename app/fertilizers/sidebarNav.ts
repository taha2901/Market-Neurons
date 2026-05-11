/** Leaf ids ↔ page header / breadcrumb / sidebar auto-expand. */

export type LeafMeta = {
  title: string;
  /** Breadcrumb segments after "Commodities"; last is emphasized like the legacy UI */
  crumbs: string[];
  badge: string;
};

export const DEFAULT_LEAF_ID = "granular-urea";

export const LEAF_META: Record<string, LeafMeta> = {
  "granular-urea": { title: "Granular Urea", crumbs: ["Nitrogen", "Urea", "Granular"], badge: "N — 46% Active Ingredient" },
  "prilled-urea": { title: "Prilled Urea", crumbs: ["Nitrogen", "Urea", "Prilled"], badge: "N — 46% Active Ingredient" },
  "sulfur-coated-urea": { title: "Sulfur-coated Urea", crumbs: ["Nitrogen", "Urea", "Sulfur-coated"], badge: "N — 46% Active Ingredient" },
  "polymer-coated-urea": { title: "Polymer-coated Urea", crumbs: ["Nitrogen", "Urea", "Polymer-coated"], badge: "N — 46% Active Ingredient" },
  "urease-inhibitor-urea": { title: "Urease Inhibitor Urea", crumbs: ["Nitrogen", "Urea", "Urease inhibitor"], badge: "N — 46% Active Ingredient" },
  "liquid-urea": { title: "Liquid Urea", crumbs: ["Nitrogen", "Urea", "Liquid"], badge: "N — 46% Active Ingredient" },
  "industrial-urea": { title: "Industrial Urea", crumbs: ["Nitrogen", "Urea", "Industrial"], badge: "Industrial grade" },
  "ammonium-nitrate": { title: "Ammonium Nitrate", crumbs: ["Nitrogen", "Ammonia", "Ammonium Nitrate"], badge: "N — 34% typical" },
  "ammonia-product": { title: "Ammonia", crumbs: ["Nitrogen", "Ammonia", "Ammonia"], badge: "NH₃ — feedstock" },
  "ammonium-sulphate": { title: "Ammonium Sulphate", crumbs: ["Nitrogen", "Ammonia", "AMS"], badge: "N — 21% · S — 24%" },
  "calcium-ammonium-nitrate": { title: "Calcium Ammonium Nitrate", crumbs: ["Nitrogen", "Ammonia", "CAN"], badge: "N — 27% typical" },
  "uan-28": { title: "UAN 28%", crumbs: ["Nitrogen", "UAN", "28%"], badge: "Solution blend" },
  "uan-32": { title: "UAN 32%", crumbs: ["Nitrogen", "UAN", "32%"], badge: "Solution blend" },
  "liquid-uan": { title: "Liquid UAN", crumbs: ["Nitrogen", "UAN", "Liquid"], badge: "Solution blend" },
  "phosphate-rocks": { title: "Phosphate Rocks", crumbs: ["Phosphates", "Rocks"], badge: "P₂O₅ — raw" },
  "diammonium-phosphate": { title: "Diammonium Phosphate", crumbs: ["Phosphates", "DAP"], badge: "P — 46% · N — 18%" },
  "monoammonium-phosphate": { title: "Monoammonium Phosphate", crumbs: ["Phosphates", "MAP"], badge: "P — 52% · N — 11%" },
  "single-superphosphate": { title: "Single Superphosphate", crumbs: ["Phosphates", "SSP"], badge: "P — 16–22%" },
  "triple-superphosphate": { title: "Triple Superphosphate", crumbs: ["Phosphates", "TSP"], badge: "P — 44–48%" },
  "muriate-of-potash": { title: "Muriate of Potash", crumbs: ["Potash", "MOP"], badge: "K — 60% K₂O" },
  "sulfate-of-potash": { title: "Sulfate of Potash", crumbs: ["Potash", "SOP"], badge: "K — 50% K₂O" },
  "potassium-nitrate": { title: "Potassium Nitrate", crumbs: ["Potash", "KN"], badge: "K — 44% · N — 13%" },
};

/** When a leaf is chosen, which accordion sections should be open */
export function expandStateForLeaf(leafId: string) {
  const base = { nitrogen: false, urea: false, ammonia: false, uan: false, phosphates: false, potash: false };
  if (
    leafId === "granular-urea" ||
    leafId === "prilled-urea" ||
    leafId === "sulfur-coated-urea" ||
    leafId === "polymer-coated-urea" ||
    leafId === "urease-inhibitor-urea" ||
    leafId === "liquid-urea" ||
    leafId === "industrial-urea"
  ) {
    return { ...base, nitrogen: true, urea: true };
  }
  if (leafId === "ammonium-nitrate" || leafId === "ammonia-product" || leafId === "ammonium-sulphate" || leafId === "calcium-ammonium-nitrate") {
    return { ...base, nitrogen: true, ammonia: true };
  }
  if (leafId === "uan-28" || leafId === "uan-32" || leafId === "liquid-uan") {
    return { ...base, nitrogen: true, uan: true };
  }
  if (
    leafId === "phosphate-rocks" ||
    leafId === "diammonium-phosphate" ||
    leafId === "monoammonium-phosphate" ||
    leafId === "single-superphosphate" ||
    leafId === "triple-superphosphate"
  ) {
    return { ...base, phosphates: true };
  }
  if (leafId === "muriate-of-potash" || leafId === "sulfate-of-potash" || leafId === "potassium-nitrate") {
    return { ...base, potash: true };
  }
  return { ...base, nitrogen: true, urea: true };
}
