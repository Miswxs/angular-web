
define(['app', 'window', 'jquery', 'phoneConflictService'], function (app, w, $) {

	app.register.controller('phoneConflictController', [
			'$location',
			'$modal',
			'$log',
			'$filter',
			'$scope',
			'$state',
			'$rootScope',
			'$document',
			'phoneConflictService',
			function($location, $modal, $log, $filter, $scope,$state, $rootScope,
					 $document, phoneConflictService) {
				$scope.initializeController = function() {
					$scope.searchTxt = "";
					$scope.pageSize = 10;
					//$scope.subTypeMap = bOrgService.subTypeMap;
					$scope.moduleNowClick = $rootScope.moduleNowClick;
					$scope.currentPage = 1;
					$scope.TotalRows = 0;
					$scope.conflics = [];
					$scope.getConflics(null,null,null);
					$scope.FileUpload;
				}

				$scope.createSearchObject = function(cstName,mobile,cardId) {
					var searchVo = new Object();
					if (cstName != null || mobile!=null ||cardId !=null)
						searchVo.page = 1;
					else
						searchVo.page = $scope.currentPage;
						
					searchVo.pageSize = $scope.pageSize;
					searchVo.cstName = $scope.cstName;
					searchVo.mobile = $scope.mobile;
					searchVo.cardId = $scope.cardId;
					return searchVo;
				}

				//查看客户画像
				$scope.getClientDetail = function(cstGUID){
					$state.go("app.client.portrait.personPortrait", {"cstGUID": cstGUID});
				}
				
				$scope.search = function(cstName,mobile,cardId){
					$scope.currentPage = 1;
					$scope.getConflics(cstName,mobile,cardId);
				}
				
				$scope.getConflics = function(cstName,mobile,cardId) {
					var searchVo = $scope.createSearchObject(cstName,mobile,cardId);
					phoneConflictService.getConflics(searchVo, $scope.getConflicsCompleted,
							$scope.getConflicsError);
				}

				$scope.enter = function(ev) { 
					if (ev.keyCode !== 13) {
					  return; 
					}
					$scope.getConflics($scope.cstGUID,$scope.mobile,$scope.cardId);
				}

				$scope.getConflicsCompleted = function(response, status) {
					if (response.header.code == 0) {
						$scope.conflics =  response.data.list;
						$scope.TotalRows = response.data.page.recordCount;
						$scope.pageNum = response.data.page.pageCount;
					}
				}

				$scope.getConflicsError = function(response, status) {
//					toastr.warning("操作失败", '提示', {
//						closeButton : true,
//						timeOut : 5000
//					});
				}


				$scope.pageChanged = function() {
					$scope.getConflics(null,null,null);
				}
				
				//冲突处理模式窗口
				var modifyOrganizationCtrl = function($scope, $modalInstance,
						conflicDetail) {
					$scope.HeaderText = "冲突详情";
					$scope.conflicDetail = conflicDetail;
					$scope.agenKeep = conflicDetail.customer.cstGUID;
					
					//手机冲突处理
					$scope.merge = function() {
						var agenKeep = $('input[name="agenKeep"]:checked').val();
						var cstGUID = {};
						var cstGUIDS2 = [];
						angular.forEach(conflicDetail.customers,function(value,key){
							cstGUIDS2.push(value.cstGUID);
						});
						cstGUID.cstGUID1 = agenKeep;
						cstGUID.cstGUIDS2 = cstGUIDS2;
						cstGUID.mobile = conflicDetail.mobile;
						
						new w.Window().confirm({
				            title: "提示",
				            hasCloseBtn: true,
				            text4ConfirmBtn: "确定",
				            text4CancelBtn: "取消",
				            width: 400,
				            height: 160,
				            content: '确定修改手机归属？',
				            handler4ConfirmBtn: function(){
				            	phoneConflictService.DCstConflicDeal(cstGUID,
										function(response,status){
											if(response.header.code == 0){
												$scope.getConflics(null,null,null);
												$modalInstance.dismiss('cancel');
											}else{
												new w.Window().alert({
													title:"提示",
													width:300,
													height:160,
													content:response.header.message
												});
											}
										},function(response, status){
										}
									);
				            },
				            handler4CancelBtn: function(){
				            }
				        });
					};
					//关联冲突客户
					$scope.cancer = function() {
						$modalInstance.dismiss('cancel');
					};
				};
				//冲突处理信息查询
				$scope.getConflicDetail = function(mobile) {
					phoneConflictService.getConflicDetail({"mobile":mobile},function(response, status){
						
						if (response.header.code == 0) {
							var modalInstance = $modal.open({
								templateUrl : 'modifyOrganization.html',
								controller : modifyOrganizationCtrl,
								windowClass : 'app-modal-window',
								size: 'lg',
								resolve : {
									conflicDetail : function() {
										return response.data;
									}
								}
								
							});
						}else{
//							toastr.warning(response.header.message, '提示', {
//								closeButton : true,
//								timeOut : 5000
//							});
						}
					},function(response, status){
//						toastr.warning("操作失败", '提示', {
//							closeButton : true,
//							timeOut : 5000
//						});
					});
				}
			} ]);
});
