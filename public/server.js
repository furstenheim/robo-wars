(function () {/* Shared variables and global js variables (better here than global so they can be minified */
var GUESS_NO = 0;
var GUESS_ROCK = 1;
var GUESS_PAPER = 2;
var GUESS_SCISSORS = 3;

// global variable
var g = {}
if (typeof window !== 'undefined') {(function (){g.Game = {
  init: function () {
    return {
      h: 400,
      w: 400,
      sx: 10,
      sy: 10
    }
  },
  getRealCoordinates: function (game, x,y) {
    return {
      x: x * game.w / game.sx,
      y: y * game.h / game.sy,
      w: game.w / game.sx,
      h: game.h / game.sy
    }
  }

}
/*
function () {
    this.height = 400
    this.width = 400
    // number of columns
    this.spanX = 10
    this.spanY = 10

    this.getRealCoordinates = function (x, y) {
      var game = this
      return {
        x: x * game.width / game.spanX,
        y: y * game.height / game.spanY,
        w: game.width / game.spanX,
        h: game.height / game.spanY
      }
    }
    return this
  }
}*/

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
    time = Math.min(Math.max(time, 0), 1)
    var initialCoordinates = g.Game.getRealCoordinates(game, oldState.x, oldState.y)
    var finalCoordinates = g.Game.getRealCoordinates(game,newState.x, newState.y)
    var c = g.c
    var newX = (1-time) * initialCoordinates.x + time * finalCoordinates.x
    var newY = (1-time) * initialCoordinates.y + time * finalCoordinates.y
    g.c.save()
    var halfImageWidth = initialCoordinates.w / 2
    var halfImageHeight = initialCoordinates.h /2
    g.c.translate(newX + halfImageWidth, newY + halfImageHeight)
    g.c.rotate((1- time) * (oldState.t) + time * (newState.t))
    var player = new Image()
    player.src = g.Tiles[oldState.type]
    c.drawImage(
      player,
      -halfImageHeight,
      -halfImageWidth,
      initialCoordinates.w,
      initialCoordinates.h)
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
  render: function (game, tile) {
    var realCoordinates = g.Game.getRealCoordinates(game, tile.x, tile.y)
    var c = g.c
    var floor = new Image()
    floor.src = g.Tiles[tile.type]
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h)
  }
}

g.Tiles = {}
g.Tiles = {
  floor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgSERAr62pHoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAWSURBVAjXY5wRzv2fAQtgYsAB6CEBACasAgXtJRiTAAAAAElFTkSuQmCC',
  player: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgVCCEdbK11zAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA7SURBVAjXVc0xEsAwDALBtSb/f3IuhZ3CNAIhxKqAtTapBXMtrwOq9txS9PzRH2VoBpeBF83+drpOC3zWRRv/dpHcTgAAAABJRU5ErkJggg==',
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

g.dispatcher = {

}
g.store = {
  
}
/* init variables here */
g.canvas = document.getElementById('c')
g.c = g.canvas.getContext('2d')
var tile = g.Tile.init(4,4,'floor')
var game = g.game = new g.Game.init()
g.Tile.render(game, tile)
var player = g.PlayerTile.init(4,4, 'player', 0)
g.PlayerTile.render(game, player, player, 0)

var nextPlayer = g.PlayerTile.changeState(player, 0, 0, Math.PI / 2)
var t = 0
var length = 50
var interval = setInterval( function () {
  t += 1 / length
  if (t > 1) {
    clearInterval(interval)
  }
  g.Tile.render(game, tile)
  g.PlayerTile.render(game, player, nextPlayer, t)
}, 2000 / length)
})()}
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