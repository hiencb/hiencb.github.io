// ReSharper disable UnknownCssClass
// ReSharper disable UseOfImplicitGlobalInFunctionScope
// ReSharper disable StringConcatenationToTemplateString
// ReSharper disable VariableCanBeMadeConst

angular.module('cb.strap', ['cb.strap.tpl']);

/**
 * Default controller
 */
angular.module('cb.strap')
  .controller('DefaultController', [function() {}]);

/**
 * Common service
 */
angular.module('cb.strap')
  .factory('$strapService', [
    function() {
      var service = {};

      function isTrue(value) {
        return value !== false && value !== undefined && value !== null;
      }

      var getValue = service.getValue = function(obj1, propName, defaultValue, obj2) {
        if (!obj2) obj2 = obj1.info;
        return obj1[propName] || (obj2 && obj2[propName]) || defaultValue;
      };

      service.getAttrValue = function(attrs, propName, scope, defaultValue) {
        return getValue(attrs, propName, defaultValue, attrs.info && scope[attrs.info]);
      };
      var getBoolean = service.getBoolean = function(obj1, propName, obj2) {
        if (!obj2) obj2 = obj1.info;
        return isTrue(obj1[propName]) || isTrue(obj2 && obj2[propName]);
      };

      service.getAttrBoolean = function(attrs, propName, scope) {
        return getBoolean(attrs, propName, attrs.info && scope[attrs.info]);
      };
      var transclude = service.transclude = function(scope, elem, transcludeFn) {
        transcludeFn(scope, function(clone) {
          elem.append(clone);
        });
      };

      var links = {};

      links.transclude = function(scope, elem, attrs, ctrl, transcludeFn) {
        transclude(scope, elem, transcludeFn);
      };

      service.links = links;

      var getDdoFalsy = function(ddo, propName) {
        return ddo[propName] === undefined ? true : ddo[propName];
      };

      service.createDdo = function(ddo) {
        return {
          bindToController: ddo.bindToController,
          controller: ddo.controller,
          controllerAs: ddo.controllerAs,
          link: ddo.link,
          replace: getDdoFalsy(ddo, 'replace'),
          restrict: ddo.restrict || 'E',
          scope: ddo.scope,
          template: ddo.template,
          templateUrl: ddo.templateUrl,
          transclude: getDdoFalsy(ddo, 'transclude')
        };
      };

      return service;
    }
  ]);


/**
 * cb-alert (@context, @dismissible, @templateUrl, <info) content
 */
angular.module('cb.strap')
  .component('cbAlert', {
    bindings: {
      context: '@',
      dismissible: '@',
      templateUrl: '@',
      info: '<'
    },
    transclude: true,
    templateUrl: [
      '$element', '$attrs', function(ele, attrs) {
        return attrs.templateUrl || './tpl/cb-alert.html';
      }
    ],
    controller: [
      function() {
        var ctrl = this;
        var context = ctrl.context || (ctrl.info && ctrl.info.context) || 'success';

        ctrl.isDismissible = function() {
          return ctrl.dismissible !== undefined || (ctrl.info && ctrl.info.dismissible);
        };

        ctrl.getClass = function() {
          var dismissibleClass = ctrl.isDismissible() ? ' alert-dismissble' : '';
          return 'alert alert-' + context + dismissibleClass;
        };
      }
    ]
  });


/**
 * Button service
 */
