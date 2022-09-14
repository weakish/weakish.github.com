# Git Frontends

## Legit

[Legit], the git workflow for humans, offers six commands:

1. Switch to specific branch. Stashes and restores unstaged changes.

        legit switch <branch>

    When the working tree is dirty, I usually just commit them with a WIP message,
    allowing me to note down what I did if needed.
    Auto stashing sometimes make me lost when I come back to the branch,
    probably days or months later.

2. Sync current branch with remote

        legit sync

    Again this is very smart, auto stash and rebase when necessary.
    However, I usually work solely on a feature branch.
    Thus, I just need to push.
    When occasinoally collaborating with others on one branch,
    I prefer a manual pull.
    Thus, I can check what others change, allowing for change my code accordingly,
    instead of pull and rebase in one run. 


3. Publish current branch to remote:

        legit publish <branch>

    With `push.default = simple`, I just use `push` instead.

4. Unpublish a specific branch from remote:

        legit unpublish <branch>

    I simply alias `publish` to `push --delete`.

5. Removes the last commit from history:

        legit undo

    I feel undo is ambigious. Undo what?
    Also, legit does not implement a redo function.
    `legit undo [--hard]` is just `reset [--hard] HEAD^`.
    Since the `^` notation always look cryptic to me,
    I usually just `commit amend` (aliased to `amend`)
    or `rebase --interactive` (aliased to `ri`) instead.
    After all, reset without `--hard` will not touch the working directory.
    I seldom need to abandon all changes in the working directory.
    When I do need so, I do not think an extra force checkout is annoying.

6. List branches matching wildcard pattern, showing published or unpublished:

        legit branches [<wildcard pattern>]

    I typically do not have so many branches to match against a wildcard.
    However, also displaying whether a branch is published or not is a nice feature.
    A StackOverflow annswer by [Jeremy Baker] uses some simple AWK
    to display branches without a remote:

        git branch --format "%(refname:short) %(upstream)" |
        awk '{if (!$2) print $1;}'

    I tweaked it a bit to display branches with or without a remote in different colors:

        git branch --format "%(refname:short) %(upstream)" |
        awk -v b='\033[1;36m' -v r='\033[0m' '{if ($2) print b$1; else print r$1;}'

    Then I add this as the `branches` alias.
    Do not forget to escape `\` when adding git alias.
        
[Legit]: https://frostming.github.io/legit/
[Jeremy Baker]: https://stackoverflow.com/a/31776247/


## Gitless

Among the six legit commands, essentially four can be replaced with alias.
The two left involve with stash and staging area,
and `legit switch` is the most interested in my workflow.
My workaround is using WIP commits, but this is not ideal to me,
which leads my way to [gitless].

[gitless]: https://gitless.com

Gitless simplifies and amplifies the concept branch.
In gitless, branches include working directory.
And the concepts of stage, stash, detached heads, assume-unchanged are not exposed to users.
Also, gitless brings in a more consistent user interface.

I find the "Gitless vs. Git" section on [gitless] homepage very readable,
and the [presentation] by gitless author spderosso from Git Merge 2017 very clear,
so I will skip a more detailed introduction here.

[presentation]: https://www.youtube.com/watch?v=31XZYMjg93o

The "Gitless vs. Git" section mentioned above focuses on misfits of git.
Below is a comparison on everyday tasks.

| task | gitless | git |
| - | - | - |
| create repo | gl init | git init |
| clone repo | cd repo; gl init url | git clone url |
| track new file | gl track new | git add new |
| remove file | rm foo | git rm foo |
| commit | gl  commit | git commit |
| push | gl publish | git push |
| add remote | gl remote -c name url | git remote add name url |
| update repo with remote changes | gl merge | git pull |
| create branch | gl branch -c b | git checkout -b b |
| switch to master | gl switch master | git checkout master |
| delete branch | gl branch -d b | git branch -d b |
| push branch to remote | see below | git push -u origin b | 
| merge | gl merge b | git merge b |
| diff between branches | see below | git diff a b |
| tag | gl tag TAG | git tag TAG |
| history | gl history | git log |
| restore a file | gl checkout file | git checkout file |

To publish a branch where the corresponding remote branch does not exist,
the remote branch has to be created first.

```sh
gl branch -c origin/b -dp b
gl branch -su origin/b
gl publish
```

The only diff capability gitless offers is comparing with HEAD.
So to diff two branches, I have to move HEAD back and forth.

```sh
gl switch b
gl branch -sh a
gl diff
gl branch -sh 2b5ec99 
```

If I do not want to memorize or copy-paste the revision hash,
I need to create a branch as a bookmark, then delete it afterwards.

```sh
gl switch b
gl switch -c tmp
gl branch -sh a
gl diff
gl branch -sh tmp
gl branch -d tmp
```

Like legit, gitless share a common issue of many git frontends.
They are most attractive to git novices,
but to maintain them you need to be a pro user, if not expert, of git.
Thus, when the author moves on,
the project turns into a not actively maintained or discontinued state.

When I run the first command, `gl status`, I got a [SyntaxWarning] from its dependency clint,
which in turn is also not actively maintained.
This also affects Legit, where I contributed a [workaround] (not merged yet).

[SyntaxWarning]: https://github.com/kennethreitz-archive/clint/pull/182
[workaround]: https://github.com/frostming/legit/pull/275

Then I find out that `gl history` and `git diff` is [not work with diff-so-fancy or delta] as the git pager.

[not-work-with-diff-so-fancy]: https://github.com/gitless-vcs/gitless/issues/241

The output of gitless command is a bit lengthy, friendlier to new users or occasional users.  
For example:

```sh
; gl branch
List of branches:
  ➜ do gl branch -c b to create branch b
  ➜ do gl branch -d b to delete branch b
  ➜ do gl switch b to switch to branch b
  ➜ * = current branch

      11ty 
      docsify (upstream is origin/docsify)
      gitless 
    * master (upstream is origin/master)
