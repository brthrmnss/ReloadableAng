'use strict';

/**
 * @ngdoc function
 * @name 74App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 74App
 */
angular.module('74App')
  .controller('LoggerCtrl', function ($scope, appAreaService, /*quickRouter,*/ $timeout) {

    var ctrl = this;
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    ctrl.name = 'test name'

    var imagePath = 'https://material.angularjs.org/img/list/60.jpeg';
    $scope.menuItems = [
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
    ];

    $scope.onSelectMenuItem = function menuItemChanged(item) {
      console.log('tab menu item changed', item);
      var viewDef = $scope.viewDefs[item.name.toString().toLowerCase()];
      appAreaService.open('mainContentArea', viewDef);
      //quickRouter.addToState('tab', item.name, true, 'Tab: '+item.name);
      $scope.selectedTab = find($scope.tabItems, 'name', item.name);//will this cause a loop?
      $timeout(function () {
        appAreaService.open('mainContentArea', viewDef);
      }, 500);
    }

    $scope.onSelectLeftSideItem = function onSelectLeftSideItem(item) {
      console.log('menu item changed', item)
    }

    ctrl.viewDefs = {
      a: 'dom:#viewA',
      campaigns: 'dom:#viewCampaigns',
      ads: 'dom:#viewAds',
      settings: 'dom:#viewSettings'
    }

    ctrl.viewLogConfig = {
      quickForm:{
        formObject:{},
        dataObject:{}
      }
    }
    var formObject = {};
    ctrl.viewLogConfig.quickForm.formObject = formObject;

    formObject.firstName = {};
    formObject.lastName = {};
    formObject.product = {type:'select',
      options:[
        {name:'Forex', value:'forex'},
        {name:'Forex2', value:'forex2'},
      ]}
    formObject.product2 = {type:'radio',
      options:[
        {name:'Forex', value:'forex'},
        {name:'Forex2', value:'forex2'},
      ]}


    ctrl.viewPromptsList = {
      quickCrud:{
        showEditor:false
      }
    }




    $scope.menuItems2 = [
      {
        face : imagePath,
        what: 'Brunch this weekend1?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend3?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
    ];


    var utils = {};
    utils.createMenu = function createItems(items) {
      var results = [];
      for ( var i = 0; i < items.length ; i++) {
        var item = items[i];
        var obj = {}
        obj.name = item;
        results.push(obj);
      }
      return results;
    }

    $scope.menuItems3 = utils.createMenu(['Clack', 'Photo Filter', 'Battery Saver', 'Boston App', 'Splash of Flans']);


    $scope.tabItems = utils.createMenu(['Analytics', 'Campaigns', 'Ads', 'Settings']);


    $scope.navMenuItems = utils.createMenu(['Download SDK', 'faq', 'documentation', 'my account']);




    $scope.tileItems = [
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      }

    ];
    $scope.tileItems = buildGridModel({
      icon : "avatar:svg-",
      title: "Svg-",
      background: ""
    });
    function buildGridModel(tileTmpl){
      var it, results = [ ];
      for (var j=0; j<11; j++) {
        it = angular.extend({},tileTmpl);
        it.icon  = it.icon + (j+1);
        it.title = it.title + (j+1);
        it.span  = { row : 1, col : 1 };
        switch(j+1) {
          case 1:
            it.background = "red";
            it.span.row = it.span.col = 2;
            break;
          case 2: it.background = "green";         break;
          case 3: it.background = "darkBlue";      break;
          case 4:
            it.background = "blue";
            it.span.col = 2;
            break;
          case 5:
            it.background = "yellow";
            it.span.row = it.span.col = 2;
            break;
          case 6: it.background = "pink";          break;
          case 7: it.background = "darkBlue";      break;
          case 8: it.background = "purple";        break;
          case 9: it.background = "deepBlue";      break;
          case 10: it.background = "lightPurple";  break;
          case 11: it.background = "yellow";       break;
        }
        results.push(it);
      }
      return results;
    };


    $scope.onSaveFormData = function (data){
      console.log('fxFormSaved', data);
    };


    /*
     quickRouter.fxUpdateFromRoute = function(qs) {
     if ( qs.tab != null ) {
     $scope.selectedTab = find($scope.tabItems, 'name', qs.tab)
     }
     }
     */

    $scope.selectedTab = {};
    $scope.onTestSetSelectedTabToCampaign = function onTestSetSelectedTabToCampaign() {
      console.log('onSetSelected');
      $scope.selectedTab = find($scope.tabItems, 'name', 'Campaigns');
    };

    function find(items, prop, val ) {
      for (var i = 0, len = items.length; i < len; i++) {
        //lookup[array[i].id] = array[i];
        if ( items[i][prop]==val ) {
          return items[i]
        }
      }
      return null;
    }


    //$scope.testAnalytic = {};
    var tA = {};

    var yellow = '#F3DF76';
    var red = '#C93C50';
    var green = '#A1CC85';
    var orange = '#EC8A4A';

    tA.total = 8989;
    tA.name = 'test ta'
    tA.days = 5;
    tA.sets = [
      {name:'engaged', count:1608, color:green},
      {name:'new', count:10763, color:yellow},
    ]



    $scope.testAnalytic = tA;


    $scope.analytics = [];

    var dummyData = {}
    dummyData.createAnalytic = function (days, eng, new_, dor, one) {
      var tA = {};
      tA.total = 8989;
      tA.name = 'test ta'
      tA.days = days;
      tA.sets = []
      if ( eng != 0 ) {
        var tS = {name:'engaged', count:eng, color:green}
        tA.sets.push(tS);
      }
      function addSet(name, count, color ) {
        if ( count == 0 || count == null  ){
          return;
        }
        var tS = {name:name, count:count, color:color}
        tA.sets.push(tS);
      }
      addSet('new', new_, yellow);
      addSet('dormants', dor, orange);
      addSet('one time', one, red);

      return tA;
    }


    $scope.analytics = [
      dummyData.createAnalytic(3, 1608, 10783),
      dummyData.createAnalytic(7, 2721, 9650),
      dummyData.createAnalytic(14, 3587,247,2845,4968),
      dummyData.createAnalytic(30, 4082,0, 2226,5072),
      dummyData.createAnalytic(90, 2969,0,4701,5196)

    ];





  });



