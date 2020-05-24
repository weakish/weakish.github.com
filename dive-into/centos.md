# CentOS server setup guide for people from debian

A basic server setup guide for people from debian to CentOS.

Software
--------

`yum` is apt-get/aptitude on CentOS.

Remove not neccessary software:

    yum grouplist
    yum groupremove <wildcards>
    yum list installed
    yum remove <wildcards>

Upgrade system: (equivalent to `apt-get update && apt-get upgrade` on debian)

    yum update

Add more packages:

http://wiki.centos.org/AdditionalResources/Repositories/RPMForge

Unlike Debian, Centos's official package repo is very limited.

Services
--------

Check what is running:

    chkconfig --list |grep '3:on' |awk '{print $1}' |sort

Use `chkconfig <service> off` to disable unnecessary services.

`chkconfig` is included as default in Centos.
In Debian, you can install it via `apt-get install chkconfig`,
though Debian people are likely to use `sysv-rc-conf` instead.


Hostname
--------

Make sure your `/etc/hosts` file have a line like:

    127.0.0.1               <your-hostname>.example.com <your-hostname> localhost.localdomain localhost

And `/etc/sysconfig/network` have a line like:

    HOSTNAME=your-hostname.example.com

Then run `hostname <your-hostname>.example.com`

Debian doesn't use `/etc/sysconfig/network`.
In Debian, you change hostname in `/etc/hostname`:

    echo 'your-hostname' > /etc/hostname

Debian prefers to not include the `example.com` part.


SSH
---

Same to Debian.


Firewall
--------

CentOS may enable iptables by default.
You may want to disable it via `service iptables stop`
or `/etc/init.d/iptables stop`.
And disable its startup at boot time via `chkconfig`.

If you want to mess up with it, its configuration file is located at
`/etc/sysconfig/iptables`, different to Debian.