```

Unlike git, gitless can not detect renaming.
However, `mv old new && gl track new && gl commit` results in a rename under the git level.

Also, [annotated tags] and [signing commit] is not supported.

[annotated tag]: https://github.com/gitless-vcs/gitless/issues/73
[signing]: https://github.com/gitless-vcs/gitless/issues/131
[commit]: https://github.com/gitless-vcs/gitless/issues/239

Some operations are slower that git, for example,
`gl branch -r` (list all branches, including remote ones) is much slower than `git branch -a`.
Similarly, `gl branch -su upstream/feature` is very slow.


To work around these issues, I wrote a wrapper in fish:

```fish
function gl
    switch $argv[1]
    # Use git diff HEAD, powered by delta,
    # which is incompatible with gitless.
    case diff
        git diff HEAD $argv[2..-1]
    # The incompatibility with delta also affects the history command.
    # git history is my alias for a pretty output. 
    case history
        git history $argv[2..-1]
    # gitless does not detect rename yet.
    # This saves typing.
    case rename
        mv $argv[2] $argv[3]
        command gl track $argv[3]
    # I always annotate tags, which gitless does not support yet.    
    case tag
        switch $argv[2]
            case '-c'
                git tag -a $argv[3..-1]
            case '*'
                command gl $argv
        end
    # A workaround to enable signed commits.    
    case commit
        command gl $argv; and git commit --amend --no-edit
    case '*'
        command gl $argv
    end
