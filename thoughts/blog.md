# This Is Not a Blog

## Web Log

Blog is short for web log.
Whether in its original form or abbreviation, both contain the word "log."

Misusing blogs to host non-log content
might cause people to overlook the following costs:

1. Content, like code, may need maintenance
2. Content may be different from logs - chronological ordering isn't always the best choice

## Publishing to a Blog Doesn't Change the Nature of Content

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

Not all blog posts are instructions, but posts like opinions on something may also need maintenance.

For example, a "blog" titled "My Take on Java and PHP,"
if it mentions lambdas and type annotations,
then with Java 8 introducing lambdas and PHP 7 introducing type annotations for function parameters and return values,
this "blog" would need updating accordingly.
This maintenance work is unavoidable.
Even if we were more rigorous initially and changed the title to "My Take on Java 7 and PHP 5.5," it's still unavoidable.
Because newer users tend to be interested in newer versions of Java and PHP.
If we can't avoid upgrading and can't avoid using new features, then we can't avoid maintaining it.

Of course, we could start fresh and write a new post.
In fact, many blog posts are maintained this way.
The original content has become outdated with no one maintaining it,
so it gets replaced by new posts written by others or sometimes by the same author.
However, this maintenance approach has two drawbacks:

1. Old content spreads widely and might be easier to find than new content, potentially misleading readers with outdated information.
2. Starting fresh again and again is a waste of time and effort.

## Readability and Maintainability

It's normal for diary entries to be a bit loose,
but treating non-log content as a blog post easily leads to writing things that are hard to maintain.

Imagine a programming project like this:

1. Code isn't organized by modules - all code files are crammed into one directory, ordered by time of creation.
2. Some files have tags, but the project doesn't provide functionality to search by combining tags - you can only view by individual tags.
3. Code modifications aren't preserved in a version control system - sometimes the author will comment about them.
4. Code modifications from others aren't done through patches, but through linearly arranged comments appended to the end.
5. After some time, comments from others are not accepted anymore.

Obviously, the readability and maintainability of such a project would be terrible.
Yet many blog systems are exactly like this project.
Of course, these blog systems work fine for handling log-type content.
But when such blog systems are misused to host non-log content, they can cause various troubles.

For example, if there are two blog posts:

> On day B of month A, I configured a server and afterward recorded the process on my blog.

> On day D of month C, I learned how to use GitHub and likewise published what I learned on my blog.

If both involve generating SSH keys, I could completely extract this part and write it separately,
having the other two posts reference it.
In the future, whenever other posts involve generating SSH keys, I can directly reference it.
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

*Originally written in Chinese by weakish, then translated into English by GPT-4.1, and edited by weakish.*