(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
var root=document.documentElement;

/* ---- Fill these in to personalise. Photos can be file paths, e.g. 'assets/photos/hero.jpg' ---- */
var CONFIG={
  instagram:'', email:'', linkedin:'', github:'', mediaKit:'',
  photos:{ /* hero:'assets/photos/hero.jpg', about1:'', about2:'', p1:'', p2:'', p3:'', p4:'', p5:'', r1:'', r2:'', r3:'', r4:'', g1:'' ... g9:'' */ }
};

var hooks=[];
var toastT;
function toast(msg){var t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on')},2200)}

/* ---- links ---- */
var linkMap={instagram:CONFIG.instagram,linkedin:CONFIG.linkedin,github:CONFIG.github,mediaKit:CONFIG.mediaKit};
$$('[data-link]').forEach(function(a){
  var u=linkMap[a.dataset.link];
  if(u){a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.hidden=false}
  else{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.classList.add('is-pending');
    if(a.dataset.link==='linkedin'||a.dataset.link==='github'||a.dataset.link==='mediaKit')a.hidden=true}
});
if(CONFIG.email){
  var ev=$('#emailVal');ev.textContent='';var ea=document.createElement('a');ea.href='mailto:'+CONFIG.email;ea.textContent=CONFIG.email;ev.appendChild(ea);$('#copyEmail').hidden=false;
  $('#copyEmail').addEventListener('click',function(){
    var done=function(){toast('Email copied')};
    var fallback=function(){var r=document.createRange();r.selectNodeContents($('#emailVal'));var s=getSelection();s.removeAllRanges();s.addRange(r);toast('Press copy to save the address')};
    try{navigator.clipboard.writeText(CONFIG.email).then(done,fallback)}catch(e){fallback()}
  });
}

/* ---- gallery ---- */
var GAL=[
 {slot:'g1',cat:'Fashion',title:'Outfit story',desc:'Outfit photographs and editorial-style layouts.',ar:'4/5',ph:1,r:'140px 140px 24px 24px',sp:.07},
 {slot:'g2',cat:'Lifestyle',title:'Everyday, softly',desc:'Everyday moments through my own lens.',ar:'1/1',ph:2,r:'22px',sp:.05},
 {slot:'g3',cat:'Festival',title:'Festival light',desc:'Festivals, traditions and celebrations.',ar:'3/4',ph:6,r:'30px 6px 30px 6px',sp:.08},
 {slot:'g4',cat:'Everyday',title:'Small moments',desc:'The little details worth keeping.',ar:'4/3',ph:5,r:'22px',sp:.04},
 {slot:'g5',cat:'Fashion',title:'Styling notes',desc:'Styling experiments and fashion transitions.',ar:'3/4.4',ph:3,r:'22px',sp:.06},
 {slot:'g6',cat:'Festival',title:'Colors of the day',desc:'Cultural stories told in color.',ar:'1/1',ph:4,r:'999px',sp:.05},
 {slot:'g7',cat:'Lifestyle',title:'Camera roll',desc:'A little diary of ordinary days.',ar:'4/5',ph:1,r:'22px',sp:.07},
 {slot:'g8',cat:'Everyday',title:'Golden-hour walk',desc:'Warm light and slow afternoons.',ar:'1/1.15',ph:2,r:'24px 24px 100px 24px',sp:.05},
 {slot:'g9',cat:'Fashion',title:'Editorial frame',desc:'Magazine-style compositions.',ar:'3/4',ph:6,r:'22px',sp:.06}
];
var masonry=$('#masonry');
GAL.forEach(function(g,i){
  var b=document.createElement('button');
  b.type='button';b.className='tile';b.dataset.cat=g.cat;b.dataset.cursor='Open';b.dataset.i=i;
  b.style.setProperty('--ar',g.ar);b.style.setProperty('--r',g.r);
  b.setAttribute('aria-label','Open preview: '+g.title+', '+g.cat);
  b.innerHTML='<span class="frame px spot" data-speed="'+g.sp+'"><span class="px-in"><span class="ph ph-'+g.ph+'" data-slot="'+g.slot+'" data-alt="'+g.title+'"><span class="ph-mark">V</span><span class="ph-note">your photo here</span></span></span></span>'+
    '<span class="cap"><small>'+g.cat+'</small><strong>'+g.title+'</strong><em>'+g.desc+'</em><span class="open">Open &#8599;</span></span>';
  masonry.appendChild(b);
});
$$('.fbtn').forEach(function(btn){btn.addEventListener('click',function(){
  $$('.fbtn').forEach(function(x){x.setAttribute('aria-pressed',x===btn?'true':'false')});
  $$('.tile').forEach(function(t){t.hidden=!(btn.dataset.f==='All'||t.dataset.cat===btn.dataset.f)});
  scrolled=true;
})});

/* ---- photo slots ---- */
$$('[data-slot]').forEach(function(el){
  var src=CONFIG.photos[el.dataset.slot];
  if(src){var img=new Image();img.alt=el.dataset.alt||'';img.src=src;img.decoding='async';el.classList.add('has-img');el.appendChild(img)}
});

/* ---- split headings into words ---- */
function splitWords(el){
  var i=0;el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
  (function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(p){
          if(!p)return;
          if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(' '));return}
          var w=document.createElement('span');w.className='w';w.setAttribute('aria-hidden','true');
          var s=document.createElement('span');s.textContent=p;s.style.setProperty('--d',(i++*55)+'ms');
          w.appendChild(s);frag.appendChild(w);
        });
        node.replaceChild(frag,n);
      }else if(n.nodeType===1){walk(n)}
    });
  })(el);
}
$$('[data-split]').forEach(splitWords);

