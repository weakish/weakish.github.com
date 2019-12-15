# Use npm without package.json

## Why NOT package.json?

`package.json` brings in unnecessary complexity.
If you do not think so, have a look at [Go] and [Deno].

[Go]: https://pkg.go.dev/
[Deno]: https://deno.land/std/manual.md

## Everyday Use without package.json

Tell npm to not save package:

```sh
npm config set save false
```

Install development tools as global packages:

```sh
npm i -g typescript
npm install -g eslint
npm i -g @zeit/ncc
```

For temporal usage or test, use `npx`:

```sh
npx cloc index.js
```

`npx` can also be used to test different node versions:

```sh
npx -p node@13 node -v
```

Install dependencies as devDependencies:

```sh
npm i -D express
npm i -D @types/express
```

Use [ncc] to package runtime dependencies into a single JavaScript file:

```sh
# install dependencies according to resolved urls to tarballs in package-lock.json
@cat package-lock.json | jq '.dependencies[].resolved' | xargs npm i --no-package-lock
ncc build index.js --minify # output file: dist/index.js
```

Then you can move the bundled `index.js` file to any place where Node.js is installed,
and run it with `node index.js` without installing any npm modules.

[ncc]: https://github.com/zeit/ncc/

## Alternative to `npm run`

Just use plain old Makefile, e.g.

```makefile
dist/index.js: index.js
	@cat package-lock.json | jq '.dependencies[].resolved' | xargs npm i --no-package-lock
	ncc build index.js --minify
```