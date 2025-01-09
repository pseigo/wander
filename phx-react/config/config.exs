# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of the Config module.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
import Config

# Configure Mix tasks and generators
config :wander,
  ecto_repos: [Wander.Repo]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :wander, Wander.Mailer, adapter: Swoosh.Adapters.Local

config :wander_web,
  ecto_repos: [Wander.Repo],
  generators: [context_app: :wander, binary_id: true]

# Configures the endpoint
config :wander_web, WanderWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: WanderWeb.ErrorHTML, json: WanderWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Wander.PubSub,
  live_view: [signing_salt: "AScuTFKz"]

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.17.11",
  wander_web: [
    args: (
      Path.wildcard("./apps/wander_web/assets/wander/*.{js,jsx}")
      ++ Path.wildcard("./apps/wander_web/assets/wander/**/*.{js,jsx}")
      |> Enum.map(& String.trim_leading(&1, "apps/wander_web/assets/"))
    ) ++ ~w(
      wander/global.js wander/app.jsx
      --bundle
      --target=es2017 --platform=browser
      --jsx=automatic
      --outdir=../priv/static/assets
      --external:/fonts/*
      --external:/images/*
    ),
    cd: Path.expand("../apps/wander_web/assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.4.3",
  wander_web: [
    args: ~w(
      --config=tailwind.config.js
      --input=wander/global.css
      --output=../priv/static/assets/wander/global.css
    ),
    cd: Path.expand("../apps/wander_web/assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
