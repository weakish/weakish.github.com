# Command line UI in Ruby

## `ruby -s`

If you just want some switches, then you can use `ruby -s`:

Switches will be stored as global variable with `true` as their value:

```ruby
#!/usr/bin/env ruby -s
if $f
  puts "Switch f is #{f}"
end
```

Then if you run this script with `-f`, it will print out the line.

Long switches (`--long`) are not supported.

Combined switches are not supported. For example `-xyz` will not be split
`$x`, `$y` and `$z`, but will be recognized as `$xyz`.

Switches are just switches, they cannot follow a value. Otherwise all
successive switches will not be recognized. For example, `-u name -b` will
only set `$u` while leaving `$b` undefined.

## [Clap](https://github.com/soveran/clap)

Simple.

```ruby
Clap.run ARGV,
  "-a" => -> (param) { ... },
  "-b" => -> { ... }
```

It returns a list of unextracted  arguments.

Commands:

```ruby
require 'clap'

# Declare variables, otherwise variables in following lines are local.
# Unlike Lua, variables in lambda defaults to local in Ruby.
command = nil
command_args = nil

# Use lambda because `def` in Ruby does not create a closure.
commands = {
  'say' => ->{
    Clap.run command_args,
      '-v' => ->{puts 'Print some debug information'},
      'hello' => ->(param) {puts "Hello #{param}!"}
   },
   'listen' => ->{ 'omit implement' }
}

command_names = commands.keys #=> ["say", "listen"]
command_hash = command_names.map { |name| [name, ->{ command = name }] }.to_h

command_args = Clap.run %w(-v say hello world), command_hash

commands[command].call
```

Using `define_method`: (Unlike `def`, `define_method` creates a closure.)

```ruby
command, command_args = nil

commands = [
  define_method(:say) {
    Clap.run command_args,
      :'-v' => ->{puts 'Print some debug information'},
      :hello => ->(param) {puts "Hello #{param}!"}
  },
  define_method(:listen, ->{}),
]

commands = commands.map { |name| [name, ->{ command = name }] }.to_h
command_args = Clap.run %i(-v say hello world), commands
send command
```

## [CLI.K](https://github.com/rubyworks/clik)

CLI.K refines Clap:

```ruby
require 'clik'

cli '-f --file'  => lambda{ |f| @file = f },
    '-d --debug' => lambda{ $DEBUG = true },
    '-h --help'  => lambda{ show_help }
```

First, if no list specified, `cli` will use `ARGV`.

Second, it supports alias.
(There is [a pull request for this][alias pr] in Clap.)

[alias pr]: https://github.com/soveran/clap/pull/7

There are other refinements.

The `cli` method can handle run-on flags, i.e. `-abc` is the same as `-a -b -c`.

```ruby
>> Clap.run ['-abc'], '-a' => ->{}, '-b' => ->{}, '-c' => ->{}
=> ["-abc"]

>> cli ['-abc'], '-a' => ->{}, '-b' => ->{}, '-c' => ->{}
=> []
```


## [Slop](https://github.com/leejarvis/slop)

Example:

```ruby
opts = Slop.new(help: true, strict: true) do # `help: true` to add `--help` automatically.
  banner 'Usage: foo.rb [options]'

  on 'name=', 'Your name' # Access it via `opts[:name]`.
  on 'V', 'Print the version' do
    puts "Version 1.0"
  end

  command 'add' do
    description 'Add your name'

    on :v, :verbose, 'Enable verbose mode'
    on :name=, 'Your name'

    run do |opts, args|
      puts "You ran 'add' with options #{opts.to_hash} and args: #{args.inspect}"
    end
  end
end

# Since we use `strict: true` above, we can print `--help` automatically
# when a required flag is left out:

begin
  opts.parse
rescue Slop::Error => e
  puts e.message
  puts opts # print help
end
```

If you are lazy, in some cases, you can just use `autocreate`:

```ruby
# ruby run.rb --foo bar --baz --name lee
opts = Slop.parse(autocreate: true)
opts.to_hash #=> {:foo=>"bar", :baz=>true, :name=>"lee"}
opts.fetch_option(:name).expects_argument? #=> true
```

## [Commander](https://github.com/tj/commander)

To generate a template:

```sh
commander init foobar
```

Example:

