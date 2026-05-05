import { assertEquals, assertThrows } from "https://deno.land/std@0.201.0/assert/mod.ts";
import readme, { defaults, findHomepageMatch, isHomepageMatch, getBasename, getDirPath, buildUrl, isExcluded, hasExplicitUrl, computeAutoUrl } from "../readme.ts";
import type { Page } from "lume/core/file.ts";
import type Site from "lume/core/site.ts";

Deno.test("readme plugin - default options", () => {
  assertEquals(defaults.homepage, ["README"]);
  assertEquals(defaults.exclude, []);
  assertEquals(defaults.include, []);
});

Deno.test("readme plugin - throws on both exclude and include", () => {
  assertThrows(
    () => {
      readme({ exclude: ["/docs/"], include: ["/guides/"] });
    },
    Error,
    "`exclude` and `include` options cannot be used together",
  );
});

Deno.test("findHomepageMatch - matches README", () => {
  assertEquals(findHomepageMatch("/docs/README", ["README"]), "README");
  assertEquals(findHomepageMatch("/README", ["README"]), "README");
});

Deno.test("findHomepageMatch - case insensitive", () => {
  assertEquals(findHomepageMatch("/docs/Readme", ["README"]), "README");
  assertEquals(findHomepageMatch("/docs/readme", ["README"]), "README");
});

Deno.test("findHomepageMatch - returns null for no match", () => {
  assertEquals(findHomepageMatch("/docs/about", ["README"]), null);
  assertEquals(findHomepageMatch("/docs/index", ["README"]), null);
});

Deno.test("findHomepageMatch - ordered array first match wins", () => {
  assertEquals(findHomepageMatch("/docs/home", ["home", "README"]), "home");
  assertEquals(findHomepageMatch("/docs/README", ["home", "README"]), "README");
});

Deno.test("isHomepageMatch - matches README", () => {
  assertEquals(isHomepageMatch("/docs/README", ["README"]), true);
  assertEquals(isHomepageMatch("/README", ["README"]), true);
});

Deno.test("isHomepageMatch - case insensitive", () => {
  assertEquals(isHomepageMatch("/docs/Readme", ["README"]), true);
  assertEquals(isHomepageMatch("/docs/readme", ["README"]), true);
});

Deno.test("isHomepageMatch - returns false for no match", () => {
  assertEquals(isHomepageMatch("/docs/about", ["README"]), false);
  assertEquals(isHomepageMatch("/docs/index", ["README"]), false);
});

Deno.test("getBasename - extracts last segment", () => {
  assertEquals(getBasename("/docs/README"), "README");
  assertEquals(getBasename("/README"), "README");
  assertEquals(getBasename("README"), "README");
});

Deno.test("getDirPath - strips last segment", () => {
  assertEquals(getDirPath("/docs/getting-started/README"), "/docs/getting-started/");
  assertEquals(getDirPath("/README"), "/");
  assertEquals(getDirPath("/zk/README"), "/zk/");
});

Deno.test("getDirPath - handles directory names containing homepage pattern", () => {
  assertEquals(getDirPath("/README-docs/readme"), "/README-docs/");
  assertEquals(getDirPath("/docs/README-helper/readme"), "/docs/README-helper/");
  assertEquals(getDirPath("/README/foo/readme"), "/README/foo/");
});

Deno.test("buildUrl - pretty URLs", () => {
  assertEquals(buildUrl("/docs/", true), "/docs/");
  assertEquals(buildUrl("/docs", true), "/docs/");
  assertEquals(buildUrl("/", true), "/");
});

Deno.test("buildUrl - non-pretty URLs", () => {
  assertEquals(buildUrl("/docs/", false), "/docs/index.html");
  assertEquals(buildUrl("/docs", false), "/docs/index.html");
  assertEquals(buildUrl("/", false), "/index.html");
});

Deno.test("isExcluded - exclude paths", () => {
  assertEquals(isExcluded("/docs/README", { exclude: ["/docs/"] }), true);
  assertEquals(isExcluded("/guides/README", { exclude: ["/docs/"] }), false);
});

Deno.test("isExcluded - include paths", () => {
  assertEquals(isExcluded("/docs/README", { include: ["/docs/"] }), false);
  assertEquals(isExcluded("/guides/README", { include: ["/docs/"] }), true);
});

Deno.test("isExcluded - no rules", () => {
  assertEquals(isExcluded("/docs/README", {}), false);
});

