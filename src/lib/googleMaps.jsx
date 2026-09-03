import React, { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsContext = createContext({ isLoaded: false, loadError: undefined });

// Only ever load the Places + Geometry libraries once, at the top of the
// app, and hand every map/autocomplete component the same loaded state via
// context. Loading the script more than once (e.g. one useJsApiLoader per
// component) is the #1 cause of "Google Maps already loaded" console
// errors, so everything downstream should call useGoogleMaps() instead of
// useJsApiLoader directly.
const LIBRARIES = ["places", "geometry"];

export function GoogleMapsProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "agatigito-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}

export const MAP_STYLE = [
  // A muted, low-saturation map skin so it sits quietly behind Agatigito's
  // paper/forest/gold palette instead of clashing with Google's default
  // bright blues and greens.
  { elementType: "geometry", stylers: [{ color: "#F6F1E6" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5C5548" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F6F1E6" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFDF8" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#DFD5BE" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#B8D4C7" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#EFE7D6" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];
