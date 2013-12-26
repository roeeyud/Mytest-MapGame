var MyWebSocket = require('./MyWebSocket');
var myWebSocket = null;

function ServerManager (){

    this.games = [];
};

ServerManager.prototype.setServer = function(server){
    this.server = server;
    this.startWebSocket();
};

ServerManager.prototype.startWebSocket = function (){
    this.myWebSocket = new MyWebSocket(this.server.listener, this);
};

ServerManager.prototype.onPlayerUpdate = function(data, socket){
    var game = this.games[data.gameId];
    var player = this.findPlayerByName(data.gameId, data.playerName);
    if(player === null)
        return;

    player.socket = socket;
    player.lanLng = data.lanLng;

    if(this.checkForVictory(game.target, player.lanLng)){
        // Game over!!! Let everyone know who won
        this.notifyGameOver(game, player.name);
    } else {
        this.updatePlayer(game, player);
    }
};

ServerManager.prototype.checkForVictory = function(target, attemptLanLng){
    var retVal = false;
    if(Number(target.lat).toFixed(2) == Number(attemptLanLng.lat).toFixed(2) && Number(target.lng).toFixed(2) == Number(attemptLanLng.lng).toFixed(2)){
        retVal = true;
    }
    return retVal;
};

ServerManager.prototype.notifyGameOver = function(game, winnerName){
    game.gameOpen = false;
    this.myWebSocket.sendWinnerMessageToPlayers(game, winnerName);
};

ServerManager.prototype.updatePlayer = function(game, player){
    this.myWebSocket.sendPlayerUpdateToPlayers(game, player);
}

ServerManager.prototype.findPlayerByName = function (gameId, playerName){
    if(this.games[gameId] != undefined && this.games[gameId].players != undefined){
        for(var i = 0; i< this.games[gameId].players.length; i++){
            var player = this.games[gameId].players[i];
            if(playerName == player.name){
                return player;
            }
        }
    }

    return null;
}

ServerManager.prototype.getNewGameNum = function() {
    return this.games.length;
}

ServerManager.prototype.addGame = function(lanLng){
    var newGame = {
        target: lanLng,
        players: [],
        gameOpen: true
    };

    this.games.push(newGame);
}

ServerManager.prototype.getGame = function(gameId){
    var retVal = -1;
    if(gameId >= 0 && this.games[gameId] !== undefined){
        retVal = this.games[gameId];
    }
    return retVal;
}

ServerManager.prototype.addPlayer = function (gameId, newPlayerName, markerImgUrl) {
    var retVal = -1;
    if(this.games[gameId] != undefined && this.games[gameId].players != undefined){
        if(this.findPlayerByName(gameId, newPlayerName) === null){
            var newPlayer = {name: newPlayerName, markerImgUrl: markerImgUrl};
            this.games[gameId].players.push(newPlayer);
            retVal = newPlayer;
        }
    }

    return retVal;
};

module.exports = new ServerManager();