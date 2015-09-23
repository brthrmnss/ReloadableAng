'use strict';

( function() {
  var app = angular.module('com.sync.quick');
  var appAreaService = function appAreaService($rootScope) {


    var factory = {};

    factory.open = function open(appArea, viewName) {
      var data = {};
      data.appArea = appArea;
      data.rawDirective = viewName;
      $rootScope.$broadcast('loadAppArea', data);
    };

    /**
     * Convience method, creates object
     * that can communicate directly to named component
     */
    factory.createAARouter = function (appArea) {
      function AARouter() {
        var self = this;
        var p = this;
        p.init = function init(name) {
          self.appArea = name;
        };
        p.goTo = function (viewName, data) {
          var event = {};
          event.appArea = self.appArea;
          //data.rawDirective = viewName;
          event.viewName = viewName;
          event.data = data;
          $rootScope.$broadcast('loadAppArea', event);
        };
      }

      var router = new AARouter();
      router.init(appArea)
      return router;
    };

    /**
     * Convenience method, creates object
     * that can communicate directly to named component
     */
    factory.createAAReceiver = function (appArea, viewName,
                                         fxLeave, fxEnter
    ) {
      var sttgs = {};
      if ( angular.isObject(appArea)){
        sttgs = appArea;
      } else {
        sttgs.appArea = appArea;
        sttgs.viewName = viewName;
        sttgs.fxLeave = fxLeave;
        sttgs.fxEnter = fxEnter;
      }
      function AARouterReceiver() {
        var self = this;
        var p = this;
        p.init = function init(stg) {
          self.appArea = stg.appArea;
          self.viewName = stg.viewName;
          self.settings = stg;
          if ( stg.fxLeave ) {
            $rootScope.$on('onLeaveArea',  self.onLeaveArea );
          }
          if ( stg.fxEnter ) {
            $rootScope.$on('onJoinArea', self.onJoinArea);
          }
        };

        p.onLeaveArea = function onLeaveArea(event, data) {
          if (self.appArea != data.appArea) {
            return;
          }
          if (self.viewName != data.viewName) {
            return;
          }
          var result = self.settings.fxLeave(data.data, data)
          if (result==false) {
            data.stop = true;
          }
        };

        p.onJoinArea = function onJoinArea(event, data) {
          if (self.appArea != data.appArea) {
            return;
          }
          if (self.viewName != data.viewName) {
            return;
          }
          var result = self.settings.fxEnter(data.data, data)
          if (result==false) {
            data.stop = true;
          }
        };

        p.delete = function remove() {

        }
      };

      var router = new AARouterReceiver();
      router.init(sttgs)
      return router;

    }


    factory.types = {};
    factory.types.ViewStay = 'NavCanceled' //Some consumer tried to change the view
    //but it was denied
    factory.types.ViewChanged = 'ViewChanged';

    /**
     * Make consumer reflect current app state
     * @param appArea
     */
    factory.listenForViewState = function (appArea, fxNav) {
      $rootScope.$on(factory.types.ViewStay,
        onNavToArea);
      $rootScope.$on(factory.types.ViewChanged,
        onNavToArea);
      function onNavToArea(event, data) {
        if (appArea != data.appArea) {
          return;
        }
        fxNav(data.data, data, data.viewName)
      };
    }

    return factory;

  }

  appAreaService.$inject = ['$rootScope'];

  app.factory('appAreaService', appAreaService );
}());
