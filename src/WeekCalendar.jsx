import React,{useState} from 'react';
import AsterIcon from './AsterIcon.jsx';
import {people as samplePeople,providers,procedures,displayDate,timeLabel,totalDuration} from './appointment-data.js';

export default function WeekCalendar({people=samplePeople,days,appointments,today,onBook,onRemind,onCancel}){
 const [confirming,setConfirming]=useState(null);
 return <div className="aster-week-scroll" role="region" aria-label="Monday to Friday appointment calendar" tabIndex={0}>
  <div className="aster-week-calendar">
   {days.map(day=>{
    const visits=appointments.filter(a=>a.date===day);
    const count=visits.filter(a=>a.status==='Scheduled').length;const past=day<today;const bookLabel=`New appointment for ${displayDate(day,{weekday:'long',month:'long',day:'numeric'})}`;
    return <section className={`aster-calendar-day ${day===today?'is-today':''} ${past?'is-past':''}`} key={day} aria-label={displayDate(day,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}>
     <div className="aster-column-heading"><span>{displayDate(day,{weekday:'short'})}{day===today&&<b>Today</b>}{past&&<em>Past</em>}</span><div><strong>{displayDate(day,{day:'numeric'})}</strong><small>{count} {count===1?'visit':'visits'}</small></div></div>
     <div className="aster-column-appointments">
      {visits.map(appointment=>{
       const person=people.find(p=>p.id===appointment.personId);const provider=providers.find(p=>p.id===appointment.providerId);const canceled=appointment.status==='Canceled';
       return <article className={`aster-week-visit provider-${appointment.providerId} ${canceled?'is-canceled':''}`} key={appointment.id}>
        <div className="aster-week-visit-time" title={`${timeLabel(appointment.start)} – ${timeLabel(appointment.start+totalDuration(appointment.procedureIds))}`}><strong>{timeLabel(appointment.start)}</strong><span>{totalDuration(appointment.procedureIds)} min</span></div>
        <h3>{person.name}</h3><span className="aster-week-provider"><i className="aster-provider-dot" aria-hidden="true"/>{provider.name}</span>
        <p>{appointment.procedureIds.map(id=>procedures.find(p=>p.id===id).name).join(' + ')}</p>
        {canceled?<span className="aster-status-pill is-canceled">Canceled</span>:confirming===appointment.id?<div className="aster-week-visit-confirm" role="group" aria-label={`Confirm canceling ${person.name}'s appointment`}><span>Cancel this visit?</span><div><button className="is-danger" onClick={()=>{setConfirming(null);onCancel(appointment.id)}}>Yes, cancel</button><button autoFocus onClick={()=>setConfirming(null)}>Keep</button></div></div>:<div className="aster-week-visit-actions"><button className="is-remind" aria-label={`Reminder for ${person.name} on ${displayDate(day)}`} onClick={()=>onRemind(appointment.id)}>Reminder ↗</button><button className="is-cancel" aria-label={`Cancel ${person.name}'s appointment on ${displayDate(day)} at ${timeLabel(appointment.start)}`} onClick={()=>setConfirming(appointment.id)}>Cancel</button></div>}
       </article>
      })}
      {!visits.length&&<div className="aster-column-empty">{past?<p>No appointments</p>:<button className="aster-empty-book" aria-label={bookLabel} onClick={()=>onBook(day)}><AsterIcon type="plus" size={16}/>Book a visit</button>}</div>}
     </div>
     {!past&&visits.length>0&&<button className="aster-add-day" aria-label={bookLabel} onClick={()=>onBook(day)}>＋ Add appointment</button>}
    </section>;
   })}
  </div>
 </div>;
}
