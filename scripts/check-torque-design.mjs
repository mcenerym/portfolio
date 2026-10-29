import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const css=fs.readFileSync('src/automotive.css','utf8');
// Colors come from tokens, text is at least 12px, and no !important overrides remain.
for(const decl of css.match(/[a-z-]+:[^;{}]*#[0-9a-fA-F]{3,8}\b[^;{}]*/g)||[])assert.ok(decl.startsWith('--auto-')||/#[0-9a-fA-F]{8}\b/.test(decl),decl);
for(const size of css.match(/font-size:[0-9.]+px/g)||[])assert.ok(Number(size.slice(10,-2))>=12,size);
assert.ok(!css.includes('!important'));
const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const t=Object.fromEntries([...css.match(/\.auto-app\{--auto-bg[^}]*\}/)[0].matchAll(/--auto-([a-z-]+):(#[0-9a-f]{6})/g)].map(m=>[m[1],m[2]]));
for(const [fg,bg] of [['ink','bg'],['text-muted','surface'],['text-muted','bg'],['text-muted','surface-muted'],['brand-text','surface'],['brand-text','brand-soft'],['on-brand','brand'],['on-brand','brand-hover'],['service-ink','service-soft'],['part-ink','part-soft'],['success','success-soft'],['danger','surface'],['danger','danger-soft'],['sidebar-text','sidebar'],['sidebar-muted','sidebar'],['sidebar-text','sidebar-raised'],['accent','sidebar'],['accent','ink'],['sidebar-text','ink']])assert.ok(ratio(t[fg],t[bg])>=4.5,`${fg} on ${bg}: ${ratio(t[fg],t[bg]).toFixed(2)}`);
for(const [fg,bg] of [['line-strong','surface'],['success-line','surface'],['brand','surface']])assert.ok(ratio(t[fg],t[bg])>=3,`${fg} on ${bg}`);
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Automotive}=await server.ssrLoadModule('/src/Automotive.jsx');
 const html=renderToStaticMarkup(React.createElement(Automotive));
 const art=[...html.matchAll(/<div class="auto-product-art[^"]*">.*?(<svg.*?<\/svg>)/g)].map(m=>m[1]);
 assert.equal(art.length,12);assert.equal(new Set(art).size,8,'each catalog icon type draws its own shape');
 for(const text of ['auto-nav-icon','auto-toast','Compare 3 sample shops'])assert.ok(html.includes(text),text);
 for(const text of ['▦','⇄','▤','auto-status'])assert.ok(!html.includes(text),text);
 console.log('Passed: tokenized colors, 12px minimum type, no !important, AA contrast, distinct catalog icons, SVG navigation, toast.');
}finally{await server.close()}
