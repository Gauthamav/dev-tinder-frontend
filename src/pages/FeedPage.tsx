import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

export type Direction = 1 | -1; // 1 = right, -1 = left

export interface CardData {
  t: string; // title
  e: string; // emoji
  c: [string, string]; // gradient colours
}

export interface SwipeCardsProps {
  cards?: CardData[];
  onSwipe?: (card: CardData, dir: Direction) => void;
}

interface CardHandle {
  fling: (dir: Direction, vx?: number) => void;
}

interface CardProps {
  card: CardData;
  depth: number;
  onSwipe: (dir: Direction) => void;
  onProgress: (progress: number, animate: boolean) => void;
  wrapRef: (node: HTMLDivElement | null) => void;
}

interface DragState {
  on: boolean;
  sx: number;
  sy: number;
  x: number;
  y: number;
  px: number;
  py: number;
  lx: number;
  lt: number;
  vx: number;
  busy: boolean;
  raf: number;
}

const CARDS: CardData[] = [
  { t: 'Sunrise', e: '🌅', c: ['#ff9a5a', '#e8436b'] },
  { t: 'Ocean', e: '🌊', c: ['#4cc9f0', '#3a0ca3'] },
  { t: 'Forest', e: '🌲', c: ['#52b788', '#1b4332'] },
  { t: 'Desert', e: '🏜️', c: ['#ffd166', '#c1550f'] },
  { t: 'Night sky', e: '🌌', c: ['#7b5cff', '#10002b'] },
];

