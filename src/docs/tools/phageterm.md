---
title: PhageTerm
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/phageterm/
---

PhageTerm determines phage genome termini and packaging mechanisms (5' cos, 3' cos, pac/headful, DTR/ITR) from short-read coverage patterns at genome ends, enabling correct circularization, reorientation, and complete assembly of phage genomes prior to annotation.

## Install

```bash
conda install -c bioconda phageterm -y
```

> **Version note:** PhageTerm has been substantially revised across versions (1.x, 3.x, 4.x). Confirm which version is available in your environment, as command syntax and output formats differ between major versions.

## Basic usage

```bash
PhageTerm.py -f reads.fastq -r phage_genome.fasta -p phage_sample_name
```

## Key flags

| Flag | Description |
|------|-------------|
| `-f` | Input reads FASTQ (single-end preferred; paired reads can be concatenated) |
| `-r` | Reference phage genome FASTA to map reads against |
| `-p` | Project/sample name used as the prefix for all output files |
| `-c` | Number of CPU cores for read mapping |
| `-s` | Seed length for the initial mapping step (default: 20) |
| `--report_title` | Custom title string embedded in the PDF report |

## Output

- **`*_PhageTerm_report.pdf`** — detailed packaging mechanism report with read-coverage plots at genome ends and terminus classification.
- **`*_terminome_res.csv`** — terminus coordinates, packaging type, and supporting statistics.
- **`*_DTR.fasta`** or **`*_Packaged_genome.fasta`** — genome reoriented to the packaging start site when termini are successfully resolved.

<!-- screenshot: /assets/img/tools/screenshots/phageterm.png -->

## In the iVirus workflow

PhageTerm is most valuable in the Annotation step when working with well-assembled or isolated phage genomes rather than highly fragmented metagenomic contigs. Run it before annotation tools such as [VIGA](/docs/tools/viga/), [Prokka](/docs/tools/prokka/), or [DRAM-v](/docs/tools/dram-v/) to ensure the genome is correctly oriented and terminally complete, which improves gene-calling accuracy at genome ends.

See also:
- **Workflow step:** [Annotation](/docs/workflows/annotation/)
- [VIGA](/docs/tools/viga/)
- [DRAM-v](/docs/tools/dram-v/)
