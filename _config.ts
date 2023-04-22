import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import liquid from "lume/plugins/liquid.ts";
import pagefind from "lume/plugins/pagefind.ts";
import remark from "lume/plugins/remark.ts";
import resolve_urls from "lume/plugins/resolve_urls.ts";
import sitemap from "lume/plugins/sitemap.ts";
import windi_css from "lume/plugins/windi_css.ts";

const site = lume();

site.use(jsx());
site.use(liquid());
site.use(pagefind());
site.use(remark());
site.use(resolve_urls());
site.use(sitemap());
site.use(windi_css());

export default site;
