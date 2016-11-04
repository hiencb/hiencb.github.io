// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView')
    .directive('cbDataValue', cbDataValue);

  cbDataValue.$inject = [];
  function cbDataValue() {
    const template = `
<span ng-class="dvs.className('value-item')" debug="cb-data-value">{{dvs.normalize(value)}}</span>`;
    return {
      controller: DataValueController,
      replace: true,
      scope: { value: '<' },
      template: template
    };
  }

  DataValueController.$inject = ['$scope', 'dataViewService'];
  function DataValueController($scope, dataViewService) {
    $scope.dvs = dataViewService;
  }
})();