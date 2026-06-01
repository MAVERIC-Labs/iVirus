---
title: VIBRANT
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/vibrant/
---

VIBRANT recovers and annotates bacterial and archaeal viruses from metagenomic assemblies using neural networks of protein annotation signatures and genomic features. It identifies highly diverse partial or complete viral genomes, excises integrated proviruses, assesses genome completeness, and characterizes virome function including auxiliary metabolic genes (AMGs).

## Install

```bash
conda create -n vibrant -c bioconda -c conda-forge vibrant -y
conda activate vibrant
# Download databases on first use
download-db.sh
```

## Basic usage

```bash
VIBRANT_run.py -i contigs.fa -t 16 -folder vibrant_out
```

## Key flags

| Flag | Description |
|------|-------------|
| `-i` | Input contig FASTA file |
| `-t` | Number of CPU threads |
| `-folder` | Output folder path |
| `-d` | Path to custom VIBRANT database directory (if not using the default) |
| `--virome` | Use when input is already a virome/enriched viral fraction (adjusts sensitivity thresholds) |
| `-m` | Minimum contig length to evaluate (default: 1000 bp) |

## Output

- **`VIBRANT_phages_*.fna`** — FASTA file of predicted viral contigs; use this as input to annotation and taxonomy tools.
- **`VIBRANT_annotations_*.tsv`** — per-protein functional annotations against KEGG, Pfam, and VOG databases.
- **`VIBRANT_AMG_*.tsv`** — auxiliary metabolic genes identified within viral genomes, including KEGG pathway assignments.
- **`VIBRANT_summary_results_*.tsv`** — per-contig quality and completeness summary.

<!-- screenshot: /assets/img/tools/screenshots/vibrant.png -->

## In the iVirus workflow

VIBRANT is a primary tool in the Viral Identification step, taking assembled contigs from [SPAdes](/docs/tools/spades/) or [MEGAHIT](/docs/tools/megahit/) as input. Its viral contig output (`VIBRANT_phages_*.fna`) feeds directly into annotation tools ([DRAM-v](/docs/tools/dram-v/), [VIGA](/docs/tools/viga/)) and taxonomy tools ([vConTACT2](/docs/tools/vcontact2/)). AMG output can be analyzed in parallel with [DRAM-v](/docs/tools/dram-v/) distillate results for metabolic impact assessment. [VirSorter](/docs/tools/virsorter/) is a complementary identification tool that can be run alongside VIBRANT for consensus calling.

See also:
- **Workflow step:** [Viral Identification](/docs/workflows/viral-identification/)
- **Tool catalogue:** [/tools/](/docs/tools/)
