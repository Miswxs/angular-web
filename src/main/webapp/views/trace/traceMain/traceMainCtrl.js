define(['app', 'window', 'jquery','WdatePicker', 'chart', 'filters', 'traceMainServices','toastr'], function (app, w, $) {
	//console.dir(app);
	app.register.controller('traceMainController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', '$interval', '$timeout', 'util', 'echarts', 'traceMainServices','toastr', function ($location, $modal, $filter, $scope, $rootScope, $state, $interval, $timeout, util, echarts, traceMainServices,toastr) {

		$scope.initializeController = function () {
            //全局对象
            $scope.myTrace = {};
            $scope.CurrentPage=1;
            $scope.PageSize=20;
			$scope.getLabelSelect();
            $scope.getTableData();
		}

        //点击查询
		$scope.search = function(obj){
			//进入查询明细
			$scope.getTableData(obj);
		};
        
	    //获取查询明细
		$scope.getTableData = function (search) {
			var searchInfo = $scope.createSearchInfo(search);
			var _param={
				startDate:searchInfo.startDate,
				endDate:searchInfo.endDate,
				/*jobLabType:searchInfo.jobLabType,
				jobLabGuid:searchInfo.jobLabGuid,*/
				jobLabName:searchInfo.jobLab,
				jobFor:searchInfo.jobFor,
				jobProcessStatus:searchInfo.jobProcessStatus,					
				jobTrackType:searchInfo.jobTrackType,					
				jobTrack:searchInfo.jobTrack,					
				searchTxt:searchInfo.searchTxt,
				currentPage: searchInfo.currentPage,
				PageSize: searchInfo.PageSize
			};
            traceMainServices.getTableData(_param,function(response){
                $scope.list = response.data.list;
				$scope.TotalRows = response.data.page.recordCount;
                //$scope.PageSize = response.PageSize;
            },function(){})
		}
		
		$scope.exportList=function(search){
			var searchInfo = $scope.createSearchInfo(search);
			var _param={
				startDate:searchInfo.startDate,
				endDate:searchInfo.endDate,
				/*jobLabType:searchInfo.jobLabType,
				jobLabGuid:searchInfo.jobLabGuid,*/
				jobLabName:searchInfo.jobLab,
				jobFor:searchInfo.jobFor,
				jobProcessStatus:searchInfo.jobProcessStatus,					
				jobTrackType:searchInfo.jobTrackType,					
				jobTrack:searchInfo.jobTrack,					
				searchTxt:searchInfo.searchTxt
			};
			traceMainServices.exportList(_param,function(response){
				toastr.warning(response.header.message, '提示', {
					closeButton: true,
					timeOut: 3000
				});
			},function(){})
		}
		//生成传给后台的查询对象
		$scope.createSearchInfo = function (search) {
			var searchInfo = {};
			if (search != null){
				searchInfo=search;
				if(search.jobLabType==null){
					searchInfo.jobLab=null;
				}
			}
			searchInfo.currentPage = $scope.CurrentPage;
			searchInfo.PageSize=$scope.PageSize;			
			return searchInfo;
		}
        
        //查询明细页码切换
		$scope.pageChanged = function () {
			$scope.CurrentPage=1;
			$scope.getTableData($scope.myTrace);
		} 
        //得到数据
		$scope.getLabelSelect = function () {
			$scope.approvalList=traceMainServices.approvalList;
			$scope.followType=traceMainServices.followType;
			$scope.followStatus=traceMainServices.followStatus;
			$scope.expUserFor=traceMainServices.expUserFor;	
			$scope.labGroupList=traceMainServices.labGroupList;
			
            traceMainServices.getLabelSelect({}, function (response, status) {               
               $scope.standardLabs=response.data.standardLabs;
               $scope.businessLabs=response.data.businessLabs;
               $scope.extractLabels=setLabels($scope.labGroupList,$scope.standardLabs,$scope.businessLabs);
               function setLabels(labGroupList,standardLabs,businessLabs){
            	   var obj={};
            	   angular.forEach(labGroupList, function(v, k) {
            		   if(v.id=="1"){
            			   v.child=standardLabs;
            		   }
            		   if(v.id=="2"){
            			   v.child=businessLabs;
            		   }
            	   });
            	   return labGroupList;
               }
              
            }, function (response, status) {})
        }
        //修改
        $scope.doModify = function(item){
            //do something
            $state.go("app.clientSearch",{"jobGUID": item.jobGuid});
        }
        //删除记录
        $scope.doDelete = function(item){
        	traceMainServices.deleteExpJob({"jobId":item.jobId},function(res){
        		$scope.getTableData();
        		toastr.success(res.header.message, '提示', {closeButton: true,timeOut: 5000});
        	},function(){});
        }
        //导出
        $scope.doExport = function(item){
        	//console.log(item);
            //当前导出时间比审批通过时间超过7天
    		var now=new Date();
        	var old=new Date(item.jobModifytime);
        	var days=Math.floor((now.getTime()-old.getTime())/(24*3600*1000));
        	if(days>7){
        		new w.Window().alert({
                    title:"提示",
                    content:"数据已过期，请重新申请！",
                    width:300,
                    height:180,
                    hasCloseBtn:true,
                    autoClose:true,
                    setTime:1000*5
                })
                return;
        	}else{
        		traceMainServices.expData(item,function(){},function(res){
                	toastr.warning(res.header.message, '提示', {
    					closeButton: true,
    					timeOut: 3000
    				});
        		});
        	}
        	
        }
        //跟踪
        $scope.doTrace = function(item){
            if(item.jobTrackTypename == "地产营销"){
                $state.go("app.trace.forsale",{"jobGUID": item.jobGuid});
            }else{
                $state.go("app.trace.forbusiness",{"jobGUID": item.jobGuid});
            }
            
        }
	}]);
});

