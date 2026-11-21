---
kind: "report"
title: "ScenePick: Can search find the same segment?"
description: "I indexed a six-second synthetic clip and checked whether two query segments came back as the top result."
purpose: "I wanted to check whether ScenePick could read and index a video, then return the exact timestamps when I searched for a segment from that same video."
project: "JEPA-ScenePick"
tags: ["Video search", "Synthetic video"]
source: "https://github.com/daikubo-jb/JEPA-ScenePick/tree/375f75f057edcebd5ea32efefcbbd745e3bdebc4"
media:
  video: "media/scenepick-demo.mp4"
  poster: "media/scenepick-demo.png"
  alt: "A red rectangle and a green circle move against a dark background."
  caption: "I used this six-second synthetic clip as input. A red rectangle and a green circle move against a dark background. I searched for the 0–2 s and 2–4 s segments from this same clip. The still image shows the frame at 1 s."
  heading: "Input video"
  source: "https://github.com/daikubo-jb/JEPA-ScenePick/blob/375f75f057edcebd5ea32efefcbbd745e3bdebc4/samples/synthetic-court-motion-h264.mp4"
  sourceLabel: "Original sample on GitHub"
  license: "media/scenepick-license.txt"
---

## Method

I used AI assistance to plan and run this check, with OpenAI Dot as the tool for this run.

I split the six-second clip into nine two-second windows, starting a new window every 0.5 seconds. The `Color + Motion` baseline samples eight frames per window and describes their colors and frame-to-frame changes.

I queried **0–2 seconds** and **2–4 seconds** from the same clip. ScenePick ranked the indexed windows by cosine similarity and filtered out candidates that were too close in time to higher-ranked results.

I ran this check separately on a Linux CPU with Python 3.12, OpenCV 4.11.0.86, and NumPy 2.2.6. The table below does not reuse the benchmarks stored in the repository.

## Results

| Query segment | Top result | Cosine similarity | Results returned |
| --- | --- | ---: | ---: |
| 0–2 s | 0–2 s | 1.000 | 4 |
| 2–4 s | 2–4 s | 1.000 | 5 |

Both queries returned the exact segment first. The similarity score is not a probability.

## What this test does not show

The query segments were already in the index. This run checked same-segment retrieval with the Color + Motion baseline. It did not measure search accuracy on new footage or test V-JEPA 2.
