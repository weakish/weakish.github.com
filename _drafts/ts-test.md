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
Being a [100% JavaScript] project, Tape does not have first class TypeScript support though.

[100% JavaScript]: /_drafts/100-percent-js/

## AVA

Like Tape, [AVA] is also minimalistic.
Unlike Tape, AVA ships with TypeScript definitions and run tests concurrently.

[AVA]: https://github.com/avajs/ava
