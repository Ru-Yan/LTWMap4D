# LTMap3D Technical Portfolio · R3 · 2026-08-31

## Pages
- `/index.html` — unified project landing page
- `/ltmap/index.html` — LTMap perception / temporal semantic mapping
- `/vggt/index.html` — VGGT-Omega reconstruction
- `/world-model/index.html` — LTMap-conditioned World Model

## R3 LTMap redesign
R3 cleanly separates **LTMap perception/mapping** from **World Model forecasting**.

### Interactive teaser
- Uses the full 360-degree current LiDAR PLY for scene-1094 anchors 020-023 (34,656-34,720 points/frame), rather than the earlier 18k sampled Canvas2D subset.
- Uses native WebGL buffers; cumulative mode renders up to 138,752 aligned LiDAR points in one GPU draw call.
- Frame slider and autoplay update camera, point cloud, semantic coloring, current vector-map support and track history together.
- Historical LiDAR is aligned with the supplied ego->global SE(3) into frame-023 ego coordinates before accumulation.
- `Accumulated observations` means aligned sensor history only. Persistent Static Memory is not rendered in the LTMap teaser.
- Dynamic semantic colors are assigned to current LiDAR points using current-frame 3D object boxes.
- Current vector-map support uses frozen current-only LTMap raw channels 6/7/8: divider / boundary / pedestrian crossing proximity.
- Track trails use history states through t0 only; no future GT enters this viewer.

### LTMap-only quantitative evidence
The following are shown on `/ltmap` instead of downstream I²-World metrics:
- 40-frame frozen regression sequence
- 4,366 accumulated dynamic entity observations
- 481 vector-map elements at threshold 0.50: 251 divider / 172 boundary / 58 pedestrian crossing
- 0 VLM runtime-error frames in the frozen 40-frame audit
- 4-frame raw viewer: 52 unique entity IDs; 38 seen in >=2 frames; 25 in >=3; 15 in all four displayed frames
- full aligned LiDAR accumulation: 34,720 -> 69,408 -> 104,064 -> 138,752 points
- threshold stability table at 0.30 / 0.40 / 0.50

### Metric separation
`Full LTMap - I²-World`, occupancy IoU, semantic IoU, multi-scene forecasting and 0.5-3.0 s horizon curves are downstream **World Model** experiments and remain on `/world-model`; they are no longer presented as LTMap perception metrics.

## Design reference
The LTMap page follows the common temporal-HD-mapping research project-page pattern used by work such as MapTracker, StreamMapNet and MapTR: large temporal teaser first, concise method overview, qualitative sequence, then quantitative evidence. No external paper metric is re-labeled as an LTMap result.

## Scientific / portfolio boundary
- The public page foregrounds the strongest supported LTMap evidence and representative successful visuals.
- It does not fabricate SOTA, alter measured values, change evaluation protocols, or label local regression statistics as a public benchmark.
- Detailed downstream limitations remain attached to the World Model experiment records rather than dominating the LTMap perception landing page.
- The final BusStation / DistrictEntrance / Junction Business-Perception asset bundle is still separate; once supplied, those Precision/Recall/F1 results can be inserted as the Open-World Semantic Entity section.

## Local preview
```bash
cd LTMap3D_PORTFOLIO_SITE_R3_20260831
python3 -m http.server 8080
```
Open `http://127.0.0.1:8080/ltmap/`.

## Deployment
Upload this directory as the website root and preserve relative paths.
