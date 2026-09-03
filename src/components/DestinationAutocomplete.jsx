import React, { useEffect, useRef } from "react";
import { useGoogleMaps } from "../lib/googleMaps.jsx";

/**
 * A plain text <input> that upgrades itself into a Google Places
 * Autocomplete field once the Maps script has loaded. Falls back to a
 * normal free-text input if there's no API key configured, or if the
 * script hasn't loaded yet — so the app is never blocked on Maps to keep
 * working.
 *
 * onSelect receives { description, lat, lng } when the person picks a
 * suggestion from the dropdown. Typing without picking a suggestion still
 * updates the plain text value via onChange, same as before.
 */
export default function DestinationAutocomplete({ value, onChange, onSelect, placeholder, biasCountry = "rw" }) {
  const { isLoaded } = useGoogleMaps();
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "geometry", "name"],
      componentRestrictions: biasCountry ? { country: biasCountry } : undefined,
    });

    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place || !place.geometry) return;
      const description = place.name || place.formatted_address || "";
      onChange(description);
      onSelect({
        description,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });

    return () => {
      if (window.google?.maps?.event && listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded, biasCountry]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
