// Runs every scripts/check-*.mjs in turn and reports the ones that fail.
import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const checks=readdirSync('scripts').filter(f=>/^check-.+\.mjs$/.test(f)&&f!=='check-all.mjs').sort();
const failed=[];
for(const file of checks){const run=spawnSync(process.execPath,['scripts/'+file],{encoding:'utf8'});const ok=run.status===0;if(!ok)failed.push(file);console.log(`${ok?'✓':'✗'} ${file}${ok?'':'\n'+(run.stderr||run.stdout).trim().split('\n').slice(0,6).join('\n')}`)}
console.log(failed.length?`\n${failed.length} of ${checks.length} checks failed.`:`\nAll ${checks.length} checks passed.`);
process.exit(failed.length?1:0);
