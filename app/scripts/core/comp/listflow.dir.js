'use strict';

(function(){

  var app = angular.module('74App');
  var listFlow = function listFlow($templateRequest, $compile, transcludeHelper) {

    var utils = transcludeHelper.new();

    function link(scope, element, attrs){
      $templateRequest('scripts/core/comp/listflow.dir.html').then(
        function(html){

          var templateContent = angular.element(html);
          utils.templateContent = templateContent;
          utils.userContent = templateOriginal;
          utils.userContent = element;
          utils.copyContentGroup("header", '#headerContent');
          utils.copyContentGroup("content", '#bodyContent');
          utils.copyContentGroup("footer", '#footerContent');
          utils.setHtml("#lblDayCount", '{{vm.data.days}} days')

          utils.hide('#rowBottomDivider');
          utils.ifTrue(attrs.showBottomDivider, function () {
            utils.show('#rowBottomDivider');
          });

          utils.ifTrueShow(attrs.showLabelLane,
            '#rowLabel');
          utils.ifTrueShow(attrs.showTickLane,
            '#rowTick');

          html = utils.templateContent[0];
          element.append($compile(html)(scope));

          scope.element = element;
          scope.render();
        }
      )

      var $scope = scope;
      scope.$watch('vm.data', function (v, oldVal) {
        return;
        console.log('data changed... changed, new value is: ', v );
        if (angular.isString(v)) {
          v = JSON.parse(v);
        };

        var totalCount = 0;
        for (var i = 0, len = v.sets.length; i < len; i++) {
          //lookup[array[i].id] = array[i];
          totalCount += v.sets[i].count;
        }
        v.totalCount = totalCount;

        scope.vm.data = v;
      });


      $scope.$watch('vm.items', function(a,b) {
        console.log('items changed')
        if (a != null && b != null &&
          a.length != b.length ) {
          $scope.render();
        }
      });
      $scope.$watch('vm.updateFlag', function(a,b) {
        if (a != null && b != null  ) {
          console.log('items updateFlag')
          $scope.render();
        }
      });

    };

    var templateOriginal = null;
    var compile = function (tElem, attrs) {

      templateOriginal = tElem.clone();

      function defineDirectiveDefaults() {
        if ( attrs.showBottomDivider == null  ) {
          attrs['showBottomDivider'] = "false";
        };
      }
      defineDirectiveDefaults();

      return {
        post: link
      };

    }
    return {
      scope: {
        name: '@',
        data: '@',

        items: '=',
        items2: '=',
        fxTicks: '&',

        config: '=',
        updateFlag: '=',

        //visual appearance
        showBottomDivider:'@',
        showLabelLane:'@',
        showTickLane:'@'
      },
      controller: 'ListFlowController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };
  };

  app.directive('listFlow', listFlow);


  var ListFlowController = function ListFlowController ($scope,
                                                        sh,
                                                        dialogService,
                                                        listFlowUtils) {


    $scope.scale = 1/10;
    $scope.utils = {};
    var utils = $scope.utils;
    utils.convertSizeToScale = function convertSizeToScale(width) {
      var newSize = width;
      if ( $scope.scale != null ) {
        newSize = width * $scope.scale;
      }
      return newSize;
    }
    utils.getItemFromUIElement = function ( element ) {
      var item_id = element.attributes.item_id.value;
      item_id = parseInt(item_id);
      var item = $scope.vm.items[item_id];
      console.log('getItemFromUIElement',
        item, event.currentTarget.id,
        item_id );

      return item;
    }
    $scope.render = function render( ) {
      var el = $scope.element;

      var fxTicks = $scope.vm.fxTicks();
      var result = listFlowUtils.getMax($scope.vm.items);

      el.find('#rowTick').css({height: 25 + 'px'});
      el.find('#rowPrinter').css({height: 3 + 'em'});
      el.find('#rowLabel').css({height: 25 + 'px'});

      if ( result == null ) {
        return;
      }
      var oldLabel = null; //storage for label row items
      //draw all ticks
      for ( var i = result.minVal; i < result.maxVal; i++) {

        if ( fxTicks != null ) {
          var instructions = fxTicks(i);
        }

        var leftVal = (10*i) + 'px';

        var tick = angular.element('<div/>');



        tick.addClass('tickMarker');
        el.find('#rowTick').append(tick);
        //tick.css('left', (10*i) + 'px');
        tick.css({left: (10*i) + 'px'});

        if ( instructions != null ) {
          if ( instructions.label != null ) {
            if ( oldLabel ) {
              var oldLabelWidth = 10 * i - oldLabel.left+1
              oldLabel.el.css({width: (oldLabelWidth) + 'px'});
            }
            var newLabel = angular.element('<div/>');
            newLabel.addClass('labelMarker');
            newLabel.addClass('text-center');
            newLabel.html(instructions.label);
            newLabel.css({left: (10 * i) + 'px'});
            el.find('#rowLabel').append(newLabel);
            oldLabel = {};
            oldLabel.el = newLabel;
            oldLabel.left = 10 * i;
          }
          if ( instructions.row2Tick == true ) {
            var tick = angular.element('<div/>');
            tick.addClass('tickMarker');
            el.find('#rowTick').append(tick);
            tick.css({left: leftVal });
            tick.css({height: '100%' });
          }
        }
      }






      function addItemsToRow(items, rowQuery ) {

        el.find(rowQuery).html('');

        if ( items == null ) {
          return;
        }
        for ( var i = 0; i < items.length; i++) {
          var item = items[i];

          var div = angular.element('<div/>');
          if ( fxTicks != null ) {
            var instructions = fxTicks(i);
          }

          var start= item.start;
          var size = item.end - item.start;

          var div = angular.element('<div/>');

          div.bind('click', function (event) {

            item = utils.getItemFromUIElement(event.currentTarget)
            console.log('clicked',
              item_id );
            if ($scope.vm.config != null ) {
              $scope.vm.config.onClickItem(item);
            }
            return;
          });
/*
          div.bind('mouseenter', function () {
            console.log('....', 'mouseenter')
          })
          */

          div.bind('mouseover', function (event) {
            if ( $scope.dragActive == true ) {
              return;
            }
            item = utils.getItemFromUIElement(event.currentTarget)

            console.log('mouseover',
              item, event.currentTarget.id
                );

            $scope.currentItem = item;

            var dlgWidthOffset = 15;
            var dlgHeightOffset = 8;
            dlgWidthOffset = 8;
            dlgHeightOffset = 5;

            var element = angular.element(event.currentTarget);
            //get x y
            var offset = angular.element(event.currentTarget).offset();
            var opts = $scope.dialogListFlowArea;
            opts.position = {};
            opts.position.top = offset.top;
            opts.position.left = offset.left;
            opts.position.width =element.width()+dlgWidthOffset;
            opts.position.height = element.height()+dlgHeightOffset;

            opts.force = true;

            dialogService.openDialog(opts);

            if ($scope.vm.config != null ) {
              $scope.vm.config.onClickItem(item);
            }
            return;
          });


          div.attr('item_id', i);

          div.addClass('areaBg');

          if ( item.addClass != null ) {
            div.addClass(item.addClass);
          } else {
            div.addClass('areaPurple');
          }

          if ( item.areaNumber ) {
            var divName = angular.element('<div/>');
            divName.addClass('areaNumber');
            divName.html(item.areaNumber);
            div.append(divName);
          }
          if ( item.name ) {
            var divName = angular.element('<div/>');
            divName.addClass('areaName');
            divName.html(item.name);
            div.append(divName);
          }
          if ( item.gicon ) {
            var spanIcon = angular.element('<span/>');
            spanIcon.addClass('glyphicon');
            spanIcon.addClass('glyphicon-'+'record');
            //aria-hidden="tr
            div.addClass('areaCenterContent');
            div.addClass('text-center');
            div.append(spanIcon);
          }

          if ( item.belowList ) {
            div.addClass('areaBelowList');
            //div.addClass('areaBelowList2');
          }

          if ( item.aboveLine ) {
            div.addClass('areaAboveLine');
            div.addClass('text-center');
          }




          el.find(rowQuery).append(div);
          div.css({left: (10*start) + 'px', width:(10*size)+'px' });

          //draw bar through div
          if ( item.markout ) {
            var divMarkout = angular.element('<div/>');
            divMarkout.addClass('areaBg');
            divMarkout.addClass('areaMarkout');
            divMarkout.css({left: (10*start) + 'px', width:(10*size)+'px' });
            el.find(rowQuery).append(divMarkout);
          }


          //draw bar through div
          if ( item.belowList ) {
            var divBelowListFill = angular.element('<div/>');
            divBelowListFill.addClass('areaBg');
            //re-add color to get border
            if ( item.addClass != null ) {
              divBelowListFill.addClass(item.addClass);
            } else {
              divBelowListFill.addClass('areaPurple');
            }
            divBelowListFill.addClass('areaBelowList');
            divBelowListFill.addClass('areaBelowList2');
            divBelowListFill.css({left: (10*start) + 'px', width:(10*size)+'px' });
            el.find(rowQuery).append(divBelowListFill);
          }


          continue;
        }

      }

      //draw items;
      var items = $scope.vm.items;
      addItemsToRow(items, '#rowPrinter');
      //draw items;
      var items2 = $scope.vm.items2;
      addItemsToRow(items2, '#rowPrinter2');
      //draw items;
      var items3 = $scope.vm.items3;
      addItemsToRow(items3, '#rowPrinter3');




      //setupDialog();
      return;
    }


    var dragHelper = {}
    dragHelper.outsideOfBox = function outsideOfBox(
      bound, event, fx ) {

      var maxX = bound.offset().left + bound.width();
      var curX = event.clientX;
      var outOfBounds = false;
      if ( curX > maxX ) {
        outOfBounds = true;
      }
      var maxY = bound.offset().top + bound.height();
      var curY = event.clientY;
      if ( curY > maxY ) {
        outOfBounds = true;
      }

      if ( outOfBounds ) {
        //sh.callIfDefined(fx);
        if ( fx != null ) {
          fx();
        }
        return true;
      } else {
        return false;
      }
    }

    dragHelper.quantize = function (val, distance, offset) {
      var divide = val/distance;
      var remainder = val % distance;
      var fraction = remainder/distance;
      var rangeLowBound = val - remainder;
      var fractionRounded = Math.round(fraction);
      var result;
      if ( fractionRounded == 0 ) {
        result = rangeLowBound;
      } else {
        var signOfFractionRounted = fractionRounded;
        result = rangeLowBound + distance * signOfFractionRounted;
      }

      return result;
    }

    dragHelper.min = function min(width) {

    }

    dragHelper.copyWHXY = function copyWHXY(element) {
      var output = {};
      output.x =  element.offset().left;
      output.y =  element.offset().top;
      output.width = element.width();
      output.height = element.height();
      return output;
    }

    dragHelper.addGlobalDrag = function addGlobalDrag(opts) {
      opts.isDown = false;
      opts.element
        .on('mousedown',
        function onDrag(event) {
          if ( opts.isDown == true ) {
            console.log(opts.name, 'already down')
            return;
          }
          console.log(opts.name, 'drag.start', event);
          opts.isDown = true;
          $('body').addClass('noselect');
          //var initWidth = $scope.dlg.parent().width();
          opts.xStart   =   event.clientX;
          opts.yStart   =   event.clientY;
          opts.offsetX  =   event.offsetX;
          opts.offsetY  =   event.offsetY;
          opts.start    =   {} ;
          opts.start    =   dragHelper.copyWHXY(
            angular.element(
            event.currentTarget));
          opts.event    =   event;
          $(document).mousemove(onMouseMove);
          $(document).mouseup(onMouseUp);
          sh.callIfDefined(opts.fxStart, event, opts);
        });

      function onMouseMove(event) {
        if(opts.isDown == false) return;
        // Mouse click + moving logic here
        //$('.movestatus').text('mouse moving');

        //var widthDelta = event.clientX - opts.xStart;
        console.log(opts.name,'...', 'onMouseMove');
        opts.moved = {};
        opts.moved.x = event.clientX - opts.start.x;
        opts.moved.y = event.clientY - opts.start.y;
        //console.log(opts.name,'...', widthDelta, initWidth+widthDelta,
        //  $scope.dlg.parent().width());
        /*
         if ( dragHelper.outsideOfBox(el.parent(), event,
         function() {
         console.log(opts.name, 'outside of box');
         }) ) {
         return;
         }
         */
        sh.callIfDefined(opts.fxMove, event, opts);
        /*
         var newWidth = initWidth+widthDelta
         newWidth = dragHelper.quantize(newWidth, 10);
         $scope.dlg.parent().width(newWidth);

         var scaledWidth = utils.convertSizeToScale(newWidth);
         console.log('update', scaledWidth);
         $scope.currentItem.end = $scope.currentItem.start + scaledWidth;
         */
      }



      function onMouseUp(event) {
        if(opts.isDown){
          //do something
          console.log(opts.name,  'drag.end', event);
          sh.callIfDefined(opts.fxEnd, event, opts);
          opts.isDown = false;
          $('body').removeClass('noselect');

          $(document).off('mouseup', onMouseUp);
          $(document).off('mousemove', onMouseMove);
        }
      }
    }

    /*dragHelper.quantize(5, 10)==10
     dragHelper.quantize(1, 10)==0
     dragHelper.quantize(9, 10)==10
     dragHelper.quantize(99, 10)==100
     dragHelper.quantize(-16, 10)==-20*/




    function setupDialog() {
      var el = $scope.element;
      var opts = {}
      opts.name = 'dialogListFlowArea';
      opts.title = 'dialogListFlowArea'
      opts.content = 'test'
      opts.contentJquery = el.find('#dialogListFlowArea');
      $scope.dlg = opts.contentJquery;
      opts.position = {}
      opts.position.right = 0;
      opts.position.top = 0;
      opts.noWrap = true;
      //opts.move = false;

      var isDown = false;
      var startX = 0

      var dragOptions = {};
      dragOptions.element =  el.find('#dialogListFlowArea').find('#rightDragHandle');
      dragOptions.fxStart = function(event, opts) {
        opts.dlg = opts.element.parent();
        opts.start = dragHelper.copyWHXY(opts.element.parent());
        isDown = true;
        $scope.dragActive = true;
      };
      dragOptions.fxMove = function(event, opts) {

        //var widthDelta = event.clientX - opts.xStart;

        var newX = event.clientX;// - opts.start.x;
        newX = dragHelper.quantize(newX, 10);
        var oldRightX = opts.start.x+opts.start.width;
        var newWidth = oldRightX - newX;

        opts.currentDim = {};
        opts.currentDim.x = newX;
        opts.currentDim.width = opts.start.width;

        console.log(opts.name,'...', 'onMouseMove', newX,
          newWidth, oldRightX);

        if ( dragHelper.outsideOfBox(el.parent(), event,
            function() {
              console.log(opts.name, 'outside of box');
            }) ) {
          return;
        }


        // var newWidth = initWidth+widthDelta
        // newWidth = dragHelper.quantize(newWidth, 10);
        //$scope.dlg.parent().width(newWidth);
        $scope.dlg.parent().offset({left:newX});
        //var scaledWidth = utils.convertSizeToScale(newWidth);
        //console.log('update', scaledWidth);
        //$scope.currentItem.end = $scope.currentItem.start + scaledWidth;

        //opts.start = dragHelper.copyWHXY(element.parent());

      };
      dragOptions.fxEnd = function (event, opts) {
        isDown = false;
        $scope.dragActive = false;
        console.log('update', scaledWidth);

        var scaledWidth = utils.convertSizeToScale(opts.currentDim.width);
        var newStart = utils.convertSizeToScale(opts.currentDim.x);
        $scope.currentItem.start = newStart;
        $scope.currentItem.end = $scope.currentItem.start + scaledWidth;

        $scope.$apply();
      };
      dragHelper.addGlobalDrag( dragOptions );

      el.find('#dialogListFlowArea').find('#leftDragHandle')
        .on('mousedown',
        function onDrag(event) {
          if ( isDown == true ) {
            console.log('already down')
            return;
          }
          console.log('dragstart', event);
          isDown = true;
          $('body').addClass('noselect');

          var initWidth = $scope.dlg.parent().width();
          startX = event.clientX;

          $(document).mousemove(function(event){
            if(isDown == false) return;
            // Mouse click + moving logic here
            //$('.movestatus').text('mouse moving');

            var widthDelta = event.clientX - startX;
            console.log('...', widthDelta, initWidth+widthDelta,
              $scope.dlg.parent().width());


            if ( dragHelper.outsideOfBox(el.parent(), event,
                function() {
                  console.log('outside of box');
                }) ) {
              return;
            }


            var newWidth = initWidth+widthDelta
            newWidth = dragHelper.quantize(newWidth, 10);
            $scope.dlg.parent().width(newWidth);

            var scaledWidth = utils.convertSizeToScale(newWidth);
            console.log('update', scaledWidth);
            $scope.currentItem.end = $scope.currentItem.start + scaledWidth;


          });
        });
      /*
       el.find('#dialogListFlowArea').find('#leftDragHandle')
       .on('mouseup',
       function onDrag(event) {
       console.log('dragend');
       })
       el.find('body')
       .on('mouseup',
       function onDrag(event) {
       console.log('dragend');
       })
       */

      $(document).mouseup(function(event){
        if(isDown){
          //do something
          console.log('dragend', event);

          isDown = false;
          $('body').removeClass('noselect');

        }
      });



      el.find('#dialogListFlowArea').find('#leftDragHandle')
        .bind('mouseover',
        function mouseover(event) {
          console.log('mouseover');
        })

      dialogService.createDialog2(opts);

      $scope.dialogListFlowArea = opts;

      $scope.showPopup = function showPopup() {
        dialogService.openDialog(opts);
      }





    }
    setTimeout(setupDialog, 500)

  }

  //angular.module('listDemo1', ['ngMaterial'])
  app
    .controller('ListFlowController', ListFlowController);
}());
