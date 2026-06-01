---
title: CheckV
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/checkv/
---

CheckV quality-assesses metagenome-assembled viral genomes, trims host contamination from integrated proviruses, and assigns each contig to a completeness tier — Complete, High-quality (>90%), Medium-quality (50–90%), Low-quality (<50%), or Undetermined — providing an essential quality gate before annotation and taxonomy.

## Install

```bash
conda create -n checkv -c bioconda -c conda-forge checkv -y
conda activate checkv
# Download the reference database (required before first run)
checkv download_database ./checkv-db
```

## Basic usage

```bash
checkv end_to_end vs2_pass1/final-viral-combined.fa checkv_out/ -t 40
```

## Key flags

| Flag | Description |
|------|-------------|
| `end_to_end` | Run the complete pipeline (contamination detection → completeness → quality summary) |
| `-t` | Number of CPU threads |
| `-d` | Path to the CheckV database directory |
| `--remove_tmp` | Delete large intermediate alignment files after the run to save disk space |

## Output

- **`quality_summary.tsv`** — per-contig quality tier, estimated completeness, contamination percentage, and contig length; the primary file for filtering decisions.
- **`viruses.fna`** — FASTA of clean viral contigs (non-proviral sequences).
- **`proviruses.fna`** — FASTA of proviral regions trimmed to viral coordinates.
- **`contamination.tsv`** — detailed host-region boundaries for each flagged contig.

<!-- screenshot: /assets/img/tools/screenshots/checkv.png -->

## Deduplication / clustering (optional)

CheckV ships with a built-in clustering script (`anicalc.py` / `aniclust.py`) for deduplicating viral contigs across multiple samples before downstream analysis. This is particularly useful when merging results from several metagenomes:

```bash
# Calculate pairwise ANI between contigs
checkv anicalc.py -i all_viruses.fna -o ani.tsv --threads 16

# Cluster at 95% ANI / 85% query coverage (species-level)
checkv aniclust.py --viral_seqs all_viruses.fna \
  --ani ani.tsv --out clusters.tsv \
  --min_ani 95 --min_qcov 85 --min_tcov 0
```

Output: `clusters.tsv` lists representative sequences and their cluster members. Use the representatives as a non-redundant viral sequence set.

## In the iVirus workflow

CheckV is run immediately after viral identification with [VirSorter2](/docs/tools/virsorter2/) or [VIBRANT](/docs/tools/vibrant/). The `viruses.fna` and `proviruses.fna` outputs, filtered to high-quality sequences from `quality_summary.tsv`, serve as inputs to functional annotation ([DRAM-v](/docs/tools/dram-v/)), taxonomy ([vConTACT2](/docs/tools/vcontact2/)), and host prediction ([iPHoP](/docs/tools/iphop/)).

See also:
- **Workflow step:** [Viral Identification](/docs/workflows/viral-identification/)
- [VirSorter2](/docs/tools/virsorter2/)
- [VIBRANT](/docs/tools/vibrant/)
- [DRAM-v](/docs/tools/dram-v/)
- [iPHoP](/docs/tools/iphop/)
