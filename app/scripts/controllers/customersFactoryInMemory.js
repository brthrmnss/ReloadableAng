'use strict';


( function() {

    var customersFactory = function customersFactory_($http, $q) {

        var customers  = [
            {
                id: 1,
                joined: '2000-12-02',
                name:'Clarke',
                city:'Chandler',
                orderTotal: 9.9956,
                orders: [
                    {
                        id: 1,
                        product: 'Shoes',
                        total: 9.9956
                    }
                ]
            },
            {
                id: 2,
                joined: '1965-01-25',
                name:'Zed',
                city:'Las Vegas',
                orderTotal: 19.99,
                orders: [
                    {
                        id: 2,
                        product: 'Baseball',
                        total: 9.995
                    },
                    {
                        id: 3,
                        product: 'Bat',
                        total: 9.995
                    }
                ]
            },
            {
                id: 3,
                joined: '1944-06-15',
                name:'Tina',
                city:'New York',
                orderTotal:44.99,
                orders: [
                    {
                        id: 4,
                        product: 'Headphones',
                        total: 44.99
                    }
                ]
            },
            {
                id: 4,
                joined: '1995-03-28',
                name:'Dave',
                city:'Seattle',
                orderTotal:101.50,
                orders: [
                    {
                        id: 5,
                        product: 'Kindle',
                        total: 101.50
                    }
                ]
            }
        ]; // end of customers data

        var factory = {};
        factory.getCustomers = function() {
            var y = $http.get('/customers');
            var deferred = $q.defer();

            deferred.resolve(customers)
            deferred.promise.success = function (_fx) {
                _fx(customers)
                return deferred.promise
            }
            deferred.promise.error = function (_fx) {
                _fx(customers)
            }
            //asdf.g
            return deferred.promise;
            // return $http.get('/customers');
            //return customers; 
        };


        factory.getCustomer = function getCustomer(customerId) {
            return $http.get('/customers/'+customerId);
        }

        return factory;

    }

    customersFactory.$inject = ['$http', '$q'];

    angular.module('74App').factory('customersFactory', customersFactory );
}());