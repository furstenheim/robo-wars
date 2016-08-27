(function () {"use strict"
// Use complex to rotate, move on the plane
function Complex (x, y) {
  if (Array.isArray(x)) {
    return Complex(x[0], x[1])
  }
  return {x:x, y:y}
}

// No method overloadin :(
Complex.add = function(c1, c2) {
  return  new Complex(c1.x + c2.x, c1.y + c2.y)
}

Complex.multiply = function (c1, c2) {
  return new Complex(c1.x * c2.x - c1.y * c2.y, c1.x * c2.y + c1.y * c2.x)
}

//This only works 1, -1, i -i we should not need more than that
Complex.getTheta = function (complex) {
  if (complex.x === 0) {
    if (complex.y === 1) {
      return 1 * P
    }
    return 3 * P
  }
  if (complex.x === 1) {
    return 0
  }
  return 2 * P
}
/* Shared variables and global js variables (better here than global so they can be minified */
var GUESS_NO = 0;
var GUESS_ROCK = 1;
var GUESS_PAPER = 2;
var GUESS_SCISSORS = 3;

// global variable
var g = {}
function clone (object){return JSON.parse(JSON.stringify(object))}
// Half PI
var P = Math.PI / 2
if (typeof window !== 'undefined') {(function (){g.Action = {
  init: function (type, params) {
    var action
    switch (type) {
      case 'playerMovement':
        action = g.Action.player(params)
        break
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
}
g.Actions = {
  init: function () {
    return {
      players :[]
    }
  },
  types: {
    player: 'player'
  }
}
g.Game = {
  init: function () {
    return {
      h: 800,
      w: 800,
      sx: 30,
      sy: 30,
      np: 4
    }
  },
  getRealCoordinates: function (game, x,y) {
    return {
      x: x * game.w / game.sx,
      y: y * game.h / game.sy,
      w: game.w / game.sx,
      h: game.h / game.sy
    }
  },
  prepareGame: function (game) {
    var i,j, types = ['floor', 'floor'], type, tiles=[], players=[], distorsionsx = [0, 1/2, 0.99, 1/2],distorsionsy = [ 1/2, 0, 1/2, 0.99], distorsionst = [[1, 0], [0,1], [-1, 0], [0, -1]]
    for (i=0; i<game.np; i++) {
      players.push(g.Player.init(Complex(~~ (distorsionsx[i] * game.sx), ~~ (distorsionsy[i] * game.sy)), 'player', Complex(distorsionst[i])))
    }
    for (i=0; i < game.sx; i++) {
      for (j =0; j < game.sy; j++) {
        type = types[Math.floor(Math.random() * 2)]
        tiles.push(g.Tile.init(i, j, type))
      }
    }
    return {players: players, tiles: tiles}
  }

}

g.Player = {
  init: function (complex, playerType, orientation) {

    var tile = g.PlayerTile.init(complex.x, complex.y, playerType, Complex.getTheta(orientation))
    return {
      t: tile,
      o: orientation,
      c: complex,
      type: playerType
    }
  },
  handleAction(player, action) {
    var subtype = action.subtype
    if (subtype === 'forward') {
      return g.Player.init(Complex.add(player.c, player.o), player.type, player.o)
    }
    if (subtype === 'rotateLeft') {
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: -1}))
    }
    if (subtype === 'rotateRight') {
      // Canvas coordinates grow from top to bottom so orientation is the other sign as usual
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, {x:0, y: 1}))
    }
    if (subtype === 'backwards') {
      return g.Player.init(Complex.add(player.c, Complex.multiply({x:-1, y:0}, player.o)), player.type, player.o)
    }
  }

}
g.PlayerTile = {
  init: function (x, y, playerType, theta) {
    return {
      x: x,
      y: y,
      type: playerType,
      t: theta
    }
  },
  render: function (game, oldState, newState, time) {
    if (!newState) {
      return
    }
    var finalCoordinates = g.Game.getRealCoordinates(game,newState.x, newState.y)
    var newX
    var newY
    var theta
    time = Math.min(Math.max(time, 0), g.store.movement) / g.store.movement
    if (!oldState) {
      newX = finalCoordinates.x
      newY = finalCoordinates.y
      theta = newState.t
    } else {
      var initialCoordinates = g.Game.getRealCoordinates(game, oldState.x, oldState.y)
      newX = (1-time) * initialCoordinates.x + time * finalCoordinates.x
      newY = (1-time) * initialCoordinates.y + time * finalCoordinates.y
      theta = (1- time) * (oldState.t) + time * (newState.t)
    }
    var c = g.c
    g.c.save()
    var halfImageWidth = finalCoordinates.w / 2
    var halfImageHeight = finalCoordinates.h /2
    g.c.translate(newX + halfImageWidth, newY + halfImageHeight)
    g.c.rotate(theta)
    var player = new Image()
    player.src = g.Tiles[newState.type]
    c.drawImage(
      player,
      -halfImageHeight,
      -halfImageWidth,
      halfImageWidth * 2,
      halfImageHeight * 2)
    g.c.restore()
  },
  changeState: function (player, dx, dy, dt) {
    return {
      x: player.x + dx,
      y: player.y + dy,
      type: player.type,
      t: player.t + dt
    }
  }
}
g.Tile = {
  init : function (x, y, tileType) {
    return {
      x: x,
      y: y,
      type: tileType
    }
  },
  render: function (game, oldTile, newTile) {
    if (!newTile){
      return
    }
    var realCoordinates = g.Game.getRealCoordinates(game, newTile.x, newTile.y)
    var c = g.c
    var floor = new Image()
    floor.src = g.Tiles[newTile.type]
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h)
  }
}

g.Tiles = {}
g.Tiles = {
  floor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgSERAr62pHoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAWSURBVAjXY5wRzv2fAQtgYsAB6CEBACasAgXtJRiTAAAAAElFTkSuQmCC',
  player: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgbCQcdTm7r7AAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA5SURBVAjXdc1BCkJBAMPQ17n/mY2L8SMIFroJJV0FQ7bU4HwaqNnusgf+5PiTdZ3hbF65P18/PRDe6EIb/8frDKQAAAAASUVORK5CYII=',
  hole: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgVCicOvc1H+gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAcSURBVAjXY2RgYPjPgAUwMeAA5Ev8RZdgxGU5ANPcAwYrkLWxAAAAAElFTkSuQmCC'
}
"use strict";

(function () {

    var socket, //Socket.IO client
        buttons, //Button elements
        message, //Message element
        score, //Score element
        points = { //Game points
            draw: 0,
            win: 0,
            lose: 0
        };

    /**
     * Disable all button
     */
    function disableButtons() {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute("disabled", "disabled");
        }
    }

    /**
     * Enable all button
     */
    function enableButtons() {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].removeAttribute("disabled ");
        }
    }

    /**
     * Set message text
     * @param {string} text
     */
    function setMessage(text) {
        message.innerHTML = text;
    }

    /**
     * Set score text
     * @param {string} text
     */
    function displayScore(text) {
        score.innerHTML = [
            "<h2>" + text + "</h2>",
            "Won: " + points.win,
            "Lost: " + points.lose,
            "Draw: " + points.draw
        ].join("<br>");
    }

    /**
     * Binde Socket.IO and button events
     */
    function bind() {

        socket.on("start", function () {
            enableButtons();
            setMessage("Round " + (points.win + points.lose + points.draw + 1));
        });

        socket.on("win", function () {
            points.win++;
            displayScore("You win!");
        });

        socket.on("lose", function () {
            points.lose++;
            displayScore("You lose!");
        });

        socket.on("draw", function () {
            points.draw++;
            displayScore("Draw!");
        });

        socket.on("end", function () {
            disableButtons();
            setMessage("Waiting for opponent...");
        });

        socket.on("connect", function () {
            disableButtons();
            setMessage("Waiting for opponent...");
        });

        socket.on("disconnect", function () {
            disableButtons();
            setMessage("Connection lost!");
        });

        socket.on("error", function () {
            disableButtons();
            setMessage("Connection error!");
        });

        for (var i = 0; i < buttons.length; i++) {
            (function (button, guess) {
                button.addEventListener("click", function (e) {
                    disableButtons();
                    socket.emit("guess", guess);
                }, false);
            })(buttons[i], i + 1);
        }
    }

    /**
     * Client module init
     */
    function init() {
        socket = io({ upgrade: false, transports: ["websocket"] });
        buttons = document.getElementsByTagName("button");
        message = document.getElementById("message");
        score = document.getElementById("score");
        disableButtons();
        bind();
    }

    window.addEventListener("load", init, false);

})();

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
  movement: 500,
  // tick depends movement so we need this wizardy
  get tick() { return this.movement / 24 },
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
    var oldState = g.store.oldState, state = g.store.state, newState = clone(state), game = state.game, animating = g.store.animating,
      time = g.store.time, remainingActions = newState.remainingActions, postActions = newState.postActions, nextActions
    // we need to do post Actions
    if (animating) {
      time+= g.store.tick
      // Leave one tick to make sure we draw the end of it
      if (time > g.store.movement + g.store.tick + 1) {
        g.store.time = 0
        g.store.animating = false
      } else {
        g.store.time = time
        return g.store.render(oldState, state, time)
      }
    }

    if (postActions.length) {
      // TODO laser, holes, lives...
    }
    if (!remainingActions.length) {
      return
    }
    nextActions = remainingActions.shift()
    for (let nextAction of nextActions) {
      g.store.handleAction(newState, nextAction)
    }
    g.store.oldState = state
    g.store.state = newState
    g.store.animating = true
    g.store.time = 0
    g.store.render(state, newState, g.store.time)
  },
  handleAction: function (state, action) {
    if (action.type === g.Actions.types.player) {
      state.players[action.player] = g.Player.handleAction(state.players[action.player], action)
    }
  }
}
/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
g.store.init()
g.store.prepareGame()
var interval = setInterval(g.store.display, g.store.tick)
g.store.state.remainingActions = [[
/*  {type:g.Actions.types.player, player: 0, subtype: 'forward'},
  {type:g.Actions.types.player, player: 1, subtype: 'rotateRight'},*/
  {type:g.Actions.types.player, player: 2, subtype: 'rotateLeft'}/*,
  {type:g.Actions.types.player, player: 3, subtype: 'forward'}*/],
  [/*
    {type:g.Actions.types.player, player: 0, subtype: 'forward'},
    {type:g.Actions.types.player, player: 1, subtype: 'backwards'},*/
    {type:g.Actions.types.player, player: 2, subtype: 'rotateLeft'}/*,
    {type:g.Actions.types.player, player: 3, subtype: 'forward'}*/]]
