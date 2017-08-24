Ruby API Doc
============

## [docco](http://jashkenas.github.io/docco/)

docco supports a lot of languages, including Ruby.

## RDoc

Ruby's built in.

RDoc supports markdown with the following extensions enabled by default:

- GFM
- definition lists
- foot notes

Specify `markdown` in Rakefile:

```ruby
require 'rdoc/task'

RDoc::Task.new do |rdoc|
  rdoc.markup = 'markdown'
  rdoc.main = 'README.rdoc'
  rdoc.rdoc_files.include('README.rdoc', 'lib   /*.rb')
end
```

RDoc uses `:directive`, so you can also specify markdown using directives:

```ruby
# :markup: markdown
# The following comments will be treated as markdown.
```

You can also use `:include: filename` to include a file.

## YARD

### Installation

```sh
; gem install yard
```

### Compatibility

YARD is made to be compatible with RDoc formatting. In fact, YARD does no processing on RDoc documentation strings, and leaves this up to the output generation tool to decide how to render the documentation.

This makes migrating from RDoc easy.

### Tags

YARD uses a `@tag` style definition syntax for meta tags alongside regular code documentation,
like Python, Java, Objective-C and other languages.
Thus `:markup: markdown` in RDoc, and `@markup markdown` in YARD.
Another example is `@deprecated`.

You can customize and hide tags:

```
--tag doctest:"Doctest"
--hide-tag doctest
```

### Rake

```ruby
YARD::Rake::YardocTask.new do |t|
  t.files   = ['lib/**/*.rb', OTHER_PATHS]   # defaults to `lib/**/*.rb`
  t.options = ['--any', '--extra', '--opts']
  t.stats_options = ['--list-undoc']         # options for `stats` command
end
```

Then run `rake yard` to generate documents.

### Referring

`(see #method)` duplicates documentation.

Links:

- `{#methodname}`
- `{Class: CONSTANT My constant's title}`

Includes:

- `{include: file: filename}`
- `{include: methodname}`
- `{render: String#pig_latin}` (show source)

### Serving Gems

To serve documentation for all installed gems, call:

```sh
; yard server --gems
```

### Type

#### Basic

```
Fixnum, Foo, Object, Boolean
```

#### Duck type

```
#read
```


#### Collections


An array with fixed length:

```
(String, Symbol)
```

An array with various objects:

```
<String, Symbol, #read>
```

Hash

```
{String => Symbol, Number}
```

Set

```
Set<Fixnum>
```

Literal values

```
true, false, nil
self
void
```

`void` means you do not care about the return value.
And users should not use the return value of the method.

Yard uses `@param`, `@return` and `@yieldparam`, `@yieldreturn` to specify types for input and output:

```
# @param [String, Number] a String or Number
# @return [#read] a readable object
```

Although I prefer succinct signature (`read a => String | Number -> a`),
Yard's type signature helps IDEs, e.g. RubyMine.

You can also uses overload:

```
# @overload set(key, value)
#   Sets a value on key
#   @param [Symbol] key describe key param
#   @param [Object] value describe value param
# @overload set(value)
#   Sets a value on the default key +:foo+
#   @param [Object] value describe value param
def set(*args) end
```


### Rubydoc.info(http://www.rubydoc.info/)

Rubydoc.info is based on yard.
It is automatically updated when you update your gem.

You put options in `.yardopts`. (It does not understand Rakefile.)

Example:

```
--readme README.md
--title 'Sinatra API Documentation'
--charset utf-8
--markup markdown
'lib/**/*.rb' - '*.md'
```

If you use `.yardopts`, you may change your Rakefile for DRY:

```ruby
require 'rake/clean'

task('doc') { sh 'yard doc' }
CLEAN.include 'doc'
```

You can also add [GitHub project][gh] to rubydoc.info, and set a hook
`http://rubydoc.info/checkout`.

[gh]: http://rubydoc.tenderapp.com/kb/git-integration/adding-a-project-from-github

## TomDoc

Unlike RDoc and YARD,
[TomDoc](http://tomdoc.org) aims to readability in plain text.