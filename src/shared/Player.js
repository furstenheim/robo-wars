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
    if (subtype === 'ArrowUp') {
      return g.Player.init(Complex.add(player.c, player.o), player.type, player.o)
    }
    if (subtype === 'ArrowLeft') {
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: -1}))
    }
    if (subtype === 'ArrowRight') {
      // Canvas coordinates grow from top to bottom so orientation is the other sign as usual
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: 1}))
    }
    if (subtype === 'ArrowDown') {
      return g.Player.init(Complex.add(player.c, Complex.multiply({x:-1, y:0}, player.o)), player.type, player.o)
    }
  }

}