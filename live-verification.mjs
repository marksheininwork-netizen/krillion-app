import {normalize} from './question-engine.mjs';
const types={'wd-languages':'Q34770','wd-islands':'Q23442','wd-mountains':'Q8502','wd-universities':'Q3918','wd-films':'Q11424','wd-books':'Q571','wd-sports':'Q349','wd-instruments':'Q34379','wd-occupations':'Q12737077','wd-museums':'Q33506','wd-airports':'Q1248784','wd-bridges':'Q12280','wd-volcanoes':'Q8072'};
export async function verifyOnline(p,answer,{fetcher=fetch,storage=globalThis.localStorage}={}){
 if(!p||!answer||answer.length>80||!types[p.id])return null;
 const key='krillion-verified-v1:'+p.id+':'+normalize(answer);
 try{const cached=JSON.parse(storage?.getItem(key)||'null');if(cached&&Date.now()-cached.time<86400000*7)return cached.result}catch{}
 try{const api=async params=>{const url='https://www.wikidata.org/w/api.php?'+new URLSearchParams({...params,format:'json',origin:'*'});const r=await fetcher(url,{signal:AbortSignal.timeout(3500)});if(!r.ok)throw Error('Unavailable');return r.json()};
 const search=await api({action:'wbsearchentities',search:answer,language:'en',limit:'5'});
 const ids=(search.search||[]).map(x=>x.id).filter(x=>/^Q\d+$/.test(x));if(!ids.length)return null;
 const data=await api({action:'wbgetentities',ids:ids.join('|'),props:'labels|aliases|claims',languages:'en'});
 for(const x of Object.values(data.entities||{})){const names=[x.labels?.en?.value,...(x.aliases?.en||[]).map(y=>y.value)].filter(Boolean);if(!names.some(n=>normalize(n)===normalize(answer)))continue;if(!(x.claims?.P31||[]).some(c=>c.mainsnak?.datavalue?.value?.id===types[p.id]))continue;const result={valid:true,answer:names[0],points:30,tier:'Schooler',rarity:35,source:'Wikidata',entity:x.id};try{storage?.setItem(key,JSON.stringify({time:Date.now(),result}))}catch{}return result}
 }catch{}return null;
}
