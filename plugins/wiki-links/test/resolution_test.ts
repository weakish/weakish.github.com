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

// Tests for recursive subdirectory search feature

Deno.test("resolveLinkPath - finds .md file in subdirectory", () => {
  const testDir = "test-wiki-links-subdir-" + Date.now();
  try {
    clearDirectoryCache();
    Deno.mkdirSync(`${testDir}/docs`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/docs/getting-started.md`, "# Getting Started");

    const result = resolveLinkPath("getting-started", testDir);
    assertEquals(result, "/docs/getting-started/");
  } finally {
    clearDirectoryCache();
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {}
  }
});

Deno.test("resolveLinkPath - finds index.md in subdirectory", () => {
  const testDir = "test-wiki-links-subdir-" + Date.now();
  try {
    clearDirectoryCache();
    Deno.mkdirSync(`${testDir}/guides/install`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/guides/install/index.md`, "# Install Guide");

    const result = resolveLinkPath("install", testDir);
    assertEquals(result, "/guides/install/");
  } finally {
    clearDirectoryCache();
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {}
  }
});

Deno.test("resolveLinkPath - finds README.md in nested subdirectory", () => {
  const testDir = "test-wiki-links-subdir-" + Date.now();
  try {
    clearDirectoryCache();
    Deno.mkdirSync(`${testDir}/projects/old`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/projects/old/README.md`, "# Old Project");

    const result = resolveLinkPath("old", testDir);
    assertEquals(result, "/projects/old/");
  } finally {
    clearDirectoryCache();
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {}
  }
});

Deno.test("resolveLinkPath - searches subdirectories recursively", () => {
  const testDir = "test-wiki-links-subdir-" + Date.now();
  try {
    clearDirectoryCache();
    // Create a deeply nested file
    Deno.mkdirSync(`${testDir}/a/b/c`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/a/b/c/deep-link.md`, "# Deep Link");

    const result = resolveLinkPath("deep-link", testDir);
    assertEquals(result, "/a/b/c/deep-link/");
  } finally {
    clearDirectoryCache();
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {}
  }
});

Deno.test("resolveLinkPath - prefers current directory over subdirectory", () => {
  const testDir = "test-wiki-links-subdir-" + Date.now();
  try {
    clearDirectoryCache();
    // Create test directory
    Deno.mkdirSync(testDir, { recursive: true });
    // File exists in both current dir and subdirectory
    Deno.writeTextFileSync(`${testDir}/api.md`, "# API Root");
    Deno.mkdirSync(`${testDir}/docs`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/docs/api.md`, "# API Docs");

    const result = resolveLinkPath("api", testDir);
    // Should find the one in current directory first
    assertEquals(result, "/api/");
  } finally {
    clearDirectoryCache();
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {}
  }
});

Deno.test("resolveLinkPath - ignores dot-prefixed directories", () => {
  const testDir = "test-wiki-links-subdir-" + Date.now();
  try {
    clearDirectoryCache();
    // Create a .hidden directory with the file
    Deno.mkdirSync(`${testDir}/.hidden`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/.hidden/secret.md`, "# Secret");

    // Create the file in a non-hidden directory
    Deno.mkdirSync(`${testDir}/public`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/public/secret.md`, "# Public");

    const result = resolveLinkPath("secret", testDir);
    // Should find the one in public, not .hidden
    assertEquals(result, "/public/secret/");
  } finally {
    clearDirectoryCache();
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {}
  }
});

Deno.test("resolveLinkPath - ignores underscore-prefixed directories", () => {
  const testDir = "test-wiki-links-subdir-" + Date.now();
  try {
    clearDirectoryCache();
    // Create a _private directory with the file
    Deno.mkdirSync(`${testDir}/_private`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/_private/draft.md`, "# Draft");

    // Create the file in a normal directory
    Deno.mkdirSync(`${testDir}/content`, { recursive: true });
    Deno.writeTextFileSync(`${testDir}/content/draft.md`, "# Content");

    const result = resolveLinkPath("draft", testDir);
    // Should find the one in content, not _private
    assertEquals(result, "/content/draft/");
  } finally {
    clearDirectoryCache();
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {}
  }
});
