define(['app', 'window', 'jquery', 'signinServices'], function (app, w, $) {
    //console.dir(app);
	app.register.controller('SigninController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', 'signinServices', function ($location, $modal, $filter, $scope, $rootScope, $state, signinServices) {

		$scope.initializeController = function() {
			// $rootScope.layout.hasSubs = false;
			$scope.loginBtnText = "登录";
			$scope.username = "";
			$scope.password = "";
			$scope.code = "";
		}

		$scope.login = function() {
			// 跳转之前验证是否正确
			$state.go('app.clientShow');
		}

		$scope.forgetPassword = function() {
			new w.Window().alert({
				title : "忘记密码",
				width : 480,
				height : 160,
				content : '您好，请联系管理员重置密码',
				hasCloseBtn : true
			});
		}

		$scope.signin = function() {
			if ($scope.logining) {
				return;
			}
			
			if(!$scope.username || !$scope.password){
				new w.Window().alert({
					title:"错误提示",
					content: "用户名或密码不能为空",
					hasCloseBtn: true,
					width: 300,
					height:150
				})
				return;
			}
			
			
			
			$scope.logining = true;// 避免重复提交
			$scope.loginBtnText = "登录中";
			
			var info = {
				username : $scope.username,
				password : $scope.password,
				code : $scope.code
			};
			
			signinServices.login(info, function(response, status) {

				$scope.logining = false;
				$scope.loginBtnText = "登录";
				
				//$rootScope.grableSessionid=$("#grableSessionid").val();
				//alert($rootScope.grableSessionid);
				
				// 登录成功就跳转到仪表盘第一个子栏目
				if (response.header.code == "0") {
					// 设置导航同用户名后跳转
//					$rootScope.menuItems = response.data.menu;
					$rootScope.modules = response.data.modules; //有权限的模块
					$rootScope.modulesCode = response.data.modulesCode; //有权限的模块名称
					$rootScope.allModules = response.data.allModules; //所有模块
					$rootScope.userName = response.data.user.userName;
					$rootScope.orgId = response.data.user.orgId;
					$rootScope.userType = response.data.user.userType;
					$rootScope.userId = response.data.user.userId;
					$rootScope.idataToken = response.data.idataToken;
					
					
					// 登录成功就跳转到仪表盘
					var dashboardRoute = $rootScope.modules.children[0].name;
					$rootScope.noShowHome = false;
					angular.forEach($rootScope.modules.children, function(
							module, index) {
						
						if (module.name === "app.clientShow") {
							dashboardRoute = "app.clientShow";
							$state.go(dashboardRoute);
						}
					})
					$state.go(dashboardRoute);
					// $state.go("app.client.show");
				} else {
					//changeCode();
					new w.Window().alert({
						title:"错误提示",
						content: response.header.message,
						hasCloseBtn: true,
						width: 300,
						height:150
					})
				}

			}, function(response, status) {
				/*toastr.warning('获取数据失败', '提示', {
					closeButton : true,
					timeOut : 5000
				});*/
				$scope.logining = false;
				$scope.loginBtnText = "登录";
			});
		}

	}]);
});
