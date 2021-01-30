# Build a Micro Static Site With GitHub Pages

## tl;tr

In repository settings, enable GitHub Pages for the `master` branch.

Now you can access your site at `https://your-username.github.io/your-repo-name`

Done. Period.

## How

GitHub Pages will use `README.md` as index page.
And your project probably already have one.
There is no need to write `index.html` or `index.md`.

Also, GitHub Pages will automatically add an "edit on GitHub" link to page footer.
Nice.

## Why

Focus on content, not the site design and configuration.

We use `README.md` and `master` branch.
This makes updating project site easier.
Just update `README.md` without the hassles of sync documentation between `master` and `gh-pages` branches.

## Bonus

Your project may have some additional documentary pages.
They are welcome by GitHub Pages.

For example:

```
README.md
...
docs/
    README.md
    quick-start.md
    install/
        linux.md
        osx.md
        bsd.md
        win.md
```

URL paths will be:

```
/index.html
/docs
/docs/quick-start.html
/docs/install/linux.html
/docs/install/osx.html
/docs/install/bsd.html
/docs/install/win.html
```

## Conclusion

Yes. You can have a site powered by GitHub Page up and running
without writing a single line of
yaml configuration, html template, css, javascript, etc.