export const layout = "default.liquid";

// README.md -> index.html
export function url(page: Lume.Page) {
  if (page.src.path.endsWith("README")) {
    return page.src.path.replace("README", "index") + ".html";
  } else {
    return;
  }
}
