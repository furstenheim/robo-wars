g.Tile = {
  init : function (x, y, tileType) {
    return {
      x: x,
      y: y,
      type: tileType
    }
  },
  render : function (game, tile) {
    var realCoordinates = game.getRealCoordinates(tile.x, tile.y)
    var c = g.c
    var floor = new Image()
    floor.src = g.Tiles[tile.type]
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h)
  }
}
/*

var c = g.c
//c.fillStyle = 'red'
//c.fillRect(20,20,50,50)
var floor = new Image()
floor.src = g.tiles.floor
c.drawImage(floor, 50, 50, 20, 20)

*/
