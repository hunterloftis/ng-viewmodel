// should listen for routeChange events and automatically apply any matching states
// should also be able to use like:
// viewmodel.set('state.path.here', { options: 'here', normally: 'from', the: 'url' })

angular
  .module('sdw.viewmodel', [])

  .provider('viewmodel', function() {
    var self = this;
    var states = {};
    var defaultState;
    var params = {};
    var routes = [];

    this.state = function(name, options) {
      states[name] = {
        route: options.route,
        action: options.action
      };

      return this;
    };

    this.param = function(name, action) {
      params[name] = action;
    };

    this.fallback = function(newDefault) {
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
        var match = matchRoute($location.path());

        if (match) applyState($rootScope, match.state, match.params);
        else if (defaultState) applyState($rootScope, defaultState, {});
        else applyDefaults();

        var search = $location.search();
        var newState = {};
        for (var key in params) {
          params[key](newState, search[key]);
        }
        $rootScope.$broadcast('viewmodel:state', newState);
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

