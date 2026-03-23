import { HomeClient } from "@/components/home-client";
import { loadContentBundle } from "@/lib/content/load";

export default async function HomePage() {
  const bundle = await loadContentBundle();
  const scoringCount = bundle.questions.filter((question) => question.mode === "score").length;

  return (
    <HomeClient
      homeCopy={bundle.copy.home}
      pacingCopy={bundle.copy.pacing}
      statuses={bundle.statuses}
      canStart={scoringCount >= 10}
    />
  );
}
