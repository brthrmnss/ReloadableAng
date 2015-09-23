'use strict';

(function(){

  var input = '';
  var initial = "";
  var str = initial +
    ['Edit Prompt',
      '',
      'Name',
      'Description',
      'Color',
      'Every Hours',
      '1 Per Day',
      'Data',
      'List',
      ''].join("\n" +initial);




  function StrToJSONGenerator() {
    var self = this;
    var p = self;

    p.addField = function addField(lbl, field) {
      var cFieldName = function cFieldName(fieldName){


        fieldName = fieldName.toLowerCase();
        fieldName = fieldName.split(' ').join('_');

        return fieldName
      }

      var fieldLbl = cFieldName(lbl)
      self.fields[fieldLbl] = field;

      //Set Display label
      if ( fieldLbl != lbl ) {
        field.label = lbl;
      }
      return fieldLbl;
    }
    p.convertStr = function convertStr(str) {
      var fields = {};
      self.fields = fields;
      var lastField = {};
      for ( var i =0; i < self.lines.length; i++ ) {
        var line = self.lines[i];
        if ( line.trim() == '' )
          continue;
        var firstChar = line.slice(0,1);
        var continuation = false;
        if ( firstChar == '#') {
          continue;
        }
        if ( firstChar == ' ') {
          continuation = true
        };


        var field = {};
        if ( line.indexOf(':') != -1 ) {
          var split = line.split(':');
          var lbl = split[0];
          var values = split[1];

          field = {}

          var fieldLbl = self.addField(lbl, field);


        } else {
          values = line;
          field = lastField;

          //Only field label
          if ( line.indexOf('=')==-1 ) {
            line = line.trim();
            field = {}
            lbl = line;

            var fieldLbl = self.addField(lbl, field);

            if ( line.indexOf('xskip') != -1 ) {
              asdf.g.g
              delete self.fields[fieldLbl]
            }
            continue;
          }
        }




        values = values.trim();
        values = values.split(',')

        var goThroughValues = function goThroughValues(values) {
          for ( var i2 =0  ; i2 < values.length; i2++ ) {
            var value = values[i2];
            value = value.trim();
            var firstChar = value.slice(0,1);
            var str = value.slice(1);
            var str2 = str.trim();
            if ( value == 'required') {
              field.required = true;
              continue;
            }
            if ( firstChar == '<') {
              field.maxChars = str2;
              continue;
            }
            if ( firstChar == '>') {
              field.minChars = str2;
              continue;
            }
            var split = value.split('=')
            if ( split.length == 2 ) {
              var fieldName = split[0];
              var fieldValue = split[1]
              field[fieldName] = fieldValue;
              continue;
            }

            field['description'] = line;


          }
        }

        goThroughValues(values)


        if ( line.indexOf('xskip') != -1 ) {
          delete self.fields[fieldLbl]
        }

        lastField = field;
      }

      return fields;
    }

    p.loadFile = function loadFile(file, contentsOnly) {
      var fs = require('fs');
      var content = fs.readFileSync('viewEditLog.txt');
      content = content.toString();
      if ( contentsOnly == true ) {
        return content;
      }
      var lines = content.split('\n');
      self.lines = lines;
      return self.convertStr();
    }

    p.loadStr = function loadStr(contents) {
      var lines = contents.split('\n');
      self.lines = lines;
      return self.convertStr();
    }
  }


//handle node debugging
  if ( typeof require  != 'undefined' ) {
    //console.log(lines);

    var x = new StrToJSONGenerator();
    //var fields = x.convertStr();
    var fields = x.loadFile('viewEditLog.txt')
    console.log(JSON.stringify(fields, "\t", "\t"))



    return
  }


  var quickGen = function quickGenerator($templateRequest, $q) {
    var self = this;
    var p = this;

    self.StrToJSONGenerator = StrToJSONGenerator;
    self.convertStr = function (strInput) {
      var x = new StrToJSONGenerator();
      var fields = x.loadStr(strInput)
      return fields;
    }

    self.loadFile = function loadFile(url, file) {
      var deferred = $q.defer();

      if ( file != null ) {
        url += '/'+ file;
      }

      $templateRequest(url).then(
        function(html){
          var gen = new StrToJSONGenerator();
          var fields = gen.loadStr(html);
          deferred.resolve(fields)
          return fields;
      });

      return deferred.promise;
    }


    var service = new quickGenerator();
    return service;
  }
  quickGen.$inject = ['$templateRequest', '$q' ];


  var quickModule = angular.module('com.sync.quick');

  quickModule.service('quickGen', quickGen);


}());