angular.module('cb.strap')
  .factory('$strapButton', [
    '$strapService',
    function($strap) {
      var service = {};
      service.getDirectiveObj = function(tag) {
        return $strap.createDdo({
          bindToController: true,
          controller: 'ButtonCtrl',
          controllerAs: '$ctrl',
          scope: {
            type: '@', // 'button', 'submit'. Defaults to 'button'
            context: '@',
            // 'default', 'primary', 'success', 'info', 'warning', 'danger' or 'link'. Defaults to 'default'
            size: '@', // 'lg', '', 'sm', 'xs'. Defaults to '' (empty)
            block: '@', // true or false. Defaults to false
            active: '@', // true or false. Defaults to false
            disabled: '@', // true or false. Defaults to false
            href: '@', // Used for <a>. Defaults to '' (empty)
            value: '@', // Used for <input>. Defaults to '' (empty)
            templateUrl: '@',
            info: '<'
          },
          templateUrl: templateUrlFn(tag),
          link: function(scope, ele, attrs, ctrl, transclude) {
            var isDisabled = function() {
              return $strap.getBoolean(ctrl, 'disabled');
            };

            var getType = function() {
              return $strap.getValue(ctrl, 'type', 'button');
            };

            var getHref = function() {
              return $strap.getValue(ctrl, 'href');
            };

            var getValue = function() {
              return $strap.getValue(ctrl, 'value');
            };

            var getClass = function() {
              var context = ' btn-' + $strap.getValue(ctrl, 'context', 'default');
              var size = $strap.getValue(ctrl, 'size');
              size = size ? ' btn-' + size : '';
              var block = $strap.getBoolean(ctrl, 'block') ? ' btn-block' : '';
              var active = $strap.getBoolean(ctrl, 'active') ? ' active' : '';
              var disabled = ctrl.isDisabled() ? ' disabled' : '';
              var cls = 'btn' + context + size + block + active + disabled;
              return cls;
            };

            ele.addClass(getClass());
            ele.attr('type', getType());
            if (isDisabled()) ele.attr('disabled', '');
            if (tag === 'a') ele.attr('href', getHref());
            if (tag === 'input') ele.attr('value', getValue());
            if (transclude) transclude(scope, function(clone) { ele.append(clone); });
          }
        });
      };

      function templateUrlFn(tag) {
        var defaultTpl;
        switch (tag) {
          case 'a':
            defaultTpl = './tpl/cb-button(a).html';
            break;
          case 'input':
            defaultTpl = './tpl/cb-button(input).html';
            break;
          default:
            defaultTpl = './tpl/cb-button(button).html';
            break;
        }
        return function(ele, attrs) {
          return attrs.templateUrl || defaultTpl;
        };
      }

      return service;
    }
  ]);


/**
 * Common button controller
 */
angular.module('cb.strap')
  .controller('ButtonCtrl', [
    '$strapService',
    function($strap) {
      var ctrl = this;

      ctrl.isDisabled = function() {
        //return ctrl.disabled !== undefined || (ctrl.info && ctrl.info.disabled);
        return $strap.getBoolean(ctrl, 'disabled');
      };

      ctrl.disabledAttr = function() {
        return ctrl.isDisabled() ? 'disabled' : undefined;
      };

      ctrl.getType = function() {
        //return ctrl.type || (ctrl.info && ctrl.info.type) || 'button';
        return $strap.getValue(ctrl, 'type', 'button');
      };

      ctrl.getHref = function() {
        //return ctrl.href || (ctrl.info && ctrl.info.href);
        return $strap.getValue(ctrl, 'href');
      };

      ctrl.getValue = function() {
        return $strap.getValue(ctrl, 'value');
      };

      ctrl.getClass = function() {
        /*var context = ' btn-' + (ctrl.context || (ctrl.info && ctrl.info.context) || 'default');
        var size = ctrl.size || (ctrl.info && ctrl.info.size);
        size = size ? ' btn-' + size : '';
        var block = ctrl.block !== undefined || (ctrl.info && ctrl.info.block) ? ' btn-block' : '';
        var active = ctrl.active !== undefined || (ctrl.info && ctrl.info.active) ? ' active' : '';
        var disabled = ctrl.isDisabled() ? ' disabled' : '';*/

        var context = ' btn-' + $strap.getValue(ctrl, 'context', 'default');
        var size = $strap.getValue(ctrl, 'size');
        size = size ? ' btn-' + size : '';
        var block = $strap.getBoolean(ctrl, 'block') ? ' btn-block' : '';
        var active = $strap.getBoolean(ctrl, 'active') ? ' active' : '';
        var disabled = ctrl.isDisabled() ? ' disabled' : '';
        var cls = 'btn' + context + size + block + active + disabled;
        //console.log(cls);
        return cls;
      };
    }
  ]);


/**
 * cb-button
 */
angular.module('cb.strap')
  .directive('cbButton', [
    '$strapButton',
    function($btn) {
      return $btn.getDirectiveObj('button');
    }
  ]);


