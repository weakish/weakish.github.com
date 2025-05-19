# Molecular Notes

> [!todo] Right this is a collection of quotes and notes from reading blog posts about Molecular Notes.

The ==three primitives== in Molecular Notes are:

- **Sources**: any ==source of information==: a book, textbook, online course, podcast, youtube video, academic paper, presentation, etc.
- ==**Atoms**: existing concepts or techniques. As a rule of thumb, these will often have Wikipedia articles.==
- ==**Molecules** (similar to “zettels” in the Zettelkasten system): crystallised insights, pieces of intuition, links between Atoms, my ideas.==

These are organised with **Topics**_._

The overall workflow of Molecular Notes is:

> **==Mine Atoms== out of Sources, ==make Molecules== out of Atoms, ==organise everything with Topics==.**

Sources (especially books) are typically composed of:

- ==Concepts==: either original to the author or well-established concepts that the author is referencing as part of their thesis
- Additional ==details, context, and examples== to illustrate the concept.
- ==Thesis==: the author gives their commentary/explanation regarding how concepts link to other concepts.

My note-taking approach reflects this model. I want to ==capture (as briefly as possible) the core thesis of a Source, with reference to some key concepts, along with perhaps one or two of the best examples== since these are often good mnemonic tools.

For example, in NNT’s ==The Black Swan==:

- ==Concept: Black Swans== – events that are rare, extremely impactful, and intrinsically unpredictable.
- ==Examples==: NNT provides several examples from ==finance and history==.
- ==Thesis==:
    - ==Most of history is determined by Black Swans==
    - We should ==be cautious in learning from the past==
    - We should ==collect positive Black Swans==

This model is not universal: ==some Sources, particularly technical ones like textbooks, focus on presenting concepts and techniques, without having a thesis==.

when taking notes from several Sources, I find that ==many concepts are duplicated across Sources==. For example, the Black-Scholes model is discussed in every textbook about options; the narrative fallacy is explained in many books on decision-making; Kuhn’s paradigm shifts crop up all the time.

This leads to one of the ==key tenets of Molecular Notes: we should extract concepts into individual notes – **Atoms** – and link to them from the Source==

There are ==certain Sources (especially blog posts and Twitter threads) that only present one concept==. In this case, it would be wasteful to create a Source note since it would only link to one concept. So I “cut out the middleman”, ==making an Atom and directly linking to the Source==.

> [!question] Why not apply this to all Sources? Mining the atoms and just link to the wikipedia page or website of the Source?



 here are some guiding principles:

- ==The notes should mention all the key concepts discussed by a Source==, but should _not_explain all of these concepts (the explanation should go in the Atom for the relevant concept).
- Aim to reduce the author’s thesis to its simplest form – I ==shouldn’t feel bad about reducing a book to 1-3 bullet points==!
- In essence, ==the note should tell me what is inside the Source, rather than repeating all the contents==. My notes store pointers.
- Regarding structure, I aim for simplicity and flexibility. Consistency is useful but overrated. I like to ==use nested bullets== because they visually emphasise that there are different levels of abstraction. By scanning the top-level bullets, I should be able to quickly get a feel for the thrust of a particular Source. If I need more information, I can start descending into the bullets. If I need more information still, I should just open the original Source!

> [!note] Nested bullets reminds me of OrgMode.


==An **Atom** represents an existing concept==, technique, formula, framework, historical event, or historical figure. It is a piece of knowledge that doesn’t “belong” to me – it already exists, and the Atom is ==merely an explanation of it in my own words==.

> [!note] Feman's method


The ==functions of an Atom== are threefold. It must:

