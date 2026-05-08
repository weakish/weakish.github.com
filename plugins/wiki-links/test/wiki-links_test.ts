import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.201.0/assert/mod.ts";
import { customWikiLinks } from "../mod.ts";

interface ASTNode {
  type: string;
  value?: string;
  children?: ASTNode[];
  parent?: ASTNode | null;
  url?: string;
  title?: string | null;
  data?: {
    hName?: string;
  };
  _wikiLinksReplacement?: ASTNode[];
}

interface LinkNode extends ASTNode {
  type: "link";
  url: string;
  title: string | null;
  children: ASTNode[];
}

interface TextNode extends ASTNode {
  type: "text";
  value: string;
}

function createTextNode(value: string): TextNode {
  return { type: "text", value };
}

function createParagraph(children: ASTNode[]): ASTNode {
  return { type: "paragraph", children };
}

function createCodeBlock(value: string): ASTNode {
  return { type: "code", value, children: [] };
}

function createInlineCode(value: string): ASTNode {
  return { type: "inlineCode", value, children: [] };
}

function runPlugin(node: ASTNode): ASTNode {
  const transformer = customWikiLinks();
  transformer(node);
  return node;
}

Deno.test("wiki-links - basic wiki link", () => {
  const node = createParagraph([createTextNode("See [[about]] for details")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const textNode = para.children[0] as TextNode;
  assertEquals(textNode.value, "See ");
  const linkNode = para.children[1] as LinkNode;

  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/about/");
  assertEquals(linkNode.children[0].value, "about");
  const afterText = para.children[2] as TextNode;
  assertEquals(afterText.value, " for details");
});

Deno.test("wiki-links - custom text", () => {
  const node = createParagraph([
    createTextNode("Check out [[about|our team]] page"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;

  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/about/");
  assertEquals(linkNode.children[0].value, "our team");
});

Deno.test("wiki-links - section anchor", () => {
  const node = createParagraph([
    createTextNode("See [[setup#installation]] for help"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  assertEquals((para.children[0] as TextNode).value, "See ");
  const linkNode = para.children[1] as LinkNode;

  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/setup/#installation");
});

Deno.test("wiki-links - combined anchor and custom text", () => {
  const node = createParagraph([
    createTextNode("Read [[install#installation|Setup Guide]] here"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;

  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/install/#installation");
  assertEquals(linkNode.children[0].value, "Setup Guide");
});

Deno.test("wiki-links - custom text with anchor", () => {
  const node = createParagraph([
    createTextNode("See [[config#options|Configuration]]"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;

  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/config/#options");
  assertEquals(linkNode.children[0].value, "Configuration");
});

Deno.test("wiki-links - multiple wiki links in same text", () => {
  const node = createParagraph([
    createTextNode("Check [[about]] and [[contact]] pages"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const link1 = para.children[1] as LinkNode;
  const link2 = para.children[3] as LinkNode;

  assertEquals(link1.type, "link");
  assertEquals(link1.url, "/about/");
  assertEquals(link1.children[0].value, "about");

  assertEquals(link2.type, "link");
  assertEquals(link2.url, "/contact/");
  assertEquals(link2.children[0].value, "contact");
});

Deno.test("wiki-links - text before and after link", () => {
  const node = createParagraph([
    createTextNode("Read the [[docs]] and come back"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  assertEquals((para.children[0] as TextNode).value, "Read the ");
  assertEquals((para.children[2] as TextNode).value, " and come back");
});

Deno.test("wiki-links - no links in plain text", () => {
  const node = createParagraph([
    createTextNode("This is just plain text without links."),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  assertEquals(para.children.length, 1);
  assertEquals(
    (para.children[0] as TextNode).value,
    "This is just plain text without links.",
  );
});

Deno.test("wiki-links - wiki link with special characters in heading", () => {
  const node = createParagraph([
    createTextNode("See [[docs#Getting Started]]"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;

  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/docs/#getting-started");
});

Deno.test("wiki-links - wiki link with spaces in heading", () => {
  const node = createParagraph([createTextNode("See [[api#Response Format]]")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;

  assertEquals(linkNode.url, "/api/#response-format");
});

Deno.test("wiki-links - handles nested brackets in link text", () => {
  const node = createParagraph([createTextNode("[[outer [[nested]] link]]")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[0] as LinkNode;
  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/outer [[nested/");
  assertEquals(linkNode.children[0].value, "outer [[nested");
  const afterText = para.children[1] as TextNode;
  assertEquals(afterText.value, " link]]");
});

Deno.test("wiki-links - empty wiki link is not transformed", () => {
  const node = createParagraph([createTextNode("[[]] in text")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const textNode = para.children[0] as TextNode;
  assertEquals(textNode.value, "[[]] in text");
});

Deno.test("wiki-links - wiki link with only pipe is not transformed", () => {
  const node = createParagraph([createTextNode("[[|]] in text")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const textNode = para.children[0] as TextNode;
  assertEquals(textNode.value, "[[|]] in text");
});

Deno.test("wiki-links - wiki link with bracketed text preserved", () => {
  const node = createParagraph([
    createTextNode("[[docs]] contains [bracketed] text"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[0] as LinkNode;
  assertEquals(linkNode.url, "/docs/");
  const afterText = para.children[1] as TextNode;
  assertEquals(afterText.value, " contains [bracketed] text");
});

Deno.test("wiki-links - code block avoidance", () => {
  const codeBlock = createCodeBlock("Use [[internal]] links here");
  const para = {
    type: "root",
    children: [
      codeBlock,
      createParagraph([createTextNode("See [[about]] outside")]),
    ],
  };
  runPlugin(para as ASTNode);

  const code = para.children[0] as ASTNode;
  assertEquals(code.type, "code");
  assertEquals(code.value, "Use [[internal]] links here");

  const linkPara = para.children[1] as { children: ASTNode[] };
  assertEquals((linkPara.children[0] as TextNode).value, "See ");
  const linkNode = linkPara.children[1] as LinkNode;
  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/about/");
});

Deno.test("wiki-links - inline code avoidance", () => {
  const inlineCode = createInlineCode("[[internal]]");
  const children: ASTNode[] = [
    createTextNode("Use "),
    inlineCode,
    createTextNode(" for links"),
  ];
  const para = createParagraph(children);
  (children[1] as ASTNode).parent = para;

  runPlugin(para);

  const paraNode = para as { children: ASTNode[] };
  const textNode = paraNode.children[0] as TextNode;
  assertEquals(textNode.value, "Use ");

  const codeNode = paraNode.children[1] as ASTNode;
  assertEquals(codeNode.type, "inlineCode");
  assertEquals((codeNode as { value: string }).value, "[[internal]]");
});

Deno.test("wiki-links - nested code context via parent", () => {
  const codeNode = createCodeBlock("Check [[link]]");
  const root = {
    type: "root",
    children: [codeNode],
  };
  codeNode.parent = root as ASTNode;

  runPlugin(root as ASTNode);

  const code = root.children[0] as ASTNode;
  assertEquals(code.type, "code");
  assertEquals((code as { value: string }).value, "Check [[link]]");
});

Deno.test("wiki-links - handles missing heading gracefully", () => {
  const node = createParagraph([createTextNode("See [[docs#]] for more")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const textNode = para.children[0] as TextNode;
  assertEquals(textNode.value, "See [[docs#]] for more");
});

Deno.test("wiki-links - heading with special characters", () => {
  const node = createParagraph([createTextNode("See [[docs#FAQ's]]")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;
  assertEquals(linkNode.url, "/docs/#faq's");
});

Deno.test("wiki-links - preserves link node title as null", () => {
  const node = createParagraph([createTextNode("[[about]]")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[0] as LinkNode;
  assertEquals(linkNode.title, null);
});

Deno.test("wiki-links - processes deeply nested structure", () => {
  const innerText = createTextNode("[[deep]] link");
  const listItem = { type: "listItem", children: [innerText] };
  const list = { type: "list", children: [listItem] };
  const root = { type: "root", children: [list] };

  (innerText as ASTNode).parent = listItem as ASTNode;
  (listItem as ASTNode).parent = list as ASTNode;
  (list as ASTNode).parent = root as ASTNode;

  runPlugin(root as ASTNode);

  const li = list.children[0] as { children: ASTNode[] };
  const linkNode = li.children[0] as LinkNode;
  assertEquals(linkNode.type, "link");
  assertEquals(linkNode.url, "/deep/");
});

Deno.test("wiki-links - handles multiple paragraphs", () => {
  const para1 = createParagraph([createTextNode("First [[link1]]")]);
  const para2 = createParagraph([createTextNode("Second [[link2]]")]);
  const root = { type: "root", children: [para1, para2] };

  (para1 as ASTNode).parent = root as ASTNode;
  (para2 as ASTNode).parent = root as ASTNode;

  runPlugin(root as ASTNode);

  const p1 = root.children[0] as { children: ASTNode[] };
  const link1 = p1.children[1] as LinkNode;
  assertEquals(link1.url, "/link1/");

  const p2 = root.children[1] as { children: ASTNode[] };
  const link2 = p2.children[1] as LinkNode;
  assertEquals(link2.url, "/link2/");
});

Deno.test("wiki-links - empty node children", () => {
  const node = createParagraph([]);
  runPlugin(node);

  assertEquals(node.type, "paragraph");
});

Deno.test("wiki-links - non-text node is unchanged", () => {
  const node = { type: "heading", value: "Heading", children: [] as ASTNode[] };
  runPlugin(node);

  assertEquals((node as { value: string }).value, "Heading");
});

Deno.test("wiki-links - wiki link with emoji", () => {
  const node = createParagraph([createTextNode("See [[🎯]]")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;
  assertEquals(linkNode.url, "/🎯/");
  assertEquals(linkNode.children[0].value, "🎯");
});

Deno.test("wiki-links - wiki link with numbers", () => {
  const node = createParagraph([createTextNode("Check [[api-v2]]")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;
  assertEquals(linkNode.url, "/api-v2/");
});

Deno.test("wiki-links - wiki link with dashes and underscores", () => {
  const node = createParagraph([
    createTextNode("See [[getting-started_guide]]"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;
  assertEquals(linkNode.url, "/getting-started_guide/");
});

Deno.test("wiki-links - wiki link with slashes in target", () => {
  const node = createParagraph([createTextNode("See [[docs/api]]")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  const linkNode = para.children[1] as LinkNode;
  assertEquals(linkNode.url, "/docs/api/");
});

Deno.test("wiki-links - consecutive wiki links", () => {
  const node = createParagraph([createTextNode("[[a]][[b]][[c]]")]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  assertEquals(para.children.length, 3);
  assertEquals((para.children[0] as LinkNode).url, "/a/");
  assertEquals((para.children[1] as LinkNode).url, "/b/");
  assertEquals((para.children[2] as LinkNode).url, "/c/");
});

Deno.test("wiki-links - mixed content with wiki links and markdown", () => {
  const node = createParagraph([
    createTextNode("**Bold** [[link]] and _italic_"),
  ]);
  runPlugin(node);

  const para = node as { children: ASTNode[] };
  assertEquals((para.children[0] as TextNode).value, "**Bold** ");
  assertEquals(para.children[1].type, "link");
  assertEquals((para.children[2] as TextNode).value, " and _italic_");
});
