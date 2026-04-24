import { useEffect, useRef, useState } from "react";
import {
  Zap,
  Brain,
  Link2,
  Shield,
  Radio,
  Sparkles,
} from "lucide-react";

const ROBOT_STYLES = `
  @keyframes orbGlow {
    0%,100% { box-shadow: 0 0 32px rgba(34,197,94,0.45), 0 0 64px rgba(34,197,94,0.18); }
    50%      { box-shadow: 0 0 56px rgba(34,197,94,0.70), 0 0 100px rgba(34,197,94,0.28); }
  }
  @keyframes floatRobot {
    0%,100% { transform: translateY(0px) rotate(-0.5deg); }
    50%      { transform: translateY(-10px) rotate(0.5deg); }
  }
  @keyframes eyeBlink {
    0%,92%,100% { transform: scaleY(1); }
    95%          { transform: scaleY(0.06); }
  }
  @keyframes pupilTrack {
    0%,100% { transform: translate(0px, 0px); }
    20%      { transform: translate(2px, -1px); }
    40%      { transform: translate(-2px, 1px); }
    60%      { transform: translate(1px, 2px); }
    80%      { transform: translate(-1px, -2px); }
  }
  @keyframes eyeGlow {
    0%,100% { box-shadow: 0 0 8px rgba(34,197,94,0.8), 0 0 16px rgba(34,197,94,0.4); }
    50%      { box-shadow: 0 0 14px rgba(34,197,94,1), 0 0 28px rgba(34,197,94,0.6); }
  }
  @keyframes smilePulse {
    0%,100% { opacity: 0.85; filter: drop-shadow(0 0 3px rgba(34,197,94,0.7)); }
    50%      { opacity: 1;    filter: drop-shadow(0 0 7px rgba(34,197,94,1)); }
  }
  @keyframes scanLine {
    0%   { top: 18%; opacity: 0.5; }
    100% { top: 82%; opacity: 0; }
  }
  @keyframes antennaFlash {
    0%,80%,100% { opacity: 0.3; transform: scale(0.8); }
    85%          { opacity: 1;   transform: scale(1.3); }
  }
  @keyframes circuitTrace {
    0%   { stroke-dashoffset: 120; opacity: 0; }
    30%  { opacity: 1; }
    100% { stroke-dashoffset: 0;   opacity: 0; }
  }
  @keyframes labelFadeIn {
    from { opacity: 0; transform: translateY(5px) scale(0.94); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes headTilt {
    0%,100%  { transform: rotate(0deg); }
    25%      { transform: rotate(-1.5deg); }
    75%      { transform: rotate(1.5deg); }
  }
  @keyframes visorSweep {
    0%,100% { opacity: 0.07; }
    50%     { opacity: 0.14; }
  }
  @keyframes earPing {
    0%,90%,100% { transform: scale(1); opacity: 0.5; }
    93%          { transform: scale(1.5); opacity: 1; }
    96%          { transform: scale(1.2); opacity: 0.7; }
  }
  @keyframes statusBlink {
    0%,49%  { opacity: 1; }
    50%,100%{ opacity: 0; }
  }
  @keyframes mouthTalk {
    0%,100%  { d: path("M 30 52 Q 50 58 70 52"); }
    33%      { d: path("M 30 50 Q 50 60 70 50"); }
    66%      { d: path("M 30 54 Q 50 56 70 54"); }
  }
  @keyframes ringRotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ringRotateCCW {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes dataPing {
    0%  { transform: scale(1); opacity: 1; }
    70% { transform: scale(2.8); opacity: 0; }
    100%{ transform: scale(2.8); opacity: 0; }
  }
  @keyframes labelSlide {
    from { opacity:0; transform: translateX(-6px); }
    to   { opacity:1; transform: translateX(0); }
  }

  .robot-float { animation: floatRobot 4.2s ease-in-out infinite; }
  .robot-head-tilt { animation: headTilt 6s ease-in-out infinite; }
  .eye-blink { animation: eyeBlink 4s ease-in-out infinite; }
  .eye-glow  { animation: eyeGlow 2s ease-in-out infinite; }
  .pupil-track { animation: pupilTrack 5s ease-in-out infinite; }
  .smile-pulse { animation: smilePulse 2.5s ease-in-out infinite; }
  .antenna-flash { animation: antennaFlash 2.8s ease-in-out infinite; }
  .ring-cw  { animation: ringRotate 8s linear infinite; }
  .ring-ccw { animation: ringRotateCCW 12s linear infinite; }
  .label-in { animation: labelFadeIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .label-slide { animation: labelSlide 0.28s ease forwards; }
  .ear-ping { animation: earPing 3.5s ease-in-out infinite; }
  .status-blink { animation: statusBlink 1s step-end infinite; }
  .scan-line { animation: scanLine 2.2s ease-in-out infinite; }
  .visor-sweep { animation: visorSweep 3s ease-in-out infinite; }
  .orb-glow { animation: orbGlow 3s ease-in-out infinite; }
  .data-ping { animation: dataPing 2.4s ease-out infinite; }
`;

