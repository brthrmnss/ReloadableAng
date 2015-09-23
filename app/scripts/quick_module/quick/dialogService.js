'use strict';
/**
 * Dialog Service provides interface for creating/destroying/opening and registering dialogs
 */
( function() {

  var dialogService = function dialogService(
    $mdToast, $mdDialog, sUtils, sh) {


    var factory = {};

    factory.dialogs = {};
    var dialogs = {};
    factory.openDialog = function openDialog(name) {
      if ( angular.isObject(name) ) {
        var opts = name;
        console.log('open');
/*

        //give ng material background
        if ( opts.wrap != false ) {
          if ( opts.wrapped != true ) {
            var bg = angular.element('<div />');
            bg.addClass('md-dialog-container');
            bg.append(opts.dlg);
            opts.dlg = bg
            opts.wrapped = true;
          };
        };
*/

        if ( opts.force == true ) {
          delete opts['force']
          opts.dlg.removeClass('hide');
          opts.dlg.removeClass('show');
          opts.isOpen = false; //= true
        }
        if ( opts.isOpen != true ) {
          opts.TEST = 'sdfsd'
          opts.dlg.addClass('show');
          opts.dlg.removeClass('hide');
          if ( opts.move != false ) {
            angular.element('body').append(opts.dlg);
          }
          opts.isOpen = true;
        } else {
          opts.dlg.addClass('hide');
          opts.dlg.removeClass('show');
          opts.isOpen = false;
          return;//
        }
        if ( opts.move != false ) {
          //set position of popup
          if (opts.position != null) {
            if (opts.position.right != null) {
              opts.dlg.css('right',
                opts.position.right);
            }
            if (opts.position.top != null) {
              opts.dlg.css('top', opts.position.top);
            }
            if (opts.position.left != null) {
              opts.dlg.css('left', opts.position.left);
            }
            if (opts.position.width != null) {
              opts.dlg.css('width', opts.position.width);
            }
            if (opts.position.height != null) {
              opts.dlg.css('height', opts.position.height);
            }
          }
        }

        return;
      }
      var dialogFx = dialogs[name];
      dialogFx();
    };

    function createMDDialogHelpers() {
      factory.createDialog = function createDialog(opts) {
        var ev = null;

        opts.btnText = sUtils.dv(opts.btnText, 'OK')
        var optsDlg = $mdDialog.alert()

          .title(opts.title) //'This is an alert title')
          .content(opts.content)//'You can specify some description text in here.')
          .ariaLabel(opts.ariaLabel) //'Alert Dialog Demo')
          .ok(opts.btnText)
          .targetEvent(ev)
        if (opts.topLevel != false) {
          optsDlg.parent(angular.element(document.body))
        }
        if (opts.parent != null) {
          optsDlg.parent(opts.parent);
        }


        if (opts.modal == false) {
          optsDlg._options.hasBackdrop = false;
        }

        if (opts.contentJquery != null) {
          var div = angular.element('<div />');
          div.attr('id', opts.id);
          div.addClass('md-dialogs');
          div.append(angular.element(
            opts.contentJquery).html());
          var divWrapper = angular.element('<div />');
          divWrapper.append(div)
          div = divWrapper;
          optsDlg._options.template = div.html();
        }

        var dlg = $mdDialog.show(
          optsDlg
        );

        if (opts.name != null) {
          factory.registerDialog(opts.name, function () {
          })
        }

        return dlg;
      };

      factory.hideDialog = function hideDialog(name) {

      };

      factory.registerDialog = function registerDialog(name, fx) {
        dialogs[name] = fx
      };

      factory.showAlert = function (content, title, ariaLabel, btnText, ev) {
        if (btnText == null) {
          btnText = 'OK'
        }
        ;
        //if (ev == null ) { ev = {} };
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        var dlg = $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .title(title) //'This is an alert title')
            .content(content)//'You can specify some description text in here.')
            .ariaLabel(ariaLabel) //'Alert Dialog Demo')
            .ok(btnText) //'Got it!')
            .targetEvent(ev)
        );

        return dlg;
      };

      factory.registerDialog('testAlertDialog', function () {
        factory.showAlert('Test Alert...', 'Test', '...', 'OK');
      });

      factory.showConfirmFull = function (content, title, ariaLabel, btnOkText, btnFailText, fxOk, fxFail, ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title(title)
          .content(content)
          .ariaLabel(ariaLabel)
          .ok(btnOkText)
          .cancel(btnFailText)
          .targetEvent(ev);
        $mdDialog.show(confirm).then(fxOk, fxFail);
      };

      factory.showConfirm = function (title, content , fxOk, fxFail, btnOkText, btnFailText, ev) {
        btnOkText = sh.dv(btnOkText, 'OK');
        btnFailText = sh.dv(btnFailText, 'Cancel');
        var ariaLabel = sh.dv(ariaLabel, 'Alert Dialog');
        // Appending dialog to document.body to cover sidenav in docs app

        if ( angular.isArray(fxOk )) {
          var args = fxOk;
          fxOk = function tempOkMethod(){
            var fx = args.shift();
            fx.apply(this, args);
          }
        }

        var confirm = $mdDialog.confirm()
          .title(title)
          .content(content)
          .ariaLabel(ariaLabel)
          .ok(btnOkText)
          .cancel(btnFailText)
          .targetEvent(ev);
        $mdDialog.show(confirm).then(fxOk, fxFail);
      };


      factory.showAdvanced = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'dialog1.tmpl.html',
          targetEvent: ev,
        })
          .then(function (answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
          }, function () {
            $scope.alert = 'You cancelled the dialog.';
          });
      };
    }
    createMDDialogHelpers();


    function defineToast() {

      factory.showToast = function showToast(msg, position) {
        factory.showSimpleToast(msg, position);
      };


      function fixToastPosition(position) {
        if (position == null) {
          var position = {}
          position.top = true;
          position.right = true;
        }
        return Object.keys(position)
          .filter(function (pos) {
            return position[pos];
          })
          .join(' ');
        //return position;
      }

      factory.showCustomToast = function () {
        $mdToast.show({
          controller: 'ToastCtrl',
          templateUrl: 'toast-template.html',
          hideDelay: 6000,
          position: $scope.getToastPosition()
        });
      };

      factory.showSimpleToast = function (content, position) {
        position = fixToastPosition(position);
        $mdToast.show(
          $mdToast.simple()
            .content(content)
            .position(position)
            .hideDelay(3000)
        );
      };

      factory.showActionToast = function () {
        position = fixToastPosition(position);
        var toast = $mdToast.simple()
          .content('Action Toast!')
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition());
        $mdToast.show(toast).then(function () {
          alert('You clicked \'OK\'.');
        });
      };
    }
    defineToast();




    factory.createDialog2 = function createDialog2(opts) {
      var ev = null;

      opts.btnText = sUtils.dv(opts.btnText, 'OK')


      if ( opts.modal == false ) {
        optsDlg._options.hasBackdrop = false;
      };

      if ( opts.contentJquery != null ) {



        if ( opts.move != false ) {

          var div = angular.element('<div />');
          div.attr('id', opts.id);

          //div.append( angular.element(
          //  opts.contentJquery).html() );
          div.append(
            opts.contentJquery);

          console.log('append')


          if ( opts.noWrap == true ) {
            //div.addClass('md-dialogs');
            div.addClass('quick-dialog-bg');
          } else {
            div.addClass('quick-dialog-bg-inner');
            //div.addClass('md-dialog');
            var divWrapper = angular.element('<div />');
            divWrapper.addClass('quick-dialog-bg');


            var btn = angular.element('<md-button />');
            btn.html('x');
            btn.addClass('quick-close-btn')
            div.append(btn);

            btn.bind('click', function (event) {
              if (event.target.id === 'btnC') {
                controllerReference.$scope.selectIndex(3);
              }
              ;
              console.log('close');
              factory.hideDialog(opts.name);
              opts.isOpen = false;
              opts.dlg.addClass('hide');
              opts.dlg.removeClass('show');
              return;
              //scope.$apply();
            });


            divWrapper.append(div)
            div = divWrapper;
          }

          opts.dlg = div;
        } else {
          opts.dlg = opts.contentJquery;
        }
        // optsDlg._options.template = div.html();
      };

      var dlg =  {};

      if ( opts.name != null ) {
        factory.registerDialog(opts.name, function () {})
      };

      return dlg;
    };
    return factory;
  }

  dialogService.$inject = ['$mdToast', '$mdDialog', 'sUtils', 'sh'];

  angular.module('com.sync.quick').factory('dialogService', dialogService );
}());
