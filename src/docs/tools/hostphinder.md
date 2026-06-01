---
title: HostPhinder
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/hostphinder/
---

HostPhinder predicts the host range of bacteriophages by computing k-mer similarity between phage genomes and a database of bacterial genomes, providing genus-level host predictions and confidence scores without requiring full sequence alignment.

## Install

HostPhinder is available as a standalone Python tool and is also accessible via CyVerse for web-based analysis.

```bash
git clone https://github.com/julvi/HostPhinder.git
cd HostPhinder
conda env create -f environment.yml -n hostphinder
conda activate hostphinder
```

For the CyVerse app, see the [iVirus app listing on CyVerse](https://de.cyverse.org).

## Basic usage

```bash
python hostphinder.py \
  -i phages.fasta \
  -o predictions.tsv
```

With a custom BLAST database:

```bash
python hostphinder.py \
  -i phages.fasta \
  -o predictions.tsv \
  -b /path/to/blast_db \
  -k 8
```

## Key flags

| Flag | Description |
|------|-------------|
| `-i` | Input phage genome FASTA file |
| `-o` | Output TSV file for predictions |
| `-b` | Path to a custom BLAST host database (overrides built-in) |
| `-k` | K-mer size for similarity computation (default: 8) |

## Output

- **`predictions.tsv`** — tab-separated file with one row per phage; columns include the predicted host genus, confidence score, and top database hits. Higher confidence scores indicate stronger k-mer similarity support.

Results are most reliable at the genus level. Species- or strain-level predictions should be treated as tentative unless confirmed by additional methods.

<!-- screenshot: /assets/img/tools/screenshots/hostphinder.png -->

## In the iVirus workflow

HostPhinder runs in the Host Prediction step alongside [WIsH](/docs/tools/wish/). It accepts viral contigs identified by [VIBRANT](/docs/tools/vibrant/) or [VirSorter](/docs/tools/virsorter/) and outputs host genus predictions that can be cross-referenced with [WIsH](/docs/tools/wish/) log-likelihood scores for consensus host assignments. HostPhinder's k-mer approach and WIsH's Markov models capture different signals, so combining both improves prediction reliability.

See also:
- **Workflow step:** [Host Prediction](/docs/workflows/host-prediction/)
- **Tool catalogue:** [/tools/](/docs/tools/)
