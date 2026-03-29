import { StageFrame } from "@/components/illusions/shared";

const VARIANTS = {
  "classic-equal": { leftCenter: 28, rightCenter: 28, leftOuter: 20, rightOuter: 36, leftOffset: 65, rightOffset: 80 },
  "reverse-equal": { leftCenter: 28, rightCenter: 28, leftOuter: 36, rightOuter: 20, leftOffset: 80, rightOffset: 65 },
  "tight-equal": { leftCenter: 28, rightCenter: 28, leftOuter: 18, rightOuter: 34, leftOffset: 58, rightOffset: 72 },
  "loose-equal": { leftCenter: 28, rightCenter: 28, leftOuter: 24, rightOuter: 38, leftOffset: 74, rightOffset: 88 },
  "left-larger": { leftCenter: 32, rightCenter: 26, leftOuter: 20, rightOuter: 36, leftOffset: 65, rightOffset: 80 },
  "right-larger": { leftCenter: 26, rightCenter: 32, leftOuter: 20, rightOuter: 36, leftOffset: 65, rightOffset: 80 },
  "compact-ring": { leftCenter: 28, rightCenter: 28, leftOuter: 22, rightOuter: 32, leftOffset: 54, rightOffset: 66 },
  "sparse-ring": { leftCenter: 28, rightCenter: 28, leftOuter: 18, rightOuter: 40, leftOffset: 78, rightOffset: 92 },
} as const;

function surroundingDots(centerX: number, centerY: number, offset: number) {
  return [
    [centerX - offset, centerY - offset],
    [centerX, centerY - offset],
    [centerX + offset, centerY - offset],
    [centerX - offset, centerY],
    [centerX + offset, centerY],
    [centerX - offset, centerY + offset],
    [centerX, centerY + offset],
    [centerX + offset, centerY + offset],
  ];
}

export function EbbinghausIllusion({ variant }: { variant?: string }) {
  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS["classic-equal"];
  const leftDots = surroundingDots(120, 150, config.leftOffset);
  const rightDots = surroundingDots(280, 150, config.rightOffset);

  return (
    <StageFrame label="Ebbinghaus">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <circle cx="120" cy="150" r={config.leftCenter} fill="#0f172a" />
        {leftDots.map(([cx, cy], index) => (
          <circle key={`left-${index}`} cx={cx} cy={cy} r={config.leftOuter} fill="#cbd5e1" />
        ))}
        <circle cx="280" cy="150" r={config.rightCenter} fill="#0369a1" />
        {rightDots.map(([cx, cy], index) => (
          <circle key={`right-${index}`} cx={cx} cy={cy} r={config.rightOuter} fill="#dbeafe" />
        ))}
      </svg>
    </StageFrame>
  );
}
