'use strict';
/**
 * Helper shows vanilla reloadable helper test service
 * why: When you want to reload services with your apps
 */
( function() {
  function QuickUIService() {
    var self = this;
    var p = this;

    p.init = function init() {

    };

    p.new = function create() {
      return new QuickUIService();
    }
  }





  var isNode = true

  if (typeof exports === 'undefined' || exports.isNode == false) {
    isNode = false
  }

  function QuickUIConvertor() {
    var self = this;
    var p = this;
    p.getAttributes = function (el) {
      var nodes=[], values=[];
      var attrs = {};
      for (var att, i = 0, atts = el.attributes, n = atts.length; i < n; i++){
        att = atts[i];
        nodes.push(att.nodeName);
        values.push(att.nodeValue);
        attrs[att.nodeName]=att.nodeValue
      }
      attrs.$names = nodes;
      return attrs
    };

    p.process = function process(elStart, dictTypes, dictAttrs) {
      var children = elStart.find('*');
      var ifx = function ifXHasPropCallFxWithVal(x, prop, fx) {
        if ( x[prop] != null ) {
          fx(x[prop])
        }
      }

      function transformElement( el, def) {
        var q = $(el);
        //do before changed by changeTo
        ifx(def, 'addHTML', function(addHTML){
            q.append($(addHTML))}
        );
        ifx(def, 'fx', function(fx){fx(el, def)} );
        ifx(def, 'addClass', function(addClass){q.addClass(addClass)} );

        if ( def.changeTo != null ) {
          q.replaceTagName( def.changeTo );
        };

      }

      //todo run jquery to find elements to apply transforms
      $.each(children, function (i,inputElement) {
        //console.log(i);
        var q = $(inputElement);
        var element = null;
        var el = element = q[0];
        var type = element.tagName.toLowerCase();
        var attrs = self.getAttributes(element);////.attr();

        var typeDef = dictTypes[type]
        if ( typeDef != null ) {
          transformElement(el, typeDef);
        }

        var ifxEq = function ifXHasPropCallFxWithVal(x, prop, val) {
          if ( x[prop] == val ) {
            return true;
          }
          return false;
        }

        $.each(attrs, function (attrName, val) {
          //search for matching attr change definition in dictionary
          var attrDef =  dictAttrs[attrName]
          if ( attrDef != null ) {
            if ( attrDef.keep !== true ) {
              q.attr(attrName, null);
            }
            var skipAttr = false;
            if ( ifxEq(attrDef, 'ifVal', true ) ) {
              if ( val == 'true' || val == true ) {

              } else {
                return;
              }
            };
            if ( skipAttr )
              return;
            transformElement(el, attrDef);

          }
        })

      });
    }

  }

  if ( isNode ) {
    var shelpers = require('shelpers')
    var sh = shelpers.shelpers;
    var PromiseHelperV3 = shelpers.PromiseHelperV3;

    $ = function jqueryImpersonator() {
      return $;
    }
    $.click = function () {

    }
    $.click = function () {

    }
    $.attr = function () {

    }
    $.val = function () {

    }
    console.log($, '$')
  }else {
    $.fn.replaceTagName = function(replaceWith) {
      var tags = [],
        i    = this.length;
      while (i--) {
        var newElement = document.createElement(replaceWith),
          thisi      = this[i],
          thisia     = thisi.attributes;
        for (var a = thisia.length - 1; a >= 0; a--) {
          var attrib = thisia[a];
          newElement.setAttribute(attrib.name, attrib.value);
        };
        newElement.innerHTML = thisi.innerHTML;
        $(thisi).after(newElement).remove();
        tags[i] = newElement;
      }
      return $(tags);
    };

  }






  //alert('reloaded then')
  window.QuickUIService != QuickUIService;

  var reloadableHelperTestService = function reloadableHelperTestService( sh, pubSub ) {
    function createService() {
      var service = new QuickUIService();
      if ( window.QuickUIService != null ) {
        service = new window.QuickUIService();
      };
      service.QuickUIConvertor = QuickUIConvertor;
      return service
    }
    var service = createService();
    service.create = function create() {
      return createService();
    };

    return service;
  };

  reloadableHelperTestService.$inject = ['sh', 'pubSub'];

  angular.module('com.sync.quick').factory('quickUI', reloadableHelperTestService );
}());
