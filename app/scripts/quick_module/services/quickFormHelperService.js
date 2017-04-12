'use strict';
/**
 * Helper provides utilies to quickly define forms
 */
( function() {

  var quickFormHelperService = function quickFormHelperService( sh, pubSub ) {
    function QuickFormHelper() {
      var self = this;
      var p = this;

      var types = {}
      types.textArea = 'textarea';
      types.textarea = types.textArea;
      //types.textArea = 'text'
      types.input = 'input';
      types.radio = 'radio';
      types.checkbox = 'checkbox';
      types.boolean = 'boolean';
      types.select = 'select'
      types.tasklist = 'tasklist';
      types.number = 'number';
      types.stepper = 'stepper';
      types.lbl = 'label';
      types.br = 'br';
      types.label  = 'label'
      types.button = 'button';
      types.buttonroll = 'buttonroll';
      types.hr = 'hr';
      types.hider = 'hider';
      types.hiderClose = 'hiderClose';

      var nonInputTypes = [
        types.lbl,
        types.hr,
        types.hider,
        types.hiderClose
      ];
      types.nonInputTypes = nonInputTypes;

      /*      types.textArea = 'textarea'
       //types.textArea = 'text'
       types.input = 'input'
       types.radio = 'radio'
       types.checkbox = 'checkbox';
       types.boolean = 'boolean';
       types.select = 'select'
       types.number = 'number';
       types.stepper = 'stepper';
       types.lbl = 'label';
       types.label  = 'label'*/

      self.types = types;

      p.init = function init() {

      };

      function defineElements() {
        p.addLabel = function labl(lbl, hr) {
          hr = sh.dv(hr);
          var obj = {
            label: lbl,
            type: self.types.label,
            hr:hr
          }
          self.form['lbl_' + sh.randomizeInt(3)] = obj;
          self.addAuto(obj);
        }
        p.addLabelField = function addLabelField(prop, noGutterSpace) {
          noGutterSpace = sh.dv(noGutterSpace, true);
          var obj = {
            field: prop,
            type: self.types.label,
            reduceGutterSpace: noGutterSpace
          };
          self.form['lbl_' + sh.randomizeInt(3)] = obj;
          self.addAuto(obj);
        }

        p.addTextField = function addTextField(prop, label) {
          var obj = {
            label: label,
            field: prop,
            type: self.types.textarea
          };
          self.form[prop] = obj;
          self.addAuto(obj);
          return self;
        }
        p.addTextArea = p.addTextField;

        p.addButton = function addButton(name, fx, label,
                                         setProp, val) {
          var prop = name;
          label = sh.dv(label, name)
          var obj = {
            field: name,
            label: label,
            fx: fx,
            type: self.types.button,
            setProp: setProp,
            val: val
          };
          self.form[name] = obj;
          self.addAuto(obj);
          return self;
        }

        p.addCheckbox = function addCheckbox(name, label) {
          var obj = {
            label: label,
            type: self.types.checkbox//,
            //options: values
          };
          self.form[name] = obj;
          self.addAuto(obj);
          return self;
        };

        p.addHr = function addHr(name, label) {
          var name = 'hr_'+self.utils.makeRandom();
          var obj = {
            label: label,
            type: self.types.hr//,
            //options: values
          };
          self.form[name] = obj;
          self.addAuto(obj);
          return self;
        };

        p.addHider = function addHider(label) {
          var name = 'hider_'+self.utils.makeRandom();
          var obj = {
            label: label,
            type: self.types.hider
          };
          self.form[name] = obj;
          self.addAuto(obj);
          return self;
        };
        p.addHiderClose = function addHiderClose(label) {
          var name = 'hiderClose_'+self.utils.makeRandom();
          var obj = {
            label: label,
            type: self.types.hiderClose
          };
          self.form[name] = obj;
          self.addAuto(obj);
          return self;
        };


        p.addRadioGroup = function addRadioGroup(name, values, label) {
          var obj = {
            label: label,
            type: self.types.radio,
            options: values
          };
          self.form[name] = obj;
          self.addAuto(obj)
          return self;
        };

        p.addSelectList = function addSelectList(name, values, label, valueNames) {
          var options = self.utils.mergeValuePairs(values, valueNames);
          var obj = {
            label: label,
            type: self.types.select,
            options: options
          };
          self.form[name] = obj;
          self.addAuto(obj);
          return self;
        };

        p.addButtonRoll = function addButtonRoll(name, values,
                                                 label, colors,
                                                 multipleSelect) {
          var obj = {
            label: label,
            type: self.types.buttonroll,
            options: values,
            field: name,
            optionsColors: colors,
            multipleSelect: multipleSelect
          };
          if (angular.isFunction(values)) {
            obj.options = null;
            obj.fxOptions = values;
          }
          if (colors == true) {
            var arr = "#000000,#101416,#20292C,#303D42,#405259,#50676F,#607B85,#70909C,#80A4B2,#90B9C8,#A1CEDF,#A1CEDF,#AAD2E2,#B3D7E5,#BDDCE8,#C6E1EB,#D0E6EF,#D9EBF2,#E2F0F5,#ECF5F8,#F5FAFB,#FFFFFF"
            arr = arr.split(',').reverse();
            arr = arr.slice(3)
            obj.optionsColors = arr;
          }
          if (multipleSelect) {

          }
          self.form[name] = obj;
          self.addAuto(obj, name)
          return self;
        };


        p.addTasklist = function addTasklist( name, values, label, valueNames) {
          var options = self.utils.mergeValuePairs(values, valueNames);
          var obj = {
            label: label,
            type: self.types.tasklist,
            options: options
          };
          self.form[name] = obj;
          self.addAuto(obj);
          return self;
        };
      };
      defineElements();

      function defineHelpers() {
        p.addAuto = function addAuto(obj, name) {
          if (self.showIf != null) {
            obj.showIf = self.showIf.concat();
          } ;
          self.lastFieldName = name;
          self.lastField = obj;
        };

        p.addSection = function addSection(fx) {
          self.utils.clearAllAutos();
          fx();
          self.utils.clearAllAutos();
        };

        p.loadForm = function loadForm(newForm, dataObject, cfg) {
          self.form = newForm;
          self.data = dataObject;
          if ( cfg != null ) {
            self.config = cfg;
            self.loadConfig(cfg)
          }
          self.utils.clearAllAutos();
        };

        p.loadConfig = function loadConfig(cfg) {
          self.config = cfg;
          if ( self.config.pubSub == null ) {
            defineEvents(cfg)
          }
        };

        p.onFieldChanged = function onFieldChanged(fieldName,fx, data) {
          self.config.onFieldChanged(fieldName, fx, data)
        }

        p.loadData = function loadData(data) {
          self.data = data;
        };

        p.mixLast = function mixLast(mixin) {
          sh.each(mixin, function ( k, v) {
            self.lastField[k] = v;
          });
        };

        p.listenForChange = function listenForChange(fx) {

        }

        p.defaultValue = function dv(v) {
          self.lastField.defaultValue = v;
        };

        p.setValue = function setValue(v) {
          self.data[self.lastFieldName] = v;
        };

        p.temp = function temp() {
          self.lastField.temp = true;
        }
      };
      defineHelpers();

      function defineValidations() {
        p.required = function required(obj) {
          self.lastField.required = true;
        }
        p.lengths = function lengths(obj) {
          self.lastField.required = true;
        }
      };
      defineValidations();

      /**
       * Modify the code
       */
      function defineModifiers() {
        /**
         * Set last field as transient,
         * it will not be serialized
         */
        p.transient = function () {
          self.lastField.transient = true;
          return self;
        };

        p.addClass = function  addClass (addClasses) {
          self.lastField.classes = sh.dv(self.lastField.classes, '');
          self.lastField.classes += addClasses;
          return self;
        }

        p.addColor = function  addColor (color) {
          self.lastField.color = color;
          return self;
        }

        p.addShowIf = function  addShowIf (property, val) {
          self.showIf = [self.utils.showIf(property, val)]
          return self;
        };

        p.addLastShowIf = function  addLastShowIf(property, val) {
          sh.array.push( self.lastField.showIf,
            self.utils.showIf(property, sh.q(val) ) );
          return self;
        };

        p.addHelp = function addHelp(helpMsg) {
          //self.lastField.help = [];
          self.lastField.help =
            sh.array.push(self.lastField.help, helpMsg);
        }
        p.debugConditionals = function debugConditionals() {
          self.lastField.debugConditionals=true;
        }
      };
      defineModifiers();

      function defineUtils() {
        p.utils = {};
        p.utils.clearAllAutos = function clearAllAutos() {
          self.showIf = null;
          self.hideIf = null;
        };
        p.utils.makeRandom = function makeRandom() {
          return sh.randomizeInt(3);
        };
        p.utils.inputType = function inputType(fieldInfo) {
          var type = fieldInfo.type
          if ( types.nonInputTypes.indexOf(type) != -1 )
            return false
          return true;
        };

        p.utils.showIf = function  showIf(property, val) {
          var val = val;
          if ( val == true || val== false  ) {
          }
          else {
            val = sh.q(val)
          }
          return 'object.'+property+'=='+val;
        };

        p.utils.mergeValuePairs = function mergeValuePairs(op1, op2) {
          if ( op2 == null ) {
            return op1;
          }
          var merged = [];
          sh.each(op1, function proc(i, obj) {
            merged.push({name:obj, value:op2[i]})
          });

          return merged;
        };


        p.utils.clearTemps = function () {
          var data = {};
          sh.each(self.form, function goThgouthFields(index, field) {
            if ( field.temp == true ) {
              if ( self.data != null ) {
                data[field.label] = self.data[index]
              }
              delete self.form[index];
            }
          });

          return data;
        }


        p.utils.flattenJSON = function flattenJSON (json) {
          if ( json == null )
            return '';
          var flat = '';
          sh.each(json, function goThgouthFields(k, v) {
            if ( v == null ) {
              return;
            }
            v = sh.dv(v, '');
            flat += k+':' + '\n'
            flat += v+'\n'
          });

          return flat;
        }
      };
      defineUtils();

      /**
       * Gives event functionality to config object
       * @param config
       */
      function defineEvents(config) {
        config.pubSub = pubSub.create();
        /*if ( config.utils == null ) {
          config.utils = {};
        }*/
        config.events = {};
        var events = config.events;
        var types = config.events.types = {};

        events.onClick = function onClickDispatch(field, value, fieldInfo, object) {
          config.pubSub.publish(
            types.clickedField(field), value, fieldInfo, object);
        };
        events.onChange = function onChangeDispatch(field, value) {
          config.pubSub.publish(
            types.changedField(field), value);
        };
        types.changedField = function (name) {
          return "changed_"+name;
        };
        types.clickedField = function (name) {
          return "clicked_"+name;
        };
        config.onFieldChanged = function onFieldChanged(fieldName,fx, data) {
          config.pubSub.subscribe(
            config.events.types.changedField(fieldName),
            fx);
        };
        config.onFieldClick = function onFieldClick(fieldName,fx, data) {
          config.pubSub.subscribe(
            config.events.types.clickedField(fieldName),
            fx);
        };
        config.events.onFieldChanged = config.onFieldChanged;

      }
      //defineEvents();

      p.new = function create() {
        return new QuickFormHelper();
      }
    }

    var service = new QuickFormHelper();
    var qF = service;

    return qF;
  }

  quickFormHelperService.$inject = ['sh', 'pubSub'];



  if ( window.reloadableHelper ) {
    debugger;
    var wrapperRelodableService = window.reloadableHelper.makeServiceReloadable('quickFormHelper', quickFormHelperService)
    angular.module('com.sync.quick').factory('quickFormHelper', wrapperRelodableService );
    angular.module('com.sync.quick').factory('qFH', wrapperRelodableService );
  } else {
    angular.module('com.sync.quick').factory('quickFormHelper', quickFormHelperService );
    angular.module('com.sync.quick').factory('qFH', quickFormHelperService );
  }

}());
