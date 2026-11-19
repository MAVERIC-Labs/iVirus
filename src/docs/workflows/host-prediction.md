---
title: "Host Prediction"
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: host
permalink: /docs/workflows/host-prediction/
---

{% workflowStepper workflow, step %}

Predicting the prokaryotic hosts of environmental viruses is essential for understanding their ecological roles, yet most viruses lack cultivated hosts. Host prediction tools exploit signals such as CRISPR spacer matches, sequence composition similarity, and co-occurrence patterns to infer the likely host genus. No single method is perfect, so integrated approaches that combine multiple signals — such as iPHoP — generally outperform single-method tools.

## iPHoP

{% codetabs ["Command", "SLURM Script"] %}
```bash
iphop predict --fa_file final-viral-scored.fa --db_dir iphop_db/ --out_dir iphop_out/ -t 16
```
---
```bash
#!/bin/bash
#SBATCH -N 1
#SBATCH -t 24:00:00  # adjust to the size of your dataset
#SBATCH -n 16
#SBATCH -J iPHoP

# activate your conda environment here

workDir="<your_project_dir>"
input="${workDir}/analyses/VS2-SOP/final-viral-scored.fa"
db_dir="${workDir}/iphop_db"
outDir="${workDir}/analyses/iPHoP"

iphop predict --fa_file $input --db_dir $db_dir --out_dir $outDir -t 16
```
{% endcodetabs %}

- **`Host_prediction_to_genus_m90.csv`** — primary output: per-phage predicted host genus, confidence score, and list of supporting tool signals.
- **`Detailed_output_by_tool.csv`** — per-tool breakdown of individual prediction scores enabling review of which signals drive each call.

iPHoP requires [CheckV]({{ '/docs/tools/checkv/' | url }})-filtered, high-quality viral genomes as input — low-quality or heavily fragmented contigs reduce prediction confidence.

See the [iPHoP guide]({{ '/docs/tools/iphop/' | url }}) for installation, the reference database and all flags.

{% admon "note", "Coming soon" %}This documentation is coming soon.{% endadmon %}
