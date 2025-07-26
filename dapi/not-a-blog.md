# This Is Not a Blog

## Blog Is Log

Blog is short for web log.
Whether in its original form or abbreviation, both contain the word "log."
As the name suggests, blogs are still suitable for log-type content.

For example:

> While browsing through the "Internet Light" exhibition hall in Wuzhen,
> I came across LeEco's booth,
> and actually saw a bicycle there.
> While marveling at how I really don't understand why LeEco even makes bicycles,
> I couldn't help but want to try riding it.
> Failed attempt, because the right pedal was already missing.

-- [Wang Xing](https://fanfou.com/statuses/KjjnG6FpCFo)

Another example:

> Yesterday our database encountered an X problem,
> resulting in loss of Z data during Y time period.
> Functions A-F were unaffected.
> At time R, the monitoring system reported the problem,
> and we conducted the following investigation: ...
> We identified that S caused the X problem.
> We used T to fix the problem,
> while attempting to recover data through I-K,
> achieving the following results respectively: ...
> However, the Z data from time period Y was still lost.
> This incident exposed O-Q defects in our system,
> and we will implement U-V measures to prevent similar incidents in the future.

-- Hypothetical Application

## Misuse of Blogs

### Don't Forget the Cost of Misuse

Misuse is not a crime.
But misuse almost always comes with a cost.

For example, HTTP's GET method can be misused as POST,
simply by encoding POST content into the request URL.
It seems to work fine - the server can be lazy and only implement the GET method without implementing POST.
But GET is designed for "reading," so misusing GET for "writing" naturally has costs.
Easy to imagine costs include potentially exceeding URL length limits,
and problems with caching and proxies.

Similarly, misusing blogs to host non-log content
might cause people to overlook the following costs:

1. Content, like code, may need maintenance
2. Content may be different from logs - chronological ordering isn't always the best choice

### Publishing to a Blog Doesn't Change the Nature of Content

On day B of month A, I configured a server and afterward recorded the process on my blog.

On day D of month C, I learned how to use GitHub and likewise published what I learned on my blog.

On some day of some month of some year, I recorded what I did - isn't this just a log?

Not necessarily.

If it were like this:

> Day D of month C, learned how to use GitHub.

This is a log.
In fact, before blogs existed, diaries were written this way.

Of course, sometimes diaries aren't so dry:

> Yesterday I discovered GitHub opened registration.
>
> Actually, M had asked before whether I needed a GitHub invitation,
> but I wasn't that interested.
> Gitorious didn't require invitations to register, and the entire platform was open source.
> I was using Gitorious just fine.
> Since GitHub wanted to control the speed of new user growth,
> why should I bother joining the crowd?
>
> Now that GitHub has opened registration,
> and I see that projects X, Y, Z all have their repositories on GitHub,
> I'll go register an account too.

This is also a log.

But the following is not a log:

> First, create a local git repository:
>
> (some commands)
>
> Next, generate SSH keys:
>
> (some commands)
>
> Paste the newly generated public key in the GitHub web interface:
>
> (continued below)

This is actually documentation, instructions, a manual, or a cheat sheet, not a log.
Publishing such content to a blog doesn't mean it no longer needs maintenance.

For example:

- New versions of git might provide a more user-friendly UI
- New versions of SSH might provide more secure algorithms  
- GitHub might develop a command-line client, eliminating the need to use the web interface for submitting public keys

Even some more "abstract" content that appears to be "reflective" in nature
doesn't necessarily belong to logs.

For example, a "blog" titled "My Take on Java and PHP,"
if it mentions lambdas and type annotations,
then with Java 8 introducing lambdas and PHP 7 introducing type annotations for function parameters and return values,
this "blog" would need updating accordingly.
This maintenance work is unavoidable.
Even if we were more rigorous initially and changed the title to "My Take on Java 7 and PHP 5.5," it's still unavoidable.
Should we upgrade to Java 8 or PHP 7?
If upgrading, should we insist on not using new features?
If we can't avoid upgrading and can't avoid using new features, then we can't avoid maintaining this "blog."
So obviously, this isn't actually a "blog."

Of course, we could start fresh and write a new piece.
In fact, many "blogs" are "maintained" this way.
The original content has become outdated with no one maintaining it,
so it gets replaced by "blogs" written by others.
This is also a form of "maintenance,"
but this maintenance approach isn't very reasonable:

1. Old content spreads widely and might be easier to find than new content, potentially misleading readers with outdated information.
2. Starting fresh every period is wasteful.

## Natural Language, Like Programs, Is Written for People to Read

> Many people's clear programming principles seem to completely collapse when faced with tasks like "writing scripts."
> They seem to think that script writing should be more "loose."
> Many people who usually write very clever programs
> start writing shell scripts or Perl scripts when handling "system administration" tasks.
> When writing these scripts, they often completely forget basic programming principles
> like "modularity" and "abstraction."

-- [Wang Yin](http://www.yinwang.org/blog-cn/2013/03/29/scripting-language)

The problem with blog misuse is similar.
It's normal for diary entries to be a bit loose,
but treating non-log content as a blog easily leads to writing things that are hard to maintain.

Natural language is often less precise than programming languages, but many programming principles still apply.

Imagine a project like this:

1. Code isn't organized by modules - all code files are crammed into one directory, arranged by order of creation
2. Some files have tags, but the project doesn't provide functionality to search by combining tags - you can only view by individual tags
3. Code modifications aren't recorded - sometimes the author notes them in files
4. Code modifications aren't done through patches, but through linearly arranged "comments" that the author manually merges
5. After some time, "comments" can no longer be submitted

Obviously, such a project would be hard to maintain.

Yet many blog systems are exactly like this project.
Of course, these blog systems work fine for handling log-type content.
But when such blog systems are misused to host non-log content, they can cause various troubles.

Returning to the examples mentioned earlier:

> On day B of month A, I configured a server and afterward recorded the process on my blog.

> On day D of month C, I learned how to use GitHub and likewise published what I learned on my blog.

If both involve generating SSH keys, I could completely extract this part and write it separately,
having the other two pieces reference it.
In the future, whenever other documents involve generating SSH keys, I can directly reference it.
If I plan to change the generation algorithm from RSA to ed25519, I only need to modify one place.
These principles are exactly the same as programming.

Actually, in programming we often directly reference third-party libraries.
Similarly, if I find excellent documentation on generating SSH keys, I can directly reference it instead of writing my own.
Of course, the opposite situation exists in programming too - sometimes we don't want to introduce third-party dependencies for a small function, so we write our own.
Likewise, sometimes when content isn't long, for document completeness and to avoid too much jumping around while reading, we can write our own.

Similarly:

- Traditional tree structures are sometimes better than tags for organizing content,

    just like chapters are often better for individual books, while tags are better for categorizing many books.

- Tools like git for managing code are equally useful,

    including history, branches, diff, etc.

- Patches, issues, and pull requests can also be used for collaboration.

    That's why there's no comment box here, but the footer has a link to GitHub issues.

## Summary

1. Blog systems are still suitable for log-type content.
2. Content that needs maintenance always needs maintenance - publishing to a blog doesn't avoid maintenance.
3. Programming experience can equally be applied to natural language, reducing maintenance costs.