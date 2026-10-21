// Appends args-only stories listed in a spec module to component stories files (idempotent by export name).
const fs = require('fs')
const path = require('path')
const specFile = process.argv[2]
const spec = require(path.resolve(specFile))
const byFile = {}
for (const [file, name, body] of spec) (byFile[file] ||= []).push([name, body])
let added = 0
for (const [file, items] of Object.entries(byFile)) {
  const f = path.join('src/components', file)
  let t = fs.readFileSync(f, 'utf8')
  for (const [name, body] of items) {
    if (new RegExp('export const ' + name + '\\b').test(t)) continue
    t = t.replace(/\s*$/, '\n') + `\nexport const ${name}: Story = ${body}\n`
    added++
  }
  if (/\bref</.test(items.map((i) => i[1]).join('\n')) || /\bref\(/.test(t)) {
    const m = /import \{([^}]*)\} from 'vue'/.exec(t)
    if (m) {
      if (!/\bref\b/.test(m[1])) t = t.replace(m[0], `import { ${m[1].trim()}, ref } from 'vue'`)
    } else {
      t = t.replace(/(import[^\n]*\n)/, `$1import { ref } from 'vue'\n`)
    }
  }
  fs.writeFileSync(f, t)
}
console.log('added', added)
