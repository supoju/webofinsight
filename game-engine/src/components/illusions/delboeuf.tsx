import { StageFrame } from "@/components/illusions/shared";

const VARIANTS = {
  "classic-equal": { leftInner: 35, rightInner: 35, leftOuter: 78, rightOuter: 52 },
  "wide-gap": { leftInner: 35, rightInner: 35, leftOuter: 88, rightOuter: 48 },
  "tight-gap": { leftInner: 35, rightInner: 35, leftOuter: 70, rightOuter: 44 },
  "left-larger": { leftInner: 40, rightInner: 32, leftOuter: 78, rightOuter: 52 },
  "right-larger": { leftInner: 32, rightInner: 40, leftOuter: 78, rightOuter: 52 },
  "both-wide": { leftInner: 35, rightInner: 35, leftOuter: 88, rightOuter: 76 },
  "both-tight": { leftInner: 35, rightInner: 35, leftOuter: 58, rightOuter: 48 },
  "split-gap": { leftInner: 37, rightInner: 35, leftOuter: 82, rightOuter: 44 },
} as const;

export function DelboeufIllusion({ variant }: { variant?: string }) {
  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS["classic-equal"];

  return (
    <StageFrame label="Delboeuf">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <circle cx="120" cy="150" r={config.leftInner} fill="#0f172a" />
        <circle cx="120" cy="150" r={config.leftOuter} fill="none" stroke="#94a3b8" strokeWidth="9" />
        <circle cx="285" cy="150" r={config.rightInner} fill="#0284c7" />
        <circle cx="285" cy="150" r={config.rightOuter} fill="none" stroke="#94a3b8" strokeWidth="9" />
      </svg>
    </StageFrame>
  );
}
