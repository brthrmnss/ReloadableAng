'use strict';

(function(){

  var app = angular.module('com.sync.quick');

  var quickReloadDemo = function quickReloadDemo($templateRequest,
                                                 $compile,
                                                 $interpolate,
                                                 transcludeHelper
  ) {
    var utilsParent = transcludeHelper.new(this);
    console.log('creating', document.currentScript)
    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/demo/quickreload.dir.demo.html').then(
        function(html){
          var utils = transcludeHelper.new();
          utils.dictTemplates = utilsParent.dictTemplates; //copy over dictionary of templates
          utils.$compile = $compile;
          utils.loadTemplate(html, element, attrs);
          scope.render(utils);
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
      utilsParent.storeTemplate(tElem, attrs);
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
        views: '@',
        views2: '@',
        reloadDir:'@',
        reloadAny:'@'

      },
      controller: 'QuickReloadDemoController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };


  app.directive('quickReloadDemo', quickReloadDemo);

  var QuickReloadDemoController =
    function QuickReloadDemoController ($scope,
                                        dialogService,
                                        dataGen,
                                        $restHelper,
                                        appAreaService,
                                        sh,
                                        $http,
                                        quickFormHelper,
                                        evernoteHelper,
                                        $templateRequest,
                                        $templateCache,
                                        $rootScope,
                                        $cacheFactory
    ) {
      var types = {};
      var count = 0;
      //alert('s')
      //console.error('who is this', $scope.dirFx, $scope.ddd)
      $scope.render = function render(utils) {

        if ($scope.utils == null) {
          $scope.utils = utils;
          $scope.templateContent = utils.templateContent.clone();
          $scope.userTemplateContent = utils.userTemplateContent.clone();
        } else {
          utils = $scope.utils;
        }

        $scope.errors = [];
        var element = utils.element;
        var $compile = utils.$compile;

        var scope = $scope;

        utils.templateContent = $scope.templateContent.clone()
        utils.userTemplateContent = $scope.userTemplateContent.clone()

        count++
        utils.templateContent.find('#area3').html(count)

        var userContent = utils.userTemplateContent.html().trim();
        if ( userContent != ''  ) {
          utils.templateContent.find('#area').html(userContent)
        }



        var html = utils.getFinalTemplate();
        element.html($compile(html)(scope));
      };


      /*     $scope.onReload = function onReload() {
       console.log('...');
       jQuery.ajax({
       url: "/scripts/quick_module/quick/quickreloadable.dir.js",
       dataType: "script",
       cache: true
       }).done(function() {
       console.log('updated')
       $templateCache.removeAll();
       $scope.render();
       //jQuery.cookie("cookie_name", "value", { expires: 7 });
       });
       }


       /!*
       Uses template thing
       same as onReload but, ???
       *!/
       $scope.onReload2 = function onReload_redraw(addFile) {

       if (addFile) {
       console.log('addfile', addFile)
       $scope.reloadFile(addFile);
       } else {
       sh.each($scope.watchingFiles, function (i,file) {
       $scope.reloadFile(file);
       // $scope.reloadFile("/scripts/quick_module/services/reloadableHelperTestService.js")
       // $scope.reloadFile("/scripts/quick_module/services/reloadableHelperTestService.js")
       });
       }

       console.log('...');
       jQuery.ajax({
       url: "/scripts/quick_module/quick/quickreloadable.dir.js?q="+Math.random(),
       dataType: "script",
       cache: false
       })
       .error(function(s, b) {
       console.error('error loading ' +  addFile)
       })
       .done(function(s, b) {
       console.log('updated', $cacheFactory)
       $templateCache.removeAll();
       $scope.render()
       //jQuery.cookie("cookie_name", "value", { expires: 7 });
       });
       }*/

      $scope.triggerRelink = function() {
        $rootScope.$broadcast('testRelink');

      };

      $scope.rerenderDirective = function rerenderDirective() {
        $templateCache.removeAll();
        $scope.render()
      }

      $scope.reloadFile = function reloadFile(file){
        console.log('reloadFile', file);
        if (file.endsWith('.html')) {
          console.info('html file', file)
          file = file.substr(0, file.lastIndexOf(".")) + ".js";
          //return;
        }
        jQuery.ajax({
          url: file,
          dataType: "script",
          cache: true
        })
          .error(function(s, b,c) {
            console.error('error loading ' +  file,b, c)
          })
          .done(function() {
            // sh.callIfDefined(fx)
            $scope.rerenderDirective();
          });
      }

      $scope.reloadContent = function reloadContent(addFile){
        if (addFile.endsWith('.html')) {
          console.info('html file', addFile)
          setTimeout(function reloadDirLater() {
            $scope.rerenderDirective();
          }, 350)
          return;
        }
        return;
        jQuery.ajax({
          url: "/scripts/quick_module/quick/quickreloadable.dir.js?q="+Math.random(),
          dataType: "script",
          cache: false
        })
          .error(function(s, b,c) {
            console.error('error loading ' +  addFile,b,c)
          })
          .done(function(s, b) {
            console.log('updated', $cacheFactory)
            $templateCache.removeAll();
            $scope.render()
          });
      }




      /**
       * function to load a given css file
       */
      var loadCSS = function(href) {
        $('link[href$="'+href+'"]').remove();
        var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
        $("head").append(cssLink);
      };



      window.fxInvoke2 = function fxInvoke2(file) {
        if ( $scope.vm.reloadAny == 'true') {
          if ( file.indexOf('.css')== - 1) {
            $scope.reloadContent(file);
            $scope.reloadFile(file);
          } else {
            loadCSS(file)
          }







        }
      }

      if ( window.fxInvokes == null ) window.fxInvokes = [] ;
      window.fxInvokes.push(window.fxInvoke2)

    }
  app
    .controller('QuickReloadDemoController', QuickReloadDemoController);
  app
    .filter('to_trusted', ['$sce', function($sce){
      return function(text) {
        return $sce.trustAsHtml(text);
      };
    }]);

}());
