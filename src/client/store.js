g.store = {
  init: function () {
    function Store() {
      this.state = {
        game: g.Game.init(),
        tiles: [],
        players: []
      }
      this.getState = function() {
        return this.state
      }
      this.setState = function () {

      }
    }
  },
  render: function (oldState, newState, time) {
    var oldTiles = oldState.tiles
    var newTiles = oldState.tiles
    var game = newState.game
    var i
    // First go the tiles
    for (i=0; i<Math.max(oldTiles.length, newTiles.length); i++) {
      g.Tile.render(game, oldTiles[i], newTiles[i])
    }
    var oldPlayers = oldState.players
    var newPlayers = newPlayers.players
    for (i=0; i<Math.max(oldPlayers, newPlayers); i++) {
      g.PlayerTile.render(game, oldPlayers[i], newPlayers[i], time)
    }
  }
}