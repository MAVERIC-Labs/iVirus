---
title: VirSorter2
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/virsorter2/
---

VirSorter2 is a multi-classifier, expert-guided pipeline for identifying viral sequences in metagenomic and genomic assemblies. Unlike the original VirSorter, it supports diverse viral groups — dsDNA phages, ssDNA viruses, RNA viruses, NCLDVs, and virophages (Lavidaviridae) — each with its own trained classifier.

## Install

```bash
mamba create -n vs2 -c conda-forge -c bioconda virsorter=2 -y
mamba activate vs2
```

## Database setup

Run once, before first use (~10 minutes):

```bash
virsorter setup -d db -j 4
```

If the automatic download fails, fetch the database manually and point VirSorter2 at it:

```bash
# download db.tgz from https://osf.io/v46sc/download, then:
tar -xzf db.tgz
virsorter config --init-source --db-dir=./db
```

## Basic usage

The iVirus SOP runs VirSorter2 in **two passes**, with [CheckV]({{ '/docs/tools/checkv/' | url }}) in between to trim proviruses before final scoring — see the [Viral Identification workflow]({{ '/docs/workflows/viral-identification/' | url }}) for the full two-pass procedure. Pass 1:

```bash
virsorter run \
  -i contigs.fasta \
  -w vs2_pass1/ \
  --include-groups dsDNAphage,ssDNA \
  --min-length 5000 \
  --min-score 0.5 \
  --keep-original-seq \
  -j 16 all
```

Pass 2, on CheckV-trimmed sequences, adds `--prep-for-dramv` to generate [DRAM-v]({{ '/docs/tools/dram-v/' | url }})-compatible output:

```bash
virsorter run \
  -i checkv_out/combined.fna \
  -w vs2_pass2/ \
  --include-groups dsDNAphage,ssDNA \
  --min-length 5000 \
  --min-score 0.5 \
  --prep-for-dramv \
  -j 16 all
```

## Key flags

| Flag | Description |
|------|-------------|
| `-i` | Input contig/genome FASTA file |
| `-w` | Working/output directory |
| `--include-groups` | Viral groups to classify: `dsDNAphage`, `ssDNA`, `RNA`, `NCLDV`, `lavidaviridae` (default: `dsDNAphage,ssDNA`) |
| `--min-length` | Minimum sequence length to consider |
| `--min-score` | Minimum classifier score to keep a hit (0-1; 0.5 is the iVirus default) |
| `--keep-original-seq` | Preserve untrimmed full sequences alongside trimmed viral regions |
| `--provirus-off` | Skip provirus boundary detection for faster runs |
| `--prep-for-dramv` | Generate `viral-affi-contigs-for-dramv.tab` and other DRAM-v-ready inputs |
| `-j` | Number of parallel jobs |

## Output

- **`final-viral-combined.fa`** — identified viral sequences, suffixed by type: `||full` (complete viral signal), `||{i}_partial` (proviral region), `||lt2gene` (short, <2 genes, but hallmark-gene-supported)
- **`final-viral-score.tsv`** — per-sequence classifier scores by viral group, max score, max-score group, contig length, hallmark gene count, and viral/nonviral gene percentages
- **`final-viral-boundary.tsv`** — intermediate boundary coordinates, ORF indices, scores, and hallmark gene counts used to trim proviruses

> **Note:** VirSorter (v1) is still documented separately for existing pipelines, but VirSorter2 is the recommended tool for new projects — it covers more viral groups and integrates directly with CheckV and DRAM-v.

<!-- screenshot: /assets/img/tools/screenshots/virsorter2.png -->

## In the iVirus workflow

VirSorter2 runs the Viral Identification step twice, sandwiching [CheckV]({{ '/docs/tools/checkv/' | url }}) quality assessment in between (Pass 1 → CheckV → Pass 2 → DRAM-v). It accepts contigs from [SPAdes]({{ '/docs/tools/spades/' | url }}) or [MEGAHIT]({{ '/docs/tools/megahit/' | url }}), and its Pass 2 output — prepped with `--prep-for-dramv` — feeds directly into [DRAM-v]({{ '/docs/tools/dram-v/' | url }}) for functional annotation and then [vConTACT2]({{ '/docs/tools/vcontact2/' | url }}) for taxonomy.

See also:
- **Workflow step:** [Viral Identification]({{ '/docs/workflows/viral-identification/' | url }})
- **Protocol:** [Viral sequence identification SOP with VirSorter2](https://www.protocols.io/view/viral-sequence-identification-sop-with-virsorter2-5qpvoyqebg4x/v3)
- [CheckV]({{ '/docs/tools/checkv/' | url }})
- [DRAM-v]({{ '/docs/tools/dram-v/' | url }})
- **Tool catalogue:** [/tools/]({{ '/tools/' | url }})
