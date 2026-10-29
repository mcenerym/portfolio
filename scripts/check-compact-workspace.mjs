import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Appointments}=await server.ssrLoadModule('/src/Appointments.jsx');
 const html=renderToStaticMarkup(React.createElement(Appointments));
 for(const text of ['aster-calendar-view','aster-compact-workspace','Choose week by date','Show provider','>Today<','All providers','Filter schedule by provider','Previous week','Next week','New appointment'])assert.ok(html.includes(text),text);
 for(const text of ['aster-week-arrows','class="aster-metrics"','class="aster-heading"','class="aster-booking"'])assert.ok(!html.includes(text),text);
 assert.equal(html.split('class="aster-calendar-day ').length-1,5);
 assert.ok(html.indexOf('Filter schedule by provider')<html.indexOf('class="aster-week-scroll"'));
 console.log('Verified compact workspace, date range, top provider filter, five calendar columns, modal trigger, and removal of large chrome/up-down arrows.');
}finally{await server.close()}