const ORB_LABELS = [
  { icon: <Zap size={11} color="#ffffff" strokeWidth={2.5} />, text: "API Search" },
  { icon: <Brain size={11} color="#ffffff" strokeWidth={2.5} />, text: "AI Analysis" },
  { icon: <Link2 size={11} color="#ffffff" strokeWidth={2.5} />, text: "Endpoints" },
  { icon: <Shield size={11} color="#ffffff" strokeWidth={2.5} />, text: "Auth Flow" },
  { icon: <Radio size={11} color="#ffffff" strokeWidth={2.5} />, text: "Usage" },
  { icon: <Sparkles size={11} color="#ffffff" strokeWidth={2.5} />, text: "Responses" },
];

// ─── Robot Eye ────────────────────────────────────────────────────────────────
const RobotEye = ({ delay = "0s" }: { delay?: string }) => (
  <div style={{
    position: "relative",
    width: "22px", height: "22px",
    borderRadius: "6px",
    background: "rgba(2,44,22,0.95)",
    border: "1.5px solid rgba(34,197,94,0.5)",
    overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    {/* Eye white glow bg */}
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(circle at 50% 40%, rgba(34,197,94,0.15), transparent 70%)",
    }} />
    {/* Blink overlay */}
    <div className="eye-blink" style={{
      position: "absolute", inset: 0,
      background: "rgba(2,44,22,0.98)",
      borderRadius: "4px",
      transformOrigin: "center",
      animationDelay: delay,
      zIndex: 10,
    }} />
    {/* Iris */}
    <div className="eye-glow" style={{
      width: "12px", height: "12px", borderRadius: "50%",
      background: "radial-gradient(circle at 35% 35%, #4ade80, #22c55e 50%, #15803d)",
      position: "relative", zIndex: 5,
    }}>
      {/* Pupil */}
      <div className="pupil-track" style={{
        position: "absolute", top: "50%", left: "50%",
        width: "5px", height: "5px", borderRadius: "50%",
        background: "#052e16",
        transform: "translate(-50%, -50%)",
      }} />
      {/* Specular */}
      <div style={{
        position: "absolute", top: "15%", left: "20%",
        width: "3px", height: "3px", borderRadius: "50%",
        background: "rgba(255,255,255,0.75)",
      }} />
    </div>
  </div>
);

