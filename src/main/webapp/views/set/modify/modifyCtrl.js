define(['app', 'window', 'jquery', 'modifyServices'], function (app, w, $) {
    //console.dir(app);
	app.register.controller('modifyController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', 'modifyServices', function ($location, $modal, $filter, $scope, $rootScope, $state, modifyServices) {


		$scope.initializeController = function () {
			$scope.obj = [];
		}

		$scope.doModify = function(){
            modifyServices.domodify($scope.obj,function(response){
                //do something
                new w.Window().alert({
                    title:"提示",
                    content:"密码修改成功！",
                    hasCloseBtn:true,
                    width:300,
                    height:200
                })
            },function(){})
        }
        //返回首页
        $scope.backHis = function(){
            $state.go("app.client.clientShow");
        }
		

		


	}]);
});
