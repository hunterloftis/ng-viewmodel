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

  .controller('RouteController', function($scope, viewmodel) {

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
      window.location.hash = '';
    };

  });
