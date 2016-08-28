/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
g.bgcanvas = document.getElementById('bgc')
g.bgc = g.bgcanvas.getContext('2d')
g.store.init()
g.store.prepareGame()
var interval = setInterval(g.store.display, g.store.tick)
g.store.state.remainingActions = [[
  {type:g.Actions.types.player, player: 0, subtype: 'forward'},
  {type:g.Actions.types.player, player: 1, subtype: 'rotateRight'},
  {type:g.Actions.types.player, player: 2, subtype: 'rotateLeft'},
  {type:g.Actions.types.player, player: 3, subtype: 'forward'}],
  [
    {type:g.Actions.types.player, player: 0, subtype: 'forward'},
    {type:g.Actions.types.player, player: 1, subtype: 'backwards'},
    {type:g.Actions.types.player, player: 2, subtype: 'rotateLeft'},
    {type:g.Actions.types.player, player: 3, subtype: 'forward'}]]
/*
g.store.display()
*/
//g.store.state.remainingActions.concat([])
/*
g.store.display()*/
setTimeout(function (){clearInterval(interval)},10000)