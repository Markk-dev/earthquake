import { Earthquake } from "@/app/actions/earthquake";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, TrendingUp, MapPin } from "lucide-react";
import { DottedSeparator } from "./ui/dottedSeparator";

interface EarthquakeStatsProps {
  earthquakes: Earthquake[];
}

export function EarthquakeStats({ earthquakes }: EarthquakeStatsProps) {
  const total = earthquakes.length;
  const significant = earthquakes.filter((eq) => eq.magnitude >= 5.0).length;
  const major = earthquakes.filter((eq) => eq.magnitude >= 7.0).length;
  const averageMagnitude =
    total > 0
      ? earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / total
      : 0;

  const stats = [
    {
      title: "Total Earthquakes",
      value: total.toString(),
      description: "Last 24 hours",
      icon: Activity,
      color: "text-blue-600",
      ClassValue: "text-blue-600",
    },
    {
      title: "Significant (≥5.0)",
      value: significant.toString(),
      description: "Magnitude 5.0+",
      icon: AlertTriangle,
      color: "text-orange-600",
      ClassValue: "text-orange-600",
    },
    {
      title: "Major (≥7.0)",
      value: major.toString(),
      description: "Magnitude 7.0+",
      icon: TrendingUp,
      color: "text-red-600",
      ClassValue: "text-red-600",
    },
    {
      title: "Avg Magnitude",
      value: averageMagnitude.toFixed(1),
      description: "Average of all events",
      icon: MapPin,
      color: "text-purple-600",
      ClassValue: "text-purple-600 text-2xl",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
           
            <CardContent>
              <div className={`text-2xl font-bold ${stat.ClassValue || ""}`}>{stat.value}</div>
              <DottedSeparator className="my-2" />
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

