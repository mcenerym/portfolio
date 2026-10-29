import React,{useState} from 'react';
import AppointmentModal from './AppointmentModal.jsx';
import './add-person.css';

export default function AddPersonModal({onClose,onSave}){
 const [values,setValues]=useState({name:'',email:'',phone:''});
 const [error,setError]=useState('');
 function change(field,value){setValues(previous=>({...previous,[field]:value}));setError('')}
 function submit(event){event.preventDefault();const result=onSave(values);if(result.error)setError(result.error)}
 return <AppointmentModal onClose={onClose} labelledBy="aster-add-person-title" closeLabel="Close add person" className="aster-add-person-modal" returnFocusId="aster-add-person">
  <div className="aster-compact-booking-heading"><h2 id="aster-add-person-title">Add person</h2><span>Create a contact for your demo directory.</span></div>
  <form className="aster-add-person-form" onSubmit={submit}>
   <div className="aster-add-person-fields">
    <label htmlFor="aster-person-name">Full name <span>Required</span></label><input id="aster-person-name" autoFocus required maxLength={100} value={values.name} onChange={e=>change('name',e.target.value)} placeholder="e.g. Alex Morgan" autoComplete="off"/>
    <label htmlFor="aster-person-email">Email address</label><input id="aster-person-email" type="email" maxLength={254} value={values.email} onChange={e=>change('email',e.target.value)} placeholder="alex@example.com" autoComplete="off" aria-describedby="aster-person-contact-hint"/>
    <label htmlFor="aster-person-phone">Phone number</label><input id="aster-person-phone" type="tel" maxLength={40} value={values.phone} onChange={e=>change('phone',e.target.value)} placeholder="202-555-0123" autoComplete="off" aria-describedby="aster-person-contact-hint"/>
    <p id="aster-person-contact-hint">Provide at least one contact method. A person ID is assigned automatically.</p>
    {error&&<p className="aster-form-error" role="alert">{error}</p>}
   </div>
   <div className="aster-add-person-footer"><span>Demo data · Saved in this browser</span><div><button type="button" className="aster-secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="aster-primary-button">Add person</button></div></div>
  </form>
 </AppointmentModal>;
}
