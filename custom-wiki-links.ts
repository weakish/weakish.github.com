// Custom remark plugin to handle wiki links with proper path resolution

export function customWikiLinks() {
  const baseDir = ".";
  
  function getAllDirectories(dir: string): string[] {
    const directories: string[] = [];
    try {
      for (const entry of Deno.readDirSync(dir)) {
        if (entry.isDirectory && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '_site') {
          const fullPath = dir === '.' ? entry.name : `${dir}/${entry.name}`;
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
  
  function resolveLinkPath(link: string): string {
    // First, check if the link exists in the current directory
    const patterns = [`${link}.md`, `${link}/index.md`, `${link}/README.md`];
    
    // Check in current directory first
    for (const pattern of patterns) {
      try {
        Deno.statSync(`${baseDir}/${pattern}`);
        return `/${link}/`;
      } catch {
        // File doesn't exist, continue
      }
    }
    
    // Search recursively in all directories
    const allDirs = getAllDirectories(baseDir);
    for (const searchDir of allDirs) {
      for (const pattern of patterns) {
        const fullPath = `${baseDir}/${searchDir}/${pattern}`;
        try {
          Deno.statSync(fullPath);
          return `/${searchDir}/${link}/`;
        } catch {
          // File doesn't exist, continue to next pattern/directory
        }
      }
    }
    
    // If not found, return the original link (fallback)
    return `/${link}/`;
  }

  function isInCodeContext(node: any): boolean {
    // Check if we're inside a code block or inline code
    let parent = node.parent;
    while (parent) {
      if (parent.type === 'code' || parent.type === 'inlineCode') {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  function processWikiLinks(node: any): void {
    if (node.type === 'text' && typeof node.value === 'string' && !isInCodeContext(node)) {
      // Advanced wiki link regex that supports:
      // [[link]], [[link|text]], [[link#heading]], [[link#heading|text]]
      const wikiLinkRegex = /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
      const matches = [...node.value.matchAll(wikiLinkRegex)];
      
      if (matches.length > 0) {
        // We need to replace this text node with multiple nodes
        const newNodes: any[] = [];
        let lastIndex = 0;
        
        for (const match of matches) {
          const fullMatch = match[0];
          const linkTarget = match[1];  // The actual link target
          const heading = match[2];     // Optional heading
          const customText = match[3];  // Optional custom text
          const matchIndex = match.index!;
          
          // Add text before the link
          if (matchIndex > lastIndex) {
            newNodes.push({
              type: 'text',
              value: node.value.slice(lastIndex, matchIndex)
            });
          }
          
          // Determine the display text
          let displayText = customText || linkTarget;
          
          // Build the URL
          let resolvedPath = resolveLinkPath(linkTarget);
          if (heading) {
            // Add heading anchor
            resolvedPath += `#${heading.toLowerCase().replace(/\s+/g, '-')}`;
          }
          
          // Add the link
          newNodes.push({
            type: 'link',
            url: resolvedPath,
            title: null,
            children: [{
              type: 'text',
              value: displayText
            }]
          });
          
          lastIndex = matchIndex + fullMatch.length;
        }
        
        // Add remaining text
        if (lastIndex < node.value.length) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex)
          });
        }
        
        // Mark this node for replacement
        node._wikiLinksReplacement = newNodes;
      }
    }
  }

  function processHighlights(node: any): void {
    if (node.type === 'text' && typeof node.value === 'string' && !isInCodeContext(node)) {
      const highlightRegex = /==([^=]+)==/g;
      const matches = [...node.value.matchAll(highlightRegex)];
      
      if (matches.length > 0) {
        const newNodes: any[] = [];
        let lastIndex = 0;
        
        for (const match of matches) {
          const fullMatch = match[0];
          const highlightText = match[1];
          const matchIndex = match.index!;
          
          // Add text before the highlight
          if (matchIndex > lastIndex) {
            newNodes.push({
              type: 'text',
              value: node.value.slice(lastIndex, matchIndex)
            });
          }
          
          // Add the highlight (using mark element)
          newNodes.push({
            type: 'emphasis', // Using emphasis for now as remark doesn't have native mark support
            data: {
              hName: 'mark'
            },
            children: [{
              type: 'text',
              value: highlightText
            }]
          });
          
          lastIndex = matchIndex + fullMatch.length;
        }
        
        // Add remaining text
        if (lastIndex < node.value.length) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex)
          });
        }
        
        // Mark this node for replacement
        node._highlightReplacement = newNodes;
      }
    }
  }

  function processNode(node: any, parent: any = null): void {
    // Set parent reference for context checking
    node.parent = parent;
    
    // Process wiki links first
    processWikiLinks(node);
    
    // Process highlights second (only if no wiki link replacement)
    if (!node._wikiLinksReplacement) {
      processHighlights(node);
    }
    
    // Process children
    if (node.children) {
      for (const child of node.children) {
        processNode(child, node);
      }
      
      // Replace nodes that were marked for replacement
      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i];
        if (child._wikiLinksReplacement) {
          node.children.splice(i, 1, ...child._wikiLinksReplacement);
          delete child._wikiLinksReplacement;
        } else if (child._highlightReplacement) {
          node.children.splice(i, 1, ...child._highlightReplacement);
          delete child._highlightReplacement;
        }
      }
    }
  }

  return function transformer(tree: any) {
    processNode(tree);
  };
}