'use strict';

var myTestControllers = angular.module('myTestControllers', []);

myTestControllers.controller('mapSubmitCtrl', ['$scope', '$http',
  function($scope, $http) {
      $scope.help = "Double click to place marker";
      $scope.lat = 0.0000;
      $scope.lng = 0.0000;
      $scope.link = "";

      $scope.submitGame = function(){
          $http.get('db/games/newGame').success(function(data) {
              console.log('new game received id = ' + data);
              $http.post('db/games/', {target: {lat: $scope.lat, lng: $scope.lng}});
              var gameUrl = 'http://localhost/#!/games/' + data;
              $scope.help = "Game is now available at:";
              $scope.link = gameUrl;
          });
      }

  }]);

myTestControllers.controller('mapLoginCtrl', ['$scope', '$routeParams', "$http", '$location',
    function ($scope, $routeParams, $http, $location){
        $http.get('db/games/' + $routeParams.gameId).success(function(data) {
            // Validate game exists
            if(!data.gameOpen){
                $scope.help = "Invalid game";
                $scope.hide = true;
                return;
            } else {
                $scope.help = "Enter your name and press login";
                $scope.gameId = $routeParams.gameId;
                $scope.playerName = "";

                $scope.logIn = function(){
                    $http.post('db/online-players/', {name: $scope.playerName, gameId:  $scope.gameId, markerImgUrl: $scope.markerImgUrl}).success(function(data){
                        if(data == -1){
                            $scope.help = "Player name  already exists, please select a new name";
                        } else {
                            $location.path("/games/"+$scope.gameId + "/" + $scope.playerName);
                        }
                    });
                }
                $scope.markerImgUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            }
        });
    }]);

myTestControllers.controller('mapGameCtrl', ['$scope', '$routeParams', "$location", '$http',
    function ($scope, $routeParams, $location, $http){
        $scope.gameId = $routeParams.gameId;
        $scope.playerName = $routeParams.playerName;
        $scope.target = {lat: 0, lng: 0};
        $scope.myLatLng = {lat: 0, lng: 0};
        var socket = io.connect('http://localhost');

        $scope.updateMyMarker = function(lanLng){
            socket.emit("PlayerUpdate", {gameId: $scope.gameId, playerName: $scope.playerName, lanLng: lanLng})
        }

        $http.get('db/games/' + $routeParams.gameId).success(function(data) {
            $scope.target = data.target;
            if(!data.gameOpen){
                $scope.hide = true;
                $scope.help = "Game is unavailable";
            }
            $scope.placeTargetMarker(data.target);
        }).error(function(data, status, headers, config) {
            if(data.gameOpen){
                $scope.hide = true;
                $scope.help = "Game is unavailable";
            }
        });;

        // WebSocket Mapping
        socket.on('PlayerUpdate', function (data) {
            $scope.onPlayerUpdate(data);
        });

        socket.on('Message', function(message){
            window.alert(message);
        });
    }]);

