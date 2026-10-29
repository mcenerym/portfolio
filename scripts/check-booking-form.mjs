import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Form}=await server.ssrLoadModule('/src/AppointmentForm.jsx');
 const noop=()=>{};const props={personId:'AC-1003',personSearch:'',onSearch:noop,onPerson:noop,procedureIds:['consult'],onProcedure:noop,date:'2026-10-27',today:'2026-10-27',onDate:noop,providerId:'ellis',onProvider:noop,start:570,slots:[570,600],onStart:noop,error:'',onSubmit:noop,onClose:noop};
 const html=renderToStaticMarkup(React.createElement(Form,props));
 assert.equal((html.match(/<fieldset/g)||[]).length,3);
 assert.equal((html.match(/type="checkbox"/g)||[]).length,6);
 assert.ok(html.includes('id="aster-start-time"'));assert.ok(html.includes('9:30 AM – 10:00 AM'));
 assert.ok(html.includes('aria-label="Booking steps"'));assert.ok(html.includes('aster-booking-footer'));
 assert.ok(!html.includes('aster-time-slots'));assert.ok(html.includes('Taylor Reed'));
 const {default:Appointments}=await server.ssrLoadModule('/src/Appointments.jsx');
 assert.ok(!renderToStaticMarkup(React.createElement(Appointments)).includes('A calmer way to care.'));
 console.log('Verified three booking panels, six procedures, time dropdown, compact step controls, persistent footer, and tagline removal.');
}finally{await server.close()}
