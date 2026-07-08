---
title: PropagAtE
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/propagate/
---

PropagAtE (Prophage Activity Estimator) estimates whether integrated prophages are in lytic (actively replicating) or lysogenic (dormant) state by comparing the prophage:host read coverage ratio. It accepts VIBRANT output directly for prophage coordinates, and can take raw reads or pre-aligned SAM/BAM files.

## Install

```bash
conda install -c bioconda propagate -y
```

## Basic usage

```bash
PropagAtE -v vibrant_output/ -f R1.fastq.gz R2.fastq.gz -o propagate_out/
```

## Key flags

| Flag | Description |
|------|-------------|
| `-v` | Path to the VIBRANT output directory — PropagAtE reads prophage genomic coordinates directly from VIBRANT's output files |
| `-f` | Input reads (space-separated R1 and R2 FASTQ files) used to compute per-position coverage |
| `-o` | Output directory |
| `-t` | Number of CPU threads for read mapping |
| `--sam` / `--bam` | Provide pre-aligned SAM or BAM file instead of raw reads (skips mapping step) |

## Output

- **`*_PropagAtE_results.tsv`** — per-prophage table with coverage ratio (prophage vs. host), effect size, and an `active` / `dormant` classification for each integrated element.

<!-- screenshot: /assets/img/tools/screenshots/propagate.png -->

## In the iVirus workflow

PropagAtE is run after viral identification, and works directly with [VIBRANT]({{ '/docs/tools/vibrant/' | url }}) output — no manual coordinate extraction is required. Results add ecological context by revealing which proviruses are actively driving lytic cycles in the sampled community. Quality-filtered proviral sequences from [CheckV]({{ '/docs/tools/checkv/' | url }}) can be cross-referenced with PropagAtE activity calls to prioritize high-confidence active elements.

See also:
- **Workflow step:** [Viral Identification]({{ '/docs/workflows/viral-identification/' | url }})
- [VIBRANT]({{ '/docs/tools/vibrant/' | url }})
- [VirSorter]({{ '/docs/tools/virsorter/' | url }})
- [CheckV]({{ '/docs/tools/checkv/' | url }})
