---
title: Assembly
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: assembly
permalink: /docs/workflows/assembly/
---

{% workflowStepper workflow, step %}

Assembly isn't for the faint of heart. It can be frustrating and it can fail for a lot of reasons, often due to insufficient memory or due to the dataset complexity. There's only so much you can do.

However, our example dataset will finish on most HPC systems within a few hours. *This will run SPAdes on the Trimmomatic-cleaned reads; alternatives are below.*

## SPAdes

{% codetabs ["Command", "SLURM Script"] %}
```bash
spades.py --meta -k 21,33,55,77,99,121 \
  --pe1-1 ERR594369_1_t_paired.fastq.gz \
  --pe1-2 ERR594369_2_t_paired.fastq.gz \
  -t 48 -m 124 \
  -o MetaSPAdes_Trimmomatic
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -t 24:00:00
#SBATCH -n 48
#SBATCH -J SPAdes
#SBATCH --partition=hugemem  # or your cluster's high-memory partition

# activate your conda environment here

# General Options, can't use --careful with --meta
genOpts="--meta -k 21,33,55,77,99,121"  # Paired end, 1 pair only

runOpts="-t 48 -m 124"  # Match to job request. This is 48 cores and 124 GB memory

workDir="<your_project_dir>"

pe1f="${workDir}/processed_reads/ERR594369_1_t_paired.fastq.gz"
pe1r="${workDir}/processed_reads/ERR594369_2_t_paired.fastq.gz"

# I always like to know what command was actually sent to SPAdes
echo "spades.py ${genOpts} ${runOpts} --pe1-1 ${pe1f} --pe1-2 ${pe1r} -o ${workDir}/MetaSPAdes_Trimmomatic"

spades.py ${genOpts} ${runOpts} \
  --pe1-1 ${pe1f} \
  --pe1-2 ${pe1r} \
  -o "${workDir}/MetaSPAdes_Trimmomatic"
```
{% endcodetabs %}

Submit with `sbatch SPAdes.sh`.

```bash
$ sacct -j <jobid> --format "CPUTime,MaxRSS,Elapsed"
   CPUTime     MaxRSS    Elapsed
---------- ---------- ----------
9-10:48:00  64883592K   04:43:30
```

Oops! The job required ~65 GB and took 4 hr 43 minutes. Considerably less than I had anticipated.

```bash
$ ls MetaSPAdes_Trimmomatic
assembly_graph.fastg               contigs.fasta  dataset.info            K21  K77   params.txt       spades.log
assembly_graph_with_scaffolds.gfa  contigs.paths  first_pe_contigs.fasta  K33  K99   scaffolds.fasta  tmp
before_rr.fasta                    corrected      input_dataset.yaml      K55  misc  scaffolds.paths
```

```bash
$ grep -c ">" contigs.fasta
322596
```

## MEGAHIT

And now, what if we wanted to use a different assembler, let's say MEGAHIT?

{% codetabs ["Command", "SLURM Script"] %}
```bash
megahit --k-list 21,41,61,81,99 \
  -1 ERR594369_1_t_paired.fastq.gz \
  -2 ERR594369_2_t_paired.fastq.gz \
  -t 48 -m 0.9 \
  -o MEGAHIT_with_Trimmomatic
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -t 4:00:00
#SBATCH -n 48
#SBATCH -J MEGAHIT
#SBATCH --partition=hugemem  # or your cluster's high-memory partition

# activate your conda environment here

# Directories
projectDir="<your_project_dir>"
outputDir="${projectDir}/assemblies/MEGAHIT_with_Trimmomatic"

# Assembling with MEGAHIT, so setting up parameters
genOpts="--k-list 21,41,61,81,99"  # K-mer selection is a PhD itself...
runOpts="-t 48 -m 0.9"  # Match to job request, 48 cores and 90% of memory

# What are the reads we'll need?
forReads="${projectDir}/processed_reads/ERR594369_1_t_paired.fastq.gz"
revReads="${projectDir}/processed_reads/ERR594369_2_t_paired.fastq.gz"

# Now that we have our parameters and input files, we can put everything together
megahitCmd="megahit ${genOpts} ${runOpts}"
megahitCmd="${megahitCmd} -1 ${forReads} -2 ${revReads}"

echo "${megahitCmd} -o ${outputDir}"

time ${megahitCmd} -o ${outputDir}
```
{% endcodetabs %}

```bash
$ sacct -j <jobid> --format "CPUTime,MaxRSS,Elapsed"
   CPUTime     MaxRSS    Elapsed
---------- ---------- ----------
1-12:56:00   5717660K   00:46:10
```

That took 46 minutes and used ~5.7 GB. That's... quite a bit faster and significantly less memory.

```bash
$ ls MEGAHIT_with_Trimmomatic
checkpoints.txt  done  final.contigs.fa  intermediate_contigs  log  options.json
```

```bash
$ grep -c ">" MEGAHIT_with_Trimmomatic/final.contigs.fa
297969
```

## Post-Assembly

After assembly, we're left with a few decisions. Which read QC and which assembly method do we want to use? Even though we only use MEGAHIT or SPAdes + Trimmomatic, we could have easily used BBDuk. Depending on your sample background and the types of viruses you expect to see, SPAdes or MEGAHIT could be 'better' or 'worse' contigs. *In reality*, the differences are minor, so you can move forward with either of them.

## See also

- [SPAdes tool guide](/docs/tools/spades/)
- [MEGAHIT tool guide](/docs/tools/megahit/)
