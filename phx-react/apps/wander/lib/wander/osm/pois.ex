defmodule Wander.Osm.Pois do
  alias Wander.Osm.Pois.CafeNode
  alias Wander.Repos.PgOsmRepo, as: Repo

  @doc """
  Finds all cafes filtered according to the search parameters in `opts`.

  ## Params

  - `opts`

  """
  @spec find_cafes(keyword()) :: [CafeNode]
  def find_cafes(opts \\ []) when is_list(opts) do
    Repo.all(CafeNode)
  end
end