end
``` 

However, some operations often failed on some repositories or branches,
saying internal errors occurred,
which makes me feel less confident.

## Jujutsu

Like gitless, [jj] does not expose the concept staging.
And jj relies heavily on the rewriting history mechanism, like git-branchless.
By automatically committing every change in the working directory,
jj can rebase and handle conflicts more automatically. 

Basically, when checking out a revision,
jj immediately create a commit (a detached HEAD) on top of it.
When any change is made in the working directory,
jj keeps amending this commit, creating more and more detached heads. 
And `jj describe` can be used to amend the commit message of this commit.

[jj]: https://github.com/martinvonz/jj 

From the git level, jj keeps producing detached heads for all the changes
made into the working directory, and all the operations performed via jj command.

```
; git log --graph --pretty=graph --all --
* f2f0567 -refs/jj/keep/dbce4358-5003-4393-b827-6cfc2273b028 :new: jj
| * 0159040 -refs/jj/keep/127fc31a-8672-427b-b2d7-1a59d9707313 :new: jj
|/  
| * 2e7ff4c -refs/jj/keep/0f18d67c-764a-4593-948d-2034ece6a005 :new: jj
|/  
| * 92a059d -refs/jj/keep/4d9e73e5-71e7-4c6e-83ba-251a2547b874 :new: jj
|/  
| * dbb0886 -refs/jj/keep/09fae392-3bd6-467a-92f5-6dae1b2eed99
|/  
| * 7a2dac3 -refs/jj/keep/65e6c1ff-cc6f-42de-a45c-a6f90f93a689
|/
* 151d512 HEAD, master
```

When this commit is done, type `jj new` to start a new automatically amending commit,
on top of this commit.
In fact, `new` is essentially `checkout`.
From the git level, `new` moves the `HEAD`.
The previous amending commit is not a detached head anymore.
And a new detached head is created for the current working directory.

```
* 28f9890 -refs/jj/keep/9186c278-3dd9-4d90-bf57-7fe721ddced8
* f2f0567 -HEAD, refs/jj/keep/dbce4358-5003-4393-b827-6cfc2273b028 :new: jj
| * 0159040 -refs/jj/keep/127fc31a-8672-427b-b2d7-1a59d9707313 :new: jj
|/  
```

To come back to the previous amending commit,
use `jj squash`.
Now the HEAD goes back to master, and a new detached head on top of the master,
with all the changes in the working tree, is created.

```
* 71ca53d -refs/jj/keep/63ac97c4-e880-4f46-a0a2-87130cd18b3e, list :new: jj
| * 662fb65 -refs/jj/keep/a1049d85-df81-4df6-a6b4-e825a0972169
| | * 55ba9f8 -refs/jj/keep/d19c9d87-9319-44fb-8b5e-65838f4238a0
| |/  
| | * 28f9890 -refs/jj/keep/9186c278-3dd9-4d90-bf57-7fe721ddced8
| |/  
| * f2f0567 -refs/jj/keep/dbce4358-5003-4393-b827-6cfc2273b028 :new: jj
|/  
| * 0159040 -refs/jj/keep/127fc31a-8672-427b-b2d7-1a59d9707313 :new: jj
|/  
| * 2e7ff4c -refs/jj/keep/0f18d67c-764a-4593-948d-2034ece6a005 :new: jj
|/  
| * 92a059d -refs/jj/keep/4d9e73e5-71e7-4c6e-83ba-251a2547b874 :new: jj
|/  
| * dbb0886 -refs/jj/keep/09fae392-3bd6-467a-92f5-6dae1b2eed99
|/  
| * 7a2dac3 -refs/jj/keep/65e6c1ff-cc6f-42de-a45c-a6f90f93a689
|/  
* 151d512 -HEAD, master :new: update log
```

To restore a file content from master, use `jj restore`.
For example, the following command restore README from master.

```sh
jj restore --from master README.md
```

In fact, since the master is the parent of the current working directory commit,
the above command can be replaced with `jj restore README.md`.

[revsets]: https://github.com/martinvonz/jj/blob/main/docs/revsets.md

Again, restore updates the working directory and the working commit.
Under jj, working directory and working commit is the same thing.

And restore can be performed on *any* commit!
The above command `jj restore README.md` is a shortcut for
`jj restore --from 'parents(x)' --to='@' README.md`.
In other words, restore the content of `README.md` from commit `@-` to `@`,
where `parents(@)` and `@` are the [revset] syntax inspired by Mercurial.
`@` refers to the working commit.
As always, restore amends the history, creating new commits,
and descendants of the amended commit will be rebased. 

[revset]: https://github.com/martinvonz/jj/blob/main/docs/revsets.md

When using git, sometimes I do several unrelated changes in parallel,
then use `git add --patch` to commit them separately.
Since jj keeps committing everything, the corresponding command is `jj split`,
which will open a diff editor to split the working commit to two commits.
Continuing the `split` command on the first (`jj split -r 'parents(@)'`)
or the second commit (`jj split`), more commits can be split out.

When finally done the coding, use `jj branch set master` to move the master branch forward.
Then sync with the remote:

```
jj git fetch
jj git push
```

Currently, the built-in diff of jj is line based.
To get a more powerful diff, use the `--git` option.
For example, `jj diff --git | delta`.

By default, jj uses Meld as the diff editor.
If it is not installed, jj commands using the diff editor will error out.
I use kdiff3 and my jj configuration is as below:

```
[ui]
diff-editor = "kdiff3"
merge-tools.kdiff3.edit-args = ["--merge", "--cs", "CreateBakFiles=0"]
```

Also, kdiff3 will back up merging files as `.orig`.
This should be added in `.gitconfig`.
Otherwise, they will be committed in by jj automatically.

Similar to gitless, [signed commits are not supported][jj-58].

[jj-58]: https://github.com/martinvonz/jj/issues/58

## More Git Frontends

- [git-branchless](https://github.com/arxanas/git-branchless)

    Like gitless, git-branchless also simplifies the concept branch,
    but in another direction, in the sprit of mercurial.
    Even if I am not sold out to this workflow, some commends are attractive.
    Optimized for history rewriting.

- [sturdy](https://getsturdy.com/)

    More radical. Always online. Everything happens on live.
 
