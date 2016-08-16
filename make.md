## BSD vs. GNU

> BSD Make just knows about dependencies, targets, rules and macros.
> GNU Make adds built in rules to that mix to make it easier for the developer.
>
> It turns out that details of systems are conflicting and cannot be known in advance.
> BSD Make deals with system dependencies by having the system define its parameters.
> GNU Make's built in rules turn out to be inadequate.

-- [kbw](http://www.cplusplus.com/articles/jTbCpfjN/)

> When using `bsd.*.mk`, each Makefile can build only one program or library.
>
> ...
>
> The file `bsd.port.mk` is at the center of FreeBSD Ports,
> the system that builds software packages for FreeBSD.
> (NetBSD `pkgsrc` calls this file `bsd.pkg.mk`.)

-- [George Koehler](https://stackoverflow.com/questions/2131219/merits-of-bmake/25152244)

## Plan9 mk

`mk` in Plan9 is similar to BSD make, with few rules.
The main difference is templating:
BSD Makefile supports standard templates `.include <bsd.prog.mk>`
and nonstandard templates `.include "/path/to/included.mk"`,
and Plan9 Makefile supports `</path/to/included.mk`
but not standard templates.
Plan9 Makefile supports including command line output (`<|cat /path/to/included.mk>`) though.

Plan9 also supports using different shells within a single mkfile:

```sh
MKSHELL=/bin/rc
use-rc:V:
    for(i in a b c) echo $i

MKSHELL=sh
use-sh:V:
    for i in a b c; do echo $i; done
```

## Examples

BSD Makefile:

```make
PROG=   sed
SRCS=   sed0.c sed1.c

.include <bsd.prog.mk>
```

#make #build #gnu #bsd
