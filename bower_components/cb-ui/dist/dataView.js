'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView', []);
})();
'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').constant('lodash', _);
})();
'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').directive('cbDataArray', cbDataArray);

  cbDataArray.$inject = [];
  function cbDataArray() {
    var template = '\n<div ng-class="dvs.className(\'array-list\')" debug="cb-data-array">\n  <a ng-repeat-start="item in array track by $index" ng-if="dvs.typeOf(item) === \'link-string\'" ng-class="dvs.className(\'array-list-item-link\')" ng-href="{{dvs.getLink(item)}}">\n    <cb-data-node data="dvs.getLinkObject(item)"></cb-data-node>\n  </a>\n  <a ng-if="dvs.typeOf(item) === \'link-object\'" ng-class="dvs.className(\'array-list-item-link\')" ng-href="{{dvs.getLink(item)}}">\n    <cb-data-node data="dvs.getLinkObject(item)"></cb-data-node>\n  </a>\n  <li ng-repeat-end ng-class="dvs.className(\'array-list-item\')" ng-if="!dvs.isLink(item)">\n    <cb-data-node data="item"></cb-data-node>\n  </li>\n</div>';

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
'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').directive('cbDataLinkObject', cbDataLinkObject);

  cbDataLinkObject.$inject = [];
  function cbDataLinkObject() {
    var template = '\n<a ng-class="dvs.className(\'link-object\')" ng-href="{{dvs.getLink(object)}}" debug="cb-data-link-object">\n  <cb-data-node data="dvs.getLinkObject(object)"></cb-data-node>\n</a>';

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
'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').directive('cbDataLinkString', cbDataLinkString);

  cbDataLinkString.$inject = [];
  function cbDataLinkString() {
    var template = '\n<a ng-class="dvs.className(\'link-string\')" ng-href="{{dvs.getLink(string)}}" debug="cb-data-link-string">{{dvs.normalize(string)}}</a>';

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
'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').directive('cbDataNode', cbDataNode);

  cbDataNode.$inject = [];
  function cbDataNode() {
    var template = '\n<cb-data-array array="data" ng-if="dvs.typeOf(data) === \'occupied-array\'"></cb-data-array>\n<cb-data-link-object object="data" ng-if="dvs.typeOf(data) === \'link-object\'"></cb-data-link-object>\n<cb-data-object object="data" ng-if="dvs.typeOf(data) === \'object\'"></cb-data-object>\n<cb-data-link-string string="data" ng-if="dvs.typeOf(data) === \'link-string\'"></cb-data-link-string>\n<cb-data-value value="data" ng-if="dvs.isPrimitive(data)"></cb-data-value>';

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
'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').directive('cbDataObject', cbDataObject);

  cbDataObject.$inject = [];
  function cbDataObject() {
    var template = '\n<ul ng-class="dvs.className(\'object-list\')" debug="cb-data-object">\n  <li ng-class="dvs.className(\'object-list-item\')" ng-repeat="(key, value) in object track by $index" ng-switch="dvs.typeOf(value)">\n\n    <div ng-class="dvs.className(\'panel-group\')" id="{{parentId}}" role="tablist" ng-switch-when="occupied-array" ng-init="parentId = dvs.nextId(\'parent\'); headingId = dvs.nextId(\'heading\'); collapseId = dvs.nextId(\'collapse\')">\n      <div ng-class="dvs.className(\'panel-item\')">\n        <div ng-class="dvs.className(\'panel-heading\')" role="tab" id="{{headingId}}">\n          <h6 ng-class="dvs.className(\'panel-title\')">\n            <b>\n              <a ng-class="dvs.className(\'panel-title-link\')" role="button" data-toggle="collapse" data-parent="#{{parentId}}" ng-href="#{{collapseId}}" ng-click=\'$event.preventDefault()\'>{{dvs.normalize(key)}}</a>\n            </b>\n          </h6>\n        </div>\n        <div ng-class="dvs.className(\'panel-collapse\')" id="{{collapseId}}" role="tabpanel">\n          <cb-data-array array="value"></cb-data-array>\n        </div>\n      </div>\n    </div>\n\n    <b ng-class="dvs.className(\'object-key-link\')" ng-switch-when="link-string">\n      <a ng-href="{{dvs.getLink(value)}}">{{dvs.normalize(key)}}</a>\n    </b>\n\n    <span ng-switch-default>\n      <b ng-class="dvs.className(\'object-key\')">{{dvs.normalize(key)}}: &nbsp;</b>\n      <cb-data-node data="value" ng-if="!dvs.isArray(value)"></cb-data-node>\n    </span>\n  </li>\n</ul>';

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
'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').directive('cbDataValue', cbDataValue);

  cbDataValue.$inject = [];
  function cbDataValue() {
    var template = '\n<span ng-class="dvs.className(\'value-item\')" debug="cb-data-value">{{dvs.normalize(value)}}</span>';
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
'use strict';

// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').directive('cbDataView', cbDataView);

  cbDataView.$inject = [];
  function cbDataView() {
    return {
      scope: { data: '<' },
      template: '<cb-data-node data="data"></cb-data-node>'
    };
  }
})();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ReSharper disable AssignedValueIsNeverUsed
// ReSharper disable UnusedParameter
// ReSharper disable InconsistentNaming
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView').provider('dataViewService', DataViewServiceProvider);

  DataViewServiceProvider.$inject = ['lodash'];
  function DataViewServiceProvider(lodash) {
    var _settings;

    var prd = this;
    var classes = 'classes',
        normalizer = 'normalizer',
        linkChecker = 'linkChecker',
        linkGetter = 'linkGetter',
        linkObjectGetter = 'linkObjectGetter',
        keyValueSeperator = 'keyValueSeparator';

    var _classes = {
      'array-list': 'list-group',
      'array-list-item': 'list-group-item',
      'array-list-item-link': 'list-group-item',
      'link-object': 'link-object',
      'link-string': 'link-string',
      'object-key': 'object-key',
      'object-list': 'list-unstyled',
      'object-list-item': 'object-list-item',
      'panel-group': 'panel-group',
      'panel-item': 'panel panel-warning',
      'panel-heading': 'panel-heading',
      'panel-title': 'panel-title',
      'panel-title-link': 'panel-title-link',
      'panel-collapse': 'panel-collapse collapse in',
      'value-item': 'value-item'
    };

    var settings = (_settings = {}, _defineProperty(_settings, classes, _classes), _defineProperty(_settings, normalizer, function (o) {
      return o !== null && o !== undefined ? lodash.startCase(o.toString()) : '';
    }), _defineProperty(_settings, linkChecker, function (o) {
      return false;
    }), _defineProperty(_settings, linkGetter, function (o) {
      return null;
    }), _defineProperty(_settings, linkObjectGetter, function (o) {
      return o;
    }), _defineProperty(_settings, keyValueSeperator, '\t'), _settings);

    prd.className = function (name, value) {
      return getSet(name, value, settings[classes]);
    };
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var key = _step.value;

        prd[key] = function (value) {
          return getSet(key, value);
        };
      };

      for (var _iterator = Object.keys(settings)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    prd.$get = dataViewServiceFactory;

    dataViewServiceFactory.$inject = [];
    function dataViewServiceFactory() {
      var ids = {};
      var svc = {};

      svc.className = function (element) {
        return settings[classes][element];
      };
      svc.normalize = settings[normalizer];
      svc.isLink = settings[linkChecker];
      svc.getLink = settings[linkGetter];
      svc.getLinkObject = settings[linkObjectGetter];
      svc.keyValueSeparator = function () {
        return settings[keyValueSeperator];
      };
      svc.typeOf = typeOf;
      svc.isPrimitive = function (data) {
        return angular.isDefined(data) && !angular.isObject(data);
      };
      svc.isArray = function (data) {
        return angular.isArray(data);
      };
      svc.isEmptyArray = function (data) {
        return svc.isArray(data) && data.length === 0;
      };
      svc.isOccupiedArray = function (data) {
        return svc.isArray(data) && data.length > 0;
      };
      svc.isObject = function (data) {
        return !angular.isArray(data) && angular.isObject(data);
      };
      svc.nextId = function (key) {
        return key + '-' + nextId(key);
      };
      svc.lastId = function (key) {
        return key + '-' + lastId(key);
      };

      return svc;

      function nextId(key) {
        return ids[key] = lastId(key) + 1;
      }

      function lastId(key) {
        return ids[key] = ids[key] || 1;
      }

      function typeOf(item) {
        if (item === null || item === undefined) return 'void';
        if (angular.isArray(item)) return item.length ? 'occupied-array' : 'empty-array';
        if (angular.isObject(item)) return settings[linkChecker](item) ? 'link-object' : 'object';
        if (angular.isString(item) && settings[linkChecker](item)) return 'link-string';
        return typeof item === 'undefined' ? 'undefined' : _typeof(item);
      }
    }

    function getSet(prop, value) {
      var object = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : settings;

      return angular.isDefined(value) ? object[prop] = value : object[prop];
    }
  }
})();

// cb-data-link-object & cb-data-link-string