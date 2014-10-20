'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:AdminDatabaseCtrl
 * @description
 * # AdminDatabaseCtrl
 * Controller of the sqlexplorerFrontendApp
 */
angular.module('sqlexplorerFrontendApp')
  .controller('AdminDatabaseCtrl', function ($scope, $routeParams) {
    //populate assignments list
		
	if($routeParams.db){
		//list questions for db
	}else{
		//list dbs
	}
	
	$scope.createDbSchema = function(){
		//trigger schmea creation on server
		
	};
	
	$scope.createAssignment = function(){
		//pg
	};
	
	$scope.addQuestionToAssignment = function(){
		
	};
	
  });
