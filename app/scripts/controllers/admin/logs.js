'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:AdminLogsCtrl
 * @description
 * # AdminLogsCtrl
 * Controller of the sqlexplorerFrontendApp
 */
angular.module('sqlexplorerFrontendApp')
  .controller('AdminLogsCtrl', function ($scope, $http, BASE_URL) {
      $http.get(BASE_URL + '/api/logs')
      .success(function(logs){
          $scope.logs = logs;
      })
      .error(function(err){
          //TODO: handle failure
          console.log(err);
      });


      $scope.getLogDetail = function(user_id){
        $http.get(BASE_URL + '/api/logs/' + user_id)
        .success(function(log){
            $scope.log = log;
        })
        .error(function(err){
            //TODO: handle failure
            console.log(err);
        });
      }

  });