```ruby
require 'rubygems'
require 'commander'

# All global options regardless of providing a block are accessible at the command level.
# There are some default global options, e.g. `--version`, `--help` and `--trace`.
global_option '--verbose'


Commander.configure do
  program :name, 'foobar' # defaults to basename of the executable
  program :version, '1.0.0'
  program :description, 'Stupid command that prints foo or bar.'

  command :foo do |c|
    'omit ...'
  end

  command :bar do |c|
    c.syntax = 'foobar bar [options]'
    c.description = 'Display bar with optional prefix and suffix'
    c.example '{bar}', "foobar bar --suffix '}' --prefix '{'"

    c.option('--info', 'Display info') { puts "handle with block" }

    c.option '--prefix STRING', String, 'Adds a prefix to bar'
    # This is equivalent to `c.option '-p', '--prefix String' ...`,
    # since OptionParser implicitly adds a small switch `-p`
    # even when not explicitly created.
    # However `-p` will only appear in the documentation
    # when explicitly assigning it.
    c.option '--suffix STRING', String, 'Adds a suffix to bar'
    # action is an alias to `when_called`.
    c.action do |args, options|
      options.default :prefix => '(', :suffix => ')'
      say "#{options.prefix}bar#{options.suffix}"
      say 'foo' if options.verbose
    end
  end

  alias_command :bar :b
  # complicated aliase
  alias_command :bar :barbrackets, '--prefix', '{', '--suffix', '}'

  # `foobar [args]` is a shorthand to `foobar bar [args]`
  default_command :bar

  # It will output after the rest of auto generated help doc.
  program :help, 'Author', 'TJ Holowaychuk <tj@vision-media.ca>'
end
```

## [Thor](http://whatisthor.com/)

```ruby
#!/usr/bin/env ruby
require 'thor'

class MyCLI < Thor
  # Class apply across all commands for a class.
  class_option :verbose, :type => :boolean


  desc "hello NAME", "say hello to NAME"
  option :from :required => true, :banner => 'a short description of option'
  option :yell, :type => :boolean # String if not specified
  # Other metadata:
  #     :default
  #     : An option cannot be both :required and have a :default.
  #     :aliases
  #     : A list of aliases for this option.
  #       Typically, used to provide short versions of the option.
  def hello(name) # Commands are methods.
    output = []
    output << "from: #{options[:from]}" if options[:from]
    output << "Hello #{name}"
    output = output.join("\n")
    puts options[:yell] ? output.upcase : output
  end

  desc "goodbye", "say goodbye to the world"
  long_desc <<-LONGDESC
    long description
  LONGDESC
  def goodbye
    puts "> saying goodbye" if options[:verbose]
    puts "Goodbye World"
    puts "> done saying goodbye" if options[:verbose]
  end
end

MyCLI.start
```

Save it to `thor-test`, and add it to your `$PATH`:

```sh
; thor-test hello --from "Carl Lerche" Yehuda
from: Carl Lerche
Hello Yehuda

; thor-test hello Yehuda --from "Carl Lerche" --yell
FROM: CARL LERCHE
HELLO YEHUDA
```

If you need subcommand (like `git remote add`),
put `class` in `module` and use `subcommand`.

```ruby
module GitCLI

class Remote < Thor
  # ...
  # def remote
  #   implement `git remote add`
end

class Git < Thor
  # ...
  desc 'fetch ...', '...'
  # def fetch
  #   implement `git fetch`

  desc "remote SUBCOMMAND ...ARGS", "manage set of tracked repositories"subcommand "remote", Remote
end
```

## [Escort](https://github.com/skorks/escort)

Example:

