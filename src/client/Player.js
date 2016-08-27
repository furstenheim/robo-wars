g.Player = {
  init: function (complex, playerType, orientation) {

    var tile = g.PlayerTile.init(complex.x, complex.y, playerType, Complex.getTheta(orientation))
    return {
      t: tile,
      o: orientation,
      c: complex,
      type: playerType
    }
  },
  handleAction(player, action) {
    var subtype = action.subtype
    if (subtype === 'forward') {
      return g.Player.init(Complex.add(player.c, player.o), player.type, player.o)
    }
  }

}