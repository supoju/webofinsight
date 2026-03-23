import { StageFrame } from "@/components/illusions/shared";

export function PonzoIllusion() {
  return (
    <StageFrame label="Ponzo">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <line x1="100" y1="280" x2="180" y2="30" stroke="#334155" strokeWidth="7" />
        <line x1="300" y1="280" x2="220" y2="30" stroke="#334155" strokeWidth="7" />
        <line x1="120" y1="220" x2="280" y2="220" stroke="#64748b" strokeWidth="4" />
        <line x1="135" y1="170" x2="265" y2="170" stroke="#64748b" strokeWidth="4" />
        <line x1="150" y1="120" x2="250" y2="120" stroke="#64748b" strokeWidth="4" />
        <line x1="165" y1="70" x2="235" y2="70" stroke="#64748b" strokeWidth="4" />
        <line x1="125" y1="210" x2="275" y2="210" stroke="#0f172a" strokeWidth="10" />
        <line x1="145" y1="100" x2="255" y2="100" stroke="#0369a1" strokeWidth="10" />
      </svg>
    </StageFrame>
  );
}
