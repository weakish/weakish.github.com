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
  type: 'text';
  value: string;
}

interface LinkNode extends ASTNode {
  type: 'link';
  url: string;
  title: string | null;
  children: ASTNode[];
}

export function getAllDirectories(dir: string): string[] {
  const directories: string[] = [];
  try {
    for (const entry of Deno.readDirSync(dir)) {
      if (entry.isDirectory && 
          !entry.name.startsWith('.') && 
          !entry.name.startsWith('_') && 
          entry.name !== 'node_modules') {
        const fullPath = dir === '.' ? entry.name : `${dir}/${entry.name}`;
        directories.push(fullPath);
        directories.push(...getAllDirectories(fullPath));
      }
    }
  } catch {}
  return directories;
}

export function resolveLinkPath(link: string, baseDir = "."): string {
  const patterns = [`${link}.md`, `${link}/index.md`, `${link}/README.md`];
  
  for (const pattern of patterns) {
    try {
      Deno.statSync(`${baseDir}/${pattern}`);
      return `/${link}/`;
    } catch {}
  }
  
  const allDirs = getAllDirectories(baseDir);
  for (const searchDir of allDirs) {
    for (const pattern of patterns) {
      const fullPath = `${baseDir}/${searchDir}/${pattern}`;
      try {
        Deno.statSync(fullPath);
        return `/${searchDir}/${link}/`;
      } catch {}
    }
  }
  
  return `/${link}/`;
}

export function customWikiLinks() {
  const baseDir = ".";
  let cachedDirectories: string[] | null = null;
  
  function getCachedDirectories(): string[] {
    if (cachedDirectories === null) {
      cachedDirectories = getAllDirectories(baseDir);
    }
    return cachedDirectories;
  }
  
  function resolve(link: string): string {
    const patterns = [`${link}.md`, `${link}/index.md`, `${link}/README.md`];
    
    for (const pattern of patterns) {
      try {
        Deno.statSync(`${baseDir}/${pattern}`);
        return `/${link}/`;
      } catch {}
    }
    
    const allDirs = getCachedDirectories();
    for (const searchDir of allDirs) {
      for (const pattern of patterns) {
        const fullPath = `${baseDir}/${searchDir}/${pattern}`;
        try {
          Deno.statSync(fullPath);
          return `/${searchDir}/${link}/`;
        } catch {}
      }
    }
    
    return `/${link}/`;
  }

  function isInCodeContext(node: ASTNode): boolean {
    let parent = node.parent;
    while (parent) {
      if (parent.type === 'code' || parent.type === 'inlineCode') {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  function processWikiLinks(node: ASTNode): void {
    if (node.type === 'text' && typeof node.value === 'string' && !isInCodeContext(node)) {
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
          
          if (matchIndex > lastIndex) {
            newNodes.push({
              type: 'text',
              value: node.value.slice(lastIndex, matchIndex)
            });
          }
          
          let displayText = customText || linkTarget;
          
          let resolvedPath = resolve(linkTarget);
          if (heading) {
            resolvedPath += `#${heading.toLowerCase().replace(/\s+/g, '-')}`;
          }
          
          const linkNode: LinkNode = {
            type: 'link',
            url: resolvedPath,
            title: null,
            children: [{
              type: 'text',
              value: displayText
            }]
          };
          newNodes.push(linkNode);
          
          lastIndex = matchIndex + fullMatch.length;
        }
        
        if (lastIndex < node.value.length) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex)
          });
        }
        
        node._wikiLinksReplacement = newNodes;
      }
    }
  }

  function processNode(node: ASTNode, parent: ASTNode | null = null): void {
    node.parent = parent;
    processWikiLinks(node);
    
    if (node.children) {
      for (const child of node.children) {
        processNode(child, node);
      }
      
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