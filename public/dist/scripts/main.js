// ReSharper disable UndeclaredGlobalVariableUsing

(function () {
  'use strict';
  
  angular.module('mainApp', ['ngRoute', 'ngCookies', 'ngAnimate', 'angular-loading-bar', 'cb.dataView', 'cb.debugView']);
})();
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';
  angular.module('mainApp').config(config);

  config.$inject = ['$locationProvider', 'dataViewServiceProvider', 'apiUrl', 'commonFn'];
  function config(locPrd, dvsPrd, apiUrl, commonFn) {
    locPrd.html5Mode(false);

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
      const relativePath = commonFn.getRelativePath(url, apiUrl);
      return commonFn.createRoutePath(relativePath, locPrd.html5Mode().enabled);
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
    createRoutePath,
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
    .constant('themesUrl', 'public/resources/data/themes.json')
    .constant('commonFn', commonFn);

  function normalize(value) {
    return value === null || value === undefined ? '' : _.startCase(value.toString());
  }

  function createRoutePath(path, html5Mode) {
    return html5Mode || isUrl(path) ? path : joinPaths('/#/', path);
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

  MainController.$inject = ['$scope', '$location', '$log', '$http', 'pokeService', 'themesService', 'commonFn'];
  function MainController($scope, $location, $log, $http, pokeService, themesService, commonFn) {
    const vm = this;
    vm.title = 'PokéCOOL';
    vm.subtitle = 'A pokémon encyclopedia - Everything you want to know about Pokémon';
    vm.mainPages = {
      'Home': '/',
      'Contact': '/contact',
      'About': '/about'
    };
    vm.debug = { shown: false };
    vm.themesServive = themesService;
    vm.categories = {};
    vm.activeClass = activeClass;
    vm.navigate = navigate;
    vm.test = item => console.log(item || 'test') || 1;
    activate();


    $scope.$on('$locationChangeSuccess', () => {
      getData();
    });

    function activate() {
      /*themesService.getThemes()
        .then(themes => {
          vm.themes = themes;
          vm.selectedTheme = themes[0];
        });*/

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
      return commonFn.pathsEqual(path, $location.url()) ? 'active' : '';
    }

    function navigate(path) {
      $location.path(path);
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

  themesService.$inject = ['$http', '$cookies', 'themesUrl'];
  function themesService($http, $cookies, themesUrl) {
    const THEME_COOKIE = '$theme$';

    const svc = {
      themes: [],
      currentTheme: null,
      persist: persist
    };

    activate();
    return svc;

    function persist(theme) {
      const themeName = theme && theme.name || theme || svc.currentTheme.name;
      if (themeName) $cookies.put(THEME_COOKIE, themeName);
    }

    function activate() {
      return $http.get(themesUrl)
        .then(res => {
          const themes = res.data;
          svc.themes = themes;
          const cookieThemeName = $cookies.get(THEME_COOKIE);
          svc.currentTheme = cookieThemeName && themes.find(t => t.name === cookieThemeName) || themes[0];
        });
    }
  }
})();
// ReSharper disable UndeclaredGlobalVariableUsing
(function () {
  'use strict';
  const env = 'production';

  angular.module('mainApp')
    .constant('pokeServiceUrl', 'https://pokeservice.herokuapp.com/')
    .constant('environment', env);

  console.log(env);
})();