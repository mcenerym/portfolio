import React from 'react';
import {people as samplePeople,searchPeople} from './appointment-data.js';

export default function BookingPeoplePicker({people=samplePeople,personId,search,onSearch,onSelect}){
 const matches=searchPeople(search,people);
 return <>
  <label className="aster-sr-only" htmlFor="aster-person-search">Find a person by name or ID</label>
  <input id="aster-person-search" autoFocus type="search" placeholder="Search name or ID…" value={search} onChange={e=>onSearch(e.target.value)}/>
  <div className="aster-picker-count">{matches.length} {matches.length===1?'person':'people'} found · Select one for this visit</div>
  <div className="aster-booking-people-scroll" role="region" aria-label="Available people" tabIndex={0}>
   <ul className="aster-booking-people-list">{matches.map(person=>{
    const selected=person.id===personId;
    return <li key={person.id}><article className={`aster-booking-person-card ${selected?'is-selected':''}`} aria-label={person.name}>
     <input className="aster-person-card-radio" type="radio" name="booking-person" id={`aster-select-${person.id}`} value={person.id} checked={selected} onChange={()=>onSelect(person.id)}/>
     <label className="aster-person-card-hitbox" htmlFor={`aster-select-${person.id}`}><span className="aster-sr-only">Select {person.name} for appointment</span></label>
     <div className="aster-picker-person-heading"><span className={`aster-avatar aster-${person.color}`} aria-hidden="true">{person.name.split(' ').map(part=>part[0]).join('')}</span><div><h3>{person.name}</h3><span>{person.id}</span></div><span className="aster-person-card-check" aria-hidden="true">{selected?'✓':'○'}</span></div>
    </article></li>;
   })}</ul>
   {!matches.length&&<div className="aster-picker-empty"><p>No sample people found.</p><button type="button" className="aster-person-details-link" onClick={()=>onSearch('')}>Clear search</button></div>}
  </div>
 </>;
}
