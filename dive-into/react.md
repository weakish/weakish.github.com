A Quick Introduction to React in TypeScript
===========================================

## Hello World

```tsx
import React from "react"
import ReactDOM from "react-dom"


type HelloProps = { readonly name: string }

// React components are just functions.
// Component names begin with an uppercase letter,
// while intrinsic HTML elements begin with a lowercase letter.
function Hello({ name }: HelloProps): ReactElement<HelloProps> {
  // This is JSX, an XML like syntax to express DOM elements.
  return <button>Hello {name}!</button>
}

const helloWorld: ReactElement<HelloProps> = <Hello name="World" />

const rootElement: HTMLElement = document.getElementById("root")
ReactDOM.render(helloWorld, rootElement)
```