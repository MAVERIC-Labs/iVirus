---
title: Download FASTQ from SRA
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/sra-download/
navTitle: SRA FASTQ Download
navOrder: 5
---

Quickly fetch FASTQ files for an accession using **sra-tools**.

## Install
```bash
conda create -n sra -c bioconda sra-tools -y
conda activate sra
```

## Download
```bash
# Replace with your accession(s)
ACC=SRR390728

# Download to local cache
prefetch "$ACC"

# Convert to FASTQ (paired-end example)
fasterq-dump "$ACC" --split-files --outdir fastq/
```

### Outputs
```bash
fastq/${ACC}_1.fastq
fastq/${ACC}_2.fastq
```
