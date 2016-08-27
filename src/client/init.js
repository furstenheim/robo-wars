/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
g.store.init()
g.store.prepareGame()
g.store.state.remainingActions = [[{type:g.Actions.types.player, player: 0, subtype: 'forward'}]]
g.store.display()
g.store.state.remainingActions = [[{type:g.Actions.types.player, player: 0, subtype: 'forward'}]]
g.store.display()