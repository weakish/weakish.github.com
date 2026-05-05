# Plugin Plan: lume-plugin-readme

## Overview

This plugin transforms URLs of `README` files to `index.html`, enabling cleaner URLs for documentation-style sites (e.g., `README.md` becomes `/path/` instead of `/path/README/`).

## Problem Statement

In many projects (especially GitHub-style documentation), users have `README.md` files in directories that should be served at the directory root with pretty URLs:

```text
/docs/getting-started/README.md  →  /docs/getting-started/
```

GitHub Pages and docsify has built-in support for this.

By default, Lume generates:
```text
/docs/getting-started/README/index.html  →  /docs/getting-started/README/
```

This plugin provides a standardized way to transform these URLs to `/docs/getting-started/`.

## User Experience

### Before (manual approach)

In `_data.ts` at project root:

```ts
export function url(page: Lume.Page) {
  if (page.src.path.endsWith("README")) {
    return page.src.path.replace("README", "index") + ".html";
  }
}
```

### After (with plugin)

```ts
import readme from "https://deno.land/x/lume_plugin_readme/mod.ts";

site.use(readme());
```

## Technical Design

### Plugin Structure

Following Lume's plugin pattern from [Creating plugins](https://lume.land/docs/advanced/plugins/):

```ts
import { Site } from "lume/core.ts";

interface Options {
  /** Whether to process README files (default: true) */
  enabled?: boolean;
}

export default function (options: Options = {}) {
  return (site: Site) => {
    const { enabled = true } = options;

    if (!enabled) return;

    // Use the url() function approach via shared data
    // See: https://lume.land/docs/creating-pages/urls/#urls-as-functions
  };
}
```

### Implementation Approaches

#### Approach A: Shared Data with `url` Function

Create a `_data.ts` that exports a `url` function. This is the current implementation in the codebase.

**Pros:**
- Simple, works with existing pattern
- Uses Lume's built-in URL resolution

**Cons:**
- Requires placing `_data.ts` in the root or targeted directories, and this may confilict with `_data.ts` placed by the users
- Cannot be easily configured per-directory

#### Approach B: Processor Hook

Use `site.preprocess()` to modify page URLs directly.

**Pros:**
- Can be applied globally with one `site.use(readme())` call
- More flexible configuration options
- More suitable for plugins. Fer example, `slugify_urls` also uses this approach.

**Cons:**
- May conflict with user's manual URL settings

#### Approach C: Event Listener

Listen to early events to modify page URLs.

**Pros:**
- Can run before other URL processing
- Most control over the process

**Cons:**
- More complex, requires understanding Lume's event system

**Decision:** Implement this feature using approach B via `site.preprocess()`.


### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|--------------|
| `enabled` | `boolean` | `true` | Enable/disable the plugin |
| `target` | `string` | `"README"` | Base filename to transform, e.g. `home`. |
| `exclude` | `string[]` | `[]` | Paths to exclude from transformation |
| `include` | `string[]` | `[]` | Paths to apply transformation |

### Directory Scoping

By default, the plugin applies to all directories. Users can scope it to specific directories by:

1. Adding an `exclude` option for paths to skip.
2. Adding an `include` option for paths to apply transformation, if this option is used, only paths specified will be applied.
3. If both `exclude` and `include` are present, throw an error. 
4. Wilcards are not supported in `exclude` and `include` options.


Example - do not transform in `/docs/` and `/guides/`:

```ts
site.use(readme({
  exclude: ["/blog/", "/guides/"],
}));
```

## Edge Cases

1. **Conflicting manual URLs**: If user explicitly sets `url` in front matter, the plugin should NOT override it. The `url` function should return `undefined` for such cases.

2. **Nested READMEs**: If `/foo/README.md` and `/foo/bar/README.md` exist, both should transform to `/foo/` and `/foo/bar/` respectively.

3. **Case sensitivity**: Should handle `Readme.md`, `readme.MD`, etc. (Lume normalizes this, but need to verify).

4. **Index file already exists**: If both `README.md` and `index.md` exist in the same directory, index.md takes precedence.

5. **Pretty URLs disabled**: If `prettyUrls: false` in config, behavior should still transform `README.md` to `index.html`.

## Testing Strategy

1. **Unit tests**: Test URL transformation logic in isolation
2. **Integration tests**: Test with full Lume build
3. **Edge cases**:
   - Multiple README files in nested directories
   - Mixed with explicit `url` setting
   - With and without `prettyUrls`

## File Structure

```
lume-plugin-readme/
├── mod.ts           # Main entry point, exports plugin
├── readme.ts        # Core transformation logic
├── test/
│   └── readme_test.ts
└── README.md        # Documentation
```

## Export Interface

```ts
// mod.ts
export { default } from "./readme.ts";
export type { Options } from "./readme.ts";
```

## References

- Lume URLs documentation: https://lume.land/docs/creating-pages/urls/
- Lume plugin creation: https://lume.land/docs/advanced/plugins/
- Existing pattern in `_data.ts`: `/workspace/weakish.github.com/_data.ts`

## Implementation Notes

- Use `site.preprocess()` with `.html` to run on all pages after they're loaded
- Check `page.src.path` to detect target files (e.g., `README`, `home`)
- Skip if user has set explicit `url` in front matter (`page.data.url !== undefined`)
- Set `page.data.url` directly to the directory path with trailing slash for pretty URLs
- For non-pretty URLs, append `.html` extension
- The `prettyUrls` option can be checked via `site.options.prettyUrls`

## Timeline

- Phase 1: Core transformation logic
- Phase 2: Options and configuration
- Phase 3: Testing and documentation
- Phase 4: Publish to deno.land/x or jsdelivr
