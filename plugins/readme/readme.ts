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
        const match = findHomepageMatch(srcPath, options.homepage!);
        if (!match) return;

        if (isExcluded(srcPath, options)) return;

        const dirPath = getDirPath(srcPath);
        const newUrl = buildUrl(dirPath, site.options.prettyUrls);

        if (hasExplicitUrl(page, getBasename(srcPath))) return;

        page.data.url = newUrl;
        page.data.basename = "";
      });
    });
  };
}

export function findHomepageMatch(
  srcPath: string,
  homepage: string[],
): string | null {
  const basename = getBasename(srcPath);
  const lowerBasename = basename.toLowerCase();

  for (const entry of homepage) {
    if (lowerBasename === entry.toLowerCase()) {
      return entry;
    }
  }

  return null;
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

export function hasExplicitUrl(page: Page, basename: string): boolean {
  const url = page.data.url;
  const base = basename.toLowerCase();

  // Handle pretty URL: /path/to/README/
  if (url.endsWith("/")) {
    const withoutTrailingSlash = url.slice(0, -1);
    const lastSegment = withoutTrailingSlash.slice(withoutTrailingSlash.lastIndexOf("/") + 1);
    if (lastSegment.toLowerCase() === base) return false;
  }

  // Handle non-pretty URL: /path/to/README.html
  if (url.endsWith(".html")) {
    const withoutHtml = url.slice(0, -5);
    const lastSegment = withoutHtml.slice(withoutHtml.lastIndexOf("/") + 1);
    if (lastSegment.toLowerCase() === base) return false;
  }

  return true;
}

export default readme;
