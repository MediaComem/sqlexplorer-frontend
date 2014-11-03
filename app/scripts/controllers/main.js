'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sqlexplorerFrontendApp
 */

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
angular.module('sqlexplorerFrontendApp')
.filter('startFrom', function() {
    return function(input, start) {
        if(input && input.length){
            start = +start; //parse to int
            return input.slice(start);
        }else{
            return input;
        }
    };
});
 
angular.module('sqlexplorerFrontendApp')
.controller('MainCtrl', function ($scope, $http, $routeParams, $location, $window, $q,
             $timeout, localStorageService, admin, BASE_URL) {
    
    $scope.history = [];
    $scope.historyLimit = true;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages = function(){
        return $scope.results && $scope.results.content && Math.ceil($scope.results.content.length/$scope.pageSize) || 0;
    };
  
    $scope.editorOptions = {
    lineNumbers: true,
    mode:  'text/x-oracle',
    theme: 'neat',
    matchBrackets: true,
    extraKeys: {
      'Ctrl-Enter': function(){
        $scope.evaluate();
            }
        }
    };
  
    $scope.admin = admin;
    if($routeParams.db){
        $scope.db = $routeParams.db.toUpperCase();
        $scope.history = localStorageService.get($scope.db) || [];
    }
    var search = $window.location.search.split('=');
    if(search.length > 1){
        $routeParams.id = search[1];
    }
    
    if($routeParams.id){
        $scope.questionId = $routeParams.id;
        //IF admin get answer
        var url = '/api/questiontext/';
        if($scope.admin){
            url = '/api/question/';
        }
        $http.get(BASE_URL + url + $scope.questionId)
        .success(function(question){
            $scope.db = question.db_schema;
            $scope.question = question;
        })
        .error(function(err){
            //TODO: handle failure
            console.log(err);
        });
    }
    
  $scope.question = {
    sql: ''
  };
    
  $scope.format = function(){
    $http.post('https://amc.ig.he-arc.ch/sqlformat/api/v1/format', {
      sql: $scope.question.sql,
      reindent: 1,
      keyword_case: 'upper'
    },{
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
          return str.join('&');
      }
    })
    .success(function(data){
        $scope.question.sql = data.result;
    });
  };
    
    $scope.evaluate = function(){
        var timeout = $q.defer(),
            timedOut = false;
  
        $scope.results = [];
        $scope.error = '';
        $scope.evaluating = true;
        var history = {sql: $scope.question.sql, result: ''};
        $scope.history.unshift(history);

        //could be moved to watch
        localStorageService.set($scope.db, $scope.history);
        
        $timeout(function(){
          timedOut = true;
          timeout.resolve();
        }, 10000);
        
        var data = {sql:$scope.question.sql, db:$scope.db};
        if($scope.questionId){
            data.id = $scope.questionId;
        }
        
        $http.post(BASE_URL + '/api/evaluate', data, {cache: false, timeout: timeout.promise})
        .success(function(data){
            $scope.results = data;
            if(data.error){
                $scope.error = data.error;
                history = data.error;
            }
            $scope.evaluating = false;
        })
        .error(function(data){
          if (timedOut) {
            $scope.evaluating = false;
            $scope.error = 'unable to contact server';
          }else{
            $scope.evaluating = false;
            $scope.error = data;
          }
        });
    };
  
  $scope.upsert = function(){
    var question = {sql:$scope.question.sql, text:$scope.question.text, db_schema: $scope.db};
    if($scope.question.id){
      question.id = $scope.question.id;
    }
    $http.post(BASE_URL + '/api/question', question, {cache: false})
        .success(function(data){
            $scope.evaluating = false;
      $location.search('id', data.id);
        })
    .error(function(data){
      $scope.evaluating = false;
    });
  
  };
  
  $scope.navToNewQuestion = function(){
    $location.search('id', undefined);
  };
  
  $scope.isNum = function(a){
    return !isNaN(a);
  };
  
  $scope.isNull = function(a){
    return a === '(NULL)';
  };
  
  $scope.clearHistory = function(){
    localStorageService.remove($scope.db);
    $scope.history = [];
  };
    
});
