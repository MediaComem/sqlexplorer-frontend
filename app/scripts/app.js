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
  .config(function($httpProvider, $routeProvider, $sceProvider, $locationProvider) {
    $httpProvider.defaults.withCredentials = true;
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
          admin: function() { return true; },
          assignment: function() { return undefined; }
        }
      })
      .when('/:db', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          admin: function() { return false; },
          assignment: function() { return undefined; },
          user: function() { return undefined; }
        }
      })
      .when('/assignment/:assignmentId', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          admin: function() { return false; },
          assignment: function($http, $route, BASE_URL) {
            return $http.get(BASE_URL + '/lti/assignment/' + $route.current.params.assignmentId);
          },
          user: function($http, BASE_URL) {
            return $http.get(BASE_URL + '/lti/me');
          }
        }
      })
      .otherwise({
        redirectTo: '/hr'
      });

    $locationProvider.hashPrefix('');
  });
