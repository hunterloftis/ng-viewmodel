// should listen for routeChange events and automatically apply any matching states
// should also be able to use like:
// viewmodel.set('state.path.here', { options: 'here', normally: 'from', the: 'url' })
// should also be able to nest viewmodels like this?
// <div sdw-viewmodel='vm'><h1>{{ vm.title }}</h1><div sdw-viewmodel='vm.main'><p>{{ vm.main.description }}</p></div></div>

angular
  .module('sdw.viewmodel', [])

  .provider('viewmodel', function() {
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

    this.$get = function($rootScope, $location, $routeParams) {

      Object.keys(states).forEach(buildRoute);

      $rootScope.$on('$locationChangeSuccess', onLocationChange);

      console.log('states:', states);
      console.log('routes:', routes);

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

      function buildRoute(stateName, index) {
        var fullRoute = '';
        var ancestors = getAncestors(states, stateName);

        ancestors.forEach(addRoute);

        var regex = regexRoute(fullRoute);

        routes.push({
          string: fullRoute,
          state: states[stateName],
          regex: regex.re,
          params: regex.params
        });

        function addRoute(ancestor, index) {
          fullRoute += ancestor.route;
        }
      }

      function onLocationChange() {
        console.log('path:', $location.path());
        var match = matchRoute($location.path()) || { state: defaultState, params: [] };
        applyState(match.state, match.params);
      }
    };

    // match the currently hashed route to the routes Array

    function matchRoute(path) {
      var paramMap = {};
      var route, params;

      for (var i = 0; i < routes.length; i++) {
        route = routes[i];
        params = path.match(route.regex);

        if (params) {
          console.log('match! params:', params);
          params.forEach(mapParam);
          return {
            state: route.state,
            params: paramMap
          };
        }
      }

      return undefined;

      function mapParam(name, index) {
        paramMap[name] = params[index + 1];
      }
    }

    function regexRoute(route) {
      var regex = '';
      var params = [];
      var dst = {};

      // Escape regexp special characters.
      var routeString = '^' + route.replace(/[-\/\\^$:*+?.()|[\]{}]/g, "\\$&") + '$';

      var re = /\\([:*])(\w+)/g;
      var lastMatchedIndex = 0;
      var paramMatch;

      console.log('');
      console.log('route:', route);
      console.log('routeString:', routeString);

      // replace each :param in `routeString` with a capturing group

      while ((paramMatch = re.exec(routeString)) !== null) {
        console.log('paramMatch:', paramMatch);

        regex += routeString.slice(lastMatchedIndex, paramMatch.index);

        if (paramMatch[1] === ':') regex += '([^\\/]*)';
        else if (paramMatch[1] === '*') regex += '(.*)';

        params.push(paramMatch[2]);
        lastMatchedIndex = re.lastIndex;
      }

      regex += routeString.slice(lastMatchedIndex);

      console.log('regex:', regex);

      return {
        string: regex,
        re: new RegExp(regex, 'i'),
        params: params
      };
    }

    function applyState(name, params) {
      console.log('applying state:', name, params);
    }
  })

  .directive('sdwViewmodel', function(viewmodel) {
    return {
      restrict: 'EA',
      transclude: true
    };
  });
