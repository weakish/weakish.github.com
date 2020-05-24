# Dive into Ruby

Features
--------

- `?` and `!` in method names.
- `1_000_000`.
- `local`, `Readonly`, `$global`, `@instance` and `@@class`.
- Structs as light weight classes.
- `class SameName` merges, including core classes.
- `missing_method`, `define_method` and other meta-programming.

Quirks
------

### `begin ... end while`

```ruby
begin "code executed" end while false
"code not executed" while false
```

This is really anti-intuitive.
And the creator of Ruby said not use it.

> Don't use it please.  I'm regretting this feature, and I'd like to remove it in the future if it's possible.

> Because it's hard for users to tell
>     begin [code] end while [cond]
> works differently from
      [code] while [cond]

>     loop do
>  		...
>  		break if [cond]
> 		end

-- [matz.](http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/6745)

### `Proc.new`

The `return` statement in proc created by `Proc.new` will not only returns control just from itself, but **also from the method enclosing it**.

```ruby
def some_method
	myproc = Proc.new {return "End."}
	myproc.call

	# Any code below will not get executed!
	# ...
end
```

Well, you can argue that `Proc.new` inserts code into the enclosing method, just like block.
But `Proc.new` creates an object, while block are *part of* an object.

And there is another difference between lambda and `Proc.new`.
That is their handling of (wrong) arguments.
lambda complains about it, while `Proc.new` ignores extra arguments or considers absence of arguments as nil.

```
irb(main):021:0> l = -> (x) { x.to_s }
=> #<Proc:0x8b63750@(irb):21 (lambda)>
irb(main):022:0> p = Proc.new { |x| x.to_s}
=> #<Proc:0x8b59494@(irb):22>
irb(main):025:0> l.call
ArgumentError: wrong number of arguments (0 for 1)
        from (irb):21:in `block in irb_binding'
        from (irb):25:in `call'
        from (irb):25
        from /usr/bin/irb:11:in `<main>'
irb(main):026:0> p.call
=> ""
irb(main):049:0> l.call 1, 2
ArgumentError: wrong number of arguments (2 for 1)
        from (irb):47:in `block in irb_binding'
        from (irb):49:in `call'
        from (irb):49
        from /usr/bin/irb:11:in `<main>'
irb(main):050:0> p.call 1, 2
=> "1"
```

BTW, `proc` in Ruby 1.8 creates a lambda, while in Ruby 1.9+ behaves like `Proc.new`, really confusing.

### `def` does not create closures.

Closures are simple in Python:

```python
def a(x):
  def b():
    return x
  b()
```

This won't work in Ruby.

```ruby
def a(x)
  def b
    x
  b
end
```

In Ruby, `def` starts a new scope, without access to outer variables.
Only `@var` and `$var` can be accessed.
And no `extern` keyword like in C.
In Ruby, lambda creates closure:

```ruby
def a(x)
  b = ->{ x }
  b.call
end
```

Or `define_method`:

```ruby
def a(x)
  define_method(:b) { x }
  b
end
```

In Ruby 1.9, `define_method` is not availabel in main Object, you can
use `define_singleton_method` instead.

Tutorial
--------

Ruby advertises its "Least Surprise" principle,
thus I hope a basic understanding of the above features and quirks
is enough to dive into Ruby.
If you are unsure about something on Ruby,
you can guess and try, and it usually works,
except for quirks mentioned above.

If you prefer reading a tutorial before diving into Ruby,
I would recommend [why's guide to Ruby](http://poignant.guide),
a poignant introduction to a shiny language.

REPL
----

Use [pry](/dive-into/pry/).

Make
----

Use `rake`.

`rake` is a popular choice in Ruby.

`rake` is generally nice. But `pathmap` in `rake` uses rules hard to remember:

```ruby
SOURCE_FILES.pathmap("%{^sources/,outputs/}X.html")
```

WTF is `%{^sources/,outputs/}X`? And what is the difference if we replace `X` with one of `p`, `f`, `n`, `d`, `x`?
