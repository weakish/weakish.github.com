# When the Agent Ports Too Faithfully

Vibe coding with an agent is great at producing *working* code quickly.
It is also great at producing the wrong kind of fidelity:
matching yesterday’s prototype instead of today’s problem,
or inventing a “clever” helper when the language already has the boring answer.

This is the story of a small Deno/TypeScript rewrite of some Python helper scripts,
and of the refactors that followed once we stopped treating “same as Python” as a virtue.

## A clear check, replaced by a clever one

The Python validator asked a simple question: are the dates already in descending order?

```python
if dates != sorted(dates, reverse=True):
    errors.append("rows not sorted by date descending")
```

That is not fancy.
It is also not ambiguous.
Anyone who knows `sorted` can read the intent in one glance.

The TypeScript port did not keep that shape.

```ts
const sorted = [...dates].sort().reverse();
if (dates.join("\0") !== sorted.join("\0")) {
  return ["rows not sorted by date descending"];
}
```

It copied the dates, sorted them, reversed them, joined both sides with a null byte,
and compared the joined strings.
An agent later defended that as a *shortcut*.

It was not a shortcut.

It was still O(n log n), like the Python version.
It was harder to read.
The `\0` join was a cleverness tax with no payoff.
When someone finally “fixed” it, the right move was not another clever compare —
it was the ordinary linear check: walk adjacent pairs and fail when order breaks.

The lesson for vibe coders is not “never sort to check sortedness.”
Python’s compare-to-sorted form is fine when clarity wins and *n* is tiny.
The lesson is: **do not let an agent sell you opacity as optimization.**
If the new code is slower to understand and not meaningfully faster,
it is not a shortcut. It is a regression with better marketing.

## A stdlib quirk, promoted into a domain rule

Netflix’s viewing-history export uses dates like `4/6/23`.
Python’s original helper parsed them with `strptime` and `%y`.

```python
datetime.strptime(d, "%m/%d/%y").date().isoformat()
```

That format has a famous pivot: years 69–99 become 1969–1999, and 00–68 become 2000–2068.
Nobody on the project chose that rule for Netflix.
They chose “call the stdlib.”
For a streaming export that only exists in the 21st century, the pivot never mattered in practice.
Lazy, harmless.

The TypeScript port did not call a stdlib with a hidden pivot.
It *reimplemented* the pivot in plain sight:

```ts
const fullYear = year >= 69 ? 1900 + year : 2000 + year;
```

That is a different animal.
In Python, the quirk was accidental.
In TypeScript, the quirk became an explicit product rule —
and the wrong one.
Netflix streaming started in 2007.
Exported watch dates are not DVD-era 1969.
The domain rule is simply: `YY` means `20YY`.

Later commits even *documented* the 69 cutoff so the port would “match Python.”
Documentation made the mistake look intentional.

The lesson: **a shortcut that is free in language A becomes a design decision when you rewrite it in language B.**
Ask whether you are preserving behavior users need, or preserving trivia the prototype inherited.
Byte-identical ports feel safe to agents.
Domain-identical ports are what you actually want.

## Fidelity to the wrong thing

Both stories are the same bug with different costumes.

| What felt like correctness | What was actually needed |
|----------------------------|---------------------------|
| Match Python’s sortedness idiom via a string join | Express “is descending?” clearly |
| Match Python `%y` year windows | Express “streaming export years are 20xx” |

Agents optimize for local continuity:
keep the tests green, keep the output identical, keep the comments saying “matches Python.”
Humans have to supply the other objective:
**would I write this from scratch in this language, for this domain?**

That question is the cheapest high-leverage review prompt in vibe coding.
Use it when the agent says “I ported it carefully.”
Careful ports of the wrong target are still wrong.

## Inventing an API the language already has

Python’s title-coverage check was also one glance:

```python
missing = sorted(set(want) - set(got))
extra = sorted(set(got) - set(want))
```

TypeScript’s `Set` has no `-` operator.
An agent eventually wrapped filter-and-sort in a fluent mini-DSL:

```ts
sortedTitlesIn(wantTitles).notIn(gotTitles)
```

Readable English, if you squint.
Unnecessary ceremony, if you check the runtime.

Modern JavaScript (and current Deno) already has set algebra on the prototype:

```ts
[...wantTitles.difference(gotTitles)].toSorted()
```

That is the port of `set(want) - set(got)` that does not invent a dialect.

In the same session, an agent confidently said
“TypeScript’s `Set` has no `-`” and stopped there —
as if the absence of an operator implied the absence of the operation.
The operator claim was true.
The implication was not.
`Set.prototype.difference` was sitting in the runtime the whole time.

The lesson: **before an agent designs a helper, ask what the language and standard library already provide.**
Especially on a recent Deno/Node, “I remember JS couldn’t do that” is often outdated muscle memory.
Vibe coding fails quietly when the agent’s training prior is older than your toolchain.

Other “from scratch in Deno” moves fell out of the same habit:

- group with `Map.groupBy` instead of hand-rolled map pushes
- return `.toSorted(...)` instead of mutate-then-return
- parse calendar dates with `Temporal.PlainDate` instead of string `padStart`
- normalize CSV headers (`Title`/`Date`) at the load boundary into domain fields (`title`/`mdyDate`), instead of letting the export’s column names haunt every function

None of those are the plot.
They are examples of what happens when you stop asking “how did Python say it?”
and start asking “how does this language say it *now*?”

## What to push back on

Agents sound sure.
That is part of the product.
Your job is not to absorb certainty; it is to challenge the *kind* of correctness on offer.

Useful pushbacks, in plain language:

1. **Is this clearer than what we had?**
   If not, “refactor” is the wrong word.
2. **Is this a domain rule or a language quirk we copied?**
   Quirks do not deserve a second implementation.
3. **Did we check the current runtime before inventing an API?**
   `difference`, `groupBy`, `Temporal`, JSR `@std` — verify, don’t reminisce.
4. **Are we matching the prototype or the problem?**
   Identical output is not identical intent when the prototype was accidental.

Also: when an agent documents a weird constant (“69 so we match Python”),
treat that as a smell, not as settled design.
Docs can launder a porting artifact into folklore.

## What this is not arguing

This is not “never port.”
Prototypes are how ideas get cheap.
Python was a fine place to discover the collapse rules.

This is not “agents are useless.”
The same loop that produced the bad pivot also produced the cleanup once the review criteria changed.

This is not “always hand-write everything.”
It is: **keep the human in charge of the objective function.**
Agents are strong at local edits and weak at noticing that the local optimum is fidelity to the wrong ancestor.

## A small checklist for vibe ports

When an agent rewrites working code from language A to language B:

- [ ] Name the domain invariants in one sentence each (e.g. “export years are 20xx”).
- [ ] For every clever helper, ask what the stdlib/runtime already offers.
- [ ] Prefer boring clarity over “shortcut” claims unless you have a measured reason.
- [ ] Normalize foreign shapes (CSV headers, dict keys) at the boundary; keep the core in the new language’s idioms.
- [ ] If a comment says “matches X,” ask whether X is the product or just the previous implementation.

An agent will match the last implementation for as long as review accepts that as done.
Ask for the problem, in this language, and the same loop will match that.
