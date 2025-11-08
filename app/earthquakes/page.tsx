import { getEarthquakes } from "@/app/actions/earthquake";
import { EarthquakeContentClient } from "@/components/earthquake-content-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Earthquakes - Philippines | Earthquake Monitoring System",
  description: "Real-time earthquake data for the Philippines region. Updated every 60 seconds.",
};

// Force dynamic rendering for real-time data
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

function LoadingSkeleton() {
  return (
    <div className="flex gap-6">
      {/* Sidebar Skeleton */}
      <aside className="w-80 shrink-0 hidden lg:block">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-20 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 min-w-0 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function EarthquakeContent() {
  const earthquakes = await getEarthquakes();

  return <EarthquakeContentClient earthquakes={earthquakes} />;
}

export default function EarthquakesPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<LoadingSkeleton />}>
        <EarthquakeContent />
      </Suspense>
    </div>
  );
}

