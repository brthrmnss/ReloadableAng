/**
 * Created by user2 on 7/13/15.
 */

(function () {

  //prevent module from being loaded twice
  try {
    var module = angular.module('com.sync.quick' );
    if ( module != null ) {
      return;
    };
  } catch (error) {
  };

  angular.module('com.sync.quick', [
    'ngMaterial',
  ])
    .config( function( $mdIconProvider ){
      $mdIconProvider.iconSet("avatar", 'icons/avatar-icons.svg', 128);
    });

})();