Deno.test("isExcluded - auto-corrects missing leading slash", () => {
  assertEquals(isExcluded("/docs/README", { exclude: ["docs/"] }), true);
  assertEquals(isExcluded("/docs/README", { include: ["docs/"] }), false);
});

Deno.test("isExcluded - auto-corrects missing trailing slash", () => {
  assertEquals(isExcluded("/docs/README", { exclude: ["/docs"] }), true);
  assertEquals(isExcluded("/docs/README", { include: ["/docs"] }), false);
});

Deno.test("isExcluded - auto-corrects missing both slashes", () => {
  assertEquals(isExcluded("/docs/README", { exclude: ["docs"] }), true);
  assertEquals(isExcluded("/docs/README", { include: ["docs"] }), false);
});

Deno.test("isExcluded - corrected path doesn't match partial directories", () => {
  assertEquals(isExcluded("/docs-extra/README", { exclude: ["docs"] }), false);
  assertEquals(isExcluded("/docs-extra/README", { include: ["docs"] }), true);
});

Deno.test("hasExplicitUrl - auto-generated pretty URL", () => {
  const page = { data: { url: "/docs/README/" } } as Page;
  assertEquals(hasExplicitUrl(page, "/docs/README", true), false);
});

Deno.test("hasExplicitUrl - auto-generated non-pretty URL", () => {
  const page = { data: { url: "/docs/README.html" } } as Page;
  assertEquals(hasExplicitUrl(page, "/docs/README", false), false);
});

Deno.test("hasExplicitUrl - root auto-generated URL", () => {
  const page = { data: { url: "/README/" } } as Page;
  assertEquals(hasExplicitUrl(page, "/README", true), false);
});

Deno.test("hasExplicitUrl - explicit URL not matching auto pattern", () => {
  const page = { data: { url: "/my-custom/" } } as Page;
  assertEquals(hasExplicitUrl(page, "/docs/README", true), true);
});

Deno.test("hasExplicitUrl - URL containing basename as substring", () => {
  const page = { data: { url: "/docs-readme/" } } as Page;
  assertEquals(hasExplicitUrl(page, "/docs/README", true), true);
});

Deno.test("hasExplicitUrl - explicit URL with basename but different path", () => {
  const page = { data: { url: "/something/README/" } } as Page;
  assertEquals(hasExplicitUrl(page, "/foo/README", true), true);
});

Deno.test("hasExplicitUrl - url set to false", () => {
  const page = { data: { url: false } } as unknown as Page;
  assertEquals(hasExplicitUrl(page, "/docs/README", true), true);
});

Deno.test("hasExplicitUrl - url is a function", () => {
  const page = { data: { url: () => "/custom/" } } as unknown as Page;
  assertEquals(hasExplicitUrl(page, "/docs/README", true), true);
});

Deno.test("hasExplicitUrl - url is undefined", () => {
  const page = { data: {} } as Page;
  assertEquals(hasExplicitUrl(page, "/docs/README", true), false);
});

Deno.test("hasExplicitUrl - case insensitive for auto-generated", () => {
  const page = { data: { url: "/docs/Readme/" } } as Page;
  assertEquals(hasExplicitUrl(page, "/docs/README", true), false);
});

Deno.test("computeAutoUrl - pretty URLs", () => {
  assertEquals(computeAutoUrl("/docs/README", true), "/docs/README/");
  assertEquals(computeAutoUrl("/README", true), "/README/");
});

Deno.test("computeAutoUrl - non-pretty URLs", () => {
  assertEquals(computeAutoUrl("/docs/README", false), "/docs/README.html");
  assertEquals(computeAutoUrl("/README", false), "/README.html");
});

Deno.test("readme plugin - transforms README URLs via preprocess", () => {
  const pages = runPlugin([
    { srcPath: "/docs/getting-started/README", url: "/docs/getting-started/README/" },
    { srcPath: "/README", url: "/README/" },
    { srcPath: "/zk/README", url: "/zk/README/" },
  ]);

  assertEquals(pages[0].data.url, "/docs/getting-started/");
  assertEquals(pages[1].data.url, "/");
  assertEquals(pages[2].data.url, "/zk/");
});

Deno.test("readme plugin - preserves explicit URLs", () => {
  const pages = runPlugin([
    { srcPath: "/docs/custom/README", url: "/my-custom-path/" },
  ]);

  assertEquals(pages[0].data.url, "/my-custom-path/");
});

