const path=require('path'),os=require('os')
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(os.homedir(),'AppData','Local','ms-playwright')
const { chromium } = require('@playwright/test')
const [,, base, mode, id, theme, out] = process.argv
;(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:800}})
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text().slice(0,200)))
await p.goto(`${base}/iframe.html?viewMode=${mode}&id=${id}&globals=theme:${theme}`);await p.waitForTimeout(2500)
await p.screenshot({path:out,fullPage:mode==='docs'});console.log(errs.join('\n')||'no errors');await b.close()})()
