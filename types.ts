// simulation-2/src/gallery/types.ts
//
// Extends the Gallery/Room/Wall/Painting shape from KilledByAPixel/fxhashArchive
// (github.com/KilledByAPixel/fxhashArchive/blob/master/src/gallery/types.ts) with what
// Simulation #2 adds on top: live naming with a museum-style, timestamped credit line,
// and an optional on-chain link so the *same* schema can later host the ported white cube
// without a migration.
//
// Metres, y up — same convention as the source engine.

export interface Pose { x: number; z: number; yaw: number }
export interface FloorRect { x: number; z: number; w: number; d: number }

export interface Room {
  id: string                    // 'white' | 'black' | 'lobby' this year; open to more later
  kind: 'lobby' | 'hall' | 'solo' | 'era'
  title: string
  rect: FloorRect
  entry: Pose                    // just inside the doorway, facing in
  h?: number                     // ceiling height; falls back to a default if absent
  tint?: { hue: number; strength: number }
}

/** A solid wall segment. A gap left in the loop (see geometry.ts) is the open doorway — no lintel, no frame. */
export interface Wall { x1: number; z1: number; x2: number; z2: number; y0: number; y1: number }

/**
 * A visitor's naming of a mark, entered at the kiosk during the show.
 * `namedAt` is captured by the kiosk itself, not the namer — that's the temporal
 * signature: proof the naming happened live, during open hours, not backfilled later.
 */
export interface Naming {
  name: string                   // the title given to the mark
  namer?: string                  // how they chose to be credited — a name, an alias, or left blank
  description?: string            // their own reading of the mark, optional, museum-label style
  namedAt: string                  // ISO 8601 timestamp, set by the kiosk at the moment of naming
}

export interface Painting {
  project: number                 // stable id for this mark photo
  slug: string
  name: string                     // 'untitled' (or similar) until naming.name exists, then mirrors it
  artist: string                    // the photograph's own author — not the namer
  year: number
  room: string                      // Room.id this hangs in
  x: number; z: number; yaw: number
  tile: number                       // atlas index — same packing approach as the source engine
  w: number; h: number
  naming?: Naming                     // absent until a visitor has named it
  /** Forward-compatible only. Unused this year — populated once the white cube is ported here. */
  tokenId?: number
  contract?: string
  chain?: 'ethereum' | 'base' | 'tezos'
}

export interface Sign {
  text: string
  kind: 'title' | 'era' | 'room' | 'plaque' | 'panel'
  x: number; y: number; z: number; yaw: number
  w: number; h: number
}

export interface AtlasMeta {
  size: number; tile: number; gutter: number; cols: number
  files: string[]
  small: string[]
}

/**
 * Gates the naming feature to the show's real open hours — the "time-of-interaction
 * restraint". The kiosk UI reads this and simply won't offer naming outside the window.
 */
export interface NamingWindow { opens: string; closes: string } // ISO 8601

export interface Gallery {
  generatedAt: string
  counts: { paintings: number; years: [number, number] }
  atlas: AtlasMeta
  spawn: Pose
  namingWindow?: NamingWindow
  rooms: Room[]
  walls: Wall[]
  paintings: Painting[]
  signs: Sign[]
}
