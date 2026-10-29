import {localDate,shiftDate,displayDate,validDate} from './appointment-data.js';
export const gameCategories=['Board games','Card games','Roleplaying'];
export const forumCategories=['Event chat','Looking for players','Game talk','Shop news'];
export const postCategories=forumCategories.filter(c=>c!=='Shop news');
export const eventLimit=100;
export const gameDate=localDate;
export const moveGameDate=shiftDate;
export function gameWeek(date){const monday=shiftDate(date,-((new Date(date+'T12:00:00').getDay()+6)%7));return Array.from({length:7},(_,i)=>shiftDate(monday,i))}
export const formatGameDate=(date,options={month:'short',day:'numeric'})=>displayDate(date,options);
export function gameTime(time){const [hour,minute]=time.split(':').map(Number);return `${hour%12||12}:${String(minute).padStart(2,'0')} ${hour<12?'AM':'PM'}`}
export const gamePicks=[{name:'Verdant Valleys',category:'Board games',style:'Strategy · 2–4 players · 45 min',price:44,art:'forest',description:'Grow a little kingdom. Try not to lose it to your friends.'},{name:'Arcane Rivals',category:'Card games',style:'Deck building · 2 players · 30 min',price:24,art:'cards',description:'One more card. One clever combo. One very good rematch.'},{name:'Beyond the Lantern',category:'Roleplaying',style:'Storytelling · 3–6 players · Your adventure',price:36,art:'dice',description:'New worlds, questionable plans, and a table full of stories.'}];
const shopSessions=[{offset:2,title:'Learn to play: board game night',game:'Verdant Valleys + shop favorites',category:'Board games',time:'18:00',host:'Jamie · Shop crew',capacity:16,booked:7,level:'Beginner friendly'},{offset:4,title:'Friday night card club',game:'Arcane Rivals · casual decks',category:'Card games',time:'18:30',host:'Morgan · Card club',capacity:20,booked:12,level:'All levels'},{offset:5,title:'One-shot at the lantern',game:'Beyond the Lantern',category:'Roleplaying',time:'13:00',host:'Alex · Game master',capacity:6,booked:5,level:'New players welcome'},{offset:6,title:'Sunday open tables',game:'Bring a game or borrow ours',category:'Board games',time:'12:00',host:'Sam · Shop crew',capacity:24,booked:8,level:'Drop-in friendly'}];
// The shop's recurring sessions for this week and the next three. Ids are keyed by week so they stay stable across visits.
export function shopEvents(today=gameDate()){const monday=gameWeek(today)[0];return Array.from({length:4},(_,week)=>{const start=shiftDate(monday,week*7);return shopSessions.map(({offset,...t},index)=>({...t,id:'shop-'+start+'-'+index,date:shiftDate(start,offset)}))}).flat()}
export function sessionStarted(event,now=new Date()){return new Date(event.date+'T'+event.time)<=now}
export function seatsLeft(event,joined){return Math.max(0,event.capacity-event.booked-(joined.includes(event.id)?1:0))}
export function seedGamingState(now=new Date()){
 const events=shopEvents(gameDate(now));const next=index=>events.find(e=>e.id.endsWith('-'+index)&&!sessionStarted(e,now));const ago=hours=>new Date(now.getTime()-hours*3600000).toISOString();
 return {events,joined:[],posts:[{id:'welcome',name:'Jamie',title:'Your next favorite game comes with new friends.',category:'Shop news',body:'Welcome to the Lantern & Lore community board! Share an event, find a group, or ask about a game. New to tabletop? Our learn-to-play nights are a great first seat at the table.',eventId:'',createdAt:ago(72),replies:[{id:'reply-welcome',name:'Riley',body:'Came solo last week. Left with a new game group. Highly recommend it!',createdAt:ago(50)}]},{id:'oneshot',name:'Alex',title:'One seat left for Saturday’s one-shot!',category:'Looking for players',body:'Running a cozy fantasy adventure this Saturday. No experience or character sheet needed—just bring your imagination. We’ll teach the rules as we go.',eventId:next(2).id,createdAt:ago(20),replies:[]},{id:'cards',name:'Morgan',title:'Casual card players: what are you bringing Friday?',category:'Event chat',body:'Trying a new deck this week. Anyone up for some relaxed practice games before the main meetup?',eventId:next(1).id,createdAt:ago(6),replies:[{id:'reply-cards',name:'Sam',body:'Count me in! I’ll bring a spare deck for anyone who wants to try.',createdAt:ago(3)}]}]};
}
// Drops sessions more than two weeks old and tops the shop's recurring schedule back up, so saved state never goes stale or fills up.
export function refreshGamingState(state,now=new Date()){
 const today=gameDate(now),cutoff=shiftDate(today,-14);const kept=state.events.filter(e=>e.date>=cutoff);const ids=new Set(kept.map(e=>e.id));const events=[...kept,...shopEvents(today).filter(e=>!ids.has(e.id))];const live=new Set(events.map(e=>e.id));
 return {...state,events,joined:state.joined.filter(id=>live.has(id)),posts:state.posts.map(p=>p.eventId&&!live.has(p.eventId)?{...p,eventId:''}:p)};
}
export function toggleGameJoin(state,eventId,now=new Date()){
 const event=state.events.find(e=>e.id===eventId);if(!event)return {error:'That session could not be found.'};
 if(state.joined.includes(eventId))return {state:{...state,joined:state.joined.filter(id=>id!==eventId)},message:'Your demo seat has been released.'};
 if(sessionStarted(event,now))return {error:'This session has already started.'};
 if(!seatsLeft(event,state.joined))return {error:'This table is full. Try another session.'};
 return {state:{...state,joined:[...state.joined,eventId]},message:'You’re on the demo list! Your seat is saved in this browser.'};
}
export function makeForumPost(values,id,events,now=new Date()){
 const name=values.name?.trim(),title=values.title?.trim(),body=values.body?.trim();
 if(!name||name.length>60)return {error:'Enter a display name (up to 60 characters).'};
 if(!title||title.length>120)return {error:'Enter a post title (up to 120 characters).'};
 if(!body||body.length>3000)return {error:'Write a message (up to 3,000 characters).'};
 if(!postCategories.includes(values.category))return {error:'Choose a forum category.'};
 const event=values.eventId&&events.find(e=>e.id===values.eventId);
 if(values.eventId&&(!event||sessionStarted(event,now)))return {error:'Choose an upcoming session, or post without one.'};
 return {post:{id,name,title,body,category:values.category,eventId:values.eventId||'',createdAt:now.toISOString(),replies:[]}};
}
export function makeForumReply(values,id,now=new Date()){
 const name=values.name?.trim(),body=values.body?.trim();
 if(!name||name.length>60||!body||body.length>3000)return {error:'Add your display name (up to 60 characters) and a reply (up to 3,000).'};
 return {reply:{id,name,body,createdAt:now.toISOString()}};
}
const clockTime=date=>`${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
export function makeGameSession(values,id,now=new Date()){
 const title=values.title?.trim(),game=values.game?.trim(),host=values.host?.trim(),capacity=Number(values.capacity);
 if(!title||title.length>100||!game||game.length>100||!host||host.length>60)return {error:'Enter a session title, game, and host name.'};
 if(!gameCategories.includes(values.category))return {error:'Choose a game category.'};
 // The round trip rejects local times that don't exist, such as 2:30 AM on a spring-forward day.
 const date=new Date(values.date+'T'+values.time);if(!validDate(values.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time||'')||Number.isNaN(date.getTime())||gameDate(date)!==values.date||clockTime(date)!==values.time||date<=now)return {error:'Choose a future date and time.'};
 if(!Number.isInteger(capacity)||capacity<2||capacity>50)return {error:'Choose a table size between 2 and 50.'};
 return {event:{id,title,game,host,category:values.category,date:values.date,time:values.time,capacity,booked:0,level:'Community hosted'}};
}
const text=(value,max)=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
const stamp=value=>typeof value==='string'&&!Number.isNaN(Date.parse(value));
export function validGamingState(value){
 if(!value||!Array.isArray(value.events)||value.events.length>eventLimit+50||!Array.isArray(value.posts)||value.posts.length>200||!Array.isArray(value.joined))return false;
 const events=value.events;const ids=new Set(events.map(e=>e?.id));
 return ids.size===events.length&&events.every(e=>e&&text(e.id,100)&&text(e.title,100)&&text(e.game,100)&&text(e.host,60)&&text(e.level,60)&&gameCategories.includes(e.category)&&validDate(e.date)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time)&&stamp(e.date+'T'+e.time)&&Number.isInteger(e.capacity)&&e.capacity>=2&&e.capacity<=50&&Number.isInteger(e.booked)&&e.booked>=0&&e.booked<=e.capacity)&&new Set(value.joined).size===value.joined.length&&value.joined.every(id=>ids.has(id)&&events.find(e=>e.id===id).booked<events.find(e=>e.id===id).capacity)&&new Set(value.posts.map(p=>p?.id)).size===value.posts.length&&value.posts.every(p=>p&&text(p.id,100)&&text(p.name,60)&&text(p.title,120)&&text(p.body,3000)&&forumCategories.includes(p.category)&&typeof p.eventId==='string'&&(!p.eventId||ids.has(p.eventId))&&stamp(p.createdAt)&&Array.isArray(p.replies)&&p.replies.length<=100&&new Set(p.replies.map(r=>r?.id)).size===p.replies.length&&p.replies.every(r=>r&&text(r.id,100)&&text(r.name,60)&&text(r.body,3000)&&stamp(r.createdAt)));
}
