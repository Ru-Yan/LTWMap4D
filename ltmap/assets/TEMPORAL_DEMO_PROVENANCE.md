# LTMap R3 perception-demo provenance

- Public LTMap page contains perception / temporal mapping evidence only. World-model metrics were removed from this page.
- Interactive viewer uses full 360-degree current LiDAR PLY for scene-1094 anchors 020-023 (34,656-34,720 points per frame), aligned by the provided ego->global SE(3) into anchor-023 ego coordinates.
- “Accumulated observations” is sensor-frame accumulation only; it is not Persistent Static Memory.
- Dynamic semantic coloring is assigned from current-frame 3D object annotations/boxes to current LiDAR points.
- Vector-map support is current-only LTMap raw support channels 6/7/8 (divider / boundary / pedestrian-crossing proximity), threshold > 0.5. Persistent/static cache is not rendered.
- Track trails use history_tracks.json only (past states through t0); no future GT is used in the LTMap viewer.
- Quantitative perception-side cards/tables come from the frozen 40-frame LTMap source regression package and the four-frame raw demo sequence. Downstream I²-World / forecasting metrics belong exclusively to /world-model.
