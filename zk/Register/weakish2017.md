weakish (Sep 11, 2023). Introduction to Artificial Intelligence.

---

# Introduction to Artificial Intelligence

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
For example, older submarines use counter-rotating dual propellers to cancel out torque and prevent the submarine from turning,
while modern submarines use automatic control technology to correct unwanted turning.
If we ignore these requirements and just build submarines that can move underwater, it's not complex.

But building mechanical fish would be troublesome.
In fact, we don't really understand the mechanism of fish swimming.
It wasn't until [2015] that quantitative research on fish swimming mechanisms (momentum balance between water and fish body) was published,
and this research was limited to only two swimming scenarios:
steady forward movement and C-start escape (fish body rapidly bends into a C-shape, then flips outward for rapid acceleration).

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

Starting from parameters (types) and constructing functions to get return values (types),
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
some seemingly "naive" approaches often achieve good results.

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
often lack the ability or patience to distill problems they encounter into short sentences containing keywords.
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

Natural language parsing is so complex that even the first step, the most elementary lexical analysis, can't be handled reliably.
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
We know computers are very good at processing numbers, so this is likely a relatively simple problem.

How do we teach computers to guess numbers?
First, let's think about how humans guess numbers.

Humans guess the next number more by relying on intuition, or a feeling for numbers.
This is also what IQ tests and job interviews want to test.
But obviously we can't teach this intuition to computers.
In fact, it's extremely difficult to teach this intuition even to our fellow humans.

So what other ways are there to guess?
There's a commonly used method: treat the sequence as a function with natural numbers as the domain,
convert known numbers into points in the Cartesian coordinate system.
Then we try to connect these points with a curve.
Finally, we see what kind of function this curve resembles,
construct an example of that type of function, compare the constructed curve with our drawn curve,
and gradually adjust the function definition to make the constructed function's curve fit the drawn curve—
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
We abstract these numbers into mathematical structures (data structures in programming languages) representing some state;
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
thus extending to n-th order Markov processes.
Based on computational complexity considerations, third-order Markov structures are commonly used in engineering.

To summarize the general approach to guessing:

1. Collect and accumulate large amounts of data
2. Represent this data as mathematical structures (data structures) convenient for guessing
3. Fit based on the structures obtained in the previous step
4. Appropriately simplify to reduce computational complexity

Collecting statistics on data, representing data, then appropriately simplifying and fitting data to guess a high-probability answer—this is called machine learning.

## Probability and Bayes' Theorem

Above we mentioned that machine learning guesses answers through fitting. Actually, machine learning also improves fitting through guessed answers.

Consider the example of filtering spam emails.
On one hand, we count the frequency of certain words appearing in normal emails and spam emails,
inferring whether a new email is normal or spam based on the differences between the two.
On the other hand, we use the inference results to conversely infer the frequency of certain words appearing in normal emails and spam emails.
This way, the more emails this system classifies, the better its recognition becomes.

Abstractly speaking,
we count the probability of a feature f appearing in classifications S and N based on historical data
(`pSucc f S` and `pSucc f N`),
and use this to infer whether new data belongs to S or N.
Meanwhile, we use the classification of new data
to infer the probability that data classified as S and N have feature f (`pSucc S f` and `pSucc N f`),
and then adjust the values of `pSucc f S` and `pSucc f N`.

So this learning process is actually alternately calculating the group of probabilities `pSucc f S` and `pSucc S f`
(the case for `N` is similar).

So what's the relationship between `pSucc f S` and `pSucc S f`?

Let's try substituting a concrete example to explore this.
Suppose `f` represents the appearance of the phrase "legitimate invoice" in emails,
and `S` represents that this email is spam.
Then, intuitively, we have:

1. The greater the probability that emails containing "legitimate invoice" are spam, correspondingly, the greater the probability that spam emails contain "legitimate invoice"
2. The probability that emails containing "legitimate invoice" are spam is not equal to the probability that spam emails contain "legitimate invoice"
3. The probability that emails containing "legitimate invoice" are spam is greater than the probability that spam emails contain "legitimate invoice"

Abstracting the above statements, we get:

```haskell
pSucc f S = coefficient * (pSucc S f) -- coefficient > 0
pSucc f S /= pSucc S f
pSucc f S > pSucc S f
```

Generally, `f` and `S` can be considered as two events occurring in sequence,
`pSucc f S` can be considered as the probability that `S` occurs after `f` occurs (this is called conditional probability or posterior probability),
and `pSucc S f` is similar.

Swapping `f` and `S`, we get:

