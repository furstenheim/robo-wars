g.store = {
  init: function () {
    g.store.state = {
      game: g.Game.init(),
      tiles: [],
      players: [],
      remainingActions:[],
      postActions:[]
    }
  },
  prepareGame : function () {
    var state = g.store.state, newState = clone(state), game = state.game
    var result = g.Game.prepareGame(game)
    newState.tiles = result.tiles
    newState.players = result.players
    g.store.state = newState
    g.store.oldState = state
    g.store.render(state, newState)
  },
  render: function (oldState, newState, time) {
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
  display: function () {
    var state = g.store.state, newState = clone(state), game = state.game. remainingActions = newState.remainingActions, postActions = newState.postActions, nextActions
    // we need to do post Actions
    if (postActions.length) {
      // TODO laser, holes, lives...
    }
    if (!remainingActions.length) {
      return
    }
    nextActions = remainingActions.pop()
    for (let nextAction of nextActions) {
      g.store.handleAction(newState, nextAction)
    }
  },
  handleAction: function (state, action) {
    if (action.type === 'player') {
      state.players[action.player] = g.Player.handleAction(state.players[action.player], action)
    }
  }
}