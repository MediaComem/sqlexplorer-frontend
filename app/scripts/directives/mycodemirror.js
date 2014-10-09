'use strict';

/**
 * @ngdoc directive
 * @name sqlexplorerFrontendApp.directive:myCodemirror
 * @description
 * # myCodemirror
 */
angular.module('sqlexplorerFrontendApp')
  .directive('myCodemirror', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var myCodeMirror = CodeMirror(element[0], {
          value: 'SELECT *\nFROM employees',
          mode:  'text/x-plsql',
          theme: 'neat',
          matchBrackets: true
        });
      }
    };
  });