```haskell
pSucc S f = coefficient * (pSucc f S) -- coefficient > 0
pSucc S f /= pSucc f S
pSucc S f > pSucc f S
```

We see that the first 2 conditions are fine, but the 3rd creates a contradiction.
This shows that our abstraction was inappropriate—`f` and `S` are not general events;
`f` and `S` have some hidden properties we haven't considered.

Looking back at our intuition:

> The probability that emails containing "legitimate invoice" are spam is greater than the probability that spam emails contain "legitimate invoice"

This statement actually has an underlying assumption:

> The probability of encountering emails containing "legitimate invoice" is less than the probability of encountering spam emails.

That is, `p f < p S`.

Assuming `p f` is not 0, with slight transformation, we get `(p S) / (p f) > 1`.

Then abstracting `f` and `S` as general events, we can use `(p S) / (p f)` to represent the coefficient in

```haskell
pSucc f S = coefficient * (pSucc S f)
```

This way, when `p f < p S`, we have `pSucc f S > pSucc S f`,
conversely, when `p f > p S`, we have `pSucc f S < pSucc S f`.

Thus we get the relationship between `pSucc f S` and `pSucc S f`:

```haskell
pSucc f S = ((p S) / (p f)) * (pSucc S f)
```

Obviously, swapping `f` and `S` is fine (assuming `p S` is not 0).

Since `f` and `S` are general events, we might as well replace them with `a` and `b` to highlight their generality:

```haskell
pSucc a b = ((p b) / (p a)) * (pSucc b a)
```

Bayes discovered this formula in the 18th century, so it's called Bayes' theorem.
It's called a theorem because Bayes derived this formula based on the definition of conditional probability.
We consider Bayes' theorem simple enough, so we skip the definition of conditional probability and directly discuss Bayes' theorem.

Returning to the spam email filtering problem, we mentioned earlier:

> On one hand, we count the frequency of certain words appearing in normal emails and spam emails,
> inferring whether a new email is normal or spam based on the differences between the two.

This differs somewhat from Bayes' theorem.
That is, we didn't directly count `p f`, but separately counted `pSucc N f` and `pSucc S f`.
Since our classification system doesn't consider undecidable cases, an email is either normal or spam,
that is, `p N + p S = 1`.
Meanwhile, since `pSucc N f` represents the probability that an email has feature `f` given that it's normal,
the probability that a normal email has feature `f` is `(p N) * (pSucc N f)`.
Similarly, the probability that a spam email has feature `f` is `(p S) * (pSucc S f)`.
Therefore, the probability that an email has feature `f` is:

```haskell
p f = (p N) * (pSucc N f) + (p S) * (pSucc S f)
```

From this we get a variant of Bayes' theorem. If we define:

```haskell
p -b = 1 - (p b)
```

Then Bayes' theorem can be stated as:

```haskell
pSucc a b =
    (p b) * (pSucc b a) /
    ((p b) * (pSucc b a) + (p -b) * (pSucc -b a))
```

Spam email filtering systems can't just check one word,
so we try to generalize to multiple features:

```haskell
pSucc [f1, f2 .. fn] S =
    (p S) * (pSucc S [f1, f2 .. fn]) / (p [f1, f2 .. fn])
```

Here, `p S` and `p [f1, f2 .. fn]` are both easy to count,
while `pSucc S [f1, f2 .. fn]` has high computational complexity.
Especially when samples in `S` that simultaneously have `[f1, f2 .. fn]` might be few (sparse),
training effectiveness becomes poor.
What to do?
In the previous section we assumed structures have Markov properties, simplifying the problem.
Here we can also assume each item in `[f1, f2 .. fn]` is an independent event.
This way, `pSucc S [f1, f2 .. fn]` can be simplified to

```haskell
(pSucc S f1) * (pSucc S f2) * .. * (pSucc S fn)
```

This way we only need to independently calculate the probability of having a specific feature given classification `S`,
avoiding the sparse sample problem.
Meanwhile, like the previous section's simplification using Markov structures, each item can be computed in parallel.

In the above formula, if some item hasn't appeared,
that is, if no samples in the training set classified as `S` have a specific feature,
that item's conditional probability would be 0, making the final multiplication result 0, eliminating the probabilities of other items.
To avoid this problem, we can forcibly correct items with probability 0 to a small probability, say 0.01.
The specific value doesn't matter because if corresponding samples are later added to the training set, this probability will be automatically corrected.
Of course, this is somewhat crude. A more reasonable approach is to add 1 to all sample counts and correspondingly increase the total,
so originally 0 sample counts become 1, avoiding probability 0 situations.
Since training sets are generally large, adding 1 to sample counts has little impact.
This approach is called Laplacian Smoothing.
Of course, if necessary, you can also add a positive number less than 1.