```ruby
require 'escort'
require 'my_app'

Escort::App.create do |app|
  app.version "0.1.1"
  app.summary "Summary 1"
  app.description "Description 1"

  # This will be inherited by all the sub-commands.
  app.requires_arguments

  app.options do |opts|
    # Config file contains options to pass.
    # It is in json format.
    app.config_file ".my_apprc", :autocreate => true

    # Global options.

    # flags are booleans.
    opts.opt :flag1, "Flag 1", :short => '-f', :long => '--flag1', :type => :boolean
    oopts.opt :flag2, "Flag 2", :short => :none, :long => '--flag2', :type => :boolean, :default => true

    opts.opt :option1, "Option1 description", :short => '-o', :long => '--option1', :type => :string, :default => "option 1"
    opts.opt :option2, "Option2 description", :short => :none, :long => '--option2', :type => :string, :multi => true

    # Dependencies.
    opts.dependency :option1, :on => :flag1
    opts.conflict :flag1, :flag2

    # Validation.
    opts.validate(:option1, "must be either 'foo' or 'bar'") { |option| ["foo", "bar"].include?(option) }

    # Commands.


    app.command :generate, :aliases => [:g] do |command|
      # Subcommands.
      command.command :migration do |command|
        app.options do |opts|
          opts.opt :sequel, "Sequel", :short => '-s', :long => '--sequel', :type => :flag
        end

        command.action do |options, arguments|
          MyApp::ExampleCommand.new(options, arguments).execute
        end
      end

      command.command :controller do |command|
        command.action do |options, arguments|
          MyApp::ExampleCommand.new(options, arguments).execute
        end
      end
    end

      command.action do |options, arguments|
        MyApp::ExampleCommand.new(options, arguments).execute
      end
    end
  end

  app.action do |options, arguments|
    MyApp::ExampleCommand.new(options, arguments).execute
  end
end
```

The `ExampleCommand` is an `ActionCommand` and is implemented in a separate class.
In the above examples we would require `my_app` with the assumption that it requires the file where ExampleCommand is implemented.
You could of course just require the file with the implementation directly.

```ruby
module Escort
  class ExampleCommand < ::Escort::ActionCommand::Base
    def execute
      Escort::Logger.output.puts "Command: #{command_name}"
      Escort::Logger.output.puts "Options: #{options}"
      Escort::Logger.output.puts "Command options: #{command_options}"
      Escort::Logger.output.puts "Arguments: #{arguments}"
      if config
        Escort::Logger.output.puts "User config: #{config}"
      end
    end
  end
end
```

## [gli](http://naildrivin5.com/gli/)

Example:

```ruby
#!/usr/bin/env ruby
require 'gli'
require 'hacer'

include GLI::App

program_desc 'A simple todo list'

flag [:t,:tasklist], :default_value => File.join(ENV['HOME'],'.todolist')

pre do |global_options,command,options,args|
  $todo_list = Hacer::Todolist.new(global_options[:tasklist])
end

command :add do |c|
  c.action do |global_options,options,args|
    $todo_list.create(args)
  end
end

command :list do |c|
  c.action do
    $todo_list.list.each do |todo|
      printf("%5d - %s\n",todo.todo_id,todo.text)
    end
  end
end

command :done do |c|
  c.action do |global_options,options,args|
    id = args.shift.to_i
    $todo_list.list.each do |todo|
      $todo_list.complete(todo) if todo.todo_id == id
    end
  end
end

exit run(ARGV)
```

We can now use our app like so:

```ruby
$ todo help
NAME
    todo - A simple todo list

SYNOPSIS
    todo [global options] command [command options] [arguments...]

GLOBAL OPTIONS
    --help             - Show this message
    -t, --tasklist=arg - (default: /Users/davec/.todolist)

COMMANDS
    add  -
    done -
    help - Shows a list of commands or help for one command
    list -

$ todo add "Take out trash"
$ todo add "Rake leaves"
$ todo add "Clean Kitchen"
$ todo list
    0 - ["Take out trash"]
    1 - ["Rake leaves"]
    2 - ["Clean Kitchen"]
$ todo done 1
$ todo list
    0 - ["Take out trash"]
    2 - ["Clean Kitchen"]
```

Features:

