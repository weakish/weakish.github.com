# Selected Gitmojis

## Summary

| emoji | code     | usage            |
|-------|----------|------------------|
| 🐛    | `:bug:`  | bug fix          |
| 🆕    | `:new:`  | new feature      |
| 🔥    | `:fire:` | remove feature   |
| 💥    | `:boom:` | breaking changes |
| 🔒    | `:lock:` | security fix     |
| 🎨    | `:art:`  | refactor         |
| ⚡️    | `:zap:`  | performance      |
| 💯    | `:100:`  | test             |
| 📝    | `:memo:` | doc              |
| 💤    | `:zzz:`  | chore            |
| 🎉    | `:tada:` | release          |
| 💩    | `:poop:` | dirty            |
| 🥚    | `:egg:`  | Easter eggs      |

See [[AGENTS]] for configuration details.

## Features

- Only 13 types.

    Do not need to open [gitmoji.dev][gitmoji] in the browser before writing a commit message.

- Only use emojis with a short emoji code (less than five characters).

    Commit message title is recommended to be less than 50 characters.

- Looks good and comprehensible in plain text.

    Friendlier for infancy terminals and acceptable (I hope) for emoji haters.

## Comparison with gitmoji and Atom style guide

| emoji | usage            | gitmoji  | atom |
|-------|------------------|----------|------|
| 🐛    | bug fix          | 🐛       | 🐛   |
| 🆕    | new feature      | ✨       | n/a  |
| 🔥    | remove feature   | 🔥       | 🔥   |
| 💥    | breaking changes | 💥       | n/a  |
| 🔒    | security fix     | 🔒       | 🔒   |
| 🎨    | refactor         | ♻️       | 🎨   |
| ⚡️    | performance      | ⚡️       | 🐎   |
| 💯    | test             | ✅       | ✅   |
| 📝    | doc              | 📝       | 📝   |
| 💤    | chore            | 🚀 or 💚 | n/a  |
| 🎉    | release          | 🔖       | n/a  |
| 💩    | dirty            | 💩       | n/a  |
| 🥚    | Easter eggs      | 🥚       | n/a  |

## Change Log

### 0.1.0

- Use `:100:` for tests. `:mag:` should be considered as an alias of `:100:`.

    When displayed in plain text, `:mag:`,
    I think it is hard to recognize "mag" is an abbreviation for "magnifier".
    On the other hand, I ensure all tests are passed in pre commit hook.
    Thus, most of the time, changes on tests come with changes in other types,
    e.g. `:bug:` or `:new:`.
    Test only changes thus are most likely to improve test coverage, aiming at 100% branch coverage.
    Therefore, I replace `:mag:` with `:100:`.

    Any tools supporting this selected gitmoji set
    should treat `:mag:` as an alias of `:100:`,
    to maintain backward compatibility.

### 0.0.2022

The following new emojis are added:

- `:mag:` for tests, and `:zzz:` for chores (boring things).

    I used to think that tests and build process are part of code logic.
    However, when reviewing changes, separation is a good thing.

- `:boom:` for breaking changes from gitmoji, and `:tada:` for releases. (Gitmoji uses `:tada:` for project begin and 🔖 `:bookmark:` for release.)

- `:poop:` for dirtiness and `:egg:` for Easter eggs, both from Gitmoji.

### 0.0.0

The initial version.
I built a list of emojis based on the intersection of [gitmoji][] and the [Atom style guide][],
removing emojis whose code are too long, and adding the following emojis:

- ⚡️ `:zap:` from gitmoji.
- 🆕 `:new:` for new features. I saw someone used this.

[gitmoji]: https://gitmoji.dev/
[Atom style guide]: https://github.com/atom/atom/blob/master/CONTRIBUTING.md#git-commit-messages
