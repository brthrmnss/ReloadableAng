//'use strict';

(function(){

  var app = angular.module('com.sync.quick');

  function relinkEventDir ($rootScope) {
    return {
      transclude: 'element',
      restrict: 'A',
      link: function(scope, element, attr, ctrl, transclude) {
        var previousContent = null;
        //console.log('transclude', transclude, 'relink', relink)
        var triggerRelink = function() {
          if (previousContent) {
            previousContent.remove();
            previousContent = null;
          }

          transclude(function (clone) {
            console.log('relinking');
            element.parent().append(clone);
            previousContent = clone;
          });

        };

        triggerRelink();
        $rootScope.$on(attr.relinkEvent, triggerRelink);

      }
    };

  };


  app.directive('relinkEvent', relinkEventDir)
}());
