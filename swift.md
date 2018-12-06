Exceptions
------------

Java has checked exception, essentially union type.

Kotlin dislikes Java's checked exception, and just removes it.

Ceylon also does not have checked exception, but it has union types.

Swift has something like semi-checked exception.
Unlike Java, a Swift function can only declare if it may throw an exception or not.
(Specifying `throws` in function signature.)
But it cannot specify types of exception.
Thus if the caller of the function tries to catch the exception,
it must have a default catch all clause in the end.
And since Swift only distinguish functions may throw and may not throw,
it is straightforward to map a function's throwability to optional type
(via `try?`).

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
