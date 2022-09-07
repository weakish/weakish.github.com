# Check in Node Modules

I checked in node modules to my git repositories.

## Why

Jack Franklin has a good [post] on why you should check in node modules.

[post]: https://www.jackfranklin.co.uk/blog/check-in-your-node-dependencies/

## Prettier

I use prettier to format staged files in [a pre-commit hook].
Unlike ESLint, prettier automatically format files under `node_module`.
Thus, I add `node_modules` to `.prettierignore`.

[a pre-commit hook]: https://prettier.io/docs/en/precommit.html#option-2-pretty-quickhttpsgithubcomazzpretty-quick "with husky and pretty-quick"
