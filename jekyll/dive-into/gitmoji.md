# Selected Gitmojis

## tl;tr

emoji | code | usage | Angular Convention
- | - | - | -
🎨 | `:art:` | refactor | refactor
🐛 | `:bug:` | bug fix | fix
🔥 | `:fire:` | remove feature | n/a
📝 | `:memo:` | doc | docs
🆕 | `:new:` | new feature | feat
🔒 | `:lock:` | security fix | n/a
⚡️ | `:zap:` | performance | perf


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
- 🆕 `:new:` for new features (I saw someone used this).

Thus the final list is:

* 🎨 `:art:` when improving the format/structure of the code
* 🐛 `:bug:` when fixing a bug
* 🔥 `:fire:` when removing code or files
* 📝 `:memo:` when writing docs
* 🆕 `:new:` when adding a new feature
* 🔒 `:lock:` when fixing security problems
* ⚡️ `:zap:` when improving performance

Compared to Angular Convention, I removed the following types:

- `test` and `chore`: tests and build process are part of code logic.
- `style`: White-space, formatting etc. are unimportant. And most of the time, they do not deserve a separate commit.

I added the following types:

- A security issue (`:lock:`) is a special kind of bug (`:bug:`). It is so important that I use a different emoji.
- Removing a feature (`:fire:`) belongs to `refactor` by Angular Convention's definition: "A code change that neither fixes a bug nor adds a feature". However, it makes sense to assume a refactor dose not introduce a breaking change of API, while removing a feature always break the API.