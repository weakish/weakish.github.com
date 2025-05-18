# My Lume Setup

This site was hosted at [GitHub Pages][] before.
Thus, I have used [Jekyll][] for many years.
I have considered migrating to other static site generators several times.

[GitHub Pages]: https://pages.github.com
[Jekyll]: https://jekyllrb.com

But I'd like to keep the source of the content in the same way:

1. I'd like to use mostly standard GFM, which renders nicely on GitHub and is compatible with a lot of programs.

    This rules out a lot of static site generators without writing a customized Markdown reader.
    For example, the default Markdown reader of [Pelican][] uses `<{filename}../article.md>` for internal links,
    and its [Pandoc plugin][pelican-pandoc] expects all Markdown files to start with a YAML header.

2. I prefer a content first directory structure, not nesting Markdown files under a specific directory.

    This again rules out a lot of static site generators.
    For example, [Hugo][] assumes a `content` directory.

3. I do not want JavaScript at the client side.

[Pelican]: https://docs.getpelican.com/en/latest/content.html#linking-to-internal-content
[pelican-pandoc]: https://github.com/pelican-plugins/pandoc-reader#specifying-file-metadata
[Hugo]: https://gohugo.io/getting-started/configuration/#contentdir

As far as I know, the static site generators satisfying these needs are Jekyll, [Eleventy][], and [Lume][].

[Eleventy]: https://www.11ty.dev
[Lume]: https://lume.land

Eleventy, as a meta static site generator, allows customizing almost everything,
while Lume is more out of the box.

Finally I migrated to Lume, allowing me to stop writing Liquid templates,
which is my main pain point for Jekyll.

The migration process was easier than I thought, since Lume also supported Liquid templates.
The only thing I find missing is using `README.md` as the index page.
This nice feature of Jekyll makes browsering the Markdown files more convenient on GitHub.
However, customizing destination URL is easy in Lume.
I wrote [a trivial `url` function][url] in configuration to implement this feature.

[url]: https://github.com/weakish/weakish.github.com/commit/1d8a2f4b7682cf246cb8e2d3996b5bb66c431240

However, I am not happy with Lume 3.0,
which introduces a lot of breaking changes for subjectively better redesign.
Particularly, it dropped the support for Liquid templates, which requires me to either maintain a Liquid plugin myself or migrate existing Liquid templates to something like JSX.
However, I have motivation to do neither.
So I let GitHub Copilot to rewrite the Liquid templates to Nunjucks which has a similar syntax to Liquid.
It turns out GitHub Copilot is smart enough for this task.
However, it seems GitHub Copilot is unfamiliar with Lume
so it does not know [YAML front matter is supported in templates for Lume][Lume templates]
and also it is necessary to use the safe filter to avoid escaping HTML tags,
which liquid does not escape by default.

[Lume templates]: https://lume.land/docs/creating-pages/layouts/#layout-data "Lume documentation on layout data"