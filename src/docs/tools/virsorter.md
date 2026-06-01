---
title: VirSorter
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/virsorter/
---

VirSorter (v1) detects viral signal in assembled metagenomic contigs using hallmark gene profiles and k-mer metrics derived from known phage and virome databases, assigning each contig to one of six confidence categories.

## Install

```bash
conda create -n virsorter -c bioconda -c conda-forge virsorter -y
conda activate virsorter
```

You will also need to download the VirSorter data directory (viromes/RefSeq databases) separately per the [VirSorter documentation](https://github.com/simroux/VirSorter).

## Basic usage

```bash
wrapper_phage_contigs_sorter_iPlant.pl \
  -f contigs.fa \
  --db 2 \
  --wdir virsorter_out \
  --ncpu 16 \
  --data-dir /path/to/virsorter-data
```

## Key flags

| Flag | Description |
|------|-------------|
| `-f` | Input contig FASTA file |
| `--db` | Database: `1` = RefSeq phage only, `2` = Viromes (recommended for environmental samples) |
| `--wdir` | Working/output directory |
| `--ncpu` | Number of CPU threads |
| `--data-dir` | Path to the VirSorter data directory (HMMs, databases) |

## Output

- **`VIRSorter_global-phage-signal.csv`** — main results table; each contig is assigned a category 1–3 (phage) or 4–6 (prophage), where 1/4 are most confident and 3/6 are uncertain.
- **`Predicted_viral_sequences/`** — FASTA files split by category for easy downstream filtering.
- **`Metrics_files/`** — per-contig gene tables and hallmark gene hits used to generate the categories.

Typical practice is to use categories 1–2 (phage) and 4–5 (prophage) as high-confidence predictions.

> **Note:** VirSorter2 is the recommended successor for new projects. This page covers the original VirSorter (v1), which remains in active use in published iVirus pipelines.

<!-- screenshot: /assets/img/tools/screenshots/virsorter.png -->

## In the iVirus workflow

VirSorter runs in the Viral Identification step alongside [VIBRANT](/docs/tools/vibrant/). It accepts contigs from [SPAdes](/docs/tools/spades/) or [MEGAHIT](/docs/tools/megahit/), and its category 1–2 / 4–5 contigs are combined with VIBRANT predictions for a consensus viral contig set. That set then enters annotation ([DRAM-v](/docs/tools/dram-v/)) and taxonomy ([vConTACT2](/docs/tools/vcontact2/)) steps.

See also:
- **Workflow step:** [Viral Identification](/docs/workflows/viral-identification/)
- **Protocol:** [VirSorter on CyVerse](https://dx.doi.org/10.17504/protocols.io.eyjbfun)
- **Tool catalogue:** [/tools/](/docs/tools/)
