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
