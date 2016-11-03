// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('dataView')
    .directive('cbDataView', cbDataView);

  cbDataView.$inject = [];
  function cbDataView() {
    return {
      scope: { data: '<' },
      template: `<cb-data-node data="data"></cb-data-node>`
    };
  }
})();