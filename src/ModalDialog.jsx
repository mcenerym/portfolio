import React,{useEffect,useRef} from 'react';

const onBackdrop=e=>{if(e.target!==e.currentTarget)return false;const r=e.currentTarget.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom};
// Native modal dialog shared by the example apps: locks page scroll, returns focus on close, and closes on a backdrop press.
// Only a press that starts and ends on the backdrop closes it, so a text selection dragged outside keeps the form.
export default function ModalDialog({className,labelledBy,returnFocusId,onClose,children}){
 const ref=useRef(null);const pressed=useRef(false);
 useEffect(()=>{
  const dialog=ref.current,trigger=document.activeElement,overflow=document.body.style.overflow;
  dialog.showModal();document.body.style.overflow='hidden';
  return ()=>{if(dialog.open)dialog.close();document.body.style.overflow=overflow;if(trigger?.isConnected)trigger.focus();else document.getElementById(returnFocusId)?.focus()};
 },[]);
 return <dialog ref={ref} className={className} aria-labelledby={labelledBy} onClose={onClose} onPointerDown={e=>{pressed.current=onBackdrop(e)}} onClick={e=>{if(pressed.current&&onBackdrop(e))onClose();pressed.current=false}}>{children}</dialog>;
}
