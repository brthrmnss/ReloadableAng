'use strict';

(function(){

  var app = angular.module('com.sync.quick');


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
  var quickPaginationDemo = function quickPaginationDemo($templateRequest, $compile, $interpolate, transcludeHelper) {

    var utils = transcludeHelper.new();

    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/demo/quickPagination.dir.demo.html').then(
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
          console.log('html output', html)
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
      controller: 'quickPaginationDemoController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('quickPaginationDemo', quickPaginationDemo);

  var quickPaginationDemoController =
    function quickPaginationDemoController ($scope,
                                            $restHelper,
                                            workChain,
                                            sh
    ) {
      this.$scope = $scope;
      var restHelper

      var pg = {}
      $scope.paginatorConfig = pg;

      function startTest() {

        var token = {};
        var t = workChain.create(token);
        //define resthelper
        function defineRestHelper() {
          var rHC = {}
          var inMemory = false;
          if (inMemory) {
            rHC.dataSrc = t;
          } else {
            rHC.url = 'http://10.211.55.4:10001/api/promptlog'
          }
            restHelper = $restHelper.create(rHC);
          t.cb();
        }
        t.add(defineRestHelper)

        function count(token_, cb) {
          restHelper.count({}).success(
            function onCounted(count) {
              if ( count < 10 ) {
                create100(cb)
              } else {
                cb();
              }
            }

          )
        }
        t.add(count)
        //get count
        //restHelper.count().success(testIf10)
        function createItem() {
          restHelper.create({name:'Pname ' + i})
            .success(function onGo(o){
              create100Chain.cb();
            });
        };
        //if < 10, make 100
        function create100(fx) {
          var create100Chain = workChain.create({fxDone:fx});
          for ( var i =0; i < 100; i++) {

            create100Chain.add(createItem);
          };
          create100Chain.add(count);
        }
        //count


        t.add(function getFirstPage(){
          restHelper.list2(0,10,{}).success(
            function (items) {
              console.log('first page', items);
              sh.each.print(items, 'name')
              t.cb();
            }
          )
        })


        t.add(function getSecondPage(){
          restHelper.pageNext().success(
            function (items) {
              console.log('2nd page', items);
              sh.each.print(items, 'name')
              pg.paginator = restHelper.paginator;
              pg.restHelper = restHelper;
              pg.fxRefresh();

              restHelper.fxListResults = function results(objs) {
                pg.paginator = restHelper.paginator;
                pg.restHelper = restHelper;
                pg.fxRefresh(objs);
              }

              t.cb();
            }
          )
        })

      }

      startTest();



    }

  app
    .controller('quickPaginationDemoController', quickPaginationDemoController);


}());
