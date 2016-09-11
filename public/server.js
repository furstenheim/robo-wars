(function () {"use strict"
/* Shared variables and global js variables (better here than global so they can be minified */
// TODO move this to client so there are no conflicts
//var socket
// global variable
var g = {};
var MOVEMENTS = ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'];
function clone(object) {
  return JSON.parse(JSON.stringify(object));
}
// Half PI
var P = Math.PI / 2;
g.Actions = {
  init: function () {
    return {
      players: []
    };
  },
  types: {
    player: 'player',
    laser: 'laser',
    death: 'death',
    win: 'win'
  }
};
// Use complex to rotate, move on the plane
function Complex(x, y) {
  if (Array.isArray(x)) {
    return Complex(x[0], x[1]);
  }
  return { x: x, y: y };
}

// No method overloadin :(
Complex.add = function (c1, c2) {
  return new Complex(c1.x + c2.x, c1.y + c2.y);
};

Complex.multiply = function (c1, c2) {
  return new Complex(c1.x * c2.x - c1.y * c2.y, c1.x * c2.y + c1.y * c2.x);
};

//This only works 1, -1, i -i we should not need more than that
Complex.getTheta = function (complex) {
  if (complex.x === 0) {
    if (complex.y === 1) {
      return 1 * P;
    }
    return 3 * P;
  }
  if (complex.x === 1) {
    return 0;
  }
  return 2 * P;
};
g.Game = {
  get sx() {
    return 20;
  },
  get sy() {
    return 15;
  },
  init: function () {
    return {
      // TODO move this to client
      h: g.Game.sy * 40,
      w: g.Game.sx * 40,
      sx: g.Game.sx,
      sy: g.Game.sy,
      np: g.Game.np
    };
  },
  get np() {
    return 2;
  },
  prepareGame: function (game) {
    var i,
        j,
        types = ['floor', 'wall'],
        type,
        tiles = [],
        players = [],
        distorsionsx = [0, 1 / 2, 0.99, 1 / 2],
        distorsionsy = [1 / 2, 0, 1 / 2, 0.99],
        distorsionst = [[1, 0], [0, 1], [-1, 0], [0, -1]],
        xs = [],
        ys = [];
    for (i = 0; i < game.np; i++) {
      let x = ~~(distorsionsx[i] * game.sx);
      let y = ~~(distorsionsy[i] * game.sy);
      xs.push(x);
      ys.push(y);
      players.push(g.Player.init(Complex(x, y), 'player' + i, Complex(distorsionst[i]), 1, g.Player.statuses.alive));
    }
    for (i = 0; i < game.sx; i++) {
      for (j = 0; j < game.sy; j++) {
        type = types[Math.random() < 0.85 ? 0 : 1];
        for (let k = 0; k < xs.length; k++) {
          if (Math.abs(i - xs[k]) + Math.abs(j - ys[k]) < 2.5) {
            type = types[0];
          }
        }
        tiles.push(g.Tile.init(i, j, type));
      }
    }
    return { game: game, players: players, tiles: tiles, remainingActions: [], postActions: [] };
  },
  computeMovements(state, movements) {
    // We compute the resulting positions and actions and that is what we pass to the users, as the tiles they already know
    var newState = clone(state),
        processedActions = [],
        players = newState.players,
        laserAction;
    for (let movement of movements) {
      console.log('src/shared/Game.js:41:18:\'computeMovements\',movement', 'computeMovements', movement);
      // ohh my old node without json destructuring
      let position = movement.position;
      // dead are not allowed to move
      if (players[position].s === g.Player.statuses.dead) continue;
      let result = g.Player.handleAction(players[position], movement);
      console.log('src/shared/Game.js:47:18:\'computeMovements\',result', 'computeMovements', result);
      let playerMoved = { player: result.player, position: position };
      // Let's do all the pushing (in case we don't stumble to a wall)
      let playersToMove = [playerMoved];
      let direction = result.direction;
      if (direction) {
        while (playerMoved = g.Game.computePlayerCollision(playerMoved.player, players, direction)) {
          playersToMove.push(playerMoved);
        }
        // Compute if the movement is possible, if not we abort all movements
        if (g.Game.computeMovementObstruction(playersToMove[playersToMove.length - 1].player, newState)) {
          // No movements so the player stays in the same place
          playersToMove = [{ player: players[position], position: position }];
        } else {
          // TODO compute holes
        }
      }
      console.log('src/shared/Game.js:64:18:playersToMove.length', playersToMove.length);
      for (let pl of playersToMove) {
        players[pl.position] = pl.player;
      }
      let postActions = [];
      let originalPlayer = players[position];
      if (laserAction = g.Game.computeLasers(originalPlayer, players, newState)) {
        let weakenedPlayer = g.Player.decreaseHealth(laserAction.oplayer);
        let dieNow = players[laserAction.oposition].s === g.Player.statuses.alive && weakenedPlayer.s === g.Player.statuses.dead;
        players[laserAction.oposition] = weakenedPlayer;
        postActions.push(Object.assign(laserAction, { oplayer: weakenedPlayer }));
        if (dieNow) {
          postActions.push({ type: g.Actions.types.death, oposition: laserAction.oposition });
          let numberOfDeath = 0;
          let alivePlayer = -1;
          for (let i = 0; i < players.length; i++) {
            if (players[i].s === g.Player.statuses.dead) {
              numberOfDeath++;
            } else {
              alivePlayer = i;
            }
          }
          if (numberOfDeath = players.length - 1) postActions.push({ type: g.Actions.types.win, position: alivePlayer });
        }
      }
      // TODO handle shooting
      // TODO add postActions
      processedActions.push({ movements: playersToMove, postActions: postActions });
    }
    return { state: newState, actions: processedActions };
  },
  computePlayerCollision(player, players, direction) {
    for (let i = 0; i < players.length; i++) {
      if (g.Player.collide(player, players[i])) {
        return { position: i, player: g.Player.move(players[i], direction) };
      }
    }
  },
  computeMovementObstruction(player, state) {
    // TODO check for blocks
    var c = player.c,
        game = state.game;
    if (c.x < 0 || c.y < 0 || c.x > game.sx || c.y > game.sy) {
      return true;
    }
    if (state.tiles[game.sy * c.x + c.y].type === 'wall') {
      return true;
    }
  },
  computeLasers(player, players, state) {
    var playerProjection = player;
    // Laser blasts up to four
    for (let i = 0; i < 4; i++) {
      playerProjection = g.Player.handleAction(playerProjection, { subtype: 'ArrowUp' }).player;
      // Nothing to shoot
      if (g.Game.computeMovementObstruction(playerProjection, state)) return false;
      for (let i = 0; i < players.length; i++) {
        if (g.Player.collide(playerProjection, players[i])) {
          console.log('src/shared/Game.js:122:22:\'colliding\',playerProjection,i,players[i]', 'colliding', playerProjection, i, players[i]);
          return { type: 'laser', player: player, oplayer: players[i], oposition: i };
        }
      }
    }
  }
};
g.Player = {
  init: function (complex, playerType, orientation, health, status) {

    var tile = g.PlayerTile.init(complex.x, complex.y, playerType, Complex.getTheta(orientation));
    return {
      t: tile,
      o: orientation,
      c: complex,
      type: playerType,
      h: health,
      s: status
    };
  },
  handleAction(player, action) {
    var subtype = action.subtype;
    if (subtype === 'ArrowUp') {
      // Need movement in case we push another player
      return { player: g.Player.move(player, player.o), direction: player.o };
    }
    if (subtype === 'ArrowLeft') {
      return { player: g.Player.init(player.c, player.type, Complex.multiply(player.o, { x: 0, y: -1 }), player.h, player.s) };
    }
    if (subtype === 'ArrowRight') {
      // Canvas coordinates grow from top to bottom so orientation is the other sign as usual
      return { player: g.Player.init(player.c, player.type, Complex.multiply(player.o, { x: 0, y: 1 }), player.h, player.s) };
    }
    if (subtype === 'ArrowDown') {
      return { player: g.Player.move(player, Complex.multiply({ x: -1, y: 0 }, player.o)), direction: Complex.multiply({ x: -1, y: 0 }, player.o) };
    }
  },
  move(player, vector) {
    return g.Player.init(Complex.add(player.c, vector), player.type, player.o, player.h, player.s);
  },
  collide(pl1, pl2) {
    return pl1.c.x === pl2.c.x && pl1.c.y === pl2.c.y;
  },
  decreaseHealth(player) {
    var newHealth = player.h * 0.93;
    return g.Player.init(player.c, player.type, player.o, newHealth, newHealth < 0.5 ? g.Player.statuses.dead : g.Player.statuses.alive);
  },
  statuses: {
    dead: 'dead',
    alive: 'alive'
  }
};
g.PlayerTile = {
  init: function (x, y, playerType, theta) {
    return {
      x: x,
      y: y,
      type: playerType,
      t: theta
    };
  },
  changeState: function (player, dx, dy, dt) {
    return {
      x: player.x + dx,
      y: player.y + dy,
      type: player.type,
      t: player.t + dt
    };
  }
};
g.store = {};
g.Tile = {
  init: function (x, y, tileType) {
    return {
      x: x,
      y: y,
      type: tileType
    };
  },
  render: function (game, oldTile, newTile) {
    if (!newTile) {
      return;
    }
    if (oldTile) {
      // Already drawn
      return;
    }
    var realCoordinates = g.Game.getRealCoordinates(game, newTile.x, newTile.y);
    var c = g.bgc;
    var floor = new Image();
    floor.src = g.Tiles[newTile.type];
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h);
  }
};
if (typeof window !== 'undefined') {(function (){var socket;
var getById = document.getElementById.bind(document);
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
Object.assign(g.Game, {
  // No need for this on the server
  getRealCoordinates: function (game, x, y) {
    return {
      x: x * game.w / game.sx,
      y: y * game.h / game.sy,
      w: game.w / game.sx,
      h: game.h / game.sy
    };
  }
});
g.Input = {
  init: function () {
    return {
      time: new Date(),
      actions: []
    };
  },
  size: {
    w: 800,
    h: 40
  },
  max: 4,
  renderRobot: function (state) {
    var h = g.Input.size.h,
        w = g.Input.size.w,
        c = g.ic,
        position = state.position,
        img = g.images['player' + position];
    c.clearRect(0, h, w, w);
    c.drawImage(img, 0, h, h * g.Input.max, h * g.Input.max);
  },
  render: function (input, fraction) {
    var h = g.Input.size.h,
        w = g.Input.size.w,
        c = g.ic,
        d = ~~(h / 30),
        imgLoaded = 0,
        cx = h * g.Input.max + h / 2,
        cy = h / 2;
    // For some reason circle does not disappear without c.beginPath?¿
    c.beginPath();
    c.clearRect(0, 0, w, h);
    for (let i = 0; i < g.Input.max; i++) {
      c.strokeStyle = 'black';
      c.strokeRect(h * i + d, d, h - 2 * d, h - 2 * d);
      let action = input.actions[i];
      if (action) {
        c.save();
        let image = g.images['arrow'];
        c.translate(h * i + h / 2, h / 2);
        c.rotate(-g.Input.subtypeToTheta(action.subtype));
        c.drawImage(image, -(h - 2 * d) / 2, -(h - 2 * d) / 2, h - 2 * d, h - 2 * d);
        c.restore();
      }
    }
    fraction = Math.max(Math.min(fraction, 1), 0);

    if (fraction > 0) {
      c.beginPath();
      c.fillStyle = 'red';
      c.moveTo(cx, cy);
      c.arc(cx, cy, cy - 2 * d, 0, fraction * 4 * P);
      c.lineTo(cx, cy);
      c.closePath();
      c.fill();
    }
    c.stroke();
  },
  clear: function () {
    var h = g.Input.size.h,
        w = g.Input.size.w,
        c = g.ic;
    c.clearRect(0, 0, w, h);
  },
  subtypeToTheta(subtype) {
    var subtypes = MOVEMENTS,
        i = subtypes.indexOf(subtype);
    if (i > -1) {
      return P * i;
    }
  },
  // health goes from 0 to 1 1 is healthy, remainingTime so we can prioritize
  acceptAction(input, code, health, remainingTime) {
    var right = Math.random() < health,
        newInput = clone(input);
    if (input.actions.length >= g.Input.max) {
      return input;
    }
    if (right) {
      newInput.actions.push({ type: g.Actions.types.player, subtype: code, remainingTime: remainingTime });
    } else {
      newInput.actions.push({ type: g.Actions.types.player, subtype: MOVEMENTS[~~(Math.random() * 4)], remainingTime: remainingTime });
    }
    return newInput;
  },
  // Fill input to the total
  fillInput(input) {
    var newInput = clone(input),
        i;
    for (i = input.actions.length; i < g.Input.max; i++) {
      newInput.actions.push({ type: g.Actions.types.player, subtype: MOVEMENTS[~~(Math.random() * 4)], remainingTime: 0 });
    }
    return newInput;
  }
};

Object.assign(g.PlayerTile, {
  render: function (game, oldState, newState, time) {
    if (!newState) {
      return;
    }
    var finalCoordinates = g.Game.getRealCoordinates(game, newState.x, newState.y);
    var newX, newY, theta, oldT;
    time = Math.min(Math.max(time, 0), g.store.movement) / g.store.movement;
    if (!oldState) {
      newX = finalCoordinates.x;
      newY = finalCoordinates.y;
      theta = newState.t;
    } else {
      var initialCoordinates = g.Game.getRealCoordinates(game, oldState.x, oldState.y);
      newX = (1 - time) * initialCoordinates.x + time * finalCoordinates.x;
      newY = (1 - time) * initialCoordinates.y + time * finalCoordinates.y;
      oldT = Math.abs(oldState.t - newState.t) < 2 * P ? oldState.t : Math.abs(oldState.t - 4 * P - newState.t) < Math.abs(oldState.t + 4 * P - newState.t) ? oldState.t - 4 * P : oldState.t + 4 * P;
      //if (oldT !== oldState.t) debugger
      theta = (1 - time) * oldT + time * newState.t;
    }
    var c = g.c;
    g.c.save();
    var halfImageWidth = finalCoordinates.w / 2;
    var halfImageHeight = finalCoordinates.h / 2;
    g.c.translate(newX + halfImageWidth, newY + halfImageHeight);
    g.c.rotate(theta);
    var player = g.images[newState.type];
    c.drawImage(player, -halfImageHeight, -halfImageWidth, halfImageWidth * 2, halfImageHeight * 2);
    g.c.restore();
  }
});
g.store = {
  init: function () {
    return {
      game: g.Game.init(),
      tiles: [],
      players: [],
      remainingActions: [],
      postActions: []
    };
  },
  movement: 1000,
  inputActions: 4,
  inputTime: 2000,
  listenInput: false,
  // tick depends movement so we need this wizardy
  get tick() {
    return this.movement / 60;
  },
  startGame(state) {
    var oldState = g.store.state;
    g.store.oldState = oldState;
    g.store.state = state;
    g.store.render(oldState, state);
    g.Input.renderRobot(state);
    g.store.renderHealth(state.players);
    g.message.textContent = null;
    g.store.acceptInput();
  },
  acceptInput() {
    if (!g.store.input) {
      if (!g.store.dead && !g.store.won) {
        g.store.input = g.Input.init();
        document.addEventListener('keydown', g.store.handleKeyDown, false);
        return window.requestAnimationFrame(g.store.acceptInput);
      }
    }
    // TODO only send necessary actions
    var remainingTime = (g.store.inputTime - (new Date() - new Date(g.store.input.time))) / g.store.inputTime;
    if (remainingTime < 0) {
      document.removeEventListener('keydown', g.store.handleKeyDown);
      console.log('src/client/Store.js:39:18:\'Remaining time is over\'', 'Remaining time is over');
      g.store.input = g.Input.fillInput(g.store.input);
      g.Input.render(g.store.input, -1);
      g.store.sendMovements(g.store.input.actions);
      g.store.input = false;
      // TODO tell the server we are ready to go
      return;
    }
    g.Input.render(g.store.input, remainingTime);
    window.requestAnimationFrame(g.store.acceptInput);
  },
  acceptActions(actions) {
    var state = g.store.state,
        newState = clone(state);
    newState.remainingActions = actions;
    g.store.oldState = state;
    g.store.state = newState;
    g.store.displayMovement();
  },
  prepareGame() {
    var state = g.store.state,
        newState = clone(state),
        game = state.game;
    var result = g.Game.prepareGame(game);
    newState.tiles = result.tiles;
    newState.players = result.players;
    g.store.state = newState;
    g.store.oldState = state;
    g.store.render(state, newState);
  },
  sendMovements(actions) {
    console.log('src/client/Store.js:68:16:\'Moving\',actions,{actions: g.store.input.actions}', 'Moving', actions, { actions: g.store.input.actions });
    socket.emit('move', actions);
  },
  render(oldState, newState, time) {
    g.c.clearRect(0, 0, newState.game.w, newState.game.h);
    var oldTiles = oldState.tiles;
    var newTiles = newState.tiles;
    var game = newState.game;
    var i;
    // First go the tiles
    for (i = 0; i < Math.max(oldTiles.length, newTiles.length); i++) {
      g.Tile.render(game, oldTiles[i], newTiles[i]);
    }
    var oldPlayers = oldState.players;
    var newPlayers = newState.players;
    for (i = 0; i < Math.max(oldPlayers.length, newPlayers.length); i++) {
      g.PlayerTile.render(game, (oldPlayers[i] || {}).t, (newPlayers[i] || {}).t, time);
    }
  },
  displayMovement() {
    var oldState = g.store.oldState,
        state = g.store.state,
        game = state.game,
        animating = g.store.animating,
        elapsedTime = new Date() - g.store.time;
    // we need to do post Actions
    if (animating) {
      // Leave one tick to make sure we draw the end of it
      if (elapsedTime > g.store.movement) {
        g.store.animating = false;
      }
      window.requestAnimationFrame(g.store.displayMovement);
      // Render one just time to make sure we render correctly
      return g.store.render(oldState, state, elapsedTime);
    }
    var newState = clone(state),
        remainingActions = newState.remainingActions,
        postActions = newState.postActions,
        nextActions;
    // Handle post actions from previous movement
    if (postActions.length) {
      for (let postAction of postActions) {
        console.log('src/client/Store.js:104:20:postAction', postAction);
        g.store.handleAction(newState, postAction);
      }
      newState.postActions = [];

      // TODO laser, holes, lives...
    } else {
      // Handle actions
      if (!remainingActions.length) {
        g.store.acceptInput();
        return;
      }
      // Prepare the actions
      nextActions = remainingActions.shift();
      for (let movement of nextActions.movements) {
        Object.assign(newState.players[movement.position], movement.player);
      }
      newState.postActions = nextActions.postActions;
    }
    // TODO handle postactions
    g.store.oldState = state;
    g.store.state = newState;
    g.store.animating = true;
    g.store.time = new Date();
    window.requestAnimationFrame(g.store.displayMovement);
    //g.store.render(state, newState, g.store.time)
  },
  handleAction(state, action) {
    if (action.type === g.Actions.types.laser) {

      Object.assign(state.players[action.oposition], action.oplayer);
      console.log('src/client/Store.js:135:18:action.oplayer.h,state.players[action.oposition].h', action.oplayer.h, state.players[action.oposition].h);
      g.store.renderHealth(state.players);
      return;
    }
    if (action.type === g.Actions.types.death) {
      console.log('src/client/Store.js:140:18:\'death\'', 'death');
      g.store.handleDeath(action.oposition, state);
      return;
    }
    if (action.type === g.Actions.types.win) {
      g.store.handleWin(action.position, state);
    }
  },
  handleKeyDown(e) {
    var code = e.key || e.code,
        input = g.store.input,
        newInput = clone(input),
        remainingTime = (g.store.inputTime - (new Date() - new Date(g.store.input.time))) / g.store.inputTime;
    if (MOVEMENTS.indexOf(code) !== -1) {
      // TOOD pass health
      g.store.input = g.Input.acceptAction(input, code, 1, remainingTime);
    }
  },
  renderHealth(players) {
    var health = [],
        player;
    for (let i = 0; i < players.length; i++) {
      player = players[i];
      health.push(`Player ${ i } health: ${ parseInt(2 * (Math.max(player.h, 0.5) - 0.5) * 100) } %`);
    }
    g.health.textContent = health.join(' ');
  },
  handleDeath(position, state) {
    if (position === state.position) {
      console.log('src/client/Store.js:165:18:\'You are dead\'', 'You are dead');
      g.store.dead = true;
      g.message.textContent = 'You are dead';
    } else {
      console.log('src/client/Store.js:169:18:`Player ${position} is dead`', `Player ${ position } is dead`);
    }
  },
  handleWin(position, state) {
    if (position === state.position) {
      g.store.won = true;
      g.message.textContent = 'You WON';
      console.log('src/client/Store.js:176:18:\'You won\'', 'You won');
    }
  }
};
Object.assign(g.Tile, { render: function (game, oldTile, newTile) {
    if (!newTile) {
      return;
    }
    if (oldTile) {
      // Already drawn
      return;
    }
    var realCoordinates = g.Game.getRealCoordinates(game, newTile.x, newTile.y);
    var c = g.bgc;
    var floor = g.images[newTile.type];
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h);
  }
});
g.Tiles = {};
g.Tiles = {
  floor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCTo0C01FEQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABQSURBVBjTpVBBDgAgCCr/Wr0pe0r1tw6txhJPcVNAHHGOHg6a1pRLMIgo8iAe0bS+IlxtYK7YlTWQOGsQ7w80COXI4/c+Lem7J8zlPeGYclkeyCQcEkGchAAAAABJRU5ErkJggg==',
  wall: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLChMusC+d2QAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABLSURBVBjTY7S1tWUgBJjQ+GqqqjgVweVu3b6NqY2RHOvQDIYwmLA6BW4phMEEUQEXRTMDYRKyY9HMQHcTXCtmKBDtO2TrsRpGlEkAsuEcUVru56YAAAAASUVORK5CYII=',
  player0: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wAAAAAzJ3zzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCykj6vVVKgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACrSURBVEjHY8yOD2WgJWBioDEY+hawwBhTF67+T6lh2fGhjMMviBjRk+mNj1v+MzAwMGio/GS4cYcdqyZkOQ1+H0ayfIBuuIbKT5xyZFmAbCA+35BtAbKB5BqOkkzx+QTZAhh/74bvDAwMDAx7GRDJm6xkiu56Un3DQqzL0YFzACflqQgW0RoqP1EinWoZDeaDG3fYMeKBpjmZlHiguLCjOBUNvcJutMqkuwUAklJFrPsWPH0AAAAASUVORK5CYII=',
  player1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QAawBfAFVrQDHVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCyYCIQRZuwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACwSURBVEjHY7S3tWGgJWBioDFgQWL/x6OOEYsYUerp6gOCQEdJEs6+cu85yRYwMjAwMHz69PE/ruA4duEjToP4+PgZCfrg06ePZAfFp08fGawMNDB8yEKqQciG4Il0+kUyVS2YsnA1w5SFqwcuo1EMcuJDR4OIuCBCzuWDzwfHLtzAlQEZaRpExy7cYODj4x/gCgebC6AFGSOW0vM/MWURUUGEy+JBVyczkqiXcVD4AAAU0DA4nLYhlQAAAABJRU5ErkJggg==',
  arrow: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCiA4sJBNuAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABXSURBVDjLxZNBDoBACAPb/f+fZw+6hsNqBBLl3iGlxYA6M9ScdwAb2dQB4AtUtnADqd0gQIxUjwHcA3wX46OFTBNjAmcqo7o5b2FtD+JclTfiowd/f+METjMlD4iLdKcAAAAASUVORK5CYII='
};
/* init variables here */
g.canvas = document.getElementById('c');
g.c = g.canvas.getContext('2d');
g.bgcanvas = document.getElementById('bgc');
g.bgc = g.bgcanvas.getContext('2d');
g.icanvas = document.getElementById('ic');
g.ic = g.icanvas.getContext('2d');
g.health = getById('health');
g.message = getById('message');
g.images = {};
// Nasty trick to cache imgs and make loading sync
for (let img in g.Tiles) {
  let image = new Image();
  image.src = g.Tiles[img];
  g.images[img] = image;
}
/**
 * Bind Socket.IO and button events
 */
function bind() {

  socket.on('actions', function (actions) {
    g.store.acceptActions(actions);
    console.log('src/client/init.js:24:16:actions', actions);
  });
  socket.on('start', function (state) {
    console.log('src/client/init.js:27:16:\'starting\'', 'starting');
    g.store.startGame(JSON.parse(state));
    //console.log(state, position)
  });
  socket.on("end", function () {
    console.log('src/client/init.js:32:16:"Waiting for opponent..."', "Waiting for opponent...");
  });

  socket.on("connect", function () {
    console.log('src/client/init.js:36:16:"Waiting for opponent..."', "Waiting for opponent...");
  });

  socket.on("disconnect", function () {
    console.error('src/client/init.js:40:18:"Connection lost!"', "Connection lost!");
  });

  socket.on("error", function () {
    console.error('src/client/init.js:44:18:"Connection error!"', "Connection error!");
  });
}
function init() {
  socket = io({ upgrade: false, transports: ["websocket"] });
  bind();
}

window.addEventListener("load", init, false);

g.store.state = g.store.init();
//setTimeout(function () {g.Input.render(g.Input.init())}, 10)
//g.store.acceptInput()
/*g.store.init()
g.store.prepareGame()
//var interval = setInterval(g.store.display, g.store.tick)
g.store.state.remainingActions = [[
  {type:g.Actions.types.player, player: 0, subtype: 'ArrowUp'},
  {type:g.Actions.types.player, player: 1, subtype: 'ArrowRight'},
  {type:g.Actions.types.player, player: 2, subtype: 'ArrowLeft'},
  {type:g.Actions.types.player, player: 3, subtype: 'ArrowUp'}],
  [
    {type:g.Actions.types.player, player: 0, subtype: 'ArrowUp'},
    {type:g.Actions.types.player, player: 1, subtype: 'ArrowUp'},
    {type:g.Actions.types.player, player: 2, subtype: 'ArrowLeft'},
    {type:g.Actions.types.player, player: 3, subtype: 'ArrowUp'}]]
g.store.displayMovement()*/})()}
if (typeof window === 'undefined') {(function (){/**
 * User sessions
 * @param {array} users
 */
var users = [];

/**
 * Find opponents for a user
 * @param {User} user
 */
function findOpponent(user) {
	for (let loggedUser of users) {
		// This actually does not work for g.Game.np === 1. But who wants to play alone?
		if (user !== loggedUser &&
		// loggedUser counts for the total number
		loggedUser.opponents.length < g.Game.np - 1) {
			for (let opponent of loggedUser.opponents) {
				user.opponents.push(opponent);
				opponent.opponents.push(user);
			}
			loggedUser.opponents.push(user);
			user.opponents.push(loggedUser);
			if (loggedUser.opponents.length === g.Game.np - 1) {
				new Game([loggedUser].concat(loggedUser.opponents)).start();
			}
			return;
		}
	}
}

/**
 * Remove user session
 * @param {User} user
 */
function removeUser(user) {
	if (user.game) user.game.removeUser(user);
	users.splice(users.indexOf(user), 1);
}

function Game(users) {
	this.users = users;
}
/**
 * Start new game
 */
Game.prototype.start = function () {
	var game = g.Game.init(),
	    users = this.users;
	// TODO get type of player from users
	this.state = g.Game.prepareGame(game);
	this.alive = this.users.length;
	this.played = 0;
	this.movements = [];
	for (let i = 0; i < users.length; i++) {
		users[i].start(this, i);
	}
};

Game.prototype.acceptMove = function (actions, position) {
	this.played = this.played + 1;
	for (let action of actions) {
		this.movements.push(Object.assign({ position: position }, action));
	}
	if (this.played === this.alive) {
		this.played = 0;
		console.log('src/server/server.js:67:14:this.movements', this.movements);
		this.move();
	}
};

Game.prototype.move = function () {
	var movements = this.movements.sort((m1, m2) => m2.remainingTime - m1.remainingTime);
	console.log('src/server/server.js:74:13:\'Start moving\'', 'Start moving');
	var stateAndActions = g.Game.computeMovements(this.state, movements);
	this.state = stateAndActions.state;
	this.movements = [];
	for (let user of this.users) {
		if (user.alive && this.state.players[user.position].s === g.Player.statuses.dead) {
			this.alive = this.alive - 1;
			user.die();
		}
		console.log('src/server/server.js:83:14:\'sendActions\'', 'sendActions');
		user.sendActions(stateAndActions.actions);
	}
};
Game.prototype.removeUser = function (user) {};
/**
 * Is game ended
 * @return {boolean}
 */
Game.prototype.ended = function () {
	return this.user1.guess !== GUESS_NO && this.user2.guess !== GUESS_NO;
};

/**
 * User session class
 * @param {Socket} socket
 */
function User(socket) {
	this.socket = socket;
	this.game = null;
	this.alive = true;
	this.opponents = [];
}

/**
 * Start new game
 * @param {Game} game
 * @param {User} opponent
 */
User.prototype.start = function (game, position) {
	this.game = game;
	this.position = position;
	console.log('src/server/server.js:119:13:\'Starting\'', 'Starting');
	this.socket.emit("start", JSON.stringify(Object.assign(game.state, { position: position })));
};

User.prototype.die = function () {
	this.alive = false;
	// TODO, maybe close connection
};
User.prototype.move = function (actions) {
	if (this.alive) this.game.acceptMove(actions, this.position);
};

User.prototype.sendActions = function (actions) {
	this.socket.emit('actions', actions);
};
/**
 * Terminate game
 */
User.prototype.end = function () {
	this.game = null;
	this.opponent = null;
	this.guess = GUESS_NO;
	this.socket.emit("end");
};

/**
 * Trigger win event
 */
User.prototype.win = function () {
	this.socket.emit("win", this.opponent.guess);
};

/**
 * Trigger lose event
 */
User.prototype.lose = function () {
	this.socket.emit("lose", this.opponent.guess);
};

/**
 * Trigger draw event
 */
User.prototype.draw = function () {
	this.socket.emit("draw", this.opponent.guess);
};

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = function (socket) {
	var user = new User(socket);
	users.push(user);
	findOpponent(user);

	socket.on("disconnect", function () {
		console.log('src/server/server.js:175:14:"Disconnected: " + socket.id', "Disconnected: " + socket.id);
		// TODO handle logic in game, specially moves in the middle
		removeUser(user);
		/*if (user.opponent) {
  	user.opponent.end();
  	findOpponent(user.opponent);
  }*/
	});
	socket.on("move", function (input) {
		console.log('src/server/server.js:184:14:\'user move\'', 'user move');
		// TODO check input
		user.move(input);
	});

	console.log('src/server/server.js:189:13:"Connected: " + socket.id', "Connected: " + socket.id);
};})()}})()