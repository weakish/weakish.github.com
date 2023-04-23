import lume from "lume/mod.ts";
import liquid from "lume/plugins/liquid.ts";
import pagefind from "lume/plugins/pagefind.ts";
import remark from "lume/plugins/remark.ts";
import resolve_urls from "lume/plugins/resolve_urls.ts";
import sitemap from "lume/plugins/sitemap.ts";

const site = lume({
  location: new URL("https://mmap.page"),
});
site.includes([".html"], "/_layouts/");
site.copyRemainingFiles();

site.use(liquid());
site.use(pagefind());
site.use(remark());
site.use(resolve_urls());
site.use(sitemap());

export default site;
