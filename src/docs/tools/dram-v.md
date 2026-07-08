---
title: DRAM-v
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/dram-v/
---

DRAM-v (Distilled and Refined Annotation of Metabolism for Viruses) annotates viral genomes against multiple databases and distills the results into a curated summary of auxiliary metabolic genes (AMGs) and their potential ecological roles.

## Install

```bash
conda create -n dram -c bioconda -c conda-forge dram -y
conda activate dram
# Set up databases on first use (requires ~500 GB; see DRAM docs)
DRAM-setup.py prepare_databases --output_dir /path/to/dram_dbs
```

## Basic usage

DRAM-v is a two-step process: annotate then distill.

```bash
# Step 1: annotate
DRAM-v.py annotate \
  -i vs2_pass2/for-dramv/final-viral-combined-for-dramv.fa \
  -v vs2_pass2/for-dramv/viral-affi-contigs-for-dramv.tab \
  -o DRAMv-annotate/ \
  --skip_trnascan --threads 40 --min_contig_size 1000

# Step 2: distill
DRAM-v.py distill \
  -i DRAMv-annotate/annotations.tsv \
  -o DRAMv-distill/
```

## Key flags

| Flag | Description |
|------|-------------|
| `-i` | Input viral contig FASTA (annotate) or annotations TSV (distill) |
| `-o` | Output directory |
| `--threads` | Number of CPU threads (annotate step) |
| `--min_contig_size` | Minimum contig length to annotate (default: 2500 bp) |
| `--bit_score_threshold` | Minimum DIAMOND bit score for database hits |
| `--skip_uniref` | Skip UniRef90 annotation for faster (less sensitive) results |
| `--virsorter_affi_contigs` | Path to VirSorter 1 `affi-contigs.tab` file (for VirSorter 1 integration only; not needed with VirSorter2 or VIBRANT input) |

## Output

- **`annotations.tsv`** — per-gene annotation table with hits against KEGG, Pfam, VOG, and other databases.
- **`distillate.xlsx`** — distilled AMG summary organized by metabolic category (carbon, nitrogen, sulfur cycling, etc.); primary deliverable for ecological interpretation.
- **`product.html`** — interactive HTML heatmap showing AMG categories across viral contigs; useful for presentations and quick visual summaries.

<!-- screenshot: /assets/img/tools/screenshots/dram-v.png -->

## In the iVirus workflow

> **Note:** If your viral contigs came from VirSorter 1, pass the `affi-contigs.tab` file via `--virsorter_affi_contigs` to improve AMG scoring. This flag is not required when using VirSorter2 or VIBRANT output.

DRAM-v is the primary tool in the Annotation step, accepting viral contigs identified by [VIBRANT]({{ '/docs/tools/vibrant/' | url }}) or [VirSorter]({{ '/docs/tools/virsorter/' | url }}). AMG results from the distillate complement [VIBRANT]({{ '/docs/tools/vibrant/' | url }})'s own AMG table and inform ecological interpretation. Annotated gene products also provide protein sets that can feed into [vConTACT2]({{ '/docs/tools/vcontact2/' | url }}) for taxonomy.

See also:
- **Workflow step:** [Annotation]({{ '/docs/workflows/annotation/' | url }})
- **Tool catalogue:** [/tools/]({{ '/docs/tools/' | url }})
