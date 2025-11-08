import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { DailyForecast } from "@/components/daily-forecast";

export const metadata: Metadata = {
  title: "Typhoon Monitoring - Philippines | Disaster Monitoring System",
  description: "Typhoon tracking and monitoring for the Philippines region (Coming Soon).",
};

export default function TyphoonPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Typhoon Monitoring
        </h1>
        <p className="text-muted-foreground">
          Typhoon tracking and monitoring for the Philippines region
        </p>
      </div>

    <DailyForecast />
    </div>
  );
}

