---
title: "Visualize & Explore"
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: viz
permalink: /docs/workflows/visualize/
---

{% workflowStepper workflow, step %}

Read quality reports from FastQC and MultiQC are covered under [QC & Trim]({{ '/docs/workflows/qc-and-trim/' | url }}). This page covers the gene-sharing network from [Taxonomy]({{ '/docs/workflows/taxonomy/' | url }}).

## The vConTACT2 network in Cytoscape

There are a lot of files generated from vConTACT2. The two most important files are "genome_by_genome_overview.csv", which provides an overview of all the genomes that were processed by vConTACT2, and "c1.ntw", which contains the network.

On a computer with [Cytoscape]({{ '/docs/tools/cytoscape/' | url }}) installed, import the network using **File → Import → Network from File**. Upon import, select Advanced options, Delimiter is space, deselect "Use first line as column names." → OK.

Now, click on Column 1, set it as Source Node, click on Column 2, set it as Target Node → OK.

You should see this:

![Cytoscape after importing the vConTACT2 network]({{ '/assets/img/docs/cytoscape-after-import.png' | url }})

Next, we want to add annotations to our network. Go to **File → Import → Table from File**. Upon import, on "Where to Import Table Data", select "To A Network Collection", then import Data as "Node Table Columns". Finally, in the Preview, click on the "Genome" column and then click on the "key" symbol, then OK.

![Cytoscape after importing the annotation table]({{ '/assets/img/docs/cytoscape-after-table.png' | url }})

Now you have all the annotations added to the network. You can style and adjust the network to whatever is appropriate for your research goals.

And with that, we've gone from raw, environmental viral metagenome data (downloaded from the SRA). We've QC'd, assembled, identified viral genomes, checked their quality, and then got a bit of classification. Just like with the Microbial Ecology pipeline, we're only a few steps away from a published manuscript!

There is also a citable version of these steps on protocols.io: [Run vConTACT2 on a viral dataset and visualize the results in Cytoscape]({{ '/protocols/run-vcontact2-and-visualize-in-cytoscape/' | url }}).
