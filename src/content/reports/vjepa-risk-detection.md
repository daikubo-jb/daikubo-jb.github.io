---
kind: "report"
title: "V-JEPA 2: Two ways to score risk intervals"
description: "I compared masked prediction error and a linear classifier on frozen video features."
purpose: "Could V-JEPA 2 help find the parts of a driving video labeled as risky? I compared two scores on the same frames: how hard the end of each clip was to predict, and what a small classifier could learn from the clip’s features."
project: "JEPA Risk Detection"
tags: ["V-JEPA 2", "Risk intervals", "Masked prediction", "Linear probe"]
source: "https://github.com/daikubo-jb/jepa-risk-detection/blob/main/ab-result.en.md"
---

## Method

I used 1,500 videos from the [Nexar Collision Prediction training split](https://huggingface.co/datasets/nexar-ai/nexar_collision_prediction), with 1,200 for internal training and 300 for validation. For videos with a collision or near miss annotation, the risk interval starts at the dataset’s alert timestamp and ends before the event timestamp.

The experiment evaluated 2-second windows of 64 frames, moving the window forward by 0.5 seconds each time. V-JEPA 2 stayed frozen in both approaches:

- **Prediction error:** Predict the features of the last 16 frames from the first 48. After observing the full window, compare those predictions with features from the target encoder and average the absolute differences. There is no trained classifier for this score.
- **Linear probe:** Average the features from all 64 observed frames into a single 1,024-value vector. Fit feature scaling and logistic regression on labeled training windows, then use the probe’s output as the risk score.

Each score could first be used at the end of its window and was assigned to frames until the next decision time.

## Results

<figure>
  <img src="../../media/vjepa-risk-baseline-ap.svg" alt="Frame average precision on a zero-based axis: constant score 0.024011, prediction error 0.037674, linear probe 0.144671." width="560">
  <figcaption>Chart drawn for this page from the <a href="https://github.com/daikubo-jb/jepa-risk-detection/blob/main/ab-result.en.md">original A/B results</a>. It contains aggregate measurements, not video frames or scores for individual videos.</figcaption>
</figure>

The 300 validation videos yielded 21,554 windows and **321,931 common scored frames**, including 7,730 positives. Average precision (AP) measures how well the score ranks positive frames near the top. It is not classification accuracy. Giving every frame the same score yields an AP of 0.024011, the positive fraction of this scored set.

| Score | Frame AP | Frame ROC AUC |
| --- | ---: | ---: |
| Constant score | 0.024011 | — |
| Masked prediction error | 0.037674 | 0.633691 |
| Frozen features + linear probe | 0.144671 | 0.801785 |

Both scores beat the constant-score baseline. The probe ranked risk-labeled frames better in this setup, but it also used risk labels during training whereas the prediction-error score did not.

## Limits

The same validation set was used to choose the probe’s regularization strength and the event thresholds, then to report results. Nearby frames from the same video are not independent, and there was no official test-set evaluation. The comparison does not isolate why the scores differ.

The prediction-error score needs to see the target frames before it can measure an error. Neither method was evaluated here as an advance collision warning system.

[Original Japanese write-up](https://qiita.com/daikubo/items/6542ba39a91e0abf7aa6) · [Dataset paper: Moura, Zhu and Zvitia (2025)](https://arxiv.org/abs/2503.03848)
