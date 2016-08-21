g.Game = {
  init: function () {
    return {
      h: 400,
      w: 400,
      sx: 10,
      sy: 10
    }
  },
  getRealCoordinates: function (game, x,y) {
    return {
      x: x * game.w / game.sx,
      y: y * game.h / game.sy,
      w: game.w / game.sx,
      h: game.h / game.sy
    }
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
