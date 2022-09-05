# Quirks of Ruby

## Foreword

Ruby advertises its "The Least Surprise" principle.
If you are unsure about something on Ruby,
you can guess and try, and it usually works,
except for some quirks mentioned below.

If you prefer reading a tutorial before diving into Ruby,
I would recommend [why's guide to Ruby](http://poignant.guide),
which may be outdated,
but definitely poignant.

## `begin ... end while`

```ruby
begin "code executed" end while false
"code not executed" while false
```

This is really anti-intuitive.
And the creator of Ruby said not using this.

> Don't use it please. I'm regretting this feature,
> and I'd like to remove it in the future if it's possible.

-- [matz](http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/6745)

Unfortunately, this feature still exists in Ruby 3.1.

## `Proc.new`

The `return` statement in proc created by `Proc.new` will not only return control just from itself, but **also from the method enclosing it**.

```ruby
def some_method
	myproc = Proc.new {return "End."}
	myproc.call

	# Any code below will not get executed!
	# ...
end
```

Well, you can argue that `Proc.new` inserts code into the enclosing method, just like block.
But `Proc.new` creates an object, while block are _part of_ an object.

And there is another difference between lambda and `Proc.new`.
That is their handling of (wrong) arguments.
Lambda complains about it, while `Proc.new` ignores extra arguments or considers absence of arguments as nil.

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

## `def` does not create closures.

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
  end
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

In Ruby 1.9, `define_method` is not available in main Object, you can
use `define_singleton_method` instead.
