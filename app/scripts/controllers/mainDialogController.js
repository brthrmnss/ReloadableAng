'use strict';

/**
 * @ngdoc function
 * @name 74App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 74App
 */

function MainDialogController($scope, dialogService) {

  $scope.showAlert2 = function () {
    dialogService.openDialog('testAlertDialog');
  }

}


angular.module('74App')
  .controller('MainDialogController', MainDialogController);
