import { GameClient } from "@/components/game-client";
import { loadContentBundle } from "@/lib/content/load";

export default async function PlayPage() {
  const bundle = await loadContentBundle();

  return <GameClient questions={bundle.questions} />;
}
