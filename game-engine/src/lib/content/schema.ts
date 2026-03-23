import { z } from "zod";

export const questionSchema = z
  .object({
    id: z.string().min(1),
    category: z.enum([
      "length",
      "size",
      "parallel-direction",
      "color-brightness",
      "ambiguous-image",
    ]),
    mode: z.enum(["score", "analysis"]),
    title: z.string().min(1),
    prompt: z.string().min(1),
    assetType: z.enum(["generator", "asset"]),
    generator: z.string().min(1).optional(),
    asset: z.string().min(1).optional(),
    options: z.array(z.string().min(1)).min(2),
    answer: z.union([z.number().int().nonnegative(), z.string().min(1)]),
    explanation: z.string().min(1),
    difficulty: z.enum(["easy", "medium", "hard"]),
    timeLimitSec: z.number().int().positive(),
    score: z.number().int().nonnegative(),
    uiCopy: z.object({
      intro: z.string().min(1),
      correct: z.string().min(1),
      wrong: z.string().min(1),
      timeout: z.string().min(1).optional(),
    }),
    psychologyGoal: z.string().min(1),
  })
  .superRefine((question, ctx) => {
    if (question.assetType === "generator" && !question.generator) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "generator is required when assetType is generator",
        path: ["generator"],
      });
    }

    if (question.assetType === "asset" && !question.asset) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "asset is required when assetType is asset",
        path: ["asset"],
      });
    }

    if (typeof question.answer === "number" && question.answer >= question.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "numeric answer must point to an existing option index",
        path: ["answer"],
      });
    }

    if (question.mode === "score" && question.score <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "score questions must have a positive score",
        path: ["score"],
      });
    }
  });

export const questionBankSchema = z
  .array(questionSchema)
  .length(20, "question bank must contain exactly 20 entries");
