Object.assign(g.Tile,
  {render: function (game, oldTile, newTile) {
    if (!newTile){
      return
    }
    if (oldTile) {
      // Already drawn
      return
    }
    var realCoordinates = g.Game.getRealCoordinates(game, newTile.x, newTile.y)
    var c = g.bgc
    var floor = g.images[newTile.type]
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h)
  }
})
