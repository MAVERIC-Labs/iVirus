---
title: Prodigal
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/prodigal/
---

Prodigal is the standard gene caller used upstream of virtually every viral annotation and taxonomy pipeline — it predicts protein-coding genes on assembled contigs quickly and accurately without requiring a training set.

## Install

```bash
conda install -c bioconda -c conda-forge prodigal -y
```

## Basic usage

For metagenomic contigs, always use `-p anon` (anonymous mode — skips genome-specific training and works across mixed taxa):

```bash
prodigal -i VS2-SOP/final-viral-scored.fa \
  -p anon \
  -a Prodigal_output/VirSorter2_genomes.faa \
  -o Prodigal_output/VirSorter2_genomes.prodigal
```

## Key flags

| Flag | Description |
|------|-------------|
| `-i` | Input FASTA file (contigs or scaffolds) |
| `-o` | Output gene coordinate file (GenBank format by default) |
| `-a` | Output predicted protein sequences (FASTA) — required by vConTACT2, DIAMOND, etc. |
| `-d` | Output predicted nucleotide gene sequences (FASTA) |
| `-p` | Procedure: `anon` for metagenomes, `single` for isolated genomes |
| `-f` | Output format: `gbk` (default), `gff`, or `sco` |

## Output

- **`proteins.faa`** — predicted protein sequences; the primary input for [vConTACT2]({{ '/docs/tools/vcontact2/' | url }}), [DIAMOND]({{ '/docs/tools/diamond/placeholder/' | url }}), and most downstream annotation tools.
- **`coords.gbk`** — gene coordinates in GenBank format; useful for genome browsers and annotation pipelines.

<!-- screenshot: /assets/img/tools/screenshots/prodigal.png -->

## In the iVirus workflow

Prodigal sits in the Gene Calling step, immediately after viral contigs have been quality-checked with [CheckV]({{ '/docs/tools/checkv/' | url }}). Its `proteins.faa` output is required by [vConTACT2]({{ '/docs/tools/vcontact2/' | url }}) for taxonomy and feeds into [DRAM-v]({{ '/docs/tools/dram-v/' | url }}) for annotation. Always use `-p anon` for metagenomic assemblies.

See also:
- **Workflow step:** [Gene Calling]({{ '/docs/workflows/viral-identification/' | url }})
- **Downstream tools:** [vConTACT2]({{ '/docs/tools/vcontact2/' | url }}), [DRAM-v]({{ '/docs/tools/dram-v/' | url }}), [VIBRANT]({{ '/docs/tools/vibrant/' | url }})
- **Tool catalogue:** [/tools/]({{ '/tools/' | url }})
