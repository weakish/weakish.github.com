# wiki-links

A Remark plugin for processing wiki-style links in Markdown.

## Problem

Standard Markdown does not support wiki-style links like `[[link]]` or `[[link|text]]`.
This plugin adds support for these links and resolves them to proper URLs based on the file structure.

## Features

- **Basic wiki links**: `[[link]]` → `<a href="/link/">link</a>`
- **Custom text**: `[[link|text]]` → `<a href="/link/">text</a>`
- **Section anchors**: `[[link#heading]]` → `<a href="/link/#heading">link</a>`
- **Combined**: `[[link#heading|text]]` → `<a href="/link/#heading">text</a>`
- **Automatic path resolution**: Automatically finds `.md`, `index.md`, or `README.md` files
- **Code block avoidance**: Does not transform links inside code blocks or inline code

## Usage

```ts
import remark from "lume/plugins/remark.ts";
import { customWikiLinks } from "./plugins/wiki-links/mod.ts";

site.use(remark({
  remarkPlugins: [
    customWikiLinks,
    // other remark plugins
  ],
}));
```

## Link Resolution

The plugin resolves links by checking for files in this order:

1. `${link}.md`
2. `${link}/index.md`
3. `${link}/README.md`

If a file is found in a subdirectory (e.g., `docs/getting-started.md`), the link is resolved to `/docs/getting-started/`.

Directories starting with `.` or `_` are ignored.

## Examples

| Input | Output |
|-------|--------|
| `[[about]]` | `<a href="/about/">about</a>` |
| `[[about|About Us]]` | `<a href="/about/">About Us</a>` |
| `[[docs/setup#installation]]` | `<a href="/docs/setup/#installation">docs/setup</a>` |
| `` See [[config]] for details `` | `` See <a href="/config/">config</a> for details `` |

## Configuration

Currently, the plugin uses the current working directory as the base for file resolution.