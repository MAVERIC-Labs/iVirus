---
title: BBDuk
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/bbduk/
---

BBDuk (part of the BBTools suite) performs adapter trimming, quality filtering, and k-mer-based contaminant removal in a single, memory-efficient pass, making it a fast alternative to Trimmomatic or fastp for preprocessing metagenomics reads.

## Install

```bash
conda install -c bioconda bbtools -y
```

## Basic usage

BBDuk is typically run in two sequential steps: adapter trimming first, then quality filtering.

**Step 1 — adapter trimming:**

```bash
bbduk.sh in1=R1.fastq.gz in2=R2.fastq.gz \
  out1=R1_trim.fastq.gz out2=R2_trim.fastq.gz \
  ref=/bbmap/resources/adapters.fa \
  ktrim=r k=23 mink=11 hdist=1 tpe tbo
```

**Step 2 — quality filtering:**

```bash
bbduk.sh in1=R1_trim.fastq.gz in2=R2_trim.fastq.gz \
  out1=R1_qc.fastq.gz out2=R2_qc.fastq.gz \
  qtrim=rl trimq=10
```

### Option C: Adapter trimming + quality filtering in one pass

```bash
bbduk.sh in1=R1.fastq.gz in2=R2.fastq.gz \
  out1=R1_qc.fastq.gz out2=R2_qc.fastq.gz \
  ref=/bbmap/resources/adapters.fa \
  ktrim=r k=23 mink=11 hdist=1 tpe tbo \
  qtrim=rl trimq=10 minlength=35
```

The two-step approach is recommended when you want to inspect what was removed at each stage, but the single-pass command is faster.

## Key flags

| Flag | Description |
|------|-------------|
| `ktrim=r` | Trim to the right of a k-mer adapter match (use `l` for left, `f` to discard whole read) |
| `k=23` | K-mer length for adapter matching |
| `qtrim=rl` | Quality-trim both ends of each read |
| `trimq=10` | Phred quality threshold below which bases are trimmed |
| `tpe` | Trim both reads in a pair to the same length after adapter removal |
| `tbo` | Trim adapters detected by read overlap (useful for short inserts) |

## Output

- Trimmed, paired FASTQ files (`R1_qc.fastq.gz` / `R2_qc.fastq.gz`) ready for assembly.
- Per-run summary printed to stderr: total reads/bases in, reads/bases removed, and percent retained.

<!-- screenshot: /assets/img/tools/screenshots/bbduk.png -->

## In the iVirus workflow

BBDuk serves as an alternative to [Trimmomatic]({{ '/docs/tools/trimmomatic/' | url }}) or [fastp]({{ '/docs/tools/fastp/' | url }}) in the QC & Trim step. Its output FASTQ files feed directly into assemblers such as [SPAdes]({{ '/docs/tools/spades/' | url }}) or [MEGAHIT]({{ '/docs/tools/megahit/' | url }}). Run [MultiQC]({{ '/docs/tools/multiqc/' | url }}) after BBDuk to aggregate trim statistics across samples.

See also:
- **Workflow step:** [QC & Trim]({{ '/docs/workflows/qc-trim/' | url }})
- [fastp]({{ '/docs/tools/fastp/' | url }})
- [MultiQC]({{ '/docs/tools/multiqc/' | url }})
- [FastQC]({{ '/docs/tools/fastqc/' | url }})
