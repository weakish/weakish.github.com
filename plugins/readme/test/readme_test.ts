import { assertEquals, assertThrows } from "https://deno.land/std@0.201.0/assert/mod.ts";
import readme, { defaults, findHomepageMatch, getBasename, getDirPath, buildUrl, isExcluded, computeAutoUrl } from "../readme.ts";
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

Deno.test("computeAutoUrl - pretty URLs", () => {
  assertEquals(computeAutoUrl("/docs/README", true), "/docs/README/");
  assertEquals(computeAutoUrl("/README", true), "/README/");
});

Deno.test("computeAutoUrl - non-pretty URLs", () => {
  assertEquals(computeAutoUrl("/docs/README", false), "/docs/README.html");
  assertEquals(computeAutoUrl("/README", false), "/README.html");
});

Deno.test("readme plugin - transforms README URLs via preprocess", () => {
  let capturedFn: (pages: { src: { path: string }; data: { url: string; basename?: string } }[]) => void;
  const site = createMockSite({
    preprocessFn: (fn) => { capturedFn = fn as typeof capturedFn; },
  });
  const plugin = readme();
  plugin(site as unknown as Site);

  const pages = createMockPages([
    { srcPath: "/docs/getting-started/README", url: "/docs/getting-started/README/" },
    { srcPath: "/README", url: "/README/" },
    { srcPath: "/zk/README", url: "/zk/README/" },
  ]);

  capturedFn!(pages);

  assertEquals(pages[0].data.url, "/docs/getting-started/");
  assertEquals(pages[1].data.url, "/");
  assertEquals(pages[2].data.url, "/zk/");
});

Deno.test("readme plugin - preserves explicit URLs", () => {
  let capturedFn: (pages: { src: { path: string }; data: { url: string; basename?: string } }[]) => void;
  const site = createMockSite({
    preprocessFn: (fn) => { capturedFn = fn as typeof capturedFn; },
  });
  const plugin = readme();
  plugin(site as unknown as Site);

  const pages = createMockPages([
    { srcPath: "/docs/custom/README", url: "/my-custom-path/" },
  ]);

  capturedFn!(pages);

  assertEquals(pages[0].data.url, "/my-custom-path/");
});

Deno.test("readme plugin - excludes paths via preprocess", () => {
  let capturedFn: (pages: { src: { path: string }; data: { url: string; basename?: string } }[]) => void;
  const site = createMockSite({
    preprocessFn: (fn) => { capturedFn = fn as typeof capturedFn; },
  });
  const plugin = readme({ exclude: ["/docs/"] });
  plugin(site as unknown as Site);

  const pages = createMockPages([
    { srcPath: "/docs/README", url: "/docs/README/" },
    { srcPath: "/guides/README", url: "/guides/README/" },
  ]);

  capturedFn!(pages);

  assertEquals(pages[0].data.url, "/docs/README/");
  assertEquals(pages[1].data.url, "/guides/");
});

Deno.test("readme plugin - includes only specified paths via preprocess", () => {
  let capturedFn: (pages: { src: { path: string }; data: { url: string; basename?: string } }[]) => void;
  const site = createMockSite({
    preprocessFn: (fn) => { capturedFn = fn as typeof capturedFn; },
  });
  const plugin = readme({ include: ["/docs/"] });
  plugin(site as unknown as Site);

  const pages = createMockPages([
    { srcPath: "/docs/README", url: "/docs/README/" },
    { srcPath: "/guides/README", url: "/guides/README/" },
  ]);

  capturedFn!(pages);

  assertEquals(pages[0].data.url, "/docs/");
  assertEquals(pages[1].data.url, "/guides/README/");
});

Deno.test("readme plugin - pretty URLs disabled via preprocess", () => {
  let capturedFn: (pages: { src: { path: string }; data: { url: string; basename?: string } }[]) => void;
  const site = createMockSite({
    prettyUrls: false,
    preprocessFn: (fn) => { capturedFn = fn as typeof capturedFn; },
  });
  const plugin = readme();
  plugin(site as unknown as Site);

  const pages = createMockPages([
    { srcPath: "/docs/README", url: "/docs/README.html" },
  ]);

  capturedFn!(pages);

  assertEquals(pages[0].data.url, "/docs/index.html");
});

Deno.test("readme plugin - directory name containing homepage pattern via preprocess", () => {
  let capturedFn: (pages: { src: { path: string }; data: { url: string; basename?: string } }[]) => void;
  const site = createMockSite({
    preprocessFn: (fn) => { capturedFn = fn as typeof capturedFn; },
  });
  const plugin = readme();
  plugin(site as unknown as Site);

  const pages = createMockPages([
    { srcPath: "/README-docs/readme", url: "/README-docs/readme/" },
    { srcPath: "/docs/README-helper/readme", url: "/docs/README-helper/readme/" },
    { srcPath: "/README/foo/readme", url: "/README/foo/readme/" },
  ]);

  capturedFn!(pages);

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
