import { assertEquals, assertThrows } from "https://deno.land/std@0.201.0/assert/mod.ts";
import readme, { defaults } from "../readme.ts";

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

Deno.test("readme plugin - transforms README URLs (srcPath is extension-less)", () => {
  const pages = createMockPages([
    { srcPath: "/docs/getting-started/README", url: "/docs/getting-started/README/" },
    { srcPath: "/README", url: "/README/" },
    { srcPath: "/zk/README", url: "/zk/README/" },
  ]);

  applyReadmeTransform(pages, { prettyUrls: true });

  assertEquals(pages[0].data.url, "/docs/getting-started/");
  assertEquals(pages[1].data.url, "/");
  assertEquals(pages[2].data.url, "/zk/");
});

Deno.test("readme plugin - case insensitive match", () => {
  const pages = createMockPages([
    { srcPath: "/docs/Readme", url: "/docs/Readme/" },
    { srcPath: "/docs/readme", url: "/docs/readme/" },
  ]);

  applyReadmeTransform(pages, { prettyUrls: true });

  assertEquals(pages[0].data.url, "/docs/");
  assertEquals(pages[1].data.url, "/docs/");
});

Deno.test("readme plugin - excludes paths", () => {
  const pages = createMockPages([
    { srcPath: "/docs/README", url: "/docs/README/" },
    { srcPath: "/guides/README", url: "/guides/README/" },
  ]);

  applyReadmeTransform(pages, { exclude: ["/docs/"] });

  assertEquals(pages[0].data.url, "/docs/README/");
  assertEquals(pages[1].data.url, "/guides/");
});

Deno.test("readme plugin - includes only specified paths", () => {
  const pages = createMockPages([
    { srcPath: "/docs/README", url: "/docs/README/" },
    { srcPath: "/guides/README", url: "/guides/README/" },
  ]);

  applyReadmeTransform(pages, { include: ["/docs/"] });

  assertEquals(pages[0].data.url, "/docs/");
  assertEquals(pages[1].data.url, "/guides/README/");
});

Deno.test("readme plugin - pretty URLs disabled", () => {
  const pages = createMockPages([
    { srcPath: "/docs/README", url: "/docs/README/" },
  ]);

  applyReadmeTransform(pages, { prettyUrls: false });

  assertEquals(pages[0].data.url, "/docs/index.html");
});

Deno.test("readme plugin - custom homepage array", () => {
  const pages = createMockPages([
    { srcPath: "/docs/home", url: "/docs/home/" },
    { srcPath: "/docs/README", url: "/docs/README/" },
  ]);

  applyReadmeTransform(pages, { homepage: ["home"] });

  assertEquals(pages[0].data.url, "/docs/");
  assertEquals(pages[1].data.url, "/docs/README/");
});

Deno.test("readme plugin - ordered array first match wins", () => {
  const pages = createMockPages([
    { srcPath: "/docs/README", url: "/docs/README/" },
    { srcPath: "/docs/HOME", url: "/docs/HOME/" },
  ]);

  applyReadmeTransform(pages, { homepage: ["HOME", "README"] });

  assertEquals(pages[0].data.url, "/docs/");
  assertEquals(pages[1].data.url, "/docs/");
});

Deno.test("readme plugin - directory name containing homepage pattern", () => {
  const pages = createMockPages([
    { srcPath: "/README-docs/readme", url: "/README-docs/readme/" },
    { srcPath: "/docs/README-helper/readme", url: "/docs/README-helper/readme/" },
    { srcPath: "/README/foo/readme", url: "/README/foo/readme/" },
  ]);

  applyReadmeTransform(pages, { prettyUrls: true });

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

function applyReadmeTransform(
  pages: PageMock[],
  options: { prettyUrls?: boolean; homepage?: string[]; exclude?: string[]; include?: string[] } = {},
) {
  const {
    prettyUrls = true,
    homepage = ["README"],
    exclude = [],
    include = [],
  } = options;

  for (const page of pages) {
    const srcPath = page.src.path;
    const match = findHomepageMatch(srcPath, homepage);
    if (!match) continue;

    if (include.length > 0 && !include.some((inc) => {
      const pagePath = srcPath.startsWith("/") ? srcPath : "/" + srcPath;
      return pagePath.startsWith(inc);
    })) continue;
    if (exclude.length > 0) {
      const pagePath = srcPath.startsWith("/") ? srcPath : "/" + srcPath;
      if (exclude.some((exc) => pagePath.startsWith(exc))) continue;
    }

    const dirPath = getDirPath(srcPath);
    const newUrl = buildUrl(dirPath, prettyUrls);

    if (page.data.url === newUrl) continue;

    page.data.url = newUrl;
    page.data.basename = "";
  }
}

function findHomepageMatch(srcPath: string, homepage: string[]): string | null {
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
