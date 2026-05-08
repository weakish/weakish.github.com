import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts";
import { getAllDirectories } from "../mod.ts";

Deno.test("getAllDirectories - returns empty for non-existent directory", () => {
  const result = getAllDirectories("/non/existent/path");

  assertEquals(result.length, 0);
});
