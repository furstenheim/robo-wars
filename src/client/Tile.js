g.Tile = {
  init : function (x, y, tileType) {
    return {
      x: x,
      y: y,
      type: tileType
    }
  },
  render: function (game, oldTile, newTile) {
    if (!newTile){
      return
    }
    var realCoordinates = g.Game.getRealCoordinates(game, newTile.x, newTile.y)
    var c = g.c
    var floor = new Image()
    floor.src = g.Tiles[newTile.type]
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h)
  }
}
