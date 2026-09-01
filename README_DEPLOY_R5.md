# LTMap3D Portfolio Site R5 — MapTR-style LTMap perception update

Open:
- `index.html`
- `ltmap/index.html`
- `vggt/index.html`
- `world-model/index.html`

R5 LTMap changes:
1. 20,000-case quantitative block with strong reference baselines and explicit estimated-reference labeling.
2. BEV qualitative result now includes a real semantic point cloud with semantic legend, same-frame Mask2Map structure, and current dynamic entities.
3. Added semantic BEV perception video plus real temporal-track rollout video.
4. Replaced temporal gray-LiDAR viewer with a six-camera, same-frame, fully semantic-colored LTS4 point-cloud viewer.
5. Removed Map Vector overlays from the interactive point-cloud viewer.
6. Added real same-frame entity-relation explanations and driving advice from the frozen decision graph.

No remote runtime dependency is required for the LTMap viewer.
