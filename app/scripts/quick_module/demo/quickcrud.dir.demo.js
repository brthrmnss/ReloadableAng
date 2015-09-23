'use strict';

(function(){
  /*
   show nmber of list enetries
   how to make input faster or cleaner?
   split screents
   smaller listing
   descriptions hide/show
   help in top menu, as a user i can see help for the different views

   parallel view 1 by alpha betical order, with favorites
   as a user i can see list of prompts in alpha order, and in last used order

   as auser i can favorite tasks
   as a user i can filter tasks - upgrade quickrud to autom complete


   get 100 by default
   autocomplete based on name , if one exists used it
   add favorite to db field
   add last_used_at to db


   when you change the field .... say which field chjanged
   */
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
  var quickCrudDemo = function quickCrudDemo($templateRequest,
                                             $compile,
                                             $interpolate,
                                             transcludeHelper
  ) {
    var utils = transcludeHelper.new();



    function link(scope, element, attrs){
      $templateRequest('scripts/quick_module/demo/quickcrud.dir.demo.html').then(
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
      controller: 'QuickCrudDemoController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };


  app.directive('quickCrudDemo', quickCrudDemo);

  var QuickCrudDemoController =
    function QuickCrudDemoController ($scope,
                                      dialogService,
                                      dataGen,
                                      $restHelper,
                                      appAreaService,
                                      sh,
                                      $http,
                                      quickFormHelper,
                                      evernoteHelper
    ) {


      var ctrl = this;
      dialogService.newDialog = function () {
        //wtf

      };


      var types = {};


      types.evernote_actions = {};
      types.evernote_actions.todays_log = 'todays_log';
      types.evernote_actions.daily_log = 'daily_log';
      types.evernote_actions.one_off = 'one_off';

      types.prompt_types = {};
      types.prompt_types.prompt = 'prompt';
      types.prompt_types.checklist_single = 'checklist-single';
      types.prompt_types.checklist = 'checklist';



      var server = 'http://10.211.55.4'
      evernoteHelper = evernoteHelper.new();
      evernoteHelper.server = server;
      evernoteHelper.types = types;

      var qf = quickFormHelper.new();
      /*
       setTimeout(function setupDialog() {
       var opts = {}
       opts.elementQuery = '#crudDialog'
       opts.name = 'testCrudDialog';
       opts.title = 'test'
       opts.content = 'test'
       opts.contentJquery = angular.element('#crudDialog');
       dialogService.createDialog2(opts);


       opts.contentJquery.find('#btnClose')

       dialogService.openDialog(opts);


       $scope.showPopup = function showPopup() {
       dialogService.openDialog(opts);
       }
       }, 1000);
       */


      var viewConfig = {};
      viewConfig.views  = [];
      viewConfig.appArea = 'topA';
      viewConfig.Edit = 'Edit';
      viewConfig.Create = 'Create';

      var formObject = {};
      $scope.formObject = formObject;
      //formObject.firstName = {};
      //formObject.lastName = {};
      formObject.first_name = {label:'First Name'};
      formObject.last_name = {};


      var formObject2 = {}
      $scope.formObject2 = formObject2
      /*
       formObject2.first_name = {label:'First Name'};
       formObject2.start = {
       label:'start_date2',
       type:'stepper',
       min:0,
       max:3000
       };
       formObject2.last_name = {};
       */
      formObject2.name = {label:'Prompt Name'};
      formObject2.name.required = true;

      formObject2.desc = {label:'Description'};
      formObject2.prompt_type = {label:'Type',
        type:'select',
        defaultValue:'checklist',
        options: [
          'prompt', 'checklist-single', 'checklist'
        ]
      };

      qf.form = formObject2;

      qf.addSection(function () {
        qf.showIf=["object.prompt_type=='checklist'",
          "object.prompt_type=='checklist-single'"]

        qf.addTextArea( 'listOptions', 'List Options');
        qf.required();
        qf.lastField.msgs = ['no', 'yes'];

        var y = {label:'List Options Preview',
          type:'select',
          fxChange:function(o, fieldInfo) {
            var txt = o.listOptions;
            if ( txt == fieldInfo.lastText ) {
              return;
            }
            fieldInfo.lastText = txt;
            if ( txt == null ) { txt = ''; };
            var split = txt.split("\n")
            y.options =  split;
            fieldInfo.options = split;
            console.log('update item');
            fieldInfo.listOptions = null;
          },
          transient:true
        };
        formObject2.listOptionsPreview =  y;
        formObject2.listOptionsPreview.showIf = qf.showIf;

      })


      qf.loadForm(formObject2);
      //qf.form = formObject2;
      qf.showIf = ["object.prompt.prompt_type=='prompt'"]
      qf.addLabel('Input Options')
      formObject2.color = {label:'Color',
        type:'boolean',
        help: 'Specify a color',
        showIf:["object.prompt_type=='prompt'"]};

      formObject2.reminder_time = {label:'Every Hours',
        type:'stepper',
        defaultValue:15,
        min:5,
        max:60*12,
        showIf:["object.prompt_type=='prompt'"]};

      formObject2.every_day = {label:'1 Per Day',
        type:'boolean',
        showIf:["object.prompt_type=='prompt'"]};


      qf.addSection(function addEvernoteLogSection () {
        //qf.showIf=["object.prompt_type=='checklist'",
        //  "object.prompt_type=='prompt'"]

        qf.addLabel('Evernote Settings')
        qf.addCheckbox('store_in_evernote', 'Store in evernote');
        qf.defaultValue(true);
        //qf.showIf=[qf.ifCase('store_in_evernote', true )] '"object.store_in_evernote=='true'",
        //  "object.prompt_type=='prompt'"]
        qf.showIf=["object.store_in_evernote==true"];

        qf.addSelectList('evernote_action', [
          'todays_log', 'daily_log', 'one_off'
        ]);
        qf.defaultValue('todays_log');

        qf.addTextField('evernote_name','Evernote note name' );
        qf.defaultValue('log__|Date|');
        //qf.addCheckbox('enable_evernote');
      });

      qf.addSection(function addEvernoteLogSection () {
        qf.addLabel('Extra Questions Settings')
        qf.addCheckbox('enable_extra_questions', 'Enable extra questions?');
        qf.defaultValue(false);
        qf.addHelp('If set, will let you define multiple prompts. One per line')
        qf.showIf=["object.enable_extra_questions==true"];
        qf.addTextArea('extra_questions','Additional Questions' );
      });


      qf.addSection(function addEvernoteType () {
        qf.showIf=["object.store_in_evernote=='true'"];
        qf.addSelectList('entry_type', [
          'prompt', 'checklist', 'select'
        ]);
      });

      //with single select, speed up entry process
      qf.addSection(function QuickEntryHelpers() {
        qf.addShowIf('prompt_type',types.prompt_types.checklist_single, true);
        qf.addCheckbox('save_on_click', 'Save on click');
        qf.addHelp('When a checklist is selected, will automatically save prompt')

        qf.addCheckbox('keep_open_until_cancel', 'Create new one when saved');

      })

      //store log name .... 'ie' log_today or something else

      var formObject_createLog = {};
      qf.form = formObject_createLog;
      qf.addLabelField('prompt.name');
      qf.addLabelField('prompt.desc');
      qf.addTextField('data');
      qf.required();

      qf.form.reminder_time = {label:'Every Hours',
        type:'stepper',
        defaultValue:15,
        min:5,
        max:60*12,
        showIf:["object.prompt_type=='prompt'"]};

      qf.addShowIf('prompt.prompt_type',types.prompt_types.checklist_single);
      //qf.showIf =["object.prompt.prompt_type=='checklist-single'"];
      qf.addButtonRoll('singleCheckList', function(o){
          return sh.strToArray(o.prompt.listOptions);
        },
        'op', true );
      qf.mixLast({
        noGutterSpace:true,
        setProp:'data',
        classes:'md-accent md-raised md-button md-default-theme'
      });


      qf.addShowIf('prompt.prompt_type',types.prompt_types.checklist);
      qf.addButtonRoll('multipleCheckList', function(o){
        return sh.strToArray(o.prompt.listOptions);
      }, null, true, true);
      qf.mixLast({
        noGutterSpace:true,
        setProp:'data',
        classes:'md-accent md-raised md-button md-default-theme'
      });
      qf.mixLast({
        showVal:true,
        //setSelf:true,
        //confirmDeselect:true
      });
      qf.listenForChange(function onChange_SingleCheckList(val){

      });
      /*qf.mixLast({
       fxChange2:function onChangeSingleSelectList(o, fieldInfo, val) {
       if ( val == null ) {
       return;
       }
       if ( $scope.qCrudCreateLog.quickFormConfig.isActive != true ) {
       return;
       }

       if (o.prompt.save_on_click) {
       //config.fxSave();
       $scope.qCrudCreateLog.quickFormConfig.isActive = false;
       $scope.qCrudCreateLog.quickFormConfig.fxSave2(
       function onTryToRecreate() {
       console.log('recreate...')
       setTimeout(function () {
       if (o.prompt.keep_open_until_cancel ) {
       console.log('try to save again')
       qCListPrompts.qLC.fxAddItem(o.prompt);
       }
       },500)
       }
       );
       }
       }
       })*/


      var qCrudCreateLog_QuickFormConfig = {};
      qf.loadConfig(qCrudCreateLog_QuickFormConfig);
      qf.onFieldChanged("data", function(s){
        console.log('changed data row');
      });
      qCrudCreateLog_QuickFormConfig.onFieldClick("multipleCheckList", function(s){
        console.log('multipleCheckList');
      });
      qCrudCreateLog_QuickFormConfig.onFieldClick("singleCheckList", function(val, event){
        console.log('singleCheckList');

        var o = event.dataObject;
        if ( $scope.qCrudCreateLog.quickFormConfig.isActive != true ) {
          return;
        }

        if (o.prompt.save_on_click) {
          //config.fxSave();
          $scope.qCrudCreateLog.quickFormConfig.isActive = false;
          $scope.qCrudCreateLog.quickFormConfig.fxSave2(
            function onTryToRecreate() {
              console.log('recreate...')
              setTimeout(function () {
                if (o.prompt.keep_open_until_cancel ) {
                  console.log('try to save again')
                  qCListPrompts.qLC.fxAddItem(o.prompt);
                }
              },500)
            }
          );
        }
      });


      qf.showIf=[];
      qf.addTasklist('taskList', function(o){
        return sh.strToArray(o.prompt.listOptions);
      }, null, true, true);
      qf.mixLast({
        noGutterSpace:true,
        setProp:'data',
        //classes:'md-accent md-raised md-button md-default-theme'
      });


      qf.addTextField('comments');
      qf.defaultValue();

      var dataObject2 = {};
      $scope.dataObject4 = dataObject2
      dataObject2.first_name = 'Data';
      dataObject2.start = 1500
      dataObject2.last_name = 'Object 2';


      var qC2 = {} ;
      $scope.quickCrud2 = qC2;
      qC2.name = '';
      qC2.showForm = false;
      qC2.title = 'test title';
      qC2.canCreate = false;


      var qCListPrompts = {} ;
      $scope.quickCrud3 = qCListPrompts;
      qCListPrompts.name = '';
      qCListPrompts.refresh = false
      qCListPrompts.help = 'List all of the prompts you have defined'

      qCListPrompts.canCreate = true;
      qCListPrompts.dataObject =
      {first_name:'Rachel2'};
      qCListPrompts.showForm = false;



      //qCListPrompts.remote = false;
      var initListData = [
        {first_name:'Annette', last_name:"Bruce"},
        {first_name:'Mark', last_name:"Toblin"},
        {first_name:'John', last_name:"Hook"}
      ]

      var inMemory = false

      var rHC = {}
      qCListPrompts.restHelperConfig = rHC;
      var t = $restHelper.createInMemory();
      t.loadItems(initListData);
      if ( inMemory ) {
        rHC.dataSrc = t;
      } else {
        rHC.url = 'http://10.211.55.4:10001/api/prompt'
        rHC.flatten = true;
      }
      qCListPrompts.formObject = angular.copy(formObject2);
      qCListPrompts.fxNew = function onNewPrompt(o ) {
        qC4.dataObject = o;
        console.log('fxNew-->---qc4', o)
        qC4.refresh = Math.random();
        qC4.name = Math.random();
        qC4.fxRefresh();
        //when user presses save, invoke this method
        //this is passed to qc4
        qCListPrompts.fxSaveTemp = function ( o ) {
          console.log('fxSavetemp', o)
          //qCListPrompts.fxRefesh(); //q: why did this not work?
          $scope.active = 'List'
          $scope.appArea.goTo('List', o);
        }

        $scope.active = 'Edit'
        $scope.appArea.goTo('Edit', o);

      }
      qCListPrompts.fxClick = function (o ) {
        qC4.dataObject = o;
        console.log('fxClick-->---qc4', o)
        qC4.refresh = Math.random();
        qC4.name = Math.random();
        qC4.fxRefresh();
      }

      $scope.appArea = appAreaService.
        createAARouter(viewConfig.appArea);

      qCListPrompts.qLC = {};
      qCListPrompts.quickListConfig = qCListPrompts.qLC
      qCListPrompts.qLC.fxEditItem = function onEditPrompt(o) {
        console.log('edit item', o);
        qC4.dataObject = o;
        qC4.fxRefresh();
        $scope.active = 'Edit'
        $scope.appArea.goTo('Edit', o);

        qCListPrompts.fxSaveTemp = function ( o ) {
          console.log('fxSavetemp', o)
          $scope.active = 'List'
          $scope.appArea.goTo('List', o);
        }

      };
      qCListPrompts.qLC.fxAddItem = function onCreatePromptLog(o) {
        console.log('add item', o);
        var newItem = {}
        newItem.prompt = o;
        newItem.prompt_id = o.id
        newItem.first_name  = 'sdfsdf';
        qf.loadForm(sh.clone($scope.qCrudCreateLog.formObject));
        qf.utils.clearTemps();

        //notify entry helpers that this is active
        $scope.qCrudCreateLog.quickFormConfig.isActive = true;
        $scope.qCrudCreateLog.quickFormConfig.fxCancel2 = function () {
          $scope.qCrudCreateLog.quickFormConfig.isActive = false;
        };


        sh.stripBadFiles = function stripBadFiles(file, replaceWith) {
          //var file = file.replace(/\//g, '_')
          //file = file.replace(/\\/g, '_')
          var replaceWith = sh.defaultValue(replaceWith, '')
          file = file.replace(/[^\w\s]/gi, '') /*\.*/
          return file
        };
        sh.sanitizeString = function stripBadFiles(file, replaceWith) {
          var replaceWith = sh.defaultValue(replaceWith, '')
          file = file.replace(/[^\w\s]/gi, '') /*\.*/
          file=file.replace(/ /g,"_");
          file=file.toLowerCase();
          return file
        };
        //qCrudCreateLog.quickFormConfig
        if (o.enable_extra_questions) {
          var items = sh.strToArray(o.extra_questions)
          sh.each(items, function addNewItem(i, item) {
            qf.addTextArea('ex_'+sh.sanitizeString(item),
              item );
            //'extra_question_'+(i+1)
            qf.temp();
            qf.debugConditionals();
          });
          //qCrudCreateLog.formObject = {};
          qf.form.reload = true;
          $scope.qCrudCreateLog.formObject  = sh.clone(qf.form);
        }

        //if checklist, then use json modes
        if (o.prompt_type == types.prompt_types.checklist ) {
          var name = evernoteHelper.getNameFromPrompt(o);
          evernoteHelper.searchFor(name, true ,
            function fxSearchDone(json) {
              newItem = json;
              newItem.prompt = o;
              newItem.prompt_id = o.id;
              qCrudCreateLog.dataObject = newItem;
              qCrudCreateLog.fxRefresh();


              newItem.fxEvernoteSave = function (o, flat) {
                o = sh.clone(o)
                delete o['data_json']
                evernoteHelper.createNote(name, null, true, o);
              }

              $scope.goToCreate(newItem)
            })
          return;
        }



        //if task list, then retrieve
        if (o.evernote_action == types.evernote_actions.one_off) {
          var name = evernoteHelper.getNameFromPrompt(o);
          var jsonModeSave = false;
          jsonModeSave = true;
          evernoteHelper.searchFor(name, jsonModeSave ,
            function fxSearchDone(json) {
              newItem = {};
              //asdf.g
              newItem = json;
              if ( jsonModeSave == false ) {
                newItem = {};
              }
              //
              newItem.prompt = o;
              newItem.prompt_id = o.id;
              qCrudCreateLog.dataObject = newItem;
              qCrudCreateLog.fxRefresh();

              newItem.fxEvernoteSave = function (o, flat) {
                o = sh.clone(o);
                delete o['data_json'];
                evernoteHelper.createNote(name, null, jsonModeSave, o);
              }

              $scope.goToCreate(newItem)
            })
          return;
        }


        //parent prompt;
        qCrudCreateLog.dataObject = newItem;
        //qCrudCreateLog.formObject = newItem;
        qCrudCreateLog.fxRefresh();
        qCrudCreateLog.fxRefresh();
        $scope.goToCreate(newItem)

      };

      qCListPrompts.qLC.label = 'j';


      //REQ: When user filters, create new prompt from log
      qCListPrompts.fxFilterSelect = qCListPrompts.qLC.fxAddItem

      qCListPrompts.showFilter = true;
      qCListPrompts.showSettings = true;

      var qFC = {};
      qCListPrompts.quickFormConfig = qFC;
      qFC.fxCancel = function onCancelFromCreatePrompt() {
        //scope.back();
        $scope.nav.goTo('List');
      }
      /*qFC.fxSave = function(o) {
       console.log('saved', o)
       }*/
      //qCListPrompts.quickFormConfig.showFooter = false;

      var qC4 = {} ;
      $scope.quickCrud4 = qC4;
      //qC4.restHelperConfig = sh.clone(rHC);
      qC4.name = '';
      qC4.refresh = false
      //qC4.title = 'test title';
      qC4.canCreate = false;
      qC4.showList = false;
      qC4.dataObject = {};
      qC4.noRemote = true;
      qC4.showNewIndicator = true

      qC4.viewAARouter = appAreaService.
        createAAReceiver(viewConfig.appArea,
        viewConfig.Edit, function onLeave(o) {
          console.log('leaving edit view')
        } ,
        function onJoinEdit(e){
          //TODO: Remove and do this more elegantly
          if ( $scope.activePreload != null ) {
            return;
          }
          if ( e == null ) {
            alert('select an item to edit first....')
            return false;
          }
          console.log('leaving edit view')
        })
      qC4.formObject = angular.copy(formObject2);

      qC4.fxClick = function (o ) {
        // qC2.dataObject = o;
      }
      qC4.fxSave = function(o) {
        console.log('saved---qc4', o);
        qCListPrompts.fxSaveCurrentItem(o);
      }
      var qFC = {};
      qFC.fxCancel = function () {
        //scope.back();
        $scope.nav.goTo('List')
      }
      qC4.quickFormConfig = qFC;

      setTimeout(function() {
        console.log('change config')
        qCListPrompts.dataObject = {first_name:'Rachel'}
        qCListPrompts.formObject = formObject2;
      }, 2500)

      setTimeout(function() {
        $scope.$apply(function () {
          qCListPrompts.dataObject = {first_name:'Donny'};
          qCListPrompts.refresh = true;
          qCListPrompts.formObject = formObject2;
          qCListPrompts.name = 'dddd';
          qCListPrompts.fxRefresh();
          //$scope.quickCrud3 = qCListPrompts;
          console.log(qCListPrompts)
          // $scope.quickCrud3 = qC2;
        })
      }, 5000)


      var qCrudCreateLog = {};
      $scope.qCrudCreateLog = qCrudCreateLog;
      qCrudCreateLog.name = 'qCrudCreateLog'
      var qFC = {};
      /*qFC.fxSave = function(o) {
       console.log('saved---qc4', o)
       }*/
      qCrudCreateLog.quickFormConfig = qCrudCreateLog_QuickFormConfig;
      qCrudCreateLog.quickFormConfig.fxCancel = function onCancelFromCreatePrompt() {
        $scope.nav.goTo('List');
      }


      qCrudCreateLog.quickFormConfig.name = 'qCrudCreateLog.quickFormConfig';
      qCrudCreateLog.showList = false;
      qCrudCreateLog.dataObject = {};
      qCrudCreateLog.remote = false;
      qCrudCreateLog.canCreate = false;
      qCrudCreateLog.formObject = angular.copy(formObject_createLog);
      //console.error('form', qCrudCreateLog.formObject)
      //asdf.g
      qCrudCreateLog.silent = true;
      qCrudCreateLog.fxSave = function(o) {
        console.log('saved--- log-creator', o)
        qCrudLogList.fxSaveCurrentItem(o);


//o.fxSave(function () {
        qCrudLogList.fxSaveTemp = function ( o ) {
          console.log('fxSavetemp', o)
          $scope.active = 'List'
          $scope.appArea.goTo('List', o);
        }
        //})




        if (o.prompt.store_in_evernote == true ) {
          //if (o.addFoxSave())
          //o.fxSave(function () {})



          qf.loadForm(qCrudCreateLog.formObject, o)

          //get other questions, if any exist ...
          var data = qf.utils.clearTemps();

          var flat = qf.utils.flattenJSON(data);

          var comment= ''
          if (o.comment != null ) {
            comment = + ' : ' +  o.comment
          }

          if ( flat != '' ) {
            flat = '\n    ' + flat+ '<hr/>';
          }


          if (o.fxEvernoteSave != null) {
            o.$fxflat = flat;
            o.fxEvernoteSave(o, flat);
            return;
          }

          //createNote('test_777', 'help me us you')
          if (o.prompt.evernote_action == types.evernote_actions.todays_log) {
            /*var content = sh.getTimeStamp() + ': ' +
             o.prompt.name + ': ' + o.data + comment;*/
            var content = sh.getTime() + ': ' +
              o.prompt.name + ': ' + o.data + comment + flat;
            addToLog("\n" + content);
          } /*else if ( o.prompt.evernote_action ==
           types.evernote_actions.checklist ) {

           }*/
          else if (o.prompt.evernote_action == types.evernote_actions.one_off) {
            var name = evernoteHelper.getNameFromPrompt(o.prompt, o)
            o = sh.clone(o)
            delete o['data_json']
            o.$xflat = '\n'+comment + flat;
            evernoteHelper.createNote(name, null, true, o);
          }

        }

      };



      function createNote(title, content) {
        var note = {};
        note.title = title;
        note.newContents = content;
        $scope.loading = true;
        $http.post(server+':5556/append_named', note).success(
          function xV (data, p, headers ) {
            console.log('done', data, p, headers)
            $scope.loading = false;
          }
        ).error(function (err){
            console.error('done', 'error', err)
            $scope.loading = false;
          });
      }

      function addToLog(content) {
        var noteTitle = 'log__' + sh.getDateStamp();
        createNote(noteTitle, content)
      }



      qCrudCreateLog.viewAARouter = appAreaService.
        createAAReceiver(viewConfig.appArea,
        viewConfig.Create, function onLeave(o) {
          console.log('leaving create view')
        } ,
        function onJoinEdit(e){
          if ( e == null ) {
            alert('select an item to create first....')
            return false;
          }
          console.log('leaving create view')
        });


      var qCrudLogList = {};
      $scope.qCrudLog = qCrudLogList;
      qCrudLogList.qLC = {};
      qCrudLogList.quickListConfig = qCrudLogList.qLC
      qCrudLogList.qLC.fxEditItem = function (o) {
        console.log('edit item', o);
        qCrudCreateLog.dataObject = o;
        qCrudCreateLog.fxRefresh();
      };
      qCrudLogList.qLC.maxHeight = 150;
      qCrudLogList.qLC.showNext = true;
      qFC = {};
      qCrudLogList.quickFormConfig = qFC;
      qCrudLogList.showForm = false;
      qCrudLogList.dataObject = {};
      qCrudLogList.remote = false;
      qCrudLogList.canCreate = false;
      qCrudLogList.formObject = angular.copy(formObject2);




      //generate stuff
      //var template = {};
      var template = {name:'', date:null};
      var gen = dataGen.create();
      gen.createObjects(template, 10)
      gen.randomizeStr('first_name');
      gen.randomizeStr('last_name');
      gen.distribute('prompt', initListData,
        {prop_id:'prompt_id', clone:true});
      gen.show();

      var rHC = {}
      var t = $restHelper.createInMemory();
      t.loadItems(gen.items);
      if ( inMemory ) {
        rHC.dataSrc = t;
      } else {
        rHC.url = 'http://10.211.55.4:10001/api/promptlog'
      }
      qCrudLogList.restHelperConfig = rHC;

      //x10
      //randomizeDate('date')
      //randomizeNumber('google_id', 0,1000)




      function defineRecentEntries() {


        var quickCrud_RecentNotes = {};
        $scope.quickCrud_RecentNotes = quickCrud_RecentNotes;
        quickCrud_RecentNotes.name = 'quickCrud_RecentNotes';
        var rHC = {}
        if ( inMemory ) {
          var t = $restHelper.createInMemory();
          t.loadItems(gen.items);
          rHC.dataSrc = t;
        } else {
          rHC.url = server+':5556'+'/notes'
          rHC.paginate = false; // = true;
          //paginateWithoutCount ... no local filtering
        }
        quickCrud_RecentNotes.restHelperConfig = rHC;
        quickCrud_RecentNotes.paginate = false;
        quickCrud_RecentNotes.listResultListProp = 'notes'
        quickCrud_RecentNotes.showForm = false;


        function setupDialog(element) {
          //var el = $scope.element;
          var opts = {}
          opts.name = 'dialogQuickEdit';
          opts.title = 'dialogQuickEdit'
          opts.content = 'test'
          opts.contentJquery = element.find('#dialogQuickEdit');
          //$scope.dlg = opts.contentJquery;
          opts.position = {}

          $scope.dialogQuickEdit = opts;
          dialogService.createDialog2(opts);

          $scope.onSettings = function onSettings() {
            console.log('..')
            dialogService.openDialog(opts);
          };

          var config = {};
          $scope.dialogQuickEditConfig = config;
          config.onSave = function onSave() {
            console.log('save')
            evernoteHelper.appendNote(
              $scope.dialogQuickEditConfig.note.guid,
              $scope.dialogQuickEditConfig.txtAppend + "\n",
            function onNoteSaved(){
              //dialogService.openDialog($scope.dialogQuickEdit);
              $scope.dialogQuickEditConfig.reloadEntry();
            }
            );

          };

        }

        function createDialogWhenElementIsAvailable() {
          if ($scope.element == null) {
            setTimeout(createDialogWhenElementIsAvailable, 300);
            return;
          }
          setupDialog($scope.element);
        }
        createDialogWhenElementIsAvailable();

        quickCrud_RecentNotes.quickListConfig = {};
        quickCrud_RecentNotes.quickListConfig.fxEditItem = function onAppendToEntry(o) {
          console.log('edit item', o);
          //open tab
          $scope.dialogQuickEditConfig.title = o.title;
          $scope.dialogQuickEditConfig.note = o;

          dialogService.openDialog($scope.dialogQuickEdit);
          $scope.dialogQuickEditConfig.reloadEntry = function reloadEntry() {


          evernoteHelper.appendNote(
            $scope.dialogQuickEditConfig.note.guid,
            null,
            function onNoteLoaded(data){
              console.log('loaded....', data)
              data = sh.replace(data, "\n", "<br clear='none'/>")
              $scope.dialogQuickEditConfig.content = data;
            },
            true );

          }
          $scope.dialogQuickEditConfig.reloadEntry()

        };




        var qFC = {};
        qFC.formObject = {};
        quickCrud_RecentNotes.quickFormConfig = qFC;

      }
      defineRecentEntries();




      types.menu = {};
      types.menu.List = 'List';
      types.menu.Edit = 'Edit';

      function defineMenu() {
        $scope.radioModel = 'Middle';

        $scope.active = types.menu.List;
        //$scope.active = types.menu.Edit;
        $scope.activePreload = {};

        $scope.nav = {};
        $scope.nav.states = [];
        $scope.nav.goTo = function goToState(stateName, data) {
          $scope.active = stateName;
          console.log('goToState', stateName);
          $scope.appArea.goTo(stateName, data);
          $scope.nav.states.push(stateName);
        }

        //TODO: Remove this item
        var navs = [];
        $scope.setActive = function(type) {
          $scope.active = type;
          console.log('active', type);
          //TODO Combine
          $scope.appArea.goTo(type);
          navs.push(type);
        };

        $scope.goBack = function() {
          var nav = navs.pop();
          $scope.setActive(nav);
        };

        $scope.isActive = function(type) {
          return type === $scope.active;
        };

        $scope.menuItems = [
          'List',
          'Edit',
          'Create',
          'Log',
          'View Calendar'
        ];

        var genViews = dataGen.create();
        genViews.loadItems($scope.menuItems);
        genViews.convertStrToObjects('viewName');
        genViews.addProp('domInfo', function (item) {
          return 'comp:#'+item.viewName;
        });

        var viewObject = genViews.convertToDictionary('viewName', 'domInfo');

        var startComp = 'dom:#';
        viewObject['Edit'] = startComp+'viewEditPrompt';
        viewObject['Create'] = startComp+'viewCreateLog';
        viewObject['List'] = startComp+'viewListPrompts';
        viewObject['Log'] = startComp+'viewListLogs';


        $scope.goToList = function () {
          console.log('... go to list')
          $scope.appArea.goTo('List');
          $scope.active = 'List';
          //how to bind the two together?
        };

        $scope.goToCreate = function (o) {
          $scope.active = viewConfig.Create;
          $scope.appArea.goTo(
            viewConfig.Create, o);
        };


        appAreaService.listenForViewState(
          viewConfig.appArea,
          function onV(viewReq, data, viewName) {
            $scope.active = viewName;
          }
        );

        $scope.views = viewObject;
        var vC = {};
        $scope.viewsConfig = vC;
        vC.views = viewObject;
        vC.hideOnStart = true;
        vC.initView = $scope.active;
        vC.removeLayout = true;
        vC.holderId = 'holder'

      }

      defineMenu();


      function defineLoader() {
        function LoaderHelper() {

          var self = this;
          var p = this;
          p.init = function init() {
            self.loaders = {};
            self.countLoaders = 0;
            self.fxLoading = null; //will receive loading notifications
          }
          self.init();

          p.loaderAdd = function loaderAdd(reason, data) {
            var id = Math.random();
            self.countLoaders++;
            self.loaders[id] = {reason:reason, data:data}
            var ret = {};
            ret.done = function () {
              self.loaderRemoveId(id);
            }
            ret.id = id;
            self.adjustLoadingIndicator(self.loaders[id]);
            return ret;
          }

          p.loaderRemoveId = function loaderRemoveId(id) {
            var loader = self.loaders[id];
            delete self.loaders[id]
            self.countLoaders--;
            self.adjustLoadingIndicator(loader);
          }

          p.adjustLoadingIndicator = function aJI (loader) {
            var changed = self.lastLoading;
            if ( self.countLoaders == 0 ) {
              self.loading = false;
              //emit event
            } else {
              self.loading = true;
            };
            changed = changed != self.loading;
            self.lastLoading = self.loading;
            sh.callIfDefined(self.fxLoading, self.loading, changed, self, loader);
          };



        }
        var loaderHelper = new LoaderHelper()
        loaderHelper.fxLoading = function (yesNo) {
          $scope.loading = yesNo;
        }
      }

      defineLoader();


      var handler = function(e){
        if(e.keyCode === 39) {
          console.log('right arrow');
          // $scope.doSomething();
        }
        if(e.keyCode === 27) {
          $scope.goToList();
        }
      };

      var $doc = angular.element(document);

      $doc.on('keydown', handler);
      $scope.$on('$destroy',function(){
        $doc.off('keydown', handler);
      })







    };

  app
    .controller('QuickCrudDemoController', QuickCrudDemoController);
  app
    .filter('to_trusted', ['$sce', function($sce){
      return function(text) {
        return $sce.trustAsHtml(text);
      };
    }]);

}());
