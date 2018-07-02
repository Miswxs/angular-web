define(['app', 'window', 'jquery', 'WdatePicker', 'chart', 'filters', 'clientPortraitServices'], function(app, w, $) {
    //console.dir(app);
    app.register.controller('ClientPortraitController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', '$interval', '$timeout', 'util', 'echarts', 'clientPortraitServices', function($location, $modal, $filter, $scope, $rootScope, $state, $interval, $timeout, util, echarts, clientPortraitServices) {

        $scope.initializeController = function() {
            //默认为个人用户查找
            $scope.clientType = 1;
            $scope.clientPlace = "请输入证件号或手机号码精确查找";
        }
        //debugger;
        $scope.getClientList = function(keyword) {
        	var searchTxt=typeof(keyword)==undefined?"":keyword;
                clientPortraitServices.getClientList({"searchTxt":searchTxt,"cstType":"2"}, function(response) {
                    $scope.ListData = response.data;
                }, function(response, status) {})
            }
            //查找类型选择
        $scope.selectRadio = function(i) {
                $scope.clientType = i;
                if (i == 1) {
                    //隐藏客户列表
                    $scope.listShow = false;
                    $scope.clientPlace = "请输入证件号或手机号码精确查找";
                } else {
                    $scope.clientPlace = "请输入客户名称（至少两个字符）模糊检索";
                }
            }
            //查询画像
        $scope.searchDetail = function(keyword) {
            if ($scope.clientType == 1) {
	    	if(keyword !== ''){
    				var searchTxt = $.trim(keyword);
    				if(!(/^(\d{18,18}|\d{15,15}|\d{17,17}|\d{17,17}[0-9a-zA-Z])$/.test(searchTxt)) && !(/^\d{11}$/.test(searchTxt))){
    					//如果不能匹配身份证号码跟手机号码，则提示输入正确的身份证号或手机号码
    					new w.Window().alert({
    		    			title: "错误提示",
    		    			width: 300,
    		    			height: 160,
    		    			content: '你好，请输入正确的身份证号或手机号码',
    		    			hasCloseBtn: true
    		    		});
    		    		return false;
    				}
    				$scope.getCstByCardId(searchTxt);
                    
    			}else{
    				new w.Window().alert({
    	    			title: "错误提示",
    	    			width: 300,
    	    			height: 160,
    	    			content: '你好，请输入正确的身份证号或手机号码',
    	    			hasCloseBtn: true
    	    		});
    	    		return false;
    			}
                //$state.go("app.client.portrait.personPortrait");
            } else {
            	var searchTxt = $.trim(keyword);
            	if(searchTxt.length<2){
	            	new w.Window().alert({
						title: "提示",
						width: 300,
						height: 160,
						content: "请至少输入两个字符查询",
						hasCloseBtn: true
					});
	            	return;
            	}
            	$scope.getClientList(keyword);
                $scope.listShow = true;
            }
        }
        $scope.getCstByCardId=function(searchTxt){
        	//查询个人客户
			clientPortraitServices.getClient({"searchTxt": searchTxt,"cstType":$scope.clientType}, 
				function(response, status){
					if(response.header.code == -1){
						//这里只模拟查找到了有这个客户，如果查找到没有这个客户，则弹出提示没有找到对应的客户，请重新输入关键词
						new w.Window().alert({
							title: "错误提示",
							width: 300,
							height: 160,
							content: response.header.message,
							hasCloseBtn: true
						});
					}else{
						var cstGUID=response.data;
						$state.go("app.client.portrait.personPortrait",{"cstGUID": cstGUID});
					}
				}, function(response, status){
					toastr.error('获取数据失败', '提示', {
						closeButton: true,
						timeOut: 5000
					});
				});
        }
        $scope.listDetail = function(cstGUID) {	          
            $state.go("app.client.portrait.companyPortrait",{"cstGUID": cstGUID});
        };

    }]);
});