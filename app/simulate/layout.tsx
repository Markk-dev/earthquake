import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earthquake Alert Simulator | Earthquake Monitoring System",
  description: "Test the alert system by simulating earthquakes. All test earthquakes are saved to Convex.",
};

export default function SimulateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

