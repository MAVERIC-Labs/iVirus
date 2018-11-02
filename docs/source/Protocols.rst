Protocols
===========================

Below is a collection of protocols.io links for using iVirus-enabled apps in CyVerse. Due to the nature of this media,
it isn't possible to include guides with the same level of "visual" detail. This only seeks to centralize them in one
location.

A few quick notes:

* Guides are not intended to assist users in understanding the biology behind the tools nor how the tools function.
* Where possible, Apps have links to their documentation on CyVerse as well as their citations (or original home pages).
* In some cases, many Apps are available to solve a particular problem. Guides will choose to highlight one or two.
* These guides assume you’ve created an CyVerse account and can access your account. Check out the
`getting started guide <http://ivirus.us/getting-started/>`_ for assistance.

Guides and Use Cases
--------------------

Several “use cases” are available at protocols.io. For nearly all these use cases, we’ll use (as a basis) actual reads
from the `Ocean Sampling Day (2014) <https://github.com/MicroB3-IS/osd-analysis>`_ and process them using Cyverse. In some cases we’ll take the user from using raw
read files to assembly to identifying viral sequences and preliminary analysis. Other use cases will tackle ways of
analyzing a viral metagenome, either reads or contigs, using traditional and non-traditional approaches. As a reminder,
all these protocols are on protcols.io and should be considered the most up-to-date versions, though *they definitely
can fall behind depending on developer's time*.

All example files can be found within the Cyverse datastore. To find these files, login to the Discovery Environment.
Under “Data”, go to Community Data –> iVirus –> ExampleData. Alternatively, you can copy-and-paste the following into
the “Viewing” bar under the data browser: /iplant/home/shared/iVirus/ExampleData/

All tools have “Input” and “Output” directories, so not only does the user have valid input data, but also the expected
output data as well.

Processing a Viral Metagenome
-----------------------------

**Description**: A long-standing challenge in viral metagenomics is actually processing a viral metagenome (we’re not
talking about the science side!). For many reasons enumerated elsewhere, processing these datasets requires skilled
bioinformaticians and computational resources not available to many researchers/labs. iVirus seeks to tackle this
head-on.

**Protocol "collection"**: `This collection <https://www.protocols.io/view/Processing-a-Viral-Metagenome-Using-iVirus-ev3be8n>`_
connects individual protocols and goes from raw reads to processing with vConTACT.

**Individual steps**:

* `Cleaning up sequencing reads using Trimmomatic <https://www.protocols.io/view/Quality-Control-of-Reads-Using-Trimmomatic-Cyverse-ewbbfan>`_
* `Assembling QC'd reads using SPAdes <https://www.protocols.io/view/Assembling-Viral-Metagenomic-Data-with-SPAdes-Cyve-evzbe76>`_
* `Identifying putative viral sequences using VirSorter <https://www.protocols.io/view/Identifying-Viral-Sequences-Using-VirSorter-Cyvers-ev2be8e>`_
* `Preparing data for vConTACT <https://www.protocols.io/view/Preparing-Data-for-vContact-from-Proteins-Cyverse-ev7be9n>`_
* `Running vConTACT and visualization in Cytoscape <https://www.protocols.io/view/Applying-vContact-to-Viral-Sequences-and-Visualizi-ev8be9w>`_

Mapping Metagenomic Reads to a Reference Collection
---------------------------------------------------

**Description**: One of the most commonly used procedures for analyzing viral metagenomic data is to map their reads
(or reads from another dataset) against a set of references, often those from the read assembly. For example, if one
wanted to know how well-represented viruses in NCBI’s Viral Reference Sequences (ViralRefSeq) were in ocean viromes,
they could map reads from lots of ocean viral metagenomes against ViralRefSeq. This is generally done using `Bowtie2 <http://bowtie-bio.sourceforge.net/bowtie2/index.shtml>`_ or
`BWA <http://bio-bwa.sourceforge.net/>`_, by selecting a reference set of sequences, and then providing paired or unpaired reads to Bowtie2/BWA. Then the
results must be processed/filtered to generate coverage tables. Dealing with setting up multiple reads files (10 paired
metagenomes = 10 alignment runs) and the processing those read files can be challenging (not to mention computational
resources).

**Protocol**: `Mapping reads <https://www.protocols.io/view/Mapping-Metagenomic-Reads-to-Reference-Sequences-C-evybe7w>`_

**Individual steps**:

* Mapping reads from multiple metagenomes to a set of references
* Filtering mapped reads and generate coverage tables