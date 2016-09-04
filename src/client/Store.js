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
  },
  acceptInput() {
    if (!g.store.listenInput) {
      g.store.listenInput = g.input.init()
      document.addEventListener('keydown', g.store.handleKeyDown, false)
      return window.requestAnimationFrame(g.store.acceptInput)
    }
    // TODO only send necessary actions
    var remainingTime = g.store.inputTime - new Date() + g.store.listenInput.time
    if (remainingTime < 0) {
      document.removeEventListener('keydown', g.store.handleKeyDown)
      g.store.listenInput = false
      // TODO tell the server we are ready to go
      return
    }

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
    var oldState = g.store.oldState, state = g.store.state, newState = clone(state), game = state.game, animating = g.store.animating,
      elapsedTime = new Date() - g.store.time, remainingActions = newState.remainingActions, postActions = newState.postActions, nextActions
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

    if (postActions.length) {
      // TODO laser, holes, lives...
    }
    if (!remainingActions.length) {
      return
    }
    // Prepare the actions
    nextActions = remainingActions.shift()
    for (let nextAction of nextActions) {
      g.store.handleAction(newState, nextAction)
    }
    g.store.oldState = state
    g.store.state = newState
    g.store.animating = true
    g.store.time = new Date()
    window.requestAnimationFrame(g.store.displayMovement)
    //g.store.render(state, newState, g.store.time)
  },
  handleAction (state, action) {
    if (action.type === g.Actions.types.player) {
      state.players[action.player] = g.Player.handleAction(state.players[action.player], action)
    }
  },
  handleKeyDown (e) {
    var code = e.key || e.code
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(code) !== -1) {
      g.store.state.remainingActions.push([{type: g.Actions.types.player, player: 0, subtype: code}])
    }
    if (g.store.state.remainingActions.length === 1) {
      g.store.displayMovement()
    }
  }
}