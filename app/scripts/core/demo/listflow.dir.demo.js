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
  var listFlowDemo = function listFlowDemo($templateRequest, $compile, $interpolate, transcludeHelper) {

    var utils = transcludeHelper.new();



    function link(scope, element, attrs){
      $templateRequest('scripts/core/demo/listflow.dir.demo.html').then(
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
      controller: 'ListFlowDemoController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('listFlowDemo', listFlowDemo);

  var ListFlowDemoController = function ListFlowDemoController ($scope, $rootScope,
                                                                dialogService) {
    this.$scope = $scope;


    //open quickform here
    //

    var demoHelper = {};
    demoHelper.createData = function createData(items){
      var results = [];
      if ( items == null ) {
        items = [1,3,6,8,12,14,15];
      }
      var pos = 0;
      for ( var i = 0; i < items.length ; i++) {
        var item = items[i];
        var obj = {};
        obj.name = 'item '+i;
        obj.start = item;
        pos+=8;
        obj.end = pos;
        pos += 1;
        results.push(obj);
      }
      return results;
    };


    demoHelper.getRandomValue =
      function getRandomValue(items){
        var item = items[Math.floor(Math.random()*items.length)];
        return item;
      };
    demoHelper.chance = function chance(percent) {
      if ( percent == null) { percent = 0.5}
      if ( Math.random() > percent) {
        return true
      }
      return false;
    }

    var areaClasses = ['areaYellow',
      'areaBlue', 'areaRed', 'areaGreen', 'areaPurple'];

    demoHelper.createDataRandom = function createDataRandom(items){
      var results = [];
      if ( items == null ) {
        items = [1,3,6,8,12,14,15];
      }
      var pos = 0;
      pos+=Math.random()*6;
      var lastItem = null;
      for ( var i = 0; i < items.length ; i++) {
        var item = items[i];
        var obj = {};
        obj.name = 'item '+i;
        obj.start = pos;
        pos+=Math.random()*6;
        obj.end = pos;
        pos+=Math.random()*3;
        pos += 1;

        obj.addClass = demoHelper.getRandomValue(areaClasses)
        if (lastItem) {
          //add filler gray
          var filler = {};
          filler.icon = 'warning'
          filler.gicon = 'record'
          filler.addClass = 'areaOutspace';
          if ( Math.random() > 0.5) {
            filler.width = true;
          }
          if ( demoHelper.chance(0.3) ) {
            filler.markout = true;
          }

          filler.start = lastItem.end;
          filler.end = obj.start;
          results.push(filler);
        }

        //make below list
        if ( demoHelper.chance() ) {
          var belowListItem = {};
          belowListItem = JSON.parse(JSON.stringify(obj))
          belowListItem.belowList = true;
          if ( demoHelper.chance() ) {
            belowListItem.end += Math.random()*3;
          }
          results.push(belowListItem);
        }

        if ( demoHelper.chance(0.25) ) {
          obj.aboveLine = true;
          if ( belowListItem != null ) {
            results.pop();
          }
        }

        results.push(obj);
        lastItem = obj;
      };
      return results;
    };

    $scope.items = demoHelper.createData();

    $scope.items_concerns = [
      {name:'Disabled offline',
        start:1,
        addClass:'divHatched',
        end:30}
    ]

    $scope.items2 = demoHelper.createData([2,8,11,15,25,35,45,80,120]);
    // demoHelper.addProp($scope.items2, 'addClass', ['areaPurple', 'areaGreen']);
    $scope.items2[2].addClass = 'areaYellow';

    var lblDay = 0; //Tracks day
    $scope.fxLabel = function createLabel(index) {
      var result = {};
      if ( index % 12 == 0 || lblDay == 0 ) {
        lblDay+=1;
        result.label = 'New Day '+lblDay;
        result.row2Tick = true;
      }
      result.addTick = true;
      return result;
    };


    $scope.items3 = demoHelper.createDataRandom();
    $scope.items4 = demoHelper.createDataRandom();

    $scope.addTo4= function (item) {
      console.log('...', $scope.items4.length);
      $scope.items4 = $scope.items4.concat(demoHelper.createDataRandom());
      console.log('...', $scope.items4.length);
    };

    var config = {};
    $scope.config = config;
    config.onClickItem = function (item) {
      console.log('on click item', item);
      $scope.dataObject4 = item;
      //$scope.vm.dataObject4 = item;
      $scope.$apply();
    };



    var crudConfig = {};
    $scope.crudConfig = crudConfig;
    crudConfig.fxChange = function fxChange(item) {
      console.log('changed', item);
      $scope.updateFlag = ! $scope.updateFlag;
    }
    crudConfig.test = 'a';
    crudConfig.btnRowNoCenter = true;

    $scope.updateFlag = false;

    $scope.createItem = function (item) {
      console.log('...', item);
      //  $scope.items4 = $scope.items4.concat(demoHelper.createDataRandom());
      console.log('...', item);
      $scope.items4 = $scope.items4.concat([]);
      $scope.updateFlag = ! $scope.updateFlag;
      //crudConfig.refresh();
      calcRangeStats();
    };

    $scope.onAddItem = function () {
      //$scope.showPopup();
      $scope.addTo4();
    }



    function calcRangeStats() {
      var rangeStats = {};
      $scope.rangeStats = rangeStats;

      var allItems = [].concat($scope.items,
        $scope.items2,
        $scope.items3,
        $scope.items4
      )


      var result = {}
      allItems.sort(function(a, b){
        return a.start > b.start;
      });

      var first = allItems[0]
      var last = allItems.slice(-1);
      rangeStats.rangeStart =first.start;
      rangeStats.rangeEnd = last.start;

      rangeStats.count = function ( prop, val ) {
        var count = 0;
        for ( var i = 0; i < allItems.length ; i++) {
          var item = allItems[i];
          if ( item[prop]==val ) {
            count++;
          }
        }
        return count;
      }

      rangeStats.blue = rangeStats.count('class', 'areaBlue');
      rangeStats.aboveLine = rangeStats.count('aboveLine', true);

      var statsConfig = {};
      $scope.statsConfig = statsConfig;

      statsConfig.title = 'Planned Statistic: '
      statsConfig.cols = {};
      statsConfig.cols.clearBlue = rangeStats.blue;
      statsConfig.cols.aboveLine = {label:'Above Line',
        className: 'txt-earnings',
        value:rangeStats.aboveLine};

      statsConfig.columns = true;

    }
    calcRangeStats();


    function defineActions() {
      $scope.editItem= function (item,event) {
        $scope.currentItem = item;
      }




      var formObject2 = {};
      $scope.formObject2 = formObject2;
      formObject2.name = {label:'Name'};
      formObject2.start = {
        label:'Start Date',
        type:'stepper',
        min:0,
        max:3000
      };
      formObject2.end = {
        label:'End Date',
        type:'stepper',
        min:0,
        max:3000
      };
      formObject2.addClass = {
        label:'Project Type Status',
        hideLabel:true,
        options:'Passive,areaBlue;Error,areaRed;OK,areaGreen;'+
        'Purple Status,areaPurple; Warning,areaYellow',
        type:'select',
        disabledIf:[
          'obj.belowList==true',
          'obj.markout==true',
        ]
      };
      formObject2.belowList = {
        label:'Below List',
        type:'boolean',
      };
      formObject2.markout = {
        label:'markout',
        type:'boolean',

      };
      formObject2.aboveLine = {
        label:'Above line',
        type:'boolean',
      };
      formObject2.icon = {
        label:'Icon',
        type:'text',
      };

      var dataObject2 = {};
      $scope.dataObject4 = dataObject2
      dataObject2.first_name = 'Data';
      dataObject2.start = 1500
      dataObject2.last_name = 'Object 2';

      setTimeout(function setupDialog() {
        var opts = {}
        opts.elementQuery = '#itemDialog'
        opts.name = 'itemDialog';
        opts.title = 'test'
        opts.content = 'test'
        opts.contentJquery = angular.element('#itemDialog');

        opts.position = {}
        opts.position.right = 0;
        opts.position.top = 0;

        opts.move = false;

        dialogService.createDialog2(opts);
        dialogService.openDialog(opts);

        $scope.dlg = opts;

        $scope.showPopup = function showPopup() {
          dialogService.openDialog(opts);
        }


      }, 1000);
    }
    defineActions()

  }

  app
    .controller('ListFlowDemoController', ListFlowDemoController);


}());
