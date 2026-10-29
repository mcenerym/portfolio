import React,{useState} from 'react';
import AsterIcon from './AsterIcon.jsx';
import {people as samplePeople,providers,displayDate,timeLabel,reminderPreview} from './appointment-data.js';

export default function RemindersWorkspace({people=samplePeople,appointments,reminders,reminderId,channel,onAppointmentChange,onChannelChange,onSimulate}){
 const [pane,setPane]=useState('compose');
 const selected=appointments.find(a=>a.id===reminderId);const preview=reminderPreview(selected,channel,people);
 return <section className="aster-reminder-workspace" aria-label="Reminder studio">
  <div className="aster-secondary-toolbar"><div><h1>Reminders</h1><span>Simulation only · Nothing is sent</span></div><span className="aster-reminder-count">{reminders.length} mock sends</span></div>
  <div className="aster-reminder-pane-switch" role="group" aria-label="Reminder panels">{[['compose','Compose'],['preview','Preview'],['activity','Activity']].map(([id,label])=><button key={id} aria-pressed={pane===id} onClick={()=>setPane(id)}>{label}{id==='activity'&&` (${reminders.length})`}</button>)}</div>
  <div className="aster-reminder-columns">
   <div className="aster-reminder-compose aster-reminder-pane" data-active={pane==='compose'}><div className="aster-reminder-pane-heading"><h2>Compose</h2><span>1. Choose · 2. Preview · 3. Simulate</span></div><div className="aster-reminder-compose-body"><label htmlFor="aster-reminder-appointment">Appointment</label><select id="aster-reminder-appointment" value={selected?reminderId:''} onChange={e=>onAppointmentChange(e.target.value)}><option value="">Choose an appointment</option>{appointments.map(a=><option key={a.id} value={a.id}>{people.find(p=>p.id===a.personId).name} · {displayDate(a.date)} · {timeLabel(a.start)} · {providers.find(p=>p.id===a.providerId).name}</option>)}</select>
    {!appointments.length&&<p className="aster-reminder-help">No scheduled appointments. Add one from Schedule.</p>}
    <span className="aster-channel-label">Channel</span><div className="aster-compact-channel" role="group" aria-label="Reminder channel">{[['email','mail','Email'],['sms','phone','Text message']].map(([id,icon,label])=><button key={id} aria-pressed={channel===id} onClick={()=>onChannelChange(id)}><AsterIcon type={icon} size={16}/>{label}</button>)}</div>
    <div className="aster-mock-notice"><strong>Mock delivery</strong><p>Simulate send records an activity entry in this browser. No email or SMS provider is connected.</p></div>
    <button className="aster-reminder-preview-button aster-secondary-button" onClick={()=>setPane('preview')}>Preview message →</button>
    <button className="aster-primary-button" disabled={Boolean(preview.error)} onClick={onSimulate}>Simulate {channel==='email'?'email':'text'} send ↗</button>
    {preview.error&&<p className="aster-reminder-help" role="status">{preview.error}</p>}
   </div></div>
   <div className="aster-reminder-preview-pane aster-reminder-pane" data-active={pane==='preview'}><div className="aster-reminder-pane-heading"><h2>{channel==='email'?'Email preview':'Text preview'}</h2><span className="aster-not-sent">Not sent</span></div><div className="aster-reminder-preview-scroll" role="region" aria-label="Reminder message preview" tabIndex={0}>
    {preview.error?<div className="aster-reminder-empty"><span><AsterIcon type="mail" size={30}/></span><h3>Your message starts here.</h3><p>{preview.error}</p></div>:<><dl className="aster-compact-address"><div><dt>To</dt><dd>{preview.destination}</dd></div>{channel==='email'&&<div><dt>Subject</dt><dd>{preview.subject}</dd></div>}</dl><div className={`aster-compact-message ${channel==='sms'?'is-text':''}`}>{channel==='email'&&<span>✳ aster</span>}<p>{preview.body}</p><small>Portfolio demonstration · No real appointment or delivery</small></div></>}
    <div className="aster-reminder-mobile-actions"><button className="aster-secondary-button" onClick={()=>setPane('compose')}>← Compose</button><button className="aster-primary-button" disabled={Boolean(preview.error)} onClick={()=>{onSimulate();setPane('activity')}}>Simulate send ↗</button></div>
   </div></div>
   <div className="aster-reminder-activity aster-reminder-pane" data-active={pane==='activity'}><div className="aster-reminder-pane-heading"><h2>Activity</h2><span>{reminders.length} local entries</span></div><div className="aster-reminder-activity-scroll" role="region" aria-label="Simulated reminder activity" tabIndex={0}>
    {reminders.length?reminders.map(reminder=><article className="aster-compact-log" key={reminder.id}><div><span><AsterIcon type={reminder.channel==='email'?'mail':'phone'}/></span><h3>{reminder.channel==='email'?'Email':'Text'} simulated</h3><b>Mock only</b></div><p>{reminder.destination}</p><time dateTime={reminder.createdAt}>{new Date(reminder.createdAt).toLocaleString('en-US')}</time><details><summary>Recorded message</summary><p>{reminder.body}</p></details></article>):<div className="aster-reminder-empty"><h3>No activity yet.</h3><p>Simulate a reminder to record it here. Nothing will be sent.</p></div>}
   </div></div>
  </div><div className="aster-compact-footnote">Email & text previews · Local activity history · No real messaging service connected</div>
 </section>;
}
