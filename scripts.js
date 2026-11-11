// drkianmaleki.com — behaviour
// 1. Theme: Midnight by default, Paper from the toggle in the running head (remembered per browser).
// 2. Weekly phrase: same list and week rule as before; it also turns over every 9 s while the page is open; click to skip.
// 3. Equation field: scatters the faint equations across the title block into free space, never over text or figures.
// 4. Figure 1: a feed-forward network running forward passes on a canvas.
(function(){
  // Midnight by default; the visitor can switch to paper, and the choice is remembered in this browser.
  var root=document.documentElement, btn=document.getElementById('mode');
  function read(){try{return localStorage.getItem('theme');}catch(e){return null;}}
  function store(v){try{localStorage.setItem('theme',v);}catch(e){}}
  function apply(v){
    root.setAttribute('data-theme',v);
    if(btn){var dark=v==='dark';btn.textContent=dark?'Paper':'Midnight';btn.setAttribute('aria-label',dark?'Switch to the paper theme':'Switch to the midnight theme');}
    var meta=document.querySelector('meta[name="theme-color"]'); // the phone browser's toolbar follows the theme
    if(meta) meta.setAttribute('content',getComputedStyle(root).getPropertyValue('--paper').trim());
  }
  var saved=read(); apply(saved==='light'?'light':'dark');
  if(btn) btn.addEventListener('click',function(){var v=root.getAttribute('data-theme')==='dark'?'light':'dark';apply(v);store(v);});
})();

