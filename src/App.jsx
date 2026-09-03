import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MapPin, Search, Users, Star, ShieldCheck, Wifi, Wind, PawPrint,
  Music, Cigarette, Battery, Luggage, ChevronRight, X, Plus, Minus,
  Check, MessageCircle, Sparkles, Mountain, Moon, Building2, ArrowRight,
  Car, Phone, CreditCard, Smartphone, Clock, Route as RouteIcon,
  Award, TrendingUp, Camera, LogOut, Compass, AlertTriangle, Radio, Bell, ImagePlus
} from "lucide-react";
import DestinationAutocomplete from "./components/DestinationAutocomplete.jsx";
import RouteMap from "./components/RouteMap.jsx";
import LiveTrackingMap from "./components/LiveTrackingMap.jsx";
import VibeMediaCapture from "./components/VibeMediaCapture.jsx";

/* ---------------------------------------------------------
   AGATIGITO — "Never Travel Alone"
   Design tokens
   ink:    #16231C  paper: #F6F1E6  forest: #1F4D3A
   clay:   #B5542A  gold:  #D9A441  line:  #DFD5BE
--------------------------------------------------------- */

const STYLES = `
  .agt {
    --ink: #16231C;
    --paper: #F6F1E6;
    --paper-2: #EFE7D6;
    --forest: #1F4D3A;
    --forest-2: #17392B;
    --forest-light: #3C7A5D;
    --clay: #B5542A;
    --clay-light: #D97B4F;
    --gold: #D9A441;
    --line: #DFD5BE;
    --card: #FFFDF8;
    --white: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100%;
    width: 100%;
    position: relative;
  }
  .agt * { box-sizing: border-box; }
  .agt .disp { font-family: 'Fraunces', Georgia, serif; }
  .agt .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

  /* ---- Header ---- */
  .agt-header {
    background: var(--forest);
    color: var(--paper);
    padding: 18px 20px 0 20px;
    position: sticky;
    top: 0;
    z-index: 40;
  }
  .agt-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .agt-logo {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .agt-logo-mark {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 600;
    font-size: 22px;
    letter-spacing: 0.01em;
    color: var(--gold);
  }
  .agt-logo-tag {
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(246,241,230,0.6);
    font-weight: 500;
  }
  .agt-profile-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    padding: 6px 12px 6px 8px;
    font-size: 12px;
    color: var(--paper);
  }
  .agt-avatar-sm {
    width: 20px; height: 20px; border-radius: 999px;
    background: var(--gold); color: var(--forest-2);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700;
  }
  .agt-tabs {
    display: flex;
    gap: 4px;
  }
  .agt-tab {
    flex: 1;
    text-align: center;
    padding: 11px 4px;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: rgba(246,241,230,0.55);
    border-bottom: 2px solid transparent;
    cursor: pointer;
    background: none;
    border-top: none; border-left: none; border-right: none;
    transition: color 0.15s ease;
  }
  .agt-tab.active {
    color: var(--paper);
    border-bottom-color: var(--gold);
  }

  /* ---- Route line signature ---- */
  .agt-route-line {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
  }
  .agt-route-dot {
    width: 7px; height: 7px; border-radius: 999px;
    background: var(--forest);
    flex-shrink: 0;
  }
  .agt-route-dot.end { background: var(--clay); }
  .agt-route-dash {
    flex: 1;
    height: 0;
    border-top: 2px dashed var(--line);
    min-width: 12px;
  }
  .agt-route-line.on-dark .agt-route-dot { background: var(--gold); }
  .agt-route-line.on-dark .agt-route-dash { border-top-color: rgba(246,241,230,0.3); }

  /* ---- Search / filters ---- */
  .agt-search-bar {
    background: var(--card);
    border-radius: 14px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 20px rgba(22,35,28,0.18);
    margin-bottom: -22px;
    position: relative;
    z-index: 5;
  }
  .agt-search-bar input {
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
    flex: 1;
    color: var(--ink);
    font-family: 'Inter', sans-serif;
  }
  .agt-search-bar input::placeholder { color: #9C9284; }

  .agt-body {
    padding: 40px 16px 90px 16px;
    max-width: 480px;
    margin: 0 auto;
  }

  .agt-filters {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 2px 6px 2px;
    margin-bottom: 18px;
    scrollbar-width: none;
  }
  .agt-filters::-webkit-scrollbar { display: none; }
  .agt-chip {
    white-space: nowrap;
    font-size: 12.5px;
    font-weight: 600;
    padding: 7px 13px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--card);
    color: var(--ink);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.15s ease;
  }
  .agt-chip.active {
    background: var(--forest);
    border-color: var(--forest);
    color: var(--paper);
  }

  .agt-section-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
    color: var(--forest-light);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* ---- Trip ticket card ---- */
  .agt-ticket {
    background: var(--card);
    border-radius: 16px;
    border: 1px solid var(--line);
    margin-bottom: 14px;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    position: relative;
  }
  .agt-ticket:active { transform: scale(0.985); }
  .agt-ticket:hover { box-shadow: 0 6px 18px rgba(22,35,28,0.10); }
  .agt-ticket.full { opacity: 0.6; cursor: not-allowed; }
  .agt-ticket.full:active { transform: none; }

  .agt-ticket-top {
    padding: 14px 16px 12px 16px;
  }
  .agt-ticket-route-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .agt-ticket-place {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 600;
    font-size: 16px;
  }
  .agt-ticket-meta {
    display: flex;
    gap: 10px;
    margin-top: 8px;
    font-size: 11.5px;
    color: #6B6355;
  }
  .agt-ticket-meta span { display: flex; align-items: center; gap: 4px; }

  .agt-ticket-perf {
    height: 0;
    border-top: 2px dashed var(--line);
    position: relative;
    margin: 0 -1px;
  }
  .agt-ticket-perf::before, .agt-ticket-perf::after {
    content: '';
    position: absolute;
    width: 16px; height: 16px;
    background: var(--paper);
    border-radius: 999px;
    top: -8px;
  }
  .agt-ticket-perf::before { left: -9px; }
  .agt-ticket-perf::after { right: -9px; }

  .agt-ticket-bottom {
    padding: 12px 16px 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .agt-driver {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .agt-avatar {
    width: 34px; height: 34px; border-radius: 999px;
    background: var(--forest);
    color: var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px;
    flex-shrink: 0;
  }
  .agt-driver-name { font-size: 12.5px; font-weight: 600; line-height: 1.3; }
  .agt-driver-sub {
    font-size: 10.5px;
    color: #8A8172;
    display: flex; align-items: center; gap: 4px;
  }
  .agt-price {
    text-align: right;
  }
  .agt-price-num {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    font-size: 15px;
    color: var(--clay);
  }
  .agt-price-sub { font-size: 10px; color: #8A8172; }

  .agt-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    padding: 3px 7px;
    border-radius: 6px;
  }
  .agt-badge.women { background: #F3E1E8; color: #A23A63; }
  .agt-badge.gold { background: #FBEED1; color: #96701C; }
  .agt-badge.seats { background: var(--paper-2); color: var(--forest); }
  .agt-badge.full { background: #EDE1DA; color: #8A5A3D; }

  /* ---- Empty / CTA ---- */
  .agt-fab {
    position: fixed;
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--clay);
    color: var(--white);
    border: none;
    border-radius: 999px;
    padding: 13px 22px;
    font-weight: 700;
    font-size: 13.5px;
    display: flex;
    align-items: center;
    gap: 7px;
    box-shadow: 0 10px 24px rgba(181,84,42,0.4);
    cursor: pointer;
    z-index: 30;
  }

  /* ---- Detail sheet ---- */
  .agt-overlay {
    position: absolute;
    inset: 0;
    background: rgba(22,35,28,0.5);
    z-index: 50;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .agt-sheet {
    background: var(--paper);
    width: 100%;
    max-width: 480px;
    max-height: 88%;
    border-radius: 22px 22px 0 0;
    overflow-y: auto;
    animation: agt-slide-up 0.25s ease;
    position: relative;
  }
  @keyframes agt-slide-up {
    from { transform: translateY(24px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .agt-sheet-handle {
    width: 36px; height: 4px; border-radius: 999px;
    background: var(--line);
    margin: 10px auto 6px auto;
  }
  .agt-sheet-close {
    position: absolute;
    top: 14px; right: 14px;
    width: 30px; height: 30px;
    border-radius: 999px;
    background: var(--card);
    border: 1px solid var(--line);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    z-index: 5;
  }
  .agt-sheet-hero {
    background: var(--forest);
    color: var(--paper);
    padding: 18px 20px 22px 20px;
    margin-top: -2px;
  }
  .agt-sheet-body { padding: 18px 20px 28px 20px; }

  .agt-amenity-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 14px 0 18px 0;
  }
  .agt-amenity {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 10px 4px;
    font-size: 9.5px;
    text-align: center;
    color: #5C5548;
    font-weight: 600;
  }
  .agt-amenity svg { color: var(--forest); }

  .agt-reviewbox {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 12.5px;
    color: #4B4536;
    margin-bottom: 8px;
    line-height: 1.5;
  }
  .agt-review-name { font-weight: 700; font-size: 11.5px; color: var(--ink); margin-bottom: 2px; }

  .agt-seat-stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px 16px;
    margin: 16px 0;
  }
  .agt-stepper-btn {
    width: 34px; height: 34px;
    border-radius: 999px;
    border: 1px solid var(--forest);
    background: var(--white);
    color: var(--forest);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }
  .agt-stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .agt-primary-btn {
    width: 100%;
    background: var(--clay);
    color: var(--white);
    border: none;
    border-radius: 13px;
    padding: 15px;
    font-weight: 700;
    font-size: 14.5px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .agt-secondary-btn {
    width: 100%;
    background: var(--card);
    border: 1.5px solid var(--forest);
    color: var(--forest);
    border-radius: 13px;
    padding: 14px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
  }

  .agt-pay-option {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1.5px solid var(--line);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
  }
  .agt-pay-option.sel {
    border-color: var(--forest);
    background: var(--paper-2);
  }
  .agt-pay-radio {
    width: 16px; height: 16px;
    border-radius: 999px;
    border: 2px solid var(--forest);
    flex-shrink: 0;
    position: relative;
  }
  .agt-pay-radio.on::after {
    content: '';
    position: absolute;
    inset: 2.5px;
    background: var(--forest);
    border-radius: 999px;
  }

  /* ---- Room card ---- */
  .agt-room-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 14px;
    cursor: pointer;
  }
  .agt-room-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: var(--paper-2);
    color: var(--forest);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
  }
  .agt-room-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; margin-bottom: 3px; }
  .agt-room-sub { font-size: 12px; color: #8A8172; margin-bottom: 10px; }
  .agt-room-avatars { display: flex; align-items: center; }
  .agt-avatar-sm2 {
    width: 24px; height: 24px; border-radius: 999px;
    background: var(--forest); color: var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700;
    border: 2px solid var(--card);
    flex-shrink: 0;
  }
  .agt-room-avatars .agt-avatar-sm2 { margin-left: -8px; }
  .agt-room-avatars .agt-avatar-sm2:first-child { margin-left: 0; }

  /* ---- Post form ---- */
  .agt-field { margin-bottom: 14px; }
  .agt-field label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--forest-light);
    margin-bottom: 6px;
  }
  .agt-field input, .agt-field select {
    width: 100%;
    padding: 12px 14px;
    border-radius: 11px;
    border: 1px solid var(--line);
    background: var(--card);
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: var(--ink);
    outline: none;
  }
  .agt-field input:focus, .agt-field select:focus { border-color: var(--forest); }
  .agt-field-row { display: flex; gap: 10px; }
  .agt-field-row .agt-field { flex: 1; }

  /* ---- Success screen ---- */
  .agt-success {
    text-align: center;
    padding: 30px 20px 10px 20px;
  }
  .agt-success-check {
    width: 62px; height: 62px;
    border-radius: 999px;
    background: var(--forest);
    color: var(--paper);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px auto;
  }
  .agt-ticket-stub {
    border: 1.5px dashed var(--line);
    border-radius: 14px;
    padding: 18px;
    text-align: left;
    margin: 20px 0;
    background: var(--paper-2);
  }
  .agt-ticket-stub-row {
    display: flex;
    justify-content: space-between;
    font-size: 12.5px;
    padding: 6px 0;
    border-bottom: 1px dashed var(--line);
  }
  .agt-ticket-stub-row:last-child { border-bottom: none; }
  .agt-ticket-stub-row span:first-child { color: #8A8172; }
  .agt-ticket-stub-row span:last-child { font-weight: 700; font-family: 'JetBrains Mono', monospace; }

  .agt-toast {
    position: fixed;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--ink);
    color: var(--paper);
    padding: 10px 18px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    z-index: 80;
    display: flex;
    align-items: center;
    gap: 7px;
    animation: agt-fade-in 0.2s ease;
  }
  @keyframes agt-fade-in { from { opacity: 0; transform: translate(-50%, -8px);} to { opacity: 1; transform: translate(-50%, 0);} }

  /* ---- Motion ---- */
  @keyframes agtFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes agtFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes agtCarShuttle {
    0% { left: 1px; transform: translateY(-50%) scaleX(1); }
    46% { left: calc(100% - 15px); transform: translateY(-50%) scaleX(1); }
    50% { left: calc(100% - 15px); transform: translateY(-50%) scaleX(-1); }
    96% { left: 1px; transform: translateY(-50%) scaleX(-1); }
    100% { left: 1px; transform: translateY(-50%) scaleX(1); }
  }
  @keyframes agtBreathe {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
  }

  .agt-body { animation: agtFadeUp 0.32s ease both; }

  .agt-branch-grid .agt-branch-card { animation: agtFadeUp 0.4s ease both; }
  .agt-branch-grid .agt-branch-card:nth-child(1) { animation-delay: 0.02s; }
  .agt-branch-grid .agt-branch-card:nth-child(2) { animation-delay: 0.05s; }
  .agt-branch-grid .agt-branch-card:nth-child(3) { animation-delay: 0.08s; }
  .agt-branch-grid .agt-branch-card:nth-child(4) { animation-delay: 0.11s; }
  .agt-branch-grid .agt-branch-card:nth-child(5) { animation-delay: 0.14s; }
  .agt-branch-grid .agt-branch-card:nth-child(6) { animation-delay: 0.17s; }
  .agt-branch-grid .agt-branch-card:nth-child(7) { animation-delay: 0.20s; }
  .agt-branch-grid .agt-branch-card:nth-child(8) { animation-delay: 0.23s; }
  .agt-branch-grid .agt-branch-card:nth-child(9) { animation-delay: 0.26s; }
  .agt-branch-grid .agt-branch-card:nth-child(10) { animation-delay: 0.29s; }
  .agt-branch-grid .agt-branch-card:nth-child(11) { animation-delay: 0.32s; }
  .agt-branch-grid .agt-branch-card:nth-child(12) { animation-delay: 0.35s; }
  .agt-branch-grid .agt-branch-card:nth-child(13) { animation-delay: 0.38s; }
  @media (hover: hover) {
    .agt-branch-card { transition: transform 0.12s ease, box-shadow 0.12s ease; }
    .agt-branch-card:hover { transform: translateY(-3px); box-shadow: 0 8px 18px rgba(31,77,58,0.10); }
  }

  .agt-primary-btn, .agt-secondary-btn, .agt-chip, .agt-sos-btn, .agt-circle-btn {
    transition: transform 0.1s ease, opacity 0.1s ease;
  }
  .agt-primary-btn:active, .agt-secondary-btn:active, .agt-sos-btn:active { transform: scale(0.97); }
  .agt-chip:active, .agt-circle-btn:active { transform: scale(0.94); }

  /* ---- Travel companion motif: two dots, never travelling alone ---- */
  .agt-travel-pulse {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 10px;
    vertical-align: middle;
  }
  .agt-travel-dot {
    width: 5px; height: 5px; border-radius: 999px;
    background: var(--gold);
    flex-shrink: 0;
  }
  .agt-travel-line {
    width: 100%;
    height: 1px;
    background-image: linear-gradient(to right, rgba(217,164,65,0.55) 0 3px, transparent 3px 6px);
    background-size: 6px 1px;
    background-repeat: repeat-x;
    margin: 0 3px;
  }
  .agt-travel-shuttle {
    position: absolute;
    top: 50%;
    left: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    filter: drop-shadow(0 0 3px rgba(217,164,65,0.7));
    transform: translateY(-50%);
    animation: agtCarShuttle 2.8s ease-in-out infinite;
  }
  .agt-onboard-mark { animation: agtFadeUp 0.5s ease both; }
  .agt-onboard-sub { animation: agtFadeUp 0.5s ease 0.08s both; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .agt-onboard-card { animation: agtFadeUp 0.5s ease 0.16s both; }
  .agt-onboard-note { animation: agtFadeUp 0.5s ease 0.24s both; }
  .agt-lang-toggle.onboard { animation: agtFadeUp 0.5s ease both; }
  .agt-logo-tag { display: flex; align-items: center; gap: 6px; }
  .agt-logo-tag .agt-travel-pulse { animation: agtBreathe 3s ease-in-out infinite; }

  /* ---- Section reveals & lists ---- */
  .agt-ticket, .agt-tour-card, .agt-corp-card, .agt-parcel-card, .agt-mytrip-card, .agt-circle-card {
    animation: agtFadeUp 0.3s ease both;
  }

  /* ---- Status stepper dot pulse for current step ---- */
  .agt-status-step.current .agt-status-dot { animation: agtBreathe 1.6s ease-in-out infinite; }

  /* ---- Live activity ---- */
  .agt-live-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 7px 14px 7px 8px;
    margin: 2px 0 20px 0;
    animation: agtFadeUp 0.4s ease 0.1s both;
  }
  .agt-live-avatars {
    display: flex;
    align-items: center;
  }
  .agt-live-avatar {
    width: 24px; height: 24px; border-radius: 999px;
    background: var(--forest);
    color: var(--paper);
    font-size: 9px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--card);
    margin-left: -8px;
  }
  .agt-live-avatar:first-child { margin-left: 0; }
  .agt-live-dot {
    width: 7px; height: 7px; border-radius: 999px;
    background: #2E7D46;
    flex-shrink: 0;
    animation: agtLivePulse 1.8s ease-out infinite;
  }
  @keyframes agtLivePulse {
    0% { box-shadow: 0 0 0 0 rgba(46,125,70,0.5); }
    70% { box-shadow: 0 0 0 6px rgba(46,125,70,0); }
    100% { box-shadow: 0 0 0 0 rgba(46,125,70,0); }
  }
  .agt-live-text { font-size: 12px; font-weight: 700; color: var(--ink); white-space: nowrap; }
  .agt-live-text strong { color: var(--forest); }

  /* ---- Admin ---- */
  .agt-admin-overlay {
    position: fixed;
    inset: 0;
    background: #10201A;
    z-index: 200;
    overflow-y: auto;
    color: var(--paper);
  }
  .agt-admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid rgba(246,241,230,0.15);
    position: sticky;
    top: 0;
    background: #10201A;
    z-index: 2;
  }
  .agt-admin-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: var(--gold); }
  .agt-admin-body { max-width: 560px; margin: 0 auto; padding: 20px; }
  .agt-admin-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 22px;
  }
  .agt-admin-stat {
    background: rgba(246,241,230,0.06);
    border: 1px solid rgba(246,241,230,0.12);
    border-radius: 14px;
    padding: 14px;
  }
  .agt-admin-stat-num { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; color: var(--gold); }
  .agt-admin-stat-label { font-size: 10.5px; color: rgba(246,241,230,0.6); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
  .agt-admin-section-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(246,241,230,0.55);
    margin: 22px 0 10px 0;
  }
  .agt-admin-card {
    background: rgba(246,241,230,0.06);
    border: 1px solid rgba(246,241,230,0.12);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 9px;
  }
  .agt-admin-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
  .agt-admin-card-name { font-weight: 700; font-size: 13px; }
  .agt-admin-card-sub { font-size: 11px; color: rgba(246,241,230,0.55); margin-top: 2px; }
  .agt-admin-card-note { font-size: 12px; color: rgba(246,241,230,0.85); margin-bottom: 8px; line-height: 1.4; }
  .agt-admin-actions { display: flex; gap: 8px; }
  .agt-admin-btn {
    flex: 1;
    border: none;
    border-radius: 8px;
    padding: 8px;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
  }
  .agt-admin-btn.approve { background: var(--forest-light, #E4EEE2); color: #1F4D3A; }
  .agt-admin-btn.reject { background: rgba(179,58,58,0.15); color: #E39B9B; }
  .agt-admin-btn.resolve { background: rgba(217,164,65,0.18); color: var(--gold); }
  .agt-admin-empty { font-size: 12px; color: rgba(246,241,230,0.45); padding: 6px 0; }
  .agt-admin-login-card {
    max-width: 320px;
    margin: 18vh auto 0 auto;
    text-align: center;
    padding: 0 24px;
  }
  .agt-admin-pin-input {
    width: 100%;
    text-align: center;
    letter-spacing: 0.3em;
    font-size: 20px;
    background: rgba(246,241,230,0.08);
    border: 1px solid rgba(246,241,230,0.25);
    border-radius: 12px;
    padding: 14px;
    color: var(--paper);
    outline: none;
    margin: 18px 0 14px 0;
  }
  .agt-admin-pin-input::placeholder { color: rgba(246,241,230,0.3); letter-spacing: 0.1em; }
  .agt-admin-close {
    position: absolute;
    top: 18px;
    right: 20px;
    color: rgba(246,241,230,0.6);
    cursor: pointer;
  }

  /* ---- Notifications ---- */
  .agt-bell-wrap { position: relative; cursor: pointer; display: flex; align-items: center; }
  .agt-bell-badge {
    position: absolute;
    top: -5px; right: -5px;
    background: var(--clay);
    color: var(--white);
    font-size: 9px;
    font-weight: 700;
    min-width: 15px;
    height: 15px;
    border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px;
  }
  .agt-notif-item {
    display: flex;
    gap: 11px;
    padding: 12px 4px;
    border-bottom: 1px solid var(--line);
  }
  .agt-notif-item:last-child { border-bottom: none; }
  .agt-notif-icon {
    width: 32px; height: 32px; border-radius: 999px;
    background: var(--paper-2);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }
  .agt-notif-title { font-weight: 700; font-size: 13px; color: var(--ink); }
  .agt-notif-body { font-size: 12px; color: #8A8172; margin-top: 2px; line-height: 1.4; }
  .agt-notif-time { font-size: 10.5px; color: #B0A896; margin-top: 4px; }
  .agt-notif-item.unread .agt-notif-icon { background: rgba(217,164,65,0.18); }

  /* ---- Driver earnings ---- */
  .agt-earnings-card {
    background: var(--forest);
    border-radius: 16px;
    padding: 16px 18px;
    margin-bottom: 16px;
  }
  .agt-earnings-row { display: flex; justify-content: space-between; gap: 12px; }
  .agt-earnings-num { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: var(--gold); }
  .agt-earnings-num.muted { color: rgba(246,241,230,0.75); }
  .agt-earnings-label { font-size: 10.5px; color: rgba(246,241,230,0.65); margin-top: 3px; line-height: 1.3; }

  /* ---- Mini bar chart (admin) ---- */
  .agt-minichart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 110px;
    margin-bottom: 4px;
  }
  .agt-minichart-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }
  .agt-minichart-val { font-size: 10px; color: rgba(246,241,230,0.6); margin-bottom: 4px; }
  .agt-minichart-bar-track {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
  }
  .agt-minichart-bar {
    width: 100%;
    background: var(--gold);
    border-radius: 4px 4px 0 0;
    min-height: 3px;
    animation: agtFadeUp 0.5s ease both;
  }
  .agt-minichart-label { font-size: 9.5px; color: rgba(246,241,230,0.5); margin-top: 6px; }

  /* ---- Onboarding: photo & vehicle ---- */
  .agt-photo-picker {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }
  .agt-photo-circle {
    width: 56px; height: 56px;
    border-radius: 999px;
    background: var(--paper-2);
    border: 1.5px dashed var(--forest-light);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    overflow: hidden;
    flex-shrink: 0;
  }
  .agt-photo-circle img { width: 100%; height: 100%; object-fit: cover; }
  .agt-photo-hint { font-size: 11.5px; color: #8A8172; }
  .agt-vehicle-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: var(--paper-2);
    border-radius: 12px;
    margin-bottom: 14px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--ink);
  }

  /* ---- Onboarding ---- */
  .agt-onboard-overlay {
    position: absolute;
    inset: 0;
    background: var(--forest);
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px 26px;
  }
  .agt-onboard-mark {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 30px;
    font-weight: 600;
    color: var(--gold);
    margin-bottom: 4px;
  }
  .agt-onboard-sub {
    color: rgba(246,241,230,0.7);
    font-size: 13px;
    margin-bottom: 30px;
  }
  .agt-onboard-card {
    background: var(--paper);
    border-radius: 18px;
    padding: 22px 20px;
  }
  .agt-onboard-card .agt-field label { color: var(--forest); }
  .agt-onboard-note {
    font-size: 11px;
    color: rgba(246,241,230,0.55);
    margin-top: 16px;
    line-height: 1.5;
    text-align: center;
  }

  /* ---- Profile / levels ---- */
  .agt-level-card {
    background: var(--forest);
    color: var(--paper);
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 18px;
  }
  .agt-level-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .agt-level-avatar {
    width: 52px; height: 52px; border-radius: 999px;
    background: var(--gold); color: var(--forest-2);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 18px;
    flex-shrink: 0;
  }
  .agt-level-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(217,164,65,0.18);
    color: var(--gold);
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 3px 8px;
    border-radius: 999px;
    margin-top: 4px;
  }
  .agt-level-bar-track {
    height: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.15);
    overflow: hidden;
    margin: 8px 0 4px 0;
  }
  .agt-level-bar-fill {
    height: 100%;
    background: var(--gold);
    border-radius: 999px;
  }
  .agt-level-caption {
    font-size: 11px;
    color: rgba(246,241,230,0.65);
  }
  .agt-stat-row {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
  }
  .agt-stat-box {
    flex: 1;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 12px;
    text-align: center;
  }
  .agt-stat-num { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 17px; color: var(--forest); }
  .agt-stat-label { font-size: 10px; color: #8A8172; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }

  .agt-verify-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 10px;
    background: var(--card);
  }
  .agt-verify-left { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; }
  .agt-verify-btn {
    font-size: 11.5px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
  }
  .agt-verify-btn.done { background: #E3EFE8; color: var(--forest); }
  .agt-verify-btn.pending { background: var(--forest); color: var(--paper); }

  /* ---- Smart match ---- */
  .agt-match-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: var(--paper-2);
    border: 1px dashed var(--forest-light);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 14px;
    font-size: 12px;
    color: #3E4A3F;
    line-height: 1.5;
  }
  .agt-match-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    padding: 7px 10px;
    background: rgba(217,164,65,0.12);
    border: 1px solid rgba(217,164,65,0.35);
    border-radius: 9px;
    font-size: 11px;
    color: var(--forest-2);
    line-height: 1.4;
  }
  .agt-match-row strong { color: var(--forest); }
  .agt-match-pts {
    display: flex;
    justify-content: space-between;
    font-size: 10.5px;
    color: #8A8172;
    margin-top: 3px;
  }
  /* ---- Imigongo-inspired triangle strip (decorative motif) ---- */
  .agt-imigongo-strip {
    display: flex;
    width: 100%;
    overflow: hidden;
  }
  /* ---- Seat map ---- */
  .agt-seat-map {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px 16px 16px 16px;
    margin: 14px 0;
  }
  .agt-seat-legend {
    display: flex;
    gap: 14px;
    font-size: 10.5px;
    color: #8A8172;
    margin-bottom: 12px;
  }
  .agt-seat-legend-dot {
    width: 9px; height: 9px;
    border-radius: 3px;
    display: inline-block;
    margin-right: 4px;
    vertical-align: -1px;
  }
  .agt-seat-front-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    max-width: 66%;
  }
  .agt-seat-back-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .agt-seat-driver, .agt-seat {
    aspect-ratio: 1;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex: 1;
  }
  .agt-seat-driver {
    background: var(--paper-2);
    color: #8A8172;
    border: 1px solid var(--line);
    flex-direction: column;
    gap: 2px;
    font-size: 9px;
    font-weight: 600;
  }
  .agt-seat {
    background: var(--white);
    border: 1.5px solid var(--line);
    color: var(--ink);
    cursor: pointer;
  }
  .agt-seat.selected {
    background: var(--forest);
    border-color: var(--forest);
    color: var(--gold);
  }
  .agt-seat.taken {
    background: var(--paper-2);
    border-color: var(--line);
    color: #B7AE9C;
    cursor: not-allowed;
  }
  /* ---- Home / "Where are you going?" ---- */
  .agt-home-hero {
    padding: 6px 2px 22px 2px;
  }
  .agt-home-greet {
    font-size: 13px;
    color: #8A8172;
    margin-bottom: 2px;
  }
  .agt-home-question {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 26px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--ink);
  }
  .agt-branch-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 20px;
  }
  .agt-branch-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 16px 14px;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .agt-branch-card:active { transform: scale(0.97); }
  .agt-branch-card.wide { grid-column: span 2; display: flex; align-items: center; gap: 14px; }
  .agt-branch-icon {
    width: 38px; height: 38px;
    border-radius: 11px;
    background: var(--paper-2);
    color: var(--forest);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
  }
  .agt-branch-card.wide .agt-branch-icon { margin-bottom: 0; flex-shrink: 0; }
  .agt-branch-card.tonight { background: var(--forest); border-color: var(--forest); color: var(--paper); }
  .agt-branch-card.tonight .agt-branch-icon { background: rgba(217,164,65,0.18); color: var(--gold); }
  .agt-branch-title { font-weight: 700; font-size: 14px; margin-bottom: 3px; }
  .agt-branch-sub { font-size: 11px; color: #8A8172; line-height: 1.35; }
  .agt-branch-card.tonight .agt-branch-sub { color: rgba(246,241,230,0.65); }
  /* ---- Vibes / community feed ---- */
  .agt-vibe-composer {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 18px;
  }
  .agt-vibe-composer textarea {
    width: 100%;
    border: none;
    outline: none;
    background: none;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    color: var(--ink);
    resize: none;
    min-height: 54px;
  }
  .agt-vibe-composer textarea::placeholder { color: #9C9284; }
  .agt-vibe-composer-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 10px;
    border-top: 1px solid var(--line);
  }
  .agt-vibe-anon-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: #6B6355;
    cursor: pointer;
  }
  .agt-vibe-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 12px;
  }
  .agt-vibe-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .agt-vibe-mood {
    width: 30px; height: 30px;
    border-radius: 999px;
    background: var(--paper-2);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }
  .agt-vibe-author { font-size: 12.5px; font-weight: 700; }
  .agt-vibe-text { font-size: 13px; line-height: 1.55; color: #3E3A30; margin-bottom: 10px; }
  .agt-vibe-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 11.5px;
    color: #8A8172;
  }
  .agt-vibe-actions button {
    display: flex; align-items: center; gap: 5px;
    background: none; border: none; padding: 0;
    font-size: 11.5px; color: #8A8172; cursor: pointer;
    font-family: 'Inter', sans-serif;
  }
  .agt-vibe-actions button.liked { color: var(--clay); font-weight: 700; }

  /* ---- Trust Score ---- */
  .agt-trust-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 18px;
  }
  .agt-trust-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .agt-trust-score-num {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 22px;
    color: var(--forest);
  }
  .agt-trust-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    padding: 5px 0;
    color: #6B6355;
  }
  .agt-trust-row.ok { color: var(--ink); font-weight: 600; }

  /* ---- Travel personality ---- */
  .agt-personality-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
  }
  .agt-personality-chip {
    font-size: 12px;
    font-weight: 600;
    padding: 7px 12px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--card);
    cursor: pointer;
  }
  .agt-personality-chip.active {
    background: var(--forest);
    border-color: var(--forest);
    color: var(--paper);
  }

  /* ---- Circles ---- */
  .agt-circle-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }
  .agt-circle-icon {
    width: 38px; height: 38px; border-radius: 999px;
    background: var(--paper-2);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .agt-circle-name { font-weight: 700; font-size: 13.5px; }
  .agt-circle-sub { font-size: 11px; color: #8A8172; margin-top: 2px; }
  .agt-circle-btn {
    margin-left: auto;
    font-size: 11.5px;
    font-weight: 700;
    padding: 7px 12px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }
  .agt-circle-btn.join { background: var(--forest); color: var(--paper); }
  .agt-circle-btn.joined { background: var(--paper-2); color: var(--forest); }

  /* ---- Parcels ---- */
  .agt-parcel-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 10px;
  }
  .agt-parcel-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .agt-parcel-desc { font-size: 13px; color: var(--ink); margin-bottom: 8px; line-height: 1.4; }
  .agt-parcel-meta {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: #8A8172;
    flex-wrap: wrap;
  }
  .agt-parcel-reward {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 15px;
    color: var(--clay);
  }

  /* ---- AI assistant ---- */
  .agt-ai-box {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 16px;
  }
  .agt-ai-box textarea {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 13.5px;
    resize: none;
    min-height: 70px;
    outline: none;
    margin-bottom: 10px;
    color: var(--ink);
  }
  .agt-ai-examples { font-size: 11px; color: #8A8172; margin-top: 8px; line-height: 1.5; }

  /* ---- Chat ---- */
  .agt-chat-thread {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 4px 2px 12px 2px;
    max-height: 46vh;
    overflow-y: auto;
  }
  .agt-chat-bubble-row {
    display: flex;
  }
  .agt-chat-bubble-row.me { justify-content: flex-end; }
  .agt-chat-bubble {
    max-width: 78%;
    padding: 9px 12px;
    border-radius: 14px;
    font-size: 13px;
    line-height: 1.4;
  }
  .agt-chat-bubble-row.them .agt-chat-bubble {
    background: var(--paper-2);
    color: var(--ink);
    border-bottom-left-radius: 4px;
  }
  .agt-chat-bubble-row.me .agt-chat-bubble {
    background: var(--forest);
    color: var(--paper);
    border-bottom-right-radius: 4px;
  }
  .agt-chat-input-row {
    display: flex;
    gap: 8px;
    align-items: center;
    border-top: 1px solid var(--line);
    padding-top: 12px;
  }
  .agt-chat-input-row input {
    flex: 1;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 13px;
    outline: none;
    font-family: inherit;
  }
  .agt-chat-send-btn {
    width: 38px; height: 38px; border-radius: 999px;
    background: var(--forest);
    color: var(--paper);
    border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  /* ---- Referrals ---- */
  .agt-referral-card {
    background: var(--forest);
    color: var(--paper);
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 16px;
  }
  .agt-referral-code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--gold);
    margin: 6px 0 4px 0;
  }
  .agt-referral-stats {
    display: flex;
    gap: 20px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(246,241,230,0.18);
  }
  .agt-referral-stat-num { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; }
  .agt-referral-stat-label { font-size: 10.5px; color: rgba(246,241,230,0.6); text-transform: uppercase; letter-spacing: 0.08em; }

  /* ---- Tours ---- */
  .agt-tour-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .agt-tour-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; margin-bottom: 3px; }
  .agt-tour-meta { display: flex; gap: 12px; font-size: 11.5px; color: #8A8172; margin-bottom: 10px; flex-wrap: wrap; }
  .agt-tour-price { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; color: var(--clay); }
  .agt-tour-highlight-item {
    font-size: 12px;
    color: var(--ink);
    padding: 4px 0;
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }

  /* ---- Corporate mobility ---- */
  .agt-corp-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 12px;
  }
  .agt-corp-company { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
  .agt-corp-route { font-size: 12.5px; color: var(--ink); margin-bottom: 8px; }
  .agt-corp-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 8px;
  }
  .agt-corp-price-market { font-size: 12px; color: #8A8172; text-decoration: line-through; }
  .agt-corp-price-employee { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; color: var(--forest); }

  /* ---- Trip status stepper ---- */
  .agt-status-stepper {
    display: flex;
    align-items: center;
    margin: 16px 0 18px 0;
  }
  .agt-status-step { flex: 1; text-align: center; position: relative; }
  .agt-status-dot {
    width: 22px; height: 22px; border-radius: 999px;
    background: var(--paper-2);
    border: 2px solid var(--line);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 6px auto;
    color: transparent;
    font-size: 10px;
  }
  .agt-status-step.done .agt-status-dot { background: var(--forest); border-color: var(--forest); color: var(--paper); }
  .agt-status-step.current .agt-status-dot { background: var(--gold); border-color: var(--gold); color: var(--ink); }
  .agt-status-label { font-size: 10px; color: #8A8172; font-weight: 600; }
  .agt-status-step.done .agt-status-label, .agt-status-step.current .agt-status-label { color: var(--ink); }
  .agt-status-line {
    position: absolute;
    top: 11px; left: -50%; right: 50%;
    height: 2px;
    background: var(--line);
    z-index: -1;
  }
  .agt-status-step.done .agt-status-line { background: var(--forest); }
  .agt-status-step:first-child .agt-status-line { display: none; }

  /* ---- SOS ---- */
  .agt-sos-btn {
    width: 100%;
    background: #B33A3A;
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 13px;
    font-weight: 700;
    font-size: 13.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .agt-sos-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 14px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 12px;
    margin-bottom: 9px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
  }
  .agt-share-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: var(--paper-2);
    border-radius: 12px;
    margin-bottom: 14px;
    font-size: 12.5px;
    font-weight: 600;
  }
  .agt-switch {
    width: 38px; height: 22px; border-radius: 999px;
    background: var(--line);
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .agt-switch.on { background: var(--forest); }
  .agt-switch-knob {
    width: 18px; height: 18px; border-radius: 999px;
    background: #fff;
    position: absolute;
    top: 2px; left: 2px;
    transition: left 0.15s;
  }
  .agt-switch.on .agt-switch-knob { left: 18px; }

  /* ---- Driver dashboard ---- */
  .agt-mytrip-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 12px;
  }
  .agt-mytrip-card.cancelled { opacity: 0.55; }
  .agt-status-pill {
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 3px 9px;
    border-radius: 999px;
  }
  .agt-status-pill.scheduled { background: var(--paper-2); color: var(--forest); }
  .agt-status-pill.enroute { background: #FBEED1; color: #96701C; }
  .agt-status-pill.completed { background: #E4EEE2; color: #1F4D3A; }
  .agt-status-pill.cancelled { background: #EDE1DA; color: #8A5A3D; }
  .agt-passenger-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    padding: 6px 0;
  }

  /* ---- Ratings ---- */
  .agt-rating-box {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 14px;
  }
  .agt-star-picker {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin: 8px 0 12px 0;
  }
  .agt-rating-box textarea {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 9px 11px;
    font-family: inherit;
    font-size: 13px;
    resize: none;
    min-height: 56px;
    outline: none;
    margin-bottom: 10px;
    color: var(--ink);
  }

  /* ---- Language toggle ---- */
  .agt-lang-toggle {
    display: inline-flex;
    border: 1px solid var(--line);
    border-radius: 999px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .agt-lang-toggle button {
    border: none;
    background: var(--card);
    color: var(--ink);
    font-size: 11px;
    font-weight: 700;
    padding: 6px 10px;
    cursor: pointer;
  }
  .agt-lang-toggle button.active {
    background: var(--forest);
    color: var(--paper);
  }
  .agt-lang-toggle.onboard button { background: rgba(246,241,230,0.1); color: var(--paper); }
  .agt-lang-toggle.onboard button.active { background: var(--gold); color: var(--ink); }
`;

