---
name: singapore-map
description: Query Singapore places, MRT/LRT journeys, isochrones, and open-data statistics, and generate interactive map links. Use when asked about Singapore locations, transit routes, "how far by MRT", hawker centres, planning-area stats, or to produce a map link.
---

# Singapore Map

A static, key-free JSON backend for an interactive Singapore map. Fetch over HTTPS;
no MCP, no server, no API key. Data is a Nov 2026 snapshot.

Base: `https://jensenloke.github.io/lab/singapore-map/`
Catalog: fetch `data/index.json` first for the endpoint list and schemas.

## Endpoints (GET, plain JSON)

| File | Use |
| --- | --- |
| `data/pois.json` | 108 places: name, category, desc, lat, lng, address |
| `data/rail-graph.json` | MRT/LRT graph (`adj`, `nodes`) for journeys + isochrones |
| `data/phase2.json` | hawker/libraries/hospitals/schools + `choropleth` stats by planning area |
| `data/tours.json` | 5 walking tours with stops |
| `data/sg-planning-areas.geojson` | 55 URA planning areas (name, region, area km²) |
| `data/sg-regions.geojson` | 5 regions |

## Tasks

**Find a place / hawker / amenity:** fetch `pois.json` (or `phase2.json` for hawker,
libraries, hospitals, schools), filter by name/category. Return name, description,
coordinates, and a map link.

**Area statistics:** fetch `phase2.json`, read `choropleth[<PLANNING AREA NAME>]` →
`{pop, density, hdb, hdbN}` (population, density per km², median HDB resale price,
number of sales). Names are uppercase URA planning areas (e.g. `BEDOK`, `TAMPINES`).

**Plan an MRT journey / isochrone:** fetch `rail-graph.json` and run Dijkstra over
`adj` (see below). Do not guess times — compute them.

**Walking tour:** fetch `tours.json`, return the matching tour's stops and distance.

## Routing algorithm (journey + isochrone)

`adj[station]` is a list of `[toStation, lineCode, km]`. Edge time ≈ `max(1.5, km*2.2)`
minutes; add a **4-minute penalty when the line code changes** (a transfer).

```
best = { (src, null): 0 }            # state = (station, arrival_line)
pq = [ (0, src, null) ]
while pq:
    cost, u, line = pop_min(pq)
    for (v, vline, km) in adj[u]:
        transfer = 4 if (line and line != vline) else 0
        nc = cost + max(1.5, km*2.2) + transfer
        if nc < best.get((v, vline), inf):
            best[(v, vline)] = nc; push (nc, v, vline)
# journey: min over best[(dst, *)]; reconstruct path via parent pointers
# isochrone: all stations whose min cost <= budget minutes
```

Approx adult fare: `min(2.40, 1.19 + max(0, km-3.2)*0.115)` SGD. Report times/fares
as estimates.

## Generate map links (send these to the user)

- Place: `https://jensenloke.github.io/lab/singapore-map/index.html#place=<URL-encoded name>`
- View: `…/index.html#map=<zoom>/<lat>/<lng>`
- 3D: `…/3d.html#<zoom>/<lat>/<lng>`

## Caveats

Boundaries indicative; not for navigation or legal use. Journey times/fares are
estimates. Snapshot data — re-fetch is cheap but it does not update live.