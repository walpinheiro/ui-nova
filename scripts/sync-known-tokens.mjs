import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const scss = fs.readFileSync(path.join(root, 'src/tokens/_tokens.scss'), 'utf8')
const tokens = [
  ...new Set([...scss.matchAll(/^\s+(--v-[a-z0-9-]+):/gm)].map((m) => m[1])),
].sort()

const livePath = path.join(root, 'src/tokens/live-core.ts')
const live = fs.readFileSync(livePath, 'utf8')
const start = live.indexOf('export const KNOWN_TOKENS = [')
const end = live.indexOf('] as const', start)
if (start === -1 || end === -1) throw new Error('KNOWN_TOKENS block not found')

const body = tokens.map((t) => `  '${t}',`).join('\n')
const next =
  live.slice(0, start) +
  'export const KNOWN_TOKENS = [\n' +
  body +
  '\n] as const' +
  live.slice(end + '] as const'.length)

fs.writeFileSync(livePath, next)
console.log(`Synced ${tokens.length} tokens to live-core.ts`)