/* ---- reveal on scroll ---- */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $$('.rv,[data-split]').forEach(function(el){io.observe(el)});
}else{$$('.rv,[data-split]').forEach(function(el){el.classList.add('in')})}

/* ---- stars for Midnight Muse ---- */
(function(){var st=$('#stars'),h='';for(var i=0;i<34;i++){var s=(1+Math.random()*2).toFixed(1);
  h+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*100).toFixed(1)+'%;--s:'+s+'px;--t:'+(2+Math.random()*3).toFixed(1)+'s;--dl:'+(Math.random()*3).toFixed(1)+'s"></i>'}
  st.innerHTML=h})();

/* ---- moods ---- */
var MOODS=[
 {name:'The Pink Dream',bg:[255,248,240],bg2:[248,221,229],g1:[244,194,194],g2:[226,185,165],acc:[183,132,145],ink:[138,86,102]},
 {name:'Golden Hour',bg:[251,241,227],bg2:[232,213,196],g1:[243,201,154],g2:[217,166,111],acc:[185,138,94],ink:[134,89,47]},
 {name:'Midnight Muse',bg:[236,224,222],bg2:[201,174,182],g1:[142,100,121],g2:[92,68,86],acc:[122,78,102],ink:[94,56,80]},
 {name:'Creative Playground',bg:[251,248,253],bg2:[231,221,245],g1:[246,201,221],g2:[251,235,168],acc:[162,139,184],ink:[107,88,127]}
];
var amb=$('#ambient'),grain=$('#grain');
var w=[1,0,0,0],tw=[1,0,0,0];
var pinned=null,hoverWorld=null,hoverProj=false,curSection=null,shownName=0;
var mx=innerWidth*.3,my=innerHeight*.25,lx=mx,ly=my,lightInit=true;
function mixc(k){var r=0,g=0,b=0;for(var i=0;i<4;i++){var c=MOODS[i][k];r+=w[i]*c[0];g+=w[i]*c[1];b+=w[i]*c[2]}return [Math.round(r),Math.round(g),Math.round(b)]}
function applyMood(){
  var A=amb.style;
  A.setProperty('--bg',mixc('bg').join(' '));A.setProperty('--bg2',mixc('bg2').join(' '));
  A.setProperty('--g1',mixc('g1').join(' '));A.setProperty('--g2',mixc('g2').join(' '));
  A.setProperty('--wp',w[0].toFixed(3));A.setProperty('--wg',w[1].toFixed(3));A.setProperty('--wm',w[2].toFixed(3));A.setProperty('--wl',w[3].toFixed(3));
  root.style.setProperty('--accent','rgb('+mixc('acc')+')');
  root.style.setProperty('--accent-ink','rgb('+mixc('ink')+')');
  grain.style.opacity=(.045+.075*w[1]+.02*w[2]).toFixed(3);
  var best=0;for(var i=1;i<4;i++)if(w[i]>w[best])best=i;
  if(best!==shownName){shownName=best;$('#moodName').textContent=MOODS[best].name;
    $$('.mdot').forEach(function(d){d.classList.toggle('on',+d.dataset.m===best)})}
}
function smooth(a,b,x){var t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function computeTarget(){
  var t=[0,0,0,0];
  if(pinned!==null)t[pinned]=1;
  else if(hoverWorld!==null)t[hoverWorld]=1;
  else if(hoverProj)t[2]=1;
  else{
    var s=curSection;
    if(s&&s.dataset.mix==='1'&&fine){var k=smooth(.2,.8,mx/innerWidth);t[0]=1-k;t[1]=k}
    else t[s?+s.dataset.mood:0]=1;
  }
  tw=t;
}
$$('.mdot').forEach(function(d){d.addEventListener('click',function(){var m=+d.dataset.m;pinned=(pinned===m)?null:m;syncWorldBtns()})});
function syncWorldBtns(){
  $$('.world').forEach(function(wd){var on=pinned===+wd.dataset.world;wd.classList.toggle('is-on',on);$('.world-btn',wd).setAttribute('aria-pressed',on?'true':'false')});
  $$('.mdot').forEach(function(d){d.setAttribute('aria-pressed',pinned===+d.dataset.m?'true':'false')});
}
$$('.world-btn').forEach(function(b){b.addEventListener('click',function(){
  var m=+b.closest('.world').dataset.world;pinned=(pinned===m)?null:m;syncWorldBtns()})});
if(fine){document.addEventListener('mouseover',function(e){
  var wd=e.target.closest&&e.target.closest('.world');hoverWorld=wd?+wd.dataset.world:null;
  hoverProj=!!(e.target.closest&&e.target.closest('.proj'));
})}

/* ---- scroll work ---- */
var sections=$$('.page'),navLinks=$$('.nav a'),scrolled=true;
var pxEls=$$('.px').map(function(el){return{el:el,inn:el.querySelector('.px-in'),s:parseFloat(el.dataset.speed||.06)}});
function onScroll(){
  var vh=innerHeight,found=null,i,r;
  for(i=0;i<sections.length;i++){
    r=sections[i].getBoundingClientRect();
    if(r.top<vh*.92)sections[i].classList.add('in');
    if(r.top<=vh*.4&&r.bottom>vh*.4)found=sections[i];
  }
  if(!found)found=sections[0];
  if(found!==curSection){curSection=found;
    navLinks.forEach(function(a){var on=a.getAttribute('href')==='#'+found.id;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}
  var tl=$('#timeline');
  if(tl){r=tl.getBoundingClientRect();tl.style.setProperty('--p',Math.max(0,Math.min(1,(vh*.65-r.top)/r.height)).toFixed(3))}
  if(!reduce){
    for(i=0;i<pxEls.length;i++){
      var p=pxEls[i];r=p.el.getBoundingClientRect();
      if(r.bottom<-120||r.top>vh+120||!r.height)continue;
      var lim=r.height*.09,y=-(r.top+r.height/2-vh/2)*p.s;
      p.inn.style.transform='translate3d(0,'+Math.max(-lim,Math.min(lim,y)).toFixed(1)+'px,0)';
    }
  }
}
addEventListener('scroll',function(){scrolled=true},{passive:true});
addEventListener('resize',function(){scrolled=true});
addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
addEventListener('pointerdown',function(e){mx=e.clientX;my=e.clientY},{passive:true});

function frame(){
  lx+=(mx-lx)*.06;ly+=(my-ly)*.06;
  if(lightInit||Math.abs(mx-lx)>.5||Math.abs(my-ly)>.5){lightInit=false;amb.style.setProperty('--mx',lx.toFixed(1)+'px');amb.style.setProperty('--my',ly.toFixed(1)+'px')}
  if(scrolled){scrolled=false;onScroll()}
  computeTarget();
  var moving=false;
  for(var i=0;i<4;i++){var d=tw[i]-w[i];
    if(Math.abs(d)>.002){w[i]+=reduce?d:d*.045;moving=true}
    else if(w[i]!==tw[i]){w[i]=tw[i];moving=true}}
  if(moving||lightInit)applyMood();
  for(var h=0;h<hooks.length;h++)hooks[h]();
  requestAnimationFrame(frame);
}

/* ---- custom cursor ---- */
var orb=$('#orb'),tag=$('#orbTag'),ox=mx,oy=my;
if(fine){
  root.classList.add('has-cursor');
  document.addEventListener('pointermove',function(e){if(e.pointerType==='mouse')orb.style.opacity='1'});
  root.addEventListener('mouseleave',function(){orb.style.opacity='0'});
  document.addEventListener('mouseover',function(e){
    var t=e.target.closest?e.target.closest('[data-cursor]'):null;
    if(t){tag.textContent=t.dataset.cursor;orb.classList.add('tag')}else orb.classList.remove('tag');
    orb.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,[data-cursor]')));
  });
  hooks.push(function(){ox+=(mx-ox)*.25;oy+=(my-oy)*.25;orb.style.transform='translate3d('+ox.toFixed(1)+'px,'+oy.toFixed(1)+'px,0)'});
}

/* ---- sparkles (trail + bursts) ---- */
var cv=$('#fx'),ctx=cv.getContext('2d'),parts=[],drew=false,lastX=-99,lastY=-99;
function sizeFx(){var d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0)}
sizeFx();addEventListener('resize',sizeFx);
var COLS=['224,160,170','232,190,140','183,132,145','244,194,194'];
function addP(x,y,o){parts.push({x:x,y:y,vx:o.vx,vy:o.vy,l:0,max:o.max,s:o.s,t:o.t,g:o.g||0,c:COLS[(Math.random()*COLS.length)|0]})}
function star(x,y,r){ctx.beginPath();ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.quadraticCurveTo(x,y,x,y+r);ctx.quadraticCurveTo(x,y,x-r,y);ctx.quadraticCurveTo(x,y,x,y-r);ctx.fill()}
function heart(x,y,s){ctx.beginPath();ctx.moveTo(x,y+s*.4);ctx.bezierCurveTo(x-s,y-s*.2,x-s*.6,y-s*1.1,x,y-s*.45);ctx.bezierCurveTo(x+s*.6,y-s*1.1,x+s,y-s*.2,x,y+s*.4);ctx.fill()}
function burst(x,y,kind){
  if(reduce)return;
  for(var i=0;i<12;i++){var a=Math.random()*6.283,sp=1.2+Math.random()*2.4;
    addP(x,y,{vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,max:60+Math.random()*30,s:4+Math.random()*5,t:kind==='heart'?'heart':'star',g:.05})}
}
hooks.push(function(){
  if(!parts.length){if(drew){ctx.clearRect(0,0,innerWidth,innerHeight);drew=false}return}
  ctx.clearRect(0,0,innerWidth,innerHeight);drew=true;
  for(var i=parts.length-1;i>=0;i--){
    var p=parts[i];p.l++;p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.985;
    if(p.l>=p.max){parts.splice(i,1);continue}
    var a=1-p.l/p.max;ctx.fillStyle='rgba('+p.c+','+(a*.85).toFixed(2)+')';
    if(p.t==='heart')heart(p.x,p.y,p.s*a+1);else star(p.x,p.y,p.s*(.4+a*.6)+1);
  }
});
if(fine&&!reduce){
  document.addEventListener('pointermove',function(e){
    if(e.pointerType!=='mouse'||parts.length>36)return;
    var dx=e.clientX-lastX,dy=e.clientY-lastY;
    if(dx*dx+dy*dy>900){lastX=e.clientX;lastY=e.clientY;
      addP(e.clientX+(Math.random()-.5)*8,e.clientY+(Math.random()-.5)*8,{vx:(Math.random()-.5)*.4,vy:Math.random()*.4+.1,max:50,s:3+Math.random()*3,t:'star'})}
  });
}
var mono=$('#mono');mono.dataset.burst='heart';
document.addEventListener('click',function(e){
  var s=e.target.closest&&e.target.closest('.spark,.mono');
  if(!s)return;
  var x=e.clientX,y=e.clientY;
  if(!x&&!y){var r=s.getBoundingClientRect();x=r.left+r.width/2;y=r.top+r.height/2}
  burst(x,y,s.dataset.burst||'star');
});

/* ---- magnetic buttons, card tilt, spotlight ---- */
if(fine&&!reduce){
  $$('.magnetic').forEach(function(el){
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();
      el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.22).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.3).toFixed(1)+'px)'});
    el.addEventListener('pointerleave',function(){el.style.transform=''});
  });
  $$('.proj').forEach(function(el){
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();
      el.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*8).toFixed(2)+'deg');
      el.style.setProperty('--rx',(((e.clientY-r.top)/r.height-.5)*-8).toFixed(2)+'deg');
      var sp=el.querySelector('.spot'),q=sp.getBoundingClientRect();
      el.style.setProperty('--sx',(e.clientX-q.left)+'px');el.style.setProperty('--sy',(e.clientY-q.top)+'px');
    });
    el.addEventListener('pointerleave',function(){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
  });
  masonry.addEventListener('pointermove',function(e){
    var t=e.target.closest('.tile');if(!t)return;var q=t.querySelector('.frame').getBoundingClientRect();
    t.style.setProperty('--sx',(e.clientX-q.left)+'px');t.style.setProperty('--sy',(e.clientY-q.top)+'px');
  });
}

