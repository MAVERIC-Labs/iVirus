---
title: VIGA
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/viga/
---

VIGA (Viral Genome Annotator) provides automated structural and functional annotation of prokaryotic virus genomes, producing GenBank-format output compatible with submission to NCBI and downstream comparative genomics tools.

## Install

VIGA is distributed via GitHub and requires a conda environment for its dependencies.

```bash
git clone https://github.com/EGTortuero/VIGA.git
cd VIGA
conda env create -f conda_requirements.txt -n viga
conda activate viga
```

You will also need local copies of a BLAST protein database and a DIAMOND database. See the [VIGA README](https://github.com/EGTortuero/VIGA) for database setup instructions.

## Basic usage

```bash
python VIGA.py \
  --input contigs.fna \
  --rfam \
  --blastdb /path/to/blastdb \
  --diamonddb /path/to/diamond.dmnd
```

## Key flags

| Flag | Description |
|------|-------------|
| `--input` | Input viral contig FASTA file |
| `--rfam` | Include RNA gene annotation via Rfam (recommended) |
| `--blastdb` | Path to the BLAST protein database directory |
| `--diamonddb` | Path to the DIAMOND protein database (.dmnd) |
| `--ncores` | Number of CPU cores to use |
| `--readlength` | Sequencing read length (affects some prediction parameters) |

## Output

- **`.gbk`** — GenBank-format annotation file; primary output for downstream analysis and NCBI submission.
- **`.gff`** — GFF3 feature annotation file compatible with genome browsers and other tools.
- **`.faa`** — Predicted protein sequences in FASTA format.

The GenBank file includes CDS predictions, functional annotations from BLAST/DIAMOND hits, tRNA and rRNA predictions (when `--rfam` is used), and genome metadata.

<!-- screenshot: /assets/img/tools/screenshots/viga.png -->

## In the iVirus workflow

VIGA runs in the Annotation step, taking viral contigs from [VIBRANT](/docs/tools/vibrant/) or [VirSorter](/docs/tools/virsorter/) as input. Its GenBank output is particularly valuable for contigs destined for database submission or detailed comparative analysis. For broad AMG and metabolic profiling across large contig sets, [DRAM-v](/docs/tools/dram-v/) is typically used in parallel.

See also:
- **Workflow step:** [Annotation](/docs/workflows/annotation/)
- **Tool catalogue:** [/tools/](/docs/tools/)
