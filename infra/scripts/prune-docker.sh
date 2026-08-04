#!/usr/bin/env bash
#
# prune-docker.sh
#
# Periodic Docker cleanup for the GuAI Studio VPS. This VPS has a history of
# disk-full incidents caused by unbounded Docker log/image/volume growth.
# Per-container `logging.max-size`/`max-file` limits in
# infra/docker-compose.yml are the primary defense; this script is a SECOND
# layer that reclaims disk from stopped containers, dangling images, build
# cache, and unused volumes left behind by rebuilds/deploys.
#
# ---------------------------------------------------------------------------
# Setup (run once on the VPS):
#   sudo cp infra/scripts/prune-docker.sh /usr/local/bin/prune-docker.sh
#   sudo chmod +x /usr/local/bin/prune-docker.sh
#   sudo crontab -e
# Use ROOT's crontab (sudo crontab -e, not a plain user crontab): the script
# writes to /var/log/docker-prune.log and `docker system prune` itself needs
# root (or docker-group) privileges either way.
# Add this line to run it weekly, every Sunday at 3:00 AM:
#   0 3 * * 0 /usr/local/bin/prune-docker.sh
# ---------------------------------------------------------------------------
#
# WARNING: `docker system prune -af --volumes` removes ALL:
#   - stopped containers
#   - networks not used by at least one container
#   - dangling AND unused (not just dangling) images
#   - all build cache
#   - all volumes not used by at least one container
# This is safe ONLY because this VPS is single-purpose (runs exactly the
# `infra/docker-compose.yml` stack). Do NOT reuse this script on a host that
# runs other, unrelated Docker workloads without reviewing the flags first.

set -euo pipefail

LOG_FILE="/var/log/docker-prune.log"

log() {
  # Prefix every line with an ISO-8601 timestamp so log rotation / review is
  # straightforward.
  printf '%s %s\n' "$(date --iso-8601=seconds)" "$1"
}

{
  log "Starting docker system prune (containers, networks, images, build cache, volumes)..."
  if docker system prune -af --volumes; then
    log "docker system prune completed successfully."
  else
    status=$?
    log "docker system prune FAILED with exit code ${status}."
    exit "${status}"
  fi
} >> "${LOG_FILE}" 2>&1
