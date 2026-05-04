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

Deno.test("Inline links in unordered list", () => {
  const markdown = "- See [this page](/foo) for details";
  const html = marked.parse(markdown) as string;
  const gemtext = htmlToGemtext(html);

  const lines = gemtext.split("\n");

  // Should have list item with text and link line
  const hasListItem = lines.some((line) => line.startsWith("* See this page for details"));
  const hasLinkLine = lines.some((line) => line.startsWith("=> /foo this page"));

  if (!hasListItem) {
    throw new Error(
      `Expected list item "See this page for details" not found in:\n${gemtext}`,
    );
  }
  if (!hasLinkLine) {
    throw new Error(
      `Expected link line after list item not found in:\n${gemtext}`,
    );
  }
});

Deno.test("Inline links in blockquote", () => {
  const markdown = "> See [this page](/foo) for details";
  const html = marked.parse(markdown) as string;
  const gemtext = htmlToGemtext(html);

  const lines = gemtext.split("\n");

  // Should have quote lines with text and link
  const hasQuoteLine = lines.some((line) =>
    line.startsWith("> ") && line.includes("See this page for details")
  );
  const hasQuoteLinkLine = lines.some((line) =>
    line.startsWith("> ") && line.includes("=> /foo this page")
  );

  if (!hasQuoteLine) {
    throw new Error(
      `Expected quote line with text not found in:\n${gemtext}`,
    );
  }
  if (!hasQuoteLinkLine) {
    throw new Error(
      `Expected quote line with link not found in:\n${gemtext}`,
    );
  }
});

Deno.test("Code block converts to preformatted text", () => {
  const markdown = "```js\nconst x = 1;\nconsole.log(x);\n```";
  const html = marked.parse(markdown) as string;
  const gemtext = htmlToGemtext(html);

  const lines = gemtext.split("\n");

  // Should have opening and closing ```
  const hasOpening = lines.some((line) => line === "```");
  const hasClosing = lines.filter((line) => line === "```").length === 2;

  if (!hasOpening) {
    throw new Error(
      `Expected opening \`\`\`\` not found in:\n${gemtext}`,
    );
  }
  if (!hasClosing) {
    throw new Error(
      `Expected closing \`\`\`\` not found in:\n${gemtext}`,
    );
  }

  // Check code content is preserved
  if (!gemtext.includes("const x = 1;")) {
    throw new Error(
      `Expected code content not found in:\n${gemtext}`,
    );
  }
  if (!gemtext.includes("console.log(x);")) {
    throw new Error(
      `Expected code content not found in:\n${gemtext}`,
    );
  }
});
