# Artificial Intelligence

## Prerequisites

1. Middle school level mathematics (primarily probability theory)
2. Basic programming knowledge

## Submarines and Fish

> Can machines think?
> This is similar to asking "Can submarines swim?"

-- [Dijkstra (1984)](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD898.html)

The rotation of propellers acts on water, and the reaction force of water propels the submarine to swim.
This is the principle of submarine swimming, very simple.
In fact, engineering implementation is also simple.
Submarines are complex because, as military vessels, they have additional requirements.
For example, older submarines use counter-rotating dual propellers to cancel out torque and prevent submarine turning,
while modern submarines use automatic control technology to correct submarine turning.
If we ignore these requirements and just build submarines that can swim, it's not complex.

But building mechanical fish would be troublesome.
In fact, we don't really understand the mechanism of fish swimming.
It wasn't until [2015] that quantitative research on fish swimming mechanisms (momentum balance between water and fish body) was published,
and this research was limited to only two swimming scenarios:
steady forward movement and C-start escape (fish body rapidly bends into C-shape, then flips outward for rapid swimming).

[2015]: http://aip.scitation.org/doi/full/10.1063/1.4919784

If submarines were built by finding alternative approaches when fluid mechanics hadn't yet figured out fish swimming mechanisms,
then artificial intelligence is an attempt to build thinking machines by finding alternative approaches when neuroscience hasn't yet figured out human thinking mechanisms.

## Logic and Computation

How were submarines built when the mechanism of fish swimming wasn't understood?
The specific mechanism of fish swimming wasn't clear at the time (and isn't very clear even now),
but it was relatively easy to observe that fish swim through the reaction force of water.
So, if we could find something to exert force on water, we could propel submarines through water's reaction force.
What could exert force on water?
At the time, the most common were ship oars and propellers.
Since submarines weren't powered by human force, propellers were obviously more suitable than oars.
Therefore, propellers could make submarines swim.

Similarly, the mechanism of human thinking isn't clear, but there's one characteristic of human thinking that's easy to observe:
human thinking is universal.
So, what is universal across all domains?
The most obvious answer is logic.

