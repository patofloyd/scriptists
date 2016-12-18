var myApp = angular.module('myApp');

myApp.controller('DetectionsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
	console.log('DetectionsController loaded...');


//Get all detections
	$scope.getDetections = function(){
		$http.get('localhost:3000/detection').success(function(response){
				console.log(response)
			$scope.detections = response;
		});
	}
//Get detection by id
	$scope.getDetections = function(){
		var id = $routeParams.id;
		$http.get('/detection/'+id).success(function(response){
			$scope.detections = response;
		});
	}
//Remove detection	
	$scope.removeDetections = function(id){
		$http.delete('/detection/'+id).success(function(response){
			window.location.href='/detection';
		});
	}
//Add detections
	$scope.addDetections = function(){
		console.log($scope.detections);
		$http.post('/detection/', $scope.detection).success(function(response){
			window.location.href='/detections';
		});
	}
//Update detection
	$scope.updateDetection = function(){
		var id = $routeParams.id;
		$http.put('detection/'+id, $scope.detection).success(function(response){
			window.location.href='#/detection';
		});
	}
	$scope.getDetections();
}]);