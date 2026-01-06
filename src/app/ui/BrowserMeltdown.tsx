"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

type BrowserInstance = {
  id: string;
  x: number; // 0..1
  y: number; // 0..1
  drift: number; // jitter strength
  createdAt: number;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const LOG_PHRASES = [
  "Launching Chromium…",
  "Allocating /dev/shm…",
  "New page context created",
  "Timeout waiting for selector",
  "Renderer process crashed (maybe)",
  "Retrying navigation…",
  "Memory pressure rising…",
  "CPU spike detected…",
  "Network jitter…",
  "Chrome exited 137",
  "Collecting traces…",
  "Cleaning up zombie processes…",
];

export default function BrowserMeltdown() {
  const [instances, setInstances] = React.useState<BrowserInstance[]>([]);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [meltdown, setMeltdown] = React.useState(false);

  const count = instances.length;

  // Heat is your “story”: scale, contention, chaos
  const heat = clamp(count / 10, 0, 1);
  const chaos = clamp((count - 3) / 7, 0, 1); // starts after 3
  const danger = count >= 8;

  const pushLog = React.useCallback((msg: string) => {
    setLogs((prev) => {
      const next = [...prev, msg];
      // keep it readable
      return next.slice(-10);
    });
  }, []);

  const addBrowser = React.useCallback(() => {
    if (meltdown) return;

    const nextCount = count + 1;

    // place new instance with slight clustering as count grows
    const clusterBias = clamp((nextCount - 4) / 8, 0, 1);
    const cx = 0.5 + (Math.random() - 0.5) * (1 - clusterBias);
    const cy = 0.45 + (Math.random() - 0.5) * (1 - clusterBias);

    const inst: BrowserInstance = {
      id: uid(),
      x: clamp(cx + (Math.random() - 0.5) * 0.35, 0.06, 0.94),
      y: clamp(cy + (Math.random() - 0.5) * 0.35, 0.10, 0.90),
      drift: 2 + chaos * 10,
      createdAt: Date.now(),
    };

    setInstances((prev) => [...prev, inst]);
    pushLog(pick(LOG_PHRASES));

    // escalate more aggressively as you approach 10
    if (nextCount >= 6) pushLog("Resource contention increasing…");
    if (nextCount >= 8) pushLog("Flakiness increasing… (it passed locally)");
    if (nextCount === 10) {
      pushLog("🔥 Meltdown: too many browsers being run at once");
      setTimeout(() => setMeltdown(true), 300);
    }
  }, [count, meltdown, chaos, pushLog]);

  const [isResetting, setIsResetting] = React.useState(false);
  
  const reset = React.useCallback(() => {
    setIsResetting(true);
    // Clear everything immediately
    setInstances([]);
    setLogs([]);
    setMeltdown(false);
    // Reset the flag after animation would complete
    setTimeout(() => setIsResetting(false), 300);
  }, []);

  // subtle background “noise” grows with heat
  const bg = `radial-gradient(circle at 50% 40%, rgba(255,120,0,${0.10 * heat}) 0%, rgba(11,15,20,1) 55%)`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 24,
        overflow: "hidden",
        background: bg,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", flex: 1, minHeight: 0 }}>
        {/* Scene */}
        <div style={{ position: "relative", padding: "16px", display: "flex", flexDirection: "column" }}>
          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3, opacity: 0.95 }}>
                {count} browsers
              </div>
              <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 500 }}>
                {danger ? "⚠️ warning: flaky territory" : "System stable"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <motion.button
                onClick={addBrowser}
                disabled={meltdown}
                whileHover={meltdown ? {} : { scale: 1.02, y: -1 }}
                whileTap={meltdown ? {} : { scale: 0.98 }}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: meltdown 
                    ? "rgba(255,255,255,0.05)" 
                    : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%)",
                  color: "#e6edf3",
                  cursor: meltdown ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: -0.2,
                  boxShadow: meltdown ? "none" : "0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05) inset",
                }}
              >
                Spin up browser
              </motion.button>
              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(230,237,243,0.9)",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 13,
                  letterSpacing: -0.2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                Reset
              </motion.button>
            </div>
          </div>
          {/* Heat meter */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 13, opacity: 0.7, width: 80, fontWeight: 600, letterSpacing: -0.2 }}>CPU/RAM</div>
            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset",
                position: "relative",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${heat * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, 
                    rgba(34, 197, 94, 0.9) 0%, 
                    rgba(251, 191, 36, 0.95) 50%, 
                    rgba(239, 68, 68, 0.95) 100%)`,
                  boxShadow: `0 0 20px rgba(239, 68, 68, ${heat * 0.4}), 0 0 0 1px rgba(255,255,255,0.1) inset`,
                  borderRadius: 999,
                }}
              />
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, width: 40, textAlign: "right", fontWeight: 700, letterSpacing: -0.3 }}>
              {count}
            </div>
          </div>

          {/* "Worker" arena */}
          <motion.div
            animate={
              meltdown
                ? { rotate: [-0.4, 0.4, -0.4, 0.4, 0], transition: { duration: 0.7 } }
                : danger
                  ? { x: [-1, 1, -1, 1, 0], transition: { duration: 0.35, repeat: Infinity } }
                  : { x: 0 }
            }
            style={{
              position: "relative",
              flex: 1,
              minHeight: 0,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%)",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03) inset",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Background “log noise” */}
            <NoiseOverlay intensity={chaos} />

            {/* Browser instances */}
            <AnimatePresence>
              {!isResetting && instances.map((inst) => (
                <BrowserTile
                  key={inst.id}
                  inst={inst}
                  chaos={chaos}
                  danger={danger}
                  meltdown={meltdown}
                />
              ))}
            </AnimatePresence>

            {/* Flames at meltdown */}
            <AnimatePresence>
            {meltdown && <MeltdownOverlay />}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Logs */}
        <div
          style={{
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "rgba(0,0,0,0.15)",
            minHeight: 0,
          }}
        >
          <div style={{ fontWeight: 700, opacity: 0.95, fontSize: 16, letterSpacing: -0.3 }}>Logs</div>
          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 12.5,
              lineHeight: 1.6,
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: 16,
              flex: 1,
              overflow: "auto",
              minHeight: 0,
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.03) inset",
            }}
          >
            {logs.length === 0 ? (
              <div style={{ opacity: 0.5, fontSize: 13, fontStyle: "italic" }}>
                Click <b style={{ fontWeight: 600 }}>Spin up browser</b> to start.
              </div>
            ) : (
              logs.map((l, i) => (
                <motion.div 
                  key={`${i}-${l}`} 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    marginBottom: 8,
                    paddingBottom: 8,
                    borderBottom: i < logs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <span style={{ opacity: 0.5, fontWeight: 500 }}>
                    [{new Date().toLocaleTimeString()}]
                  </span>{" "}
                  <span style={{ opacity: 0.95 }}>{l}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserTile({
  inst,
  chaos,
  danger,
  meltdown,
}: {
  inst: BrowserInstance;
  chaos: number;
  danger: boolean;
  meltdown: boolean;
}) {
  // Convert normalized x/y into percent
  const left = `${inst.x * 100}%`;
  const top = `${inst.y * 100}%`;

  const wobble = inst.drift;
  const jitter = chaos * wobble;

  // Visual “degradation” as chaos rises: blur, opacity, skew
  const blur = chaos * 1.6 + (danger ? 0.6 : 0);
  const opacity = 0.95 - chaos * 0.25;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{
        opacity,
        scale: 1,
        y: 0,
        x: meltdown ? 0 : [0, jitter, -jitter, 0],
        rotate: meltdown ? 0 : [0, 0.4 + chaos, -0.4 - chaos, 0],
        filter: `blur(${blur}px)`,
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.6,
        y: -10,
        filter: "blur(0px)",
        transition: {
          duration: 0.2,
          ease: "easeIn",
        },
      }}
      transition={{
        duration: meltdown ? 0.25 : 1.2,
        repeat: meltdown ? 0 : Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        left,
        top,
        transform: "translate(-50%, -50%)",
        width: 160,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "linear-gradient(135deg, rgba(20,28,36,0.85) 0%, rgba(15,20,28,0.85) 100%)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          padding: "12px 14px 10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: -0.2, opacity: 0.95 }}>Chromium</div>
        <div style={{ fontSize: 10.5, opacity: 0.6, fontFamily: "ui-monospace, monospace", fontWeight: 500 }}>pid:{inst.id.slice(-4)}</div>
      </div>

      <div style={{ padding: 12, fontSize: 12, opacity: 0.9, lineHeight: 1.6 }}>
        <div style={{ opacity: 0.9, fontWeight: 500, marginBottom: 4 }}>tab: /checkout</div>
        <div style={{ opacity: 0.75, fontSize: 11.5, marginBottom: 2, fontFamily: "ui-monospace, monospace" }}>mem: {Math.round(180 + chaos * 900)}MB</div>
        <div style={{ opacity: 0.75, fontSize: 11.5, fontFamily: "ui-monospace, monospace" }}>cpu: {Math.round(8 + chaos * 65)}%</div>
      </div>

      {danger && !meltdown && (
        <div
          style={{
            padding: "0 14px 12px",
            fontSize: 11,
            opacity: 0.7,
            fontWeight: 500,
            color: "rgba(251, 191, 36, 0.9)",
          }}
        >
          ⚠️ flaky: maybe
        </div>
      )}
    </motion.div>
  );
}

function NoiseOverlay({ intensity }: { intensity: number }) {
  return (
    <motion.div
      aria-hidden
      animate={{
        opacity: 0.10 + intensity * 0.22,
      }}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px)",
        pointerEvents: "none",
        mixBlendMode: "overlay",
      }}
    />
  );
}

function MeltdownOverlay() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Dim + animated “heat” behind the popup */}
        <motion.div
          aria-hidden
          animate={{
            opacity: [0.65, 0.78, 0.65],
            filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 75%, rgba(255,190,90,0.75) 0%, rgba(255,120,50,0.55) 22%, rgba(255,60,60,0.25) 48%, rgba(0,0,0,0.65) 75%)",
          }}
        />
  
        {/* Subtle shake for “everything is on fire” */}
        <motion.div
          aria-hidden
          animate={{ x: [0, -2, 2, -1, 1, 0], y: [0, 1, -1, 1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        />
  
        {/* Center modal */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: 24,
          }}
        >
          <motion.div
            initial={{ y: 10, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              width: "min(560px, 92vw)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "linear-gradient(135deg, rgba(12,16,20,0.95) 0%, rgba(8,12,16,0.95) 100%)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
            }}
          >
            {/* Top bar */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <motion.span
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.95, 1, 0.95]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: "rgba(239, 68, 68, 0.95)",
                    boxShadow: "0 0 24px rgba(239, 68, 68, 0.6)",
                    display: "inline-block",
                  }}
                />
                <div style={{ fontWeight: 800, letterSpacing: -0.4, fontSize: 16 }}>
                  Meltdown: you&apos;re cooked.
                </div>
              </div>
  
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.7,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
              >
              </div>
            </div>
  
            {/* Body */}
            <div style={{ padding: "24px", lineHeight: 1.7 }}>
              <div style={{ fontSize: 15, opacity: 0.95, fontWeight: 600, marginBottom: 12, letterSpacing: -0.2 }}>
                You can&apos;t host and manage that many browser
                instances.
              </div>
  
              <div style={{ fontSize: 13.5, opacity: 0.75, lineHeight: 1.7 }}>
                Trust, the failure mode isn&apos;t your automation logic. The problem is CPU/RAM contention,
                lifecycle churn, and a runtime that wasn&apos;t meant to be operated as
                a fleet.
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  