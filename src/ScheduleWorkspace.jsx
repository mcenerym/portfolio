import React,{useRef,useState} from 'react';
import WeekCalendar from './WeekCalendar.jsx';
import AsterIcon from './AsterIcon.jsx';
import {providers,displayDate,shiftDate,localDate,totalDuration} from './appointment-data.js';

function weekRange(first,last){const sameMonth=first.slice(0,7)===last.slice(0,7);return `${displayDate(first,{month:'short',day:'numeric'})} – ${displayDate(last,sameMonth?{day:'numeric',year:'numeric'}:{month:'short',day:'numeric',year:'numeric'})}`}
export default function ScheduleWorkspace({people,week,weekDate,appointments,scheduled,reminderCount,providerFilter,onProviderFilter,onWeekChange,today,onNew,onBook,onRemind,onCancel}){
 const picker=useRef(null);const [showPicker,setShowPicker]=useState(false);const range=weekRange(week[0],week[4]);
 // Open the native date picker from the range label; browsers without showPicker get a visible date field instead.
 function chooseWeek(){try{picker.current.showPicker();}catch{setShowPicker(true);requestAnimationFrame(()=>picker.current?.focus())}}
 return <section className="aster-compact-workspace" aria-label="Weekly schedule">
  <div className="aster-compact-titlebar">
   <div className="aster-compact-title"><h1>Schedule</h1></div>
   <div className="aster-week-switcher" role="group" aria-label="Week navigation">
    <button className="aster-week-step" title="Previous week" aria-label="Previous week" onClick={()=>onWeekChange(shiftDate(weekDate,-7))}><AsterIcon type="left"/></button>
    <button className="aster-week-label" aria-label={`Week of ${range}. Choose another week`} onClick={chooseWeek}><AsterIcon type="calendar" size={16}/><span>{range}</span></button>
    <input ref={picker} className={`aster-week-picker ${showPicker?'is-visible':''}`} type="date" aria-label="Choose week by date" tabIndex={showPicker?0:-1} value={week[0]} onChange={e=>{if(e.target.value){onWeekChange(e.target.value);setShowPicker(false)}}} onBlur={()=>setShowPicker(false)}/>
    <button className="aster-week-step" title="Next week" aria-label="Next week" onClick={()=>onWeekChange(shiftDate(weekDate,7))}><AsterIcon type="right"/></button>
    <button className="aster-week-today" disabled={week.includes(today)} onClick={()=>onWeekChange(localDate())}>Today</button>
   </div>
   <button id="aster-new-appointment" className="aster-primary-button" aria-haspopup="dialog" onClick={onNew}><AsterIcon type="plus" size={16}/>New appointment</button>
  </div>
  <div className="aster-compact-filterbar">
   <div className="aster-provider-chips" role="group" aria-label="Show provider">{[{id:'All',name:'All providers'},...providers].map(provider=><button key={provider.id} className={`provider-${provider.id}`} aria-pressed={providerFilter===provider.id} onClick={()=>onProviderFilter(provider.id)}>{provider.id!=='All'&&<i className="aster-provider-dot" aria-hidden="true"/>}{provider.name}</button>)}</div>
   <label className="aster-compact-provider"><span>Provider</span><select aria-label="Filter schedule by provider" value={providerFilter} onChange={e=>onProviderFilter(e.target.value)}><option value="All">All providers</option>{providers.map(provider=><option key={provider.id} value={provider.id}>{provider.name}</option>)}</select></label>
   <div className="aster-compact-stats" aria-live="polite"><span><strong>{scheduled.length}</strong> visits</span><span><strong>{scheduled.reduce((sum,a)=>sum+totalDuration(a.procedureIds),0)}</strong> min</span><span><strong>{reminderCount}</strong> mock reminders</span></div>
  </div>
  <WeekCalendar people={people} days={week} appointments={appointments} today={today} onBook={onBook} onRemind={onRemind} onCancel={onCancel}/>
  <div className="aster-compact-footnote">Mon–Fri · 9 AM–5 PM · Browser-local time · Fictional demo</div>
 </section>;
}
