---
title: FastQC
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/fastqc/
---

FastQC generates per-sample quality control reports for FASTQ reads, helping you detect low-quality bases, adapter contamination, and GC bias before any downstream assembly or analysis.

## Install

```bash
conda install -c bioconda -c conda-forge fastqc -y
```

## Basic usage

```bash
fastqc ERR594369_1.fastq.gz ERR594369_2.fastq.gz -o qc_reports/ -t 8
```

> **Note:** You can pass multiple files in one command. In a full workflow, run FastQC on your raw reads AND trimmed reads to compare.

## Key flags

| Flag | Description |
|------|-------------|
| `-o` / `--outdir` | Directory for output reports |
| `-t` / `--threads` | Number of CPU threads (one per file) |
| `--extract` | Unzip the results directory after creation |
| `--nogroup` | Disable grouping of bases for reads >50 bp |
| `-a` / `--adapters` | Custom adapter sequences file |

## Output

- **`{sample}_fastqc.html`** — interactive HTML report with per-base quality scores, GC content distribution, sequence duplication levels, and adapter content plots.
- **`{sample}_fastqc.zip`** — archive containing the raw per-base quality data and summary statistics, useful for aggregating with MultiQC.

Key sections to review: *Per base sequence quality* (watch for quality drops at the 3′ end), *Adapter Content* (confirm adapters were trimmed), and *Overrepresented sequences* (flag potential contamination).

<!-- screenshot: /assets/img/tools/screenshots/fastqc.png -->

## In the iVirus workflow

FastQC is the first step in the QC & Trim stage. Run it on raw reads before trimming (e.g., with Trimmomatic or fastp) and again on trimmed reads to confirm adapter removal. Clean, high-quality reads feed directly into [SPAdes](/docs/tools/spades/) or [MEGAHIT](/docs/tools/megahit/) for assembly.

See also:
- **Workflow step:** [QC & Trim](/docs/workflows/qc-trim/)
- **Tool catalogue:** [/tools/](/docs/tools/)
