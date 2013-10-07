angular
  .module('examples.simple', ['sdw.viewmodel'])
  .config(function(viewmodelProvider) {

    viewmodelProvider

      .fallback('default')

      .state('default', {
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
      })

      .param('alt', function(vm, param) {
        vm.useAltStyle = (param === 'true');
        console.log('vm:', vm);
      });
  });
