---
title: iPHoP
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/iphop/
---

iPHoP (integrated Phage Host Prediction) combines CRISPR spacer matches, sequence similarity, and k-mer-based signals from multiple prediction tools into a single integrated confidence score, providing genus-level host predictions for archaeal and bacterial viruses from metagenome-assembled genomes.

## Install

```bash
conda create -n iphop -c bioconda -c conda-forge iphop -y
conda activate iphop
# Download the reference database (~100 GB — run once)
iphop download --split_outp iphop_db/ --db_dir iphop_db/
```

## Basic usage

```bash
iphop predict --fa_file viral_contigs.fna --db_dir iphop_db/ --out_dir iphop_out/ -t 16
```

## Key flags

| Flag | Description |
|------|-------------|
| `--fa_file` | Input FASTA file of viral contigs |
| `--db_dir` | Path to the downloaded iPHoP reference database |
| `--out_dir` | Output directory |
| `-t` | Number of CPU threads |
| `--min_score` | Minimum confidence score threshold for reporting predictions (default: 90) |
| `--db_info_file` | Metadata file for a custom host genome database (advanced use) |

## Output

- **`Host_prediction_to_genus_m90.csv`** — primary output: per-phage predicted host genus, confidence score, and list of supporting tool signals.
- **`Detailed_output_by_tool.csv`** — per-tool breakdown of individual prediction scores enabling review of which signals drove each call.

<!-- screenshot: /assets/img/tools/screenshots/iphop.png -->

## In the iVirus workflow

iPHoP is the recommended host-prediction tool in the iVirus pipeline, superseding [WIsH](/docs/tools/wish/) and [HostPhinder](/docs/tools/hostphinder/) for most use cases due to its integration of multiple signal types and higher accuracy. It requires [CheckV](/docs/tools/checkv/)-filtered, high-quality viral genomes as input — low-quality or heavily fragmented contigs reduce prediction confidence.

See also:
- **Workflow step:** [Host Prediction](/docs/workflows/host-prediction/)
- [CheckV](/docs/tools/checkv/)
- [WIsH](/docs/tools/wish/)
- [HostPhinder](/docs/tools/hostphinder/)
