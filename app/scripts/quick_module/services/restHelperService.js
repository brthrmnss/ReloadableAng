'--use strict';
/**
 * RestHelper provides service for basic helper method calls
 */
( function() {

  var RestHelper = function RestHelper($http, $q, sh) {
    function Tbl() {
      var self = this;
      var p = this;
      p.loadItems = function loadItems(items) {
        self.items = items;
        self.dict = {};
        self.ids = items.length;
        items.forEach(function addIdsToItems(x,i){
          x.id = i;
        })
      };
      /*
       function defineStub() {
       var stub = {};
       stub.success = function success(fx) {
       stub.fx = fx;
       return stub;
       };
       stub.success2 = function success() {
       return stub;
       };
       }

       function instanceStub() {
       var deferred = $q.defer();
       deferred.promise.success = function (_fx) {
       _fx(customers); //not sure if valid ...
       return deferred.promise
       }
       deferred.promise.error = function (_fx) {
       _fx(customers)
       }

       setTimeout(function () {
       deferred.resolve(customers)
       }, 20);

       //asdf.g
       return deferred.promise;
       }

       function defineDelayed() {
       var deferred = $q.defer();
       deferred.promise.success = function (_fx) {
       deferred.fxSuccess = _fx; //_fx(customers)
       return deferred.promise
       };

       deferred.promise.error = function (_fx) {
       deferred.fxError = _fx;
       //_fx(customers)
       return deferred.promise
       };

       setTimeout(function () {
       deferred.resolve(self.src.list);
       deferred.fxSuccess(self.src.list)
       }, 20);

       return deferred.promise;
       }
       return defineDelayed();

       */
      p.get = function (url_, data_) {
        function urlIncludes(urlSnippet) {
          return url_.indexOf(urlSnippet) != -1;
        };
        if (url_, data_) {
          if ( urlIncludes( '/create') ){
            return self.save(data_.params);
          }
        }
        if (url_, data_) {
          if ( urlIncludes( '/read') ){
            return self.save(data_.params);
          }
        }
        if (url_, data_) {
          if ( urlIncludes( '/update') ){
            return self.save(data_.params);
          }
        }
        if (url_, data_) {
          if ( urlIncludes( '/delete') ){
            return self.deleteId(data_.params);
          }
        }
        return self.mockRequest(self.items); ;
      }

      p.save = function(newItem) {
        //prevent binding
        newItem = sh.clone(newItem);
        if ( newItem.id == 0 || newItem.id == null ) {
          self.ids++
          newItem.id =  self.ids;
          self.items.push(newItem)
        } else {
          //var copy = self.dict[newItem.id]
          self.reDict();
          var inArray = self.dict[newItem.id];
          if ( inArray != null ) {
            var index = self.items.indexOf(newItem);
            self.items.splice(index,1,newItem);
          } else {
            self.items.push(newItem)
          };
          self.dict[newItem.id] = newItem;
          /*
           if ( inArray == null ) {
           copy = newItem.id;
           }
           */
        }
        return self.mockRequest(newItem);
      }


      p.deleteId = function deleteId(objToDelete) {
        var id = objToDelete.id;
        if ( id == null ){
          throw new Error('need id ')
        }
        var obj = self.dict[id];
        self.reDict();
        var index = self.items.indexOf(objToDelete)
        self.items.splice(index,1);
        return self.mockRequest('deleted');
      }

      /**
       * Generates promise for request
       * @param results
       * @param fx
       * @returns {*}
       */
      p.mockRequest = function mockRequest(results,
                                           fxModifyResults,
                                           fxModify2 ) {
        var deferred = $q.defer();
        deferred.promise.success = function (_fx) {
          deferred.fxSuccess = _fx; //_fx(customers)
          return deferred.promise
        };

        deferred.promise.error = function (_fx) {
          deferred.fxError = _fx;
          //_fx(customers)
          return deferred.promise
        };

        setTimeout(function () {
          if ( fxModifyResults != null ) {
            var modifiedResults = fxModifyResults(results)
            results = modifiedResults;
          }
          if ( fxModify2 != null ) {
            var modifiedResults = fxModify2(results)
            if ( modifiedResults != null ) {
              results = modifiedResults;
            }
          }

          deferred.resolve(results);
          deferred.fxSuccess(results)
        }, 20);

        return deferred.promise;
      };

      p.reDict = function() {
        for ( var i =0; i < self.items.length; i++) {
          var item = self.items[i];
          self.dict[item.id] = item;
        };
      }

    }

    function RestHelper () {
      var self = this;
      var restHelper = self;
      var p = self;
      self.$http = $http;

      self.initRestHelper = function initRestHelper(config) {
        if ( config != null ) {
          self.config = config;
        }
        if ( self.config != null ) {
          self.url = self.config.url;
        }

        self.config = sh.dv(self.config, {})

        self.config.debug //()
        self.config.refreshObjOnSave //if true, will
        //do a get after a create and update
        //user will always have current version

        self.config.smartSave //if object has id,
        //will do update, if not, do a create

        self.fxListResults; //convience method.
        //  is invoked when new records are added
      }
      self.init = self.initRestHelper;

      //restHelper.get();
      restHelper.get = function get(id) {
        var url =  '';
        url = self.url+'/'+id //+ '/get'
        //unflatten
        return self.$http.get(url);
      };

      restHelper.list = function list(page) {
        var url =  '';
        url = self.url //+ '/get'
        if ( page != null ) {

        };

        //unflatten
        return self.$http.get(url);
      };

      function definePagination() {
        /**
         * List with pagination support
         * @param page
         * @returns {*}
         */
        restHelper.list2 = function list2(offset, limit,
                                          query) {
          var autoQuery = false;
          if ( offset != self.paginator ) {
            offset = sh.dv(offset,0);
            limit = sh.dv(limit,10);
            query = sh.dv(query,{});
            self.paginationSettings = {
              offset: offset,
              limit: limit,
              query: query
            };
          } else {
            autoQuery = true;
          }
          var url = '';
          url = self.url +  '/search'

          console.log('get', self.paginationSettings )

          self.count(query).success(function (count) {
            //not proper linking?

            self.paginator = {}
            self.paginator.count = count;
            self.paginator.pages = Math.ceil(
              count / self.paginationSettings.limit
            );
            self.paginator.page_index = 0;
            self.paginator.morePages = count
              >= self.paginationSettings.offset +
              self.paginationSettings.limit;

            //self.pagination.offset = 0;

            if ( autoQuery  ) {
              self.paginator.page_index =
                Math.ceil(
                  self.paginationSettings.offset /
                self.paginationSettings.limit
            )
            };

            self.$http.get(url,
              {params:self.paginationSettings}
            )
              .success(function (item) {
                self.utils.unflattenList(item)
                q.resolve(item);
                sh.callIfDefined(q.promise.fxSuccess, item);
                sh.callIfDefined(self.fxListResults, item);
              }
            ).error(function (err) {
                q.reject(err)
                q.promise.fxError(err);
                //sh.callIfDefined(q.promise.fxError, err);
              })
          }).error(function (err) {
            q.reject(err)
            sh.callIfDefined(q.promise.fxError, err);
          })


          //return self.$http.get(url)


          var q = self.utils.createPromise()
          return q.promise;

        };

        self.pageGet = function getPage() {

        }
        self.pageNext = function getPage() {
          self.paginationSettings.offset +=
            self.paginationSettings.limit;
          return self.list2(self.paginator);
        }
        self.pageGoTo = function pageGoTo(page) {
          self.paginationSettings.offset =
            self.paginationSettings.limit * (page-1);
          return self.list2(self.paginator);
        }


        self.count = function pagecount(query) {
          var url = self.url;
          url += '/count'
          return self.$http.get(url);
        }
      }
      definePagination();

      restHelper.create = function create(obj) {
        var url =  '';
        url = self.url  + '/create';
        obj.timestamp = '?'+new Date().getTime();
        var promise = self.$http.get(url, {params:obj});
        return promise;
      }

      /**
       * In Raw for, will make create request
       * Default will return object and update id
       * @param obj
       * @param raw
       * @returns {*}
       */
      restHelper.save = function save(obj, raw) {

        var url =  '';
        url = self.url  + '/create';
        obj.timestamp = '?'+new Date().getTime();
        if ( raw != true /* && self.condependent */) {
          if ( obj.id != null && obj.id != 0 ) {
            //do update
            restHelper.update(obj);
          }

        }
        self.utils.flatten(obj)
        var promise = self.$http.get(url, {params:obj});
        if ( raw == true ) {
          return promise;
        }
        //return promise;

        var d = $q.defer();
        promise
          .success(function onSaved(data,_p, headers) {
            if ( self.debug ) {
              console.log('saved');
            }
            /*var location = header.location;
             if ( location != null ) {
             var id = location.split('/').slice(-1)
             }
             if ( location.indexOf('created')==-1) {
             console.error('nothing created');
             }*/
            var id = data;
            obj.id = id;
            if (d.promise.fxSuccess != null ) {
              d.promise.fxSuccess(obj);
            }
            d.resolve(obj)
          }).error(function oError(data) {
            console.log('error', data)
            if (d.promise.fxError == null) {
              d.promise.fxError(data);
            }
            d.reject(obj)
          });

        self.utils.decoratePromiseForAng(d)

        return d.promise;
      };


      restHelper.update = function update(obj, raw) {
        var url =  '';
        url = self.url  + '/update';
        obj.timestamp = '?'+new Date().getTime();
        self.utils.flatten(obj);
        var promise = self.$http.get(url, {params:obj});
        if ( raw == true ) {
          return promise;
        }

        if ( obj.id == null ) {
          console.error('cannot update object without id')
        }

        var d = $q.defer();
        promise
          .success(function onSaved(data,_p, headers) {
            if ( self.debug ) {
              console.log('updated');
            }
            //obj.id = id;
            if (d.promise.fxSuccess != null ) {
              d.promise.fxSuccess(obj);
            }
            d.resolve(obj)
          }).error(function oError(data) {
            self.error('error', data)
            if (d.promise.fxError == null) {
              d.promise.fxError(data);
            }
            d.reject(data)
          });

        self.utils.decoratePromiseForAng(d)

        return d.promise;
      };

      restHelper.delete = function deleteId(id) {
        var url =  '';
        url = self.url  + '/delete';
        var obj = {};
        obj.id = id;
        obj.timestamp = '?'+new Date().getTime();
        return self.$http.get(url, {params:obj});
      };

      function defineUtils() {
        self.utils = {}
        self.utils.decoratePromiseForAng = function decoratePromiseForAng(d) {
          //Yes, indeed. $http return objects are promises that also have these .success and .error methods for legacy reasons.
          d.promise.success = function onSuccess(fxSuccess) {
            d.promise.fxSuccess = fxSuccess;
            return d.promise;
          };
          d.promise.error = function onError(fxError) {
            d.promise.fxError = fxError;
            return d.promise;
          }
        };

        self.utils.createPromise = function createPromise(d) {
          var deferred = $q.defer();
          self.utils.decoratePromiseForAng(deferred)
          return deferred;
        };

        self.error = function () {
          console.error(arguments);
        }


        self.utils.flatten = function flatten(obj) {
          if ( self.config.flatten = true ) {
            var clone = sh.clone(obj)
            delete clone['data_json'] //clone.data_json = null;
            obj.data_json = JSON.stringify(clone);
          }
        };

        self.utils.flattenList = function flattenList(list) {
          if ( self.config.flatten = true ) {
            sh.each(list, function procItem(i,item) {
              self.utils.flatten(item)
            })
          }
        }

        self.utils.unflatten = function flatten(obj) {
          if ( self.config.flatten = true ) {
            var live = JSON.parse(obj.data_json);
            for ( var k in live ) {
              if ( k == 'id ') continue;
              obj[k] = live[k];
            }
          }
        };

        self.utils.unflattenList = function unflattenList(list) {
          if ( self.config.flatten = true ) {
            sh.each(list, function procItem(i,item) {
              self.utils.unflatten(item)
            })
          }
        }
      }
      defineUtils();




    }

    var service  = new RestHelper();

    service.create = function create(config) {
      var rH = new RestHelper(config); //?
      rH.initRestHelper(config)
      return rH;
    };


    service.create2 = function () {
      return new RestHelper(); //?
    }
    service.tbl = Tbl;
    service.createInMemory = function createInMemory() {
      var t = new Tbl();
      return t;
    }
    return service;

  }

  RestHelper.$inject = ['$http', '$q', 'sh'];
  var module =  angular.module('com.sync.quick');
  module.factory('restHelper', RestHelper );
  module.factory('$restHelper', RestHelper );
}());
