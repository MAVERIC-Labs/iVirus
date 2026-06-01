---
title: Viral Identification
doctype: guide
layout: layouts/docs.njk
permalink: /docs/workflows/viral-identification/
workflow: metagenome
step: id
---

{% workflowStepper workflow, step %}

Identify viral contigs from the assembled metagenome using the [VirSorter2 SOP](https://www.protocols.io/view/viral-sequence-identification-sop-with-virsorter2-5qpvoyqebg4x/v3) (Guo, Vik, Pratama, Roux, Sullivan et al.). This two-pass approach — VirSorter2 → CheckV → VirSorter2 → DRAM-v — maximizes sensitivity while using CheckV quality tiers to guide curation.

**Overview:**
1. **Pass 1** — broad viral identification with VirSorter2
2. **CheckV** — quality assessment and provirus trimming
3. **Pass 2** — re-run VirSorter2 on CheckV output, prep for DRAM-v
4. **DRAM-v** — functional annotation and AMG identification
5. **Filter/curate** — combine scores into Keep1/Keep2/Manual/Discard tiers

## Pass 1

{% codetabs ["Command", "SLURM Script"] %}
```bash
virsorter run \
  -i contigs.fasta \
  -w vs2_pass1/ \
  --include-groups dsDNAphage,ssDNA \
  --min-length 5000 \
  --min-score 0.5 \
  --keep-original-seq \
  -j 16 all
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -n 40
#SBATCH -t 4:00:00
#SBATCH -J vs2-pass1
#SBATCH --mem=32G

WORKDIR="$PWD"
INPUT="${WORKDIR}/spades_out/contigs.fasta"
OUTDIR="${WORKDIR}/vs2_pass1"

virsorter run \
  -i $INPUT \
  -w $OUTDIR \
  --include-groups dsDNAphage,ssDNA \
  --min-length 5000 \
  --min-score 0.5 \
  --keep-original-seq \
  -j $SLURM_NTASKS all
```
{% endcodetabs %}

On the example assembly (322k contigs), Pass 1 took approximately **2 hours 48 minutes** with 40 cores.

## CheckV

{% codetabs ["Command", "SLURM Script"] %}
```bash
checkv end_to_end vs2_pass1/final-viral-combined.fa checkv_out/ -t 16
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -n 40
#SBATCH -t 1:00:00
#SBATCH -J checkv
#SBATCH --mem=16G

WORKDIR="$PWD"
INPUT="${WORKDIR}/vs2_pass1/final-viral-combined.fa"
OUTDIR="${WORKDIR}/checkv_out"

checkv end_to_end $INPUT $OUTDIR -t $SLURM_NTASKS
```
{% endcodetabs %}

Inspect quality tiers before proceeding to Pass 2:

```bash
grep -c "Low-quality"    checkv_out/quality_summary.tsv
grep -c "Medium-quality" checkv_out/quality_summary.tsv
grep -c "High-quality"   checkv_out/quality_summary.tsv
grep -c "Not-determined" checkv_out/quality_summary.tsv
```

On the worked dataset: 2825 Low-quality, 25 Medium-quality, 1 High-quality, 528 Not-determined.

> **Note:** CheckV is conservative — most first-pass contigs being Low-quality or Not-determined is normal and does not mean they are not viral.

## Merge + Pass 2

{% codetabs ["Command", "SLURM Script"] %}
```bash
cat checkv_out/proviruses.fna checkv_out/viruses.fna > checkv_out/combined.fna

virsorter run \
  -i checkv_out/combined.fna \
  -w vs2_pass2/ \
  --seqname-suffix-off \
  --viral-gene-enrich-off \
  --provirus-off \
  --prep-for-dramv \
  --include-groups dsDNAphage,ssDNA \
  --min-length 5000 \
  --min-score 0.5 \
  -j 16 all
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -n 40
#SBATCH -t 4:00:00
#SBATCH -J vs2-pass2
#SBATCH --mem=32G

WORKDIR="$PWD"

# Merge CheckV outputs
cat ${WORKDIR}/checkv_out/proviruses.fna \
    ${WORKDIR}/checkv_out/viruses.fna \
    > ${WORKDIR}/checkv_out/combined.fna

virsorter run \
  -i ${WORKDIR}/checkv_out/combined.fna \
  -w ${WORKDIR}/vs2_pass2 \
  --seqname-suffix-off \
  --viral-gene-enrich-off \
  --provirus-off \
  --prep-for-dramv \
  --include-groups dsDNAphage,ssDNA \
  --min-length 5000 \
  --min-score 0.5 \
  -j $SLURM_NTASKS all
```
{% endcodetabs %}

Pass 2 took approximately **3 hours 3 minutes** with 40 cores on the example dataset.

## DRAM-v

{% codetabs ["Command", "SLURM Script"] %}
```bash
DRAM-v.py annotate \
  -i vs2_pass2/for-dramv/final-viral-combined-for-dramv.fa \
  -v vs2_pass2/for-dramv/viral-affi-contigs-for-dramv.tab \
  -o dramv_annotate/ \
  --skip_trnascan --threads 16 --min_contig_size 1000

DRAM-v.py distill -i dramv_annotate/annotations.tsv -o dramv_distill/
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -n 40
#SBATCH -t 120:00:00
#SBATCH -J dramv
#SBATCH --mem=64G

WORKDIR="$PWD"
FA="${WORKDIR}/vs2_pass2/for-dramv/final-viral-combined-for-dramv.fa"
AFFI="${WORKDIR}/vs2_pass2/for-dramv/viral-affi-contigs-for-dramv.tab"

DRAM-v.py annotate \
  -i $FA \
  -v $AFFI \
  -o ${WORKDIR}/dramv_annotate \
  --skip_trnascan \
  --threads $SLURM_NTASKS \
  --min_contig_size 1000

DRAM-v.py distill \
  -i ${WORKDIR}/dramv_annotate/annotations.tsv \
  -o ${WORKDIR}/dramv_distill
```
{% endcodetabs %}

> **Warning:** DRAM-v is slow. The worked example (3,313 contigs) took **3 days 9 hours** on 40 cores. Request wall time accordingly.

## Filtering and curation

After DRAM-v, filter contigs by combining VirSorter2 scores, CheckV contamination estimates, and DRAM-v AMG results into Keep1/Keep2/Manual check/Discard tiers per [Step 5 of the VirSorter2 SOP](https://www.protocols.io/view/viral-sequence-identification-sop-with-virsorter2-5qpvoyqebg4x/v3). The worked example yielded **3,243 high-confidence genomes** from 322k initial contigs.

> **Note:** Manual curation cannot be fully automated. Review "Manual check" category contigs individually.

VIBRANT is an alternative to VirSorter2 for viral identification; see the [VIBRANT guide](/docs/tools/vibrant/).

## See also

- [VirSorter2 tool guide](/docs/tools/virsorter2/)
- [CheckV tool guide](/docs/tools/checkv/)
- [DRAM-v tool guide](/docs/tools/dramv/)
- [VIBRANT tool guide](/docs/tools/vibrant/)
