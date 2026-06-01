---
title: SRA Fetch
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: sra
permalink: /docs/workflows/sra-fetch/
---

{% workflowStepper workflow, step %}

The first thing we need to do is grab the data from the SRA. You can do this a few ways, either through navigating the NCBI+SRA websites, or directly using their SRA Toolkit.

We'll use [ERR594369](https://www.ncbi.nlm.nih.gov/sra/ERX552322) as our running example throughout this workflow — a viral metagenome with 37 million paired reads and 7.2 Gbp total.

{% codetabs ["Command", "SLURM Script"] %}
```bash
fasterq-dump -e 4 -p --split-files ERR594369
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -t 1:00:00
#SBATCH -n 4
#SBATCH -J sra-fetch

# activate your conda environment here

workDir="<your_project_dir>"

cd $workDir
fasterq-dump -e 4 -p --split-files ERR594369
```
{% endcodetabs %}

Expected output:

```
join   :|-------------------------------------------------- 100.00%
concat :|-------------------------------------------------- 100.00%
spots read      : 37,151,587
reads read      : 74,303,174
reads written   : 74,303,174

real	21m9.644s
user	6m21.745s
sys	0m45.333s
```

In the example above, we used *fasterq-dump*, which is designated to download two paired end read files in fastq format. We also specified 4 threads (-e 4) so it would run a little faster. There should be *two* output files: ERR594369_1.fastq and ERR594369_2.fastq. fasterq-dump won't compress the files for you, so you'll have to do this after the download completes.

```bash
gzip ERR594369_1.fastq ERR594369_2.fastq
```

## Finding accessions

SRA run accessions start with **SRR** (NCBI), **ERR** (ENA), or **DRR** (DDBJ). These are the accessions you pass directly to `fasterq-dump`. Search the [NCBI SRA](https://www.ncbi.nlm.nih.gov/sra) with a BioProject ID, keyword, or accession from a paper to find the run accession(s) you need.

## See also

- [SRA Download tool guide](/docs/tools/sra-download/)
