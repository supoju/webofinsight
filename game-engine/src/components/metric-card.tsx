import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="bg-card/88">
      <CardContent className="p-5">
        <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-card-foreground">
          {value}
        </p>
        {hint ? <p className="mt-2 text-sm text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
