'use strict';

(function(){

  var app = angular.module('com.sync.quick');

  /**
   * Component shows list of pagination buttons
   * @param $templateRequest
   * @param $compile
   * @param $interpolate
   * @param transcludeHelper
   * @returns {{scope: {title: string, fxItemSelected: string}, controller: string, controllerAs: string, bindToController: boolean, compile: Function}}
   * @private
   */
  var quickPaginate = function quickPaginate_($templateRequest, $compile,
                                              $interpolate,
                                              transcludeHelper,
                                              sh) {

    var utils = transcludeHelper.new();

    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/quick/quickpaginate.dir.html').then(
        function(html){
          utils.$compile = $compile;
          utils.loadTemplate(html, element, attrs);

          scope.render(utils);
          scope.$watch('vm.config', function (v, oldVal) {
            if (scope.vm.config != null) {
              console.log('quickPaginate... changed: ',
                scope.vm.config, v);
            }
          });

          scope.vm.config.fxRefresh = function() {
            var btns = [];
            var config = scope.vm.config;
            if ( config.paginator == null ) {
              return;
            }
            sh.each.times(config.paginator.pages,
              function (i) {
                btns.push(i+1);
              })
            scope.buttons = btns;
            scope.morePages = config.paginator.morePages;
          };

          scope.vm.config.fxRefresh();

        }
      )
    };

    var compile = function (tElem, attrs) {
      utils.storeTemplate(tElem, attrs);
      function defineDirectiveDefaults() {
        if ( attrs.selectedIndex === null  ) {
          attrs['selectedIndex'] = "-1";
        };
        //utils.defaultAttr('dataObject', "{}", attrs);
      }
      defineDirectiveDefaults();
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
        config:'='
      },
      controller: 'quickPaginateController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };
  app.directive('quickPaginate', quickPaginate);

  var quickPaginateController = function quickPaginateController_ ($scope,
                                                                   transcludeHelper) {

    this.$scope = $scope;

    $scope.render = function render( utils ) {
      if ( $scope.utils == null ) {
        $scope.utils = utils;
      } else {
        utils = $scope.utils;
      }
      var element = utils.element;
      var $compile = utils.$compile;

      var scope = $scope;

      utils.templateContent = utils.templateContent.clone()
      utils.userTemplateContent = utils.userTemplateContent.clone()

      var config = scope.vm.config;
      if ( config == null ) { config = {}; };

      utils.ifTrue(config.showNext, function () {
        utils.templateContent.find('#btnShow').hide();
      })

      var html = utils.getHTML();

      element.append($compile(html)(scope));
      scope.element = element;
    };

    $scope.goToPage = function (page) {
      $scope.vm.config.restHelper.pageGoTo(page);
    }

    $scope.isActive = function(page) {
      page -= 1;
      var compareTo = $scope.vm.config.paginator.page_index // +1
      //console.log('isActive', page,compareTo );// $scope.vm.config.paginator.page_index)
      return compareTo == page;
    }
    $scope.morePages = true;
    $scope.goToNextPage = function (page) {
      $scope.vm.config.restHelper.pageNext();
    }
  };
  app
    .controller('quickPaginateController',
    quickPaginateController);


}());
