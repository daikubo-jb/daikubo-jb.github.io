---
kind: "report"
title: "V-JEPA 2 vs. 2.1 with square and wide inputs"
description: "I compared two frozen encoders with black-bar padding and with wide inputs that preserved the original aspect ratio."
purpose: "I wanted to compare V-JEPA 2 and 2.1 on the same risk-ranking task and see whether feeding each model a wide image instead of a square with black bars helped."
project: "JEPA Risk Detection"
tags: ["V-JEPA 2", "V-JEPA 2.1", "Risk intervals", "Letterboxing"]
source: "https://github.com/daikubo-jb/jepa-risk-detection/blob/main/reports/vjepa2-vjepa21-square-rectangle-20261025.en.md"
---

## Method

All four conditions used the same videos, sampled frames and labels from the [Nexar Collision Prediction training split](https://huggingface.co/datasets/nexar-ai/nexar_collision_prediction): 160 internal training videos (11,390 windows) and 40 internal validation videos (2,905 windows, 65 positive). Each window covered 2 seconds and contained 64 frames. Windows started 0.5 seconds apart. A window counted as positive when its end timestamp fell within an annotated risk interval.

I kept the source footage’s aspect ratio. For each frozen ViT-L/16 encoder, I extracted pooled features and separately fit a scaler and class-balanced logistic regression probe using only training data.

| Encoder and format | Encoder input (width × height) | Image area within input | Spatial grid (rows × columns) | Total tokens per window |
| --- | --- | --- | --- | ---: |
| V-JEPA 2, square | 256 × 256 | 256 × 144, 56 px black above and below | 16 × 16 | 8,192 |
| V-JEPA 2, wide | 256 × 144 | Entire input | 9 × 16 | 4,608 |
| V-JEPA 2.1, square | 384 × 384 | 384 × 216, 84 px black above and below | 24 × 24 | 18,432 |
| V-JEPA 2.1, wide | 512 × 288 | Entire input | 18 × 32 | 18,432 |

## Results

| Model | Square window AP | Wide window AP |
| --- | ---: | ---: |
| V-JEPA 2 | 0.144516 | 0.103784 |
| V-JEPA 2.1 | 0.057622 | 0.067239 |

Average precision (AP) measures how well the score ranks risk-labeled windows, not accuracy. To estimate uncertainty in the AP differences, I used 1,000 video-level paired bootstrap resamples: each comparison used the same resampled videos in both conditions.

<figure>
  <img src="../../media/vjepa-risk-model-intervals.svg" alt="Four paired window AP differences with 95 percent intervals; every interval crosses zero. Wide minus square is negative for V-JEPA 2 and positive for V-JEPA 2.1. Both model-to-model point estimates are negative." width="560">
  <figcaption>Chart drawn for this page from the aggregate values in the <a href="https://github.com/daikubo-jb/jepa-risk-detection/blob/main/reports/vjepa2-vjepa21-square-rectangle-20261025.en.md">original comparison</a>. Points show AP differences; lines show 95% percentile intervals.</figcaption>
</figure>

| Comparison (first condition minus second) | Window AP difference | 95% interval |
| --- | ---: | --- |
| V-JEPA 2: wide minus square | −0.040731 | \[−0.171811, +0.008179\] |
| V-JEPA 2.1: wide minus square | +0.009617 | \[−0.081012, +0.063030\] |
| Square: V-JEPA 2.1 minus V-JEPA 2 | −0.086894 | \[−0.253621, +0.110627\] |
| Wide: V-JEPA 2.1 minus V-JEPA 2 | −0.036546 | \[−0.127183, +0.070667\] |

The two models moved in opposite directions when switched to wide input. V-JEPA 2 had the higher point estimate in both formats, but all four intervals cross zero. The results establish neither a consistent benefit of wide input nor a clear winner between models.

## Limits

Removing the black bars also changed the spatial token grid for both models. For V-JEPA 2.1 it increased the resolution of the active image, even though total token count stayed constant. These are not padding-only comparisons. The models also differ in pretraining and weights, so the comparison cannot attribute any difference to one change.

These were the same 40 fixed validation videos used previously, not a fresh holdout. Two annotated risk intervals were too short to include a decision timestamp and produced no positive window. No official test split or real-world advance warning performance was evaluated.

[Original Japanese write-up](https://qiita.com/daikubo/items/d1453e895db28fcbede9) · [Dataset paper: Moura, Zhu and Zvitia (2025)](https://arxiv.org/abs/2503.03848)
