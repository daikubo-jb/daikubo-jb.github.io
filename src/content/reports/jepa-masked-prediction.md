---
kind: "report"
title: "V-JEPA 2: Can it rank completions of a hidden region?"
description: "A four-case synthetic pilot compared latent prediction with straight-line interpolation."
purpose: "I wanted to see whether V-JEPA 2 could pick the correct completion when the middle of a moving ball’s path was hidden, and whether it did better than a simple interpolation baseline."
project: "JEPA Masked Prediction"
tags: ["V-JEPA 2", "Masked prediction", "Synthetic video"]
source: "https://github.com/daikubo-jb/jepa-masked-prediction-public"
---

<figure>
  <img src="../../media/jepa-masked-prediction-mask.svg" alt="Selected frames 28, 30, 31, 33 and 35 on a timeline. The center of frames 30 through 33 is withheld while the rest remains visible." width="680" height="244" decoding="async">
  <figcaption>Diagram of the partial mask. It illustrates the documented setup; it is not a frame from the experiment. On frames 30–33, only the center is hidden.</figcaption>
</figure>

## Method

I used four synthetic cases from the November 1 pilot. Each case had four candidate clips of a blue ball moving across a background. Each clip contained 64 frames at 64 × 64 pixels. The candidates were identical outside frames 30–33. Within that interval, only the central region differed: the generator’s answer continued the ball’s straight path, while the other candidates moved the ball up or down.

After resizing and cropping to 256 × 256 pixels, I withheld the central 8 × 8 spatial patches in two two-frame groups, or 128 tokens out of 8,192. The rest of those frames stayed visible, along with the frames on both sides. V-JEPA 2 predicted features for the masked tokens. I ranked the completions by mean absolute error between those predicted features and each candidate’s normalized target features. No task-specific training was involved.

The image-space baseline fitted a straight line to the visible ball centers on both sides, then ranked the candidates by pixel mean absolute error in the central 32 × 32 region of the four target frames. I also included a seeded random order and a visible-context-only comparison. The latter tied all candidates because their visible context was identical.

## Results

| Method | Correct candidate alone in first place | Tie-aware top-1 | Tie-aware MRR |
| --- | ---: | ---: | ---: |
| V-JEPA 2 masked-context predictor | 4/4 | 1.000 | 1.000 |
| Image-space constant-velocity interpolation | 4/4 | 1.000 | 1.000 |
| Seeded random order, observed | 2/4 | 0.500 | 0.708 |
| Visible-context encoder only, all tied | 0/4 | 0.250 | 0.521 |

MRR is the mean of the reciprocal rank of the correct candidate. Tie-aware scores average over possible orders within a tie. Random ordering of four candidates has a theoretical top-1 probability of 25%; the observed 2/4 above is just this set of four cases.

V-JEPA 2 put the correct candidate first in all four cases, but so did straight-line interpolation. Comparison is by rank: the two methods measure errors in different spaces.

## Limits

Four synthetic cases with no held-out seeds are not enough to show a model advantage or performance on real video. The experiment ranked supplied candidates. It did not reconstruct pixels or predict future frames without seeing what came after the gap.

This page summarizes saved results; I did not rerun the model for this page. The public snapshot includes the generator, fixture metadata, code, and saved results, but the generated input frames are not bundled and a clean-environment model rerun is not established. The diagram is therefore an illustration, not archived test footage.

[Original pilot report and links to the recorded results](https://github.com/daikubo-jb/jepa-masked-prediction-public/blob/main/reports/jepa-masked-prediction-results-20261101.md)
