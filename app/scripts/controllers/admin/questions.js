'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:AdminQuestionsCtrl
 * @description
 * # AdminQuestionsCtrl
 * Controller of the sqlexplorerFrontendApp
 */
angular.module('sqlexplorerFrontendApp')
  .controller('AdminQuestionsCtrl', function ($scope, $http, BASE_URL) {
      $http.get(BASE_URL + '/api/tags')
      .success(function(tags){
        $scope.tags = tags;
      })

      $scope.selectedKeywords = [];
      $scope.keywordInclusive = 0;
      $scope.isKeywordSelected = function(keyword){
        return $scope.selectedKeywords.indexOf(keyword) >= 0;
      }

      $scope.toggleKeyword = function(keyword){
        if($scope.isKeywordSelected(keyword)){
          $scope.selectedKeywords.splice( $scope.selectedKeywords.indexOf(keyword), 1);
        }else{
          $scope.selectedKeywords.push(keyword);
        }
      };

      $scope.$watch('[selectedKeywords, keywordInclusive]', function(){
        $http.post(BASE_URL + '/api/questions', {keywords: $scope.selectedKeywords, inclusive: $scope.keywordInclusive}, {cache: false})
        .success(function(questions){
          $scope.questions = questions;
        });
      }, true);
  });
