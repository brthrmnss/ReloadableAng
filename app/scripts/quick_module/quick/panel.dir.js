'use strict';

(function(){

    var app = angular.module('com.sync.quick');
    var fxPanel = function fxPanel_($templateRequest, $compile) {

        var utils = {}
        utils.copyContentGroup = function ( from, to) {
            var fromContent = utils.userContent.find(from)[0];
            if ( fromContent == null || fromContent.length == 0  ) {
                utils.templateContent.find(to).hide()
                return;
            }
            utils.templateContent.find(to).append(fromContent);
        }

        function link(scope, element, attrs){
            $templateRequest('scripts/core/quick/panel.dir.html').then(
                function(html){
                    var templateContent = angular.element(html);
                    utils.templateContent = templateContent;
                    utils.userContent = templateOriginal;
                    utils.userContent = element;
                    utils.copyContentGroup("header", '#headerContent');
                    utils.copyContentGroup("content", '#bodyContent');
                    utils.copyContentGroup("footer", '#footerContent');
                    html = utils.templateContent[0];
                    element.append($compile(html)(scope));
                }
            )
        };

        var templateOriginal = null;
        var compile = function (tElem, tAttrs) {

            templateOriginal = tElem.clone();

           /* $templateRequest('scripts/core/panel.dir.html').then(
                function(html){
                    var templateHTML = angular.element(html);
                    utils.template = templateHTML;
                    utils.element = tElem;
                    utils.copyContentGroup("header", '#headerContent');
                    utils.copyContentGroup("content", '#bodyContent');
                    utils.copyContentGroup("footer", '#footerContent');
                    html = templateHTML[0];
                    tElem.pop()
                    tElem.push(html);
                    //element.append($compile(html)(scope));
                }
            )
            console.log('compile');*/
            return {
                post: link
            };

        }
        return {
            /*scope: {
                name: '@',
                items: '@',
                fxSelectItem: '&',
                selectedIndex: '='
            },*/
            controller: 'HeaderController',
            controllerAs: 'vmC',
            // bindToController:true,
            // button ng-click="fxSelectItem"
            //link: link ,
            compile: compile,
            // templateUrl: 'scripts/core/header.menu.html'
        };
    };

    app.directive('fxPanel', fxPanel);


}());
