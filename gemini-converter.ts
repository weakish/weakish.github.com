import { unified } from "https://esm.sh/unified@11.0.5?target=es2022";
import rehypeParse from "https://esm.sh/rehype-parse@9.0.1?target=es2022";

export function htmlToGemtext(html: string): string {
  const tree = unified().use(rehypeParse, { fragment: true }).parse(html);

  // Try to find the main content element
  const mainContent = findMainContent(tree);
  const nodeToConvert = mainContent || tree;

  const lines: string[] = [];
  let currentLine = "";
  let inPreformat = false;

  function flushLine(): void {
    const trimmed = currentLine.trim();
    if (trimmed) {
      lines.push(trimmed);
    }
    currentLine = "";
  }

  function processNode(node: any): void {
    if (inPreformat) {
      if (node.type === "text") {
        lines.push(node.value);
      } else if (node.tagName === "pre") {
        // End of preformat
        lines.push("```");
        inPreformat = false;
      }
      return;
    }

    if (node.type === "text") {
      currentLine += node.value;
      return;
    }

    if (node.tagName === "pre") {
      flushLine();
      lines.push("```");
      inPreformat = true;
      if (node.children) {
        node.children.forEach(processNode);
      }
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
      case "h4":
      case "h5":
      case "h6":
        flushLine();
        lines.push(`### ${getInnerText(node)}`);
        break;
      case "a":
        flushLine();
        const href = node.properties?.href || "";
        const text = getInnerText(node);
        lines.push(`=> ${href} ${text}`);
        break;
      case "img":
        flushLine();
        const src = node.properties?.src || "";
        const alt = node.properties?.alt || "";
        lines.push(`=> ${src} ${alt}`);
        break;
      case "blockquote":
        flushLine();
        const quoteText = getInnerText(node);
        quoteText.split("\n").forEach((line: string) => {
          lines.push(`> ${line}`);
        });
        break;
      case "ul":
        flushLine();
        if (node.children) {
          node.children.forEach((li: any) => {
            if (li.tagName === "li") {
              lines.push(`* ${getInnerText(li)}`);
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
              lines.push(`${index}. ${getInnerText(li)}`);
              index++;
            }
          });
        }
        break;
      case "p":
        flushLine();
        if (node.children) {
          node.children.forEach(processNode);
        }
        flushLine();
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
      if (tag === "main" || tag === "article" || 
          cls.includes("markdown-body") || cls.includes("content") ||
          cls.includes("post-content")) {
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
