# A Brief Review of Setapp Files

TODO rewrite this as Setapp alternatives

## CleanMyMac X

- Cleanup system junk: cache, fat binaries, language files, log.

- Maintenance: free up APFS purgeable space, flush DNS cache, reindex spotlight.

- Uninstall unused applications and clean up leftovers.

- Space Lens: disk usage.

CleanMyMac X has a feature called "Time Machine Snapshot Thinning",
which optimizes the storage used by these snapshots in a smart way.
It helps free up storage space on the backup drive,
without affecting actual backup data amount.
I tried to run it but the storage space remained the same.
Maybe it is because I only run Time Machine backup manually occasionally.
  
In the Uninstaller section, CleanMyMac X listed suspicious applications
associated with or owned by Russian or Belarussian developers,
warning that data can be accessed by government authorities directly upon request
and without a court order.
This reminds me of [GitLab's position on China and Russia][gitlab].

[gitlab]: https://about.gitlab.com/blog/2019/11/12/update-on-hiring/ "GitLab Blog"

## ClearVPN 2

[ClearVPN 2] is developed by MacPaw, the same company who develops Setapp and CleanMyMac X.
Besides the typical "choose servers from a region" and "choose the fastest server" functions,
it also offers presets to access blocked sites (automatically choosing regions with the fewest restrictions),
to access geolocked content for popular streaming sites, or to surf the Internet safely
(block ads and automatically choosing regions with the strictest privacy laws).

[ClearVPN 2]: https://clearvpn.com

With the Setapp account, it can be used on macOS, iOS, Android, and Windows devices (up to 8 devices in total).

MacPaw stated that ClearVPN 2 will not keep logs.

Nodes are IPv4 only and blocked by Reddit.

## Gemini

Also developed by MacPaw.
It removes duplicate files and similar photos.
It can be configured to move the duplicates to a folder or to the Trash,
ignore files in specified folders or with certain file extensions,
and always/never select files under specified folders to remove.
It is also possible to replace duplicates with hard links.

## Unarchiver

Also developed by MacPaw.
I do not use it.
I use `7z` instead, which is free and open source, and also supports all common archive formats.

## Wallpaper Wizard

Also developed by MacPaw.
It has a large collection of wallpapers, and can automatically change wallpapers at a specified interval.

## Encrypto

Encrypto is a user-friendly tool for encrypting files and folders, developed by MacPaw.
It uses AES-256 and is available for macOS and Windows for free, without a need for Setapp subscription.

I do not use Encrypto.
I use [age], which is free and open source, available on macOS, Windows, Linux, and BSD.
It also uses state-of-the-art cryptography, including the X25519, ChaCha20-Poly1305, etc.
Files can be encrypted with a passphrase,
or with multiple recipients' public keys (age-keygen X25519 keys, ssh-rsa or ssh-ed25519 keys).
Note that SSH keys held on YubiKeys can't be used to decrypt files.

[age]: https://github.com/FiloSottile/age

