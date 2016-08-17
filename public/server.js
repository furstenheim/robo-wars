!function(){"use strict";var t=0,n=1,s=2,e=3;"undefined"!=typeof window?!function(){function t(){for(var t=0;t<r.length;t++)r[t].setAttribute("disabled","disabled")}function n(){for(var t=0;t<r.length;t++)r[t].removeAttribute("disabled")}function s(t){c.innerHTML=t}function e(t){h.innerHTML=["<h2>"+t+"</h2>","Won: "+p.win,"Lost: "+p.lose,"Draw: "+p.draw].join("<br>")}function o(){u.on("start",function(){n(),s("Round "+(p.win+p.lose+p.draw+1))}),u.on("win",function(){p.win++,e("You win!")}),u.on("lose",function(){p.lose++,e("You lose!")}),u.on("draw",function(){p.draw++,e("Draw!")}),u.on("end",function(){t(),s("Waiting for opponent...")}),u.on("connect",function(){t(),s("Waiting for opponent...")}),u.on("disconnect",function(){t(),s("Connection lost!")}),u.on("error",function(){t(),s("Connection error!")});for(var o=0;o<r.length;o++)!function(n,s){n.addEventListener("click",function(n){t(),u.emit("guess",s)},!1)}(r[o],o+1)}function i(){u=io({upgrade:!1,transports:["websocket"]}),r=document.getElementsByTagName("button"),c=document.getElementById("message"),h=document.getElementById("score"),t(),o()}var u,r,c,h,p={draw:0,win:0,lose:0};window.addEventListener("load",i,!1)}():!function(){function o(t){for(var n=0;n<c.length;n++)t!==c[n]&&null===c[n].opponent&&new u(t,c[n]).start()}function i(t){c.splice(c.indexOf(t),1)}function u(t,n){this.user1=t,this.user2=n}function r(n){this.socket=n,this.game=null,this.opponent=null,this.guess=t}var c=[];u.prototype.start=function(){this.user1.start(this,this.user2),this.user2.start(this,this.user1)},u.prototype.ended=function(){return this.user1.guess!==t&&this.user2.guess!==t},u.prototype.score=function(){this.user1.guess===n&&this.user2.guess===e||this.user1.guess===s&&this.user2.guess===n||this.user1.guess===e&&this.user2.guess===s?(this.user1.win(),this.user2.lose()):this.user2.guess===n&&this.user1.guess===e||this.user2.guess===s&&this.user1.guess===n||this.user2.guess===e&&this.user1.guess===s?(this.user2.win(),this.user1.lose()):(this.user1.draw(),this.user2.draw())},r.prototype.setGuess=function(n){return!(!this.opponent||n<=t||n>e)&&(this.guess=n,!0)},r.prototype.start=function(n,s){this.game=n,this.opponent=s,this.guess=t,this.socket.emit("start")},r.prototype.end=function(){this.game=null,this.opponent=null,this.guess=t,this.socket.emit("end")},r.prototype.win=function(){this.socket.emit("win",this.opponent.guess)},r.prototype.lose=function(){this.socket.emit("lose",this.opponent.guess)},r.prototype.draw=function(){this.socket.emit("draw",this.opponent.guess)},module.exports=function(t){var n=new r(t);c.push(n),o(n),t.on("disconnect",function(){void 0,i(n),n.opponent&&(n.opponent.end(),o(n.opponent))}),t.on("guess",function(s){void 0,n.setGuess(s)&&n.game.ended()&&(n.game.score(),n.game.start())}),void 0}}()}();