Tabs v.s. spaces
----------------

Tabs are more accurate than spaces to represent indentation,
but I prefer spaces because tabs are invisible in most editors and IDEs.

I prefer 4 spaces
(clearer than 2 spaces to indicate indentation level and do not occupy too much space).
8 spaces are fine on large screen.

Condense braces
---------------

I prefer

```c
void function() {
    if (condition) {
        print("large fonts");
    } else {
        print("on small screen");
    }
}
```

over

```c
void function()
{
    if (condiciton) {
        print("braces on its own line");
    }
    else {
        print("shines if there are a lot of complex statements within branch");
    }
}
```

Because I use large fonts on a small screen.
I also avoid to put too many statements in if else branch.

Line length
-----------

No hard limit.

Again, since I use large fonts on a small screen, 80 is a soft limit for me.

