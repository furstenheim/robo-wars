g.Player = {
  init: function (complex, playerType, orientation) {

    var tile = g.PlayerTile.init(complex.x, complex.y, playerType, orientation.getTheta())
    return {
      t: tile,
      o: orientation
    }
  },
  handleAction(player, action) {
    var subtype = action.subtype
    if (subtype === 'forward') {

    }
  }

}