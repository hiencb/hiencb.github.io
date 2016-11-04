// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView')
    .directive('cbDataLinkString', cbDataLinkString);

  cbDataLinkString.$inject = [];
  function cbDataLinkString() {
    const template = `
<a ng-class="dvs.className('link-string')" ng-href="{{dvs.getLink(string)}}" debug="cb-data-link-string">{{dvs.normalize(string)}}</a>`;

    return {
      controller: DataLinkStringController,
      replace: true,
      scope: { string: '<' },
      template: template
    };

  }

  DataLinkStringController.$inject = ['$scope', 'dataViewService'];
  function DataLinkStringController($scope, dataViewService) {
    $scope.dvs = dataViewService;
  }
})();