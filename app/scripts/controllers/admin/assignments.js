'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:AdminAssignmentsCtrl
 * @description
 * # AdminAssignmentsCtrl
 * Controller of the sqlexplorerFrontendApp
 */
angular.module('sqlexplorerFrontendApp')
  .controller('AdminAssignmentsCtrl', function ($scope, $http, BASE_URL, $routeParams) {
    $http.get(BASE_URL + '/api/assignment/list', {withCredentials: true})
    .then(function(assignments){
        $scope.assignments = assignments.data;
    });
    if($routeParams.id){
       $scope.assignmentId = $routeParams.id;
    }
    
    $scope.$watch('assignmentId', function(){
        $http.get(BASE_URL + '/api/assignment/' + $scope.assignmentId, {withCredentials: true})
        .then(function(questions){
            $scope.questions = questions.data;
        });
    });
    
  });
