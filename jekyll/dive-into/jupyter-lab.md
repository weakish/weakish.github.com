# JupyterLab Guide

JupyterLab is the next generation UI of Jupyter Notebook (formly known as IPython Notebook).

## Installation

JupyterLab can be installed via `conda`, `pip`, and `pipenv`.

For example, to install with `conda`:

```sh
conda install -c conda-forge jupyterlab
```

Once installed, you can start it with:

```sh
jupyter lab
```

To shutdown JupyterLab, first shutdown all kernels while `Kernel` menu,
then type `ctrl-c`.

## Notebooks

Jupyter notebooks combines:

1. live runnable code cells
2. text cells (Markdown, LaTeX equations, images, interactive visualizations)

Multiple view(tabs) can be opened for the same notebook,
with synced content.

The blue collapser button on left of each cell can trigger collapsing and expanding cells.

Right-click on a notebook and select "New Console for Notebook" can attach to the notebook kernel.
This provides a log of all computations done in the kernel (in the order in the order in which they were done),
and a place to interactively inspect kernel state without changing the notebook.

### Raw HTML

IPython kernel provides a variety of convenience classes for displaying rich output, including HTML:


```python
from IPython.display import display, HTML
display(HTML('<del>Hello World</del>'))
```


<del>Hello World</del>


or


```python
from IPython.display import display
display({'text/html': '<del>Hello World</del>'}, raw=True)
```


<del>Hello World</del>


MIME types supported by default:

- document: `text/markdown`, `text/html`, `text/latex`, `application/vdom.v1+json` (Virtual DOM)
- images: `image/bmp`, `image/gif`, `image/jpeg`, `image/png`, `image/svg+xml`
- data: `application/json`, `application/vnd.vega.v2+json`, `application/vnd.vegalite.v1+json`
- other: CSV (as `.csv` files, no MIME type), PDF (as `.pdf` files, with `application/pdf` MIME type, view only)

Other Jupyter kernels offer similar APIs.

## Keymap

Keyboard shortcuts can be viewed in menu, context menu, and command palette (Commands tab of sidebar).

Keyboard shortcut for command palette: `Ctrl+Shift+c`

### Code Cell/Console

- `Tab`: complete.
- `Shift+Tab`: tooltip.
- `Shift+Enter`: run code.

### Image File Viewer

- `+` and `-`: zoom
- `[` and `]`: rotate
- `H` and `V`: flip horizontally/vertically
- `I`: invert the colors
- `0`: reset

### Mouse

Besides keyboard, mouse is also useful.
Drag and drop cells within one notebook to rearrange them;
drag and drop cells within notebooks to copy content;
drag and drop tabs to arrange their layout.

## Extensions

JupyterLab extensions are npm packages.

To install extensions, first install nodejs.
For example, via `conda`:

```sh
conda install -c conda-forge nodejs
```

Then use `jupyter labextension` to manage extensions,
via invoking subcommands like `list`, `install`/`uninstall`, `enable`/`unable`.

## Tools and Services

### nbdime

[nbdime](https://github.com/jupyter/nbdime) provides tools for diffing and merging of [Jupyter Notebooks](https://jupyter-notebook.readthedocs.io).

- `nbdiff` compare notebooks in a terminal-friendly way
- `nbmerge` three-way merge of notebooks with automatic conflict resolution
- `nbdiff-web` shows you a rich rendered diff of notebooks
- `nbmerge-web` gives you a web-based three-way merge tool for notebooks
- `nbshow` present a single notebook in a terminal-friendly way

### nbconvert

[nbconvert](https://nbconvert.readthedocs.io) allows you to convert a Jupyter .ipynb notebook document file into another static format including HTML, LaTeX, PDF, Markdown, reStructuredText, and more.

[nbviewer](https://nbviewer.jupyter.org) is a free web service based on `nbconvert` to share static html versions of notebook files.

### Binder

[Binder](https://mybinder.org) is a free web service to turn a GitHub repo into a collection of interactive notebooks:

1. Enter a url to a GitHub repo of Jupyter notebooks.
2. Binder builds a Docker image for the repository, based on `requirements.txt` or `environment.yml` in repository's root directory.
3. Binder launches a JupyterHub server. It provides a reusable/shareable link to live repository.

<i>This guide itself is authored in JupyterLab.</i>
