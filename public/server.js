(function () {"use strict"
/* Shared variables and global js variables (better here than global so they can be minified */
var socket;
// global variable
var g = {};
function clone(object) {
  return JSON.parse(JSON.stringify(object));
}
// Half PI
var P = Math.PI / 2;
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
  init: function () {
    return {
      // TODO move this to client
      h: 800,
      w: 800,
      sx: 30,
      sy: 30,
      np: g.Game.np
    };
  },
  get np() {
    return 2;
  },
  prepareGame: function (game) {
    var i,
        j,
        types = ['floor', 'floor'],
        type,
        tiles = [],
        players = [],
        distorsionsx = [0, 1 / 2, 0.99, 1 / 2],
        distorsionsy = [1 / 2, 0, 1 / 2, 0.99],
        distorsionst = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (i = 0; i < game.np; i++) {
      players.push(g.Player.init(Complex(~~(distorsionsx[i] * game.sx), ~~(distorsionsy[i] * game.sy)), 'player', Complex(distorsionst[i])));
    }
    for (i = 0; i < game.sx; i++) {
      for (j = 0; j < game.sy; j++) {
        type = types[Math.floor(Math.random() * 2)];
        tiles.push(g.Tile.init(i, j, type));
      }
    }
    return { players: players, tiles: tiles };
  }
};
g.Player = {
  init: function (complex, playerType, orientation) {

    var tile = g.PlayerTile.init(complex.x, complex.y, playerType, Complex.getTheta(orientation));
    return {
      t: tile,
      o: orientation,
      c: complex,
      type: playerType
    };
  },
  handleAction(player, action) {
    var subtype = action.subtype;
    if (subtype === 'ArrowUp') {
      return g.Player.init(Complex.add(player.c, player.o), player.type, player.o);
    }
    if (subtype === 'ArrowLeft') {
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, { x: 0, y: -1 }));
    }
    if (subtype === 'ArrowRight') {
      // Canvas coordinates grow from top to bottom so orientation is the other sign as usual
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, { x: 0, y: 1 }));
    }
    if (subtype === 'ArrowDown') {
      return g.Player.init(Complex.add(player.c, Complex.multiply({ x: -1, y: 0 }, player.o)), player.type, player.o);
    }
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
if (typeof window !== 'undefined') {(function (){g.Action = {
  init: function (type, params) {
    var action;
    switch (type) {
      case 'playerMovement':
        action = g.Action.player(params);
        break;
      default:
        action = {};
        break;
    }
    return Object.assign(action, { type: type });
  },
  playerMovement: function (params) {
    return {
      subtype: params.type,
      player: params.player
    };
  }
};
g.Actions = {
  init: function () {
    return {
      players: []
    };
  },
  types: {
    player: 'player'
  }
};
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
g.Player = {
  init: function (complex, playerType, orientation) {

    var tile = g.PlayerTile.init(complex.x, complex.y, playerType, Complex.getTheta(orientation));
    return {
      t: tile,
      o: orientation,
      c: complex,
      type: playerType
    };
  },
  handleAction(player, action) {
    var subtype = action.subtype;
    if (subtype === 'ArrowUp') {
      return g.Player.init(Complex.add(player.c, player.o), player.type, player.o);
    }
    if (subtype === 'ArrowLeft') {
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, { x: 0, y: -1 }));
    }
    if (subtype === 'ArrowRight') {
      // Canvas coordinates grow from top to bottom so orientation is the other sign as usual
      return g.Player.init(player.c, player.type, Complex.multiply(player.o, { x: 0, y: 1 }));
    }
    if (subtype === 'ArrowDown') {
      return g.Player.init(Complex.add(player.c, Complex.multiply({ x: -1, y: 0 }, player.o)), player.type, player.o);
    }
  }

};
Object.assign(g.PlayerTile, {
  render: function (game, oldState, newState, time) {
    if (!newState) {
      return;
    }
    var finalCoordinates = g.Game.getRealCoordinates(game, newState.x, newState.y);
    var newX;
    var newY;
    var theta;
    time = Math.min(Math.max(time, 0), g.store.movement) / g.store.movement;
    if (!oldState) {
      newX = finalCoordinates.x;
      newY = finalCoordinates.y;
      theta = newState.t;
    } else {
      var initialCoordinates = g.Game.getRealCoordinates(game, oldState.x, oldState.y);
      newX = (1 - time) * initialCoordinates.x + time * finalCoordinates.x;
      newY = (1 - time) * initialCoordinates.y + time * finalCoordinates.y;
      theta = (1 - time) * oldState.t + time * newState.t;
    }
    var c = g.c;
    g.c.save();
    var halfImageWidth = finalCoordinates.w / 2;
    var halfImageHeight = finalCoordinates.h / 2;
    g.c.translate(newX + halfImageWidth, newY + halfImageHeight);
    g.c.rotate(theta);
    var player = new Image();
    player.src = g.Tiles[newState.type];
    c.drawImage(player, -halfImageHeight, -halfImageWidth, halfImageWidth * 2, halfImageHeight * 2);
    g.c.restore();
  }
});
g.store = {
  init: function () {
    g.store.state = {
      game: g.Game.init(),
      tiles: [],
      players: [],
      remainingActions: [],
      postActions: []
    };
  },
  movement: 1000,
  // tick depends movement so we need this wizardy
  get tick() {
    return this.movement / 60;
  },
  prepareGame: function () {
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
  render: function (oldState, newState, time) {
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
  displayMovement: function () {
    var oldState = g.store.oldState,
        state = g.store.state,
        newState = clone(state),
        game = state.game,
        animating = g.store.animating,
        elapsedTime = new Date() - g.store.time,
        remainingActions = newState.remainingActions,
        postActions = newState.postActions,
        nextActions;
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

    if (postActions.length) {
      // TODO laser, holes, lives...
    }
    if (!remainingActions.length) {
      return;
    }
    // Prepare the actions
    nextActions = remainingActions.shift();
    for (let nextAction of nextActions) {
      g.store.handleAction(newState, nextAction);
    }
    g.store.oldState = state;
    g.store.state = newState;
    g.store.animating = true;
    g.store.time = new Date();
    window.requestAnimationFrame(g.store.displayMovement);
    //g.store.render(state, newState, g.store.time)
  },
  handleAction: function (state, action) {
    if (action.type === g.Actions.types.player) {
      state.players[action.player] = g.Player.handleAction(state.players[action.player], action);
    }
  },
  handleKeyDown: function (e) {
    var code = e.key || e.code;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(code) !== -1) {
      g.store.state.remainingActions.push([{ type: g.Actions.types.player, player: 0, subtype: code }]);
    }
    if (g.store.state.remainingActions.length === 1) {
      g.store.displayMovement();
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
    var floor = new Image();
    floor.src = g.Tiles[newTile.type];
    c.drawImage(floor, realCoordinates.x, realCoordinates.y, realCoordinates.w, realCoordinates.h);
  }
});
g.Tiles = {};
g.Tiles = {
  floor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgSERAr62pHoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAWSURBVAjXY5wRzv2fAQtgYsAB6CEBACasAgXtJRiTAAAAAElFTkSuQmCC',
  player: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgbCQcdTm7r7AAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA5SURBVAjXdc1BCkJBAMPQ17n/mY2L8SMIFroJJV0FQ7bU4HwaqNnusgf+5PiTdZ3hbF65P18/PRDe6EIb/8frDKQAAAAASUVORK5CYII=',
  hole: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgVCicOvc1H+gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAcSURBVAjXY2RgYPjPgAUwMeAA5Ev8RZdgxGU5ANPcAwYrkLWxAAAAAElFTkSuQmCC'
};
/* init variables here */
g.canvas = document.getElementById('c');
g.c = g.canvas.getContext('2d');
g.bgcanvas = document.getElementById('bgc');
g.bgc = g.bgcanvas.getContext('2d');
/**
 * Bind Socket.IO and button events
 */
function bind() {

  socket.on("end", function () {
    console.log('src/client/init.js:12:16:"Waiting for opponent..."', "Waiting for opponent...");
  });

  socket.on("connect", function () {
    console.log('src/client/init.js:16:16:"Waiting for opponent..."', "Waiting for opponent...");
  });

  socket.on("disconnect", function () {
    console.error('src/client/init.js:20:18:"Connection lost!"', "Connection lost!");
  });

  socket.on("error", function () {
    console.error('src/client/init.js:24:18:"Connection error!"', "Connection error!");
  });
}
function init() {
  socket = io({ upgrade: false, transports: ["websocket"] });
  bind();
}

window.addEventListener("load", init, false);
document.addEventListener('keydown', g.store.handleKeyDown, false);

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
	console.log("src/server/server.js:12:13:'Finding oponent',user", 'Finding oponent', user);
	for (let loggedUser of users) {
		console.log("src/server/server.js:14:14:g.Game.np", g.Game.np);
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
	users.splice(users.indexOf(user), 1);
}

function Game(users) {
	this.users = users;
}
/**
 * Start new game
 */
Game.prototype.start = function () {
	for (let i = 0; i < users.length; i++) {
		users[i].start(this, i);
	}
};

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
	this.opponents = [];
}

/**
 * Set guess value
 * @param {number} guess
 */
User.prototype.setGuess = function (guess) {
	if (!this.opponent || guess <= GUESS_NO || guess > GUESS_SCISSORS) {
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
	this.game = game;
	this.position = position;
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
		console.log("src/server/server.js:142:14:\"Disconnected: \" + socket.id", "Disconnected: " + socket.id);
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

	console.log("src/server/server.js:158:13:\"Connected: \" + socket.id", "Connected: " + socket.id);
};})()}})()