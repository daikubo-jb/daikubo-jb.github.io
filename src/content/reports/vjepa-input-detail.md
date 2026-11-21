---
kind: "report"
title: "V-JEPA 2: Does losing image detail hurt risk scoring?"
description: "I reduced image detail at three settings while keeping model input size fixed, then refit the probe for each setting."
purpose: "I wanted to see whether a frozen V-JEPA 2 encoder still provided useful features for ranking risk intervals when some of the image detail was removed."
project: "JEPA Risk Detection"
tags: ["V-JEPA 2", "Risk intervals", "Input detail", "Linear probe"]
source: "https://github.com/daikubo-jb/jepa-risk-detection/blob/main/reports/jepa-low-resolution-probe-refit-20261016.en.md"
---

<figure>
  <img src="../../media/vjepa-risk-detail-input.svg" alt="Diagram showing three paths from a 256 by 256 letterboxed frame: unchanged, downsampled to 128 then enlarged to 256, or downsampled to 64 then enlarged to 256. Every path ends at the same frozen encoder input size." width="560">
  <figcaption>Original diagram of the preprocessing described in the <a href="https://github.com/daikubo-jb/jepa-risk-detection/blob/main/reports/jepa-low-resolution-probe-refit-20261016.en.md">experiment record</a>. The grid symbols illustrate relative detail; they are not footage or actual model tokens.</figcaption>
</figure>

## Method

All three conditions used the same 2-second, 64-frame windows and frozen V-JEPA 2 encoder. I first letterboxed each frame to 256 × 256, preserving its aspect ratio and filling the empty space. For the lower-detail conditions I shrank this image to 128 × 128 or 64 × 64, then resized it back to 256 × 256. Enlarging it again did not restore the discarded detail. The encoder always saw the same input dimensions and token grid.

I separately refit the feature scaler and class-balanced logistic regression probe on each version of the **160 training videos** (11,390 windows). All conditions were scored on the same **40 validation videos** (2,905 windows), with no overlap between the two sets. Both sets came from the [Nexar Collision Prediction training split](https://huggingface.co/datasets/nexar-ai/nexar_collision_prediction).

## Results

| Detail before final resize | Validation window AP | Difference from 256 (95% interval) | Validation frame AP |
| --- | ---: | ---: | ---: |
| 256 × 256 | 0.144516 | Reference | 0.104294 |
| 128 × 128 | 0.107617 | −0.036898 \[−0.184652, +0.083747\] | 0.082793 |
| 64 × 64 | 0.101968 | −0.042548 \[−0.199979, +0.072646\] | 0.083509 |

Window average precision (AP) was the primary metric. It measures ranking of risk-labeled windows, not accuracy. The intervals come from 1,000 paired bootstrap resamples, each using the same resampled validation videos across conditions. The window AP point estimates fell as detail was reduced, but both intervals include zero. This pilot did not establish a reliable drop or show equivalence. Window AP and frame AP are different evaluation units, so their magnitudes are not directly comparable.

## Limits

This was a fixed validation pilot, not an independent holdout or the official test split. An earlier fixed probe used 1,200 training videos, so comparing it directly with the 160-video probes would not show whether refitting restored performance.

All three conditions still fed 256 × 256 inputs to the encoder, and the experiment did not measure runtime or memory savings. It did not test advance collision warnings. The [original Japanese write-up](https://qiita.com/daikubo/items/95cb7e54528c2d3087b0) also notes that the comparison-specific scripts and aggregation procedure were not released, so the public repository alone does not reproduce this run.

[Dataset paper: Moura, Zhu and Zvitia (2025)](https://arxiv.org/abs/2503.03848)
