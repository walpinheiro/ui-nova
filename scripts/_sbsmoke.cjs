const { chromium } = require('playwright')
const base = process.argv[2] || 'http://localhost:6007'
const re = new RegExp(process.argv[3] || '.')
;(async () => {
  const idx = await (await fetch(base + '/index.json')).json()
  const ents = Object.values(idx.entries).filter(e => re.test(e.id))
  const b = await chromium.launch(); const p = await b.newPage()
  let errs = []
  p.on('pageerror', e => errs.push('pageerror ' + e.message))
  p.on('console', m => { if (m.type()==='warning' && /Vue warn/.test(m.text())) errs.push('warn '+m.text().slice(0,160)); if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 200)) })
  for (const e of ents) {
    errs = []
    await p.goto(`${base}/iframe.html?viewMode=${e.type === 'docs' ? 'docs' : 'story'}&id=${e.id}`)
    await p.waitForTimeout(e.type === 'docs' ? 1500 : 500)
    const bad = await p.evaluate(() => !!document.querySelector('.sb-errordisplay:not([hidden])') && document.body.className.includes('sb-show-errordisplay'))
    const blank = e.type==='story' && await p.evaluate(()=>{const r=document.querySelector('#storybook-root');return !r || r.innerHTML.trim().length<20}); if (blank) errs.push('BLANK'); if (errs.length || bad) console.log('FAIL', e.id, bad ? '[errordisplay]' : '', errs.slice(0, 2).join(' | '))
  }
  console.log('checked', ents.length)
  await b.close()
})()
