import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const html=fs.readFileSync('index.html','utf8');const main=fs.readFileSync('src/main.jsx','utf8');
// Sharing and search metadata, favicon, and theme color matching the Blueprint page background.
for(const tag of ['property="og:title"','property="og:description"','name="twitter:card"','rel="icon" href="/favicon.svg"','application/ld+json','content="#eef4fa"','rel="preconnect" href="https://fonts.gstatic.com"'])assert.ok(html.includes(tag),tag);
assert.ok(fs.existsSync('public/favicon.svg'));
JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
// Fonts load from index.html, not a render-blocking CSS @import, and main-site text is at least 12px.
for(const f of ['style.css','profile.css','blueprint.css','readability.css']){const css=fs.readFileSync('src/'+f,'utf8');assert.ok(!css.includes('@import'),f);for(const size of css.match(/font-size:[0-9.]+px/g)||[])assert.ok(Number(size.slice(10,-2))>=12,`${f}: ${size}`)}
// One token set: raw colors only in token definitions, translucent whites, or the art mask; the old teal palette is gone.
const siteCss=['style.css','profile.css','blueprint.css','readability.css','examples.css'].map(f=>fs.readFileSync('src/'+f,'utf8')).join('\n');
for(const decl of siteCss.match(/[a-z-]+:[^;{}]*#[0-9a-fA-F]{3,8}\b[^;{}]*/g)||[])assert.ok(decl.startsWith('--')||/#fff[0-9a-f]{1,2}\b|#ffffff[0-9a-f]{2}\b/i.test(decl)||decl.startsWith('mask-image'),decl);
for(const teal of ['#387d80','#43a19c','#508684','#a1cbc9','#7eb8b6','#203337'])assert.ok(!siteCss.toLowerCase().includes(teal),teal);
const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const t=Object.fromEntries([...siteCss.match(/:root\{--page[^}]*\}/)[0].matchAll(/--([a-z-]+):(#[0-9a-f]{6})/g)].map(m=>[m[1],m[2]]));
for(const [fg,bg] of [['ink','page'],['muted','page'],['muted','panel'],['muted','surface'],['accent','page'],['accent','panel'],['button-text','action'],['button-text','action-hover'],['pale','deep'],['pale','deep-panel'],['light-text','deep']])assert.ok(ratio(t[fg],t[bg])>=4.5,`${fg} on ${bg}: ${ratio(t[fg],t[bg]).toFixed(2)}`);
for(const [fg,bg] of [['line-strong','surface'],['highlight','page'],['highlight','panel'],['highlight-on-dark','deep'],['action','ink']])assert.ok(ratio(t[fg],t[bg])>=2,`${fg} vs ${bg}`);
assert.ok(ratio(t['line-strong'],t.surface)>=3&&ratio(t.highlight,t.page)>=3);
// Layout: Examples follows Services, sections number 01–05 in order, the nav links Examples, and services share one call to action.
const order=[...main.matchAll(/<section id="([a-z]+)"/g)].map(m=>m[1]);assert.deepEqual(order,['services','examples','ai','about','approach','contact']);
assert.deepEqual([...main.matchAll(/eyebrow">(0[1-5]) \//g)].map(m=>m[1]),['01','02','03','04','05']);
assert.ok(main.includes("['Examples','#examples']")&&!main.includes("'/?page=examples'")&&main.includes('services-cta')&&!main.includes('service-link'));
assert.ok(siteCss.includes('.about-story{max-width:70ch}'));
// Example apps are code-split; the home page shows the gallery and six distinct service icons.
for(const name of ['Automotive','Appointments','Gaming'])assert.ok(main.includes(`const ${name}=lazy(()=>import('./${name}.jsx'))`),name);
assert.ok(!/^import (Automotive|Appointments|Gaming) /m.test(main));
assert.equal(new Set([...main.matchAll(/ '0[1-4]':(.*),$/gm)].map(m=>m[1])).size,4);
// Simplified home page: no mock demo, hero diagram, tagline or tools strip; one timeline mention per place; LinkedIn linked.
for(const gone of ['className="demo"','hero-art','hero-note','expertise-strip','<h4>'])assert.ok(!main.includes(gone),gone);
assert.equal((main.match(/since 2008/gi)||[]).length,1);
assert.equal((main.match(/linkedin\.com\/in\/mike-mcenery-3710ba19a/g)||[]).length,2);assert.ok(html.includes('"sameAs":["https://www.linkedin.com/in/mike-mcenery-3710ba19a/"]'));
// Résumé: the PDF ships in public/ and is offered for download in About and Contact; the career timeline lists three employers.
assert.ok(fs.statSync('public/mike-mcenery-resume.pdf').size>10000);
assert.equal((main.match(/href="\/mike-mcenery-resume\.pdf" download/g)||[]).length,2);
assert.equal((main.match(/<li><span>/g)||[]).length,3);assert.ok(main.includes('18 years'));
assert.ok(main.includes('<ExampleGallery/>')&&main.includes('02 / INTERACTIVE EXAMPLES')&&main.includes("window.location.replace('/#examples')"));
assert.ok(!fs.existsSync("src/Examples.jsx")&&!fs.existsSync("src/example-data.js"));
for(const f of ['Appointments','Automotive','Gaming'])assert.ok(!fs.readFileSync(`src/${f}.jsx`,'utf8').includes('href="/?page=examples"'),f);
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:ExampleGallery}=await server.ssrLoadModule('/src/ExampleGallery.jsx');
 const home=renderToStaticMarkup(React.createElement(ExampleGallery));
 assert.equal((home.match(/<h3>/g)||[]).length,3);assert.ok(!home.includes('<h2>'));
 assert.equal((home.match(/class="example-project /g)||[]).length,3);
 console.log('Passed: one color token set with AA contrast and no teal leftovers, section order and numbering, Examples nav link, single services call to action, sharing metadata, favicon, font loading, 12px minimum type, code-split examples, recent-work gallery, four service icons, simplified home page, and LinkedIn links.');
}finally{await server.close()}
