# 100% JavaScript Project

[Jordan Hairband][substack] chooses to not include TypeScript definitions in [Tape]:

> No. Typings should never be packaged with individual repos,
> especially because maintainers who don't use typescript
> have no friendly way to keep the typings in sync.
>
> DT or similar is the proper place for types, until JavaScript has them natively.
>
> ...
>
> The tape codebase will not be written in anything but JavaScript.
>
> ...
>
> I would encourage you, however, to submit accurate typings for all the tape versions to DT,
> to benefit all TypeScript users - and if there’s anything short of using TS
> that i can do to make it easier for TS users to use tape, I’d be happy to.

[substack]: https://github.com/ljharb
[Tape]: https://github.com/substack/tape/issues/353

Mentioning TypeScript in README is also [refused]:

> I don’t think that’s necessary.
> A typescript user should already know how to use ts-node with everything if needed,
> and the advice isn’t different with tape than with anything else.
> It’s not incumbent on “every individual non-typescript package” to make typescript easy to use;
> that’s typescript’s task.
>
> ...
>
> ...an alternative without ts-node is to transpile first and test the output.
>
> This is just the sort of thing that you open yourself to
> by making the choice to use “not JavaScript”,
> and it’s not practical for millions of individual JS packages to try to document
> all the caveats you need to know when making that choice.

[refused]: https://github.com/substack/tape/issues/574
