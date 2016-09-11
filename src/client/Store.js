g.store = {
  init: function () {
    return {
      game: g.Game.init(),
      tiles: [],
      players: [],
      remainingActions:[],
      postActions:[]
    }
  },
  movement: 1000,
  laserMovement: 50,
  inputActions: 4,
  inputTime: 2000,
  listenInput: false,
  // tick depends movement so we need this wizardy
  get tick() { return this.movement / 60 },
  startGame(state) {
    var oldState = g.store.state
    g.store.oldState = oldState
    g.store.state = state
    g.store.render(oldState, state)
    g.Input.renderRobot(state)
    g.store.renderHealth(state.players)
    g.message.textContent = null
    g.store.acceptInput()
  },
  acceptInput() {
    if (g.store.dead || g.won) return
    if (!g.store.input) {
      g.store.input = g.Input.init()
      document.addEventListener('keydown', g.store.handleKeyDown, false)
      return window.requestAnimationFrame(g.store.acceptInput)
    }
    // TODO only send necessary actions
    var remainingTime = (g.store.inputTime - (new Date() - new Date(g.store.input.time))) / g.store.inputTime
    if (remainingTime < 0) {
      document.removeEventListener('keydown', g.store.handleKeyDown)
      console.log('Remaining time is over')
      g.store.input = g.Input.fillInput(g.store.input)
      g.Input.render(g.store.input, -1)
      g.store.sendMovements(g.store.input.actions)
      g.store.input = false
      // TODO tell the server we are ready to go
      return
    }
    g.Input.render(g.store.input, remainingTime)
    window.requestAnimationFrame(g.store.acceptInput)

  },
  acceptActions (actions) {
    var state = g.store.state, newState = clone(state)
    newState.remainingActions = actions
    g.store.oldState = state
    g.store.state = newState
    g.store.displayMovement()
  },
  prepareGame() {
    var state = g.store.state, newState = clone(state), game = state.game
    var result = g.Game.prepareGame(game)
    newState.tiles = result.tiles
    newState.players = result.players
    g.store.state = newState
    g.store.oldState = state
    g.store.render(state, newState)
  },
  sendMovements(actions) {
    console.log('Moving', actions, {actions: g.store.input.actions})
    socket.emit('move', actions)
  },
  render(oldState, newState, time) {
    g.c.clearRect(0,0, newState.game.w, newState.game.h)
    var oldTiles = oldState.tiles
    var newTiles = newState.tiles
    var game = newState.game
    var i
    // First go the tiles
    for (i=0; i<Math.max(oldTiles.length, newTiles.length); i++) {
      g.Tile.render(game, oldTiles[i], newTiles[i])
    }
    var oldPlayers = oldState.players
    var newPlayers = newState.players
    for (i=0; i<Math.max(oldPlayers.length, newPlayers.length); i++) {
      g.PlayerTile.render(game, (oldPlayers[i] || {}).t, (newPlayers[i] || {}).t, time)
    }
  },
  displayMovement() {
    var oldState = g.store.oldState, state = g.store.state, game = state.game, animating = g.store.animating,
      elapsedTime = new Date() - g.store.time
    // we need to do post Actions
    if (animating) {
      // Leave one tick to make sure we draw the end of it
      if (elapsedTime > g.store.movement) {
        g.store.animating = false
      }
      window.requestAnimationFrame(g.store.displayMovement)
      // Render one just time to make sure we render correctly
      return g.store.render(oldState, state, elapsedTime)
    }
    var newState = clone(state), remainingActions = newState.remainingActions, postActions = newState.postActions, nextActions
    // Handle post actions from previous movement
    if (postActions.length) {
      for (let postAction of postActions) {
        console.log(postAction)
        g.store.handleAction(newState, postAction)
      }
      newState.postActions = []

      // TODO laser, holes, lives...
    } else {
      // Handle actions
      if (!remainingActions.length) {
        console.log('acceptInput')
        g.store.acceptInput()
        return
      }
      // Prepare the actions
      nextActions = remainingActions.shift()
      for (let movement of nextActions.movements) {
        Object.assign(newState.players[movement.position], movement.player)
      }
      newState.postActions = nextActions.postActions
    }
     // TODO handle postactions
    g.store.oldState = state
    g.store.state = newState
    g.store.animating = true
    g.store.time = new Date()
    window.requestAnimationFrame(g.store.displayMovement)
    //g.store.render(state, newState, g.store.time)
  },
  handleAction (state, action) {
    if (action.type === g.Actions.types.laser) {
      Object.assign(state.players[action.oposition], action.oplayer)
      console.log(action.oplayer.h, state.players[action.oposition].h)
      g.store.renderHealth(state.players)
      g.Laser.showLaser(state.game, action.player, action.oplayer)
      g.Sounds.play('shoot')
      return
    }
    if (action.type === g.Actions.types.death) {
      console.log('death')
      g.store.handleDeath(action.oposition, state)
      return
    }
    if (action.type === g.Actions.types.win) {
      g.store.handleWin(action.position, state)
    }
  },
  handleKeyDown (e) {
    var code = e.key || e.code, input = g.store.input, newInput = clone(input), remainingTime = (g.store.inputTime - (new Date() - new Date(g.store.input.time))) / g.store.inputTime
    if (MOVEMENTS.indexOf(code) !== -1) {
      // TOOD pass health
      g.store.input = g.Input.acceptAction(input, code, g.store.state.players[g.store.state.position].h, remainingTime)
    }
  },
  renderHealth (players) {
    var health = [], player
    for (let i = 0; i < players.length; i++) {
      player = players[i]
      health.push(`Player ${i} health: ${parseInt( 2*(Math.max(player.h, 0.5) - 0.5) * 100)} %`)
    }
    g.health.textContent = health.join(' ')
  },
  handleDeath (position, state) {
    g.Sounds.play('death')
    if (position === state.position) {
      console.log('You are dead')
      g.store.dead = true
      g.message.textContent = 'You are dead'
    } else {
      console.log(`Player ${position} is dead`)
    }
  },
  handleWin (position, state) {
    if (position === state.position) {
      g.won = true
      g.message.textContent = 'You WON'
      console.log('You won')
    }
  }
}
