'use strict';


var app = angular.module('74App');
app.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $log.debug('close');
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close LEFT is done");
      });
  };
})
/**
 * @ngdoc function
 * @name 74App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 74App
 */
angular.module('74App')
  .controller('MainCCCtrl', function ($scope, appAreaService, quickRouter, $timeout, $document) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.name = 'test name prop';


    $document.ready(function() {
      // Get the context of the canvas element we want to select
      var ctx = document.getElementById("myChart").getContext("2d");
      var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      };

      var options = {

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,

        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

      };
      var myLineChart = new Chart(ctx).Line(data, options);
    })


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
      quickRouter.addToState('tab', item.name, true, 'Tab: '+item.name);
      $scope.selectedTab = find($scope.tabItems, 'name', item.name);//will this cause a loop?
      $timeout(function () {
        appAreaService.open('mainContentArea', viewDef);
      }, 500);
    }

    $scope.onSelectLeftSideItem = function onSelectLeftSideItem(item) {
      console.log('menu item changed', item)
    }

    $scope.viewDefs = {
      analytics: 'dom:#viewAnalytics',
      campaigns: 'dom:#viewCampaigns',
      ads: 'dom:#viewAds',
      settings: 'dom:#viewSettings'
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
    };

    utils.addToItems = function addToItems(items, prop, values) {
      for ( var i = 0; i < items.length ; i++) {
        var item = items[i];
        var val = values[i];
        item[prop] = val;
      }
      return items;
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



    quickRouter.fxUpdateFromRoute = function(qs) {
      if ( qs.tab != null ) {
        $scope.selectedTab = find($scope.tabItems, 'name', qs.tab)
      }
    }

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



    $scope.hideApp = function hideApp() {
      angular.element('#holderMainApp').hide();
    };

    $scope.hideImg = function hideApp() {
      angular.element('#backgroundImage').hide();
    };


    $scope.lorem = function lorem(count) {
      var results = '';
      for ( var i = 0; i < count; i++) {
        results += ' '+ 'loren imsum'
      }
      return results;
    }




    var sideNavMenu2Items = utils.createMenu(['Download SDK', 'faq', 'documentation', 'my account']);
    utils.addToItems(sideNavMenu2Items, 'icon', ['glyphicon-send',
      'glyphicon-earphone', 'glyphicon-thumbs-up', 'glyphicon-inbox']);
    $scope.sideNavMenu2Items = sideNavMenu2Items;


  });



