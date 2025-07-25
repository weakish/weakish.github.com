# 少写些 HTML

## HTML 是文本标记语言

HTML 全称是 HyperText Markup Language, 超文本标记语言。
顾名思义，HTML 是用来标记文本的，而不是用来描述用户界面。
虽然后来进行了扩展，但为了和原本的设计兼容，仍然不善于表达用户界面。

当然了，JavaScript 本来也是用来装饰页面的，用来写一些亮晶晶的小玩意。
但是不管怎么说，JavaScript 总还是一个通用编程语言，而且 JavaScript 更新的节奏也远远超过 HTML.
所以两害相权取其轻，宁愿写 JavaScript, 也不愿意写 HTML.

实际上，真正纯粹用 HTML 的框架并不常见。
因为 HTML 太不好用了，用 HTML 的框架多少需要加点料，
比如 `*ng` (angular) 和 `v-` (vue) 属性，再比如 JSX (React).
再不然就是搞一个和 HTML 类似的模板语言。

其实这种「缝缝补补又三年」的作风，还不如干脆直接写 JavaScript 爽气。

## Kotlin 和 Ceylon 的做法

一些新冒出来的语言直接用原生的结构来表达 HTML.

比如，Kotlin 里，html 是这样写的：

```kotlin
fun result(args: Array<String>) =
    html {
        head {
            title {+"XML encoding with Kotlin"}
        }
        body {
            h1 {+"XML encoding with Kotlin"}
            a(href = "http://kotlinlang.org") {+"Kotlin"}
            p {
                for (arg in args)
                    +arg
            }
        }
    }
```

这可不是什么模板语言。这就是 Kotlin, 原生的。

Kotlin 提供这样一个语法糖：

```kotlin
f({ "一个匿名函数" })
```

可以写成

```kotlin
f { "一个匿名函数" }
```

所以 `html { ... }` 就是一个 Kotlin 函数调用，
`{}` 里面的其他 html 元素同理。

`html` 函数的定义大概是这样的这样：

```kotlin
fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}
```

大致上是初始化一个 HTML 实例。

相应的 HTML 类的定义：

```
class HTML : TagWithText("html") {
    fun head(init: Head.() -> Unit) = initTag(Head(), init)
    fun body(init: Body.() -> Unit) = initTag(Body(), init)
}
```

使用原生 Kotlin 语言表达 HTML，意味着我们可以使用所有的 Kotlin 原生语言特性，
再也不必为 HTML 模板语言表达力不足或者写法奇怪而烦恼。
同时，自然而然地保证了 HTML 模板的类型安全。

类似地，ceylon 里 html 是这样写的：

```ceylon
Html {
    doctype = html5;
    Head {
        title = "Ceylon: home page";
    };
    Body {
        H1 { "Hello `` req.queryParameter("name") else "World" `` !" }
    };
}
```

上面用到了 Ceylon 为命名参数提供的语法糖，等价于:

```ceylon
Html(doctype = html5, Head(...), Body(...))
```

`Html` 是标准库提供的类，`Html { ... }` 就是初始化，
(Ceylon 直接通过 `C()` 构造类的实例，不用 `new`)
同样是原生的 Ceylon.
这和 Kotlin 的思路是类似的。
