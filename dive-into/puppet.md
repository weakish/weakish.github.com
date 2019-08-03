A Basic Guide for New Marionettists
===================================

## TLDR

This article only covers the so-called masterless mode, a.k.a. `puppet apply`,
because the [master-slave mode] is [unethical] and [bolt] sounds violent. On the other hand, `puppet apply` plays the role of both master and slave, which is considered not unlikely inoffensive.

[master-slave mode]: https://puppet.com/docs/puppet/6.7/architecture.html
[unethical]: https://bugs.python.org/issue34605
[bolt]: https://puppet.com/products/bolt

Disclaimer: puppet actually uses the term agent instead of slave, but this is just a euphemism.

Puppet uses a declarative DSL, i.e. describing the state of puppets. Below is an example from [the official document][doc]:

[doc]: https://puppet.com/docs/puppet/6.7/intro_puppet_language_and_code.html

```puppet
case $operatingsystem {
  centos, redhat: { $service_name = 'ntpd' }
  debian, ubuntu: { $service_name = 'ntp' }
}

package { 'ntp':
  ensure => installed,
}

service { 'ntp':
  name      => $service_name,
  ensure    => running,
  enable    => true,
  subscribe => File['ntp.conf'],
}

file { 'ntp.conf':
  path    => '/etc/ntp.conf',
  ensure  => file,
  require => Package['ntp'],
  source  => "puppet:///modules/ntp/ntp.conf",
}
```

## Glossary

This guide uses different terms to the official Puppet documentation.
These are just my personal preference.
For example, the *script* term used in this guide is called **manifest** in the official Puppet documentation.
In my opinion, *script* makes more sense than **manifest**.
In fact, [chef] refers to the similar notation as [recipe].


[chef]: https://www.chef.io/
[recipe]: https://docs.chef.io/recipes.html

- **agent** Puppet actually uses the term agent instead of *slave*, but this is just a euphemism.
- **catalog** In master *slave* mode, catalog are compiled by master with *stage* specific information. In `puppet apply` mode, it is just unimportant mid-product.
- **class** A *set* of puppets. And a **subclass** is *an extended set* of puppets base on another *set* of puppets, a.k.a. a class `inherits` another class.
- **environment** A *play*.
- **fact** A *detail* about the *stage*.
- **Facter** The *stage manager* can tell you *details* about the *stage*.
- **filebucket** A repository for file backups.
- **Hiera** A built-in key-value database for puppet.
- **lambda** In Puppet, a lambda can only be used in function calls. That is, it can only be passed to functions, but cannot be assigned to variables. To some extent, it is more like Ruby's block.
- **manifest** The *script* used by a marionettist. Puppet refers to the *opening scene* (entry point in other programming languages) as **main manifest** or **site manifest**.
- **node** The *stage* for the show. In `puppet apply` mode, the local machine is the only *stage*.
- **resource** A *puppet* controlled by the marionettist.