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
      // Need movement in case we push another player
      return {player: g.Player.move(player, player.o), direction: player.o}
    }
    if (subtype === 'ArrowLeft') {
      return {player: g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: -1}))}
    }
    if (subtype === 'ArrowRight') {
      // Canvas coordinates grow from top to bottom so orientation is the other sign as usual
      return {player: g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: 1}))}
    }
    if (subtype === 'ArrowDown') {
      return {player: g.Player.move(player, Complex.multiply({x:-1, y:0}, player.o)), direction: Complex.multiply({x:-1, y:0}, player.o)}
    }
  },
  move(player, vector) {
    return g.Player.init(Complex.add(player.c, vector), player.type, player.o)
  },
  collide(pl1, pl2) {
    return pl1.c.x === pl2.c.x && pl1.c.y === pl2.c.y
  }

}