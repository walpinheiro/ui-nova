const fs = require('fs')
const path = require('path')
const g = JSON.parse(fs.readFileSync('src/docs/_generated/argtypes.json', 'utf8'))
const walk = (d, o = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = d + '/' + e.name; e.isDirectory() ? walk(p, o) : o.push(p) } return o }
const files = walk('src/components')
const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
let total = 0
for (const [comp, props] of Object.entries(g)) {
  const types = files.find((f) => f.endsWith('/' + comp + '.types.ts'))
  if (!types) continue
  const dir = path.dirname(types)
  const stories = fs.readdirSync(dir).filter((f) => f.endsWith('.stories.ts')).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n')
  const mdx = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n')
  const all = stories + mdx
  const SKIP = /^(ariaw*|ariaLabel|dataTestId|testIds|rootDataAttrs|rootClass|surfaceClass|id|name|motion|domId|removeTestId|autocomplete|spellcheck|autocapitalize|w*Label)$/
  const missing = Object.keys(props).filter((p) => !SKIP.test(p)).filter((p) => {
    const re = new RegExp('(^|[^\\w])(:|v-model:)?(' + p + '|' + kebab(p) + ')(\\s*[=:]|\\s*[,}]|=|")', 'm')
    return !re.test(stories)
  })
  if (missing.length) { total += missing.length; console.log(comp.padEnd(24), missing.join(', ')) }
}
console.log('total props sem exemplo:', total)
