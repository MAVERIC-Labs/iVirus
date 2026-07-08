---
title: Trimmomatic
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/trimmomatic/
---

Trimmomatic trims adapter sequences and low-quality bases from Illumina paired-end and single-end reads, producing clean read files ready for assembly.

## Install

```bash
conda install -c bioconda -c conda-forge trimmomatic -y
```

## Basic usage

```bash
trimmomatic PE ERR594369_1.fastq.gz ERR594369_2.fastq.gz \
  ERR594369_1_t_paired.fastq.gz ERR594369_1_t_unpaired.fastq.gz \
  ERR594369_2_t_paired.fastq.gz ERR594369_2_t_unpaired.fastq.gz \
  ILLUMINACLIP:TruSeq3-PE.fa:2:30:10:2 LEADING:3 TRAILING:3 MINLEN:36
```

> **Note:** For Trimmomatic, the defaults work pretty well. If you have custom primers/adapters, you'll need to create your own adapter file and update the ILLUMINACLIP path.

## Key flags

| Flag | Description |
|------|-------------|
| `PE` / `SE` | Paired-end or single-end mode |
| `ILLUMINACLIP` | Adapter file and clipping parameters (`file:seedMismatches:palindromeClipThreshold:simpleClipThreshold`) |
| `LEADING` | Remove leading bases below this quality threshold |
| `TRAILING` | Remove trailing bases below this quality threshold |
| `MINLEN` | Drop reads shorter than this length after trimming |
| `SLIDINGWINDOW` | Sliding window trimming (e.g., `4:15` — window size:required quality) |

## Output

- **`{sample}_t_paired.fastq.gz`** — trimmed reads where both mates survive; primary input for assembly.
- **`{sample}_t_unpaired.fastq.gz`** — reads whose mate was discarded; can be used in single-end assembly if desired.

## In the iVirus workflow

Trimmomatic is used in the QC & Trim step, taking raw FASTQ reads as input and producing trimmed paired files that feed directly into [SPAdes]({{ '/docs/tools/spades/' | url }}) or [MEGAHIT]({{ '/docs/tools/megahit/' | url }}) for assembly. Run [FastQC]({{ '/docs/tools/fastqc/' | url }}) on both raw and trimmed reads to confirm adapter removal and quality improvement.

See also:
- **Workflow step:** [QC & Trim]({{ '/docs/workflows/qc-trim/' | url }})
- **Protocol:** [Trimmomatic on CyVerse](https://dx.doi.org/10.17504/protocols.io.gvybw7w)
- [FastQC]({{ '/docs/tools/fastqc/' | url }})
- [MultiQC]({{ '/docs/tools/multiqc/' | url }})
