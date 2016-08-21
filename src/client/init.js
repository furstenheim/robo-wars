/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
var tile = g.Tile.init(4,4,'floor')
var game = g.game = new g.Game()
g.Tile.render(game, tile)
var player = g.PlayerTile.init(4,4, 'player', 0)
g.PlayerTile.render(game, player, player, 0)

var nextPlayer = g.PlayerTile.changeState(player, 0, 0, Math.PI / 2)
var t = 0
var length = 50
var interval = setInterval( function () {
  t += 1 / length
  if (t > 1) {
    clearInterval(interval)
  }
  g.Tile.render(game, tile)
  g.PlayerTile.render(game, player, nextPlayer, t)
}, 2000 / length)
