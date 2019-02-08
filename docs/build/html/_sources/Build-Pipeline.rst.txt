Building-A-Pipeline
===========================

From Singularity Containers to Pipelines
----------------------------------------

This guide serves as a reference for taking Singularity-based containers and publishing them to CyVerse. This guide is
just that, a guide. Every effort has been made to keep this *somewhat* up to date with the best practices of CyVerse.
If something doesn't work, let us know and we'll do our best to update it.


Before you begin
----------------

You'll need a few tools installed, and access to a few systems (one of which requires admin powers).

* Singularity installed on a machine w/ admin/sudo powers
* The `Agave CLI <https://cyverse.github.io/cyverse-sdk/docs/using-agave/>`_ installed on either your local machine or TACC

Personally I use TACC because it has fast access to CyVerse's servers and it's an excellent testing environment. If it
works on TACC's systems (a test job, see more below), there's a good chance it'll publish without problem.

(Documentation will one day be updated to go through all the steps to install the CLI, but it'll be copy-and-pasted
from the installation guide... so go there for installation help)

Step 1 - On your local machine
------------------------------

