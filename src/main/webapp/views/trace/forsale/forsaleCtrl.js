define(['app', 'window', 'jquery','WdatePicker', 'chart', 'filters', 'forsaleServices'], function (app, w, $) {
	//console.dir(app);
	app.register.controller('forsaleController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state','$stateParams', '$interval', '$timeout', 'util', 'echarts', 'forsaleServices', function ($location, $modal, $filter, $scope, $rootScope, $state,$stateParams, $interval, $timeout, util, echarts, forsaleServices) {

		$scope.initializeController = function () {
            
			$scope.jobGUID = $stateParams.jobGUID;
			$scope.CurrentPage=1;
			$scope.PageSize=10;
			
			$scope.getDataA();
            
            $scope.getDataB();
            //跟踪客户列表
            $scope.getCstList();
		}
        $scope.backHis = function() {
            $state.go("app.traceMain");
        }
        //获取跟踪客户列表数据
        $scope.getCstList=function() {
        	var _param={
    			currentPage: $scope.CurrentPage,
    			PageSize: $scope.PageSize,
    			jobGuid:$scope.jobGUID
        	}
            forsaleServices.getCstList(_param,function(response){
            	//客户跟踪列表
                $scope.cstList=response.data.list;
                $scope.TotalRows = response.data.page.recordCount;
            },function() {})
        };
        $scope.pageChanged=function(){
        	$scope.getCstList();
        }
        //获取图表数据
        $scope.getDataB=function() {
            forsaleServices.getDataB({"jobGuid":$scope.jobGUID},function(response){
                
                
                //成交面积区段分析图表
                $scope.dealAreaData=setArea(response.data.tradeArea);
                $scope.dealArea = echarts.dealSum($scope.dealAreaData);
                function setArea(data){
                	var obj;
                	obj={
            			"yAxisData":data.xData,
            			"seriesData":[data.orderArea,data.contractArea]
                	}
                	return obj;
                }
                
                //成交金额区段分析图表
                $scope.dealSumData=setAmt(response.data.tradeAmt);               
                $scope.dealSum = echarts.dealSum($scope.dealSumData);
                function setAmt(data){
                	var obj;
                	obj={
            			"yAxisData":data.xData,
            			"seriesData":[data.orderData,data.contractData]
                	}
                	return obj;
                }
               
            },function() {})
        };

        //页面数据
        $scope.getDataA = function(){
            forsaleServices.getDataA({"jobGuid":$scope.jobGUID},function(response){
                $scope.job=response.data.expJob;
                $scope.followCnt=response.data.followJob;
                $scope.percent=response.data.percent;
                //客流量到访
                $scope.visitTrendData={
            		"xAxisData": response.data.visitTrend.xData,
                    "seriesData": response.data.visitTrend.yData,
                    "seriesName": "到访次数"
                };
                $scope.visitTrend = echarts.visitTrend($scope.visitTrendData);
                //到访次数分布
                $scope.visitNumData={
            		"legendData": ["0-1次", "2-5次", "6-10次", "10次以上"],
            		"data":[{"value":response.data.visitTimes.visit1,"name": "0-1次"},
            		        {"value":response.data.visitTimes.visit2,"name": "2-5次"},
            		        {"value":response.data.visitTimes.visit3,"name": "6-10次"},
            		        {"value":response.data.visitTimes.visit4,"name": "10次以上"}]
                }
                $scope.visitNum = echarts.visitNum($scope.visitNumData);
                //客户转化率分析图表
                $scope.cstPercent=response.data.cstConversion;
                $scope.customerConversionData=setCstConversion(response.data.cstConversion);
                $scope.customerConversion = echarts.customerConversion($scope.customerConversionData);
                
               function setCstConversion(data){
                	var obj;
                	obj={
            			"seriesData":[{"value":data.contract,"name":"签约"},
            			              {"value":data.order,"name":"认购"},
            			              {"value":data.visit,"name":"到访"},
            			              {"value":data.cstTotal,"name":"总量"}],
            			 "max":data.cstTotal
                	};
                	return obj;
                }
            },function(){});
        }
        
        $scope.doExport=function(){
        	var _param={
    			currentPage: $scope.CurrentPage,
    			PageSize: $scope.PageSize,
    			jobGuid:$scope.jobGUID
        	}
        	forsaleServices.download(_param,function(){},function(res){
            	toastr.warning(res.header.message, '提示', {
					closeButton: true,
					timeOut: 3000
				});
    		});
        }
	}]);
});

