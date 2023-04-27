Preact Signal and Svelte
========================

Compared to Svelte Reactive Blocks, Preact Signal feels more verbose but less surprising to me.

Svelte advertises itself as bringing reactivity to JavaScript itself:

```svelte
<script>
	let x = 0
	let y = 0
	$: total = x + y
</script>

<div>
<p>{x} + {y} = {total}</p>
<button on:click={() => x++}>Increase X</button><br />
<button on:click={() => y++}>Increase Y</button>
</div>
```

Brief. Short. And except for `$:`, every token is intuitive.

In the above code, `$:` means `total` depends on the value of `x` and `y`.
Thus, when either button is pressed, the `{total}` part will be rerendered automatically.

However, in the following code sample, `total` will only get updated when `x` changes, *not* when `y` changes!

```js
function yPlusAValue(value) {
  return value + y;
}

$: total = yPlusAValue(x);
```

This surprising behavior is because the Svelte compiler is not smart enought to figure out that yPlusAValue involves the value of`y`.
As [Svelte documentation][svelte-doc] mentioned:

> reactive blocks are ordered via simple static analysis at compile time,
> and all the compiler looks at are the variables that are assigned to and used within the block itself,
> not in any functions called by them.

[svelte-doc]: https://svelte.dev/docs#component-format-script-3-$-marks-a-statement-as-reactive

Now, let's port this to Preact Signal:

```js
import { render } from "preact";
import { useSignal, useComputed } from "@preact/signals";

function Adder() {
	const x = useSignal(0);
	const y = useSignal(0);
	const total = useComputed(() => x.value + y.value)
  return (
    <div>
      <p>{x} + {y} = {total}</p>
      <button onClick={() => x.value++}>Increase X</button><br />
  		<button onClick={() => y.value++}>Increase Y</button>
	</div>
  );
}

render(<Adder />, document.getElementById("app"));
```

It is a bit more verbose than Svelte but still clean.[^1]
Most importantly, it also works with function calls:

```js
function yPlusAValue(s) {
  return s.value + y.value;
}
const total = useComputed(() => yPlusAValue(x))
```
[^1]: At least cleaner than `useState`.

