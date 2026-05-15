import type { Metadata } from "next";
import HomeApp from "./home/HomeApp";

export const metadata: Metadata = {
  title: "Market Neurons — Agri-Intelligence Platform",
};

export default function HomePage() {
  return <HomeApp /> ;
}
