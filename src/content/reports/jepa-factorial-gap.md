---
kind: "report"
title: "V-JEPA 2: Changing the background, gap, and wall"
description: "A follow-up to the masked-region pilot compared V-JEPA 2 with two simple baselines over 16 conditions."
purpose: "I wanted to see whether a new background changed the ranking for the same motion, and whether a longer gap or a visible wall changed which completion ranked first."
project: "JEPA Masked Prediction"
tags: ["V-JEPA 2", "Masked prediction", "Synthetic video"]
source: "https://github.com/daikubo-jb/jepa-masked-prediction-public"
---

<figure>
  <img src="../../media/jepa-factorial-gap-results.svg" alt="Saved results on 16 conditions: V-JEPA 2 ranked the answer alone in first place in 4, two-sided interpolation in 12, and the visible-wall rule in 14." width="680" height="270" decoding="async">
  <figcaption>Chart of recorded top-1 counts from the same 16 conditions. These are not new model runs, and the 16 conditions reuse two fixed trajectories.</figcaption>
</figure>

## Method

This follow-up used the completed November 11 experiment record and the November 12 report mirrored in the public snapshot. Each synthetic clip contained 64 RGB frames at 64 × 64 pixels. One fixed ball path followed constant velocity; the other turned near the center. Four candidate clips shared the visible content. Within the hidden central region, three alternatives displaced the ball left, right, or down from the generator’s chosen path.

I changed two sets of conditions:

- **Background:** Two fixed paths, each rendered with three backgrounds: flat, checkerboard, and stationary distractors. The gap was four frames and the wall was shown, for six conditions.
- **Gap and wall:** The same two paths with a flat background, gaps of 4, 8, or 12 frames, and the wall shown or hidden, for twelve conditions. Hiding the wall changed its rendering, not the pre-set ball path.

The two sets overlap in the two flat-background, four-frame, wall-shown cases, so there were **16 unique conditions**, not 18. Masking withheld the central patches for the chosen frames, not the full frames or the later context. The three gap lengths withheld 128, 256, or 384 target tokens. V-JEPA 2 ViT-L/16 predicted masked features, and candidates were ranked by mean L1 difference from their normalized target-encoder features.

The two baselines used 12 visible ball positions on each side of the gap. One fitted a two-sided interpolation; the other could fit a single reflection when a wall was detected in visible frames. Both ranked candidates by squared error in ball-center positions. This is a different score from the November 1 pilot’s pixel error as well as JEPA’s feature error, so I compared ranks, not raw scores.

## Results

| Method | Correct candidate alone in first place | MRR |
| --- | ---: | ---: |
| V-JEPA 2 masked-context predictor | 4/16 | 0.583333 |
| Two-sided constant-velocity interpolation | 12/16 | 0.875000 |
| Two-sided visible-wall rule | 14/16 | 0.937500 |

MRR averages the reciprocal rank of the correct candidate. There were no first-place ties. The baselines were joined to the matching 16 conditions from a saved 72-case set using condition keys and input hashes, not case numbers alone.

**Changing the background:** The correct JEPA ranks stayed at first for the straight path and second for the turn with all three backgrounds. The pooled visible-context representation still changed: mean cosine distance was 0.077030 across six same-path, different-background pairs, and 0.013156 across three same-background, different-path pairs (values rounded). Stable ranks did not mean that the representation was insensitive to background.

**Changing the gap and wall:** For 4-, 8-, and 12-frame gaps respectively, JEPA ranked the straight-path answer 1st, 1st, and 3rd with the wall shown, and 3rd each time with it hidden. The turning-path answer was 2nd in all six gap-and-wall combinations. The visible-wall rule picked the answer in the wall-shown 8- and 12-frame turn cases, where interpolation did not.

## Limits

These are repeated conditions on two fixed trajectories, not 16 independent motions. The paths also differ in speed and position, so this comparison does not isolate the effect of the turn. For the three hidden-wall turn cases, the visible evidence did not uniquely explain the turn. Showing the wall also changed the input to the candidate-side encoder; the rank changes do not isolate understanding of the visible cue. The wall baseline is tailored to the generator.

This report ranks completions with context on both sides, not future-only prediction, pixel reconstruction, or physical understanding in real video. The chart summarizes saved measurements; I did not rerun the model, and a clean-environment rerun remains unverified.

[Original English report, conditions, and saved results](https://github.com/daikubo-jb/jepa-masked-prediction-public/blob/main/reports/factorial-gap-public-20261115-v1/reports/experiment-review-20261112-v1-en.md)
