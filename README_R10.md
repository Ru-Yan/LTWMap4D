# LTMap3D Portfolio R10

- LTMap qualitative section restores the authoritative scene-1094 frontend iframe. Run `./OPEN_SITE.sh` so its JSON/BIN fetches work; direct file:// opening shows a clean instruction instead of a broken/error frontend.
- Local rebuild package can replace the bundled preview frontend with the real `runs/scene1094_align_check/frontend_input` subset (Frames 013-016, dynamic threshold 0.40, static threshold 0.20, pedestrian display ID anchored to F013).
- WM qualitative expands from one case to four representative cases with a case selector and 0.5-3.0 s horizon slider.
- 2D BEV now overlays real historical dynamic tracks and current entity positions. Track overlay is conditioning history, not a fabricated future GT trajectory.
- 3D occupancy and GT are independently rendered per horizon.
