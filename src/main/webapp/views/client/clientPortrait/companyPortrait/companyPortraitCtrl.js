define(['app', 'window', 'jquery', 'WdatePicker', 'chart', 'filters', 'companyPortraitServices'], function(app, w, $) {
    //console.dir(app);
    app.register.controller('companyPortraitController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state','$stateParams', '$interval', '$timeout', 'util', 'echarts', 'companyPortraitServices', function($location, $modal, $filter, $scope, $rootScope, $state, $stateParams,$interval, $timeout, util, echarts, companyPortraitServices) {

        $scope.initializeController = function() {
        	$scope.clientType="2";
		    $scope.cstGUID = $stateParams.cstGUID;
		    //业态列表
			$scope.sourceBizList=companyPortraitServices.sourceBizList;
			$scope.sourceBiz=$scope.sourceBizList[0];
		  //得到数据
            $scope.getClientDetail_1($scope.getClientDetailsSuccess_1, $scope.getClientDetailsError);
			
			//$scope.getClientDetail_2($scope.getClientDetailsSuccess_2, $scope.getClientDetailsError);
									
			$scope.getClientFollowrecoders($scope.getClientDetailsSuccess_followrecoders, $scope.getClientDetailsError);			

        }
        $scope.backHis = function() {
        	$state.go("app.client.portrait.clientPortrait");
        }
       
        $scope.getClientDetail_1 = function( successFunction, errorFunction){
        	companyPortraitServices.getClientDetail_1({'cstGUID' : $scope.cstGUID,'cstType':$scope.clientType}, successFunction, errorFunction);
		};
		$scope.getClientDetail_2 = function( successFunction, errorFunction){
			companyPortraitServices.getClientDetail_2({'cstGUID' : $scope.cstGUID,'cstType':$scope.clientType}, successFunction, errorFunction);
		};
		$scope.getClientFollowrecoders = function( successFunction, errorFunction){
			companyPortraitServices.getClientFollowrecoders({'cstGUID' : $scope.cstGUID,'cstType':$scope.clientType,'sourceBiz':$scope.sourceBiz.id}, successFunction, errorFunction);
		};
		$scope.getClientDetailsSuccess_1 = function(response){
			//基础信息
            $scope.baseInfo = response.data.customerInfo;
            $scope.baseInfo.sourceName=response.data.customerInfo.sourceName.split(",");
            $scope.tels = response.data.tels;
            //标签
            $scope.cstLabelList = response.data.cstLabelList;
            //意向
            $scope.intentions = response.data.intendProj;
			if(response.data.intendProj != null && response.data.intendProj.length > 0){
				$scope.intentionSelected = response.data.intendProj[0];
				$scope.getIntention_proj($scope.intentionSelected);
			}
			//已购
			$scope.houses = response.data.hasBuyBld;
			if(response.data.hasBuyBld != null && response.data.hasBuyBld.length > 0){
				$scope.houseSelected = response.data.hasBuyBld[0];
				$scope.getIntention_bld($scope.houseSelected);		
			}
            //交易关系
			$scope.tradeInfo=response.data.tradeInfo;
		}
		$scope.getClientDetailsSuccess_2 = function(response){
			//会员消费特征
			$scope.memberCustom=response.data.consumInfo;
			//会员信息
			$scope.vip=response.data.cstMembers;
			//家庭成员
			$scope.homeMember=response.data.cstFamily;
			//资产
			$scope.assets=response.data.cstAsset;
		}
		$scope.getClientDetailsSuccess_followrecoders = function(response){
			$scope.keyWordslist=response.data;
			angular.forEach($scope.keyWordslist, function(item, index) {
                item.selected = true;
                if(item.sourceName=='客服'){
                	item.selected = false;
                }
            });
			$scope.searchList = $scope.keyWordslist;
		}
		
		$scope.getClientDetailsError = function(response){
			new w.Window().alert({
				title: "错误提示",
				width: 300,
				height: 160,
				content: response.header.message,
				hasCloseBtn: true
			});
		};
		$scope.getIntention_proj=function(intentionSelected){
			//var  projId=typeof($scope.intentionSelected)=="undefined"?'':$scope.intentionSelected.value;
			companyPortraitServices.getIntention_proj({'cstGUID':$scope.cstGUID,'cstType':$scope.clientType,'projId':intentionSelected.value},
			function(response, status){
				$scope.intentionProjs=response.data;
			},
			function(response, status){
				toastr.warning('获取数据失败', '提示', {
					closeButton: true,
					timeOut: 5000
				});
			})
		}
		$scope.getIntention_bld=function(houseSelected){
			//var roomId=typeof($scope.houseSelected)=="undefined"?'':$scope.houseSelected.value;
			companyPortraitServices.getIntention_bld({'cstGUID':$scope.cstGUID,'cstType':$scope.clientType,'roomId':houseSelected.value},
			function(response, status){
				$scope.intentionBlds=response.data;
			},
			function(response, status){
				toastr.warning('获取数据失败', '提示', {
					closeButton: true,
					timeOut: 5000
				});
			})
		}
		
		//延迟显示Dropdown
        $scope.delayShow = function(item) {
            item.setTime = setTimeout(calback, 1000);

            function calback() {
                $scope.$apply(function() {
                    return item.dropdown = true;
                })
                clearInterval(item.setTime);
            }
        }
            //清除
        $scope.clearTimes = function(item) {
            item.dropdown = false;
            clearInterval(item.setTime);
        }
        /****客户轨迹****/
        //默认索到结果
        $scope.noSearchResult = false;

        $scope.search = function() {
            $scope.keywordSearch = $scope.keyword;

        }

        $scope.$watch("keywordSearch", function(value) {
            if (value == undefined) {
                return;
            }

            //先隐藏所有列表
            angular.forEach($scope.keyWordslist, function(item, index) {
                item.selected = false;

                /*if (item.subs && item.subs.length > 0) {
                    angular.forEach(item.subs, function(child, index) {
                        child.selected = false;
                    });
                }*/
            });

            //默认无搜索到结果
            $scope.noSearchResult = true;

            angular.forEach($scope.keyWordslist, function(item, index) {
                if ($scope.isCludeText(item, value)) {
                    item.selected = true;

                    //表示没有有搜索到结果
                    $scope.noSearchResult = false;

                    /*angular.forEach(item.subs, function(child, index) {
                        child.selected = true;
                    });*/

                } else {
                    if (item.subs && item.subs.length > 0) {
                        angular.forEach(item.subs, function(child, index) {
                            if ($scope.isCludeText(child, value)) {
                                child.selected = true;
                                item.selected = true;
                                item.toggle = true;

                                //表示有搜索到结果
                                $scope.noSearchResult = false;
                            }
                        });
                    }

                }
            });
        });

        $scope.isCludeText = function(obj, text) {
            return obj.sourceName.indexOf(text) > -1 || obj.beginDate.indexOf(text) > -1 || obj.followName.indexOf(text) > -1 || obj.projectName.indexOf(text) > -1 || obj.operName.indexOf(text) > -1 
            || obj.eventSource.indexOf(text) > -1 || obj.eventObject.indexOf(text) > -1 || obj.assetType.indexOf(text) > -1|| obj.assetName.indexOf(text) > -1||obj.closeReason.indexOf(text)>-1
        }

        $scope.result = {};
        /****客户轨迹 结束****/
        $scope.changeFormat=function (format) {
        	$scope.keyword="";
        	$scope.noSearchResult=false;
        	$scope.getClientFollowrecoders($scope.getClientDetailsSuccess_followrecoders, $scope.getClientDetailsError);			
        }
    }]);
});