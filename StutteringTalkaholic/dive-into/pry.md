# Dive into Pry

## Input

- `!`: clear input buffer
- `code;`: suppress evaluation output, useful when it's long or uninterested.
- `amend-line N replacement code`: to amend lines of input. Use `!` for replacement to delete. You can use `show-input` to get line numbers.
- `.shellcommad #{ruby code}`

## Special locals

- `_`: last result
- `_ex_`: the most recently caught exception
- `_in_` and `_out_`: Input expressions and output results are automatically stored in array-like data structures.
- `_file_` and `_dir_`: last file and last directory
- `_pry_`: current Pry instance

## Browsing code

Use `cd` to move into a object or scope.
As in UNIX shells use `cd ..` to go
back, `cd /` to return to Pry top-level and `cd -` to toggle between last two
scopes. Complex syntax (e.g `cd ../@x/@y`) also supported.

Use `whereami`(alias `@`) to show code surrounding the current context.

Use `show-source`(alias `$` or `show-method`) and `show-code`(alias `?`).

Use `find-method` to recursively search for a method within a class/module or the current namespace.

Use `stat method_name` for basic method information.

Use `ls` to get a list of variables in current scope
You can also use `ls Class/Module`, or `ls variable`.

Use `watch` to watch the value of an expression and print a notification whenever it changes.

`cat` automatic syntax highlighting for a number of file types.

`cat` accepts the following options:

- `--[l]inenumbers` causes line numbers to be displayed along side each line.
- `--[t]ype`: syntax highlight type
- `--[s]tart` and `--[e]nd`: the line of the file with which to begin/end
- `--ex`: last exception
- `--in`: one or more entries from Pry's expression history (default: -5..-1)

## Editing code

`edit` brings you to `EDITOR`.
It accepts the following options:

* `-c`: current file/line
* `my_method`: method in the scope
* `Class#a_method` or `Class.a_class_method`
* `<filename>` or `<filename>:<line-number>`
* `--in 1..2`: a range of the Pry input buffer
* `-t`: open a temporary empty file in an editor
* `--ex`: the relevant file at the line that generated the last exception
* `--ex N`: the Nth line of the backtrace
* `-l`: jump to the specified line number
* `-n`: stop the automatic reloading of `.rb` files after you have edited them
* `-r`: force Pry to reload and eval a file, even if it does not end in `.rb`

Being run without any arguments, the `edit` command modifies the last input expression.

## History

`hist` to display Pry history.

It accepts the following options:

- `--grep REGEX`
- `--exclude`: when displaying history, exclude pry commands
- `--tail N` and `--head N`: `N` defaults to 10
- `--no-numbers` or `-n`: turns off line numbers when displaying history
- `--show A..B`
- `--replay A..B`: replay lines of history.
- `--save [A..B] FILE`: save to a file
- `--clear`: clear all current session history

## Debug

Write `binding.pry` as a breakpoint in your code. When executing, it
will stop here and open a Pry console.

## Gems

- `gem-cd` Change working directory to specified gem's directory.
- `gem-install` Install a gem and refresh the gem cache.
- `gem-list` List and search installed gems.
- `gem-open` Opens the working directory of the gem in your editor.

## Customization

For current session:

```ruby
Pry.config.[option]
```

You can store `Pry.config.[option]` in `.pryrc` (project or global `~/.pryrc`).

## Plugins

### pry-byebug

Use `byebug` (Ruby debugger) with pry.

I don't use it due to [this bug](https://github.com/deivid-rodriguez/pry-byebug/issues/44).
Besides, most of time, I just need pry-rescue.

## pry-coolline

By default, code gets highlighted after you end your input.
This plugin supports real time highlight.

## pry-macro

Record and play macros.
You can save macros to a file.

### pry-rescue

Whenever an unhandled exception happens in your program, pry-rescue opens an interactive pry shell right at the point it was raised.

Install it together with `pry-stack_explorer`, then run `rescue file.rb` instead of `ruby file.rb`.

In the rescue Pry session, use `up` and `down` to move around the stack, and use `wtf?` or `cat --ex` to examine stack traces and the associated code.
After identifying the problem, use `edit-method` (alias `$`) to fix the code, and `try-again` to verify the fix worked.

`cd-cause` lets you rewind back the previously raised exception. So, if you've rescued one exception, and then raised another (it happens…) you can jump back to the original cause of the problem.

You can also call `Pry::rescue` to control over which parts of your code are rescued:

```ruby
require 'pry-rescue'

def test
  raise "foo"
rescue => e
  raise "bar"
end

Pry.rescue do
  test
end
```

You can also use `Pry::rescue` in the `rescue` clause:

```ruby
def test
  raise "foo"
rescue => e
  Pry::rescued(e)
end

Pry::rescue{ test }
```

#### Testing

##### rspec

```sh
rescue rspec
```

##### MiniTest

Add the following to your `test_helper.rb` or to the top of your test file

```ruby
require 'minitest/autorun'
require 'pry-rescue/minitest'
```

It works perfectly with `yard-doctest` in terminal, but not is
sublime-text.

## Themes

In a pry session, run `pry-theme list` to list all installed themes.

Try a theme:

```pry
pry-theme try pry-modern-256
```

If the theme is not installed, you can install it:

```pry
pry-theme install theme-name
```

You can use `uninstall` to uninstall it.

Show current theme:

```pry
pry-theme current
```

You can edit a theme:

```pry
pry-theme edit
```

After you have decided your theme, write it in `.pryrc`:

```ruby
Pry.config.theme = "pry-modern-256"
```

You can get more themes at [Pry theme collection](https://github.com/kyrylo/pry-theme-collection).
