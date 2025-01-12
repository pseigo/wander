#!/bin/sh
set -e

# Get script path.
SCRIPT_SOURCE="${0:A}"
DIR=$(dirname "$SCRIPT_SOURCE")

# Debug
#echo "SCRIPT_SOURCE=$SCRIPT_SOURCE"
#echo "DIR=$DIR"
#echo "$(pwd)"

cd "$DIR/.."

ctags \
  --exclude=_build \
  --exclude=.elixir_ls \
  --languages=Elixir,Erlang,JavaScript,TypeScript \
  --extras=+q \
  --recurse \
  -f tags \
  .
