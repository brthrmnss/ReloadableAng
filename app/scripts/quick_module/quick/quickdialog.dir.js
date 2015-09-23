'use strict';

(function(){

  var app = angular.module('com.sync.quick');
  var quickDialog = function quickDialog_($templateRequest, $compile, $interpolate,
                                          transcludeHelper, dialogService) {

    var utils = transcludeHelper.new();;

    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/quick/quickdialog.dir.html').then(
        function(html){
          var ctrl = scope.vmC;
          var templateContent = angular.element(html);
          utils.templateContent = templateContent;
          utils.userTemplateContent = templateOriginal;
          utils.userTemplateContent = dictTemplates[attrs.title]
          utils.userContent = element;

          if ( attrs.testButton != false && attrs.testButton != 'false'  ) {
            utils.templateContent.find('#testArea').show()
          }

          var dialogContent = utils.userTemplateContent.find('template');
          if ( dialogContent != null ) {
            //dialogContent = dialogContent.children();
            dialogContent = dialogContent[0];
            dialogContent = dialogContent.innerHTML;
          }
          scope.template = dialogContent;

          html = utils.templateContent[0];

          element.append($compile(html)(scope));

          if ( scope.vm.name != null ) {
            dialogService.registerDialog(scope.vm.name, scope.openDialog);
          }

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
        name: '@',
        fxItemSelected: '&'
      },
      controller: 'QuickDialogController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('quickDialog', quickDialog);

  var QuickDialogController = function QuickDialogController_ ($scope, $mdDialog, dialogService) {
    var ctrl = this;

    var openDialog = function(ev) {
      var dialogConfig =
      {
        controller: DialogController,
          templateUrl: 'dialog1.tmpl.html',
        targetEvent: ev
      };
      dialogConfig.templateUrl = ctrl.templateUrl;
      dialogConfig.template = $scope.template;
      $mdDialog.show(dialogConfig)
        .then(function(answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.alert = 'You cancelled the dialog.';
        });
    };

    this.showAdvanced = openDialog;
    $scope.openDialog = openDialog;
    //asdf.g

    this.$scope = $scope;

    this.inited = true;
  }

  app
    .config(function($mdIconProvider) {
      $mdIconProvider
        .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
    })
    .controller('QuickDialogController', QuickDialogController);


  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

}());
