define(['app','window', 'jquery','desensitizationService'], function (app, w, $)  {
    //console.dir(app);
    app.register.controller('desensitizationController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state','desensitizationService', function ($location, $modal, $filter, $scope, $rootScope, $state,desensitizationService) {
      
      $scope.initializeController = function () {
		  $scope.detailsLoaded = false;//初始时候不显示搜索明细列表
		  
		  $scope.PageSize = 10;//默认显示一页页码数
		  $scope.currentPage = 1;
		  $scope.TotalRows = 0;
		  
		  $scope.editArray = [];
		  //获取界面数据
			$scope.getDetails();
      }
	  
    //点击查询
		$scope.search = function(search){
			$scope.keyword = search;
			$scope.getDetails();
		};
      
	  //获取查询明细
		$scope.getDetails = function () {
			var searchInfo = {"page":$scope.currentPage,"pageSize":$scope.PageSize,"searchTxt":$scope.keyword};
			desensitizationService.getDetails(searchInfo, function(response){
				//填充内容
				$scope.list = response.data.list;
				$scope.TotalRows = response.data.page.recordCount;
				$scope.detailsLoaded = true;

			}, function(response){
			})
		}
		
		$scope.save = function(){
			desensitizationService.SysDelicateSave($scope.editArray,function(response){
				$scope.getDetails();
				new w.Window().alert({
	                   title:"提示",
	                   width:300,
	                   height:160,
	                   content:"保存成功",
	                   hasCloseBtn:true
	                });
		    }, function(response){
		    	$scope.getDetails();
		    })
		}
   	
		$scope.choosePrimary = function(state,obj){
			var object = {};
			object.rule = obj.rule;
			object.fielddesc = obj.fielddesc;
			object.fieldid = obj.fieldid;
			object.fieldname = obj.fieldname;
			object.state = state;
			object.tablename = obj.tablename;
			
			var arr = [];
			var objExisits = false;
			if($scope.editArray.length > 0){
				for(var i=0;i<$scope.editArray.length;i++){
					if(object.fieldid == $scope.editArray[i].fieldid)
						objExisits = true;
					else
						arr.push($scope.editArray[i]);
				}
			}
			if(!objExisits)
				arr.push(object);
			$scope.editArray = arr;
//			desensitizationService.modifyDesens(object,function(response){
//              
//           }, function(response){
//          	 angular.forEach($scope.list,function(value,key){
//                   if(value.fieldid == obj.fieldid)
//                  	 if(state==1){
//                  		 value.state = 2;
//                  	 }else
//                  		 value.state = 1;
//               })
//           })
		}
		
		//修改弹窗
		var modifyDesensCtrl = function($scope, $modalInstance,des) {
			$scope.des = des;
			  $scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
           $scope.modifySave = function(obj){
              desensitizationService.modifyDesens(obj,function(response){
                 
                 $modalInstance.dismiss('cancel');
              }, function(response){
              	
              })
          }
		  };
		
		$scope.modifyProject = function(l){
			var modalInstance = $modal.open({
					templateUrl: 'modifyOrganization.html',
					controller: modifyDesensCtrl,
					windowClass: 'app-modal-window',
					size: "",
					resolve: {
                      des: function () {
		                    return l;
		                }
					}
				});
      };
     
      //查询明细页码切换
		$scope.pageChanged = function () {
			$scope.getDetails();
		}
  }]);
});

