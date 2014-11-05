'use strict';

describe('Controller: AdminLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('sqlexplorerFrontendApp'));

  var AdminLogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminLogsCtrl = $controller('AdminLogsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
