'use strict';

/**
 * @ngdoc overview
 * @name sqlexplorerFrontendApp
 * @description
 * # sqlexplorerFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('sqlexplorerFrontendApp', [
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.codemirror',
    'LocalStorageModule'
  ])
  .constant('BASE_URL', 'https://amc.ig.he-arc.ch/sqlexplorer')
  .config(function ($routeProvider, $sceProvider) {
	$sceProvider.enabled(false);
    $routeProvider
    .when('/admin/db/:db?', {
      templateUrl: 'views/admin/database.html',
      controller: 'AdminDatabaseCtrl'
    })
    .when('/admin', {
      templateUrl: 'views/admin/database.html',
      controller: 'AdminDatabaseCtrl'
    })
    .when('/admin/:db', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        'admin': function(){
          return true;
        }
      }
    })
    .when('/:db', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        'admin': function(){
          return false;
        }
      }
    })
    .otherwise({
      redirectTo: '/HR'
    });
  });
