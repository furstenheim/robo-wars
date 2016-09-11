g.Player = {
  init: function (complex, playerType, orientation, health, status) {

    var tile = g.PlayerTile.init(complex.x, complex.y, playerType, Complex.getTheta(orientation))
    return {
      t: tile,
      o: orientation,
      c: complex,
      type: playerType,
      h: health,
      s: status
    }
  },
  handleAction(player, action) {
    var subtype = action.subtype
    if (subtype === 'ArrowUp') {
      // Need movement in case we push another player
      return {player: g.Player.move(player, player.o), direction: player.o}
    }
    if (subtype === 'ArrowLeft') {
      return {player: g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: -1}), player.h, player.s)}
    }
    if (subtype === 'ArrowRight') {
      // Canvas coordinates grow from top to bottom so orientation is the other sign as usual
      return {player: g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: 1}), player.h, player.s)}
    }
    if (subtype === 'ArrowDown') {
      return {player: g.Player.move(player, Complex.multiply({x:-1, y:0}, player.o)), direction: Complex.multiply({x:-1, y:0}, player.o)}
    }
  },
  move (player, vector) {
    return g.Player.init(Complex.add(player.c, vector), player.type, player.o, player.h, player.s)
  },
  collide(pl1, pl2) {
    return pl1.c.x === pl2.c.x && pl1.c.y === pl2.c.y
  },
  decreaseHealth (player) {
    var newHealth = player.h * 0.93
    return g.Player.init(player.c, player.type, player.o, newHealth, newHealth < 0.5 ? g.Player.statuses.dead : g.Player.statuses.alive)
  },
  statuses: {
    dead: 'dead',
    alive: 'alive'
  }
}