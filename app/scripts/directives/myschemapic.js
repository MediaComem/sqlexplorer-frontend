'use strict';

/**
 * @ngdoc directive
 * @name sqlexplorerFrontendApp.directive:mySchemaPic
 * @description
 * # mySchemaPic
 */
angular.module('sqlexplorerFrontendApp')
  .directive('mySchemaPic', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element
        .one('load', function(){
			element.resizable({
 				handles: "all",
	 			aspectRatio: true, 
	 			autoHide: true,
				minHeight: 50,
				minWidth: 100
 			}).parent().draggable({
	 			cursor: "move",
	 			zIndex: 100
	 		});
		});
      }
    };
  });
