/**
 * Created by Roee on 23/12/13.
 */
var Hapi = require('hapi');
var serverManager = require('./server/ServerManager');

// Create a server with a host and port
var server = Hapi.createServer('localhost', 80);

function startServer(){
    serverManager.setServer(server);
}

// Define the route
var index = {
    handler: function (request) {
        var response = new Hapi.response.File('./app/index.html');
        request.reply(response);
    }
};

var login = {
    handler: function (request) {
        var response = new Hapi.response.Redirection('/');
        request.reply(response);
    }
}

// Add the route
server.addRoute({
    method : 'GET',
    path : '/',
    config : index
});

server.addRoute({
    method: 'GET',
    path: '/db/games/newGame',
    handler: function () {
        this.reply(serverManager.getNewGameNum());
    }
});

server.addRoute({
    method: 'GET',
    path: '/db/games/{gameId}',
    handler: function(req) {
        var gameId = req.params.gameId;
        var game = serverManager.getGame(gameId);
        if(game != -1)
            req.reply({target: game.target, gameOpen: game.gameOpen});
        else{
            req.reply({gameOpen: false});
        }
    }
});

server.route({
    method: 'POST',
    path: '/db/games/',
    config: {
        handler: function(req) {

            serverManager.addGame(req.payload.target);
            req.reply();
        }
    }
});


server.route({
    method: 'POST',
    path: '/db/online-players/',
    config: {
        handler: function(req) {
            var newPlayerName = req.payload.name;
            var gameId = req.payload.gameId;
            var markerImgUrl = req.payload.markerImgUrl;

            var reply = serverManager.addPlayer(gameId, newPlayerName, markerImgUrl);
            req.reply(reply);
        }

    }
});

server.addRoute({
    method: 'GET',
    path: '/{path*}',
    handler: {
        directory: { path: './app', listing: false, index: true }
    }
});


// Start the server
server.start(startServer);