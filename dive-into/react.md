# A Quick Introduction to React

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

## Hooks

Hooks decouple state related logic from components.
Like components, hooks are just functions, nothing magical:

```javascript
const SimpleReact = (function() {
    let state
    return {
      render(Component) {
        const C = Component()
        C.render()
        return C
      },
      useState(initialValue) {
        state = state || initialValue
        function setState(newValue) {
          state = newValue
        }
        return [state, setState]
      }
    }
})()

const useState = SimpleReact.useState
const render = SimpleReact.render

function useCountCharacters(str) {
    const [text, setText] = useState(str)
    const len = text.length
    return [len, setText]
}

function Component() {
    const [len, setLen] = useCountCharacters("")
    return {
      type: txt => setLen(txt),
      render: () => console.log({ len })
    }
}

let App = render(Component) // { len: 0 }
App.type('hello')
App = render(Component) // { len: 5 }
```

The real React will re-render components on state changes automatically.
And there are other kind of hooks, e.g. `useEffect` for side-effects, triggered on state changes.
Also, the real React can handle multiple hooks, which can be considered as [an array of hooks][hook-array].
Whatever, the above naive implementation captures the essence of React Hooks.

[hook-array]: https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e

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

Among those projects, I checked the five projects written in TypeScript:

- [jsxstyle] and [react-free-style] are inline style systems. I do not like inline style systems.
- [freestyler]'s APIs are complex. There are too many choices.
- Both [stylable] and [typestyle] provide a type safe styling language.

[css-in-js]: https://michelebertoli.github.io/css-in-js/
[jsxstyle]: https://github.com/jsxstyle/jsxstyle
[react-free-style]: https://github.com/blakeembrey/react-free-style
[freestyler]: https://github.com/streamich/freestyler
[stylable]: https://stylable.io/
[typestyle]: https://typestyle.github.io/

stylable has a syntax similar to CSS, while typestyle just uses object literals (no custom AST transform).
As I said before, I want to define styles *in TypeScript*, thus I pick typestyle.

## Alternative Implementations

1. [Preact] is the most popular alternative implementation.
   It is small (3KB gzipped) and fast.
   However, to leverage many React libraries, `preact/compat` is required.
   This compatibility layer is slow.

2. [Inferno] is a faster alternative implementation.
   Unlike Preact, it is not that obsessed about the size (but still small).
   Like Preact, its compatibility layer `inferno-compat` has extra overhead.
   Also, hooks is [not supported yet].

3. [Nerv] is yet another small alternative implementation.
   It features compatibility with IE 8 and a more identical React API.
   Thus there is no `nerv-compat`.

[Preact]: https://preactjs.com/
[Inferno]: https://infernojs.org/
[Nerv]: https://github.com/NervJS/nerv
[not supported yet]: https://github.com/infernojs/inferno/issues/1453

## References

1. [Learn React in 10 tweets](https://twitter.com/chrisachard/status/1175022111758442497)
2. [Deep dive: How do React hooks really work?](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/)
