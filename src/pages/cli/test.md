# Command Line Interface Testing

## [assert.sh](https://github.com/lehmannro/assert.sh)

Example:

```sh
. assert.sh

# `echo test` is expected to write "test" on stdout
assert "echo test" "test"
# exit code of `true` is expected to be 0
assert_raises "true"
# exit code of `false` is expected to be 1
assert_raises "false" 1
# end of test suite
assert_end examples
```

Pros:

- simple (only `assert`, `assert_raises` and `assert_end`)
- light weight (just `source assert.sh`)

Cons:

- It can only match result exactly, no support for "output should contains ..." like function.
- No setup/teardown.

You can [implement your own](https://github.com/lehmannro/assert.sh/issues/10) `assert_contains` function.

## [ts](https://github.com/thinkerbot/ts)

It is similar to assert.sh.

Differences:

- `setup ()` and `teardown ()`.
- Every test is a function. `exit 0` to pass tests.

## [roundup](http://bmizerany.github.io/roundup)

Example:

```sh
#!/usr/bin/env roundup

describe "group tests"

it_displays_the_title() {
    first_line=$(rup roundup-5 | head -n 1)
    test "$first_line" "=" "roundup(5)"
}

it_exists_non_zero() {
    status=$(set +e ; rup roundup-5 >/dev/null ; echo $?)
    test 2 -eq $status
}

it_survives_edge_cases() {
    rup edge
}
```

Differences to assert.sh:

- Use `describe` at the beginning of a test group instead of `assert_end` in the end.
- Put tests in functions.

I think these differences add readability.

Cons are similar to assert.sh.

## [rnt](https://github.com/roman-neuhauser/rnt)

Save output of  commands to `*.actual`, then compare them with `*.expected` via `diff`.

Cons are similar to assert.sh, plus:

- Separate expected output with the corresponding command.
- A lot of tests lead to complex directory structure.

## [cmdtest](http://liw.fi/cmdtest/)

Like rnt, cmdtest also uses a lot of files.
But it adds support for standard error and setup/teardown.

       foo.script
              a script to run the test (this is required)

       foo.stdin
              the file fed to standard input

       foo.stdout
              the expected output to the standard output

       foo.stderr
              the expected output to the standard error

       foo.exit
              the expected exit code

       foo.setup
              a shell script to run before the test

       foo.teardown
              a shell script to run after test

       setup-once
              a shell script to run once, before any tests

       setup  a shell script to run before each test

       teardown
              a shell script to run after each test

       teardown-once
              a shell script to run once, after all tests

Cons:

- No support for "output should contains ..." like function.
- Separate expected output with the corresponding command.
- A lot of tests lead to complex directory structure.

## [urchin](https://github.com/tlevine/urchin)

urchin is similar to rnt, but it does use separate output files.
Instead, `exit 0` passes tests.

```
tests/
  setup
  setup_dir
  bar/
    setup
    test_that_something_works
    teardown
  baz/
    jack-in-the-box/
      setup
      test_that_something_works
      teardown
    cat-in-the-box/
      fixtures/
        things.pdf
      test_thingy
  teardown
```

Cons are similar to rnt except for 'Separate expected output'.

## [Cram](https://bitheap.org/cram/)

Tests look like documents:

```cram

This is a comment.

  $ echo 'Lines beginning with two space followed by $ is a test.'
  $ echo 'Multiline test
  > exit 0 passes tests.'

  $ cram -h
  [Uu]sage: cram \[OPTIONS\] TESTS\.\.\. (re)

  [Oo]ptions: (re)
    -h, --help          show this help message and exit
    -V, --version       show version information and exit
    -q, --quiet         don't print diffs
    -v, --verbose       show filenames and test status
    -i, --interactive   interactively merge changed test output
    -y, --yes           answer yes to all questions
    -n, --no            answer no to all questions
    -E, --preserve-env  don't reset common environment variables
    --keep-tmpdir       keep temporary directories
    --shell=PATH        shell to use for running tests
    --indent=NUM        number of spaces to use for indentation

Lines beginning with two space not followed by $ or > is output.
Output lines ending with a space and (re) are matched against PCRE.
```

Cons:

- No setup/teardown.
- `(re)` only matches a single line.

## [shelltestrunner](http://joyful.com/shelltestrunner/)

```shelltestrunner
# optional comment
a one-line shell command
<<<
zero or more lines of standard input
>>>
zero or more lines of expected standard output (or /REGEXP/ added to the previous line)
>>>2
zero or more lines of expected standard error output (or /REGEXP/ added to the previous line)
>>>= STATUS (or /REGEXP/)
```

Cons:

- No setup/teardown.

## [tf](https://github.com/mpapis/tf)

Example:

```tf
## User comments start with double #
## command can be writen in one line with multiple tests:
true # status=0; match=/^$/
## or tests can be placed in following lines:
false
# status=1
```

Cons:

- No setup/teardown.
- Syntax: `env[]=~//`, `env[]?=`, `env[][]=`, etc.

## [Bricolage](http://bitbucket.org/zserge/bricolage)

Example:

```sh
# A test is a function. $T is a variable where test keeps its internal files
mytest() {
    # ok is the only assertion helper
    # It uses `test` to check the condition, so syntax is common
    ok 1 -eq 1
    ok foo = foo
    foo="Foo bar"
    ok "$foo" = "Foo bar"

    # You can use `spy` to make a wrapper over a command.
    spy date

    date

    # Command output will be written into <spy>.stdout file:
    ok "$(cat $T/spy.date.stdout)" = "foo"

    # Fake spy output can be specified in the <spy> file:
    echo foo > $T/spy.date
    date

    # You can assert it using tail, sed, awk and other common unix tools
    ok "$(tail -n 1 $T/spy.date.stdout)" = "foo"
}

# You may override test reports as you need
pass() { echo PASS $* }
fail() { echo FAIL $* }

# You have to run your tests manually
bricolage mytest

# Clean test data
rm -rf $T
```

Pros:

- Extremely small (50 LOC).
- Ultimately minimal.

Cons:

- Ultimately minimal.
