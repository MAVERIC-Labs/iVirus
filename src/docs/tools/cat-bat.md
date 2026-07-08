---
title: CAT / BAT
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/cat-bat/
---

CAT (Contig Annotation Tool) and BAT (Bin Annotation Tool) assign taxonomic classifications to metagenomic contigs and bins by combining ORF prediction, DIAMOND protein alignment, and LCA-based classification across the full NCBI taxonomy.

> **Version note:** CAT version 4.x+ is strongly preferred over the older 1.x release — it is superior in accuracy and database handling. Ensure you are using version 4.3.3 or later, as the older version produces significantly lower-quality results.

## Install

```bash
conda install -c bioconda -c conda-forge cat -y
```

CAT and BAT also require a prepared DIAMOND database and NCBI taxonomy files. Download and prepare these with:

```bash
CAT download -o CAT_prepare/
CAT prepare -d CAT_prepare/ --db_fasta CAT_prepare/2024-01-01_CAT_database.tar.gz --taxonomy_folder CAT_prepare/taxonomy
```

## Basic usage

```bash
CAT contigs \
  -c contigs.fa \
  -d CAT_database/ \
  -t CAT_taxonomy/ \
  --out_prefix CAT_out \
  --force
```

For bins (MAGs or vMAGs):

```bash
BAT bins \
  -b bins/ \
  -d CAT_database/ \
  -t CAT_taxonomy/ \
  --out_prefix BAT_out
```

## Key flags

| Flag | Description |
|------|-------------|
| `-c` | Input contig FASTA file (CAT) |
| `-b` | Directory of bin FASTA files (BAT) |
| `-d` | Path to the DIAMOND protein database directory |
| `-t` | Path to the NCBI taxonomy directory |
| `--out_prefix` | Prefix for all output files |
| `--top` | Number of top alignments to consider for LCA (default: 50) |
| `--I_know_what_Im_doing` | Bypass sanity checks (useful in pipelines) |

## Output

- **`CAT_out.contig2classification.txt`** — per-contig taxonomic classification with lineage and score columns; primary output for downstream analysis.
- **`CAT_out.ORF2LCA.txt`** — per-ORF LCA assignments used to derive contig-level classifications.
- **`CAT_out.log`** — run log with alignment statistics and classification summary.

Use `CAT add_names` to replace NCBI taxon IDs with human-readable names in the output.

<!-- screenshot: /assets/img/tools/screenshots/cat-bat.png -->

## In the iVirus workflow

CAT/BAT runs in the Taxonomy step as a complementary approach to [vConTACT2]({{ '/docs/tools/vcontact2/' | url }}). While vConTACT2 focuses on genus-level clustering by gene-sharing networks, CAT provides NCBI taxonomy lineages for individual contigs, which is useful for rapid broad-level classification and contamination screening. Input contigs typically come from [VIBRANT]({{ '/docs/tools/vibrant/' | url }}) or [VirSorter]({{ '/docs/tools/virsorter/' | url }}).

See also:
- **Workflow step:** [Taxonomy]({{ '/docs/workflows/taxonomy/' | url }})
- **Tool catalogue:** [/tools/]({{ '/docs/tools/' | url }})
