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
    'ui.codemirror'
  ])
  .config(function ($routeProvider, $sceProvider) {
	$sceProvider.enabled(false);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
	  .when('/admin/db/:db?', {
        templateUrl: 'views/admin/database.html',
        controller: 'AdminDatabaseCtrl'
      })
	  .when('/admin', {
        templateUrl: 'views/admin/database.html',
        controller: 'AdminDatabaseCtrl'
      })
      .when('/:db', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
