import { unified } from "https://esm.sh/unified@11.0.5?target=es2022";
import rehypeParse from "https://esm.sh/rehype-parse@9.0.1?target=es2022";

export function htmlToGemtext(html: string): string {
  const tree = unified().use(rehypeParse, { fragment: true }).parse(html);

  // Try to find the main content element
  const mainContent = findMainContent(tree);
  const nodeToConvert = mainContent || tree;

  let lines: string[] = [];
  let currentLine = "";
  let inPreformat = false;
  let inParagraph = false;
  let pendingLinks: Array<{ href: string; text: string }> = [];

  function flushLine(): void {
    const trimmed = currentLine.trim();
    if (trimmed) {
      lines.push(trimmed);
    }
    currentLine = "";
  }

  const skipTags = [
    "script",
    "style",
    "head",
    "nav",
    "footer",
    "header",
    "aside",
  ];

  function processNode(node: any): void {
    if (node.type === "text") {
      if (inPreformat) {
        lines.push(node.value);
      } else {
        currentLine += node.value;
      }
      return;
    }

    if (skipTags.includes(node.tagName)) {
      return;
    }

    if (node.tagName === "pre") {
      flushLine();
      lines.push("```");
      inPreformat = true;
      if (node.children) {
        // Collect all text content inside pre block
        let preText = "";
        function collectText(n: any): void {
          if (n.type === "text") {
            preText += n.value;
          } else if (n.children) {
            n.children.forEach(collectText);
          }
        }
        node.children.forEach(collectText);
        // Split by newlines and push each line
        preText.split("\n").forEach((line: string) => {
          lines.push(line);
        });
      }
      lines.push("```");
      inPreformat = false;
      return;
    }

    switch (node.tagName) {
      case "h1":
        flushLine();
        lines.push(`# ${getInnerText(node)}`);
        break;
      case "h2":
        flushLine();
        lines.push(`## ${getInnerText(node)}`);
        break;
      case "h3":
        flushLine();
        lines.push(`### ${getInnerText(node)}`);
        break;
      case "a":
        const href = node.properties?.href || "";
        const text = getInnerText(node);
        if (inParagraph) {
          currentLine += text;
          pendingLinks.push({ href, text });
        } else {
          flushLine();
          lines.push(`=> ${href} ${text}`);
        }
        break;
      case "img":
        flushLine();
        const src = node.properties?.src || "";
        const alt = node.properties?.alt || "";
        lines.push(`=> ${src} ${alt}`);
        break;
      case "blockquote":
        flushLine();
        // Save current state
        const savedLines = lines;
        const savedCurrentLine = currentLine;
        const savedPendingLinks = pendingLinks;
        const savedInParagraph = inParagraph;

        // Reset for blockquote processing
        lines = [];
        currentLine = "";
        pendingLinks = [];
        inParagraph = false;

        // Process children
        if (node.children) {
          node.children.forEach(processNode);
        }
        flushLine();

        // Prefix all lines with "> "
        const quotedLines = lines.map((line) => `> ${line}`);

        // Restore state
        lines = savedLines;
        currentLine = savedCurrentLine;
        pendingLinks = savedPendingLinks;
        inParagraph = savedInParagraph;

        // Push quoted lines to main lines
        quotedLines.forEach((line) => lines.push(line));
        break;
      case "ul":
        flushLine();
        if (node.children) {
          node.children.forEach((li: any) => {
            if (li.tagName === "li") {
              // Process li children manually to extract text and links
              let itemText = "";
              const itemLinks: Array<{ href: string; text: string }> = [];

              function processLiNode(node: any): void {
                if (node.type === "text") {
                  itemText += node.value;
                } else if (node.tagName === "a") {
                  const href = node.properties?.href || "";
                  const text = getInnerText(node);
                  itemText += text;
                  itemLinks.push({ href, text });
                } else if (node.children) {
                  node.children.forEach(processLiNode);
                }
              }

              if (li.children) {
                li.children.forEach(processLiNode);
              }

              // Output list item
              const trimmed = itemText.trim();
              if (trimmed) {
                lines.push(`* ${trimmed}`);
              }

              // Output links
              itemLinks.forEach((link) => {
                lines.push(`=> ${link.href} ${link.text}`);
              });
            }
          });
        }
        break;
      case "ol":
        flushLine();
        if (node.children) {
          let index = 1;
          node.children.forEach((li: any) => {
            if (li.tagName === "li") {
              // Process li children manually to extract text and links
              let itemText = "";
              const itemLinks: Array<{ href: string; text: string }> = [];

              function processLiNode(node: any): void {
                if (node.type === "text") {
                  itemText += node.value;
                } else if (node.tagName === "a") {
                  const href = node.properties?.href || "";
                  const text = getInnerText(node);
                  itemText += text;
                  itemLinks.push({ href, text });
                } else if (node.children) {
                  node.children.forEach(processLiNode);
                }
              }

              if (li.children) {
                li.children.forEach(processLiNode);
              }

              // Output numbered item
              const trimmed = itemText.trim();
              if (trimmed) {
                lines.push(`${index}. ${trimmed}`);
              }

              // Output links
              itemLinks.forEach((link) => {
                lines.push(`=> ${link.href} ${link.text}`);
              });

              index++;
            }
          });
        }
        break;
      case "p":
        inParagraph = true;
        flushLine();
        if (node.children) {
          node.children.forEach(processNode);
        }
        flushLine();
        // Output pending links after paragraph
        if (pendingLinks.length > 0) {
          lines.push("");
        }
        pendingLinks.forEach((link) => {
          lines.push(`=> ${link.href} ${link.text}`);
        });
        pendingLinks = [];
        inParagraph = false;
        lines.push("");
        break;
      case "br":
        flushLine();
        lines.push("");
        break;
      default:
        // For inline elements, just process children (text will be appended to currentLine)
        if (node.children) {
          node.children.forEach(processNode);
        }
    }
  }

  function getInnerText(node: any): string {
    if (node.type === "text") {
      return node.value;
    }
    if (!node.children) {
      return "";
    }
    return node.children.map(getInnerText).join("");
  }

  function findMainContent(node: any): any {
    if (!node) return null;

    // Check if this node is the main content container
    if (node.type === "element") {
      const cls = node.properties?.className || "";
      const tag = node.tagName;

      // Look for common main content indicators
      if (
        tag === "main" || tag === "article" ||
        cls.includes("markdown-body") || cls.includes("content") ||
        cls.includes("post-content")
      ) {
        return node;
      }
    }

    // Recursively search children
    if (node.children) {
      for (const child of node.children) {
        const found = findMainContent(child);
        if (found) return found;
      }
    }

    return null;
  }

  if (nodeToConvert.children) {
    nodeToConvert.children.forEach(processNode);
  }
  flushLine();

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
