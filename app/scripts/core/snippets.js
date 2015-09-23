
(function(){
  return;

  var utils = {};
  utils.createMenu = function createItems(items) {
    var results = [];
    for ( var i = 0; i < items.length ; i++) {
      var item = items[i];
      var obj = {}
      obj.name = item;
      results.push(obj);
    }
    return results;
  }





//broadcast to root scope

  $scope.viewB  =function goToViewB() {
    var data = {};
    data.id = 'topA';
    data.dom = $scope.vm.views['b'];
    data = convertToData(data)
    $rootScope.$broadcast('loadAppArea', data);

    console.log('go to view b');
  }


//proper way to access cope in controller


//set a default value
  var compile = function (tElem, attrs) {

    templateOriginal = tElem.clone();
    dictTemplates[attrs.title] = templateOriginal;
    utils.tX = templateOriginal;
    console.log('compile', attrs.title);

    //default values must be strings
    function defineDirectiveDefaults() {
      if ( attrs.selectedIndex == null  ) {
        attrs['selectedIndex'] = "-1";
      };
    }
    defineDirectiveDefaults();

    return {
      pre: function(scope, element, attrs, controller){
        controllerReference = controller;
        return;
      },
      post: link
    };
  }

  //use default value in post link function
  if ( attrs.selectedIndex != null ) {
    var selectedIndex = parseInt(attrs.selectedIndex);
    utils.templateContent.find('md-tabs').attr('md-selected', 'vmC.selectedIndex');
    utils.templateContent.find('md-tabs').attr('md-selected2', '{{selectedIndex}}');
    utils.templateContent.find('md-tabs').attr('md-selected3', '{{vmC.selectedIndex}}');
    console.log('setting selected index', selectedIndex, scope.vmC.selectedIndex);

  }

//link to generate patterns
  //http://www.patternify.com/
//button generator
  //http://www.patternify.com/



  function inController() {
    return {
      scope: {
        title: '@',
        fxItemSelected: '&',
        fxSave: '&'
      },
      controller: 'QuickFormController',
      controllerAs: 'vm',
      bindToController:true,
      compile: compile
    };

    //starting a contrller
    this.$scope = $scope;
    var ctrl = this;


  }

  function inTemplate() {
    //how to listen to property
    scope.$watch('selectedIndex', function(a,b) {
      if ( b == undefined ) {
        return;
      }
      var item = controllerReference.items[b];
      console.log('controllerReference', controllerReference.inited, item);
      if ( controllerReference.inited != true ) {
        return;
      }
      controllerReference.$scope.select(item);
    });

    //howto: listen to a sub property
    scope.$watch(function () {
      return scope.vmC.selectedItem;
    }, function (v, oldVal) {
    });
    scope.$watch('vmC.selectedItem', function (v, oldVal) {
      if (scope.vmC.items != null) {
        console.log('selectedItem... changed, new value is: ',
          v, scope.vmC.items.indexOf(v));
      }
    });
  }

  function inSkin() {
    //how ot pass it attribute:
    // @: {{}}

    /*
    Using controller as syntax
    $scope properties transalte to "prop"
    controller properties are vm.property
    see quickcrud-dir-demoarea
*/
  }


  //UI
  //listen to button
  element.bind('click', function (event) {
    if ( event.target.id === 'btnC') {
      controllerReference.$scope.selectIndex(3);
    }
    //console.log(event.target.id, event);
    return;
    scope.model[attrs.selectedIndex] = "New value";
    scope.$apply();
  });
}());
