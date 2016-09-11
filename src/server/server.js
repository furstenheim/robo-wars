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
	if (user.game) user.game.removeUser(user)
	users.splice(users.indexOf(user), 1);
}

function Game(users) {
	this.users = users
}
/**
 * Start new game
 */
Game.prototype.start = function () {
	var game = g.Game.init(), users = this.users
	// TODO get type of player from users
	this.state = g.Game.prepareGame(game)
	this.alive = this.users.length
	this.played = 0
	this.movements = []
	for (let i = 0; i<users.length; i++) {
		users[i].start(this, i)
	}
}

Game.prototype.acceptMove = function (actions, position) {
	this.played = this.played + 1
	for (let action of actions) {
		this.movements.push(Object.assign({position: position}, action))
	}
	if (this.played === this.alive) {
		this.played = 0
		console.log(this.movements)
		this.move()
	}
}

Game.prototype.move = function () {
	var movements = this.movements.sort((m1, m2) => m2.remainingTime - m1.remainingTime)
	console.log('Start moving')
	var stateAndActions = g.Game.computeMovements(this.state, movements)
	this.state = stateAndActions.state
	this.movements = []
	for (let user of this.users) {
		if (user.alive && this.state.players[user.position].s === g.Player.statuses.dead) {
			this.alive = this.alive -1
			user.die()
		}
		console.log('sendActions')
		user.sendActions(stateAndActions.actions)
	}
}
Game.prototype.removeUser = function(user) {

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
	this.alive = true
	this.opponents = []
}


/**
 * Start new game
 * @param {Game} game
 * @param {User} opponent
 */
User.prototype.start = function (game, position) {
	this.game = game
	this.position = position
	console.log('Starting')
	this.socket.emit("start", JSON.stringify(Object.assign(game.state, {position: position})))
}

User.prototype.die = function () {
	this.alive = false
	// TODO, maybe close connection
}
User.prototype.move = function (actions) {
	if (this.alive) this.game.acceptMove(actions, this.position)
}

User.prototype.sendActions = function (actions) {
	this.socket.emit('actions', actions)
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
	findOpponent(user)

	socket.on("disconnect", function () {
		console.log("Disconnected: " + socket.id);
		// TODO handle logic in game, specially moves in the middle
		removeUser(user);
		/*if (user.opponent) {
			user.opponent.end();
			findOpponent(user.opponent);
		}*/
	});
	socket.on("move", function (input) {
		console.log('user move')
		// TODO check input
			user.move(input)
	})

	console.log("Connected: " + socket.id);
};