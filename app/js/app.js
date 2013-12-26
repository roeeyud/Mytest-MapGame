'use strict';
var myTestApp = angular.module('myTestApp', [
  'ngRoute',
  'myTestControllers',
  'myTestDirectives'
]);

myTestApp.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix("!");
}]);

myTestApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/submit-game', {
        templateUrl: 'partials/submit.html',
        controller: 'mapSubmitCtrl'
        }).
        when('/games/:gameId/:playerName', {
            templateUrl: 'partials/game.html',
            controller: 'mapGameCtrl'
        }).
        when('/games/:gameId', {
        templateUrl: 'partials/login.html',
        controller: 'mapLoginCtrl'
      }).
      otherwise({
        redirectTo: '/submit-game'
      });
  }]);
