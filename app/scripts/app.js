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
        templateUrl: 'http://amc.ig.he-arc.ch:3001/main.html',
        controller: 'MainCtrl'
      })
      .when('/:db', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })	  
      .otherwise({
        redirectTo: '/'
      });
  });
