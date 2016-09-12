
var users = [];

function findOpponent(user) {
	for(let loggedUser of users) {
		// This actually does not work for g.Game.np === 1. But who wants to play alone?
		if (
			user !== loggedUser &&
			// loggedUser counts for the total number
			loggedUser.opponents.length < g.Game.np - 1
			&&
			!loggedUser.started
		) {
			for(let opponent of loggedUser.opponents) {
				user.opponents.push(opponent)
				opponent.opponents.push(user)
				opponent.removeCount()
			}
			loggedUser.opponents.push(user)
			user.opponents.push(loggedUser)
			if (loggedUser.opponents.length === g.Game.np -1) {
				new Game([loggedUser].concat(loggedUser.opponents)).start()
			} else {
				user.startCount()
			}
			return
		}
	}
}


function removeUser(user) {
	if (user.game) {
		user.game.removeUser(user)
	} else {
		for (let opponent of user.opponents) {
			opponent.removeOpponent(user)
		}
	}
	users.splice(users.indexOf(user), 1);

}

function Game(users) {
	this.users = users
}


Game.prototype.start = function () {
	var game = g.Game.init(), users = this.users
	// TODO get type of player from users
	this.state = g.Game.prepareGame(game, this.users.length)
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
	console.log(this.alive)
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
	console.log(user.alive)
	// When reconnecting the same socket is used and this can lead to weird errors
	if (user.alive) {
		user.alive = false
		this.alive = this.alive -1
		this.state.players[user.position].s = g.Player.statuses.dead
		this.users.splice(this.users.indexOf(user), 1);
		var aliveUser
		for (let otherUser of this.users) {
			otherUser.announceDeath(user.position)
			otherUser.removeOpponent(user)
			if (otherUser.alive) aliveUser = otherUser
		}
		if (this.alive === 1) {
			for (let otherUser of this.users) {
				otherUser.announceWinner(aliveUser.position)
			}
		}
	}

}


function User(socket) {
	this.socket = socket
	this.game = null
	this.alive = true
	this.opponents = []
}


User.prototype.start = function (game, position) {
	this.game = game
	this.started = true
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
User.prototype.announceDeath = function () {
	// Not interested for now
}

User.prototype.announceWinner = function (position) {
	console.log('We have a winner')
	this.socket.emit('winner', position)
}
// In case there are not a lot of users we take what we have
User.prototype.startCount = function () {
	var user = this
	this.timeout = setTimeout(function () {
		console.log('start game without enough players')
		new Game([user].concat(user.opponents)).start()
	}, 30000)
}
User.prototype.removeCount = function () {
	console.log('removeCount', this.timeout)
	clearTimeout(this.timeout)
}
User.prototype.sendActions = function (actions) {
	this.socket.emit('actions', actions)
}
User.prototype.removeOpponent = function (user) {
	this.opponents.splice(users.indexOf(user), 1);
}

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
		removeUser(user);
	});
	socket.on("move", function (input) {
		console.log('user move')
		// TODO check input
			user.move(input)
	})

	console.log("Connected: " + socket.id);
};
