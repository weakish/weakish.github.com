import { htmlToGemtext } from "./gemini-converter.ts";
import { marked } from "https://esm.sh/marked@15.0.2?target=es2022";

Deno.test("Markdown link converts to Gemtext link line", () => {
  const markdown = "See [this page](/foo) for details";
  const html = marked.parse(markdown) as string;
  const gemtext = htmlToGemtext(html);

  // The link should be on its own line in Gemtext
  // "See" and "for details" are inline text that should be on the same line
  // The link [this page](/foo) should become "=> /foo this page"
  const lines = gemtext.split("\n");

  // Should have the text with link converted
  const hasLinkLine = lines.some((line) => line.includes("=> /foo this page"));
  if (!hasLinkLine) {
    throw new Error(
      `Expected link line "=> /foo this page" not found in:\n${gemtext}`,
    );
  }
});

Deno.test("Inline text around link stays on same line", () => {
  const markdown = "See [this page](/foo) for details";
  const html = marked.parse(markdown) as string;
  const gemtext = htmlToGemtext(html);

  // In Gemtext, links are on their own line after an empty line
  // "See" and "for details" should be on the same line as "this page"
  const lines = gemtext.split("\n");

  // Should have 3 lines: text, empty line, link
  if (lines.length !== 3) {
    throw new Error(
      `Expected 3 lines, got ${lines.length} in:\n${gemtext}`,
    );
  }

  // Check line contents
  if (!lines[0].includes("See this page for details")) {
    throw new Error(`Expected first line to contain "See this page for details" in:\n${gemtext}`);
  }
  if (lines[1] !== "") {
    throw new Error(`Expected second line to be empty in:\n${gemtext}`);
  }
  if (!lines[2].includes("=> /foo this page")) {
    throw new Error(`Expected third line to be link in:\n${gemtext}`);
  }
});

Deno.test("Multiple links in paragraph", () => {
  const markdown =
    "Check [Google](https://google.com) and [GitHub](https://github.com)";
  const html = marked.parse(markdown) as string;
  const gemtext = htmlToGemtext(html);

  const lines = gemtext.split("\n");

  const hasGoogleLink = lines.some((line) =>
    line.includes("=> https://google.com Google")
  );
  const hasGitHubLink = lines.some((line) =>
    line.includes("=> https://github.com GitHub")
  );

  if (!hasGoogleLink) {
    throw new Error(
      `Expected Google link line not found in:\n${gemtext}`,
    );
  }
  if (!hasGitHubLink) {
    throw new Error(
      `Expected GitHub link line not found in:\n${gemtext}`,
    );
  }
});
