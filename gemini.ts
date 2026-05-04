import { Engine } from "lume/core/renderer.ts";
import { buffer } from "https://esm.sh/dioscuri@1.3.0";
import rehypeStarryNight from "https://cdn.jsdelivr.net/npm/rehype-starry-night@2.2.0/+esm";
import { all } from "https://cdn.jsdelivr.net/npm/@wooorm/starry-night@3.6.0/+esm";
import { unified } from "https://esm.sh/unified@11.0.5?target=es2022";
import rehypeParse from "https://esm.sh/rehype-parse@9.0.1?target=es2022";
import rehypeStringify from "https://esm.sh/rehype-stringify@10.0.1?target=es2022";

export default class GeminiEngine implements Engine {
  render(content: string, data?: Record<string, unknown>, filename?: string) {
    return this.renderComponent(content, data, filename);
  }

  async renderComponent(content: string, _data?: Record<string, unknown>, _filename?: string) {
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