/* ---------------- Mock data ---------------- */

const INITIAL_TRIPS = [
  {
    id: "t1", from: "Kigali", to: "Rubavu", date: "Sat, 9 Aug", time: "09:00 AM", distance: 157,
    seatsAvailable: 3, seatsTotal: 4, seatsTaken: [1], price: 12000, vehicle: "Toyota Prado", plate: "RAD 213 B",
    driver: { name: "Eric N.", initials: "EN", rating: 4.9, trips: 128, level: "Gold", womenOnly: false },
    amenities: ["ac", "music", "wifi", "charging", "luggage"],
    reviews: [{ name: "Diane K.", text: "Smooth ride, very punctual and the car was spotless." }],
    waypoints: [
      { name: "Gisenyi", matchPct: 97, deviationKm: 1.8 },
      { name: "Rutsiro", matchPct: 82, deviationKm: 7.5 },
      { name: "Karongi", matchPct: 68, deviationKm: 14.0 },
    ],
  },
  {
    id: "t2", from: "Kigali", to: "Musanze", date: "Fri, 8 Aug", time: "05:00 PM", distance: 106,
    seatsAvailable: 2, seatsTotal: 4, seatsTaken: [1, 2], price: 8000, vehicle: "Toyota Rav4", plate: "RAC 884 A",
    driver: { name: "Aline U.", initials: "AU", rating: 5.0, trips: 74, level: "Diamond", womenOnly: true, circleId: "c1" },
    amenities: ["ac", "charging", "pet"],
    reviews: [{ name: "Grace M.", text: "Loved that it was women-only, felt completely safe the whole trip." }],
    waypoints: [
      { name: "Base", matchPct: 74, deviationKm: 9.0 },
      { name: "Gicumbi", matchPct: 66, deviationKm: 12.0 },
      { name: "Volcanoes NP", matchPct: 94, deviationKm: 2.4 },
    ],
  },
  {
    id: "t3", from: "Kigali", to: "Huye", date: "Sat, 9 Aug", time: "07:30 AM", distance: 135,
    seatsAvailable: 4, seatsTotal: 6, seatsTaken: [2, 4], price: 6000, vehicle: "Toyota Noah", plate: "RAB 552 C",
    driver: { name: "Patrick S.", initials: "PS", rating: 4.7, trips: 203, level: "Gold", womenOnly: false, circleId: "c2" },
    amenities: ["ac", "music", "luggage"],
    reviews: [{ name: "Jules R.", text: "Great music taste and easy conversation, would ride again." }],
    waypoints: [
      { name: "Muhanga", matchPct: 92, deviationKm: 2.0 },
      { name: "Nyanza", matchPct: 85, deviationKm: 5.0 },
      { name: "Butare", matchPct: 96, deviationKm: 1.2 },
    ],
  },
  {
    id: "t4", from: "Kigali", to: "Rusizi", date: "Sun, 10 Aug", time: "06:00 AM", distance: 228,
    seatsAvailable: 1, seatsTotal: 6, seatsTaken: [1, 2, 3, 4, 5], price: 15000, vehicle: "Land Cruiser V8", plate: "RAA 011 K",
    driver: { name: "Moses T.", initials: "MT", rating: 4.8, trips: 91, level: "Silver", womenOnly: false },
    amenities: ["ac", "wifi", "charging", "luggage", "music"],
    reviews: [{ name: "Fabrice N.", text: "Comfortable long trip, driver knew every good stop along the way." }],
    waypoints: [
      { name: "Nyamagabe", matchPct: 80, deviationKm: 6.0 },
      { name: "Nyungwe NP", matchPct: 90, deviationKm: 3.0 },
      { name: "Bugarama", matchPct: 88, deviationKm: 3.5 },
    ],
  },
  {
    id: "t5", from: "Kigali", to: "Nyagatare", date: "Fri, 8 Aug", time: "02:00 PM", distance: 110,
    seatsAvailable: 3, seatsTotal: 5, seatsTaken: [1, 2], price: 7000, vehicle: "Suzuki Ertiga", plate: "RAE 340 M",
    driver: { name: "Solange I.", initials: "SI", rating: 4.95, trips: 56, level: "Gold", womenOnly: true },
    amenities: ["ac", "charging"],
    reviews: [{ name: "Yvette B.", text: "Friendly and safe, exactly what I needed for a solo trip." }],
    waypoints: [
      { name: "Rwamagana", matchPct: 91, deviationKm: 2.5 },
      { name: "Kayonza", matchPct: 84, deviationKm: 5.0 },
      { name: "Gatsibo", matchPct: 76, deviationKm: 8.0 },
    ],
  },
  {
    id: "t6", from: "Kacyiru", to: "Nyamata", date: "Sat, 9 Aug", time: "11:00 AM", distance: 45,
    seatsAvailable: 3, seatsTotal: 4, seatsTaken: [1], price: 3000, vehicle: "Toyota Vitz", plate: "RAF 118 D",
    driver: { name: "Josiane M.", initials: "JM", rating: 4.85, trips: 39, level: "Silver", womenOnly: false, circleId: "c3" },
    amenities: ["ac", "music"],
    reviews: [{ name: "Kevin B.", text: "Quick sector-to-sector hop, driver waited a few minutes for me at Sonatube." }],
    waypoints: [
      { name: "Remera", matchPct: 93, deviationKm: 1.5 },
      { name: "Kanombe", matchPct: 80, deviationKm: 6.0 },
      { name: "Bugesera", matchPct: 70, deviationKm: 10.0 },
    ],
  },
  {
    id: "t7", from: "Kimironko", to: "Muhanga town", date: "Fri, 8 Aug", time: "04:30 PM", distance: 55,
    seatsAvailable: 2, seatsTotal: 4, seatsTaken: [1, 2], price: 3500, vehicle: "Toyota Fielder", plate: "RAG 902 P",
    driver: { name: "Emmanuel R.", initials: "ER", rating: 4.6, trips: 22, level: "Silver", womenOnly: false },
    amenities: ["ac", "charging", "luggage"],
    reviews: [{ name: "Alice N.", text: "Left right on time from the Kimironko roundabout." }],
    waypoints: [
      { name: "Kicukiro", matchPct: 88, deviationKm: 3.0 },
      { name: "Nyanza cell", matchPct: 82, deviationKm: 5.0 },
      { name: "Ruhango", matchPct: 75, deviationKm: 8.0 },
    ],
  },
  {
    id: "t8", from: "Nyabugogo", to: "Rilima", date: "Sun, 10 Aug", time: "08:00 AM", distance: 55,
    seatsAvailable: 4, seatsTotal: 6, seatsTaken: [2, 4], price: 2500, vehicle: "Toyota Noah", plate: "RAH 455 Q",
    driver: { name: "Claudine H.", initials: "CH", rating: 4.9, trips: 61, level: "Gold", womenOnly: true, circleId: "c4" },
    amenities: ["ac"],
    reviews: [{ name: "Peace U.", text: "Women-only van, felt safe going to visit family in the village." }],
    waypoints: [
      { name: "Gatenga", matchPct: 85, deviationKm: 4.0 },
      { name: "Nyamata town", matchPct: 79, deviationKm: 6.0 },
      { name: "Ntarama", matchPct: 90, deviationKm: 2.8 },
    ],
  },
];

