const path=require('path'),os=require('os')
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(os.homedir(),'AppData','Local','ms-playwright')
const { chromium } = require('@playwright/test')
;(async()=>{const b=await chromium.launch();const p=await b.newPage()
for (const [id,sel] of [['form-vtextinput--default','input'],['form-vtextinput--filled','input'],['form-vcheckbox--default','input'],['navigation-vtabs--underline','[role=tab]:nth-of-type(2)'],['feedback-valert--default','button'],['table-vtable--default','input[type=checkbox]'] ]) {
await p.goto('http://localhost:6007/iframe.html?viewMode=story&id='+id);await p.waitForTimeout(1500)
const el=p.locator('#storybook-root '+sel).first()
if(!(await el.count())){console.log(id,'no element');continue}
const tag=await el.evaluate(e=>e.tagName+':'+(e.type||''))
if(tag.includes('INPUT:text')){await el.fill('abc');console.log(id,'value after typing:',await el.inputValue())}
else if(tag.includes('checkbox')){const before=await el.isChecked();await el.click({force:true});console.log(id,'checked',before,'->',await el.isChecked())}
else {const before=await el.getAttribute('aria-selected');await el.click();console.log(id,'aria-selected',before,'->',await el.getAttribute('aria-selected'))}
}
await b.close()})()
