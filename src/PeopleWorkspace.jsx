import React,{useState} from 'react';
import {people as samplePeople,searchPeople} from './appointment-data.js';
import AddPersonModal from './AddPersonModal.jsx';
import PersonDetails from './PersonDetails.jsx';

export default function PeopleWorkspace({people=samplePeople,search,onSearch,onAddPerson,onSchedule,appointments=[],notesByPerson={},onAddNote=()=>false}){
 const [adding,setAdding]=useState(false);const [selectedId,setSelectedId]=useState(people[0].id);const [tab,setTab]=useState('contact');const [mobilePane,setMobilePane]=useState('directory');const [drafts,setDrafts]=useState({});
 const matches=searchPeople(search,people);const selected=people.find(person=>person.id===selectedId);const draft=drafts[selectedId]||'';
 function showDetails(id){setSelectedId(id);setTab('contact');setMobilePane('details')}
 function saveNote(){const text=draft.trim();if(!text)return;if(onAddNote(selectedId,text)!==false)setDrafts(prev=>({...prev,[selectedId]:''}))}
 return <section className="aster-people-workspace" aria-label="People directory">
  <div className="aster-secondary-toolbar"><div><h1>People</h1><span>{matches.length} of {people.length} people</span></div><label className="aster-directory-search"><span className="aster-sr-only">Search sample people</span><input type="search" value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search name, ID, email, or phone…"/></label><button id="aster-add-person" type="button" className="aster-primary-button aster-add-person-button" aria-haspopup="dialog" onClick={()=>setAdding(true)}>＋ Add person</button></div>
  <div className="aster-people-detail-layout" data-mobile-pane={mobilePane}>
   <div className="aster-people-scroll" role="region" aria-label="People list" tabIndex={0}>
    <table className="aster-people-table"><caption className="aster-sr-only">Fictional people directory. Choose a name or Details to view their record.</caption><thead><tr><th scope="col">Person</th><th scope="col"><span className="aster-sr-only">Actions</span></th></tr></thead><tbody>
     {matches.map(person=><tr key={person.id} className={selectedId===person.id?'aster-person-row-selected':''}><th scope="row"><button className="aster-person-row-button" aria-pressed={selectedId===person.id} aria-controls="aster-person-details-panel" onClick={()=>showDetails(person.id)}><span className={`aster-avatar aster-${person.color}`} aria-hidden="true">{person.name.split(' ').map(part=>part[0]).join('')}</span><span><strong>{person.name}</strong><small>{person.id}</small></span></button></th><td><button className="aster-person-row-details" aria-label={`View details for ${person.name}`} aria-controls="aster-person-details-panel" onClick={()=>showDetails(person.id)}>Details →</button></td></tr>)}
     {!matches.length&&<tr><td colSpan={2}><div className="aster-people-empty"><p>No people match this search.</p><button className="aster-secondary-button" onClick={()=>onSearch('')}>Clear search</button></div></td></tr>}
    </tbody></table>
   </div>
   <PersonDetails person={selected} appointments={appointments} notes={notesByPerson[selectedId]||[]} tab={tab} onTab={setTab} draft={draft} onDraft={value=>setDrafts(prev=>({...prev,[selectedId]:value}))} onSave={saveNote} onSchedule={onSchedule} onBack={()=>setMobilePane('directory')}/>
  </div><div className="aster-compact-footnote">Fictional directory · Sample contacts only · Notes stored locally</div>
 {adding&&<AddPersonModal onClose={()=>setAdding(false)} onSave={values=>{const result=onAddPerson(values);if(result.person){onSearch('');showDetails(result.person.id);setAdding(false)}return result}}/>}</section>;
}
