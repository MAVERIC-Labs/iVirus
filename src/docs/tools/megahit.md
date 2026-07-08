---
title: MEGAHIT
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/megahit/
---

MEGAHIT is an ultra-fast, low-memory metagenomic assembler that uses a succinct de Bruijn graph approach, making it the practical choice when sample complexity or memory constraints make SPAdes impractical.

## Install

```bash
conda install -c bioconda -c conda-forge megahit -y
```

## Basic usage

```bash
megahit --k-list 21,41,61,81,99 \
  -1 ERR594369_1_t_paired.fastq.gz \
  -2 ERR594369_2_t_paired.fastq.gz \
  -t 48 -m 0.9 \
  -o MEGAHIT_with_Trimmomatic
```

## Key flags

| Flag | Description |
|------|-------------|
| `-t` / `--num-cpu-threads` | Number of CPU threads |
| `--min-contig-len` | Minimum contig length to retain (default: 200 bp) |
| `--k-min` | Minimum k-mer size (default: 21) |
| `--k-max` | Maximum k-mer size (default: 141) |
| `--k-step` | Step between k-mer sizes (default: 12) |
| `--presets` | Shortcut k-mer profiles: `meta-sensitive` (default) or `meta-large` (complex soils/oceans) |
| `-m` | Memory fraction to use (e.g. `0.9` = 90% of available RAM) |

## Output

- **`final.contigs.fa`** — the assembled contigs; this is the primary input for downstream viral identification and annotation steps.
- **`log`** — assembly log with k-mer iteration details and contig statistics.

The output directory also contains intermediate files from each k-mer iteration; these can be deleted after the run to save disk space.

<!-- screenshot: /assets/img/tools/screenshots/megahit.png -->

## In the iVirus workflow

MEGAHIT sits in the Assembly step alongside [SPAdes]({{ '/docs/tools/spades/' | url }}). It accepts quality-trimmed reads and produces `final.contigs.fa`, which feeds directly into viral identification ([VIBRANT]({{ '/docs/tools/vibrant/' | url }}), [VirSorter]({{ '/docs/tools/virsorter/' | url }})) and annotation ([DRAM-v]({{ '/docs/tools/dram-v/' | url }}), [VIGA]({{ '/docs/tools/viga/' | url }})). Prefer MEGAHIT when working with very large datasets (>50 M read pairs) or on systems with limited RAM.

See also:
- **Workflow step:** [Assembly]({{ '/docs/workflows/assembly/' | url }})
- **Tool catalogue:** [/tools/]({{ '/docs/tools/' | url }})
