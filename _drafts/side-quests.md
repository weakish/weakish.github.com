- [ ] music 5940

- common setups
  - popular
    - macOS
    - DropBox
    - Gmail
  - popular among developers
    - 1password
    - DropBox
    - GitHub
    - LogSeq

- [ ] /jobs

- [ ] clean up redirects

    - render.yaml redirects
    - jekyll-redirects
    - manually moved to link in markdown

- [ ] TypeScript slogans

    - The current one is "TypeScript is just JavaScript with types."

        I just cannot help to think that:

            - TypeScript is just JavaScript with unsound types.

            - Python 3 is just Python with types.

        I remembered their previous slogan is something like "TypeScript is a superset of JavaScript." (targeted at CoffeeScrit and Dart). Then "TypeScript is JavaScript that scales." (only targeted at big projects.) Now they seemingly want to attract all JavaScript deverlopers.

- [ ] Two mobile phones.

- [ ] Manage global installed npm packages.

        {p}npm list -g -j --depth 0

        Maybe I can use a pesudo package?

- [ ] mirror my active GitHub repositories on GitLab

- [ ] repost /log as closed issues labelled log and notes as closed PR labelled note.

    They should be closed, because they are not real issues and PRs.

- [ ] 成语导航站

    上网导航页面，但是每个站点都是四字成语，比如啁啾会馆、刹那图鉴、骇客杂报。

- [ ] 真代购网站

    无需支付，无需转运，所购商品由代购者支付和使用。

- [ ] podcast clips database

    Bookmark, share, and cite.

    There is [bitcast.fm](https://www.bitcast.fm/) but it is not open source.

    And there is an open source iOS application to make podcast clips called [CastSnip](https://github.com/mostlysecurity/CastSnip)

- watch https://www.youtube.com/watch?v=UM82qxxskZE

- Currently I use the git log of gh/weakish/weakish to write down shot notes.

    The problems is everything is almost immutable, amending a previous log means rebasing all its descendents.
    I am thinking switch to use seperate json files:

        type unixTimeStamp = int
        // snowflake or discord snowflake or sonyflake or similar
        type messageID = string    
        type sshPubKey = string
        {
          id: messageID,
          pubDate: unixTimeStamp,
          updateDate?: unixTimeStamp,
          author?: {
              username?: string,
              displayName?: string,
              email?: string,
              site?: string,
              twitter?: string,
              github?: string,
              stackoverflow?: string,
              instagram?: string,
              keys: array<sshPubKey>
            }
          title?: string,
          content: string,
          sign?: string?
          key?: sshPubKey,
          urls?: array<string>,
          replyTo: array<messageID>,
          mention: array<username>,
        }

        The json file can be written in some programming lanuage,
        and generate markdown/html output in some programming language.
        Maybe I can extend gh/weakish/htm?
