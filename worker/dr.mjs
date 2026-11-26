// Drill Room worker: reuses the app's own prompts, validators and scoring.
// The calling Claude session writes the AI answers; this script builds prompts and turns answers into db documents.
// Usage: node dr.mjs <command> [files...]   (prints to stdout; errors exit 1)
import {JSDOM} from 'jsdom';import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(process.env.DR_HTML||path.join(here,'..','index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://drillroom.local/',beforeParse(w){
  w.claude={use:async()=>null};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.fetch=async()=>({ok:false,json:async()=>({})});
  w.IntersectionObserver=class{observe(){}disconnect(){}};}});
await new Promise(r=>setTimeout(r,300));
const DR=dom.window.__DR;if(!DR){console.error('index.html has no __DR hook');process.exit(1)}
const rd=f=>fs.readFileSync(f,'utf8'),rj=f=>JSON.parse(rd(f)),out=x=>process.stdout.write(typeof x==='string'?x:JSON.stringify(x,null,1));
const parse=t=>{const v=DR.parseReply(t);if(!v){console.error('Reply has no JSON object');process.exit(1)}return v};
const tz='America/Vancouver',today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const plain=x=>JSON.parse(JSON.stringify(x));
const [cmd,...a]=process.argv.slice(2);
const fail=m=>{console.error(m);process.exit(1)};
switch(cmd){
 case 'today':out(today());break;
 // ---- grading: job = pending doc data, drill = drills/<id> doc data (with .d)
 case 'grade-prompt':{const job=rj(a[0]),drill=rj(a[1]).d||rj(a[1]);const ans=DR.merge(DR.blank(drill),job.answers||{});out(await DR.manualPrompt(drill,ans,job.p));break}
 case 'grade-finish':{const job=rj(a[0]),drill=rj(a[1]).d||rj(a[1]),r=parse(rd(a[2]));const ans=DR.merge(DR.blank(drill),job.answers||{});
  DR.setMAN({mode:'ans',ans:job.p==='q'?{extract:r.extract||{},grade:r.grade||{}}:{grade:r}});const sub=plain(await DR.buildSub(drill,ans,job.p));DR.setMAN(null);
  Object.assign(sub,{v:3,drillId:job.id,uid:job.uid,date:job.date||'',daily:!!job.date,secs:job.start?Math.max(0,Math.round((Date.parse(job.at)-job.start)/1000)):0,at:job.at,gradedBy:'auto-grader'});
  out({path:'subs/'+job.id+'__'+job.uid+'__'+job.p,sub});break}
 // ---- drill generation. recent.json = {titles:[...], industries:[...]}
 case 'gen-prompt':{const rc=a[0]?rj(a[0]):{titles:[],industries:[]};const n=Math.floor(Date.now()/864e5),I=DR.INDUSTRIES,M=DR.MODULES;
  const recent=(rc.industries||[]).map(x=>String(x).toLowerCase());const ind=I.map((_,i)=>I[(n+i)%I.length]).find(x=>!recent.some(r=>r.includes(x.split(' ')[0].toLowerCase())))||I[n%I.length],mod=M[n%M.length];
  const ask=['REQUEST: Pick a strong, specific case the team has not done.','Industry: '+ind,'Module focus: '+mod,'Depth: standard JDCW level with some technical finance.','Do not repeat these drills: '+((rc.titles||[]).join('; ')||'none')].join('\n');
  out(DR.GEN.replace(/the calc tool|the `calc` tool|calc tool/gi,'careful arithmetic (check every number with Python)')+'\n\n'+ask+'\n\nReply with ONLY the JSON object.\n<!--meta '+JSON.stringify({industry:ind,module:mod})+' -->');break}
 case 'gen-finish':{const raw=parse(rd(a[0])),date=a[1]||today(),meta=a[2]?rj(a[2]):{};const d=plain(DR.normalize(raw));
  if(d.overview.length<400||d.brainstorm.length<3||d.verbal.length<3||d.shortMath.kpis.length<3)fail('Drill incomplete: overview '+d.overview.length+' chars, '+d.brainstorm.length+' brainstorms, '+d.verbal.length+' verbal, '+d.shortMath.kpis.length+' KPIs');
  const id='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),at=new Date().toISOString();
  out({drillPath:'drills/'+id,drill:{title:d.title,company:d.company,industry:d.industry,module:d.module,prompt:'Auto (scheduled): '+(meta.industry||d.industry)+' / '+(meta.module||d.module),createdBy:'scheduler',createdAt:at,v:2,d},dayPath:'days/'+date,day:{drillId:id,by:'scheduler',at}});break}
 // ---- flashcards. recent.json = ["Company", ...]
 case 'cards-prompt':{const rc=a[0]?rj(a[0]):[];out(DR.CARDS_GEN+'\n\nUse different companies from these recent decks: '+(rc.join(', ')||'none')+'\n\nReply with ONLY the JSON object.');break}
 case 'cards-finish':{const r=parse(rd(a[0])),date=a[1]||today();const raw=(Array.isArray(r.cards)?r.cards:[]).filter(c=>{const n=DR.normCard(c);return n&&!DR.stagesOf(n).some(DR.giveaway)}).slice(0,8);
  if(raw.length<4)fail('Only '+raw.length+' usable cards (need 4+). Cards whose correct option is noticeably longer than the others are dropped.');const at=new Date().toISOString();out({path:'decks/'+date,doc:{cards:plain(raw),by:'scheduler',at,ver:at}});break}
 // ---- GTM Fit
 case 'fit-prompt':{const rc=a[0]?rj(a[0]):[];out(DR.FIT_GEN()+'\n\nUse different companies from these recent decks: '+(rc.join(', ')||'none')+'\n\nReply with ONLY the JSON object.');break}
 case 'fit-finish':{const r=parse(rd(a[0])),date=a[1]||today();const raw=(Array.isArray(r.cards)?r.cards:[]).filter(c=>DR.normFit(c)).slice(0,5);
  if(raw.length<3)fail('Only '+raw.length+' usable GTM Fit cases (need 3+).');const at=new Date().toISOString();out({path:'fits/'+date,doc:{cards:plain(raw),by:'scheduler',at,ver:at}});break}
 default:fail('Commands: today | grade-prompt job drill | grade-finish job drill reply | gen-prompt [recent] | gen-finish reply [date] [meta] | cards-prompt [recent] | cards-finish reply [date] | fit-prompt [recent] | fit-finish reply [date]')}
process.exit(0)
