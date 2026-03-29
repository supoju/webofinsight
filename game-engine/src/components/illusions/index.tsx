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
      return <MullerLyerIllusion variant={question.renderVariant} />;
    case "Ponzo":
      return <PonzoIllusion variant={question.renderVariant} />;
    case "Ebbinghaus":
      return <EbbinghausIllusion variant={question.renderVariant} />;
    case "VerticalHorizontal":
      return <VerticalHorizontalIllusion variant={question.renderVariant} />;
    case "Zollner":
      return <ZollnerIllusion variant={question.renderVariant} />;
    case "CafeWall":
      return <CafeWallIllusion variant={question.renderVariant} />;
    case "CheckerShadow":
      return <CheckerShadowIllusion variant={question.renderVariant} />;
    case "Delboeuf":
      return <DelboeufIllusion variant={question.renderVariant} />;
    default:
      return <AmbiguousAsset asset={question.asset} />;
  }
}
