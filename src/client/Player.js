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
    if (subtype === 'rotateLeft') {
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: 1}))
    }
    if (subtype === 'rotateRight') {
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: -1}))
    }
    if (subtype === 'backwards') {
      return g.Player.init(Complex.add(player.c, Complex.multiply({x:-1, y:0}, player.o)), player.type, player.o)
    }
  }

}