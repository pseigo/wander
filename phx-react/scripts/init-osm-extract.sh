#!/bin/sh
set -e

OK=0
ERROR=1

SCRIPT_DIR_PATH="${0%/*}"
SCRIPT_NAME="${0##*/}"

SYMLINK_NAME="extract-latest.osm.pbf"
SYMLINK_PATH="$SCRIPT_DIR_PATH/osm_extracts/$SYMLINK_NAME"

print_help() {
  echo "usage: ${SCRIPT_NAME} [-h | --help] osm_region_extract"
}

if [ "$#" -ne 1 ] || { [ "$#" -eq 1 ] && [ -z "$1" ]; }; then
  >&2 echo "error: Missing or empty parameter."
  print_help
  exit $ERROR
fi

if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  print_help
  exit $OK
fi

#if [ "${1:0:1}" = "-" ]; then
if [ "$(printf '%s' "$1" | cut -c 1)" = "-" ]; then
  >&2 echo "error: Unknown option '$1'."
  exit $ERROR
fi

SOURCE_PATH="$1"

if ! [ -e "$SOURCE_PATH" ]; then
  >&2 echo "error: File '$SOURCE_PATH' does not exist."
  exit $ERROR
fi

if [ -e "$SYMLINK_PATH" ] && ! [ -L "$SYMLINK_PATH" ]; then
  >&2 echo "error: File '$SYMLINK_PATH' already exists but it's not a symlink. That name is reserved, please move or rename the file."
  exit $ERROR
fi

# Delete symlink if it already exists.
if [ -L "$SYMLINK_PATH" ]; then
  rm -v "$SYMLINK_PATH"
fi

SOURCE_ABS_PATH=$(readlink -f "$SOURCE_PATH")
SCRIPT_DIR_ABS_PATH=$(readlink -f "$SCRIPT_DIR_PATH")
SOURCE_PATH_ABS_OR_REL_TO_SYMLINK=${SOURCE_ABS_PATH##"$SCRIPT_DIR_ABS_PATH/osm_extracts/"}

ln -sv "$SOURCE_PATH_ABS_OR_REL_TO_SYMLINK" "$SYMLINK_PATH"
