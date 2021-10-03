# iOS Tips

## Export Installed Applications List

```sh
sudo apt install ideviceinstaller
ideviceinstaller --list-apps
```

The output is in CSV format:

```csv
CFBundleIdentifier, CFBundleVersion, CFBundleDisplayName
org.mozilla.ios.Firefox, "5301", "Firefox"
org.zulip.Zulip, "1", "Zulip"
```

To remove (uninstall) an application:

```sh
ideviceinstaller --uninstall <CFBundleIdentifier>
```

`--archive` does not work [since iOS 7][121].

[121]: https://github.com/libimobiledevice/ideviceinstaller/issues/121#issuecomment-547859382

## Show Device Info

```sh
sudo apt-get install usbmuxd libimobiledevice6 libimobiledevice-utils
ideviceinfo --simple
```

For more information, type `ideviceinfo`.
I can also query domain information, e.g. `ideviceinfo --domain com.apple.mobile.backup`.
Type `ideviceinfo -h` to see the domain list.

## Backup

The current released version (1.3.0) of libimobiledevice does not work with iOS 14.
To backup iOS 14 devices, you need to compile it from the git HEAD.

First, remove the installed versions from `apt`:

```sh
sudo apt-get remove libimobiledevice6 libimobiledevice-utils
```

Then, compile and install the following dependencies:

- [libplist](https://github.com/libimobiledevice/libplist)
- [libimobiledevice-glue](https://github.com/libimobiledevice/libimobiledevice-glue)
- [libusbmuxd](https://github.com/libimobiledevice/libusbmuxd)

Finally, compile libimobiledevice itself:

[libimobiledevice]: https://github.com/libimobiledevice/libimobiledevice

Then run the commands directly from the `tools` directory:

```sh
cd libimobiledevice/tools
./idevicebackup2 backup --full /path/to/backup/directory
```



