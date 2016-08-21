/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
var tile = g.Tile.init(1,1,'floor')
g.game = new g.Game()
g.Tile.render(g.game, tile)