Building-A-Pipeline
===========================

From Containers to Pipelines
----------------------------

This guide serves as a reference for taking Singularity-based containers and publishing them to CyVerse. This guide is
just that, a guide. Every effort has been made to keep this *somewhat* up to date with the best practices of CyVerse.
If something doesn't work, let us know and we'll do our best to update it. Also, this won't teach you everything about
the Agave API. There's a lot of information about the setup and features, but we only use A FEW of those tools.

Before you begin
----------------

You'll need a few tools installed, and access to a few systems (one of which requires admin powers).

* Singularity installed on a machine w/ admin/sudo powers
* The `Agave CLI <https://cyverse.github.io/cyverse-sdk/docs/using-agave/>`_ installed on either your local machine or TACC

Personally I use TACC because it has fast access to CyVerse's servers and it's an excellent testing environment. If it
works on TACC's systems (as a test job, see more below), there's a good chance it'll publish without problem.

(Documentation will one day be updated to go through all the steps to install the CLI, but it'll be copy-and-pasted
from the installation guide... so go there for installation help)

The guide below is going to use vConTACT2-0.9.3 (versions don't matter all that much), which can be found as vConTACT2.def
under the singularity directory.

Step 1 - On your local machine
------------------------------

**Building the container**

Build the singularity image and ensure that it functions correctly on your local machine. Since I use a Mac, I also
use Vagrant to manage my Docker containers that I then connect to.

.. code-block:: bash

    cd <location with vagrant file>
    vagrant up && vagrant ssh

This then connects to the running docker container. (Yes, this can be a little confusing. You're using vagrant to help
manage Docker, connecting to that container, and then using that container to make another container)

Step 2 - In the docker container
--------------------------------

.. code-block:: bash

    cp /vagrant/vConTACT2-0.9.3.def .
    sudo singularity build vConTACT2-0.9.3.simg vConTACT2-0.9.3.def

Here I copied the singularity definition file *into* the running Docker container and then built the Singularity
container. Alternatively, you can also build directly using the definitions file w/out copying the file into the container.

.. code-block:: bash

    cp /vagrant/gene2genome_proteins.csv .
    cp /vagrant/VIRSorter_viral_prots.faa .
    singularity run vConTACT2-0.9.3.simg --raw-proteins VIRSorter_viral_prots.faa --rel-mode ‘Diamond’ --proteins-fp gene2genome_proteins.csv --db 'ProkaryoticViralRefSeq85-Merged' --pcs-mode MCL --vcs-mode ClusterONE --c1-bin /usr/local/bin/cluster_one-1.0.jar --output-dir vConTACT2-Output

Copy the test data over into the Docker container and run the singularity container using the test files. **Ensure that
all vConTACT2 output files are generated.** This is essential to the testing process.

Once that's done, copy the files back to the host system (for me, it's the Mac).

.. code-block:: bash

    cp vConTACT2-0.9.3.simg /vagrant/

Step 3 - On your local machine
------------------------------

Now copy the Singularity image over to TACC, as well as the files required for a functional app on CyVerse.

.. code-block:: bash

    rsync -Pavz <path-to-apps>/vConTACT2-0.9.3 username@stampede2.tacc.utexas.edu:<path-to-work-directory>/iVirus-Apps

Step 4 - On TACC
----------------

At TACC, you should have installed the Agave CLI (above) and validated that everything was functional. (More details
might be added later).

Test that the singularity image works
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Yes, sounds obvious. But *it is possible* that it won't work. Often times this is because you need to make sure that
the directories /home1 /scratch and /work are created. And there are rare occasions where interactions between the tool,
singularity, and the host system don't mesh (i.e. for "some" reason, the tool doesn't recognize files outside the
container).

.. code-block:: bash

    sbatch test.sh

The job should get submitted, and output generated. Hopefully it's the same output as was created on your local machine.
If not, investigate!

"Push" the app to your private system
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Once the Singularity container works, push it to CyVerse as a private app on your private system.

.. code-block:: bash

    auth-tokens-refresh -S -v

    files-upload -S data.iplantcollaborative.org -F <app-folder-on-TACC> <CyVerse-home-directory>/apps

    apps-addupdate -F <app-folder-on-TACC>/vConTACT2-0.9.3.json

    apps-list --privateonly

A lot of things happen here. First, we're refreshing our CyVerse token (explained extensively in the Agave CLI docs).
Then we're uploading the app data (*everything* that's needed to run the app) to CyVerse. The storage system is
iplantcollaborative, the folder is the app folder on TACC, and it's being uploaded to your CyVerse home directory under
the "apps" folder. Of course, this could be anywhere you have write permission to on CyVerse, but for now that's the
easiest place. Then, you add the app to CyVerse's app system. The json has all the details about the app's run
parameters, what should be displayed to the user through the CyVerse UI, version info, and where to find the app.
Finally, ensure that the app has been successfully published to your private system (apps-addupdate will tell you if
something really goes wrong) by getting a list of your private apps. Whatever your app name + version is should be
displayed.

Test the CyVerse app
^^^^^^^^^^^^^^^^^^^^

.. code-block:: bash

    jobs-submit -v -F vConTACT2-0.9.3-TestJob.json

Now the job should get submitted using the parameters set in the TestJob.json file to make sure that the app works on
CyVerse. (Things *can* and *do* go wrong here. Even if everything works up to this point, variables in the app
parameters can be wrong/incorrect, or a mispelled argument doesn't get passed correctly to the wrapper. A whole bunch of
stuff can go wrong. It's **here** that the final test of the app is done.)

And finally, if your job takes a little while but you want to get the status of the job...

.. code-block:: bash

    jobs-status JOB_ID

If everything works...
^^^^^^^^^^^^^^^^^^^^^^

Go ahead and request that your app be made public from the CyVerse staff.

Congratulations, you've gone from a Singularity definitions file to a published app that others can benefit!
