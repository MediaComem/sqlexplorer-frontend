'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:AdminDatabaseCtrl
 * @description
 * # AdminDatabaseCtrl
 * Controller of the sqlexplorerFrontendApp
 */
angular.module('sqlexplorerFrontendApp')
  .controller('AdminDatabaseCtrl', function($scope, $routeParams, $http, BASE_URL) {
    //populate assignments list

    $scope.editorOptions = {
      lineNumbers: true,
      mode: 'text/x-plsql',
      theme: 'neat',
      matchBrackets: true
    };

    $scope.baseUrl = BASE_URL;

    if ($routeParams.db) {
      //list questions for db
    } else {
      //list dbs
      $http.get(BASE_URL + '/api/db/list')
        .then(function(result) {
          $scope.dbs = result.data;
        });
    }

    $scope.createDbSchema = function() {
      //trigger schmea creation on server

    };

    $scope.createAssignment = function() {
      //pg
    };

    //create scorm from assignment

    $scope.addQuestionToAssignment = function() {

    };

  });
