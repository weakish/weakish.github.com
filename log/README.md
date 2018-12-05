Hello ZeroMe! (Hmm, I can follow myself!)

-- 2016-08-13


[SetupList](http://127.0.0.1:43110/1Mbwaw4Uxp1sq5GzWo3SCmYFTk7mgSWNmw) is online! (SetupList is a 0List clone for sharing software/hardware you are using.)

-- 2016-08-18


If 15441 is closed on your machine, you can use an ssh tunnel to accelerate publishing your zites:

```sh
ssh -2 -N -R 15441:127.0.0.1:15441 -A -D 1080  root@REMOTE_IP
tsocks python zeronet.py
```

Note you need to enable `GatewayPorts` of sshd service on the remote machine beforehand.

```sh
sudo sh -c 'echo GatewayPorts yes' >> /etc/ssh/sshd_config
sudo service sshd restart  # On some OSes, replace `sshd` with `ssh`.
```
 

-- 2016-08-18


Zite (ZeroSite) publish procedure:

1. publish your site (better with 15441 open)
2. browser your site via [ZeroNet proxy](https://bit.no.com:43110/) to make sure everything is O.K.
3. publish your site on [0list](http://127.0.0.1:43110/0list.bit), [Zero Central](http://127.0.0.1:43110/1Dt7FR5aNLkqAjmosWh8cMWzJu633GYN6u) and [New 0Net Sites](http://127.0.0.1:43110/1LtvsjbtQ2tY7SCtCZzC4KhErqEK3bXD4n).

-- 2016-08-18


## How to backup your favorite sites

tl;tr Favorite sites are stored in LocalStorage only. Switching browser or clearing browser data will reset all favorite sites.

0. You are browsing a ZeroNet site.
1. Open "Web Developer Tool" (or something similar) > Application > Storage > LocalStorage > http://127.0.0.1:43110
2. Find the key starting with `site.1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D`
3. Copy its value `{"sites_orderby":"peers","favorite_sites":{"1MeFqFfFFGQfa1J3gJyYYUvb5Lksczq7nH":true,...}}`
4. Save its value to a safe place (a txt file on computer, a mail to yourself, etc)

Restore: Right-click the value `Edit "value"` and replace with your backup.


-- 2016-08-20


Considering a variant of [semver](http://semver.org) major.nth_feature_introduced.YYMM

-- 2016-08-20


TeXmacs is still unstable. Make sure auto save is turned on.

-- 2016-08-25


Google Buzz, Google Wave, Google Reader, Google Code. Now Google Chrome App (by 2018, except on ChromeOS).

-- 2016-08-27


Today I was bitten by `Refused to execute script from ... because its MIME type (text/plain) is not executable, and strict MIME type checking is enabled` when hot-linking a js file hosted on GitHub.

Then I found out that `raw.github.com` is not truely raw access to file asset,
but a view rendered by Rails.
So accessing `raw.github.com` is much heavier than needed.
I don't know why `raw.github.com` is implemented as a Rails view.
Instead of fix this route issue, GitHub added a `X-Content-Type-Options: nosniff` header.

It sounds like a hot fix to me:

- **A:** Let's just make raw a Rails view, so it is simple to write routing code.
- **B:** But this hurts performance.
- **A:** No, programming time is more valuable than processing time. If more human beings view the raw, let's just convince VCs to invest more money for more machines since we are so successful that we have some many views.
- **B:** But there are sites use GitHub to host scripts.
- **A:** No, they should not do this because Rails view is heavy. Let's block them by adding an HTTP header. It's simple.
 

Workaround:

- Put the script to `user.github.io/repo`
- Use a third party CDN like rawgit.com.

-- 2016-08-27


List of all known ZeroMe hubs: https://weakish.github.io/ZeroMeHubList/

-- 2016-08-27


Duokan (ebook app) exports highlights and notes to Evernote **without page numbers**.

-- 2016-08-29


I think hg may fit ipfs more well than git. Like git's dumb http, hg supports [static http](https://www.mercurial-scm.org/wiki/StaticHTTP). Unlike git's changing-all-the-time packfile, hg's revlog is predictable. So hosting hg repos on ipfs is simpler (no need to unpack objects manually), and saves bandwidth (git repos with unpacked objects is usually larger than hg). 

-- 2016-08-29


"IPFS is the Distributed Web ... aims to replace HTTP". WTF! A web of GET and PUT only HTTP? And FS is not file system but web?

-- 2016-08-29


The web flame: pretend that you cannot find exciting, new, modern technologies outside web.

-- 2016-08-29


Cloned site private key recovery:

If `This is my site` in site menu does not works, you can try manually recover cloned site private key (they are generated from your master key in BIP32).

**Warning**: untested

- Make sure you are seeding your LostSite.
- Stop Zeronet.
- Get LostSite `address_index` in `data/LostSiteID/content.json`.
- Get your master key `master_seed` in `data/users.json`.
- Edit `Actions.main(self)` in `src/main.py`,  see below.
- Now start Zeronet, you will see site private key in output. Record it.
- Stop Zeronet. Delete recovery code added above.
- Edit `data/users.json`,  fill the record value (quoted) in `privatekey` at LostSiteID.
- Edit `data/sites.json`, set `own` in LostSiteID to `true`.
- Start Zeronet. Now you should be able to edit/publish your site.

Added code in `src/main.py`:

```python
class Actions(object):
     # code omitted
     def main(self):
          # code omitted
          # Add code below.
          logging.info("--------------------DEBUG: Recovery Begin--------------------")
          from Crypt import CryptBitcoin
          logging.info(CryptBitcoin.hdPrivatekey("YOUR_master_seed", YOUR_address_index))
          logging.info("------------------- DEBUG: Recovery End--------------------")
          # Added code ended here.
          
          logging.info("Starting servers....")
          # code omitted
```

-- 2016-08-30


Just add a 0BSD style license on my profile page: Permission to use, copy, modify, and/or distribute all my posts and comments at ZeroMe for any purpose with or without fee is hereby granted.

-- 2016-08-30


[An example of ZeroSite of photos](http://127.0.0.1:43110/ZAlex.bit/photos/index.html)

-- 2016-08-31


Wish every programming language website has [a gentle introduction like  Ceylon](http://ceylon-lang.org/documentation/1.2/introduction/), demostrating both basic usage and advanced features, but not lengthy. 

-- 2016-09-01


I used to confuse coding style with formatting style. Formatting style like `using n spaces to indent` and `closing brace on its own line` are unlikely to affect readability of code, and they can be auto adjusted via IDE or command line tools. What really matter is coding style, like `if (a=0)` and `++i`. PEP 8 for Python talks a lot about formatting style. This is a cost of Python's layout based (indentation sensitive) syntax: possibly cleaner for small pieces of code, while hard or impossible to be auto formatted by tools like IDEs (crucial for a large code base).

-- 2016-09-03


`i++` should be a pure side effect, a.k.a. `void`, just like `b = c` should be `void` (invalidating `if (a = 0)`).

-- 2016-09-04


IDEs for static typed languages are so powerful, particularly for refactoring. The dark side is making me less acclimatized to dynamic typed languages IDEs, e.g. even PyCharm and RubyMine cannot match IntelliJ or Eclipse.

-- 2016-09-07


In Python, whitespace (space or tab) can be used: (use dot to indicate whitespace)

to **indedent** code (removing will cause error)

```python
def id(x):
....return x
```

and **align** code (can be safely removed)

```python
x.............= 1
long_variable = 2
```

Thus I think it is a good idea to distinguish them with different characters: use `tab` for **indentation**, and `space` for **alignment**.

PEP 8 has a different opinion:

- Use `space` for indentation.
- Keep code unaligned.

-- 2016-09-09


Relieased that I have forgotten what does Hallelujah mean. To me it means some beautiful nonsense in music.

-- 2016-09-11


`camelCaseAreHardToReadIfThereAreMoreThanThreeWords`

`under_line_is_much_easier_to_read`

Exceptions:

- `TypeName` since `TypeNamesWithMoreThanThreeWords` should be avoided.
- `FooBar fooBar` so wherever we see `fooBar`, we know it is of type `FooBar`.


-- 2016-09-12


There are currently 18 ZeroMe hubs (excluding empty hubs with no registered user). And I am seeding 5.  via [zerome-crawler](https://weakish.github.io/zerome-crawler/)

-- 2016-09-16


An ugly workaround of TypeScript's structural typing:

```typescript
type Kind1P = "1p";
type Kind2P = "2p";
type KindHUStrNum = "string | number";

function f(x: number) {
    return x;
}
function g(x: number, y: number) {
    return x + y;
}

let no_f: (x: number, y: number, kind: Kind2P) => number;
function wrap_g(x: number, y: number, kind: KInd2P = "2p") {
    return g(x, y);
}
no_f = wrap_g;

function higher(
        f: (x: string | number, kind: K1P, kindH: KUStrNum) => string,
        y: string | number
        ) {
	console.log(`calling ${f}`);
	return f(y);
}

function sub(x: number): string {
	return `${x * x}`;
}
// higher will not accept `sub`!
```

-- 2016-09-17


All my todos are on wunderlist, which is down now. And I can hardly remember what to do. If wunderlist is implemented as a ZeroSite ...

-- 2016-09-21


[Snapshots of all current, non empty, functional ZeroMe hubs](https://github.com/weakish/0me-hubs-snapshots), 
powered by [0net-snapshot](https://github.com/weakish/0net-snapshot).

-- 2016-09-22


`A then B else C` in Ceylon feels confusing to me.

`A then B else C` looks like `A ? B : C` in other languages, but they are **not the same**:

1. `A then B else C` is actually `(A then B) else C`:

         * `A then B` evaluates to `B` if `A` is not `null`, otherwise evaluates to `null`.
         * `X else Y` evaluates to `X` if `X` is not `null`, otherwise evaluates to `Y`.

2. Thus the type of `B` is `T given T satisfies Object`, i.e. requires to not be `null`.

I think `if (A) then B else C` is much cleaner.

-- 2016-09-25


Found an old macro (in a lisp like language) I wrote a year ago. Now I have difficulties to understand it.

-- 2016-09-29


GitHub helps spreading Git. But there is no balanced competitor currently. This is anti-decentred for a DVCS.

-- 2016-09-30


Finally iPhones get water resistent.

-- 2016-10-02


Visual Studio Code: "Code editing. Redefined." How a code editor borrowed a lot from SublimeText and TextMate dare to declare this?

-- 2016-10-03


vscode is open source (MIT) and Visual Studio Code is proprietary. So confusing the names!

-- 2016-10-06


Thought there was something wrong with the sound configuration on my machine. Then I found out the mp3 I was playing is 32kbps.

-- 2016-10-07


September 2015 Evernote Food shutdown. dianping.com (restaurant review site in China) also shutdown its public API service (individual developers cannot apply API access, APIs are only available to a few parterners) on that month.

-- 2016-10-08


 Windows Mobile does not support two factor auth, you have to use an app password. Now app password does not work on my phone (used to work on previous versions of Windows Mobile 10). I have to turn off two factor auth. Not too old Android versions support two factor auth out of the box.

-- 2016-10-10


Programming languages are clearer than natural languages. So "well-commented code" may not be well-written.

To reduce commenting:

- Use meaningful function and variable/value name.
- Declare local variable near its usage.
- Avoid deep nested function call expression. Extract meaningful immediate value declaration.

Here 'commenting' mainly refers to inline comments,
i.e. comments explaining implementation details.
Doc annotation of public modules and functions on their usage is fine.

-- 2016-10-13


I prefer explicit else branch over fall through flow.

For example:

```ceylon
Boolean if_else(Integer x) {
    if (x > 0) {
        if (x < 10) {
            return false;
        }
    } else if (x < -10) {
        return false;
    }
    return true;
}
```

It is short, but difficult to figure out the control flow.

Rewrite it more explicitly, without omitting else branch:

```ceylon
Boolean if_else(Integer x) {
    if (x > 0) {
        // This is for demonstration only.
        // `if (x > 0, x < 10)` is clearer.
        // Pretend there were more complex branching here.
        if (x < 10) {
            return false;
        } else {
            return true;
        }
    } else if (x < -10) {
        return false;
    } else {
        return true;
    }
}
```

Also, avoid using `variable` to save else branch.

For example:

```ceylon
variable Integer x = 0;
if (condition) {
    x = 1;
}
```

can be rewritten to

```ceylon
Integer x;
if (condition) {
    x = 1;
} else {
    x = 0;
}
```

-- 2016-10-18


In Ceylon, cases in `switch` need to be both disjoint and exhausted. Using a strict form helps to reduce bugs.

For example, suppose we have the following code:

```ceylon
Path path = current;
if (is Directory path) { // typo, should be `path.resource`.
    // ...
} else { // dead code
    // ...
}
```

There is a typo in the above code, `path` should be `path.resource`.
So the above code will never go into the else branch,
since a Path is always not a Directory.

However, if we use switch with explicit cases:

```ceylon
switch (path)
case (is Directory) {
    // ...
}
case (is File|Link|Nil) {
    // ...
}
```

The compiler will refuse to compile, saying cases are not exhausted.

-- 2016-10-21


citibank's "change password" gives misleading error info ("must contain at least 1 digit and 1 letter") if new password contains some special characters like `@`.

-- 2016-10-23


The main audience of code is human beings, not tests. Improving testability should not harm readability.

-- 2016-10-25


WTF! New generation of MacBook Pro!

It's Pro so it does not need to be so thin that it uses  a painful to type keyboard as on MacBook. Unified type-C is too cool to connect other devices. Even Apple self's devices are not unified, so you cannot charge iPhones without an adapter. Also replacing MagSafe with type-C is obivously a regression. And the 13" version only has two slots! Also the price is much expensive than older genrations. 

In fact, Apple now effectly does not sell laptops. MacBook and MacBook Air only has 4 or 8GB unupgradable RAM. Now they ruied MacBook Pro, the only series of sufficient RAM.

-- 2016-10-28


mp3.163.com (a music distribution site in China) does not have any API. In fact it even encryptes post params with some home made algorithm (the algorithm is different on different clients and is evolving, the current API in web UI is based on AES, RSA and MD5) on HTTP (it does not support HTTPS). That's why I have never registered an account on it. 

-- 2016-10-29


The email to onfirm email address on dida365.com (Chinese version of TickTick) does not show any explicit url link. The link it is hide in HTML. It is wrong to assume every email client renders HTML correctly.

-- 2016-10-31


Although Python still does not understand type hints, at least IDEs will give a warning. Or you can check types via `mypy`.

-- 2016-11-02


All Linux distributions where UEFI Secure Boot works out of the box (e.g. Fedora, OpenSuse, Ubuntu) are using systemd! #WTF

-- 2016-11-03


For any one want to pick up programming language , I recommend [The Little Schemer](https://www.amazon.com/Little-Schemer-Daniel-P-Friedman/dp/0262560992)，less than 200 pages and can be finished in a weekend. It starts from zero and gradually introduces concepts like recursion, higher-order functions, curry, Church encoding, halting problem, lambda calculus,  fixed point, Y combinator, continuation, CPS, Godel Incompleteness Theorem, and a basic interperator for a simplified progarmming language. 

If you think The Little Schemer is expensive, you can try [CoffeeScript Ristretto](https://leanpub.com/coffeescript-ristretto), somehow a translation of The Little Schemer to CoffeeScript, which can be read on line for free. 

Do not worry the above books do not use a language you are going to use in your work. After all, the right approach to pick the certain programming language you are going to use is to focus on  semantics, instead of syntax; focus on concepts, instead of concrete details; focus on good parts, instead of all parts; also learning the implemantation of the language is a good way, since modeling is an effective way of learning (no need a full implement, also not worry about performance, just implement basic and import concepts).  The Littele Schemer fully conforms to this approach. Once you learned the scheme language with it, you know how to learn a new languge, and you know essential concepts of programing language. Then you can just pick up any language you are going to use in the same way. And because you only need to understand new semantics and concepts of the new language, it will be fast. For syntax, just use a good IDE or setup your editor properly.


-- 2016-11-03


A quick review of germ.io:

What is cool:

- Distinguish ideation with action.
- Distinguish completed with not taken.
- Nested sub list.
- In action view, tasks(germs) with sub-tasks actionable are marked with a lock icon.

Missing:

- No export data.
- No mobile client.
- Status (Ideation, action, etc) is unclikable on overview.
- Note markup is Rich text, no option for markdown.
- No markup for code block.
- When change status from ideation to action, assign to no one by default, should assign to the one change status by default.
- No way to hide completed and not taken tasks.


-- 2016-11-04


Use registery to swap keys under Windows.

For example, use Caps Lock key as an addtional Escape key.

```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
"Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,01,00,3a,00,00,00,00,00
```

Notes:

- `00,00,00,00,00,00,00,00`: header.
- `02`: data length (`n + 1` where `n` is numer of mapped keys).
- `00,00,00`: end of data length.
- `01,00`: Esc.
- `3a,00`: Caps.
- `00,00,00,00,00`: end.

-- 2016-11-13


Windows 8.1's Microsoft Pinyin input method:

1. cannot change double pinyin schema
2. no keyboard shortcut to switch between traditional Chinese and simplified Chinese
3. no option to set default to English

-- 2016-11-14


After repositioning Windows 8.1's task bar to left, right, or top, hovering cursor to bottom left corner still reveals the windows start icon.

-- 2016-11-15


JavaScript's ASI (auto semicolon insertion) is confusing. However, if I prefer to not omit semicolons, I only need to remember one rule: not  breaking line after `throw`. (There are other rules, but I am unlikely to write code related to other rules, e.g. `i\n++\nb`.)

On the other side,  if I prefer to omit semicolons, I need to remember additional rules:

- `(`
- `[`
- `.`
- `,`
- `+`, `-`, `*`, `/`
- `for` and `while`

Thus my choice is not omitting semicolons.

-- 2016-11-16


Quora hides posts/answers to force you to register/login. Now its Chinese clone Zhihu finally borrows this "feature".

-- 2016-11-17


TypeScript 2.0 brings in more fix of the poorly designed type system:

```sh
tsc --strictNullChecks --noImplicitThis --noUnusedParameters --noUnusedLocals
```

-- 2016-11-20


[Watch Trump's Pick to Run the CIA Call Edward Snowden a 'Traitor' Who Should Be 'Given a Death Sentence'](https://reason.com/blog/2016/11/18/watch-trumps-reported-pick-to-run-the-ci).

I said before the election result came out that Trump is evil. "Make America great again!" This sounds like what Beijing announced  in 2012: "The Chinese Dream is the great rejuvenation of the Chinese nation."

Bradley Manning is aleray in prison. Assange hides in Ecuadorian Embassy, and Snowden has been kept in Russia for 3 years.
Make America great again so the great U.S. government could brought back Assange and Snowden and given them due process?

I bet the greatest archivement of Trump would be what he had done before elected as U.S. President: stopping Hillary.

-- 2016-11-22


Flaws of TypeScript's type system:

- functions with fewer parameters are assignable to functions that take more parameters,
- non-void functions are assignable to void functions,
- all types are assignable to empty interfaces, and
- TypeScript cannot infer expected type with unused parameter in generics.


-- 2016-11-23


Overloading an operator should be consistent to all types supporting the operator.

-- 2016-11-24


Kotlin uses `Array<T>` for `vararg p: T` (variadic functions) underhood, but:

- Basic types are special, e.g. `IntArray` for `vararg p: Int`.
- `p: Array<T>` and `vararg p: T` behaves differently. In other words, given a function `Array<T> -> Unit`, we do not know how to invoke it just from its signature. (`Array<T> -> Unit` may be an infix function, but all infix functions can be invoked as normal functions.)

-- 2016-11-25


Black Friday sales for VPS: https://www.lowendtalk.com/categories/offers

-- 2016-11-26


Tunanota and ProtonMail looks promising, but they do not work with others, i.e. Tunanota users cannot exchange encrypted mails with ProtonMail users. Also, Tunanota and ProtonMail do not work with GPG users. Encryption is important, but openness is also important. And GPG is a good example of implementating encryption without reducing openness.

An conterexample is Scryptmail, which supports import and export of GPG keys.

-- 2016-11-27


[$20 credit for new users of Vultr](http://www.vultr.com/?ref=7046521-3B) (KVM VPS with SSD, billed hourly/monthly, located in US, EU, Austrilia, Singapore, and Japan). 

Vultr v.s. DigitalOcean: They are quite similar except that Vultr has slightly more RAM for $5/m plan, and Vultr's snapshots are still free right now.

-- 2016-11-29


Firefox version 41 to 50 (including 45 ESR used by the latest version of the Tor browser) has a memory corruption vulnerability allows malicious code to be executed on Windows, thus deanonymize Tor users.

To protect yourself from similar possible future vulnerabilities:

1. the ultimate 2 physical machine solution: use two physical machine A and B. A has only one lan card to connect to B (make sure A does not have a wireless card, or has a physical switch to turn off wireless card).  B has 2 lan card, one for A, one for Internet. Running the browser on A and Tor on B,  and the connection between A and B is configured as NAT only. So A can only connect to Internet via Tor, and possible vulnerability in browser can only leak IP/MAC etc of A, not B. For max security, do not buy A online, incase the online seller may record A's hardware information together with your identity/address.

2. the 2 virtual machine solution: similarly to the solution above, but use two Virtual machine instead. This does not protect you from virtual emualtor's escape vul­nerabilities though. However, virtual emualtor's escape vulnerabilities are rare (and your machine need to encounter both virtual emualtor's escape vulnerability and browser's vulnerability at the same time to leak the information of physical machine).

3. Less secure than the above solutions, but the easiest: Use Tor Browser with JavaScript off, or at least block JavaScript by default, and whitelist sites you trusted.

-- 2016-11-30


ZeroNet's answer to CDN/cloud hosting industry: kill it. I think this is one of the most charming part of technology: rather than sloving a problem, make the problem irrelevant.

-- 2016-12-01


Brace formatting style

I used to prefer Java style (braces on the same line) over Allman style (braces on their own line). I use large fonts on a small screen, thus a condensed style is preferred.

However, I recently found out that although Java style is clean for simple code, it does not work well with long parameter/conditional list. For example:

```c
if (starts_with(path, home, path_size, home_path_size) ||
    check_with(path, home, path_size, home_path_size) {
    recreate(path, home);
    return home_path_size;
} else {
    return 0;
}
```

The simple statement `return 0` in else branch is clear.
But I cannot tell whether `recreate(path, home)` belongs to the conditional list or the function body at a glance.

On the other side, I can get the whole structure at a glance with Allman style:

```c
if (starts_with(path, home, path_size, home_path_size) ||
    check_with(path, home, path_size, home_path_size)
{
    recreate(path, home);
    return home_path_size;
}
else
{
    return 0;
}
```

Also, since I use large fonts on small screen,
I can not read `if (long || next_line ) {` at once.
So the Java style requires me to move my eyes to right, then move my eyes back to next line, which is slow.
With Allman style, to get an overview of structure,
I only need to focus on the left half of the code block, and no eye movements are needed. This makes up the wasted lines.

I guess for large screens a few wasted lines is affordable for clarity.

Maybe the Java style is suitable for a setup with small fonts on a small screen, provided the syntax highlight scheme distinguishes braces clearly?

-- 2016-12-02


[911 The new pearl harbor](https://www.youtube.com/watch?v=8DOnAn_PX6M) Politicians do not have imagination is totally a stereotype!

-- 2016-12-03


mypy is still incomplete.

-- 2016-12-05


ZeroMail does not hide sender (and effectively timestamp and conversations may reveal receipt).

Similarly, MaidSafe Email does not hide receipt.

-- 2016-12-06


@zeronetuseri6293 asked how to explain Systemd is bad "like I am five". I just prepare some text to brainwash five-year-old "Systemd is bad":

You are five. You do not know how to cook pasta, how to bake bread, and how to clean the window, etc. Fortunately there are a lot of volunteers to help you to do all these things.

The problem is these volunteers tend to commit suicide because of intrinsic depression. (They think helping a five year old may helps to reduce depression.)  And you are lazy and shy. You do not want to manage them yourself. There is a magician called Sysfive. When you go to sleep, Sysfive will kill those volunteers (not let them go home to avoid  traffic jam), and when you awake, Sysfive will reborn those volunteers. Also if you find some volunteer killed themselves, you can ask Sysfive to reborn them.

These volunteers speak a language named Gnome. You happen to speak this language, too. And all those volunteers are from the same nation Debian. Debian is located at a continent called Linux. The continent Linux is located at a planet called unix.

Your friends have volunteers speaking different languages like KDE and Xfce, from different places like OpenSUSE (also on Linux continent) and FreeBSD (on the BSD continent), and different magicians like OpenRC and RunIt (one magician can work for a lot of children.) You talked with your friends, and found out that you can find volunteers speaking Gnome from any nation and continent. Also, although volunteers from some certain countries only have experience with some magicians, all magicians can reborn volunteers from any country with some effort. "This is good. Maybe one day I will ask FreeBSD volunteers to help me. One of my friends said FreeBSD volunteers are cool." You thought. "And maybe one day I can ask RunIt the master to reborn volunteers for me. I heard that Sysfive the master is too old."

Until one day, you learned that Systemd the master can only reborn volunteers from the Linux continent. Systemd refuses to reborn any volunteer from other continents such as BSD and Solaris.

Also you learned that soon volunteers speaking Gnome can only be reborn by Systemd. They refuse to be reborn by other magicians.

Also, there used to be different volunteers to do different things, for example, one helps you to do accounting (e.g. how much ham you have eaten, eating ham is bad for your health), and one configures your smart phone (smart phones are too smart to configure for a five year old). But
Systemd said: "I am very very powerful. I will do all these things. Send those volunteers away."

You as a five year old may not think Systemd is bad.
But I hope you understand why some people consider Systemd as "bad".


-- 2016-12-07


C is a hacky language. For example, string in C. If you think string in C is an array of characters, then you cannot put some characters in string (such as Unicode character) and you can put some noncharacters into string. If you think string is an an array of bytes, like a buffer, then you cannot put the byte `\0` into string. So string in C is inconsistent viewed from both high level and low level.

Go, advertised as modern C, inherits C's hacky mindset:

- Error handling. Go uses multiple return values to represent union type `Result | SomeError` or optional type `Result | Null`: returning either `{result, nil}` or `{nil, error}`. The ordering of `result` and `error`, and one and only one of them must be `nil` is just a convention followed by programmers, not enforced by type system.

- For variable declaration without initialization, instead of checking it is correctly initialized later, Go just implicitly initialize it with a zero value. Even worse, Go uses `nil` as zero value for pointers, slices, interfaces, maps, channels, and functions.
 

-- 2016-12-08


Go back to use paper to manage my todos. (Some todos are still in WunderList, e.g. shopping list, cause I do not want to bring paper and pencil to supermarkets.)

-- 2016-12-09


When the function parameter is a function pointer, CLion (2016.3) cannot auto complete function name as parameter, like IntelliJ Idea for Java.

-- 2016-12-10


Lesson learned: when your `data.json` local copy is outdated (e.g. rollback to an old version manually because of file system issue), do not post new content to the zite that outdated `data.json` belongs to. Otherwise you will publish your "deletions".

-- 2016-12-11


Visual Studio Code only provides 32 bit downloads for Windows.

-- 2016-12-12


Yandex mail smtp refuses to send a GPG encrypted mail saying it looks like spam...

-- 2016-12-14


[SetupList](/setuplist.0web.bit/) now has its .bit domain [setuplist.0web.bit](/setuplist.0web.bit/).

P.S. If you want to register a .bit domain, but do not want to setup a full namecoin node on your machine, you may get a .bit domain for your zeronet site at [0web.bit](/0web.bit/) for 0.001BTC/0.1XMR.

-- 2016-12-15


Currently FaceBook Message and Google Allo has optional end to end encryption. And WhatsApp has end to end encryption enabled for all messages. On the other hand, WeChat still uses http.  #ThisIsChina

-- 2016-12-16


Just launched [0git.bit](/0git.bit), a list of git repositories on ZeroNet.

I wrote it based on [the ZeroChat tutorial on ZeroBlog](/Blog.ZeroNetwork.bit/). 

Features:

- Also supports Kaffie ID.
- Responsive card based layout.
- Minimal design.
- Under 200 lines of code.
- Licensed under 0BSD.

Its source code is hosted at ZeroNet, [browsable and cloneable](/0git.0git.bit).

P.S. editing posts is not implemented yet.



-- 2016-12-18


Problems of StorJ:

- Semi-central: storage is distributed, but the abstract object layer and payment is central.
- For every dollar a renter paid to StorJ, the host finally get 60 cents, StorJ keeps 40 cents.

-- 2016-12-19


Problems of Sia:

1. It supports proof of storage but not proof of bandwidth.
2. The Sia developers mined the first 100 blocks of Sia.
3. 3.9% of all successful storage contract payouts go to Siafund, of which 87.5% is owned by Sia's parent company.

-- 2016-12-20


[Beaker](https://beakerbrowser.com/) is similar to ZeroNet. Their difference:

- Beaker does not host visited sites.  (You can enable it manually.)
- Beaker sites support versioning.
- Beaker API is much simpler than ZeroNet, no select user (id), no optional file, no encryption, etc. So dynamic sites are easier to create via ZeroNet.
- ZeroNet uses namecoin `.bit`. Beaker uses regular domain names (via `TXT` record. It's experimental, not man-in-the-middle attack proof ).

Also, because Beaker requires  a customized browser:

- it uses `dat://` schema.
- Beaker sites need to ask user permission to access clearnet.

(These are not substantial differences since anyone can make a customized browser for Zeronet.)

Other differences are technical details, like ZeroNet is written in Python, while Beaker is written in JavaScript, and ZeroNet uses base58 encoded site address (compatible with bitcoin), while Beaker uses hex encoded address.

-- 2016-12-21


PyCharm 2016.3 claims to support Python 3.6's f-strings (formatted literal). But in fact it just supports syntax highlight. All PyCharm's intelligent features are not enabled for code embedded in f-strings.

-- 2016-12-22


Opened software manager in OpenSUSE and found in "rpm groups" there are `application` and `applications`, `developement` and `development`.

-- 2016-12-23


Just fried some peanuts, which increased the PM 2.5 by 8 ug/m^3 in kitchen. So frying will not be a source of local air pollution  if you have extractor hood opened and keep the oil temperature low. 

-- 2016-12-24


The confusing^W smarty Kotlin

What would be the type of `f` in the following line?

```kotlin
val s: Int = f(1, 2, 3)
```

Not considering subtyping and generic,
the type f may be one of:

1. `(Int, Int, Int) -> Int`, the most  intuitive one
2. `(IntArray) -> Int`, a variadic function
3. `f`, an object named `f` with an `invoke` method

-- 2016-12-27


USB 3 external disks are 10-20% slower on VirtualBox.

-- 2016-12-28


Apache Portable Runtime is originally supporting library for Apache web server. Thus it uses memory pool heavily. So it may not be suitable to use APR as a standard library for general C programming.

-- 2016-12-31


Just found some old notes on K&R C book.

The ink (I used a cheap ballpoint pen) is fading but still readable with some efforts.  Most notes are tricky parts of C, which are somehow irrelevant now (either being familiar with them or found out I rarely use them). Some notes I cannot agree now, e.g. "Union really looks like a dirty hack on struct."  on p. 125. However, on p.89, there is a note on `while (*s++ = *t++)` saying "Take me minutes to understand." Currently it would still take me minutes to understand it. Proud of it.^W^W^W

-- 2017-01-01


Yoda expressions are useful for tests in C, such as in `assert(true == ...` and `assert(false == ...`.

-- 2017-01-02


Miss `finally` or `defer` in C.

-- 2017-01-03


If you run ZeroNet on a remote machine, the doc recommends enabling `UiPassword`. But if your are using an unsafe network (public wifi, evil ISP, etc), password is transferred over insecure HTTP protocol. So for safety, you need to configure a reverse proxy with SSL for ZeroNet.

Alternatively, you can just start ZeroNet on remote machine as normal,
without `--ui_ip`, `UiPassword`, reverse proxy, SSL, etc.
And run this command at local machine:

    ssh -L 43110:127.0.0.1:43110 -N username@remote

Then you can just access `http://127.0.0.1:43110/` on your local machine, securely.


-- 2017-01-04


new History().repeat

There is no first class functions in Java, so to pass functions, we wrap functions in classes. Now there is no first class function types in TypedRacket, so [to predicate function types, we wrap functions in structs](https://stackoverflow.com/a/27866496).  

P.S. Same applies to TypeScript, Flow, Kotlin, and Swift. Ceylon's function type is first class, though.

-- 2017-01-05


"A Little Java, A Few Patterns" uses a special coding style to remark mutability:

Put semicolon on its own line.

For example:

```java
x = x + 1
; // Future references to `x` after this line reflect the change.
anArray.append(1)
; // Same as above.
```

-- 2017-01-06


vscode's refactoring is still much less powerful than WebStorm, even for TypeScript.

-- 2017-01-07


Install ZeroNet as an auto-start service on FreeBSD:

```sh
pkg install zeronet
sysrc zeronet_enable="YES"
service zeronet start
```

Run ZeroNet command:

```sh
su -m nobody zeronet siteCreate
```

-- 2017-01-08


> the ideas enshrined in the Ubuntu Manifesto: 
> that software should be available free of charge,
> that software tools should be usable by people in their local language
> and despite any disabilities, 
> and that people should have the freedom to customize and alter their software
> in whatever way they see fit.

This is what Ubuntu put on its front page about 10 years ago.

Nowadays these words are missing from the entire site of ubuntu.com
(the only place left is the handbook of LTS, maybe no one bothered to update the preface of the handbook?)

And this is what now on the front page of ubuntu.com:

> Ubuntu is an open source software platform that runs from the cloud, to the smartphone, to all your things.

Mark Shuttleworth used to think "the next big thing" is "build a platform so people can share free (as in freedom) things such as software, music, etc".

Later "the next big thing" of Ubuntu gradually changed to "universal user experience on all devices", which is less uncertain since Apple has already been a successful example.
(Apple is determined to make Mac OS X more and more like iOS, and make Apple laptops more and more like iPads.)

Not know how well Ubuntu will do in next 10 years.
Anywhere, "universal user experience" has nothing to do with the  original Nguni Bantu word "Ubuntu".


-- 2017-01-09


Sign and publish your posts/comments from command line:

```sh
zeronet.py siteSign site-address-of-other-people --inner_path data/users/address-of-myself/content.json --publish
```

It will asks the private key,
unless you happen to be the site owner,
fill in your cert's auth key.

For example, if you are signed in with `you@zeroid.bit`, then you can find `certs`->`zeroid.bit`->`auth_privatekey` in `data/users.json`.

Thanks to @nofish for this tip.

-- 2017-01-10


The so called whatsapp 'backdoor' was documented in the [blog post of Open Whisper Systems on 05 Apr 2016](https://whispersystems.org/blog/whatsapp-complete/).

I think the notification on security code for a contact changing should be "opt out" instead of "opt in". I guess Facebook made this "opt in" so users having no idea of public key encryption will not get confused by the security code change notification. They could make it "opt out" with a detailed explanation on first notification of security code change instead, in my own opinion.

I would rather call it a less secure design choice. Anyway, no matter you think it is a backdoor or not, it is not news.

-- 2017-01-16


A programmer's client (a local cinema) website got hacked, with racist messages posted. The policy suspected the programmer hacked the site, and got a warrant to seize the programmer's computer. Then they sent **21 armed polices**, 3 of them to seize the computer, and **18 of them as witness**.

On early morning, these polices **broke in** the programmer's home, and **shot dead** the programmer when he is talking to his lawyer on the phone (**4 shots on chest and face**).
And the **18 witness polices** witnessed that the programmer fired a crossbow bolt at one of them (that police was protected by Kevlar thus slightly injured).

This is *not* something happening in a magic realism novel or an absurdist  movie. This is what happened on **December 23rd 2016**, **London, Ontario, Canada**.

The programmer is **Sam Maloney**, the creator of [morphis](https://morph.is/) (a free open source p2p distributed datastore), a husband and a father of two children.

News reports:

1. [first news report on nationalpost.com](http://news.nationalpost.com/news/canada/lawyer-tells-client-on-phone-during-predawn-raid-theyre-going-to-shoot-you-sam-put-your-hands-up)
2. [more recent report on Motherboard](https://motherboard.vice.com/read/why-did-police-kill-an-alleged-small-time-hacker-canada-sam-maloney) ([ZeroNet mirror](http://127.0.0.1:43110/1uEc35aRpkDgVmJ35jcMEHm4D2JCcEejp/motherboard/))


-- 2017-01-18


cdrtools author's viewpoint on [controversy of cdrtools license compatibility](http://cdrtools.sourceforge.net/private/linux-dist.html).

-- 2017-01-22


Encountered ads with only one sentence "Only bricks produced by The Lego Group are Lego ® bricks." and one Lego logo. This is advertising of silliness. No sense and no design.

-- 2017-01-24


  Used openSUSE Leap 42.2 for a few days. You have to add a few repositories to install things like mp3, flash, and input methods. You have to configure mounting NTFS partitions yourself (via YaST or manually editing `/etc/fstab`). Default fonts setting for Chinese is terrible. Other things work out of the box mostly. KDE Plasma 5.8.2 roughly catches up the polishness of recent versions of Windows.

-- 2017-01-26


Lantern only provides binary package in deb format for Linux. To install lantern on rpm based Linux distributions, first install `rpmbuild`, `alien` (to convert deb to rpm) and `libappindicator3-1` (lantern's dependency), then use `alien` to convert the deb to rpm, and finally install the converted rpm.

-- 2017-01-27


A recent Windows update forced me to re-select options like no personalized ad, ruined my registry key for a customized keyboard layout (dvorak and swap esc & caps), and pined the Mail app on my taskbar. This is more like a regression than an update to me. (To be fair, it does allow me to launch some Windows applications under WSL.) 

-- 2017-08-21


`sh` is the only language I am using that has dynamic scoping for variables. (Privacy leaked: I do not use Emacs.) 

-- 2017-08-25


"Go to definition" does not work for shell scripts in vscode. `*` (from vscodevim extension) can be used as a workaround.

-- 2017-08-25


about.me has not been about me for a long time.

about.me was a simple profile page before 2016.

Now it is supposed to direct bandwidth to the site matters most to the user. about.me called it "personal pages with a purpose". While this feature may be useful, this is not the original about.me anymore. The original purpose of about.me is you can insert a `about.me/you` link in bios of other sites, less to type and easier to update.

-- 2017-08-27


Failed to understand the `fmap` signature in Haskell in about 15 minutes:

```haskell
class Functor f where
    fmap :: (a -> b) -> f a -> f b
```

It took me about 15 minutes to realize that
I have seen too many curried functions
so my brain instantly parses

```haskell
(a -> b) -> f a -> f b
```

as

```swift
((a -> b), f(a)) -> f(b)
```

instead of the intended

```swift
(a -> b) -> (f(a) -> f(b))
```

So I have to:

1. either admit that my brain is blunt
2. or  profess that the currying way of ML/Haskell languages is confusing

As an ignorant person, obviously  I chose 2.


-- 2017-08-27


Finally, concepts such as polymorphism, generics, type variable/parameter, overloading, and type class are united in my brain.

-- 2017-08-28


Powershell aliases still do not support tab completion.

-- 2017-09-01


MIT scheme taught me a chuunibyou way to say goodbye: "Moriturus te saluto."

-- 2017-09-02


To stop EME (Encrypted Media Extension) from entering W3C Standard, FSF asked people to **dial up** Tim Berners-Lee. First, asking people to dial up a person is not protest but **DDOS**. Second, no one cares W3C standard today. If Apple (safari), Google (chrome), Mozilla (firefox) and Microsoft (Edge) were dead-set, then the story is over. Neither W3C nor Tim Berners-Lee can do anything about it. (Fortunately Mozilla is not dead-set on EME, although Firefox Desktop has implemented it years ago.)

-- 2017-09-03


Now mail.google.com redirects to www.google.com/gmail/about/, which has a fancy design. I miss the simple UI with a login form and storage space counter. 

-- 2017-09-04


Baidu Map iOS keeps requesting location on background when location info is not available, draining batteries and heating device very quickly.

-- 2017-09-05


The intuition behind Curry-Howard correspondence: 

1. Staring from propositions (types of parameters),  we construct proof (function) to get other proposition (type of return value).
2. The rule to construct proof (function) is called logic (type system).
3. It is hard to construct a proof (function). But once the proof (function) has been constructed, it is easy to verify the proof is valid (the function does return the value of specified type).

Notes:

1. In practice, the verification of proof is not always easy, because real word proof tends to omit a lot of implicit knowledge and intermediate steps.
2. The verification of returned type of function is so easy that we do not need to verify that manually, the interpreter/compiler will verify that for us automatically.
3. The Curry-Howard correspondence is the basis of theorem prover such as Coq. 

-- 2017-09-08


I think sometimes a ML/Haskell like syntax may be a better alternative for math notation than lisp. Lisp is unambiguous but slightly harder to type manually (I am too lazy to use the lisp IDE/mode and copy-paste, or extend the editor to support auto completion in code blocks.) Compared to C like syntax, ML/Haskell saves some typing of commas and parenthesis.

-- 2017-09-09


Years passed, and Google Contact still does not support exporting contacts. It still redirects me to the "old version" for exporting.

-- 2017-09-09


I found out that I could not understand some code I wrote 8 months ago.

Then I checked the git commit message 8 months ago.
The commit message said

> I hope I implemented the algorithm right.

So this is the fault of the previous version of me myself. If the previous version of me myself truly understood the algorithm, then I would have resumed or reinvented the algorithm quickly now.

-- 2017-09-12


iPhone X shows that machine learning can be done on client side, without talking to a remote server. This is encouraging for privacy concerned services and users.

I am not sure about the long term impact of animoji. Will it make people's  countenance more exaggerated in real life?

iPhone {X, 8, 8P, 7, 7P, 6S, 6SP, SE}. Consumers need to choose one from **eight** models. Not sure if this is good or bad for consumers, but this is definitely not the Apple way.

-- 2017-09-13


I always prefer a small screen mobile device, which is easier to carry. I do not read/browse/view a lot with the mobile phone, since either neck or shoulders are in an unnatural angle.

-- 2017-09-14


Microsoft had suspended my outlook mail account for several weeks , saying my account is used to send a lot of junk mails, or violates their TOS in *unspecified* way.

I totally have no idea what violates their TOS (I had not sent mails using this account, let alone junk mails). To unblock my account, I need a cellphone. I am very upset about the assumption that you have to have a cellphone.

And to get help from Microsoft support for my locked account issue I need to have a working account. This is a deadlock. Thus I decide to stop use Microsoft account.

Then I asked myself what will happen if the same thing happens to my gmail account? Then I realized the fact that I did not bother set up my own domain for emails put me into danger.

-- 2017-09-24


[tutanota client side source code](https://github.com/tutao/tutanota/blob/ea1c1ef1c70c8f3c48dcfaa70f91cd41b7fbdd95/flow/libs.js#L86) contains Flow type definition for Mithril. 

-- 2017-10-01


Recently I started to read a book during wait time when I had taken a bag with me (a thin book is light and there is no more worries for short of battery), or just let my mind fly away when I had not. A win-win strategy for the life of my neck and the life of mobile phone battery.

-- 2017-10-06


Moving one icon on my mobile phone, all icons between the old place and the new place of the moved icon, will shift their places.

I am really upset by this.

Image in an insane programming lanuage, there is a list, say,

```python
l = [a, b, c, d, e, f, g]
```

And when you eval `l[0] = l[6]`, the list becomes:

```python
l = [g, a, b, c, d, e, f]
```

What a big surprise!

In such a programming language, imaging how many statements you have to write to accomplish simple tasks such as swaping `a` and `g`.

On the other side, in any sane programming language, to swap `a` and `g`, you just need to write something like:

```python
tmp = l[0]
l[0] = l[6]
l[6] = tmp
```

That is basically the behavior of desktop shortcuts of old-fashioned desktop operating systems.

I encountered this design fault on iOS devices before.
And now it infects my Android phone.
(Not sure whether Android 8.0 or the mobile phone producer introduced this design fault.)

My workaround: Only put icons most frequently used on the first screen. Put all other icons in folders. And arrange those folders by their names, pretending that they cannot be arranged freely.

-- 2018-02-21


Backing up to USB 3 external hard disk with `borg create -C lz4` is very fast.

-- 2018-02-27


extensiontest.com (test if a chrome extension is compatible with firefox) is not 100% accurate. Just encountered an chrome extension passing extensiontest.com but not usable in Firefox.

-- 2018-03-02


Compared to wine and tea, chocolate is inexpensive. The most expensive chocolate I've eaten is Amedei CRU, which is still affordable.

-- 2018-03-09


Just published my first Firefox extension: [arxiv-url], a Firefox addon to replace arxiv pdf links to corresponding abstract links. 

[arxiv-url]: https://addons.mozilla.org/en-US/firefox/addon/arxiv-url/

Writing a firefox extension is actually easier than I thought. If you'd like to write one yourself, just follow mozilla's [doc].

[doc]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension

Note:

1. If you do not want to install `web-ext` (it depends on node and some npm packages) for `web-ext build`, you can just zip your extension.
2. Submit the zip file to  [AMO] directly. No need to `web-ext sign` it (if you did so, the signature will be replaced with AMO after all.)

[AMO]: https://addons.mozilla.org

-- 2018-03-09


Very pessimistic about mobile phones I would have to buy in future:
- Android: With the recent release of Xperia XZ2 Compact (5"), Android phones finally stepped into the no more phones under 5" era.
- GNU/Linux: Librem 5, as its name told, is a 5" phone.
- iOS: Unfortunately it seems the only choice left, Defective by Design.

-- 2018-03-10


One of my favorite poem of Li Ch'ing-chao (李清照) is "As in a Dream" (如夢令）.

Light rain and gusty wind last night. （昨夜雨疏風驟）
Sound sleep did not dispel the slight drunkenness. （濃睡不消殘酒）
I ask the one rolling up the curtain,　（試問卷簾人）
but she answers: "The cherry-apple trees are the same."　（卻道海棠依舊）
"Don't you know? Don't you know? The red should languish while the green should plump."　（知否，知否，應是綠肥紅瘦）

(I am a native speaker of Chinese but not a native speaker of English. I tried my best to translate it. Any feedback on translation is welcome.)

"The red should languish while the green should plump" reveals the tenderness of the poet, while "should" implies the firmness of the poet.

"Don't you know? Don't you know?" That is the reality distortion field of a groggy poet.

-- 2018-03-13


I learnt typing on a typewriter, so membrane keyboards, especially membrane keyboards with short key travel, feel unnatural to me. However, I found out that my fingers are more tired when typing a lot on mechanical keyboards. (Have not tried Topre keyboards.)

-- 2018-03-14


Saw "novel blockchain gameplay" in an elevator ad of a browser game. This reminds me of a time when a lot of products advertise themselves using "novel nano-meter technology". 

-- 2018-03-18


Almost all smart phones today use a non-removable battery. And most smart phones do not use all-day battery. What an insane design combination!

-- 2018-03-26


debian.org is not available in CN (not sure whether it has been blocked by the great firewall or just some routing issue).

-- 2018-03-28


Digg Reader was dead at the end of last month (March 2018).

-- 2018-04-02


Both "**Three** Billboards Outside Ebbing, Missouri" and "The **Third** Murder" talk about the problems of the environment and the feeling of hopelessness, though in distinct (American/Japanese) ways.

-- 2018-04-08


My personal choices to score movies:

1. WTF
2. I do not want to waste my time on this
3. to kill some time
4. I probably will not watch it again, but I am not object to
5. I will watch it again

So forgive me for being harsh to a lot of movies,
I am poor, thus:

- I am busy with earning a living, not having time to watch so many movies;
- I have to limit the money spending on extra movie tickets.

However, I still watch quite a lot of movies after all.
Thanks to my just the right amount of poverty, I can afford buying movie tickets, and cannot afford some other more expensive forms of entertainment. In fact I am not sure, movie is entertainment to me. Maybe it is rather a form of escaping of the desert of reality? Or, maybe all forms of entertainment are ways of escaping to me?


-- 2018-04-13


> God made a woman from the rib he had taken out of the man (Genesis 2:22)

So heterosexual intercourse is excitation of one's own body part, i.e. self-gratification?

-- 2018-04-16


Just figured out why some people are so excited about Flutter (a mobile framework for Android/iOS in Dart by Google).

Because Dart's FAQ said "Isn’t Dart a lot like Java", thus Dart ~= Java.

If Dart is counted as Java, then Java becomes an alternative full stack language:

- Node.js (backend) + JavaScript (web) + React Native (mobile)
- Vert.x (backend) + Dart (web) + Flutter (mobile)

(To me, this is not excited at all, though. ;-)


-- 2018-04-18


Recently I found out that MUJI French Linen shirts/pants have raw (undyed) color for adults.

-- 2018-05-14


Microsoft is acquiring GitHub. GitHub in fact has an (maybe unintended) use: as a bootstrap mechanism to download tunnel software/tools to bypass firewall. After acquired by Microsoft, I doubt those  tunnel software/tools may be unavailable within the firewall.

-- 2018-06-05


How not to waste time on matching socks, i.e. O(1) to pick out socks to wear? Make all socks the same. How?

1. Buy only one kind of socks.
2. Shift your mind to realize that all socks are the same, regardless of their shapes and colors.

I myself had shifted my mind and treated all socks equally without discrimination, from the beginning of my undergraduate.

-- 2018-06-11


I am really confused with those color modes with monitors. Cannot them show color temperature instead?

-- 2018-06-12


My Razer DeathAdder has blue LED on wheel and logo, feeling very disturbing to me. Thanks to [razercfg](http://bues.ch/cms/hacking/razercfg.html), I can turn them off under Linux.

(I am not a game player. I bought this mouse just because there are not many left hand mouse available on my area.)

-- 2018-06-16


Suddenly I wanted to eat tempura, but it is unavailable from the menu of the izakaya I went. So I ate some fried salmon sushi instead.

-- 2018-06-24


languagedetective.com predicts your native language with English text you wrote as input. I tested with [one of my blog post](https://weakish.github.io/StutteringTalkaholic/web/html-history/) and the result is: 70.6% Native, 29.4% Non-Native. Bingo!
But it is not good at predicting my native language: 37.9% Arabic, 16.1% Korean, 14.7% Hindi, 11.1% Chinese, 8.6% German, 6.5% Turkish, 2.1% Japanese, 1.6% French, 0.7% Italian, 0.7% Spanish.

My native language is Chinese.

-- 2018-07-28


Not sure whether BDFL's retirement is good or bad, but personally I dislike PEP 572 (I dislike a lot of aspects of Python, though).

-- 2018-07-30


I want to install an extension of JupyterLab (toc), then I found out that installing JupyterLab extensions requires nodejs (because JupyterLab extensions are npm packages). So I install nodejs via `conda`, which automatically downgrading my JupyterLab from v0.33 to v0.28. After all of this, I am about to install the extension, but it turns out it requires JupyterLab v0.33! :-( The Jupyter blog said JupyterLab is ready for users on Feb. 2018 ...

-- 2018-08-10


Not sure when GitHub changed its front page (they call it dashboard), slow to load. I miss the old GitHub front page, loaded almost instantly.

-- 2018-08-11


Google Photo's "free up device space" (delete already backed up photos from device) and recover storage (compress already uploaded photos from original to high quality) applies to ALL photos. I cannot free up / recover storage selectively, for example, only archived photos or photos within certain albums.

-- 2018-08-11


vscode does not have built-in syntax highlighting for Haskell, while it does support F# out of the box.

-- 2018-08-12


Learning ML/Haskell deepened my understanding of typing.

-- 2018-08-18


When will Java have "real" function type? What Java uses interface to mimic is **nominal**, not **structural**.

-- 2018-08-23


Gists are second class citizen of GitHub. For example, GitHub API does not support searching gists (in both old v3 REST API and the new v4 GraphQL API).

-- 2018-08-23


Refactoring with statically typed code (using Python's type hint) is an enjoyable process. To switch an  upstream library, I just replaced one import statement, one type definition, and one invoking statement. Then I just fix all the typing problems reported by PyCharm. After that, I run the program and find out that it just works! No "find usage" or "search and replace". And the project does not have any test (I am too lazy to write one.) Static typing is the preservative to slow down the inevitable decaying of code.

-- 2018-09-01


Programming needs practice. And I think "how many lines of source code I have **deleted**" estimates my experience on programming better (than how many lines I have written).

A shell-fu to calculate how many lines I have deleted in a git repository:

```sh
git log --shortstat --no-merges --author=$(whoami) | grep 'files\? changed' | awk '{deleted+=$6} END {print deleted}'
```

-- 2018-09-11


Go advertises first-class function, but to pass a function, you have to match the exact signature. No sub-typing of functions. Yes, even Java supports covariant return result (no contravariant parameter though), but Go supports neither.

-- 2018-09-12


Oops, `python -m SimpleHTTPServer` does not support range request.

The following three lines (not counting import statements etc.) of Go turns out to support range request out of box:

```go
func main() {
  err := http.ListenAndServe(":8000",
    http.FileServer(http.Dir(os.Getwd())))
  log.Fatal(err)
}
```

-- 2018-09-14


The new palm phone reveals how ugly big today's phones are.

 3.3-inch, 445-ppi LCD display, 62.5 grams weight, IP68, cool! Type C, Android 8.1, 3GB RAM, 32GB storage, O.K. $349.99, expansive but still acceptable. Verizon Only, ShareNumber only, BAD!

Photo credit: [theverge.com](https://www.theverge.com/2018/10/15/17974850/new-palm-smartphone-android-lifemode-time-well-spent-verizon)

![attached image](1540394982.jpg)

-- 2018-10-24


I've seen a lot of note applications/services' export function does not support exporting attachments. Vivaldi Browser is just another example (its sync all feature does not include attachments of notes).

-- 2018-11-03


IBM bought RedHat as a cloud computing company, thus irrelevant projects originally sponsored by RedHat may not receive bandwidth from IBM in future. Fortunately:

1. Ceylon: it begins to migrate to Eclipse last year
2. Cygwin: nowadays WSL seems a better option (if I have the opportunity to use Windows in future)
3. Gnome: I switched to KDE last year

 

-- 2018-11-03


Upgraded KDE Neon from 16.04 to 18.04 today via its built-in "Distribution Upgrade" GUI. The whole process is mostly smooth, except it reports a mysterious error "installArchives() Failed" before restart. I just ignored it and had not discovered anything wrong.

The system feels the same, without any dramatic change. I have not noticed any difference until I decided to change the wallpaper:

1. Plasma Wallpaper now allows to use Bing's Picture of the Day.
2. Plasma Mouse Actions now supports configuring all mouse buttons.

I used to rebind middle key to forward button (so I can press it via my thumb, instead of clicking the hard-to-press wheel) via `xinput set-button-map`. I knew I had to add it to my startup script, but because: 1) I am lazy; 2) I seldom restart my computer these days; I did not write it. Now I do not need to write it -- another example of advantage of "lazy evaluation". ;-)

-- 2018-11-03


Flickr will limit free users' photos to 1000 (extra photos will get deleted in next year). Upon hearing this I am quite depressed, because downloading photos and uploading to a new platform (provided that I can find an alternative) will take a lot of time and effort.

Later I learned that flickr will not delete old photos licensed under Creative Commons. Thank goodness! Almost all my photos on flickr are under cc-by-sa or public domain.

Today I just checked my flickr account and found out that I only have less than five hundreds photos there...

-- 2018-11-16


Ansible advertises itself as agent-less, but:

1. The agent/client machine still needs to have a (compatible version of) python preinstalled.
2. SaltStack supports an equivalent server-only  model (also requiring python). And SaltStack is more flexible since it also supports server-agent  and agent-only models.

On the other hand, Patchwork (based on fabric) is true agentless (sending shell calls). Its functions is quite limited and it lacks high-level abstractions though.

BTW, the cloud provider modules from both Ansible and SaltStack are disorderly and unsystematic. Some use cloud providers' SDK, some use libcloud (a unified interface for different cloud APIs), and some directly use requests.

-- 2018-11-16


Two exotic project ideas occurred to me on the bed. After getting up and turning on the computer, I found out that I had already forgot one of them.

-- 2018-11-17


It is such a surprise for me that GitHub does not have any public available issue tracker for itself!

Some users have created one ([isaacs/github](https://github.com/isaacs/github)). To  use it, you need to open an issue on it and email a copy to  support@github.com, then manually post replies from github staff. :-(

-- 2018-11-17


The image support of ZeroMe feels quite hacky to me:

```json
{
  "post_id": ...,
  "body": "...",
  "date_added": ...,
  "meta": "{\"img\":\"900,600,bddbaaedafc5ea9db5b85b97eba543766888111965754446,01233014420125671882171769A111BABCDC9BAABB7CEC9DAAAA69AC9AAABBA9FF9BBB\"}"
},
```

-- 2018-12-04


