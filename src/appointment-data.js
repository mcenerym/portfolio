export const people=[
 {id:'AC-1001',name:'Avery Brooks',email:'avery.brooks@example.com',phone:'202-555-0101',color:'rose'},
 {id:'AC-1002',name:'Jamie Chen',email:'jamie.chen@example.com',phone:'202-555-0102',color:'mint'},
 {id:'AC-1003',name:'Taylor Reed',email:'taylor.reed@example.com',phone:'202-555-0103',color:'lilac'},
 {id:'AC-1004',name:'Cameron Patel',email:'cameron.patel@example.com',phone:'',color:'peach'},
 {id:'AC-1005',name:'Riley Morgan',email:'',phone:'202-555-0105',color:'mint'},
 {id:'AC-1006',name:'Jordan Hayes',email:'jordan.hayes@example.com',phone:'202-555-0106',color:'rose'},
];
export const procedures=[
 {id:'consult',name:'Initial consultation',duration:30,category:'Consultation',description:'A first visit to discuss the next steps.'},
 {id:'clean',name:'Routine cleaning',duration:45,category:'Routine care',description:'A standard cleaning appointment.'},
 {id:'imaging',name:'Digital imaging',duration:30,category:'Diagnostics',description:'A dedicated imaging session.'},
 {id:'followup',name:'Follow-up visit',duration:15,category:'Consultation',description:'A short follow-up with your provider.'},
 {id:'wellness',name:'Wellness check',duration:60,category:'Routine care',description:'An extended routine appointment.'},
 {id:'extended',name:'Extended procedure',duration:90,category:'Procedure',description:'A longer appointment with reserved provider time.'},
];
export const providers=[{id:'ellis',name:'Morgan Ellis',role:'Care provider'},{id:'lee',name:'Quinn Lee',role:'Care provider'},{id:'blake',name:'Alex Blake',role:'Care provider'}];
export function localDate(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
export function validDate(date){if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return false;const parsed=new Date(`${date}T12:00:00`);return !Number.isNaN(parsed.getTime())&&localDate(parsed)===date}
export function shiftDate(date,days){const value=new Date(`${date}T12:00:00`);value.setDate(value.getDate()+days);return localDate(value)}
export function isWeekday(date){const day=new Date(`${date}T12:00:00`).getDay();return day>0&&day<6}
export function firstWorkday(date=localDate()){let next=date;while(!isWeekday(next))next=shiftDate(next,1);return next}
export function displayDate(date,options={month:'short',day:'numeric',year:'numeric'}){return new Date(`${date}T12:00:00`).toLocaleDateString('en-US',options)}
export function timeLabel(minutes){const hour=Math.floor(minutes/60);return `${hour%12||12}:${String(minutes%60).padStart(2,'0')} ${hour>=12?'PM':'AM'}`}
export function workweekDates(date){const monday=shiftDate(date,-((new Date(`${date}T12:00:00`).getDay()+6)%7));return Array.from({length:5},(_,i)=>shiftDate(monday,i))}
export function isoWeekValue(date){const value=new Date(`${date}T00:00:00Z`);value.setUTCDate(value.getUTCDate()+4-(value.getUTCDay()||7));const year=value.getUTCFullYear();const first=new Date(Date.UTC(year,0,1));const week=Math.ceil((((value-first)/86400000)+1)/7);return `${year}-W${String(week).padStart(2,'0')}`}
export function dateFromISOWeek(value){const match=/^(\d{4})-W(\d{2})$/.exec(value||'');if(!match)return null;const year=Number(match[1]),week=Number(match[2]);if(year<1000||week<1||week>53)return null;const jan4=new Date(Date.UTC(year,0,4));jan4.setUTCDate(jan4.getUTCDate()-((jan4.getUTCDay()+6)%7)+(week-1)*7);const date=jan4.toISOString().slice(0,10);return isoWeekValue(date)===value?date:null}
export function weekAppointments(appointments,date,providerId='All'){const days=new Set(workweekDates(date));return appointments.filter(a=>days.has(a.date)&&(providerId==='All'||a.providerId===providerId)).sort((a,b)=>a.date.localeCompare(b.date)||a.start-b.start)}
export function totalDuration(ids){return procedures.filter(p=>ids.includes(p.id)).reduce((sum,p)=>sum+p.duration,0)}
export function searchPeople(search,directory=people){const term=search.trim().toLowerCase();return directory.filter(p=>`${p.name} ${p.id} ${p.email} ${p.phone}`.toLowerCase().includes(term))}
export function validateNewPerson(value,directory=people){
 if(directory.length>=people.length+200)return 'The demo has reached its 200 added-person limit. Reset the demo to start fresh.';
 if(!value||typeof value.name!=='string'||!value.name.trim()||value.name.trim().length>100)return 'Enter a name of up to 100 characters.';
 if(typeof value.email!=='string'||typeof value.phone!=='string')return 'Enter valid contact information.';
 const email=value.email.trim(),phone=value.phone.trim();
 if(!email&&!phone)return 'Enter an email address or phone number.';
 if(email&&(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)))return 'Enter a valid email address.';
 if(phone&&(phone.length>40||!/^\+?[\d\s().-]+(?:\s*(?:x|ext\.?)\s*\d+)?$/i.test(phone)||phone.replace(/\D/g,'').length<7))return 'Enter a valid phone number.';
 return '';
}
export function validateCustomPeople(value){return Array.isArray(value)&&value.length<=200&&value.every(p=>p&&typeof p.id==='string'&&/^AC-\d{4,8}$/.test(p.id)&&!people.some(sample=>sample.id===p.id)&&['rose','mint','lavender','peach'].includes(p.color)&&!validateNewPerson(p))&&new Set(value.map(p=>p.id)).size===value.length}
export function personAppointmentHistory(appointments,personId){return appointments.filter(a=>a.personId===personId).sort((a,b)=>b.date.localeCompare(a.date)||b.start-a.start)}
export function validatePersonNotes(value,directory=people){return value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.entries(value).every(([personId,notes])=>directory.some(p=>p.id===personId)&&Array.isArray(notes)&&notes.length<=100&&notes.every(note=>note&&typeof note.id==='string'&&typeof note.text==='string'&&note.text.trim().length>0&&note.text.length<=2000&&typeof note.createdAt==='string'&&!Number.isNaN(Date.parse(note.createdAt)))&&new Set(notes.map(note=>note.id)).size===notes.length)}
export function slotAvailable(appointments,{date,start,duration,providerId,personId},ignoreId=null){
 if(!validDate(date)||!isWeekday(date)||!Number.isInteger(start)||start%15!==0||!Number.isInteger(duration)||duration<=0||start<540||start+duration>1020)return false;
 return !appointments.some(a=>a.id!==ignoreId&&a.status==='Scheduled'&&a.date===date&&(a.providerId===providerId||a.personId===personId)&&start<a.start+totalDuration(a.procedureIds)&&start+duration>a.start);
}
export function availableSlots(appointments,details){return Array.from({length:32},(_,index)=>540+index*15).filter(start=>slotAvailable(appointments,{...details,start}))}
export function findFirstAvailable(appointments,{personId,procedureIds,fromDate,providerId=null,searchDays=30},now=new Date(),directory=people){
 if(!directory.some(p=>p.id===personId)||!validDate(fromDate)||!Array.isArray(procedureIds)||!procedureIds.length||new Set(procedureIds).size!==procedureIds.length||procedureIds.some(id=>!procedures.some(p=>p.id===id)))return null;
 const candidates=providerId?providers.filter(p=>p.id===providerId):providers;const duration=totalDuration(procedureIds);if(!candidates.length||!duration||duration>480)return null;
 const today=localDate(now);const first=fromDate<today?today:fromDate;const currentMinute=now.getHours()*60+now.getMinutes();const limit=Number.isInteger(searchDays)?Math.max(0,Math.min(searchDays,366)):30;
 for(let offset=0;offset<limit;offset++){
  const date=shiftDate(first,offset);if(!isWeekday(date))continue;let best=null;
  for(const provider of candidates){const start=availableSlots(appointments,{date,duration,providerId:provider.id,personId}).find(time=>date!==today||time>currentMinute);if(start!==undefined&&(!best||start<best.start))best={date,providerId:provider.id,start}}
  if(best)return best;
 }
 return null;
}
export function validateAppointment(appointment,appointments,today=localDate(),directory=people){
 if(!directory.some(p=>p.id===appointment.personId))return 'Choose a person from the sample directory.';
 if(!providers.some(p=>p.id===appointment.providerId))return 'Choose a provider.';
 if(!Array.isArray(appointment.procedureIds)||!appointment.procedureIds.length||new Set(appointment.procedureIds).size!==appointment.procedureIds.length||appointment.procedureIds.some(id=>!procedures.some(p=>p.id===id)))return 'Choose at least one valid procedure.';
 if(!validDate(appointment.date)||appointment.date<today)return 'Choose today or a future date.';
 if(!isWeekday(appointment.date))return 'The sample practice is open Monday through Friday.';
 if(!slotAvailable(appointments,{...appointment,duration:totalDuration(appointment.procedureIds)}))return 'That time is unavailable. Choose another slot; provider and person appointments cannot overlap.';
 return '';
}
export function seedAppointments(date=firstWorkday()){return [
 {id:'sample-a',personId:'AC-1001',providerId:'ellis',procedureIds:['consult'],date,start:540,status:'Scheduled'},
 {id:'sample-b',personId:'AC-1002',providerId:'lee',procedureIds:['clean'],date,start:600,status:'Scheduled'},
 {id:'sample-c',personId:'AC-1006',providerId:'ellis',procedureIds:['imaging','followup'],date,start:660,status:'Scheduled'},
 {id:'sample-d',personId:'AC-1005',providerId:'blake',procedureIds:['wellness'],date,start:810,status:'Scheduled'},
 ]}
