// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView')
    .directive('cbDataNode', cbDataNode);

  cbDataNode.$inject = [];
  function cbDataNode() {
    const template = `
<cb-data-array array="data" ng-if="dvs.typeOf(data) === 'occupied-array'"></cb-data-array>
<cb-data-link-object object="data" ng-if="dvs.typeOf(data) === 'link-object'"></cb-data-link-object>
<cb-data-object object="data" ng-if="dvs.typeOf(data) === 'object'"></cb-data-object>
<cb-data-link-string string="data" ng-if="dvs.typeOf(data) === 'link-string'"></cb-data-link-string>
<cb-data-value value="data" ng-if="dvs.isPrimitive(data)"></cb-data-value>`;

    return {
      controller: DataNodeController,
      replace: false,
      scope: { data: '<' },
      template: template
    };

  }

  DataNodeController.$inject = ['$scope', 'dataViewService'];
  function DataNodeController($scope, dataViewService) {
    $scope.dvs = dataViewService;
  }
})();