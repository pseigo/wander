defmodule Wander.Repos.PgOsmRepo do
  use Ecto.Repo,
    otp_app: :wander,
    adapter: Ecto.Adapters.Postgres
end
