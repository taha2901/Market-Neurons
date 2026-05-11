import type { RouteDetail } from "./types";

/** Parity with `fertilizers.html` ROUTE_DETAILS — chemistry copied with proper UTF-8. */
export const ROUTE_DETAILS: Record<string, RouteDetail> = {
  SMR: {
    title: "Steam Methane Reforming",
    subtitle: "Natural Gas Route · Traditional",
    color: "#08306B",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Natural Gas, urea plant only (in mml)", value: "4.1" },
        { label: "Electricity (kwh/ton)", value: "170" },
      ],
      ammonia: [
        { label: "Natural Gas (Feed Stock) in mmbtu", value: "13.3" },
        { label: "Natural Gas (Fuel) in mmbtu", value: "10.5" },
        { label: "Electricity (kwh/ton)", value: "80" },
      ],
      totals: [
        { label: "Total Natural Gas", value: "21.1", bold: true },
        { label: "Electricity", value: "215", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "Standard agricultural urea produced by reacting ammonia with CO₂ at high pressure, then granulated into 2–4 mm spherical particles for broadcast application.",
    soilUse:
      "All soil types but REQUIRES incorporation or >12mm rain within 2–3 days to prevent ammonia volatilization. Best for mechanized cereal/oilseed systems.",
    steps: [
      {
        title: "Ammonia",
        body:
          "Natural gas reacts with steam over nickel catalyst at 800–900°C producing syngas (H₂+CO). Water-gas shift converts CO to H₂+CO₂. CO₂ captured via MDEA amine absorption. Purified H₂ combined with N₂ in Haber-Bosch synthesis loop at 150–250 bar and 400–500°C forming ammonia.",
      },
      {
        title: "Urea",
        body:
          "NH₃ and CO₂ react in high-pressure synthesis reactor at 140–200 bar and 160–200°C forming urea solution. Solution evaporated to 96–99.7% concentration. Molten urea fed to granulation drum, cooled in fluidised bed, anti-caking coating applied.",
      },
    ],
  },
  ATR: {
    title: "Autothermal Reforming",
    subtitle: "Natural Gas Route · Traditional",
    color: "#08306B",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Natural Gas, urea plant only (in mmbtu)", value: "3.5" },
        { label: "Electricity (kwh/ton)", value: "140" },
      ],
      ammonia: [
        { label: "Natural Gas (Feed Stock) in mmbtu", value: "13.3" },
        { label: "Natural Gas (Fuel) in mmbtu", value: "10.5" },
        { label: "Electricity (kwh/ton)", value: "80" },
      ],
      totals: [
        { label: "Total Natural Gas", value: "20.5", bold: true },
        { label: "Electricity", value: "185", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "ATR combines partial oxidation and steam reforming in a single reactor using oxygen from an air separation unit.",
    soilUse:
      "Same suitability as granular. More common in Asian and Middle Eastern markets. Dissolves faster — useful for fertigation or quick-response applications.",
    steps: [
      {
        title: "Ammonia",
        body:
          "Natural gas reacts with steam and O₂ over nickel catalyst at 800–1000°C. Single-pass conversion higher than SMR. CO₂ captured via amine absorption.",
      },
      {
        title: "Urea",
        body: "NH₃ and CO₂ react at 140–200 bar. Standard granulation applied.",
      },
    ],
  },
  MethPyrolysis: {
    title: "Methane Pyrolysis",
    subtitle: "Natural Gas Route · Green (Turquoise H₂)",
    color: "#08306B",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Natural Gas (mmbtu)", value: "8.5" },
        { label: "Electricity (kwh/ton)", value: "220" },
      ],
      ammonia: [
        { label: "Natural Gas (Feed Stock) in mmbtu", value: "8.5" },
        { label: "Electricity (kwh/ton)", value: "120" },
      ],
      totals: [
        { label: "Total Natural Gas", value: "8.5", bold: true },
        { label: "Electricity", value: "220", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "Methane is split into H₂ and solid carbon (no CO₂ emitted). Produces turquoise hydrogen with carbon black as saleable by-product.",
    soilUse:
      "Identical agronomic profile to conventional granular urea. Carbon footprint significantly lower than SMR without CCS.",
    steps: [
      {
        title: "Turquoise H₂",
        body:
          "Methane heated to 700–1200°C in molten metal or plasma reactor. CH₄ → C(solid) + 2H₂. No combustion, no CO₂.",
      },
      {
        title: "Ammonia & Urea",
        body: "H₂ combined with N₂ in Haber-Bosch loop at 150–250 bar. Standard granulation.",
      },
    ],
  },
  ATR_CCS: {
    title: "ATR with Carbon Capture",
    subtitle: "Natural Gas Route · CCS (Blue H₂)",
    color: "#08306B",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Natural Gas (mmbtu)", value: "4.0" },
        { label: "Electricity (kwh/ton)", value: "160" },
      ],
      ammonia: [
        { label: "Natural Gas (Feed Stock) in mmbtu", value: "14.0" },
        { label: "Natural Gas (Fuel) in mmbtu", value: "9.0" },
        { label: "Electricity (kwh/ton)", value: "95" },
      ],
      totals: [
        { label: "Total Natural Gas", value: "21.5", bold: true },
        { label: "Electricity", value: "220", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "ATR with post-combustion or pre-combustion carbon capture achieving 90–95% CO₂ removal.",
    soilUse:
      "Agronomically identical to standard granular urea. Premium pricing possible in carbon-conscious markets.",
    steps: [
      {
        title: "ATR + CCS",
        body:
          "Standard ATR with additional amine absorption unit capturing >90% of CO₂. Captured CO₂ compressed and stored in geological formations.",
      },
      {
        title: "Urea Synthesis",
        body: "NH₃ + CO₂ → urea. Standard granulation.",
      },
    ],
  },
  SMR_CCS: {
    title: "SMR with Carbon Capture",
    subtitle: "Natural Gas Route · CCS (Blue H₂)",
    color: "#08306B",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Natural Gas (mmbtu)", value: "4.5" },
        { label: "Electricity (kwh/ton)", value: "175" },
      ],
      ammonia: [
        { label: "Natural Gas (Feed Stock) in mmbtu", value: "14.5" },
        { label: "Natural Gas (Fuel) in mmbtu", value: "11.0" },
        { label: "Electricity (kwh/ton)", value: "85" },
      ],
      totals: [
        { label: "Total Natural Gas", value: "22.5", bold: true },
        { label: "Electricity", value: "235", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "SMR with integrated CCS unit achieving 85–95% capture rate.",
    soilUse:
      "Qualifies for low-carbon fertilizer certification in EU and North American markets.",
    steps: [
      {
        title: "SMR + CCS",
        body:
          "Standard SMR with capture unit on reformer flue gas. MDEA or Econamine solvent. CO₂ compressed to 100–150 bar for pipeline transport.",
      },
      {
        title: "Urea Synthesis",
        body:
          "Portion of captured CO₂ fed to urea synthesis. Standard granulation.",
      },
    ],
  },
  CoalGasification: {
    title: "Coal Gasification",
    subtitle: "Coal Route · Traditional",
    color: "#374151",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Coal (in ton)", value: "1.8" },
        { label: "Electricity (kwh/ton)", value: "350" },
      ],
      ammonia: [
        { label: "Coal (Feed Stock) in ton", value: "5.2" },
        { label: "Electricity (kwh/ton)", value: "180" },
      ],
      totals: [
        { label: "Total Coal", value: "7.0", bold: true },
        { label: "Electricity", value: "530", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "Coal is gasified with steam and oxygen to produce syngas. Dominant route in China, ~70% of Chinese urea production.",
    soilUse:
      "Agronomically identical to natural gas-based granular urea. Higher carbon footprint. 30–40% lower cost in coal-rich regions.",
    steps: [
      {
        title: "Syngas Production",
        body:
          "Coal fed to gasifier at 1200–1500°C with steam and O₂. Produces syngas cleaned and shifted to maximize H₂.",
      },
      {
        title: "Ammonia & Urea",
        body: "H₂ combined with N₂ in Haber-Bosch. Standard granulation.",
      },
    ],
  },
  Coal_CCS: {
    title: "Coal with CCS",
    subtitle: "Coal Route · Carbon Capture",
    color: "#374151",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Coal (in ton)", value: "1.8" },
        { label: "Electricity (kwh/ton)", value: "420" },
      ],
      ammonia: [
        { label: "Coal (Feed Stock) in ton", value: "5.2" },
        { label: "Electricity (kwh/ton)", value: "220" },
      ],
      totals: [
        { label: "Total Coal", value: "7.0", bold: true },
        { label: "Electricity", value: "640", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "Coal gasification with integrated pre- or post-combustion CCS achieving 85–90% CO₂ removal.",
    soilUse: "Qualifies for lower carbon intensity certification.",
    steps: [
      {
        title: "Gasification + CCS",
        body:
          "Rectisol or Selexol wash capturing CO₂ and sulfur. CO₂ injected into geological storage.",
      },
      {
        title: "Urea Synthesis",
        body: "Standard NH₃+CO₂ reaction and granulation.",
      },
    ],
  },
  Electrolysis: {
    title: "Water Electrolysis",
    subtitle: "Green Route · Renewable H₂",
    color: "#0d7a5f",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Water (m³)", value: "9.0" },
        { label: "Electricity (kwh/ton)", value: "1,200" },
      ],
      ammonia: [
        { label: "Electricity (kwh/ton)", value: "9,500" },
        { label: "Water (m³)", value: "8.5" },
      ],
      totals: [
        { label: "Total Electricity", value: "10,700", bold: true },
        { label: "Water (m³)", value: "17.5", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "Green hydrogen produced by electrolyzing water using renewable electricity. Zero direct CO₂ emissions.",
    soilUse:
      "Identical agronomic performance. Commands green premium in carbon credit-linked markets.",
    steps: [
      {
        title: "Green H₂",
        body:
          "PEM or alkaline electrolyzer splits water into H₂ and O₂. Efficiency 60–80% (LHV basis).",
      },
      {
        title: "Green Ammonia & Urea",
        body:
          "H₂ fed to Haber-Bosch with N₂. CO₂ sourced from biogenic or direct air capture. Standard granulation.",
      },
    ],
  },
  BiomassGas: {
    title: "Biomass Gasification",
    subtitle: "Green Route · Bio H₂",
    color: "#0d7a5f",
    inputs: {
      direct: [
        { label: "Ammonia (in ton)", value: "0.56" },
        { label: "Biomass (dry ton)", value: "3.2" },
        { label: "Electricity (kwh/ton)", value: "280" },
      ],
      ammonia: [
        { label: "Biomass (Feed Stock) dry ton", value: "8.5" },
        { label: "Electricity (kwh/ton)", value: "160" },
      ],
      totals: [
        { label: "Total Biomass", value: "11.7", bold: true },
        { label: "Electricity", value: "440", bold: true },
      ],
      activeIngredient: { name: "Nitrogen", pct: 46 },
    },
    overview:
      "Agricultural residues or energy crops gasified. Near carbon-neutral or carbon-negative when combined with CCS.",
    soilUse:
      "Certified bio-based urea may qualify for renewable content credits in EU.",
    steps: [
      {
        title: "Biomass Syngas",
        body:
          "Biomass dried and fed to fluidized bed gasifier at 700–900°C. Cleaned via tar reformer and filtration.",
      },
      {
        title: "Ammonia & Urea",
        body:
          "Biogenic CO₂ from gasifier used in urea synthesis, making product carbon-neutral. Standard granulation.",
      },
    ],
  },
};
