Apps and Tools
===========================

At the center of *nearly* every app/tool is a singularity container. `Singularity <https://www.sylabs.io/>`_. is a
container solution we leverage at iVirus to make delivering apps/tools easier. A tool needs to be built only once,
and its image can be run on a variety of local compute and HPCs. Not only is this easier on the developer, this lets
them focus on research as well!

All tools are accessible as Apps in the CyVerse Discovery Environment (formerly iPlant). The CyVerse
Cyberinfrastructure is a freely available resource for computation, storage, and data analysis for the life sciences.
As mentioned elsewhere, we are also bringing some of these apps to The Department of Energy Systems Biology
Knowledgebase (KBase), a software and data platform designed to meet the grand challenge of systems biology: predicting
and designing biological function. We plan to extend the list of tools for viruses as long as we continue to receive
funding (and sometimes beyond). We've also included more generalized apps for metagenomics and microbial ecology
available through the iMicrobe Project.

Below is a list of every single app available through iVirus on CyVerse (both "old" and "new" versions), as well as a
few yet-to-be integrated ones. It will be updated as frequently as time allows, though feel free to contact us if
there's any mistakes or omissions.


The Basics: Using Singularity
-----------------------------

Before you can use any of these apps locally, you'll need to read :ref:`singularity101`.

Quality Control Apps
--------------------

Generally speaking, quality control (QC) is a technique applied to to [most commonly] raw read data. This ensures that
the data going into the assembly (common next step) is of high quality. Poor read quality can result in mis- or
incorrectly assembled sequences. Most frequently, read data QC involves trimming reads according to their quality
scores. Although some assemblers do not require QC’d reads, we highly recommend it!

Gene Calling
------------


Assemblers
----------

Following read trimming and QC, reads can now be assembled into contiguous sequences (“contigs”). Most “recent”
assemblers are designed to assemble Illumina data (short read lengths, massively deep sequencing) and are based on
De Bruijn graphs (original ref). Assembler selection is dependent on the type of read data being assembled (often 454
vs Illumina vs Pacbio), source material (DNA vs. RNA, eukaryotic vs prokaryotic) and/or sample-specific determinants
that may have biased the reads (high/low coverage, repetitive sequences, amplification polymerase, etc.). There is
no “best” assembler, though there are assemblers that perform better with viral metagenomes than others.


Viral Analysis
--------------

Analyzing viral data remains a major challenge in the field of viral ecology. A variety of approaches have been
proposed, each dependent on the source of data and the underlying biological question. A relatively recent method of
analyzing complex viral data is by organizing viral sequence space, often through the use of protein clustering
techniques. Protein clusters can be used as a diversity metric, or as units for ecological studies when compared
against other datasets, or functional profiling of the community.


Annotations
-----------

