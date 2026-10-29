import React from 'react';
import './examples.css';
import TorquePreview from './TorquePreview.jsx';
import './torque-card.css';
import AsterPreview from './AsterPreview.jsx';
import './aster-card.css';
import GamingPreview from './GamingPreview.jsx';
import './gaming-card.css';

const examples=[
 {id:'automotive',number:'01',name:'Torque Garage',type:'AUTOMOTIVE / PARTS & SERVICE',description:'A standalone automotive app. Browse parts and services, build an estimate, and compare fictional neighborhood garages.',tags:['Inventory catalog','Estimate builder','Price comparisons'],symbol:'⚙'},
 {id:'appointments',number:'02',name:'Aster Appointment Studio',type:'SCHEDULING / PEOPLE & REMINDERS',description:'A calmer practice workspace. Look up sample people, book procedures, and simulate email or text reminders.',tags:['People lookup','Appointment scheduling','Mock reminders'],symbol:'✳'},
 {id:'gaming',number:'03',name:'Lantern & Lore',type:'TABLETOP / GAME STORE COMMUNITY',description:'A neighborhood board and card game shop. Browse the weekly event schedule, save a seat, host a table, and chat on a community forum.',tags:['Event schedule','Seat sign-ups','Community forum'],symbol:'◆'}
];
// The home page's Examples section; cards sit under the section heading, so they use h3.
export default function ExampleGallery({headingLevel=3}){const Heading='h'+headingLevel;return <section className="example-gallery" aria-label="React examples">{examples.map(example=><article className={'example-project project-'+example.id} key={example.id}><div className={'project-preview preview-'+example.id} aria-hidden="true"><span className="project-symbol">{example.symbol}</span>{example.id==='automotive'?<TorquePreview/>:example.id==='appointments'?<AsterPreview/>:<GamingPreview/>}</div><div className="project-body"><div className="example-kicker">{example.number} / {example.type}</div><Heading>{example.name}</Heading><p>{example.description}</p><div className="tags">{example.tags.map(t=><span key={t}>{t}</span>)}</div><a className="button dark" href={'/?page=examples&demo='+example.id}>Try the example <span aria-hidden="true">↗</span></a></div></article>)}</section>}
