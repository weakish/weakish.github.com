// Custom remark plugin to handle wiki links with proper path resolution
import { existsSync } from "https://deno.land/std@0.214.0/fs/exists.ts";
import { join } from "https://deno.land/std@0.214.0/path/mod.ts";

export function customWikiLinks() {
  const searchDirs = ["zk", "zk/Register"];
  const baseDir = ".";
  
  function resolveLinkPath(link: string): string {
    // Search for the file across all directories
    for (const searchDir of searchDirs) {
      const fullPath = join(baseDir, searchDir, `${link}.md`);
      if (existsSync(fullPath)) {
        return `/${searchDir}/${link}/`;
      }
    }
    // If not found, return the original link (fallback)
    return `/${link}/`;
  }

  function processNode(node: any): void {
    if (node.type === 'text' && typeof node.value === 'string') {
      const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
      const matches = [...node.value.matchAll(wikiLinkRegex)];
      
      if (matches.length > 0) {
        // We need to replace this text node with multiple nodes
        const newNodes: any[] = [];
        let lastIndex = 0;
        
        for (const match of matches) {
          const fullMatch = match[0];
          const linkText = match[1];
          const matchIndex = match.index!;
          
          // Add text before the link
          if (matchIndex > lastIndex) {
            newNodes.push({
              type: 'text',
              value: node.value.slice(lastIndex, matchIndex)
            });
          }
          
          // Add the link
          const resolvedPath = resolveLinkPath(linkText);
          newNodes.push({
            type: 'link',
            url: resolvedPath,
            title: null,
            children: [{
              type: 'text',
              value: linkText
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
    
    // Process children
    if (node.children) {
      for (const child of node.children) {
        processNode(child);
      }
      
      // Replace nodes that were marked for replacement
      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i];
        if (child._wikiLinksReplacement) {
          node.children.splice(i, 1, ...child._wikiLinksReplacement);
          delete child._wikiLinksReplacement;
        }
      }
    }
  }

  return function transformer(tree: any) {
    processNode(tree);
  };
}