// ─── Circuit SVG traces on the face ──────────────────────────────────────────
const CircuitLines = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {/* top-left trace */}
    <path d="M 10 20 L 10 30 L 25 30" fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="0.8"
      strokeDasharray="40" strokeDashoffset="40"
      style={{ animation: "circuitTrace 3s ease-in-out 0.5s infinite" }} />
    {/* top-right trace */}
    <path d="M 90 20 L 90 30 L 75 30" fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="0.8"
      strokeDasharray="40" strokeDashoffset="40"
      style={{ animation: "circuitTrace 3s ease-in-out 1.2s infinite" }} />
    {/* bottom trace */}
    <path d="M 20 78 L 20 85 L 50 85 L 80 85 L 80 78" fill="none" stroke="rgba(34,197,94,0.20)" strokeWidth="0.8"
      strokeDasharray="120" strokeDashoffset="120"
      style={{ animation: "circuitTrace 4s ease-in-out 0.8s infinite" }} />
    {/* dots */}
    <circle cx="10" cy="20" r="1.2" fill="rgba(34,197,94,0.5)" />
    <circle cx="90" cy="20" r="1.2" fill="rgba(34,197,94,0.5)" />
    <circle cx="20" cy="78" r="1.2" fill="rgba(34,197,94,0.4)" />
    <circle cx="80" cy="78" r="1.2" fill="rgba(34,197,94,0.4)" />
  </svg>
);

// ─── Robot Smile (SVG mouth) ──────────────────────────────────────────────────
const RobotSmile = ({ talking }: { talking: boolean }) => (
  <div style={{
    width: "46px", height: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  }}>
    <svg width="46" height="14" viewBox="0 0 46 14" className="smile-pulse">
      {talking ? (
        <>
          {/* talking: segmented bars */}
          {[0,1,2,3,4].map((i) => (
            <rect key={i} x={i * 9 + 1} y={2} width="6" height={4 + Math.sin(i) * 3}
              rx="2" fill="#22c55e" opacity="0.85"
              style={{ animation: `visorSweep ${0.3 + i * 0.07}s ease-in-out ${i * 0.06}s infinite` }}
            />
          ))}
        </>
      ) : (
        /* smile arc */
        <path d="M 3 4 Q 23 14 43 4" fill="none" stroke="#22c55e" strokeWidth="2.2"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(34,197,94,0.8))" }}
        />
      )}
    </svg>
    {/* LED teeth dots */}
    {!talking && [0,1,2].map((i) => (
      <div key={i} style={{
        position: "absolute", bottom: "1px",
        left: `${20 + i * 8}%`,
        width: "3px", height: "2px", borderRadius: "1px",
        background: "rgba(34,197,94,0.45)",
      }} />
    ))}
  </div>
);

// ─── Scan line inside face ────────────────────────────────────────────────────
const ScanLine = () => (
  <div className="scan-line" style={{
    position: "absolute", left: "10%", right: "10%",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5) 30%, rgba(74,222,128,0.7) 50%, rgba(34,197,94,0.5) 70%, transparent)",
    zIndex: 20,
    pointerEvents: "none",
  }} />
);

// ─── Orbital rings ────────────────────────────────────────────────────────────
const OrbitalRings = () => (
  <>
    {/* Outer ring */}
    <div className="ring-cw" style={{
      position: "absolute",
      width: "148px", height: "148px",
      borderRadius: "50%",
      border: "1px solid rgba(34,197,94,0.15)",
      borderTopColor: "rgba(34,197,94,0.45)",
      borderRightColor: "rgba(34,197,94,0.08)",
    }}>
      {/* Dot on ring */}
      <div style={{
        position: "absolute", top: "-3px", left: "50%",
        width: "5px", height: "5px", borderRadius: "50%",
        background: "#4ade80",
        transform: "translateX(-50%)",
        boxShadow: "0 0 8px #4ade80",
      }} />
    </div>
    {/* Inner ring */}
    <div className="ring-ccw" style={{
      position: "absolute",
      width: "126px", height: "126px",
      borderRadius: "50%",
      border: "1px solid rgba(34,197,94,0.12)",
      borderBottomColor: "rgba(34,197,94,0.40)",
      borderLeftColor: "rgba(34,197,94,0.06)",
    }}>
      <div style={{
        position: "absolute", bottom: "-2.5px", left: "50%",
        width: "4px", height: "4px", borderRadius: "50%",
        background: "#22c55e",
        transform: "translateX(-50%)",
        boxShadow: "0 0 6px #22c55e",
      }} />
    </div>
  </>
);

