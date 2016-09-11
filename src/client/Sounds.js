g.Sounds = {
    types : {
      shoot: [3,0.0948,0.0129,0.3671,0.3266,0.5,,,-0.0095,,0.0367,-0.5561,0.2962,,0.0279,0.661,0.0342,0.6563,0.9997,0.2854,,0.1397,-0.0457,0.5],
      failed: [3,,0.6665,0.3981,0.468,0.5321,,0.0299,-0.9171,,0.1315,0.1741,,,-0.0362,,-0.7438,-0.0077,0.9986,,0.2791,0.3116,0.2152,0.5],
      right: [2,,0.5642,0.1458,0.9778,0.5008,,-0.002,0.8448,0.0123,,0.6281,,,-0.2081,,-0.2477,-0.0012,0.974,-0.6453,0.9891,0.8115,0.1889,0.5],
      death: [3,0.0011,0.396,0.4339,0.2223,0.5037,,0.0302,0.8244,0.0029,0.5527,0.6106,0.0088,,-0.103,,0.048,-0.2334,0.9933,0.0696,0.3596,0.0001,0.0033,0.5]
    },
    play(type) {
      var sound
      if (sound = g.Sounds.types[type]) {
        var audio = new Audio()
        audio.src = jsfxr(sound)
        audio.play()
    }
  }
};
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
