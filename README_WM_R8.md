# LTMap3D Portfolio R8 — Drive-OccWorld style World Model page

Main page: `world-model/index.html`

## Design
- Page rhythm inspired by Drive-OccWorld: title/abstract → method overview → quantitative analysis → scene-wise 4D forecasting demos.
- Method overview uses the user-supplied figure unchanged.
- Three scientific rollout videos are composed only from existing Baseline / LTMap / GT prediction renders at horizons 0.5–3.0s.
- Measured controlled-study metrics and public-benchmark target metrics are kept in separate namespaces.

## Benchmark contract
Published comparison rows use Occ3D-nuScenes 3D-occupancy input + GT ego trajectory branch.
The LTMap3D public-benchmark row is an **expected target**, not a measured leaderboard result.

## Data files
- `world-model/assets/data/measured_main_results.csv`
- `world-model/assets/data/measured_per_horizon.csv`
- `world-model/assets/data/public_benchmark_target.csv`
- `world-model/assets/data/public_benchmark_sources.json`
- `world-model/assets/data/internal_target_main_results.csv`
- `world-model/assets/data/internal_target_per_horizon.csv`
