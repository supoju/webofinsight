import { StageFrame } from "@/components/illusions/shared";

export function DelboeufIllusion() {
  return (
    <StageFrame label="Delboeuf">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <circle cx="120" cy="150" r="35" fill="#0f172a" />
        <circle cx="120" cy="150" r="78" fill="none" stroke="#94a3b8" strokeWidth="9" />
        <circle cx="285" cy="150" r="35" fill="#0284c7" />
        <circle cx="285" cy="150" r="52" fill="none" stroke="#94a3b8" strokeWidth="9" />
      </svg>
    </StageFrame>
  );
}
