'use strict';

( function() {

  var transcludeHelper = function transcludeHelper_() {

    function TransclutionHelper() {

      var self = this;
      var p = this;
      var utils = self;
      self.dictTemplates = {}
      /**
       * Stores template sent to compile method
       * This is our only opportunnity to get
       * the template in a raw state.
       * Store in a dictionary
       * @param tElem
       * @param attrs
       */
      utils.storeTemplate = function storeTemplate(tElem, attrs ) {
        /*var forceKeys = true;
         var key = attrs.id;
         if ( key == null ) {
         key = attrs.title
         }
         if ( key == null ) {
         if ( forceKeys ) {
         attrs.id = Math.random();
         key = attrs.id
         }
         else {
         console.error('no key for', tElem, attrs)
         throw new Error('no key');
         //or add one?
         }
         }*/
        if ( attrs == null ) { throw 'send attrs'}
        var key = attrs.q_key_id;
        if ( key == null ) {
          key = Math.random();
          //update the DOM with random id
          attrs.q_key_id = key;
        }
        self.dictTemplates[key]=tElem.clone();
        self.lastKey = key;
        //store original template content
        self.userTemplateContent = tElem.clone();
        return self.lastKey;
      }


      /**
       * Store the user content.
       * This is the dom specified with the directive.
       * Why: We need to store this b/c if a user
       * has multiple instances of directive, each
       * can have different template content.
       * We can only access this property in the compile() method
       * @param tElem
       */
      utils.storeUserContent = function storeUserContent(tElem) {
        utils.userTemplateContent = tElem.clone();
      }

      /**
       * Get component template (skin) and
       * reference to element.
       * Note this is only valid for this one iteration
       *
       * @param html
       * @param element
       */
      utils.loadTemplate = function loadTemplate(html, elementPostProcessed, oldAttrs) {
        var templateContent = angular.element(html);
        self.templateContent = templateContent;
        //utils.userTemplateContent = templateOriginal;
        //keyTemplate = sh.dv(keyTemplate, self.lastKey);
        var keyTemplate= null;
        if (oldAttrs != null ) {
          //self.getKey(oldAttrs)
          keyTemplate = oldAttrs.q_key_id ;
        };

        if ( keyTemplate == null ) {
          //keyTemplate = self.lastKey;
        };

        if ( keyTemplate == null  ) {
          throw new Error('template key is null');
        }
        self.userTemplateContent = self.dictTemplates[keyTemplate]
        if ( self.userTemplateContent == null ) {
          throw new Error('userTemplateContent is null')
        }

        utils.element = elementPostProcessed;
        self.userContent = elementPostProcessed;

        self.contentTarget;//
        //this is the template element
        self.contentTemplate = self.directiveTemplate = self.templateContent;

        //why: this shows what angularjs would expet the componnet to be
        self.devContentPost = self.contentCurrent = self.currentContent =
          self.contentPost = self.userContent;
        //why: rarely used shows what angularjs has done to content ....
        //why: not sure if this should be used ...
        //this is what dev specified, ang-expressions have been processed

        //wh: this is what the user specified inside the directive in the parent dom
        self.devContent = self.contentDev = self.contentDom = self.userTemplateContent;

        //self.contentDevContents =
        // self.contentDevOuterHTML = element.html() //this is html of entire outer component
      }


      utils.getFinalTemplate = function getFinalTemplate() {
        return utils.templateContent[0];
      }


      utils.setupTransclution = function setupTransclution(scope, $compile, element) {
        self.directivesElement = element;
        self.$compile = $compile;
        self.scope = scope;
      }
      utils.finishContent = function finishContent(htmlFinalized, scope , target) {
        if ( htmlFinalized ) {
          htmlFinalized = utils.getFinalTemplate();
        }
        var directiveElements = self.$compile(htmlFinalized)(self.scope)
        if ( target ) {
          //todo
        }
        self.directivesElement.html(directiveElements);
      }

      /**
       * Search userTemplate for fromQuery
       * Place content in toQuery
       * @param from
       * @param to
       */
      utils.copyContentGroup = function ( from, to) {
        var fromContent = utils.userContent.find(from)[0];
        if ( fromContent == null || fromContent.length == 0  ) {
          utils.templateContent.find(to).hide();
          return;
        }
        utils.templateContent.find(to).append(fromContent);
      };

      /**
       * Search userTemplate, remove item from template
       * so it is not reapplied to templatecontent
       * (think of this as a trasnclude)
       * @param from
       * @param to
       * @returns {*}
       */
      utils.copyContentGroup2 = function ( from, to, clear, fxModify,
                                           getChildrenOnly, hideIfNotFound) {
        var fromContent = utils.userTemplateContent.find(from)[0];
        utils.userContent.find(from).remove();
        if ( fromContent == null || fromContent.length == 0  ) {
          if ( hideIfNotFound != false ) {
            utils.templateContent.find(to).hide();
          }
          return;
        };
        if ( getChildrenOnly == true ) {
          fromContent = fromContent.children;
        }
        if ( fxModify != null ) {
          var tempFromContent = fxModify(fromContent);
          if (   tempFromContent == false ) {
            return;
          }
          if ( tempFromContent != null ) {
            fromContent = tempFromContent
          }
        }
        if ( clear == true  ) {
          utils.templateContent.find(to).empty();
        }
        utils.templateContent.find(to).append(fromContent);
        utils.templateContent.find(to).show();
        return fromContent;
      };

      utils.transclude = utils.copyContentGroup2;

      /**
       * Copies attribute, will by default skip
       * if attribute not found
       * @param value
       * @param to
       * @param hideIfNoContent
       * @returns {boolean}
       */
      utils.ifDefinedAddTo = function ( value, to, hideIfNoContent) {
        if ( value == null || value.length == 0  ) {
          if (hideIfNoContent == true) {
            utils.templateContent.find(to).hide()
          }
          return false;
        }
        utils.templateContent.find(to).show()
        utils.templateContent.find(to).append(value);
      };

      utils.ifAttrDefinedAppendTo = utils.ifDefinedAddTo;

      /**
       * Usage - will copy content of value,
       * and if child content is defined
       * will copy content to 'to'
       * @param value
       * @param to
       * @param wrapInContent
       * @returns {boolean}
       */
      utils.ifContentDefinedAddTo = function ( value, to,
                                               wrapInContent,
                                               hideIfNoContent,
                                               rawValue) {
        if ( value == null || value == '' || value.length == 0  ) {
          return false;
        };

        var valueElement =null
        if ( rawValue != true ) {
          var valueElement = angular.element(value);
          var valueElement = utils.userTemplateContent.find(value)[0];
          if (valueElement == null) {
            return false;
          }  ;
          valueElement = valueElement.children;
        } else {
          valueElement = value;
        }

        if ( wrapInContent != null ) {
          var wrapElement = angular.element(wrapInContent);
          wrapElement.append(valueElement);
          valueElement = wrapElement;
        };

        utils.templateContent.find(to).show();
        utils.templateContent.find(to).append(valueElement);
      };

      utils.ifContentDefinedAddTo = utils.ifContentDefinedAddTo;

      /**
       * If value is truthy, invoke callback
       * @param value
       * @param fxCallback
       * @returns {boolean}
       */
      utils.ifTrue = function ( value, fxCallback ) {
        if ( value == null || value == '' || value.length == 0  ) {
          return false;
        }
        if ( value == true ||  value == 'true' ) {
          fxCallback();
          return true;
        }
        return false;
      }

      utils.ifFalse = function ( value, fxCallback ) {
        if ( value == null || value === '' || value.length == 0  ) {
          return false;
        }
        if ( value == false ||  value == 'false' ) {
          fxCallback();
          return true;
        }
        return false;
      }

      utils.ifDefined = function ( value, fxCallback ) {
        if ( value == null || value === '' || value.length == 0  ) {
          return false;
        }
        if ( value != null ) {
          fxCallback(value);
          return true;
        }
        return false;
      }

      //The following methods affect the templateContent
      utils.setHtml = function ( elemQuery, val,  hideIfNull ) {
        if ( val == null )  {
          utils.templateContent.find(elemQuery).addClass('hide');
          return ;
        }
        utils.templateContent.find(elemQuery).html(val);
      }

      utils.show = function ( elemQuery ) {
        utils.templateContent.find(elemQuery).show()
        utils.templateContent.find(elemQuery).removeClass('hide')
      }

      /**
       * If val is truthy, display elemQuery
       * else hide elemQuery
       * @param val
       * @param elemQuery
       * @returns {boolean}
       */
      utils.ifTrueShow = function (val,  elemQuery ) {
        utils.hide(elemQuery);
        return utils.ifTrue(val, function () {
          utils.show(elemQuery);
        });
      }

      utils.ifFalseHide = function (val,  elemQuery, hideDetach ) {
        return utils.ifFalse(val, function () {
          utils.hide(elemQuery);
          if ( hideDetach) {
            utils.templateContent.find(elemQuery).detach();
          }
        });
      }

      utils.hide = function ( elemQuery ) {
        utils.templateContent.find(elemQuery).hide()
      }



      utils.convertItem = function convertItem() {

        var output = [];
        for (var i = 0; i <  utils.templateContent.length; i++) {
          var node = utils.templateContent[i]
          if ( node.data != null ) {
            output.push( "\n"+node.data );
          } else {
            output.push( node.valueOf() );
          }
        }
        html = output.join("\n");

      }


      /**
       * Set data in the final template
       */

      utils.setHtml = function ( elemQuery, val,  hideIfNull ) {
        if ( val == null && hideIfNull != false  )  {
          utils.templateContent.find(elemQuery).addClass('hide');
          return ;
        }
        utils.templateContent.find(elemQuery).html(val);
      }

      utils.getHTML = function () {
        var html = utils.templateContent[0];
        return html;
      }

      function defineAttributeHelpers() {
        /**
         * Set utils.attrs first
         * @param name
         * @param val
         */
        utils.defaultAttribute = function defaultATtr(name, val, attrs) {
          if (attrs != null) {
            utils.attrs = attrs;
          }
          if (utils.attrs[name] == null) {
            utils.attrs[name] = val.toString();
          }
          ;
        }
        utils.defaultAttr = utils.defaultAttribute;
      }
      defineAttributeHelpers();


      utils.watch_copyToScope= function watch_copyToScope(prop, propTo,
                                                          onlyIfNotNull,
                                                          equalityWatch) {

        var scope = utils.$scope;
        scope.$watch(prop,
          function (v, oldVal) {
            if (v != null && onlyIfNotNull === true) {
              /* console.log('scope.vm.formObject... changed: ',
               scope.vm.formObject, v);*/
              console.log('copying ',propTo, v)
              scope[propTo] = v;
            };
            /*if (v !== null  ) {
             scope[propTo] = v;
             };*/
            /*console.log('quickCrud',
             'scope.vm.formObject... changed: ',
             scope.vm, v,oldVal);*/
          },equalityWatch);

      }

      function defineHTMLHelpers() {
        utils.wrap = function wrap(valueElement,  wrapInContent) {
          //if ( sh.startsWith(valueElement))
          if ( wrapInContent.slice(0,1)!='<') {
            wrapInContent = '<'+wrapInContent+'/>';
          }
          if ( wrapInContent != null ) {
            var wrapElement = angular.element(wrapInContent);
            wrapElement.append(valueElement);
          };

          return wrapElement;
        }
      }
      defineHTMLHelpers();

      function defineScopeHelpers() {
        utils.dictElements = {};
        utils.destroyDuplicateScopes = function destroyDuplicateScopes(element, scope) {
          return;
          var otherScope = utils.dictElements[element];

          if ( otherScope != null && otherScope != scope ) {
            console.error('new scope....')
            otherScope.$destroy();
          }
          utils.dictElements[element] = scope;
        };
      }

      defineScopeHelpers();


      function defineComponentHelpers() {
        self.log = function log(msg) {
          console.log()
        }
      }

    }


    var helper = {};
    helper.new = function(item) {
      return new TransclutionHelper(item);
    }

    helper.move = function (from, to, getChildren) {
      var contents = angular.element(from);
      if ( getChildren ) {
        contents = angular.element(from).children();
      }
      angular.element(to).append(contents);
    }
    helper.utils = new TransclutionHelper();
    return helper;

  }
  angular.module('74App').factory('transcludeHelper', transcludeHelper );
}());
