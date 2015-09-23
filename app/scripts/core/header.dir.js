'use strict';

(function(){

    var app = angular.module('74App');
     var headerMenu = function headerMenu2() {
         return {
             scope: {
                 name: '@',
                 items: '@',
                 fxSelectItem: '&',
                 selectedIndex: '='
             },
             controller: 'HeaderController',
             controllerAs: 'vmC',
             // bindToController:true,
             // button ng-click="fxSelectItem"
             templateUrl: 'scripts/core/header.menu.html'
         };
     };

    app.directive('headerMenu', headerMenu);


}());