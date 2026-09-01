#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROUTE="${1:-ltmap/}"
PIDFILE="$HERE/.site_server.pid"; PORTFILE="$HERE/.site_server.port"; LOG="$HERE/.site_server.log"
PY="${PYTHON:-python3}"; command -v "$PY" >/dev/null 2>&1 || PY=python
if [ -f "$PIDFILE" ]; then P="$(cat "$PIDFILE" 2>/dev/null || true)"; if [ -n "$P" ] && kill -0 "$P" 2>/dev/null; then PORT="$(cat "$PORTFILE")"; URL="http://127.0.0.1:${PORT}/${ROUTE}"; echo "$URL"; command -v xdg-open >/dev/null 2>&1 && xdg-open "$URL" >/dev/null 2>&1 || true; exit 0; fi; fi
PORT=$("$PY" - <<'P'
import socket
s=socket.socket(); s.bind(('127.0.0.1',0)); print(s.getsockname()[1]); s.close()
P
)
echo "$PORT" > "$PORTFILE"
nohup "$PY" "$HERE/editable_server.py" --port "$PORT" --bind 127.0.0.1 --directory "$HERE" >"$LOG" 2>&1 &
echo $! > "$PIDFILE"; sleep .8
URL="http://127.0.0.1:${PORT}/${ROUTE}"; echo "$URL"; command -v xdg-open >/dev/null 2>&1 && xdg-open "$URL" >/dev/null 2>&1 || true
