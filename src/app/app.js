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
          vm.movieTitle = params.movie;
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
        route: '/celebrity/:name',
        action: function(vm, params) {
          vm.showModal = true;
          vm.modalView = 'celebrity';
          vm.celebrityName = params.name;
        }
      });

  })

  .controller('RouteController', function($scope, $location) {
    $scope.test = 'Test Title';
  });
