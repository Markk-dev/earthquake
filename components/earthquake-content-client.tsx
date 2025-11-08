"use client";

import * as React from "react";
import { Earthquake } from "@/app/actions/earthquake";
import { EarthquakeList } from "@/components/earthquake-list";
import { EarthquakeStats } from "@/components/earthquake-stats";
import {
  EarthquakeFiltersSidebar,
  filterEarthquakes,
  EarthquakeFilters,
} from "@/components/earthquake-filters";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface EarthquakeContentClientProps {
  earthquakes: Earthquake[];
}

export function EarthquakeContentClient({
  earthquakes,
}: EarthquakeContentClientProps) {
  const [filters, setFilters] = React.useState<EarthquakeFilters>({
    minMagnitude: "",
    maxMagnitude: "",
    location: "",
    minLatitude: "",
    maxLatitude: "",
    minLongitude: "",
    maxLongitude: "",
    startTime: "",
    endTime: "",
    startDate: undefined,
    endDate: undefined,
    useGPS: false,
    gpsLatitude: null,
    gpsLongitude: null,
    radiusKm: "",
  });

  const filteredEarthquakes = React.useMemo(() => {
    return filterEarthquakes(earthquakes, filters);
  }, [earthquakes, filters]);

  return (
    <SidebarProvider>
      <EarthquakeFiltersSidebar
        filters={filters}
        onFiltersChange={setFilters}
        filteredCount={filteredEarthquakes.length}
        totalCount={earthquakes.length}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Real-Time Earthquake Monitoring
            </h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Live earthquake data for the Philippines region. Data updates every 60 seconds.
          </div>
          <EarthquakeStats earthquakes={filteredEarthquakes} />
          <EarthquakeList earthquakes={filteredEarthquakes} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

