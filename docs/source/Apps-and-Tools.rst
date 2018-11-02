Apps and Tools
===========================

At the center of *nearly* every app/tool is a singularity container. `Singularity <https://www.sylabs.io/>`_ is a
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

Example: One of the iVirus singularity containers is Prodigal. To build and run this container,

.. code-block:: bash

    sudo singularity build Prodigal.simg Prodigal.def
    singularity run Prodigal.simg --help

If everything worked out, the final command should pull up Prodigal's help menu. If it didn't, you'll have to do some
troubleshooting to identify what went wrong.

Quality Control Apps
--------------------

Generally speaking, quality control (QC) is a technique applied to to [most commonly] raw read data. This ensures that
the data going into the assembly (common next step) is of high quality. Poor read quality can result in mis- or
incorrectly assembled sequences. Most frequently, read data QC involves trimming reads according to their quality
scores. Although some assemblers do not require QC’d reads, we highly recommend it!

Trimmomatic
^^^^^^^^^^^
`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=Trimmomatic-0.35.0u1>`_

**Reference**: Bolger, A. M., Lohse, M., & Usadel, B. (2014). Trimmomatic: A flexible trimmer for Illumina Sequence Data. Bioinformatics, btu170.

**Short description**: Identifies adapter sequences in raw sequencing reads and quality filters

**Singularity use**

Btrim
^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=18db8b81-b5f8-40b2-bb66-ac834e1180c0>`_

**Reference**: Kong, Y. (2011) Btrim: a fast, lightweight adapter and quality trimming program for next-generation sequencing technologies. Genomics. DOI: 10.1016/j.ygeno.2011.05.009

**Short description**: Trims adapters and low quality regions

**Singularity use**

Scythe
^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=3092256b-d9ca-4063-abe6-ac70b761b3dd>`_

**Reference**: Buffalo V. Scythe - A Bayesian adapter trimmer (version 0.994 BETA) [Software]. Available at https://github.com/vsbuffalo/scythe

**Short description**: Identifies contaminating sequences in read data based on a Bayesian approach

**Singularity use**

Sickle
^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=68b278f8-d4d6-414d-9a64-b685a7714f7c>`_

**Reference**: Joshi NA, Fass JN. (2011). Sickle: A sliding-window, adaptive, quality-based trimming tool for FastQ files
(Version 1.33) [Software].  Available at https://github.com/najoshi/sickle.

**Short description**: Sliding window quality trimmer, designed to be used after Scythe

**Singularity use**


Gene Calling
------------

FragGeneScan
^^^^^^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=FragGeneScan-1.20.0u1>`_

**Reference**: Mina Rho, Haixu Tang, and Yuzhen Ye. FragGeneScan: Predicting Genes in Short and Error-prone Reads. Nucl. Acids Res., 2010 doi: 10.1093/nar/gkq747

**Short description**: FragGeneScan is an application for finding (fragmented) genes in short reads

**Singularity use**

Prodigal
^^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=1c539f4e-66d7-11e5-83be-df5a7324610a>`_

**Reference**: Hyatt, D. Prodigal (2.6.3) [Software]. Available at https://github.com/hyattpd/Prodigal

**Short description**: Fast, reliable protein-coding gene prediction for prokaryotic genomes.

**Singularity use**


Assemblers
----------

Following read trimming and QC, reads can now be assembled into contiguous sequences (“contigs”). Most “recent”
assemblers are designed to assemble Illumina data (short read lengths, massively deep sequencing) and are based on
De Bruijn graphs (original ref). Assembler selection is dependent on the type of read data being assembled (often 454
vs Illumina vs Pacbio), source material (DNA vs. RNA, eukaryotic vs prokaryotic) and/or sample-specific determinants
that may have biased the reads (high/low coverage, repetitive sequences, amplification polymerase, etc.). There is
no “best” assembler, though there are assemblers that perform better with viral metagenomes than others.

SOAPDenovo
^^^^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=Soapdenovo-2.0.4u4>`_

**Reference**: Luo et al.: SOAPdenovo2: an empirically improved memory-efficient short-read de novo assembler. GigaScience 2012 1:18.

