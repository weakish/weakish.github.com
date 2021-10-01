# Tinygo

[Tinygo] is a Go compiler for microcontrollers and WebAssembly.
It also supports x86 32 bit and 64 bit Linux.

[Tinygo]: https://tinygo.org

## Getting Started

### Install

```sh
sudo apt install llvm-7-dev libclang-7-dev
go get -u github.com/tinygo-org/tinygo
```

### Usage

To compile a Linux executable:

```sh
tinygo build -o hello_tiny hello.go
```

The output size of a hello world program is very impressive to me:

```sh
1.1M    hello
12K     hello_tiny
```

Or run it directly:

```sh
tinygo run hello.go
```

## Go Language Features

Not supported:

- Maps.
- Concurrency.
- Reflection.
- Cgo.
- Many parts of standard library (due to the above missing pieces).
- `recover()`
- `complex64`, `complex128`, and arithmetic on complex numbers.
- `defer` a call on a function pointer.
- 3-index slicing, e.g. `slice = array[2:4:7]`.