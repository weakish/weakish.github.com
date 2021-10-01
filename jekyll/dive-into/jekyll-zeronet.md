# Deploy Jekyll Site to ZeroNet

## Basic Setup

A basic setup is mostly straightforward.
The only thing to pay attention to is avoiding broken links.

Typically, the jekyll site will be deployed to `https://some.domain.example` (root path) and `https://127.0.0.1:43110/some-zite-address/` (with zite address as the preceding path).
Thus if not careful, there will be broken links on your clearnet site or/and ZeroNet site.

As a rule of thumb, keep all internal links within the page content (markdown files) as relative to current path links.
For example, the homepage of this site links to this page as `[Deploy Jekyll Site to ZeroNet](dive-into/jekyll-zeronet/)`.
Relative to current path links work both under `https://some.domain.example` and `https://127.0.0.1:43110/some-zite-address/`.

For links in page templates, you have several options:

1. Keep all pages in one directory, thus relative to current path links can be used in page templates.

2. Use different templates for pages under different directories, or at least pages under different depth of directories.
This also allows for relative to current path links in page templates.

3. If your site may have arbitrary levels of directories and you want to use just one template for them all, then you can choose a ZeroNet first approach, using your zite address as the base path of your clearnet site.
For example, if your zite address is `16XMwj6YRNqRHWbmSD8oxYUZCKfM1uzwP9` and clearnet site domain is `mmap.page`, then you can host your clearnet site under `https://mmap.page/16XMwj6YRNqRHWbmSD8oxYUZCKfM1uzwP9`. This way, you can use relative to document root links in page templates, such as `/16XMwj6YRNqRHWbmSD8oxYUZCKfM1uzwP9/assets/css/style.css`.

4. You can also use absolute links via template variable in page templates.
First, you define the site variable `url` as your clearnet url, e.g. `https://mmap.page`.
Now comes the tricky part.
Jekyll allows any value for the site url variable.
Thus you can specify it as `/zite-address` for ZeroNet deployment.
For example, `url: /16XMwj6YRNqRHWbmSD8oxYUZCKfM1uzwP9`.
Note that you should not use `https://127.0.0.1:43110/some-zite-address` here, since other users may bind a different IP or port for their ZeroNet service.
Then you can use \{\{site.url\}\} to construct absolute links in page templates,
e.g. \{\{site.url\}\}/assets/css/style.css.

## Multiple Configurations

Jekyll can accept multiple configuration files.
Thus if most of your configurations are the same for clearnet and ZeroNet, you can do most configurations in `_config.yml`, then append or override some configurations in `_zeronet.yml` or `_clearnet.yml`.
For example, my `_zeronet.yml` only contains one line `url: /16XMwj6YRNqRHWbmSD8oxYUZCKfM1uzwP9` and I run the following command to generate a static site for ZeroNet deployment.

```sh
bundle exec jekyll build --config _config.yml,_zeronet.yml -d /path/to/ZeroNet/data/16XMwj6YRNqRHWbmSD8oxYUZCKfM1uzwP9/
```

## Conditional Content

You can use conditional expressions in Jekyll templates to display different content on clearnet and ZeroNet.

For example, to display a greyscale version of ZeroNet logo on clearnet, while keeping the logo colorful on ZeroNet:

{% raw %}
```liquid
{% assign leading = site.url | slice: 0 %}
{% if leading == '/' %}
    {% assign zeronet_logo = 'zeronet_logo.svg' %}
{% else %}
    {% assign zeronet_logo = 'zeronet_grey.svg' %}
{% endif %}
<img src="{{ site.url }}/assets/images/{{ zeronet_logo }}" alt="ZeroNet Logo" width="32" height="32">
```
{% endraw %}

Here I chose the fourth option (`site.url`) mentioned in the "Basic Setup" section,
thus I decide if it is on ZeroNet by checking if `site.url` starts with `/`.
If you use other options, you can define an additional boolean option on your `_zeronet.yml` or `_clearnet.yml`,
and ues it to detect the deployment environment.

## RSS

Unfortunately, RSS does not like relative links.
If your sites need RSS, then you have to replace relative links with absolute ones in templates.
Since the Liquid template language Jekyll uses is quite limited,
I chose to use **relative to document root links** in page content, which makes it easier to finding these links via Liquid template languages (just looks for `<a href="/` and `<img src="/>`).

In RSS template, I implemented something like this:

{% raw %}
```liquid
{% assign absolutelink = '<a href="' | append: site.url | append: '/' %}
{% assign absoluteimglink = '<img src=' | append: site.url | append: '/' %}
<description>{{ page_content | markdownify | replace: '<a href="/', absolutelink | replace: '<img src="/', absoluteimglink | xml_escape}}</description>
```
{% endraw %}

I also implemented similar logic in default page template to avoid broken links since now relative to document root links are used.

Alternatively, you can write some lengthy liquid template processing logic or write a post-process script in other programming languages to find and replace all relative links.
This way, you can keep using relative to current path in page content and keep the default page template intact.

