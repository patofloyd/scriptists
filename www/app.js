var myApp = angular.module('myApp',['ngRoute','ngResource']);


myApp.config(function($routeProvider){
	$routeProvider.when('/', {
		controller:'DetectionsController',
		templateUrl: 'views/detection.html'
	})
	.when('/detection', {
		controller:'DetectionsController',
		templateUrl: 'views/detection.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});