# sdw-viewmodel

A View Model that watches routes and binds them to cascading states in your app.

Instead of assuming that all apps operate in the same way - maintaining the page-by-page paradigm of server-side apps -
view models maintain state for your views, whether that means swapping out whole view templates or just changing
the color of an element.

## Quick Start

1. Include [sdw-viewmodel.js](https://github.com/hunterloftis/ng-viewmodel/blob/master/dist/assets/sdw-viewmodel.js) in your page

2. Create a viewmodel with the `sdw-viewmodel` directive:

```js
<section sdw-viewmodel='myViewmodel'>
```

3. Inside the viewmodel, bind view states to properties on the viewmodel object:

```js
<article ng-show='myViewmodel.helloIsVisible'>Hello, {{ myViewmodel.helloName }}!</article>
```

4. In your app's config, inject the viewmodelProvider and set up your routes and the states you'd like attached to each:

```js
viewmodelProvider.state('message', {
  route: '/hello/:name',
  action: function(viewmodel, params) {
    viewmodel.helloIsVisible = true;
    viewmodel.helloName = params.name
  }
});
```

## More realistic example

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

