A Quick Introduction to React in TypeScript
===========================================

## Hello World

```tsx
import React, { ReactElement } from "react"
import ReactDOM from "react-dom"


type HelloProps = { readonly name: string }

function Hello({ name }: HelloProps): ReactElement<HelloProps> {
  return <button>Hello {name}!</button>
}

const helloWorld: ReactElement<HelloProps> = <Hello name="World" />

const rootElement: HTMLElement = document.getElementById("root")
ReactDOM.render(helloWorld, rootElement)
```

## React Components

The `Hello` function is a React component,
which receives an object containing properties,
and returns a ReactElement.
Here I do not plan to change the value of the `name` property,
so I annotates it as readonly.
But these properties can be mutable.
ReactElements can be considered as extensible html elements,
or some content to be rendered.
A react component may return null for conditional rendering.

## JSX

`<button>Hello {name}!</button>` and `<Hello name="World" />` are JSX,
an extension to JavaScript, or a DSL to express DOM elements.
TypeScript has excellent support for JSX. Thus JSX can be considered as typed HTML template expressions.

Component names such as `Hello` begin with an uppercase letter,
while intrinsic HTML elements such as `button` begin with a lowercase letter.
Certain attributes in HTML are renamed to resolve conflicts with TypeScript keywords.
For example, the `class` attributes are renamed to `className` in JSX.

A component cannot directly return multiple elements.
To return multiple elements, nest them inside a `div` element, then return that `div`.
Sometimes returning an div element is not possible.
For example, nesting multiple `<td>` elements in `div` results in invalid HTML.
And sometimes, you just do not want to wrap them inside a `div` element.
Under such conditions, you can wrap them inside a `<React.Fragment>`,
which can be considered as a seamless div element.

`<React.Fragment>` accepts an optional `key` attribute,
which is its only acceptable attribute.
For example:

```tsx
// type annotations omitted for brevity
function Glossary({ items }) {
  return (
    <dl>
      {items.map(item => (
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dt>
        </React.Fragment>
      ))}
    </dl>
  )
}
```

`key` is a special attribute for React to identify member element in a list.
It helps React to detect which members have changed, added, or removed.

JSX is syntax sugar for calling `React.createElement`,
for example, `<Hello name="World" />` is equivalent to:

```js
React.createElement(Hello, { name: "World" });
```

So JSX is optional, you can use React without JSX.

## Styling

React does not have an opinion about how styles are defined.
You can define styles in separate `*.css` files.
However, I prefer to define styles in TypeScript than CSS.
You can check [this comparison of CSS-in-JS][css-in-js].
Again, there are a lot of choices.

Among those projects, I pick the five projects written in TypeScript:

- [jsxstyle] and [react-free-style] are inline style systems. I do not like inline style systems.
- [freestyler]'s APIs are complex. There are too many choices.
- Both [stylable] and [typestyle] provide a type safe styling language.

[css-in-js]: https://michelebertoli.github.io/css-in-js/
[jsxstyle]: https://github.com/jsxstyle/jsxstyle
[react-free-style]: https://github.com/blakeembrey/react-free-style
[freestyler]: https://github.com/streamich/freestyler
[styleable]: https://stylable.io/
[typestyle]: https://typestyle.github.io/

stylable has a syntax similar to CSS, while typestyle just uses object literals (no custom AST transform).
As I said before, I want to define styles *in TypeScript*, thus I pick typestyle.