//'use strict';

(function(){

  var app = angular.module('com.sync.quick');
  app.config(function ($compileProvider) {
    app.compileProvider = $compileProvider;
  });
  app.config(function ($controllerProvider) {
    app.controllerProvider = $controllerProvider;
  });
  app.config(function ($provide) {
    app.factoryProvider = $provide;
  });

  /*

   var noopDirective = function noOpDir() { return function noOpX() {}; };
   console.log('quick module ', app)
   app.factory('ngPasteDirective', noopDirective);
   */
  /*
   try to replace diretives
   there is 'addDirective' method in angular.js
   */

  function removeItemFromInvokeQueue(targetName, targetType ) {
    var queue = app._invokeQueue;
    $.each(queue.concat(), function removeTarget(i, item) {
      //console.log(i, item, item[1], item[2])
      if ( targetType != null && item[1] != targetType ) {
        return;
      };
      if (item[2][0] == targetName) {
        app._invokeQueue.splice(app._invokeQueue.indexOf(item), 1);
        console.log('removed', item)
      };

    })
  }

  removeItemFromInvokeQueue('quickReloadable', 'directive');
  removeItemFromInvokeQueue('QuickReloadablelistController', 'register');

  console.log('$compileProvider', app.compileProvider, app.controllerProvider)


  if ( app.compileProvider != null ) {

    app.directive = app.compileProvider.directive;
    app.directive = function () {console.log('no directive made')};
    var noopDirective = function noOpDir() { return function noOpX() {}; };
    app.factoryProvider.factory('quickReloadableDirective', noopDirective);
    //console.log('app directive', app.directive)
    app.controller = app.controllerProvider.register;
  }
  //return
  //alert('...dv..')
  /** s
   * Component take data form and data object
   * @param $templateRequest
   * @param $compile
   * @param $interpolate
   * @param transcludeHelper
   * @returns {{scope: {title: string, fxItemSelected: string}, controller: string, controllerAs: string, bindToController: boolean, compile: Function}}
   * @private
   */
  var quickReloadablelist = function quickReloadablelist_($templateRequest,
                                                          $compile, $interpolate,
                                                          transcludeHelper,
                                                          $templateCache,
                                                          reloadableHelperTestService,
                                                          quickUI,
                                                          angFunc,
                                                          xUI
  ) {

    window.ddoFxArgs = Array.prototype.slice.call(arguments);

    var utilsParent = transcludeHelper.new(this);
    function link(scope, element, attrs, ctrl, transclude){
      console.warn('link.1');
      $templateRequest('scripts/quick_module/quick/quickreloadable.dir.html').then(
        function(html){
          reloadableHelperTestService = reloadableHelperTestService.create();

          angFunc = angFunc.create();
          var xUIHelper = xUI.create();

          scope.$on(
            "$destroy",
            function handleDestroyEvent() {
              console.log( 'destroy', angFunc );
              angFunc.disposeAllChains();
            }

          );

          element.on('$destroy', function(){
            //alert('destroyed');
            scope.$destroy();
          })
//return;
          //

          //var down = angFunc.createDS(angFunc.decrementCounter()).log('down');


          /*
           ux.start('#divContents')
           var hilary = ux.newImage();
           */


          /*
           //x.makeCanvas();
           //x.setCSS();
           //x.right = 10
           //x.bottom = 10;
           */
          //angFunc.testDualSources(element);
          //angFunc.createDS(angFunc.sin(0.1)).abs().logx('sin wave')
          //  .bindToUI('#imgHillary', 'opacity', element, true);
          reloadableHelperTestService.alert();
          //alert('...ddd..')
          console.warn('link.2');

          //var utilsParentDict = utils.dictTemplates;
          var utils = transcludeHelper.new();
          utils.dictTemplates = utilsParent.dictTemplates; //copy over dictionary of templates
          utils.$compile = $compile;
          utils.loadTemplate(html, element, attrs);
          scope.render(utils);




          var x = xUIHelper;
          x.startOn('#divOutput2',utils.templateContent)
          x.size('100%')//, '200px')
          x.background('gray');
          x.padding('10px')
          x.makeInnerDiv('#innerDiv', 'hello world');
          //x.margin('10px')
          x.size('100%', '100%');
          x.background('red');


          x.makeInnerDiv('#output1Val', 'output here')
          x.setElement();
          x.makeInnerDiv('#chainOutput', 'chain here')
          x.a('layout', 'row');
          x.setElement();
          x.makeAbsContainer();

          x.makeInnerDiv('#paper', 'chain here')
          angFunc.createDS(angFunc.sin(0.1)).decimals(2).abs().logx('sin wave')
            .bindToUI('#output1Val', 'html', element, false)
            .threshold(0.3, 'gt', false, function toggleLight(){
              scope.lb1.toggle();

            })
            .makeCache('lastVals', {
              count:5,
              fxOverflow:function removedItem(el) {
                var root = element.find('#chainOutput');
                $(el).remove();
                //  debugger
                //  root.remove($(el));

              },
              fxAdd:function addItem(item, h) {
                var root = element.find('#chainOutput');
                var el = $('<div />')
                el.html(item)
                root.append(el);


                var x = xUI.create();
                x.startOn(el)
                x.background('#f7f7f7');
                x.padding('10px')
                x.margin('10px', null, null, null)
                x.size.min( '60px');
                //h.dataCache.add(el)

                return el;
              }
            })
            //.fx(function addToCache(val){

            //})
            .addToCache('lastVals')



          function lb() {
            var self = this;
            var p = this;

            p.init = function () {
              var x = xUI.create();
              x.startOn('#divOutput2',utils.templateContent);
              x.makeAbsContainer();
              x.addImage('scripts/quick_module/bulb_PNG1251.png');
              x.makeAbs();
              x.size(null,'40px');
              x.positionAbs(null, 0, 0,null);
              self.x = x;
              self.element = x.element;
              self.lightOn= true;
            }
            p.off = function off() {
              if ( self.lightOn == false ) {
                return
              }
              self.lightOn = false;
              self.x.css('opacity', '0.2')
            }
            p.on = function on() {
              if ( self.lightOn == true ) {
                return
              }
              self.lightOn = true;

              self.x.css('opacity', '1')
            }
            p.toggle = function toggle() {
              // self.lightOn = ! self.lightOn
              if ( self.lightOn == false ) {
                self.on();
              } else {
                self.off();
              }
            }
          }

          var lb1 = new lb();
          lb1.init();
          scope.lb1 = lb1;

          angFunc.createDS(angFunc.sin(0.1))//.decimals(2)
            .abs().logx('sin wave')
            .fx(function(val){
              console.log('x...', val)
              scope.lb1.x.x(val*100,'%')
            })
            //.endAt(1)
          //.oneRun(1);



          var x = xUI.create();
          x.startOn('#divOutput2',utils.templateContent)
          x.size('100%', '150px')//,'40px');


          x.makeInnerDiv('#containerPanel' );
          x.css({'border-radius': '4px',
            'margin-bottom': '16px',
            'position': 'relative' })
          x.class('md-whiteframe-z1')
          x.storeTop();
          //x.setElement();

          x.add('md-toolbar')
            .div()
            .class('md-toolbar-tools')
            .content('Title');

          x.goToTop();
          x.add('md-content')
            .attr('flex', null)
            // .class('md-toolbar-tools')
            .content('Title');

          function Panel() {
            var self = this;
          }
          Panel.p = Panel.prototype;
          Panel.p.init = function initPanel(name, content) {
            var x = xUI.create();
            x.startOn('#divOutput2',utils.templateContent)
            x.size('100%', '150px')//,'40px');
            x.makeInnerDiv('#containerPanel' );
            x.css({'border-radius': '4px',
              'margin-bottom': '16px',
              'position': 'relative' })
            x.class('md-whiteframe-z1')
            x.storeTop();
            //x.setElement();

            x.add('md-toolbar')
              .div()
              .class('md-toolbar-tools')
              .content(name);

            x.goToTop();
            x.add('md-content')
              .attr('flex', null)
              // .class('md-toolbar-tools')
              .content(content);
          }


          var p = new Panel();
          p.init('title', 'content')



          function createGraph() {
            var graph = new joint.dia.Graph();

            var paper = new joint.dia.Paper({
              el: $('#paper'),
              width: 1000,
              height: 600,
              gridSize: 10,
              model: graph
            });


            var source = new joint.shapes.basic.Rect({
              position: { x: 50, y: 50 },
              size: { width: 140, height: 70 },
              attrs: {
                rect: {
                  fill: {
                    type: 'linearGradient',
                    stops: [
                      { offset: '0%', color: '#f7a07b' },
                      { offset: '100%', color: '#fe8550' }
                    ],
                    attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
                  },
                  stroke: '#ed8661',
                  'stroke-width': 2
                },
                text: {
                  text: 'Source',
                  fill: '#f0f0f0',
                  'font-size': 18,
                  'font-weight': 'lighter',
                  'font-variant': 'small-caps'
                }
              }
            });

            var target = source.clone().translate(750, 400).attr('text/text', 'Target');

            var link = new joint.dia.Link({
              source: { id: source.id },
              target: { id: target.id },
              router: { name: 'manhattan' },
              connector: { name: 'rounded' },
              attrs: {
                '.connection': {
                  stroke: '#333333',
                  'stroke-width': 3
                },
                '.marker-target': {
                  fill: '#333333',
                  d: 'M 10 0 L 0 5 L 10 10 z'
                }
              }
            });

            var obstacle = source.clone().translate(300, 100).attr({
              text: {
                text: 'Obstacle',
                fill: '#eee'
              },
              rect: {
                fill: {
                  stops: [{ color: '#b5acf9' }, { color: '#9687fe' }]
                },
                stroke: '#8e89e5',
                'stroke-width': 2
              }
            });

            var obstacles = [
              obstacle,
              obstacle.clone().translate(200, 100),
              obstacle.clone().translate(-200, 150)
            ];

            graph.addCells(obstacles).addCells([source, target, link]);

            link.toBack();

            graph.on('change:position', function(cell) {

              // has an obstacle been moved? Then reroute the link.
              if (_.contains(obstacles, cell)) paper.findViewByModel(link).update();
            });

            $('.router-switch').on('click', function(evt) {

              var router = $(evt.target).data('router');
              var connector = $(evt.target).data('connector');

              if (router) {
                link.set('router', { name: router });
              } else {
                link.unset('router');
              }

              link.set('connector', { name: connector });
            });
          }
          createGraph();

          scope.$watch('vm.config',
            function (v, oldVal) {
              if ( v != null ) {
                v.fxRefresh = function refreshQuickReloadableList() {
                  //utilsParent.debug('inside fxrefresh')
                  console.log('debug inside fxresfresh')
                  scope.render();
                }

                v.onSettings = function () {
                  scope.onSettings();
                }
              }
              if ( oldVal == null ) {
                return;
              }
              console.log('quickform.vm.config',
                'scope.vm.dataObject... changed: ')

              scope.render();
            });
        }

      )

    };

    var compile = function (tElem, attrs, repeat) {
      var args = Array.prototype.slice.call(arguments);
      console.warn('compiling');
      if ( window.ddoNew != null && repeat == undefined
        && window.ddoNew.runOnce == null ) {
        console.warn('forwarding',tElem, repeat);
        args.push(false);
        window.ddoNew.runOnce = true;
        return window.ddoNew.compile.apply(this, args);
      }

      utilsParent.storeTemplate(tElem, attrs);
      utilsParent.reloadTemplate = tElem.clone();
      //alert('defined ddo')
      function defineDirectiveDefaults() {
        if ( attrs.selectedIndex === null  ) {
          attrs['selectedIndex'] = "-1";
        };
        //utils.defaultAttr('dataObject', "{}", attrs);
      }
      defineDirectiveDefaults();
      console.warn('compile.2');
      return {
        pre: function(scope, element, attrs, controller, transclude){
          console.log('transclude', transclude)
          return;
        },
        post: link
      };
    }
    var ddo = {
      scope: {
        config:'=',
        refresh: '='
      },
      controller: 'QuickReloadablelistController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile,
    };

    console.log('defined ddo')
    //compromise
    window.ddo = ddo;
    return ddo;
  };

  app
    .directive('quickReloadable', quickReloadablelist);

  if ( window.ddo != null ) {


    //Att 5: forward outside of compile method
    var ddo = quickReloadablelist.apply(quickReloadablelist, window.ddoFxArgs)
    //window.ddo.compile = ddo.compile;
    //Attempet 6: forward inside of compile method
    window.ddoNew = ddo;
  }
  var QuickReloadablelistController = function
    QuickReloadablelistController_ ($scope,
                                    transcludeHelper,
                                    sh,
                                    quickFormHelper,
                                    dialogService,
                                    pubSub,
                                    quickUI) {
    //alert('...dddh')
    var pubSub = pubSub.create();

    pubSub.subscribe('no', function onNo(arg){
      console.log('who is saying no?', arg)
    })

    pubSub.publish('no', 'ia am')
    var config = $scope.vm.config;
    if ( config == null ) { config = {} };

    this.$scope = $scope;

    $scope.onSaveList = function saveFormData(fxSave2) {
      sh.callIfDefined(config.fxSave,
        $scope.textContents, $scope.taskList)
    }


    $scope.onCancelList = function cancelFormData() {
      sh.callIfDefined(config.fxCancel,
        $scope.textContents, $scope.taskList)
    }

    $scope.onChangeText = function onChangeText(fromUI) {
      if ( fromUI ){
        clearInterval($scope.timerUpdateLater);
        $scope.timerUpdateLater = setInterval(onChangeText, 500, false);
        return;
      }
      console.log('update')
      clearInterval($scope.timerUpdateLater);
      //console.log('changed', $scope.textContents)
      $scope.changeText($scope.textContents)
    }

    $scope.onChangeList = function onChangeList() {
      //console.log('changed', $scope.textContents)
      var newStr = $scope.changeItems($scope.taskList);
      $scope.textContents = newStr;
      //$scope.changeText(newStr, false)
      sh.callIfDefined(config.fxChange, newStr);
    }

    $scope.render = function render( utils ) {
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

      var dictTypes = {};
      var dictAttrs = {};

      dictTypes['t']={changeTo:'textarea', addHTML:'<checkbox>', addClass:'textarea_class'};
      dictTypes['tx']={changeTo:'div', addHTML:'<checkbox>', addClass:'textarea_class'};
      dictAttrs['prettybtn']={addClass:'mbButton marty'};
      dictAttrs['makeredbtn']={ifVal:true, addClass:'redbtn', addHTML:'<span>red btn</span>'};

      quickUI = quickUI.create();
      var q = new quickUI.QuickUIConvertor()
      //var children = utils.templateContent.find('*');
      q.process(utils.templateContent, dictTypes, dictAttrs)


      var listAllTasks = utils.templateContent.find('#col2_list');
      var ngRepeat = listAllTasks.find('li').attr('ng-repeat');
      listAllTasks.find("li").attr('ng-repeat',
        ngRepeat + " | filter:dyanmicFilterForIncomplete");

      var listComplete = listAllTasks.clone();
      //var ngRepeat = listComplete.find('li').attr('ng-repeat')
      listComplete.find('li').attr('ng-repeat', ngRepeat + "| filter:{complete:true} "
        //" | filter:dyanmicFilterForIncomplete")
      );

      listComplete.attr('ng-show', "settings.showCompletedSeperate==true");
      listComplete.attr('id',  listComplete.attr('id')+'_'+'completed');

      utils.templateContent.find('#col2').append(
        listComplete
      )






      var config = $scope.vm.config;

      config = sh.dv(config, {});
      $scope.settings = sh.dv(config.settings, {"showSettingsButton":true});


      var list = config.list;
      var defaultList = ['Ho', 'Torr', 'Running Errand', 'Remove Cable']
      list = sh.dv(list, defaultList)

      var defaultString = '|x| went fishing' + "\n"
      defaultString += '|| went home' + "\n"
      defaultString += '| | went home 5 times' + "\n"
      defaultString += ' eat out home' + "\n"
      defaultString += '-- go to movies' + "\n";
      var txtString = null;

      console.log('....', txtString)

      if ( scope.vm.config != null ) {
        txtString = scope.vm.config.data;
      }

      txtString = sh.dv(txtString, defaultString)

      $scope.changeText = function changeText(txt, changeList) {

        var newStr = '';
        var spli = txt.split('\n');
        var cfgSplit = {};
        cfgSplit.str = txt;
        cfgSplit.trim = true
        cfgSplit.fxProc = function processLine(line) {
          var item = {};
          if ( cfgSplit.includes('|x|') ) {
            item.complete = true;
          }
          cfgSplit.remove('|x|')
            .remove('||')
            .remove('|_|')
            .remove('| |')
          line = cfgSplit.line.trim();
          item.name = line
          return item;
        }

        var items = sh.each.lines(cfgSplit);
        if ( changeList != false ) {
          newStr = $scope.changeItems(items);
          $scope.taskList = items;
        }
        console.log('items', items)
        $scope.textContents = newStr

      };

      $scope.changeItems = function changeItems(items) {
        var newStr = '';
        var list = []
        sh.each(items, function (i,task) {
          var strTask = '';
          if ( task.complete ) {
            strTask += '|x| '
          } else {
            strTask += '|_| '
          }
          strTask += task.name
          list.push(strTask)
        })
        newStr = list.join(sh.n)
        //$scope.textContents = newStr
        return newStr;
      };

      $scope.changeText(txtString);

      html = utils.getFinalTemplate();
      element.html($compile(html)(scope));


      $scope.bringToTop = function bringToTop(task) {
        var index = $scope.taskList.indexOf(task)
        $scope.taskList.splice(index,1);
        $scope.taskList.unshift(task);
        $scope.onChangeList();
      }

      $scope.dyanmicFilterForIncomplete =
        function dyanmicFilterForIncomplete (value, index, array ) {
          if ( $scope.settings.showCompletedSeperate ) {
            if ( value.complete != true )
              return true;
            else
              return false;
          }
          return true;
        }
      $scope.filterForX =function filterForX (value, index, array ) {
        if ( index < 3) {
          return true;
        }
        return false;
      }



      function setupDialog() {
        //var el = $scope.element;
        var opts = {}
        opts.name = 'dialogSettings';
        opts.title = 'dialogSettings'
        opts.content = 'test'
        opts.contentJquery = element.find('#containerSettings');
        $scope.dlg = opts.contentJquery;
        opts.position = {}

        $scope.dlgSettings = opts;
        //opts.position.right = 0;
        //opts.position.top = 0;
        //opts.noWrap = true;
        dialogService.createDialog2(opts);

        $scope.onSettings = function onSettings() {
          console.log('..')
          dialogService.openDialog(opts);
        };

        var quickFormConfig = {};
        var qFC ={};
        quickFormConfig = qFC;
        var qf = quickFormHelper.new();
        var formObject = {};
        qf.loadForm(formObject);
        qf.addLabel('Settings')
        //qFC.showDebug = true;
        qf.addCheckbox('showCompletedSeperate', 'Completed tasks below');
        qf.addCheckbox('showBringToTop', 'Show bring to top');
        qf.defaultValue(true);

        qf.addCheckbox('showViewSwitcher', 'Show user view switch');
        qf.defaultValue(true);

        qf.addCheckbox('showBottomRow', 'Show footer panel');
        qf.defaultValue(true);
        qf.addCheckbox('showSettingsButton', 'Show settings button');
        qf.defaultValue(true);

        qf.loadConfig(qFC);
        qf.onFieldChanged("showBottomRow", function(s){
          console.log('changed bottom row');
        });

        qFC.fxCancel = function () {
          dialogService.openDialog($scope.dlgSettings);
        }
        qFC.formObject = formObject;
        qFC.dataObject = $scope.settings;
        $scope.settingsForm = qFC;

      }
      setupDialog();


      function defineControls(){
        $scope.settings.showTextList = true;


        $scope.onText = function onText() {
          $scope.settings.showText = ! $scope.settings.showText;
        };
        $scope.onOrateList = function onOrateList() {
          $scope.settings.showList = ! $scope.settings.showList;
        };
        $scope.onTextList = function onTextList() {
          $scope.settings.showTextList = ! $scope.settings.showTextList;
        };
      }

      defineControls();


    }
  }
  app
    .controller('QuickReloadablelistController',
    QuickReloadablelistController);


}());
