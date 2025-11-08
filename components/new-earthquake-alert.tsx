"use client";

import { useEffect, useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Earthquake } from "@/app/actions/earthquake";

interface NewEarthquakeAlertProps {
  earthquakes: Earthquake[];
}

export function NewEarthquakeAlert({ earthquakes }: NewEarthquakeAlertProps) {
  const [newEarthquakes, setNewEarthquakes] = useState<Earthquake[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Get current earthquake IDs
    const currentIds = new Set(earthquakes.map((eq) => eq.id));

    // Find earthquakes that are new (not in seenIdsRef)
    const newlyDetected = earthquakes.filter(
      (eq) => !seenIdsRef.current.has(eq.id) && !dismissedIds.has(eq.id)
    );

    // Update seen IDs
    earthquakes.forEach((eq) => seenIdsRef.current.add(eq.id));

    // Update new earthquakes list
    if (newlyDetected.length > 0) {
      setNewEarthquakes((prev) => {
        // Merge with existing, avoiding duplicates
        const existingIds = new Set(prev.map((eq) => eq.id));
        const toAdd = newlyDetected.filter((eq) => !existingIds.has(eq.id));
        return [...prev, ...toAdd];
      });
    }

    // Clean up old earthquakes (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    setNewEarthquakes((prev) =>
      prev.filter((eq) => eq.time >= fiveMinutesAgo)
    );
  }, [earthquakes, dismissedIds]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
    setNewEarthquakes((prev) => prev.filter((eq) => eq.id !== id));
  };

  const handleDismissAll = () => {
    newEarthquakes.forEach((eq) => {
      setDismissedIds((prev) => new Set(prev).add(eq.id));
    });
    setNewEarthquakes([]);
  };

  if (newEarthquakes.length === 0) {
    return null;
  }

  // Show only the most recent new earthquake
  const latestNewEarthquake = newEarthquakes.sort((a, b) => b.time - a.time)[0];

  return (
    <Alert
      className={cn(
        "border-2 animate-in slide-in-from-top-5 mb-4",
        latestNewEarthquake.magnitude >= 7.0
          ? "border-red-500 bg-red-50 dark:bg-red-950"
          : latestNewEarthquake.magnitude >= 5.0
          ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
          : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      )}
    >
      <AlertTriangle
        className={cn(
          "h-4 w-4",
          latestNewEarthquake.magnitude >= 7.0
            ? "text-red-600"
            : latestNewEarthquake.magnitude >= 5.0
            ? "text-orange-600"
            : "text-yellow-600"
        )}
      />
      <AlertTitle className="flex items-center justify-between">
        <span>
          {latestNewEarthquake.isTest ? "New Test " : "New "}
          Earthquake Detected: M {latestNewEarthquake.magnitude.toFixed(1)}
        </span>
        <div className="flex items-center gap-2">
          {newEarthquakes.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismissAll}
              className="h-6 text-xs"
            >
              Dismiss All ({newEarthquakes.length})
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleDismiss(latestNewEarthquake.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-medium">
            {latestNewEarthquake.place}
            {latestNewEarthquake.isTest && (
              <span className="text-orange-600 ml-2 text-sm">(Test)</span>
            )}
          </p>
          <p className="text-sm">
            Time: {new Date(latestNewEarthquake.time).toLocaleString()}
          </p>
          <p className="text-sm">
            Depth: {latestNewEarthquake.coordinates.depth.toFixed(1)} km
          </p>
          <p className="text-sm">
            Location: {latestNewEarthquake.coordinates.latitude.toFixed(4)}°N,{" "}
            {latestNewEarthquake.coordinates.longitude.toFixed(4)}°E
          </p>
          {latestNewEarthquake.magnitude >= 7.0 && (
            <p className="text-sm font-semibold text-red-600">
              Major earthquake detected! Take necessary precautions.
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

