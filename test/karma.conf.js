// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-05-16 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/es5-shim/es5-shim.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/Chart.js/Chart.js',
      'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
      'bower_components/videogular/videogular.js',
      'bower_components/videogular-controls/vg-controls.js',
      'bower_components/videogular-buffering/vg-buffering.js',
      'bower_components/videogular-overlay-play/vg-overlay-play.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/metisMenu/dist/metisMenu.js',
      'bower_components/jquery-flot/jquery.flot.js',
      'bower_components/angular-flot/angular-flot.js',
      'bower_components/flot/jquery.flot.js',
      'bower_components/flot.curvedlines/curvedLines.js',
      'bower_components/iCheck/icheck.min.js',
      'bower_components/jquery.flot.spline/index.js',
      'bower_components/sparkline/index.js',
      'bower_components/chartjs/Chart.min.js',
      'bower_components/angles/angles.js',
      'bower_components/peity/jquery.peity.js',
      'bower_components/angular-peity/angular-peity.js',
      'bower_components/sweetalert/lib/sweet-alert.js',
      'bower_components/angular-notify/dist/angular-notify.js',
      'bower_components/angular-ui-utils/ui-utils.js',
      'bower_components/angular-ui-map/ui-map.js',
      'bower_components/moment/moment.js',
      'bower_components/fullcalendar/dist/fullcalendar.js',
      'bower_components/angular-ui-calendar/src/calendar.js',
      'bower_components/summernote/dist/summernote.js',
      'bower_components/angular-summernote/dist/angular-summernote.js',
      'bower_components/ng-grid/build/ng-grid.js',
      'bower_components/slimScroll/jquery.slimscroll.min.js',
      'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'bower_components/bootstrap-tour/build/js/bootstrap-tour.js',
      'bower_components/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
      'bower_components/angular-bootstrap-tour/dist/angular-bootstrap-tour.js',
      'bower_components/datatables/media/js/jquery.dataTables.js',
      'bower_components/angular-datatables/dist/angular-datatables.js',
      'bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.js',
      'bower_components/angular-datatables/dist/plugins/colreorder/angular-datatables.colreorder.js',
      'bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.js',
      'bower_components/angular-datatables/dist/plugins/colvis/angular-datatables.colvis.js',
      'bower_components/angular-datatables/dist/plugins/fixedcolumns/angular-datatables.fixedcolumns.js',
      'bower_components/angular-datatables/dist/plugins/fixedheader/angular-datatables.fixedheader.js',
      'bower_components/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.js',
      'bower_components/angular-datatables/dist/plugins/tabletools/angular-datatables.tabletools.js',
      'bower_components/angular-xeditable/dist/js/xeditable.js',
      'bower_components/ui-select/dist/select.js',
      'bower_components/blueimp-gallery/js/blueimp-helper.js',
      'bower_components/blueimp-gallery/js/blueimp-gallery.js',
      'bower_components/blueimp-gallery/js/blueimp-gallery-fullscreen.js',
      'bower_components/blueimp-gallery/js/blueimp-gallery-indicator.js',
      'bower_components/blueimp-gallery/js/blueimp-gallery-video.js',
      'bower_components/blueimp-gallery/js/blueimp-gallery-vimeo.js',
      'bower_components/blueimp-gallery/js/blueimp-gallery-youtube.js',
      'bower_components/angular-ui-sortable/sortable.js',
      'bower_components/angular.pubsub/src/angular-pubsub.js',
      'bower_components/bacon/dist/Bacon.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
