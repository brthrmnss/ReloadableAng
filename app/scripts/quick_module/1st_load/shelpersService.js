'use strict';
var isNode = true

if (typeof exports === 'undefined' || exports.isNode == false) {
  isNode = false
} else {
  var angular = {};
}
/**
 * Sutils provides service for basic helper method calls
 */
( function() {

  var sUtils = function sUtils( ) {

    var service = {}
    var sh = service;
    service.dv = function defaultValue( val, defaultVal) {
      if ( val == null ) {
        return defaultVal;
      }
      return val;
    }
    service.defaultValue = service.dv;

    service.clone = function clone( items) {
      return   JSON.parse(JSON.stringify(items));
    }

    service.callIfDefined =   function callIfDefined(fx) {
      if (fx == undefined)
        return;
      var args = convertArgumentsToArray(arguments)
      args = args.slice(1, args.length)

      // console.debug('args', tojson(args))
      return fx.apply(null, args)
      //return;
    }

    service.copyProps =   function copyProps(from, to) {
      for (var propName in from) to[propName] = from[propName];
    }

    function convertArgumentsToArray(_arguments) {
      var args = Array.prototype.slice.call(_arguments, 0);
      return args
    }


    function defineBasics() {
      sh.toJSONString = function toJSONString(o, printJSON) {
        printJSON = defaultValue(printJSON, false)
        var json = JSON.stringify(o, "\t", "\t")
        if (printJSON) {
          console.log(json)
        }
        return json;
      }

      sh.n = "\n";


      /**
       * Readible verion of replace
       * @param url
       * @param subStr
       * @returns {boolean}
       */
      sh.replace = function replace(str, find, replaceWith) {
        function escapeRegExp(string) {
          return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }
        // So in order to make the replaceAll function above safer, it could be modified to the following if you also include escapeRegExp:

        // function replaceAll(string, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replaceWith);
      }

    }
    defineBasics();

    function defineGenerators() {
      service.randomizeInt = function (length) {
        length = service.dv(length, 3)
        var str = Math.random()*10000000
        str = str.toString().substring(0,length);

        return str
      };

    }
    defineGenerators();

    function defineIterators() {
      function each(object, callback, args) {

        var name, i = 0, length = object.length;

        if (args) {
          if (length === undefined) {
            for (name in object)
              if (callback.apply(object[ name ], args) === false)
                break;
          } else
            for (; i < length;)
              if (callback.apply(object[ i++ ], args) === false)
                break;

          // A special, fast, case for the most common use of each
        } else {
          if (length === undefined) {
            for (name in object)
              if (callback.call(object[ name ], name, object[ name ]) === false)
                break;
          } else
            for (var value = object[0];
                 i < length && callback.call(value, i, value) !== false; value = object[++i]) {
            }
        }

        return object;
      }

      service.each = each

      service.each.print = function print(items, prop) {
        sh.each(items, function print(i, x) {
          var val = x;
          if (prop != null) {
            val = x[prop]
          }
          console.log(i + 1, val)
        });
      };

      service.each.times = function times(number, fx, startAt0) {
        var numbers = [];
        var number = parseInt(number);
        var numStart = 1;
        if ( startAt0 == true ) { //by default 10 times give syou 0-1, here we use 1- 10
          numStart = 0;
        }
        for ( var i = 0; i < number; i++) {
          var num = i;
          num += numStart;
          numbers.push(num);
        }
        if ( fx != null ) {
          return sh.each(numbers, fx)
        }
        else {
          return numbers;
        }
      }

      service.each.find = function find(items, prop, equalsVal, falseIfNull) {
        var matchedItems = [];

        sh.each(items, function print(i, obj) {
          if ( angular.isArray(equalsVal)) {
            if ( equalsVal.indexOf(obj[prop]) != -1  ) {
              matchedItems.push(obj);
            }
            return;
          }
          if (  obj[prop] == equalsVal ) {
            if ( obj[prop] == null && falseIfNull == true ) {
              return;
            }
            matchedItems.push(obj);
          }
        });
        return matchedItems;
      };

      service.each.collect = function collect(items, prop) {
        var returnedValues = [];
        sh.each(items, function print(i, obj) {
          returnedValues.push(obj[prop]);
        });
        return returnedValues;
      };

      service.each.setProp = function setProp(items, prop, newVal) {
        var returnedValues = [];
        sh.each(items, function print(i, obj) {
          obj[prop]=newVal;
        });
        return returnedValues;
      };


    }
    defineIterators();
    sh.isObject = angular.isObject;
    function defineIteratorExtras() {

      sh.each.lines = function (items, config) {
        config = sh.dv(config, {})
        if ( sh.isObject( items )) {
          config = items;
        };
        if ( config.str != null ) {
          items = config.str.split('\n');
        };

        var lines = [];
        lines = sh.dv(config.addTo, []);
        sh.each(items, function processLine(i, line) {
          if ( line == null ) {
            return;
          }
          if ( line.trim() == '' && config.skipEmpty != false  ) {
            return;
          }
          if ( config.trim != false ) {
            line = line.trim();
          }

          if ( config.ignore != null ) {
            var ignoreFault = false;
            sh.each(config.ignore, function testIgnoreLineFilter(x, ignore) {
              if (sh.includes(line, ignore)) {
                return false;
              }
            });
            if (ignoreFault) {
              return;
            };
          }

          if ( config.fxProc != null ) {
            config.line = line;
            config.includes = function includes(val){
              return config.line.indexOf(val)!=-1;
            };

            config.remove = function remove(val){
              config.line = config.line.replace(val, '');
              return config;
            };

            line = sh.callIfDefined(config.fxProc, line)
            if ( line == null )
              return;
            if ( line == false )
              return false; //stop processing
          }

          lines.push(line)

        })

        return lines;
      }
    }

    defineIteratorExtras();

    var sh = service
    function defineTimeRelated() {

      sh.getTime = function getTime() {
        return sh.getTimeStamp(null, true, true)
      }
      sh.getTimeStamp = function getTimeStamp(timeOverride,
                                              hoursAndMinsOnly,
                                              noDate) {
        var str = "";

        var currentTime = new Date()
        if (timeOverride != null) {
          currentTime.setTime(timeOverride);
        }
        var hours = currentTime.getHours()
        var minutes = currentTime.getMinutes()
        var seconds = currentTime.getSeconds()

        if (minutes < 10) {
          minutes = "0" + minutes
        }
        if (seconds < 10) {
          seconds = "0" + seconds
        }
        if ( hoursAndMinsOnly != true ) {
          str += hours + "_" + minutes + "_" + seconds// + " ";
        } else {
          str += hours + ":" + minutes;
        }
        //(time.getMonth() + 1)+'-'+time.getDate()+'-'+time.getFullYear()+' '+(time.getHours()+1)+'-'+time.getMinutes()+'-'+time.getSeconds().toString();

        if ( noDate != true ) {
          str = (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + '-' + currentTime.getFullYear() + '_' + str;
        }

        return str;
      }

      sh.getDateStamp = function getTimeStamp(timeOverride) {
        var str = "";

        var currentTime = new Date()
        if (timeOverride != null) {
          currentTime.setTime(timeOverride);
        }
        var month = currentTime.getMonth()+1
        var year = currentTime.getFullYear()
        var day = currentTime.getDate()


        str += month + "-" + day + "-" + year; /// + " ";

        return str;
      };

    }

    defineTimeRelated();


    function defineGrammar() {
      sh.qq = function qq (str) {
        return '"' +str +  '"'
      }
      sh.q = function q (str) {
        return "'" +str +  "'"
      }
    }

    defineGrammar();


    function defineArrayHelpers() {
      sh.strToArray = function strToArray(str) {
        var newArr = [];
        if ( str == '' || str == null ) {
          return [];
        }
        var split = str.split("\n");
        sh.each(split, function trimEach(i, x) {
          newArr.push(x.trim());
        })

        return newArr;
      }


      sh.array = {};
      sh.array.push = function pushIntoArray(arr, newItem) {
        var newArray = arr;
        newArray = sh.dv(arr, []);
        newArray.push(newItem);
        return newArray;
      }
    }
    defineArrayHelpers();

    return service;

  }

  sUtils.$inject = [ ];
  if ( isNode == false ) {
    angular.module('com.sync.quick').factory('sUtils', sUtils);
    angular.module('com.sync.quick').factory('sh', sUtils);
  } else {
    exports.shelpers = new sUtils()
  }
}());
