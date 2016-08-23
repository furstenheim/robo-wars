g.Player = {
  init: function (x, y, playerType, theta) {
    var tile = g.PlayerTile.init(x, y, playerType, theta)
    return {
      t: tile
    }
  }
}