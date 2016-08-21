g.store = {
  init: function () {
    g.store.state = {
      game: g.Game.init(),
      tiles: [],
      players: []
    }
  },
  prepareGame : function () {
    var i,j,state = g.store.state, types = ['floor', 'hole'], type, newState = clone(state)
    for(i=0; i < state.game.sx; i++) {
      for (j =0; j < state.game.sy; j++) {
        type = types[Math.floor(Math.random() * 2)]
        newState.tiles.push(g.Tile.init(i, j, type))
      }
    }
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
    for (i=0; i<Math.max(oldPlayers, newPlayers); i++) {
      g.PlayerTile.render(game, oldPlayers[i], newPlayers[i], time)
    }
  }
}