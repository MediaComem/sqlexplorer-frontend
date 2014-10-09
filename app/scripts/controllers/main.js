'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sqlexplorerFrontendApp
 */
angular.module('sqlexplorerFrontendApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.editorOptions = {
        lineNumbers: true,
        mode:  'text/x-plsql',
        theme: 'neat',
        matchBrackets: true
    };
    
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
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
      })
      .success(function(data){
        $scope.sql = data.result;
      });
    };
    
  });
