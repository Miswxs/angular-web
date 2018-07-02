define(['app', 'window', 'jquery','WdatePicker', 'chart', 'filters', 'forbusinessServices'], function (app, w, $) {
	//console.dir(app);
	app.register.controller('forbusinessController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', '$interval', '$timeout', 'util', 'echarts','$stateParams', 'forbusinessServices', function ($location, $modal, $filter, $scope, $rootScope, $state, $interval, $timeout, util, echarts,$stateParams, forbusinessServices) {

		$scope.initializeController = function () {
			
			$scope.jobGUID = $stateParams.jobGUID;
			$scope.currentPage = 1;
			$scope.pageSize = 10;
			
			$scope.getBusinessTrackDetail();
			$scope.getBusinessTrackAnalysis();
			$scope.getCstList();
            
		}
		
		$scope.backHis = function() {
            $state.go("app.traceMain");
        }
		
		//商业活动跟踪详情
		$scope.getBusinessTrackDetail = function () {
			forbusinessServices.getBusinessTrackDetail({jobGuid:$scope.jobGUID},function(response){
				$scope.expJob = response.data.expJob;
				$scope.followJob = response.data.followJob;
				$scope.percent = response.data.percent;
			},function(response){
				
			});
        };
    	
        //商业活动跟踪效果分析
        $scope.getBusinessTrackAnalysis = function () {
        	forbusinessServices.getBusinessTrackAnalysis({jobGuid:$scope.jobGUID},function(response){
        		//客流量到访
                $scope.visitTrendData={
            		"xAxisData": response.data.visitTrend.xData,
                    "seriesData": response.data.visitTrend.yData,
                    "seriesName": "到访人数"
                };
                $scope.visitTrend = echarts.visitTrend($scope.visitTrendData);
                
                //日消费额与平均单价
				$scope.dayConsumerData={"category":response.data.category,
	            		"line":{
	            			"seriesName":"平均单价",
	            			"name":"平均客单价/元",
	            			"seriesData":response.data.avgData
	            		},
	            		"bar":{
	            			"seriesName":"消费额",
	            			"name":"消费额/万元",
	            			"seriesData":response.data.consumeData
	            		}
	            	};
                $scope.dayConsumer = echarts.mixBarAndSpline($scope.dayConsumerData);
                
                //消费子业态
                $scope.childFormat={
                        "dataY": response.data.types,
                        "data":response.data.typeConsumeCnt
                };
                $scope.maxType = response.data.types.length > 0?response.data.types[response.data.types.length-1]:"";
                $scope.childFormatData = echarts.customerChildFormat($scope.childFormat);
                
                //消费品牌
                $scope.consumerBrandData={
                        "dataY": response.data.brands,
                        "data":response.data.brandConsumeCnt
                    };
                
                $scope.maxBrand = response.data.brands.length > 0?response.data.brands[response.data.brands.length-1]:"";
				$scope.consumerBrand = echarts.customerChildFormat($scope.consumerBrandData);
                
			},function(response){
				
			});
        };
    	
        //跟踪客户列表
        $scope.getCstList = function () {
        	var info = {jobGuid:$scope.jobGUID,currentPage:$scope.currentPage,PageSize:$scope.pageSize};
        	forbusinessServices.getCstList(info,function(response){
        		//客户跟踪列表
                $scope.cstList=response.data.list;
                $scope.TotalRows = response.data.page.recordCount;
			},function(response){
				
			});
        };
        
        $scope.doExport=function(){
        	var _param={
    			currentPage: $scope.currentPage,
    			PageSize: $scope.pageSize,
    			jobGuid:$scope.jobGUID,
    			cod_value2:2
        	}
        	forbusinessServices.download(_param,function(){},function(res){
            	toastr.warning(res.header.message, '提示', {
					closeButton: true,
					timeOut: 3000
				});
    		});
        }
        
        //切换页
        $scope.pageChanged = function(){
        	$scope.getCstList();
        }
	}]);
});

