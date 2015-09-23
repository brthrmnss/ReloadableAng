'use strict';
/**
 * Helper shows vanilla reloadable helper test service
 * why: When you want to reload services with your apps
 */
( function() {
  function ReloadableHelperTestService() {
    var self = this;
    var p = this;

    p.init = function init() {

    };

    p.new = function create() {
      return new QuickChecklistHelper();
    }


    p.alert = function () {
      console.log('highlys s....')
    }
  }
  //alert('reloaded then')
  window.ReloadableHelperTestService = ReloadableHelperTestService;

  var reloadableHelperTestService = function reloadableHelperTestService( sh, pubSub ) {
    function createService() {
      var service = new ReloadableHelperTestService();
      if ( window.ReloadableHelperTestService != null ) {
        service = new window.ReloadableHelperTestService();
      };
      return service;
    }
    var service = createService();
    service.create = function () {
      return createService();
    };

    return service;
  };

  reloadableHelperTestService.$inject = ['sh', 'pubSub'];

  angular.module('com.sync.quick').factory('reloadableHelperTestService', reloadableHelperTestService );
}());
