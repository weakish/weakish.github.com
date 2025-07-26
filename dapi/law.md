# An Introduction to Law for Programmers

## Prerequisites and Skills

- Basic programming knowledge
- Basic English reading ability

## Books

There are many shoddy books on law.
A naive way to distinguish is to exclude the following 4 categories of books:

1. Books for the general public (since you don't understand anyway, I'll just make something quick and dirty, the rest is marketing work)
2. Books for judicial examinations (tutorial books are already heavily hit by shoddy work, and due to exam needs, they heavily lean toward the academic tendencies of judicial exam writers, with little consideration for practical conventions)
3. Various academic conference brick-sized books (some are heavily padded, some are far from practical problems)
4. Pure legal text books (can't jump to definitions, no related patch information, too inefficient to read)

Of course there will be false positives, but overall the effect is very good.

Recommend the following 2 categories of books:

1. Recently published law school textbooks (help distill the essence of domain knowledge)
2. Handbooks for legal workers (such as lawyers, corporate legal personnel, HR, etc.) (practical pitfalls and experience in filling or avoiding pitfalls)

## Legal Theory

Socialist legal theory with XX characteristics, like XX language being a programmer's best friend, are all advertisements.

You can't learn things just by looking at advertisements - you still need to read more books to improve your knowledge level.

> These are all preliminary opinions, not final decisions yet, and may not count in the future.
> Comrade Liu Bocheng often said a Sichuan saying:
> "Yellow cat, black cat, as long as it catches mice, it's a good cat."
> The reason we were able to defeat Chiang Kai-shek
> was that we didn't follow old rules or old ways, we looked at the situation and winning was what counted.

-- Deng Xiaoping "How to Restore Agricultural Production"


## Structure of Legal Texts

The legal texts here refer to statutes.

From large to small, they are: part, chapter, section, article, paragraph, subparagraph, and item. (Legislative Law s. 54)

### Part

Very large laws have this.

For example, the Civil Procedure Law is divided into four parts:

1. General Provisions
2. Trial Procedures
3. Enforcement Procedures
4. Special Provisions for Foreign Civil Litigation Procedures

### Chapter

Most laws are directly composed of chapters, skipping the part level.

### Section

Longer chapters are divided into sections.

Note that "section" here is the general section in English texts.
In some English-speaking countries' legal contexts, "section" has a specific meaning:

> Section: a subdivision of a statute or document ...
> Most statutes and codes are divided into sections.

-- A Dictionary of the Law (Clapp, 2000, p. 389)

That is to say, this "section" actually corresponds to "article" (条) in Chinese legal contexts.

### Article

This is the most basic structure of law, with granularity roughly equivalent to functions or methods in programming languages.

Article is translated as "article," but as mentioned above, it's often more helpful for communication to translate it as "section."

Since this is the most basic structure, legal references often indicate the article number,
for example, when citing the "Legislative Law" above, we use `s. 54` to indicate Article 54.
Besides `s.`, it's more common to use the form `§ 54`.
I personally prefer `s.` because it's more convenient to type.

### Paragraph

Long articles are divided into paragraphs. Paragraphs begin with two-space indentation and end with a line break.
This is similar to using blank lines to divide paragraphs in long function definitions.

### Subparagraph

Translated as subparagraph, but it's actually equivalent to `ol` in HTML.

We've already mentioned the misalignment between Chinese and English "section."
Actually, paragraph and article also have misalignment. In Taiwan's legal texts, paragraph and subparagraph are reversed.
Taiwan's "item" (項) is actually paragraph, while "subparagraph" (款) is subparagraph.
Taiwan's current usage follows the practice from the Republic of China period.
It may have originally borrowed from the structure of Japanese legal texts.

### Item

Translated as item, also a type of `ol`.

The difference between "subparagraph" and "item":

- At the syntax level, subparagraphs use Chinese numerals in parentheses for numbering, items use Arabic numerals for numbering.
- At the semantics level, items are at a lower level than subparagraphs.
- At the usage frequency level, items rarely appear.

### Example

General Principles of Civil Law s. 134

```
The main ways of bearing civil liability are:     // First paragraph
    (1) Cessation of infringement;               // First subparagraph of first paragraph
    (2) Removal of obstruction;
    (3) Elimination of danger;
    (4) Return of property;
    (5) Restoration to original condition;
    (6) Repair, remake, replacement;
    (7) Compensation for losses;
    (8) Payment of breach of contract penalty;
    (9) Elimination of impact, restoration of reputation;
    (10) Apology.
    The above ways of bearing civil liability may be applied 
separately or in combination.                             // Second paragraph
    When people's courts try civil cases, in addition to applying 
the above provisions, they may also give admonition, order written 
repentance, confiscate property and illegal gains from illegal 
activities, and may impose fines and detention in accordance with 
legal provisions.
```

### Function

The following two examples illustrate how the structure of legal texts helps/hinders our understanding of law.

#### Individual Partnership

In the "General Principles of Civil Law," "individual partnership" belongs to Chapter Two "Natural Persons,"
not Chapter Three "Legal Persons."
The section before "individual partnership" is "Individual Industrial and Commercial Households, Rural Contracted Management Households."

So, without reading specific articles or other detailed laws (departmental laws),
from the structure we can see that partnership enterprises are different from other enterprises and do not belong to legal persons.
Partnership enterprises are actually the result of extending the individual industrial and commercial household model of family management beyond families.

#### Statute of Limitations

Chapter Seven "Statute of Limitations" of the "General Principles of Civil Law" is not very readable,
this is a limitation of legal text structure.
Legal texts only have chapters, articles, subparagraphs and such - their expressive power is very poor.
So sometimes rewriting legal texts as tables, flowcharts, or pseudocode is easier to understand.
Also, converting to pseudocode more easily exposes some ambiguous parts in legal provisions
(including both unclear expressions in the provisions themselves and clear expressions that one hasn't understood).

```
class CivilRights {
    private Period statuteOfLimitations;
    private Period completeStatuteOfLimitations;
    LocalDate knewOrShouldHaveKnownOfInfringement;
    LocalDate wasInfringed;
    boolean voluntaryPerformanceByParties;

    public CivilRights(LocalDate knew, LocalDate infringed, boolean voluntary) {
        this.completeStatuteOfLimitations = Period.ofYears(2);
        this.statuteOfLimitations = this.completeStatuteOfLimitations;
        this.knewOrShouldHaveKnownOfInfringement = knew;
        this.wasInfringed = infringed;
        this.voluntaryPerformanceByParties = voluntary;
    }

    public Period getStatuteOfLimitations() {
        return this.statuteOfLimitations;
    }
    public void setStatuteOfLimitations(Period p) {
        this.statuteOfLimitations = p;
    }

    public boolean isWithinValidPeriod() {
        if (voluntaryPerformanceByParties) {
            return true;
        }
        else {
            // General Principles of Civil Law s. 137 provides that in special circumstances, people's courts may extend.
            // In actual litigation, this generally requires citing judicial interpretations for specific patch situations to extend.
            // Therefore, this situation is not considered below.
            LocalDate today = LocalDate.now();
            // The 1988 Supreme Court Opinion on Implementing the General Principles clarified that the 20-year limit does not apply to suspension and interruption provisions. (s. 175)
            if (Period.between(wasInfringed, today) > Period.ofYears(20)) {
                return false;
            } else if (Period.between(knewOrShouldHaveKnownOfInfringement, today) > this.statuteOfLimitations) {
                return false;
            } else {
                return true;
            }
        }
    }

    public boolean suspend(boolean cannotExerciseRightDueToForceEventOrObstacle,
                        LocalDate suspensionReasonEliminated) {
        if (cannotExerciseRightDueToForceEventOrObstacle) {
            if (statuteOfLimitations <= Period.ofMonths(6)) {
                Period suspensionPeriod = Period.between(LocalDate.now(), suspensionReasonEliminated);
                this.statuteOfLimitations += suspensionPeriod;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public boolean interrupt(boolean filedLawsuit, boolean madeDemand, boolean agreedToPerform) {
        if (filedLawsuit || madeDemand || agreedToPerform) {
            this.statuteOfLimitations += this.completeStatuteOfLimitations;
            return true;
        } else {
            return false;
        }
    }
}

class BodilyInjury extends CivilRights {
    public BodilyInjury(LocalDate knew, LocalDate infringed, boolean voluntary) {
        super(knew, infringed, voluntary);
        this.completeStatuteOfLimitations = Period.ofYears(1);
        this.statuteOfLimitations = this.completeStatuteOfLimitations;
    }
}
// Similarly, we can define `class SubstandardGoods`, `class DelayedOrRefusedRent`, `class LostOrDamagedDepositedProperty`,
// omitted here.

abstract class OtherProvisions extends CivilRights {
    @Override public boolean isWithinValidPeriod();
}
```

## Patch

The troublesome aspect of legal texts is that patches are published separately,
and later patches don't include previous patches.

Therefore, reference books are very important.

Similarly, reading legal provisions directly is not recommended.

If you can't find reliable reference books and have to read legal provisions directly,
you must remain highly vigilant, paying special attention to 2 points:

### 1. Ambiguous parts.

For example, General Principles of Civil Law s. 153

> "Force majeure" as mentioned in this law refers to objective circumstances that are unforeseeable, unavoidable and insurmountable.

This sentence is very ambiguous.
Reading case law can help understand judges' reasoning,
but using this to claim non-liability is very difficult.
You still need to find specific provisions in detailed laws and judicial interpretations.

### 2. Outdated parts.

For example, Article 118 of the 1988 Supreme Court Opinion on Implementing the General Principles of Civil Law states:

> When a lessor sells rental property, they should notify the lessee three months in advance.
> Under equal conditions, lessees enjoy right of first refusal.
> If lessors sell property without following this provision, lessees may request people's courts to declare the property sale invalid.

In 1988, property transactions were not frequent. Now property transactions are very frequent.
At the same time, some places have severe property price fluctuations, so they often want to close deals quickly.
Requiring every transaction to drag on for 3 months doesn't match current practical conditions.

Therefore, the Supreme Court issued a patch update in 2009, first changing 3 months to the more flexible "reasonable period,"
and second changing the breach of contract liability for failure to notify promptly from sale invalidity to compensation for losses.
(Supreme People's Court Interpretation on Specific Legal Issues in Adjudicating Urban Property Lease Contract Dispute Cases, s. 21)
