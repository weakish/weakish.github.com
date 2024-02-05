# Usenet

## The Big 7

After [Great Renaming] in 1987, core groups
`fa.*` (from ARPANET), `mod.*` (moderated), and `net.*` (unmoderated)
are migrated to the Big 7 and `alt.*`.

| Hierarchy     | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| comp.*        | Discussions related to computer hardware, software, and programming         |
| misc.*        | Miscellaneous discussions that do not fit into other hierarchies             |
| news.*        | Discussions related to Usenet itself, newsgroup creation, and technical issues|
| rec.*         | Recreational activities and hobbies, including sports, games, and entertainment|
| sci.*         | Scientific discussions spanning various fields such as physics, biology, etc.|
| soc.*         | Social and culture discussions                   |
| talk.*        | Controversial topics such as religion and politics  |

And there is `alt.*`:

> ALT stands for 'Anarchists, Lunatics, and Terrorists'.
>
> - [Eric Ziegast]

Wikipedia has [a list of popular newsgroups][list],
but a lot of these significant ones in Usenet history become quiet or full of spams these days.

Eternal September has [a list of text-only newsgroups][text-only-list].
And [ISC] maintains [a "full" list][full-list].

[Great Renaming]: https://en.wikipedia.org/wiki/Great_Renaming "Wikipedia page"
[Eric Ziegast]: http://www.faqs.org/faqs/alt-creation-guide/ "Usenet FAQ"
[list]: https://en.wikipedia.org/wiki/List_of_newsgroups
[text-only-list]: https://www.eternal-september.org/hierarchies.php
[ISC]: https://www.isc.org/
[full-list]: https://downloads.isc.org/pub/usenet/CONFIG/newsgroups.bz2

## Servers

I am using [Usenet.Farm], whose trial account has a 10 GB free quota.
Its trial account does not support posting.
It offers 500 GB quota for €15.00, which can last for a long time for text newsgroups.

Usenet.Farm [does not log][no-log] the articles reading/posting,
only the IP address and some usage data.

[Usenet.Farm]: https://usenet.farm
[no-log]: https://usenet.farm/members.html#faq

news.mixmin.net provides free read-only access to text newsgroups.
No registeration is needed.
Connect to `nntps://news.mixmin.net` directly.

[Eternal September][93-09] provides free read/write access to text newsgroups.
Accounts will be automatically deleted if there is no connection to the server within 180 days.

[93-09]: https://www.eternal-september.org

[news.solani.org][solani] also provides free access to text newsgroups.

[solani]: https://news.solani.org

[dotsrc] provides free access to open source related newsgroups.
It requires users to use real name and accurate sender address.

[dotsrc]: https://dotsrc.org/usenet/

[News.Individual.NET][n.i.n] also provides access to text newsgroups for 10 EUR per year.

[n.i.n]: https://news.individual.net

For a list of more usenet servers,
see [Free Text Newsservers], [News service providers], and [Usenet Services Map].

[Free Text Newsservers]: https://groups.google.com/g/alt.free.newsservers/c/bP2R7ho0QiY/m/p4FuoLZZEAAJ
[News service providers]: https://www.big-8.org/wiki/News_service_providers
[Usenet Services Map]: https://www.reddit.com/r/usenet/wiki/providers/

[olduse.net] is a special server which replays the first 10 years of archived usenet articles
with a 40 years delay.
I connect to it to read the usenet history interactively.

[olduse.net]: https://olduse.net

[Inn] can be used to host own news server.
But for small sites, it is better to use [leafnode] or [suck] to fetch news from an upstream server.

[Inn]: https://www.eyrie.org/~eagle/software/inn/
[leafnode]: https://leafnode.sourceforge.io
[suck]: https://lazarus-pkgs.github.io/lazarus-pkgs/suck.html

[Illuminant] is an ActivityPub server with an NNTP interface. 

[Illuminant]: https://koldfront.dk/git/illuminant/about/

## Clients

Previously, Google Groups could be used as a web-based Usenet client.
However, from [February 22, 2024][google-groups], Google Groups will no longer be used to post content to Usenet groups,
subscribe to Usenet groups, or view new Usenet content.

[google-groups]: https://support.google.com/groups/answer/11036538

Currently I am using Thunderbird.
I found two tutorials on [how to set up Thunderbird for Usenet][thunderbird-usenet]
and [how to filter spam with Thunderbird][thunderbird-spam].

[thunderbird-usenet]: https://www.big-8.org/wiki/Getting_Started_with_Usenet
[thunderbird-spam]: https://www.big-8.org/wiki/Filtering_Spam_with_Thunderbird

## Archives

[Usenet Archives collected by Norman Yarvin][norman],
includes articles Norman Yarvin saved from Usenet (and a few from web forums).

> The vast majority of these articles were posted by people who have a well-deserved reputation for a high level of accuracy.
> Aside from that, the only endorsement I have of these articles is that looking at them, I didn't detect anything seriously wrong; and I at least think I understand them.
>
> -- [About](https://yarchive.net/about.html)

[norman]: http://yarchive.net

Given Message-ID, articles in the first ten years of usenet can be found on article.olduse.net, e.g.
https://article.olduse.net/771@mit-eddie.UUCP

Historical Usenet content posted before February 22, 2024 on Google Groups
can continue be viewed and searched.

[Usenet Archives] is a website providing access to an extensive collection of historical Usenet posts.
Its archive goes all the way back to 1979 but is not complete.

[Usenet Archives]: https://www.usenetarchives.com/

The [Internet Archive] hosts a substantial collection of Usenet,
most of which are in `.mbox` format, thus not searchable or likable.  

[Internet Archive]: https://archive.org

## Binaries

> No pr0n, no warez, just Usenet
>
> -- [Eternal Sepetember][93-09]

Usenet was originally designed for text messages, but due to its distributed nature,
it is widely used for sharing often illegal files.
Since binaries are often split into multiple parts,
NZB files are used to facilitate the downloading of files.
Basically an NZB file is an XML file that contains information about the message IDs of all parts.
Typically a user will search the content via a NZB indexer
and then feed the corresponding NZB file to an NZB client to download the files.
Therefore, an NZB file works like a torrent file but for Usenet.

A popular open source NZB client is [NZBGet],
which is known for its high performance and efficiency.
It can be controlled via web interface or command line.

[NZBGet]: https://nzbget.net

## More

- [Wikipedia page of usenet](https://en.wikipedia.org/wiki/Usenet)
- [Gentoo wiki page of usenet](https://wiki.gentoo.org/wiki/Usenet)