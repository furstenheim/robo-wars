/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
g.bgcanvas = document.getElementById('bgc')
g.bgc = g.bgcanvas.getContext('2d')
/**
 * Bind Socket.IO and button events
 */
function bind() {

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

  socket.on("error", function () {
    console.error("Connection error!");
  });
}
function init() {
  socket = io({ upgrade: false, transports: ["websocket"] });
  bind();
}

window.addEventListener("load", init, false);
document.addEventListener('keydown', g.store.handleKeyDown, false)




g.store.state = g.store.init()
/*g.store.init()
g.store.prepareGame()
//var interval = setInterval(g.store.display, g.store.tick)
g.store.state.remainingActions = [[
  {type:g.Actions.types.player, player: 0, subtype: 'ArrowUp'},
  {type:g.Actions.types.player, player: 1, subtype: 'ArrowRight'},
  {type:g.Actions.types.player, player: 2, subtype: 'ArrowLeft'},
  {type:g.Actions.types.player, player: 3, subtype: 'ArrowUp'}],
  [
    {type:g.Actions.types.player, player: 0, subtype: 'ArrowUp'},
    {type:g.Actions.types.player, player: 1, subtype: 'ArrowUp'},
    {type:g.Actions.types.player, player: 2, subtype: 'ArrowLeft'},
    {type:g.Actions.types.player, player: 3, subtype: 'ArrowUp'}]]
g.store.displayMovement()*/

