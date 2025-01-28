defmodule Wander.Repos.SlRepo do
  use Ecto.Repo,
    otp_app: :wander,
    adapter: Ecto.Adapters.SQLite3
end
