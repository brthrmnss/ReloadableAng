//'use strict';

(function(){

  var app = angular.module('com.sync.quick');

  /**
   * Component take data form and data object
   * @param $templateRequest
   * @param $compile
   * @param $interpolate
   * @param transcludeHelper
   * @returns {{scope: {title: string, fxItemSelected: string}, controller: string, controllerAs: string, bindToController: boolean, compile: Function}}
   * @private
   */
  var quickChecklist = function quickChecklist_($templateRequest, $compile, $interpolate, transcludeHelper) {

    var utilsParent = transcludeHelper.new(this);

    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/quick/quickchecklist.dir.html').then(
        function(html){
          //var utilsParentDict = utils.dictTemplates;
          var utils = transcludeHelper.new();
          utils.dictTemplates = utilsParent.dictTemplates; //copy over dictionary of templates
          utils.$compile = $compile;
          utils.loadTemplate(html, element, attrs);

          scope.render(utils);

          scope.$watch('vm.config',
            function (v, oldVal) {
              if ( v != null ) {
                v.fxRefresh = function refreshQuickCheckList() {
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

    var controllerReference = null;
    var compile = function (tElem, attrs) {
      utilsParent.storeTemplate(tElem, attrs);
      function defineDirectiveDefaults() {
        if ( attrs.selectedIndex === null  ) {
          attrs['selectedIndex'] = "-1";
        };
        //utils.defaultAttr('dataObject', "{}", attrs);
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
        config:'=',
        refresh: '='
      },
      controller: 'QuickChecklistController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };
  app.directive('quickChecklist', quickChecklist);

  var QuickChecklistController = function QuickChecklistController_ ($scope,
                                                                     transcludeHelper,
                                                                     sh,
                                                                     quickFormHelper,
                                                                     dialogService,
                                                                     pubSub) {

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
    .controller('QuickChecklistController',
    QuickChecklistController);


}());
