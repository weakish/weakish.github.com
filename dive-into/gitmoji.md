# Selected Gitmojis

## Summary

| emoji | code | usage | Angular Convention |
| - | - | - | - |
| 🐛 | `:bug:` | bug fix | fix |
| 🆕 | `:new:` | new feature | feat |
| 🔥 | `:fire:` | remove feature | n/a |
| 💥 | `:boom:` | breaking changes | n/a |
| 🔒 | `:lock:` | security fix | n/a |
| 🎨 | `:art:` | refactor | refactor |
| ⚡️ | `:zap:` | performance | perf |
| 💯 | `:100:` | test | test |
| 📝 | `:memo:` | doc | docs |
| 💤 | `:zzz:` | chore| chore |
| 🎉 | `:tada:` | release | n/a |
| 💩 | `:poop:` | dirty | n/a |
| 🥚 | `:egg:` | Easter eggs | n/a |

## Features


- Only 13 types.

    Do not need to open gitmoji.dev in the browser before writing a commit message.

- Only use emojis with a short emoji code (less than five characters).

    Commit message title is recommended to be less than 50 characters.

- Most emojis have corresponding types in Angular convention.

- Looks good and comprehensible in plain text.

    Friendlier for unfancy terminals and acceptable (I hope) for emoji haters. 

## Intersection between gitmoji and Atom style guide

* 🎨 `:art:` when improving the format/structure of the code
* 📝 `:memo:` when writing docs
* 🐧 `:penguin:` when fixing something on Linux
* 🍎 `:apple:` when fixing something on macOS
* 🏁 `:checkered_flag:` when fixing something on Windows
* 🐛 `:bug:` when fixing a bug
* 🔥 `:fire:` when removing code or files
* 💚 `:green_heart:` when fixing the CI build
* ✅ `:white_check_mark:` when adding tests
* 🔒 `:lock:` when dealing with security
* ⬆️ `:arrow_up:` when upgrading dependencies
* ⬇️ `:arrow_down:` when downgrading dependencies

## Conflicts between gitmoji and Atom style guide

| Meaning | gitmoji | Atom |
| - | - | - |
| Performance | ⚡️ | 🐎 |
| Removing linter warnings | 🚨 | 👕 |

## Comparison with Angular Convention

| [Angular] | gitmoji |
| - | - |
| feat | ✨ |
| fix | 🐛 |
| docs | 📝 |
| style | 🎨 |
| refactor | ♻️ |
| perf | ⚡️ |
| test | ✅ |
| chore | 🚀 (deploy)　or 💚 (CI) |

[Angular]: https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#type

## A reduced list of gitmoji

From the intersection, remove the following emojis:

- Too long:

    :penguin:, :checkered_flag:, :green_heart:, :white_check_mark:, :arrow_up:, :arrow_down:

- Ambiguous:

    * :green_heart:, I don't know why this is related to CI.
    * :arrow_up:, this could mean "bump version".
    * :arrow_down:, this could mean "regression".

- Other:

    :apple:, since both :penguin: and :checkered_flag: have been removed.

And add the following:

- ⚡️ `:zap:` for performance from gitmoji.
- 🆕 `:new:` for new features. I saw someone used this.
- 💯 `:100:` for tests, aiming at 100% branch coverage. 
- 💤 `:zzz:` for chores. I think changes of this type is somehow boring.
- 💥 `:boom:` for breaking changes from gitmoji.
- 🎉 `:tada:` for new release. Gitmoji uses this for project begin and 🔖 `:bookmark` for release.
- 💩 `:poop:` for dirty hacks and twisted workarounds from gitmoji ("Write bad code that needs to be improved.").
- 🥚 `:egg:` for Easter eggs from gitmoji.


Thus, the final list is:

* 🎨 `:art:` when improving the format/structure of the code
* 🐛 `:bug:` when fixing a bug
* 🔥 `:fire:` when removing code or files
* 📝 `:memo:` when writing docs
* 🆕 `:new:` when adding a new feature
* 🔒 `:lock:` when fixing security problems
* ⚡️ `:zap:` when improving performance
- 💯 `:100:` when adding or updating tests.
* 💤 `:zzz:` for chores. I think changes of this type is somehow boring.
* 💥 `:boom:` when introducing breaking changes.
* 🎉 `:tada:` when releasing a new version.
* 💩 `:poop:` when committing dirty hacks and twisted workarounds
* 🥚 `:egg:` when adding or updating an Easter egg.

Compared to Angular Convention, I removed the following types:

- `style`: White-space, formatting etc. are unimportant. And most of the time, they do not deserve a separate commit.

I added the following types:

- A security issue (`:lock:`) is a special kind of bug (`:bug:`). It is so important that I use a different emoji.
- Removing a feature (`:fire:`) belongs to `refactor` by Angular Convention's definition: "A code change that neither fixes a bug nor adds a feature". However, it makes sense to assume a refactor does not introduce a breaking change of API, while removing a feature always break the API.
- Breaking changes (`:boom:`) may have serious effects thus deserve a dedicated emoji.
- Some projects have a change log file in the repository. Thus, a commit preparing a release typically starts with `:memo:`. However, some projects do not maintain a change log file in the repository, but use the annotations of git tags. Then a commit preparing a release typically only involve things such as updating some version strings. Therefore, an extra emoji (`:tada:`) is added.
- `:poop:` is similar to `:boom:`, asking for special attention. These commits may be squashed or rebased on merging, if a *clean* history is preferred.
- `:egg:` itself can be considered as an Easter egg of gitmoji.

## Change Log

### 0.1.0

- Use `:100:` for tests. `:mag:` should be considered as an alias of `:100:`.

    When displayed in plain text, `:mag:`,
    I think it is hard to recongnize "mag" is an abbreviation for "magnifirer".
    On the other hands, I ensure all tests are passed in pre commit hook.
    Thus, most of the time, changes on tests come with changes in other types,
    e.g. `:bug:` or `:new:`.
    Test only changes thus are most likely improve test coverage.
    Therefore, I replace `:mag:` with `:100:`.

    Any tools supporting this selected gitmoji set
    should treat `:mag:` as an alias of `:100:`,
    to maintain backward compatibility.

### 0.0.2022

The following new emojis are added:

- `:mag:` for tests, and `:zzz:` for chores.

    I used to think that tests and build process are part of code logic.
    However, when reviewing changes, seperation is a good thing.

- `:boom:` for breaking changes, and `:tada:` for releases.

- `:poop:` for dirtiness and `:egg:` for Easter eggs.

### 0.0.0

The initial version.
