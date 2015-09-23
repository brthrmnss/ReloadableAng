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
  var quickFormDemo = function quickFormDemo($templateRequest, $compile, $interpolate, transcludeHelper) {
    var utils = transcludeHelper.new();

    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/demo/quickform.dir.demo.html').then(
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
        views2: '@',

      },
      controller: 'quickFormDemoController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };


  app.directive('quickFormDemo', quickFormDemo);

  var quickFormDemoController =
    function quickFormDemoController ($scope,
                                      dialogService,
                                      dataGen,
                                      $restHelper,
                                      appAreaService,
                                      sh,
                                      $http,
                                      quickFormHelper
    ) {
      var qf = quickFormHelper.new()

      function createInitForm() {

        var dO = {};
        dO.first_name = 'Data';
        dO.start = 1500
        dO.last_name = 'Object 2';

        var fO = {};
        qf.loadForm(fO, dO);
        qf.loadData(dO);
        //fO.first_name = {label: 'First Name'};
        qf.addTextField('first_name', 'First Name')
        qf.addHelp('Enter your first name')
        qf.addLabel('Section 2')


        qf.addSection(function addGoogleCalendar() {
          qf.addCheckbox('enable_google_calendar', 'Create Events');
          //qf.addLabel('{{formObject.google_calendar_1_per_day}}')
          qf.addShowIf('enable_google_calendar', true, true);
          qf.addHelp('Control how events are created')
          qf.addLabel('Google Calendar Options')

          qf.addCheckbox('google_calendar_1_per_day', 'All day');
          qf.debugConditionals();
          qf.addCheckbox('google_calendar_quantize_enabled', 'Quantize');
          qf.addSelectList('google_calendar_quantize_duration', [
            '15 minutes', '30 minutes', '1 hour', '3 hours'
          ], 'Event Duration', [15,30,60,180]);
          qf.defaultValue()
          qf.addLastShowIf('google_calendar_quantize_enabled', true)

        })



        qf.addHr('Enter your first name')

        qf.addHider('stuff hidden')
        qf.addSection(function () {
          //qf.showIf = ["object.prompt_type=='checklist'"]
          fO.listOptions = {
            label: 'List Options',
            type: 'textarea', //qf.types.text
            showIf: ["object.prompt_type=='checklist'"]
          };

          var y = {
            label: 'List Options Preview',
            type: 'select',
            fxChange: function (o, fieldInfo) {
              var txt = o.listOptions;
              if (txt == fieldInfo.lastText) {
                return;
              }
              fieldInfo.lastText = txt;
              if (txt == null) {
                txt = '';
              }
              ;
              var split = txt.split("\n")
              y.options = split;
              fieldInfo.options = split;
              console.log('update item');
              fieldInfo.listOptions = null;
            },
            transient: true,
            showIf: ["object.prompt_type=='checklist'"]
          };
          //  fO.listOptionsPreview = y;

        })

        /*
         qf.addButton('red',function onClickRed(o){
         }, null, 'last_name', 'redC')
         .transient()
         .addClass('md-accent md-raised md-button md-default-theme')
         .addColor('#d2d2d2');

         qf.addButton('blue',function onClickRed(o){
         }, null, 'last_name', 'blue')
         .transient()
         .addClass('md-accent md-raised md-button md-default-theme')
         //.addColor('#d2d2d2');

         qf.addButton('green',function onClickRed(o){
         }, null, 'last_name', 'greenC')
         .transient()
         .addClass('md-accent md-raised md-button md-default-theme')
         // .addColor('#d2d2d2');
         qf.addButton('greenf',function onClickRed(o){
         }, null, 'last_name', 'greenC')
         .transient()
         .addClass('md-accent md-raised md-button md-default-theme')

         qf.addButton('greendf',function onClickRed(o){
         }, null, 'last_name', 'greenC')
         .transient()
         .addClass('md-accent md-raised md-button md-default-theme')

         qf.addButton('greenssf',function onClickRed(o){
         }, null, 'last_name', 'greenC')
         .transient()
         .addClass('md-accent md-raised md-button md-default-theme')
         */

        var arr = "#000000,#101416,#20292C,#303D42,#405259,#50676F,#607B85,#70909C,#80A4B2,#90B9C8,#A1CEDF,#A1CEDF,#AAD2E2,#B3D7E5,#BDDCE8,#C6E1EB,#D0E6EF,#D9EBF2,#E2F0F5,#ECF5F8,#F5FAFB,#FFFFFF"
        arr = arr.split(',').reverse();
        var targetNum = 8;
        var addCount = 0;
        /*
        sh.each(arr, function asdf(i, color) {

          if ( i < 4 ) {
            return;
          }
          if ( i % 2 == 1 ) {
            return;
          }

          if ( addCount > targetNum ) {
            return;
          }
          addCount++
          qf.addButton('select_i'+i,function onClickRed(o){
          }, null, 'last_name', color)
            .transient()
            .addClass('md-accent md-raised md-button md-default-theme')
            .addColor(color);
          qf.lastField.noGutterSpace = true;
        })
        */
        var yyy = ['happy', 'normal', 'sad', 'forlorn', 'depressed']

        qf.addButtonRoll('mooddx', yyy, null, arr.slice(3))
          //.lastField.noGutterSpace = true;
        qf.mixLast({
          'noGutterSpace':true,
          setProp:'last_name',
          classes:'md-accent md-raised md-button md-default-theme'
         // val:val
        });

        qf.addButtonRoll('mooddx2', yyy, null, arr.slice(3), true)
        //.lastField.noGutterSpace = true;
        qf.mixLast({
          'noGutterSpace':true,
          setProp:'last_name',
          classes:'md-accent md-raised md-button md-default-theme'
          // val:val
        });
        qf.mixLast({
          showVal:true,
          setSelf:true,
          confirmDeselect:true
        });
        qf.setValue(['sad']);

        qf.addHiderClose('stuff hidden')

        qf.addRadioGroup('moodz', yyy);

        fO.prompt_type = {label:'Type',
          type:'select',
          defaultValue:'checklist',
          options: [
            'prompt', 'checklist'
          ]
        };

        fO.last_name = {};

        fO.name = {label: 'Prompt Name'};
        fO.desc = {label: 'Description'};
        fO.prompt_type = {
          label: 'Type',
          type: 'select',
          defaultValue: 'checklist',
          options: [
            'prompt', 'checklist'
          ]
        };




        //qf.form = formObject2;
        qf.showIf = ["object.prompt.prompt_type=='prompt'"]
        qf.addLabel('Input Options')
        fO.color = {
          label: 'Color',
          type: 'boolean',
          help: 'Specify a color',
          showIf: ["object.prompt_type=='prompt'"]
        };

        fO.reminder_time = {
          label: 'Every Hours',
          type: 'stepper',
          defaultValue: 15,
          min: 5,
          max: 60 * 12,
          showIf: ["object.prompt_type=='prompt'"]
        };

        fO.every_day = {
          label: '1 Per Day',
          type: 'boolean',
          showIf: ["object.prompt_type=='prompt'"]
        };

        var formObject_createLog = {};
        qf.form = formObject_createLog;
        qf.addLabelField('prompt.name', true)

        qf.addLabelField('prompt.desc')

        qf.addTextField('data')

        qf.form.reminder_time = {
          label: 'Every Hours',
          type: 'stepper',
          defaultValue: 15,
          min: 5,
          max: 60 * 12,
          showIf: ["object.prompt_type=='prompt'"]
        };


        var cfg = {};
        cfg.formObject = fO;
        cfg.dataObject = dO;
        $scope.qf1 = cfg;
      };
      createInitForm();
    };

  app
    .controller('quickFormDemoController', quickFormDemoController);

}());