/* ---------------- Fare estimator ----------------
   Rwanda's pump price is set nationwide by RURA (Rwanda Utilities
   Regulatory Authority), not RRA — RRA handles tax collection, RURA
   sets the regulated price. As of the June 2026 review: petrol
   2,938 RWF/L, diesel 2,927 RWF/L. We use a rounded blended figure.
   This is a cost-share estimate, not a fixed fare — the driver can
   always override it. */
const FUEL_PRICE_PER_LITRE = 2930; // RWF, RURA-regulated, June 2026 review

const VEHICLE_CONSUMPTION = {
  small: { label: "Small car (e.g. Vitz, Passo)", litresPer100km: 6.5 },
  sedan: { label: "Sedan / compact SUV (e.g. Rav4, Fielder)", litresPer100km: 9 },
  van: { label: "Van / 4x4 (e.g. Noah, Land Cruiser)", litresPer100km: 12 },
};

function estimateFarePerSeat(distanceKm, vehicleSize, seatsOffered) {
  const dist = Number(distanceKm);
  const seats = Number(seatsOffered);
  if (!dist || dist <= 0 || !seats || seats <= 0) return null;
  const consumption = VEHICLE_CONSUMPTION[vehicleSize]?.litresPer100km || VEHICLE_CONSUMPTION.sedan.litresPer100km;
  const fuelCost = dist * (consumption / 100) * FUEL_PRICE_PER_LITRE;
  const withMargin = fuelCost * 1.4; // covers driver time/wear, not just fuel
  const mid = withMargin / seats;
  const round100 = (n) => Math.round(n / 100) * 100;
  return { min: round100(mid * 0.85), mid: round100(mid), max: round100(mid * 1.15) };
}

/* ---------------- Platform commission ----------------
   Matches the commission model in the architecture doc: a percentage
   fee, capped so it doesn't punish drivers on expensive long trips. */
const COMMISSION_RATE = 0.12; // 12%
const COMMISSION_CAP = 5000; // RWF, per seat

function calculateFees(pricePerSeat) {
  const price = Number(pricePerSeat);
  if (!price || price <= 0) return null;
  const fee = Math.min(Math.round(price * COMMISSION_RATE), COMMISSION_CAP);
  const youReceive = price - fee;
  return { price, fee, youReceive, capped: fee === COMMISSION_CAP };
}

const PICKUP_POINTS = [
  "Nyabugogo Bus Park",
  "Kigali Heights (KG 7 Ave)",
  "Petrol station, roundabout",
  "Propose another spot",
];

const VIBES = [
  { id: "v1", author: "Diane K.", anonymous: false, mood: "🎶", text: "Kigali–Rubavu at sunset with the right playlist is genuinely one of the best parts of my week. Drivers who let you pick the music &gt; everything.", likes: 14 },
  { id: "v2", author: "Anonymous", anonymous: true, mood: "🙏", text: "Was nervous about my first ride as a woman travelling alone. The women-only badge made the difference — driver waited for me, no awkwardness.", likes: 22 },
  { id: "v3", author: "Fabrice N.", anonymous: false, mood: "🌄", text: "Convinced someone to try the Bisoke plan with us — turned a solo hike into a 6-person trip and split fuel four ways. This is why I keep coming back.", likes: 9 },
  { id: "v4", author: "Anonymous", anonymous: true, mood: "😅", text: "Pro tip: agree on the pickup point THROUGH the app chat, not over the phone. Saved me from standing at the wrong petrol station for 20 minutes.", likes: 17 },
];

const ROOMS = [
  { id: "r1", title: "Lake Kivu Weekend", sub: "Sat–Sun · 6 travelling · Rubavu shoreline", icon: "mountain", members: ["EN", "AU", "PS", "MT", "SI", "GK"] },
  { id: "r2", title: "Hiking Bisoke", sub: "Sun · 4 travelling · Volcanoes NP", icon: "mountain", members: ["JR", "DK", "FN"] },
  { id: "r3", title: "Kigali Jazz Junction", sub: "Fri night · 5 joining · BK Arena", icon: "night", members: ["YB", "MT", "AU", "PS"] },
  { id: "r4", title: "Going to KABC", sub: "Tonight, 11:30 PM · Kigali Heights", icon: "night", members: ["EN", "GM"] },
];

/* ---------------- Circles ----------------
   Trusted sub-communities. Membership is self-declared (join/leave),
   and a driver whose circleId overlaps the searching passenger's
   circles can be surfaced with a "My Circle" filter — an extra trust
   signal layered on top of the Trust Score. */
const CIRCLES = [
  { id: "c1", name: "University of Rwanda – Huye", type: "University", members: 340, icon: "🎓" },
  { id: "c2", name: "Kigali Heights Co-workers", type: "Workplace", members: 58, icon: "💼" },
  { id: "c3", name: "Kimihurura Neighbours", type: "Neighborhood", members: 120, icon: "🏘️" },
  { id: "c4", name: "St. Michael's Parish", type: "Church", members: 210, icon: "⛪" },
  { id: "c5", name: "APR Basketball Club", type: "Sports club", members: 34, icon: "🏀" },
];

/* ---------------- Parcels ----------------
   Drivers already making a trip can carry a small parcel along their
   route for a flat reward — separate from passenger seats. */
const INITIAL_PARCELS = [
  { id: "p1", from: "Kigali", to: "Musanze", date: "Fri, 8 Aug", size: "Small (fits on lap)", desc: "Sealed envelope of documents", reward: 2000, posterName: "Diane K.", posterInitials: "DK" },
  { id: "p2", from: "Kigali", to: "Huye", date: "Sat, 9 Aug", size: "Medium (backpack size)", desc: "Box of textbooks for a cousin at campus", reward: 3500, posterName: "Jules R.", posterInitials: "JR" },
  { id: "p3", from: "Kigali", to: "Rubavu", date: "Sat, 9 Aug", size: "Small (fits on lap)", desc: "Phone charger left at a hotel, needs return", reward: 2500, posterName: "Grace M.", posterInitials: "GM" },
];

/* ---------------- Tourism ----------------
   Multi-day guided packages — a different product than a point-to-point
   ride: fixed itinerary, a guide, and a per-person price that bundles
   transport with accommodation and activities. */
const TOURS = [
  {
    id: "tr1",
    title: "Nyungwe Canopy & Tea Trail",
    days: 3,
    price: 145000,
    groupSize: "6–10 people",
    nextDeparture: "Fri, 15 Aug",
    guide: "Emmanuel R.",
    highlights: ["Canopy walkway at sunrise", "Chimpanzee tracking", "Gisakura tea estate tour"],
    includes: ["Return transport from Kigali", "2 nights guesthouse", "All meals", "Park permits", "English/Kinyarwanda guide"],
  },
  {
    id: "tr2",
    title: "Lake Kivu Island Hopping",
    days: 2,
    price: 78000,
    groupSize: "4–8 people",
    nextDeparture: "Sat, 16 Aug",
    guide: "Aline U.",
    highlights: ["Napoleon Island bat colony", "Boat transfer to Amahoro Island", "Sunset kayaking"],
    includes: ["Return transport from Kigali", "1 night lakeside stay", "Breakfast & lunch", "Boat transfers"],
  },
  {
    id: "tr3",
    title: "Volcanoes Gorilla & Culture Weekend",
    days: 2,
    price: 410000,
    groupSize: "2–6 people",
    nextDeparture: "Sun, 17 Aug",
    guide: "Moses T.",
    highlights: ["Gorilla trekking permit included", "Iby'Iwacu cultural village", "Twin Lakes viewpoint"],
    includes: ["Return transport from Kigali", "1 night lodge stay", "Gorilla permit", "Breakfast & dinner"],
  },
];

/* ---------------- Corporate mobility ----------------
   Employer-sponsored shared commute routes — the company subsidizes
   part of the fare so the employee pays less than the open-market
   price shown in Rides. */
const CORPORATE_PROGRAMS = [
  {
    id: "cp1",
    company: "MTN Rwanda",
    route: "Nyarutarama → MTN Centre, Nyarutarama",
    schedule: "Weekdays · 7:15 AM & 5:30 PM",
    seatsAvailable: 12,
    marketPrice: 2500,
    employeePrice: 800,
  },
  {
    id: "cp2",
    company: "Bank of Kigali",
    route: "Kimironko → BK Head Office, Nyarugenge",
    schedule: "Weekdays · 7:00 AM & 5:00 PM",
    seatsAvailable: 8,
    marketPrice: 2200,
    employeePrice: 600,
  },
  {
    id: "cp3",
    company: "Zipline Rwanda",
    route: "Remera → Muhanga Distribution Centre",
    schedule: "Weekdays · 6:30 AM & 6:00 PM",
    seatsAvailable: 15,
    marketPrice: 3500,
    employeePrice: 1000,
  },
];

// Mock passenger names for the driver dashboard's seat list — this
// prototype has no multi-user backend, so booked seats aren't tied to
// real accounts. Names are assigned deterministically from seat index
// purely for a realistic-looking dashboard.
const MOCK_PASSENGER_POOL = ["Eric N.", "Yvonne B.", "Moses T.", "Grace M.", "Diane K.", "Jules R.", "Sandrine I.", "Fabrice N."];

/* ---------------- Admin ----------------
   Mock data for the internal admin dashboard — driver applications
   awaiting document review, and rider-submitted reports awaiting
   moderation. In production these would come from real submissions,
   not this seed list. */
const INITIAL_VERIFICATION_QUEUE = [
  { id: "vq1", name: "Emmanuel R.", vehicle: "Toyota Fielder · RAD 442 D", submitted: "2 hours ago" },
  { id: "vq2", name: "Solange K.", vehicle: "Suzuki Alto · RAC 118 B", submitted: "5 hours ago" },
  { id: "vq3", name: "Théo N.", vehicle: "Toyota RAV4 · RAB 990 F", submitted: "1 day ago" },
];
const INITIAL_REPORT_QUEUE = [
  { id: "rq1", from: "Passenger, Kigali–Rubavu trip", note: "Driver arrived 25 minutes late, no message sent.", submitted: "3 hours ago" },
  { id: "rq2", from: "Passenger, Kigali–Huye trip", note: "Vehicle didn't match the photos on the listing.", submitted: "1 day ago" },
];
// Mock 7-day platform trend for the admin dashboard chart — production
// would derive this from real trip timestamps, which this prototype's
// seed data doesn't carry.
const ADMIN_TREND_7D = [
  { day: "Mon", bookings: 14 },
  { day: "Tue", bookings: 19 },
  { day: "Wed", bookings: 16 },
  { day: "Thu", bookings: 23 },
  { day: "Fri", bookings: 31 },
  { day: "Sat", bookings: 27 },
  { day: "Sun", bookings: 21 },
];

/* ---------------- Distance estimation ----------------
   Real road distance would come from Google's Directions/Distance Matrix
   API in production (see note in estimateRoadDistanceKm below). For this
   prototype, we calculate straight-line distance between known town
   centers with the Haversine formula, then apply a routing correction
   factor typical of Rwanda's hilly, winding road network — no API key
   required, works fully offline, and gives a reasonable estimate for
   the Fair Price calculation. */
const RWANDA_PLACES = {
  "kigali": { lat: -1.9441, lng: 30.0619 },
  "nyabugogo": { lat: -1.9394, lng: 30.0453 },
  "kacyiru": { lat: -1.9439, lng: 30.0894 },
  "kimironko": { lat: -1.9436, lng: 30.1136 },
  "remera": { lat: -1.9578, lng: 30.1119 },
  "kanombe": { lat: -1.9686, lng: 30.1394 },
  "kicukiro": { lat: -1.9878, lng: 30.1004 },
  "gatenga": { lat: -1.9833, lng: 30.0667 },
  "musanze": { lat: -1.4995, lng: 29.6338 },
  "volcanoes np": { lat: -1.4630, lng: 29.4930 },
  "huye": { lat: -2.5967, lng: 29.7392 },
  "butare": { lat: -2.5967, lng: 29.7392 },
  "rubavu": { lat: -1.6773, lng: 29.2564 },
  "gisenyi": { lat: -1.6773, lng: 29.2564 },
  "rusizi": { lat: -2.4846, lng: 28.9066 },
  "bugarama": { lat: -2.6167, lng: 28.9333 },
  "nyagatare": { lat: -1.2941, lng: 30.3256 },
  "rwamagana": { lat: -1.9487, lng: 30.4347 },
  "kayonza": { lat: -1.8833, lng: 30.6167 },
  "gatsibo": { lat: -1.5833, lng: 30.4667 },
  "muhanga": { lat: -1.9987, lng: 29.7532 },
  "muhanga town": { lat: -1.9987, lng: 29.7532 },
  "nyanza": { lat: -2.3508, lng: 29.7492 },
  "nyanza cell": { lat: -2.3508, lng: 29.7492 },
  "karongi": { lat: -2.0596, lng: 29.3454 },
  "kibuye": { lat: -2.0596, lng: 29.3454 },
  "rutsiro": { lat: -1.8710, lng: 29.3386 },
  "nyamagabe": { lat: -2.4708, lng: 29.4696 },
  "nyungwe np": { lat: -2.4990, lng: 29.2000 },
  "gicumbi": { lat: -1.6989, lng: 30.0961 },
  "base": { lat: -1.5333, lng: 29.9333 },
  "nyamata": { lat: -2.1500, lng: 30.1000 },
  "nyamata town": { lat: -2.1500, lng: 30.1000 },
  "bugesera": { lat: -2.1500, lng: 30.1000 },
  "rilima": { lat: -2.2333, lng: 30.2333 },
  "ntarama": { lat: -2.1667, lng: 30.1333 },
  "ruhango": { lat: -2.1975, lng: 29.7825 },
};

function findPlaceCoords(name) {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  if (RWANDA_PLACES[key]) return RWANDA_PLACES[key];
  const found = Object.keys(RWANDA_PLACES).find((k) => key.includes(k) || k.includes(key));
  return found ? RWANDA_PLACES[found] : null;
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// PRODUCTION NOTE: replace this whole function with a call to Google's
// Directions API (or Distance Matrix API) once a billed API key exists —
// pass the actual road distance/duration it returns instead of this
// straight-line estimate. Keep the 1.35x correction as a fallback for
// offline mode or API failures, since GPS coverage can be patchy outside
// Kigali.
function estimateRoadDistanceKm(fromName, toName) {
  const a = findPlaceCoords(fromName);
  const b = findPlaceCoords(toName);
  if (!a || !b) return null;
  const straightLine = haversineKm(a, b);
  return Math.round(straightLine * 1.35);
}

const TRIP_STATUS_STEPS = [
  { key: "scheduled", label: "Confirmed" },
  { key: "enroute", label: "Driver en route" },
  { key: "completed", label: "Trip completed" },
];

const AMENITY_META = {
  ac: { icon: Wind, label: "AC" },
  music: { icon: Music, label: "Music" },
  wifi: { icon: Wifi, label: "WiFi" },
  charging: { icon: Battery, label: "Charging" },
  luggage: { icon: Luggage, label: "Luggage" },
  pet: { icon: PawPrint, label: "Pet OK" },
  smoke: { icon: Cigarette, label: "No smoking" },
};

/* ---------------- Levels ---------------- */

const LEVELS = [
  { name: "Bronze", min: 0, max: 5 },
  { name: "Silver", min: 5, max: 20 },
  { name: "Gold", min: 20, max: 50 },
  { name: "Diamond", min: 50, max: 50 },
];

function getLevelInfo(tripsCount) {
  const idx = LEVELS.findIndex((l, i) => tripsCount < l.max || i === LEVELS.length - 1);
  const level = LEVELS[Math.max(0, idx)];
  const isMax = level.name === "Diamond" && tripsCount >= 50;
  const progress = isMax ? 100 : Math.min(100, Math.round(((tripsCount - level.min) / (level.max - level.min)) * 100));
  const toNext = isMax ? 0 : level.max - tripsCount;
  return { level: level.name, progress, toNext, isMax };
}

/* ---------------- Trust Score ----------------
   Level is a loyalty/gamification tier. Trust Score is a separate,
   safety-oriented composite — the two answer different questions
   ("how much have they used the app" vs "how much should I trust
   this specific account right now"). */
function getTrustScore(profile) {
  const idPts = profile.verified.id ? 30 : 0;
  const phonePts = profile.verified.phone ? 15 : 0;
  const emailPts = profile.verified.email ? 10 : 0;
  const tripsPts = Math.min(30, profile.tripsCompleted * 1.5);
  const ratingPts = profile.rating ? (profile.rating / 5) * 15 : 0;
  const score = Math.round(idPts + phonePts + emailPts + tripsPts + ratingPts);
  return {
    score,
    breakdown: [
      { label: "Identity verified", ok: profile.verified.id },
      { label: "Phone verified", ok: profile.verified.phone },
      { label: "Email verified", ok: profile.verified.email },
      { label: `${profile.tripsCompleted} completed trip${profile.tripsCompleted === 1 ? "" : "s"}`, ok: profile.tripsCompleted > 0 },
      { label: profile.rating ? `${profile.rating.toFixed(1)} rating` : "No rating yet", ok: !!profile.rating },
    ],
  };
}

const TRAVEL_PERSONALITIES = [
  { key: "music", label: "🎵 Music" },
  { key: "conversation", label: "💬 Conversation" },
  { key: "quiet", label: "🤫 Quiet" },
  { key: "adventure", label: "🏕 Adventure" },
  { key: "business", label: "💼 Business" },
  { key: "family", label: "👨‍👩‍👧 Family" },
];

/* ---------------- Imigongo-inspired motif ----------------
   An original geometric strip in the spirit of Imigongo — Rwanda's
   traditional triangle/spiral art form, historically painted on
   walls and plates in bold black, white, and rust tones. Used here
   as a border accent, the way it's traditionally used as trim, not
   a copy of any specific artwork. */
function ImigongoStrip({ colors = ["var(--gold)", "var(--clay)", "var(--ink)"], height = 12 }) {
  const items = Array.from({ length: 40 });
  return (
    <div className="agt-imigongo-strip" style={{ height }}>
      {items.map((_, i) => {
        const up = i % 2 === 0;
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            style={{
              width: 0,
              height: 0,
              flexShrink: 0,
              borderLeft: `${height / 2}px solid transparent`,
              borderRight: `${height / 2}px solid transparent`,
              borderBottom: up ? `${height}px solid ${color}` : "none",
              borderTop: up ? "none" : `${height}px solid ${color}`,
            }}
          />
        );
      })}
    </div>
  );
}

function SeatMap({ trip, selectedSeats, onToggle }) {
  const total = trip.seatsTotal || trip.seatsAvailable;
  const taken = trip.seatsTaken || [];
  const allIds = Array.from({ length: total }, (_, i) => i);
  const frontIds = allIds.slice(0, 1);
  const backIds = allIds.slice(1);

  const seatButton = (id) => {
    const isTaken = taken.includes(id);
    const isSelected = selectedSeats.includes(id);
    return (
      <button
        key={id}
        type="button"
        className={`agt-seat ${isTaken ? "taken" : ""} ${isSelected ? "selected" : ""}`}
        disabled={isTaken}
        onClick={() => onToggle(id)}
      >
        {isTaken ? <X size={12} /> : isSelected ? <Check size={13} /> : id + 1}
      </button>
    );
  };

  return (
    <div className="agt-seat-map">
      <div className="agt-seat-legend">
        <span><span className="agt-seat-legend-dot" style={{ background: "var(--white)", border: "1.5px solid var(--line)" }} />Open</span>
        <span><span className="agt-seat-legend-dot" style={{ background: "var(--forest)" }} />Selected</span>
        <span><span className="agt-seat-legend-dot" style={{ background: "var(--paper-2)", border: "1px solid var(--line)" }} />Taken</span>
      </div>
      <div className="agt-seat-front-row">
        <div className="agt-seat-driver"><Car size={14} />Driver</div>
        {frontIds.map(seatButton)}
      </div>
      {backIds.length > 0 && <div className="agt-seat-back-grid">{backIds.map(seatButton)}</div>}
    </div>
  );
}

/* ---------------- Small components ---------------- */

function RouteLine({ from, to, onDark }) {
  return (
    <div className={`agt-route-line${onDark ? " on-dark" : ""}`}>
      <div className="agt-route-dot" />
      <div className="agt-route-dash" />
      <div className="agt-route-dot end" />
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="agt-toast">
      <Check size={14} />
      {message}
    </div>
  );
}

/* ---------------- Main App ---------------- */

const DEFAULT_PROFILE = { name: "", phone: "", email: "", nationalId: "", tripsCompleted: 0, rating: null, travelPersonality: null, verified: { id: false, email: false, phone: false }, circles: [], referralCode: "", referralCredits: 0, referredCount: 0, emergencyContact: { name: "", phone: "" }, hasVehicle: false, vehicleMake: "", vehiclePlate: "", photoDataUrl: "" };

function generateReferralCode(name) {
  const base = (name || "AGT").replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "AGT";
  const suffix = String(Math.floor(100 + Math.random() * 900));
  return `${base}${suffix}`;
}

