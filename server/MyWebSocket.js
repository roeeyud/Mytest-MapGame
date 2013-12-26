var io = require('socket.io');

function MyWebSocket(listener, serverManager){
    this.webSocketServer = io.listen(listener);
    this.webSocketServer.sockets.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('PlayerUpdate', function (data){
            serverManager.onPlayerUpdate(data, socket);
        });
    });
}

MyWebSocket.prototype.sendPlayerUpdateToPlayers = function(game, player){
    game.players.forEach(function (element, index, array){
        var socket = element.socket;
        if(socket != undefined)
            socket.emit('PlayerUpdate', {lanLng: player.lanLng, name: player.name, markerImgUrl: player.markerImgUrl});
    });
}

MyWebSocket.prototype.sendWinnerMessageToPlayers = function (game, winnerName){
    game.players.forEach(function (element, index, array){
        var socket = element.socket;
        if(socket != undefined)
            socket.emit('Message', "User " + winnerName + " has won the game!");
    });
}


module.exports = MyWebSocket;