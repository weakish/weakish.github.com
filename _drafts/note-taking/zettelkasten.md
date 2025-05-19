## Introduction to the Zettelkasten Method

https://zettelkasten.de/introduction/

==Niklas Luhmann== was a ==highly productive social scientist==. He ==published 50 books and over 600 articles==.

> [!note] Ironically most people know him for his Zettelkasten method, not his work in sociology.

Luhmann himself stated that his ==productivity stems from working in a partnership with his Zettelkasten==. 

==Luhmann’s numbering system== has two consequences for re-creating his method:

1. It makes organic growth possible. Luhmann didn’t use the term hypertext, but he probably would if he lived today. This organic growth is also precisely how wikis and their wiki-link feature works. ==You have a text but want to expand on a point. You branch off from the current page, and thus basically inject another text into the current one,== but at the same time hide its contents.

2. It makes linking possible. ==The emphasis on linking is a more obvious hint at the hyper-textual nature of his Zettelkasten==. The non-linear link structure is the main trait of a hypertext. In his manual on how to create a Zettelkasten, he wrote: ==It is not important where you place a new note as long as you can link to it==.

His numbering system made ==a paper-based hypertext== possible. It worked with a bearable amount of effort for Luhmann.

==Luhmann’s register could be mistaken for a tag system. However, the individual notes were not tagged==, nor did he put a tagging system in place to organise his Zettelkasten.

==There are very few IDs per item in his register, sometimes just a single one==, next to each term. ==His register is purely a list of entry points, not a tag list==. For example, the term system had just one entry. This is a huge surprise when you consider that Luhmann was developing a systems theory where this term played a huge role all over the place. ==The register was only a list of possible entry points to the biggest and most important clusters of notes. After finding the entry to his hypertext, he relied on the linking system and began to surf.==

> [!note] So it is more like a domain name. A domain name will map to several IP addresses. Or like the first page of results for a keyword search.

Let us begin with the most important traits of a Zettelkasten:

1. It’s ==hyper-textual==.
2. It adheres to the Principle of ==Atomicity==.
3. It is ==personal==.

We call an individual note a Zettel. ==Zettel is the German word for “paper slip”.== They are the smallest building blocks of the Zettelkasten.

==Books, for example, have addresses and cross-references.== They have chapters, sections and pages. All have unique numbers that can be referred to. However, you cannot refer to a thought, an idea or any content. Chapters, Sections and Pages are more like coordinates. ==A thought might spread over the whole book! You cannot refer to it directly with just one reference. A book is not a web of thought.==

Wikipedia, also, is not a web of thoughts, because you can only link to articles and sections within them, but not to individual thoughts inside the text. None of the addresses matches with any thought. Wikipedia is not meant to be such a thing. Rather, Wikipedia is an encyclopedia with each article containing information on a topic. ==Wikipedia is not a thinking tool but a tool for information retrieval.==

Third, there is one Zettelkasten per person, and one person per Zettelkasten. Thinking is a different process from communicating with another person. You want your Zettelkasten to be a personal thinking tool. If you don’t keep your diary absolutely private, you wouldn’t write some things down, and you’d filter other things, therefore distorting them. ==Writing for yourself is and should be different from writing for the public.==

That brings us back to our short definition:

> ==A Zettelkasten is a personal tool for thinking and writing. It has hypertextual features to make a web of thought possible. The difference to other systems is that you create ==a web of thoughts== instead of notes of arbitrary size and form, and ==emphasize connection, not a collection==.

> [!note] typo: s/a web of thought/a web of thoughts/

There are three components that each Zettel has:

1. **A unique identifier**. This gives your Zettel ==an unambiguous address==.
    
2. **The body of the Zettel**. This is where you write down what you want to capture: ==The piece of knowledge==.
    
3. **References**. At the bottom of each Zettel, you either reference ==the source of the knowledge== you capture or ==leave it blank if you capture your own thoughts==.

There are several ways to identify notes, the most common are:

1. There is of course the **Luhmann-ID**. You create some kind of arbitrary hierarchy wherein each Zettel has a place where it could be. Using a paper-based Zettelkasten, I recommend using this technique because it helps to deal with its organisation. The other types of ID wouldn’t work as well for paper.
    
2. You could chose a **Time-based ID**. With a digital Zettelkasten, unlike with a paper-based one, there is no real place for a note. To create the hypertext, you need an address, but not a place. A time-stamp is a very simple way to create a unique string of numbers to which you can refer. A sample time-based ID would be: `202006110955`. Year 2020, 11th of June, 9 am and 55 minutes.
    
3. You can use any **arbitrary unique string**. You could just use an incremental number, execute a program that generates a random but unique string, or whatever else you want. ==The main reason for me to consider this over time-based IDs is the promise to shorten IDs.== For example, if you encode the date and time as a hexadecimal number, `202005191402` could be shortened to `2F08729AEA`. This is a direct translation of the timestamp. That would shorten the string by two digits. There are more ways to make it even shorter than that. But you’d sacrifice some simplicity, and you wouldn’t be able to produce an ID manually. Also, this sacrifices human readability of the time of Zettel creation. Therefore, we do not recommend that approach.
    
4. You could also use the **title** of the Zettel as its ID. As long as it is unique, it can serve as an ID. Consequently, you cannot change the title unless you change any reference to it if you want to keep your links intact. There is some software that would handle this problem for you, but we do not recommend this. We prefer a software-independent approach and keep our independence from software.

> [!note] Other choices: street address, geography coordinates, Git commit ID

