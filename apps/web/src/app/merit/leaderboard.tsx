"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MeritEntry } from "@repo/types";

const RANK_GLYPHS = ["①", "②", "③"];
const BOARD_LIMIT = 5;

export function Leaderboard({
  highlightUid,
  selfName,
  selfCount,
}: {
  highlightUid?: string;
  selfName?: string;
  selfCount?: number;
}) {
  // 從伺服器抓到的榜單（其他人的功德僅在手動更新時刷新）
  const [entries, setEntries] = useState<MeritEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBoard = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/merit/leaderboard?limit=${BOARD_LIMIT}`, {
        cache: "no-store",
      });
      if (res.ok) setEntries(await res.json());
    } catch {
      // 載入失敗時保留現有資料
    } finally {
      setLoaded(true);
      setRefreshing(false);
    }
  }, []);

  // 僅在首次載入時自動抓取一次
  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // 將「我自己」的即時功德合併進榜單，並重新排序
  const display = useMemo(() => {
    const list: MeritEntry[] = entries.map((e) => ({ ...e }));

    if (highlightUid != null && selfCount != null) {
      const mine = list.find((e) => e.uid === highlightUid);
      if (mine) {
        mine.count = Math.max(mine.count, selfCount);
        if (selfName) mine.displayName = selfName;
      } else if (selfCount > 0) {
        list.push({
          uid: highlightUid,
          displayName: selfName || "匿名修行者",
          count: selfCount,
        });
      }
    }

    list.sort((a, b) => b.count - a.count);
    return list.slice(0, BOARD_LIMIT);
  }, [entries, highlightUid, selfName, selfCount]);

  // ---- FLIP 重排 + 超越動畫 ----
  // 兩者都在 layout 階段以 Web Animations API 處理，只在 DOM 真正變動時各播一次，
  // 不依賴 state / timer，因此「名次不變的 +1」不會重播超越動畫。
  const listRef = useRef<HTMLOListElement>(null);
  const prevRects = useRef<Map<string, DOMRect>>(new Map());
  const prevSelfRank = useRef<number | null>(null);
  const flipAnims = useRef<Animation[]>([]);

  useLayoutEffect(() => {
    const ol = listRef.current;
    if (!ol) return;
    const items = Array.from(ol.children) as HTMLElement[];

    // 先讓尚在進行中的位移動畫直接結束，避免量到「動畫中的位置」而誤判位移
    for (const anim of flipAnims.current) anim.finish();
    flipAnims.current = [];

    // 量測每一列目前的自然位置（FLIP 的 "Last"），並先存為下一輪的基準
    const newRects = new Map<string, DOMRect>();
    for (const el of items) {
      if (el.dataset.uid)
        newRects.set(el.dataset.uid, el.getBoundingClientRect());
    }

    // 只有「這次真的換了位置」的列才播放平滑位移（超越或被超越）
    for (const el of items) {
      const id = el.dataset.uid;
      if (!id) continue;
      const prev = prevRects.current.get(id);
      const next = newRects.get(id)!;
      if (prev) {
        const dy = prev.top - next.top;
        if (Math.abs(dy) > 0.5) {
          const anim = el.animate(
            [
              { transform: `translateY(${dy}px)` },
              { transform: "translateY(0)" },
            ],
            { duration: 480, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
          );
          flipAnims.current.push(anim);
        }
      }
    }

    prevRects.current = newRects;

    // 超越動畫：只在我的名次「嚴格往上」的那一刻，於我的列上閃一次朱砂金光。
    // 僅改 background / box-shadow（不含 transform），以免干擾上面的位置量測。
    if (highlightUid != null) {
      const idx = items.findIndex((el) => el.dataset.uid === highlightUid);
      if (idx === -1) {
        prevSelfRank.current = null;
      } else {
        if (prevSelfRank.current != null && idx < prevSelfRank.current) {
          items[idx].animate(
            [
              {
                backgroundColor: "rgba(217, 168, 50, 0.55)",
                boxShadow: "0 0 28px rgba(217, 168, 50, 0.6)",
              },
              {
                backgroundColor: "rgba(184, 48, 32, 0.20)",
                boxShadow: "0 0 22px var(--vermilion-glow)",
                offset: 0.35,
              },
              {
                backgroundColor: "rgba(184, 48, 32, 0.06)",
                boxShadow: "0 0 12px var(--vermilion-glow)",
              },
            ],
            { duration: 1100, easing: "ease-out" },
          );
        }
        prevSelfRank.current = idx;
      }
    }
  }, [display, highlightUid]);

  return (
    <section className="board-panel">
      <header className="board-header">
        <div>
          <span className="board-kicker">功德排行榜</span>
          <h2>眾生功德 · 普世共見</h2>
        </div>
        <button
          type="button"
          onClick={fetchBoard}
          disabled={refreshing}
          className="control-button board-refresh-button"
        >
          {refreshing ? "更新中⋯" : "更新榜單"}
        </button>
      </header>

      {loaded && display.length === 0 && (
        <p className="empty-state">功德簿尚空 — 成為第一位積德者。</p>
      )}

      <ol className="board-list" ref={listRef}>
        {display.map((entry, i) => {
          const isMe = entry.uid === highlightUid;
          return (
            <li
              key={entry.uid}
              data-uid={entry.uid}
              className={`board-row${isMe ? " is-me" : ""}${
                i < 3 ? " is-top" : ""
              }`}
            >
              <span className="board-rank">{RANK_GLYPHS[i] ?? i + 1}</span>
              <span className="board-name">
                {entry.displayName || "匿名修行者"}
              </span>
              <span className="board-count">
                {entry.count.toLocaleString()}
                <small>功德</small>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
