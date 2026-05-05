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

### Custom homepage filenames

Specify a custom ordered array of filenames to transform:

```ts
site.use(readme({
  homepage: ["home.md", "index.md", "README"],
}));
```

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
| `homepage` | `string[]` | `["readme.md", "readme.txt", "README"]` | Ordered array of homepage filenames (case insensitive) |
| `exclude` | `string[]` | `[]` | Paths to skip (must start and end with `/`) |
| `include` | `string[]` | `[]` | Paths to process exclusively (must start and end with `/`) |

## Behavior

- **Pretty URLs enabled (default)**: `README.md` → `/path/to/`
- **Pretty URLs disabled**: `README.md` → `/path/to/index.html`
- **Explicit URL set**: If a page has `url` in front matter, it is preserved
- **Nested homepage files**: Each is transformed to its parent directory URL