Deno.test("readme plugin - preserves URLs containing basename as substring", () => {
  const pages = runPlugin([
    { srcPath: "/docs/README", url: "/docs-readme/" },
  ]);

  assertEquals(pages[0].data.url, "/docs-readme/");
});

Deno.test("readme plugin - preserves explicit non-pretty URLs", () => {
  const pages = runPlugin(
    [{ srcPath: "/docs/custom/README", url: "/my-custom.html" }],
    undefined,
    { prettyUrls: false },
  );

  assertEquals(pages[0].data.url, "/my-custom.html");
});

Deno.test("readme plugin - preserves explicit URL with basename in different path", () => {
  const pages = runPlugin([
    { srcPath: "/foo/README", url: "/something/README/" },
  ]);

  assertEquals(pages[0].data.url, "/something/README/");
});

Deno.test("readme plugin - preserves url: false", () => {
  let capturedFn: (pages: { src: { path: string }; data: { url: unknown; basename?: string } }[]) => void;
  const site = createMockSite({
    preprocessFn: (fn) => { capturedFn = fn as typeof capturedFn; },
  });
  const plugin = readme();
  plugin(site as unknown as Site);

  const pages = [{
    src: { path: "/docs/README" },
    data: { url: false },
  }];

  capturedFn!(pages);

  assertEquals(pages[0].data.url, false);
});

Deno.test("readme plugin - excludes paths via preprocess", () => {
  const pages = runPlugin([
    { srcPath: "/docs/README", url: "/docs/README/" },
    { srcPath: "/guides/README", url: "/guides/README/" },
  ], { exclude: ["/docs/"] });

  assertEquals(pages[0].data.url, "/docs/README/");
  assertEquals(pages[1].data.url, "/guides/");
});

Deno.test("readme plugin - includes only specified paths via preprocess", () => {
  const pages = runPlugin([
    { srcPath: "/docs/README", url: "/docs/README/" },
    { srcPath: "/guides/README", url: "/guides/README/" },
  ], { include: ["/docs/"] });

  assertEquals(pages[0].data.url, "/docs/");
  assertEquals(pages[1].data.url, "/guides/README/");
});

Deno.test("readme plugin - pretty URLs disabled via preprocess", () => {
  const pages = runPlugin(
    [{ srcPath: "/docs/README", url: "/docs/README.html" }],
    undefined,
    { prettyUrls: false },
  );

  assertEquals(pages[0].data.url, "/docs/index.html");
});

Deno.test("readme plugin - directory name containing homepage pattern via preprocess", () => {
  const pages = runPlugin([
    { srcPath: "/README-docs/readme", url: "/README-docs/readme/" },
    { srcPath: "/docs/README-helper/readme", url: "/docs/README-helper/readme/" },
    { srcPath: "/README/foo/readme", url: "/README/foo/readme/" },
  ]);

  assertEquals(pages[0].data.url, "/README-docs/");
  assertEquals(pages[1].data.url, "/docs/README-helper/");
  assertEquals(pages[2].data.url, "/README/foo/");
});

interface PageMock {
  src: { path: string };
  data: { url: string; basename?: string };
}

function createMockPages(pagesData: { srcPath: string; url: string }[]): PageMock[] {
  return pagesData.map(({ srcPath, url }) => ({
    src: { path: srcPath },
    data: { url },
  }));
}

function createMockSite(config: {
  prettyUrls?: boolean;
  preprocessFn?: (fn: (...args: unknown[]) => void) => void;
} = {}) {
  const { prettyUrls, preprocessFn } = config;
  return {
    options: {
      prettyUrls: true,
      ...prettyUrls !== undefined && { prettyUrls },
    },
    preprocess(...args: unknown[]) {
      const fn = typeof args[0] === "function" ? args[0] : args[1];
      preprocessFn?.(fn as (...args: unknown[]) => void);
    },
  };
}

type PageData = { srcPath: string; url: string };

function runPlugin(
  pagesData: PageData[],
  pluginOptions?: Parameters<typeof readme>[0],
  siteConfig?: Parameters<typeof createMockSite>[0],
): PageMock[] {
  let capturedFn: (pages: PageMock[]) => void;
  const site = createMockSite({
    ...siteConfig,
    preprocessFn: (fn) => { capturedFn = fn as (pages: PageMock[]) => void; },
  });
  const plugin = readme(pluginOptions);
  plugin(site as unknown as Site);

  const pages = createMockPages(pagesData);
  capturedFn!(pages);
  return pages;
}
