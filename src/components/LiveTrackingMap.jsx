import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Car } from "lucide-react";
import { useGoogleMaps, MAP_STYLE } from "../lib/googleMaps.jsx";

const KIGALI_CENTER = { lat: -1.9441, lng: 30.0619 };
const LOCATION_KEY_PREFIX = "agatigito:live-location:";

/*
 * PRODUCTION NOTE — read this before shipping:
 * This component currently persists locations through the browser's
 * localStorage (via the `agatigito:live-location:<tripId>` key), which
 * only works when the driver's and rider's browser sessions are the SAME
 * device — it's here so the tracking UI and map logic are real and
 * testable, but it is NOT actually cross-device tracking yet.
 *
 * To make this work between a driver's phone and a rider's phone, replace
 * the two localStorage calls below (in broadcastLocation and the polling
 * effect) with:
 *   - a POST to your backend, e.g. POST /api/trips/:tripId/location
 *   - polling GET /api/trips/:tripId/location (every 4-6s), OR
 *   - a WebSocket / Firebase Realtime Database / Supabase Realtime
 *     channel per trip, which avoids polling entirely.
 * The rest of this component (the map, the marker, the "how long ago"
 * label) doesn't need to change.
 */

function readStoredLocation(tripId) {
  try {
    const raw = window.localStorage.getItem(LOCATION_KEY_PREFIX + tripId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredLocation(tripId, coords) {
  window.localStorage.setItem(LOCATION_KEY_PREFIX + tripId, JSON.stringify({ ...coords, updatedAt: Date.now() }));
}

/**
 * role: "driver" broadcasts this device's GPS position under the trip's id.
 * role: "rider" or "admin" polls for the latest broadcast position and
 * shows it on a map with a small car marker.
 */
export default function LiveTrackingMap({ tripId, role, label, height = 200 }) {
  const { isLoaded } = useGoogleMaps();
  const [position, setPosition] = useState(null);
  const [permissionError, setPermissionError] = useState("");
  const watchIdRef = useRef(null);

  // Driver device: broadcast real GPS location every time it changes.
  useEffect(() => {
    if (role !== "driver" || !tripId) return;
    if (!("geolocation" in navigator)) {
      setPermissionError("This device doesn't support location sharing.");
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        writeStoredLocation(tripId, coords);
      },
      () => setPermissionError("Location permission denied — turn it on in device settings to share your trip location."),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [role, tripId]);

  // Rider/admin device: poll the last broadcast location.
  useEffect(() => {
    if (role === "driver" || !tripId) return;
    const tick = () => {
      const stored = readStoredLocation(tripId);
      if (stored) setPosition({ lat: stored.lat, lng: stored.lng, updatedAt: stored.updatedAt });
    };
    tick();
    const interval = setInterval(tick, 4000);
    return () => clearInterval(interval);
  }, [role, tripId]);

  if (!isLoaded) {
    return (
      <div style={{ height, borderRadius: 12, background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, color: "#8A8172" }}>
        Add a Maps API key to see live tracking here
      </div>
    );
  }

  const secondsAgo = position?.updatedAt ? Math.round((Date.now() - position.updatedAt) / 1000) : null;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height, borderRadius: 12 }}
        center={position || KIGALI_CENTER}
        zoom={position ? 14 : 12}
        options={{ styles: MAP_STYLE, disableDefaultUI: true, zoomControl: true }}
      >
        {position && (
          <Marker
            position={position}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: 8,
              fillColor: "#1F4D3A",
              fillOpacity: 1,
              strokeColor: "#D9A441",
              strokeWeight: 2,
            }}
            label={label ? { text: label, color: "#F6F1E6", fontSize: "10px", fontWeight: "700" } : undefined}
          />
        )}
      </GoogleMap>
      <p style={{ fontSize: 10.5, color: "#8A8172", margin: "6px 0 0 0", display: "flex", alignItems: "center", gap: 5 }}>
        <Car size={12} />
        {permissionError
          ? permissionError
          : role === "driver"
          ? "Broadcasting your location to this trip's passengers."
          : position
          ? `Last updated ${secondsAgo}s ago`
          : "Waiting for the driver to start sharing location…"}
      </p>
    </div>
  );
}
