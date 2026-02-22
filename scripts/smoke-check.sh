#!/usr/bin/env bash
set -euo pipefail

FILES=(
  index.html
  sw.js
  server.js
)

while IFS= read -r -d '' file; do
  FILES+=("$file")
done < <(find js -type f \( -name '*.js' -o -name '*.mjs' \) -print0 | sort -z)

for file in "${FILES[@]}"; do
  if [[ "$file" == *.js || "$file" == *.mjs ]]; then
    node --check "$file"
  fi
done
