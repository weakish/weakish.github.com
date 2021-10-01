# Dive into Cycle.js

## Core Abstraction

[Cycle.js] has a simple core abstraction:
an application is a pure `main()` function,
whose input (*sources*) and output (*sinks*) are effects of the external world,
managed by plugins (*drivers*).

[Cycle.js]: https://cycle.js.org/

![dataflow]

[dataflow]: https://cycle.js.org/img/cycle-nested-frontpage.svg "source: cycle.js.org"

The primitives used inside the `main` function is reactive streams.
Thus Cycle.js applications are entirely `this` free and have nothing like `setState()` or `update()`.

The separation between function and drivers allows for great extensibility (easy to swap drivers) and testability (easy to test pure functions).

This abstraction also allows for awesome composablity:
the main function of every Cycle.js application is also a reusable function in main function of another Cycle.js application.
Sources and sinks are not only the interface between main function and the drivers, but also the interface between a child component and its parent.

![nested-components]

[nested-components]: https://cycle.js.org/img/nested-components.svg

## Example

The core API of Cycle.js is `run(main, drivers)`.

```typescript
import {Stream} from "xstream";
import {run} from '@cycle/run'
import {div, label, input, hr, h1, makeDOMDriver, DOMSource, VNode} from '@cycle/dom'

interface Sources {
  Dom: DOMSource
}

interface Sinks {
  Dom: Stream<VNode>
}


function main(sources: Sources): Sinks {
  const input$ = sources.Dom.select('.field').events('input')

  const name$ = input$.map(ev => (ev.target as HTMLInputElement).value).startWith('')

  const vdom$ = name$.map(name =>
    div([
      label('Name:'),
      input('.field', {attrs: {type: 'text'}}),
      hr(),
      h1(`Hello ${name}`),
    ])
  )

  return { Dom: vdom$ }
}

run(main, { Dom: makeDOMDriver('#app-container') })
```

The above code is adapted from the JavaScript hello world sample on the frontpage of  [Cycle.js] official website. I use TypeScript instead.