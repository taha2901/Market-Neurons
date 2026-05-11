import type { Metadata } from "next";
import FertilizersPage from "./FertilizersPage";

export const metadata: Metadata = {
  title: "Fertilizers - Market Neurons",
};

export default function Page() {
  return <FertilizersPage />;
}
