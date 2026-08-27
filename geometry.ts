// simulation-2/src/gallery/geometry.ts
//
// Turns a room's floor polygon into wall segments. Built for the two real rooms at
// Hectolitre: an L-shaped white room and a longer, tighter L-shaped black room, open
// into each other through a doorway with no frame.
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

/** White room: roughly square, ~3.5m per wall, with a corner cut to make the L. */
export const POINTS_WHITE: Point[] = [
  { x: 0, z: 0 },
  { x: 3.5, z: 0 },
  { x: 3.5, z: 2.0 },
  { x: 2.0, z: 2.0 },
  { x: 2.0, z: 3.5 },
  { x: 0, z: 3.5 },
]

/** Black room: ~1.5m wide, ~4.5m of total run, bent partway along its length. */
export const POINTS_BLACK: Point[] = [
  { x: 3.5, z: 0.75 },
  { x: 6.5, z: 0.75 },
  { x: 6.5, z: 2.25 },
  { x: 5.0, z: 2.25 },
  { x: 5.0, z: 3.75 },
  { x: 3.5, z: 3.75 },
]

/** The open doorway between them — no wall, no frame — on their shared edge. */
export const WHITE_BLACK_OPENING: Opening = { afterIndex: 0, start: 0.2, end: 0.75 }
