# sdw-viewmodel

A View Model that watches routes and binds them to cascading states in your app.

## Example

View

```html
<body ng-controller='DemoController'>
  <section sdw-viewmodel='vm'>
    <div class='overlay' ng-show='vm.showModal'>
      <article ng-show='vm.article === "first"'>
        <h1>First</h1>
        <a href='#/article/{{ vm.article }}/buy'>Buy</a>
        <p ng-show='vm.showPrice'>$10.00</p>
      </article>
      <article ng-show='vm.article === "second"'>
        <h2>Second</h2>
        <a href='#/article/{{ vm.article }}/buy'>Buy</a>
        <p ng-show='vm.showPrice'>$14.00</p>
      </article>
    </div>
  </section>
</body>
```

Module

```js
angular
  .module('viewmodel.demo', ['sdw.viewmodel'])
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
  })
  .controller('DemoController', function($scope, $location, viewmodel) {

  });
```

