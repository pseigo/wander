defmodule Wander.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      Wander.Repo,
      {Ecto.Migrator,
        repos: Application.fetch_env!(:wander, :ecto_repos),
        skip: skip_migrations?()},
      {DNSCluster, query: Application.get_env(:wander, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Wander.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Wander.Finch}
      # Start a worker by calling: Wander.Worker.start_link(arg)
      # {Wander.Worker, arg}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Wander.Supervisor)
  end

  defp skip_migrations?() do
    # By default, sqlite migrations are run when using a release
    System.get_env("RELEASE_NAME") != nil
  end
end
