// ReSharper disable UndeclaredGlobalVariableUsing

(function () {
  'use strict';
  
  angular.module('mainApp', ['ngRoute', 'ngAnimate', 'angular-loading-bar', 'dataView']);
})();
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';
  angular.module('mainApp').directive('cbBreadcrumb', breadcrumbDirective);

  breadcrumbDirective.$inject = [];
  function breadcrumbDirective() {
    const template = `
<ol class="breadcrumb">
  <li ng-repeat="nav in data.navs">
    <a ng-href="{{nav.path}}">{{nav.name}}</a>
  </li>
  <li class="active">{{data.current}}</li>
</ol>`;

    return {
      replace: true,
      scope: { data: '<' },
      template
    };
  }
})();
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';
  angular.module('mainApp').config(config);

  config.$inject = ['$locationProvider', 'dataViewServiceProvider', 'apiUrl', 'commonFn'];
  function config(locPrd, dvsPrd, apiUrl, commonFn) {
    locPrd.html5Mode(true);

    dvsPrd.className('object-list', 'unstyled');
    dvsPrd.className('panel-item', 'panel');
    dvsPrd.linkChecker(checkLink);
    dvsPrd.linkGetter(getLink);
    dvsPrd.linkObjectGetter(getLinkObject);
    dvsPrd.normalizer(commonFn.normalize);

    function checkLink(o) {
      return commonFn.isUrl(o) || commonFn.isUrl(o.url);
    }

    function getLink(o) {
      const rawLink = commonFn.isUrl(o) && o || commonFn.isUrl(o.url) && o.url;
      return getApiPath(rawLink);
    }

    function getLinkObject(o) {
      if (angular.isString(o)) return getPathName(o);
      if (angular.isObject(o)) {
        if (Object.keys(o) && o.name && o.url) return o.name;

        const res = angular.copy(o);
        const url = o.url;
        delete res.url;
        return Object.keys(res).length ? res : getPathName(url);
      }
      return null;
    }
    
    function getApiPath(url) {
      return commonFn.getRelativePath(url, apiUrl);
    }

    function getPathName(url) {
      return !isApiUrl(url) ? url : commonFn.getPathName(getApiPath(url));
    }

    function isApiUrl(data) {
      return typeof data === "string" && commonFn.isSubPath(data, apiUrl);
    }
  }
})();
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';
  const commonFn = {
    extractPaths,
    getAbsolutePath,
    getPathName,
    getRelativePath,
    isSubPath,
    isUrl,
    joinPaths,
    normalize,
    normalizePath,
    pathsEqual,
    removeLeadingSlash,
    removeTrailingSlash
  };

  angular.module('mainApp')
    .constant('apiUrl', 'http://pokeapi.co/api/v2')
    .constant('pokeServiceUrl', 'https://pokeservice.herokuapp.com/')
    .constant('themesUrl', 'public/resources/data/themes.json')
    .constant('commonFn', commonFn);

  function normalize(value) {
    return value === null || value === undefined ? '' : _.startCase(value.toString());
  }

  function getAbsolutePath(relativePath, base) {
    return joinPaths(base, relativePath);
  }

  function getRelativePath(path, base) {
    return isSubPath(path, base) ? path.substring(base.length) : path;
  }

  function getPathName(url) {
    const paths = extractPaths(url);
    return paths.length <= 1 ? paths[0] : `${paths[paths.length - 2]}/${paths[paths.length - 1]}`;
  }

  function pathsEqual(path1, path2) {
    return normalize(path1) === normalize(path2);
  }

  function joinPaths(...parts) {
    return parts.reduce((acc, cur) => {
      return `${removeTrailingSlash(acc)}/${removeLeadingSlash(cur)}`;
    }, '');
  }

  function isSubPath(path, base) {
    return path.indexOf(base) === 0;
  }

  function isUrl(text) {
    return typeof text === "string" && /https?:\/\//.test(text);
  }

  function removeLeadingSlash(path) {
    return path.match(/^\/?(.*)/)[1];
  }

  function removeTrailingSlash(path) {
    return path.match(/(.*?)\/?$/)[1];
  }

  function normalizePath(path) {
    return removeLeadingSlash(removeTrailingSlash(path)).toLowerCase();
  }
  
  function extractPaths(path) {
    return path.match(/[^\/]+/g) || path;
  }
})();
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('mainApp').controller('mainController', MainController);

  MainController.$inject = ['$scope', '$location', '$log', '$http', 'pokeService', 'themesService'];
  function MainController($scope, $location, $log, $http, pokeService, themesService) {
    const vm = this;
    vm.title = 'PokéCOOL';
    vm.subtitle = 'A pokémon encyclopedia - Everything you want to know about Pokémon';
    vm.mainPages = {
      'Home': '/',
      'Contact': '/contact',
      'About': '/about'
    };
    vm.debug = { shown: false };
    vm.selectedTheme = {};
    vm.categories = {};
    vm.activeClass = activeClass;
    activate();


    $scope.$on('$locationChangeSuccess', () => {
      getData();
    });

    function activate() {
      themesService.getThemes()
        .then(themes => {
          vm.themes = themes;
          vm.selectedTheme = themes[0];
        });

      pokeService.getCategories().then(categories => vm.categories = categories).catch(error => vm.error = error);
    }

    function getData() {
      pokeService.getData($location.url())
        .then(res => {
          vm.data = res.data;
          vm.pageName = res.name;
          vm.breadcrumb = res.navInfo;
        })
        .catch(error => vm.error = error);
    }

    function activeClass(path) {
      return path === $location.url() ? 'active' : '';
    }
  }
})();