export function reminderPreview(appointment,channel,directory=people){
 const person=directory.find(p=>p.id===appointment?.personId);const provider=providers.find(p=>p.id===appointment?.providerId);
 if(!appointment||appointment.status!=='Scheduled'||!person||!provider)return {error:'Choose a scheduled appointment.'};
 if(!['email','sms'].includes(channel))return {error:'Choose email or text.'};
 const destination=channel==='email'?person.email:person.phone;if(!destination)return {error:`This sample person has no ${channel==='email'?'email address':'phone number'}. Choose another channel.`};
 return {destination,subject:'Your Aster appointment reminder',body:`Hi ${person.name.split(' ')[0]}, a reminder of your ${appointment.procedureIds.map(id=>procedures.find(p=>p.id===id)?.name).join(' + ')} appointment on ${displayDate(appointment.date)} at ${timeLabel(appointment.start)} with ${provider.name}. Demo only — this is not a real appointment.`};
}
export function validateStoredState(value){const custom=value?.customPeople===undefined?[]:value.customPeople;if(!validateCustomPeople(custom))return false;const directory=[...people,...custom];return value&&Array.isArray(value.appointments)&&value.appointments.length<=500&&value.appointments.every(a=>a&&typeof a.id==='string'&&directory.some(p=>p.id===a.personId)&&providers.some(p=>p.id===a.providerId)&&validDate(a.date)&&isWeekday(a.date)&&Number.isInteger(a.start)&&a.start>=540&&a.start%15===0&&Array.isArray(a.procedureIds)&&a.procedureIds.length>0&&new Set(a.procedureIds).size===a.procedureIds.length&&a.procedureIds.every(id=>procedures.some(p=>p.id===id))&&a.start+totalDuration(a.procedureIds)<=1020&&['Scheduled','Canceled'].includes(a.status))&&new Set(value.appointments.map(a=>a.id)).size===value.appointments.length&&Array.isArray(value.reminders)&&value.reminders.length<=100&&value.reminders.every(r=>r&&typeof r.id==='string'&&typeof r.appointmentId==='string'&&typeof r.createdAt==='string'&&['email','sms'].includes(r.channel)&&typeof r.destination==='string'&&typeof r.body==='string')}
