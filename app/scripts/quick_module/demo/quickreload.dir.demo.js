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



        var html = utils.getFinalTemplate();
        element.html($compile(html)(scope));
      };
      if ( window.fxInvoke == null ) {
        window.fxInvoke = function (classToUpdate) {
          var str = classToUpdate.split('/').slice(-1)[0]
          $rootScope.$emit(classToUpdate, classToUpdate)
          $rootScope.$emit(str, classToUpdate)
          window.fxInvoke.checkAll(classToUpdate)
        }
        window.fxInvoke.sets = [];
        window.fxInvoke.includes = function includes(addOnLink, fx) {
          window.fxInvoke.sets.push([addOnLink, fx])
        };
        window.fxInvoke.checkAll = function(s) {
          $.each(window.fxInvoke.sets, function findMatch(i, set) {

            var file = set[0]
            var fx = set[1];
            var fileMatched = s.toLowerCase().indexOf(file.toLowerCase()) != -1;
            console.log('checking...', file, fileMatched, 'in >>>', s.toLowerCase());
            if ( fileMatched ) {
              fx(s);
            }
          })
        }
      };


      $scope.watchFile = function watchFile(file) {
        if ( $scope.watchingFiles == null ) {
          $scope.watchingFiles = [];
        }
        if ( $scope.watchingFiles.indexOf(file) != -1 ) {
          return false;
        }
        $scope.watchingFiles.push(file);
        window.fxInvoke.includes(file, function (fileMatch) {
          console.log('found match', fileMatch);
          $scope.onReload2()
        })

      };

      /**
       * More abstract ...
       * @param file
       */
      $scope.watchDir = function watchDir(dir) {
        $scope.watchDirs = sh.dv($scope.watchDirs, []);
        if ( $scope.watchDirs.indexOf(dir) != -1 ) {
          return;
        }
        $scope.watchDirs.push(dir);
        //load the file if matched in the dir
        window.fxInvoke.includes(dir, function (file_in_dirMatch) {
          ///Users/user2/Dropbox/projects/learn angular/port3/app/scripts/quick_module/services/uiXService.js

          var loadFile = file_in_dirMatch.split(dir)[1];
          loadFile = dir + '/' + loadFile;
          console.log('found dirMatch', file_in_dirMatch, loadFile);
          $scope.onReload2(loadFile )
        })

      };

      window.fxInvoke.includes('quick/quickreloadable.dir', function (fileMatch) {
        console.log('found match', fileMatch);
        $scope.onReload2();
      })

      $scope.watchFile("/scripts/quick_module/services/reloadableHelperTestService.js")
      //$scope.watchFile("/scripts/quick_module/services/quickUIService.js")
      //$scope.watchFile("/scripts/quick_module/services/angFuncService.js")
      $scope.watchDir("/scripts/quick_module/services/")


      $scope.reloadFile = function reloadFile(file, fx) {
        $scope.watchFile(file)
        console.log('reloadFile', file);
        jQuery.ajax({
          url: file,
          dataType: "script",
          cache: true
        })
          .error(function(s, b) {
            alert('error loading ' +  file)
          })
          .done(function() {
            sh.callIfDefined(fx)
          });
      }

      $scope.onReload = function onReload() {
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


      /*
       Uses template thing
       same as onReload but, ???
       */
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
            alert('error loading ' +  addFile)
          })
          .done(function(s, b) {
            console.log('updated', $cacheFactory)
            $templateCache.removeAll();
            $scope.render()
            //jQuery.cookie("cookie_name", "value", { expires: 7 });
          });
      }

      $scope.triggerRelink = function() {
        $rootScope.$broadcast('testRelink');

      };

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