(function(){
  // Weekly phrase, same list and week rule as the live site; a click reads the next one.
  var weeklyPhrases=[
    "Beautiful equations, quiet machines","The poetry of computation","Machines dreaming in equations",
    "The geometry of intelligence","Equations with a pulse","The long conversation between code and math",
    "Where uncertainty becomes structure","A quiet life of difficult questions","The beautiful trouble of hard problems",
    "Thinking slowly with fast machines","Between chalk dust and silicon"
  ];
  function getWeekNumber(date){
    var startOfYear=new Date(date.getFullYear(),0,1);
    var days=Math.floor((date-startOfYear)/86400000);
    return Math.floor((days+startOfYear.getDay())/7);
  }
  var el=document.getElementById('tagline');
  var i=getWeekNumber(new Date())%weeklyPhrases.length;
  el.textContent=weeklyPhrases[i];
  function next(){
    el.classList.add('is-fading');
    setTimeout(function(){i=(i+1)%weeklyPhrases.length;el.textContent=weeklyPhrases[i];el.classList.remove('is-fading');},450);
  }
  el.addEventListener('click',next);
  // the phrase also turns over on its own while the page is open (every 9 s), unless motion is reduced
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    var timer=setInterval(function(){if(!document.hidden)next();},9000);
    el.addEventListener('click',function(){clearInterval(timer);timer=setInterval(function(){if(!document.hidden)next();},9000);});
  }
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();

(function(){
  // Scatter the equation field across the title block. Never over text or the figure,
  // except the large name, which may carry a faint equation behind it.
  var hero=document.getElementById('top'), field=hero.querySelector('.field'); if(!field) return;
  var eqs=[].slice.call(field.children);
  var hardSel='.hero__text .label, .author, .tagline, .abstract, .docs, .quick, .hero__fig';
  function overlaps(a,b,m){return !(a.x+a.w+m<b.x||b.x+b.w+m<a.x||a.y+a.h+m<b.y||b.y+b.h+m<a.y);}
  var COLS=4, ROWS=3;
  function place(){
    var hr=hero.getBoundingClientRect(), HW=hr.width, HH=hr.height;
    var obs=[].slice.call(hero.querySelectorAll(hardSel)).map(function(o){var r=o.getBoundingClientRect();return {x:r.left-hr.left,y:r.top-hr.top,w:r.width,h:r.height};});
    var placed=[], seed=20251109;
    function rnd(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
    function free(c){
      if(c.x<6||c.x+c.w>HW-6||c.y<6||c.y+c.h>HH-6) return false;
      return !obs.some(function(o){return overlaps(c,o,14);})&&!placed.some(function(o){return overlaps(c,o,18);});
    }
    eqs.forEach(function(el){el.classList.remove('is-placed');el.style.left='0px';el.style.top='0px';});
    // widest first, so the long equations get room and the short ones fill the gaps
    var order=eqs.map(function(el,idx){return {el:el,idx:idx,w:el.offsetWidth,h:el.offsetHeight};}).sort(function(a,b){return b.w-a.w;});
    order.forEach(function(q){
      var w=q.w, h=q.h, best=null, t;
      var cx=q.idx%COLS, cy=Math.floor(q.idx/COLS)%ROWS, cw=HW/COLS, ch=HH/ROWS;
      for(t=0;t<120&&!best;t++){ // first inside this equation's own cell of a 4 x 3 grid, so they spread
        var c={x:cx*cw+rnd()*Math.max(1,cw-w),y:cy*ch+rnd()*Math.max(1,ch-h),w:w,h:h};
        if(free(c)) best=c;
      }
      for(t=0;t<200&&!best;t++){ // then anywhere in the title block
        var d={x:6+rnd()*(HW-w-12),y:6+rnd()*(HH-h-12),w:w,h:h};
        if(free(d)) best=d;
      }
      if(!best){ // last, a full sweep from a random offset: finds a free spot whenever one exists
        var step=10, nx=Math.max(1,Math.floor((HW-w-12)/step)), ny=Math.max(1,Math.floor((HH-h-12)/step));
        var ox=Math.floor(rnd()*nx), oy=Math.floor(rnd()*ny);
        for(var iy=0;iy<ny&&!best;iy++){for(var ix=0;ix<nx&&!best;ix++){
          var e={x:6+((ix+ox)%nx)*step,y:6+((iy+oy)%ny)*step,w:w,h:h};
          if(free(e)) best=e;
        }}
      }
      if(best){placed.push(best);q.el.style.left=Math.round(best.x)+'px';q.el.style.top=Math.round(best.y)+'px';q.el.classList.add('is-placed');}
    });
  }
  var raf=null;
  function schedule(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(place);}
  place();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(schedule);}
  window.addEventListener('load',schedule);
  window.addEventListener('resize',schedule);
})();

(function(){
  // Figure 1: a feed-forward network running forward passes.
  // Each pass: inputs light up, signal travels along the edges from active units,
  // the receiving layer flashes and settles, and so on to the output; then everything fades.
  var cv=document.getElementById('net'); if(!cv) return;
  var ctx=cv.getContext('2d');
  var layers=[4,10,10,3], L=layers.length;
  var spans=[0.5,1,1,0.36]; // fraction of the height each layer spreads over
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodes=[], edges=[], byLayer=[], W=0, H=0, cols={};
  var seed=20250727;
  function rnd(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
  function smooth(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);}
  function readColors(){
    var cs=getComputedStyle(document.documentElement);
    cols={ink:cs.getPropertyValue('--ink').trim(),ink2:cs.getPropertyValue('--ink-2').trim(),
          accent:cs.getPropertyValue('--accent').trim(),paper:cs.getPropertyValue('--paper').trim()};
  }
  function build(){
    nodes=[];edges=[];byLayer=[];
    layers.forEach(function(n,l){byLayer[l]=[];for(var i=0;i<n;i++){var nd={l:l,i:i,x:0,y:0,a:0,inc:[]};nodes.push(nd);byLayer[l].push(nd);}});
    for(var l=1;l<L;l++){
      byLayer[l].forEach(function(to){
        to.b=(rnd()-0.5)*0.6;
        var sc=1.6/Math.sqrt(layers[l-1]);
        byLayer[l-1].forEach(function(from){var e={from:from,to:to,w:(rnd()*2-1)*sc};edges.push(e);to.inc.push(e);});
      });
    }
  }
  function layout(){
    var r=cv.getBoundingClientRect(); if(r.width===0) return;
    var dpr=Math.min(2,window.devicePixelRatio||1);
    W=r.width; H=Math.round(W*1.14);
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); cv.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    var padX=W*0.11, padT=H*0.08, padB=H*0.16;
    nodes.forEach(function(n){
      var count=layers[n.l], span=(H-padT-padB)*spans[n.l], top=padT+((H-padT-padB)-span)/2;
      n.x=padX+(W-2*padX)*n.l/(L-1);
      n.y=top+span*(count===1?0.5:n.i/(count-1));
    });
  }
  var pass=-1;
  function newPass(){
    pass++;
    var s=1000+pass*7919;
    function r(){s=(s*1664525+1013904223)%4294967296;return s/4294967296;}
    // sparse inputs: roughly half the units fire
    byLayer[0].forEach(function(n){var u=r();n.a=u<0.45?0.06+0.2*u:0.6+0.4*r();});
    for(var l=1;l<L;l++){
      byLayer[l].forEach(function(n){
        var z=n.b;n.inc.forEach(function(e){z+=e.w*e.from.a;});
        n.a=1/(1+Math.exp(-3.5*(z-0.2)));
      });
    }
  }
  // timeline within one pass (phase 0..1)
  var T0=0.04, SEG=0.2, TRAVEL=0.7, HOLD_END=0.86;
  function arrival(l){return l===0?0.0:T0+(l-1)*SEG+TRAVEL*SEG;}
  function fade(ph){return ph<HOLD_END?1:1-smooth((ph-HOLD_END)/(1-HOLD_END));}
  function lit(l,ph){return smooth((ph-arrival(l))/0.05)*fade(ph);}
  function flash(l,ph){var f=(ph-arrival(l))/0.16;return (f>0&&f<1)?f:-1;}
  function draw(ph){
    ctx.clearRect(0,0,W,H);
    var i,e,n,fd=fade(ph);
    for(i=0;i<edges.length;i++){
      e=edges[i];
      var aw=Math.abs(e.w), l=e.to.l;
      ctx.beginPath();ctx.moveTo(e.from.x,e.from.y);ctx.lineTo(e.to.x,e.to.y);
      ctx.strokeStyle=cols.ink;ctx.globalAlpha=0.04+0.16*aw;ctx.lineWidth=0.6+1.0*aw;ctx.stroke();
      // signal travelling from an active unit into layer l
      var sig=e.from.a*aw;
      var p=(ph-(T0+(l-1)*SEG))/(SEG*TRAVEL);
      if(sig>0.1&&p>0&&p<1.2){
        var head=Math.min(1,p), tail=Math.max(0,p-0.35);
        var x1=e.from.x+(e.to.x-e.from.x)*tail, y1=e.from.y+(e.to.y-e.from.y)*tail;
        var x2=e.from.x+(e.to.x-e.from.x)*head, y2=e.from.y+(e.to.y-e.from.y)*head;
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
        ctx.strokeStyle=cols.accent;ctx.globalAlpha=Math.min(1,0.25+1.6*sig)*fd*(p>1?1-(p-1)/0.2:1);
        ctx.lineWidth=1+2.4*sig;ctx.stroke();
      }
      // settled: edges between two lit units keep a tint
      var g=lit(l,ph)*e.from.a*e.to.a*aw;
      if(g>0.02){ctx.beginPath();ctx.moveTo(e.from.x,e.from.y);ctx.lineTo(e.to.x,e.to.y);ctx.strokeStyle=cols.accent;ctx.globalAlpha=Math.min(1,1.0*g);ctx.lineWidth=0.8+1.8*aw;ctx.stroke();}
    }
    ctx.globalAlpha=1;
    var outs=byLayer[L-1], best=outs.reduce(function(a,b){return b.a>a.a?b:a;},outs[0]);
    for(i=0;i<nodes.length;i++){
      n=nodes[i];
      var r0=n.l===0?6:(n.l===L-1?7:4.6), li=lit(n.l,ph), a=n.a, f=flash(n.l,ph);
      if(f>=0&&a>0.4){ // halo on arrival
        ctx.beginPath();ctx.arc(n.x,n.y,r0+2+16*f,0,Math.PI*2);
        ctx.strokeStyle=cols.accent;ctx.globalAlpha=(1-f)*a*0.9*fd;ctx.lineWidth=1.5;ctx.stroke();ctx.globalAlpha=1;
      }
      var rr=r0*(1+0.4*a*li);
      ctx.beginPath();ctx.arc(n.x,n.y,rr,0,Math.PI*2);
      ctx.fillStyle=cols.paper;ctx.fill();
      ctx.strokeStyle=cols.ink;ctx.lineWidth=1;ctx.stroke();
      if(li>0.01){ // the unit lights up in proportion to its activation
        ctx.beginPath();ctx.arc(n.x,n.y,rr-0.5,0,Math.PI*2);
        ctx.fillStyle=cols.accent;ctx.globalAlpha=li*Math.min(1,a*1.15);ctx.fill();ctx.globalAlpha=1;
        if(a>0.5){ctx.beginPath();ctx.arc(n.x,n.y,rr,0,Math.PI*2);ctx.strokeStyle=cols.accent;ctx.globalAlpha=li;ctx.lineWidth=1.2;ctx.stroke();ctx.globalAlpha=1;}
      }
      if(n===best&&li>0.5&&ph<HOLD_END){ // the winning output keeps a slow pulse
        var pulse=0.5+0.5*Math.sin((ph-arrival(L-1))*40);
        ctx.beginPath();ctx.arc(n.x,n.y,rr+4+3*pulse,0,Math.PI*2);
        ctx.strokeStyle=cols.accent;ctx.globalAlpha=0.5*li*(0.6+0.4*pulse);ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;
      }
    }
    ctx.fillStyle=cols.ink2;ctx.font='11px "Xanh Mono", "Courier New", monospace';ctx.textAlign='center';
    var names=['input','hidden','hidden','output'];
    for(i=0;i<L;i++){ctx.fillText(names[i],byLayer[i][0].x,H-H*0.16+28);}
    var done=lit(L-1,ph);
    if(done>0.01){
      ctx.globalAlpha=done;ctx.textAlign='right';ctx.fillStyle=cols.ink2;
      ctx.fillText('argmax = y'+(best.i+1)+'   p = '+best.a.toFixed(2),W-W*0.02,H-6);
      ctx.globalAlpha=1;
    }
  }
  var period=5200, t0=null, last=1;
  function frame(now){
    if(t0===null){t0=now;}
    var t=((now-t0)%period)/period;
    if(t<last){newPass();}
    last=t;
    draw(t);
    requestAnimationFrame(frame);
  }
  readColors();build();layout();newPass();
  if(reduce){draw(0.8);}else{requestAnimationFrame(frame);}
  if('ResizeObserver' in window){new ResizeObserver(function(){layout();if(reduce)draw(0.8);}).observe(cv);}
  else{window.addEventListener('resize',function(){layout();if(reduce)draw(0.8);});}
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){readColors();if(reduce)draw(0.8);});
  new MutationObserver(function(){readColors();if(reduce)draw(0.8);}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
