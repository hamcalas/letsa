const V='ss-202610140937-1',P="/school-summary-data/";
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll([P,P+'archive/',P+'events/',P+'offline.html',P+'my.js',P+'theme.js',P+'install.js',P+'ui.js']).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||u.pathname.endsWith('/sw.js'))return;
 const nav=r.mode==='navigate'||(r.headers.get('accept')||'').includes('text/html');
 e.respondWith(caches.open(V).then(c=>c.match(r,{ignoreSearch:nav}).then(hit=>{
  const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>null);
  if(nav)return net.then(res=>res||hit||c.match(P)||c.match(P+'offline.html'));
  return hit||net.then(res=>res||new Response('',{status:504}));
 })));
});
