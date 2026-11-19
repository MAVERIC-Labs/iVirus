---
title: "Annotation & AMGs"
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: annotation
permalink: /docs/workflows/annotation/
---

{% workflowStepper workflow, step %}

Now we want to annotate our putative viral genomes and then manually screen them to ensure they are of high confidence. VirSorter2 can contain false positives. No viral tool is completely perfect - every one of them has advantages or disadvantages, depending on the viral types present in the sample and biases to the identification tool.

To do this, we'll use DRAM-v to identify AMGs and to identify "suspicious" genes that can be found in viral genomes and can lead to them being called viral.

## DRAM-v

{% codetabs ["Command", "SLURM Script"] %}
```bash
DRAM-v.py annotate \
  -i vs2_pass2/for-dramv/final-viral-combined-for-dramv.fa \
  -v vs2_pass2/for-dramv/viral-affi-contigs-for-dramv.tab \
  -o dramv_annotate/ \
  --skip_trnascan --threads 16 --min_contig_size 1000

DRAM-v.py distill -i dramv_annotate/annotations.tsv -o dramv_distill/
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -n 40
#SBATCH -t 120:00:00
#SBATCH -J dramv
#SBATCH --mem=64G

WORKDIR="$PWD"
FA="${WORKDIR}/vs2_pass2/for-dramv/final-viral-combined-for-dramv.fa"
AFFI="${WORKDIR}/vs2_pass2/for-dramv/viral-affi-contigs-for-dramv.tab"

# Annotate
DRAM-v.py annotate \
  -i $FA \
  -v $AFFI \
  -o ${WORKDIR}/dramv_annotate \
  --skip_trnascan \
  --threads $SLURM_NTASKS \
  --min_contig_size 1000

# Then summarize
DRAM-v.py distill \
  -i ${WORKDIR}/dramv_annotate/annotations.tsv \
  -o ${WORKDIR}/dramv_distill
```
{% endcodetabs %}

We're still continuing with the [VirSorter2 SOP](https://www.protocols.io/view/viral-sequence-identification-sop-with-virsorter2-5qpvoyqebg4x/v3). This is the same DRAM-v run as in [Viral Identification]({{ '/docs/workflows/viral-identification/' | url }}), so if you ran it there you already have these results.

Let's see how long this took.

```bash
$ sacct -j <jobid> --format "CPUTime,MaxRSS,Elapsed"
     CPUTime     MaxRSS    Elapsed
------------ ---------- ----------
135-17:22:00   9029732K 3-09:26:03
```

Three days and 9 hours using 40 cores to annotate 3313 contigs.

Next, we need to screen based on the viral and host genes, hallmark genes, and contig lengths between CheckV and VirSorter2, and incorporate DRAM results in order to have confidence in our viral calls. The VirSorter2 SOP has a general set of guidelines we can use. Basically, they're screening categories: Keep1, Keep2, Manual check, and discard. Please look through the "Manual curation" (Step 5) of the VirSorter2 SOP documentation. If you want results you can be confident in, ensure you go through them.

See the [DRAM-v guide]({{ '/docs/tools/dram-v/' | url }}) for installation, flags and output files.

## Other annotators

[Pharokka]({{ '/docs/tools/pharokka/placeholder/' | url }}) is a rapid standardised annotation tool for bacteriophage genomes and metagenomes. It predicts genes with PHANOTATE by default and assigns functions by matching each predicted gene against the PHROGs, CARD and VFDB databases.

[prodigal-gv]({{ '/docs/tools/prodigal-gv/placeholder/' | url }}) is a fork of Prodigal meant to improve gene calling for giant viruses and viruses that use alternative genetic codes. It adds ten models to Prodigal's metagenome mode.
