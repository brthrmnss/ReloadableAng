'use strict';

var isNode = true

if (typeof exports === 'undefined' || exports.isNode == false) {
  isNode = false
}

if ( isNode ) {
  var sh = require('./../1st_load/shelpersService').shelpers
  exports.shelpers = sh;
  var window = {};
} else {
}
if ( typeof sh == 'undefined ') {
  var sh = {};
}

/**
 * Helper shows vanilla reloadable helper test service
 * why: When you want to reload services with your apps
 */
( function() {

  function UIX() {
    var self = this;
    var p = this;

    p.init = function init() {

    };

    p.new = function create() {
      return new UIX();
    }



    p.startOn = function startOn(jq,element) {
      if ( element != null ) {
        self.element = element.find(jq);
      } else {
        self.element = $(jq);
      }
    }

    p.makeInnerDiv = function makeInnerDiv(elementId, contents, attrs) {
      self.baseElement = sh.dv(self.element);
      var el = $('<div />');
      if ( elementId.slice(0,1) == '#') {
        elementId = elementId.slice(1)
      }
      el.attr('id', elementId);
      self.element.append(el);
      if ( contents )
        el.append(contents);
      self.element = el;
      return el;
    }


    p.size = function size(w,h) {
      var cssObj = self.ccss({
        width:w,
        height:h
      })
      //console.log('size',self.element)
      self.element.css(cssObj)
    }

    p.size.fullscreen = function fullscreen(w,h) {
      w = sh.dv(w, '100%');
      h = sh.dv(h, '100%');
      self.size(w,h);
    };
    p.size.min = function fullscreen(w,h) {
      //w = sh.dv(w, '100%');
      //h = sh.dv(h, '100%');
      var cssObj = self.ccss({
        "min-width":w,
        "min-height":h
      })
      //console.log('size',self.element)
      self.element.css(cssObj)
    };

    p.background = function background(color) {
      color = sh.dv(color, '#d2d2d2')
      var cssObj = self.ccss({
        "background-color":color,
      })
      self.element.css(cssObj);
    }


    function defineCss() {
      self.ccss = function createCssObject(vals) {
        return vals;
      }


     /* self.padding = function padding(pad) {
        var cssObj = self.ccss({
          "padding-left":pad,
        })
        self.element.css(cssObj);
      }*/
      self.margin = function margin(left, top, right, bottom) {
        /*left = sh.dv(left , '10px')
         top = sh.dv(top , left)
         top = sh.dv(top , left)
         top = sh.dv(top , left)*/
        var cssObj = self.ccss({

        })
        var left = ifUndef_IfNull_defaultProp(left, '10px', undefined, cssObj, 'margin-left');
        ifUndef_IfNull_defaultProp(top, left, undefined, cssObj, 'margin-top');
        ifUndef_IfNull_defaultProp(right, left, undefined, cssObj, 'margin-right');
        ifUndef_IfNull_defaultProp(bottom, left, undefined, cssObj, 'margin-bottom');
       // console.log('css', cssObj)
        self.element.css(cssObj);
      };

      function ifUndef_IfNull_defaultProp(val, ifUndef, ifNull, obj, prop) {
        if ( val == undefined) {
          val = ifUndef;
        }
        if ( val == null) {
          if ( ifNull == undefined ) {
            return null; //no chnage
          }
          val = ifNull;
        }
        obj[prop] = val;
        return val;
      }

      self.padding = function padding(left, top, right, bottom) {

        var cssObj = self.ccss({

        })
        var left = ifUndef_IfNull_defaultProp(left, '10px', undefined, cssObj, 'padding-left');
        ifUndef_IfNull_defaultProp(top, left, undefined, cssObj, 'padding-top');
        ifUndef_IfNull_defaultProp(right, left, undefined, cssObj, 'padding-right');
        ifUndef_IfNull_defaultProp(bottom, left, undefined, cssObj, 'padding-bottom');
        self.element.css(cssObj);
      }



      self.shadow = function shadow(left, top, right, bottom) {
        var cssObj = self.ccss({
          'box-shadow': "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        })
        var cssObj = self.ccss({
          'filter': "drop-shadow(12px 12px 7px rgba(0,0,0,0.5))",
          '-webkit-filter': 'drop-shadow(12px 12px 7px rgba(0,0,0,0.5))'
        })
        self.element.css(cssObj);
      }




      self.makeAbs = function padding( ) {
        var cssObj = self.ccss({
          position:"absolute"
        })
        self.element.css(cssObj);
      }

      self.makeAbsContainer = function padding( ) {
        var cssObj = self.ccss({
          position:"relative"
        })
        self.element.css(cssObj);
      }


      self.positionAbs = function positionAbs(left, top, right, bottom) {

        var cssObj = self.ccss({
        })
        var left = ifUndef_IfNull_defaultProp(left, '10px', undefined, cssObj, 'left');
        ifUndef_IfNull_defaultProp(top, left, undefined, cssObj, 'top');
        ifUndef_IfNull_defaultProp(right, left, undefined, cssObj, 'right');
        ifUndef_IfNull_defaultProp(bottom, left, undefined, cssObj, 'bottom');
        //debugger
        self.element.css(cssObj);
      }
    }
    defineCss();

    function defineAttrHelpers() {
      self.attr = function attr(key, val) {
        self.element.attr(key, val);
        return self;
      };

      p.a = self.attr;
    }
    defineAttrHelpers();

    function ifUndef_IfNull_defaultProp(val, ifUndef, ifNull, obj, prop) {
      if ( val === undefined) {
        val = ifUndef;
      }
      if ( val === null) {
        if ( ifNull === undefined ) {
          return null; //no chnage
        }
        val = ifNull;
      }
      obj[prop] = val;
      return val;
    }

    function defineCacheMethods() {
      /**
       * Set element
       */
      p.setElement =  function setElement(element) {
        if( element == null) {
          self.element = self.baseElement;
        } else {
          self.element = element;
        }
      }

      p.getElement =  function getElement(id) {

      }
    }
    defineCacheMethods();


    function defineTypes() {
      p.addImage = function addImage(src, elementId) {
        var el = $('<img />');
        if ( src )
          el.attr('src', src ) ;
        self.element.append(el);
        self.baseElement = sh.dv(self.element);
        self.element = el;

      }

      p.makeInnerDiv = function makeInnerDiv(elementId, contents, attrs) {
        self.baseElement = sh.dv(self.element);
        var el = $('<div />');
        self.utils.elementId(elementId, el );
        self.element.append(el);
        if ( contents )
          el.append(contents);
        self.element = el;
        return el;
      }

      p.utils = {};
      p.utils.elementId = function elementId(elementId, setIdOn) {
        if ( elementId.slice(0,1) == '#') {
          elementId = elementId.slice(1)
        };
        if ( setIdOn != null ) {
          $( setIdOn).attr('id',  elementId );
        }
        return elementId;
      }
      p.utils.setElement = function setElement(el, setIdOn) {
        self.baseElement = (self.element);
        self.element = el;
        return self;
      }
    }

    defineTypes();




    function defineBuilder() {
      p.add = function addElement(type) {
        var el = $('<'+type+'/>');
        self.element.append(el);
        self.utils.setElement(el);
        return self;
      }
      p.css = function addElementCSS(css, val ) {
        if ( val != null ) {
          var cssTemp = {};
          cssTemp[css] = val;
          css = cssTemp;
        }
        //console.log('set css', css)
        self.element.css(css)
        return self;
      }
      p.attr = function addElementCSS(k,v) {
        self.element.attr(k,v)
        return self;
      }

      p.div = function div(css) {
        return self.add('div');
      }
      p.content = function content(innerHTML, html) {
        //var el = $('<'+type+'/>')
        self.element.append(innerHTML)
        //self.util.setElement(el)
        return self;
      };
      p.class = function addClass(addClass) {
        self.element.addClass(addClass)
        return self;
      };

      /**
       *
       * @param val -
       * @param unit - appended, simplifies invokation
       */
      p.x = function setX(val, unit) {
        if ( unit != null ) {
          val += unit;
        }
        self.element.css('left', val);
        self.element.css('right', null);
      }

      p.storeTop = function storeTop() {
        self.top = self.element;
        return self;
      };
      p.goToTop = function goToTop() {
        self.element = self.top;
        return self;
      };

    }

    defineBuilder();

  }




  function testBasic() {
  }

  UIX.testBasic = testBasic;
  window.UIX = UIX;
  console.log('redefined...')
  if ( isNode ) {
    testBasic();
  }

  //alert('reloaded then')

  var wrapperService_UIX = function wrapperService_UIX( sh  ) {
    function createServiceInstance() {
      var service = new UIX();
      //console.log('making service', UIX==window.UIX)
      if ( window.UIX != null ) {
        service = new window.UIX();
      };
      //service.AngFunc = AngFunc;
      //service.DS = DS;
      return service
    }
    var service = createServiceInstance();
    service.create = function () {
      return createServiceInstance();
    };

    return service;
  };

  wrapperService_UIX.$inject = ['sh'];

  if ( isNode == false ) {
    angular.module('com.sync.quick').factory('uiX', wrapperService_UIX);
    angular.module('com.sync.quick').factory('xUI', wrapperService_UIX);
  }
}());
//alert('reloaded then2')
