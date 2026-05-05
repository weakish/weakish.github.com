import { merge } from "lume/core/utils/object.ts";

import type { Page } from "lume/core/file.ts";
import type Site from "lume/core/site.ts";

export interface Options {
  /**
   * An ordered array of homepage basenames to transform (case insensitive).
   * Do not include file extensions — `srcPath` is extension-less.
   * The first match wins.
   * @default ["README"]
   */
  homepage?: string[];

  /**
   * Paths to exclude from transformation.
   * Paths must start with "/" and end with "/".
   * Cannot be used together with `include`.
   * @default []
   */
  exclude?: string[];

  /**
   * Paths to apply transformation exclusively.
   * Paths must start with "/" and end with "/".
   * Cannot be used together with `exclude`.
   * @default []
   */
  include?: string[];
}

export const defaults: Options = {
  homepage: ["README"],
  exclude: [],
  include: [],
};

export function readme(userOptions?: Options) {
  const options = merge(defaults, userOptions);

  if (options.exclude!.length > 0 && options.include!.length > 0) {
    throw new Error(
      "readme plugin: `exclude` and `include` options cannot be used together.",
    );
  }

  return (site: Site) => {
    site.preprocess(function processReadme(pages: Page[]) {
      pages.forEach((page: Page) => {
        const srcPath = page.src.path;

        if (!isHomepageMatch(srcPath, options.homepage!)) return;

        if (isExcluded(srcPath, options)) return;

        if (hasExplicitUrl(page, srcPath, site.options.prettyUrls)) return;

        const dirPath = getDirPath(srcPath);
        const newUrl = buildUrl(dirPath, site.options.prettyUrls);

        page.data.url = newUrl;
      });
    });
  };
}

export function isHomepageMatch(srcPath: string, homepage: string[]): boolean {
  const basename = getBasename(srcPath);
  const lowerBasename = basename.toLowerCase();

  return homepage.some((entry) => lowerBasename === entry.toLowerCase());
}

export function getBasename(srcPath: string): string {
  const segments = srcPath.split("/").filter(Boolean);
  return segments[segments.length - 1] || srcPath;
}

export function isExcluded(srcPath: string, options: Options): boolean {
  const pagePath = srcPath.startsWith("/") ? srcPath : "/" + srcPath;

  if (options.include && options.include.length > 0) {
    return !options.include.some((inc) => {
      const normalized = normalizePath(inc);
      return pagePath.startsWith(normalized);
    });
  }

  if (options.exclude && options.exclude.length > 0) {
    return options.exclude.some((exc) => {
      const normalized = normalizePath(exc);
      return pagePath.startsWith(normalized);
    });
  }

  return false;
}

function normalizePath(path: string): string {
  let normalized = path;
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }
  if (!normalized.endsWith("/")) {
    normalized = normalized + "/";
  }
  return normalized;
}

export function getDirPath(srcPath: string): string {
  const lastSlash = srcPath.lastIndexOf("/");
  if (lastSlash === -1) return "/";
  const dirPath = srcPath.slice(0, lastSlash);
  return dirPath === "" ? "/" : dirPath + "/";
}

export function buildUrl(dirPath: string, prettyUrls: boolean): string {
  if (prettyUrls) {
    return dirPath.endsWith("/") ? dirPath : dirPath + "/";
  }
  return dirPath.endsWith("/") ? dirPath + "index.html" : dirPath + "/index.html";
}

/**
 * Computes what Lume's default auto-generated URL would be for a given source path.
 * This is used by `hasExplicitUrl` to detect whether a user has overridden the
 * default URL in front matter or via _data files.
 *
 * Note: this approach assumes no other preprocessor has modified page.data.url
 * before this plugin runs. If using plugins like slugify_urls that transform URLs,
 * register this plugin BEFORE them in your _config.ts.
 */
export function computeAutoUrl(srcPath: string, prettyUrls: boolean): string {
  if (prettyUrls) {
    return srcPath.startsWith("/") ? srcPath + "/" : "/" + srcPath + "/";
  }
  const path = srcPath.startsWith("/") ? srcPath : "/" + srcPath;
  return path + ".html";
}

/**
 * Returns true if the page's URL was explicitly set by the user (via front matter,
 * _data files, or URL functions), false if it's Lume's auto-generated default.
 *
 * Detection works by comparing against the expected auto-generated URL from
 * computeAutoUrl. This correctly handles _data inheritance, all front matter
 * formats (YAML/JSON/TOML), and URL functions.
 */
export function hasExplicitUrl(page: Page, srcPath: string, prettyUrls: boolean): boolean {
  const url = page.data.url as string | boolean | Function | undefined;
  const autoUrl = computeAutoUrl(srcPath, prettyUrls);

  if (url === undefined) return false;
  if (url === false) return true;
  if (typeof url === "function") return true;
  if (typeof url !== "string") return true;

  return url.toLowerCase() !== autoUrl.toLowerCase();
}

export default readme;