**Short description**: Single-genome assembler tuned for metagenomics.

**Long description**: SOAPdenovo is a novel short-read assembly method that can build a de novo draft assembly for the
human-sized genomes. The program is specially designed to assemble Illumina GA short reads. It creates new
opportunities for building reference sequences and carrying out accurate analyses of unexplored genomes in a cost
effective way. Now the new version is available. SOAPdenovo2, which has the advantage of a new algorithm design that
reduces memory consumption in graph construction, resolves more repeat regions in contig assembly, increases coverage
and length in scaffold construction, improves gap closing, and optimizes for large genome. (taken from SOAPDenovo
website)

**Singularity use**

gsAssembler (aka Newbler)
^^^^^^^^^^^^^^^^^^^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=Newbler-stampede-2.6.0u1>`_

**Reference**: Genivaldo, GZ; Silva, Bas E; Dutilh, David; Matthews, Keri; Elkins, Robert; Schmieder, Elizabeth A;
Dinsdale, Robert A Edwards. "Combining de novo and reference-guided assembly with scaffold_builder". Source Code
Biomed Central. 8 (23). doi:10.1186/1751-0473-8-23.

**Short description**: De novo assembly based on overlap-layout-consensus

**Notes on use**: 454 Life Sciences was purchased by Roche in 2007 and shut down in 2013. There haven't been any
updates for the software since then, making it an increasingly aging tool.

**Singularity use**

SPAdes
^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=SPAdes-3.6.0u1>`_

**Reference**: Bankevich A., Nurk S., Antipov D., Gurevich A., Dvorkin M., Kulikov A. S., Lesin V., Nikolenko S.,
Pham S., Prjibelski A., Pyshkin A., Sirotkin A., Vyahhi N., Tesler G., Alekseyev M. A., Pevzner P. A. SPAdes: A New
Genome Assembly Algorithm and Its Applications to Single-Cell Sequencing. Journal of Computational Biology, 2012

**Short description**: SPAdes – St. Petersburg genome assembler – is an assembly toolkit containing various assembly
pipelines

**Notes on use**: SPAdes, as with many de Bruijn assemblers, can consume incredibly amounts of memory. In the context
of viral metagenomics, it's been known to use 2-3, and upwards of 6 TB of memory (and more if you give it more data!).
There are multiple implementations on CyVerse using different runtimes and memory allocations. However, if the job will
take more than 48-hr to run, there's a good chance it'll fail on CyVerse. For this, you may want to install it on a big
memory machine locally.

**Singularity use**

IDBA-UD
^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=idba_ud_32gb_4h-1.1.2u1>`_

**Reference**: Peng, Y., et al. (2010) IDBA- A Practical Iterative de Bruijn Graph De Novo Assembler. RECOMB. Lisbon.

Peng, Y., et al. (2012) IDBA-UD: a de novo assembler for single-cell and metagenomic sequencing data with highly uneven
depth, Bioinformatics, 28, 1420-1428.

**Short description**: IDBA-UD is a iterative De Bruijn Graph De Novo Assembler for Short Reads Sequencing data with
Highly Uneven Sequencing Depth. It is an extension of IDBA algorithm.

**Long description**: IDBA-UD is a iterative De Bruijn Graph De Novo Assembler for Short Reads Sequencing data with
Highly Uneven Sequencing Depth. It is an extension of IDBA algorithm. IDBA-UD also iterates from small k to a large k.
In each iteration, short and low-depth contigs are removed iteratively with cutoff threshold from low to high to reduce
the errors in low-depth and high-depth regions. Paired-end reads are aligned to contigs and assembled locally to
generate some missing k-mers in low-depth regions. With these technologies, IDBA-UD can iterate k value of de Bruijn
graph to a very large value with less gaps and less branches to form long contigs in both low-depth and high-depth
regions. (taken from website)

**Singularity use**

Trinity
^^^^^^^^^

`CyVerse App <https://de.cyverse.org/de/?type=apps&app-id=trinity-stmpde-11.10.13u2&system-id=agave>`_

