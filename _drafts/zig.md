# A Zig Tour

## Setup

Although Zig recommends to install the Nightly build,
I decided to install release version from package manager instead.
I am not that into the idea of using cutting edge things.

I tried to install zig via MacPorts but it failed to build:

```sh
; sudo port install zig
--->  Building zig
Error: Failed to build zig: command execution failed
```

Then I installed zig and its language server (`zls`) via Homebrew.
MacPorts does not package `zls` yet.

```sh
brew install zig zls
```



## Features

- No hidden control flow.

    such as `@property` functions in D,
    operator overloading in C++, D, and Rust,
    throw/catch exceptions in C++, D, Go,
    and macros in Rust.

- Hands off on heap allocation.

    Functions that need to allocate memory accept an allocator parameter.
    Heap allocators are provided by libraries, not built into the language itself.
    No heap allocator initialization means no heap allocation.

- Errors are values and cannot be ignored.

- Optional standard library.

    Each std lib API only gets compiled upon usage.

- Refined integration with C.

    * A simple cross-platform build system shipped with libc and package manager for C/C++ projects.
    * Directly import (with `@Import`) C types, variables, functions, and simple macros.
    * Export Zig library with the C ABI.

- Small, static, and reproducible build.

  With zig 0.11.0, under macOS 14.2.1 x86_64:

  ```sh
  ; cat src/main.zig
  const std = @import("std");

  pub fn main() !void {
    std.debug.print("hello", .{});
  }
  
  ; # build with different options
  952K	default Debug
  180K	ReleaseFast
  24K	ReleaseSmall
  20K	-O ReleaseSmall -fstrip -fsingle-threaded
  ```
  
## Targets

zig 0.11.0

- Tier 1

    * x86_64: Linux, macOS, Windows
    * aarch64: macOS
    * wasm32

- Tier 2: Some APIs of the standard library will give an "Unsupported OS" compile error.

    * BSD (FreeBSD, NetBSD, OpenBSD): x86_64
    * Windows: x86, aarch64
    * Linux: x86, aarch64, arm, mips64, mips, powerpc64, powerpc, riscv64, sparc64

## References

- [Why Zig When There is Already C++, D, and Rust?](https://ziglang.org/learn/why_zig_rust_d_cpp/)
- [In-depth Overview](https://ziglang.org/learn/overview/)
- [Zig Language Reference 0.11.0](https://ziglang.org/documentation/0.11.0/)
