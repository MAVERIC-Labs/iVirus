---
title: Cytoscape
doctype: guide
layout: layouts/docs.njk
permalink: /docs/tools/cytoscape/
---

Cytoscape is a desktop network visualization application used in iVirus workflows to explore and interpret the gene-sharing networks produced by [vConTACT2](/docs/tools/vcontact2/), allowing researchers to visually identify viral clusters and their relationships to reference genomes.

## Install

Cytoscape is a desktop application (not command-line). Download the installer for your platform from [https://cytoscape.org](https://cytoscape.org). Java 11+ is required.

The **yFiles Layout Algorithms** app (available from the Cytoscape App Manager) is strongly recommended for the organic layout used with vConTACT2 networks.

## Basic usage

Cytoscape is operated through its graphical interface. The standard iVirus workflow for vConTACT2 output:

1. **Import the network:** `File → Import → Network from File` → select `c1.ntw`
2. **Import node attributes:** `File → Import → Table from File` → select `genome_by_genome_overview.csv`; map `Genome` column as the key column matching node names.
3. **Apply layout:** `Layout → yFiles Organic Layout` (gives a clear cluster separation).
4. **Style nodes:** Open the Style panel; map node fill color to the `VC_Status` or `Genus` column to distinguish reference genomes from novel clusters.

## Key workflow steps

| Step | Action |
|------|--------|
| Import network | `File → Import → Network from File` → `c1.ntw` |
| Import node table | `File → Import → Table from File` → `genome_by_genome_overview.csv` |
| Layout | `Layout → yFiles Organic Layout` |
| Color by cluster | Style panel → Node Fill Color → map to `VC_Status` column |
| Filter to subnetwork | Select nodes of interest → `File → Export → Network` |

## Output

- Cytoscape produces session files (`.cys`) that save the full styled network for sharing.
- Publication-quality network images can be exported via `File → Export → Network to Image` (SVG, PDF, PNG).
- Node/edge tables can be exported to CSV for further statistical analysis.

**Interpreting clusters:** Dense sub-networks indicate groups of genomes sharing many genes (putative genera). Nodes co-clustering with colored reference genome nodes inherit their taxonomy; isolated nodes or clusters with no references represent potentially novel genera.

<!-- screenshot: /assets/img/tools/screenshots/cytoscape.png -->

## In the iVirus workflow

Cytoscape is the primary visualization tool in the Taxonomy step, used exclusively to display [vConTACT2](/docs/tools/vcontact2/) output. After interpreting cluster membership in Cytoscape, taxonomic assignments inform the abundance and ecology analyses. [Anvi'o](/docs/tools/anvio/) handles visualization for coverage and pangenomic analyses at other workflow steps.

See also:
- **Workflow step:** [Taxonomy](/docs/workflows/taxonomy/)
- **Input from:** [vConTACT2](/docs/tools/vcontact2/)
- **Tool catalogue:** [/tools/](/docs/tools/)
