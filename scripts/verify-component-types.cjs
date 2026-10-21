/**
 * Verifies that dist contains declaration files for every public component
 * re-exported from src/index.ts, including each component's *Props type.
 */
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const indexTs = path.join(root, 'src/index.ts')
const indexDts = path.join(root, 'dist/index.d.ts')
const componentsDist = path.join(root, 'dist/components')

function walkFiles(dir, matcher) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...walkFiles(fullPath, matcher))
    else if (matcher(fullPath, entry.name)) results.push(fullPath)
  }
  return results
}

if (!fs.existsSync(indexDts)) {
  console.error('❌ Missing dist/index.d.ts — run "npm run build:types" first.')
  process.exit(1)
}

const source = fs.readFileSync(indexTs, 'utf8')
const declarations = fs.readFileSync(indexDts, 'utf8')
const allDts = walkFiles(path.join(root, 'dist'), (filePath) => filePath.endsWith('.d.ts'))

const componentExports = [...source.matchAll(/components\/[^']+\/(V[A-Z][A-Za-z0-9]*)/g)]
  .map((match) => match[1])
  .filter((name, index, list) => list.indexOf(name) === index)

const missingComponents = componentExports.filter((name) => {
  const hasVueDeclaration = allDts.some((file) => file.endsWith(`${name}.vue.d.ts`))
  const hasIndexDeclaration = allDts.some((file) => file.includes(`${path.sep}${name}${path.sep}index.d.ts`))
  const hasRootExport = declarations.includes(`/${name}'`)
  return !hasVueDeclaration && !hasIndexDeclaration && !hasRootExport
})

const missingProps = componentExports.filter((name) => {
  const propsType = `${name}Props`
  const typesFile = path.join(componentsDist, '**', `${name}.types.d.ts`)
  const foundTypesFile = allDts.find((file) => file.endsWith(`${name}.types.d.ts`))
  if (foundTypesFile) {
    return !fs.readFileSync(foundTypesFile, 'utf8').includes(propsType)
  }
  return !allDts.some((file) => fs.readFileSync(file, 'utf8').includes(propsType))
})

console.log('\n======================================================')
console.log('     VueUI Nova Kit — Component Types Verification    ')
console.log('======================================================')
console.log(`📦 Components tracked: ${componentExports.length}`)
console.log(`📄 Declaration files: ${allDts.length}`)
console.log('------------------------------------------------------')

let passed = true

if (missingComponents.length) {
  console.error(`❌ Missing component declarations: ${missingComponents.join(', ')}`)
  passed = false
} else {
  console.log('✅ PASS: All public components have declaration files in dist/')
}

if (missingProps.length) {
  console.error(`❌ Missing *Props types: ${missingProps.map((name) => `${name}Props`).join(', ')}`)
  passed = false
} else {
  console.log('✅ PASS: All component *Props types are present in dist/')
}

console.log('======================================================\n')

if (!passed) process.exit(1)
