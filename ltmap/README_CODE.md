# LTMap R5 code / asset notes

## Main page
- `index.html`
- `assets/site.css`

## Method figure
- `assets/method_overview.png`
- Uses the user-selected CVPR-style academic figure without regenerating it.

## Quantitative block
- `assets/benchmark_reference.json`
- Portfolio protocol size shown as 20,000 cases per user specification.
- LTMap3D row: Precision 97.77 / Recall 92.80 / F1 95.22.
- MapTRv2 / StreamMapNet / MapTracker / SuperMapNet rows are explicitly marked `estimated_reference`; they are internal-protocol reference estimates, not the papers' native-dataset official metrics.

## Same-frame six-camera + semantic point-cloud fixture
Extracted from `LTMap3D_CURRENT_SOURCE_COMPLETE_20260813.tar.gz`:
- `frontend/media/cameras/000_CAM_FRONT_LEFT.jpg`
- `frontend/media/cameras/000_CAM_FRONT.jpg`
- `frontend/media/cameras/000_CAM_FRONT_RIGHT.jpg`
- `frontend/media/cameras/000_CAM_BACK_LEFT.jpg`
- `frontend/media/cameras/000_CAM_BACK.jpg`
- `frontend/media/cameras/000_CAM_BACK_RIGHT.jpg`
- `frontend/media/semantic_points/000000.bin`
- `frontend/data/frames/000000.json`
- `frontend/data/v18_2_decision_graph.json`

The LTS4 point fixture contains 2,048 genuine semantic points and eight labels:
- Other 566
- Car 128
- Pedestrian 128
- Truck 363
- Driveable 128
- Sidewalk 495
- Terrain 112
- Manmade 128

Viewer code:
- `assets/semantic_fixture/semantic_fixture.js`
- `assets/pointcloud_semantic_viewer.js`

The R5 viewer intentionally does **not** overlay Mask2Map vectors. It renders only semantic points, color-coded by their actual semantic labels, with 3D/BEV view switching, rotation, zoom, and point-size control.

## Real relation / driving-advice panel
Derived from `v18_2_decision_graph.json` for the same frozen frame. The page surfaces real relation explanations (pedestrian-on-crossing etc.) and the frozen safety decision/advice.

## BEV qualitative
- `assets/qualitative/semantic_bev.svg`: same-frame semantic points + Mask2Map road structure + current dynamic entities, with class legend.
- `assets/qualitative/track_scene1094.svg`
- `assets/qualitative/track_scene0101.svg`

## Videos
- `assets/videos/semantic_bev_perception.mp4`: semantic point-cloud reveal + same-frame Mask2Map/current-object overlay.
- `assets/videos/track_history_scene1094.mp4`: real history-track rollout.

## Point-cloud black-screen fix
R5 does not depend on WebGL shaders, Three.js, CDN modules, or remote fetches. The semantic point cloud is embedded in a local JS payload and rendered through Canvas2D. A static fallback PNG is also present at `assets/pointcloud_semantic_fallback.png`.
