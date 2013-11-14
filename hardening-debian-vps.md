Hardening your Debian VPS
=========================

Introduction
------------

This is a basic guide on hardening your Debian VPS.
And Ubuntu users may also find this guide useful, since Ubuntu is based on Debian.

Don't panic!
Following this guide, hardening your VPS is simple.
And once we have things set up, it does not take much effort and time for maintenance.


Security updates
----------------

First rule: always use up-to-date software from trusted resources.

After we have created our droplet, we need to run the following commands as root to update the system:

```sh
# apt-get update
# apt-get upgrade
```


sudo
----

It's a good idea to configure `sudo`.
By default, `sudo` requires that a user authenticate him or herself before running a command.
Thus it's safer to use `sudo` instead of using `root` directly.

To use `sudo`, we first create a new normal user.

### add a normal user

```sh
# adduser ada
```

(We use `ada` as an example, don't forget to substitute it with your own user name.)

Then we will be asked to enter a  password:

```sh
Adding user `ada' ...
Adding new group `ada' (1000) ...
Adding new user `ada' (1000) with group `ada' ...
Creating home directory `/home/ada' ...
Copying files from `/etc/skel' ...
Enter new UNIX password:
```

Choose a good password.
If you don't know how to choose a good password, you may follow my advice:

Pick up a dictionary, and choose **5** *random* words.

Done.

It's secure. Five random English words will achieve an entropy of `log(99171)/log(2)*5 = 82.988`. And NIST recommends 80-bits for the most secure passwords.

It is much easier to remember and type than a mix of random characters, numbers and symbols.

Don't have a directory? If you use Linux, I have written a Python script for you:

```python
import random
wordlist = open('/usr/share/dict/words').readlines()
pick = lambda : random.choice(wordlist)
for i in range(5): print(pick().replace('\'', '').strip(), end='')
```

Then we need to retype our password for confirmation.
After that, we just need to press a few `ENTER`.

```sh
Retype new UNIX password: 
passwd: password updated successfully
Changing the user information for ada
Enter the new value, or press ENTER for the default
        Full Name []: 
        Room Number []: 
        Work Phone []: 
        Home Phone []: 
        Other []: 
Is the information correct? [Y/n]
```

### configure sudo

After we have created a normal user `ada`, we will add it to the `sudo` group.

```sh
# usermod -aG sudo ada
```

Now that `sudo` has be configured, we can test it via the following commands:

```sh
root@remote # su ada
ada@remote $ sudo su
```

We should see something like

    We trust you have received the usual lecture from the local System
    Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

SSH
---

After you have created your droplet, Digital Ocean will email your root password. And you can use it to ssh into your VPS.

For security reasons, we will switch from password authentication to ssh keys.

### SSH key

#### Check for existing keys

First we check for existing ssh keys on our local machine:

```sh
ls ~/.ssh
```

If there is a file named either `id_rsa.pub` or `id_dsa.pub`, then we can skip next step and just submit it to our VPS.
If not, read on.

#### Generating a new SSH key

Run the following command at your local machine:

```sh
$ ssh-keygen -t rsa
```

We need to enter a passphrase to protect your SSH key.

#### Submit your public key

On our local machine:

```sh
scp ~/.ssh/id_rsa.pub ada@your-droplet-ip:
```
Note: if your public key is `id_dsa.pub`, subtitute `id_rsa.pub` with `id_dsa.pub`.

Then ssh into our VPS:

```sh
ssh ada@your-droplet-ip
```

After that, on our VPS, run:

```sh
mkdir ~/.ssh
cat id_rsa.pub >> ~/.ssh/authorized_keys2
```

Again, if your public key is `id_dsa.pub`, substitute `id_rsa.pub` with `id_dsa.pub`.

### Configure SSH service

Edit `/etc/ssh/sshd_config`:

```sh
sudo nano /etc/ssh/sshd_config
```

(If you are familiar with `vi`, you can use `vi` instead of `nano`.)

Take care for the following options:

    Port 22

`22` is the standard port for SSH service.
If you only use ssh yourself, you may change it to an uncommon one.
Be aware, this kind of security by obscurity is very fragile.
It only reduces some noise, since a lot of virus or automatic cracking tools scan port 22 only.
Thus we just leave it as is.

    PermitRootLogin no

We set it to `no`, since we have already configured `sudo`.
Allowing root login is a bit dangerous.
For example, you are away from your computer, with an open ssh session to your VPS on it. If this ssh session is not a root login, an evil stranger who happens to have physical access to your computer cannot destroy your VPS because they don't konw your root password, which they will be asked when they try to run `sudo`. But if it's a root login, they can do all evil things to your VPS.

    PubkeyAuthentication yes
    PermitEmptyPasswords no
    PasswordAuthentication no

Public key authentication is safer than password.
So we stick to it.

### Reload service

After we have edited `/etc/ssh/sshd_config`, we leave our current ssh session open, and create another ssh session to test its futction.

After making sure the new configuration works, we reload SSH service via

```sh
sudo service ssh reload
```

Postfix
-------

Next we will install some security tools.
Most of them will send alerts in email to you.
Thus we need a mail server to send emails.

If you use Digital Ocean's standard image to create your droplet, usually a mail server called `exim4` is preinstalled.

If not, you may install a mail server yourself.
We recommend postfix, as it is simple to setup.

Install it via

```sh
sudo apt-get install postfix
```

During installation, it will pop up a dialog, follow that dialog to setup `postfix`.
Remember to choose "internet site" when asked to select a type of mail configuration

chkrootkit
----------

The chkrootkit security scanner searches the local system for signs that it is infected with a rootkit. Rootkits are set of programs and hacks designed to take control of a target machine by using known security flaws.

### Install

```sh
sudo apt-get install chkrootkit
```

### Configure

Run

```sh
sudo nano /etc/chkrootkit.config
```
Change in to something like:

```sh
RUN_DAILY="true"
RUN_DAILY_OPTS="-q"
DIFF_MODE="true"
```

logcheck
--------

Logcheck helps spot problems and security violations in your logfiles automatically and will send the results to you in email.

### Install

```sh
sudo apt-get install logcheck
```

### Configure

Run

```sh
sudo nano /etc/logcheck/logcheck.conf
```

The default options are fine.
We just need to change one line:

```sh
SENDMAILTO="logcheck"
```

Change it to an email address to receive alerts, e.g.

```sh
SENDMAILTO="example@mail.example.com"
```

checksecurity
-------------

`checksecurity` does some very basic system security checks, such as looking for changes in which programs have setuid permissions, and that remote filesystems are not allowed to have runnable setuid programs.


### Install

```sh
apt-get install --no-install-recommends checksecurity
```

Note we use `--no-install-recommends` because `checksecurity` recommends some software which are hard to configure and offer redundant functions.

### Configure

Config files are located at:

- `/etc/checksecurity.conf`
- `/etc/checksecurity/`

The default files shipped by Debian is fine, we just modify one line in `/etc/checksecurity.conf`.

Find this line

```sh
#CHECKSECURITY_EMAIL="root"
```

Uncomment it and fill in an email address to receive alerts:

```sh
CHECKSECURITY_EMAIL="example@mail.example.com"
```

Conclusion
----------

Now we have finished hardening our VPS!

And we can make a snapshot of  our VPS at Digital Ocean's control panel.
Thus we can bring our secure system back if something goes wrong.


After that, we do not need much time and effort for maintenance, except:

- run `sudo apt-get update && sudo apt-get upgrade` from time to time to keep our VPS up-to-date.
- check our email inbox to see if there are any alerts. If so, have a look at them to determine if something bad happened on our VPS.

If you want to go further, consider the following:

- firewalls
    
    You can set up rules for `iptables` directly, which is provided by Linux kernel. Or you can use a helper program, e.g. `ufw` or `shorewall`.
    Configuring firewalls requires some time and effort.
    And if
    * all your software on your VPS are up to date
    * you do not install unnessary services on your VPS
    * you use public key for ssh auth and choose a strong password for your user account
    
    then you are safe without a firewall.
    Thus we do not include this part into this guide.

- file integrity verification programs

    They help you determine whether an intruder has modified your system.
    
    They need some time and effort to configure, and may affect the performance of your VPS. Thus we do not inculde them in this guide. If you want to choose one, we recommend `integrit`, for its small memory footprint and its design with unattended use in mind.

- jail programs
    
    There are some programs which help you to build a chrooted/jailed environment.
    If you decided to offer shell access to other users, you may want to restricted their access to a jailed environment.
    You may even put your website in a jailed environment to protect your VPS system from exploits in your website.
    
    A jailed environment requires a lot effort to configure and maintain. And it will affect your VPS performance. Thus we do not include them in this guide.

    



























