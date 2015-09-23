'use strict';


( function() {

  var movieSearchService = function movieSearchService($http, $q,
                                                       $rootScope) {
    var factory = {};
    factory.getCustomers = function() {
      var y = $http.get('/customers');
      var deferred = $q.defer();

      deferred.resolve(customers)
      deferred.promise.success = function (_fx) {
        _fx(customers)
        return deferred.promise
      }
      deferred.promise.error = function (_fx) {
        _fx(customers)
      }
      //asdf.g
      return deferred.promise;
      // return $http.get('/customers');
      //return customers;
    };

    factory.busy = false;
    factory.search = false;

    var cUtils = {}
    cUtils.baseUrl = 'http://127.0.0.1:10001/';
    cUtils.proxyImage = function proxyImage(url, proxyRoute) {
        if ( proxyRoute == null ) {
          proxyRoute = 'proxy'
          proxyRoute = 'proxy2'
        }
        url = cUtils.baseUrl+proxyRoute+'?url='+encodeURIComponent(url);
        //url = cUtils.baseUrl+proxyRoute+'?url='+encodeURIComponent(url)
        return url;
    }

    cUtils.helpers = {};
    cUtils.helpers.convertIMDBImage = function (options,width) {
      if ( options.indexOf('SX') != -1 ) {
        options = options.split('SX')[0] + width +'.jpg'
      }
      return options;
    }

    factory.searchTitle = function searchTitle(query, page) {

      var url = 'http://127.0.0.1:10001/proxy2?url='+
        'http://www.imdb.com/search/title?title='+query
        +'&title_type=feature,tv_movie,tv_series';

      if ( page != null && page > 0) {

      }

      return $http.get(url);
    }

    factory.search = function search(query, page ) {
      if ( page == null ) {
        page = 0;
      }
      factory.page = page;
      if ( factory.query != query || page == 0 ) {
        factory.clearResults();
      }
      factory.query = query;
      console.log('search', query);
      factory.busy = true;
      factory.searchTitle(query, page).success(
        function (response) {
          factory.busy = false;
          console.log('search success'); //, response);
          var items = factory.parseContent(response);

          factory.changed(items)
        }
      ).error(
        function () {
          factory.busy = false;
          console.log('search fault');
        }
      );
    }
    factory.nextPage = function nextPage(  ) {
      factory.page++;
      factory.search(factory.query, factory.page )
    };

    factory.convertIMDB = function convertIMDB(page ) {
      console.log('search', query);

    }

    factory.notifyOfResult = function (fx) {
      $rootScope.$on('movieSearchresult', fx )
    }

    factory.changed = function seachresultsChanged(newItems) {
      $rootScope.$emit('movieSearchresult', newItems )
    }

    factory.onClearResults = function (fx) {
      $rootScope.$on('movieSearchResult.clearResults', fx );
    }

    factory.clearResults = function clearResults() {
      $rootScope.$emit('movieSearchResult.clearResults' );
    }

    factory.unregister = function () {

    }


    //Utils
    factory.parseContent = function  parseContent(result ) {
      var images = []
      var movies_meta = []
      var movies = []
      var resultHTML = $(result)

      // get all img tags and loop over them
      //you can show the 'more' button if it is a full list
      var fullList = resultHTML.find('.detailed').length == 100;

      factory.more = resultHTML.find('.pagination').length > 0 ;


      resultHTML.find('.detailed').map(function(i, val) {
        var _movie = new Object();
        _movie.rawIMDB 	= $(val).html();
        _movie.rating 	= $('.image a',val).attr('href');


        _movie.image	= $('.image img',val).attr('src');
        _movie.image = cUtils.proxyImage(
          cUtils.helpers.convertIMDBImage(
          _movie.image, 300));
        _movie.title 	= $('.title > a',val).text();//.replace(/[^\w]/gi,'');
        _movie.imdb_url	= $('.title > a',val).attr('href');
        _movie.imdb_id	= $('.title > a',val).attr('href').split('/title/')[1].replace(/[^\w]/gi,'');
        _movie.year 	= $('.year_type',val).text();
        _movie.desc 	= $('.outline',val).text();
        _movie.rating 	= $('.rating-rating .value',val).text();

        if ( _movie.rating == '-') {
          //if ( cUtils.switches.skipUnrated == true ) {
            return;
          //}
        }

        _movie.runtime	= $('.runtime',val).text();
        _movie.episode	= $('.episode',val).text();
        _movie.rated	= $('.certificate span').attr('title');
        _movie.genres 	= [];

        _movie.series = false;
        var tvSeriesInTitle = 'TV Series'
        //(2014) or (1996 TV Series)
        if ( _movie.year.indexOf('TV Series') != -1 ) {
          _movie.year = _movie.year.replace(' '+tvSeriesInTitle, '' )
          _movie.series = true;
        }
        //cUtils.imdb.cleanUpYear()


        var episodePreamble = 'Episode: '
        var episode = _movie.episode;
        if ( _movie.series || episode.indexOf(episodePreamble) != -1 ) {
          episode = episode.replace(episodePreamble, '' )
          episode = episode.slice(0,-6);
          _movie.episode = episode;
          _movie.episode_url	=  'http://www.imdb.com' + _movie.imdb_url	+'episodes?season=1';
        }



        _movie.year = _movie.year.replace('(', '' )
        _movie.year = _movie.year.replace(')', '' )
        _movie.progress = 0; // 	= [];
        _movie.name = _movie.title;
        $('.genre a',val).map(function(i,genre){
          _movie.genres.push( $(genre).text() )
        })
        movies_meta.push( _movie );
        movies.push(_movie.title);
        images.push( { src:_movie.image, imdb_id:_movie.imdb_id }  )
        //console.log(i)
      });

      console.log('parsed', movies.length)

      return movies_meta;

    }

    return factory;

  }

  movieSearchService.$inject = ['$http', '$q', '$rootScope'];
  angular.module('74App').factory('movieSearchService', movieSearchService );
}());
