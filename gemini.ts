import { Engine } from "lume/core/renderer.ts";
import { buffer } from "https://esm.sh/dioscuri@1.3.0";

export default class GeminiEngine implements Engine {
  render(content: string, data?: Record<string, unknown>, filename?: string) {
    return this.renderSync(content, data, filename);
  }

  renderSync(content: string, _data?: Record<string, unknown>, _filename?: string) {
    return buffer(content);
  }

  addHelper() {}

  deleteCache() {}
}
