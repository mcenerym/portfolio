import React from 'react';
const paths={
 calendar:<><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4m8-4v4"/></>,
 people:<><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="16.5" cy="9.5" r="2.4"/><path d="M15.5 14.2c2.3-.3 4.3 1.2 5 4.3"/></>,
 mail:<><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></>,
 phone:<><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></>,
 left:<path d="m14.5 6-6 6 6 6"/>,
 right:<path d="m9.5 6 6 6-6 6"/>,
 plus:<path d="M12 5v14M5 12h14"/>,
 close:<path d="m6 6 12 12M18 6 6 18"/>,
};
export default function AsterIcon({type,size=18}){return <svg className="aster-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[type]}</svg>}
