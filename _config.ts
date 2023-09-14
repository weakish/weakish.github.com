import lume from "lume/mod.ts";
import liquid from "lume/plugins/liquid.ts";
import pagefind from "lume/plugins/pagefind.ts";
import remark from "lume/plugins/remark.ts";
import resolve_urls from "lume/plugins/resolve_urls.ts";
import rehypeStarryNight from "https://esm.sh/@microflash/rehype-starry-night";
import rehypeExtractExcerpt from "https://esm.sh/gh/weakish/rehype-extract-excerpt@tagName";
import rehypePicture from "https://esm.sh/rehype-picture@5";
import rehypeImgSize from "https://esm.sh/rehype-img-size@1.0.1";
import sitemap from "lume/plugins/sitemap.ts";
import imagick from "lume/plugins/imagick.ts";

const site = lume({
  location: new URL("https://mmap.page"),
});
site.includes([".html"], "/_layouts/");
site.copyRemainingFiles();

site.use(liquid());
site.use(pagefind());
site.use(imagick());
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

export default site;