/* ---- menu, monogram, anchors ---- */
var menu=$('#menu'),mb=$('#menuBtn');
function setMenu(o){menu.hidden=!o;mb.setAttribute('aria-expanded',o?'true':'false');mb.textContent=o?'Close':'Menu'}
mb.addEventListener('click',function(){setMenu(menu.hidden)});
mono.addEventListener('click',function(){mono.setAttribute('aria-expanded',mono.getAttribute('aria-expanded')==='true'?'false':'true')});
document.addEventListener('click',function(e){
  if(!e.target.closest('.mono-wrap'))mono.setAttribute('aria-expanded','false');
  var a=e.target.closest&&e.target.closest('a[href^="#"]');
  if(!a)return;
  var id=a.getAttribute('href').slice(1);
  if(!id){e.preventDefault();return}
  var t=document.getElementById(id);
  if(t){e.preventDefault();setMenu(false);t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});try{history.replaceState(null,'','#'+id)}catch(_){}}
});

/* ---- lightbox ---- */
var lb=$('#lb'),lbOpener=null,curG=0;
function visibleIdx(){return $$('.tile').filter(function(t){return !t.hidden}).map(function(t){return +t.dataset.i})}
function showLb(i){
  curG=i;var g=GAL[i],box=$('#lbImg');box.innerHTML='';
  var ph=document.createElement('span');ph.className='ph ph-'+g.ph;
  ph.innerHTML='<span class="ph-mark">V</span><span class="ph-note">your photo here</span>';
  var src=CONFIG.photos[g.slot];
  if(src){var im=new Image();im.alt=g.title;im.src=src;ph.classList.add('has-img');ph.appendChild(im)}
  box.appendChild(ph);
  $('#lbCat').textContent=g.cat;$('#lbTitle').textContent=g.title;$('#lbDesc').textContent=g.desc;
}
function openLb(i,opener){lbOpener=opener;showLb(i);lb.hidden=false;document.body.style.overflow='hidden';$('#lbX').focus()}
function closeLb(){lb.hidden=true;document.body.style.overflow='';if(lbOpener)lbOpener.focus()}
function stepLb(d){var v=visibleIdx(),k=v.indexOf(curG);if(!v.length)return;showLb(v[(k+d+v.length)%v.length])}
masonry.addEventListener('click',function(e){var t=e.target.closest('.tile');if(t)openLb(+t.dataset.i,t)});
$('#lbX').addEventListener('click',closeLb);
$('#lbPrev').addEventListener('click',function(){stepLb(-1)});
$('#lbNext').addEventListener('click',function(){stepLb(1)});
lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});