const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
const STACK_EASE = 'transform .35s cubic-bezier(.2,.8,.2,1)';
const restTransform = (d: number): string => `translateY(${d * 14}px) scale(${1 - d * 0.05})`;
const reduced = (): boolean => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const Card = forwardRef<CardHandle, CardProps>(function Card({ card, depth, onSwipe, onProgress, wrapRef }, ref) {
  const el = useRef<HTMLDivElement>(null);
  const s = useRef<DragState>({
    on: false,
    sx: 0,
    sy: 0,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    lx: 0,
    lt: 0,
    vx: 0,
    busy: false,
    raf: 0,
  });

  // All drag movement is written straight to the DOM (no React re-renders),
  // batched to one write per animation frame.
  const apply = (x: number, y: number, animate: boolean, ms = 300): void => {
    const n = el.current;
    if (!n) return;
    s.current.x = x;
    s.current.y = y;
    n.style.transition = animate ? `transform ${ms}ms cubic-bezier(.2,.7,.3,1)` : 'none';
    n.style.transform = `translate3d(${x}px,${y}px,0) rotate(${clamp(x / 18, -25, 25)}deg)`;
    onProgress(clamp(Math.abs(x) / (n.offsetWidth * 0.35), 0, 1), animate);
  };

  const fling = (dir: Direction, vx = 0): void => {
    const t = s.current;
    const n = el.current;
    if (t.busy || !n) return;
    t.busy = true;
    cancelAnimationFrame(t.raf);
    const target = dir * (window.innerWidth / 2 + n.offsetWidth);
    const speed = Math.max(Math.abs(vx), 1.2); // px per ms
    const ms = reduced() ? 0 : clamp(Math.abs(target - t.x) / speed, 180, 380);
    apply(target, t.y - (t.on ? 0 : 30), true, ms);
    onProgress(1, true);
    setTimeout(() => onSwipe(dir), ms);
  };
  useImperativeHandle(ref, () => ({ fling }));

  const down = (e: PointerEvent<HTMLDivElement>): void => {
    const t = s.current;
    if (depth !== 0 || t.busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    Object.assign(t, {
      on: true,
      sx: e.clientX,
      sy: e.clientY,
      lx: e.clientX,
      lt: performance.now(),
      vx: 0,
      px: t.x,
      py: t.y,
    });
    if (el.current) el.current.style.transition = 'none';
  };

  const move = (e: PointerEvent<HTMLDivElement>): void => {
    const t = s.current;
    if (!t.on) return;
    const now = performance.now();
    const v = (e.clientX - t.lx) / Math.max(1, now - t.lt);
    t.vx = t.vx * 0.6 + v * 0.4; // smoothed velocity
    t.lx = e.clientX;
    t.lt = now;
    t.px = e.clientX - t.sx;
    t.py = (e.clientY - t.sy) * 0.4;
    if (!t.raf) {
      t.raf = requestAnimationFrame(() => {
        t.raf = 0;
        apply(t.px, t.py, false);
      });
    }
  };

  const up = (): void => {
    const t = s.current;
    const n = el.current;
    if (!t.on || !n) return;
    t.on = false;
    cancelAnimationFrame(t.raf);
    t.raf = 0;
    const far = Math.abs(t.px) > n.offsetWidth * 0.3;
    const flick = Math.abs(t.vx) > 0.5 && Math.abs(t.px) > 30;
    t.x = t.px;
    t.y = t.py;
    if (far || flick) fling(t.px > 0 ? 1 : -1, t.vx);
    else apply(0, 0, true, reduced() ? 0 : 350); // snap back
  };

  const faceStyle: CSSProperties = {
    background: `linear-gradient(160deg, ${card.c[0]}, ${card.c[1]})`,
    containerType: 'inline-size',
  };

  return (
    // Outer = stack position. Inner = drag target.
    <div
      ref={wrapRef}
      className="absolute inset-0"
      style={{ transform: restTransform(depth), transition: STACK_EASE, zIndex: 10 - depth }}>
      <div
        ref={el}
        className="absolute inset-0 flex touch-none cursor-grab select-none flex-col items-center justify-center overflow-hidden rounded-3xl shadow-2xl shadow-black/50 will-change-transform active:cursor-grabbing"
        style={faceStyle}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        draggable={false}>
        <div className="leading-none text-white" style={{ fontSize: 'clamp(64px, 40cqw, 200px)' }}>
          {card.e}
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">{card.t}</h2>
      </div>
    </div>
  );
});

interface ActionButtonProps {
  label: string;
  color: string;
  onClick: () => void;
  children: ReactNode;
}

function ActionButton({ label, color, onClick, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{ color }}
      className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:scale-105 active:scale-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-current sm:h-[72px] sm:w-[72px]">
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

export default function SwipeCards({ cards = CARDS, onSwipe }: SwipeCardsProps) {
  const [n, setN] = useState(0); // total swipes; deck loops forever
  const top = useRef<CardHandle>(null);
  const wraps = useRef<Record<number, HTMLDivElement | null>>({});

  // As the top card is dragged, the cards behind it ease forward in sync.
  const progress = useCallback((p: number, animate: boolean): void => {
    [1, 2].forEach(d => {
      const node = wraps.current[d];
      if (!node) return;
      node.style.transition = animate ? STACK_EASE : 'none';
      const ty = lerp(d * 14, (d - 1) * 14, p);
      const sc = lerp(1 - d * 0.05, 1 - (d - 1) * 0.05, p);
      node.style.transform = `translateY(${ty}px) scale(${sc})`;
    });
  }, []);

  const handleSwipe = (dir: Direction): void => {
    onSwipe?.(cards[n % cards.length], dir);
    setN(v => v + 1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'ArrowRight') top.current?.fling(1);
    if (e.key === 'ArrowLeft') top.current?.fling(-1);
  };

  return (
    <div
      className="wrapper flex h-[85dvh] w-full flex-col items-center  outline-none  "
      tabIndex={0}
      onKeyDown={onKeyDown}>
      {/* Stage = all height left after buttons/hint. Cards are 3:4 and always fit inside it. */}
      <div className="flex h-0 w-full flex-1 items-center justify-center py-2" style={{ containerType: 'size' }}>
        <div className="relative" style={{ width: 'min(35rem, calc(70dvh * 0.75))', aspectRatio: '3 / 4' }}>
          {[0, 1, 2]
            .map(d => (
              <Card
                key={n + d}
                ref={d === 0 ? top : null}
                wrapRef={node => {
                  wraps.current[d] = node;
                }}
                card={cards[(n + d) % cards.length]}
                depth={d}
                onSwipe={handleSwipe}
                onProgress={progress}
              />
            ))
            .reverse()}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-center gap-6 sm:gap-8">
        
          <ActionButton label="Pass" color="#ff4d6d" onClick={() => top.current?.fling(-1)}>
            <path d="M6 6l12 12M18 6L6 18" />
          </ActionButton>
        <ActionButton label="Interested" color="#22c55e" onClick={() => top.current?.fling(1)}>
          <path d="M12 20.5s-8-5-8-11a4.5 4.5 0 018-2.8 4.5 4.5 0 018 2.8c0 6-8 11-8 11z" />
        </ActionButton>
      </div>
    </div>
  );
}