What is logic?
Euclidean geometry starts from axioms (propositions) and constructs proofs to derive other theorems (propositions).
The rules for constructing proofs are logic.
Creating proofs is difficult, but once a proof is constructed, verifying its correctness is easy
(verifying actual proofs isn't that easy, but this is only because actual proofs almost always contain implicit knowledge and skip intermediate steps).

If we've encountered statically typed programming languages, we find that type systems in static languages are like twins with logic:

Starting from parameters (types), constructing functions to get return values (types),
the rules for constructing functions are the type system.
Constructing functions is difficult, but once functions are constructed, verifying type correctness is easy
(it's so easy that we don't need manual verification—compilers automatically verify).

Indeed, they are twins, called the Curry-Howard correspondence.

The Curry-Howard correspondence means that computing and logic are equivalent.
In other words, anything logic can express can be converted into computation.
Since logic appears universal across all domains, problems from all domains can be converted into computation.
It seems we're already very close to artificial intelligence.
In fact, there was indeed an AI boom in the 1980s,
with Japan even claiming to build a national "Fifth Generation Computer" project, developing logic programming languages like Prolog.

Theoretically, we only need to input some knowledge, then ask the logic programming language some questions to automatically get answers.
But reality wasn't so beautiful.
Think about it: to predict tomorrow's weather, what knowledge do we need to input?
If we only input historical data, current satellite cloud images, and device-monitored values,
logic programming languages can't compute the answer.
We also need to input knowledge about how to compute answers from input data.
That is, this knowledge of how to compute answers from input data is the key to weather prediction programs,
not the logical rules that come with logic programming languages!

Even a specific application problem like weather prediction is hard to effectively convert to logical computation,
so it's even harder to convert general human thinking into logical operations.

So this path didn't work out in the end.
This approach was later called strong AI.

Of course, although strong AI failed,
the Curry-Howard correspondence inspired automated theorem proving assistance tools represented by Coq,
and incidentally solved the problem that natural language proofs almost always contain implicit knowledge and skip intermediate steps.
The ideas of logic programming also influenced the design of other programming languages.

## Search and Parsing

Since the strong AI path doesn't work,
let's not aspire to build a universal system and convert problems from various domains into forms this universal system can understand.
Instead, let's build specialized systems for specific domains—this should be easier, right?
This path is called weak AI.

In engineering, when we don't expect to solve a specific problem through a universal framework,
some seemingly "dumb" approaches often achieve good results.

For example, how do we design an intelligent customer service system?

Let's first step back to the requirements level.
The reason for needing intelligent customer service is to reduce the cost of hiring human customer service representatives.
Then we think in reverse:
suppose intelligent customer service systems don't exist—how could we reduce hiring human customer service?
Simply, let customers answer their own inquiries.

The usual approach is to prepare common questions and corresponding answers in advance.
When customers need to contact customer service, first provide links to FAQ pages.
When common questions become too numerous for one page, expand this system,
extending one FAQ page into a knowledge base composed of many pages.
Then provide a search function so customers can quickly locate relevant questions.

See, we don't necessarily need an intelligent customer service system.
What we need to do is maintain a knowledge base (Q&A collection) and design a search system.
The design and implementation of search systems is already a very mature classic problem.
Of course modern search systems are still developing, but this is mainly to address scalability and performance challenges.

Actually, many enterprises that expect customers to be good at or accustomed to searching
do exactly this:
first let customers search the knowledge base, and if they can't solve it themselves, then contact human customer service.

Good, the need to reduce human customer service is solved.
But we can't just consider cost reduction; we must also consider customer experience.
From an experience perspective, first searching the knowledge base, then contacting customer service, is two steps involving many page jumps,
which is unfriendly to customers.
Especially since customers might have already tried to solve the problem through their own experience but failed,
and the process of trying and failing might have already exhausted the customer's patience.

We notice that searching the knowledge base requires entering keywords in a search box,
while contacting customer service requires entering questions in a dialog box or text box in work orders.
So these two steps can be combined into one.
That is, let customers directly enter questions,
then the system extracts keywords from questions, searches in the background, and displays matching results below this box.
If customers find the suggested results match their problem, they can click links to view solutions.
Otherwise customers continue entering problem descriptions or directly submit questions to human customer service.

The keyword extraction here can first try the simplest text matching, matching keywords in questions.
We see that there's no artificial intelligence technology behind this,
but from the customer's perspective, they might already feel this system is somewhat intelligent.
In fact, this design is precisely called intelligent suggestions.

But don't forget an assumption we mentioned earlier: "expecting customers to be good at or accustomed to searching."
This assumption doesn't necessarily hold.

Actually, most customers of many businesses
often lack the ability or patience to refine problems they encounter into short sentences containing keywords.
At this point, intelligent customer service systems need to try analyzing customers' vague descriptions,
and when analysis fails or results aren't good enough, try guiding customers to improve their problem descriptions.

This is called natural language processing.

The previous intelligent suggestions converted problems into ready-made search problems.
Here, for natural language processing, we also want to convert it into ready-made parsing problems.
Code is just strings, and the reason it can run is that it's first parsed into structures that interpreters or compilers can understand,
then handed to interpreters or compilers for interpretation or compilation.
Similarly, natural language is also strings. If we can parse it into structures containing keywords and weights—
that is, structures search engines can understand—then we can hand it to search engines to search for answers.

It looks like we're already very close to results.
Research, design, and development of programming languages have spawned many parsing-related technologies.
We just need to extend these technologies to natural languages.

But reality is cruel.
A few hundred lines of code can complete parsers for easily parsable programming languages like Lisp,
while for programming languages that are hard to parse like Ruby, a few hundred lines of code might only complete the first step of the long march—lexical analysis (cutting strings into small pieces).
The difference seems large. But in front of natural languages, this isn't even worth looking at.
In front of natural languages, this doesn't even count as a difference.

Natural language parsing is so complex that even the first step, the most elementary lexical analysis, can't be handled.
There's no way—relying solely on various parsing technologies won't work; we can only guess a result with high success rate through other methods.

## Fitting and Markov Properties

So how should we guess?

When thinking of guessing, what's your first reaction?

Women's thoughts are so hard to guess.

Actually, guessing women's thoughts is very meaningful.
Many women prefer online shopping, and merchants all want to figure out women's thoughts to target more precise advertising.
But this problem is also quite complex, and we need to avoid being too precise as it might cause unease and backfire.
Let's find a simpler example.

What about riddles?

Riddles have natural language as both the riddle and the answer—
this is still a natural language processing problem.
Moreover, the connection between riddles and answers doesn't follow natural patterns of natural language (otherwise they'd be too easy to guess).
That is, this might be a relatively difficult problem within natural language processing.
So we won't discuss this example either.

