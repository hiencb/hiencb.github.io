// ReSharper disable AssignedValueIsNeverUsed
// ReSharper disable UnusedParameter
// ReSharper disable InconsistentNaming
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('cb.dataView')
    .provider('dataViewService', DataViewServiceProvider);

  DataViewServiceProvider.$inject = ['lodash'];
  function DataViewServiceProvider(lodash) {
    const prd = this;
    const classes = 'classes',
      normalizer = 'normalizer',
      linkChecker = 'linkChecker',
      linkGetter = 'linkGetter',
      linkObjectGetter = 'linkObjectGetter',
      keyValueSeperator = 'keyValueSeparator';

    const _classes = {
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

    const settings = {
      [classes]: _classes,
      [normalizer]: o => o !== null && o !== undefined ? lodash.startCase(o.toString()) : '',
      [linkChecker]: o => false,
      [linkGetter]: o => null,
      [linkObjectGetter]: o => o,
      [keyValueSeperator]: '\t'
    };

    prd.className = (name, value) => getSet(name, value, settings[classes]);
    for (const key of Object.keys(settings)) {
      prd[key] = value => getSet(key, value);
    }
    prd.$get = dataViewServiceFactory;

    dataViewServiceFactory.$inject = [];
    function dataViewServiceFactory() {
      const ids = {};
      const svc = {};

      svc.className = element => settings[classes][element];
      svc.normalize = settings[normalizer];
      svc.isLink = settings[linkChecker];
      svc.getLink = settings[linkGetter];
      svc.getLinkObject = settings[linkObjectGetter];
      svc.keyValueSeparator = () => settings[keyValueSeperator];
      svc.typeOf = typeOf;
      svc.isPrimitive = data => angular.isDefined(data) && !angular.isObject(data);
      svc.isArray = data => angular.isArray(data);
      svc.isEmptyArray = data => svc.isArray(data) && data.length === 0;
      svc.isOccupiedArray = data => svc.isArray(data) && data.length > 0;
      svc.isObject = data => !angular.isArray(data) && angular.isObject(data);
      svc.nextId = key => `${key}-${nextId(key)}`;
      svc.lastId = key => `${key}-${lastId(key)}`;

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
        return typeof item;
      }
    }

    function getSet(prop, value, object = settings) {
      return angular.isDefined(value) ? object[prop] = value : object[prop];
    }
  }
})();

// cb-data-link-object & cb-data-link-string