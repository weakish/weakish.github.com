Dive into Fish
=================

Introduction
-----------------

Fish is the Friendly Interactive Shell.
It also offers a relative clean syntax for shell scripting.
(I myself find that `rc` has a more clean syntax.
Fish's tab completion is powerful.
Though plan9 fans may say that we should implement tab completion in 
terminal emulator.)

Help
------

`help command` or `command --help`.

Syntax overview
----------------

    command [argument ...]

Commands and arguments are separated by the space character ( ).
Every command ends with either a newline or a semicolon (;). 


Quotes and escaping
--------------------

Variable expansions take place in double quoted strings but
not in single quoted ones.

Escapes in single quotes: \\' and \\.

Escapes in double quotes: \\", \\\, and \\$.

    $ - ? * ~ # ( ) { } [ ] < > ^ & ; ' " 

These characters and the space character have special meanings in fish.
We need to escape them by prepending them with a backslash.
We escape a backslach with another backslash (\\).


IO redirection and piping
-------------------------------


- standard input: `<SOURCE_FILE`
- standard output: `>DESTINATION`
- standard error:  `^DESTINATION`
- standard output, appended:  `>>DESTINATION_FILE`
- standard error, appended:  `^^DESTINATION_FILE`

DESTINATION can be one of the following:

- A filename.
- An ampersand (&) followed by the number of another file descriptor.
- An ampersand followed by a minus sign (&-). The file descriptor
will be closed.

For example, redirect both standard output and standard error 
to the file `all_output.txt`:

    echo Hello >all_output.txt ^&1

Any FD can be redirected in an arbitrary way by prefixing the redirection with the number of the FD:

- `N<DESTINATION`
- `N>DESTINATION`
- `N>>DESTINATION_FILE`


Prepend the desired FD number and then output
redirect symbol to the pipe.  For example:

    make fish 2>| less


Jobs
--------------------

- `command &`: run command in background.
- `fg` and `bg`: switch between foreground and background.
- `jobs`: list jobs.


Functions and conditional structure
---------------------------------------

See help page for `function`, `if`, `switch`, `and`, `or`, `for`, `while`, `begin`, `end`, etc.

Notes on wrapper functions:

- Don't forget $argv.
- Prefix the call to the command with the word 'command' unless
  the first to call command.



Tab completion
----------------

Fish tab completion list features descriptions of the completions and
it is scrollable
by arrow keys, page up/page keys,
the tab key or the space bar.
Pressing any other key will exit the list and insert
the pressed key into the command line.

fish provides completions for:

- Builtins, functions and regular programs.
- Environment variable names.
- Usernames in tilde expansion.
- Filenames, even with wildcards.
- Job id, job name and process names in process expansion.

fish provides a large number of program specific completions.

You can write your own builtin.
See `help complete` and /usr/share/fish/completions.

Set variable
------------

    set name value1 value2 ...

Command line expansions
-------------------------

Wildcards:

`?`, `*`, and `**` match non-hidden file names.

Use `.` as the first character to match hidden files.


Command substitution: 

    (command)

Variable expansion:

    $variable
    $array  # --> multiple arguments
    "$array" # --> one argument


Brace expansion:

    {a,b,c}
    {$USER}san # Neat, isn't it?


Home directory expansion:

    ~
    ~user


Process expansion:

    %self # shell pid
    %id  # group id
    %string  
    %user # pids of processes owned by user

Arrays:

    $PATH[3] # indices start at 1
    $$foo[1] # the same as ${$foo[1]}


History
------------

Press 'up' and 'down' to search commands containing the string entered.
Press Alt-up and Alt-down, match against the token under the cursor. 
Press escape to abort.


Config files
----------------

Variables definitions: ~/.config/fish/config.fish

Function definitions: ~/.config/fish/functions/

Completion definitions: ~/.config/fish/completions/

History file: ~/.config/fish/fish_history.


Feedback
----------

<weakish@gmail.com>


Copyright
----------

This work is based on the fish user documentation shipped in the fish distributions:

Copyright (C) 2005 Axel Liljencrantz.
Released under the GNU General Public License.
