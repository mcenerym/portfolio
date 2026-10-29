import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const files=['appointments.css','appointment-modal.css','appointment-week.css','appointment-compact.css','appointment-secondary.css','appointment-form.css','person-details.css','appointment-sizing.css','add-person.css','booking-people-picker.css'];
const css=Object.fromEntries(files.map(f=>[f,fs.readFileSync('src/'+f,'utf8')]));
// Colors come from tokens: raw hex values only appear in custom-property definitions or translucent overlays.
for(const [file,text] of Object.entries(css))for(const decl of text.match(/[a-z-]+:[^;{}]*#[0-9a-fA-F]{3,8}\b[^;{}]*/g)||[])assert.ok(decl.startsWith('--aster-')||/#[0-9a-fA-F]{8}\b/.test(decl),`${file}: ${decl}`);
// Readable type: no text below 12px.
for(const [file,text] of Object.entries(css))for(const size of text.match(/font-size:[0-9.]+px/g)||[])assert.ok(Number(size.slice(10,-2))>=12,`${file}: ${size}`);
// Light tokens: text pairs meet WCAG AA; provider stripes and control borders meet 3:1.
const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const tokens=block=>Object.fromEntries([...block.matchAll(/--aster-([a-z-]+):(#[0-9a-f]{6})/g)].map(m=>[m[1],m[2]]));
assert.ok(!/prefers-color-scheme|data-theme/.test(Object.values(css).join('')),'light theme only');
const light=tokens(css['appointments.css'].match(/\.aster-app\{--aster-bg[^}]*\}/)[0]);
for(const [name,t] of [['light',light]]){
 for(const [fg,bg] of [['ink','bg'],['ink','surface'],['text-muted','surface'],['text-muted','surface-muted'],['text-subtle','surface'],['brand','surface'],['on-brand','brand'],['danger','danger-soft'],['success','success-soft'],['warning','warning-soft'],['text-muted','lee-soft'],['text-muted','blake-soft'],['ink','ellis-soft']])assert.ok(ratio(t[fg],t[bg])>=4.5,`${name} ${fg} on ${bg}: ${ratio(t[fg],t[bg]).toFixed(2)}`);
 for(const p of ['ellis','lee','blake'])assert.ok(ratio(t[p],t[p+'-soft'])>=3,`${name} ${p} stripe`);
 assert.ok(ratio(t['line-strong'],t.surface)>=3,'control borders');
}
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Appointments}=await server.ssrLoadModule('/src/Appointments.jsx');
 const html=renderToStaticMarkup(React.createElement(Appointments));
 for(const text of ['aster-week-switcher','aria-label="Previous week"','aria-label="Next week"','Choose week by date','>Today<','aster-provider-chips','aster-provider-dot','aster-toast','class="aster-icon"'])assert.ok(html.includes(text),text);
 for(const text of ['aster-theme-button','▦','♧','Week starts','Week ends','Past date'])assert.ok(!html.includes(text),text);
 const {default:WeekCalendar}=await server.ssrLoadModule('/src/WeekCalendar.jsx');
 const week=renderToStaticMarkup(React.createElement(WeekCalendar,{days:['2026-11-02','2026-11-03','2026-11-04','2026-11-05','2026-11-06'],today:'2026-11-04',appointments:[{id:'a',personId:'AC-1001',providerId:'lee',procedureIds:['consult'],date:'2026-11-05',start:540,status:'Scheduled'},{id:'b',personId:'AC-1002',providerId:'blake',procedureIds:['clean'],date:'2026-11-02',start:600,status:'Canceled'}],onBook(){},onRemind(){},onCancel(){}}));
 assert.equal((week.match(/is-past/g)||[]).length,2);assert.equal((week.match(/is-today/g)||[]).length,1);
 assert.equal((week.match(/aster-empty-book/g)||[]).length,2);assert.equal((week.match(/class="aster-add-day"/g)||[]).length,1);
 assert.ok(week.includes('aster-week-visit provider-lee'));assert.ok(week.includes('is-cancel'));assert.ok(week.includes('aster-status-pill is-canceled'));
 console.log('Passed: tokenized colors, 12px minimum type, AA contrast in the light theme, provider stripe contrast, merged week control, provider legend, toast, SVG icons, past/today/empty day states.');
}finally{await server.close()}
