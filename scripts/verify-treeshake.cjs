/**
 * Automated Tree-shaking Verification for VueUI Nova Kit
 *
 * Verifies that modern bundlers (e.g. esbuild/Rollup/Webpack) can eliminate
 * unused components when importing from the built library.
 */
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function run() {
  const root = path.resolve(__dirname, '..');
  const esmBundlePath = path.join(root, 'dist/vueui-nova.es.js');
  const umdBundlePath = path.join(root, 'dist/vueui-nova.umd.cjs');
  const cssPath = path.join(root, 'dist/vueui-nova-kit.css');

  // Verify build artifacts exist
  if (!fs.existsSync(esmBundlePath)) {
    console.error('❌ ESM bundle missing: dist/vueui-nova.es.js. Run "pnpm run build" first.');
    process.exit(1);
  }
  if (!fs.existsSync(umdBundlePath)) {
    console.error('❌ UMD bundle missing: dist/vueui-nova.umd.cjs. Run "pnpm run build" first.');
    process.exit(1);
  }
  if (!fs.existsSync(cssPath)) {
    console.error('❌ CSS bundle missing: dist/vueui-nova-kit.css. Run "pnpm run build" first.');
    process.exit(1);
  }

  const fullSize = fs.statSync(esmBundlePath).size;
  const umdSize = fs.statSync(umdBundlePath).size;
  const cssSize = fs.statSync(cssPath).size;

  console.log('\n======================================================');
  console.log('       VueUI Nova Kit — Tree-shaking Benchmark       ');
  console.log('======================================================');
  console.log(`📦 Full ESM Bundle:     ${(fullSize / 1024).toFixed(2)} KB (${fullSize} bytes)`);
  console.log(`📦 Full UMD Bundle:     ${(umdSize / 1024).toFixed(2)} KB (${umdSize} bytes)`);
  console.log(`🎨 Design Tokens & CSS: ${(cssSize / 1024).toFixed(2)} KB (${cssSize} bytes)`);
  console.log('------------------------------------------------------');

  // Test 1: Import only VButton
  const resButton = await esbuild.build({
    stdin: {
      contents: `import { VButton } from './dist/vueui-nova.es.js'; console.log(VButton);`,
      resolveDir: root,
    },
    bundle: true,
    minify: true,
    external: ['vue'],
    format: 'esm',
    write: false,
  });
  const buttonSize = resButton.outputFiles[0].text.length;
  const buttonSavings = (((fullSize - buttonSize) / fullSize) * 100).toFixed(1);

  console.log(`🟢 Import VButton only:  ${(buttonSize / 1024).toFixed(2)} KB (${buttonSize} bytes)`);
  console.log(`   └─ Elimination:       ${buttonSavings}% of unused code removed`);

  // Test 2: Import only VCard
  const resCard = await esbuild.build({
    stdin: {
      contents: `import { VCard } from './dist/vueui-nova.es.js'; console.log(VCard);`,
      resolveDir: root,
    },
    bundle: true,
    minify: true,
    external: ['vue'],
    format: 'esm',
    write: false,
  });
  const cardSize = resCard.outputFiles[0].text.length;
  const cardSavings = (((fullSize - cardSize) / fullSize) * 100).toFixed(1);

  console.log(`🟢 Import VCard only:    ${(cardSize / 1024).toFixed(2)} KB (${cardSize} bytes)`);
  console.log(`   └─ Elimination:       ${cardSavings}% of unused code removed`);

  // Test 3: Import tokens/motion only
  const resMotion = await esbuild.build({
    stdin: {
      contents: `import { V_MOTION_DEFAULT } from './dist/vueui-nova.es.js'; console.log(V_MOTION_DEFAULT);`,
      resolveDir: root,
    },
    bundle: true,
    minify: true,
    external: ['vue'],
    format: 'esm',
    write: false,
  });
  const motionSize = resMotion.outputFiles[0].text.length;
  console.log(`🟢 Import Motion token:  ${(motionSize / 1024).toFixed(2)} KB (${motionSize} bytes)`);

  console.log('------------------------------------------------------');

  // Validations
  let passed = true;

  // Threshold: single component should be < 20 KB (expected ~6 KB)
  if (buttonSize > 25 * 1024) {
    console.error(`❌ FAILED: VButton bundle too large (${buttonSize} bytes > 25 KB). Tree-shaking might be broken.`);
    passed = false;
  } else {
    console.log('✅ PASS: VButton bundle is compact (< 25 KB).');
  }

  // Threshold: elimination percentage should be > 90%
  if (parseFloat(buttonSavings) < 90) {
    console.error(`❌ FAILED: Tree-shaking elimination rate is too low (${buttonSavings}% < 90%).`);
    passed = false;
  } else {
    console.log(`✅ PASS: Tree-shaking eliminates ${buttonSavings}% of dead code.`);
  }

  console.log('======================================================\n');

  if (!passed) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal error during tree-shaking verification:', err);
  process.exit(1);
});
