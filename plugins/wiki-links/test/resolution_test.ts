import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts";
import {
  clearDirectoryCache,
  getAllDirectories,
  resolveLinkPath,
} from "../mod.ts";

const testDir = "test-wiki-links-resolve";

function cleanup(): void {
  clearDirectoryCache();
  try {
    Deno.removeSync(testDir, { recursive: true });
  } catch {}
}

Deno.test("resolveLinkPath - finds .md file in current directory", () => {
  cleanup();
  Deno.mkdirSync(testDir, { recursive: true });
  Deno.writeTextFileSync(`${testDir}/about.md`, "# About");

  const result = resolveLinkPath("about", testDir);
  assertEquals(result, "/about/");

  cleanup();
});

Deno.test("resolveLinkPath - finds index.md file in subdirectory", () => {
  cleanup();
  Deno.mkdirSync(`${testDir}/about`, { recursive: true });
  Deno.writeTextFileSync(`${testDir}/about/index.md`, "# About");

  const result = resolveLinkPath("about", testDir);
  assertEquals(result, "/about/");

  cleanup();
});

Deno.test("resolveLinkPath - finds README.md file in subdirectory", () => {
  cleanup();
  Deno.mkdirSync(`${testDir}/about`, { recursive: true });
  Deno.writeTextFileSync(`${testDir}/about/README.md`, "# About");

  const result = resolveLinkPath("about", testDir);
  assertEquals(result, "/about/");

  cleanup();
});

Deno.test("resolveLinkPath - falls back when not found", () => {
  cleanup();
  Deno.mkdirSync(testDir, { recursive: true });

  const result = resolveLinkPath("nonexistent", testDir);
  assertEquals(result, "/nonexistent/");

  cleanup();
});

Deno.test("getAllDirectories - returns directories (order is filesystem-dependent)", () => {
  clearDirectoryCache();

  const dirs = getAllDirectories(".");
  assertEquals(dirs.length > 0, true, "Should find directories");
});

Deno.test("resolveLinkPath - non-deterministic with duplicate filenames", () => {
  const testDir = "test-wiki-links-dup-" + Date.now();
  try {
    clearDirectoryCache();
    Deno.mkdirSync(`${testDir}/subdir1`, { recursive: true });
    Deno.mkdirSync(`${testDir}/subdir2`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/subdir1/about.md`, "# About 1");
    Deno.writeTextFileSync(`${testDir}/subdir2/about.md`, "# About 2");

    const result = resolveLinkPath("about", testDir);
    const valid = result === "/subdir1/about/" || result === "/subdir2/about/";
    assertEquals(valid, true, "Should resolve to one of subdirectories with link name");
  } finally {
    clearDirectoryCache();
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {}
  }
});
