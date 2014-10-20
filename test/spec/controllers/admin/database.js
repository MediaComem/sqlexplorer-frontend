'use strict';

describe('Controller: AdminDatabaseCtrl', function () {

  // load the controller's module
  beforeEach(module('sqlexplorerFrontendApp'));

  var AdminDatabaseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminDatabaseCtrl = $controller('AdminDatabaseCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