// ─── Ear pods ─────────────────────────────────────────────────────────────────
const EarPod = ({ side }: { side: "left" | "right" }) => (
  <div style={{
    position: "absolute",
    top: "50%",
    [side === "left" ? "left" : "right"]: "-14px",
    transform: "translateY(-50%)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
  }}>
    <div style={{
      width: "8px", height: "26px", borderRadius: "4px",
      background: "linear-gradient(180deg, rgba(34,197,94,0.18), rgba(34,197,94,0.06))",
      border: "1px solid rgba(34,197,94,0.22)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around",
      padding: "3px 0",
    }}>
      {[0,1,2].map((i) => (
        <div key={i} className="ear-ping" style={{
          width: "3px", height: "3px", borderRadius: "50%",
          background: i === 1 ? "#22c55e" : "rgba(34,197,94,0.35)",
          animationDelay: `${i * 0.4 + (side === "right" ? 0.6 : 0)}s`,
        }} />
      ))}
    </div>
  </div>
);

// ─── Antenna ──────────────────────────────────────────────────────────────────
const Antenna = () => (
  <div style={{ position: "absolute", top: "-22px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
    {/* ball */}
    <div className="antenna-flash" style={{
      width: "7px", height: "7px", borderRadius: "50%",
      background: "#4ade80",
      boxShadow: "0 0 10px #4ade80, 0 0 20px rgba(34,197,94,0.5)",
      marginBottom: "2px",
    }} />
    {/* stick */}
    <div style={{
      width: "1.5px", height: "14px",
      background: "linear-gradient(180deg, rgba(34,197,94,0.6), rgba(34,197,94,0.1))",
    }} />
  </div>
);

// ─── Status bar (forehead) ────────────────────────────────────────────────────
const StatusBar = ({ label }: { label: string }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "5px",
    marginBottom: "7px",
  }}>
    <div className="status-blink" style={{
      width: "4px", height: "4px", borderRadius: "50%",
      background: "#4ade80",
      boxShadow: "0 0 5px #4ade80",
    }} />
    <span style={{
      fontSize: "7px", fontWeight: 700,
      letterSpacing: "0.18em", textTransform: "uppercase",
      color: "rgba(74,222,128,0.7)",
      fontFamily: "monospace",
    }}>
      {label}
    </span>
    <div className="status-blink" style={{
      width: "4px", height: "4px", borderRadius: "50%",
      background: "#4ade80",
      boxShadow: "0 0 5px #4ade80",
      animationDelay: "0.5s",
    }} />
  </div>
);