The most important aspect of the body of the Zettel is that ==you write it in your own words==. There is nothing wrong with capturing a verbatim quote on top. But one of the core rules to make the Zettelkasten work for you is to use your own words, instead of just copying and pasting something you believe is useful or insightful. ==This forces you to at least create a different version of it, your own version. This is one of the steps that lead to increased understanding of the material, and [it improves recall of the information you process](https://en.wikipedia.org/wiki/Levels_of_Processing_model).==

To manage the references, use reference management software like [BibDesk](https://bibdesk.sourceforge.io/). It will contain the ==bibliographical data== and provides you with citekeys. Citekeys are similar to IDs. They are identifiers by which you can point to the reference you are using (One common format for a citekey is `[#lastnameYEAR]`).

Sometimes, however, you will refer to ==other Zettel== as your source of inspiration. In that case, you base your thoughts on something you have already processed in the past. You reference the Zettel by linking to it via the ID, connecting the new to the old.

Also, Luhmann had [hub notes](https://zettelkasten.de/posts/zettelkasten-hubs/). These are Zettels that ==list many other places to look at for a continuation of a topic==.

> [!note] I guess hub notes are similar to MoCs

==An implicit part of Luhmann’s Zettelkasten was his desk. He could just pull out any number of Zettel and arrange them on his desk as he liked.==

## Introducing the Antinet Zettelkasten

https://zettelkasten.de/posts/introduction-antinet-zettelkasten/

The ==four principles== Niklas Luhmann used to build his notebox system are:

1. ==Analog==
2. ==Numeric-alpha==
3. ==Tree==
4. ==Index==

The ==first letters of those four principles (A, N, T, I) are what comprise an Antinet==. An Antinet Zettelkasten is a network of these four principles.

### Analog

Luhmann did not specify analog as a requirement over digital. The reason why is simple. ==Digital tools were not an option when he started building his Zettelkasten.==

### Notecard Address

This enables what Luhmann phrased as ==“the possibility of linking.”==

It’s merely ==the location of where the leaf lives on a branch or stem on your tree of knowledge. Think of it more like a geographic coordinate system==, like a latitude and longitude scheme (for instance, -77.0364,38.8951).

The Numeric-alpha addresses never change; however, ==due to the infinite internal branching of the system, its position shifts over time==.

### Tree

The third principle is based on something Luhmann refers to as ==“the possibility of arbitrary internal branching.”==

One researcher who studied Luhmann’s system in person says, “==at first glance, Luhmann’s organization of his collection appears to lack any clear order; it even seems chaotic==. However, this was a deliberate choice.”

Think of a Zettelkasten as a tree. A real tree. What does a real tree contain? It contains a trunk, branches, stems, leaves, and vines (depending on the tree). ==Think of each individual leaf as a notecard.== With a Zettelkasten, you’ll be building a tree of knowledge. One that has different branches, different stems of thought, and even ==vines that link to other branches==. This allows one to explore and swing between branches, stems, and leaves.

### Index

==Luhmann calls this concept a “Register.”==

### The Net in Antinet

The Antinet, according to Luhmann, was ==self-referential== in nature. It was self-referential because of its ability to reference itself via the ==numeric-alpha addresses==.

When the four principles are combined into a system, the Antinet becomes a ==thinking tool==, a ==communication partner==, and a ==second mind==. They combine to create many other novel phenomena, such as ==insightful surprises by way of ordered randomness==.



## A Paper Zettelkasten System for Nonfiction Writers

https://analogoffice.net/2022/08/12/a-paper-zettelkasten.html

==Digital for reference==? Yes, please.

> [!note] That's what I understand notes used for. For reference as cheatsheets.

Digital for note-making? ==I just don’t enjoy spending my off-the-clock time staring into a screen==. I realized I was violating my own law! (**Havron’s First Law of Personal Information Management: ==Use tools you love to use.==**)

> [!note] That's why I use an analog camera.

I ==paper and pens==. I will ==happily noodle around with index cards== early in the morning, and long into the night. And thinking is partly noodling around — looking at notes, seeing something you can add, finding connections.

Simple and clear was what I found with a book called How to Make Notes and Write, by Dan Allosso and S. F. Allosso.

He ==does not parse out four or five fine-grained types of notes (fleeting, literature, evergreen, sprout, etc)==.

==He uses two: source notes, and point notes.== ==“Source Notes” are notes he makes mostly from the source but with some initial thoughts and questions.== “Point Notes” are his own thoughts:

“Others have called these ==“Main Notes” or “Permanent Notes” or “Evergreen Notes”==. I called them ==Point Notes== to remind myself that when I write them I should be ==making a point==.” (Allosso 2022, p 66)

## JasperMcFly April 2024

https://forum.zettelkasten.de/discussion/comment/20119/#Comment_20119

My ==hybrid solution== consists of ==two text files==, one to ==list Sources==, and a =="Card List" to list main cards as Einsteigspunkte (entry points) to the slip box==.

My slip box contains ==4x6== index cards with ==only two note types: Source Notes and Main Notes==.

I give ==each source a four digit ID==:
0230 Ready for Anything/Allen; kindle
0231 Getting Things Done/Allen; kindle
0232 Long Psychology of Education; concept schema exemplars

I number source notes with the Source ID, e.g. 0232-4, etc.

My ==Card List contains mostly top-level cards, and sometimes child cards (further on the branch) only if they contain a keyword of interest== (i.e. a place I would want to enter a thread). I use ==Luhmann's alphanumeric numbering for the main cards==.

The ==Card List effectively also serves as a keyword index as I will add keywords to a card title==.

I like that I can leverage digital to search quickly for a source or card location, but keep the fun of taking and making notes on paper.

