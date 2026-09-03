import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../lib/googleMaps.jsx";
import { MAP_STYLE } from "../lib/googleMaps.jsx";

const KIGALI_CENTER = { lat: -1.9441, lng: 30.0619 };

/**
 * Renders a small map with the driving route between `origin` and
 * `destination` (each { lat, lng } or null). Calls onRoute({ distanceKm,
 * durationMin }) once Directions responds, so the caller (the post-trip
 * form, the booking flow) can feed real road distance into the Fair Price
 * calculator instead of the haversine fallback in App.jsx.
 */
export default function RouteMap({ origin, destination, onRoute, height = 180 }) {
  const { isLoaded } = useGoogleMaps();
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !origin || !destination || !window.google) {
      setDirections(null);
      return;
    }
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setError(false);
          const leg = result.routes[0]?.legs[0];
          if (leg && onRoute) {
            onRoute({
              distanceKm: Math.round((leg.distance?.value || 0) / 100) / 10,
              durationMin: Math.round((leg.duration?.value || 0) / 60),
            });
          }
        } else {
          setDirections(null);
          setError(true);
        }
      }
    );
  }, [isLoaded, origin, destination]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoaded) {
    return (
      <div style={{ height, borderRadius: 12, background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, color: "#8A8172" }}>
        Add a Maps API key to see the live route here
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height, borderRadius: 12 }}
      center={origin || destination || KIGALI_CENTER}
      zoom={origin && destination ? 8 : 7}
      options={{ styles: MAP_STYLE, disableDefaultUI: true, zoomControl: true }}
    >
      {directions ? (
        <DirectionsRenderer
          directions={directions}
          options={{ polylineOptions: { strokeColor: "#1F4D3A", strokeWeight: 4 }, suppressMarkers: false }}
        />
      ) : (
        <>
          {origin && <Marker position={origin} label="A" />}
          {destination && <Marker position={destination} label="B" />}
        </>
      )}
      {error && (
        <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, fontSize: 10.5, color: "#B33A3A", background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 8 }}>
          Couldn't calculate a driving route between these points.
        </div>
      )}
    </GoogleMap>
  );
}
