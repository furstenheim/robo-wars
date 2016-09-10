/*
g.Action = {
  init: function (type, params) {
    var action
    switch (type) {
      case 'playerMovement':
        action = g.Action.player(params)
        break
      case 'laser':

      default:
        action = {}
        break
    }
    return Object.assign(action, {type: type})
  },
  playerMovement: function (params) {
    return {
      subtype: params.type,
      player: params.player
    }
  }
}*/
