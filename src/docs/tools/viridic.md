---
title: VIRIDIC
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/viridic/
---

VIRIDIC calculates pairwise intergenomic similarity between phage genomes using BLAST, producing percent identity matrices that enable clustering of viruses into ICTV-compliant genus-level (>70% similarity) and species-level (>95% similarity) groups based on nucleotide identity.

## Install

VIRIDIC is distributed as a bash script requiring BLAST+ and R. Clone the repository or run via Docker (recommended for reproducibility):

```bash
# Option 1 — clone and run locally (requires BLAST+ and R in PATH)
git clone https://github.com/adriaanvdv/VIRIDIC && cd VIRIDIC

# Option 2 — Docker (no local dependencies needed)
docker run -v $(pwd):/work replikation/viridic \
  ./viridic.bash projdir=/work/out in=/work/input.fasta
```

## Basic usage

```bash
./viridic.bash projdir=viridic_out/ in=viral_genomes.fasta
```

## Key flags

| Flag | Description |
|------|-------------|
| `projdir=` | Output directory for all results |
| `in=` | Input multi-FASTA file of viral genome sequences |
| `sim_threshold_species=` | Similarity cutoff for species-level clustering (default: 95) |
| `sim_threshold_genus=` | Similarity cutoff for genus-level clustering (default: 70) |
| `ncbi_tax=` | Path to NCBI taxonomy files to annotate clusters with known taxon names |

## Output

- **`clustering.csv`** — species- and genus-level cluster assignments for each input genome.
- **`intergenomic_similarities.csv`** — full pairwise similarity matrix.
- Heatmap PDF visualizing the similarity matrix.
- Dendrogram PDF showing hierarchical clustering of genomes.

<!-- screenshot: /assets/img/tools/screenshots/viridic.png -->

## In the iVirus workflow

VIRIDIC is applied in the Taxonomy step on viral contigs that pass the [CheckV]({{ '/docs/tools/checkv/' | url }}) quality filter. It provides nucleotide-identity-based genus and species boundaries that complement [vConTACT2]({{ '/docs/tools/vcontact2/' | url }}), which uses protein-sharing networks — running both tools together gives a more complete taxonomic picture, particularly for genomes with limited reference coverage.

See also:
- **Workflow step:** [Taxonomy]({{ '/docs/workflows/taxonomy/' | url }})
- [vConTACT2]({{ '/docs/tools/vcontact2/' | url }})
- [CheckV]({{ '/docs/tools/checkv/' | url }})