Like how Markov properties don't necessarily hold, the assumption that each item in `[f1, f2 .. fn]` is an independent event
also doesn't necessarily hold.
Therefore, this algorithm is called the Naive Bayes classifier.
This name emphasizes that the independence assumption doesn't necessarily hold.

Although the independence assumption is often inaccurate, Naive Bayes works surprisingly well in practical applications.
This is because many applications don't care about precise class probabilities, only the final classification result.
For example, spam email filtering only needs to determine whether it's spam,
and doesn't need to display information like "This email has an 87.53% probability of being spam" in the user interface.

## Bayesian Networks and Neural Networks

However, when correlations between features are strong and we require relatively precise class probabilities, Naive Bayes isn't sufficient.

That is, in the following formula, `p [f1, f2 .. fn]` becomes hard to compute.

```haskell
pSucc [f1, f2 .. fn] S =
    (p S) * (pSucc S [f1, f2 .. fn]) / (p [f1, f2 .. fn])
```

Reviewing, if `[f1, f2 .. fn]` are independent events, then we have:

```haskell
p [f1, f2 .. fn] =
    (p f1) * (p f2) * .. * (p fn)
```

Now each feature's probability might be influenced by other features.
Suppose there's a function `pp` that can express these influences:

```haskell
p [f1, f2 .. fn] =
    (pp f1) * (pp f2) * .. * (pp fn)
```

So the question is: how is `pp` defined?
Since `pp` expresses how an event is influenced by other events, `pp` can be defined using conditional probability:

```haskell
pp f = pSucc (influenced f) f
```

For a given feature `f`, we find all features that influence it, `[inf1, inf2 .. infn]`:

```haskell
influenced f =
    pSucc [inf1, inf2 .. infn] f
```

Doesn't `pSucc [inf1, inf2 .. infn] f` look familiar?
When we discussed Naive Bayes above, we mentioned `pSucc [f1, f2 .. fn] S`.
These two have the same structure.

Therefore, this is actually a problem of recursively calling the Naive Bayes classifier.

Based on the same approach, we can handle `(pSucc S [f1, f2 .. fn])`.

However, in actual engineering, because data volumes are large, recursively calling Bayes classifiers is computationally intensive.
So to reduce computational complexity, we need some simplifications:

0. When influence levels are low, we directly ignore them, treating them as independent events.
1. Similar to Markov properties, we only consider features that directly influence a given feature `f`, not indirect influences. For example, `pinf1` might indirectly influence `f` by influencing `inf1`—we don't consider such cases.
2. When considering features that influence a given feature `f`, we assume these influencing features are mutually independent events.

Of course, if necessary, the above simplifications can be relaxed, trading increased computational complexity for more accurate estimates.

After the above simplifications, we get Bayesian networks.
They're called Bayesian networks because we represent mutual influence relationships between features using directed acyclic graphs (DAG).
The specific influence levels of features on given features are represented using conditional probability tables (CPT).
The construction of mutual influence relationships between features—that is, DAG construction—relies on experience or domain knowledge.
Conditional probability tables can be improved using Naive Bayes.

That concludes our introduction to Bayesian networks.
Now let's change approach—instead of starting from conditional probability and Bayes' theorem, let's approach classification from a scoring perspective.
Suppose data has features `[f1, f2 .. fn]`, each feature corresponds to a score (weight),
we add up these feature scores to get a total score, then compare it with a target score (threshold).
If greater than the threshold, result is 1; otherwise result is 0.

```haskell
f [f1, f2 .. fn] =
    if (w1 * f1 + w2 * f2 + ... + wn * fn > t) then
        1
    else
        0
```

This function `f` is called a perceptron.
The perceptron definition was inspired by neurons.
Perceptrons accept multiple inputs and return a boolean value,
just like nerve endings accept external inputs and decide whether to become excited.

We notice that perceptrons mainly work by computing a polynomial:

```haskell
w1 * f1 + w2 * f2 + ... + wn * fn
```

So intuitively, linearly inseparable problems, like the XOR function, can't be solved by a perceptron.

But actually, perceptrons aren't that weak. By combining perceptrons, we can express the XOR function.

We prepare two perceptrons with threshold 0: one is `x-y`, the other is `-x+y`.
We send inputs to both perceptrons:

| Input | x-y | -x+y | Output |
| - | - | - | - |
| (1, 0) | 1 | 0 | (1, 0) |
| (0, 1) | 0 | 1 | (0, 1) |
| (0, 0) | 0 | 0 | (0, 0) |
| (1, 1) | 0 | 0 | (0, 0) |

Then we provide the output to an `x+y` perceptron with threshold 0:

| Input | Intermediate Result | Final Output |
| - | - | - |
| (1, 0) | (1, 0) | 1 |
| (0, 1) | (0, 1) | 1 |
| (0, 0) | (0, 0) | 0 |
| (1, 1) | (0, 0) | 0 |

Comparing input and final output, we can see that our three perceptrons compute results that match the XOR definition.

Here, the first two perceptrons (`x-y` and `-x+y`) are the first layer, and the last perceptron (`x+y`) is the second layer.
From this we see that by combining perceptrons, we can form a layered neural network.
Layered neural networks can solve linearly inseparable problems.

But perceptrons still seem very weak.
Such a simple problem as the XOR function requires three perceptrons and a two-layer network.
While in any decent programming language, XOR functions can be defined very directly.
Why would we handicap ourselves using perceptrons and neural networks? Isn't this masochism?

Actually, perceptrons and neural networks seem weak, but they also have advantages:

1. Perceptrons have very uniform "interfaces"—each perceptron has multiple inputs and returns one result, making them easy to combine.

2. Perceptrons internally perform polynomial operations, unlike ordinary functions which vary wildly, making them easy to optimize (especially now that we have powerful GPUs).

3. Perceptron operation results only depend on their inputs, so they can easily run in distributed fashion.

4. In the example above, determining `x-y`, `-x+y`, and `x+y` came from our understanding of the XOR function. Suppose we know nothing about the XOR function—the perceptron structure makes it relatively easy to try various weights and thresholds through brute force. Conversely, we're unlikely to generate strings that happen to match the general definition of XOR functions through brute force.

5. The layered structure of neural networks means we can try layer by layer to approximate expected results.

It seems neural networks do have their advantages.
But they still don't seem very reliable.
Neural networks look like a brute force guessing method when we don't know how to guess well.
Isn't this like shooting birds randomly?
Conversely, Bayesian networks are also guessing, but they have solid foundations in probability theory. When errors occur, it's easier to find causes,
unlike neural networks which are basically black boxes.

But don't forget that Bayesian networks' feature relationships—the construction of directed acyclic graphs—depend on domain knowledge.
If a domain lacks sufficient research and no one can construct good enough directed acyclic graphs,
or if only very few experts understand the domain but those experts lack time or interest in constructing those directed acyclic graphs,
then Bayesian networks can't demonstrate their power.

Conversely, neural networks require much less domain knowledge.
Low domain knowledge requirements are like "one approach that works everywhere" for neural networks.
And as computational power increases, the cost of brute force approaches decreases, making neural networks increasingly valued.

Of course, Bayesian networks and neural networks aren't mutually exclusive—sometimes they can be used together.
When computational load is very large, neural networks' brute force attempts might not work well.
At such times we can use Bayesian networks to more precisely adjust neural network parameters.

Additionally, the above only covers basic neural network principles. Actually used neural networks are much more complex.

For example, our perceptrons can only output 0 or 1,
but since we're using brute force optimization, we want the entire network to be somewhat sensitive to parameter adjustments.
At this point we no longer compare polynomials with thresholds to output 0 or 1,
but convert thresholds to biases added to polynomials,
and use an activation function to process polynomial results,
getting floating point numbers.
The simplest activation function is ReLU, with a very simple definition: `max 0 n`.
Like Naive Bayes, ReLU is simple but surprisingly effective.

Additionally, neural networks used in practice are much more complex in both scale and structure.

## Summary

The strong AI era attempted to represent all human thinking activities based on universal logic—this attempt failed.
AI research direction shifted from universal logic to specific problems in specialized domains.
But even specific problems in specialized domains often need to rely on machine brute force (statistics) to guess.
From Bayesian networks to neural networks, guessing methods become increasingly brute force and increasingly dependent on machine brute force.
Neural networks, which are highly dependent on machine brute force, have become a universal paradigm for solving machine learning problems across various domains.
Elegant logic failed to achieve general intelligence, while brute force neural networks, supported by continuously growing computational power, are progressing toward universality.
This is quite an unexpected development.

## Credits

This article is originally written in Chinese by weakish, then translated into English by GPT-4.1, with some minor adjustments by Claude Sonnet 4 and weakish.
