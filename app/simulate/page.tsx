"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertSystem } from "@/components/alert-system";
import { EarthquakeList } from "@/components/earthquake-list";
import { EarthquakeStats } from "@/components/earthquake-stats";
import { AlertTriangle, Play, Trash2 } from "lucide-react";
import { Earthquake } from "@/app/actions/earthquake";

export default function SimulatePage() {
  const [magnitude, setMagnitude] = useState("5.5");
  const [latitude, setLatitude] = useState("14.5995"); // Manila coordinates
  const [longitude, setLongitude] = useState("120.9842");
  const [depth, setDepth] = useState("10");
  const [location, setLocation] = useState("Manila, Philippines");
  const [isSimulating, setIsSimulating] = useState(false);

  const saveEarthquake = useMutation(api.earthquakes.saveTestEarthquake);
  const testEarthquakes = useQuery(api.earthquakes.getTestEarthquakes) || [];
  const clearAll = useMutation(api.earthquakes.clearAllTestEarthquakes);

  // Transform Convex data to Earthquake format
  const earthquakes: Earthquake[] = testEarthquakes.map((eq: any) => ({
    id: eq.id,
    magnitude: eq.magnitude,
    place: eq.place,
    time: eq.time,
    updated: eq.updated,
    url: eq.url,
    detail: eq.detail,
    status: eq.status,
    tsunami: eq.tsunami,
    sig: eq.sig,
    net: eq.net,
    code: eq.code,
    ids: eq.ids,
    sources: eq.sources,
    types: eq.types,
    nst: eq.nst,
    dmin: eq.dmin,
    rms: eq.rms,
    gap: eq.gap,
    magType: eq.magType,
    type: eq.type,
    title: eq.title,
    coordinates: eq.coordinates,
  }));

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const now = Date.now();
      const mag = parseFloat(magnitude);
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const dep = parseFloat(depth);

      const testEarthquake: Omit<Earthquake, "id"> & { id: string } = {
        id: `test-${now}-${Math.random().toString(36).substring(7)}`,
        magnitude: mag,
        place: location,
        time: now,
        updated: now,
        url: "https://earthquake.phivolcs.dost.gov.ph/",
        detail: "https://earthquake.phivolcs.dost.gov.ph/",
        status: "reviewed",
        tsunami: mag >= 7.0 ? 1 : 0,
        sig: Math.round(mag * 100),
        net: "test",
        code: `test-${now}`,
        ids: `test-${now}`,
        sources: "test",
        types: "earthquake",
        nst: null,
        dmin: null,
        rms: 0,
        gap: null,
        magType: "ml",
        type: "earthquake",
        title: `M ${mag.toFixed(1)} - ${location}`,
        coordinates: {
          latitude: lat,
          longitude: lon,
          depth: dep,
        },
      };

      await saveEarthquake(testEarthquake);

      // Reset form
      setMagnitude("5.5");
      setLocation("Manila, Philippines");
    } catch (error) {
      console.error("Error simulating earthquake:", error);
      alert("Failed to simulate earthquake. Please try again.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClearAll = async () => {
    if (
      confirm(
        "Are you sure you want to delete all test earthquakes? This cannot be undone."
      )
    ) {
      try {
        await clearAll({});
      } catch (error) {
        console.error("Error clearing earthquakes:", error);
        alert("Failed to clear earthquakes. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          Earthquake Alert Simulator
        </h1>
        <p className="text-muted-foreground">
          Test the alert system by simulating earthquakes. All test earthquakes are saved to Convex.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Simulation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Simulate Earthquake</CardTitle>
            <CardDescription>
              Create a test earthquake to trigger alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magnitude">Magnitude</Label>
              <Input
                id="magnitude"
                type="number"
                step="0.1"
                min="1.0"
                max="10.0"
                value={magnitude}
                onChange={(e) => setMagnitude(e.target.value)}
                placeholder="5.5"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 5.0+ to trigger alerts
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Manila, Philippines"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="14.5995"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="120.9842"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="depth">Depth (km)</Label>
              <Input
                id="depth"
                type="number"
                step="0.1"
                min="0"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder="10"
              />
            </div>

            <Button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              {isSimulating ? "Simulating..." : "Simulate Earthquake"}
            </Button>

            {earthquakes.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Test Earthquakes ({earthquakes.length})
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Alert System */}
        <Card>
          <CardHeader>
            <CardTitle>Alert System</CardTitle>
            <CardDescription>
              Enable alerts to test notifications for simulated earthquakes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertSystem earthquakes={earthquakes} minMagnitude={5.0} />
          </CardContent>
        </Card>
      </div>

      {/* Test Earthquakes Stats and List */}
      {earthquakes.length > 0 && (
        <div className="mt-8 space-y-6">
          <EarthquakeStats earthquakes={earthquakes} />
          <EarthquakeList earthquakes={earthquakes} />
        </div>
      )}

      {earthquakes.length === 0 && (
        <Card className="mt-8">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No test earthquakes yet. Simulate an earthquake to test the alert system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

