---
title: Reporting
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: report
permalink: /docs/workflows/reporting/
---

{% workflowStepper workflow, step %}

vConTACT2 is a tool to classify viral genomes. But first, we need to get the input files set up. We'll run Prodigal first — to generate proteins — and then use an accessory function to prepare vConTACT2 files.

{% codetabs ["Command", "SLURM Script"] %}
```bash
# Step 1: predict proteins with Prodigal
prodigal -i VS2-SOP/final-viral-scored.fa \
  -p anon \
  -a Prodigal_output/VirSorter2_genomes.faa \
  -o Prodigal_output/VirSorter2_genomes.prodigal

# Step 2: generate gene-to-genome mapping
vcontact2_gene2genome \
  -p Prodigal_output/VirSorter2_genomes.faa \
  -o Prodigal_output/VirSorter2_proteins.csv \
  -s Prodigal-FAA

# Step 3: run vConTACT2
vcontact2 \
  --pcs-mode MCL \
  --vcs-mode ClusterONE \
  --threads 48 \
  --raw-proteins Prodigal_output/VirSorter2_genomes.faa \
  --rel-mode Diamond \
  --proteins-fp Prodigal_output/VirSorter2_proteins.csv \
  --db 'ProkaryoticViralRefSeq201-Merged' \
  --output-dir vConTACT2_output
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -t 4:00:00
#SBATCH -n 48
#SBATCH -J vConTACT2
#SBATCH --partition=hugemem  # or your cluster's high-memory partition

# activate your conda environment here

# Directories
workDir="<your_project_dir>"

# Generate files suitable for vConTACT2
input_fna="${workDir}/analyses/VS2-SOP/final-viral-scored.fa"
prodigal_outputDir="${workDir}/analyses/Prodigal_output"

mkdir $prodigal_outputDir

prodigal -i $input_fna -p anon \
  -a $prodigal_outputDir/VirSorter2_genomes.faa \
  -o $prodigal_outputDir/VirSorter2_genomes.prodigal

# Run vConTACT2
outputDir="${workDir}/analyses/vConTACT2_output"

vcontact2_gene2genome \
  -p $prodigal_outputDir/VirSorter2_genomes.faa \
  -o $prodigal_outputDir/VirSorter2_proteins.csv \
  -s Prodigal-FAA

vcontact2 \
  --pcs-mode MCL \
  --vcs-mode ClusterONE \
  --threads 48 \
  --raw-proteins $prodigal_outputDir/VirSorter2_genomes.faa \
  --rel-mode Diamond \
  --proteins-fp $prodigal_outputDir/VirSorter2_proteins.csv \
  --db 'ProkaryoticViralRefSeq201-Merged' \
  --output-dir $outputDir

wait
```
{% endcodetabs %}

```bash
$ sacct -j <jobid> --format "CPUTime,MaxRSS,Elapsed"
   CPUTime     MaxRSS    Elapsed
---------- ---------- ----------
3-05:38:24   9884748K   01:37:03
```

The job only took 1 hr 37 min, provided 48 cores and 1.5 TB of memory. Based on the results, *we would not re-run this job with these parameters*! Next time, a 'standard' 28, 40 or 48-core node would suffice.

```bash
$ ls vConTACT2_output
c1.clusters                             modules_mcl_5.0_modules.pandas
c1.ntw                                  modules_mcl_5.0_pcs.pandas
genome_by_genome_overview.csv           modules.ntwk
merged_df.csv                           sig1.0_mcl2.0_clusters.csv
merged.dmnd                             sig1.0_mcl2.0_contigs.csv
merged.faa                              vConTACT_contigs.csv
merged.self-diamond.tab                 vConTACT_pcs.csv
...                                     viral_cluster_overview.csv
```

The two most important files are 'genome_by_genome_overview.csv', which provides an overview of all the genomes that were processed by vConTACT2, and 'c1.ntw', which contains the network.

## Visualizing in Cytoscape

**On a computer with Cytoscape installed**, import the network using File → Import → Network from File. Upon import, select Advanced options, Delimiter is space, deselect 'Use first line as column names.' → OK. Now, click on Column 1, set it as Source Node, click on Column 2, set it as Target Node → OK.

Next, we want to add annotations to our network. Go to File → Import → Table from File. Upon import, on 'Where to Import Table Data', select 'To A Network Collection', then import Data as 'Node Table Columns'. Finally, in the Preview, click on the 'Genome' column and then click on the 'key' symbol, then OK.

Now you have all the annotations added to the network. You can style and adjust the network to whatever is appropriate for your research goals.

And with that, we've gone from raw, environmental viral metagenome data (downloaded from the SRA). We've QC'd, assembled, identified viral genomes, checked their quality, and then got a bit of classification. Just like with the Microbial Ecology pipeline, we're only a few steps away from a published manuscript!

## See also

- [Prodigal tool guide](/docs/tools/prodigal/)
- [vConTACT2 tool guide](/docs/tools/vcontact2/)
- [Cytoscape tool guide](/docs/tools/cytoscape/)
