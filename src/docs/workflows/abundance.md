---
title: "Abundance & Ecology"
doctype: guide
layout: layouts/docs.njk
workflow: metagenome
step: abundance
permalink: /docs/workflows/abundance/
---

{% workflowStepper workflow, step %}

By mapping raw reads back to a set of reference viral genomes, these tools calculate coverage depth and breadth across samples, enabling comparisons of viral community structure, population dynamics, and ecological patterns across environments or time points.

A citable protocol for the mapping step is on protocols.io: [Mapping Metagenomic Reads]({{ '/protocols/mapping-metagenomic-reads/' | url }}).

For integrated prophages, [PropagAtE]({{ '/docs/tools/propagate/' | url }}) uses read mapping to estimate whether each one is dormant or actively replicating.

{% admon "note", "Coming soon" %}This documentation is coming soon.{% endadmon %}