Hey, guessing the next number—this problem should be simple enough.
Indeed, IQ tests and many job interview exams often have questions about guessing the next term given several terms of a sequence.
We know computers are very good at processing numbers. So this is likely a relatively simple problem.

How do we teach computers to guess numbers?
First, let's think about how humans guess numbers.

Humans guess the next number more by relying on intuition, or a feeling for numbers.
This is also what IQ tests and job interviews want to test.
But obviously we can't teach this intuition to computers.
In fact, it's extremely difficult to teach this intuition even to our fellow humans.

So what other ways are there to guess?
There's a commonly used method: treat the sequence as a function with natural numbers as domain,
convert known numbers into points in the Cartesian coordinate system.
Then we try to connect these points with a curve.
Finally, we see what kind of function curve this curve resembles,
construct an example of that type of function, compare the constructed curve with our drawn curve,
gradually adjust the function definition to make the constructed function's curve fit the drawn curve,
that is, fit the known numbers.
This process is called curve fitting.

Therefore, we just need to make computers fit curves.
So how should computers fit curves?
The simplest is brute force search—try applying known functions one by one.
For IQ tests, this brute force method might be good enough.
But this is only because IQ test question banks aren't large enough.
Real situations aren't as simple as IQ tests.
For example, these numbers might be experimental observation results, and there might not be any question bank to apply.
Then brute force search obviously won't work.

