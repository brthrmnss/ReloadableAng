'use strict';

(function(){

  var app = angular.module('74App');


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
  var tileSearchDemo = function tileSearchDemo($templateRequest, $compile, $interpolate, transcludeHelper) {

    var utils = transcludeHelper.new();



    function link(scope, element, attrs){
      $templateRequest('scripts/core/demo/tilesearch.dir.demo.html').then(
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
          console.log('html output', html);


        }
      )


      controllerReference.$id = Math.random();
      console.log('top', controllerReference.$id,
        controllerReference.title, controllerReference.items, controllerReference.items2 );
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
      controller: 'TileSearchDemoController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('tileSearchDemo', tileSearchDemo);

  var TileSearchDemoController =
    function TileSearchDemoController ($scope,
                                       $sce,
                                       movieSearchService,
                                       $rootScope,
                                       dialogService) {
      this.$scope = $scope;

      var ctrl = this;
      this.tiles = buildGridModel({
        icon : "avatar:svg-",
        title: "Svg-",
        background: ""
      });
      function buildGridModel(tileTmpl) {
        var it, results = [];
        for (var j = 0; j < 11; j++) {
          it = angular.extend({}, tileTmpl);
          it.icon = it.icon + (j + 1);
          it.title = it.title + (j + 1);
          it.span = {row: 1, col: 1};
          switch (j + 1) {
            case 1:
              it.background = "red";
              it.span.row = it.span.col = 2;
              break;
            case 2:
              it.background = "green";
              break;
            case 3:
              it.background = "darkBlue";
              break;
            case 4:
              it.background = "blue";
              it.span.col = 2;
              break;
            case 5:
              it.background = "yellow";
              it.span.row = it.span.col = 2;
              break;
            case 6:
              it.background = "pink";
              break;
            case 7:
              it.background = "darkBlue";
              break;
            case 8:
              it.background = "purple";
              break;
            case 9:
              it.background = "deepBlue";
              break;
            case 10:
              it.background = "lightPurple";
              break;
            case 11:
              it.background = "yellow";
              break;
          }
          results.push(it);
        }
        return results;
      }

      var pageNumber = 0;


      $scope.search = {}
      $scope.search.nextPage = function () {
        console.log('searching next page');


        var newTiles = buildGridModel({
          icon : "avatar:svg-",
          title: "Svg-",
          background: ""
        });

        pageNumber++;
        var pageDivider = {
          page: ''  +pageNumber,
          col: 8, row: 1};
        pageDivider.divider = true;

        pageDivider.span = {row: 1, col: 6};

        pageDivider.span = {row: 1, col: 2};

        ctrl.tiles.push(pageDivider);
        ctrl.tiles = ctrl.tiles.concat(newTiles );

      };



      movieSearchService.notifyOfResult(function (event, items) {
        console.log('got search results');

       /* var newTiles = buildGridModel({
          icon : "avatar:svg-",
          title: "Svg-",
          background: ""
        });*/

        var results = [];
        var it = null;

        var tileTmpl = {
          icon : "avatar:svg-",
          title: "Svg-",
          background: ""
        };
        for (var j = 0; j < items.length; j++) {
          var item = items[j]
          it = angular.extend({}, tileTmpl);
          it.icon = it.icon + (j + 1);
          it.title = it.title + (j + 1);
          it.image = item.image;
          it.name = item.title;
          it.desc = item.desc;
          it.type = item.rating;
          it.span = {row: 3, col: 2};
          switch (j + 1) {
            case 1:
              it.background = "red";
              it.span.row = it.span.col = 2;
              break;
            case 2:
              it.background = "green";
              break;
            case 3:
              it.background = "darkBlue";
              break;
            case 4:
              it.background = "blue";
              it.span.col = 2;
              break;
            case 5:
              it.background = "yellow";
              it.span.row = it.span.col = 2;
              break;
            case 6:
              it.background = "pink";
              break;
            case 7:
              it.background = "darkBlue";
              break;
            case 8:
              it.background = "purple";
              break;
            case 9:
              it.background = "deepBlue";
              break;
            case 10:
              it.background = "lightPurple";
              break;
            case 11:
              it.background = "yellow";
              break;
          }

          it.span = {row: 4, col: 2};
          results.push(it);
        }

        ctrl.tiles = results;
      });

      movieSearchService.onClearResults(function (items) {
        console.log('clear results')
        pageNumber = 0;
        ctrl.tiles = [];
      })

      $scope.mouseEnter= function (tile,event) {
        angular.element('#dialogMovieHolder').addClass('show');
        console.log('mouseEnter', tile );

        if ( tile.divider == true ) {
          return;
        }

        angular.element(event.currentTarget).offset();
        angular.element('#dialogMovieHolder').offset(
          angular.element(event.currentTarget).offset())

        var height =  angular.element(event.currentTarget)
          .css('height');
        angular.element('#dialogMovieHolder').css('width',
          angular.element(event.currentTarget).css('width')
        )
        angular.element('#dialogMovieHolder').css('height',
          angular.element(event.currentTarget)
            .find('search-tile-image-holder').css('height')
        )
        angular.element('#dialogMovieHolder').css('height',
          angular.element(event.currentTarget)
            .css('height')
        )

        angular.element('#dialogMovieHolder').css('height',
           '50px'
        )

      };
      $scope.mouseLeave= function (tile, event) {
        console.log('mouseLeave', tile);
        angular.element('#dialogMovieHolder').addClass('hide');
      };

      setTimeout(function hideDialog() {
        angular.element('#dialogMovieHolder').addClass('hide');
      }, 500)
      angular.element('#dialogMovieHolder').addClass('hide');
      //make whole page have purple background
      angular.element('body').addClass('search-container');

      $scope.controller = {};

      $scope.controller.config = {
        sources: [
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
        ],
        tracks: [
          {
            src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
            kind: "subtitles",
            srclang: "en",
            label: "English",
            default: ""
          }
        ],
        theme: "bower_components/videogular-themes-default/videogular.css",
        plugins: {
          poster: "http://www.videogular.com/assets/images/videogular.png"
        }
      };


    }

  app
    .controller('TileSearchDemoController', TileSearchDemoController);


}());
