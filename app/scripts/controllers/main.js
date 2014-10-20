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
.controller('MainCtrl', function ($scope, $http, $routeParams, $window, $q, $timeout, admin, BASE_URL) {
    
  $scope.history = [];
	$scope.currentPage = 0;
  $scope.pageSize = 10;
	$scope.numberOfPages = function(){
    return $scope.results && $scope.results.content && Math.ceil($scope.results.content.length/$scope.pageSize) || 0;
  };
  
	$scope.editorOptions = {
    lineNumbers: true,
    mode:  'text/x-plsql',
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
		$scope.db = $routeParams.db;
	}
	var search = $window.location.search.split('=');
	if(search.length > 1){
		$routeParams.id = search[1];
	}
	
	if($routeParams.id){
		$scope.questionId = $routeParams.id;
		$http.get(BASE_URL + '/api/questiontext/' + $scope.questionId)
		.success(function(question){
			$scope.db = question.db_schema;
			$scope.question = question;
		})
		.error(function(err){
			//TODO: handle failure
			console.log(err);
		});
	}
    
  $scope.sql = 'SELECT *\nFROM employees';
    
  $scope.format = function(){
    $http.post('http://sqlformat.org/api/v1/format', {
      sql: $scope.sql,
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
      $scope.sql = data.result;
    });
  };
	
	$scope.evaluate = function(){
     var timeout = $q.defer(),
         timedOut = false;
  
		$scope.results = [];
		$scope.error = '';
		$scope.evaluating = true;
    var history = {sql: $scope.sql, result: ''};
    $scope.history.unshift(history);
    $timeout(function(){
      timedOut = true;
      timeout.resolve();
    }, 10000);
    
		$http.post(BASE_URL + '/api/evaluate', {sql:$scope.sql, db:$scope.db}, {cache: false, timeout: timeout.promise})
		.success(function(data){
			console.log(data);
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
      }
    });
	};
  
  $scope.isNum = function(a){
    return !isNaN(a);
  };
  
  //restore from history
    
});
