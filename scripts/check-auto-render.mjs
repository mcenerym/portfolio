import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Automotive}=await server.ssrLoadModule('/src/Automotive.jsx');
 const html=renderToStaticMarkup(React.createElement(Automotive));
 for(const text of ['TORQUE','Full synthetic oil change','My estimate','All businesses, prices, locations, and stock are fictional.','Out of stock','Compare 3 sample shops'])assert.ok(html.includes(text),text);
 assert.equal(html.split('class="auto-product"').length-1,12);
 console.log('Rendered automotive app: 12 catalog cards, sample estimate, stock status, comparison controls, and fictional-data notice verified.');
}finally{await server.close()}
