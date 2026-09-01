# R13 — Editable copy + three-business navigation

## 1. In-page text editing

Every HTML text fragment on the home, LTMap, VGGT-Omega, and World Model pages is editable from the page itself.

Run the site with `./OPEN_SITE.sh`, then click the `✎` button at the bottom-right:

- `编辑文字`: click text directly and type.
- `立即保存`: writes edits to `user_edits/<page>.json` when using the bundled editable server.
- Auto-save also writes after editing.
- `Ctrl+S` / `Command+S`: save immediately.
- `导出文案`: export a JSON backup for another computer.
- `导入文案`: restore a JSON backup.
- `清除本页修改`: revert the current page to source copy.

If the page is opened on a normal static server without the bundled save API, browser localStorage is used as a fallback.

Text embedded inside PNG/JPG/WebP method figures is image content and cannot be edited as HTML text.

## 2. Navigation

The top navigation is now three business headings only:

1. `LTMap 长尾场景感知`
2. `VGGT-Omega 三维重建`
3. `LTMap × World Model`

On desktop, hover/focus shows each business submenu and its project sections. On narrow/mobile screens only the three top-level business titles remain visible.

## Run

```bash
chmod +x OPEN_SITE.sh
./OPEN_SITE.sh ltmap/
# or
./OPEN_SITE.sh vggt/
./OPEN_SITE.sh world-model/
```
