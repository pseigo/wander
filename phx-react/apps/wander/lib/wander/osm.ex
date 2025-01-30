defmodule Wander.Osm do
  alias Wander.Osm.Pois.CafeNode

  @type osm_node() :: CafeNode.t()

  @type geojson_feature() :: %{
    optional(:id) => String.t(),
    type: String.t(),
    geometry: map(),
    properties: map()
  }

  @doc """
  Returns a GeoJSON representation of the `osm_node` as a `geojson_feature`
  which is an Elixir map; you can convert this directly to a JSON string.

  ## Examples

      iex> alias Wander.Repos.PgOsmRepo, as: Repo
      iex> alias Wander.Osm.Pois.CafeNode
      iex> cafe = Repo.get!(CafeNode, 834921331)
      #=> %CafeNode{}
      iex> {:ok, cafe_geojson} = Wander.Osm.to_geojson(cafe)
      iex> {:ok, cafe_geojson_str} = Jason.encode(cafe_geojson)
      #=> {:ok, "{\"geometry\":...}"}

  """
  @spec to_geojson(osm_node()) :: geojson_feature()
  def to_geojson(osm_node)

  def to_geojson(%CafeNode{} = cafe) do
    {:ok, geojson_geometry_2008} = Geo.JSON.encode(cafe.geom)
    geojson_geometry = Map.drop(geojson_geometry_2008, ["crs"])

    %{
      id: "node/#{cafe.node_id}",
      type: "Feature",
      properties: cafe.tags,
      geometry: geojson_geometry
    }
  end
end
