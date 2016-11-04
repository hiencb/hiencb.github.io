// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView')
    .directive('cbDataLinkObject', cbDataLinkObject);

  cbDataLinkObject.$inject = [];
  function cbDataLinkObject() {
    const template = `
<a ng-class="dvs.className('link-object')" ng-href="{{dvs.getLink(object)}}" debug="cb-data-link-object">
  <cb-data-node data="dvs.getLinkObject(object)"></cb-data-node>
</a>`;

    return {
      controller: DataLinkObjectController,
      replace: true,
      scope: { object: '<' },
      template: template
    };

  }

  DataLinkObjectController.$inject = ['$scope', 'dataViewService'];
  function DataLinkObjectController($scope, dataViewService) {
    $scope.dvs = dataViewService;
  }
})();