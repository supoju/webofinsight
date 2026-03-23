import { StageFrame } from "@/components/illusions/shared";

export function VerticalHorizontalIllusion() {
  return (
    <StageFrame label="Vertical-Horizontal">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <line x1="200" y1="40" x2="200" y2="260" stroke="#0f172a" strokeWidth="14" />
        <line x1="110" y1="150" x2="290" y2="150" stroke="#0284c7" strokeWidth="14" />
      </svg>
    </StageFrame>
  );
}
