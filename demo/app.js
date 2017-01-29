var app = angular.module('app', ['ng-scroll-bar']);

app.controller('MainCtrl', function ($scope, $q, $timeout) {
  this.items = [];
  this.addItem = function () {
    this.items.push({ text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' });
  }
  for(var i = 0; i < 10; i++){
    this.addItem();
  }
});
