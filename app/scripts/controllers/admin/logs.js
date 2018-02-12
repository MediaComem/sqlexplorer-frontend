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
      $http({
        url: BASE_URL + '/api/logs',
        method: 'GET',
        withCredentials: true
      })
      .then(function(result){
          $scope.logs = result.data;
      })
      .catch(function(err){
          //TODO: handle failure
          console.log(err);
      });


      $scope.getLogDetail = function(user_id){
        $http({
          url: BASE_URL + '/api/logs/' + user_id,
          method: 'GET',
          withCredentials: true
        })
        .then(function(result){
            $scope.log = result.data;
        })
        .catch(function(err){
            //TODO: handle failure
            console.log(err);
        });
      }

  });
