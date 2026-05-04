import { unified } from "https://esm.sh/unified@11.0.5?target=es2022";
import rehypeParse from "https://esm.sh/rehype-parse@9.0.1?target=es2022";

export function htmlToGemtext(html: string): string {
  const tree = unified().use(rehypeParse, { fragment: true }).parse(html);

  // Try to find the main content element
  const mainContent = findMainContent(tree);
  const nodeToConvert = mainContent || tree;

  const lines: string[] = [];
  let inPreformat = false;

  function processNode(node: any): void {
    if (node.type === "text") {
      const text = node.value;
      if (inPreformat) {
        lines.push(text);
      } else {
        const trimmed = text.trim();
        if (trimmed) {
          lines.push(trimmed);
        }
      }
      return;
    }

    if (node.tagName === "pre") {
      lines.push("```");
      inPreformat = true;
      if (node.children) {
        node.children.forEach(processNode);
      }
      lines.push("```");
      inPreformat = false;
      return;
    }

    if (inPreformat) {
      if (node.children) {
        node.children.forEach(processNode);
      }
      return;
    }

    switch (node.tagName) {
      case "h1":
        lines.push(`# ${getInnerText(node)}`);
        break;
      case "h2":
        lines.push(`## ${getInnerText(node)}`);
        break;
      case "h3":
        lines.push(`### ${getInnerText(node)}`);
        break;
      case "h4":
      case "h5":
      case "h6":
        lines.push(`### ${getInnerText(node)}`);
        break;
      case "a":
        const href = node.properties?.href || "";
        const text = getInnerText(node);
        lines.push(`=> ${href} ${text}`);
        break;
      case "img":
        const src = node.properties?.src || "";
        const alt = node.properties?.alt || "";
        lines.push(`=> ${src} ${alt}`);
        break;
      case "blockquote":
        const quoteText = getInnerText(node);
        quoteText.split("\n").forEach((line: string) => {
          lines.push(`> ${line}`);
        });
        break;
      case "ul":
        if (node.children) {
          node.children.forEach((li: any) => {
            if (li.tagName === "li") {
              lines.push(`* ${getInnerText(li)}`);
            }
          });
        }
        break;
      case "p":
        if (lines.length > 0 && lines[lines.length - 1] !== "") {
          lines.push("");
        }
        if (node.children) {
          node.children.forEach(processNode);
        }
        lines.push("");
        break;
      case "br":
        lines.push("");
        break;
      default:
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

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
