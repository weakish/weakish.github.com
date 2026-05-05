import lume from "lume/mod.ts";
import sri from "lume/plugins/sri.ts";
import feed from "lume/plugins/feed.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import jsx from "lume/plugins/jsx.ts";
import pagefind from "lume/plugins/pagefind.ts";
import remark from "lume/plugins/remark.ts";
import resolve_urls from "lume/plugins/resolve_urls.ts";
import rehypeStarryNight from "https://cdn.jsdelivr.net/npm/rehype-starry-night@2.2.0/+esm";
import { all } from "https://cdn.jsdelivr.net/npm/@wooorm/starry-night@3.6.0/+esm";
import rehypeExtractExcerpt from "https://esm.sh/rehype-extract-excerpt@0.3.1";
import rehypePicture from "https://esm.sh/rehype-picture@5.0.0";
import rehypeImgSize from "https://esm.sh/rehype-img-size@1.0.1";
import purgecss from "lume/plugins/purgecss.ts";
import sitemap from "lume/plugins/sitemap.ts";
import { getGitDate } from "lume/core/utils/date.ts";
import favicon from "lume/plugins/favicon.ts";
import transformImages from "lume/plugins/transform_images.ts";
import textLoader from "lume/core/loaders/text.ts";
import GeminiEngine from "./gemini.ts";
import { customWikiLinks } from "./custom-wiki-links.ts";
import readme from "./plugins/readme/mod.ts";
const site = lume({
  location: new URL(Deno.env.get("MIRROR_LOCATION") ?? "https://mmap.page"),
});

const siteHostname = site.options.location.hostname;

site.loadPages([".gmi"], { loader: textLoader, engine: new GeminiEngine() });

site.preprocess([".html"], (pages) => {
  for (const page of pages) {
    page.data.siteHostname = siteHostname;
    const { entry } = page.src;
    page.data.lastmod = getGitDate("modified", entry.src);
    // `git log --diff-filter=A --follow` yields no output for files where the latest commit had a merge conflict.
    // See also:
    // lumeland/lume#667
    // https://stackoverflow.com/questions/2390199/finding-the-date-time-a-file-was-first-added-to-a-git-repository#comment118580024_25633731
    page.data.date = getGitDate("created", entry.src) ??
      getGitDate("modified", entry.src);
  }
});

site.use(sri());
site.use(nunjucks());
site.use(jsx());
site.use(pagefind());
site.use(transformImages());
site.add([".png", ".jpg"]);
site.use(remark({
  remarkPlugins: [
    customWikiLinks,
  ],
  rehypePlugins: [[
    rehypeStarryNight,
    {
      grammars: all,
    },
  ], [
    rehypeImgSize,
    {
      dir: ".",
    },
  ], [
    rehypeExtractExcerpt,
    {
      name: "title",
      tagName: "h1",
    },
  ], [
    rehypePicture,
    {
      jpg: { avif: "image/avif" },
      png: { avif: "image/avif" },
    },
  ]],
}));
site.use(resolve_urls());
site.use(readme());

site.use(favicon());
site.use(purgecss());

site.copy("LICENSE");
site.copy("humans.txt");
site.copy("llms.txt");
if (Deno.env.get("MIRROR_LOCATION")) {
  site.copy("404-github.html", "404.html");
} else {
  site.copy("404-netlify.html", "404.html");
}
site.copy("teapot");
site.copy("dive-into/android");
site.copy("dive-into/base64");
site.copy("uses/lume");
site.copy("uses/obsidian");
site.copy("fun/exodia");
site.copy("StutteringTalkaholic");
site.copy("dapi/ai");
site.copy("dapi/avoid-html");
site.copy("dapi/daoliangmou");
site.copy("dapi/learn-programming");
site.copy("dapi/bole");
site.copy("dapi/no-blog");
site.copy("dapi/not-a-blog");
site.copy("dapi/packaging");
site.copy("dapi/redman");
site.copy("dapi/shath-yar");
site.copy("dapi/shuoba-xizang");
site.copy("dapi/wash-clothes");
site.copy("dapi/windows-handbook");
site.copy("dapi/zhuzhu");
site.copy("fun/heart");
site.copy("StutteringTalkaholic/hardening");
site.copy("StutteringTalkaholic/ruby");
site.use(sitemap({
  lastmod: "=lastmod",
}));

const feedOptions = {
  query: "type=article",
  items: {
    updated: "=lastmod",
  },
};
site.use(feed({
  ...feedOptions,
  info: {
    title: "Recent Memories Mapped to Web Pages",
    subtitle: "Recent Updates from mmap.page",
  },
  output: "/rss.xml",
  limit: 15, /* RSS 0.91 allows no more than 15 items */
}));
site.use(feed({
  ...feedOptions,
  info: {
    title: "Memories Mapped to Web Pages",
    subtitle: "All posts from mmap.page",
  },
  output: "/feed.json", /* jsonfeed.org uses feed.json */
  limit: Number
    .MAX_SAFE_INTEGER, /* number of items in a feed is unlimited according to json feed spec */
}));

export default site;
