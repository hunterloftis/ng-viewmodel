angular
  .module('dtv.demo.routes', ['sdw.viewmodel'])

  .config(function(viewmodelProvider) {

    console.log('viewmodelProvider');

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

      .state('browse.test', {
        route: '/a/:aid/b/:bid/finally',
        action: function(vm, params) {

        }
      })

      // route #/movie/:movie/rent

      .state('browse.movie.rent', {
        route: '/rent',
        action: function(vm, params) {
          modalView = 'rent';
        }
      })

      // route #/celebrity/:name

      .state('browse.celebrity', {
        route: '/celebrity/:name',
        action: function(vm, params) {
          vm.showModal = true;
          vm.modalView = 'celebrity';
          vm.celebrityName = $stateParams.name;
        }
      });

  })

  .controller('RouteController', function($scope, $location) {
    $scope.test = 'Test Title';
  });
