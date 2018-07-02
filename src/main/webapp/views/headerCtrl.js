define(['app', 'window', 'jquery', 'WdatePicker'], function (app, w, $) {
	//console.dir(app);
	app.register.controller('directCtrl', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', '$interval', '$timeout', 'util', function ($location, $modal, $filter, $scope, $rootScope, $state, $interval, $timeout, util) {
		
		//修改密码
		
		var changePasswordCtrl = function($scope, $modalInstance) {
			  $scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
	
		  };
		
		$scope.changePassword = function(){
		  var modalInstance = $modal.open({
		        templateUrl: 'changePassword.html',
		        controller: changePasswordCtrl,
		        windowClass: 'app-modal-window',
		        size: "sm",
		        resolve: {

		        }
		    });
        };
     
  }]);
});

