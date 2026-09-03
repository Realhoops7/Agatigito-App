import React, { useRef, useState } from "react";
import { Camera, Video, X } from "lucide-react";

// Short video cap — keeps localStorage-backed prototypes from choking on
// huge base64 blobs. A real backend should upload the raw file to object
// storage (S3, Cloudflare R2, etc.) and store a URL instead of a data URL;
// see the PRODUCTION NOTE below.
const MAX_VIDEO_SECONDS = 15;

/**
 * Lets someone attach one photo or one short video to a vibe post, using
 * the device's own camera app via the native <input capture> attribute
 * (this works in mobile browsers and inside a Capacitor WebView without
 * any extra native code). Calls onChange(media | null) where media is
 * { type: "image" | "video", url, durationSec? }.
 *
 * PRODUCTION NOTE: this stores media as an in-memory object URL / data
 * URL, which disappears on refresh and does not scale past a handful of
 * posts in localStorage. Before shipping, swap handleFile's FileReader
 * step for an upload to real storage (S3/R2/Firebase Storage) and keep
 * only the returned URL in the post record.
 */
export default function VibeMediaCapture({ media, onChange }) {
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [videoTooLong, setVideoTooLong] = useState(false);

  const handlePhoto = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ type: "image", url: reader.result });
    reader.readAsDataURL(file);
  };

  const handleVideo = (file) => {
    if (!file) return;
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoEl.src);
      if (videoEl.duration > MAX_VIDEO_SECONDS) {
        setVideoTooLong(true);
        return;
      }
      setVideoTooLong(false);
      const url = window.URL.createObjectURL(file);
      onChange({ type: "video", url, durationSec: Math.round(videoEl.duration) });
    };
    videoEl.src = window.URL.createObjectURL(file);
  };

  if (media) {
    return (
      <div style={{ position: "relative", marginBottom: 10, borderRadius: 10, overflow: "hidden", background: "var(--paper-2)" }}>
        {media.type === "image" ? (
          <img src={media.url} alt="" style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
        ) : (
          <video src={media.url} controls style={{ width: "100%", maxHeight: 220, display: "block" }} />
        )}
        <button
          type="button"
          onClick={() => onChange(null)}
          style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: 999, background: "rgba(22,35,28,0.65)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: videoTooLong ? 6 : 0 }}>
        <button
          type="button"
          className="agt-verify-btn pending"
          style={{ display: "flex", alignItems: "center", gap: 5 }}
          onClick={() => photoInputRef.current?.click()}
        >
          <Camera size={13} /> Add photo
        </button>
        <button
          type="button"
          className="agt-verify-btn pending"
          style={{ display: "flex", alignItems: "center", gap: 5 }}
          onClick={() => videoInputRef.current?.click()}
        >
          <Video size={13} /> Add short video
        </button>
      </div>
      {videoTooLong && (
        <p style={{ fontSize: 10.5, color: "#B33A3A", margin: "0 0 6px 0" }}>
          Keep videos under {MAX_VIDEO_SECONDS} seconds — trim it and try again.
        </p>
      )}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => handlePhoto(e.target.files?.[0])}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => handleVideo(e.target.files?.[0])}
      />
    </div>
  );
}
