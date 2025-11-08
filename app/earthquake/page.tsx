import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeEarthquakeDisplay } from "@/components/home-earthquake-display";
import { TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earthquake Monitoring - Philippines | Disaster Monitoring System",
  description: "Real-time earthquake monitoring and alerts for the Philippines region.",
};

// Force dynamic rendering for real-time data
export const dynamic = "force-dynamic";

export default function EarthquakePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Earthquake Monitoring
        </h1>
        <p className="text-muted-foreground mb-4">
          Real-time earthquake monitoring and alerts for the Philippines region. 
          New earthquakes will be displayed as alerts, and the most recent earthquake is shown with a map.
        </p>
        <Button asChild size="lg" className="text-lg px-8">
          <Link href="/earthquakes">
            <TrendingUp className="mr-2 h-5 w-5" />
            View All Recent Earthquakes
          </Link>
        </Button>
      </div>
      
      <HomeEarthquakeDisplay />
    </div>
  );
}

