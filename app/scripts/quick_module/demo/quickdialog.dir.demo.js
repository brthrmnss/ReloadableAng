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
  var quickDialogDemo = function quickDialogDemo($templateRequest, $compile, $interpolate, transcludeHelper) {

    var utils = transcludeHelper.new();

    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/demo/quickdialog.dir.demo.html').then(
        function(html){
          var ctrl = scope.vmC;
          var templateContent = angular.element(html);
          utils.templateContent = templateContent;
          utils.userTemplateContent = templateOriginal;
          utils.userTemplateContent = dictTemplates[attrs.title]
          utils.userContent = element;

          html = utils.templateContent[0];

          element.append($compile(html)(scope));

          scope.element = element;
          console.log('html output', html)
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
        if ( attrs.views == null  ) {
          attrs['views'] = {
            'a': 'comp:#viewA',
            'b': '<test-comp id="viewB">View B</test-comp>',
            'c': 'dom:#viewC'
          };
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
        views: '@',
        views2: '@'
      },
      controller: 'QuickDialogDemoController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('quickDialogDemo', quickDialogDemo);

  var QuickDialogDemoController = function QuickDialogDemoController ($scope, $rootScope,
                                                                      dialogService) {
    this.$scope = $scope;

    $scope.viewA  =function goToViewA() {
      console.log('open dialog A');

      dialogService.openDialog('testDialogA');
    }
    $scope.viewB  =function goToViewB() {
      var data = {};
      data.id = 'topA';
      data.dom = $scope.vm.views['b'];
      data = convertToData(data)
      $rootScope.$broadcast('loadAppArea', data);

      console.log('go to view b');
    }
    $scope.viewC  =function goToViewA() {
      dialogService.openDialog('testAlertDialog');
    }


    $scope.showToast = function showToast(msg) {
      dialogService.showToast(msg);
    }

    $scope.openTestDialogA = function openTestDialogA() {
      dialogService.openDialog('testDialogA');
    }

    function convertToData(  data) {
      var jqueryQuery = null;
      if ( data.dom.indexOf('comp:') == 0 ) {
        jqueryQuery   =   data.dom.split('comp:')[1];
        data.type = 'loadComponent';
        data.off = true
        data.dom      =   angular.element.find(jqueryQuery);
      }

      if ( data.dom.indexOf('dom:') == 0 ) {
        jqueryQuery   =   data.dom.split('dom:')[1];
        data.type = 'moveComponent';
        data.dom      =   angular.element.find(jqueryQuery);
      }
      return data;
    }


  }

  app
    .controller('QuickDialogDemoController', QuickDialogDemoController);


}());
