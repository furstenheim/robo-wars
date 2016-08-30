Object.assign(g.PlayerTile, {
  render: function (game, oldState, newState, time) {
    if (!newState) {
      return
    }
    var finalCoordinates = g.Game.getRealCoordinates(game,newState.x, newState.y)
    var newX
    var newY
    var theta
    time = Math.min(Math.max(time, 0), g.store.movement) / g.store.movement
    if (!oldState) {
      newX = finalCoordinates.x
      newY = finalCoordinates.y
      theta = newState.t
    } else {
      var initialCoordinates = g.Game.getRealCoordinates(game, oldState.x, oldState.y)
      newX = (1-time) * initialCoordinates.x + time * finalCoordinates.x
      newY = (1-time) * initialCoordinates.y + time * finalCoordinates.y
      theta = (1- time) * (oldState.t) + time * (newState.t)
    }
    var c = g.c
    g.c.save()
    var halfImageWidth = finalCoordinates.w / 2
    var halfImageHeight = finalCoordinates.h /2
    g.c.translate(newX + halfImageWidth, newY + halfImageHeight)
    g.c.rotate(theta)
    var player = new Image()
    player.src = g.Tiles[newState.type]
    c.drawImage(
      player,
      -halfImageHeight,
      -halfImageWidth,
      halfImageWidth * 2,
      halfImageHeight * 2)
    g.c.restore()
  }
})