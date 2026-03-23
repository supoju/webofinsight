import { ResultClient } from "@/components/result-client";
import { loadContentBundle } from "@/lib/content/load";

export default async function ResultPage() {
  const bundle = await loadContentBundle();

  return <ResultClient resultsCopy={bundle.copy.results} shareCopy={bundle.copy.share} />;
}
