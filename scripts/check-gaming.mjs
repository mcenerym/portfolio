import assert from 'node:assert/strict';
import {seedGamingState,refreshGamingState,validGamingState,shopEvents,toggleGameJoin,makeForumPost,makeForumReply,makeGameSession,seatsLeft,sessionStarted,gameWeek,gameDate,moveGameDate,eventLimit} from '../src/gaming-data.js';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
// Seed on every day of a week, early in the morning: linked sessions are upcoming and posts are never dated in the future.
for(let day=0;day<7;day++){
 const now=new Date(moveGameDate(gameWeek('2026-11-02')[0],day)+'T07:00:00');const state=seedGamingState(now);
 assert.ok(validGamingState(JSON.parse(JSON.stringify(state))));assert.equal(state.events.length,16);
 for(const post of state.posts){assert.ok(new Date(post.createdAt)<=now);if(post.eventId)assert.ok(!sessionStarted(state.events.find(e=>e.id===post.eventId),now),post.id)}
}
const now=new Date('2026-11-04T09:00:00');const seed=seedGamingState(now);
assert.deepEqual(gameWeek('2026-11-04'),['2026-11-02','2026-11-03','2026-11-04','2026-11-05','2026-11-06','2026-11-07','2026-11-08']);
// Joining and leaving tables.
const open=seed.events.find(e=>e.id==='shop-2026-11-02-2');assert.equal(seatsLeft(open,[]),1);
const joined=toggleGameJoin(seed,open.id,now);assert.ok(joined.state.joined.includes(open.id));assert.equal(seatsLeft(open,joined.state.joined),0);
assert.ok(toggleGameJoin(seed,'missing',now).error);
assert.ok(toggleGameJoin(seed,'shop-2026-11-02-1',new Date('2026-11-06T19:00:00')).error);
assert.ok(!toggleGameJoin(joined.state,open.id,now).state.joined.includes(open.id));
assert.ok(toggleGameJoin({...seed,events:seed.events.map(e=>e.id===open.id?{...e,booked:6}:e)},open.id,now).error);
// Forum posts: visitors can't post shop news or link sessions that already started.
const values={name:' Pat ',title:' Need a fourth ',body:' Anyone? ',category:'Looking for players',eventId:'shop-2026-11-02-1'};
assert.equal(makeForumPost(values,'p1',seed.events,now).post.name,'Pat');
assert.ok(makeForumPost({...values,category:'Shop news'},'p1',seed.events,now).error);
assert.ok(makeForumPost({...values,eventId:'shop-2026-11-02-0'},'p1',seed.events,new Date('2026-11-04T18:30:00')).error);
assert.ok(makeForumPost({...values,eventId:'missing'},'p1',seed.events,now).error);
assert.ok(makeForumPost({...values,body:'  '},'p1',seed.events,now).error);
assert.ok(makeForumReply({name:'Sam',body:'Me!'},'r1',now).reply);assert.ok(makeForumReply({name:'',body:'Me!'},'r1',now).error);
// Hosting sessions.
const host={title:'Strategy night',game:'Verdant Valleys',host:'Pat',category:'Board games',date:'2026-11-05',time:'18:00',capacity:'4'};
assert.equal(makeGameSession(host,'h1',now).event.capacity,4);
for(const bad of [{time:'25:00'},{time:'9:00'},{date:'2026-11-03'},{date:'2026-02-30'},{capacity:'1'},{capacity:'2.5'},{category:'Video games'},{title:' '}])assert.ok(makeGameSession({...host,...bad},'h1',now).error,JSON.stringify(bad));
// Old sessions are pruned, the shop schedule tops back up, and stale links are cleared.
const later=refreshGamingState({...joined.state,posts:[...joined.state.posts,{...makeForumPost(values,'p1',seed.events,now).post}]},new Date('2026-12-01T09:00:00'));
assert.ok(validGamingState(later));assert.ok(later.events.every(e=>e.date>='2026-11-17'));
for(const e of shopEvents('2026-12-01'))assert.ok(later.events.some(x=>x.id===e.id));
assert.deepEqual(later.joined,[]);assert.ok(later.posts.every(p=>!p.eventId||later.events.some(e=>e.id===p.eventId)));
assert.equal(refreshGamingState(seed,now).events.length,seed.events.length);
// Storage validation.
assert.ok(!validGamingState(null));assert.ok(!validGamingState({...seed,joined:['missing']}));
assert.ok(!validGamingState({...seed,events:[...seed.events,seed.events[0]]}));
assert.ok(!validGamingState({...seed,events:seed.events.map((e,i)=>i?e:{...e,time:'24:00'})}));
assert.ok(!validGamingState({...seed,events:Array.from({length:eventLimit+51},(_,i)=>({...seed.events[0],id:'e'+i}))}));
assert.ok(gameDate(new Date('2026-11-04T23:30:00'))==='2026-11-04');
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Gaming}=await server.ssrLoadModule('/src/Gaming.jsx');
 const html=renderToStaticMarkup(React.createElement(Gaming));
 for(const text of ['Lantern','Pull up a chair.','Coming up next','Verdant Valleys','Arcane Rivals','Beyond the Lantern','Game schedule','Community board','Reset demo data'])assert.ok(html.includes(text),text);
 assert.equal((html.match(/class="gs-session /g)||[]).length,3);
 const {default:GameSchedule}=await server.ssrLoadModule('/src/GameSchedule.jsx');
 const schedule=renderToStaticMarkup(React.createElement(GameSchedule,{events:seed.events,joined:[],onJoin(){},weekDate:'2026-11-09',onWeek(){},category:'All games',onCategory(){},onHost(){},canHost:true,highlight:'shop-2026-11-09-1'}));
 assert.equal((schedule.match(/class="gs-session /g)||[]).length,4);assert.ok(schedule.includes('gs-highlight'));
 const {default:GameForum}=await server.ssrLoadModule('/src/GameForum.jsx');
 const forum=renderToStaticMarkup(React.createElement(GameForum,{posts:seed.posts,events:seed.events,onOpen(){},onNew(){}}));
 assert.equal((forum.match(/class="gs-post"/g)||[]).length,3);assert.ok(forum.indexOf('PINNED')<forum.indexOf('Casual card players'));
 const {default:ExampleGallery}=await server.ssrLoadModule('/src/ExampleGallery.jsx');
 const gallery=renderToStaticMarkup(React.createElement(ExampleGallery));
 assert.ok(gallery.includes('demo=gaming'));assert.ok(gallery.includes('Lantern &amp; Lore'));assert.ok(!gallery.includes('Sidequest'));assert.equal((gallery.match(/class="example-project /g)||[]).length,3);
 console.log('Passed: seeded sessions and posts on every weekday, seat sign-ups, post and session validation, schedule refresh, storage validation, shop/schedule/forum rendering and the three-example gallery.');
}finally{await server.close()}
