"use client";

import { NewEarthquakeAlert } from "./new-earthquake-alert";
import { Earthquake } from "@/app/actions/earthquake";

interface EarthquakeAlertWrapperProps {
  earthquakes: Earthquake[];
}

export function EarthquakeAlertWrapper({
  earthquakes,
}: EarthquakeAlertWrapperProps) {
  return (
    <div className="mb-6">
      <NewEarthquakeAlert earthquakes={earthquakes} />
    </div>
  );
}