function initialsFromName(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Two dots joined by a dashed road, with a tiny car driving back and forth
// between them — a literal "never travel alone" motif used next to the
// wordmark on onboarding and in the header. The car flips to face the
// direction it's driving on each pass.
function TravelPulse({ width = 34 }) {
  return (
    <span className="agt-travel-pulse" style={{ width }}>
      <span className="agt-travel-dot" />
      <span className="agt-travel-line" />
      <span className="agt-travel-dot" />
      <span className="agt-travel-shuttle">
        <Car size={10} strokeWidth={2.4} />
      </span>
    </span>
  );
}

// Small hand-rolled bar chart, no charting library dependency — used
// on the admin dashboard for the 7-day bookings trend.
function MiniBarChart({ data, valueKey, labelKey }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="agt-minichart">
      {data.map((d, i) => (
        <div className="agt-minichart-col" key={i}>
          <div className="agt-minichart-val">{d[valueKey]}</div>
          <div className="agt-minichart-bar-track">
            <div className="agt-minichart-bar" style={{ height: `${(d[valueKey] / max) * 100}%` }} />
          </div>
          <div className="agt-minichart-label">{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Language ----------------
   Two languages: English and Kinyarwanda. Covers navigation, actions,
   form labels, and instructional copy — the app "chrome". Trip listings,
   reviews, and vibe posts are content people type themselves, so those
   stay as written rather than being auto-translated. */
const TRANSLATIONS = {
  en: {
    // Onboarding
    onboardTitle: "Agatigito",
    tagline: "Never travel alone",
    onboardSub: "Never travel alone. Create your account to start booking or posting seats.",
    fullName: "Full name",
    phoneNumber: "Phone number",
    emailOptional: "Email (optional, for verification)",
    createAccount: "Create my account",
    creatingAccount: "Creating account…",
    onboardNote: "This prototype saves your profile to this device only. National ID and selfie verification would be added in the real build.",
    // Nav
    navHome: "Home",
    navRides: "Rides",
    navPlans: "Plans",
    // Home
    homeGoWhere: "Where are you going?",
    homeSearchPlaceholder: "Search a destination…",
    homeFindRide: "Find a ride",
    homeFindRideSub: "Search seats already heading your way",
    homeOfferSeat: "Offer a seat",
    homeOfferSeatSub: "Post empty seats and split the cost",
    homeAdventure: "Weekend adventure",
    homeAdventureSub: "Join a group heading to the mountains or the lake",
    homeTonight: "Tonight",
    homeTonightSub: "Find people heading your way right now",
    homeVibe: "Share a vibe",
    homeVibeSub: "Trip stories and shoutouts from the community",
    homeCircles: "Circles",
    homeCirclesSub: "Join trusted communities — uni, work, church",
    homeAskAI: "Ask Agatigito",
    homeAskAISub: "Describe the trip you want, in your own words",
    homeParcel: "Send a parcel",
    homeParcelSub: "Riders along your route can carry it for you",
    homeInvite: "Invite & earn",
    homeInviteSub: "Get ride credits when a friend joins",
    homeTours: "Guided tours",
    homeToursSub: "Multi-day packages with a guide included",
    homeCorporate: "Corporate commute",
    homeCorporateSub: "Subsidized shared rides through your employer",
    homeMyTrips: "My posted trips",
    homeMyTripsSub: "Manage seats, passengers, and trip status",
    homeBrowseAll: "Browse all rides",
    // Common actions
    confirmPay: "Confirm & pay",
    messageDriver: "Message driver",
    cancelTrip: "Cancel trip",
    cancelMySeat: "Cancel my seat",
    reserveSpot: "Reserve spot",
    joinPlan: "Join plan",
    joinCircle: "Join",
    joined: "Joined",
    startTrip: "Start trip",
    markCompleted: "Mark completed",
    postAParcel: "Post a parcel request",
    submitRating: "Submit rating",
    backToMarketplace: "Back to marketplace",
    save: "Save",
    verify: "Verify",
    verified: "Verified",
    copyCode: "Copy code",
    findMatches: "Find matches",
    // Booking
    pickupPoint: "Pickup point",
    pickupSafetyNote: "For your safety, pick a public spot rather than sharing your home address.",
    seats: "Seats",
    perSeat: "Per seat",
    totalEscrow: "Total held in escrow",
    seatConfirmed: "Seat confirmed",
    driverWillMeet: "will meet you at the agreed pick-up point.",
    shareLiveLocation: "Share live location with my emergency contact",
    // Safety
    emergencySafety: "Emergency / Safety",
    emergencyTitle: "Emergency",
    emergencyIntro: "If you're in immediate danger, call emergency services first.",
    call112: "Call 112 (Police / Emergency)",
    notifyContact: "Notify my emergency contact",
    reportProblem: "Report a problem to Agatigito support",
    emergencyContact: "Emergency contact",
    emergencyContactNote: "We'll offer to notify this person if you ever tap Emergency during a trip.",
    // Profile
    trustScore: "Trust Score",
    verification: "Verification",
    travelStyle: "Travel style (optional)",
    myTripsCount: "Trips",
    rating: "Rating",
    // Trip status stepper
    statusScheduled: "Confirmed",
    statusEnroute: "Driver en route",
    statusCompleted: "Trip completed",
    // Sections
    openPlans: "Open plans",
    happeningTonight: "Happening tonight",
    weekendAdventures: "Weekend adventures",
    guidedTours: "Guided tours",
    corporatePrograms: "Corporate commute programs",
    myPostedTrips: "Trips you've posted",
    openParcels: "Open parcel requests",
    filterWomen: "Women-only",
    filterBudget: "Budget",
    filterLuxury: "Luxury",
    filterCircle: "My Circle",
    filterLeavingToday: "Leaving today",
    searchPlaceholder: "Any village, cell, sector, or district",
    liveActiveNow: "active right now",
  },
  rw: {
    // Onboarding
    onboardTitle: "Agatigito",
    tagline: "Ntugende wenyine",
    onboardSub: "Ntugende wenyine. Fungura konti yawe kugira ngo utangire kubona cyangwa gutanga intebe.",
    fullName: "Amazina yombi",
    phoneNumber: "Numero ya telefoni",
    emailOptional: "Imeyili (si ngombwa, ifasha kwemeza konti)",
    createAccount: "Fungura konti yanjye",
    creatingAccount: "Turimo gufungura konti…",
    onboardNote: "Iyi prototype ibika amakuru yawe kuri iyi terefone gusa. Kwemeza indangamuntu no gufata ifoto by'ukuri byazongerwaho mu gikorwa nyakuri.",
    // Nav
    navHome: "Ahabanza",
    navRides: "Ingendo",
    navPlans: "Gahunda",
    // Home
    homeGoWhere: "Ugiye he?",
    homeSearchPlaceholder: "Shakisha aho ugiye…",
    homeFindRide: "Shaka urugendo",
    homeFindRideSub: "Shakisha intebe zisanzwe zerekeza aho ugiye",
    homeOfferSeat: "Tanga intebe",
    homeOfferSeatSub: "Andika intebe zisigaye musangire amafaranga y'urugendo",
    homeAdventure: "Urugendo rw'icyumweru",
    homeAdventureSub: "Injira mu itsinda rijya ku misozi cyangwa ku kiyaga",
    homeTonight: "Uyu mugoroba",
    homeTonightSub: "Shakisha abantu berekeza aho ujya ubu",
    homeVibe: "Sangiza inkuru",
    homeVibeSub: "Inkuru n'ubutumwa by'ingendo biva ku bandi bakoresha",
    homeCircles: "Amatsinda",
    homeCirclesSub: "Injira mu matsinda uzi neza — ishuri, akazi, itorero",
    homeAskAI: "Baza Agatigito",
    homeAskAISub: "Sobanura urugendo ushaka mu magambo yawe",
    homeParcel: "Ohereza ipaki",
    homeParcelSub: "Abagenzi bo mu nzira yawe barashobora kuyitwara",
    homeInvite: "Tumira wunguke",
    homeInviteSub: "Bonera amahirwe y'urugendo iyo umuntu winjiye ukoresheje kode yawe",
    homeTours: "Ingendo z'ubukerarugendo",
    homeToursSub: "Gahunda z'iminsi myinshi hamwe n'umuyobozi",
    homeCorporate: "Ingendo z'ikigo",
    homeCorporateSub: "Ingendo zifashijwemo n'ikigo ukoreramo",
    homeMyTrips: "Ingendo natanze",
    homeMyTripsSub: "Genzura intebe, abagenzi, n'aho urugendo rugeze",
    homeBrowseAll: "Reba ingendo zose",
    // Common actions
    confirmPay: "Emeza & wishyure",
    messageDriver: "Ohereza ubutumwa umushoferi",
    cancelTrip: "Kuraho urugendo",
    cancelMySeat: "Kuraho intebe yanjye",
    reserveSpot: "Fata umwanya",
    joinPlan: "Injira muri gahunda",
    joinCircle: "Injira",
    joined: "Wamaze kwinjira",
    startTrip: "Tangira urugendo",
    markCompleted: "Rurangiye",
    postAParcel: "Andika ipaki ushaka kohereza",
    submitRating: "Ohereza igitekerezo",
    backToMarketplace: "Subira ku isoko",
    save: "Bika",
    verify: "Emeza",
    verified: "Byemejwe",
    copyCode: "Koporora kode",
    findMatches: "Shakisha ibihuye",
    // Booking
    pickupPoint: "Aho uzatorerwa",
    pickupSafetyNote: "Kugira ngo ube umutekano, hitamo ahantu rusange aho kugaragaza aho utuye.",
    seats: "Intebe",
    perSeat: "Ku ntebe",
    totalEscrow: "Amafaranga yose abitswe",
    seatConfirmed: "Intebe yemejwe",
    driverWillMeet: "azahura nawe ahantu mwumvikanyeho.",
    shareLiveLocation: "Sangiza aho uri ubu n'uwo mwahisemo mu bibazo byihutirwa",
    // Safety
    emergencySafety: "Ibibazo byihutirwa",
    emergencyTitle: "Ibibazo byihutirwa",
    emergencyIntro: "Niba uri mu kaga gikomeye, hita uhamagara serivisi z'ubutabazi mbere ya byose.",
    call112: "Hamagara 112 (Polisi / Ubutabazi)",
    notifyContact: "Menyesha uwo nahisemo mu bibazo byihutirwa",
    reportProblem: "Menyesha Agatigito ikibazo",
    emergencyContact: "Umuntu wo kumenyesha mu bibazo byihutirwa",
    emergencyContactNote: "Tuzamubwira niba wakanze 'Ibibazo byihutirwa' mu gihe cy'urugendo.",
    // Profile
    trustScore: "Amanota y'icyizere",
    verification: "Kwemeza konti",
    travelStyle: "Uburyo bwo kugenda (si ngombwa)",
    myTripsCount: "Ingendo",
    rating: "Amanota",
    // Trip status stepper
    statusScheduled: "Byemejwe",
    statusEnroute: "Umushoferi ari mu nzira",
    statusCompleted: "Urugendo rurangiye",
    // Sections
    openPlans: "Gahunda zifunguye",
    happeningTonight: "Ibiri kubaho uyu mugoroba",
    weekendAdventures: "Ingendo z'icyumweru",
    guidedTours: "Ingendo z'ubukerarugendo",
    corporatePrograms: "Gahunda z'ingendo z'ibigo",
    myPostedTrips: "Ingendo watanze",
    openParcels: "Ipaki zishakirwa uwazitwara",
    filterWomen: "Abagore gusa",
    filterBudget: "Igiciro gito",
    filterLuxury: "Iby'agaciro",
    filterCircle: "Itsinda ryanjye",
    filterLeavingToday: "Ugenda uyu munsi",
    searchPlaceholder: "Umudugudu, akagari, umurenge, cyangwa akarere",
    liveActiveNow: "abantu barimo gukoresha ubu",
  },
};

export default function App() {
  const [lang, setLang] = useState("en");
  // Named `tr` (not `t`) because the codebase already uses `t` as the loop
  // variable in `trips.map((t) => ...)` — reusing `t` here would shadow it.
  const tr = (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  const [tab, setTab] = useState("home");
  const [roomsFilter, setRoomsFilter] = useState("all"); // all | mountain | night
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [trips, setTrips] = useState(() => INITIAL_TRIPS.map((t) => ({ ...t, status: "scheduled" })));

  // ---- Live activity ---- a lightweight simulated presence signal: the
  // count drifts up/down slightly on an interval so it doesn't look frozen,
  // and a handful of names from the mock passenger pool rotate through the
  // little avatar stack next to it.
  const [liveCount, setLiveCount] = useState(134);
  const [liveFaces, setLiveFaces] = useState(() => MOCK_PASSENGER_POOL.slice(0, 4));
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => Math.max(58, Math.min(240, c + Math.floor(Math.random() * 11) - 5)));
      setLiveFaces(() => {
        const shuffled = [...MOCK_PASSENGER_POOL].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 4);
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // ---- Notification Center ----
  // A running feed of things that have happened — bookings, trip status
  // changes, chat replies, referral credits, admin actions — so events
  // don't just disappear after a two-second toast. Each call also fires
  // the existing toast, so nothing about current behavior changes; this
  // just additionally logs it somewhere revisitable.
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const addNotification = (icon, title, body) => {
    setNotifications((prev) => [
      { id: `n${Date.now()}${Math.random().toString(36).slice(2, 6)}`, icon, title, body, time: "Just now", read: false },
      ...prev,
    ].slice(0, 40));
  };
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllNotificationsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  // ---- Admin ----
  // A hidden entry point (double-tap the header wordmark) opens a PIN
  // gate, then an internal dashboard: platform stats, a driver
  // verification queue, and rider-submitted reports. This models what a
  // real admin console would need — none of the review actions persist
  // to a backend since there isn't one, but the workflow is real.
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminError, setAdminError] = useState("");
  const [verificationQueue, setVerificationQueue] = useState(INITIAL_VERIFICATION_QUEUE);
  const [reportQueue, setReportQueue] = useState(INITIAL_REPORT_QUEUE);
  const ADMIN_DEMO_PIN = "2580"; // prototype only — production needs real staff auth, not a shared PIN

  const openAdminGate = () => {
    setAdminPin("");
    setAdminError("");
    setShowAdminLogin(true);
  };
  const submitAdminPin = (e) => {
    e.preventDefault();
    if (adminPin === ADMIN_DEMO_PIN) {
      setAdminAuthed(true);
      setShowAdminLogin(false);
    } else {
      setAdminError("Incorrect PIN. (Prototype PIN is 2580.)");
    }
  };
  const approveVerification = (id) => {
    const applicant = verificationQueue.find((v) => v.id === id);
    setVerificationQueue((prev) => prev.filter((v) => v.id !== id));
    showToast("Driver approved and notified");
    if (applicant) addNotification("✅", "Driver approved", `${applicant.name}'s vehicle documents were approved.`);
  };
  const rejectVerification = (id) => {
    const applicant = verificationQueue.find((v) => v.id === id);
    setVerificationQueue((prev) => prev.filter((v) => v.id !== id));
    showToast("Application rejected");
    if (applicant) addNotification("✕", "Application rejected", `${applicant.name}'s driver application was declined.`);
  };
  const resolveReport = (id) => {
    setReportQueue((prev) => prev.filter((r) => r.id !== id));
    showToast("Report marked resolved");
    addNotification("🛡️", "Report resolved", "A rider report was marked resolved by admin.");
  };
  const totalRevenue = trips.reduce((sum, t) => {
    const taken = (t.seatsTaken || []).length;
    const fees = calculateFees(t.price);
    return sum + (fees ? fees.fee * taken : 0);
  }, 0);

  const [selectedTrip, setSelectedTrip] = useState(null);

  const [bookingStep, setBookingStep] = useState("detail"); // detail | pay | success
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pickupPoint, setPickupPoint] = useState(PICKUP_POINTS[0]);
  const [customPickup, setCustomPickup] = useState("");
  const [payMethod, setPayMethod] = useState("momo");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ from: "Kigali", to: "", date: "", time: "", seats: "3", price: "", vehicle: "", distance: "", vehicleSize: "sedan", recurring: false });

  // ---- Maps: geocoded points for the post-trip form's route preview ----
  // Populated when DestinationAutocomplete resolves a place, or left null
  // for free-typed text (the haversine fallback below still covers that).
  const [formOriginPoint, setFormOriginPoint] = useState({ lat: -1.9441, lng: 30.0619 }); // Kigali
  const [formDestPoint, setFormDestPoint] = useState(null);

  // ---- Circles ----
  const [showCircles, setShowCircles] = useState(false);

  // ---- In-app chat ----
  const [chatThreads, setChatThreads] = useState({}); // keyed by driver name
  const [activeChatDriver, setActiveChatDriver] = useState(null);
  const [chatInput, setChatInput] = useState("");

  // ---- AI travel assistant ----
  const [showAI, setShowAI] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiSubmittedQuery, setAiSubmittedQuery] = useState("");

  // ---- Parcels ----
  const [parcels, setParcels] = useState(INITIAL_PARCELS);
  const [showPostParcel, setShowPostParcel] = useState(false);
  const [parcelForm, setParcelForm] = useState({ to: "", date: "", size: "Small (fits on lap)", desc: "", reward: "" });

  // ---- Referrals ----
  const [showInvite, setShowInvite] = useState(false);
  const [useCredits, setUseCredits] = useState(false);

  // ---- Tours ----
  const [selectedTour, setSelectedTour] = useState(null);
  const [joinedTours, setJoinedTours] = useState([]);

  // ---- Corporate mobility ----
  const [joinedCorporate, setJoinedCorporate] = useState([]);

  // ---- Safety ----
  const [showSOS, setShowSOS] = useState(false);
  const [shareLive, setShareLive] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({ name: "", phone: "" });

  // ---- Post-trip ratings ----
  const [ratingStars, setRatingStars] = useState(0);
  const [ratingText, setRatingText] = useState("");

  // ---- Booking / cancellation ----
  const [bookingCreditApplied, setBookingCreditApplied] = useState(0);

  const [profile, setProfile] = useState(null); // null = still checking storage
  const [onboardForm, setOnboardForm] = useState({ name: "", phone: "", email: "", hasVehicle: false, vehicleMake: "", vehiclePlate: "", photoDataUrl: "" });
  const [showProfile, setShowProfile] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await window.storage.get("profile");
        if (mounted && res && res.value) {
          setProfile(JSON.parse(res.value));
        }
      } catch (e) {
        // no profile saved yet — onboarding will show
      } finally {
        if (mounted) setStorageReady(true);
      }
    })();
    (async () => {
      try {
        const res = await window.storage.get("language");
        if (mounted && res && res.value) setLang(res.value);
      } catch (e) {
        // default language stays "en"
      }
    })();
    return () => { mounted = false; };
  }, []);

  const changeLang = async (next) => {
    setLang(next);
    try {
      await window.storage.set("language", next);
    } catch (e) {
      // language preference just won't persist across sessions
    }
  };

  useEffect(() => {
    if (profile?.emergencyContact) {
      setEmergencyForm(profile.emergencyContact);
    }
  }, [profile?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProfile = async (next) => {
    setProfile(next);
    try {
      await window.storage.set("profile", JSON.stringify(next));
    } catch (e) {
      showToast("Could not save profile, try again");
    }
  };

  const [creatingAccount, setCreatingAccount] = useState(false);
  const [onboardError, setOnboardError] = useState("");

  const completeOnboarding = (e) => {
    e.preventDefault();
    if (creatingAccount) return; // guard against double-taps
    if (!onboardForm.name.trim() || onboardForm.phone.trim().length < 8) {
      setOnboardError("Enter your full name and a phone number of at least 8 digits.");
      showToast("Enter your name and a valid phone number");
      return;
    }
    setOnboardError("");
    setCreatingAccount(true);
    saveProfile({
      ...DEFAULT_PROFILE,
      name: onboardForm.name.trim(),
      phone: onboardForm.phone.trim(),
      email: onboardForm.email.trim(),
      referralCode: generateReferralCode(onboardForm.name.trim()),
      hasVehicle: onboardForm.hasVehicle,
      vehicleMake: onboardForm.hasVehicle ? onboardForm.vehicleMake.trim() : "",
      vehiclePlate: onboardForm.hasVehicle ? onboardForm.vehiclePlate.trim() : "",
      photoDataUrl: onboardForm.photoDataUrl,
    });
  };

  // Resize a picked image client-side (canvas) before storing it, so a
  // multi-MB phone photo doesn't bloat the profile record — everything
  // happens locally, nothing is uploaded anywhere in this prototype.
  const handlePhotoPick = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 160;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        setOnboardForm((f) => ({ ...f, photoDataUrl: dataUrl }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // ---- OTP-based verification (phone / email / National ID) ----
  const [otpTarget, setOtpTarget] = useState(null); // "phone" | "email" | "id" | null
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [idNumberInput, setIdNumberInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const startVerify = (key) => {
    if (key === "email") {
      const emailToUse = profile.email || emailInput.trim();
      if (!emailToUse) {
        showToast("Enter an email address first");
        return;
      }
      if (!profile.email) {
        saveProfile({ ...profile, email: emailToUse });
      }
    }
    if (key === "id" && !idNumberInput.trim() && !profile.nationalId) {
      showToast("Enter your National ID number first");
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpAttempts(0);
    setOtpTarget(key);
    setOtpValue("");
    const dest = key === "email" ? (profile.email || emailInput.trim()) : profile.phone;
    // In production this code is sent by a real SMS/email gateway and never
    // shown here. Since this prototype has no gateway wired up, it's shown
    // in the toast so you can actually type the matching code, the way a
    // real recipient would read it off their phone or inbox.
    showToast(`Code sent to ${dest} — prototype code: ${code}`, 8000);
  };

  const cancelOtp = () => {
    setOtpTarget(null);
    setOtpValue("");
    setGeneratedOtp("");
    setOtpAttempts(0);
  };

  const confirmOtp = () => {
    if (!otpValue.trim()) {
      showToast("Enter the code you received");
      return;
    }
    if (otpValue.trim() !== generatedOtp) {
      const attempts = otpAttempts + 1;
      setOtpAttempts(attempts);
      if (attempts >= 5) {
        showToast("Too many wrong attempts — request a new code");
        setOtpTarget(null);
        setOtpValue("");
        setGeneratedOtp("");
        setOtpAttempts(0);
      } else {
        showToast(`Incorrect code (${5 - attempts} attempts left)`);
      }
      return;
    }
    const next = {
      ...profile,
      verified: { ...profile.verified, [otpTarget]: true },
      nationalId: otpTarget === "id" ? (idNumberInput.trim() || profile.nationalId) : profile.nationalId,
    };
    saveProfile(next);
    setOtpTarget(null);
    setOtpValue("");
    setGeneratedOtp("");
    setOtpAttempts(0);
    showToast("Verified");
  };

  const toastTimer = useRef(null);
  const showToast = (msg, duration = 2200) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), duration);
  };

  const toggleFilter = (f) => {
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const passesFilters = (t) => {
    if (t.status === "cancelled") return false;
    const matchesWomen = !activeFilters.includes("women") || t.driver.womenOnly;
    const matchesBudget = !activeFilters.includes("budget") || t.price <= 8000;
    const matchesLuxury = !activeFilters.includes("luxury") || t.price >= 12000;
    const matchesCircle = !activeFilters.includes("circle") || (profile?.circles?.length > 0 && t.driver.circleId && profile.circles.includes(t.driver.circleId));
    return matchesWomen && matchesBudget && matchesLuxury && matchesCircle;
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const matchesQuery =
        !query ||
        t.to.toLowerCase().includes(query.toLowerCase()) ||
        t.from.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && passesFilters(t);
    });
  }, [trips, query, activeFilters]);

  // Smart Matching: if the exact destination has no results, surface trips
  // whose route passes near it instead of leaving the person empty-handed.
  // Each trip carries a list of waypoints with a route-match % and a
  // deviation distance (how far off the driver's direct path the detour
  // would be) so the passenger can judge the fit before opening the trip.
  const smartMatches = useMemo(() => {
    if (!query || filteredTrips.length > 0) return [];
    const q = query.toLowerCase();
    return trips
      .filter((t) => passesFilters(t) && t.waypoints && t.waypoints.some((w) => w.name.toLowerCase().includes(q)))
      .map((t) => ({ ...t, matchWaypoint: t.waypoints.find((w) => w.name.toLowerCase().includes(q)) }))
      .sort((a, b) => b.matchWaypoint.matchPct - a.matchWaypoint.matchPct);
  }, [trips, query, activeFilters, filteredTrips]);

  const openTrip = (trip) => {
    setSelectedTrip(trip);
    const total = trip.seatsTotal || trip.seatsAvailable;
    const taken = trip.seatsTaken || [];
    const firstOpen = Array.from({ length: total }, (_, i) => i).find((id) => !taken.includes(id));
    setSelectedSeats(firstOpen !== undefined ? [firstOpen] : []);
    setPickupPoint(PICKUP_POINTS[0]);
    setCustomPickup("");
    setUseCredits(false);
    setShareLive(false);
    setRatingStars(0);
    setRatingText("");
    setBookingCreditApplied(0);
    setBookingStep("detail");
  };

  const toggleSeat = (id) => {
    setSelectedSeats((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      const total = selectedTrip.seatsTotal || selectedTrip.seatsAvailable;
      const taken = selectedTrip.seatsTaken || [];
      const maxSelectable = total - taken.length;
      if (prev.length >= maxSelectable) {
        showToast(`Only ${maxSelectable} seat${maxSelectable === 1 ? "" : "s"} available on this trip`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const closeSheet = () => {
    setSelectedTrip(null);
    setSelectedRoom(null);
  };

  // ---- Circles ----
  const toggleCircle = (circleId) => {
    if (!profile) return;
    const current = profile.circles || [];
    const next = current.includes(circleId) ? current.filter((c) => c !== circleId) : [...current, circleId];
    saveProfile({ ...profile, circles: next });
    showToast(current.includes(circleId) ? "Left circle" : "Joined circle");
  };

  // ---- In-app chat ----
  const CHAT_AUTO_REPLIES = [
    "Sounds good, see you at the pickup point!",
    "Sure thing 👍",
    "I'll be there right on time.",
    "No problem at all — just message me if plans change.",
    "Got it, thanks for the heads up.",
  ];

  const openChat = (driver) => {
    setActiveChatDriver(driver);
    setChatThreads((prev) => {
      if (prev[driver.name]) return prev;
      return {
        ...prev,
        [driver.name]: [
          { from: "them", text: "Hi! Thanks for reaching out — happy to answer anything before the trip.", time: "Just now" },
        ],
      };
    });
  };

  const closeChat = () => setActiveChatDriver(null);

  const sendChat = () => {
    if (!chatInput.trim() || !activeChatDriver) return;
    const name = activeChatDriver.name;
    const myMsg = { from: "me", text: chatInput.trim(), time: "Just now" };
    setChatThreads((prev) => ({ ...prev, [name]: [...(prev[name] || []), myMsg] }));
    setChatInput("");
    setTimeout(() => {
      const reply = CHAT_AUTO_REPLIES[Math.floor(Math.random() * CHAT_AUTO_REPLIES.length)];
      setChatThreads((prev) => ({ ...prev, [name]: [...(prev[name] || []), { from: "them", text: reply, time: "Just now" }] }));
      addNotification("💬", `New message from ${name}`, reply);
    }, 900);
  };

  // ---- AI travel assistant ----
  // Lightweight keyword parser: pulls a destination (matched against known
  // place names across every trip's route), a budget ceiling ("under
  // 12000" / "12000 rwf"), and a travel-personality keyword out of a
  // free-text sentence, then filters + ranks the trip list. This is the
  // "type a sentence, get matches" experience, running only on real
  // marketplace data rather than a live model.
  const aiResults = useMemo(() => {
    if (!aiSubmittedQuery) return [];
    const lower = aiSubmittedQuery.toLowerCase();

    const placeNames = new Set();
    trips.forEach((t) => {
      placeNames.add(t.to);
      placeNames.add(t.from);
      (t.waypoints || []).forEach((w) => placeNames.add(w.name));
    });
    const destination = [...placeNames]
      .sort((a, b) => b.length - a.length) // longer names first so "Volcanoes NP" beats "NP"-ish substrings
      .find((p) => lower.includes(p.toLowerCase()));

    const budgetMatch = lower.match(/(\d{3,6})\s*(rwf|frw)?/);
    const budget = budgetMatch ? Number(budgetMatch[1]) : null;

    const personality = TRAVEL_PERSONALITIES.find((p) => {
      const word = p.label.replace(/[^\w\s]/g, "").trim().toLowerCase();
      return lower.includes(word);
    });

    const womenOnly = lower.includes("women") || lower.includes("women-only") || lower.includes("female");

    return trips
      .filter((t) => {
        if (t.seatsAvailable <= 0) return false;
        const destOk =
          !destination ||
          t.to.toLowerCase() === destination.toLowerCase() ||
          t.to.toLowerCase().includes(destination.toLowerCase()) ||
          (t.waypoints || []).some((w) => w.name.toLowerCase() === destination.toLowerCase());
        const budgetOk = !budget || t.price <= budget;
        const personalityOk = !personality || t.driver.travelPersonality === personality.key;
        const womenOk = !womenOnly || t.driver.womenOnly;
        return destOk && budgetOk && personalityOk && womenOk;
      })
      .map((t) => {
        const wp = destination ? (t.waypoints || []).find((w) => w.name.toLowerCase() === destination.toLowerCase()) : null;
        return { ...t, matchWaypoint: wp || null };
      })
      .sort((a, b) => (b.matchWaypoint?.matchPct || 100) - (a.matchWaypoint?.matchPct || 100));
  }, [aiSubmittedQuery, trips]);

  const runAiSearch = () => {
    if (!aiQuery.trim()) {
      showToast("Type what you're looking for first");
      return;
    }
    setAiSubmittedQuery(aiQuery.trim());
  };

  // ---- Referrals ----
  const REFERRAL_CREDIT_AMOUNT = 1500; // RWF, awarded to both sides
  const simulateReferral = () => {
    if (!profile) return;
    saveProfile({
      ...profile,
      referralCredits: (profile.referralCredits || 0) + REFERRAL_CREDIT_AMOUNT,
      referredCount: (profile.referredCount || 0) + 1,
    });
    showToast(`A friend joined with your code — you earned ${REFERRAL_CREDIT_AMOUNT.toLocaleString()} RWF`);
    addNotification("🎁", "Referral credit earned", `A friend joined with your code — you earned ${REFERRAL_CREDIT_AMOUNT.toLocaleString()} RWF in ride credits.`);
  };

  // ---- Tours ----
  const joinTour = (tourId) => {
    if (!joinedTours.includes(tourId)) {
      setJoinedTours((prev) => [...prev, tourId]);
      showToast("Spot reserved — the guide will confirm departure details");
      const tour = TOURS.find((t) => t.id === tourId);
      if (tour) addNotification("🏔️", "Tour spot reserved", `${tour.title} — next departure ${tour.nextDeparture}.`);
    }
  };

  // ---- Corporate mobility ----
  const joinCorporate = (programId) => {
    if (!joinedCorporate.includes(programId)) {
      setJoinedCorporate((prev) => [...prev, programId]);
      showToast("Joined — your company covers the subsidized portion automatically");
      const program = CORPORATE_PROGRAMS.find((p) => p.id === programId);
      if (program) addNotification("🏢", "Joined corporate commute", `${program.company} — ${program.route}.`);
    }
  };

  // ---- Driver-side trip management & tracking ----
  const updateTripStatus = (tripId, status) => {
    const trip = trips.find((t) => t.id === tripId);
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status } : t)));
    showToast(
      status === "enroute" ? "Passengers notified you're on the way" :
      status === "completed" ? "Trip marked complete — funds released to you" :
      "Trip updated"
    );
    if (trip) {
      addNotification(
        status === "enroute" ? "🚗" : "✅",
        status === "enroute" ? "Trip started" : "Trip completed",
        `${trip.from} → ${trip.to} · ${status === "enroute" ? "you marked this trip as en route" : "funds released to you"}.`
      );
    }
  };

  const cancelPostedTrip = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status: "cancelled" } : t)));
    showToast("Trip cancelled — booked passengers will be refunded");
    if (trip) addNotification("✕", "Trip cancelled", `${trip.from} → ${trip.to} was cancelled. Booked passengers will be refunded.`);
  };

  // ---- Safety ----
  const saveEmergencyContact = (e) => {
    e.preventDefault();
    if (!profile) return;
    if (!emergencyForm.name.trim() || emergencyForm.phone.trim().length < 8) {
      showToast("Enter a name and a valid phone number");
      return;
    }
    saveProfile({ ...profile, emergencyContact: { name: emergencyForm.name.trim(), phone: emergencyForm.phone.trim() } });
    showToast("Emergency contact saved");
  };

  const notifyEmergencyContact = () => {
    if (!profile?.emergencyContact?.name) {
      showToast("Add an emergency contact in your profile first");
      return;
    }
    showToast(`${profile.emergencyContact.name} has been sent your trip details and live location`);
    setShowSOS(false);
  };

  // ---- Parcels ----
  const submitParcel = (e) => {
    e.preventDefault();
    if (!parcelForm.to.trim() || !parcelForm.desc.trim() || !parcelForm.reward) {
      showToast("Fill in destination, description, and reward");
      return;
    }
    const newParcel = {
      id: `p${Date.now()}`,
      from: "Kigali",
      to: parcelForm.to.trim(),
      date: parcelForm.date.trim() || "Flexible",
      size: parcelForm.size,
      desc: parcelForm.desc.trim(),
      reward: Number(parcelForm.reward),
      posterName: profile ? profile.name : "You",
      posterInitials: profile ? initialsFromName(profile.name) : "??",
    };
    setParcels((prev) => [newParcel, ...prev]);
    setParcelForm({ to: "", date: "", size: "Small (fits on lap)", desc: "", reward: "" });
    setShowPostParcel(false);
    showToast("Parcel request posted");
    addNotification("📦", "Parcel request posted", `Kigali → ${newParcel.to} · ${newParcel.reward.toLocaleString()} RWF reward.`);
  };

  const goToPayment = () => {
    if (selectedSeats.length === 0) {
      showToast("Select at least one seat");
      return;
    }
    if (pickupPoint === "Propose another spot" && !customPickup.trim()) {
      showToast("Enter your proposed pickup spot");
      return;
    }
    setBookingStep("pay");
  };

  const confirmBooking = () => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === selectedTrip.id
          ? {
              ...t,
              seatsAvailable: t.seatsAvailable - selectedSeats.length,
              seatsTaken: [...(t.seatsTaken || []), ...selectedSeats],
            }
          : t
      )
    );
    let applied = 0;
    if (profile) {
      const total = selectedTrip.price * selectedSeats.length;
      applied = useCredits && profile.referralCredits ? Math.min(profile.referralCredits, total) : 0;
      saveProfile({ ...profile, tripsCompleted: profile.tripsCompleted + 1, referralCredits: (profile.referralCredits || 0) - applied });
    }
    setBookingCreditApplied(applied);
    setUseCredits(false);
    setBookingStep("success");
    addNotification("🎟️", "Seat confirmed", `${selectedTrip.from} → ${selectedTrip.to}, ${selectedTrip.date} · ${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""}.`);
  };

  const cancelMyBooking = () => {
    if (!selectedTrip) return;
    setTrips((prev) =>
      prev.map((t) =>
        t.id === selectedTrip.id
          ? {
              ...t,
              seatsAvailable: t.seatsAvailable + selectedSeats.length,
              seatsTaken: (t.seatsTaken || []).filter((s) => !selectedSeats.includes(s)),
            }
          : t
      )
    );
    if (profile) {
      saveProfile({
        ...profile,
        tripsCompleted: Math.max(0, profile.tripsCompleted - 1),
        referralCredits: (profile.referralCredits || 0) + bookingCreditApplied,
      });
    }
    showToast("Seat cancelled — refund processed" + (bookingCreditApplied > 0 ? " and credit returned" : ""));
    addNotification("✕", "Seat cancelled", `${selectedTrip.from} → ${selectedTrip.to} · refund processed.`);
    closeSheet();
  };

  const submitDriverRating = (tripId, stars, text) => {
    if (!stars) return;
    setTrips((prev) => {
      const target = prev.find((t) => t.id === tripId);
      if (!target) return prev;
      const driverName = target.driver.name;
      return prev.map((t) => {
        if (t.id === tripId) {
          const reviews = text.trim()
            ? [{ name: profile?.name || "Passenger", text: text.trim() }, ...(t.reviews || [])]
            : t.reviews || [];
          return { ...t, passengerRating: stars, reviews };
        }
        if (t.driver.name === driverName) {
          const newRating = Math.round(((t.driver.rating + stars) / 2) * 100) / 100;
          return { ...t, driver: { ...t.driver, rating: newRating } };
        }
        return t;
      });
    });
    showToast("Thanks — your rating helps other passengers");
  };

  const [roomsData, setRoomsData] = useState(ROOMS);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomForm, setRoomForm] = useState({ title: "", type: "mountain", sub: "" });

  const joinRoom = (roomId) => {
    if (!joinedRooms.includes(roomId)) {
      setJoinedRooms((prev) => [...prev, roomId]);
      setRoomsData((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, members: [...r.members, initialsFromName(profile.name)] } : r))
      );
      setSelectedRoom((prev) => prev && prev.id === roomId ? { ...prev, members: [...prev.members, initialsFromName(profile.name)] } : prev);
      showToast("You joined the plan");
    }
  };

  const submitRoom = (e) => {
    e.preventDefault();
    if (!roomForm.title.trim() || !roomForm.sub.trim()) {
      showToast("Add a title and a short detail line");
      return;
    }
    const newRoom = {
      id: "r" + Date.now(),
      title: roomForm.title.trim(),
      sub: roomForm.sub.trim(),
      icon: roomForm.type,
      members: [initialsFromName(profile.name)],
    };
    setRoomsData((prev) => [newRoom, ...prev]);
    setJoinedRooms((prev) => [...prev, newRoom.id]);
    setRoomForm({ title: "", type: "mountain", sub: "" });
    setShowCreateRoom(false);
    setRoomsFilter("all");
    showToast("Plan created");
  };

  const [vibesData, setVibesData] = useState(VIBES);
  const [vibeText, setVibeText] = useState("");
  const [vibePostAnon, setVibePostAnon] = useState(false);
  const [likedVibes, setLikedVibes] = useState([]);
  const [vibeMedia, setVibeMedia] = useState(null);

  const submitVibe = () => {
    if (!vibeText.trim() && !vibeMedia) {
      showToast("Write something or attach a photo/video first");
      return;
    }
    const newVibe = {
      id: "v" + Date.now(),
      author: vibePostAnon ? "Anonymous" : profile.name,
      anonymous: vibePostAnon,
      mood: "✨",
      text: vibeText.trim(),
      likes: 0,
      media: vibeMedia,
    };
    setVibesData((prev) => [newVibe, ...prev]);
    setVibeText("");
    setVibeMedia(null);
    showToast(vibePostAnon ? "Posted anonymously" : "Posted");
  };

  const toggleLikeVibe = (id) => {
    const alreadyLiked = likedVibes.includes(id);
    setLikedVibes((prev) => (alreadyLiked ? prev.filter((x) => x !== id) : [...prev, id]));
    setVibesData((prev) => prev.map((post) => (post.id === id ? { ...post, likes: post.likes + (alreadyLiked ? -1 : 1) } : post)));
  };

  const reportVibe = () => {
    showToast("Reported — our safety team reviews this within 24 hours");
  };

  const submitTrip = (e) => {
    e.preventDefault();
    if (!form.to || !form.date || !form.time || !form.price || !form.vehicle) {
      showToast("Fill in every field first");
      return;
    }
    const fairRange = estimateFarePerSeat(form.distance, form.vehicleSize, form.seats);
    if (fairRange) {
      const entered = Number(form.price);
      if (entered < fairRange.min || entered > fairRange.max) {
        showToast(`Fair Price requires ${fairRange.min.toLocaleString()}–${fairRange.max.toLocaleString()} RWF/seat for this route`);
        return;
      }
    }
    const { level } = getLevelInfo(profile.tripsCompleted);
    const newTrip = {
      id: "t" + Date.now(),
      from: form.from,
      to: form.to,
      date: form.date,
      time: form.time,
      distance: form.distance ? Number(form.distance) : null,
      recurring: form.recurring,
      seatsAvailable: Number(form.seats),
      seatsTotal: Number(form.seats),
      seatsTaken: [],
      status: "scheduled",
      price: Number(form.price),
      vehicle: form.vehicle,
      plate: "RAX " + Math.floor(100 + Math.random() * 900) + " N",
      driver: {
        name: profile.name,
        initials: initialsFromName(profile.name),
        rating: profile.rating || 5.0,
        trips: profile.tripsCompleted,
        level,
        womenOnly: false,
        travelPersonality: profile.travelPersonality,
      },
      amenities: ["ac"],
      reviews: [],
    };
    setTrips((prev) => [newTrip, ...prev]);
    setForm({ from: "Kigali", to: "", date: "", time: "", seats: "3", price: "", vehicle: "", distance: "", vehicleSize: "sedan", recurring: false });
    setFormDestPoint(null);
    setTab("market");
    showToast("Trip posted to the marketplace");
  };

  return (
    <div className="agt">
      <style>{STYLES}</style>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
      `}</style>

      <Toast message={toast} />

      {storageReady && !profile && (
        <div className="agt-onboard-overlay">
          <div className="agt-lang-toggle onboard" style={{ marginBottom: 14 }}>
            <button type="button" className={lang === "en" ? "active" : ""} onClick={() => changeLang("en")}>EN</button>
            <button type="button" className={lang === "rw" ? "active" : ""} onClick={() => changeLang("rw")}>RW</button>
          </div>
          <div className="agt-onboard-mark">{tr("onboardTitle")}</div>
          <div className="agt-onboard-sub">
            <TravelPulse width={30} />
            {tr("onboardSub")}
          </div>
          <div className="agt-onboard-card">
            <div style={{ marginBottom: 18 }}>
              <ImigongoStrip height={10} colors={["var(--gold)", "var(--clay)", "var(--forest)"]} />
            </div>
            <div>
              <div className="agt-photo-picker">
                <label htmlFor="agt-photo-input" className="agt-photo-circle">
                  {onboardForm.photoDataUrl ? (
                    <img src={onboardForm.photoDataUrl} alt="" />
                  ) : (
                    <ImagePlus size={20} color="var(--forest)" />
                  )}
                </label>
                <input
                  id="agt-photo-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handlePhotoPick(e.target.files && e.target.files[0])}
                />
                <span className="agt-photo-hint">{onboardForm.photoDataUrl ? "Tap to change photo" : "Add a profile photo (optional)"}</span>
              </div>
              <div className="agt-field">
                <label>{tr("fullName")}</label>
                <input
                  placeholder="e.g. Mpogazi K."
                  value={onboardForm.name}
                  onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                />
              </div>
              <div className="agt-field">
                <label>{tr("phoneNumber")}</label>
                <input
                  placeholder="078X XXX XXX"
                  value={onboardForm.phone}
                  onChange={(e) => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                />
              </div>
              <div className="agt-field">
                <label>{tr("emailOptional")}</label>
                <input
                  placeholder="you@email.com"
                  value={onboardForm.email}
                  onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                />
              </div>
              <div className="agt-vehicle-toggle">
                <span>I have a vehicle and may offer rides</span>
                <div className={`agt-switch ${onboardForm.hasVehicle ? "on" : ""}`} onClick={() => setOnboardForm({ ...onboardForm, hasVehicle: !onboardForm.hasVehicle })}>
                  <div className="agt-switch-knob" />
                </div>
              </div>
              {onboardForm.hasVehicle && (
                <div className="agt-field-row">
                  <div className="agt-field">
                    <label>Vehicle make & model</label>
                    <input
                      placeholder="e.g. Toyota RAV4"
                      value={onboardForm.vehicleMake}
                      onChange={(e) => setOnboardForm({ ...onboardForm, vehicleMake: e.target.value })}
                    />
                  </div>
                  <div className="agt-field">
                    <label>Plate number</label>
                    <input
                      placeholder="RAD 123 A"
                      value={onboardForm.vehiclePlate}
                      onChange={(e) => setOnboardForm({ ...onboardForm, vehiclePlate: e.target.value })}
                    />
                  </div>
                </div>
              )}
              {onboardError && (
                <p style={{ fontSize: 12, color: "#B5542A", fontWeight: 600, margin: "-4px 0 12px 0" }}>{onboardError}</p>
              )}
              <button className="agt-primary-btn" type="button" onClick={completeOnboarding} disabled={creatingAccount} style={creatingAccount ? { opacity: 0.7 } : {}}>
                <Compass size={16} /> {creatingAccount ? tr("creatingAccount") : tr("createAccount")}
              </button>
            </div>
          </div>
          <div className="agt-onboard-note">
            {tr("onboardNote")}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="agt-header">
        <div className="agt-header-top">
          <div className="agt-logo" onDoubleClick={openAdminGate} title="">
            <span className="agt-logo-mark">Agatigito</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="agt-bell-wrap" onClick={() => { setShowNotifications(true); markAllNotificationsRead(); }}>
              <Bell size={19} color="var(--paper)" />
              {unreadCount > 0 && <span className="agt-bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </div>
            <div className="agt-lang-toggle">
              <button type="button" className={lang === "en" ? "active" : ""} onClick={() => changeLang("en")}>EN</button>
              <button type="button" className={lang === "rw" ? "active" : ""} onClick={() => changeLang("rw")}>RW</button>
            </div>
            <div className="agt-profile-pill" onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }}>
              <div className="agt-avatar-sm">
                {profile?.photoDataUrl ? <img src={profile.photoDataUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: "999px", objectFit: "cover" }} /> : profile ? initialsFromName(profile.name) : "?"}
              </div>
              {profile ? profile.name.split(" ")[0] : "Kigali"}
            </div>
          </div>
        </div>
        <div className="agt-logo-tag" style={{ marginTop: "-8px", marginBottom: "14px" }}>
          {tr("tagline")}
          <TravelPulse width={22} />
        </div>
        <div className="agt-tabs">
          <button className={`agt-tab ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}>{tr("navHome")}</button>
          <button className={`agt-tab ${tab === "market" ? "active" : ""}`} onClick={() => setTab("market")}>{tr("navRides")}</button>
          <button className={`agt-tab ${tab === "rooms" ? "active" : ""}`} onClick={() => setTab("rooms")}>{tr("navPlans")}</button>
        </div>
        <div style={{ marginTop: 14 }}>
          <ImigongoStrip height={9} colors={["var(--gold)", "var(--clay-light)", "rgba(246,241,230,0.28)"]} />
        </div>
      </div>

      {tab === "home" && profile && (
        <div className="agt-body" style={{ paddingTop: 30 }}>
          <div className="agt-home-hero">
            <div className="agt-home-greet">{lang === "rw" ? "Muraho" : "Hey"} {profile.name.split(" ")[0]},</div>
            <div className="agt-home-question">{tr("homeGoWhere")}</div>
          </div>

          <div className="agt-live-badge">
            <div className="agt-live-avatars">
              {liveFaces.map((name) => (
                <div className="agt-live-avatar" key={name}>{initialsFromName(name)}</div>
              ))}
            </div>
            <div className="agt-live-dot" />
            <span className="agt-live-text"><strong>{liveCount}</strong> {tr("liveActiveNow")}</span>
          </div>

          <div className="agt-branch-grid">
            <div className="agt-branch-card" onClick={() => { setQuery(""); setActiveFilters([]); setTab("market"); }}>
              <div className="agt-branch-icon"><Compass size={19} /></div>
              <div className="agt-branch-title">{tr("homeFindRide")}</div>
              <div className="agt-branch-sub">{tr("homeFindRideSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setTab("post")}>
              <div className="agt-branch-icon"><Plus size={19} /></div>
              <div className="agt-branch-title">{tr("homeOfferSeat")}</div>
              <div className="agt-branch-sub">{tr("homeOfferSeatSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => { setRoomsFilter("mountain"); setTab("rooms"); }}>
              <div className="agt-branch-icon"><Mountain size={19} /></div>
              <div className="agt-branch-title">{tr("homeAdventure")}</div>
              <div className="agt-branch-sub">{tr("homeAdventureSub")}</div>
            </div>
            <div className="agt-branch-card tonight" onClick={() => { setRoomsFilter("night"); setTab("rooms"); }}>
              <div className="agt-branch-icon"><Moon size={19} /></div>
              <div className="agt-branch-title">{tr("homeTonight")}</div>
              <div className="agt-branch-sub">{tr("homeTonightSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setTab("vibes")}>
              <div className="agt-branch-icon"><Sparkles size={19} /></div>
              <div className="agt-branch-title">{tr("homeVibe")}</div>
              <div className="agt-branch-sub">{tr("homeVibeSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setShowCircles(true)}>
              <div className="agt-branch-icon"><Users size={19} /></div>
              <div className="agt-branch-title">{tr("homeCircles")}</div>
              <div className="agt-branch-sub">{tr("homeCirclesSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setShowAI(true)}>
              <div className="agt-branch-icon"><MessageCircle size={19} /></div>
              <div className="agt-branch-title">{tr("homeAskAI")}</div>
              <div className="agt-branch-sub">{tr("homeAskAISub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setTab("parcel")}>
              <div className="agt-branch-icon"><Luggage size={19} /></div>
              <div className="agt-branch-title">{tr("homeParcel")}</div>
              <div className="agt-branch-sub">{tr("homeParcelSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setShowInvite(true)}>
              <div className="agt-branch-icon"><Award size={19} /></div>
              <div className="agt-branch-title">{tr("homeInvite")}</div>
              <div className="agt-branch-sub">{tr("homeInviteSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setTab("tours")}>
              <div className="agt-branch-icon"><Camera size={19} /></div>
              <div className="agt-branch-title">{tr("homeTours")}</div>
              <div className="agt-branch-sub">{tr("homeToursSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setTab("corporate")}>
              <div className="agt-branch-icon"><Building2 size={19} /></div>
              <div className="agt-branch-title">{tr("homeCorporate")}</div>
              <div className="agt-branch-sub">{tr("homeCorporateSub")}</div>
            </div>
            <div className="agt-branch-card" onClick={() => setTab("mytrips")}>
              <div className="agt-branch-icon"><Car size={19} /></div>
              <div className="agt-branch-title">{tr("homeMyTrips")}</div>
              <div className="agt-branch-sub">{tr("homeMyTripsSub")}</div>
            </div>
            <div className="agt-branch-card wide" onClick={() => { setQuery(""); setActiveFilters([]); setTab("market"); }}>
              <div className="agt-branch-icon"><RouteIcon size={19} /></div>
              <div>
                <div className="agt-branch-title">{tr("homeBrowseAll")}</div>
                <div className="agt-branch-sub">See every open trip on the marketplace</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "market" && (
        <>
          <div style={{ padding: "0 16px" }}>
            <div className="agt-search-bar">
              <Search size={17} color="#9C9284" />
              <DestinationAutocomplete
                placeholder={tr("searchPlaceholder")}
                value={query}
                onChange={setQuery}
                onSelect={() => {}}
              />
            </div>
          </div>

          <div className="agt-body">
            <div className="agt-filters">
              <button className={`agt-chip ${activeFilters.includes("women") ? "active" : ""}`} onClick={() => toggleFilter("women")}>
                {tr("filterWomen")}
              </button>
              <button className={`agt-chip ${activeFilters.includes("budget") ? "active" : ""}`} onClick={() => toggleFilter("budget")}>
                {tr("filterBudget")}
              </button>
              <button className={`agt-chip ${activeFilters.includes("luxury") ? "active" : ""}`} onClick={() => toggleFilter("luxury")}>
                {tr("filterLuxury")}
              </button>
              <button className={`agt-chip ${activeFilters.includes("circle") ? "active" : ""}`} onClick={() => toggleFilter("circle")}>
                <Users size={12} /> {tr("filterCircle")}
              </button>
              <button className="agt-chip" onClick={() => showToast("Leaving-today filter coming in phase 2")}>
                {tr("filterLeavingToday")}
              </button>
            </div>

            {smartMatches.length > 0 && (
              <div className="agt-match-banner">
                <Compass size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  No one's headed straight to <strong>{query}</strong>, but {smartMatches.length === 1 ? "this trip passes" : "these trips pass"} through it on the way — best match is{" "}
                  <strong>{smartMatches[0].matchWaypoint.matchPct}%</strong>, about {smartMatches[0].matchWaypoint.deviationKm} km off the driver's direct route.
                </span>
              </div>
            )}

            <div className="agt-section-label">
              <span>{(smartMatches.length > 0 ? smartMatches : filteredTrips).length} trips found</span>
              <span style={{ color: "#8A8172", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>sorted by soonest</span>
            </div>

            {(smartMatches.length > 0 ? smartMatches : filteredTrips).map((t) => {
              const isFull = t.seatsAvailable <= 0;
              return (
              <div className={`agt-ticket ${isFull ? "full" : ""}`} key={t.id} onClick={() => (isFull ? showToast("This trip is fully booked") : openTrip(t))}>
                <div className="agt-ticket-top">
                  <div className="agt-ticket-route-row">
                    <span className="agt-ticket-place">{t.from}</span>
                    <RouteLine />
                    <span className="agt-ticket-place">{t.to}</span>
                  </div>
                  <div className="agt-ticket-meta">
                    <span><Clock size={11} /> {t.date}, {t.time}</span>
                    <span><Car size={11} /> {t.vehicle}</span>
                    {t.distance && <span><RouteIcon size={11} /> {t.distance} km</span>}
                  </div>
                  {t.matchWaypoint && (
                    <div className="agt-match-row">
                      <Compass size={12} style={{ flexShrink: 0 }} />
                      <div>
                        <div><strong>{t.matchWaypoint.matchPct}% route match</strong> · {t.matchWaypoint.deviationKm} km detour via {t.matchWaypoint.name}</div>
                        <div className="agt-match-pts">
                          <span>Pickup: {t.from}</span>
                          <span>Drop-off near {t.matchWaypoint.name}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    {t.driver.womenOnly && <span className="agt-badge women">{tr("filterWomen")}</span>}
                    <span className="agt-badge gold">{t.driver.level}</span>
                    {profile?.circles?.includes(t.driver.circleId) && (
                      <span className="agt-badge seats"><Users size={9} style={{ marginRight: 2, verticalAlign: -1 }} />{CIRCLES.find((c) => c.id === t.driver.circleId)?.name.split(" ")[0]} circle</span>
                    )}
                    {t.recurring && <span className="agt-badge seats">🔁 Weekly</span>}
                    {t.driver.travelPersonality && (
                      <span className="agt-badge seats">{TRAVEL_PERSONALITIES.find((p) => p.key === t.driver.travelPersonality)?.label}</span>
                    )}
                    {isFull ? (
                      <span className="agt-badge full">Fully booked</span>
                    ) : (
                      <span className="agt-badge seats">{t.seatsAvailable} seats left</span>
                    )}
                  </div>
                </div>
                <div className="agt-ticket-perf" />
                <div className="agt-ticket-bottom">
                  <div className="agt-driver">
                    <div className="agt-avatar">{t.driver.initials}</div>
                    <div>
                      <div className="agt-driver-name">{t.driver.name}</div>
                      <div className="agt-driver-sub"><Star size={10} fill="#D9A441" color="#D9A441" /> {t.driver.rating} · {t.driver.trips} trips</div>
                    </div>
                  </div>
                  <div className="agt-price">
                    <div className="agt-price-num">{t.price.toLocaleString()} RWF</div>
                    <div className="agt-price-sub">per seat</div>
                  </div>
                </div>
              </div>
              );
            })}

            {filteredTrips.length === 0 && smartMatches.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#8A8172", fontSize: 13.5 }}>
                No trips match yet — try clearing a filter, or post your own route.
              </div>
            )}
          </div>

          <button className="agt-fab" onClick={() => setTab("post")}>
            <Plus size={16} /> Post a trip
          </button>
        </>
      )}

      {tab === "rooms" && (
        <div className="agt-body" style={{ paddingTop: 28 }}>
          <div className="agt-filters" style={{ marginBottom: 4 }}>
            <button className={`agt-chip ${roomsFilter === "all" ? "active" : ""}`} onClick={() => setRoomsFilter("all")}>All rooms</button>
            <button className={`agt-chip ${roomsFilter === "mountain" ? "active" : ""}`} onClick={() => setRoomsFilter("mountain")}>Adventures</button>
            <button className={`agt-chip ${roomsFilter === "night" ? "active" : ""}`} onClick={() => setRoomsFilter("night")}><Moon size={12} /> Tonight</button>
          </div>
          <div className="agt-section-label">
            <span>{roomsFilter === "all" ? tr("openPlans") : roomsFilter === "night" ? tr("happeningTonight") : tr("weekendAdventures")}</span>
          </div>
          {roomsData.filter((r) => roomsFilter === "all" || r.icon === roomsFilter).map((r) => (
            <div className="agt-room-card" key={r.id} onClick={() => setSelectedRoom(r)}>
              <div className="agt-room-icon">
                {r.icon === "mountain" ? <Mountain size={19} /> : <Moon size={19} />}
              </div>
              <div className="agt-room-title">{r.title}</div>
              <div className="agt-room-sub">{r.sub}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="agt-room-avatars">
                  {r.members.slice(0, 4).map((m, i) => (
                    <div className="agt-avatar-sm2" key={i}>{m}</div>
                  ))}
                </div>
                <ChevronRight size={16} color="#8A8172" />
              </div>
            </div>
          ))}
          <button className="agt-secondary-btn" onClick={() => setShowCreateRoom(true)}>
            <Plus size={15} style={{ marginRight: 6, verticalAlign: -3 }} /> Start a new plan
          </button>
        </div>
      )}

      {showCreateRoom && (
        <div className="agt-overlay" onClick={() => setShowCreateRoom(false)}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={() => setShowCreateRoom(false)}><X size={16} /></div>
            <div className="agt-sheet-body" style={{ paddingTop: 30 }}>
              <div className="agt-section-label"><span>Start a new plan</span></div>
              <div className="agt-field">
                <label>Plan title</label>
                <input placeholder="e.g. Nyungwe Forest Weekend" value={roomForm.title} onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })} />
              </div>
              <div className="agt-field">
                <label>Type</label>
                <select value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}>
                  <option value="mountain">Adventure / weekend trip</option>
                  <option value="night">Tonight / night out</option>
                </select>
              </div>
              <div className="agt-field">
                <label>Details</label>
                <input placeholder="e.g. Sat–Sun · meeting at Nyabugogo" value={roomForm.sub} onChange={(e) => setRoomForm({ ...roomForm, sub: e.target.value })} />
              </div>
              <button className="agt-primary-btn" onClick={submitRoom}>
                <Users size={16} /> Create plan
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "vibes" && (
        <div className="agt-body" style={{ paddingTop: 28 }}>
          <div className="agt-section-label"><span>Community vibes</span></div>
          <p style={{ fontSize: 11.5, color: "#8A8172", margin: "-6px 0 14px 0" }}>
            Trip stories, tips, and shoutouts — post as yourself or anonymously. Visible to the community; reports go to our safety team either way.
          </p>
          <div className="agt-vibe-composer">
            <textarea
              placeholder="How was your last trip? Share a tip, a shoutout, a moment..."
              value={vibeText}
              onChange={(e) => setVibeText(e.target.value)}
            />
            <VibeMediaCapture media={vibeMedia} onChange={setVibeMedia} />
            <div className="agt-vibe-composer-footer">
              <label className="agt-vibe-anon-toggle">
                <input type="checkbox" checked={vibePostAnon} onChange={(e) => setVibePostAnon(e.target.checked)} />
                Post anonymously
              </label>
              <button className="agt-verify-btn done" onClick={submitVibe}>Post</button>
            </div>
          </div>

          {vibesData.map((post) => (
            <div className="agt-vibe-card" key={post.id}>
              <div className="agt-vibe-head">
                <div className="agt-vibe-mood">{post.mood}</div>
                <div className="agt-vibe-author">{post.anonymous ? "Anonymous" : post.author}</div>
              </div>
              {post.media && (
                <div style={{ marginBottom: 10, borderRadius: 10, overflow: "hidden" }}>
                  {post.media.type === "image" ? (
                    <img src={post.media.url} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }} />
                  ) : (
                    <video src={post.media.url} controls style={{ width: "100%", maxHeight: 260, display: "block" }} />
                  )}
                </div>
              )}
              {post.text && <div className="agt-vibe-text">{post.text}</div>}
              <div className="agt-vibe-actions">
                <button className={likedVibes.includes(post.id) ? "liked" : ""} onClick={() => toggleLikeVibe(post.id)}>
                  <Star size={13} fill={likedVibes.includes(post.id) ? "var(--clay)" : "none"} /> {post.likes}
                </button>
                <button onClick={reportVibe}><ShieldCheck size={13} /> Report</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "parcel" && (
        <div className="agt-body" style={{ paddingTop: 28 }}>
          <div className="agt-section-label"><span>{tr("openParcels")}</span></div>
          <p style={{ fontSize: 11.5, color: "#8A8172", margin: "-6px 0 14px 0" }}>
            Riders already making the trip can carry a small item along their route for a flat reward — separate from booking a seat.
          </p>

          {parcels.map((p) => (
            <div className="agt-parcel-card" key={p.id}>
              <div className="agt-parcel-top">
                <div className="agt-ticket-route-row">
                  <span className="agt-ticket-place">{p.from}</span>
                  <RouteLine />
                  <span className="agt-ticket-place">{p.to}</span>
                </div>
                <div className="agt-parcel-reward">{p.reward.toLocaleString()} RWF</div>
              </div>
              <div className="agt-parcel-desc">{p.desc}</div>
              <div className="agt-parcel-meta">
                <span><Clock size={11} style={{ verticalAlign: -2 }} /> {p.date}</span>
                <span><Luggage size={11} style={{ verticalAlign: -2 }} /> {p.size}</span>
                <span>Posted by {p.posterName}</span>
              </div>
            </div>
          ))}

          {showPostParcel ? (
            <form onSubmit={submitParcel} className="agt-vibe-composer" style={{ display: "block", padding: 14 }}>
              <div className="agt-field" style={{ marginBottom: 10 }}>
                <label>Destination</label>
                <input placeholder="e.g. Musanze" value={parcelForm.to} onChange={(e) => setParcelForm({ ...parcelForm, to: e.target.value })} />
              </div>
              <div className="agt-field-row">
                <div className="agt-field">
                  <label>Date</label>
                  <input placeholder="e.g. Sat, 9 Aug" value={parcelForm.date} onChange={(e) => setParcelForm({ ...parcelForm, date: e.target.value })} />
                </div>
                <div className="agt-field">
                  <label>Size</label>
                  <select value={parcelForm.size} onChange={(e) => setParcelForm({ ...parcelForm, size: e.target.value })}>
                    <option>Small (fits on lap)</option>
                    <option>Medium (backpack size)</option>
                    <option>Large (needs boot space)</option>
                  </select>
                </div>
              </div>
              <div className="agt-field" style={{ marginBottom: 10 }}>
                <label>What is it?</label>
                <input placeholder="e.g. Sealed envelope of documents" value={parcelForm.desc} onChange={(e) => setParcelForm({ ...parcelForm, desc: e.target.value })} />
              </div>
              <div className="agt-field" style={{ marginBottom: 10 }}>
                <label>Reward (RWF)</label>
                <input placeholder="2500" value={parcelForm.reward} onChange={(e) => setParcelForm({ ...parcelForm, reward: e.target.value })} />
              </div>
              <button className="agt-primary-btn" type="submit">
                <Luggage size={16} /> Post parcel request
              </button>
            </form>
          ) : (
            <button className="agt-secondary-btn" onClick={() => setShowPostParcel(true)}>
              <Plus size={15} style={{ marginRight: 6, verticalAlign: -3 }} /> {tr("postAParcel")}
            </button>
          )}
        </div>
      )}

      {tab === "tours" && (
        <div className="agt-body" style={{ paddingTop: 28 }}>
          <div className="agt-section-label"><span>{tr("guidedTours")}</span></div>
          <p style={{ fontSize: 11.5, color: "#8A8172", margin: "-6px 0 14px 0" }}>
            Multi-day packages that bundle transport, a guide, and activities — a different trip than booking a single seat.
          </p>
          {TOURS.map((t) => (
            <div className="agt-tour-card" key={t.id} onClick={() => setSelectedTour(t)} style={{ cursor: "pointer" }}>
              <div className="agt-tour-title">{t.title}</div>
              <div className="agt-tour-meta">
                <span><Clock size={11} style={{ verticalAlign: -2 }} /> {t.days} day{t.days > 1 ? "s" : ""}</span>
                <span><Users size={11} style={{ verticalAlign: -2 }} /> {t.groupSize}</span>
                <span>Next: {t.nextDeparture}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="agt-tour-price">{t.price.toLocaleString()} RWF <span style={{ fontSize: 11, color: "#8A8172", fontWeight: 500 }}>/ person</span></div>
                {joinedTours.includes(t.id) && <span className="agt-badge seats">Reserved ✓</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "corporate" && (
        <div className="agt-body" style={{ paddingTop: 28 }}>
          <div className="agt-section-label"><span>{tr("corporatePrograms")}</span></div>
          <p style={{ fontSize: 11.5, color: "#8A8172", margin: "-6px 0 14px 0" }}>
            Your employer subsidizes part of the fare on these fixed routes — production would verify membership through a company email.
          </p>
          {CORPORATE_PROGRAMS.map((p) => (
            <div className="agt-corp-card" key={p.id}>
              <div className="agt-corp-company">{p.company}</div>
              <div className="agt-corp-route">{p.route}</div>
              <div className="agt-parcel-meta">
                <span><Clock size={11} style={{ verticalAlign: -2 }} /> {p.schedule}</span>
                <span>{p.seatsAvailable} seats/day</span>
              </div>
              <div className="agt-corp-price-row">
                <span className="agt-corp-price-market">{p.marketPrice.toLocaleString()} RWF</span>
                <span className="agt-corp-price-employee">{p.employeePrice.toLocaleString()} RWF for you</span>
              </div>
              {joinedCorporate.includes(p.id) ? (
                <button className="agt-secondary-btn" disabled style={{ opacity: 0.7, marginTop: 10 }}>
                  <Check size={15} style={{ marginRight: 6, verticalAlign: -3 }} /> Joined
                </button>
              ) : (
                <button className="agt-primary-btn" style={{ marginTop: 10 }} onClick={() => joinCorporate(p.id)}>
                  <Building2 size={16} /> Join program
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "mytrips" && (
        <div className="agt-body" style={{ paddingTop: 28 }}>
          {(() => {
            const myTrips = profile ? trips.filter((t) => t.driver.name === profile.name) : [];
            const earningsFor = (tripsList, statuses) =>
              tripsList
                .filter((t) => statuses.includes(t.status))
                .reduce((sum, t) => {
                  const taken = (t.seatsTaken || []).length;
                  const fees = calculateFees(t.price);
                  return sum + (fees ? fees.youReceive * taken : 0);
                }, 0);
            const earned = earningsFor(myTrips, ["completed"]);
            const pending = earningsFor(myTrips, ["scheduled", "enroute"]);
            const completedCount = myTrips.filter((t) => t.status === "completed").length;
            if (myTrips.length > 0) {
              return (
                <div className="agt-earnings-card">
                  <div className="agt-earnings-row">
                    <div>
                      <div className="agt-earnings-num">{earned.toLocaleString()}</div>
                      <div className="agt-earnings-label">RWF earned ({completedCount} completed trip{completedCount === 1 ? "" : "s"})</div>
                    </div>
                    <div>
                      <div className="agt-earnings-num muted">{pending.toLocaleString()}</div>
                      <div className="agt-earnings-label">RWF pending (upcoming trips)</div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
          <div className="agt-section-label"><span>{tr("myPostedTrips")}</span></div>
          {(() => {
            const myTrips = profile ? trips.filter((t) => t.driver.name === profile.name) : [];
            if (myTrips.length === 0) {
              return (
                <p style={{ fontSize: 12.5, color: "#8A8172", padding: "10px 0 16px 0" }}>
                  You haven't posted any trips yet. Offer a seat from Home to see it here.
                </p>
              );
            }
            return myTrips.map((t) => {
              const takenSeats = t.seatsTaken || [];
              return (
                <div className={`agt-mytrip-card ${t.status === "cancelled" ? "cancelled" : ""}`} key={t.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div className="agt-ticket-route-row">
                      <span className="agt-ticket-place">{t.from}</span>
                      <RouteLine />
                      <span className="agt-ticket-place">{t.to}</span>
                    </div>
                    <span className={`agt-status-pill ${t.status}`}>{t.status}</span>
                  </div>
                  <div className="agt-parcel-meta" style={{ marginBottom: 10 }}>
                    <span><Clock size={11} style={{ verticalAlign: -2 }} /> {t.date}, {t.time}</span>
                    <span><Users size={11} style={{ verticalAlign: -2 }} /> {takenSeats.length}/{t.seatsTotal} booked</span>
                    <span>{t.price.toLocaleString()} RWF/seat</span>
                  </div>

                  {takenSeats.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      {takenSeats.map((seatIdx) => (
                        <div className="agt-passenger-row" key={seatIdx}>
                          <div className="agt-avatar-sm2">{initialsFromName(MOCK_PASSENGER_POOL[seatIdx % MOCK_PASSENGER_POOL.length])}</div>
                          <span>{MOCK_PASSENGER_POOL[seatIdx % MOCK_PASSENGER_POOL.length]} · Seat {seatIdx + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.status === "enroute" && (
                    <div style={{ marginBottom: 10 }}>
                      <LiveTrackingMap tripId={t.id} role="driver" label="You" height={160} />
                    </div>
                  )}

                  {t.status !== "cancelled" && t.status !== "completed" && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {t.status === "scheduled" && (
                        <button className="agt-secondary-btn" style={{ flex: 1, minWidth: 120 }} onClick={() => updateTripStatus(t.id, "enroute")}>
                          {tr("startTrip")}
                        </button>
                      )}
                      {t.status === "enroute" && (
                        <button className="agt-secondary-btn" style={{ flex: 1, minWidth: 120 }} onClick={() => updateTripStatus(t.id, "completed")}>
                          {tr("markCompleted")}
                        </button>
                      )}
                      <button className="agt-secondary-btn" style={{ flex: 1, minWidth: 120, color: "#B33A3A", borderColor: "#E4C7C7" }} onClick={() => cancelPostedTrip(t.id)}>
                        {tr("cancelTrip")}
                      </button>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      )}

      {tab === "post" && (
        <div className="agt-body" style={{ paddingTop: 28 }}>
          <div className="agt-section-label"><span>Post a trip</span></div>
          <form onSubmit={submitTrip}>
            <div className="agt-field-row">
              <div className="agt-field">
                <label>From</label>
                <input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
              </div>
              <div className="agt-field">
                <label>To</label>
                <DestinationAutocomplete
                  placeholder="Village, cell, sector, or town — e.g. Nyamata"
                  value={form.to}
                  onChange={(val) => setForm({ ...form, to: val })}
                  onSelect={({ lat, lng }) => setFormDestPoint({ lat, lng })}
                />
              </div>
            </div>

            {formDestPoint && (
              <div style={{ marginBottom: 14 }}>
                <RouteMap
                  origin={formOriginPoint}
                  destination={formDestPoint}
                  height={160}
                  onRoute={({ distanceKm }) => setForm((f) => ({ ...f, distance: String(distanceKm) }))}
                />
              </div>
            )}

            {!formDestPoint && (() => {
              const estimated = estimateRoadDistanceKm(form.from, form.to);
              if (!estimated) return null;
              return (
                <div className="agt-match-banner" style={{ marginTop: -6, alignItems: "center" }}>
                  <MapPin size={16} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>
                    Estimated road distance: <strong>{estimated} km</strong> (calculated from known town locations — pick a suggestion above for a real routed distance).
                  </span>
                  <button type="button" className="agt-verify-btn done" onClick={() => setForm((f) => ({ ...f, distance: String(estimated) }))}>Use</button>
                </div>
              );
            })()}
            <div className="agt-field-row">
              <div className="agt-field">
                <label>Date</label>
                <input placeholder="Sat, 9 Aug" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="agt-field">
                <label>Time</label>
                <input placeholder="09:00 AM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="agt-field-row">
              <div className="agt-field">
                <label>Distance (km)</label>
                <input placeholder="e.g. 155" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} />
              </div>
              <div className="agt-field">
                <label>Vehicle size</label>
                <select value={form.vehicleSize} onChange={(e) => setForm({ ...form, vehicleSize: e.target.value })}>
                  {Object.entries(VEHICLE_CONSUMPTION).map(([key, v]) => (
                    <option key={key} value={key}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="agt-field-row">
              <div className="agt-field">
                <label>Seats available</label>
                <select value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="agt-field">
                <label>Fuel contribution (RWF)</label>
                <input placeholder="12000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            {(() => {
              const range = estimateFarePerSeat(form.distance, form.vehicleSize, form.seats);
              if (!range) return null;
              const enteredPrice = Number(form.price);
              const outsideRange = enteredPrice && (enteredPrice < range.min || enteredPrice > range.max);
              return (
                <>
                  <div className="agt-match-banner" style={{ marginTop: -6, alignItems: "center", borderColor: outsideRange ? "#B33A3A" : undefined }}>
                    <RouteIcon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>
                      Fair Price requires <strong>{range.min.toLocaleString()}–{range.max.toLocaleString()} RWF/seat</strong> for {form.distance} km at current RURA fuel prices, split {form.seats} way{form.seats > 1 ? "s" : ""} with a margin for your time.
                    </span>
                    <button type="button" className="agt-verify-btn done" onClick={() => setForm((f) => ({ ...f, price: String(range.mid) }))}>Use</button>
                  </div>
                  {outsideRange && (
                    <p style={{ fontSize: 11.5, color: "#B33A3A", margin: "-4px 0 12px 0", fontWeight: 600 }}>
                      {enteredPrice > range.max ? "This is above the Fair Price range." : "This is below the Fair Price range."} Trips can only be posted within it.
                    </p>
                  )}
                </>
              );
            })()}
            <div className="agt-field">
              <label>Vehicle</label>
              <input placeholder="e.g. Toyota Prado" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
            </div>
            <label className="agt-vibe-anon-toggle" style={{ marginBottom: 16 }}>
              <input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} />
              Make this a recurring weekly trip
            </label>
            {(() => {
              const fees = calculateFees(form.price);
              if (!fees) return null;
              return (
                <div className="agt-ticket-stub" style={{ marginTop: -2, marginBottom: 16 }}>
                  <div className="agt-section-label" style={{ marginBottom: 8 }}><span>What you'll actually receive</span></div>
                  <div className="agt-ticket-stub-row"><span>Passenger pays (per seat)</span><span>{fees.price.toLocaleString()} RWF</span></div>
                  <div className="agt-ticket-stub-row"><span>Agatigito fee ({(COMMISSION_RATE * 100).toFixed(0)}%{fees.capped ? `, capped at ${COMMISSION_CAP.toLocaleString()}` : ""})</span><span>−{fees.fee.toLocaleString()} RWF</span></div>
                  <div className="agt-ticket-stub-row"><span style={{ fontWeight: 700, color: "var(--ink)" }}>You receive (per seat)</span><span style={{ color: "var(--forest)" }}>{fees.youReceive.toLocaleString()} RWF</span></div>
                  {Number(form.seats) > 1 && (
                    <div className="agt-ticket-stub-row"><span>If all {form.seats} seats book</span><span>{(fees.youReceive * Number(form.seats)).toLocaleString()} RWF</span></div>
                  )}
                </div>
              );
            })()}
            <button className="agt-primary-btn" type="submit">
              <RouteIcon size={16} /> Publish trip
            </button>
          </form>
        </div>
      )}

      {/* Trip detail / booking sheet */}
      {selectedTrip && (
        <div className="agt-overlay" onClick={closeSheet}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={closeSheet}><X size={16} /></div>

            {bookingStep !== "success" ? (
              <>
                <div className="agt-sheet-hero">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span className="disp" style={{ fontSize: 19, fontWeight: 600 }}>{selectedTrip.from} → {selectedTrip.to}</span>
                  </div>
                  <RouteLine onDark />
                  <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 12, opacity: 0.85 }}>
                    <span><Clock size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{selectedTrip.date}, {selectedTrip.time}</span>
                    <span><Car size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{selectedTrip.vehicle}</span>
                    {selectedTrip.distance && <span><RouteIcon size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{selectedTrip.distance} km</span>}
                  </div>
                  <div style={{ marginTop: 16, marginBottom: -18 }}>
                    <ImigongoStrip height={8} colors={["var(--gold)", "rgba(246,241,230,0.3)", "var(--clay-light)"]} />
                  </div>
                </div>

                <div className="agt-sheet-body">
                  {bookingStep === "detail" && (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        <div className="agt-avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{selectedTrip.driver.initials}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{selectedTrip.driver.name}</div>
                          <div className="agt-driver-sub" style={{ fontSize: 11.5 }}>
                            <Star size={11} fill="#D9A441" color="#D9A441" /> {selectedTrip.driver.rating} · {selectedTrip.driver.trips} trips · {selectedTrip.driver.level} driver
                          </div>
                        </div>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
                          <MessageCircle size={19} color="var(--forest)" style={{ cursor: "pointer" }} onClick={() => openChat(selectedTrip.driver)} />
                          <ShieldCheck size={20} color="#1F4D3A" />
                        </div>
                      </div>

                      <div className="agt-section-label"><span>Vehicle & amenities</span></div>
                      <div className="agt-amenity-grid">
                        {selectedTrip.amenities.map((a) => {
                          const meta = AMENITY_META[a];
                          const Icon = meta.icon;
                          return (
                            <div className="agt-amenity" key={a}>
                              <Icon size={17} />
                              {meta.label}
                            </div>
                          );
                        })}
                      </div>

                      {selectedTrip.reviews.length > 0 && (
                        <>
                          <div className="agt-section-label"><span>Recent review</span></div>
                          {selectedTrip.reviews.map((r, i) => (
                            <div className="agt-reviewbox" key={i}>
                              <div className="agt-review-name">{r.name}</div>
                              "{r.text}"
                            </div>
                          ))}
                        </>
                      )}

                      <div className="agt-section-label"><span>{tr("pickupPoint")}</span></div>
                      <p style={{ fontSize: 11.5, color: "#8A8172", margin: "-4px 0 10px 0" }}>
                        {tr("pickupSafetyNote")}
                      </p>
                      {PICKUP_POINTS.map((p) => (
                        <div key={p} className={`agt-pay-option ${pickupPoint === p ? "sel" : ""}`} onClick={() => setPickupPoint(p)}>
                          <div className={`agt-pay-radio ${pickupPoint === p ? "on" : ""}`} />
                          <MapPin size={16} /> {p}
                        </div>
                      ))}
                      {pickupPoint === "Propose another spot" && (
                        <div className="agt-field" style={{ marginTop: -2 }}>
                          <input
                            placeholder="e.g. Simba Supermarket, Kicukiro"
                            value={customPickup}
                            onChange={(e) => setCustomPickup(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="agt-section-label" style={{ marginTop: 18 }}>
                        <span>Choose your seat{selectedTrip.seatsTotal > 1 ? "s" : ""}</span>
                        <span style={{ color: "#8A8172", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
                          {(selectedTrip.seatsTotal || selectedTrip.seatsAvailable) - (selectedTrip.seatsTaken || []).length} open
                        </span>
                      </div>
                      <SeatMap trip={selectedTrip} selectedSeats={selectedSeats} onToggle={toggleSeat} />

                      <button className="agt-primary-btn" onClick={goToPayment}>
                        Book {selectedSeats.length} seat{selectedSeats.length === 1 ? "" : "s"} · {(selectedTrip.price * selectedSeats.length).toLocaleString()} RWF
                      </button>
                    </>
                  )}

                  {bookingStep === "pay" && (
                    <>
                      <div className="agt-section-label"><span>Pay with</span></div>
                      <div className={`agt-pay-option ${payMethod === "momo" ? "sel" : ""}`} onClick={() => setPayMethod("momo")}>
                        <div className={`agt-pay-radio ${payMethod === "momo" ? "on" : ""}`} />
                        <Smartphone size={17} /> MTN Mobile Money
                      </div>
                      <div className={`agt-pay-option ${payMethod === "airtel" ? "sel" : ""}`} onClick={() => setPayMethod("airtel")}>
                        <div className={`agt-pay-radio ${payMethod === "airtel" ? "on" : ""}`} />
                        <Smartphone size={17} /> Airtel Money
                      </div>
                      <div className={`agt-pay-option ${payMethod === "card" ? "sel" : ""}`} onClick={() => setPayMethod("card")}>
                        <div className={`agt-pay-radio ${payMethod === "card" ? "on" : ""}`} />
                        <CreditCard size={17} /> Visa / Mastercard
                      </div>

                      <div className="agt-ticket-stub" style={{ marginTop: 18 }}>
                        <div className="agt-ticket-stub-row"><span>Pickup</span><span>{pickupPoint === "Propose another spot" ? customPickup : pickupPoint}</span></div>
                        <div className="agt-ticket-stub-row"><span>{tr("seats")}</span><span>{selectedSeats.map((s) => s + 1).join(", ")}</span></div>
                        <div className="agt-ticket-stub-row"><span>{tr("perSeat")}</span><span>{selectedTrip.price.toLocaleString()} RWF</span></div>
                        <div className="agt-ticket-stub-row"><span>{tr("totalEscrow")}</span><span>{(selectedTrip.price * selectedSeats.length).toLocaleString()} RWF</span></div>
                        {(() => {
                          const fees = calculateFees(selectedTrip.price);
                          if (!fees) return null;
                          return (
                            <div className="agt-ticket-stub-row"><span>Of which, Agatigito fee</span><span>{(fees.fee * selectedSeats.length).toLocaleString()} RWF</span></div>
                          );
                        })()}
                        {useCredits && profile?.referralCredits > 0 && (() => {
                          const total = selectedTrip.price * selectedSeats.length;
                          const applied = Math.min(profile.referralCredits, total);
                          return (
                            <div className="agt-ticket-stub-row"><span>Referral credit applied</span><span>−{applied.toLocaleString()} RWF</span></div>
                          );
                        })()}
                      </div>
                      {profile?.referralCredits > 0 && (
                        <label className="agt-vibe-anon-toggle" style={{ marginBottom: 14 }}>
                          <input type="checkbox" checked={useCredits} onChange={(e) => setUseCredits(e.target.checked)} />
                          Apply my {profile.referralCredits.toLocaleString()} RWF referral credit
                        </label>
                      )}
                      <p style={{ fontSize: 11, color: "#8A8172", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                        Funds are held by Agatigito and released to the driver once the trip is completed.
                      </p>
                      <button className="agt-primary-btn" onClick={confirmBooking}>
                        <ShieldCheck size={16} /> {tr("confirmPay")} {(() => {
                          const total = selectedTrip.price * selectedSeats.length;
                          const applied = useCredits && profile?.referralCredits ? Math.min(profile.referralCredits, total) : 0;
                          return (total - applied).toLocaleString();
                        })()} RWF
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="agt-success">
                <div className="agt-success-check"><Check size={28} /></div>
                <div className="disp" style={{ fontSize: 19, fontWeight: 600 }}>{tr("seatConfirmed")}</div>
                <p style={{ fontSize: 13, color: "#8A8172", margin: "6px 0 0 0" }}>
                  {selectedTrip.driver.name} {tr("driverWillMeet")}
                </p>

                {(() => {
                  const liveTrip = trips.find((t) => t.id === selectedTrip.id) || selectedTrip;
                  const stepIndex = TRIP_STATUS_STEPS.findIndex((s) => s.key === liveTrip.status);
                  return (
                    <div className="agt-status-stepper">
                      {TRIP_STATUS_STEPS.map((s, i) => (
                        <div className={`agt-status-step ${i < stepIndex ? "done" : i === stepIndex ? "current" : ""}`} key={s.key}>
                          <div className="agt-status-line" />
                          <div className="agt-status-dot">{i <= stepIndex ? "✓" : ""}</div>
                          <div className="agt-status-label">{tr(s.key === "scheduled" ? "statusScheduled" : s.key === "enroute" ? "statusEnroute" : "statusCompleted")}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {(() => {
                  const liveTrip = trips.find((t) => t.id === selectedTrip.id) || selectedTrip;
                  if (liveTrip.status !== "enroute") return null;
                  return (
                    <div style={{ marginBottom: 16 }}>
                      <div className="agt-section-label"><span>Track your driver</span></div>
                      <LiveTrackingMap tripId={liveTrip.id} role="rider" label={liveTrip.driver.initials} height={180} />
                    </div>
                  );
                })()}

                <div className="agt-ticket-stub">
                  <div className="agt-ticket-stub-row"><span>Route</span><span>{selectedTrip.from} → {selectedTrip.to}</span></div>
                  <div className="agt-ticket-stub-row"><span>Departs</span><span>{selectedTrip.date}, {selectedTrip.time}</span></div>
                  <div className="agt-ticket-stub-row"><span>Pickup</span><span>{pickupPoint === "Propose another spot" ? customPickup : pickupPoint}</span></div>
                  <div className="agt-ticket-stub-row"><span>{tr("seats")}</span><span>{selectedSeats.map((s) => s + 1).join(", ")}</span></div>
                  <div className="agt-ticket-stub-row"><span>Total paid</span><span>{(selectedTrip.price * selectedSeats.length).toLocaleString()} RWF</span></div>
                  <div className="agt-ticket-stub-row"><span>Driver</span><span>{selectedTrip.driver.name}</span></div>
                </div>

                <div className="agt-share-toggle">
                  <span><Radio size={14} style={{ verticalAlign: -2, marginRight: 6 }} /> {tr("shareLiveLocation")}</span>
                  <div className={`agt-switch ${shareLive ? "on" : ""}`} onClick={() => setShareLive((v) => !v)}>
                    <div className="agt-switch-knob" />
                  </div>
                </div>

                <button className="agt-sos-btn" onClick={() => setShowSOS(true)}>
                  <AlertTriangle size={16} /> {tr("emergencySafety")}
                </button>

                {(() => {
                  const liveTrip = trips.find((t) => t.id === selectedTrip.id) || selectedTrip;
                  if (liveTrip.status === "completed") {
                    if (liveTrip.passengerRating != null) {
                      return (
                        <p style={{ fontSize: 12.5, color: "#8A8172", textAlign: "center", margin: "0 0 14px 0" }}>
                          You rated this trip {liveTrip.passengerRating}★ — thanks for the feedback.
                        </p>
                      );
                    }
                    return (
                      <div className="agt-rating-box">
                        <div className="agt-section-label"><span>Rate your driver</span></div>
                        <div className="agt-star-picker">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              size={26}
                              fill={n <= ratingStars ? "var(--gold)" : "none"}
                              color="var(--gold)"
                              style={{ cursor: "pointer" }}
                              onClick={() => setRatingStars(n)}
                            />
                          ))}
                        </div>
                        <textarea
                          placeholder="Optional note about the trip"
                          value={ratingText}
                          onChange={(e) => setRatingText(e.target.value)}
                        />
                        <button
                          className="agt-primary-btn"
                          disabled={ratingStars === 0}
                          style={ratingStars === 0 ? { opacity: 0.5 } : {}}
                          onClick={() => submitDriverRating(liveTrip.id, ratingStars, ratingText)}
                        >
                          <Star size={15} /> {tr("submitRating")}
                        </button>
                      </div>
                    );
                  }
                  if (liveTrip.status === "scheduled") {
                    return (
                      <button className="agt-secondary-btn" style={{ marginBottom: 10, color: "#B33A3A", borderColor: "#E4C7C7" }} onClick={cancelMyBooking}>
                        <X size={15} style={{ marginRight: 6, verticalAlign: -3 }} /> {tr("cancelMySeat")}
                      </button>
                    );
                  }
                  return null;
                })()}

                <button className="agt-secondary-btn" style={{ marginBottom: 10 }} onClick={() => openChat(selectedTrip.driver)}>
                  <MessageCircle size={15} style={{ marginRight: 6, verticalAlign: -3 }} /> {tr("messageDriver")}
                </button>
                <button className="agt-primary-btn" onClick={closeSheet}>{tr("backToMarketplace")}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Room detail sheet */}
      {selectedRoom && (
        <div className="agt-overlay" onClick={closeSheet}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={closeSheet}><X size={16} /></div>
            <div className="agt-sheet-hero">
              <div className="disp" style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>{selectedRoom.title}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{selectedRoom.sub}</div>
              <div style={{ marginTop: 16 }}>
                <ImigongoStrip height={8} colors={["var(--gold)", "rgba(246,241,230,0.3)", "var(--clay-light)"]} />
              </div>
            </div>
            <div className="agt-sheet-body">
              <div className="agt-section-label"><span>{selectedRoom.members.length} travelling</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {selectedRoom.members.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 999, padding: "6px 10px 6px 6px" }}>
                    <div className="agt-avatar-sm2" style={{ marginLeft: 0 }}>{m}</div>
                    <span style={{ fontSize: 11.5, fontWeight: 600 }}>{m}</span>
                  </div>
                ))}
              </div>

              <div className="agt-section-label"><span>Plan discussion</span></div>
              <div className="agt-reviewbox">
                <div className="agt-review-name">Eric N.</div>
                Anyone bringing camping gear? I have a spare tent for two.
              </div>
              <div className="agt-reviewbox">
                <div className="agt-review-name">Aline U.</div>
                I'll bring the cooler and drinks, let's split fuel three ways.
              </div>

              {joinedRooms.includes(selectedRoom.id) ? (
                <button className="agt-secondary-btn" disabled style={{ opacity: 0.7 }}>
                  <Check size={15} style={{ marginRight: 6, verticalAlign: -3 }} /> You're in this plan
                </button>
              ) : (
                <button className="agt-primary-btn" onClick={() => joinRoom(selectedRoom.id)}>
                  <Users size={16} /> {tr("joinPlan")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Circles sheet */}
      {showCircles && profile && (
        <div className="agt-overlay" onClick={() => setShowCircles(false)}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={() => setShowCircles(false)}><X size={16} /></div>
            <div className="agt-sheet-body" style={{ paddingTop: 30 }}>
              <div className="disp" style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>Circles</div>
              <p style={{ fontSize: 12.5, color: "#8A8172", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Join trusted communities you're already part of. Turn on "My Circle" while searching to see rides from drivers in your circles first.
              </p>
              {CIRCLES.map((c) => {
                const joined = profile.circles?.includes(c.id);
                return (
                  <div className="agt-circle-card" key={c.id}>
                    <div className="agt-circle-icon">{c.icon}</div>
                    <div>
                      <div className="agt-circle-name">{c.name}</div>
                      <div className="agt-circle-sub">{c.type} · {c.members} members</div>
                    </div>
                    <button
                      className={`agt-circle-btn ${joined ? "joined" : "join"}`}
                      onClick={() => toggleCircle(c.id)}
                    >
                      {joined ? `${tr("joined")} ✓` : tr("joinCircle")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI travel assistant sheet */}
      {showAI && (
        <div className="agt-overlay" onClick={() => setShowAI(false)}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={() => setShowAI(false)}><X size={16} /></div>
            <div className="agt-sheet-body" style={{ paddingTop: 30 }}>
              <div className="disp" style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>Ask Agatigito</div>
              <p style={{ fontSize: 12.5, color: "#8A8172", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                Describe the trip you want in one sentence. This reads real listings on the marketplace — it doesn't invent trips.
              </p>
              <div className="agt-ai-box">
                <textarea
                  placeholder="e.g. I want to go to Musanze Saturday, prefer music, no more than 9000 RWF"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                />
                <button className="agt-primary-btn" onClick={runAiSearch}>
                  <Sparkles size={15} /> {tr("findMatches")}
                </button>
                <div className="agt-ai-examples">
                  Try: "quiet ride to Huye under 7000" · "women-only trip to Rubavu" · "conversation, going to Nyungwe"
                </div>
              </div>

              {aiSubmittedQuery && (
                <>
                  <div className="agt-section-label">
                    <span>{aiResults.length} match{aiResults.length === 1 ? "" : "es"} found</span>
                  </div>
                  {aiResults.length === 0 && (
                    <p style={{ fontSize: 12.5, color: "#8A8172", padding: "10px 0" }}>
                      Nothing fits that exactly yet — try dropping the budget or personality and searching again.
                    </p>
                  )}
                  {aiResults.map((t) => (
                    <div
                      className="agt-ticket"
                      key={t.id}
                      onClick={() => { setShowAI(false); openTrip(t); }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="agt-ticket-top">
                        <div className="agt-ticket-route-row">
                          <span className="agt-ticket-place">{t.from}</span>
                          <RouteLine />
                          <span className="agt-ticket-place">{t.to}</span>
                        </div>
                        <div className="agt-ticket-meta">
                          <span><Clock size={11} /> {t.date}, {t.time}</span>
                          <span><Car size={11} /> {t.vehicle}</span>
                        </div>
                        {t.matchWaypoint && (
                          <div className="agt-match-row">
                            <Compass size={12} />
                            <div><strong>{t.matchWaypoint.matchPct}% route match</strong> · {t.matchWaypoint.deviationKm} km detour via {t.matchWaypoint.name}</div>
                          </div>
                        )}
                      </div>
                      <div className="agt-ticket-perf" />
                      <div className="agt-ticket-bottom">
                        <div className="agt-driver">
                          <div className="agt-avatar">{t.driver.initials}</div>
                          <div>
                            <div className="agt-driver-name">{t.driver.name}</div>
                            <div className="agt-driver-sub"><Star size={10} fill="#D9A441" color="#D9A441" /> {t.driver.rating} · {t.driver.trips} trips</div>
                          </div>
                        </div>
                        <div className="agt-price">
                          <div className="agt-price-num">{t.price.toLocaleString()} RWF</div>
                          <div className="agt-price-sub">per seat</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat sheet */}
      {activeChatDriver && (
        <div className="agt-overlay" onClick={closeChat}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={closeChat}><X size={16} /></div>
            <div className="agt-sheet-body" style={{ paddingTop: 30 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className="agt-avatar">{activeChatDriver.initials || initialsFromName(activeChatDriver.name)}</div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{activeChatDriver.name}</div>
              </div>
              <div className="agt-chat-thread">
                {(chatThreads[activeChatDriver.name] || []).map((m, i) => (
                  <div className={`agt-chat-bubble-row ${m.from}`} key={i}>
                    <div className="agt-chat-bubble">{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="agt-chat-input-row">
                <input
                  placeholder="Message the driver..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
                />
                <button className="agt-chat-send-btn" onClick={sendChat}>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite & earn sheet */}
      {showInvite && profile && (
        <div className="agt-overlay" onClick={() => setShowInvite(false)}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={() => setShowInvite(false)}><X size={16} /></div>
            <div className="agt-sheet-body" style={{ paddingTop: 30 }}>
              <div className="disp" style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>Invite & earn</div>
              <p style={{ fontSize: 12.5, color: "#8A8172", margin: "0 0 14px 0", lineHeight: 1.5 }}>
                Share your code. When a friend signs up and completes their first trip, you both get ride credits.
              </p>

              <div className="agt-referral-card">
                <div style={{ fontSize: 11, color: "rgba(246,241,230,0.7)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your code</div>
                <div className="agt-referral-code">{profile.referralCode || generateReferralCode(profile.name)}</div>
                <button
                  className="agt-verify-btn done"
                  onClick={() => showToast("Code copied — share it however you like")}
                >
                  {tr("copyCode")}
                </button>
                <div className="agt-referral-stats">
                  <div>
                    <div className="agt-referral-stat-num">{profile.referredCount || 0}</div>
                    <div className="agt-referral-stat-label">Friends joined</div>
                  </div>
                  <div>
                    <div className="agt-referral-stat-num">{(profile.referralCredits || 0).toLocaleString()}</div>
                    <div className="agt-referral-stat-label">RWF in credits</div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 11, color: "#8A8172", margin: "0 0 14px 0", lineHeight: 1.5 }}>
                This prototype has no real invite delivery, so use the button below to simulate a friend joining with your code.
              </p>
              <button className="agt-secondary-btn" onClick={simulateReferral}>
                <Users size={15} style={{ marginRight: 6, verticalAlign: -3 }} /> Simulate a friend joining
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour detail sheet */}
      {selectedTour && (
        <div className="agt-overlay" onClick={() => setSelectedTour(null)}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={() => setSelectedTour(null)}><X size={16} /></div>
            <div className="agt-sheet-hero">
              <div className="disp" style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>{selectedTour.title}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{selectedTour.days} days · Next departure {selectedTour.nextDeparture}</div>
              <div style={{ marginTop: 16 }}>
                <ImigongoStrip height={8} colors={["var(--gold)", "rgba(246,241,230,0.3)", "var(--clay-light)"]} />
              </div>
            </div>
            <div className="agt-sheet-body">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="agt-avatar" style={{ width: 40, height: 40 }}>{initialsFromName(selectedTour.guide)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{selectedTour.guide}</div>
                  <div style={{ fontSize: 11, color: "#8A8172" }}>Your guide · {selectedTour.groupSize}</div>
                </div>
              </div>

              <div className="agt-section-label"><span>Highlights</span></div>
              {selectedTour.highlights.map((h, i) => (
                <div className="agt-tour-highlight-item" key={i}>
                  <Sparkles size={13} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} /> {h}
                </div>
              ))}

              <div className="agt-section-label" style={{ marginTop: 14 }}><span>What's included</span></div>
              {selectedTour.includes.map((inc, i) => (
                <div className="agt-tour-highlight-item" key={i}>
                  <Check size={13} color="var(--forest)" style={{ flexShrink: 0, marginTop: 2 }} /> {inc}
                </div>
              ))}

              <div className="agt-ticket-stub" style={{ marginTop: 18 }}>
                <div className="agt-ticket-stub-row"><span>Price per person</span><span>{selectedTour.price.toLocaleString()} RWF</span></div>
                <div className="agt-ticket-stub-row"><span>Departure</span><span>{selectedTour.nextDeparture}</span></div>
              </div>

              {joinedTours.includes(selectedTour.id) ? (
                <button className="agt-secondary-btn" disabled style={{ opacity: 0.7 }}>
                  <Check size={15} style={{ marginRight: 6, verticalAlign: -3 }} /> Spot reserved
                </button>
              ) : (
                <button className="agt-primary-btn" onClick={() => joinTour(selectedTour.id)}>
                  <ShieldCheck size={16} /> Reserve spot — {selectedTour.price.toLocaleString()} RWF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SOS / Emergency sheet */}
      {showSOS && (
        <div className="agt-overlay" onClick={() => setShowSOS(false)}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={() => setShowSOS(false)}><X size={16} /></div>
            <div className="agt-sheet-body" style={{ paddingTop: 30 }}>
              <div className="disp" style={{ fontSize: 19, fontWeight: 600, marginBottom: 4, color: "#B33A3A" }}>
                <AlertTriangle size={18} style={{ verticalAlign: -3, marginRight: 6 }} /> {tr("emergencyTitle")}
              </div>
              <p style={{ fontSize: 12.5, color: "#8A8172", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                {tr("emergencyIntro")}
              </p>

              <a href="tel:112" className="agt-sos-option" style={{ textDecoration: "none", color: "var(--ink)" }}>
                <Phone size={18} color="#B33A3A" /> {tr("call112")}
              </a>
              <div className="agt-sos-option" onClick={notifyEmergencyContact}>
                <Users size={18} color="var(--forest)" />
                <div>
                  {tr("notifyContact")}
                  <div style={{ fontSize: 11, color: "#8A8172", fontWeight: 400 }}>
                    {profile?.emergencyContact?.name ? `${profile.emergencyContact.name} · ${profile.emergencyContact.phone}` : "No contact saved yet — add one in your profile"}
                  </div>
                </div>
              </div>
              <div className="agt-sos-option" onClick={() => { showToast("Report sent to Agatigito Trust & Safety"); setShowSOS(false); }}>
                <ShieldCheck size={18} color="#96701C" /> {tr("reportProblem")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Center */}
      {showNotifications && (
        <div className="agt-overlay" onClick={() => setShowNotifications(false)}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={() => setShowNotifications(false)}><X size={16} /></div>
            <div className="agt-sheet-body" style={{ paddingTop: 30 }}>
              <div className="disp" style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>Notifications</div>
              {notifications.length === 0 && (
                <p style={{ fontSize: 12.5, color: "#8A8172", padding: "16px 0" }}>
                  Nothing yet — bookings, trip updates, and messages will show up here.
                </p>
              )}
              {notifications.map((n) => (
                <div className={`agt-notif-item ${n.read ? "" : "unread"}`} key={n.id}>
                  <div className="agt-notif-icon">{n.icon}</div>
                  <div>
                    <div className="agt-notif-title">{n.title}</div>
                    <div className="agt-notif-body">{n.body}</div>
                    <div className="agt-notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin PIN gate */}
      {showAdminLogin && (
        <div className="agt-admin-overlay">
          <div className="agt-admin-close" onClick={() => setShowAdminLogin(false)}><X size={20} /></div>
          <div className="agt-admin-login-card">
            <ShieldCheck size={28} color="var(--gold)" />
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, color: "var(--gold)", marginTop: 12 }}>
              Agatigito Admin
            </div>
            <p style={{ fontSize: 12, color: "rgba(246,241,230,0.6)", marginTop: 6 }}>
              Staff access only. Enter your PIN to continue.
            </p>
            <form onSubmit={submitAdminPin}>
              <input
                className="agt-admin-pin-input"
                type="password"
                inputMode="numeric"
                placeholder="• • • •"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                autoFocus
              />
              {adminError && (
                <p style={{ fontSize: 11.5, color: "#E39B9B", marginBottom: 12 }}>{adminError}</p>
              )}
              <button className="agt-primary-btn" type="submit">Enter dashboard</button>
            </form>
          </div>
        </div>
      )}

      {/* Admin dashboard */}
      {adminAuthed && (
        <div className="agt-admin-overlay">
          <div className="agt-admin-header">
            <div className="agt-admin-title">Agatigito Admin</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 11.5, color: "rgba(246,241,230,0.55)" }}>Staff view</span>
              <LogOut size={18} style={{ cursor: "pointer", color: "rgba(246,241,230,0.7)" }} onClick={() => { setAdminAuthed(false); showToast("Signed out of admin"); }} />
            </div>
          </div>
          <div className="agt-admin-body">
            <div className="agt-admin-stats">
              <div className="agt-admin-stat">
                <div className="agt-admin-stat-num">{liveCount}</div>
                <div className="agt-admin-stat-label">Active right now</div>
              </div>
              <div className="agt-admin-stat">
                <div className="agt-admin-stat-num">{trips.length}</div>
                <div className="agt-admin-stat-label">Trips posted</div>
              </div>
              <div className="agt-admin-stat">
                <div className="agt-admin-stat-num">{trips.filter((t) => t.status === "completed").length}</div>
                <div className="agt-admin-stat-label">Trips completed</div>
              </div>
              <div className="agt-admin-stat">
                <div className="agt-admin-stat-num">{trips.filter((t) => t.status === "cancelled").length}</div>
                <div className="agt-admin-stat-label">Trips cancelled</div>
              </div>
              <div className="agt-admin-stat">
                <div className="agt-admin-stat-num">{verificationQueue.length}</div>
                <div className="agt-admin-stat-label">Pending verifications</div>
              </div>
              <div className="agt-admin-stat">
                <div className="agt-admin-stat-num">{totalRevenue.toLocaleString()}</div>
                <div className="agt-admin-stat-label">RWF platform fees</div>
              </div>
            </div>

            <div className="agt-admin-section-label">Bookings, last 7 days</div>
            <MiniBarChart data={ADMIN_TREND_7D} valueKey="bookings" labelKey="day" />

            <div className="agt-admin-section-label">Live trips right now</div>
            {trips.filter((t) => t.status === "enroute").length === 0 && (
              <p className="agt-admin-empty">No trips currently en route.</p>
            )}
            {trips.filter((t) => t.status === "enroute").map((t) => (
              <div key={t.id} style={{ marginBottom: 14 }}>
                <div className="agt-admin-card-sub" style={{ marginBottom: 6 }}>
                  {t.from} → {t.to} · {t.driver.name}
                </div>
                <LiveTrackingMap tripId={t.id} role="admin" label={t.driver.initials} height={160} />
              </div>
            ))}

            <div className="agt-admin-section-label">Driver verification queue</div>
            {verificationQueue.length === 0 && <p className="agt-admin-empty">Nothing pending.</p>}
            {verificationQueue.map((v) => (
              <div className="agt-admin-card" key={v.id}>
                <div className="agt-admin-card-top">
                  <div>
                    <div className="agt-admin-card-name">{v.name}</div>
                    <div className="agt-admin-card-sub">{v.vehicle} · submitted {v.submitted}</div>
                  </div>
                </div>
                <div className="agt-admin-actions">
                  <button className="agt-admin-btn approve" onClick={() => approveVerification(v.id)}>
                    <Check size={12} style={{ marginRight: 3, verticalAlign: -2 }} /> Approve
                  </button>
                  <button className="agt-admin-btn reject" onClick={() => rejectVerification(v.id)}>
                    <X size={12} style={{ marginRight: 3, verticalAlign: -2 }} /> Reject
                  </button>
                </div>
              </div>
            ))}

            <div className="agt-admin-section-label">Reports awaiting review</div>
            {reportQueue.length === 0 && <p className="agt-admin-empty">Nothing pending.</p>}
            {reportQueue.map((r) => (
              <div className="agt-admin-card" key={r.id}>
                <div className="agt-admin-card-sub" style={{ marginBottom: 4 }}>{r.from} · {r.submitted}</div>
                <div className="agt-admin-card-note">{r.note}</div>
                <div className="agt-admin-actions">
                  <button className="agt-admin-btn resolve" onClick={() => resolveReport(r.id)}>
                    <ShieldCheck size={12} style={{ marginRight: 3, verticalAlign: -2 }} /> Mark resolved
                  </button>
                </div>
              </div>
            ))}

            <p style={{ fontSize: 10.5, color: "rgba(246,241,230,0.35)", marginTop: 24, lineHeight: 1.5 }}>
              Prototype note: this view has no real backend or staff accounts — actions here don't persist beyond this session. Double-tap the wordmark again from the main app to return here; production needs real staff authentication, not a shared PIN.
            </p>
          </div>
        </div>
      )}

      {/* Profile sheet */}
      {showProfile && profile && (
        <div className="agt-overlay" onClick={() => setShowProfile(false)}>
          <div className="agt-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="agt-sheet-handle" />
            <div className="agt-sheet-close" onClick={() => setShowProfile(false)}><X size={16} /></div>
            <div className="agt-sheet-body" style={{ paddingTop: 30 }}>
              {(() => {
                const { level, progress, toNext, isMax } = getLevelInfo(profile.tripsCompleted);
                return (
                  <div className="agt-level-card">
                    <div className="agt-level-top">
                      <div className="agt-level-avatar">
                        {profile.photoDataUrl ? <img src={profile.photoDataUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: "999px", objectFit: "cover" }} /> : initialsFromName(profile.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{profile.name}</div>
                        <div className="agt-level-badge"><Award size={11} /> {level} member</div>
                      </div>
                    </div>
                    <div className="agt-level-bar-track">
                      <div className="agt-level-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="agt-level-caption">
                      {isMax ? "Top tier reached — thanks for being an Agatigito regular." : `${toNext} more trip${toNext === 1 ? "" : "s"} to reach ${LEVELS[LEVELS.findIndex((l) => l.name === level) + 1]?.name}`}
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <ImigongoStrip height={7} colors={["var(--gold)", "rgba(246,241,230,0.25)", "var(--clay-light)"]} />
                    </div>
                  </div>
                );
              })()}

              <div className="agt-stat-row">
                <div className="agt-stat-box">
                  <div className="agt-stat-num">{profile.tripsCompleted}</div>
                  <div className="agt-stat-label">Trips</div>
                </div>
                <div className="agt-stat-box">
                  <div className="agt-stat-num">{profile.rating ? profile.rating.toFixed(1) : "New"}</div>
                  <div className="agt-stat-label">Rating</div>
                </div>
                <div className="agt-stat-box">
                  <div className="agt-stat-num">{profile.phone.slice(-4)}</div>
                  <div className="agt-stat-label">Phone ends</div>
                </div>
              </div>

              {profile.hasVehicle && profile.vehicleMake && (
                <div className="agt-vehicle-toggle" style={{ marginBottom: 16 }}>
                  <span><Car size={14} style={{ verticalAlign: -2, marginRight: 6 }} />{profile.vehicleMake}{profile.vehiclePlate ? ` · ${profile.vehiclePlate}` : ""}</span>
                </div>
              )}

              {(() => {
                const trust = getTrustScore(profile);
                return (
                  <div className="agt-trust-card">
                    <div className="agt-trust-top">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{tr("trustScore")}</div>
                        <div style={{ fontSize: 11, color: "#8A8172" }}>How much this account has proven so far</div>
                      </div>
                      <div className="agt-trust-score-num">{trust.score}<span style={{ fontSize: 13, color: "#8A8172" }}>/100</span></div>
                    </div>
                    {trust.breakdown.map((item, i) => (
                      <div key={i} className={`agt-trust-row ${item.ok ? "ok" : ""}`}>
                        {item.ok ? <Check size={13} color="#1F4D3A" /> : <X size={13} color="#B7AE9C" />}
                        {item.label}
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="agt-section-label"><span>{tr("travelStyle")}</span></div>
              <div className="agt-personality-grid">
                {TRAVEL_PERSONALITIES.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    className={`agt-personality-chip ${profile.travelPersonality === p.key ? "active" : ""}`}
                    onClick={() => saveProfile({ ...profile, travelPersonality: profile.travelPersonality === p.key ? null : p.key })}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="agt-section-label"><span>{tr("verification")}</span></div>

              {!profile.nationalId && otpTarget !== "id" && (
                <div className="agt-field" style={{ marginBottom: 8 }}>
                  <label>National ID number</label>
                  <input placeholder="1 1998 8 0123456 7 89" value={idNumberInput} onChange={(e) => setIdNumberInput(e.target.value)} />
                </div>
              )}
              <div className="agt-verify-row">
                <div className="agt-verify-left">
                  <ShieldCheck size={16} color="#1F4D3A" />
                  National ID{profile.nationalId ? ` · ••${profile.nationalId.slice(-4)}` : ""}
                </div>
                {profile.verified.id ? (
                  <button className="agt-verify-btn done" disabled>Verified</button>
                ) : (
                  <button className="agt-verify-btn pending" onClick={() => startVerify("id")}>Verify</button>
                )}
              </div>
              {otpTarget === "id" && (
                <div className="agt-verify-row" style={{ background: "var(--paper-2)", flexDirection: "column", alignItems: "stretch", gap: 6 }}>
                  <p style={{ fontSize: 11, color: "#8A8172", margin: 0 }}>
                    Prototype code (a real SMS would deliver this instead): <strong className="mono" style={{ color: "var(--forest)" }}>{generatedOtp}</strong>
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      className="mono"
                      placeholder="Enter 6-digit code"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      style={{ border: "none", background: "none", outline: "none", fontSize: 13, flex: 1 }}
                    />
                    <button className="agt-verify-btn done" onClick={confirmOtp} style={{ marginRight: 6 }}>Confirm</button>
                    <button className="agt-verify-btn pending" onClick={cancelOtp}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="agt-verify-row">
                <div className="agt-verify-left"><Phone size={16} color="#1F4D3A" /> Phone number · {profile.phone}</div>
                {profile.verified.phone ? (
                  <button className="agt-verify-btn done" disabled>Verified</button>
                ) : (
                  <button className="agt-verify-btn pending" onClick={() => startVerify("phone")}>Verify</button>
                )}
              </div>
              {otpTarget === "phone" && (
                <div className="agt-verify-row" style={{ background: "var(--paper-2)", flexDirection: "column", alignItems: "stretch", gap: 6 }}>
                  <p style={{ fontSize: 11, color: "#8A8172", margin: 0 }}>
                    Prototype code (a real SMS would deliver this instead): <strong className="mono" style={{ color: "var(--forest)" }}>{generatedOtp}</strong>
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      className="mono"
                      placeholder="Enter 6-digit code"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      style={{ border: "none", background: "none", outline: "none", fontSize: 13, flex: 1 }}
                    />
                    <button className="agt-verify-btn done" onClick={confirmOtp} style={{ marginRight: 6 }}>Confirm</button>
                    <button className="agt-verify-btn pending" onClick={cancelOtp}>Cancel</button>
                  </div>
                </div>
              )}

              {!profile.email && otpTarget !== "email" && (
                <div className="agt-field" style={{ marginBottom: 8 }}>
                  <label>Email address</label>
                  <input placeholder="you@email.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                </div>
              )}
              <div className="agt-verify-row">
                <div className="agt-verify-left"><Camera size={16} color="#1F4D3A" /> Email{profile.email ? ` · ${profile.email}` : " (not added)"}</div>
                {profile.verified.email ? (
                  <button className="agt-verify-btn done" disabled>Verified</button>
                ) : (
                  <button className="agt-verify-btn pending" onClick={() => startVerify("email")}>Verify</button>
                )}
              </div>
              {otpTarget === "email" && (
                <div className="agt-verify-row" style={{ background: "var(--paper-2)", flexDirection: "column", alignItems: "stretch", gap: 6 }}>
                  <p style={{ fontSize: 11, color: "#8A8172", margin: 0 }}>
                    Prototype code (a real email would deliver this instead): <strong className="mono" style={{ color: "var(--forest)" }}>{generatedOtp}</strong>
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      className="mono"
                      placeholder="Enter 6-digit code"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      style={{ border: "none", background: "none", outline: "none", fontSize: 13, flex: 1 }}
                    />
                    <button className="agt-verify-btn done" onClick={confirmOtp} style={{ marginRight: 6 }}>Confirm</button>
                    <button className="agt-verify-btn pending" onClick={cancelOtp}>Cancel</button>
                  </div>
                </div>
              )}

              <p style={{ fontSize: 11, color: "#8A8172", margin: "14px 0 18px 0", lineHeight: 1.5 }}>
                This simulates the OTP flow — any code you type is accepted. In the real build, ID verification would still call Rwanda's NIDA/face-matching service; the OTP just proves you control the phone or email tied to that ID.
              </p>

              <div className="agt-section-label"><span>{tr("emergencyContact")}</span></div>
              <p style={{ fontSize: 11.5, color: "#8A8172", margin: "-4px 0 10px 0", lineHeight: 1.5 }}>
                {tr("emergencyContactNote")}
              </p>
              <form onSubmit={saveEmergencyContact}>
                <div className="agt-field-row">
                  <div className="agt-field">
                    <label>{tr("fullName")}</label>
                    <input placeholder="e.g. Diane K." value={emergencyForm.name} onChange={(e) => setEmergencyForm({ ...emergencyForm, name: e.target.value })} />
                  </div>
                  <div className="agt-field">
                    <label>{tr("phoneNumber")}</label>
                    <input placeholder="+250..." value={emergencyForm.phone} onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })} />
                  </div>
                </div>
                <button className="agt-secondary-btn" type="submit" style={{ marginBottom: 4 }}>
                  {profile.emergencyContact?.name ? "Update contact" : tr("save")}
                </button>
              </form>

              <div className="agt-section-label" style={{ marginTop: 20 }}><span>Help & Support</span></div>
              <p style={{ fontSize: 11.5, color: "#8A8172", margin: "-4px 0 10px 0", lineHeight: 1.5 }}>
                Reach Agatigito directly — separate from your personal emergency contact above.
              </p>
              <a href="tel:+250788000000" className="agt-sos-option" style={{ textDecoration: "none", color: "var(--ink)" }}>
                <Phone size={17} color="var(--forest)" /> Call support · +250 788 000 000
              </a>
              <div className="agt-sos-option" onClick={() => showToast("Support chat isn't wired to a live agent in this prototype")}>
                <MessageCircle size={17} color="var(--forest)" /> Chat with support
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
