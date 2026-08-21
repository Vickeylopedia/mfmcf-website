---
name: Asset processing
description: Local fallback for transparent logo preparation when the AI background-removal callback is unavailable.
---

For simple logos on a solid white background, an edge-connected flood fill can remove only the exterior white area while preserving white details enclosed inside the mark.

**Why:** The background-removal callback may be unavailable in the current execution mode, while logo work still needs a transparent PNG deliverable.

**How to apply:** Use ImageMagick with a small fuzz threshold, add a temporary white border, flood fill from a corner, then shave the border and export RGBA PNG; visually inspect the result before presenting it.