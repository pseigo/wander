#!/bin/sh
set -ex

osm2pgsql \
  --create --slim \
  --cache=500 \
  --extra-attributes \
  --output=flex --style=styles/flex/wander.lua \
  --user=osmuser --host=localhost --port=5432 --password \
  --database=osm --schema=osm2pgsql \
  ./data/extract-latest.osm.pbf

