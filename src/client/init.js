/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
g.bgcanvas = document.getElementById('bgc')
g.bgc = g.bgcanvas.getContext('2d')
g.icanvas = document.getElementById('ic')
g.ic = g.icanvas.getContext('2d')
g.lcanvas = document.getElementById('lc')
g.lc = g.lcanvas.getContext('2d')
g.health = getById('health')
g.message = getById('message')
g.images = {}
// Nasty trick to cache imgs and make loading sync
for (let img in g.Tiles) {
  let image = new Image()
  image.src = g.Tiles[img]
  g.images[img] = image
}
/**
 * Bind Socket.IO and button events
 */
function bind() {

  socket.on('actions', function (actions) {
    g.store.acceptActions(actions)
    console.log(actions)
  })
  socket.on('start', function (state) {
    console.log('starting')
    g.store.startGame(JSON.parse(state))
    //console.log(state, position)
  })
  socket.on("end", function () {
    console.log("Waiting for opponent...");
  });

  socket.on("connect", function () {
    console.log("Waiting for opponent...");
  });

  socket.on("disconnect", function () {
    console.error("Connection lost!");
  });
  socket.on('winner', function (position) {
    g.store.handleWin(position, g.store.state)
  })

  socket.on("error", function () {
    console.error("Connection error!");
  });
}
function init() {
  socket = io({ upgrade: false, transports: ["websocket"] });
  bind();
}

window.addEventListener("load", init, false);





g.store.state = g.store.init();


/*	https://github.com/mneubrand/jsfxr Minified version from https://github.com/eoinmcg/roboflip/blob/master/js/lib/jsfxr.min.js
*/ 
(function () {
function SfxrParams(){this.setSettings=function(e){for(var f=0;24>f;f++)this[String.fromCharCode(97+f)]=e[f]||0;.01>this.c&&(this.c=.01);e=this.b+this.c+this.e;.18>e&&(e=.18/e,this.b*=e,this.c*=e,this.e*=e)}}
function SfxrSynth(){this._params=new SfxrParams;var e,f,d,h,l,A,K,L,M,B,m,N;this.reset=function(){var b=this._params;h=100/(b.f*b.f+.001);l=100/(b.g*b.g+.001);A=1-b.h*b.h*b.h*.01;K=-b.i*b.i*b.i*1E-6;b.a||(m=.5-b.n/2,N=5E-5*-b.o);L=1+b.l*b.l*(0<b.l?-.9:10);M=0;B=1==b.m?0:(1-b.m)*(1-b.m)*2E4+32};this.totalReset=function(){this.reset();var b=this._params;e=b.b*b.b*1E5;f=b.c*b.c*1E5;d=b.e*b.e*1E5+12;return 3*((e+f+d)/3|0)};this.synthWave=function(b,O){var a=this._params,P=1!=a.s||a.v,r=a.v*a.v*.1,Q=
1+3E-4*a.w,n=a.s*a.s*a.s*.1,W=1+1E-4*a.t,X=1!=a.s,Y=a.x*a.x,Z=a.g,R=a.q||a.r,aa=a.r*a.r*a.r*.2,E=a.q*a.q*(0>a.q?-1020:1020),S=a.p?((1-a.p)*(1-a.p)*2E4|0)+32:0,ba=a.d,T=a.j/2,ca=a.k*a.k*.01,F=a.a,G=e,da=1/e,ea=1/f,fa=1/d,a=5/(1+a.u*a.u*20)*(.01+n);.8<a&&(a=.8);for(var a=1-a,H=!1,U=0,w=0,x=0,C=0,u=0,y,v=0,g,p=0,t,I=0,c,V=0,q,J=0,D=Array(1024),z=Array(32),k=D.length;k--;)D[k]=0;for(k=z.length;k--;)z[k]=2*Math.random()-1;for(k=0;k<O;k++){if(H)return k;S&&++V>=S&&(V=0,this.reset());B&&++M>=B&&(B=0,h*=
L);A+=K;h*=A;h>l&&(h=l,0<Z&&(H=!0));g=h;0<T&&(J+=ca,g*=1+Math.sin(J)*T);g|=0;8>g&&(g=8);F||(m+=N,0>m?m=0:.5<m&&(m=.5));if(++w>G)switch(w=0,++U){case 1:G=f;break;case 2:G=d}switch(U){case 0:x=w*da;break;case 1:x=1+2*(1-w*ea)*ba;break;case 2:x=1-w*fa;break;case 3:x=0,H=!0}R&&(E+=aa,t=E|0,0>t?t=-t:1023<t&&(t=1023));P&&Q&&(r*=Q,1E-5>r?r=1E-5:.1<r&&(r=.1));q=0;for(var ga=8;ga--;){p++;if(p>=g&&(p%=g,3==F))for(y=z.length;y--;)z[y]=2*Math.random()-1;switch(F){case 0:c=p/g<m?.5:-.5;break;case 1:c=1-p/g*2;
break;case 2:c=p/g;c=6.28318531*(.5<c?c-1:c);c=1.27323954*c+.405284735*c*c*(0>c?1:-1);c=.225*((0>c?-1:1)*c*c-c)+c;break;case 3:c=z[Math.abs(32*p/g|0)]}P&&(y=v,n*=W,0>n?n=0:.1<n&&(n=.1),X?(u+=(c-v)*n,u*=a):(v=c,u=0),v+=u,C+=v-y,c=C*=1-r);R&&(D[I%1024]=c,c+=D[(I-t+1024)%1024],I++);q+=c}q=.125*q*x*Y;b[k]=1<=q?32767:-1>=q?-32768:32767*q|0}return O}}
var synth=new SfxrSynth;
window.jsfxr=function(e){synth._params.setSettings(e);var f=synth.totalReset();e=new Uint8Array(4*((f+1)/2|0)+44);var f=2*synth.synthWave(new Uint16Array(e.buffer,44),f),d=new Uint32Array(e.buffer,0,44);d[0]=1179011410;d[1]=f+36;d[2]=1163280727;d[3]=544501094;d[4]=16;d[5]=65537;d[6]=44100;d[7]=88200;d[8]=1048578;d[9]=1635017060;d[10]=f;for(var f=f+44,d=0,h="data:audio/wav;base64,";d<f;d+=3)var l=e[d]<<16|e[d+1]<<8|e[d+2],h=h+("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>18]+
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>12&63]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>6&63]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l&63]);return h};
})()
