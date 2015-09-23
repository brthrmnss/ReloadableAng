'use strict';


( function() {

    var tileSearchController = function tileSearchController(
      movieSearchService,
      tileSearchService, $q) {

      this.action= function () {
        console.log('action2')
        var query = angular.element('#txtSearch').val();
        movieSearchService.search(query)
      }

      this.onSearchResults = function () {
        console.log('got search results')
      }
      //movieSearchService.notifyOfResult(this.onSearchResults)


      movieSearchService.notifyOfResult(function (items) {
        console.log('got search results')
      })
      movieSearchService.onClearResults(function (items) {
        console.log('clear results')
      })

    }

  tileSearchController.$inject = [ 'movieSearchService', 'tileSearchService', '$q'];

    angular.module('74App').controller('TileSearchController', tileSearchController );
}());
