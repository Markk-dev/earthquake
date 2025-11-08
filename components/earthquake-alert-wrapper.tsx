"use client";

import { AlertSystem } from "./alert-system";
import { Earthquake } from "@/app/actions/earthquake";

interface EarthquakeAlertWrapperProps {
  earthquakes: Earthquake[];
}

export function EarthquakeAlertWrapper({
  earthquakes,
}: EarthquakeAlertWrapperProps) {
  return (
    <div className="mb-6">
      <AlertSystem earthquakes={earthquakes} minMagnitude={5.0} />
    </div>
  );
}

