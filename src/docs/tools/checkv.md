---
title: CheckV
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/checkv/
---

CheckV quality-assesses metagenome-assembled viral genomes, trims host contamination from integrated proviruses, and assigns each contig to a completeness tier: Complete, High-quality (>90%), Medium-quality (50–90%), Low-quality (<50%), or Undetermined. Checking quality is critical to prevent low quality data from impacting downstream analyses and results.

## Install

```bash
conda create -n checkv -c bioconda -c conda-forge checkv -y
conda activate checkv
# Download the reference database (required before first run)
checkv download_database ./checkv-db
```

## Basic usage

```bash
checkv end_to_end vs2_pass1/final-viral-combined.fa checkv_out/ -t 40
```

## Key flags

| Flag | Description |
|------|-------------|
| `end_to_end` | Run the complete pipeline (contamination detection → completeness → quality summary) |
| `-t` | Number of CPU threads |
| `-d` | Path to the CheckV database directory |
| `--remove_tmp` | Delete large intermediate alignment files after the run to save disk space |

## Output

- **`quality_summary.tsv`** — per-contig quality tier, estimated completeness, contamination percentage, and contig length; the primary file for filtering decisions.
- **`viruses.fna`** — FASTA of clean viral contigs (non-proviral sequences).
- **`proviruses.fna`** — FASTA of proviral regions trimmed to viral coordinates.
- **`contamination.tsv`** — detailed host-region boundaries for each flagged contig.

<!-- screenshot: /assets/img/tools/screenshots/checkv.png -->

## Deduplication / clustering (optional)

CheckV ships with a built-in clustering script (`anicalc.py` / `aniclust.py`) for deduplicating viral contigs across multiple samples before downstream analysis. This is particularly useful when merging results from several metagenomes:

```bash
# All-vs-all BLAST of the viral contigs
makeblastdb -in all_viruses.fna -dbtype nucl -out all_viruses
blastn -query all_viruses.fna -db all_viruses \
  -outfmt '6 std qlen slen' -max_target_seqs 10000 \
  -num_threads 16 -out blast.tsv

# Pairwise ANI, then cluster at 95% ANI / 85% coverage (species-level)
anicalc.py -i blast.tsv -o ani.tsv
aniclust.py --fna all_viruses.fna --ani ani.tsv --out clusters.tsv \
  --min_ani 95 --min_tcov 85 --min_qcov 0
```

Output: `clusters.tsv` lists representative sequences and their cluster members. Use the representatives as a non-redundant viral sequence set.

## In the iVirus workflow

CheckV is run immediately after viral identification with [VirSorter2]({{ '/docs/tools/virsorter2/' | url }}) or [VIBRANT]({{ '/docs/tools/vibrant/' | url }}). The `viruses.fna` and `proviruses.fna` outputs, filtered to high-quality sequences from `quality_summary.tsv`, serve as inputs to functional annotation ([DRAM-v]({{ '/docs/tools/dram-v/' | url }})), taxonomy ([vConTACT2]({{ '/docs/tools/vcontact2/' | url }})), and host prediction ([iPHoP]({{ '/docs/tools/iphop/' | url }})).

See also:
- **Workflow step:** [Viral Identification]({{ '/docs/workflows/viral-identification/' | url }})
- [VirSorter2]({{ '/docs/tools/virsorter2/' | url }})
- [VIBRANT]({{ '/docs/tools/vibrant/' | url }})
- [DRAM-v]({{ '/docs/tools/dram-v/' | url }})
- [iPHoP]({{ '/docs/tools/iphop/' | url }})
