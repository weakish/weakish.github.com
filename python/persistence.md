# Python Persistence

## tl;tr

If we care about compatibility with different Python versions,
use `cPickle` with binary protocol and `fast` option.

Otherwise just use marshal.

## Performance

A benchmark of marshal, pickle, json, capnp for python 2.7 on my machine.

```python
import timeit

md = "marshal.dumps({'people': [{'name': 'Alice'}]})"
im = 'import marshal'

p d= "pickle.dumps({'people': [{'name': 'Alice'}]})"

ip = 'import cPickle as pickle'

jd = "json.dumps({'people': [{'name': 'Alice'}]})"
ij = 'import json'

cd = "bm_capnp.AddressBook.new_message(people=[{'name': 'Alice'}])"
ic = 'import capnp; import bm_capnp'

def benchmark(d, i):
    return timeit.timeit(d, i, number=10000)

# Benchmarking
m = benchmark(md, im)
p = benchmark(pd, ip)
j = benchmark(jd, ij)
c = benchmark(cd, ic)

# Output result
output = "{name}: {time}".format

output(name='marshal', time=m)
output(name='(c)pickle', time=p)
output(name='json', time=j)
output(name="Cap'n Proto", time=c)
```

Cap'n Proto requires an additional schema file:

```capnp
@0x934efea7f017fff0;

struct Person {
  name @0 :Text;
}

struct AddressBook {
  people @0 :List(Person);
}
```

Result:

```
marshal: 0.08457612991333008
(c)pickle: 0.31447696685791016
json: 0.7639560699462891
Cap'n proto: 0.4193081855773926
```

So marshal seems the fastest on my machine.

However, with binary protocol and `fast` option,
`cPickle` is mostly as fast as `marshal`.

```python
>>> md = 'marshal.dumps([1, 2, 3])'
>>> im = 'import marshal'
>>> pd = 'fp.dump([1, 2, 3])'
>>> ip = "import cPickle; fp = cPickle.Pickler(open('/tmp/1', 'wb'), 2); fp.fast = 1"
>>> timeit.timeit(md, im, number=1000)
0.012997150421142578
>>> timeit.timeit(pd, ip, number=1000)
0.017292022705078125
```

## Compatibility

### Compatibility with different Python versions

Marshal is for internal usage (`.pyc`).
So its format may be modified on future versions of Python.
Currently (up to Python 3.4.3), there are 4 versions of `marshal`.
The current version can be viewed via `marshal.version`.

### Compatibility with other languages

Implemented in other languages:

- Ruby: [RMarshal](http://github.com/daeken/RMarshal)
- Go: [gopymarshal](https://github.com/hambster/gopymarshal)
- Perl: (read-only) https://github.com/gitpan/Python-Serialise-Marshal

## Export to JSON

To communicate with other programs,
we can export to JSON.

On Python 2.7+, the `json` module from `stdlib`
is [fast in encoding and decoding JSON][fast_json].
No need to use other modules.

[fast_json]: http://stackoverflow.com/a/15440843

