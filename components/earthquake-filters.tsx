"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Filter, MapPin, Loader2, TrendingUp, Search, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Earthquake } from "@/app/actions/earthquake";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
  SidebarRail,
  useSidebar,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export interface EarthquakeFilters {
  minMagnitude: string;
  maxMagnitude: string;
  location: string;
  minLatitude: string;
  maxLatitude: string;
  minLongitude: string;
  maxLongitude: string;
  startTime: string; // Keep as string for backward compatibility
  endTime: string; // Keep as string for backward compatibility
  startDate: Date | undefined;
  endDate: Date | undefined;
  useGPS: boolean;
  gpsLatitude: number | null;
  gpsLongitude: number | null;
  radiusKm: string;
}

interface EarthquakeFiltersProps {
  filters: EarthquakeFilters;
  onFiltersChange: (filters: EarthquakeFilters) => void;
  filteredCount: number;
  totalCount: number;
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function EarthquakeFiltersSidebar({
  filters,
  onFiltersChange,
  filteredCount,
  totalCount,
}: EarthquakeFiltersProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isLoadingGPS, setIsLoadingGPS] = React.useState(false);
  const [gpsError, setGpsError] = React.useState<string | null>(null);

  const handleFilterChange = (key: keyof EarthquakeFilters, value: string | number | boolean | null | Date | undefined) => {
    const updatedFilters = {
      ...filters,
      [key]: value,
    };
    
    // Sync date objects with string format for time filtering
    if (key === "startDate") {
      if (value) {
        const date = new Date(value as Date);
        // Set time to start of day (00:00:00)
        date.setHours(0, 0, 0, 0);
        updatedFilters.startTime = format(date, "yyyy-MM-dd'T'HH:mm");
      } else {
        updatedFilters.startTime = "";
      }
    }
    if (key === "endDate") {
      if (value) {
        const date = new Date(value as Date);
        // Set time to end of day (23:59:59)
        date.setHours(23, 59, 59, 999);
        updatedFilters.endTime = format(date, "yyyy-MM-dd'T'HH:mm");
      } else {
        updatedFilters.endTime = "";
      }
    }
    
    onFiltersChange(updatedFilters);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingGPS(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleFilterChange("useGPS", true);
        handleFilterChange("gpsLatitude", latitude);
        handleFilterChange("gpsLongitude", longitude);
        if (!filters.radiusKm) {
          handleFilterChange("radiusKm", "100"); // Default 100km radius
        }
        setIsLoadingGPS(false);
      },
      (error) => {
        setIsLoadingGPS(false);
        setGpsError(
          error.message === "User denied Geolocation"
            ? "Location access denied. Please enable location permissions."
            : "Failed to get your location. Please try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const clearFilters = () => {
    onFiltersChange({
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
    setGpsError(null);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "startDate" || key === "endDate") {
      return value !== undefined;
    }
    if (typeof value === "boolean") return value;
    if (value === null) return false;
    return value !== "";
  });

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        {!isCollapsed && (
          <>
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <SidebarGroupLabel>Filters</SidebarGroupLabel>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 w-8 p-0"
                  title="Clear all filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="px-2 pb-2 text-xs text-muted-foreground">
              Showing {filteredCount} of {totalCount} earthquakes
            </div>
          </>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center py-2">
            <Filter className="h-5 w-5" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {isCollapsed ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Magnitude Filter" size="lg">
                <TrendingUp className="h-5 w-5" />
                {(filters.minMagnitude || filters.maxMagnitude) && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Location Filter" size="lg">
                <Search className="h-5 w-5" />
                {filters.location && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="GPS Location" size="lg">
                <MapPin className="h-5 w-5" />
                {filters.useGPS && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Time Range" size="lg">
                <CalendarIcon className="h-5 w-5" />
                {(filters.startDate || filters.endDate) && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Search Filters</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4 px-2">
            {/* Magnitude Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Magnitude</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="minMagnitude" className="text-xs text-muted-foreground">
                    Min
                  </Label>
                  <Input
                    id="minMagnitude"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="0.0"
                    value={filters.minMagnitude}
                    onChange={(e) => handleFilterChange("minMagnitude", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="maxMagnitude" className="text-xs text-muted-foreground">
                    Max
                  </Label>
                  <Input
                    id="maxMagnitude"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="10.0"
                    value={filters.maxMagnitude}
                    onChange={(e) => handleFilterChange("maxMagnitude", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            {/* GPS Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">My Device Location</Label>
                {filters.useGPS && filters.gpsLatitude && filters.gpsLongitude && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange("useGPS", false)}
                    className="h-6 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              {filters.useGPS && filters.gpsLatitude && filters.gpsLongitude ? (
                <div className="space-y-2 p-2 bg-muted rounded-md">
                  <div className="text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    Lat: {filters.gpsLatitude.toFixed(4)}, Lng: {filters.gpsLongitude.toFixed(4)}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="radiusKm" className="text-xs text-muted-foreground">
                      Radius (km)
                    </Label>
                    <Input
                      id="radiusKm"
                      type="number"
                      step="1"
                      min="1"
                      max="10000"
                      placeholder="100"
                      value={filters.radiusKm}
                      onChange={(e) => handleFilterChange("radiusKm", e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isLoadingGPS}
                  className="w-full"
                >
                  {isLoadingGPS ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Use My Device
                    </>
                  )}
                </Button>
              )}
              {gpsError && (
                <p className="text-xs text-destructive">{gpsError}</p>
              )}
            </div>

              <SidebarSeparator />

              {/* Time Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Time Range
                </Label>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="startDate" className="text-xs text-muted-foreground">
                      Start Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.startDate ? (
                            format(filters.startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.startDate}
                          onSelect={(date) => handleFilterChange("startDate", date)}
                          initialFocus
                        />
                        {filters.startDate && (
                          <div className="p-3 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                              onClick={() => handleFilterChange("startDate", undefined)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Clear
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="endDate" className="text-xs text-muted-foreground">
                      End Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.endDate ? (
                            format(filters.endDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.endDate}
                          onSelect={(date) => handleFilterChange("endDate", date)}
                          initialFocus
                        />
                        {filters.endDate && (
                          <div className="p-3 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                              onClick={() => handleFilterChange("endDate", undefined)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Clear
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

// Filter function to apply filters to earthquake data
export function filterEarthquakes(
  earthquakes: Earthquake[],
  filters: EarthquakeFilters
): Earthquake[] {
  return earthquakes.filter((eq) => {
    // Magnitude filter
    if (filters.minMagnitude && filters.minMagnitude.trim()) {
      const minMag = parseFloat(filters.minMagnitude);
      if (!isNaN(minMag) && eq.magnitude < minMag) {
        return false;
      }
    }
    if (filters.maxMagnitude && filters.maxMagnitude.trim()) {
      const maxMag = parseFloat(filters.maxMagnitude);
      if (!isNaN(maxMag) && eq.magnitude > maxMag) {
        return false;
      }
    }

    // Location filter (case-insensitive search)
    if (filters.location && filters.location.trim()) {
      const searchTerm = filters.location.toLowerCase().trim();
      if (!eq.place.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // GPS location filter (distance-based)
    if (filters.useGPS && filters.gpsLatitude !== null && filters.gpsLongitude !== null) {
      const radius = filters.radiusKm && filters.radiusKm.trim() 
        ? parseFloat(filters.radiusKm) 
        : 100; // Default 100km
      
      if (!isNaN(radius) && radius > 0) {
        const distance = calculateDistance(
          filters.gpsLatitude,
          filters.gpsLongitude,
          eq.coordinates.latitude,
          eq.coordinates.longitude
        );
        if (distance > radius) {
          return false;
        }
      }
    } else {
      // Manual coordinate filters (only if GPS is not active)
      if (filters.minLatitude && filters.minLatitude.trim()) {
        const minLat = parseFloat(filters.minLatitude);
        if (!isNaN(minLat) && eq.coordinates.latitude < minLat) {
          return false;
        }
      }
      if (filters.maxLatitude && filters.maxLatitude.trim()) {
        const maxLat = parseFloat(filters.maxLatitude);
        if (!isNaN(maxLat) && eq.coordinates.latitude > maxLat) {
          return false;
        }
      }

      if (filters.minLongitude && filters.minLongitude.trim()) {
        const minLng = parseFloat(filters.minLongitude);
        if (!isNaN(minLng) && eq.coordinates.longitude < minLng) {
          return false;
        }
      }
      if (filters.maxLongitude && filters.maxLongitude.trim()) {
        const maxLng = parseFloat(filters.maxLongitude);
        if (!isNaN(maxLng) && eq.coordinates.longitude > maxLng) {
          return false;
        }
      }
    }

    // Time filter
    if (filters.startTime && filters.startTime.trim()) {
      try {
        const startTime = new Date(filters.startTime).getTime();
        if (!isNaN(startTime) && eq.time < startTime) {
          return false;
        }
      } catch {
        // Invalid date, skip this filter
      }
    }
    if (filters.endTime && filters.endTime.trim()) {
      try {
        const endTime = new Date(filters.endTime).getTime();
        if (!isNaN(endTime) && eq.time > endTime) {
          return false;
        }
      } catch {
        // Invalid date, skip this filter
      }
    }

    return true;
  });
}

