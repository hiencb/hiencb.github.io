// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('dataView')
    .directive('cbDataObject', cbDataObject);

  cbDataObject.$inject = [];
  function cbDataObject() {
    const template = `
<ul ng-class="dvs.className('object-list')" debug="cb-data-object">
  <li ng-class="dvs.className('object-list-item')" ng-repeat="(key, value) in object track by $index" ng-switch="dvs.typeOf(value)">

    <div ng-class="dvs.className('panel-group')" id="{{parentId}}" role="tablist" ng-switch-when="occupied-array" ng-init="parentId = dvs.nextId('parent'); headingId = dvs.nextId('heading'); collapseId = dvs.nextId('collapse')">
      <div ng-class="dvs.className('panel-item')">
        <div ng-class="dvs.className('panel-heading')" role="tab" id="{{headingId}}">
          <h6 ng-class="dvs.className('panel-title')">
            <b>
              <a ng-class="dvs.className('panel-title-link')" role="button" data-toggle="collapse" data-parent="#{{parentId}}" ng-href="#{{collapseId}}" ng-click='$event.preventDefault()'>{{dvs.normalize(key)}}</a>
            </b>
          </h6>
        </div>
        <div ng-class="dvs.className('panel-collapse')" id="{{collapseId}}" role="tabpanel">
          <cb-data-array array="value"></cb-data-array>
        </div>
      </div>
    </div>

    <b ng-class="dvs.className('object-key-link')" ng-switch-when="link-string">
      <a ng-href="{{dvs.getLink(value)}}">{{dvs.normalize(key)}}</a>
    </b>

    <span ng-switch-default>
      <b ng-class="dvs.className('object-key')">{{dvs.normalize(key)}}: &nbsp;</b>
      <cb-data-node data="value" ng-if="!dvs.isArray(value)"></cb-data-node>
    </span>
  </li>
</ul>`;

    return {
      controller: DataObjectController,
      replace: true,
      scope: { object: '<' },
      template: template
    };
  }

  DataObjectController.$inject = ['$scope', 'dataViewService'];
  function DataObjectController($scope, dataViewService) {
    $scope.dvs = dataViewService;
  }
})();