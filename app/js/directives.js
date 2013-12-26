'use strict';

var myTestDirectives = angular.module('myTestDirectives', []);

myTestDirectives.directive('backImg', function () {
    return function (scope, elem, attrs) {
        var url = attrs.backImg;
        var cssCall = url;
        elem.css("backgroundImage", cssCall);
    }
});

myTestDirectives.directive('helloMaps', function () {
    return function (scope, elem, attrs) {
        var mapOptions,
            lat = 31.877557643340015,
            lng = 34.98046875,
            map;

        lat = lat && parseFloat(lat, 10) || 43.074688;
        lng = lng && parseFloat(lng, 10) || -89.384294;

        mapOptions = {
            zoom: 2,
            center: new google.maps.LatLng(lat, lng)
        };

        map = new google.maps.Map(elem[0], mapOptions);

        function dblclickCallback (event) {

            scope.lat = event.latLng.lat();
            scope.lng = event.latLng.lng();
            scope.help = "Press submit to launch game";
            scope.submitDisabled = false;
            if(!scope.$$phase) scope.$apply();

            placeMarker(event.latLng);

        }

        function placeMarker(latLng){
            if(scope.marker != undefined && scope.marker.position != undefined)
                scope.marker.setMap(null);

            scope.marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title:"Find me!",
            });
            scope.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
        }

        scope.submitDisabled = true;
        google.maps.event.addListener(map, 'dblclick', dblclickCallback);
    };
});

myTestDirectives.directive('gameMap', function () {
    return function (scope, elem, attrs) {
        scope.markers = [];
        var mapOptions,
            lat = scope.target.lat,
            lng = scope.target.lng,
            map;

        lat = lat && parseFloat(lat, 10) || 43.074688;
        lng = lng && parseFloat(lng, 10) || -89.384294;

        mapOptions = {
            zoom: 2,
            center: new google.maps.LatLng(lat, lng)
        };

        map = new google.maps.Map(elem[0], mapOptions);

        scope.placeTargetMarker = function(target){
            if(this.markers.length == 0)
                this.markers.push({});
            this.placeMarker(0, "Target", target, 'http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            this.changeMapCenter(target);
        }

        scope.changeMapCenter = function(target){
            map.setCenter(target);
        }

        scope.onPlayerUpdate = function(playerMarker){
            var index = this.findMarkerIndex(playerMarker.name);
            if(index == -1){
                index = this.markers.length;
                scope.markers.push({})
            }

            this.placeMarker(index, playerMarker.name, playerMarker.lanLng, playerMarker.markerImgUrl);

        }

        scope.findMarkerIndex = function(makerName){
            for(var i = 0; i < scope.markers.length; i++){
                if(scope.markers[i].getTitle() == makerName){
                    return i;
                }
            }

            return -1;
        }

        scope.placeMarker = function(markerIndex, title, latLng, icon){
            if(scope.markers != undefined && scope.markers[markerIndex] != undefined && scope.markers[markerIndex].setMap != undefined)
                scope.markers[markerIndex].setMap(null);

            scope.markers[markerIndex] = new google.maps.Marker({
                position: {lat: Number(latLng.lat), lng: Number(latLng.lng)},
                map: map,
                title: title
            });

            scope.markers[markerIndex].setIcon(icon)
        }
    };
});

