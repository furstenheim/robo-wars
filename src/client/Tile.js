g.Tile = {
  init : function (x, y, tileType) {
    return {
      x: x,
      y: y,
      type: tileType
    }
  },
  render: function (game, tile) {
    var realCoordinates = g.Game.getRealCoordinates(game, tile.x, tile.y)
    var c = g.c
    var floor = new Image()
    floor.src = g.Tiles[tile.type]
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h)
  }
}
