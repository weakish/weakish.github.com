# 这里并不是 blog

## blog 是 log

blog 是 web log 的简写。
不管是原形，还是简写，都有 log 一词。
顾名思义， blog 还是适合 log 性质的东西。

比如：

> 在乌镇「互联网之光」的展厅里逛到乐视的展台，
> 居然真看到一辆自行车。
> 我一边感叹我实在不明白乐视为什么连自行车都做，
> 一边忍不住想骑上去试试。
> 未遂，因为右边那个脚蹬子已经不知所踪。

-- [王兴](https://fanfou.com/statuses/KjjnG6FpCFo)

再比如：

> 昨天数据库遇到了一个 X 问题，
> 损失了 Y 时间段内的 Z 数据。
> A-F 功能不受影响。
> R 时刻监测系统报告了问题后，
> 我们进行了如下排查，...
> 定位到是 S 造成了 X 问题。
> 我们使用 T 修正了问题，
> 同时尝试通过 I-K 恢复数据，
> 分别取得了如下效果，...
> 但 Y 时间段内的 Z 数据还是丢失了。
> 这个事故暴露了我们系统中的 O-Q 缺陷，
> 我们将采取 U-V 措施避免以后出现同类事故。

-- 莫须有应用

## 被滥用的 blog

### 别忘了滥用的代价

滥用无罪。
但滥用基本上总是有代价的。

比如，HTTP 的 GET 方法可以滥用为 POST,
只要把 POST 的内容编码进请求的 url 就可以了。
看起来效果不错，服务端可以偷懒，只实现 GET 方法，不用实现 POST 方法了。
但是 GET 是为「读」设计的，滥用 GET 来「写」当然有代价。
很容易想到的代价是可能超过 url 的长度限制，
缓存、代理可能出问题。

同样，滥用 blog 来承载非 log 性质的内容，
可能让人忽视以下代价：

1. 内容可能和代码一样，是需要维护的
2. 内容可能和 log 不一样，按时间排序并不是最佳选择

### 发到 blog 上并不能改变内容的性质

甲月乙日，我配置了一台服务器，事后把流程记录下来，发到 blog 上。

丙月丁日，我学习了如何使用 GitHub, 同样把学习所得发到 blog 上。

某年某月某日，我记录了我做了什么事，这不就是 log 么？

那可不一定。

如果是这样的：

> 丙月丁日，学习如何使用 GitHub.

这是 log.
实际上没有 blog 的年代，日记就是这么写的。

当然，有时候日记不是这么干巴巴的：

> 昨天我发现 GitHub 开放注册了。
>
> 其实以前 M 曾问过需不需要 GitHub 的邀请，
> 我不怎么感冒。
> Gitorious 不需要邀请就能注册，整个平台也是开源的，
> 我用 Gitorious 用得好好的，
> 既然 GitHub 想控制新用户增长的速度，
> 我又何苦去凑这个热闹呢？
>
> 现在既然 GitHub 开放注册了，
> 而且我看到 X、Y、Z 项目的仓库都放在 GitHub 上，
> 那我也去注册一个账户吧。

这同样也是 log.

但下面的并不是 log:

> 首先，在本地建立一个 git 仓库：
>
> (一些命令)
>
> 接着，生成 ssh 密钥：
>
> (一些命令)
>
> 在 GitHub web 界面粘贴刚刚生成的公钥：
>
> (下略)

这其实是文档、说明书、手册、小抄，而不是 log.
把这样的东西发到 blog 上，并不意味着它就不需要维护了。

比如：

- git 新版本可能提供更加友好的 UI,
- ssh 新版本可能提供更安全的算法，
- GitHub 可能开发了命令行客户端，提交公钥不用去 web 界面了。

即使一些比较「虚」的内容，看上去属于「感想」性质的内容，
也不一定就属于 log 了，

比如一篇题为「我看 Java 和 PHP」的「blog」，
假如里面写到了 lambda 和类型标注，
那么 Java 8 引入了 lambda, PHP 7 引入了函数参数和返回值的类型标注，
相应的这篇「blog」就需要更新。
这个维护工作是逃不掉的。
即使当初严谨一点，把题目改成「我看 Java 7 和 PHP 5.5」，也逃不掉的。
要不要升到 Java 8 或者 PHP 7?
如果升级，是不是坚持不用新特性？
如果不能避免升级，不能避免使用新特性，那就不能避免维护这篇「blog」.
所以，很明显，其实这篇并不是「blog」.

当然了，也可以另起炉灶，重新写一篇。
实际上，很多「blog」就是这样「维护」的。
原本的内容已经过时了，没有人维护。
于是被其他人重新写的「blog」代替了。
这也算是一种「维护」，
可这种「维护」方式不太合理：

1. 老的内容流传广泛，可能比新内容更容易找到，也许读者会被其中过时的内容误导。
2. 每过一段时间就另起炉灶是一种浪费。

## 自然语言和程序一样是写给人看的

> 很多人头脑里清晰的程序设计原则，一遇到“写脚本”这样的任务就完全崩溃了似的，
> 他们仿佛认为写脚本就是应该“松散”一些。
> 很多平时写非常聪明的程序的人，
> 到了需要处理“系统管理”任务的时候，就开始写一些 shell 脚本，或者 Perl 脚本。
> 他们写这些脚本的时候，往往完全的忘记了程序设计的基本原则，
> 例如“模块化”，“抽象”等等。

-- [王垠](http://www.yinwang.org/blog-cn/2013/03/29/scripting-language)

滥用 blog 的问题是类似的。
日记松散一点很正常，
可是把不是 log 的内容当成 blog, 就容易写出不容易维护的东西。

自然语言往往不如程序语言精确，但程序设计的很多原则一样适用。

想象一下这样一个项目：

1. 代码不是按模块划分的，全部代码文件都挤在一个目录下，按编写的先后顺序排列
2. 有些文件有一些标签，但项目并不提供组合搜索标签的功能，只能按单个标签查看
3. 代码的修改没有记录，有时作者会在文件里记录一下
4. 代码的修改不是靠补丁，而是靠线性排列的「评论」，由作者手工合并
5. 过了一段时间后，无法提交「评论」了

显而易见，这样的项目是不好维护的。

然而很多 blog 系统就是这样的项目。
当然，这些 blog 系统用来处理 log 性质的内容并没有什么大问题。
但是当这样的 blog 系统被滥用来承载非 log 的内容时，就可能带来各种麻烦。

回到上文提到的例子：

> 甲月乙日，我配置了一台服务器，事后把流程记录下来，发到 blog 上。

> 丙月丁日，我学习了如何使用 GitHub, 同样把所学发到 blog 上。

如果里面都涉及到生成 ssh 密钥, 那我完全可以把这部分内容抽出来，单写一篇，
让另外两篇引用它。
以后再有别的文档涉及到生成 ssh 密钥，我都可以直接引用。
如果打算把生成的算法从 rsa 改成 ed25519, 也只需要改动一处。
这些和编程的原则是一模一样的。

其实，编程时常常是直接引用第三方的库。
同理，如果我找到一篇很好的生成 ssh 密钥的文档，我完全可以直接引用，不必自己写。
当然，编程中相反的情况也是有的，有时候不想因为一个小函数引入第三方依赖，就自己写。
同样地，有的时候内容不长，为了文档的完整性，避免阅读时太多跳转，也可以自己写。

类似地：

- 传统的树形结构有时比标签更适合组织内容，

    就像章节往往更适合单本书，而标签更适合分类一大堆书。

- git 等管理代码的工具一样很有用，

    包括历史、分支、diff 等。

- 补丁, issue 和 pull request 一样可以用于协作。

    所以这里没有提供一个写评论的框，而页脚有指向 GitHub issue 的链接。

## 总结

1. blog 系统还是适合放 log 性质的内容。
2. 需要维护的内容总是需要维护的，发到 blog 上并不能避免维护。
3. 编程的经验一样可以应用于自然语言，降低维护的成本。