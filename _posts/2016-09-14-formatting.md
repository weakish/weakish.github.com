Tabs v.s. spaces
----------------

Tabs are more accurate than spaces to represent indentation.

Condense braces
---------------

I used to prefer

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
    if (condition)
    {
        print("braces on its own line");
    }
    else
    {
        print("shines if there are a lot of complex statements within branch");
    }
}
```

Because I use large fonts on a small screen.
I also avoid to put too many statements in if else branch.

Later I switched the later style (Allman) style.

The first (Java) style is clean for simple code, like Python.
But it becomes less clear when the parameter/conditional list goes long:

```c
if (starts_with(path, home, path_size, home_path_size) ||
    check_with(path, home, path_size, home_path_size) {
    recreate(path, home);
    return home_path_size;
} else {
    return 0;
}
```

The simple statement `return 0` in else branch is clear.
But I cannot tell whether `recreate(path, home)` belongs to the conditional list or the function body at a glance.

On the other side, I can get the whole structure at a glance with Allman style:

```c
if (starts_with(path, home, path_size, home_path_size) ||
    check_with(path, home, path_size, home_path_size)
{
    recreate(path, home);
    return home_path_size;
}
else
{
    return 0;
}
```

Also, since I use large fonts on small screen,
I can not read `if (long || next_line ) {` at once.
So the Java style requires me to move my eyes to right, then move my eyes back to next line, which is slow.
With Allman style, to get an overview of structure,
I only need to focus on the left half of the code block, and no eye movements are needed.
This makes up the wasted lines.

I guess for large screens a few wasted lines is affordable for clarity.

Maybe the Java style is suitable for a setup with small fonts on a small screen, provided the syntax highlight scheme distinguishes braces clearly?

Line length
-----------

No hard limit.

Again, since I use large fonts on a small screen, 80 is a soft limit for me.

