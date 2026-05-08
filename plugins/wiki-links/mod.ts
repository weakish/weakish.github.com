// Custom remark plugin to handle wiki links with proper path resolution

// Types for AST nodes
interface ASTNode {
  type: string;
  value?: string;
  children?: ASTNode[];
  parent?: ASTNode | null;
  url?: string;
  title?: string | null;
  data?: {
    hName?: string;
  };
  _wikiLinksReplacement?: ASTNode[];
}

interface TextNode extends ASTNode {
  type: "text";
  value: string;
}

interface LinkNode extends ASTNode {
  type: "link";
  url: string;
  title: string | null;
  children: ASTNode[];
}

// Recursively get all directories, returning paths relative to the initial baseDir
export function getAllDirectories(dir: string): string[] {
  const directories: string[] = [];
  try {
    for (const entry of Deno.readDirSync(dir)) {
      if (
        entry.isDirectory &&
        !entry.name.startsWith(".") &&
        !entry.name.startsWith("_") &&
        entry.name !== "node_modules"
      ) {
        const fullPath = `${dir}/${entry.name}`;
        directories.push(fullPath);
        // Recursively get subdirectories
        directories.push(...getAllDirectories(fullPath));
      }
    }
  } catch {
    // If directory doesn't exist or can't be read, continue
  }
  return directories;
}

// Cache for directory listings
const directoryCache = new Map<string, string[]>();

// Resolve wiki link to URL path, searching for .md, index.md, or README.md
export function resolveLinkPath(link: string, baseDir = "."): string {
  const patterns = [`${link}.md`, `${link}/index.md`, `${link}/README.md`];

  // Check current directory first
  for (const pattern of patterns) {
    try {
      Deno.statSync(`${baseDir}/${pattern}`);
      return `/${link}/`;
    } catch {
      // File doesn't exist, continue
    }
  }

  // Get cached directories for this baseDir
  let allDirs = directoryCache.get(baseDir);
  if (allDirs === undefined) {
    allDirs = getAllDirectories(baseDir);
    directoryCache.set(baseDir, allDirs);
  }

  // Search subdirectories
  for (const searchDir of allDirs) {
    for (const pattern of patterns) {
      const fsPath = searchDir;
      try {
        Deno.statSync(`${fsPath}/${pattern}`);
        // Strip leading ./ from baseDir for URL
        const urlPath = searchDir.replace(/^\.\//, "");
        return `/${urlPath}/${link}/`;
      } catch {
        // File doesn't exist, continue
      }
    }
  }

  // Fallback: return original link
  return `/${link}/`;
}

export function customWikiLinks() {
  const baseDir = ".";

  // Resolve using exported function (handles caching internally)
  function resolve(link: string): string {
    return resolveLinkPath(link, baseDir);
  }

  // Process wiki links in a text node
  function processWikiLinks(node: ASTNode): void {
    if (node.type === "text" && typeof node.value === "string") {
      // Wiki link regex supports: [[link]], [[link|text]], [[link#heading]], [[link#heading|text]]
      const wikiLinkRegex = /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
      const matches = [...node.value.matchAll(wikiLinkRegex)];

      if (matches.length > 0) {
        const newNodes: ASTNode[] = [];
        let lastIndex = 0;

        for (const match of matches) {
          const fullMatch = match[0];
          const linkTarget = match[1];
          const heading = match[2];
          const customText = match[3];
          const matchIndex = match.index!;

          // Add text before the link
          if (matchIndex > lastIndex) {
            newNodes.push({
              type: "text",
              value: node.value.slice(lastIndex, matchIndex),
            });
          }

          // Determine display text
          let displayText = customText || linkTarget;

          // Build resolved URL
          let resolvedPath = resolve(linkTarget);
          if (heading) {
            // Add heading anchor
            resolvedPath += `#${heading.toLowerCase().replace(/\s+/g, "-")}`;
          }

          // Create link node
          const linkNode: LinkNode = {
            type: "link",
            url: resolvedPath,
            title: null,
            children: [{
              type: "text",
              value: displayText,
            }],
          };
          newNodes.push(linkNode);

          lastIndex = matchIndex + fullMatch.length;
        }

        // Add remaining text
        if (lastIndex < node.value.length) {
          newNodes.push({
            type: "text",
            value: node.value.slice(lastIndex),
          });
        }

        // Mark for replacement
        node._wikiLinksReplacement = newNodes;
      }
    }
  }

  // Recursively process AST nodes
  function processNode(node: ASTNode, parent: ASTNode | null = null): void {
    node.parent = parent;
    processWikiLinks(node);

    if (node.children) {
      for (const child of node.children) {
        processNode(child, node);
      }

      // Replace nodes marked for replacement
      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i];
        if (child._wikiLinksReplacement) {
          node.children.splice(i, 1, ...child._wikiLinksReplacement);
          delete child._wikiLinksReplacement;
        }
      }
    }
  }

  return function transformer(tree: ASTNode) {
    processNode(tree);
  };
}
