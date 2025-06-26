#!/bin/sh
set -e

# Exit status codes.
S_OK=0
S_ERROR=1
S_ABORT=2

SCRIPT_DIR_PATH="${0%/*}"
SCRIPT_NAME="${0##*/}"

GENERIC_EXTRACT_NAME="extract-latest.osm.pbf"
GENERIC_EXTRACT_PATH="$SCRIPT_DIR_PATH/osm_extracts/$GENERIC_EXTRACT_NAME"

OSM2PGSQL_DIR_PATH="$SCRIPT_DIR_PATH/osm2pgsql"

print_help() {
  cat << EOF
usage: ${SCRIPT_NAME} [-h | --help] [options]

options:
       --cache <cache_size>
           Cache size (in MB) for osm2pgsql. Defaults to \`500\`.

           > Generally more cache means your import will be faster. But keep in
           > mind that other parts of osm2pgsql and the database will also need
           > memory. [...]
           >
           > To decide how much cache to allocate, the rule of thumb is as
           > follows: use the size of the PBF file you are trying to import or
           > about 75% of RAM, whatever is smaller. Make sure there is enough
           > RAM left for PostgreSQL. It needs at least the amount of
           > \`shared_buffers\` given in its configuration.
           >
           > You may also set \`--cache\` to 0 to disable caching completely to
           > save memory. If you use a flat node store you should disable the
           > cache, it will usually not help in that situation.
           >
           > -- https://osm2pgsql.org/doc/manual.html#caching

       --host <host_address>
           PostgreSQL host address. Defaults to \`localhost\`.

       --port <port>
           PostgreSQL port. Defaults to \`5432\`.

       --user <user>
           PostgreSQL user. Defaults to \`osmuser\`.

       --database <database>
           PostgreSQL database. Defaults to \`osm\`.

       --schema <schema>
           PostgreSQL schema within the database. Defaults to \`osm2pgsql\`.
EOF
}

## Exits with error status if `value` is missing.
##
## @param `option` - A "--" option.
## @param `value`
##
ensure_long_option_has_value() {
  if [ $# -lt 2 ]; then
    >&2 echo "error: Missing value for option '$1'."
    exit $S_ERROR
  fi

  case "$2" in
    "" | -* )
      >&2 echo "error: Missing value for option '$1'."
      exit $S_ERROR
      ;;
  esac
}

# 'Help' option overrides all other arguments.
for arg in "$@"; do
  if [ "$arg" = "-h" ] || [ "$arg" = "--help" ]; then
    print_help
    exit $S_OK
  fi
done

# Default parameter values.
CACHE_SIZE_MB=500
PG_HOST=localhost
PG_PORT=5432
PG_USER=osmuser
PG_DATABASE=osm
PG_SCHEMA=osm2pgsql

# Parse arguments.
while [ $# -gt 0 ]; do
  case "$1" in
    # Long options.
    --* )
      ensure_long_option_has_value $1 $2

      case "$1" in
        --cache )
          CACHE_SIZE_MB="$2"
          ;;

        --host )
          PG_HOST="$2"
          ;;

        --port )
          PG_PORT="$2"
          ;;

        --user )
          PG_USER="$2"
          ;;

        --database )
          PG_DATABASE="$2"
          ;;

        --schema )
          PG_SCHEMA="$2"
          ;;

        * )
          >&2 echo "error: Unknown option '$1'."
          exit $S_ERROR
          ;;
      esac

      shift 2
      ;;

    # Abbreviated options.
    -* )
      >&2 echo "error: Unknown option '$1'."
      exit $S_ERROR
      ;;

    # Non-option arguments.
    * )
      >&2 echo "error: Unknown argument '$1'."
      exit $S_ERROR
      ;;
  esac
done

INIT_OSM_EXTRACT_MSG="Run scripts/init-osm-extract.sh on an OSM extract."

if ! [ -L "$GENERIC_EXTRACT_PATH" ] && ! [ -e "$GENERIC_EXTRACT_PATH" ]; then
  >&2 echo "error: File '$GENERIC_EXTRACT_PATH' does not exist. ($INIT_OSM_EXTRACT_MSG)"
  exit $S_ERROR
fi
# Extract is some sort of file.

EXTRACT_PATH=$(readlink -f "$GENERIC_EXTRACT_PATH")

if [ -L "$EXTRACT_PATH" ] && ! [ -e "$EXTRACT_PATH" ]; then
  >&2 echo "error: Followed '$GENERIC_EXTRACT_PATH' but lead to broken symbolic link '$EXTRACT_PATH'. ($INIT_OSM_EXTRACT_MSG)"
  exit $S_ERROR
fi
# Extract is not a broken symlink.

if ! [ -e "$EXTRACT_PATH" ]; then
  >&2 echo "error: '$EXTRACT_PATH' is not a regular file. ($INIT_OSM_EXTRACT_MSG)"
  exit $S_ERROR
fi
# Extract is a regular file.

echo "[info][$SCRIPT_NAME] Will initialize database from the following OSM extract:"
echo ""
echo "    $EXTRACT_PATH"
echo ""
printf "Continue? [y/N]> "
read user_confirmation_response

case "$user_confirmation_response" in
  y | Y | [yY][eE][sS] )
    ;;

  * )
    echo "Aborting."
    exit $S_ABORT
    ;;
esac

echo
echo "[info][$SCRIPT_NAME] Initializing OSM database..."

set -x
osm2pgsql \
  --create --slim \
  --cache=$CACHE_SIZE_MB \
  --extra-attributes \
  --output=flex \
  --style="$OSM2PGSQL_DIR_PATH/styles/flex/wander.lua" \
  --host="$PG_HOST" --port="$PG_PORT" \
  --user="$PG_USER" --password \
  --database="$PG_DATABASE" --schema="$PG_SCHEMA" \
  "$EXTRACT_PATH"
set +x

echo
echo "[info][$SCRIPT_NAME] OSM database initialized!"

exit $S_OK

