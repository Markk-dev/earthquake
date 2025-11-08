import { Earthquake } from "@/app/actions/earthquake";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MapPin, Clock, TrendingUp } from "lucide-react";

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7.0) return "destructive";
  if (magnitude >= 5.0) return "bg-orange-500 hover:bg-orange-600";
  if (magnitude >= 4.0) return "bg-yellow-500 hover:bg-yellow-600";
  return "bg-blue-500 hover:bg-blue-600";
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface EarthquakeListProps {
  earthquakes: Earthquake[];
}

export function EarthquakeList({ earthquakes }: EarthquakeListProps) {
  if (earthquakes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Recent Earthquakes</CardTitle>
          <CardDescription>
            No earthquakes detected in the Philippines region in the last 24 hours.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Earthquakes in Philippines
            </CardTitle>
            <CardDescription>
              {earthquakes.length} earthquake{earthquakes.length !== 1 ? "s" : ""} detected in the last 24 hours
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Magnitude</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Depth</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earthquakes.map((earthquake) => (
              <TableRow key={earthquake.id}>
                <TableCell>
                  <Badge
                    className={getMagnitudeColor(earthquake.magnitude)}
                    variant={earthquake.magnitude >= 7.0 ? "destructive" : "default"}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {earthquake.magnitude.toFixed(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{earthquake.place}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {earthquake.coordinates.latitude.toFixed(4)}°N,{" "}
                    {earthquake.coordinates.longitude.toFixed(4)}°E
                  </div>
                </TableCell>
                <TableCell>
                  {earthquake.coordinates.depth.toFixed(1)} km
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(earthquake.time)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      earthquake.status === "reviewed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {earthquake.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

