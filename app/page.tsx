import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, MapPin, TrendingUp, TestTube } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <main className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Earthquake Monitoring System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time earthquake monitoring and alert system for the Philippines
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Real-Time Data</CardTitle>
              <CardDescription>
                Live earthquake data updated every 60 seconds from PHIVOLCS
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Philippines Focus</CardTitle>
              <CardDescription>
                Filtered data specifically for the Philippines region
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Alert System</CardTitle>
              <CardDescription>
                Get notified of significant earthquakes in your area
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/earthquakes">
              <TrendingUp className="mr-2 h-5 w-5" />
              View Live Earthquakes
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8">
            <Link href="/simulate">
              <TestTube className="mr-2 h-5 w-5" />
              Test Alert System
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
