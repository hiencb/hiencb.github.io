// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.debugView').directive('cbDebugView', debugViewDirective);

  debugViewDirective.$inject = [];
  function debugViewDirective() {
    return {
      controller: DebugViewController,
      controllerAs: '_debugVm',
      template: `<div ng-if="_debugVm.shown"><ng-transclude/></div>`,
      transclude: true
    };
  }

  DebugViewController.$inject = ['$scope', '$injector'];
  function DebugViewController($scope, $injector) {
    this.shown = $injector.has('environment') && $injector.get('environment') === 'development';
  }
})();