/* ---- hidden 404 ---- */
var KNOWN=['top','home','about','universe','work','reels','gallery','process','collab','contact'];
var lostPage=$('#lostPage');
function showLost(){lostPage.hidden=false;document.body.style.overflow='hidden';$('#lostHome').focus()}
function hideLost(){lostPage.hidden=true;document.body.style.overflow='';try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}}
function route(){var h=location.hash.slice(1);if(h&&KNOWN.indexOf(h)<0)showLost()}
route();addEventListener('hashchange',route);
$('#lostBtn').addEventListener('click',showLost);
$('#lostHome').addEventListener('click',function(){hideLost();scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(!lostPage.hidden)hideLost();else if(!lb.hidden)closeLb();else setMenu(false)}
  else if(!lb.hidden){
    if(e.key==='ArrowLeft')stepLb(-1);
    else if(e.key==='ArrowRight')stepLb(1);
    else if(e.key==='Tab'){
      var f=[$('#lbX'),$('#lbPrev'),$('#lbNext')];if($('#lbLink').getAttribute('href')&&$('#lbLink').getAttribute('href')!=='#')f.push($('#lbLink'));
      var k=f.indexOf(document.activeElement);
      if(e.shiftKey&&k<=0){e.preventDefault();f[f.length-1].focus()}
      else if(!e.shiftKey&&k===f.length-1){e.preventDefault();f[0].focus()}
      else if(k<0){e.preventDefault();f[0].focus()}
    }
  }
});

