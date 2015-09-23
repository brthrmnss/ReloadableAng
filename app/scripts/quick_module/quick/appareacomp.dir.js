'use strict';

(function(){

  var app = angular.module('com.sync.quick');


  /*
   Example Usage:
   This component lets the user define different content
   group areas

   <div id="testComp"  class="_hide" >
   <test-comp></test-comp>
   </div>
   <div id="testComp2"  class="_hide" >
   move here:
   </div>
   */

  /**
   * Component verifies directive can be moved, and bindings will still work
   * @param $templateRequest
   * @param $compile
   * @param $interpolate
   * @param transcludeHelper
   * @returns {{scope: {title: string, fxItemSelected: string}, controller: string, controllerAs: string, bindToController: boolean, compile: Function}}
   * @private
   */
  var appAreaComp = function appAreaComp($templateRequest, $compile, $interpolate, transcludeHelper) {

    var utils = transcludeHelper.new();

    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/quick/appareacomp.dir.html').then(
        function(html){
          var ctrl = scope.vmC;
          var templateContent = angular.element(html);
          utils.templateContent = templateContent;
          utils.userTemplateContent = templateOriginal;
          utils.userTemplateContent = dictTemplates[attrs.title]
          utils.userContent = element;

          utils.setHtml('#title', attrs.label, true)

          html = utils.templateContent[0];
          element.append($compile(html)(scope));

          scope.element = element;

          console.error('apparea', 'html output', html);

          function initArea() {
            //load init view
            var views = scope.vm.views
            var config = scope.vm.config;
            if ( config == null ) { config = {}; };
            if ( config.views != null ) {
              views = config.views;
            };

            if ( views != null /*&&*/ ) {
              try {
                views = JSON.parse(views);
              } catch (e) {}

              if ( config.hideOnStart ) {
                //TODO fix
                for ( var key in views ) {
                  var v = views[key];
                  var split = v.split(':')
                  var id = split[1];
                  angular.element(
                    angular.element.find(id)
                  ).hide();
                }
                if ( config.removeLayout == true ) {
                  angular.element(
                    angular.element.find('#holder')
                  ).removeAttr('layout');
                }
              }

              var initView = scope.vm.initView;
              if ( config.initView != null ) { initView = config.initView };
              if ( initView != null ) {
                //var data = views[initView];
                scope.loadViewFromData(initView)
              }
            }

          }
          setTimeout(initArea, 200);


        }
      )

      controllerReference.$id = Math.random();
      console.log('top', controllerReference.$id, controllerReference.title, controllerReference.items, controllerReference.items2 );
    };

    var templateOriginal = null;
    var dictTemplates = {};
    var controllerReference = null;
    var compile = function (tElem, attrs) {

      templateOriginal = tElem.clone();
      dictTemplates[attrs.title] = templateOriginal;
      function defineDirectiveDefaults() {
        if ( attrs.selectedIndex === null  ) {
          attrs['selectedIndex'] = "-1";
        };
      }
      defineDirectiveDefaults();

      return {
        pre: function(scope, element, attrs, controller){
          controllerReference = controller;
          return;
        },
        post: link
      };
    }
    return {
      scope: {
        title: '@',
        fxItemSelected: '&',
        id: '@',
        initView:'@',
        views: '@',
        config: '='
      },
      controller: 'AppAreaController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('appAreaComp', appAreaComp);
  app.directive('viewStack', appAreaComp);

  var AppAreaController = function AppAreaController_ ($scope,
                                                       $rootScope,$element,
                                                       transcludeHelper, $compile,
                                                       appAreaService) {
    this.count = 1;
    this.increment = function increment() {
      this.count++;
    };
    this.move = function moveElement() {
      transcludeHelper.move('#testComp', '#testComp2');
      this.count++;
    };

    this.$scope = $scope;

    $rootScope.$on('loadAppArea', function (event, data) {
      loadViewFromData(data);
    });

    $scope.loadViewFromData = loadViewFromData;
    /*
    External consumers will ask for view by name,
    and pass in data value
    Can also pass in view object, when has viewName on it
    ...
    nothing else
     */
    function loadViewFromData(data) {
      var viewRequest = data;
      //Check config for view definition
      if (  angular.isString(data) &&
        $scope.vm.config != null ) {
        data = $scope.vm.config.views[data];
      }
      if ( data.areaName != null ) {
        data.id = data.areaName;
      }

      console.log($scope.vm.id, $scope.vm.id == data.id);
      if ($scope.vm.id != data.id ) {
        //not this areacomp
        console.error('not this comp')
        // return;
        //TODO: Implement multiple areas
      }
      var viewDef = null;
      if ( angular.isString(data)) {
        viewDef = loadViewFromDataPreProc(data);
        data = viewDef;
      } else {
        //sent to view, find view in config
        //if config is still string, then create viewDef from string
        if ( angular.isObject(data)) {
          if ( $scope.vm.config != null ) {
            viewDef = $scope.vm.config.views[data.viewName];
          }
          if ( angular.isString(viewDef) ) {
            viewDef = loadViewFromDataPreProc(viewDef);
            data = viewDef;
          }
        }


      }



      if ( data.rawDirective != null ){
        data = loadViewFromDataPreProc(data.rawDirective);
      }
      console.log('on', 'loadAppArea', data); // 'Data to send'

      var event = {}
      event.viewData = data;
      event.data = data.data;
      if ( viewRequest.data != null ) {
        event.data = viewRequest.data;
      }
      event.viewName = data.viewName;
      if ( angular.isString(viewRequest) ) {
        event.viewName = viewRequest;
      }
      if ( viewRequest.viewName != null ) {
        event.viewName = viewRequest.viewName;
      }
      event.appArea = $scope.vm.id;

      var lastEvent = angular.extend({},$rootScope.lastEvent);

      //fire event
      $rootScope.$broadcast('dirtyNav', event);
      if ( $rootScope.lastEvent ) {
        $rootScope.$broadcast('onLeaveArea',
          lastEvent);
      }
      if ( lastEvent.stop == true ) {
        console.error('Blocking action from ', lastEvent.viewName, data.viewName, data, event)
        $rootScope.$broadcast(appAreaService.types.ViewStay, lastEvent);
        return;
      }
      lastEvent = angular.extend({},$rootScope.lastEvent);


      $rootScope.$broadcast('onJoinArea', event);
      if ( event.stop == true ) {
        console.error('Blocking action to ', data.viewName, data, event)
        $rootScope.$broadcast(appAreaService.types.ViewStay, lastEvent);
        return;
      }
      $rootScope.$broadcast(appAreaService.types.ViewChanged, event);

      $rootScope.lastEvent = angular.extend({},event );

      //wait 10 ms ...
      var contentArea = $element.find("#contentArea");
      var oldContentArea = $element.find("#oldContentArea");
      contentArea.html('');

      if ( $scope.moveElement != null ) {
        oldContentArea.append(
          $scope.moveElement);
        $scope.moveElement = null;
      }

      //http://jsfiddle.net/ftfish/KyEr3/
      if ( data.type == 'loadComponent'
      /*|| data.type == null */ ) {
        //isolate scope by default //https://docs.angularjs.org/api/ng/type/$rootScope.Scope
        var $childScope = $scope.$new(true, $scope); //{}, $scope
        //return;
        angular.element(data.dom).removeAttr('ng-non-bindable');

        angular.element(
          $element.find('#contentArea')
        ).html($compile(
            angular.element( data.dom).clone()

          )($childScope));
      }
      else { //move component --moving destroys scope, hide
        if ( $scope.contentCurrent != null ) {
          $scope.contentCurrent.hide();
        }
        var content = angular.element(data.dom);
        content.show();
        $scope.contentCurrent = content
        //contentArea.html(content);
        //$scope.moveElement = content;
        //transcludeHelper.move('#testComp', '#contentArea');
      }
    };


    $scope.loadViewFromDataPreProc = loadViewFromDataPreProc;

    /**
     * Do not have valid 'viewData'
     * so create one on the fly
     * @param data_
     * @returns {{}}
     */
    function loadViewFromDataPreProc(data_) {
      var data = {};
      data.id = $scope.vm.id;
      data.dom = data_; //$scope.vm.views['a'];
      var jqueryQuery = null;
      if ( data.dom.indexOf('comp:') == 0 ) {
        jqueryQuery   =   data.dom.split('comp:')[1];
        data.type     =   'loadComponent';
        data.off      =   true
        data.dom      =   angular.element.find(jqueryQuery);
      };
      if ( data.dom.indexOf('dom:') == 0 ) {
        jqueryQuery   =   data.dom.split('dom:')[1];
        data.type     =   'moveComponent';
        data.dom      =   angular.element.find(jqueryQuery);
      };
      return data;
    };


  };

  app
    .controller('AppAreaController', AppAreaController);


}());
