# RarCrack

This note is written for RarCrack 0.2.

RarCrack brute forces password for encrypted zip, rar, 7z files.

```sh
rarcrack FILE_NAME --threads 4
```

Note that if `--threads` is omitted, RarCrack will use 2 threads, no matter how many cores your CPU has.

You can cancel the brute forcing (e.g. via `Ctrl-c`) at any time,
and RarCrack will resume cracking at next startup.
This is because RarCrack uses a status file `FILE_NAME.xml` at the same directory to record progress.

And this mechanism can be used to speed up cracking.
For example, if you remember that the password is 6 digits:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rarcrack>
  <abc>0123456789</abc>
  <current>000000</current>
  <good_password/>
</rarcrack>
```

For zip and 7z files, an alternative to RarCrack is fcrackzip.
And it has more features, e.g. specifying password range and using a dictionary.
However, last time I tried to fcrackzip a zip file,
it reported that the zip file is corrupt.
And RarCrack successfully cracks the very zip file.
