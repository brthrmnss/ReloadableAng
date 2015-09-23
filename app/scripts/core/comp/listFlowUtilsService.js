'use strict';

( function() {
  function listFlowUtilsService(  ){
    var service = {};
    service.getMax = function getMax(items, minProp, maxProp) {
      if ( items == null ) {
        return null;
      }
      var maxItem = null;
      var maxVal = 0;
      var minVal = null;
      if ( maxProp == null ) {maxProp = 'end'; minProp='start'};
      for ( var i = 0; i < items.length ; i++) {
        var item = items[i];
        if ( item[maxProp] > maxVal ) {
          maxItem = item;
          maxVal = item[maxProp];
        }
        if ( minVal == null || item[minProp] < minVal ) {
          minVal = item[minProp];
        }
      }

      if ( maxItem != null ) {
        var result = {}
        result.maxVal = maxVal;
        result.minVal = minVal;
        return result;
      }

      return null;
    };
    return service;
  }


  angular.module('74App')
    .factory('listFlowUtils', listFlowUtilsService);
}());