- `desc` and `long_desc`.
- `exit_now!` exits with the message, while `help_now!` also shows the command-line help.
- Pre- and Post-Hooks: `pre`, `post` and `error`.
- `gli init` to bootstrap your application.
- Nest `command` inside `command` block for subcommands.
- Designate one subcommand as the default to execute when the subcommand is omitted. You can also define a default action for it instead.
- Flags and switches with subcommands have [some issue](https://github.com/davetron5000/gli/wiki/Subcommands#flags-and-switches).

## [main.rb](https://github.com/ahoward/main)

Sub-commands:

```ruby
require 'main'

Main {
  mode 'install' do
    def run() puts 'installing...' end
  end

  mode 'uninstall' do
    def run() puts 'uninstalling...' end
  end
}
```

A  more complex example:

```ruby
require 'main'

Main {
  argument('foo'){
    cast :int
  }
  keyword('bar'){
    arity 2
    cast :float
    defaults 0.0, 1.0
  }
  option('foobar'){
    argument :optional
    description 'the foobar option is very handy'
  }
  environment('BARFOO'){
    cast :list_of_bool
    synopsis 'export barfoo=value'
  }

    def run
      p params['foo'].value
      p params['bar'].values
      p params['foobar'].value
      p params['BARFOO'].value
    end
  }
```

when run with a command line of

    BARFOO=true,false,false ruby a.rb 42 bar=40 bar=2 --foobar=a

will produce

    42
    [40.0, 2.0]
    "a"
    [true, false, false]

while a command line of

    ruby a.rb --help

will produce

    NAME
      a.rb

    SYNOPSIS
      a.rb foo [bar=bar] [options]+

    PARAMETERS
      * foo [ 1 -> int(foo) ]

      * bar=bar [ 2 ~> float(bar=0.0,1.0) ]

      * --foobar=[foobar] [ 1 ~> foobar ]
          the foobar option is very handy

      * --help, -h

      * export barfoo=value

## [acclaim](https://github.com/matheusmoreira/acclaim)

```ruby
require 'acclaim'

module App
  class Command < Acclaim::Command
    option :verbose, '-V', '--verbose'

    when_called do |options, args|
      puts 'Hello World!'
      puts args.join ', ' if options.verbose? and args.any?
    end
  end
end

App::Command.run *ARGV
```

I feel it too verbose.

Another example of verbosity is taht `help` is special, but need to add:

```ruby
class App::Command
  help
end
```

Subcommands inherit from an existing command:

```ruby
class App::Command::Do < App::Command

  # option is aliased as opt
  opt :what, '--what', 'What to do.', default: 'something', arity: [1, 0]

  # when_called is aliased as action
  action do |options, args|
    puts "Doing #{options.what} with #{args.join ', '}"
  end
end
```
## [mixlib-cli](https://github.com/opscode/mixlib-cli)

Example:

```ruby
require 'rubygems'
require 'mixlib/cli'

class MyCLI
  include Mixlib::CLI

  option :config_file,
    :short => "-c CONFIG",
    :long  => "--config CONFIG",
    :default => 'config.rb',
    :description => "The configuration file to use"

  option :log_level,
    :short => "-l LEVEL",
    :long  => "--log_level LEVEL",
    :description => "Set the log level (debug, info, warn, error, fatal)",
    :required => true,
    :proc => Proc.new { |l| l.to_sym }

  option :help,
    :short => "-h",
    :long => "--help",
    :description => "Show this message",
    :on => :tail,
    :boolean => true,
    :show_options => true,
    :exit => 0

end
```

I dislike its verbosity.

## [Cri](https://github.com/ddfreyne/cri)

Example:

```ruby
command = Cri::Command.define do
  name        'dostuff'
  usage       'dostuff [options]'
  aliases     :ds, :stuff
  summary     'does stuff'
  description 'This command does a lot of stuff. I really mean a lot.'

  flag   :h,  :help,  'show help for this command' do |value, cmd|
    puts cmd.help
    exit 0
  end
  flag   nil, :more,  'do even more stuff'
  option :s,  :stuff, 'specify stuff to do', argument: :required

  run do |opts, args, cmd|
    stuff = opts.fetch(:stuff, 'generic stuff')
    puts "Doing #{stuff}!"

    if opts[:more]
      puts 'Doing it even more!'
    end
  end
end

command.run(ARGV)
```

It supports subcommand:

```ruby
root_cmd.add_command(cmd_add)
root_cmd.add_command(cmd_commit)
root.cmd.add_command(cmd_init)
```

I feel it complex.

## [Choice](https://github.com/defunkt/choice)

Choice only handles `--options`.
It is not convenient to handle commands.

Example

```ruby
require 'choice'

PROGRAM_VERSION = 4

Choice.options do
  header ''
  header 'Specific options:'

  option :host do
    short '-h'
    long '--host=HOST'
    desc 'The hostname or ip of the host to bind to (default 127.0.0.1)'
    default '127.0.0.1'
  end

  option :port do
    short '-p'
    long '--port=PORT'
    desc 'The port to listen on (default 21)'
    cast Integer
    default 21
  end

  separator ''
  separator 'Common options: '

  option :help do
    long '--help'
    desc 'Show this message'
  end

  option :version do
    short '-v'
    long '--version'
    desc 'Show version'
    action do
      puts "ftpd.rb FTP server v#{PROGRAM_VERSION}"
      exit
    end
  end
end

puts 'port: ' + Choice[:port]
```