// TODO: handle ajax errors
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';
  angular.module('mainApp').factory('pokeService', pokeService);

  pokeService.$inject = ['$q', '$http', 'apiUrl', 'pokeServiceUrl', 'commonFn'];
  function pokeService($q, $http, apiUrl, pokeServiceUrl, commonFn) {
    const cache = { data: {}, categories: null };

    return {
      getData,
      getCategories
    };

    function getData(path = '/') {
      const url = commonFn.normalizePath(commonFn.getAbsolutePath(path, pokeServiceUrl));
      const cachedData = cache.data[url];
      if (cachedData) return $q.when(cachedData);

      return $http.get(url)
        .then(res => {
          const data = createPageData(res.data, url);
          cache.data[url] = data;
          return data;
        });
    }

    function getCategories() {
      const cachedCategories = cache.categories;
      if (cachedCategories) return $q.when(cachedCategories);
      return getData()
        .then(res => {
          const categories = createCategoryData(res.data);
          cache.categories = categories;
          return categories;
        });
    }

    function createPageData(data, url) {
      const res = {
        name: '',
        data,
        navInfo: {
          current: '',
          navs: []
        }
      };

      if (commonFn.pathsEqual(url, pokeServiceUrl)) {
        res.navInfo.current = 'Home';
        res.name = 'Categories';
        return res;
      }

      const relativePath = commonFn.getRelativePath(url, pokeServiceUrl);
      const rawName = data.name || commonFn.getPathName(relativePath);
      res.name = res.navInfo.current = commonFn.normalize(rawName);
      res.navInfo.navs.push({ name: 'Home', path: '/' });

      const paths = commonFn.extractPaths(relativePath);
      if (!paths) return res;

      for (let i = 0; i < paths.length - 1; i++) {
        const p = paths[i];
        const parentPath = res.navInfo.navs[res.navInfo.navs.length - 1].path;
        const path = commonFn.joinPaths(parentPath, p);
        const name = commonFn.normalize(p);
        res.navInfo.navs.push({ name, path });
      }

      return res;
    }

    function createCategoryData(data) {
      return Object.keys(data)
        .map(k => {
          return {
            name: commonFn.normalize(k),
            path: commonFn.getRelativePath(data[k], apiUrl)
          };
        });
    }
  }

})();
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';

  angular.module('mainApp').factory('themesService', themesService);

  themesService.$inject = ['$http', 'themesUrl'];
  function themesService($http, themesUrl) {
    return { getThemes };

    function getThemes() {
      return $http.get(themesUrl).then(res => res.data);
    }
  }
})();