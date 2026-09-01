# LTMap3D Portfolio Site R9

- Fixed LTMap file:// failure by replacing the embedded fetch-dependent iframe with a file-safe static evidence preview.
- WM quantitative layout: public benchmark table full-width; target comparison + measured horizon gain share the next row; removed the redundant static-IoU panel.
- WM qualitative: one representative case only, no videos, OURS vs GT only, synchronized 0.5–3.0 s slider.
- Both 3D occupancy and 2D BEV are rendered from the same raw scientific tensors. GT changes with each horizon.
- Run `./OPEN_SITE.sh` for the full HTTP-served experience. Direct `file://` opening also no longer shows the LTMap fetch error.
