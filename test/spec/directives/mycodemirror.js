'use strict';

describe('Directive: myCodemirror', function () {

  // load the directive's module
  beforeEach(module('sqlexplorerFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-codemirror></my-codemirror>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myCodemirror directive');
  }));
});
