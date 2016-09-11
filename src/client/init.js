/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
g.bgcanvas = document.getElementById('bgc')
g.bgc = g.bgcanvas.getContext('2d')
g.icanvas = document.getElementById('ic')
g.ic = g.icanvas.getContext('2d')
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

  socket.on("error", function () {
    console.error("Connection error!");
  });
}
function init() {
  socket = io({ upgrade: false, transports: ["websocket"] });
  bind();
}

window.addEventListener("load", init, false);





g.store.state = g.store.init()
//setTimeout(function () {g.Input.render(g.Input.init())}, 10)
//g.store.acceptInput()
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

