---
title: Reads → Assembly
doctype: guide
layout: layouts/docs.njk
permalink: /docs/workflows/reads-to-assembly/
workflow: metagenome
step: reads
---

{% workflowStepper workflow, step %}

### Purpose
Convert raw reads into assemblies.

### What you’ll do
- Quality check and trim reads (fastp)
- Assemble with SPAdes

### Related
- [fastp tool guide]({{ '/docs/tools/fastp/' | url }})
- [SPAdes tool guide]({{ '/docs/tools/spades/' | url }})