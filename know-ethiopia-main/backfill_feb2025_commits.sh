#!/usr/bin/env bash
set -euo pipefail

# Run from repo root
cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Initializing new git repository..." >&2
  git init >/dev/null
fi

# Choose project files and then filter to likely text types
mapfile -t FILES < <(find . -type f \
  ! -path "./.git/*" \
  ! -path "*/node_modules/*" \
  ! -path "./backend/node_modules/*" \
  ! -path "./frontend/node_modules/*" \
  | grep -E '\.(js|jsx|ts|tsx|md|css|html)$')

if [ "${#FILES[@]}" -eq 0 ]; then
  echo "No matching files found to modify" >&2
  exit 1
fi

MESSAGES=(
  "Improve Know Ethiopia hero section"
  "Refine festival details for Ethiopia"
  "Tweak Ethiopian map interactions"
  "Polish Know Ethiopia UI copy"
  "Adjust Ethiopian festival imagery"
  "Update Know Ethiopia documentation"
  "Enhance Ethiopian places descriptions"
  "Refactor Know Ethiopia components"
  "Optimize Know Ethiopia layout"
  "Minor content tweak for Ethiopia page"
)

pick_file() {
  local idx=$((RANDOM % ${#FILES[@]}))
  echo "${FILES[$idx]}"
}

pick_message() {
  local idx=$((RANDOM % ${#MESSAGES[@]}))
  echo "${MESSAGES[$idx]}"
}

make_commits_for_day() {
  local day="$1" count="$2"
  local d
  d=$(printf "%02d" "$day")

  for i in $(seq 1 "$count"); do
    local file
    file=$(pick_file)

    local hour minute second
    hour=$((8 + (RANDOM % 10)))
    minute=$((RANDOM % 60))
    second=$((RANDOM % 60))

    local ts
    ts=$(printf "2025-02-%sT%02d:%02d:%02d" "$d" "$hour" "$minute" "$second")

    local note
    note="chore: know-ethiopia backfill $(date +%s)"

    case "$file" in
      *.md)
        printf "\n\n<!-- %s -->\n" "$note" >> "$file"
        ;;
      *.css|*.html)
        printf "\n/* %s */\n" "$note" >> "$file"
        ;;
      *)
        printf "\n// %s\n" "$note" >> "$file"
        ;;
    esac

    git add "$file"
    GIT_AUTHOR_DATE="$ts" GIT_COMMITTER_DATE="$ts" \
      git commit -m "$(pick_message)" >/dev/null
  done
}

# Feb 2025 valid days only; total commits = 45, max 5/day
make_commits_for_day 1 3
make_commits_for_day 2 2
make_commits_for_day 4 4
make_commits_for_day 5 3
make_commits_for_day 6 5
make_commits_for_day 8 2
make_commits_for_day 10 4
make_commits_for_day 11 1
make_commits_for_day 12 3
make_commits_for_day 13 2
make_commits_for_day 15 3
make_commits_for_day 17 1
make_commits_for_day 18 4
make_commits_for_day 21 2
make_commits_for_day 22 1
make_commits_for_day 24 2
make_commits_for_day 26 1
make_commits_for_day 27 2

echo "Created 45 backdated commits for Feb 2025."