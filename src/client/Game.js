Object.assign(g.Game, {
  // No need for this on the server
  getRealCoordinates: function (game, x,y) {
    return {
      x: x * game.w / game.sx,
      y: y * game.h / game.sy,
      w: game.w / game.sx,
      h: game.h / game.sy
    }
  }
})
