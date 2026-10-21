// Serves .val-harness/ (validation preview harness) on :8321.
// Usage: pnpm harness  (keep running while Playwright e2e executes)
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const root = path.join(__dirname, '..', '.val-harness')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' }
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0])
  const file = path.normalize(path.join(root, p === '/' ? 'VButton.html' : p))
  if (!file.startsWith(path.normalize(root))) { res.writeHead(403); res.end(); return }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('nf'); return }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'text/plain' })
    res.end(data)
  })
})
server.listen(8321, () => console.log('harness on :8321 from ' + root))
