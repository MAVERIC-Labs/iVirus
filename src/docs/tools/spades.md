---
title: SPAdes
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/spades/
---

SPAdes is a short-read de novo assembler well suited for viral and microbial metagenomes; in iVirus workflows, MetaSPAdes (`--meta` mode) is the recommended setting for recovering viral contigs from complex environmental samples.

## Install

```bash
conda install -c bioconda -c conda-forge spades -y
```

## Basic usage

```bash
spades.py --meta -k 21,33,55,77,99,121 \
  --pe1-1 ERR594369_1_t_paired.fastq.gz \
  --pe1-2 ERR594369_2_t_paired.fastq.gz \
  -t 48 -m 124 \
  -o MetaSPAdes_Trimmomatic
```

For single-end reads:

```bash
spades.py --meta -s reads.fastq.gz -o spades_out/ -t 16 -m 64
```

> **Memory warning:** SPAdes is memory-intensive. Viral metagenomes are known to require 2–6+ TB of RAM in extreme cases. Use `--meta` mode and set `-m` (memory limit in GB) to stay within your cluster allocation. For very large datasets, MEGAHIT is a lower-memory alternative.

## Key flags

| Flag | Description |
|------|-------------|
| `--meta` | Metagenome assembly mode (MetaSPAdes); recommended for environmental samples |
| `-1` / `-2` | Paired-end read files (gzipped FASTQ accepted) |
| `-k` | Comma-separated k-mer sizes, e.g. `21,33,55,77` (auto-selected if omitted) |
| `-m` | Memory limit in GB; increase for large or complex samples |
| `--only-assembler` | Skip read error correction (faster; useful if reads are already corrected) |
| `-t` / `--threads` | Number of CPU threads |

## Output

- **`contigs.fasta`** — primary output; assembled contigs, typically used for downstream viral identification.
- **`scaffolds.fasta`** — scaffolded sequences; may include Ns where gaps are spanned.
- **`assembly_graph.gfa`** — assembly graph in GFA format, useful for manual inspection or graph-based analyses.
- **`spades.log`** — detailed log; check here first if the run fails or produces unexpectedly few contigs.

<!-- screenshot: /assets/img/tools/screenshots/spades.png -->

## In the iVirus workflow

SPAdes is used in the Assembly step, taking quality-trimmed reads from [FastQC](/docs/tools/fastqc/) and fastp as input. The resulting `contigs.fasta` is passed to viral identification tools ([VIBRANT](/docs/tools/vibrant/), [VirSorter](/docs/tools/virsorter/)) and annotation tools ([DRAM-v](/docs/tools/dram-v/)). For very large samples with memory constraints, [MEGAHIT](/docs/tools/megahit/) is a faster alternative.

See also:
- **Workflow step:** [Assembly](/docs/workflows/assembly/)
- **Protocol:** [Running SPAdes on CyVerse](https://dx.doi.org/10.17504/protocols.io.ewrbfd6)
- **Tool catalogue:** [/tools/](/docs/tools/)
