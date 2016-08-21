g.PlayerTile = {
  init: function (x, y, playerType, theta) {
    return {
      x: x,
      y: y,
      type: playerType,
      t: theta
    }
  },
  render: function (game, oldState, newState, time) {
    time = Math.min(Math.max(time, 0), 1)
    var initialCoordinates = g.Game.getRealCoordinates(game, oldState.x, oldState.y)
    var finalCoordinates = g.Game.getRealCoordinates(game,newState.x, newState.y)
    var c = g.c
    var newX = (1-time) * initialCoordinates.x + time * finalCoordinates.x
    var newY = (1-time) * initialCoordinates.y + time * finalCoordinates.y
    g.c.save()
    var halfImageWidth = initialCoordinates.w / 2
    var halfImageHeight = initialCoordinates.h /2
    g.c.translate(newX + halfImageWidth, newY + halfImageHeight)
    g.c.rotate((1- time) * (oldState.t) + time * (newState.t))
    var player = new Image()
    player.src = g.Tiles[oldState.type]
    c.drawImage(
      player,
      -halfImageHeight,
      -halfImageWidth,
      initialCoordinates.w,
      initialCoordinates.h)
    g.c.restore()
  },
  changeState: function (player, dx, dy, dt) {
    return {
      x: player.x + dx,
      y: player.y + dy,
      type: player.type,
      t: player.t + dt
    }
  }
}