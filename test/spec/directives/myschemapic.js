'use strict';

describe('Directive: mySchemaPic', function () {

  // load the directive's module
  beforeEach(module('sqlexplorerFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-schema-pic></my-schema-pic>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mySchemaPic directive');
  }));
});
