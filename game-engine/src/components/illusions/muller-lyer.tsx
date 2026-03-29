import { StageFrame } from "@/components/illusions/shared";

const VARIANTS = {
  "classic-equal": { topLength: 260, bottomLength: 260, topOffset: -30, bottomOffset: 30, topInset: true, bottomInset: false },
  "tight-equal": { topLength: 250, bottomLength: 250, topOffset: -22, bottomOffset: 22, topInset: true, bottomInset: false },
  "wide-equal": { topLength: 270, bottomLength: 270, topOffset: -40, bottomOffset: 40, topInset: true, bottomInset: false },
  "top-longer": { topLength: 280, bottomLength: 240, topOffset: -30, bottomOffset: 30, topInset: true, bottomInset: false },
  "bottom-longer": { topLength: 240, bottomLength: 280, topOffset: -30, bottomOffset: 30, topInset: true, bottomInset: false },
  "top-outward": { topLength: 260, bottomLength: 260, topOffset: 30, bottomOffset: 30, topInset: false, bottomInset: false },
  "bottom-inward": { topLength: 260, bottomLength: 260, topOffset: -30, bottomOffset: -30, topInset: true, bottomInset: true },
  asymmetric: { topLength: 250, bottomLength: 270, topOffset: -26, bottomOffset: 34, topInset: true, bottomInset: false },
} as const;

function lineEndpoints(centerX: number, length: number) {
  const half = length / 2;
  return { x1: centerX - half, x2: centerX + half };
}

function chevron(endX: number, y: number, offset: number, inset: boolean) {
  const targetX = inset ? endX - offset : endX + offset;
  return {
    topX: targetX,
    topY: y - Math.abs(offset) * 0.8,
    bottomX: targetX,
    bottomY: y + Math.abs(offset) * 0.8,
  };
}

export function MullerLyerIllusion({ variant }: { variant?: string }) {
  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS["classic-equal"];
  const top = lineEndpoints(200, config.topLength);
  const bottom = lineEndpoints(200, config.bottomLength);
  const topLeft = chevron(top.x1, 110, config.topOffset, config.topInset);
  const topRight = chevron(top.x2, 110, config.topOffset, !config.topInset);
  const bottomLeft = chevron(bottom.x1, 210, config.bottomOffset, config.bottomInset);
  const bottomRight = chevron(bottom.x2, 210, config.bottomOffset, !config.bottomInset);

  return (
    <StageFrame label="Muller-Lyer">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <line x1={top.x1} y1="110" x2={top.x2} y2="110" stroke="#0f172a" strokeWidth="8" />
        <line x1={top.x1} y1="110" x2={topLeft.topX} y2={topLeft.topY} stroke="#0f172a" strokeWidth="8" />
        <line x1={top.x1} y1="110" x2={topLeft.bottomX} y2={topLeft.bottomY} stroke="#0f172a" strokeWidth="8" />
        <line x1={top.x2} y1="110" x2={topRight.topX} y2={topRight.topY} stroke="#0f172a" strokeWidth="8" />
        <line x1={top.x2} y1="110" x2={topRight.bottomX} y2={topRight.bottomY} stroke="#0f172a" strokeWidth="8" />
        <line x1={bottom.x1} y1="210" x2={bottom.x2} y2="210" stroke="#0369a1" strokeWidth="8" />
        <line x1={bottom.x1} y1="210" x2={bottomLeft.topX} y2={bottomLeft.topY} stroke="#0369a1" strokeWidth="8" />
        <line x1={bottom.x1} y1="210" x2={bottomLeft.bottomX} y2={bottomLeft.bottomY} stroke="#0369a1" strokeWidth="8" />
        <line x1={bottom.x2} y1="210" x2={bottomRight.topX} y2={bottomRight.topY} stroke="#0369a1" strokeWidth="8" />
        <line x1={bottom.x2} y1="210" x2={bottomRight.bottomX} y2={bottomRight.bottomY} stroke="#0369a1" strokeWidth="8" />
      </svg>
    </StageFrame>
  );
}
