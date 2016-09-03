/**
 * User sessions
 * @param {array} users
 */
var users = [];

/**
 * Find opponents for a user
 * @param {User} user
 */
function findOpponent(user) {
	for(let loggedUser of users) {
		// This actually does not work for g.Game.np === 1. But who wants to play alone?
		if (
			user !== loggedUser &&
			// loggedUser counts for the total number
			loggedUser.opponents.length < g.Game.np - 1
		) {
			for(let opponent of loggedUser.opponents) {
				user.opponents.push(opponent)
				opponent.opponents.push(user)
			}
			loggedUser.opponents.push(user)
			user.opponents.push(loggedUser)
			if (loggedUser.opponents.length === g.Game.np -1) {
				new Game([loggedUser].concat(loggedUser.opponents)).start()
			}
			return
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

function Game(users) {
	this.users = users
}
/**
 * Start new game
 */
Game.prototype.start = function () {
	var game = g.Game.init()
	// TODO get type of player from users
	this.state = g.Game.prepareGame(game)

	for (let i = 0; i<users.length; i++) {
		users[i].start(this, i)
	}
}

/**
 * Is game ended
 * @return {boolean}
 */
Game.prototype.ended = function () {
	return this.user1.guess !== GUESS_NO && this.user2.guess !== GUESS_NO;
}


/**
 * User session class
 * @param {Socket} socket
 */
function User(socket) {
	this.socket = socket
	this.game = null
	this.opponents = []
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
User.prototype.start = function (game, position) {
	this.game = game
	this.position = position
	console.log('starting', game.state)
	this.socket.emit("start", JSON.stringify(game.state))
}

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
	var user = new User(socket)
	users.push(user);
	findOpponent(user);

	socket.on("disconnect", function () {
		console.log("Disconnected: " + socket.id);
		removeUser(user);
		/*if (user.opponent) {
			user.opponent.end();
			findOpponent(user.opponent);
		}*/
	});

/*	socket.on("guess", function (guess) {
		console.log("Guess: " + socket.id);
		if (user.setGuess(guess) && user.game.ended()) {
			user.game.score();
			user.game.start();
		}
	});*/

	console.log("Connected: " + socket.id);
};