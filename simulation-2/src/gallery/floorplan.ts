// simulation-2/src/gallery/floorplan.ts
//
// Named floorplan.ts, not geometry.ts: the vendored engine already has a
// geometry.ts (mesh/vertex-buffer building, from fxhashArchive) and this file
// would collide with it. This is the other kind of geometry — turning a room's
// floor polygon into wall segments. Built for the two real rooms at Hectolitre:
// an L-shaped white room and a longer, tighter L-shaped black room, open into
// each other through a doorway with no frame.
//
// IMPORTANT: POINTS_WHITE / POINTS_BLACK below are a first-pass approximation built only
// from the measurements given in conversation (white: square, ~3.5m per wall; black:
// ~1.5m wide, ~4.5m of total run, both L-shaped). They are not a survey. Everything
// downstream — walls, room rect, spawn point — is derived from these points, so replacing
// them with real measurements (or digitising a sketch) is the only edit this needs.

import type { Wall, FloorRect } from './types'

export interface Point { x: number; z: number }

/** An opening left in one wall segment of a polygon loop — no lintel, no frame. */
export interface Opening {
  afterIndex: number   // the opening sits on the edge from points[afterIndex] to the next point
  start: number         // 0-1 along that edge
  end: number            // 0-1 along that edge, > start
}

const WALL_H = 4

/** Builds closed-loop walls from a polygon, leaving gaps for any openings supplied. */
export function wallsFromPolygon(points: Point[], openings: Opening[] = [], h = WALL_H): Wall[] {
  const walls: Wall[] = []
  const lerp = (a: Point, b: Point, t: number): Point => ({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t })

  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    const opening = openings.find((o) => o.afterIndex === i)

    if (!opening) {
      walls.push({ x1: a.x, z1: a.z, x2: b.x, z2: b.z, y0: 0, y1: h })
      continue
    }
    if (opening.start > 0) {
      const mid = lerp(a, b, opening.start)
      walls.push({ x1: a.x, z1: a.z, x2: mid.x, z2: mid.z, y0: 0, y1: h })
    }
    if (opening.end < 1) {
      const mid = lerp(a, b, opening.end)
      walls.push({ x1: mid.x, z1: mid.z, x2: b.x, z2: b.z, y0: 0, y1: h })
    }
  }
  return walls
}

export function boundingRect(points: Point[]): FloorRect {
  const xs = points.map((p) => p.x)
  const zs = points.map((p) => p.z)
  const x = Math.min(...xs), z = Math.min(...zs)
  return { x, z, w: Math.max(...xs) - x, d: Math.max(...zs) - z }
}

// --- First-pass floor plans — replace with real measurements when you have them ---

/**
 * White room: roughly square, ~3.5m per wall, with a corner cut to make the L.
 * Edge 1, (3.5,0)→(3.5,2.0), is the wall shared with the black room — see
 * WHITE_OPENING below, which leaves its z∈[0.5, 2.0] stretch open.
 */
export const POINTS_WHITE: Point[] = [
  { x: 0, z: 0 },
  { x: 3.5, z: 0 },
  { x: 3.5, z: 2.0 },
  { x: 2.0, z: 2.0 },
  { x: 2.0, z: 3.5 },
  { x: 0, z: 3.5 },
]

/**
 * Black room: ~1.5m wide, ~4.5m of total run (3.0m then a 90° turn for 1.5m
 * more), both legs 1.5m wide throughout. Edge 5, the closing edge back to point
 * 0, runs along the same line as the white room's edge 1 — see BLACK_OPENING.
 */
export const POINTS_BLACK: Point[] = [
  { x: 3.5, z: 0.5 },
  { x: 6.5, z: 0.5 },
  { x: 6.5, z: 2.0 },
  { x: 5.0, z: 2.0 },
  { x: 5.0, z: 3.5 },
  { x: 3.5, z: 3.5 },
]

/**
 * The open doorway between them — no wall, no frame. Each room's polygon is its
 * own closed loop, so the gap has to be declared on both: white's edge 1 and
 * black's edge 5 both run along x=3.5, and both leave z∈[0.5, 2.0] open — the
 * full width of the black room's entrance.
 */
export const WHITE_OPENING: Opening = { afterIndex: 1, start: 0.25, end: 1 }
export const BLACK_OPENING: Opening = { afterIndex: 5, start: 0.5, end: 1 }
