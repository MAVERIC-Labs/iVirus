---
title: QC & Trim
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: qc
permalink: /docs/workflows/qc-and-trim/
related_protocols:
  - viral-metagenome
  - download-sra-reads
---

{% workflowStepper workflow, step %}

We will be using either [BBDuk](https://jgi.doe.gov/data-and-tools/bbtools/bb-tools-user-guide/bbduk-guide/) or [Trimmomatic](http://www.usadellab.org/cms/?page=trimmomatic) to process our input reads. *You only need to select one*. We'll be using both for examples, but typically stick with one and use it.

## Trimmomatic

{% codetabs ["Command", "SLURM Script"] %}
```bash
trimmomatic PE ERR594369_1.fastq.gz ERR594369_2.fastq.gz ERR594369_1_t_paired.fastq.gz ERR594369_1_t_unpaired.fastq.gz ERR594369_2_t_paired.fastq.gz ERR594369_2_t_unpaired.fastq.gz ILLUMINACLIP:TruSeq3-PE.fa:2:30:10:2 LEADING:3 TRAILING:3 MINLEN:36
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -t 1:00:00
#SBATCH -n 1
#SBATCH -J trimmomatic

# activate your conda environment here

workDir="<your_project_dir>"
cd $workDir

trimmomatic PE ERR594369_1.fastq.gz ERR594369_2.fastq.gz \
  ERR594369_1_t_paired.fastq.gz ERR594369_1_t_unpaired.fastq.gz \
  ERR594369_2_t_paired.fastq.gz ERR594369_2_t_unpaired.fastq.gz \
  ILLUMINACLIP:TruSeq3-PE.fa:2:30:10:2 LEADING:3 TRAILING:3 MINLEN:36
```
{% endcodetabs %}

Expected output:

```
Input Read Pairs: 37151587 Both Surviving: 36444033 (98.10%) Forward Only Surviving: 632370 (1.70%) Reverse Only Surviving: 67275 (0.18%) Dropped: 7909 (0.02%)
TrimmomaticPE: Completed successfully

real	30m23.395s
```

For Trimmomatic, the defaults work pretty well. Note the location of the IlluminaClip — it's already 'in' the conda package. If you have your own custom primers/adapters, you'll need to add your sequences or create your own primer and adapter file.

## BBDuk

Next, BBDuk. BBDuk is usually done in 2-3 steps, with 1st being an adapter trimming step, and 2nd with the removal of low quality sequences. You can do both steps in a single command, but doing so in two steps allows us to see what was removed during each.

{% codetabs ["Command", "SLURM Script"] %}
```bash
# Step 1: adapter trimming
bbduk.sh in1=ERR594369_1.fastq.gz in2=ERR594369_2.fastq.gz \
  out1=ERR594369_1_t.fastq.gz out2=ERR594369_2_t.fastq.gz \
  ref=/bbmap/resources/adapters.fa ktrim=r k=23 mink=11 hdist=1 tpe tbo

# Step 2: quality filtering
bbduk.sh in1=ERR594369_1_t.fastq.gz in2=ERR594369_2_t.fastq.gz \
  qtrim=rl trimq=10 out1=ERR594369_1_t_qc.fastq.gz out2=ERR594369_2_t_qc.fastq.gz
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -t 1:00:00
#SBATCH -n 8
#SBATCH -J bbduk

# activate your conda environment here

workDir="<your_project_dir>"
cd $workDir

# Step 1: adapter trimming
bbduk.sh in1=ERR594369_1.fastq.gz in2=ERR594369_2.fastq.gz \
  out1=ERR594369_1_t.fastq.gz out2=ERR594369_2_t.fastq.gz \
  ref=/bbmap/resources/adapters.fa ktrim=r k=23 mink=11 hdist=1 tpe tbo

# Step 2: quality filtering
bbduk.sh in1=ERR594369_1_t.fastq.gz in2=ERR594369_2_t.fastq.gz \
  qtrim=rl trimq=10 out1=ERR594369_1_t_qc.fastq.gz out2=ERR594369_2_t_qc.fastq.gz
```
{% endcodetabs %}

Expected output for Step 1:

```
Input:    74303174 reads  7164049847 bases.
KTrimmed: 480321 reads (0.65%)  11406582 bases (0.16%)
Result:   74299876 reads (100.00%)  7151259854 bases (99.82%)

real	17m35.086s
```

Expected output for Step 2:

```
Input:    74299876 reads  7151259854 bases.
QTrimmed: 238190 reads (0.32%)  2587818 bases (0.04%)
Result:   74296524 reads (100.00%)  7148672036 bases (99.96%)

real	8m55.146s
```

Now, let's do the same two commands in one:

```bash
bbduk.sh in1=ERR594369_1.fastq.gz in2=ERR594369_2.fastq.gz \
  out1=ERR594369_1_t_qc.fastq.gz out2=ERR594369_2_t_qc.fastq.gz \
  ref=/bbmap/resources/adapters.fa qtrim=rl trimq=10 ktrim=r k=23 mink=11 hdist=1 tpe tbo
```

## How does the quality check out?

Here, I'm going to run FastQC on all of the input files (2), the results from Trimmomatic (4) and the adapter trimmed (2) and quality filtered (2) read *pairs* of BBDuk.

```bash
fastqc ERR594369_1.fastq.gz ERR594369_2.fastq.gz \
  ERR594369_1_t.fastq.gz ERR594369_2_t.fastq.gz \
  ERR594369_1_t_qc.fastq.gz ERR594369_2_t_qc.fastq.gz \
  ERR594369_1_t_paired.fastq.gz ERR594369_1_t_unpaired.fastq.gz \
  ERR594369_2_t_paired.fastq.gz ERR594369_2_t_unpaired.fastq.gz
```

FastQC will process each file individually and deposit the results in `<filename>_fastqc.zip` and `<filename>_fastqc.html`. On 10 files, this took ~33 minutes.

Next, we'll want to visually summarize these results using MultiQC. I'm running MultiQC in the directory with all the FastQC results, so I'm using '.' to specify 'the current directory'.

```bash
multiqc .
```

Expected output:

```
[INFO   ]         multiqc : Searching '.'
[INFO   ]          fastqc : Found 10 reports
[INFO   ]         multiqc : Report      : multiqc_report.html
[INFO   ]         multiqc : Data        : multiqc_data
[INFO   ]         multiqc : MultiQC complete

real	0m7.186s
```

```bash
$ ls -lh
# Original input data
ERR594369_1_fastqc.zip
ERR594369_2_fastqc.zip
# Trimmomatic results. Paired reads surviving (2) + unpaired reads (mate pair didn't make it) surviving (2)
ERR594369_1_t_paired_fastqc.zip
ERR594369_1_t_unpaired_fastqc.zip
ERR594369_2_t_paired_fastqc.zip
ERR594369_2_t_unpaired_fastqc.zip
# BBDuk adapter trimming results. BBDuk will only return paired reads with the parameters we specified
ERR594369_1_t_fastqc.zip
ERR594369_2_t_fastqc.zip
# BBDuk quality trimming results, using the trimming results (above) as input
ERR594369_1_t_qc_fastqc.zip
ERR594369_2_t_qc_fastqc.zip
# MultiQC report and data
multiqc_report.html
multiqc_data
```

I've added comments to the command (above). *Normally*, this would NOT be in the output, but I'm commenting here to break down what files came from where.

## See also

- [FastQC tool guide](/docs/tools/fastqc/)
- [MultiQC tool guide](/docs/tools/multiqc/)
- [BBDuk tool guide](/docs/tools/bbduk/)
- [Trimmomatic tool guide](/docs/tools/trimmomatic/placeholder/)
