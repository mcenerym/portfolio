import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import {people,seedAppointments} from '../src/appointment-data.js';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Details}=await server.ssrLoadModule('/src/PersonDetails.jsx');
 const noop=()=>{};const base={person:people[0],appointments:seedAppointments('2026-10-27'),notes:[],tab:'contact',onTab:noop,draft:'',onDraft:noop,onSave:noop,onSchedule:noop,onBack:noop};
 const contact=renderToStaticMarkup(React.createElement(Details,base));assert.ok(contact.includes('avery.brooks@example.com'));assert.ok(contact.includes('202-555-0101'));
 const history=renderToStaticMarkup(React.createElement(Details,{...base,tab:'history'}));assert.ok(history.includes('Initial consultation'));assert.ok(!history.includes('Routine cleaning'));
 const notes=renderToStaticMarkup(React.createElement(Details,{...base,tab:'notes',notes:[{id:'n',text:'<script>demo</script>',createdAt:'2026-10-27T16:00:00Z'}]}));assert.ok(notes.includes('&lt;script&gt;demo&lt;/script&gt;'));assert.ok(notes.includes('Save note'));assert.ok(notes.includes('Notes (1)'));
 const {default:People}=await server.ssrLoadModule('/src/PeopleWorkspace.jsx');const workspace=renderToStaticMarkup(React.createElement(People,{search:'',onSearch:noop,onSchedule:noop,appointments:base.appointments}));assert.equal(workspace.split('scope="row"').length-1,6);assert.ok(workspace.includes('aster-person-details-panel'));
 console.log('Verified contact details, person-specific appointment history, note controls and escaped content, directory selection, and the details panel.');
}finally{await server.close()}
