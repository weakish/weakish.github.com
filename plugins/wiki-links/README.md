# wiki-links

A Remark plugin for processing wiki-style links in Markdown.

## Problem

Standard Markdown does not support wiki-style links like `[[link]]` or
`[[link|text]]`. This plugin adds support for these links and resolves them to
proper URLs based on the file structure.

## Features

- **Basic wiki links**: `[[link]]` → `<a href="/link/">link</a>`
- **Custom text**: `[[link|text]]` → `<a href="/link/">text</a>`
- **Section anchors**: `[[link#heading]]` → `<a href="/link/#heading">link</a>`
- **Combined**: `[[link#heading|text]]` → `<a href="/link/#heading">text</a>`
- **Automatic path resolution**: Automatically finds `.md`, `index.md`, or
  `README.md` files
- **Code block avoidance**: Does not transform links inside code blocks or
  inline code

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

The plugin searches for target files in this order:

1. `${link}.md` in the current directory
2. `${link}/index.md` in the current directory
3. `${link}/README.md` in the current directory
4. If not found locally, recursively searches all subdirectories

Directories starting with `.` or `_` are ignored during the search.

If a file is found in a subdirectory (e.g., `docs/getting-started.md`), the link
is resolved to `/docs/getting-started/`.

## Examples

| Input                         | Output                                               |
| ----------------------------- | ---------------------------------------------------- |
| `[[about]]`                   | `<a href="/about/">about</a>`                        |
| `[[about                      | About Us]]`                                          |
| `[[docs/setup#installation]]` | `<a href="/docs/setup/#installation">docs/setup</a>` |
| `See [[config]] for details`  | `See <a href="/config/">config</a> for details`      |

## Configuration

Currently, the plugin uses the current working directory as the base for file
resolution.

## Known Limitations

- **Nested brackets**: `[[outer [[nested]] link]]` produces a URL with raw
  brackets (`/outer [[nested/`) which is technically invalid. Avoid nested wiki
  link syntax in your content.
- **Special characters in headings**: Heading anchors are lowercased and spaces
  are replaced with hyphens (e.g., `#Getting Started` → `#getting-started`).
- **No URL encoding**: The resulting URLs are not percent-encoded. Brackets and
  other special characters in URLs may cause issues in some contexts.
- **Duplicate filenames**: If multiple directories contain a file with the same
  name (e.g., `docs/bar.md` and `blog/bar.md`), the resolved URL depends on
  filesystem iteration order, which is not guaranteed to be deterministic. Avoid
  having duplicate filenames across subdirectories.
