import React,{useEffect,useState} from 'react';
import GameArt from './GameArt.jsx';
import GameSchedule,{SessionCard} from './GameSchedule.jsx';
import GameForum from './GameForum.jsx';
import {NewGamingPost,HostGame,GamingThread} from './GamingForms.jsx';
import {gamePicks,eventLimit,gameDate,gameWeek,formatGameDate,gameTime,seatsLeft,sessionStarted,seedGamingState,refreshGamingState,validGamingState,toggleGameJoin,makeForumPost,makeForumReply,makeGameSession} from './gaming-data.js';
import './gaming.css';
const storageKey='lantern-lore-community-v1';
const uid=()=>globalThis.crypto?.randomUUID?.()||String(Date.now())+Math.random().toString(16).slice(2);
const views=[['home','The shop'],['schedule','Game schedule'],['community','Community board']];
const byTime=(a,b)=>(a.date+a.time).localeCompare(b.date+b.time);
function loadState(){try{const saved=JSON.parse(localStorage.getItem(storageKey));if(validGamingState(saved))return refreshGamingState(saved)}catch{}return seedGamingState()}
function ShopHome({state,onJoin,onView}){
 const week=gameWeek(gameDate());const upcoming=state.events.filter(e=>!sessionStarted(e)).sort(byTime);const thisWeek=upcoming.filter(e=>week.includes(e.date));const openSeats=thisWeek.reduce((sum,e)=>sum+seatsLeft(e,state.joined),0);const mine=upcoming.filter(e=>state.joined.includes(e.id));
 return <>
  <section className="gs-hero"><div className="gs-hero-copy"><span className="gs-eyebrow"><span className="gs-dot"/> YOUR NEIGHBORHOOD GAME SHOP</span><h1>Pull up a chair.<br/><em>Find your table.</em></h1><p>Board games, card clubs, and roleplaying nights for brand-new players and seasoned regulars alike. See what’s on, save a seat, and meet the community.</p><div className="gs-hero-actions"><button className="gs-primary" onClick={()=>onView('schedule')}>See this week’s games ↗</button><button className="gs-secondary" onClick={()=>onView('community')}>Visit the community board</button></div><dl className="gs-stats"><div><dt>Sessions this week</dt><dd>{thisWeek.length}</dd></div><div><dt>Open seats</dt><dd>{openSeats}</dd></div><div><dt>Your saved seats</dt><dd>{mine.length}</dd></div></dl></div><div className="gs-hero-art"><GameArt/><span className="gs-hero-badge">LEARN-TO-PLAY<br/><strong>Every Wed</strong></span></div></section>
  <section className="gs-home-section"><div className="gs-section-heading"><div><span className="gs-eyebrow">ON THE TABLE SOON</span><h2>Coming up next</h2></div><button className="gs-text-button" onClick={()=>onView('schedule')}>Full schedule ↗</button></div><div className="gs-upcoming">{upcoming.slice(0,3).map(event=><div key={event.id}><span className="gs-upcoming-date">{formatGameDate(event.date,{weekday:'long',month:'short',day:'numeric'})}</span><SessionCard event={event} joined={state.joined} onJoin={onJoin}/></div>)}</div>{mine.length>0&&<div className="gs-my-seats"><strong>Your demo seats</strong><ul>{mine.map(e=><li key={e.id}>{formatGameDate(e.date,{weekday:'short',month:'short',day:'numeric'})} · {gameTime(e.time)} · {e.title}</li>)}</ul></div>}</section>
  <section className="gs-home-section"><div className="gs-section-heading"><div><span className="gs-eyebrow">STAFF PICKS</span><h2>On our shelves this month</h2></div></div><div className="gs-picks">{gamePicks.map(pick=><article className="gs-pick" key={pick.name}><div className={'gs-pick-art gs-pick-'+pick.art}><GameArt type={pick.art}/></div><div className="gs-pick-body"><span className="gs-tag">{pick.category}</span><h3>{pick.name}</h3><small>{pick.style}</small><p>{pick.description}</p><div className="gs-pick-price"><strong>${pick.price}</strong><span>Demo copy on the shelf · ask to try it</span></div></div></article>)}</div></section>
 </>;
}
export default function Gaming(){
 const [state,setState]=useState(loadState);const [view,setView]=useState('home');const [weekDate,setWeekDate]=useState(gameDate);const [category,setCategory]=useState('All games');const [dialog,setDialog]=useState(null);const [highlight,setHighlight]=useState(null);const [message,setMessage]=useState('');const [storageError,setStorageError]=useState(false);
 useEffect(()=>{document.title='Lantern & Lore — Tabletop games, events & community | Demo'},[]);
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(state));setStorageError(false)}catch{setStorageError(true)}},[state]);
 useEffect(()=>{if(highlight&&view==='schedule')document.getElementById('gs-event-'+highlight)?.scrollIntoView({block:'center'})},[highlight,view,weekDate]);
 const canHost=state.events.length<eventLimit;const thread=dialog?.type==='thread'&&state.posts.find(p=>p.id===dialog.id);
 function show(next){setView(next);setMessage('');setHighlight(null);window.scrollTo(0,0)}
 function showEvent(event){setDialog(null);setView('schedule');setWeekDate(event.date);setCategory('All games');setHighlight(event.id)}
 function join(id){const result=toggleGameJoin(state,id);if(result.error){setMessage(result.error);return}setState(result.state);setMessage(result.message)}
 function createPost(values){if(state.posts.length>=200)return {error:'The demo board is full. Reset the demo to start fresh.'};const result=makeForumPost(values,uid(),state.events);if(result.error)return result;setState(s=>({...s,posts:[result.post,...s.posts]}));setDialog({type:'thread',id:result.post.id});setMessage('Your discussion is live on the board.')}
 function hostGame(values){if(!canHost)return {error:'The demo schedule is full. Reset the demo to start fresh.'};const result=makeGameSession(values,uid());if(result.error)return result;const event=result.event;const announcement=state.posts.length<200&&makeForumPost({name:event.host,title:'New table: '+event.title,category:'Event chat',eventId:event.id,body:`${event.host} is hosting ${event.game} on ${formatGameDate(event.date,{weekday:'long',month:'long',day:'numeric'})} at ${gameTime(event.time)}. ${event.capacity} seats at the table. Pull up a chair!`},uid(),[event]).post;setState(s=>({...s,events:[...s.events,event],posts:announcement?[announcement,...s.posts]:s.posts}));showEvent(event);setMessage('Your table is on the schedule'+(announcement?' and announced on the community board.':'.'))}
 function reply(postId,values){const post=state.posts.find(p=>p.id===postId);if(!post)return {error:'That discussion could not be found.'};if(post.replies.length>=100)return {error:'This discussion has reached its 100-reply demo limit.'};const result=makeForumReply(values,uid());if(result.error)return result;setState(s=>({...s,posts:s.posts.map(p=>p.id===postId?{...p,replies:[...p.replies,result.reply]}:p)}))}
 function reset(){setState(seedGamingState());setDialog(null);setWeekDate(gameDate());setCategory('All games');setHighlight(null);setMessage('Sample sessions and discussions restored.')}
 return <div className="gs-app">
  <div className="gs-demo-bar"><a href="/#examples">← Mike’s examples</a><span>A tabletop shop React demo · Your changes stay in this browser</span></div>
  <header className="gs-header"><a href="/?page=examples&demo=gaming" className="gs-brand"><svg viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true"><path d="m16 3 11 6.5v13L16 29 5 22.5v-13z" fill="#e1ac59" stroke="#f0cf93" strokeWidth="1.5"/><path d="m16 3-5 13h10zM5 9.5 11 16l5 13 5-13 6-6.5M11 16H5m16 0h6" stroke="#5b4320" strokeWidth="1.3"/></svg>Lantern <span>&</span> Lore</a><nav id="gs-main-nav" tabIndex={-1} aria-label="Shop sections">{views.map(([id,label])=><button key={id} aria-current={view===id?'page':undefined} onClick={()=>show(id)}>{label}</button>)}</nav></header>
  <main className="gs-main">
   {storageError&&<p className="gs-error" role="alert">Browser storage is unavailable. Changes will last for this visit.</p>}
   <p className="gs-status" role="status">{message}</p>
   {view==='home'&&<ShopHome state={state} onJoin={join} onView={show}/>}
   {view==='schedule'&&<GameSchedule events={state.events} joined={state.joined} onJoin={join} weekDate={weekDate} onWeek={date=>{setWeekDate(date);setHighlight(null)}} category={category} onCategory={setCategory} onHost={()=>setDialog({type:'host'})} canHost={canHost} highlight={highlight}/>}
   {view==='community'&&<GameForum posts={state.posts} events={state.events} onOpen={id=>setDialog({type:'thread',id})} onNew={()=>setDialog({type:'post'})}/>}
   <section className="gs-invite"><span className="gs-eyebrow">RUN A GAME STORE?</span><h2>Your shop deserves software<br/>that loves games too.</h2><p>Event calendars, seat sign-ups, community boards, league standings, inventory and pre-orders.<br/>Mike builds tools that fit the way your store actually runs.</p><a className="gs-primary" href="mailto:mike.mcenery1@gmail.com?subject=Software%20for%20my%20game%20store">Talk to Mike about your shop ↗</a></section>
  </main>
  <footer className="gs-footer"><span>Lantern & Lore <small>A fictional tabletop game shop by Mike McEnery</small></span><button className="gs-text-button" onClick={reset}>Reset demo data</button><a href="/#examples">Explore the other examples ↗</a></footer>
  {dialog?.type==='post'&&<NewGamingPost events={state.events} onClose={()=>setDialog(null)} onSubmit={createPost}/>}
  {dialog?.type==='host'&&<HostGame onClose={()=>setDialog(null)} onSubmit={hostGame}/>}
  {thread&&<GamingThread post={thread} event={state.events.find(e=>e.id===thread.eventId)} onReply={reply} onEvent={showEvent} onClose={()=>setDialog(null)}/>}
 </div>;
}
