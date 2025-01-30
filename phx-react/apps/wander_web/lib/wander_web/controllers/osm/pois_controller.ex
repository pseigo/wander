defmodule WanderWeb.Osm.PoisController do
  use WanderWeb, :controller

  def get_cafes(conn, _params) do
    cafes = Wander.Osm.Pois.find_cafes()
    geojson_cafes = Enum.map(cafes, &Wander.Osm.to_geojson/1)
    json(conn, geojson_cafes)
  end
end
