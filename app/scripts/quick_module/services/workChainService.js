'use strict';
/**
 * workChain provides service for basic helper method calls
 */
( function() {

  var workChain = function workChain( ) {
    var service = {};
    service.create = function (token) {
      if ( token == null ) token = {};
      var work = new PromiseHelperV3();
      token.silentToken = true
      work.wait = token.simulate == false;
      return work.startChain(token)
    }
    return service;
  }

  workChain.$inject = [ ];

  angular.module('com.sync.quick').factory('workChain', workChain );
  angular.module('com.sync.quick').factory('promiseC', workChain );
}());
