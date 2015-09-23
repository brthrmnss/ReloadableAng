'use strict';

/**
 * @ngdoc function
 * @name port3App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the port3App
 */
angular.module('port3App')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
