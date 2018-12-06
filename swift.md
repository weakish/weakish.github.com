Exceptions
------------

Java has checked exception, essentially union type.

Kotlin dislikes Java's checked exception, and just removes it.

Ceylon also does not have checked exception, but it has union types.

Swift somehow has checked exception.
Unlike Java, a Swift function can only declare if it may throw an exception.
(Specifying `throws` in function signature.)
But it cannot specify types of exception.
Thus if the caller of the function tries to catch the exception,
it must have a default catch all clause in the end.
And since Swift only distinguish functions may throw and may not throw,
it is straightforward to map a function's throwability to optional type
(via `try?`).

IDE and editor
----------------

### CLion

Tested on Linux.

- No code highlight if code has not been compiled once.
- Code completion does [not work on import modules][CPP-5325],
    including `Foundation`.

[CPP-5325]: https://youtrack.jetbrains.com/issue/CPP-5325

### Sublime Text

- Syntax highlight: [Swift for F*ing Sublime][] has "goto symbol" support,
    better than [Swift][] (no "goto" support).

- Lint: [Sublime​Linter-contrib-swiftlint][] depends on [SwiftLint][],
    which has no Linux support yet.

- Completion:

    * [Swift​Kitten][] depends on SourceKit, which requires Mac OS X.
    * [swift-api-to-snippet][] is a command line tool
        for parsing swift files in a directory
        and outputting a `.sublime-completions` json file,
        which can then be used by Sublime Text to give completion suggestions.
    * [Swift Foundation Completions][] uses [swift-api-to-snippet][]
        to generate completions for `Foundation`.
        It has basic completions for methods and properties.

[Swift for F*ing Sublime]: https://github.com/colinta/Swift-for-f-ing-sublime
[Swift]: https://packagecontrol.io/packages/Swift
[Sublime​Linter-contrib-swiftlint]: https://github.com/mailiam/SublimeLinter-contrib-swiftlint
[SwiftLint]: https://github.com/realm/SwiftLint
[Swift Foundation Completions]: https://github.com/hatunike/Swift-Foundation-Sublime-Autocomplete-Package
[swift-api-to-snippet]: https://github.com/hatunike/swift-api-to-snippet
[SwiftKitten]: https://github.com/johncsnyder/SwiftKitten

### Vim

Vim has several plugins for Swift file type (syntax).
The only completion plugin uses SourceKit, which requires Mac OS X.
Thus vim has less support for Swift than Sublime Text on Linux.


Compilation
--------------

### Standalone distribution

```sh
; swiftc -v Sources/main.swift
Swift version 3.0 (swift-3.0-PREVIEW-1)
Target: x86_64-unknown-linux-gnu
/opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/bin/swift -frontend -c -primary-file Sources/main.swift -target x86_64-unknown-linux-gnu -disable-objc-interop -color-diagnostics -module-name main -o /tmp/main-12721f.o
/opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/bin/swift-autolink-extract /tmp/main-12721f.o -o /tmp/main-fff5e8.autolink
/usr/bin/clang++ -target x86_64-unknown-linux-gnu -Xlinker -rpath -Xlinker /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux/x86_64/swift_begin.o /tmp/main-12721f.o -L /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux --target=x86_64-unknown-linux-gnu -lswiftCore @/tmp/main-fff5e8.autolink /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux/x86_64/swift_end.o -o main
```

Change third step to:

```sh
/usr/bin/clang++ -target x86_64-unknown-linux-gnu -Xlinker -rpath -Xlinker '$ORIGIN/lib' /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux/x86_64/swift_begin.o /tmp/main-12721f.o -L lib --target=x86_64-unknown-linux-gnu -lswiftCore @/tmp/main-fff5e8.autolink /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux/x86_64/swift_end.o -o main
```

### modules

#### Swift module

##### Access level

In module file, set access level to `public`.

##### Compile module

```sh
swiftc -emit-library -emit-module -module-link-name ModuleName -gnone -O ModuleName.swift
```

##### Compile executable

```sh
swiftc -I .  -L .  hello-world.swift -o hello-world
```

But `./hello-world` gets error:

```
./hello-world: error while loading shared libraries: libxxx.so:
cannot open shared object file: No such file or directory
```

Check library path:

```sh
ldd hello-world
    ...
    libxxx.so => not found
```

Run the above compile command with `-v`:

```sh
swiftc -v -I .  -L .  hello-world.swift -o hello-world
```

Output:

```
Swift version 3.0 (swift-3.0-PREVIEW-1)
Target: x86_64-unknown-linux-gnu
/opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/bin/swift -frontend -c -primary-file hello-world.swift -target x86_64-unknown-linux-gnu -disable-objc-interop -I . -color-diagnostics -module-name main -o /tmp/hello-world-e476f6.o
/opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/bin/swift-autolink-extract /tmp/hello-world-e476f6.o -o /tmp/hello-world-706dda.autolink
/usr/bin/clang++ -target x86_64-unknown-linux-gnu -Xlinker -rpath -Xlinker /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux/x86_64/swift_begin.o /tmp/hello-world-e476f6.o -L . -L /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux --target=x86_64-unknown-linux-gnu -lswiftCore @/tmp/hello-world-706dda.autolink /opt/swift-3.0-PREVIEW-1-ubuntu14.04/usr/lib/swift/linux/x86_64/swift_end.o -o hello-worl
```

Rerun the above compile step with:

```sh
swiftc -I . -L .  -Xlinker -rpath -Xlinker . hello-world.swift -o hello-world
```
