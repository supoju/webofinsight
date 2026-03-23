import { StageFrame } from "@/components/illusions/shared";

export function EbbinghausIllusion() {
  return (
    <StageFrame label="Ebbinghaus">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <circle cx="120" cy="150" r="28" fill="#0f172a" />
        {[55, 120, 185].map((x) => (
          <circle key={`lt-${x}`} cx={x} cy="80" r="20" fill="#cbd5e1" />
        ))}
        {[55, 185].map((x) => (
          <circle key={`lm-${x}`} cx={x} cy="150" r="20" fill="#cbd5e1" />
        ))}
        {[55, 120, 185].map((x) => (
          <circle key={`lb-${x}`} cx={x} cy="220" r="20" fill="#cbd5e1" />
        ))}
        <circle cx="280" cy="150" r="28" fill="#0369a1" />
        {[220, 280, 340].map((x) => (
          <circle key={`rt-${x}`} cx={x} cy="70" r="36" fill="#dbeafe" />
        ))}
        {[220, 340].map((x) => (
          <circle key={`rm-${x}`} cx={x} cy="150" r="36" fill="#dbeafe" />
        ))}
        {[220, 280, 340].map((x) => (
          <circle key={`rb-${x}`} cx={x} cy="230" r="36" fill="#dbeafe" />
        ))}
      </svg>
    </StageFrame>
  );
}
