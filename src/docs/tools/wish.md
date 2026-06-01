---
title: WIsH
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/wish/
---

WIsH (Who Is the Host) predicts bacterial hosts for phages using variable-order Markov chain models built from host genome sequences, enabling host range inference for uncultivated viruses without relying on homology.

## Install

```bash
conda install -c bioconda -c conda-forge wish -y
```

## Basic usage

WIsH is a two-step process: build Markov models from candidate host genomes, then predict hosts for your phages.

```bash
# Step 1: build host models
WIsH -c build -g host_genomes/ -m models/

# Step 2: predict hosts
WIsH -c predict \
  -g phage_genomes/ \
  -m models/ \
  -r predictions/ \
  -t 16
```

`host_genomes/` and `phage_genomes/` should each contain one FASTA file per genome/contig. Single-contig FASTA files work best.

## Key flags

| Flag | Description |
|------|-------------|
| `-c` | Command: `build` (train host models) or `predict` (score phages against models) |
| `-g` | Directory of genome FASTA files (hosts for build; phages for predict) |
| `-m` | Directory for storing or loading Markov chain model files |
| `-r` | Output directory for prediction results |
| `-t` | Number of threads |
| `-k` | Markov chain order (default: 8; higher = more specific) |

## Output

- **`llikelihood.matrix`** — matrix of log-likelihood scores for every phage–host pair; lower (more negative) scores indicate better model fit.
- **`prediction.list`** — ranked list of the top predicted host per phage with the best log-likelihood score.

Post-processing tip: filter predictions by a log-likelihood threshold established from a validation set; WIsH performs best when candidate hosts span the likely taxonomic range of true hosts.

<!-- screenshot: /assets/img/tools/screenshots/wish.png -->

## In the iVirus workflow

WIsH runs in the Host Prediction step, taking viral contigs from [VIBRANT](/docs/tools/vibrant/) or [VirSorter](/docs/tools/virsorter/) as phage input and assembled/reference bacterial genomes as host candidates. Its Markov-chain approach is complementary to alignment-based methods like [HostPhinder](/docs/tools/hostphinder/), and running both provides higher-confidence host assignments.

See also:
- **Workflow step:** [Host Prediction](/docs/workflows/host-prediction/)
- **Tool catalogue:** [/tools/](/docs/tools/)
