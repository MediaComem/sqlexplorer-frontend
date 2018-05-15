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
  .config(function ($routeProvider, $sceProvider, $locationProvider) {
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
    .when('/admin/logs', {
      templateUrl: 'views/admin/logs.html',
      controller: 'AdminLogsCtrl'
    })
    .when('/admin/questions/:db?', {
      templateUrl: 'views/admin/questions.html',
      controller: 'AdminQuestionsCtrl'
    })
    .when('/admin/assignments/:id?', {
      templateUrl: 'views/admin/assignments.html',
      controller: 'AdminAssignmentsCtrl'
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

    $locationProvider.hashPrefix('');
  });
