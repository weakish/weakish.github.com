# Git Workflow for Deadbeats

[Legit], the git workflow for humans, offers six commands:

1. Switch to specific branch. Stashes and restores unstaged changes.

        legit switch <branch>

    I just use `checkout` instead, which I alias to `co`.
    Often there are no unstaged changes.
    When there are, I usually just commit them with a WIP message,
    allowing me to note down what I did.
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
        
[Legit]: https://frostming.github.io/legit/
[Jeremy Baker]: https://stackoverflow.com/a/31776247/

