// Ensures Playwright resolves browsers from the user install (not sandbox cache).
const path = require('node:path')
const os = require('node:os')

if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright')
}

module.exports = async () => {}
