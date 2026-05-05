# lume-plugin-readme

A Lume plugin that transforms URLs of homepage files (like `README.md`) to clean directory URLs, enabling GitHub Pages-style documentation sites.

## Problem

By default, Lume generates URLs like this:

```text
/docs/getting-started/README.md  →  /docs/getting-started/README/
```

This plugin transforms them to:

```text
/docs/getting-started/README.md  →  /docs/getting-started/
```

## Usage

### Basic usage

Transform all `README` files to directory URLs:

```ts
import readme from "./plugins/readme/mod.ts";

site.use(readme());
```

### Custom homepage basenames

Specify a custom ordered array of basenames to transform:

```ts
site.use(readme({
  homepage: ["home", "index", "README"],
}));
```

Do not include file extensions — Lume's `srcPath` is extension-less.
The first match in the array wins. Matching is case insensitive.

### Exclude paths

Skip transformation for specific directories:

```ts
site.use(readme({
  exclude: ["/blog/", "/notes/"],
}));
```

### Include only specific paths

Only transform files in specified directories:

```ts
site.use(readme({
  include: ["/docs/", "/guides/"],
}));
```

> **Note:** `exclude` and `include` cannot be used together.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `homepage` | `string[]` | `["README"]` | Ordered array of homepage basenames (case insensitive, no extensions) |
| `exclude` | `string[]` | `[]` | Paths to skip (must start and end with `/`) |
| `include` | `string[]` | `[]` | Paths to process exclusively (must start and end with `/`) |

## Plugin ordering

Register this plugin **before** any other plugins that modify page URLs
(e.g., `slugify_urls`). The plugin detects explicit user-set URLs by
comparing against Lume's auto-generated default; if another preprocessor
modifies the URL first, this detection may fail.

## Behavior

- **Pretty URLs enabled (default)**: `README.md` → `/path/to/`
- **Pretty URLs disabled**: `README.md` → `/path/to/index.html`
- **Explicit URL set**: If a page has `url` in front matter, it is preserved
- **Nested homepage files**: Each is transformed to its parent directory URL
