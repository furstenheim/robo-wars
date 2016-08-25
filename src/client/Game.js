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
    var i,j, types = ['floor', 'hole'], type, tiles=[], players=[], distorsionsx = [0, 1/2, 0.99, 1/2],distorsionsy = [ 1/2, 0, 1/2, 0.99], distorsionst = [1/2, -1, -1/2, 0 ]
    for (i=0; i<game.np; i++) {
      players.push(g.Player.init(~~ (distorsionsx[i] * game.sx), ~~ (distorsionsy[i] * game.sy), 'player', (distorsionst[i] * Math.PI)))
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
/*
function () {
    this.height = 400
    this.width = 400
    // number of columns
    this.spanX = 10
    this.spanY = 10

    this.getRealCoordinates = function (x, y) {
      var game = this
      return {
        x: x * game.width / game.spanX,
        y: y * game.height / game.spanY,
        w: game.width / game.spanX,
        h: game.height / game.spanY
      }
    }
    return this
  }
}*/
