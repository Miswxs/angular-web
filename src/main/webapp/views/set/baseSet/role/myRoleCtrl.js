define(['app','window', 'jquery','myRoleService'], function (app, w, $)  {
    //console.dir(app);
    app.register.controller('myRoleController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state','myRoleService', function ($location, $modal, $filter, $scope, $rootScope, $state,myRoleService) {
      
      $scope.initializeController = function () {
		  $scope.detailsLoaded = false;//初始时候不显示搜索明细列表
		  
		  $scope.PageSize = 10;//默认显示一页页码数
		  $scope.currentPage = 1;
		  $scope.TotalRows = 0;
		  $scope.moduleNowClick = $rootScope.moduleNowClick;
		  
		  //获取界面数据
		  $scope.getRoleList();
		  $scope.geAllRolePower();
      }
	  
	  //点击查询
		$scope.search = function(){
			$scope.currentPage = 1;
			//进入查询明细
			$scope.getRoleList();
		};
        
	  //获取查询明细
		$scope.detail = function (search) {
			var searchInfo = $scope.createSearchInfo(search);
			myRoleService.getRoleList(searchInfo, function(response, status){
                $scope.myRoleList = response.roleList;
                //填充内容
                var tempList = [];
                angular.forEach(response.roleList,function(value,key){
                    if((value.orgId).indexOf(search)!=-1)
                        tempList.push(value);
                })
				$scope.list = tempList;
				$scope.accessSystems = response.accessSystem;
				$scope.TotalRows = response.TotalRows;
				$scope.detailsLoaded = true;

			}, function(response, status){
				
			})
		}
        
        //获取角色列表
		$scope.getRoleList = function () {
			var searchInfo = {"page":$scope.currentPage,"pageSize":$scope.PageSize,"searchTxt":$scope.keyword};
			myRoleService.getRoleList(searchInfo, function(response, status){
				$scope.list = response.data.list;
				//$scope.accessSystems = response.accessSystem;
				$scope.TotalRows = response.data.page.recordCount;
				$scope.PageSize = response.data.page.pageSize;
				$scope.detailsLoaded = true;

			}, function(response, status){
				
			})
		}
		//初始所有权限列表，添加时初始化
		$scope.geAllRolePower = function(){
			myRoleService.geAllRolePower(null,function(response){
				$scope.functions = response.data.functions;
				$scope.dataPowers = response.data.dataPowers;
			},function(response){
				
			});
		}
     	
		//修改弹窗
		var modifyDesensCtrl = function($scope, $modalInstance,des) {
			$scope.des = des;
			  $scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
             $scope.modifySave = function(obj){
                myRoleService.modifyDesens(obj,function(response){
                    $modalInstance.dismiss('cancel');
                }, function(response,status){})
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
			$scope.getRoleList();
		}
        
           
        //角色成员弹窗
		var rowRoleCtrl = function($scope, $modalInstance,mrole) {
			$scope.mrole = mrole;
            
			$scope.getUserList = function () {
            	var info = {searchTxt:$scope.keyword1,path:$scope.curOrg.path};
                myRoleService.getUserList(info,function (response, status) {
                	$scope.users = response.data;
                }, function (response, status) {
                })
            }
			
            //初始化zTree数据,设置勾选的状态
            $scope.getMyZnodes = function () {
                myRoleService.myZNnodes(function (response, status) {
                	$scope.curOrg = response.data.curOrg;
    	  	    	$scope.curOrgId = response.data.curOrg.orgguid;
                	$scope.tempOrgName = response.data.curOrg.orgname;
                	$scope.myZnodes = response.data.orgList;
                	
                	$scope.getUserList();
                }, function (response, status) {
                })
            }
            $scope.getRoleUsers = function () {
            	var info = {searchTxt:$scope.keyword2,roleId:$scope.mrole.roleId};
                myRoleService.getRoleUsers(info,function (response, status) {
                	$scope.roleUsers = response.data;
                }, function (response, status) {
                })
            }
            $scope.getMyZnodes();
            $scope.getRoleUsers();
            
            $scope.searchUser1 = function(searchTxt){
            	$scope.keyword1 = searchTxt;
            	$scope.getUserList();
            }
            
            $scope.searchUser2 = function(searchTxt){
            	$scope.keyword2 = searchTxt;
            	$scope.getRoleUsers();
            }
            
            //添加角色到右边
            $scope.addToRight = function(){
                
                toRight($scope.roleUsers,$scope.users);
                
                //判断是否全选
                if(isAll($scope.roleUsers)){
                    $scope.listCurrent2 = true;
                }else{
                    $scope.listCurrent2 = false;
                }
                
                function toRight(a,b){
                    angular.forEach(b, function (rv, rk) {
                        if (rv.current){
                            var bool = true;
                            for(var i=0;i<a.length;i++){
                                if(rv.userId == a[i].userId){
                                    bool = false;
                                    break;
                                }
                            }
                            if(bool){
                                var temp = {};
                                temp.userId = rv.userId;
                                temp.name = rv.name;
                                temp.current = rv.current;
                                temp.userName = rv.userName;
                                temp.orgName = rv.orgName;
                                a.push(temp);
                            }
                        }
                        rv.current = false;
                    })
                    
                }
                //全选为False
                $scope.listCurrent = false;
            }
            //删除角色到左边
            $scope.deleteToLeft = function(){
                var a = $scope.roleUsers;
                $scope.deleteObj = [];
                angular.forEach(a, function (mr, mk) {
                    if (mr.current) {
                        $scope.deleteObj.push(mr);
                    }
                });
                //删除右边
                angular.forEach($scope.deleteObj, function (v, k) {
                    angular.forEach(a, function (mv, mk) {
                        mv.current = false;
                        if (v.userId == mv.userId) {
                            a.splice(mk, 1);
                        }
                    })

                })
                //全选为False
                $scope.listCurrent2 = false;
            }
            
            
            $scope.modifySave = function(role,roleUsers){
            	var obj = {};
            	obj.roleId = role.roleId;
            	obj.funcPowerIds = [];
            	angular.forEach(roleUsers, function (value, key) {
            		obj.funcPowerIds.push(value.userId);
            	});
            	
                myRoleService.updateRoleUsers(obj,function(response){
                    $modalInstance.dismiss('cancel');
                }, function(response,status){})
            }
             
            $scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
            $scope.mySetting = {
                    view: {
                        selectedMulti: false,
                        showIcon:false,
                        showLine:false,
                        dblClickExpand: false,
                        addDiyDom: function (treeId, treeNode) {
                            var spaceWidth = 20;
                            var switchObj = $("#" + treeNode.tId + "_switch"),
                            icoObj = $("#" + treeNode.tId + "_ico");
                            switchObj.remove();
                            icoObj.before(switchObj);

                            if (treeNode.level > 0) {
                                var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+"px'></span>";
                                switchObj.before(spaceStr);
                            }
                        }

                    },
                    edit: {
                        enable: true,
                        showRemoveBtn: function(treeId, treeNode){
                            return false;
                        },
                        showRenameBtn: function(treeId, treeNode){
                            return false;
                        }
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick: function (event, treeId, treeNode) {
                            $scope.curOrg = treeNode;
                            $scope.getUserList();
                        },
                        beforeClick: function (treeId, treeNode, clickFlag) {
                            $scope.$apply(function () {
                                $scope.list = treeNode;
                            })
                        }
                    }
            };
            
            //全选与取消全选
            $scope.selectAll = function(obj,listCurrent){
                angular.forEach(obj,function(v,k){
                    if(listCurrent){
                        v.current = false;
                    }else{
                        v.current = true;
                    }
                })
                $scope.listCurrent = !listCurrent;
            }
            
            //全选与取消全选
            $scope.selectAll2 = function(obj,listCurrent){
                angular.forEach(obj,function(v,k){
                    if(listCurrent){
                        v.current = false;
                    }else{
                        v.current = true;
                    }
                })
                $scope.listCurrent2 = !listCurrent;
            }
            
            //监听选择事件
            $scope.listenSelect = function(obj,md){
                md.current = !md.current;
                if(isAll(obj)){
                	$scope.listCurrent = true;
                }else{
                	$scope.listCurrent = false;
                }
            }
            
            //监听选择事件
            $scope.listenSelect2 = function(obj,md){
                md.current = !md.current;
                if(isAll(obj)){
                	$scope.listCurrent2 = true;
                }else{
                	$scope.listCurrent2 = false;
                }
            }
            
            //判断是否全选
            function isAll(obj){
                var bool = true;
                for(var i=0;i<obj.length;i++){
                    if(!obj[i].current || obj[i].current == false){
                        bool = false;
                        break;
                    }
                }
                return bool;
            }
		  };
		
		$scope.setRowRole = function(l){
			var modalInstance = $modal.open({
					templateUrl: 'rowRole.html',
					controller: rowRoleCtrl,
					windowClass: 'role-modal-main',
					size: "",
					resolve: {
                        mrole: function () {
		                    return l;
		                }
					}
				});
        };
        /*=============修改和添加===============*/
		var roleAMCtrl = function($scope, $modalInstance,rowRole,type,functions,dataPowers) {
			$scope.getRoleDetail = function(roleId){
				myRoleService.getRoleDetail({roleId:roleId},function(response){
					$scope.functions = response.data.functions;
					$scope.dataPowers = response.data.powerList;
				},function(response){
					
				});
			}
			
			if(type == 'modify'){
				$scope.rowRole = {};
				$scope.rowRole.roleId = rowRole.roleId;
				$scope.rowRole.roleName = rowRole.roleName;
				$scope.rowRole.description = rowRole.description;
				$scope.rowRole.delicateState = 1;
//				$scope.rowRole = rowRole;
				$scope.getRoleDetail(rowRole.roleId);
			}else{
				$scope.rowRole = rowRole;
				$scope.functions = functions;
				$scope.dataPowers = dataPowers;
			}
			
			
            $scope.myRoleSetting = {
                view: {
                    selectedMulti: false,
                    showIcon:true,
                    showLine:false,
                    dblClickExpand: true,
                },
                edit: {
                    enable: false,
                    showRemoveBtn: function(treeId, treeNode){
                        return false;
                    },
                    showRenameBtn: function(treeId, treeNode){
                        return false;
                    }
                },
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                   beforeDrag: function (treeId, treeNodes) {
                       return false;
                   },
                   beforeDrop:function (treeId, treeNodes, targetNode, moveType) {
                       return false;
                   }

                }
            };
            $scope.rtype = type;
            
             $scope.saveMA = function(obj){
            	var sysRole = {};
            	sysRole.roleName = obj.roleName;
            	sysRole.description = obj.description;
            	sysRole.delicateState = 1;
            	//获取选择的功能权限ID
             	var treeObj = $.fn.zTree.getZTreeObj("checkTree");
             	var funcPowerIds = [];
             	angular.forEach(treeObj.getCheckedNodes(true), function (value, key) {
             		funcPowerIds.push(value.id);
             	});
             	sysRole.modPowerGuids = funcPowerIds;
             	//获取选择的数据权限ID
             	var treeObj2 = $.fn.zTree.getZTreeObj("checkTree2");
             	var dataPowerIds = [];
             	angular.forEach(treeObj2.getCheckedNodes(true), function (value, key) {
             		dataPowerIds.push(value.id);
             	});
             	sysRole.dataPowerIds = dataPowerIds;
             	
             	if($scope.rtype == 'modify'){
            		sysRole.roleId = $scope.rowRole.roleId;
            		//更改页面属性
            		rowRole.roleId = $scope.rowRole.roleId;
    				rowRole.roleName = $scope.rowRole.roleName;
    				rowRole.description = $scope.rowRole.description;
    				rowRole.delicateState = 1;
    				
            		myRoleService.updateRole(sysRole,function(response){
                      	if(response.header.code == -1){
                      		new w.Window().alert(response.header.message);
                      	}
                          $modalInstance.dismiss('cancel');
                      }, function(response,status){});
            	}else{
            		$modalInstance.close(sysRole);
            	}
             	
                
            }
             
             $scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
		  };
		
		$scope.roleAM = function(t,l){
            if(!l)l = {"delicateState":1};
			var modalInstance = $modal.open({
					templateUrl: 'modifyAndSaveRole.html',
					controller: roleAMCtrl,
					windowClass: 'app-modal-window',
					size: "",
					resolve: {
                        rowRole: function () {
		                    return l;
		                },
                        type:function(){
                            return t;
                        },functions:function(){
                        	return $scope.functions;
                        },dataPowers:function(){
                        	return $scope.dataPowers;
                        }
					}
				});
			modalInstance.result.then(function (sysRole) {
				myRoleService.addRowRole(sysRole,function(response){
                  	if(response.header.code == -1){
                  		new w.Window().alert(response.header.message);
                  	}
                  	$scope.getRoleList();
                  }, function(response,status){});
			});
        };
        $scope.deleteRole = function(rrole){
             new w.Window().confirm({
                     title: "删除角色",
                     width: 500,
                     height: 200,
                     content: "请您确认是否删除该角色？",
                     handler4ConfirmBtn:function(){
                         myRoleService.deleteRole(rrole, function (response) {
                        	 if(response.header.code == -1){
                        		 new w.Window().alert({title:"提示", width: 300, height: 150,content: response.header.message});
                        	 }
                             angular.forEach($scope.list, function (value, key) {
                                 if (value.roleId == rrole.roleId) {
                                     $scope.list.splice(key, 1);
                                     return;
                                 }
                             })
                         }, function (response, status) {
                         });
                     },
                     hasCloseBtn: true
                 });
        }
        
  }]);
});

