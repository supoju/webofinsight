import { parseMarkdownBlocks } from "@/lib/content/markdown";

export function MarkdownBlock({
  markdown,
  fallback,
}: {
  markdown: string | null;
  fallback: string;
}) {
  const blocks = parseMarkdownBlocks(markdown?.trim() ? markdown : fallback);

  return (
    <div className="space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 1 ? "h1" : block.level === 2 ? "h2" : "h3";
          return (
            <Tag
              key={`${block.type}-${index}`}
              className="text-balance font-semibold tracking-tight text-slate-950 dark:text-slate-50"
            >
              {block.text}
            </Tag>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`${block.type}-${index}`} className="space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return <p key={`${block.type}-${index}`}>{block.text}</p>;
      })}
    </div>
  );
}
