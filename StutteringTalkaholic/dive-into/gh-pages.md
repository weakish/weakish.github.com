Build a Site With GitHub Pages in a Simple Way
==============================================

Focus on content, not the site design and configuration.

## README as Index Page

No need to write `index.html` or `index.md`.
GitHub Pages will just use `README.md` as index page.

## Use `master` Branch

In repository settings, enable GitHub Pages for the `master` branch.

For a project site, a `README.md` is sufficient.
This also makes updating project site easier.
Just update `README.md` without the hassles of sync documentation between `master` and `gh-pages` branches.

For a personal site of articles and notes,
just directly write the markdown files.
For example:

```
README.md
contact.md
python/
    persistence.md
vim/
    completion.md
```

URLs will be:

```
/index.html
/contact.html
/python/persistence.html
/vim/completion.html
```

And GitHub Pages will automatically add a link to `index.html` at the header
of every page (except for `index.html` itself),
and an edit link (fork and request pull within browser)
to the source markdown file in the repository.

## Conclusion

Yes. You can have a site powered by GitHub Page up and running
without writing a single line of
yaml configuration, html template, css, javascript, etc.

In fact, this site is built in a similarly approach.
I did wrote three lines of configuration, though.

```yaml
# _config.yml

plugins:
  # So I can wrote `@username` in markdown files.
  - jekyll-mentions
  # Sitemap for search engines.
  - jekyll-sitemap

# Turn `/contact.html` to `/contact/`.
permalink: /:title/
```
