---
title: "Quality & vOTUs"
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: derep
permalink: /docs/workflows/quality-and-votus/
---

{% workflowStepper workflow, step %}

CheckV already ran as part of [Viral Identification]({{ '/docs/workflows/viral-identification/' | url }}), where we used `grep -c` on its `quality_summary.tsv` to get an overview of the first-pass VirSorter2 genomes. CheckV is conservative with regards to quality, and uses completeness as a measure. It also incorporates a contamination check, so you can quickly screen contigs.

See the [CheckV guide]({{ '/docs/tools/checkv/' | url }}) for what each output file contains.

## De-replicating contigs

At this point you could de-replicate/-duplicate your contigs. CheckV ships two helper scripts, `anicalc.py` and `aniclust.py`, that cluster them from an all-vs-all BLAST:

{% codetabs ["Command", "SLURM Script"] %}
```bash
makeblastdb -in final-viral-scored.fa -dbtype nucl -out final-viral-scored
blastn -query final-viral-scored.fa -db final-viral-scored \
  -outfmt '6 std qlen slen' -max_target_seqs 10000 \
  -num_threads 16 -out blast.tsv

anicalc.py -i blast.tsv -o ani.tsv
aniclust.py --fna final-viral-scored.fa --ani ani.tsv --out clusters.tsv \
  --min_ani 95 --min_tcov 85 --min_qcov 0
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -t 4:00:00
#SBATCH -n 16
#SBATCH -J vOTU-cluster

# activate your conda environment here

workDir="<your_project_dir>"
input="${workDir}/analyses/VS2-SOP/final-viral-scored.fa"
outDir="${workDir}/analyses/vOTUs"

mkdir -p $outDir
cd $outDir

makeblastdb -in $input -dbtype nucl -out viral_db
blastn -query $input -db viral_db \
  -outfmt '6 std qlen slen' -max_target_seqs 10000 \
  -num_threads 16 -out blast.tsv

anicalc.py -i blast.tsv -o ani.tsv
aniclust.py --fna $input --ani ani.tsv --out clusters.tsv \
  --min_ani 95 --min_tcov 85 --min_qcov 0
```
{% endcodetabs %}

`clusters.tsv` lists one representative per cluster followed by its members.

[vclust]({{ '/docs/tools/vclust/placeholder/' | url }}) does the same job much faster.
