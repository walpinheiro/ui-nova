const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const indexDts = path.join(root, 'dist/index.d.ts')

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vue-tsc', '-p', 'tsconfig.build.json', '--declaration', '--emitDeclarationOnly'],
  { cwd: root, stdio: 'inherit', shell: true },
)

if (!fs.existsSync(indexDts)) {
  console.error('❌ Type generation failed: dist/index.d.ts was not created.')
  process.exit(1)
}

if (result.status !== 0) {
  console.warn('⚠️  vue-tsc reported diagnostics, but declaration files were emitted (noEmitOnError=false).')
}
