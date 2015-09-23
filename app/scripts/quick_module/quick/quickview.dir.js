'use strict';

(function(){

  var app = angular.module('74App');


  /*
   Example Usage:
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
  var quickView = function quickView_($templateRequest, $compile, $interpolate, transcludeHelper) {

    var utils = transcludeHelper.new();

    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/quick/quickview.dir.html').then(
        function(html){
          var ctrl = scope.vm;
          var config = scope.vm.config;
          if ( config == null ) {config = {};}

          var templateContent = angular.element(html);
          utils.templateContent = templateContent;
          //utils.userTemplateContent = templateOriginal;
          utils.userTemplateContent = dictTemplates[attrs.title]
          utils.userContent = element;


          //utils.load();

          var bodyContent = utils.templateContent.find('#bodyContent');
          if ( bodyContent.length ==0 ) {
            //if body content not defined, grab all children as a tranclude ...
            //this is the default behavior
          }

          if ( attrs.identify == 'true' ) {
            utils.templateContent.find("#testArea").append(JSON.stringify(attrs));
            utils.templateContent.find("#testArea").append(new Date())
          }

          utils.copyContentGroup("header", '#areaHeader');
          utils.copyContentGroup("areaFooter", '#areaFooter');

          //specify title

          utils.ifDefinedAddTo(attrs.title, '#areaTitle', true);

          //specify form
          if ( config.quickForm != null ) {
            utils.show("#areaForm");
            utils.ifDefined(config.quickForm.formObject,
              function () {

              }
            );
          }



          html = utils.templateContent[0];

          element.append($compile(html)(scope));

          scope.element = element;
          console.log('html output', html);

          function defineWatchers() {
            scope.$watch('vm.config', function (v, oldVal) {
              if (scope.vm.dataObject != null) {
                console.log('quickform',
                  'scope.vm.dataObject...',
                  'inner', 'changed: ',
                  scope.vm.dataObject, v);
                if ( scope.vm.config != null ) {
                  if ( scope.vm.config.fxChange != null ) {
                    scope.vm.config.fxChange(v);
                  }
                }
              }
            }, true);
          }

          defineWatchers();

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
        id:'@',
        title: '@',
        fxItemSelected: '&',
        config: '='
      },
      controller: 'QuickCompController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('quickView', quickView);

  var QuickCompController = function QuickCompController ($scope, transcludeHelper) {
    this.count = 1;
    this.increment  =function increment() {
      this.count++;
    };
    this.identify  =function identify() {
      console.log('inside', $scope.vm.title, $scope.vm.id);
    };
    this.move  =function moveElement() {
      transcludeHelper.move('#testComp', '#testComp2');
      this.count++;
    };

    this.$scope = $scope;
  };

  app
    .controller('QuickCompController', QuickCompController);


}());
