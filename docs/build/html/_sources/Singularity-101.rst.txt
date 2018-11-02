.. _singularity101:

Singularity 101
===============

Singularity Notes
-----------------

Much of this documentation is taken from the `singularity website <http://singularity.lbl.gov/>`_, it's simply
re-hashed and organized in a less "quick start" or "overwhelming documentation" style.

**Overall thoughts**

Singularity is a container-based environment. There's always TWO "systems", the first is the *host* system, that's
the one where the container/image is running. The 2nd is the *guest* system, that's whatever's **in** the container.
The cool thing about Singularity is that the guest can "see" outside itself (depending on permissions, more below),
meaning that it can run on files outside the container. In fact, once a container is built, it can *almost* be treated
just like any other executable.

**What does this really mean?**

The big advantage of Singularity containers is that they are generally more secure than other container-based options.
In a nutshell, Singularity containers work with the user's privileges. *So if the user wants to create/edit operating
system stuff, then they need to be sudo for creating/editing the container.* If the user just wants to run a command
(for ex: ls, top, grep, cat) then the user doesn't need to be sudo and they can *run the container*. This becomes
**a really important distinction when you move from creating a Singularity image to running it in a production
environment**.

Before you begin
----------------

Assuming you want to **develop** Singularity-based container apps...

You need to install Singularity to a machine where you have root/sudo privileges (more below). There's a number of ways
 to do this: `Mac <http://singularity.lbl.gov/install-mac/>`_, `Linux <http://singularity.lbl.gov/install-linux/>`_ and `Windows <http://singularity.lbl.gov/install-windows/>`_

I use a Mac, so installation is a bit more involved. It requires using vagrant to set up and build a VM, then
connecting to that [linux-based] VM to install Singularity. It's not bad, but I need to keep remembering where I am:

Mac -> VM -> Singularity-Container

and there's a shared space to transfer files from Mac<-->VM, so it's all about shuttling files from Mac to the shared
space, then from the shared space to the VM.

If you're using linux you're home free. Singularity is just another tool.

Typical Workflow
----------------

High-level summary:

* [On local machine] Create Singularity definition file
* [On local machine] Create Singularity image from definition file
* Transfer Singularity image to remote machine / HPC
* [On HPC] Run/Execute Singularity image as local user

**On local machine**

Keep in mind that most everything is done on a local machine, i.e. a machine where you have root/sudo privileges.

Create Singularity definition file
-----------------------------------

The definition file is functionally equivalent to Dockerfiles. It contains all the commands that one would need in
order to process dependencies, build and compile tools. Basically, if you'd need to type out 30 commands to get your
favorite tool to compile with its million libraries, you'll need to copy-and-paste those in the definition file.

The basic structure is as such:

.. code-block:: none

    BootStrap: debootstrap
    OSVersion: stable
    MirrorURL: http://ftp.us.debian.org/debian/

    # Where files go to transfer TO app once everything is finished
    %files

    # Whatever other labels you want added to container
    %labels
    MAINTAINER ben

    %environment
    COOL_LIB=/code/to/library
    export COOL_LIB

    %runscript
    echo "I'm in the container!"
    exec /code/to/tool.py "$@"

    # This is what is run to build and create container
    %post
    apt-get update
    apt-get install dependency1 dependency2 library1

    git clone git.repo
    cd git.repo
    ./configure
    make
    make install


Obviously the above won't run. I don't really use %labels, and since %files is run AFTER %post, I don't need it
(I usually pull data from the web using wget, curl or similar). You could use %files to copy a database to a specific
location in the container. I just prefer to rely on a single definition file with no calls to non-public data, as to
avoid *the black box effect*. %environment is fine, but for some reason it doesn't work as I expect it to during %post,
so I usually export my variables (i.e. export $BINPATH=/usr/locl/bin) within %post when installing stuff.

Build Singularity image with the definitions file
-------------------------------------------------

.. code-block:: bash

    sudo singularity build app.img app.def

And you'll want to check out the various ways to run it

.. code-block:: bash

    singularity run app.img --help
    singularity exec app.img /path/to/tool --help
    ./app.img --help

All the above are equivalent and function identically. Of course, there's probably some subtle differences between
them, but that's a bit beyond me.

At this point you want to copy the app.img file over to the HPC where it's needed.

**On the Ohio Supercomputer Center (OSC)**

Load module

.. code-block:: bash

    module load singularity/current


At this point you're ready to run the container.

.. code-block:: bash

    singularity --debug run -H /users/<account#>/<userid> app.img -h


Strangely enough, it appears that the singularity homedir needs to be bound by the user.

Bugs?
-----

Sometimes you can get a binding error. It can be fixed by doing:

.. code-block:: bash

    sudo singularity shell --writable app.img


on a local/development machine and then exiting. Stupid, I know, but it's minor annoyance and it works.

Links
-----

[Singularity Hub](https://singularity-hub.org/)
