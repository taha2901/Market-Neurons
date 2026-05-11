import type { Metadata } from "next";
import ReportApp from "./ReportApp";

export const metadata: Metadata = {
  title: "Market Neurons — News & Analysis",
};

export default function ReportPage() {
  return <ReportApp />;
}
