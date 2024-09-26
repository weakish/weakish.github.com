import lume from "lume/mod.ts";
import liquid from "lume/plugins/liquid.ts";
import jsx from "lume/plugins/jsx.ts";
import pagefind from "lume/plugins/pagefind.ts";
import remark from "lume/plugins/remark.ts";
import resolve_urls from "lume/plugins/resolve_urls.ts";
import rehypeStarryNight from "https://esm.sh/@microflash/rehype-starry-night@2.1.1";
import rehypeExtractExcerpt from "https://esm.sh/rehype-extract-excerpt@0.3.1"
import rehypePicture from "https://esm.sh/rehype-picture@5.0.0";
import rehypeImgSize from "https://esm.sh/rehype-img-size@1.0.1";
import sitemap from "lume/plugins/sitemap.ts";
import favicon from "lume/plugins/favicon.ts";
import transformImages from "lume/plugins/transform_images.ts";
import textLoader from "lume/core/loaders/text.ts";
import GeminiEngine from "./gemini.ts";

const site = lume({
  location: new URL("https://mmap.page"),
});
site.copyRemainingFiles();

site.loadPages([".gmi"], { loader: textLoader, engine: new GeminiEngine() });

site.ignore("render.yaml");
site.use(liquid());
site.use(jsx());
site.use(pagefind());
site.use(transformImages());
site.use(remark({
  rehypePlugins: [rehypeStarryNight, [rehypeImgSize, { dir: "." }], [
    rehypeExtractExcerpt,
    {
      name: "title",
      tagName: "h1",
    },
  ], [rehypePicture, {
    jpg: { avif: "image/avif" },
    png: { avif: "image/avif" },
  }]],
}));
site.use(resolve_urls());
site.use(sitemap());
site.use(favicon());

export default site;
