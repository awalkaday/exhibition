// simulation-2/scripts/optimize-photos.mjs
//
// Batch-resizes and re-encodes the marks photo series. Point it at a folder of
// originals; it writes web/projector-ready copies next to it. Run with:
//   node scripts/optimize-photos.mjs <source-dir> <output-dir>
//
// What it does to each photo, and why:
//   - Resizes to a max of 3200px on the long edge. That's larger than a 4K
//     projector or display (3840x2160, ~8.3MP on the long edge at most) will
//     ever need, with real headroom, while being a fraction of an 8000x8000
//     source — no visible quality loss at any screen or projector size, most
//     of the megabytes gone.
//   - Re-encodes as JPEG at quality 82 (WebP is smaller for the same look, but
//     JPEG is the safer bet for a video-loop pipeline if these get fed to
//     ffmpeg later — WebP support there is patchier). Change FORMAT below if
//     everything downstream is browser-only.
//   - Strips all metadata by default — sharp does this unless you explicitly
//     call .withMetadata(). That includes EXIF, and with it GPS location data
//     if any of the originals carry it, which is worth doing before ~123
//     photos go into a public repo regardless of the size savings.
//
// Idempotent: skips a file if an output of the same name already exists and
// is newer than the source, so re-running after adding a few more photos to
// the source folder doesn't reprocess everything.

import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const MAX_DIMENSION = 3200
const FORMAT = 'jpeg'
const QUALITY = 82
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp'])

const [, , srcArg, outArg] = process.argv
if (!srcArg || !outArg) {
  console.error('Usage: node scripts/optimize-photos.mjs <source-dir> <output-dir>')
  process.exit(1)
}

await mkdir(outArg, { recursive: true })

const entries = (await readdir(srcArg)).filter((f) => EXTS.has(extname(f).toLowerCase()))
if (entries.length === 0) {
  console.error(`No images found in ${srcArg}`)
  process.exit(1)
}

let done = 0, skipped = 0, totalInBytes = 0, totalOutBytes = 0

for (const file of entries) {
  const srcPath = join(srcArg, file)
  const outPath = join(outArg, `${basename(file, extname(file))}.${FORMAT === 'jpeg' ? 'jpg' : FORMAT}`)

  const srcStat = await stat(srcPath)
  totalInBytes += srcStat.size

  try {
    const outStat = await stat(outPath)
    if (outStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++
      totalOutBytes += outStat.size
      continue
    }
  } catch {
    // outPath doesn't exist yet — fall through and process it.
  }

  await sharp(srcPath)
    .rotate() // applies EXIF orientation before it gets stripped, so images don't end up sideways
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outPath)

  const outStat = await stat(outPath)
  totalOutBytes += outStat.size
  done++
  process.stdout.write(`  ${file} → ${basename(outPath)} (${(srcStat.size / 1024 / 1024).toFixed(1)}MB → ${(outStat.size / 1024 / 1024).toFixed(1)}MB)\n`)
}

console.log(`\n${done} processed, ${skipped} already up to date.`)
console.log(`Total: ${(totalInBytes / 1024 / 1024).toFixed(0)}MB → ${(totalOutBytes / 1024 / 1024).toFixed(0)}MB`)
