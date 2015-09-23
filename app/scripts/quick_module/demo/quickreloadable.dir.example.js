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
                                                          angFunc
  ) {

    window.ddoFxArgs = Array.prototype.slice.call(arguments);

    var utilsParent = transcludeHelper.new(this);
    function link(scope, element, attrs, ctrl, transclude){
      console.warn('link.1');
      $templateRequest('scripts/quick_module/demo/quickreloadable.dir.example.html').then(
        function(html){
          reloadableHelperTestService = reloadableHelperTestService.create();
          quickUI = quickUI.create();
          angFunc = angFunc.create();


          reloadableHelperTestService.alert();
          //alert('...ddd..')
          console.warn('link.2');

          //var utilsParentDict = utils.dictTemplates;
          var utils = transcludeHelper.new();
          utils.dictTemplates = utilsParent.dictTemplates; //copy over dictionary of templates
          utils.$compile = $compile;
          utils.loadTemplate(html, element, attrs);
          scope.render(utils);

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
      console.warn('compiling')
      if ( window.ddoNew != null && repeat == undefined
        && window.ddoNew.runOnce == null ) {
        console.warn('forwarding',tElem, repeat)
        args.push(false)
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
      controller: 'QuickReloadableExampleController',
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
    .directive('quickReloadableExample', quickReloadablelist);

  "<QuickReloadableExampleController/>"

  if ( window.ddo != null ) {


    //Att 5: forward outside of compile method
    var ddo = quickReloadablelist.apply(quickReloadablelist, window.ddoFxArgs)
    //window.ddo.compile = ddo.compile;
    //Attempet 6: forward inside of compile method
    window.ddoNew = ddo;
  }
  var QuickReloadableExampleController = function QuickReloadableExampleController ($scope,
                                                                               transcludeHelper,
                                                                               sh,
                                                                               quickFormHelper,
                                                                               dialogService,
                                                                               pubSub) {
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
    .controller('QuickReloadableExampleController',
    QuickReloadableExampleController);


}());
