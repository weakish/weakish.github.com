# A Short Borg Tutorial

[Borg] is the new generation of [attic].

[Borg]: https://www.borgbackup.org/
[attic]: https://attic-backup.org/

```sh
borg init --encryption=keyfile /path/to/repo
borg create -C lz4 /path/to/repo::NAME-YOUR-BACKUP ~/Documents
```

## Free space

Before you start creating backups,
please make sure that there is always a good amount of free space
on the filesystem that has your backup repository (and also on ~/.cache).

## Encryption

Default enabled with `repokey` method.

    borg init --encryption=none|repokey|keyfile PATH

When repository encryption is enabled,
all data is encrypted using 256-bit AES encryption
and the integrity and authenticity is verified using HMAC-SHA256.

- `repokey`: key is stored inside the repository (`config`);
- `keyfile`: key is stored under `~/.config/borg/keys/`;

In both modes, the key is stored in encrypted form
and can be only decrypted by providing the correct passphrase.

Do not forget to backup the key (e.g. via `borg key export`).

For automated backups the passphrase can be specified
using the BORG_PASSPHRASE environment variable.

Be careful how you set the environment;
using the env command, a `system()` call or using inline shell scripts
might expose the credentials in the process list directly
and they will be readable to all users on a system.
Using `export` in a shell script file should be safe, however,
as the environment of a process is accessible only to that user.
Also, using a shell command may leak the passphrase in shell history file.

For server backup, have a look at [borgmatic].

[borgmatic]: https://torsion.org/borgmatic/

## Compression

    borg create --compression TYPE

Default is no compression.

- fast repo storage and some compression: `lz4`
- less fast repo storage and a bit more compression: `zlib`
- very slow repo storage and high compression: `lzma`

`lz4` is very fast thus preferred.
`lzma` is preferred when the repository is on a remote host with slow (dial-up) connection.

## Upgrade from attic

    borg upgrade --inplace REPOSITORY

If a backup copy is required, omit the `--inplace` option.

## Hosted Services

- [rsync.net] also works with scp, rsync, git, etc. Nodes available globally.
- [BorgBase] dedicated borg repository hosting with specific APIs. It also offers a free plan (5 GB and 2 repos), and paid plans are cheaper than rsync.net. Nodes available in US and EU.

[rsync.net]: https://www.rsync.net/products/borg.html
[BorgBase]: https://www.borgbase.com/