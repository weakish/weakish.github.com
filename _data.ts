import type { Page } from "lume/core.ts";

export const layout = "default.liquid";
export const date = "Git Created";

// README.md -> index.html
export function url(page: Page) {
  if (page.src.path.endsWith("README")) {
    return page.src.path.replace("README", "index") + ".html";
  } else {
    return;
  }
}
