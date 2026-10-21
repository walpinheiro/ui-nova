const fs = require('fs')
const walk = (d, o = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + '/' + e.name
    e.isDirectory() ? walk(p, o) : o.push(p)
  }
  return o
}
const files = [...walk('src/components'), ...walk('src/foundations')].filter((f) => /\.stories\.ts$/.test(f))
const STR = "'(?:[^'\\\\]|\\\\.)*'"
const D = 'docs: \\{ description: \\{ story: ' + STR + ' \\} \\}'
const rs = [
  new RegExp('parameters: \\{\\n[ \\t]*' + D + ',\\n[ \\t]*\\},\\n[ \\t]*', 'g'),
  new RegExp('parameters: \\{ ' + D + ' \\}, ', 'g'),
  new RegExp(D + ',(\\n[ \\t]*| )', 'g'),
]
let n = 0
for (const f of files) {
  let t = fs.readFileSync(f, 'utf8')
  const o = t
  for (const r of rs) t = t.replace(r, '')
  if (t !== o) { fs.writeFileSync(f, t); n++ }
}
console.log('stripped', n)
