/**
 * Created by user2 on 4/17/16.
 */



var dictTypes = {};
var dictAttrs = {};

//alert('d')

dictTypes['t']={changeTo:'textarea', addHTML:'<checkbox>sdfsdf', addClass:'textarea_class'};
dictTypes['tx']={changeTo:'div', addHTML:'<checkbox>', addClass:'textarea_class'};
dictTypes['navbtn']={changeTo:'div', addHTML:'<checkbox>', addClass:'navBtn'};
dictAttrs['prettybtn']={addClass:'mbButton marty'};
dictTypes['spacer']={replaceWith:'<div style="width:10px;height:10px;"></div>'};
dictAttrs['makeredbtn']={ifVal:true, addClass:'redbtn', addHTML:'<span>red btns</span>'};
dictAttrs['horizontal-layout']={ifVal:true, addClass:'horizontal-flex-container',
  addClassToChildren: 'horizontal-flex-container-flex-item pad10',
  debugChildren:true,
  modifyChildrenFx: function (child, index, attrs, css ) {
    if ( attrs.stretch != null ) {
      child.addClass('horizontal-flex-container-flex-item-stretch');
    }
  },
  _addHTML:'<span>red btn</span>', alert:true};
dictAttrs['add-class-to-children']={
  modifyChildrenFx: function (child, index, attrs, css , parentAttrs ) {
    var addToClassChildren =  parentAttrs['add-class-to-children']
    if ( addToClassChildren != null ) {
      child.addClass(addToClassChildren);
    }
  },
  alert:true
};

var content = $('#start');
 $('#end').html(content.clone())
var content = $('#end');
//quickUI = quickUI.create();
var q = new QuickUIConvertor()
//var children = utils.templateContent.find('*');
q.process(content, dictTypes, dictAttrs)
