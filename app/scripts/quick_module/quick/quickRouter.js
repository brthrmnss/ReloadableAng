'use strict';

/**
 * Enable support for multiple content areas
 */
(function(){

  var app = angular.module('com.sync.quick');
  var quickRouter = function quickRouter_($rootScope, $route, $location, $timeout) {
    var factory = {};

    factory.state={};

    factory.getQueryParams = function getQueryParams(qs) {
      qs = qs.split("+").join(" ");

      var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

      while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
          = decodeURIComponent(tokens[2]);
      }

      return params;
    }

    factory.isStateDifferent = function isStateDifferent() {
      var params = factory.getQueryParams(document.location.search)

      for (var key in factory.state) {
        if ( params[key] != factory.state[key] ) {
          return true
        }
      }
      //handle properties not in factory state
      for (var key in params) {
        if ( params[key] != factory.state[key] ) {
          return true
        }
      }

      return false;
    }

      //Bind the `$locationChangeSuccess` event on the rootScope, so that we dont need to
      //bind in induvidual controllers.

      $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
        var query = factory.getQueryParams(document.location.search)
        console.log('$locationChangeSuccess', query);
        if (factory.isStateDifferent()) {
          factory.updateFromRoute();
        }
      });

      $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
          alert('Why did you use history back?');
        }
        console.log('onUrlLocationChanged', $rootScope.actualLocation === newLocation)
      });


    //$locationProvider.html5Mode(true);

    factory.updateFromRoute = function updateFromRoute() {
      var query = factory.getQueryParams(document.location.search)
      factory.fxUpdateFromRoute(query);
    };

    factory.addToState = function addToState(key, val, addNav, addNav_newTitle , delayed) {
      if ( delayed != true ) {
        $timeout(function () {
          factory.addToState(key, val, addNav, addNav_newTitle, true)
        },50);
        return;
      }
      factory.state[key] = val;



      var url = '';
      if (document.location.pathname != '' ) {
        url = document.location.pathname
      }

        url += '?';
      //if pageMethod
      for (var key in factory.state) {
       url +=  key + '=' + factory.state[key] + '&';
      }
      if ( addNav ) {
        history.pushState(
          factory.state, addNav_newTitle, url
        );
        factory.addNewHistory(addNav_newTitle);
      }
    }

    factory.addNewHistory = function addNewHistory(newTitle) {
      //title to:
      //$rootScope.title = newTitle;
      document.title = newTitle;
    }

    /**
     * Dev specifies callback to recieve routing information
     * @type {null}
     */
    factory.fxUpdateFromRoute = null;

    return factory;

  };

  app.factory('quickRouter', quickRouter);

}());
