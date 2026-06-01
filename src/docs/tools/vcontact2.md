---
title: vConTACT2
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/vcontact2/
---

vConTACT2 clusters uncultivated prokaryotic viruses into genus-level groups by building a gene-sharing network and comparing them against reference databases, enabling taxonomic classification without relying on sequence alignment alone.

> **Scope:** vConTACT2 is designed and benchmarked for archaeal and bacterial viruses. It may produce unpredictable results for eukaryotic viruses and has not been validated for that use case.

## Install

```bash
conda create -n vcontact2 -c bioconda -c conda-forge vcontact2 -y
conda activate vcontact2
```

## Basic usage

vConTACT2 is a two-step process: first map genes to genomes, then run the network analysis.

```bash
# Step 1: generate gene-to-genome mapping
vcontact2_gene2genome \
  -p Prodigal_output/VirSorter2_genomes.faa \
  -o Prodigal_output/VirSorter2_proteins.csv \
  -s Prodigal-FAA

# Step 2: run network clustering
vcontact2 \
  --pcs-mode MCL \
  --vcs-mode ClusterONE \
  --threads 48 \
  --raw-proteins Prodigal_output/VirSorter2_genomes.faa \
  --rel-mode Diamond \
  --proteins-fp Prodigal_output/VirSorter2_proteins.csv \
  --db 'ProkaryoticViralRefSeq201-Merged' \
  --output-dir vConTACT2_output
```

`proteins.faa` should contain predicted proteins from your viral contigs (e.g., from Prodigal or from [VIBRANT](/docs/tools/vibrant/) output).

## Key flags

| Flag | Description |
|------|-------------|
| `--db` | Reference database (e.g., `ProkaryoticViralRefSeq211-Merged`) |
| `--rel-mode` | Protein comparison method (`Diamond` recommended for speed) |
| `--pcs-mode` | Protein cluster mode (`MCL` default) |
| `--vcs-mode` | Viral cluster mode (`ClusterONE` default) |
| `--c1-bin` | Path to ClusterONE jar if not on PATH |

## Output

- **`c1.ntw`** — gene-sharing network edge list; primary input for [Cytoscape](/docs/tools/cytoscape/) visualization.
- **`genome_by_genome_overview.csv`** — per-genome cluster assignments and reference genome co-clustering; key table for taxonomic interpretation.
- **`viral_cluster_overview.csv`** — summary of each viral cluster with member counts and reference genome affiliations.

Genomes co-clustering with ICTV-classified reference genomes inherit their genus-level taxonomy. Genomes in clusters with no references are novel genera.

> **Tip:** Load `c1.ntw` and `genome_by_genome_overview.csv` into [Cytoscape](/docs/tools/cytoscape/) for interactive network exploration.

<!-- screenshot: /assets/img/tools/screenshots/vcontact2.png -->

## In the iVirus workflow

vConTACT2 is the core tool in the Taxonomy step. It takes predicted proteins from viral contigs identified by [VIBRANT](/docs/tools/vibrant/) or [VirSorter](/docs/tools/virsorter/). Network output is visualized in [Cytoscape](/docs/tools/cytoscape/), and cluster assignments inform the abundance and ecology analyses.

See also:
- **Workflow step:** [Taxonomy](/docs/workflows/taxonomy/)
- **Visualization:** [Cytoscape](/docs/tools/cytoscape/)
- **Protocol:** [Running vConTACT2 on VirSorter output in CyVerse](https://dx.doi.org/10.17504/protocols.io.x5xfq7n)
- **Original method:** Bolduc et al., PeerJ (2017) — introduces the gene-sharing network concept
- **Tool catalogue:** [/tools/](/docs/tools/)
