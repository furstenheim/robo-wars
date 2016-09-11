g.Laser = {
  render (game, player, oplayer, time) {
    time = Math.min(Math.max(time, 0), g.store.laserMovement) / g.store.laserMovement
    var initialCoordinates = g.Game.getRealCoordinates(game, player.c.x, player.c.y)
    var finalCoordinates = g.Game.getRealCoordinates(game, oplayer.c.x, oplayer.c.y)
    var c = g.lc
    c.clearRect(0,0, game.w, game.h)
    c.strokeStyle = 'red'
    c.beginPath()
    var ix = initialCoordinates.x + game.w / game.sx / 2
    var iy = initialCoordinates.y + game.h / game.sy / 2
    var fx = finalCoordinates.x + game.w / game.sx / 2
    var fy = finalCoordinates.y + game.h / game.sy / 2
    //c.moveTo(ix * (1 - time) + fx * time, iy * (1- time) + fy * time )
    //c.lineTo(ix * (1 - time) + fx * (time + 0.1), iy * (1- time) + fy * (time + 0.1))
    c.moveTo(ix, iy)
    c.lineTo(fx, fy)
    c.stroke()
  },
  showLaser(game, player, oplayer) {
    var animating = g.Laser.animating, elapsedTime = new Date() - g.Laser.time
    if (animating) {
      if (elapsedTime > g.store.laserMovement) {
        g.Laser.animating = false
        var c = g.lc
        c.clearRect(0,0, game.w, game.h)
      } else {
        window.requestAnimationFrame(() => g.Laser.showLaser(game,player,oplayer))
        g.Laser.render(game, player, oplayer, elapsedTime)
      }
      return
    }
    g.Laser.time = new Date()
    g.Laser.animating = true
    window.requestAnimationFrame(() => g.Laser.showLaser(game,player,oplayer))
  }
}
