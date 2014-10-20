'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:AdminDatabaseCtrl
 * @description
 * # AdminDatabaseCtrl
 * Controller of the sqlexplorerFrontendApp
 */
angular.module('sqlexplorerFrontendApp')
  .controller('AdminDatabaseCtrl', function ($scope, $routeParams, $http, BASE_URL) {
    //populate assignments list
		
  	$scope.editorOptions = {
      lineNumbers: true,
      mode:  'text/x-plsql',
      theme: 'neat',
      matchBrackets: true
    };  
  
    if($routeParams.db){
      //list questions for db
    }else{
      //list dbs
      $http.get(BASE_URL + '/api/db/list')
      .success(function(dbs){
        $scope.dbs = dbs;
      })
    }
    
    $scope.createDbSchema = function(){
      //trigger schmea creation on server
      
    };
    
    $scope.createAssignment = function(){
      //pg
    };
    
    //create scorm from assignment
    
    $scope.addQuestionToAssignment = function(){
      
    };
	
  });
