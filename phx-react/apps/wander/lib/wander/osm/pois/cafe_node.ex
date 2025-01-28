defmodule Wander.Osm.Pois.CafeNode do
  use Ecto.Schema

  @schema_prefix :osm2pgsql
  @primary_key false
  schema "cafe_nodes" do
    field :node_id, :integer, primary_key: true, writable: :never
    field :name, :string, writable: :never
    field :type, :string, writable: :never
    field :opening_hours, :string, writable: :never
    field :tags, :map, writable: :never
    field :geom, Geo.PostGIS.Geometry, writable: :never
  end
end