// ─── Label chip ───────────────────────────────────────────────────────────────
const LabelChip = ({ icon, text, visible }: { icon: React.ReactNode; text: string; visible: boolean }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "6px",
    padding: "6px 14px 6px 10px",
    borderRadius: "99px",
    background: "rgba(34,197,94,0.08)",
    border: "1px solid rgba(34,197,94,0.20)",
    backdropFilter: "blur(12px)",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(4px) scale(0.96)",
    transition: "opacity 0.28s cubic-bezier(0.34,1.56,0.64,1), transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
    minWidth: "108px",
    justifyContent: "center",
  }}>
    <div style={{
      width: "20px", height: "20px", borderRadius: "50%",
      background: "linear-gradient(135deg, #22c55e, #15803d)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 8px rgba(34,197,94,0.5)",
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <span style={{
      fontSize: "10px", fontWeight: 700,
      letterSpacing: "0.06em",
      color: "rgba(134,239,172,0.90)",
      fontFamily: "monospace",
      textTransform: "capitalize",
    }}>
      {text}
    </span>
  </div>
);

// ─── Main AnimatedOrb ─────────────────────────────────────────────────────────
export const AnimatedOrb = () => {
  const [idx, setIdx]       = useState(0);
  const [show, setShow]     = useState(true);
  const [talking, setTalking] = useState(false);
  const talkRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // label cycle
    const id = setInterval(() => {
      setShow(false);
      // briefly "talk" when switching
      setTalking(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % ORB_LABELS.length);
        setShow(true);
      }, 280);
      setTimeout(() => setTalking(false), 900);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const STATUS_MSGS = ["ONLINE", "READY", "ACTIVE", "APIVES"];
  const [statusIdx, setStatusIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_MSGS.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{ROBOT_STYLES}</style>

      {/* Outer floating wrapper */}
      <div className="robot-float" style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "14px",
        position: "relative",
      }}>
        {/* ── Orbital rings wrapper ── */}
        <div style={{ position: "relative", width: "150px", height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <OrbitalRings />

          {/* Ambient glow */}
          <div className="orb-glow" style={{
            position: "absolute", inset: "12px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)",
            filter: "blur(8px)",
          }} />

          {/* ── Robot head ── */}
          <div className="robot-head-tilt" style={{
            position: "relative",
            width: "92px", height: "88px",
            borderRadius: "20px",
            background: "linear-gradient(160deg, rgba(5,46,22,0.97) 0%, rgba(3,30,14,0.99) 60%, rgba(2,22,10,1) 100%)",
            border: "1.5px solid rgba(34,197,94,0.30)",
            boxShadow: "0 0 0 1px rgba(34,197,94,0.08), inset 0 1px 0 rgba(74,222,128,0.12), 0 8px 32px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            zIndex: 10,
          }}>
            {/* Circuit lines */}
            <CircuitLines />

            {/* Scan line */}
            <ScanLine />

            {/* Visor tint sweep */}
            <div className="visor-sweep" style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(34,197,94,0.05) 0%, transparent 50%, rgba(34,197,94,0.03) 100%)",
              pointerEvents: "none",
            }} />

            {/* Antenna */}
            <Antenna />

            {/* Ear pods */}
            <EarPod side="left" />
            <EarPod side="right" />

            {/* Status line (forehead) */}
            <StatusBar label={STATUS_MSGS[statusIdx]} />

            {/* Eyes row */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "9px" }}>
              <RobotEye delay="0s" />
              <RobotEye delay="0.15s" />
            </div>

            {/* Nose dot */}
            <div style={{
              width: "3px", height: "3px", borderRadius: "50%",
              background: "rgba(34,197,94,0.35)",
              marginBottom: "5px",
            }} />

            {/* Smile / mouth */}
            <RobotSmile talking={talking} />

            {/* Chin LEDs */}
            <div style={{ display: "flex", gap: "4px", marginTop: "5px" }}>
              {[0,1,2,3].map((i) => (
                <div key={i} style={{
                  width: "3px", height: "2px", borderRadius: "1px",
                  background: i % 2 === 0 ? "rgba(34,197,94,0.55)" : "rgba(34,197,94,0.20)",
                  animation: `statusBlink ${0.8 + i * 0.15}s step-end ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>

            {/* Corner accents */}
            {[["0","0"],["0","auto"],["auto","0"],["auto","auto"]].map(([t,b], i) => (
              <div key={i} style={{
                position: "absolute",
                top: t === "0" ? "6px" : "auto",
                bottom: b === "auto" ? "auto" : (t === "auto" ? "6px" : "auto"),
                left: i < 2 ? "6px" : "auto",
                right: i >= 2 ? "6px" : "auto",
                width: "8px", height: "8px",
                borderTop: (i === 0 || i === 2) ? "1.5px solid rgba(34,197,94,0.40)" : "none",
                borderBottom: (i === 1 || i === 3) ? "1.5px solid rgba(34,197,94,0.40)" : "none",
                borderLeft: (i === 0 || i === 1) ? "1.5px solid rgba(34,197,94,0.40)" : "none",
                borderRight: (i === 2 || i === 3) ? "1.5px solid rgba(34,197,94,0.40)" : "none",
              }} />
            ))}
          </div>

          {/* Particle pings */}
          {[0,1,2].map((i) => (
            <div key={i} className="data-ping" style={{
              position: "absolute",
              width: "4px", height: "4px", borderRadius: "50%",
              background: "#16a34a",
              top: `${[20,70,48][i]}%`,
              left: `${[78,18,82][i]}%`,
              animationDelay: `${i * 0.8}s`,
            }} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AnimatedOrb;