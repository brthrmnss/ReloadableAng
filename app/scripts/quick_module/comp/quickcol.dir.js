'use strict';

(function(){

  var app = angular.module('com.sync.quick');
  /*
   Example Usage:
   This component enables consumers to quickly
   list and form column or table like data


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
  var quickCol = function quickCol($templateRequest, $compile, $interpolate, transcludeHelper) {

    var utils = transcludeHelper.new();



    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/comp/quickcol.dir.html').then(
        function(html){
          var $scope = scope;

          console.log('url', 'fxLink', $scope.vm);

          var templateContent = angular.element(html);
          utils.templateContent = templateContent;
          utils.userTemplateContent = templateOriginal;
          utils.userTemplateContent = dictTemplates[attrs.title]
          utils.userContent = element;
          utils.element = element;
          utils.$compile = $compile;
          scope.render(utils);

          scope.$watch('vm.config', function (newVal, oldVal) {
            if (scope.vm.config != null) {
              console.log('vm.config... changed: ',
                scope.vm.config, newVal);
            }
            console.log('quickCrud',
              'scope.vm.formObject... changed: ',
              scope.vm, newVal,oldVal);
          });
          return;

          html = utils.templateContent[0];

          utils.ifFalseHide(attrs.showList, '#quick-crud-leftcol');
          utils.ifFalseHide(attrs.showList, '#btnRefresh');
          utils.ifFalseHide(attrs.canCreate, '#btnNew');

          element.append($compile(html)(scope));

          scope.element = element;
          console.log('html output', html);

          scope.$watch('vm.formObject', function (v, oldVal) {
            if (scope.vm.formObject != null) {
              console.log('scope.vm.formObject... changed: ',
                scope.vm.formObject, v);
            }
            console.log('quickCrud',
              'scope.vm.formObject... changed: ',
              scope.vm, v,oldVal);
          });

          scope.$watch('vm.formObject2', function (v, oldVal) {
            if (scope.vm.formObject2 != null) {
              console.log('scope.vm.formObject2... changed: ',
                scope.vm.formObject2, v);
            }
            console.log('quickCrud',
              'scope.vm.formObject2... changed: ',
              scope.vm, v,oldVal);
          });

          //when data input is from parent ... copy object to
          //scope
          scope.$watch('vm.datainput', function (v, oldVal) {
            if (scope.vm.datainput != null) {
              console.log('scope.vm.datainput... changed: ',
                scope.vm.datainput, v);
              //scope.vm.dataObject = v;
              scope.dataObject = v;
            }
            console.log('quickCrud',
              'scope.vm.datainput... changed: ',
              scope.vm, v,oldVal);
          });

          scope.$watch('vm.dataObjectB', function (v, oldVal) {
            if (scope.vm.dataObjectB != null) {
              console.log('scope.vm.dataObject... changed: ',
                scope.vm.dataObjectB, v);
              //scope.vm.dataObject = v;
              scope.dataObject = v;
            }
            console.log('quickCrud',
              'scope.vm.dataObjectB... changed: ',
              scope.vm, v,oldVal);
          });
        }
      )

    };

    var templateOriginal = null;
    var dictTemplates = {};

    var compile = function (tElem, attrs) {
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
      utils.defaultAttr('testAttr', '5', attrs)
      utils.storeUserContent(tElem);
      console.log('fxCompile','url',attrs);
      return {
        pre: function(scope, element, attrs, controller){
          return;
        },
        post: link
      };
    }
    return {
      scope: {
        title: '@',
        config: '=',
      },
      controller: 'QuickColController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('quickCol', quickCol);

  var QuickColController =
    function QuickColController ($scope,
                                 $log,
                                 $http,
                                 sh
    ) {
      this.$scope = $scope;
      var ctrl = this;

      console.log('QuickColController', 'url', $scope.vm);

      $scope.render = function render( utils ) {
        if ( $scope.utils == null ) {
          $scope.utils = utils;
        } else {
          utils = $scope.utils;
        }
        var element = utils.element;
        var $compile = utils.$compile;

        //clear current element
        element.html('');
        //clone template content
        utils.templateContent = utils.templateContent.clone();

        var config = $scope.vm.config;
        if ( config == null ) {
          return;
        }

        utils.ifDefinedAddTo(config.title,
          '#txt-quick-col-container-title', true)

        var templateContainer = utils.templateContent
          .find('#quick-col-container');
        //clear example html from container
        templateContainer.html('');

        var firstItem = true;

        //for ( var i = 0; i < config.cols.length ; i++) {
        for   ( var i   in config.cols  ) {
          var col = config.cols[i];
          if ( col == null ) {
            continue;
          }
          var lastCol = false;
          if ( i == config.cols.length -1 ){
            lastCol = true
          }
          console.log('quickcolcontroller,', col);

          var colName = i;
          var colData = col
          if ( col.label != null ) {
            colName = col.label
          }
          if ( col.value != null ) {
            colData = col.value
          }
          var className = sh.dv(col.className, '');

          var div = angular.element('<div />');
          div.addClass('quick-col-data');
          div.append(colName)
          div.append(':'+'<br/>');

          var span = angular.element('<span />');
          span.addClass(className);
          span.append(colData)
          div.append(span);

          templateContainer.append(div);

          if ( firstItem == true ) {
            firstItem = false
            var div = angular.element('<div />');
            div.addClass('quick-col-divider');
            div.append('&nbsp;');

            templateContainer.append(div);
          }
        }


        var html = utils.templateContent[0];

        element.append($compile(html)($scope));
      }

    };

  app
    .controller('QuickColController', QuickColController);


}());
