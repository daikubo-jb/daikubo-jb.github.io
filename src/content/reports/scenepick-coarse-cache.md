---
kind: "report"
title: "ScenePick: How long does a coarse video index stay small?"
description: "A V-JEPA 2 pilot found the target event for all four synthetic queries at every tested stride, but eight searches filled the coarse index's cache to dense size."
purpose: "I wanted to see whether ScenePick could start with fewer video windows, then compute finer matches only where a query needed them. The key question was whether that would save work after several searches, not just at startup."
project: "JEPA-ScenePick"
tags: ["Video search", "V-JEPA 2", "Synthetic video", "Caching"]
source: "https://github.com/daikubo-jb/JEPA-ScenePick"
---

## Input

The October 16, 2026 pilot used two eight-second synthetic clips and four query segments. The generator repeated its motion every four seconds, so once overlapping matches were excluded, the task was still to find another occurrence of the same generated scene. This was a separate V-JEPA 2 run, not the Color + Motion smoke test elsewhere on this site. I have not included a video or still because I could not verify a copy of the exact pilot fixture for this page.

## Method

I used OpenAI Dot to plan and run the pilot and to review the saved measurements separately. Every search window was two seconds long. I changed the **step between window starts**, not the duration or number of input frames per window.

- **0.5 s stride:** the dense reference, with 26 windows across the two clips.
- **1 s stride:** a wider spacing between window starts.
- **2 s stride with refinement:** start with non-overlapping windows, then use the two selected coarse candidates to decide where to compute up to four new detail windows per search. Reuse any windows already cached. Four was an extraction budget per search, not a cap on cache size.

The run extracted V-JEPA 2 features for 26 corpus windows and four unique queries. The dense and 1 s comparisons reused the shared feature bank. I assessed whether any of the first five returned windows covered at least half of the annotated target event. Each query had one target. I also counted how many of the dense reference’s five window IDs appeared in the alternative’s top five, ignoring order. Search did not use the target annotations to choose candidates.

## Results

| Start-time stride | Queries with a target event in the top five | Top-five window overlap with the dense reference |
| --- | ---: | ---: |
| 0.5 s (dense reference) | 4/4 | Reference |
| 1 s | 4/4 | 85% |
| 2 s (with refinement) | 4/4 | 80% |

All three settings found the target event for these four queries, but they did not return the same windows. The overlap percentages count shared IDs across 20 slots per comparison (four queries times five reference windows), not the percentage of correctly identified events.

<figure>
  <img src="../../media/scenepick-coarse-cache-overlap.svg" width="720" height="256" alt="The 1-second stride shared 17 of 20 top-five window IDs with dense search, and the 2-second stride with refinement shared 16 of 20. Both found the target in all four queries.">
  <figcaption>Window ID overlap in four repeating synthetic queries. The bars show agreement with the dense reference, not event recall or accuracy on unfamiliar footage.</figcaption>
</figure>

| Stage of the 2 s run | Recorded result |
| --- | ---: |
| Initial index, after model loading with an empty feature cache | 38.524 s |
| First search | 24.069 s |
| Repeated search with the same query feature already cached | 19.385 s |
| Cache by the eighth search | All 26 dense-grid windows present |

The repeated search still took 19.385 s because it extracted **four new detail windows**, even though it reused the query feature. By the eighth search, the cache held every window in the dense reference. In this small corpus, the coarse index deferred window extraction rather than avoiding it over the eight searches.

## What this test does not show

- Four queries on repeating synthetic footage cannot establish recall on unfamiliar video or semantic matching quality.
- The 0.5 s and 1 s comparisons replayed a warm shared feature bank. The 2 s timings include actual extractions, so the pilot does not establish a speedup against independent cold runs of the other strides.
- The timings are from one model pilot, not repeated latency measurements. The full pilot wall time was 154.514 s, of which 146.323 s was the sum of the 30 extraction timings. Model loading was inside the full pilot interval, but outside the index and search intervals in the table.
- The result suggests measuring how quickly the cache grows on longer videos and separately testing two query policies: return cached matches immediately, or compute additional detail before returning results.

## Evidence

The numbers are transcribed from the original October 16 pilot handoff and the separate review, which recalculated the retrieval metrics from the saved measurements at the time. This page is a historical write-up, not a rerun. The original measurement JSON and clip are not bundled here. The [ScenePick project walkthrough](https://qiita.com/daikubo/items/f1c3cbd0b306a17c27f3) and the repository below document the base tool; they are not the reproduction package for this pilot.
