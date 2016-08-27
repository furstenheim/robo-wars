g.Game = {
  init: function () {
    return {
      h: 800,
      w: 800,
      sx: 30,
      sy: 30,
      np: 4
    }
  },
  getRealCoordinates: function (game, x,y) {
    return {
      x: x * game.w / game.sx,
      y: y * game.h / game.sy,
      w: game.w / game.sx,
      h: game.h / game.sy
    }
  },
  prepareGame: function (game) {
    var i,j, types = ['floor', 'floor'], type, tiles=[], players=[], distorsionsx = [0, 1/2, 0.99, 1/2],distorsionsy = [ 1/2, 0, 1/2, 0.99], distorsionst = [[1, 0], [0,1], [-1, 0], [0, -1]]
    for (i=0; i<game.np; i++) {
      players.push(g.Player.init(Complex(~~ (distorsionsx[i] * game.sx), ~~ (distorsionsy[i] * game.sy)), 'player', Complex(distorsionst[i])))
    }
    for (i=0; i < game.sx; i++) {
      for (j =0; j < game.sy; j++) {
        type = types[Math.floor(Math.random() * 2)]
        tiles.push(g.Tile.init(i, j, type))
      }
    }
    return {players: players, tiles: tiles}
  }

}
