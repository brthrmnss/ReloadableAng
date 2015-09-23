'use strict';


function HeaderController($scope,  customersFactory, configFactory ){
 

    $scope.appSettings = configFactory;
    function init() {
        customersFactory.getCustomers().success(
            function onSuc(customers){
                $scope.customers = customers; 
        })
            .error(
            function(data,staus, header, config){
            
        });
    };
    init();
    $scope.sortBy = 'name';
    $scope.reverse = false; 

    $scope.doSort = function (propName) { 
        $scope.sortBy = propName;
        $scope.reverse = ! $scope.reverse;
    };

    this.a = 'd';
    $scope.menuItems = configFactory.menuItems;


    $scope.clickItem = function onClickItem() {

    };
}


angular.module('74App').controller('HeaderController', HeaderController);