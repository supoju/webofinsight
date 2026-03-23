export type MarkdownNode =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

export function parseMarkdownBlocks(markdown: string): MarkdownNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: MarkdownNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      nodes.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      nodes.push({ type: "list", items: [...listItems] });
      listItems = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      nodes.push({ type: "heading", level: 1, text: line.slice(2).trim() });
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      nodes.push({ type: "heading", level: 2, text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      nodes.push({ type: "heading", level: 3, text: line.slice(4).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return nodes;
}
