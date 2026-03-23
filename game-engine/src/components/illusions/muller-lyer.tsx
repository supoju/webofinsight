import { StageFrame } from "@/components/illusions/shared";

export function MullerLyerIllusion() {
  return (
    <StageFrame label="Muller-Lyer">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <line x1="70" y1="110" x2="330" y2="110" stroke="#0f172a" strokeWidth="8" />
        <line x1="70" y1="110" x2="100" y2="85" stroke="#0f172a" strokeWidth="8" />
        <line x1="70" y1="110" x2="100" y2="135" stroke="#0f172a" strokeWidth="8" />
        <line x1="330" y1="110" x2="300" y2="85" stroke="#0f172a" strokeWidth="8" />
        <line x1="330" y1="110" x2="300" y2="135" stroke="#0f172a" strokeWidth="8" />
        <line x1="70" y1="210" x2="330" y2="210" stroke="#0369a1" strokeWidth="8" />
        <line x1="70" y1="210" x2="40" y2="185" stroke="#0369a1" strokeWidth="8" />
        <line x1="70" y1="210" x2="40" y2="235" stroke="#0369a1" strokeWidth="8" />
        <line x1="330" y1="210" x2="360" y2="185" stroke="#0369a1" strokeWidth="8" />
        <line x1="330" y1="210" x2="360" y2="235" stroke="#0369a1" strokeWidth="8" />
      </svg>
    </StageFrame>
  );
}
