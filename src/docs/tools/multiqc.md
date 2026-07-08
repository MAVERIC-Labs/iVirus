---
title: MultiQC
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/multiqc/
---

MultiQC scans a directory of QC output files from tools such as FastQC, fastp, Trimmomatic, and aligners, then aggregates them into a single interactive HTML report — making it straightforward to compare quality metrics across dozens or hundreds of samples at once.

## Install

```bash
conda install -c bioconda -c conda-forge multiqc -y
```

## Basic usage

```bash
multiqc .
```

> **Note:** MultiQC searches the current directory (`.`) for any supported log files. Running it in your FastQC results directory will automatically pick up all reports. On 10 FastQC reports, MultiQC completes in under 10 seconds.

## Key flags

| Flag | Description |
|------|-------------|
| `-o` | Output directory for the report and data folder |
| `-n` | Custom report filename (default: `multiqc_report.html`) |
| `-f` | Force overwrite of an existing report in the output directory |
| `--ignore` | Glob pattern of files/directories to exclude from the search |
| `-d` | Prepend directory name to sample names — useful in multi-project runs where sample names would otherwise collide |

## Output

- **`multiqc_report.html`** — interactive HTML report with per-tool and per-sample panels; open in any browser.
- **`multiqc_data/`** — directory of parsed JSON and TSV files for each tool, suitable for downstream programmatic use.

<!-- screenshot: /assets/img/tools/screenshots/multiqc.png -->

## In the iVirus workflow

MultiQC is run at the end of the QC & Trim step to consolidate [FastQC]({{ '/docs/tools/fastqc/' | url }}), [fastp]({{ '/docs/tools/fastp/' | url }}), or [Trimmomatic]({{ '/docs/tools/trimmomatic/' | url }}) reports from all samples before proceeding to assembly — it provides a fast sanity check that trimming thresholds are consistent across the batch and flags any outlier libraries.

See also:
- **Workflow step:** [QC & Trim]({{ '/docs/workflows/qc-trim/' | url }})
- [FastQC]({{ '/docs/tools/fastqc/' | url }})
- [fastp]({{ '/docs/tools/fastp/' | url }})