/* ---- soft ambient music (generated, starts only on click) ---- */
var mBtn=$('#music'),ac=null,master=null,padF=null,bellBus=null,playing=false,chT=null,beT=null,offT=null,chI=0;
var CH=[[130.81,196,246.94,329.63],[110,164.81,196,261.63],[174.61,220,261.63,329.63],[98,196,246.94,293.66]];
var BELLS=[523.25,587.33,659.25,783.99,880];
function tone(f,t,dur,type,peak,dest,att){
  var o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+att);g.gain.linearRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.1);
}
function buildAudio(){
  ac=new (window.AudioContext||window.webkitAudioContext)();
  master=ac.createGain();master.gain.value=0;master.connect(ac.destination);
  padF=ac.createBiquadFilter();padF.type='lowpass';padF.frequency.value=1100;padF.connect(master);
  bellBus=ac.createGain();bellBus.connect(master);
  var d=ac.createDelay(1);d.delayTime.value=.42;var fb=ac.createGain();fb.gain.value=.34;var wet=ac.createGain();wet.gain.value=.5;
  bellBus.connect(d);d.connect(fb);fb.connect(d);d.connect(wet);wet.connect(master);
}
function playChord(){var t=ac.currentTime;CH[chI%CH.length].forEach(function(f){tone(f,t,9,'triangle',.05,padF,2.8)});chI++;chT=setTimeout(playChord,7000)}
function bell(){var t=ac.currentTime;tone(BELLS[(Math.random()*BELLS.length)|0],t,3.2,'sine',.05,bellBus,.02);beT=setTimeout(bell,2500+Math.random()*3500)}
function setMusic(on){
  try{
    if(on){if(!ac)buildAudio();clearTimeout(offT);ac.resume();master.gain.setTargetAtTime(.9,ac.currentTime,1.2);playChord();bell()}
    else{clearTimeout(chT);clearTimeout(beT);if(master)master.gain.setTargetAtTime(0,ac.currentTime,.5);offT=setTimeout(function(){try{ac.suspend()}catch(_){}},1800)}
    playing=on;mBtn.setAttribute('aria-pressed',on?'true':'false');
    mBtn.setAttribute('aria-label',on?'Turn background music off':'Play soft background music');
    $('#musicLabel').textContent=on?'Music on':'Music off';
  }catch(err){mBtn.hidden=true}
}
if(!(window.AudioContext||window.webkitAudioContext))mBtn.hidden=true;
mBtn.addEventListener('click',function(){setMusic(!playing)});

requestAnimationFrame(frame);
})();
