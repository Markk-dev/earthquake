"use client";

import { useEffect, useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, BellOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Earthquake } from "@/app/actions/earthquake";

interface AlertSystemProps {
  earthquakes: Earthquake[];
  minMagnitude?: number;
  onAlert?: (earthquake: Earthquake) => void;
}

export function AlertSystem({
  earthquakes,
  minMagnitude = 5.0,
  onAlert,
}: AlertSystemProps) {
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | null
  >(null);
  const [currentAlert, setCurrentAlert] = useState<Earthquake | null>(null);
  const [alertedIds, setAlertedIds] = useState<Set<string>>(new Set());

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setAlertsEnabled(permission === "granted");
      return permission === "granted";
    }
    return false;
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback(
    (earthquake: Earthquake) => {
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification(
          `Earthquake Alert: M ${earthquake.magnitude.toFixed(1)}`,
          {
            body: `${earthquake.place}\nTime: ${new Date(
              earthquake.time
            ).toLocaleString()}`,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: earthquake.id,
            requireInteraction: earthquake.magnitude >= 7.0,
            vibrate: earthquake.magnitude >= 7.0 ? [200, 100, 200] : [200],
          }
        );

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto-close after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);
      }
    },
    []
  );

  // Check for new significant earthquakes
  useEffect(() => {
    if (!alertsEnabled || earthquakes.length === 0) return;

    const significantEarthquakes = earthquakes.filter(
      (eq) => eq.magnitude >= minMagnitude && !alertedIds.has(eq.id)
    );

    if (significantEarthquakes.length > 0) {
      // Get the most significant (highest magnitude) earthquake
      const latest = significantEarthquakes.sort(
        (a, b) => b.magnitude - a.magnitude
      )[0];

      setCurrentAlert(latest);
      setAlertedIds((prev) => new Set([...prev, latest.id]));
      showBrowserNotification(latest);
      onAlert?.(latest);
    }
  }, [
    earthquakes,
    alertsEnabled,
    minMagnitude,
    alertedIds,
    showBrowserNotification,
    onAlert,
  ]);

  // Initialize notification permission check
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === "granted") {
        setAlertsEnabled(true);
      }
    }
  }, []);

  const handleEnableAlerts = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      alert(
        "Please enable browser notifications to receive earthquake alerts."
      );
    }
  };

  const handleDisableAlerts = () => {
    setAlertsEnabled(false);
    setCurrentAlert(null);
  };

  const handleDismissAlert = () => {
    setCurrentAlert(null);
  };

  return (
    <div className="space-y-4">
      {/* Alert Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          {alertsEnabled ? (
            <Bell className="h-5 w-5 text-green-600" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">
              {alertsEnabled ? "Alerts Enabled" : "Alerts Disabled"}
            </p>
            <p className="text-sm text-muted-foreground">
              Get notified of earthquakes ≥{minMagnitude.toFixed(1)} magnitude
            </p>
          </div>
        </div>
        {alertsEnabled ? (
          <Button variant="outline" onClick={handleDisableAlerts}>
            <BellOff className="h-4 w-4 mr-2" />
            Disable
          </Button>
        ) : (
          <Button onClick={handleEnableAlerts}>
            <Bell className="h-4 w-4 mr-2" />
            Enable Alerts
          </Button>
        )}
      </div>

      {/* Current Alert */}
      {currentAlert && (
        <Alert
          className={cn(
            "border-2 animate-in slide-in-from-top-5",
            currentAlert.magnitude >= 7.0
              ? "border-red-500 bg-red-50 dark:bg-red-950"
              : currentAlert.magnitude >= 5.0
              ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
              : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
          )}
        >
          <AlertTriangle
            className={cn(
              "h-4 w-4",
              currentAlert.magnitude >= 7.0
                ? "text-red-600"
                : currentAlert.magnitude >= 5.0
                ? "text-orange-600"
                : "text-yellow-600"
            )}
          />
          <AlertTitle className="flex items-center justify-between">
            <span>
              Earthquake Alert: M {currentAlert.magnitude.toFixed(1)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDismissAlert}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertTitle>
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">{currentAlert.place}</p>
              <p className="text-sm">
                Time: {new Date(currentAlert.time).toLocaleString()}
              </p>
              <p className="text-sm">
                Depth: {currentAlert.coordinates.depth.toFixed(1)} km
              </p>
              {currentAlert.magnitude >= 7.0 && (
                <p className="text-sm font-semibold text-red-600">
                  Major earthquake detected! Take necessary precautions.
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

