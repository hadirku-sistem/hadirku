/* HADIRKU v2 - pembantu bersama: ikon, notifikasi, dialog, konfirmasi, kondisi */
(function(){
var P={
home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>',
alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 010 6.4M18 14.5c2 .6 3.300 2.300 3.600 5"/>',
book:'<path d="M2 5.500C4.500 4.300 7.500 4.500 12 7c4.500-2.500 7.500-2.700 10-1.500V19c-2.500-1.200-5.500-1-10 1.500C7.500 18 4.500 17.800 2 19z"/><path d="M12 7v13.500"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
filter:'<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
logout:'<path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4M16 8l4 4-4 4M20 12H9"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.500"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.5"/>',
refresh:'<path d="M20 11a8 8 0 10-2.300 5.700M20 4v7h-7"/>',
list:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4v2h6V4M9 11h6M9 15h6"/>',
chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'
};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var HK={esc:esc,
hm:function(t){return String(t).slice(0,5).replace(':','.')},
icon:function(n,c){return '<svg class="i '+(c||'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'},
empty:function(icon,text,action){return '<div class="empty">'+HK.icon(icon)+'<p>'+esc(text)+'</p>'+(action||'')+'</div>'},
alert:function(type,text,action){return '<div class="alert '+type+'" role="'+(type==='bad'?'alert':'status')+'">'+HK.icon(type==='ok'?'check':type==='info'||!type?'info':'alert')+'<div class="grow">'+esc(text)+(action?'<div style="margin-top:8px">'+action+'</div>':'')+'</div></div>'},
skel:function(n){var c='<div class="card stack"><div class="skel" style="width:40%"></div><div class="skel"></div><div class="skel" style="width:70%"></div></div>',o='';for(var i=0;i<(n||3);i++)o+=c;return '<div class="stack" aria-busy="true">'+o+'</div>'},
toast:function(msg,type){
  var box=document.querySelector('.toasts');
  if(!box){box=document.createElement('div');box.className='toasts';box.setAttribute('aria-live','polite');document.body.appendChild(box)}
  var t=document.createElement('div'),bad=type==='bad';
  t.className='toast'+(bad?' bad':'');if(bad)t.setAttribute('role','alert');
  t.innerHTML=HK.icon(bad?'alert':'check')+'<span>'+esc(msg)+'</span>'+(bad?'<button type="button">Tutup</button>':'');
  box.appendChild(t);
  var rm=function(){t.remove()};
  if(bad)t.querySelector('button').onclick=rm;else setTimeout(rm,3000);
},
dialog:function(html,o){
  var d=document.createElement('dialog');d.className='dlg';d.innerHTML='<div class="in">'+html+'</div>';
  document.body.appendChild(d);
  d.addEventListener('click',function(e){if(e.target===d)d.close()});
  d.addEventListener('close',function(){d.remove();if(o&&o.onClose)o.onClose()});
  d.showModal();return d;
},
confirm:function(o){return new Promise(function(res){
  var r=false,d=HK.dialog('<h2 class="h2">'+esc(o.title)+'</h2>'+(o.text?'<p class="mut">'+esc(o.text)+'</p>':'')+
    '<div class="acts"><button type="button" class="btn sec" data-v="0">'+esc(o.cancel||'Batal')+'</button><button type="button" class="btn'+(o.danger?' danger':'')+'" data-v="1">'+esc(o.ok||'Lanjutkan')+'</button></div>',
    {onClose:function(){res(r)}});
  d.addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(b){r=b.dataset.v==='1';d.close()}});
})},
busy:function(btn,fn){btn.classList.add('loading');btn.disabled=true;
  return Promise.resolve().then(fn).finally(function(){btn.classList.remove('loading');btn.disabled=false})}
};
var isReady=false,waiting=[];
HK.ready=function(f){if(isReady)f();else waiting.push(f)};
window.HK=HK;

function init(){
  var s='<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0" aria-hidden="true">';
  for(var k in P)s+='<symbol id="i-'+k+'" viewBox="0 0 24 24">'+P[k]+'</symbol>';
  document.body.insertAdjacentHTML('afterbegin',s+'</svg>');
  var ob=null;
  function net(){
    if(!navigator.onLine&&!ob){ob=document.createElement('div');ob.className='offline';ob.setAttribute('role','status');ob.textContent='Tidak ada koneksi internet. Perubahan belum tersimpan.';document.body.prepend(ob)}
    else if(navigator.onLine&&ob){ob.remove();ob=null}
  }
  window.addEventListener('online',net);window.addEventListener('offline',net);net();
  document.querySelectorAll('[data-icon]').forEach(function(e){e.insertAdjacentHTML('afterbegin',HK.icon(e.dataset.icon))});
  isReady=true;var w=waiting;waiting=[];w.forEach(function(f){f()});
}
if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();
