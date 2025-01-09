defmodule Wander.Repo do
  use Ecto.Repo,
    otp_app: :wander,
    adapter: Ecto.Adapters.SQLite3
end