**Reference**: Grabherr MG, Haas BJ, Yassour M, Levin JZ, Thompson DA, Amit I, Adiconis X, Fan L, Raychowdhury R, Zeng
Q, Chen Z, Mauceli E, Hacohen N, Gnirke A, Rhind N, di Palma F, Birren BW, Nusbaum C, Lindblad-Toh K, Friedman N, Regev
A. Full-length transcriptome assembly from RNA-seq data without a reference genome. Nat Biotechnol. 2011
May 15;29(7):644-52. doi: 10.1038/nbt.1883. PubMed PMID: 21572440.

**Short description**: Trinity assembles transcript sequences from Illumina RNA-Seq data.

**Singularity use**

Annotations
-----------

Trinity
^^^^^^^^^

`CyVerse App <https://de.cyverse.org/de/?type=apps&app-id=Prokka-1.12.0u1&system-id=agave>`_

**Reference**: Seemann T. Prokka: rapid prokaryotic genome annotation Bioinformatics 2014 Jul 15;30(14):2068-9.
PMID:24642063

**Short description**: Prokka is a software tool to annotate bacterial, archaeal and viral genomes quickly and produce
standards-compliant output files

**Singularity use**

Viral Analysis
--------------

Analyzing viral data remains a major challenge in the field of viral ecology. A variety of approaches have been
proposed, each dependent on the source of data and the underlying biological question. A relatively recent method of
analyzing complex viral data is by organizing viral sequence space, often through the use of protein clustering
techniques. Protein clusters can be used as a diversity metric, or as units for ecological studies when compared
against other datasets, or functional profiling of the community.

PCPipe
^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=08df1cc6-ceb6-11e5-a661-6b85e1c23535>`_

**Reference**:

**Short description**: Protein clustering pipeline and annotation

**Singularity use**

VIRSorter
^^^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=0b0968f8-5805-11e5-8a4d-5fb83618a439>`_

**Reference**: Roux S, Enault F, Hurwitz BL, Sullivan MB. (2015) VirSorter: mining viral signal from microbial genomic
data. PeerJ 3:e985 https://doi.org/10.7717/peerj.985

**Short description**: Identify viral contigs in a microbial metagenomes

**Singularity use**

vConTACT
^^^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=vContact-0.1.49u2>`_

**Reference**: Bolduc B, Jang H Bin, Doulcier G, You Z, Roux S, Sullivan MB. (2017). vConTACT: an iVirus tool to
classify double-stranded DNA viruses that infect Archaea and Bacteria. PeerJ 5: e3243.

**Short description**: Guilt-by-contig-association automatic classification of viral contigs

**Singularity use**

vConTACT-PCs
^^^^^^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=vContact_pcs-0.1.49u4>`_

**Reference**:

**Short description**: Generate PC-profiles using vContact/MCL

**Singularity use**

vConTACT-Gene2Genome (formerly known as "Gene2Contig")
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

`CyVerse App <https://de.iplantcollaborative.org/de/?type=apps&app-id=vContact-Gene2Contig-0.1.0u1>`_

**Reference**:

**Short description**: Conditions files for use in vContact

**Singularity use**:

BowtieBatch
^^^^^^^^^^^

`CyVerse App <https://de.cyverse.org/de/?type=apps&app-id=BowtieBatch-1.0.0u1&system-id=agave>`_

**Reference**:

**Short description**: Performs mass alignment of paired and unpaired reads against a reference dataset using Bowtie2
and Samtools.

**Singularity use**:

Read2RefMapper
^^^^^^^^^^^^^^

`CyVerse App <https://de.cyverse.org/de/?type=apps&app-id=Read2RefMapper-1.1.0u1&system-id=agave>`_

**Reference**:

**Short description**: Consumes input from BowtieBatch to generate coverage profiles.

**Singularity use**:


In some stage of development
----------------------------

Below are a list of apps that could be at any stage of the app development process. That means they could be 99%
implemented and moments away from going public, or they could be a note taken on a napkin.

GAAS (Genome Abundance and Average Size)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Estimates relative abundance and average size of metagenomic sequences

Circonspect
^^^^^^^^^^^

Generates contig spectra for downstream modeling of community structure

PHACCS (Control In Research on CONtig SPECTra)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Estimates structure and diversity of viral communities