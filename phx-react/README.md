# Wander: React front-end with an Elixir Phoenix backend

See `../README.md` for general information about the project.

## Setup

There are a few steps to get the app up and running. At a glance:

1. Fetch Elixir dependencies with `mix`.
2. Fetch JavaScript dependencies for React with `npm`.
3. Start a PostgreSQL database server with Docker Compose (not strictly
   required, but it's easy and we haven't documented other setups).
4. Ask Ecto to do any database initialization it needs.
5. Set up a database for OpenStreetMap (OSM) data.
6. Download an OSM extract for a region we're interested in.
7. Import the OSM data into our database with `osm2pgsql`.
8. (OPTIONAL) Generate vector tiles with _tilemaker_.
9. Start the application!

### Prerequisites

These are the programs you'll need to install to follow this guide:

- [Erlang](https://www.erlang.org/downloads)
- [Elixir](https://elixir-lang.org/install.html)

- [NodeJS](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or another
  program capable of pulling and running containers from a Docker Compose file)

- [osm2pgsql](https://osm2pgsql.org/doc/install.html)

Software management is different on every operating system distribution, so
please look for instructions on what the options are for installing software on
your particular system (Windows, macOS, various Linux distros, etc.).

If you need to get started _right now_ and your machine isn't set up for
development, the fastest path might be to download official installers from
each project's website. A more managable solution in the long term is to use a
package manager; all major desktop Linux distributions come with a package
manager built-in (`apt`, `pacman`, `zypper`, etc.), macOS has
[Nix](https://nix.dev/) and [Homebrew](https://brew.sh/), and Windows has
[WinGet](https://learn.microsoft.com/en-us/windows/package-manager/) and
[Nuget](https://learn.microsoft.com/en-us/nuget/what-is-nuget).

### (1) Fetch Elixir dependencies

Change (`cd)` to the root directory of the project, `phx-react`, and run the
following command in a shell:

```sh
mix deps.get
```

### (2) Fetch JavaScript dependenices

Change to the React directory at `phx-react/apps/wander_web/assets` and run the
following command:

```sh
npm install
```

### (3) Start a PostgreSQL server

Change back to the root directory, `phx-react`, and run the following command:

```sh
docker-compose up -d
```

Open the Docker Desktop dashboard to verify that the `postgis` image was
pulled, a volume was created, and the container is running. You can also do
this from the shell:

```sh
docker images
docker volume ls
docker container ls
```

### (4) Initialize databases with Ecto 

From the root directory, run the following command:

```sh
mix ecto.setup
```

### (5) Set up a database for OpenStreetMap (OSM) data

From this step forward, things get a little more involved. Note that we aren't
doing any security hardening or performance optimization here; if you are
interested in those things, that will be your responsibility until we get the
production story worked out.

This part is based on the osm2pgsql manual: https://osm2pgsql.org/doc/manual.html

At a glance, here's what we need to do:

1. Connect to the Docker container and start a shell inside it so we can run
   some commands.
2. Create a PostgreSQL user called `osmuser`.
3. Create a PostgreSQL database called `osm`.
4. Load the extensions `postgis` and `hstore` into the `osm` database. They
   should already be installed in the `postgis` Docker image.

Here are some documentation links you may find helpful:

- Docker
  - https://docs.docker.com/reference/cli/docker/container/ls/
  - https://docs.docker.com/reference/cli/docker/container/exec/
- PostgreSQL
  - https://www.postgresql.org/docs/current/app-createuser.html
  - https://www.postgresql.org/docs/current/app-createdb.html
  - https://www.postgresql.org/docs/current/app-psql.html
  - https://www.postgresql.org/docs/current/sql-createextension.html
    - https://www.postgresql.org/docs/current/catalog-pg-extension.html
  - https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-CREATE

Please **type these commands yourself**, one-by-one, step-by-step, verifying
that things worked after each command. Don't try to copy/paste them into a
script.

```sh
# Get the Docker container ID.
docker container ls
CONTAINER_ID=b796ee122c78  # replace with your own!

# Connect to the container.
docker container exec -it ${CONTAINER_ID} sh
#  -i, --interactive   Keep STDIN open even if not attached
#  -t, --tty           Allocate a pseudo-TTY

# (Now we are in a shell on the PostgreSQL server.)

# Verify that the `postgres` user exists.
cat /etc/passwd | grep postgres

# Switch to the `postgres` user.
su postgres

# The PostgreSQL client and server applications should be here:
ls -1 /usr/lib/postgresql/17/bin/

# ... otherwise we can find out where they are. We just want to make sure the
# PostgreSQL utilities are available and get a bearing on where they are.
which createuser
which createdb
which psql

# Let's set up the database now.
createuser osmuser
createdb --encoding=UTF8 --owner=osmuser osm
psql osm --command='CREATE EXTENSION postgis;'
psql osm --command='CREATE EXTENSION hstore;'

# Verify that the new user exists:
psql --command='\du'
#                             List of roles
# Role name |                         Attributes
#-----------+------------------------------------------------------------
# osmuser   |
# postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS

# Verify that the extensions are loaded:
psql osm --command='\dx'
#                                 List of installed extensions
#   Name   | Version |   Schema   |                        Description
# ---------+---------+------------+------------------------------------------------------------
#  hstore  | 1.8     | public     | data type for storing sets of (key, value) pairs
#  plpgsql | 1.0     | pg_catalog | PL/pgSQL procedural language
#  postgis | 3.5.2   | public     | PostGIS geometry and geography spatial types and functions

# ...alternatively:
psql osm --command='SELECT * FROM pg_extension;'
#  oid  | extname | extowner | extnamespace | extrelocatable | extversion | extconfig |           extcondition
# -------+---------+----------+--------------+----------------+------------+-----------+-----------------------------------
#  13546 | plpgsql |       10 |           11 | f              | 1.0        |           |
#  19744 | postgis |       10 |         2200 | f              | 3.5.2      | {20066}   | {"WHERE NOT (                    +
#  ...   |         |          |              |                |            |           | ...
#  20826 | hstore  |       10 |         2200 | t              | 1.8        |           |

# Let's also create a schema for `osm2pgsql` settings, otherwise it will use the 
# `public` schema by default. This allows us to easily
# `DROP SCHEMA osm2pgsql CASCADE;` to delete everything if we want to start
# over.
psql osm --command='CREATE SCHEMA osm2pgsql AUTHORIZATION osmuser;'

# Now let's set a password for `osmuser`. We'll need to type this in later on
# when import the OSM data.
psql
\password osmuser
# Type a password now, e.g., 'osmuser' or whatever you want.
\q

# All done! You can Ctrl-D your way out of all these shells now.
```

Phew! Onto the next step.

### (6.1) Download an OSM extract

The entire OpenStreetMap database, `Planet.osm`, is _huge_. It's a lot easier,
faster, and less error-prone to get started with a small subset of the data.
You can work your way up to larger regions as you become more familiar with the
ecosystem.

There are various providers, some free, some paid, that offer subsets of
`Planet.osm` called "extracts". Which one you choose depends on where you are
and your needs. Take a look at this wiki page to see some of the offerings:

- https://wiki.openstreetmap.org/wiki/Planet.osm
- https://wiki.openstreetmap.org/wiki/Planet.osm#Extracts

Please use these resources responsibility and pay attention to any rules your
provider lays out. Servers aren't free.

In my case, I've used extracts graciously provided by Geofabrik:

- https://download.geofabrik.de/

Navigate to the **smallest** extract they offer for your region of interest and
download the `(region)-latest.osm.pbf` file.

Geofabrik says when the extract was last updated, e.g., "2025-06-18T20:21:30Z",
so I like to put that in my `pbf`'s filename by renaming
`(region)-latest.osm.pbf` to `(region)_2025-06-18_20-21-30.osm.pbf`.

### (6.2) Add the extract to the project

Place the `.osm.pbf` file in `phx-react/scripts/osm_extracts`.

Then run `phx-react/scripts/init-osm-extract.sh <path_to_your_extract>`.

### (7) Import the OSM data into the database with `osm2pgsql`

> Be sure to complete step (6.2) before continuing.

Run `phx-react/scripts/init-osm-database.sh --help` to see what options are
available and their default values.

Run it when you're ready.

```sh
./phx-react/scripts/init-osm-database.sh
```

It will ask you for the password you set for "osmuser" at the end of step (5).
Type that in and press enter.

This will take a few minutes to finish, depending on the size of your extract
and computer specs.

After it's done, if you want, connect to the database in your SQL/PostgreSQL
client of choice (e.g., `psql`, [pgAdmin](https://www.pgadmin.org/), [JetBrains
DataGrip](https://www.jetbrains.com/datagrip/), or something other) and take a
look at the tables in the "osm2pgsql" schema in the "osm" database.  All the
data from your OSM extract should be in there!

#### (OPTIONAL) How to start over

If you want to start over, all you have to do is drop the `osm2pgsql` schema in
the `osm` database and then recreate it.

```sh
# Get the Docker container ID.
docker container ls
CONTAINER_ID=b796ee122c78  # replace with your own!

# Connect to the container.
docker container exec -it ${CONTAINER_ID} sh

# Switch to the `postgres` user.
su postgres

psql osm --command='DROP SCHEMA osm2pgsql CASCADE;'
psql osm --command='CREATE SCHEMA osm2pgsql AUTHORIZATION osmuser;'

# You can exit the container shell now.
```

Now you can go back to step (7).

### (8) (OPTIONAL) Generate vector tiles with _tilemaker_

> Be sure to complete step (6.2) before continuing.

Run `phx-react/scripts/init-osm-tiles.sh`. Follow the instructions when it completes.

### (9) Start the application

Change to the project's root directory, `phx-react`, and run the following
command:

```sh
iex -S mix phx.server
```

This will start the server and connect an [interactive Elixir (IEx)
shell](https://hexdocs.pm/elixir/introduction.html#interactive-mode) to it. You
can run Elixir commands here.

You should be able to visit the URL it prints to start using the application!

```sh
# ...
# [info] Access WanderWeb.Endpoint at http://localhost:4000
# ...
```

#### Stopping the server

You can stop the server by pressing <kbd>Ctrl</kbd> + <kbd>c</kbd>, followed
by <kbd>a</kbd> (for **a**bort) and <kbd>Enter</kbd>:

```
BREAK: (a)bort (A)bort with dump (c)ontinue (p)roc info (i)nfo
       (l)oaded (v)ersion (k)ill (D)b-tables (d)istribution
a
```

## License

Copyright (c) 2025 Peyton Seigo

Licensed under the Apache License, Version 2.0 (the "License");
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

