## tl;tr

emoji | code | usage
- | - | -
🎨 | `:art:` | refactor
🐛 | `:bug:` | bug fix
📝 | `:memo:` | doc
🆕 | `:new:` | new feature
🔒 | `:lock:` | security
⚡️ | `:zap:` | performance


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
| build | 🚀 (deploy)　|
| ci | 💚 (CI) |
| docs | 📝 |
| feat | ✨ |
| fit | 🐛 |
| perf | ⚡️ |
| refactor | ♻️ |
| style | 🎨 |
| test | ✅ |

[Angular]: https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit

## A reduced list of gitmoji

From the intersection, remove the following emojis:

- Too long:

    :penguin:, :checkered_flag:, :green_heart:, :white_check_mark:, :arrow_up:, :arrow_down:

- Ambiguous:

    * :fire:, this could mean hotfix.
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
* 📝 `:memo:` when writing docs
* 🆕 `:new:` when adding a new feature
* 🔒 `:lock:` when dealing with security
* ⚡️ `:zap:` when improving performance