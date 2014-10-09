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
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
