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
        if (page.data._readmeProcessed) return;
        page.data._readmeProcessed = true;

        const srcPath = page.src.path;
        const match = findHomepageMatch(srcPath, options.homepage!);
        if (!match) return;

        if (isExcluded(srcPath, options)) return;

        const dirPath = getDirPath(srcPath);
        const newUrl = buildUrl(dirPath, site.options.prettyUrls);

        if (page.data.url === newUrl) return;

        page.data.url = newUrl;
        page.data.basename = "";
      });
    });
  };
}

function findHomepageMatch(
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

function getBasename(srcPath: string): string {
  const segments = srcPath.split("/").filter(Boolean);
  return segments[segments.length - 1] || srcPath;
}

function isExcluded(srcPath: string, options: Options): boolean {
  const pagePath = srcPath.startsWith("/") ? srcPath : "/" + srcPath;

  if (options.include!.length > 0) {
    return !options.include!.some((inc) => pagePath.startsWith(inc));
  }

  if (options.exclude!.length > 0) {
    return options.exclude!.some((exc) => pagePath.startsWith(exc));
  }

  return false;
}

function getDirPath(srcPath: string): string {
  const lastSlash = srcPath.lastIndexOf("/");
  if (lastSlash === -1) return "/";
  const dirPath = srcPath.slice(0, lastSlash);
  return dirPath === "" ? "/" : dirPath;
}

function buildUrl(dirPath: string, prettyUrls: boolean): string {
  if (prettyUrls) {
    return dirPath.endsWith("/") ? dirPath : dirPath + "/";
  }
  return dirPath.endsWith("/") ? dirPath + "index.html" : dirPath + "/index.html";
}

export default readme;
