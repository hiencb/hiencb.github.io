// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('dataView')
    .directive('cbDataArray', cbDataArray);

  cbDataArray.$inject = [];
  function cbDataArray() {
    const template = `
<div ng-class="dvs.className('array-list')" debug="cb-data-array">
  <a ng-repeat-start="item in array track by $index" ng-if="dvs.typeOf(item) === 'link-string'" ng-class="dvs.className('array-list-item-link')" ng-href="{{dvs.getLink(item)}}">
    <cb-data-node data="dvs.getLinkObject(item)"></cb-data-node>
  </a>
  <a ng-if="dvs.typeOf(item) === 'link-object'" ng-class="dvs.className('array-list-item-link')" ng-href="{{dvs.getLink(item)}}">
    <cb-data-node data="dvs.getLinkObject(item)"></cb-data-node>
  </a>
  <li ng-repeat-end ng-class="dvs.className('array-list-item')" ng-if="!dvs.isLink(item)">
    <cb-data-node data="item"></cb-data-node>
  </li>
</div>`;

    return {
      controller: DataArrayController,
      replace: true,
      scope: { array: '<' },
      template: template
    };
  }

  DataArrayController.$inject = ['$scope', 'dataViewService'];
  function DataArrayController($scope, dataViewService) {
    $scope.dvs = dataViewService;
  }
})();