#!/usr/bin/env bash
set -euo pipefail

MAX_ITERS="${1:-10}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
MODE="${2:-safe}"

CODEX_ARGS=(
  --full-auto
  -C "$ROOT"
  -o .ralph-last.txt
  -
)

if [ "$MODE" = "dangerous" ]; then
  CODEX_ARGS=(
    --dangerously-bypass-approvals-and-sandbox
    -C "$ROOT"
    -o .ralph-last.txt
    -
  )
fi

cd "$ROOT"

for i in $(seq 1 "$MAX_ITERS"); do
  echo
  echo "== Ralph iteration $i =="

  rm -f .ralph-last.txt

  cat PROMPT.md | codex exec \
    "${CODEX_ARGS[@]}"

  echo
  echo "-- agent result --"
  if [ -f .ralph-last.txt ]; then
    cat .ralph-last.txt
  fi

  echo
  echo "-- verification --"
  npm test
  npm run build

  if [ -n "$(git status --short)" ]; then
    git add -A
    git commit -m "ralph: iteration $i"
  fi

  if [ -f .ralph-last.txt ] && grep -q "RALPH_COMPLETE" .ralph-last.txt; then
    echo
    echo "Ralph finished."
    exit 0
  fi
done

echo
echo "Reached max iterations without completion."
exit 1
