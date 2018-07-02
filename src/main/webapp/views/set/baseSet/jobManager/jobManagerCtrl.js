define(['app','window', 'jquery','jobManagerService'], function (app, w, $)  {
    //console.dir(app);
    app.register.controller('jobManagerController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state','jobManagerService', function ($location, $modal, $filter, $scope, $rootScope, $state,jobManagerService) {
      
      $scope.initializeController = function () {
		  $scope.detailsLoaded = false;//初始时候不显示搜索明细列表
		  
		  $scope.PageSize = 10;//默认显示一页页码数
		  $scope.currentPage = 1;
		  $scope.TotalRows = 0;
		  
		  //获取界面数据
			$scope.getJobList();
      }
	  
	  //点击查询
		$scope.search = function(search){
			$scope.keyword = search;
			$scope.getJobList();
		};
        
	  //获取查询明细
		$scope.getJobList = function () {
			var searchInfo = {"page":$scope.currentPage,"pageSize":$scope.PageSize,"searchTxt":$scope.keyword};
			jobManagerService.getJobList(searchInfo, function(response){
				//填充内容
				$scope.list = response.data.list;
				$scope.TotalRows = response.data.page.TotalRows;
				$scope.detailsLoaded = true;

			}, function(response){
//				toastr.warning('获取数据失败', '提示', {
//					closeButton: true,
//					timeOut: 5000
//				});
			})
		}
     	
		$scope.jobStop = function (job){
			jobManagerService.jobStop({jobguid:job.jobguid},function(response){
//				toastr.success('修改成功', '提示', {
//					closeButton: true,
//					timeOut: 2000
//				});
				$scope.getJobList();
			},function(response){
				
			});
		}
		
		$scope.jobStart = function (job){
			jobManagerService.jobStart({jobguid:job.jobguid},function(response){
//				toastr.success('修改成功', '提示', {
//					closeButton: true,
//					timeOut: 2000
//				});
				$scope.getJobList();
			},function(response){
				
			});
		}
		
		//修改弹窗
		var updateJobCtrl = function($scope, $modalInstance,job) {
			$scope.curJob = clone1(job);
			
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
			
			$scope.modifySave = function(){
				$modalInstance.close({jobguid:$scope.curJob.jobguid,jobexep:$scope.curJob.jobexep});
			};
			
			$scope.help = function(){
				$scope.helpshow = !$scope.helpshow;
			}
		};
		
		$scope.updateJob = function(job){
			var modalInstance = $modal.open({
					templateUrl: 'updateJob.html',
					controller: updateJobCtrl,
					windowClass: 'app-modal-window',
					size: "",
					resolve: {
						job: function () {
		                    return job;
		                }
					}
				});
			modalInstance.result.then(function(data){
				jobManagerService.updateJob(data,function(response){
					if(response.header.code==-1){
//						toastr.warning(response.header.messge, '提示', {
//							closeButton: true,
//							timeOut: 5000
//						});
					}else{
//						toastr.success("修改成功", '提示', {
//							closeButton: true,
//							timeOut: 2000
//						});
						$scope.getJobList();
					}
				},function(response){
//					toastr.warning('修改失败', '提示', {
//						closeButton: true,
//						timeOut: 5000
//					});
				});
			});

        };
        
      //修改弹窗
		var addJobCtrl = function($scope, $modalInstance) {
			$scope.curJob = {};
			$scope.curJob.jobstatus = 2;
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
			
			$scope.modifySave = function(){
				$modalInstance.close($scope.curJob);
			};
			
			$scope.help = function(){
				$scope.helpshow = !$scope.helpshow;
			}
		};
		
		$scope.addJob = function(){
			var modalInstance = $modal.open({
					templateUrl: 'addJob.html',
					controller: addJobCtrl,
					windowClass: 'app-modal-window',
					size: ""
				});
			modalInstance.result.then(function(data){
				jobManagerService.addJob(data,function(response){
					if(response.header.code==-1){
//						toastr.warning(response.header.messge, '提示', {
//							closeButton: true,
//							timeOut: 5000
//						});
					}else{
//						toastr.success("修改成功", '提示', {
//							closeButton: true,
//							timeOut: 2000
//						});
						$scope.getJobList();
					}
				},function(response){
//					toastr.warning('修改失败', '提示', {
//						closeButton: true,
//						timeOut: 5000
//					});
				});
			});
			
        };
        
        //查询明细页码切换
		$scope.pageChanged = function () {
			$scope.currentPage = 1;
			$scope.getJobList();
		}
  }]);
});

function clone1(obj1)
{
   function F() {} ;
   F.prototype = obj1 ;
   var f = new F() ;
   for(var key in obj1)
   {
     if(typeof obj1[key] =="object")
     {
         f[key] = clone1(obj1[key])
     }
  }
return f ;
}
