-- This configuration is based on examples from the osm2pgsql repository:
-- https://github.com/osm2pgsql-dev/osm2pgsql/tree/3d52ea83d9d1bda5f7dd84652b7bee26811922b5/flex-config

-- inspect = require('inspect')

print('osm2pgsql version: ' .. osm2pgsql.version)

local tables = {}
local k_srid = 4326

tables.cafe_nodes = osm2pgsql.define_node_table('cafe_nodes',
	{
		{ column = 'name', type = 'text' },
		{ column = 'type', type = 'text' },
		{ column = 'opening_hours', type = 'text' },

		-- TODO: Create an 'amenities' column once we know what tags we're looking
		--  for, so we can quickly load it for 'small' detent sheets.
		--  - See: https://osm2pgsql.org/doc/manual.html#using-create_only-columns-for-postprocessed-data

		{ column = 'tags', type = 'jsonb' },
		{ column = 'geom', type = 'point', projection = k_srid, not_null = true },
	},
	{
		ids = {
			type = 'node',
			id_column = 'node_id',
			create_index = 'unique' -- 'auto' | 'always' | 'unique'
		}
	}
)

-- TODO: Add a 'cafe_ways' or 'cafe_areas' table, where we calculate a 'center'
-- point for the area that sits within the area (so not falling outside of it,
-- like how the centroid for a U-shaped lake would be placed outside of the
-- lake).
--
-- The reason we want to look for ways/areas as well as nodes is because of the
-- "one feature, one OSM element" principle; some cafes might not be
-- represented as nodes, but we of course would like to include them in our
-- app. I figure it might be easier to have a separate table for areas rather
-- than trying to make a single, polymorphic table that includes both nodes
-- _and_ areas.
--
-- - See:
--   - https://blog.jochentopf.com/2020-05-10-new-flex-output-in-osm2pgsql.html
--   - https://en.wikipedia.org/wiki/Centroid
--   - https://wiki.openstreetmap.org/wiki/One_feature,_one_OSM_element

tables.nodes = osm2pgsql.define_node_table('nodes', {
  { column = 'tags', type = 'jsonb' },
  { column = 'geom', type = 'point', projection = k_srid, not_null = true },
})

tables.lines = osm2pgsql.define_way_table('lines', {
  { column = 'tags', type = 'jsonb' },
  { column = 'geom', type = 'linestring', projection = k_srid, not_null = true },
})

tables.polygons = osm2pgsql.define_area_table('polygons', {
  { column = 'type', type = 'text' },
  { column = 'tags', type = 'jsonb' },
  { column = 'geom', type = 'geometry', projection = k_srid, not_null = true },
})

-- Debug output: Show definition of tables
for name, dtable in pairs(tables) do
  print("\ntable '" .. name .. "':")
  print("  name='" .. dtable:name() .. "'")
--  print("  columns=" .. inspect(dtable:columns()))
end

-- These tag keys are generally regarded as useless for most rendering. Most
-- of them are from imports or intended as internal information for mappers.
--
-- If a key ends in '*' it will match all keys with the specified prefix.
--
-- If you want some of these keys, perhaps for a debugging layer, just
-- delete the corresponding lines.
local delete_keys = {
    -- "mapper" keys
    'attribution',
    'comment',
    'created_by',
    'fixme',
    'note',
    'note:*',
    'odbl',
    'odbl:note',
    'source',
    'source:*',
    'source_ref',

    -- "import" keys

    -- Corine Land Cover (CLC) (Europe)
    'CLC:*',

    -- Geobase (CA)
    'geobase:*',
    -- CanVec (CA)
    'canvec:*',

    -- osak (DK)
    'osak:*',
    -- kms (DK)
    'kms:*',

    -- ngbe (ES)
    -- See also note:es and source:file above
    'ngbe:*',

    -- Friuli Venezia Giulia (IT)
    'it:fvg:*',

    -- KSJ2 (JA)
    -- See also note:ja and source_ref above
    'KSJ2:*',
    -- Yahoo/ALPS (JA)
    'yh:*',

    -- LINZ (NZ)
    'LINZ2OSM:*',
    'linz2osm:*',
    'LINZ:*',
    'ref:linz:*',

    -- WroclawGIS (PL)
    'WroclawGIS:*',
    -- Naptan (UK)
    'naptan:*',

    -- TIGER (US)
    'tiger:*',
    -- GNIS (US)
    'gnis:*',
    -- National Hydrography Dataset (US)
    'NHD:*',
    'nhd:*',
    -- mvdgis (Montevideo, UY)
    'mvdgis:*',

    -- EUROSHA (Various countries)
    'project:eurosha_2012',

    -- UrbIS (Brussels, BE)
    'ref:UrbIS',

    -- NHN (CA)
    'accuracy:meters',
    'sub_sea:type',
    'waterway:type',
    -- StatsCan (CA)
    'statscan:rbuid',

    -- RUIAN (CZ)
    'ref:ruian:addr',
    'ref:ruian',
    'building:ruian:type',
    -- DIBAVOD (CZ)
    'dibavod:id',
    -- UIR-ADR (CZ)
    'uir_adr:ADRESA_KOD',

    -- GST (DK)
    'gst:feat_id',

    -- Maa-amet (EE)
    'maaamet:ETAK',
    -- FANTOIR (FR)
    'ref:FR:FANTOIR',

    -- 3dshapes (NL)
    '3dshapes:ggmodelk',
    -- AND (NL)
    'AND_nosr_r',

    -- OPPDATERIN (NO)
    'OPPDATERIN',
    -- Various imports (PL)
    'addr:city:simc',
    'addr:street:sym_ul',
    'building:usage:pl',
    'building:use:pl',
    -- TERYT (PL)
    'teryt:simc',

    -- RABA (SK)
    'raba:id',
    -- DCGIS (Washington DC, US)
    'dcgis:gis_id',
    -- Building Identification Number (New York, US)
    'nycdoitt:bin',
    -- Chicago Building Inport (US)
    'chicago:building_id',
    -- Louisville, Kentucky/Building Outlines Import (US)
    'lojic:bgnum',
    -- MassGIS (Massachusetts, US)
    'massgis:way_id',
    -- Los Angeles County building ID (US)
    'lacounty:*',
    -- Address import from Bundesamt für Eich- und Vermessungswesen (AT)
    'at_bev:addr_date',

    -- misc
    'import',
    'import_uuid',
    'OBJTYPE',
    'SK53_bulk:load',
    'mml:class'
}

