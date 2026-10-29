import React from 'react';
import ModalDialog from './ModalDialog.jsx';

export default function AppointmentModal({children,onClose,labelledBy='aster-new-title',closeLabel='Close new appointment',className='',returnFocusId='aster-new-appointment'}){
 return <ModalDialog className={`aster-appointment-modal ${className}`} labelledBy={labelledBy} returnFocusId={returnFocusId} onClose={onClose}>
  <button className="aster-modal-close" type="button" aria-label={closeLabel} onClick={onClose}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
  {children}
 </ModalDialog>;
}
