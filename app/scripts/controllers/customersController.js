'use strict';


function CustomersController($scope, customersFactory, appSettings ){
 

    $scope.appSettings = appSettings; 
    function init() {
        customersFactory.getCustomers().success(
            function onSuc(customers){
                $scope.customers = customers; 
        })
            .error(
            function(data,staus, header, config){
            
        });
    }
    init();

    $scope.sortBy = 'name'; 
    $scope.reverse = false; 

    $scope.doSort = function (propName) { 
        $scope.sortBy = propName;
        $scope.reverse = ! $scope.reverse;
    }
}


angular.module('74App').controller('CustomersController', CustomersController);