/**
* cb-button-a
*/
angular.module('cb.strap')
  .directive('cbButtonA', [
    '$strapButton',
    function($btn) {
      return $btn.getDirectiveObj('a');
    }
  ]);


/**
* cb-button-input
*/
angular.module('cb.strap')
  .directive('cbButtonInput', [
    '$strapButton',
    function($btn) {
      return $btn.getDirectiveObj('input');
    }
  ]);

/**
 * cb-col
 */
angular.module('cb.strap')
  .directive('cbCol', [
    '$strapService',
    function($strap) {

      return $strap.createDdo({
        link: function(scope, elem, attrs, ctrl, transcldFn) {
          if (attrs.info) scope.$watch(attrs.info, setClass);

          function setClass() {
            var colClass = ['lg', 'md', 'sm', 'xs']
              .map(function(sz) {
                return getColClass(sz, sz) +
                  getColClass(sz + 'Offset', sz + '-offset') +
                  getColClass(sz + 'Pull', sz + '-pull') +
                  getColClass(sz + 'Push', sz + '-push');
              })
              .join('');
            elem.addClass(colClass);
          }

          function getColClass(propName, className) {
            var value = $strap.getAttrValue(attrs, propName, scope);
            return value ? ' col-' + className + '-' + value : '';
          }
          setClass();
          $strap.transclude(scope, elem, transcldFn);
        },
        cbScope: { // not a true scope
          lg: '@',
          md: '@',
          sm: '@',
          xs: '@',
          lgOffset: '@',
          mdOffset: '@',
          smOffset: '@',
          xsOffset: '@',
          lgPull: '@',
          mdPull: '@',
          smPull: '@',
          xsPull: '@',
          lgPush: '@',
          mdPush: '@',
          smPush: '@',
          xsPush: '@',
          info: '<'
        },
        template: '<div></div>'
      });
    }
  ]);

angular.module('cb.strap')
  .directive('cbContainer', [
    '$compile',
    '$strapService',
    function($compile, $strap) {
      return $strap.createDdo({
        link: function(scope, elem, attrs, ctrl, transcldFn) {
          var ctnClass = angular.isString(attrs.fluid) ? 'container-fluid' : 'container';
          elem.addClass(ctnClass);
          $strap.transclude(scope, elem, transcldFn);
          $compile(elem)(scope.$parent);
        },
        template: '<div></div>'
      });
    }
  ]);

/**
 * cb-glyphicon (<icon)
*/
angular.module('cb.strap')
  .component('cbGlyphicon', {
    bindings: {
      icon: '<'
    },
    template: '<span class="{{$ctrl.getClass()}}" aria-hidden="true"></span>',
    controller: [
      function() {
        var ctrl = this;
        var icon = ctrl.icon || 'font';

        ctrl.getClass = function() {
          return 'glyphicon glyphicon-' + icon;
        };
      }
    ]
  });

/**
 * cb-row
 */
angular.module('cb.strap')
  .directive('cbRow', [
    '$strapService', function($strap) {
      return $strap.createDdo({
        template: '<div class="row"></div>',
        link: $strap.links.transclude
      });
    }
  ]);

/**
* cb-table
*/
angular.module('cb.strap')
  .directive('cbTable', [
    '$strapService', function($strap) {
      return $strap.createDdo({
        /*link: function(scope, elem, attrs, ctrl, transcldFn) {
          var responsive = $strap.getAttrBoolean(attrs, 'responsive', scope);
          if (responsive) elem.addClass('table-responsive');
          var style = $strap.getAttrValue(attrs, 'style', scope);
          var table = angular.element(elem[0].children[0]);

          if (style) {
            var styleClass = 'table-' + style;
            table.addClass(styleClass);
          }
          //$strap.transclude(scope, table, transcldFn);
        },*/
        cbScope: { // not a true scope
          style: '@',
          responsive: '@',
          info: '<'
        },
        template: '<div><table class="table"><ng-tranclude /></table></div>' /*,
        transclude: 'element'*/
      });
    }
  ]);

// TODO: test templateUrl attribute
// TODO: test using info object
// TODO: cb-col remove classes before adding new classes
// TODO: cb-button remove controller use scope instead