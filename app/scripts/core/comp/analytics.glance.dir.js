'use strict';

(function(){

  var app = angular.module('74App');
  var analyticsGlance = function analyticsGlance_($templateRequest, $compile, transcludeHelper) {

    var utils = transcludeHelper.new();

    function link(scope, element, attrs){
      $templateRequest('scripts/core/comp/analytics.glance.dir.html').then(
        function(html){
          var templateContent = angular.element(html);
          utils.templateContent = templateContent;
          utils.userContent = templateOriginal;
          utils.userContent = element;
          utils.copyContentGroup("header", '#headerContent');
          utils.copyContentGroup("content", '#bodyContent');
          utils.copyContentGroup("footer", '#footerContent');
          utils.setHtml("#lblDayCount", '{{vm.data.days}} days')
          html = utils.templateContent[0];
          element.append($compile(html)(scope));
        }
      )

      scope.$watch('vm.data', function (v, oldVal) {
        console.log('data changed... changed, new value is: ', v );
        if (angular.isString(v)) {
          v = JSON.parse(v);
        };

        var totalCount = 0;
        for (var i = 0, len = v.sets.length; i < len; i++) {
          //lookup[array[i].id] = array[i];
          totalCount += v.sets[i].count;
        }
        v.totalCount = totalCount;

        scope.vm.data = v;
      });

    };

    var templateOriginal = null;
    var compile = function (tElem, tAttrs) {

      templateOriginal = tElem.clone();

      return {
        post: link
      };

    }
    return {
      scope: {
        name: '@',
        data: '@'
      },
      controller: 'AnalyticsCtrl',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('analyticsGlance', analyticsGlance);


  var AnalyticsCtrl = function AnalyticsCtrl ($scope) {


    $scope.set_color = function (set_ ) {
      var css = {};
      css.fontWeight = 'bold';
      if (set_.number > 50) {
        return { color: "red" }
      }
      if ( set_.color ) {
        css.backgroundColor = set_.color;
      }
      if ( set_.style != null ) {
        css.background = set_.style;
      }

      var baseHeight = 250;
      var height = baseHeight*set_.count/$scope.vm.data.totalCount;

      css.height = height+'px';

      return css;
    }

    $scope.setTextColor = function (set_ ) {
      var css = {};
      if ( set_.color ) {
        css.color = set_.color;
      }
      return css;
    }

    $scope.test = function() {

    }
    $scope.y = 8;
    this.set_color = function (set_ ) {
      if (set_.number > 50) {
        return { color: "red" }
      }
    }

    $scope.myStyle = {
      "width" : "900px",
      "background" : "red"
    };

  }

  //angular.module('listDemo1', ['ngMaterial'])
  app
    .controller('AnalyticsCtrl', AnalyticsCtrl);
}());