1. Explain the concept to me, such that I can ==rapidly resume a level of understanding I once had== (Objective #2 – _Retaining insights and understanding_)
2. Show ==how that piece of knowledge fits in with other Atoms== (Objective #1 – _Rapidly learning complex topics_; Objective #3 – O(N2) _growth_).
3. ==Point to resources should I need more detail==. Attached to each Atom should be ==a link to some Source (or even just a wiki page / URL) with the “best” explanation I can find for the concept==.

> [!note] Rapid resume is one of the main motivations for me to take notes.



I ==_always_ write Atoms in my own words==. This is a critically important part of understanding something. I aim to ==keep the Atoms very brief==, such that I can rapidly get up to speed. In particular, I am ==not aiming to capture all the details: only the parts of it that are interesting or relevant to my thinking==.

**Molecules** (==a.k.a “permanent notes” in the Zettelkasten system==).

a ==Molecule== is an _insight_. This insight ==should be self-contained and discrete== (in the sense that it can stand on its own). My Molecules are ==typically only a couple of sentences – a paragraph at most. In most cases, a Molecule will “build on” one or more Atoms== (which is why I called it a Molecule in the first place).

here are several types of Molecules along with examples.

- Original insights I have, often ==inspired by some Source==. (When I say “original”, I mean “originated by me”. I doubt any of my ideas are original in the sense that they haven’t been thought of before).
- Original insights I have, ==related to an Atom==:
- ==Links between two Sources==, e.g. when I notice that two Sources are talking about the same concept in different ways:
- ==Links between two Atoms==
- ==Intelligent pieces of commentary related to a Source==

> [!note] Thoughts on and among Sources and Atoms, or original thoughts.



**Molecules** are _insights_ – ==either my own, or an insight I have internalised from a particular Source==. Creating Molecules is the primary goal of Molecular Notes!

I want to ==highlight several areas in particular where I think Molecular Notes is _not_ well suited== (without modification).

For students taking ==closed-book non-essay exams== (particularly STEM subjects), I recommend using a note-taking system that better matches the exam format and treats spaced repetition as a first-class citizen.

Secondly, while I think many of the ideas in Molecular Notes are highly relevant to academics – particularly the ability to look for connections across Sources – more emphasis would need to be placed on collating references from articles. ==In academic writing, it is sometimes useful to have verbatim quotes from another article, while in Molecular Notes this is rare.== If one’s goal is academic writing, the original Zettelkasten system may be a better fit.

> [!tip] Maybe also append verbatim quotes in Sources?


Lastly, ==Molecular Notes is entirely optimised for evergreen content==, as opposed to tracking ongoing events or dealing with new situations

the ==main primitives in the Zettelkasten system== are:

- ==**Reference notes**==: contain ==bibliographic information== about a source, along with a ==brief summary== of the source.
- ==**Literature notes**==: ==a summary of a particular point made in a Source==. When you read a Source, you will generate many separate Literature notes.
- ==**Permanent notes** (zettels)==: your insights.

The main reason I needed to evolve beyond ==Zettelkasten== is that it ==lacks a good primitive to deal with established concepts==.

> [!note] Well, in academic environment, established concepts should link to the original source.


Secondly, ==many aspects of Zettelkasten arose out of the physical medium that Luhmann used (literal slips of paper in boxes). The decision to have Literature notes as separate individual notes makes sense in the context of physical slips of paper (writing a large document would make it hard to restructure), yet in a digital system I think it’s much easier to have all of my notes (or at least _pointers_ to notes) from a given Source in one document==. Luhmann’s original Zettelkasten also uses a nontrivial naming convention to represent backlinks – something that is clearly unnecessary with a digital Zettelkasten.

> [!note] And it also arose out of the time before Internet. In the era of Internet, reference notes should be outsourced to something like Wikipedia.

We should remember that Luhmann devised the Zettelkasten system to be a more productive sociologist. ==Sociology, as I understand it, largely involves the analysis of different qualitative theories – it deals with a smaller body of known facts/concepts and a larger body of qualitative discussion== (this is not meant to denigrate sociology in any way). ==For STEM subjects, on the other hand, there are textbooks full of known concepts and techniques==. I want to learn when to use these concepts and how they all connect – Zettelkasten is not naturally suited to this.

> [!note] I think the main reason is textbooks are not covered by Zettelkasten system. In academic writing, you usually do not cite textbooks.

Evergreen Notes is a system developed by Andy Matuschak, similar in many ways to Zettelkasten

Firstly, ==there are no Source notes==. As Matuschak explains, his system is designed to optimise for creative thought rather than ingesting other peoples’ ideas so there isn’t a great way to take linear notes on a textbook, for example.

> [!note] This agrees with my initial thoughts when reading the former part of this blog post.

Secondly, he ==doesn’t use categories of any kind (this criticism applies to Zettelkasten as well)==.

==Following on from the above, the lack of structure makes his system (at least the public version) very hard to navigate==, especially since it lacks search functionality and a graph view.

 I want to outline some failure modes that you should take care to avoid!

- Categorisation hell:
    - ==Don’t spend too much time trying to come up with a fancy categorisation scheme.==
    - Pick something simple and flexible – something that you can build on top of as you get a better understanding of your particular needs
- Completionism:
    - Don’t add irrelevant things to your Second Brain.
    - ==It can be tempting to try and be comprehensive but this leads to notes that are harder to review==
    - Not every concept deserves its own note!
- ==Complicated metadata==:
    - Don’t try to overcomplicate the metadata – when I create a new note I only need to put three fields: “Topics”, “Reference” and “Type”.
    - Anything complicated starts to be a barrier to creating notes.
- Copy-pasting content:
    - ==Copy-pasting== is a no-go: it defeats the purpose of a Second Brain.
    - Further, it ==dramatically reduces retention while simultaneously encouraging completionism==
- Not being intentional about note-taking:
    - Don’t slip into autopilot and make traditional notes!
    - Molecular Notes requires you to actively engage with the content, restructure old Sources even as you’re consuming a new Source, and constantly be on the lookout for opportunities to link ideas.

https://reasonabledeviations.com/2022/04/18/molecular-notes-part-1/

Molecular Notes (as a note-taking philosophy) is not tied to any particular software tool. ==The only non-negotiable constraint is strong support for bidirectional links== – when you link from note A to note B, note B should be aware that it has just been linked to.

> [!note] Maybe I should add backlinks to my site?


there are VSCode extensions (like [Foam](https://marketplace.visualstudio.com/items?itemName=foam.foam-vscode) and [Dendron](https://marketplace.visualstudio.com/items?itemName=dendron.dendron)) that essentially turn VSCode into an Obsidian clone. I use Dendron at work because I don’t have access to Obsidian behind the company firewall.

These apps are quite similar to Obsidian but ==the UX is slightly less polished because of the IDE’s constraints. The learning curve was a lot steeper since the target audience for these apps are software developers== (not many “normies” have VSCode installed!).

> [!note] There are also language servers with similar concepts. The problem bothers me is that these do not work on my phone.

==I use tags to encode the _type_ of a note. That is, a tag should represent “is-a” relationships==: this note “is-a” book note, this “is a” Molecule etc.

All of my Source notes have an additional tag denoting ==what type of Source it is, e.g. a book or an article==. Most of my Atoms have an additional tag denoting ==the type of Atom==, for example it could be a ==tool, historical event, formula==, etc. In the list above you may be surprised to see ==“cognitive-bias” as a tag – arguably this should be a Topic instead. But so many of my Atoms are cognitive biases that I think it is a suitable tag==.

Obsidian has a cool feature that allows you to ==colour graph nodes by tag==:

==All Atoms go in the main Obsidian vault, not in subfolders.== This decision was based on the observation that opening Atoms is probably the action I do most often, so I should ==reduce the number of clicks as much as possible==.

I use folders to house specific types of notes: Authors, Molecules, Sources, and Topics. A reasonable question: doesn’t this create duplication between folders and tags? ==Why bother creating a folder where everything inside it is tagged a certain way? The answer is that folders speed up navigation; they are great for “skimming” your Second Brain.== For example, I often want to skim through a list of my Molecules. While I could do this using a search for “tag:#molecule”, this is such a common task that it’s more efficient to be able to simply click “Molecules” in Obsidian’s file explorer and be able to quickly look through.

As a very rough rule of thumb, I ==make something a Topic if I think more than ~5-10 notes will link to it==.

But rather than doing this as plain text, I ==make an empty Author note== (containing only `Type: #author`) and link to that.

these advantages only materialise when there are several Sources from the same Author in your Second Brain (or you reference the Author in Atoms/Molecules). ==If this is unlikely to be the case, e.g. if I’ve read a one-off blog post from some random author, I will leave the author as plain text.==

One downside of making placeholder Author notes is that one ends up having to create a lot of notes which then need to be filed away into folders (at least according to my organisation principles). I have written ==a python script that does this all for me==

> [!question] Why not use a field in YAML front matter?

 If ==two Sources are explaining the same concept==, that ==concept should be extracted into an Atom== and linked to by both Sources.

> [!note] Much like extract to a function.

Before making notes on a Source, I first ==pull up similar Sources so I can get a better grip on what’s already in my Second Brain==. Often, I end up restructuring my old notes at the same time as making new notes!

Notes should be ==hard to write but easy to review== – put in the effort to rearrange things until the structure makes sense!

> [!note] like code

==Converting textbook prose to nested bullets== isn’t always easy, but having to re-arrange concepts ==helps me internalise the material==.

> [!note] What people frequently ask AI to do for them.

I’m ==not at all consistent with how I name Source notes==– sometimes I use the original title, sometimes I append the author e.g. `Complexity, Mitchell`. For journal articles, I will either use the title or the reference, e.g. `Avellaneda and Stoikov (2008)`.

How do I decide? I ==name the note whatever I would like to reference it as.==

I generally ==avoid abbreviations== because the marginal effort of linking a long name is tiny due to autocomplete. Again, there are ==some exceptions to this – if the abbreviation is strongly embedded in my mind== (e.g. `GEB` for `Godel, Escher, Bach: an Eternal Golden Braid`), I will just use the acronym!

> [!note] Like naming a variable.

- My book review and highlights are contained in Notion (they can be viewed [here](https://robertreads.notion.site/)).
- I then ==copy the key highlights into a Source note==.
- I ==extract “known” concepts into Atoms and crystallised pieces of insight into Molecules==.
- I look through other notes from the same Topic (using the local graph) to find potential connections.

Here are some guidelines when making notes on textbooks:

- Consume the content in at least two passes:
    - I normally read over a textbook (or watch lecture videos) once on 2x speed just to get an idea of what ideas it contains, before making proper notes on a second pass.
    - This helps me have a sense of what’s important – or indeed if the textbook is worth reading!
- Mimic structure:
    - I generally follow the structure of the textbook because it makes it much easier to refer back to the original textbook when I need additional details.
    - Obsidian lets you link to headings, so in other notes, I could refer to _Volatility Trading Chapter 2_ with a proper backlink (see the Obsidian [docs](https://help.obsidian.md/How+to/Internal+link) for an explanation)
    - But one must be careful not to fall into the trap of completionism: just because we are following the textbook’s structure _does not_ mean that we need to take detailed notes on every chapter! I sometimes leave chapters as just a heading if the ideas aren’t immediately relevant to me.

- Utility over comprehensiveness:
    - We don’t need to re-explain everything in the book! In fact, we should think of Source notes as a collection of pointers. The note should just tell you what is in the Source.
    - Unless you expect a concept or idea to be particularly important for your thinking (in which case you should extract it into an Atom or Molecule), feel free to write nothing more than a minimal phrase to remind you of its existence.

Probably the most differentiated aspect of my textbook workflow (compared to typical textbook note-taking) is that ==only 70% of the time spent making textbook notes is spent on that particular textbook. The other 30% is spent extracting relevant Atoms from other textbooks==. For example, I was recently making notes on Ben Lambert’s excellent course on undergraduate econometrics. I had previously read a textbook called _Forecasting – Principles and Practice_ that had a lot of overlap, especially on the subject of time series. So I kept this open in the right pane, and whenever there was a concept that was discussed both by Lambert and _Forecasting_, I would extract it into an Atom.

> [!note] What about reading two or more textbook at the same time?

I generalise blog posts, YouTube videos, Twitter threads etc to “information media” (infomedia).

The main difference between these types of infomedia and books/textbooks is that they typically focus on a much narrower range of concepts – often just one!

In these cases, I will often directly create an Atom to explain the concept (in my own words of course) then ==link to the infomedia directly (not to a Source note of it)==.

There are several types of podcasts, each of which I treat differently (a list of the podcasts I consume can be found [here](https://reasonabledeviations.com/about/#information-diet)).

- ==General news and current affairs== (e.g. _All-In_): I ==don’t make notes== on these – I listen to them in the gym and they are primarily for entertainment.
- ==General interviews==, e.g. _Invest Like the Best_, _Masters in Business_: I ==occasionally take notes if there is an insight that strongly resonates with me==.
- ==Evergreen interviews==, e.g. _Flirting With Models_: these are podcasts that have been carefully designed to be dense in evergreen information. I make notes on these as if they are online courses (i.e ==textbook-equivalent==).
- ==“Long-form”==, e.g. the _History of Rome, Huberman Lab_: as above, I treat these as ==online courses==.

I use ==an app called Airr that allows me to make audio highlights; when I hear something interesting, I press a button to record an AirrQuote== and if convenient I make a text note (these are optional).

At certain intervals (e.g. every few episodes, or every season if I’ve gotten lazy) I ==compile all the highlights into Source notes – either one note per podcast or one note per podcast season depending on the information density==.

> [!note] If per season then the density is very low and I will ask myself why I listen to them?

My Source notes for ==journal articles are most similar to my Source notes for books==: they are often very short, highlighting just the key ideas that are relevant to my thinking.

Most often, ==the process starts while I’m making notes on a particular Source: perhaps the author discusses a concept that feels vaguely familiar or has a similar flavour to something I’ve come across before==. I then gently poke around my Second Brain to try and see if there’s a deeper link.

The local graph is useful here because I have configured it to show both first-degree and second-degree neighbours. The ==second-degree neighbours are often a fertile hunting ground for connections==. In the example below, the “Goal preservation” Atom links to the AI Topic. The local graph shows not just the neighbours of “Goal preservation”, but the neighbours of “AI” too. I can then skim these to see if there are additional links to “Goal preservation”

There are a tonne of third-party extensions available for Obsidian which require very little effort to set up. For example, ==the Mind Map extension lets you view your notes as a mindmap (provided you have structured them properly, using nested bullets):==

> [!note] So why canvas isn't built on nested bullets?

I often interact with my Obsidian vault via VSCode, a programming environment.

Backlinks don’t work here, but there are several reasons why this is useful:

1. You can use ==VSCode’s powerful text editing functionality==. For instance, in Obsidian there isn’t an easy way to do a global find and replace across all notes, but this is trivial in VSCode (plus you can do regex find/replace rather than just plaintext).
2. Better support for ==git backups==. Obsidian does have a git extension, but in VSCode you can look at diffs and see exactly what is being changed.
3. More convenient to ==write python scripts that interact with my Second Brain== (see below).

My helper script does the following:

- ==Moves files with a given tag into the appropriate folder== (e.g. Authors, Molecules, Sources)
- ==Creates Author pages==: if I’m making a new Source note and write `author: [[New Author]]`, it doesn’t actually create a page for the author (unless I click on the backlink). My script looks through these linked-but-not-created pages and makes an Author page (empty apart from `type: #author`).
- ==Creates Topic pages==: same as for Authors.
- ==Makes a list of notes that I need to review:==
    - Notes that I’ve ==tagged `#todo`==.
    - ==Orphan notes== that aren’t linked to by anything and don’t link to anything.

I then set up an alias where ==if I run `obsidian` in terminal, it cleans up my library and gives me a report.==

I built a spaced repetition (flashcard) tool called Polymer to help me review my notes in a different way.

Like other flashcard tools, Polymer ==flashes the title of an Atom or Molecule and I try to recall the contents. I then press “Show” to check my understanding, before clicking one of the Difficulty buttons to tell Polymer how hard I found it to recall the note==. It then uses a dumb spaced repetition algorithm (explained below) to decide when it should next show me the note.

I currently don’t have good entry points into most of my Topics. For example, if I want to refresh myself on concepts related to Management, I tend to wander around the local graph.

In future, I would like to have better indexing via “Maps of Contents” (MOCs). ==A MOC is simply a semi-structured way to explore a particular Topic. Rather than leaving the Topic note empty, I should use it to organise notes.==

Obsidian is very well suited to creating a garden of permanent notes. But in fields like finance, one must also track ongoing events and examine how certain narratives play out over time. This is a task that traditional systems like OneNote, MS Word, or even email threads are actually quite good at because by its nature, event-tracking is more “linear” with the flow of time.

==One of my exploration areas: can we design a system that combines linear event tracking with an interlinked Second Brain? I have been exploring some workflows based on Daily Notes (a popular concept in Second Brain circles)==, but haven’t settled on anything concrete yet. There are some tools like [reflect.app](https://reflect.app/) which aim to solve this but I haven’t really explored them.

https://reasonabledeviations.com/2022/06/12/molecular-notes-part-2/

 ==I don’t use yaml because of weird interactions with backlinks==, but I’d probably put a #private tag then filter these out

https://github.com/robertmartin8/MolecularNotes/issues/2

