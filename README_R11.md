# R11 WM qualitative alignment fix

- GT slider now uses authoritative six-horizon GT from `LTMap3D_WM_FINAL_RAW_VISUAL_MATERIALS_20260831`, not the tail-padded historical eval cache.
- Dynamic history tracks are transformed from nuScenes global coordinates into each horizon's future-ego frame using `future_gt_ego_pose.json`.
- BEV uses forward-up / left-screen-left consistently for both occupancy and tracks.
- The same aligned track history is also rendered in the 3D occupancy view.

See `world-model/R11_FRAME_ALIGNMENT_QA.json`.
