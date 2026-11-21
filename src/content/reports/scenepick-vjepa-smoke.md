---
kind: "report"
title: "ScenePick: A one-window check with V-JEPA 2"
description: "The historical integration run indexed one synthetic two-second window on MPS, retrieved it, and saved the selection."
purpose: "I wanted to check that ScenePick could use the V-JEPA 2 encoder to index a short clip, find that indexed window, and save the selected result."
project: "JEPA-ScenePick"
tags: ["Video search", "V-JEPA 2", "Synthetic video"]
source: "https://github.com/daikubo-jb/JEPA-ScenePick/tree/375f75f057edcebd5ea32efefcbbd745e3bdebc4"
media:
  video: "media/scenepick-vjepa-reconstruction.mp4"
  poster: "media/scenepick-vjepa-reconstruction.png"
  alt: "A rectangle and a circle change color and move on a dark background, with brief diagonal white lines."
  caption: "I regenerated this two-second clip with the synthetic generator and settings specified by the archived integration script (32 frames per second), then encoded it as H.264 for playback. The still shows 0.5 s. This is a reconstruction, not the original encoded test file, and it was not used to collect the results below."
  heading: "Reconstructed input video"
  source: "https://github.com/daikubo-jb/JEPA-ScenePick/blob/375f75f057edcebd5ea32efefcbbd745e3bdebc4/src/jepasearch/synthetic.py"
  sourceLabel: "Generator on GitHub"
  license: "media/scenepick-license.txt"
---

## Method

The [archived integration script](https://github.com/daikubo-jb/JEPA-ScenePick/blob/375f75f057edcebd5ea32efefcbbd745e3bdebc4/scripts/vjepa_synthetic_integration.py) generates a silent two-second video and indexes a single window with the V-JEPA 2 ViT-L encoder. It searches for 0–2 s in the same clip, marks the first hit as `keep`, and checks that the decision is present in the exported reference list. The encoder provides the search features. This is not a test of the V-JEPA predictor.

## Results

The [recorded run](https://github.com/daikubo-jb/JEPA-ScenePick/blob/375f75f057edcebd5ea32efefcbbd745e3bdebc4/benchmark-vjepa.json) used the MPS backend on a Mac.

| Check | Recorded result |
| --- | ---: |
| Windows indexed / candidates returned | 1 / 1 |
| Top match | 0–2 s |
| Cosine similarity | 1.000 |
| Preprocessing and encoder | 2.003 s |
| Indexing, including loader | 8.463 s |
| Search, including loader | 6.347 s |

The query returned the only window in the index. The script also checks that there is one saved reference and that its decision is `keep`.

## What this test does not show

This is a check that the V-JEPA 2 path runs end to end. It does not measure retrieval accuracy on other clips. The timings are from one archived run with model loading included where noted, so they do not establish steady-state performance or a speed comparison with Color + Motion. I rebuilt the illustration, not the model run.