-- The osm2pgsql.make_clean_tags_func() function takes the list of keys
-- and key prefixes defined above and returns a function that can be used
-- to clean those tags out of a Lua table. The clean_tags function will
-- return true if it removed all tags from the table.
local clean_tags = osm2pgsql.make_clean_tags_func(delete_keys)

--local function clean_tags(tags)
--  tags.odbl = nil
--  tags.created_by = nil
--  tags.source = nil
--  tags['source:ref'] = nil
--
--  return next(tags) == nil
--end

function osm2pgsql.process_node(object)
  --  print(inspect(object))

  if clean_tags(object.tags) then
    return
  end

  local geom = object:as_point()

  if object.tags.cuisine == 'coffee_shop' or object.tags.amenity == 'cafe' or object.tags.cafe == 'board_game' then
    local type = 'Coffee Shop'

    if object.tags.cafe == 'board_game' then
      type = 'Board Game Café'
    elseif object.tags.amenity == 'cafe' then
      type = 'Café'
    end

    tables.cafe_nodes:insert({
      name = object.tags.name,
      type = type,
      opening_hours = object.tags.opening_hours,
      tags = object.tags,
      geom = geom
    })
  end

  tables.nodes:insert({
    tags = object.tags,
    geom = geom
  })
end

-- Returns `true` if this is possibly an area.
local function has_area_tags(tags)
  if tags.area == 'yes' then
    return true
  end
  if tags.area == 'no' then
    return false
  end

  return tags.aeroway
    or tags.amenity
    or tags.building
    or tags.harbour
    or tags.historic
    or tags.landuse
    or tags.leisure
    or tags.man_made
    or tags.military
    or tags.natural
    or tags.office
    or tags.place
    or tags.power
    or tags.public_transport
    or tags.shop
    or tags.sport
    or tags.tourism
    or tags.water
    or tags.waterway
    or tags.wetland
    or tags['abandoned:aeroway']
    or tags['abandoned:amenity']
    or tags['abandoned:building']
    or tags['abandoned:landuse']
    or tags['abandoned:power']
    or tags['area:highway']
end

function osm2pgsql.process_way(object)
  --  print(inspect(object))

  if clean_tags(object.tags) then
    return
  end

  -- TODO: Consider how we can support `name:*` tags for languages other than English.
  --  - See:
  --    - https://github.com/osm2pgsql-dev/osm2pgsql/blob/master/flex-config/places.lua#L14-L49
  --    - https://wiki.openstreetmap.org/wiki/Key:name
  --    - https://wiki.openstreetmap.org/wiki/Key:name:en

  if object.is_closed and has_area_tags(object.tags) then
    local geom = object:as_polygon()
    local area = geom:transform(4326):area()
    local spherical_area = geom:spherical_area()

    tables.polygons:insert({
      type = object.type,
      tags = object.tags,
      geom = geom,
      area = area,
      spherical_area = spherical_area
    })
  else
    tables.lines:insert({
      tags = object.tags,
      geom = object:as_linestring()
    })
  end
end

function osm2pgsql.process_relation(object)
  --  print(inspect(object))

  if clean_tags(object.tags) then
    return
  end

  -- Store multipolygons and boundaries as polygons
  if object.tags.type == 'multipolygon' or
     object.tags.type == 'boundary' then
     tables.polygons:insert({
      type = object.type,
      tags = object.tags,
      geom = object:as_multipolygon()
    })
  end
end