/*
g.store.display()
*/
//g.store.state.remainingActions.concat([])
/*
g.store.display()*/
setTimeout(function (){clearInterval(interval)},10000)})()}
if (typeof window === 'undefined') {(function (){"use strict";

/**
 * User sessions
 * @param {array} users
 */
var users = [];

/**
 * Find opponent for a user
 * @param {User} user
 */
function findOpponent(user) {
	for (var i = 0; i < users.length; i++) {
		if (
			user !== users[i] && 
			users[i].opponent === null
		) {
			new Game(user, users[i]).start();
		}
	}
}

/**
 * Remove user session
 * @param {User} user
 */
function removeUser(user) {
	users.splice(users.indexOf(user), 1);
}

/**
 * Game class
 * @param {User} user1
 * @param {User} user2
 */
function Game(user1, user2) {
	this.user1 = user1;
	this.user2 = user2;
}

/**
 * Start new game
 */
Game.prototype.start = function () {
	this.user1.start(this, this.user2);
	this.user2.start(this, this.user1);
}

/**
 * Is game ended
 * @return {boolean}
 */
Game.prototype.ended = function () {
	return this.user1.guess !== GUESS_NO && this.user2.guess !== GUESS_NO;
}

/**
 * Final score
 */
Game.prototype.score = function () {
	if (
		this.user1.guess === GUESS_ROCK && this.user2.guess === GUESS_SCISSORS ||
		this.user1.guess === GUESS_PAPER && this.user2.guess === GUESS_ROCK ||
		this.user1.guess === GUESS_SCISSORS && this.user2.guess === GUESS_PAPER
	) {
		this.user1.win();
		this.user2.lose();
	} else if (
		this.user2.guess === GUESS_ROCK && this.user1.guess === GUESS_SCISSORS ||
		this.user2.guess === GUESS_PAPER && this.user1.guess === GUESS_ROCK ||
		this.user2.guess === GUESS_SCISSORS && this.user1.guess === GUESS_PAPER
	) {
		this.user2.win();
		this.user1.lose();
	} else {
		this.user1.draw();
		this.user2.draw();
	}
}

/**
 * User session class
 * @param {Socket} socket
 */
function User(socket) {
	this.socket = socket;
	this.game = null;
	this.opponent = null;
	this.guess = GUESS_NO;
}

/**
 * Set guess value
 * @param {number} guess
 */
User.prototype.setGuess = function (guess) {
	if (
		!this.opponent ||
		guess <= GUESS_NO ||
		guess > GUESS_SCISSORS
	) {
		return false;
	}
	this.guess = guess;
	return true;
};

/**
 * Start new game
 * @param {Game} game
 * @param {User} opponent
 */
User.prototype.start = function (game, opponent) {
	this.game = game;
	this.opponent = opponent;
	this.guess = GUESS_NO;
	this.socket.emit("start");		
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
		console.log("Disconnected: " + socket.id);
		removeUser(user);
		if (user.opponent) {
			user.opponent.end();
			findOpponent(user.opponent);
		}
	});

	socket.on("guess", function (guess) {
		console.log("Guess: " + socket.id);
		if (user.setGuess(guess) && user.game.ended()) {
			user.game.score();
			user.game.start();
		}
	});

	console.log("Connected: " + socket.id);
};})()}})()