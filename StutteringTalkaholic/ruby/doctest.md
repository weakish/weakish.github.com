# Ruby Doctest

Doctest in Python is a good design.
Doctest ensures code, documentation, and tests are in a single place.
So readers can understand the logic of code easier,
without a lot of navigation.

Unlike Python, Ruby does not have built-in doctest,
but there are some third party libraries enabling doctest in Ruby.

## Doctest::RSpec

[Doctest::RSpec]: https://github.com/doctest/doctest-rspec

[Doctest::RSpec] integrates with RSpec, and requires a wrap for every unit test:

```ruby
require 'doctest/rspec'

describe MyClassWithDoctests do
  doctest MyClassWithDoctests
end
```

This is rather boring.

Also, test unit is mapped to module/class.
In module/class tests grouping is not supported.

It provides [doctest-core](https://github.com/doctest/doctest-core), a separate module to extract test code from source.
It is useful to implement your own doctest.

Besides, it is said that rspec is slower than MiniTest/Spec.

## rdoctest

[rdoctest]: https://github.com/stephencelis/rdoctest

[rdoctest] requires two space indentation for test code, which is a bit restrictive.

## Ruby Doctest

[Ruby Doctest]: https://github.com/tablatom/rubydoctest/

Python's doctest supports expected exceptions:

```python
>>> [1, 2, 3].remove(42)
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
ValueError: list.remove(x): x not in list
```

Python's doctest also supports ellipsis wildcards:

```python
>>> object() # doctest: +ELLIPSIS
<object object at 0x...>
```

[Ruby Doctest] supports [neither expected exceptions](https://github.com/tablatom/rubydoctest/issues/10)
[nor ellipsis wildcards](https://github.com/tablatom/rubydoctest/issues/9).

There are (ugly) workarounds:

```ruby
>> Object.new.to_s =~ /#<Object:0x.+>/
=> 0

>> begin
 |   1 / 0
 | rescue ZeroDivisionError
 |   'expected'
 | end
=> "expected"
```

To be fair, other libraries usually do not support these features either.

## Dest

[Dest]: https://github.com/Reizar/Dest


[Dest]'s output is different from [Ruby Doctest].

This is Ruby Doctest's output:

```ruby
1.  FAIL | Default Test
           Got:      120
           Expected: 130
             from /tmp/doctest.rb:21
4 comparisons, 1 doctests, 1 failures, 0 errors
```

And this is Dest's:

```ruby
    1) Test in /tmp/doctest.rb failed on line 21
          Expected: factorial(5)
          To Equal: 130
           But got: 120

Finished in 0.007838533 seconds
4 tests, 1 failures
```

From Dest's output, you know at a glance there is something wrong with your method `factorial`, without referring to the source code.

However, Ruby Doctest allows `doctest: description` to group tests,
as showed above: `4 comparisons, 1 doctests`.
Dest lacks this feature.

## minitest-doctest

[minitest-doctest]: https://github.com/lauri/minitest-doctest

[minitest-doctest] uses Mintiest to run the tests.

You can't get it from rubygems.org.
It is available on GitHub only.

Format:

```
# Test description.
#
# >> code
# => result
```

You can call it via `minidoctest` or `rake`.

## yard-doctest

[yard-doctest]: https://github.com/p0deje/yard-doctest

[yard-doctest] also uses Minitest.
And it requires `yard`.

It provides unique features:

- test helper
- hooks such as before, after and after-all
- skip
- `YARD::Doctest::RakeTask`

```ruby
# @example Dogs never hunt dogs
#   dog = Dog.new
#   dog.can_hunt_dogs? #=> false
#   dog = Dog.new
#   dog.can_hurt_cats?
#   #=> true
def can_hunt_dogs?
  false
end

def can_hurt_cats?
  true
end
```

For convenience, you can add the following lines to `.pryrc`:

```ruby
Pry.config.prompt = Pry::NO_PROMPT
Pry.config.output_prefix = '#=> '
```

Then you can just paste and copy from pry session.

You can run it via `yard doctest`.

Or use `rake yard:doctest`:

```ruby
require 'yard-doctest'
YARD::Doctest::RakeTask.new do |task|
  task.doctest_opts = %w[-v]
  task.pattern = 'lib/**/*.rb'
end
```

You can use `-p`/`--pride` option to get colorful output.

`module_funcion` copies instance methods, so they will produce
duplicated tests. To avoid it, add the following lines in your
`doctest_helper.rb`:

```rake
YARD::Doctest.configure do |doctest|
  YourModule.private_instance_methods.each do |m|
    doctest.skip "YourModule.#{m.to_s}"
  end
end
```

If you have a lot of modules:

```rake
open('lib/*/*.rb') do |f|
  module_lines = f.find_all { |line| line[0..5] == 'module' }
  modules = module_lines.map { |s| s.strip().tr(' ', '')[6..-1] }
  modules.each do |mod|
    mod = Object.const_get(mod)
    include mod
    YARD::Doctest.configure do |doctest|
      mod.private_instance_methods.each do |m|
        doctest.skip "#{mod}.#{m.to_s}"
      end
    end
  end
end
```

Notes:

- We also use `include mod`, so we can write shorter doctests (`method`
  instead of `Module.method`).
- Meta-programming like `Module.new` is not supported.

## Yard with `instance_eval`

There is also doctest for yard using `instance_eval`.
It is given as [an example](yard-example) on Montreal.rb talk.

[yard-example]: https://github.com/lsegal/yard-examples/tree/master/doctest


## CLI argument parsing

Slop auto create
Thor sub command
Clap & CLI.K
Commander
