g.Game = function () {
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