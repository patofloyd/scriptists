var myApp = angular.module('myApp');
 
 myApp.controller('DetectionsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
 	console.log('DetectionsController loaded...');
 
 
 //Get all detections
 	$scope.getDetections = function(){
 		$http.get('/detection').success(function(response){
 			$scope.detections = response;
 		});
 	}

 	setInterval(function(){
 		$scope.getDetections();
 		console.log($scope.detection);
 	},1000);

 //Get detection by id
 	$scope.getDetection = function(){
 		var id = $routeParams.id;
 		$http.get('/detections/'+id).success(function(response){
			$scope.detection = response;
 		});
 	}
 //Remove detection	
 	$scope.removeDetections = function(id){
 		$http.delete('/detections/'+id).success(function(response){
 			window.location.href='/detections';
 		});
 	}
 //Add detections
 	$scope.addDetections = function(){
 		console.log($scope.detection);
 		$http.post('/detections/', $scope.detection).success(function(response){
 			window.location.href='/detections';
 		});
 	}
 //Update detection
 	$scope.updateDetection = function(){
 		var id = $routeParams.id;
 		$http.put('detections/'+id, $scope.detection).success(function(response){
			window.location.href='#/detections';
		});
 	}
 }]); 