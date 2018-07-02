define(['app','window', 'jquery','toastr','operLogService','WdatePicker'], function (app, w, $)  {
    //console.dir(app);
    app.register.controller('operLogController', ['$location', '$modal','$log', '$filter', '$scope', '$rootScope', '$state','operLogService', 'toastr', function ($location, $modal, $log, $filter, $scope, $rootScope, $state,operLogService, toastr) {
      
      $scope.initializeController = function () {
    	  
		  $scope.detailsLoaded = false;//初始时候不显示搜索明细列表
		  $scope.PageSize = 10;//默认显示一页页码数
		  $scope.currentPage = 1;
		  $scope.TotalRows = 0;
		  //获取界面数据
          $scope.getOperLogList();
      };
      
      //点击导出
		$scope.doExport = function(){
			var searchInfo = {};
			searchInfo.startTime = $scope.startDate;
			searchInfo.endTime = $scope.endDate;
			searchInfo.searchName = $scope.keyword;
			
			operLogService.exportDatas(searchInfo);
		};
		
	  //点击查询
		$scope.search = function(){
			console.log("1");
			//进入查询明细
			$scope.currentPage = 1;
			$scope.getOperLogList();
		};
		
		//获取列表
		$scope.getOperLogList = function () {
			
			var searchInfo = $scope.createSearchInfo();
			operLogService.getOperLogList(searchInfo, function(response){
				//填充内容
				$scope.list = response.data.dataList;
				$scope.TotalRows = response.data.total;
				$scope.PageSize = response.data.PageSize;

			}, function(response, status){
				toastr.warning('获取数据失败', '提示', {
      			  	closeButton: true,
      			  	timeOut: 5000
      		  	});
			});
		};
		
		//生成传给后台的查询对象
		$scope.createSearchInfo = function () {
			var searchInfo = {};
			
			searchInfo.currentPage = $scope.currentPage;
			searchInfo.PageSize = $scope.PageSize;
			searchInfo.startTime = $scope.startDate;
			searchInfo.endTime = $scope.endDate;
			searchInfo.searchName = $scope.keyword;
			return searchInfo;
		};
		
        //查询明细页码切换
		$scope.pageChanged = function () {
			$scope.getOperLogList();
		};
  }]);
});

