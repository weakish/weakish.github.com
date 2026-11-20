import { Engine } from "lume/core/renderer.ts";
import { buffer } from "npm:dioscuri@1.3.0";
import rehypeStarryNight from "npm:rehype-starry-night@2.2.0";
import { all } from "npm:@wooorm/starry-night@3.10.0";
import { unified } from "npm:unified@11.0.5";
import rehypeParse from "npm:rehype-parse@9.0.1";
import rehypeStringify from "npm:rehype-stringify@10.0.1";

export default class GeminiEngine implements Engine {
  render(content: string, data?: Record<string, unknown>, filename?: string) {
    return this.renderComponent(content, data, filename);
  }

  async renderComponent(
    content: string,
    _data?: Record<string, unknown>,
    _filename?: string,
  ) {
    const html = buffer(content);

    const result = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeStarryNight, { grammars: all })
      .use(rehypeStringify)
      .process(html);

    return result.toString();
  }

  addHelper() {}

  deleteCache() {}
}
