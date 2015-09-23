'use strict';


var app = angular.module('74App');
/**
 * @ngdoc function
 * @name 74App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the 74App
 */
angular.module('74App')
    .factory('configFactory', function configFactory () {
        var factory = {} ;
        factory.headerMenuItems = ['Run', 'jump', 'exit'];
        return factory;
    });

app.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});
