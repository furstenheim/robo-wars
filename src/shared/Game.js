g.Game = {
  init: function () {
    return {
      // TODO move this to client
      h:800,
      w: 800,
      sx: 30,
      sy: 30,
      np: g.Game.np
    }
  },
  get np() {return 2},
  prepareGame: function (game) {
    var i,j, types = ['floor', 'floor'], type, tiles=[], players=[],distorsionsx = [0, 0.1, 0.99, 1/2], distorsionsy = [ 1/2, 0.55, 1/2, 0.99] /*distorsionsx = [0, 1/2, 0.99, 1/2], distorsionsy = [ 1/2, 0, 1/2, 0.99]*/, distorsionst = [[1, 0], [0,1], [-1, 0], [0, -1]]
    for (i=0; i<game.np; i++) {
      players.push(g.Player.init(Complex(~~ (distorsionsx[i] * game.sx), ~~ (distorsionsy[i] * game.sy)), 'player', Complex(distorsionst[i]), 1, g.Player.statuses.alive))
    }
    for (i=0; i < game.sx; i++) {
      for (j =0; j < game.sy; j++) {
        type = types[Math.floor(Math.random() * 2)]
        tiles.push(g.Tile.init(i, j, type))
      }
    }
    return {game: game, players: players, tiles: tiles, remainingActions: [], postActions: []}
  },
  computeMovements (state, movements) {
    // We compute the resulting positions and actions and that is what we pass to the users, as the tiles they already know
    var newState = clone(state), processedActions = [], players = newState.players, laserAction
    for (let movement of movements) {
      console.log('computeMovements', movement)
      // ohh my old node without json destructuring
      let position = movement.position
      // dead are not allowed to move
      if (players[position].s === g.Player.statuses.dead) continue
      let result = g.Player.handleAction(players[position], movement)
      console.log('computeMovements', result)
      let playerMoved = {player: result.player, position: position}
      // Let's do all the pushing (in case we don't stumble to a wall)
      let playersToMove = [playerMoved]
      let direction = result.direction
      if (direction) {
        while (playerMoved = g.Game.computePlayerCollision(playerMoved.player, players, direction)) {
          playersToMove.push(playerMoved)
        }
        // Compute if the movement is possible, if not we abort all movements
        if (g.Game.computeMovementObstruction(playersToMove[playersToMove.length -1].player, newState)) {
          // No movements so the player stays in the same place
          playersToMove = [{player: players[position], position: position}]
        } else {
          // TODO compute holes
        }
      }
      console.log(playersToMove.length)
      for (let pl of playersToMove) {
        players[pl.position] = pl.player
      }
      let postActions = []
      let originalPlayer = players[position]
      if (laserAction =  g.Game.computeLasers(originalPlayer, players, newState)) {
        let weakenedPlayer = g.Player.decreaseHealth(laserAction.oplayer)
        let dieNow = false
        if (players[laserAction.oposition].s === g.Player.statuses.alive && weakenedPlayer === g.Player.statuses.dead) dieNow = true
        players[laserAction.oposition] = weakenedPlayer
        postActions.push(laserAction)
        if (dieNow) {
          postActions.push({type: g.Actions.death, oposition: laserAction.oposition})
          let numberOfDeath = 0
          let alivePlayer = -1
          for (let i=0; i < players.length; i++) {
            if (players[i].s === g.Player.statuses.dead) {
              numberOfDeath++
            } else {
              alivePlayer = i
            }
          }
          if (numberOfDeath = players.length -1) postActions.push({type: g.Actions.types.win, position: alivePlayer})
        }

      }
      // TODO handle shooting
      // TODO add postActions
      processedActions.push({movements: playersToMove, postActions: postActions})
    }
    return {state: newState, actions: processedActions}
  },
  computePlayerCollision (player, players, direction) {
    for (let i = 0; i< players.length; i++) {
      if (g.Player.collide(player, players[i])) {
        return {position: i, player: g.Player.move(players[i], direction)}
      }
    }
  },
  computeMovementObstruction (player, state) {
    // TODO check for blocks
    var c = player.c, game = state.game
    if (c.x < 0 || c.y < 0 || c.x > game.sx || c.y > game.sy) {
      return true
    }
  },
  computeLasers (player, players, state) {
    var playerProjection = player
    // Laser blasts up to four
    for (let i = 0; i < 4; i++) {
      playerProjection = g.Player.handleAction(playerProjection, {subtype: 'ArrowUp'}).player
      // Nothing to shoot
      if (g.Game.computeMovementObstruction(playerProjection, state)) return false
      for (let i = 0; i < players.length; i++) {
        if (g.Player.collide(playerProjection, players[i])) {
          console.log('colliding', playerProjection, i, players[i])
          return {type: 'laser', player: player, oplayer: players[i], oposition: i}
        }
      }
    }
  }
}