So what do we do?
We can try adding some constraints to reduce dead ends (pruning).
For example, we can assume that any number in the sequence only depends on the number before it.
Then we can guess in groups of two,
so the adjacent-term function we try to fit is a univariate (single-parameter) function, greatly reducing the scope.
More importantly, because it only depends on the previous number without considering earlier numbers,
we can directly send each group of numbers to different processors to run, rather than passing the entire sequence,
when there are many known numbers (reality isn't IQ test questions—data can be very, very large),
this distributed fitting can greatly speed up progress.

We try to generalize this number-guessing approach to more general situations.
We abstract these numbers into mathematical structures (data structures in programming languages) representing some state,
correspondingly, we abstract guessing the next number into guessing the probability of the next state occurring.
Thus we get the Markov property from probability theory.

Of course, this assumption might be too strong, making some sequences hard to fit.
For example, the Fibonacci sequence doesn't fit the assumption that "it only depends on the number before it" at all.
Then we can extend the Markov property.
For the Fibonacci sequence, we can construct a new sequence
where each member is a pair of adjacent terms from the Fibonacci sequence:

```haskell
[1, 1, 2, 3, 5, 8, 13 ..] # Fibonacci sequence
[(1, 1), (1, 2), (2, 3), (3, 5), (5, 8), (8, 13) ..] # New sequence
```

Obviously, this new sequence satisfies the Markov property,
correspondingly, the Fibonacci sequence is a second-order Markov sequence.

Similarly, we can construct a new sequence
where each element is a tuple of n elements from the original sequence,
thus extending the Markov property to n-th order.
Based on computational complexity considerations, third-order Markov structures are commonly used in engineering.

To summarize the general approach to guessing:

1. Collect and accumulate large amounts of data
2. Represent this data as mathematical structures (data structures) convenient for guessing
3. Fit based on the structures obtained in the previous step
4. Appropriately simplify to reduce computational complexity

Collecting statistics on data, representing data, then appropriately simplifying, fitting data to guess a high-probability answer—this is called machine learning.

## 概率和贝叶斯定理

上面我们提到了机器学习是通过拟合来猜测答案，实际上，机器学习同时也通过猜测的答案来更好地拟合。

考虑过滤垃圾邮件这个例子。
一方面我们统计邮件中某些词语在正常邮件和垃圾邮件中出现的频率，
根据两者的不同推断一封新邮件是正常邮件还是垃圾邮件，
另一方面，我们又利用推断的结果反过来推断某些词语在正常邮件和垃圾邮件中出现的频率。
这样，这个系统分类的邮件越多，识别效果就越好。

抽象一下，
我们根据历史数据统计某一特征 f 在分类 S 和 N 中出现的概率
(`pSucc f S`和`pSucc f N`)，
据此推断新数据属于 S 还是 N.
同时，我们根据新数据的分类，
推断分类为 S 和 N 的数据具有特征 f 的概率(`pSucc S f`和`pSucc N f`),
并进而调整 `pSucc f S` 和 `pSucc f N` 的值。

那么这个学习过程其实是辗转计算`pSucc f S`和`pSucc S f`这一组概率
(`N`的情况同理)。

那`pSucc f S`和`pSucc S f`有什么关系呢？

我们尝试代入一个具体的例子来摸索一下。
假设`f`代表邮件中出现了「正规发票」这个词，
而`S`代表这封邮件是垃圾邮件。
那么，直觉上，我们有：

1. 包含「正规发票」这个词的邮件是垃圾邮件的概率越大，相应地，垃圾邮件中包含「正规发票」这个词的概率也越大
2. 包含「正规发票」这个词的邮件是垃圾邮件的概率和垃圾邮件中包含「正规发票」这个词的概率并不相等
3. 包含「正规发票」这个词的邮件是垃圾邮件的概率大于垃圾邮件中包含「正规发票」这个词的概率

抽象上述表述，我们得到：

```haskell
pSucc f S = coefficient * (pSucc S f) -- coefficient > 0
pSucc f S /= pSucc S f
pSucc f S > pSucc S f
```

一般地，`f`和`S`可以认为是两个先后发生的事件，
`pSucc f S`可以认为是`f`发生后`S`发生的概率（这叫做条件概率或后验概率），
`pSucc S f`同理。

交换`f`和`S`, 我们得到：

```haskell
pSucc S f = coefficient * (pSucc f S) -- coefficient > 0
pSucc S f /= pSucc f S
pSucc S f > pSucc f S
```

我们看到，前 2 条没问题，第 3 条出现了矛盾。
这说明前面我们抽象不当，`f`和`S`并不是一般的两个事件，
`f`和`S`还具有一些我们没有考虑的隐含性质。

回头看我们的直觉：

> 包含「正规发票」这个词的邮件是垃圾邮件的概率大于垃圾邮件中包含「正规发票」这个词的概率

这一条背后其实有一个假设：

> 碰到包含「正规发票」这个词的邮件的概率要小于碰到垃圾邮件的概率。

也就是说，`p f < p S`.

假设`p f`不为 0, 稍加变形，我们得到 `(p S) / (p f) > 1`.

然后我们再将`f`和`S`抽象为一般事件，那么我们可以用`(p S) / (p f)`来表示

```haskell
pSucc f S = coefficient * (pSucc S f)
```

中的系数`coefficient`，这样，当`p f < p S`的时候，
就有`pSucc f S > pSucc S f`,
反之，当`p f > p S`的时候，`pSucc f S < pSucc S f`.

这样我们就得到了`pSucc f S`和`pSucc S f`的关系：

```haskell
pSucc f S = ((p S) / (p f)) * (pSucc S f)
```

显而易见，互换`f`和`S`没问题(假设`p S`不为 0)。

既然`f`和`S`是一般事件，我们不妨用`a`和`b`替换它们，以凸显其一般性：

```haskell
pSucc a b = ((p b) / (p a)) * (pSucc b a)
```

贝叶斯在 18 世纪发现了上面这个公式，因此它被称为贝叶斯定理(Bayes' theorem).
之所以称为定理，是因为贝叶斯是基于条件概率的定义推导出这个公式的。
我们认为贝叶斯定理足够简单，因此跳过条件概率的定义直接讲贝叶斯定理。

回到垃圾邮件过滤的问题，前面我们提到：

> 一方面我们统计邮件中某些词语在正常邮件和垃圾邮件中出现的频率，
> 根据两者的不同推断一封新邮件是正常邮件还是垃圾邮件，

这和贝叶斯定理有些差距。
也就是说，实际上我们没有直接统计`p f`，而是分别统计了`pSucc N f`和`pSucc S f`.
由于我们的分类系统不考虑无法判定的情况，因此一封邮件要么是正常邮件，要么是垃圾邮件，
也就是说，`p N + p S = 1`.
同时，既然`pSucc N f`表示已知一封邮件是正常邮件时，它具有特征`f`的概率，
那么一封正常邮件具有特征`f`的概率就是`(p N) * (pSucc N f)`.
同理，一封垃圾邮件具有特征`f`的概率就是`(p S) * (pSucc S f)`.
因此一封邮件具有特征`f`的概率为：

```haskell
p f = (p N) * (pSucc N f) + (p S) * (pSucc S f)
```

由此我们得到贝叶斯定理的一个变体，如果我们定义：

```haskell
p -b = 1 - (p b)
```

那么贝叶斯定理就可以表述为：

```haskell
pSucc a b =
    (p b) * (pSucc b a) /
    ((p b) * (pSucc b a) + (p -b) * (pSucc -b a))
```

垃圾邮件过滤系统不可能只检查一个词，
因此我们尝试推广到多个特征的情况：

```haskell
pSucc [f1, f2 .. fn] S =
    (p S) * (pSucc S [f1, f2 .. fn]) / (p [f1, f2 .. fn])
```

其中，`p S`和`p [f1, f2 .. fn]`都很容易统计，
而`pSucc S [f1, f2 .. fn]`的计算复杂度很高，
特别是，`S`中同时具有`[f1, f2 .. fn]`的样本可能很少（稀疏），
那训练的效果就很差了。
那怎么办呢？
上一节我们假设结构具有马尔可夫性质，化简了问题，
这里我们也可以假设`[f1, f2 .. fn]`的每一项都是独立事件。
这样，`pSucc S [f1, f2 .. fn]`就可以化简为

```haskell
(pSucc S f1) * (pSucc S f2) * .. * (pSucc S fn)
```

这样我们就只需要独立计算分类为`S`的情况下具有某一个特征的概率了，
避免了样本稀疏的问题，
同时，和上一节用马尔可夫结构化简一样，每一项都可以分布式地跑。

上面的式子中，如果某一项没有出现过，
也就是说，分类为`S`的情况下训练集的数据中不存在具有某特定特征的样本，
那一项的条件概率会为 0, 从而导致最后相乘的结果为 0, 也就是将其他各项的概率消除。
为了避免这个问题，我们可以强行将概率为 0 的项修正为一个小概率，比如 0.01,
具体数值无关紧要，因为以后如果训练集中新增了相应的样本，这个概率会自动得到修正的。
当然，这样有点粗暴。更合理的做法是所有的样本数都加 1, 并相应增加总数，
这样原本为 0 的样本数就变为 1, 避免了概率为 0 的情况。
因为训练集一般都很大，所以样本数加 1 没什么影响。
这种做法称为拉普拉斯平滑(Laplacian Smoothing).
当然，如果有必要，也可以改为加上一个小于 1 的正数。

和马尔可夫性质不一定成立一样，`[f1, f2 .. fn]`的每一项都是独立事件，
这个假设也不一定成立。
因此这个算法叫做幼稚贝叶斯分类器或者朴素贝叶斯分类器
(Naive Bayes classifier).
这个名称就是强调独立事件的假设不一定成立。

尽管独立事件的假设常常是不准确的，但幼稚贝叶斯在实际工程中出乎意料地好用。
因为很多应用并不在乎精确的类概率，只关心最后的分类结果。
比如垃圾邮件过滤，只需要判断是否是垃圾邮件，
并不需要在用户界面显示「本邮件有 87.53% 的概率是垃圾邮件」之类的信息。

## 贝叶斯网络和神经网络

然而，当特征之间相关性比较强，而我们又要求比较精确的类概率的时候，幼稚贝叶斯就不够用了。

也就是说，下面的式子里`p [f1, f2 .. fn]`不好算了。

```haskell
pSucc [f1, f2 .. fn] S =
    (p S) * (pSucc S [f1, f2 .. fn]) / (p [f1, f2 .. fn])
```

回顾一下，如果`[f1, f2 .. fn]`是独立事件，那我们有：

```haskell
p [f1, f2 .. fn] =
    (p f1) * (p f2) * .. * (p fn)
```

现在每一项特征的概率可能受其他特征的影响。
假设有一个函数`pp`可以表达这些影响

```haskell
p [f1, f2 .. fn] =
    (pp f1) * (pp f2) * .. * (pp fn)
```

那么问题就在于`pp`是如何定义的？
既然`pp`表达的是某一事件受其他事件的影响，那`pp`就可以用条件概率来定义：

```haskell
pp f = pSucc (influenced f) f
```

对于给定的特征`f`，我们找出所有影响它的特征`[inf1, inf2 .. infn]`：

```haskell
influenced f =
    pSucc [inf1, inf2 .. infn] f
```

`pSucc [inf1, inf2 .. infn] f`这看起来是不是很熟悉？
我们上面讨论幼稚贝叶斯的时候提到的是`pSucc [f1, f2 .. fn] S`.
这两者的结构是一样的。

因此，这其实是一个递归调用幼稚贝叶斯分类器的问题。

基于同样的思路，我们可以处理`(pSucc S [f1, f2 .. fn])`.

不过实际工程中，因为数据量很大，递归调用贝叶斯分类器是吃不消的。
所以为了降低计算复杂度，我们需要进行一些简化：

0. 当影响程度很低时，我们直接忽略，视为独立事件。
1. 类似马尔可夫性质，我们只考虑直接影响给定特征`f`的特征，不考虑间接影响。例如，`pinf1`可能通过影响`inf1`来间接影响`f`，这种情况不考虑。
2. 当我们考虑影响给定特征`f`的特征时，假定这些影响`f`的特征是相互独立事件。

当然，如果有必要，上面的简化也可以放宽，以提高计算复杂度为代价，获得更准确的估计。

进行上述简化后，我们得到了贝叶斯网络(Bayesian network).
之所以称为贝叶斯网络，是因为特征间的相互影响关系，我们用有向无环图(DAG)来表示。
而特征对给定特征的具体影响程度，我们用条件概率表(CPT)来表示。
其中，特征间的相互影响关系，也就是DAG的构建，依赖于经验或领域知识。
条件概率表，则可以用幼稚贝叶斯来改进。


贝叶斯网络就介绍到这里。
现在我们换个思路，不从条件概率和贝叶斯定理入手，而从打分的角度来分类。
假设数据具有特征`[f1, f2 .. fn]`，每个特征对应一个分值（权重），
我们把这些特征的分数加起来，得到一个总分，然后和一个目标分数（阈值）比较，
大于阈值结果为1，否则结果为0。

```haskell
f [f1, f2 .. fn] =
    if (w1 * f1 + w2 * f2 + ... + wn * fn > t) then
        1
    else
        0
```

这个函数`f`叫做感知器(perceptron)。
感知器的定义，受到了神经元的启发。
感知器接受多个输入，返回一个布尔值，
就像神经末梢接受外部的输入，决定是否激动。

我们注意到，感知器主要的工作是计算一个多项式的值：

```haskell
w1 * f1 + w2 * f2 + ... + wn * fn
```

那么从直觉上，线性不可分的问题，比如异或(XOR)函数，就无法转化成感知器的形式。

但实际上，感知器并没有这么弱，将感知器组合一下，就可以表达异或函数。

我们准备两个阈值为 0 的感知器，一个是`x-y`, 另一个是`-x+y`，
将输入分别发给这两个感知器：

| 输入 | x-y | -x+y | 输出 |
| - | - | - | - |
| (1, 0) | 1 | 0 | (1, 0) |
| (0, 1) | 0 | 1 | (0, 1) |
| (0, 0) | 0 | 0 | (0, 0) |
| (1, 1) | 0 | 0 | (0, 0) |

然后再将输出提供给一个阈值为 0 的`x+y`感知器：

| 输入 | 中间结果 | 最终输出 |
| - | - | - |
| (1, 0) | (1, 0) | 1 |
| (0, 1) | (0, 1) | 1 |
| (0, 0) | (0, 0) | 0 |
| (1, 1) | (0, 0) | 0 |

比较输入和最终输出，可以看到我们的这三个感知器运算的结果是符合异或的定义的。

这里，前两个感知器(`x-y`和`-x+y`)是第一层，最后一个感知器(`x+y`)是第二层。
由此我们看到，通过组合感知器，可以构成一个分层的神经网络，
分层的神经网络可以解决线性不可分问题。

但是感知器还是看起来很弱啊。
异或函数这么简单的问题，都要三个感知器，两层网络才能搞定。
而稍微正常一点的编程语言，异或函数都能很直接地定义。
我们何必要自废武功用感知器和神经网络呢？这不是自虐吗？

实际上，感知器和神经网络看起来很弱，但它也有优点：

1. 感知器的「接口」很齐整，每个感知器都有多个输入，返回一个结果，这就使得它们组合起来很容易。

2. 感知器内部都是在进行多项式运算，而不像普通函数一样千变万化，因此优化起来很容易（特别是现在我们有很强劲的 GPU）。

3. 感知器的运算结果只取决于它的输入，因此可以很容易地以分布式的方式跑。

4. 上面那个例子中`x-y`, `-x+y`, `x+y`的确定，来自于我们对异或函数的理解。假设我们对异或函数一无所知，感知器的结构决定了，我们比较容易通过暴力的方式来尝试各种权重和阈值。相反，我们不太可能通过暴力的方式生成字符串恰巧撞对异或函数的一般定义。

5. 神经网络分层的结构，意味着我们可以逐层尝试，来逼近预期的结果。

看起来，神经网络还是有它的优势的。
不过还是觉得不怎么靠谱呀。
神经网络看起来像是在我们不知道怎么猜比较好的情况下的一种暴力的猜法。
这不是乱枪打鸟吗？
相反，贝叶斯网络也是猜，可是背后有概率论这样坚实的基础，出了错也比较容易找到原因，
而不像神经网络基本是一个黑盒子。

但是，别忘了贝叶斯网络特征间的联系，那个有向无环图的构建，是依赖领域知识的。
如果这个领域缺乏足够的研究，没有人能构建足够好的有向无环图，
或者这个领域只有极少数专家才了解，而那些专家没有时间或兴趣来构建那个有向无环图，
那贝叶斯网络就发挥不了它的威力。

相反，神经网络对领域知识的要求要低很多。
对领域知识的低要求，对神经网络来说，算是「一招鲜，吃遍天」了。
而随着计算力的提升，粗暴堆料的成本越来越低，神经网络也就越来越受重视。

当然，贝叶斯网络和神经网络并不是互斥的，有时两者可以结合使用。
当计算量非常大的时候，神经网络暴力尝试的效果可能不太好。
这时我们可以借助贝叶斯网络来更精准地调节神经网络的参数。

另外，以上只是神经网络的基本原理。实际使用的神经网络要复杂很多。

比如，我们的感知器只能输出 0 或者 1,
而既然是暴力尝试，那我们就希望整个网络对参数的调整敏感一点。
这时候我们就不再比较多项式的值和阈值来输出 0 或者 1，
而是将阈值转化成偏置加到多项式上，
并使用一个激活函数对多项式的结果进行处理，
得到一个浮点数。
最简单的激活函数是 ReLU, 定义很简单 `max 0 n`.
类似朴素贝叶斯，ReLu 虽然简单，但出奇地好用。

另外，实际使用的神经网络，无论是规模还是结构都非常复杂。

## 总结

强人工智能时代企图基于通用的逻辑表示一切人类的思考活动，这一尝试失败了。
人工智能的研究方向从通用的逻辑转移到专门领域的特定问题。
而即使专门领域的特定问题，也往往要借助机器的蛮力（统计）来猜。
从贝叶斯网络到神经网络，猜测的方法越来越暴力，也越来越依赖机器的蛮力。
而高度依赖机器的蛮力的神经网络，却成为一种解决各个领域机器学习问题的通用范式。
优雅的逻辑没能达到通用智能，而暴力的神经网络反倒在不断增长的算力的支持下朝着通用的方向前进。
也算是出人意料的展开呢。
