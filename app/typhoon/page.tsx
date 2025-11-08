import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

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

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Wind className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-3xl">Coming Soon</CardTitle>
          <CardDescription className="text-lg">
            Typhoon monitoring and tracking features are currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            This feature will provide real-time typhoon tracking, alerts, and monitoring 
            for the Philippines region.
          </p>
          <Button asChild>
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

