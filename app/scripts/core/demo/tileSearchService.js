'use strict';


( function() {

    var tileSearchService = function tileSearchService($http, $q) {


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

      factory.search = function search(query, page ) {
        console.log('search', query);

      }

        return factory;

    }

  tileSearchService.$inject = ['$http', '$q'];

    angular.module('74App').factory('tileSearchService', tileSearchService );
}());
