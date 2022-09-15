# A Brief Comparison of Popular Testing Frameworks 

## Jest

[Jest] parallelizes tests, so running tests is faster.
It aims to be configuration free on most JavaScript projects.
The Jest transformer [ts-jest] makes Jest configuration free on TypeScript projects. 

[Jest]: https://jestjs.io/
[ts-jest]: https://github.com/kulshekhar/ts-jest

Personally, I dislike Jest's natural language like syntax:

```js
expect(sum(1, 2)).toBe(3)
```

Tests are programs.
Writing tests is programming.
Therefore, this syntax does not feel nature as a program.

[Serge Zaitsev][zserge] put it concisely:

> See how Go language made this - they simply give you a way to fail your current test.
> The rest if up to you.
> You have the whole programming language with conditionals, loops, functions after all!

[zserge]: https://zserge.com/posts/minimal-testing/

By the way, I never feel the natural scrolling of macOS is natural on a laptop.

## Mocha

[Mocha] shines on its flexibility.
It can be configured to fit in the workflow of different projects.

[Mocha]: https://mochajs.org/

However, the cost of its flexibility is configuration overhead.

Mocha runs tests serially by default.
The parallel mode is introduced in Mocha, though.

## Tape

Unlike Jest and Mocha, [Tape] is minimalistic.

[Tape]: https://github.com/substack/tape

Using Tape under TypeScript projects is simple.
Just run `ts-node node_modules/.bin/tape test/**/*.ts` instead of `tape test/**/*.js`.
Being a [100% JavaScript] project, Tape does not have [first class TypeScript support] though.

[100% JavaScript]: /_drafts/100-percent-js/
[first class TypeScript support]: https://github.com/substack/tape/issues/577

## AVA

Like Tape, [AVA] is also minimalistic.
Unlike Tape, AVA ships with TypeScript definitions and run tests concurrently.

[AVA]: https://github.com/avajs/ava

## Tap

Like Tape and AVA, [Tap] has a minimal API surface.
In fact, the test syntax of Tape is inspired by Tap.
Like AVA, Tap supports running tests in parallel.

[Tap]: https://node-tap.org/

Currently, the coverage feature of Tap is [broken][807] on TypeScript ESM projects.
As a workaround, I use [c8] for coverage instead.
Also, `node --loader=ts-node/esm` should be used
instead of the built-in TypeScript support of Tap.
Here is the corresponding configuration in `package.json`:

```json
"scripts": {
  "test": "NODE_NO_WARNINGS=1 c8 tap"
},
"tap": {
  "node-arg": [
    "--loader=ts-node/esm"
  ],
  "coverage": false,
  "ts": false
}
```

[807]: https://github.com/tapjs/node-tap/issues/807
[c8]: https://www.npmjs.com/package/c8

My project is tiny, thus I do not use the parallel mode.
If you have a lot of tests, you may replace `c8 tap` with something such as `c8 tap -j4`.

## Deno Test

Deno offers a built-in test runner for TypeScript projects targeted at browser and deno.
The deno release, a single executable, ships `deno test`, which also support coverage.
And there is a simple assertion library in the standard library.

Since the [Testing] chapter of the Deno manual is clearly written,
I will not talk about it more here.

[Testing]: https://deno.land/manual@v1.25.2/testing

