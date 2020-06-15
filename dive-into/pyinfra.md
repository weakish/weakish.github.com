# Dive into Pyinfra

Pyinfra features:

1. Minimal dependencies for remote system (only shell).
2. Write deploy files in Python.

## Install

```sh
pip install pyinfra
```

## Ad-hoc

I can run ad-hoc commands directly without writing any file.

```sh
; pyinfra @local pip.packages pyinfra
--> Loading config...
--> Loading inventory...

--> Connecting to hosts...
    [@local] Connected

--> Preparing operation...

--> Proposed changes:
    Groups: @local
    [@local]   Operations: 1   Commands: 0

--> Beginning operation run...
--> Starting operation: Pip/Packages ('pyinfra',)
    [@local] No changes

--> Results:
    Groups: @local
    [@local]   Successful: 1   Errors: 0   Commands: 0/0
```

## Deploy File

The best feature of pyinfra to me is writing deploy files in Python.

```py
# deploy.py

from pyinfra.modules import pip

pip.packages(['pyinfra'])
```

Execute it:

```sh
; pyinfra deploy.py
--> Loading config...
--> Loading inventory...

--> Connecting to hosts...
    [@local] Connected

--> Preparing operations...
    Loading: deploy.py
    [@local] Ready: deploy.py

--> Proposed changes:
    Groups: @local
    [@local]   Operations: 1   Commands: 0

--> Beginning operation run...
--> Starting operation: Pip/Packages ('pyinfra',)
    [@local] No changes

--> Results:
    Groups: @local
    [@local]   Successful: 1   Errors: 0   Commands: 0/0
```

## Operations

### Global Arguments

- `sudo`: execute with sudo
- `env`: dictionary of environment variables to set
- `ignore_errors`
- `success_exit_codes`: list of exit codes to consider a success
- `timeout`: timeout for *each* command executed during the operation
- `stdin`: string or buffer to send to the stdin of any commands
- `on_success` and `on_error`: callback functions

Refer to [pyinfra/api/operation_kwargs.py][operation_kwargs] for a complete list.

[operation_kwargs]: https://github.com/Fizzadar/pyinfra/blob/master/pyinfra/api/operation_kwargs.py

### Loops

Actions are executed in orders, blockingly.
However, operations in a loop are executed, nonblockingly.

The following will not work, since multiple `apt install` commands cannot be run at the same time.

```python
for p in ['git', 'tmux', 'fish']:
    apt.packages([p])
```

pyinfra provides `state.preserve_loop_order` for serializing execution:

```python
from pyinfra.api import state

with state.preserve_loop_order(['git', 'tmux', 'fish']) as loop_items:
    for p in loop_items():
        apt.packages([p])
```

Note the above example is for demonstration only, the proper way should be:

```python
apt.packages(['git', 'tmux', 'fish'])
```

### Writing Operations

Example in Python 3.6:

```python
# pkcon.py
from typing import Generator, List, Dict, Union
from pyinfra.api import operation
from pyinfra.api.state import State
from pyinfra.api.host import Host

@operation
def update(state: State, host: Host) -> Generator[Dict[str, Union[str, List[int]]], None, None]:
    '''Upgrade system via PackageKit console client.'''
    command: Dict[str, Union[str, List[int]]] = {
        'command': 'pkcon update --plain --noninteractive',
        'success_exit_codes': [0, 5],  ## 5: no updates to install
    }
    # operation yields shell commands, so the target machine does not need Python.
    yield command
```

Note, the above code requires the following stub:

```python
# typings/pyinfra/api/operation.pyi
# import statements omitted for brevity
def operation(func: Callable[[State, Host], Union[str, Dict[str, Union[str, List[int]]], Generator[str, None, None], Generator[Dict[str, Any], None, None]]],
    pipeline_facts: Optional[Any] = ...) -> Callable[..., OperationMeta]: ...
```

Use it as below:

```python
# deploy.py
import pkcon
pkcon.update()
```

Operations can be packaged in deploys:

```python
# unix.py
from pyinfra.api import deploy
from pyinfra.api.state import State
from pyinfra.api.host import Host
from pyinfra.modules import python
import pkcon

@deploy
def update(state: State, host: Host) -> None:
    if host.fact.os == 'Linux':
        if host.fact.linux_distribution["release_meta"]["ID"] == 'neon':
            # nested operations cannot omit state and host parameters
            pkcon.update(state, host)
        else:
            python.raise_exception(state, host, NotImplementedError)
    else:
        python.raise_exception(state, host, NotImplementedError)
```

Again, the above code requires the following stub:

```python
# typings/pyinfra/api/deploy.pyi
# import statements omitted for brevity
def deploy(func_or_name: Union[Callable[..., None],str], data_defaults: Optional[Any] = ...) -> Callable[..., None]: ...
```

Usage:

```python
# deploy.py
import unix
unix.update()
```

## Inventory

Currently I have only played with pyinfra on localhost.
But pyinfra can also manage remote machines.

```sh
pyinfra example.com fact os
```

To manage multiple servers, list them in `inventory.py`:

```sh
; cat inventory.py
vm = ["a.example.com", "b.example.com", "c.example.com"]
; pyinfra inventory.py deploy.py
```

## Similar Projects

- [Sprinkle](https://github.com/sprinkle-tool/sprinkle), like Pyinfra but deploy files are written in Ruby.
- [cdist](https://www.cdi.st/), also written in Python, but deploy files are written in shell.
