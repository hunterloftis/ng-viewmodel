# sdw-viewmodel

A View Model that watches routes and binds them to cascading states in your app.

## Example

View

```html
<a href='#/article/first'>First article</a>,
<a href='#/article/second'>Second article</a>

<section sdw-viewmodel='vm'>
  <div class='modal' ng-class='{ active: vm.showModal }'>

    <ng-switch on='vm.article'>
      <article ng-switch-when='first'>
        <h1>First</h1>
        <a href='#/article/{{ vm.article }}/buy'>Buy</a>
        <p ng-show='vm.showPrice'>$10.00</p>
      </article>

      <article ng-switch-when='second'>
        <h2>Second</h2>
        <a href='#/article/{{ vm.article }}/buy'>Buy</a>
        <p ng-show='vm.showPrice'>$14.00</p>
      </article>
    </ng-switch>

  </div>
</section>
```

Module

```js
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
```

