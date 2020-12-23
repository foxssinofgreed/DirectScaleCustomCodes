'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  var targetUrl = 'https://dsapi.directscale.com/v1/customers/208/orders';
  fetch(proxyUrl + targetUrl, {
    "method": "GET",
    "headers": {
      "Ocp-Apim-Subscription-Key": "98b198fed48d4aceb8d362c2c931572d",
      "Access-Control-Allow-Origin": "*"
    }
  })
      .then(blob => blob.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(err => {
        console.error(err);
        return err;
      });

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);