(function(){'use strict';/* Shared variables and global js variables (better here than global so they can be minified */// TODO move this to client so there are no conflicts
//var socket
// global variable
function a(m){return JSON.parse(JSON.stringify(m))}// Half PI
// Use complex to rotate, move on the plane
function b(m,n){return Array.isArray(m)?b(m[0],m[1]):{x:m,y:n}}// No method overloadin :(
var f={},k=['ArrowRight','ArrowUp','ArrowLeft','ArrowDown'],l=Math.PI/2;f.Actions={init:function(){return{players:[]}},types:{player:'player',laser:'laser',death:'death',win:'win'}},b.add=function(m,n){return new b(m.x+n.x,m.y+n.y)},b.multiply=function(m,n){return new b(m.x*n.x-m.y*n.y,m.x*n.y+m.y*n.x)},b.getTheta=function(m){return 0===m.x?1===m.y?1*l:3*l:1===m.x?0:2*l},f.Game={init:function(){return{// TODO move this to client
h:900,w:900,sx:30,sy:30,np:f.Game.np}},get np(){return 2},prepareGame:function(m){var n,o,q,p=['floor','floor'],r=[],s=[],t=[0,0.1,0.99,0.5],u=[0.5,0.55,0.5,0.99]/*distorsionsx = [0, 1/2, 0.99, 1/2], distorsionsy = [ 1/2, 0, 1/2, 0.99]*/,v=[[1,0],[0,1],[-1,0],[0,-1]];for(n=0;n<m.np;n++)s.push(f.Player.init(b(~~(t[n]*m.sx),~~(u[n]*m.sy)),'player',b(v[n]),1,f.Player.statuses.alive));for(n=0;n<m.sx;n++)for(o=0;o<m.sy;o++)q=p[Math.floor(2*Math.random())],r.push(f.Tile.init(n,o,q));return{game:m,players:s,tiles:r,remainingActions:[],postActions:[]}},computeMovements(m,n){// We compute the resulting positions and actions and that is what we pass to the users, as the tiles they already know
var r,o=a(m),p=[],q=o.players;for(let s of n){// ohh my old node without json destructuring
let t=s.position;// dead are not allowed to move
if(q[t].s!==f.Player.statuses.dead){let I=f.Player.handleAction(q[t],s),J={player:I.player,position:t},K=[J],L=I.direction;// Let's do all the pushing (in case we don't stumble to a wall)
if(L){for(;J=f.Game.computePlayerCollision(J.player,q,L);)K.push(J);// Compute if the movement is possible, if not we abort all movements
f.Game.computeMovementObstruction(K[K.length-1].player,o)&&(K=[{player:q[t],position:t}])}for(let O of K)q[O.position]=O.player;let M=[],N=q[t];if(r=f.Game.computeLasers(N,q,o)){let O=f.Player.decreaseHealth(r.oplayer),Q=q[r.oposition].s===f.Player.statuses.alive&&O.s===f.Player.statuses.dead;if(q[r.oposition]=O,M.push(Object.assign(r,{oplayer:O})),Q){M.push({type:f.Actions.types.death,oposition:r.oposition});for(let R=0,S=-1,T=0;T<q.length;T++)q[T].s===f.Player.statuses.dead?R++:S=T;(R=q.length-1)&&M.push({type:f.Actions.types.win,position:S})}}// TODO handle shooting
// TODO add postActions
p.push({movements:K,postActions:M})}}return{state:o,actions:p}},computePlayerCollision(m,n,o){for(let p=0;p<n.length;p++)if(f.Player.collide(m,n[p]))return{position:p,player:f.Player.move(n[p],o)}},computeMovementObstruction(m,n){// TODO check for blocks
var o=m.c,p=n.game;if(0>o.x||0>o.y||o.x>p.sx||o.y>p.sy)return!0},computeLasers(m,n,o){var p=m;// Laser blasts up to four
for(let q=0;4>q;q++){// Nothing to shoot
if(p=f.Player.handleAction(p,{subtype:'ArrowUp'}).player,f.Game.computeMovementObstruction(p,o))return!1;for(let r=0;r<n.length;r++)if(f.Player.collide(p,n[r]))return{type:'laser',player:m,oplayer:n[r],oposition:r}}}},f.Player={init:function(m,n,o,p,q){var r=f.PlayerTile.init(m.x,m.y,n,b.getTheta(o));return{t:r,o:o,c:m,type:n,h:p,s:q}},handleAction(m,n){var o=n.subtype;return'ArrowUp'===o?{player:f.Player.move(m,m.o),direction:m.o}:'ArrowLeft'===o?{player:f.Player.init(m.c,m.type,b.multiply(m.o,{x:0,y:-1}),m.h,m.s)}:'ArrowRight'===o?{player:f.Player.init(m.c,m.type,b.multiply(m.o,{x:0,y:1}),m.h,m.s)}:'ArrowDown'===o?{player:f.Player.move(m,b.multiply({x:-1,y:0},m.o)),direction:b.multiply({x:-1,y:0},m.o)}:void 0},move(m,n){return f.Player.init(b.add(m.c,n),m.type,m.o,m.h,m.s)},collide(m,n){return m.c.x===n.c.x&&m.c.y===n.c.y},decreaseHealth(m){var n=0.93*m.h;return f.Player.init(m.c,m.type,m.o,n,0.5>n?f.Player.statuses.dead:f.Player.statuses.alive)},statuses:{dead:'dead',alive:'alive'}},f.PlayerTile={init:function(m,n,o,p){return{x:m,y:n,type:o,t:p}},changeState:function(m,n,o,p){return{x:m.x+n,y:m.y+o,type:m.type,t:m.t+p}}},f.store={},f.Tile={init:function(m,n,o){return{x:m,y:n,type:o}},render:function(m,n,o){if(o&&!n){var p=f.Game.getRealCoordinates(m,o.x,o.y),q=f.bgc,r=new Image;r.src=f.Tiles[o.type],q.drawImage(r,p.x,p.y,p.w,p.h)}}},'undefined'!=typeof window&&function(){/**
 * Bind Socket.IO and button events
 */function m(){n.on('actions',function(p){f.store.acceptActions(p)}),n.on('start',function(p){f.store.startGame(JSON.parse(p))}),n.on('end',function(){}),n.on('connect',function(){}),n.on('disconnect',function(){}),n.on('error',function(){})}var n,o=document.getElementById.bind(document);/*
g.Action = {
  init: function (type, params) {
    var action
    switch (type) {
      case 'playerMovement':
        action = g.Action.player(params)
        break
      case 'laser':

      default:
        action = {}
        break
    }
    return Object.assign(action, {type: type})
  },
  playerMovement: function (params) {
    return {
      subtype: params.type,
      player: params.player
    }
  }
}*/// Nasty trick to cache imgs and make loading sync
for(let p in Object.assign(f.Game,{// No need for this on the server
getRealCoordinates:function(p,q,r){return{x:q*p.w/p.sx,y:r*p.h/p.sy,w:p.w/p.sx,h:p.h/p.sy}}}),f.Input={init:function(){return{time:new Date,actions:[]}},size:{w:800,h:100},max:4,render:function(p,q){var r=f.Input.size.h,s=f.Input.size.w,t=f.ic,u=~~(r/30),v=r*f.Input.max+r/2,z=r/2;// For some reason circle does not disappear without c.beginPath?¿
t.beginPath(),t.clearRect(0,0,s,r);for(let A=0;A<f.Input.max;A++){t.strokeStyle='black',t.strokeRect(r*A+u,u,r-2*u,r-2*u);let B=p.actions[A];if(B){t.save();let C=f.images.arrow;t.translate(r*A+r/2,r/2),t.rotate(-f.Input.subtypeToTheta(B.subtype)),t.drawImage(C,-(r-2*u)/2,-(r-2*u)/2,r-2*u,r-2*u),t.restore()}}q=Math.max(Math.min(q,1),0),0<q&&(t.beginPath(),t.fillStyle='red',t.moveTo(v,z),t.arc(v,z,z-2*u,0,4*q*l),t.lineTo(v,z),t.closePath(),t.fill()),t.stroke()},clear:function(){var p=f.Input.size.h,q=f.Input.size.w,r=f.ic;r.clearRect(0,0,q,p)},subtypeToTheta(p){var q=k.indexOf(p);if(-1<q)return l*q},// health goes from 0 to 1 1 is healthy, remainingTime so we can prioritize
acceptAction(p,q,r,s){var t=Math.random()<r,u=a(p);return p.actions.length>=f.Input.max?p:(t?u.actions.push({type:f.Actions.types.player,subtype:q,remainingTime:s}):u.actions.push({type:f.Actions.types.player,subtype:k[~~(4*Math.random())],remainingTime:s}),u)},// Fill input to the total
fillInput(p){var r,q=a(p);for(r=p.actions.length;r<f.Input.max;r++)q.actions.push({type:f.Actions.types.player,subtype:k[~~(4*Math.random())],remainingTime:0});return q}},Object.assign(f.PlayerTile,{render:function(p,q,r,s){if(r){var u,v,z,A,t=f.Game.getRealCoordinates(p,r.x,r.y);if(s=Math.min(Math.max(s,0),f.store.movement)/f.store.movement,!q)u=t.x,v=t.y,z=r.t;else{var B=f.Game.getRealCoordinates(p,q.x,q.y);u=(1-s)*B.x+s*t.x,v=(1-s)*B.y+s*t.y,A=Math.abs(q.t-r.t)<2*l?q.t:Math.abs(q.t-4*l-r.t)<Math.abs(q.t+4*l-r.t)?q.t-4*l:q.t+4*l,z=(1-s)*A+s*r.t}var C=f.c;f.c.save();var D=t.w/2,E=t.h/2;f.c.translate(u+D,v+E),f.c.rotate(z);var F=f.images[r.type];C.drawImage(F,-E,-D,2*D,2*E),f.c.restore()}}}),f.store={init:function(){return{game:f.Game.init(),tiles:[],players:[],remainingActions:[],postActions:[]}},movement:1000,inputActions:4,inputTime:2000,listenInput:!1,// tick depends movement so we need this wizardy
get tick(){return this.movement/60},startGame(p){var q=f.store.state;f.store.oldState=q,f.store.state=p,f.store.render(q,p),f.store.acceptInput()},acceptInput(){if(!f.store.input&&!f.store.dead&&!f.store.won)return f.store.input=f.Input.init(),document.addEventListener('keydown',f.store.handleKeyDown,!1),window.requestAnimationFrame(f.store.acceptInput);// TODO only send necessary actions
var p=(f.store.inputTime-(new Date-new Date(f.store.input.time)))/f.store.inputTime;return 0>p?(document.removeEventListener('keydown',f.store.handleKeyDown),f.store.input=f.Input.fillInput(f.store.input),f.Input.render(f.store.input,-1),f.store.sendMovements(f.store.input.actions),void(f.store.input=!1)):void(f.Input.render(f.store.input,p),window.requestAnimationFrame(f.store.acceptInput))},acceptActions(p){var q=f.store.state,r=a(q);r.remainingActions=p,f.store.oldState=q,f.store.state=r,f.store.displayMovement()},prepareGame(){var p=f.store.state,q=a(p),r=p.game,s=f.Game.prepareGame(r);q.tiles=s.tiles,q.players=s.players,f.store.state=q,f.store.oldState=p,f.store.render(p,q)},sendMovements(p){n.emit('move',p)},render(p,q,r){f.c.clearRect(0,0,q.game.w,q.game.h);var v,s=p.tiles,t=q.tiles,u=q.game;// First go the tiles
for(v=0;v<Math.max(s.length,t.length);v++)f.Tile.render(u,s[v],t[v]);var z=p.players,A=q.players;for(v=0;v<Math.max(z.length,A.length);v++)f.PlayerTile.render(u,(z[v]||{}).t,(A[v]||{}).t,r)},displayMovement(){var p=f.store.oldState,q=f.store.state,r=q.game,s=f.store.animating,t=new Date-f.store.time;// we need to do post Actions
if(s)// Render one just time to make sure we render correctly
return t>f.store.movement&&(f.store.animating=!1),window.requestAnimationFrame(f.store.displayMovement),f.store.render(p,q,t);var A,u=a(q),v=u.remainingActions,z=u.postActions;// Handle post actions from previous movement
if(z.length){for(let B of z)f.store.handleAction(u,B);u.postActions=[]}else{// Handle actions
if(!v.length)return void f.store.acceptInput();// Prepare the actions
A=v.shift();for(let B of A.movements)Object.assign(u.players[B.position],B.player);u.postActions=A.postActions}// TODO handle postactions
f.store.oldState=q,f.store.state=u,f.store.animating=!0,f.store.time=new Date,window.requestAnimationFrame(f.store.displayMovement)},handleAction(p,q){return q.type===f.Actions.types.laser?(Object.assign(p.players[q.oposition],q.oplayer),void f.store.renderHealth(p.players)):q.type===f.Actions.types.death?void f.store.handleDeath(q.oposition,p):void(q.type===f.Actions.types.win&&f.store.handleWin(q.position,p))},handleKeyDown(p){var q=p.key||p.code,r=f.store.input,s=a(r),t=(f.store.inputTime-(new Date-new Date(f.store.input.time)))/f.store.inputTime;-1!==k.indexOf(q)&&(f.store.input=f.Input.acceptAction(r,q,1,t))},renderHealth(p){var r,q=[];for(let s=0;s<p.length;s++)r=p[s],q.push(`Player ${s} health: ${parseInt(100*(2*(Math.max(r.h,0.5)-0.5)))} %`);f.health.textContent=q.join(' ')},handleDeath(p,q){p===q.position&&(f.store.dead=!0)},handleWin(p,q){p===q.position&&(f.store.won=!0)}},Object.assign(f.Tile,{render:function(p,q,r){if(r&&!q){var s=f.Game.getRealCoordinates(p,r.x,r.y),t=f.bgc,u=f.images[r.type];t.drawImage(u,s.x,s.y,s.w,s.h)}}}),f.Tiles={},f.Tiles={floor:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCTo0C01FEQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABQSURBVBjTpVBBDgAgCCr/Wr0pe0r1tw6txhJPcVNAHHGOHg6a1pRLMIgo8iAe0bS+IlxtYK7YlTWQOGsQ7w80COXI4/c+Lem7J8zlPeGYclkeyCQcEkGchAAAAABJRU5ErkJggg==',player:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgbCQcdTm7r7AAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA5SURBVAjXdc1BCkJBAMPQ17n/mY2L8SMIFroJJV0FQ7bU4HwaqNnusgf+5PiTdZ3hbF65P18/PRDe6EIb/8frDKQAAAAASUVORK5CYII=',arrow:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgbCQcdTm7r7AAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA5SURBVAjXdc1BCkJBAMPQ17n/mY2L8SMIFroJJV0FQ7bU4HwaqNnusgf+5PiTdZ3hbF65P18/PRDe6EIb/8frDKQAAAAASUVORK5CYII=',hole:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgVCicOvc1H+gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAcSURBVAjXY2RgYPjPgAUwMeAA5Ev8RZdgxGU5ANPcAwYrkLWxAAAAAElFTkSuQmCC'},f.canvas=document.getElementById('c'),f.c=f.canvas.getContext('2d'),f.bgcanvas=document.getElementById('bgc'),f.bgc=f.bgcanvas.getContext('2d'),f.icanvas=document.getElementById('ic'),f.ic=f.icanvas.getContext('2d'),f.health=o('health'),f.images={},f.Tiles){let q=new Image;q.src=f.Tiles[p],f.images[p]=q}window.addEventListener('load',function(){n=io({upgrade:!1,transports:['websocket']}),m()},!1),f.store.state=f.store.init()}(),'undefined'==typeof window&&function(){/**
 * Find opponents for a user
 * @param {User} user
 */function m(r){for(let s of q)// This actually does not work for g.Game.np === 1. But who wants to play alone?
if(r!==s&&// loggedUser counts for the total number
s.opponents.length<f.Game.np-1){for(let t of s.opponents)r.opponents.push(t),t.opponents.push(r);s.opponents.push(r),r.opponents.push(s),s.opponents.length===f.Game.np-1&&new o([s].concat(s.opponents)).start()}}/**
 * Remove user session
 * @param {User} user
 */function n(r){q.splice(q.indexOf(r),1)}function o(r){this.users=r}/**
 * Start new game
 *//**
 * User session class
 * @param {Socket} socket
 */function p(r){this.socket=r,this.game=null,this.alive=!0,this.opponents=[]}/**
 * Start new game
 * @param {Game} game
 * @param {User} opponent
 *//**
 * User sessions
 * @param {array} users
 */var q=[];o.prototype.start=function(){var r=f.Game.init(),s=this.users;// TODO get type of player from users
this.state=f.Game.prepareGame(r),this.alive=this.users.length,this.played=0,this.movements=[];for(let t=0;t<s.length;t++)s[t].start(this,t)},o.prototype.acceptMove=function(r,s){this.played=this.played+1;for(let t of r)this.movements.push(Object.assign({position:s},t));this.played===this.alive&&(this.played=0,this.move())},o.prototype.move=function(){var r=this.movements.sort((t,u)=>u.remainingTime-t.remainingTime),s=f.Game.computeMovements(this.state,r);this.state=s.state,this.movements=[];for(let t of this.users)t.alive&&this.state.players[t.position].s===f.Player.statuses.dead&&(this.alive=this.alive-1,t.die()),t.sendActions(s.actions)},o.prototype.ended=function(){return this.user1.guess!==GUESS_NO&&this.user2.guess!==GUESS_NO},p.prototype.start=function(r,s){this.game=r,this.position=s,this.socket.emit('start',JSON.stringify(Object.assign(r.state,{position:s})))},p.prototype.die=function(){this.alive=!1},p.prototype.move=function(r){this.alive&&this.game.acceptMove(r,this.position)},p.prototype.sendActions=function(r){this.socket.emit('actions',r)},p.prototype.end=function(){this.game=null,this.opponent=null,this.guess=GUESS_NO,this.socket.emit('end')},p.prototype.win=function(){this.socket.emit('win',this.opponent.guess)},p.prototype.lose=function(){this.socket.emit('lose',this.opponent.guess)},p.prototype.draw=function(){this.socket.emit('draw',this.opponent.guess)},module.exports=function(r){var s=new p(r);q.push(s),m(s),r.on('disconnect',function(){n(s)}),r.on('move',function(t){s.move(t)})}}()})();