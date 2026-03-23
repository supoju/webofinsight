import { AmbiguousAsset } from "@/components/illusions/ambiguous-asset";
import { CafeWallIllusion } from "@/components/illusions/cafe-wall";
import { CheckerShadowIllusion } from "@/components/illusions/checker-shadow";
import { DelboeufIllusion } from "@/components/illusions/delboeuf";
import { EbbinghausIllusion } from "@/components/illusions/ebbinghaus";
import { MullerLyerIllusion } from "@/components/illusions/muller-lyer";
import { PonzoIllusion } from "@/components/illusions/ponzo";
import { VerticalHorizontalIllusion } from "@/components/illusions/vertical-horizontal";
import { ZollnerIllusion } from "@/components/illusions/zollner";
import type { Question } from "@/types/content";

export function IllusionStage({ question }: { question: Question }) {
  if (question.assetType === "asset") {
    return <AmbiguousAsset asset={question.asset} />;
  }

  switch (question.generator) {
    case "MullerLyer":
      return <MullerLyerIllusion />;
    case "Ponzo":
      return <PonzoIllusion />;
    case "Ebbinghaus":
      return <EbbinghausIllusion />;
    case "VerticalHorizontal":
      return <VerticalHorizontalIllusion />;
    case "Zollner":
      return <ZollnerIllusion />;
    case "CafeWall":
      return <CafeWallIllusion />;
    case "CheckerShadow":
      return <CheckerShadowIllusion />;
    case "Delboeuf":
      return <DelboeufIllusion />;
    default:
      return <AmbiguousAsset asset={question.asset} />;
  }
}
