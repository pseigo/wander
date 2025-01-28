import Config

alias Wander.Repos.SlRepo
alias Wander.Repos.PgRepo
alias Wander.Repos.PgOsmRepo

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :wander, SlRepo,
  database: Path.expand("../wander_test.db", __DIR__),
  pool_size: 5,
  pool: Ecto.Adapters.SQL.Sandbox

config :wander, PgRepo,
  types: Wander.Repos.PostgresTypes,
  username: "postgres",
  password: "postgres_v5lmJseKtPBWce",
  hostname: "localhost",
  database: "wander_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: System.schedulers_online() * 2

config :wander, PgOsmRepo,
  types: Wander.Repos.PostgresTypes,
  username: "postgres",
  password: "postgres_v5lmJseKtPBWce",
  hostname: "localhost",
  database: "wander_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: System.schedulers_online() * 2

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :wander_web, WanderWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "sniqkfpRwzKyx/bPz2ruscJzTDRoUoxdWoPaI9dHPLg0hW4F2idtSsdHCmO/Ux/N",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# In test we don't send emails
config :wander, Wander.Mailer, adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters
config :swoosh, :api_client, false

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Enable helpful, but potentially expensive runtime checks
config :phoenix_live_view,
  enable_expensive_runtime_checks: true
