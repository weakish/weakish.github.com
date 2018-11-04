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

## Mithril

JavaScript 中，Mithril 框架直接使用 JavaScript 代替 HTML:

```js
m("main", [
    m("h1", {class: "title"}, "My first app"),
    m("button", "A button"),
])
```

这就意味着 JavaScript 的各种特性都可以直接用，
虽然 JavaScript 并不是一门优雅的语言，
比起 HTML 以及魔改 HTML 的模板语言，不知道高到哪里去了。

同样，JavaScript 的各种基础设施全部可以直接用，包括 IDE 的错误提示、重构，[flow] 类型检查，等等。
不需要苦等工具专门支持。

[flow]: https://flow.org

## 迁移框架

有人说，直接写 JavaScript 的话，换框架的时候改起来会累死。
其实写 HTML 换框架不用怎么改，是因为大部分写的是普通 HTML.
如果真的用模板的特性，写的稍微酷炫一点，改起来一样累死。
而且一旦有什么地方不小心忘记改了，就变 bug 了。

而直接写 JavaScript 的话，换框架或者模板其实就是代码的转换，
也就是解析一种风格的 JavaScript，生成另一种风格的 JavaScript,
或者另一种模板语言。

这都可以由程序完成，相比手工修改，不容易出错。
如果有类型系统辅助的话就更好了，会比较容易发现转换的错误。

由于复杂的逻辑通常都抽出来包成函数，
所以实际转换的是一个高度简化的 JavaScript,
猜想工作量大概和写一个 json 到 yaml 的转换器差不多吧。
而且，各种 JavaScript 的 parser 库、AST 变换的库等也可以直接使用或参考，
不用自己从头开始写。

## 思考题

Mithril 提供了属性的简写形式。
以下两段代码是等价的。

长版：

```js
m("input", {
    class: "name",
    type: "text",
    placeholder: "First name",
})
```

短版：

```js
m("input.name[type=text][placeholder=First name]")
```

问题：

1. 属性简写为 `[name=value]` 好不好？为什么？
2. `class` 简写为 `element.className` 好不好？为什么？
