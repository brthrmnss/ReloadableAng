'use strict';
/**
 * Helper provides utilies to quickly define forms
 */
( function() {

  var quickFormHelperService = function quickFormHelperService( sh, $http ) {
    function EvernotHelper() {
      var self = this;
      var p = this;

      var types = {}
      types.textArea = 'textarea';
      self.types = types;

      p.init = function init() {
      };

      function defineHelpers() {
        p.addAuto = function addAuto(obj) {
          if (self.showIf != null) {
            obj.showIf = self.showIf;
          }
          ;
          self.lastField = obj;
        }

        p.defaultValue = function dv(v) {
          self.lastField.defaultValue = v;
        }
      }

      defineHelpers();

      /**
       * Prompts have settings on creating names
       * either we update a note with a given name
       * or we add date
       * @param v
       */
      p.getNameFromPrompt = function getNameFromPrompt(v, obj) {
        var noteTitle = v.name;
        var  dateMarker = '|date|';
        if (v.prompt_type == self.types.prompt_types.todays_log) {
          noteTitle = 'log__'+dateMarker
        }
        if (v.prompt_type == self.types.prompt_types.daily_log) {
          noteTitle = noteTitle+dateMarker
        }
        /*if (v.prompt_type == self.types.evernote_actions.checklist) {
          noteTitle = noteTitle+dateMarker
        }*/
        if (v.prompt_type == self.types.prompt_types.one_off) {
          //noteTitle = 'log__|time|'
          //complain if noteittle not set
          noteTitle = noteTitle //+dateMarker
          if (obj != null ) {
            noteTitle += ' ' + obj.data
          }
          noteTitle = v.evernote_name;
        }
        //var noteTitle = 'log__' + sh.getDateStamp();
        //want ot use underscore template
        noteTitle = noteTitle.replace(dateMarker, sh.getDateStamp() )



        //var name = '';
        return noteTitle;
      }

      p.searchFor = function searchFor(title, jsonMode, fx) {
        var note = {};
        note.title = title;
        //note.newContents = content;
        note.jsonMode = jsonMode;
        note.getContentsOnly = true;
        var l = self.loading('search for '+title)
        $http.post(self.server+':5556/append_named', note).success(
          function xV (data, p, headers ) {
            console.log('done', data, p, headers)
            l();
            if ( jsonMode ) {
              sh.callIfDefined(fx, data.json)
            }else {
              sh.callIfDefined(fx, data.data)
            };
          }
        ).error(function (err){
            console.error('done', 'error', err)
            l();
          });
        //do a search for it
        function fxSearchDone(contents) {
          var soFar = JSON.parse(contents);
          var newItem = soFar;
          newItem.prompt = o;
          newItem.prompt_id = o.id;
          qCrudCreateLog.dataObject = newItem;
          qCrudCreateLog.fxRefresh();
        };
      }


      p.createNote =  function createNote(title, content, jsonMode, json ) {
        var note = {};
        note.title = title;
        note.newContents = content;
        if ( jsonMode ) {
          note.jsonMode = jsonMode
          note.jsonOnly1 = true;
          note.flat = json.$xflat
          delete json['$xflat']
          //note.json = json;
          note.json = JSON.stringify(json);
        }
        // $scope.loading = true;
        $http.post(self.server+':5556/append_named', note).success(
          function xV (data, p, headers ) {
            console.log('done', data, p, headers)
            //   $scope.loading = false;
          }
        ).error(function (err){
            console.error('done', 'error', err)
            //  $scope.loading = false;
          });
      }

      p.appendNote = function appendNote(guid, contents, fx, getContentsOnly) {
        var params = {};
        params.guid = guid;
        params.newContents = contents;
        params.getContentsOnly = getContentsOnly;

        var l = self.loading('appending for '+guid)
        $http.post(self.server+':5556/append_named', params).success(
          function onNoteApended (data, p, headers ) {
            console.log('done', data, p, headers)
            l();
            sh.callIfDefined(fx, data.data)
          }
        ).error(function onNoteApended_Fault(err){
            console.error('done', 'error', err)
            l();
          });
      }



      function addToLog(content) {
        var noteTitle = 'log__' + sh.getDateStamp();
        createNote(noteTitle, content)
      }



      function defineUtils() {
        p.utils = {};
        p.utils.clearAllAutos = function clearAllAutos() {
          self.showIf = null;
          self.hideIf = null;
        };

        /**
         * Pass in a loading indicator helper
         * @returns {*|fx|Function}
         */
        p.loading = function addLoadingIndicator() {
          if ( self.loadingIndicator == null )
            return function loadingEndStub(){};

          var output = self.loadingIndicator.addLoad(msg)


          return output.fx;
        }
      }

      defineUtils();

      p.new = function create() {
        return new EvernotHelper();
      }
    }

    var service = new EvernotHelper();
    var qF = service;


    return qF;
  }

  quickFormHelperService.$inject = ['sh', '$http'];

  angular.module('com.sync.quick').factory('evernoteHelper', quickFormHelperService );
  angular.module('com.sync.quick').factory('eH', quickFormHelperService );
}());
