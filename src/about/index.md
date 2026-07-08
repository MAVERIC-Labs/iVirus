---
layout: layouts/site.njk
title: About iVirus
permalink: /about/
heroTitle: "About iVirus"
heroSubtitle: "Learn about the iVirus project: tools, datasets, protocols, and training."
heroVariant: "hero--about"
heroAnimate: true
contentClass: "prose-page"
eleventyComputed:
  heroBg: "{{ \"url('\" + ('/assets/img/hero/tools-tiles.svg' | url) + \"')\" }}"
---

## How We Started
iVirus started as a means to fill a void in the sequencing and analysis pipeline where few tools were designed with viruses in mind. Even today, many tools do not *think about* the unique challenges viruses pose—from sequence collection and extraction to assembly and identification. Most tools still focus primarily on virus identification, but there’s much more needed than just identifying viruses.

## What Does iVirus Do
We **develop tools** and **provide data and metadata resources** specifically for **virus ecology**. Our work addresses challenges unique to virus biology: benchmarking general-purpose tools with virus-friendly parameters and creating virus- and metagenomics-specific tools that **enhance data reuse and collaboration** among virus researchers.

## Apps and Tools
We **integrate and leverage tools** where others already excel (e.g., assembly algorithms, read quality control) alongside **our own tools** to keep analysis pipelines stable. For developing new tools, integrating third-party ones, and storing useful datasets for the virus ecology community, we rely on **CyVerse** and **KBase**.

## Why CyVerse and KBase?
Both platforms promote **efficient data sharing** using common **compute resources** and provide a secure base for developers to build new apps and pipelines. If we only distributed tools via a code repository, we’d reach only technically minded labs. By developing within CyVerse and KBase, these **free resources are available to all viral ecology researchers**. Even minimally funded labs can process entire datasets—from raw reads to nearly manuscript-ready figures.

## What iVirus is Doing Now
We continue to **add new apps** across CyVerse and KBase, contribute **new datasets** to the CyVerse Data Store, and track emerging work in virus ecology.

## Compute Platforms
iVirus runs on two community platforms that keep tools and datasets free and accessible: **CyVerse** (compute & data sharing) and **KBase** (reproducible, shareable analysis workflows). We rely on these platforms to host apps, publish datasets, and enable end‑to‑end analyses for labs of all sizes. 

See **[Compute Platforms (CyVerse & KBase)]({{ '/platforms/' | url }})** for details and citations.

## Get Involved
- [Publications]({{ '/publications/' | url }})
- [Workshops & Talks]({{ '/workshops/' | url }})
- [Compute Platforms]({{ '/platforms/' | url }})

## Acknowledgements
Supported by National Science Foundation Award [ABI #1759874](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1759874).
