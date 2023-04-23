Ruby Coding Style
=================

## Use `{}` for blocks returning value, and `do end` for other blocks.

```ruby
l = [1, 2, 3]

l.each do |n| n += 1 end

l.map { |n|
  b = (n + 1) * (n + 2) / 3.0
  b.to_s
}

identity = ->(x) { x }
say = ->(x) do puts x end
```

## Avoid `Proc.new` and `proc`.

Avoid `Proc.new`.

Never use `proc`. Its behavior is different for Ruby 1.8 and Ruby 1.9+.

## Use `self` module functions.

Prefer

```ruby
mod M
  def self.a; 'a'; end
  def self.b; 'b'; end
  # more ...
end

M.a()
```

over

```ruby
module M
  # module_function will copy the functions. No need to make duplicated
  # functions unless you want to let other classes include your module
  # and let them pollute other classes' namespcae.
  module_function

  def a; 'a'; end
  def b; 'b'; end
  # more ...
end

M.a()
```

over

```ruby
class C
  # Do not build a class just for some functions. Use module for this.
  class << self

    def a; 'a'; end
    def b; 'b'; end
    # more ...
  end
end

C.a()
```

and

```ruby
class C
  def a; 'a'; end
  def b; 'b'; end
  # more ...
end

# This is redundant.
c = C.new()
c.a()
```
