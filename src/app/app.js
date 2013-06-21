angular
  .module('dtv.demo.routes', ['ui.state'])

  .config(function($routeProvider, $stateProvider) {

    // automatically redirect to #/

    $routeProvider
      .otherwise({ redirectTo: '/test' });

    console.log('wtf');

    $stateProvider

      // route #/

      .state('browse', {
        url: '/',
        controller: function($scope, $state, $stateParams) {
          $scope.vm = {
            showModal: false
          };
        }
      })

      // route #/movie/:movie

      .state('browse.movie', {
        url: '/movie/:movie',
        controller: function($scope, $state, $stateParams) {
          $scope.vm.showModal = true;
          $scope.vm.modalView = 'movie';
          $scope.vm.movieTitle = $stateParams.movie;
        }
      })

      // route #/movie/:movie/rent

      .state('browse.movie.rent', {
        url: '/rent',
        controller: function($scope, $state, $stateParams) {
          $scope.vm.modalView = 'rent';
        }
      })

      // route #/celebrity/:name

      .state('browse.celebrity', {
        url: '/celebrity/:name',
        controller: function($scope, $state, $stateParams) {
          $scope.vm.showModal = true;
          $scope.vm.modalView = 'celebrity';
          $scope.vm.celebrityName = $stateParams.name;
        }
      });

  })

  .controller('RouteController', function($scope, $location) {

  });
