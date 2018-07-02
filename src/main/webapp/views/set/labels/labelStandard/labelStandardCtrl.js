define(['app', 'window', 'jquery', 'filters','labelStandardService', 'WdatePicker'],
function (app, w, $) {
    app.register.controller('labelStandardController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state',
         '$interval', '$timeout', 'labelStandardService', '$http',
    function ($location, $modal, $filter, $scope, $rootScope, $state,
            $interval, $timeout, labelStandardService, $http) {

            $scope.initializeController = function () {
                    $scope.hasGetConditions = false; // 初始化默认没有加载属性列表
                    $scope.getMyInitLabel();
                }
          
            //初始加载标签showAhead
            $scope.getMyInitLabel = function () {
                labelStandardService.getLabelStandardList({searchTxt:$scope.keyword}, function (response, status) {
                    $scope.myInitLabel = response.data;
                }, function (response, status) {
                })
            }


            //控制上线与下线显示
            $scope.showWitch = "all";
            //删除选项蒙板,上线与下线
            $scope.deleteMask = false;
            $scope.offlineLabel = true;
            $scope.onlineLabel = true;
            $scope.offLabel = function () {
                var hasOff = false;
                for(var i=0;i<$scope.myInitLabel.length;i++){
                     if($scope.myInitLabel[i].labStatus == 2){
                         hasOff = true;
                         break;
                    }
                }
                if(!hasOff){
                    new w.Window().alert({
                        title:"提示",
                        content:"当前没有标签可下线！",
                        width:300,
                        height:160,
                        hasCloseBtn:true
                    })
                }else{
                	$scope.isOffline = true;
                    $scope.showWitch = "online";
                    $scope.onlineLabel = !$scope.onlineLabel;
                    $scope.deleteMask = true;
                }
            }
            $scope.onLabel = function () {
                var hasOn = false;
                for(var i=0;i<$scope.myInitLabel.length;i++){
                     if($scope.myInitLabel[i].labStatus == 1){
                         hasOn = true;
                         break;
                    }
                }
                if(!hasOn){
                    new w.Window().alert({
                        title:"提示",
                        content:"当前没有标签可上线！",
                        width:300,
                        height:160,
                        hasCloseBtn:true
                    })
                }else{
                	$scope.isOnline = true;
                    $scope.showWitch = "offline";
                    $scope.offlineLabel = !$scope.offlineLabel;
                    $scope.deleteMask = true;
                }
            }

            //添加已选上线或者下线标签
            $scope.deleteSelected = [];
            $scope.addLabelDelete = function (comm) {
                    comm.showdelete = !comm.showdelete;
                    var bool = false;
                    if (comm.showdelete) { //添加选中
                        if ($scope.deleteSelected.length > 0) {
                            angular.forEach($scope.deleteSelected, function (value, key) {
                                if (value === comm) {
                                    bool = true;
                                }
                            });
                        }
                        if (!bool) {
                            $scope.deleteSelected.push(comm);
                        }
                    } else { //取消选中
                        angular.forEach($scope.deleteSelected, function (value, key) {
                            if (value === comm) {
                                $scope.deleteSelected.splice(key, 1);
                            }
                        })
                    }
                }
                //执行标签上线与下线
            $scope.handleLabel = function (type) {
                 if($scope.deleteSelected.length == 0){
                    new w.Window().alert({
                        title:"提示",
                        width: 300,
                        height: 160,
                        content:"请选择标签！",
                        hasCloseBtn: true
                    });
                    return;
                }
                 var labGUIDStr = "";
                 angular.forEach($scope.deleteSelected, function (value, key) {
                 	labGUIDStr += "," + value.labGuid;
                 });
                 labGUIDStr = labGUIDStr.substring(1);
                 
                 var content = "上线";
                 var labStatus = 2;
                 if (type == "online") {
                     content = "上线";
                     labStatus = 2;
                 } else {
                     content = "下线";
                     labStatus = 1;
                 }
                 labelStandardService.handleLabelService({"labGUIDStr":labGUIDStr,"labStatus":labStatus}, function (response) {
                	 $scope.isOnline = false;
                	 $scope.isOffline = false;
                	 
                     angular.forEach($scope.deleteSelected, function (value, key) {
                         for (var i = 0; i < $scope.myInitLabel.length; i++) {
                             if (value.labGUID === $scope.myInitLabel[i].labGUID) {
                                 $scope.myInitLabel[i].labStatus = labStatus;
                                 $scope.myInitLabel[i].showdelete = false;
                             }
                         }
                     });
                     $scope.deleteSelected = [];
                     $scope.getMyInitLabel();
                     //控制上线下线按钮
                     if (type == "online") {
                         $scope.offlineLabel = !$scope.offlineLabel;
                     } else {
                         $scope.onlineLabel = !$scope.onlineLabel;
                     }
//                     toastr.success('标签' + content + '成功', '提示', {
//             			  closeButton: true,
//             			  timeOut: 5000
//                   	});
                     //控制上线下线按钮与阴影
                     $scope.showWitch = "all";
                     $scope.deleteMask = false;
                 }, function (response, status) {
                 });
            }
            
//            $scope.back = function(type){
//        		$scope.isOnline = false;
//        		$scope.isOffline = false;
//                 if (type == "online") {
//                    $scope.offlineLabel = !$scope.offlineLabel;
//                } else {
//                    $scope.onlineLabel = !$scope.onlineLabel;
//                }
//                //控制上线下线按钮与阴影
//                $scope.showWitch = "all";
//                $scope.deleteMask = false;
//            }

            //查看标签详细
            $scope.seeLabelModal = function (label) {
            	var labelDetail = {};
            	labelDetail.label = label;
            	labelDetail.rules = [];
            	$scope.seeLabelModalOpen(labelDetail);
//                labelStandardService.getLabelDeatil({labGuid:label.labGuid},function(response){
//                	
//                	if(response.data != null && response.data.length > 0){
//						angular.forEach(response.data,function(value,key){
//							if(value.feaIsrule == 1){
//								var rule = {};
//								rule.id = value.feaGuid;
//								rule.ruleFrameName = value.feaTitle;
//								rule.condictions = [];
//								angular.forEach(response.data,function(val,k){ 
//									if(val.feaPguid == value.feaGuid){
//										var condiction = {};
//										condiction.object = val;
//										condiction.value = "";
//										angular.forEach(response.data,function(v,index){
//											if(v.feaPguid == val.feaGuid){
//												if(condiction.value == ""){
//													condiction.value = condiction.value + v.feaName;
//												}else
//													condiction.value = condiction.value +","+ v.feaName;
//											}
//										});
//										rule.condictions.push(condiction);
//									}
//								});
//								labelDetail.rules.push(rule);
//							}
//						});
//					}
//                    $scope.seeLabelModalOpen(labelDetail);
//                },function(response,status){})
            };
            $scope.seeLabelModalOpen = function (labelDetail) {
                var modalInstance = $modal.open({
                    templateUrl: 'seeLabelDetail.html',
                    controller: seeLabelInstanceCtrl,
                    windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                    	labelDetail: function () {
                                return labelDetail;
                            }
                    }
                });
                modalInstance.result.then(function (info) {
                	labelStandardService.changeLabelStatus(info, function (response) {
                		$scope.getMyInitLabel();
                    }, function (response, status) {
                    })
                }, function () {});
            }

            var seeLabelInstanceCtrl = function ($scope, $modalInstance, labelDetail) {
                $scope.labelDetail = labelDetail;
                
                var doChangeStatus = $scope.labelDetail.label.labStatus == 1? 2:1;
                var info = {'labGUID':labelDetail.label.labGuid, 'labStatus':doChangeStatus}
                
                $scope.onoffLabel = function () {
                    $scope.ischeck = false;
                    $modalInstance.close(info);
                };
                
                $scope.cancel = function () {
                	$scope.ischeck = true;
                    $modalInstance.dismiss('cancel');
                };

            };
            //查看标签详细结束

            
        
            /*上线在前，下线在后*/
            $scope.showAhead = function(list){
                var tempList = [],tempListOff = [];
                angular.forEach(list,function(value,key){
                    if(value.status == "上线"){
                        tempList.push(value);
                    }
                    if(value.status == "下线"){
                        tempListOff.push(value);
                    }
                        
                })
                //数组相加的方法
                return tempList.concat(tempListOff);
            }
        
            /*
			** randomWord 产生任意长度随机字母数字组合
			** min-任意长度最小位[固定位数]
			*/
			$scope.randomWord = function(min){
			    var str = "",
			        range = min,
			        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			    for(var i=0; i<range; i++){
			        pos = Math.round(Math.random() * (arr.length-1));
			        str += arr[pos];
			    }
			    return str;
			}
			/*得到当前日期
			 * 格式：yyyymmdd
			 * */
			$scope.getCurrentDate = function(){
				var d = new Date(),m = "",day = "";
				(d.getMonth()<10)?(m ="0"+(d.getMonth()+1)):(m = (d.getMonth()+1));
				(d.getDate()<10)?(day ="0"+d.getDate()):(day = d.getDate());
				return ""+d.getFullYear()+m+day;
			}


    }]);

});