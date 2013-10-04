/**
 * sdw-viewmodel - v0.0.1 - 2013-10-04
 * 
 *
 * Copyright (c) 2013 Hunter Loftis
 * Licensed MIT <https://raw.github.com/joshdmiller/ng-boilerplate/master/LICENSE>
 */
(function ( window, angular, undefined ) {

// should listen for routeChange events and automatically apply any matching states
// should also be able to use like:
// viewmodel.set('state.path.here', { options: 'here', normally: 'from', the: 'url' })

angular
  .module('sdw.viewmodel', [])

  .provider('viewmodel', function() {
    var self = this;
    var states = {};
    var defaultState;
    var routes = [];

    this.state = function(name, options) {
      states[name] = {
        route: options.route,
        action: options.action
      };

      return this;
    };

    this.otherwise = function(newDefault) {
      defaultState = newDefault;

      return this;
    };

    // TODO: is there another way to get $rootScope access?
    // currently, this won't work unless a <viewmodel> directive exists on the page
    // (since that triggers the $get() when the directive's dependencies get injected)

    this.$get = function($rootScope, $location, $routeParams) {

      Object.keys(states).forEach(buildRoute);

      $rootScope.$on('$locationChangeSuccess', onLocationChange);

      // TODO: check to see if this works
      self.applyState = applyState;

      function buildRoute(stateName, index) {
        var fullRoute = '';
        var ancestors = getAncestors(states, stateName);

        ancestors.forEach(addRoute);

        var regex = regexRoute(fullRoute);

        routes.push({
          string: fullRoute,
          state: stateName,
          regex: regex.re,
          params: regex.params
        });

        function addRoute(ancestor, index) {
          fullRoute += ancestor.route;
        }
      }

      function onLocationChange() {
        var match = matchRoute($location.path()) || { state: defaultState, params: {} };
        applyState($rootScope, match.state, match.params);
      }
    };

    // match the currently hashed route to the routes Array

    function matchRoute(path) {
      var paramMap = {};
      var route, params;

      for (var i = 0; i < routes.length; i++) {
        route = routes[i];
        paramValues = path.match(route.regex);

        if (paramValues) {
          paramValues.slice(1).forEach(mapParam);
          return {
            state: route.state,
            params: paramMap
          };
        }
      }

      return undefined;

      function mapParam(val, index) {
        var name = route.params[index];
        paramMap[name] = val;
      }
    }

    // build a regex test for a route string in /a/format/:like/this
    // heavily based on ng-router and angular-ui router
    // "A programmer had a problem, which he decided to solve with RegEx. Now he had two problems." - paraphrased

    function regexRoute(route) {
      var regex = '';
      var params = [];
      var dst = {};

      // Escape regexp special characters.

      var routeString = '^' + route.replace(/[-\/\\^$:*+?.()|[\]{}]/g, "\\$&") + '$';

      // replace each :param in `routeString` with a capturing group

      var re = /\\([:*])(\w+)/g;
      var lastMatchedIndex = 0;
      var paramMatch;

      while ((paramMatch = re.exec(routeString)) !== null) {
        regex += routeString.slice(lastMatchedIndex, paramMatch.index);

        if (paramMatch[1] === ':') regex += '([^\\/]*)';
        else if (paramMatch[1] === '*') regex += '(.*)';

        params.push(paramMatch[2]);
        lastMatchedIndex = re.lastIndex;
      }

      regex += routeString.slice(lastMatchedIndex);

      return {
        string: regex,
        re: new RegExp(regex, 'i'),
        params: params
      };
    }

    function applyState(scope, name, params) {
      var newStateValues = {};
      var ancestors = getAncestors(states, name);

      ancestors.forEach(doAction);
      scope.$broadcast('viewmodel:state', newStateValues);

      function doAction(state, index) {
        var action = state.action;
        if (!action) return;

        action(newStateValues, params);
      }
    }

    function getAncestors(object, path) {
      var chain = path.split('.');
      var ancestors = [];
      var ancestorPath;

      for(var len = 1; len <= chain.length; len++) {
        ancestorPath = chain.slice(0, len).join('.');
        ancestors.push(object[ancestorPath]);
      }

      return ancestors;
    }
  })

  .directive('sdwViewmodel', function($rootScope, viewmodel) {
    return {
      restrict: 'EA',
      link: viewmodelLink
    };

    function viewmodelLink(scope, element, attrs, controller) {
      var vmName = attrs.model || attrs.sdwViewmodel;

      scope[vmName] = scope[vmName] || {};

      $rootScope.$on('viewmodel:state', onState);

      function onState(event, newState) {
        for (var key in newState) {
          scope[vmName][key] = newState[key];
        }
      }
    }
  });


angular
  .module('dtv.demo.routes', ['sdw.viewmodel'])

  .config(function(viewmodelProvider) {

    viewmodelProvider
      .otherwise('browse')

      // route #/browse

      .state('browse', {
        route: '',
        action: function(vm, params) {
          vm.showModal = false;
        }
      })

      // route #/movie/:movie

      .state('browse.movie', {
        route: '/movie/:movie',
        action: function(vm, params) {
          vm.showModal = true;
          vm.modalView = 'movie';
          vm.movieId = +params.movie;
        }
      })

      // route #/movie/:movie/rent

      .state('browse.movie.rent', {
        route: '/rent',
        action: function(vm, params) {
          vm.modalView = 'rent';
        }
      })

      // route #/celebrity/:name

      .state('browse.celebrity', {
        route: '/celebrity/:celeb',
        action: function(vm, params) {
          vm.showModal = true;
          vm.modalView = 'celebrity';
          vm.celebId = +params.celeb;
        }
      });

  })

  .controller('RouteController', function($scope, $location, viewmodel) {

    $scope.movies = [
      { id: 123, title: 'The Shawshank Redemption', celeb: 333 },
      { id: 234, title: 'Garden State', celeb: 444 },
      { id: 345, title: 'Crouching Tiger, Hidden Dragon', celeb: 555 }
    ];

    $scope.celebs = [
      { id: 333, name: 'Morgan Freeman' },
      { id: 444, name: 'Zach Braff' },
      { id: 555, name: 'Chow Yun Fat' }
    ];

    $scope.movieData = function() {
      for (var i = 0; i < $scope.movies.length; i++) {
        if ($scope.movies[i].id === $scope.vm.movieId) return $scope.movies[i];
      }
    };

    $scope.celebData = function() {
      for (var i = 0; i < $scope.celebs.length; i++) {
        if ($scope.celebs[i].id === $scope.vm.celebId) return $scope.celebs[i];
      }
    };

    $scope.onRent = function() {
      alert('Rented ' + $scope.movieData().title + '!');
      $location.path('');
    };

  });

angular
  .module('examples.simple', ['sdw.viewmodel'])
  .config(function(viewmodelProvider) {

    viewmodelProvider

      .state('default', {
        route: '',
        action: function(vm, params) {
          vm.showModal = false;
          vm.article = '';
          vm.showPrice = false;
        }
      })

      .state('article', {
        route: '/article/:article',
        action: function(vm, params) {
          vm.showModal = true;
          vm.article = params.article;
        }
      })

      .state('article.buy', {
        route: '/buy',
        action: function(vm, params) {
          vm.showPrice = true;
        }
      });
  });

angular.module('templates-app', []);


angular.module('templates-component', []);


})( window, window.angular );
