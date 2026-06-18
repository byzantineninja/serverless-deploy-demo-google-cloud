"use client";

import { useEffect, useState } from "react";
import type { Merit } from "@repo/types";
import { Leaderboard } from "./leaderboard";

type FloatingMerit = { id: number; x: number };
type Ripple = { id: number; x: number; y: number };

function IncenseSmoke() {
  return (
    <div className="incense-smoke" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function EnsoRing() {
  const r = 124;
  const circ = 2 * Math.PI * r; // ≈ 779.1
  const dash = circ * 0.85; // ≈ 662.2 — 85%, 留缺口象徵不圓滿即圓滿

  return (
    <svg className="enso-svg" viewBox="0 0 280 280" aria-hidden="true">
      <defs>
        <linearGradient id="enso-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(184,48,32,0)" />
          <stop offset="20%" stopColor="#b83020" />
          <stop offset="75%" stopColor="#d9a832" />
          <stop offset="100%" stopColor="rgba(184,130,10,0.2)" />
        </linearGradient>
      </defs>
      <circle
        className="enso-circle"
        cx="140"
        cy="140"
        r={r}
        fill="none"
        stroke="url(#enso-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={dash}
      />
    </svg>
  );
}

export function MeritMachine({ uid }: { uid: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [name, setName] = useState<string | undefined>(undefined);
  const [taps, setTaps] = useState(0);
  const [pulsing, setPulsing] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [floats, setFloats] = useState<FloatingMerit[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // 載入個人目前功德
  useEffect(() => {
    fetch("/api/merit/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((merit: Merit | null) => {
        if (merit) {
          setCount(merit.count);
          if (merit.displayName) setName(merit.displayName);
        }
      })
      .catch(() => setCount(0));
  }, []);

  async function tap(e: React.MouseEvent<HTMLButtonElement>) {
    if (cooldown) return;
    setCooldown(true);

    // rect 必須在任何 await 前同步讀取，否則 currentTarget 會變 null
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPulsing(true);
    setTimeout(() => setPulsing(false), 260);

    // 功德機彩蛋：每次敲擊都印出心經，讓我們在功德機前也不忘誦經修行
    // 心經誦完才解除冷卻
    for (const line of [
      "觀自在菩薩，行深般若波羅蜜多時，照見五蘊皆空，度一切苦厄。",
      "舍利子！色不異空，空不異色；色即是空，空即是色，受想行識亦復如是。",
      "舍利子！是諸法空相，不生不滅，不垢不淨，不增不減。",
      "是故，空中無色，無受想行識；無眼耳鼻舌身意；無色聲香味觸法；",
      "無眼界，乃至無意識界；無無明，亦無無明盡，乃至無老死，亦無老死盡；",
      "無苦集滅道；無智亦無得。以無所得故，菩提薩埵。",
      "依般若波羅蜜多故，心無罣礙；無罣礙故，無有恐怖，遠離顛倒夢想，究竟涅槃。",
      "三世諸佛，依般若波羅蜜多故，得阿耨多羅三藐三菩提。",
      "故知：般若波羅蜜多是大神咒，是大明咒，是無上咒，是無等等咒，能除一切苦，真實不虛。",
      "故說般若波羅蜜多咒，即說咒曰：揭諦揭諦，波羅揭諦，波羅僧揭諦，菩提薩婆訶。",
    ]) {
      console.log(line);
      await new Promise((r) => setTimeout(r, 200));
    }
    setCooldown(false);
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, x }]);
    setTimeout(() => setFloats((f) => f.filter((m) => m.id !== id)), 900);
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((m) => m.id !== id)), 900);

    try {
      const res = await fetch("/api/merit/tap", { method: "POST" });
      if (res.ok) {
        const merit: Merit = await res.json();
        setCount(merit.count);
        setTaps((t) => t + 1);
        if (merit.displayName) setName(merit.displayName);
      }
    } catch {
      // 網路失敗時保留樂觀數字，下次敲擊或輪詢會校正
    }
  }

  return (
    <div className="merit-dashboard">
      <section className="machine-panel">
        <IncenseSmoke />
        <p className="machine-count-label">我的功德</p>
        <p className="machine-count">
          {count === null ? "⋯" : count.toLocaleString()}
        </p>

        <div className="enso-wrap">
          <EnsoRing />
          <button
            type="button"
            onClick={tap}
            disabled={cooldown}
            className={`merit-button${pulsing ? " is-tapped" : ""}`}
            aria-label="功德加一"
          >
            <span className="merit-button-label">功德+1</span>
            {ripples.map((r) => (
              <span
                key={r.id}
                className="merit-ripple"
                style={{ left: `${r.x}px`, top: `${r.y}px` }}
              />
            ))}
          </button>
          {floats.map((f) => (
            <span
              key={f.id}
              className="merit-float"
              style={{ left: `${f.x}px` }}
            >
              功德+1
            </span>
          ))}
        </div>

        <p className="machine-hint">
          {taps === 0
            ? "心無罣礙 · 功德自來"
            : `本次已積功德 ${taps} 次 · 無量功德`}
        </p>
      </section>

      <Leaderboard
        highlightUid={uid}
        selfName={name}
        selfCount={count ?? undefined}
      />
    </div>
  );
}
