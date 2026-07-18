# Android Setup Guide

## No Google Account

I do not sign in to a Google Account on the phone, because I dislike the idea of linking a device to an online account.

Without a Google Account, I cannot install applications via Google Play Store.
Thus, I use [F-Droid] (free and open source) and [APKPure] (for apps that are not on F-Droid) to install applications.

[F-Droid]: https://f-droid.org/
[APKPure]: https://apkpure.com/

## Applications

- Application market: F-Droid and APKPure
- Browser: [DuckDuckGo Privacy Browser] and [Vivaldi] (with user activity tracking disabled by default)

[DuckDuckGo Privacy Browser]: https://duckduckgo.com/app-mobile
[Vivaldi]: https://vivaldi.com/android/

I also use some preinstalled applications, for example, calculator and Google Photos (with backup & sync turned off since I do not sign in to a Google Account).

## Troubleshooting

### Android cannot connect to an iPhone hotspot

iPhone Personal Hotspot may advertise on 5 GHz by default; some Android phones never see the network or fail to join.

On the iPhone (**Settings → Personal Hotspot**):

1. Turn on **Allow Others to Join**.
2. On iPhone 12 or later, turn on **Maximize Compatibility** (uses 2.4 GHz). Internet performance and Wi-Fi security may be reduced while it is on.
3. Stay on that screen until the Android phone connects.

On the Android phone: toggle Wi-Fi off/on, join the network whose SSID matches the iPhone’s name, and use the password shown under Personal Hotspot.

See [Apple’s Personal Hotspot help][apple-hotspot].

[apple-hotspot]: https://support.apple.com/en-us/119837
