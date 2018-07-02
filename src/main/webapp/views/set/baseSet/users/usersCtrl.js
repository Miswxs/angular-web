define(['app','window', 'jquery','usersService'], function (app, w, $)  {
    //console.dir(app);
    app.register.controller('usersController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state','usersService', function ($location, $modal, $filter, $scope, $rootScope, $state,usersService) {
      
      $scope.initializeController = function () {
		  $scope.detailsLoaded = false;//初始时候不显示搜索明细列表
		  
		  $scope.PageSize = 10;//默认显示一页页码数
		  $scope.currentPage = 1;
		  $scope.TotalRows = 0;
		  $scope.getMyZnodes();
		  //获取界面数据
//		  $scope.getDetailsById();
		  
		  $scope.moduleNowClick = $rootScope.moduleNowClick;
      }
	  
	  //点击查询
		$scope.search = function(search){
			//$scope.state = state;
			$scope.keyword = search;
			$scope.currentPage = 1;
			//进入查询明细
			$scope.getDetailsById($scope.curOrg);
		};
		
		//导出用户
		$scope.exportFile = function(){
			var param = { 
					path: $scope.curOrg.path,
					state:$scope.state,
					searchTxt: $scope.keyword,
					page: $scope.currentPage,
					pageSize: $scope.PageSize
				};
			usersService.sysUserExport(param);
		}
        
//	  //获取查询明细
//		$scope.getDetails = function (search) {
//            console.log(search)
//			var searchInfo = $scope.createSearchInfo(search);
//			usersService.getDetails(searchInfo, function(response, status){
//                $scope.myRoleList = response.roleList;
//                //填充内容
//                var tempList = [];
//                angular.forEach(response.roleList,function(value,key){
//                    if((value.orgId).indexOf(search)!=-1)
//                        tempList.push(value);
//                })
//				$scope.list = tempList;
//				$scope.accessSystems = response.accessSystem;
//				$scope.TotalRows = response.TotalRows;
//				$scope.detailsLoaded = true;
//
//			}, function(response, status){
//				toastr.warning('获取数据失败', '提示', {
//					closeButton: true,
//					timeOut: 2000
//				});
//			})
//		}
//        //生成传给后台的查询对象
//		$scope.createSearchInfo = function (search) {
//
//			var searchInfo = {};
//
//			if (search != null){
//				searchInfo.currentPage = 1;
//				$scope.currentPage = 1;
//			}
//			else{
//				searchInfo.currentPage = $scope.currentPage;
//			}
//            searchInfo.roleName = search;//角色名称
//			searchInfo.areaSeach = $scope.areaSeach;//区域
//			searchInfo.citySearch = $scope.citySearch;//城市
//			searchInfo.projectSearch = $scope.projectSearch;//项目
//			searchInfo.formatCheckedSearch = $scope.formatCheckedSearch;//所属业态
//
//			return searchInfo;
//		}
        
        //获取组织下角色
		$scope.getDetailsById = function (org) {
			var param = { 
				path: org.path,
				state:$scope.state,
				searchTxt: $scope.keyword,
				page: $scope.currentPage,
				pageSize: $scope.PageSize
			};
			usersService.getDetails(param, function(response, status){
				$scope.list = response.data.list;
				$scope.TotalRows = response.data.page.recordCount;
				$scope.detailsLoaded = true;

			}, function(response, status){
				new w.Window().alert({
					title:"提示",
					width:300,
					height:160,
					content:"获取数据失败"
				});
			})
		}
		
		$scope.updateUserState = function(state,user){
			new w.Window().confirm({
	            title: state==2?"冻结用户":"启用用户",
	            hasCloseBtn: true,
	            text4ConfirmBtn: state==2?"冻结":"启用",
	            text4CancelBtn: "我再想想",
	            width: 400,
	            height: 180,
	            content: '请您确认是否'+ (state==2?"冻结":"启用")+ user.name,	            
	            handler4ConfirmBtn: function(){
	            	usersService.updateUserState({state:state,userId:user.userId},function(response){
	    				if(response.header.code == -1){
	    					new w.Window().alert({
	    						title:"提示",
	    						width:300,
	    						height:160,
	    						content:response.header.message
	    					});
	    				}else{
	    					new w.Window().alert({
	    						title:"提示",
	    						width:300,
	    						height:160,
	    						content:state==2?"冻结成功":"启用成功"
	    					});
	    					$scope.getDetailsById($scope.curOrg);
	    				}
	    			},function(response){
	    				new w.Window().alert({
	    					title:"提示",
	    					width:300,
	    					height:160,
	    					content:"操作失败"
	    				});
	    			});
	            },
	            handler4CancelBtn: function(){
	                //
	            }
			})			
		}
     	
		
       
        //查询明细页码切换
		$scope.pageChanged = function () {
			$scope.getDetailsById($scope.curOrg);
		}
        
        /*================================AFTER ADD===============================*/
        //初始化zTree数据
        $scope.getMyZnodes = function () {
        	usersService.myZNnodes(function (response, status) {
        		$scope.curUser = response.data.curUser;
        		$scope.curOrg = response.data.curOrg;
	  	    	$scope.curOrgId = response.data.curOrg.orgguid;
            	$scope.tempOrgName = response.data.curOrg.orgname;
                $scope.myZnodes = response.data.orgList;
                
                angular.forEach($scope.myZnodes, function (value, key) {
                    if (value.id == $scope.curOrgId) {
                    	$scope.currNode = value;
                    }
                })
                $scope.getDetailsById(response.data.curOrg);
                
                var newCount = 100;var log, className = "dark", curDragNodes, autoExpandNode;
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
                                }else{
                                	//默认展示第一级
                                	treeNode.open=true;
                                }
                            }

                        },
                        
                        data: {
                            simpleData: {
                                enable: true
                            },curOrgId:$scope.curOrgId
                        },
                        callback: {
                        	onClick: function(e, treeId, treeNode){
                        		$scope.curOrgId = treeNode.orgguid;
                        		$scope.curOrg = treeNode;
                        		$scope.currNode = treeNode;
                        		$scope.getDetailsById(treeNode);
                        	},
                        
                           beforeDrag: function (treeId, treeNodes) {
                               return false;
                           },
                           beforeDrop:function (treeId, treeNodes, targetNode, moveType) {
                               return false;
                           }

                        }

                };
	  	    }, function (response, status) {
	  	    })
        }
       
        //添加或者修改用户
        $scope.roleAM = function(l){
            if(!l){
            	$scope.user = {"state":1,"myRole":[]};
            	var modalInstance = $modal.open({
					templateUrl: 'modifyAndSaveRole.html',
					controller: roleAMCtrl,
					windowClass: 'app-modal-window',
					size: "lg",
					resolve: {
                        user: function () {
		                    return $scope.user;
		                },
                        useList:function(){
                            return $scope.list;
                        },
                        curOrgId:function(){
                        	return $scope.curOrgId;
                        },curOrg:function(){
                        	return $scope.curOrg;
                        }
                        ,curUser:function(){
                        	return $scope.curUser;
                        },type:function(){
                        	return "new";
                        }
					}
				});
			 modalInstance.result.then(function(obj) {
	            	usersService.saveUserInfo(obj,function(response){
	            		new w.Window().alert({
	    					title:"提示",
	    					width:300,
	    					height:160,
	    					content:"操作成功"
	    				});
	            		$scope.getDetailsById($scope.curOrg);
	                }, function(response){});
	            });
            } else{
            	usersService.getUserDetail({userId:l.userId},function(response){
            		$scope.user = response.data;
            		var modalInstance = $modal.open({
    					templateUrl: 'modifyAndSaveRole.html',
    					controller: roleAMCtrl,
    					windowClass: 'app-modal-window',
    					size: "lg",
    					resolve: {
                            user: function () {
    		                    return $scope.user;
    		                },
                            useList:function(){
                                return $scope.list;
                            },
                            curOrgId:function(){
                            	return $scope.curOrgId;
                            },curOrg:function(){
                            	return $scope.curOrg;
                            },curUser:function(){
                            	return $scope.curUser;
                            },type:function(){
                            	return "modify";
                            }
    					}
    				});
    			 modalInstance.result.then(function(obj) {
    	            	usersService.updateUserInfo(obj,function(response){
    	            		$scope.getDetailsById($scope.curOrg);
    	                }, function(response){});
    	            });
            	},function(response){
            		new w.Window().alert("操作失败");
            	});
            }
        };
		var roleAMCtrl = function($scope, $modalInstance,user,useList,curOrgId,curOrg,curUser,type) {
			//new w.Window().alert("失败");
			$scope.user = user;
			$scope.curOrg = curOrg;
            $scope.useList = useList;
            $scope.type = type;
            //功能角色列表
            $scope.getRoleSelect = function(){
            	usersService.getRoleSelect({searchTxt:$scope.searchTxt},function(response){
            		$scope.roleData = response.data;
            		if(user.myRole){
                		$scope.roleData = $scope.addPowerOther($scope.roleData,user.myRole);
            		}
            	},function(response){
            		
            	});
            }
            //数据角色列表
            $scope.getGroupSelect = function(){
            	usersService.getGroupSelect({groupname:$scope.keyword},function(response){
            		$scope.groupData = response.data;
            		//$scope.addToRight('myGroup');
            		if(user.myGroup){
            			$scope.groupData = $scope.addPowerOther($scope.groupData,user.myGroup);
            		}
            	},function(response){
            		
            	});
            }
            $scope.addPowerOther = function(powerList,others){
            	for(var i=0;i<others.length;i++){
            		var isExist = false;
    				for(var j=0;j<powerList.length;j++){
    					if(others[i].id==powerList[j].id){
    						powerList[j].isSelected = true;
    						isExist = true;
    					}
    				}
    				if(!isExist){
    					var obj = {};
    					obj.id = others[i].id;
    					obj.name = others[i].name;
    					obj.isSelected = true;
    					powerList.push(obj);
    				}
    				
    			}
            	return powerList;
            }
            $scope.getRoleSelect();
            $scope.getGroupSelect();
            var zTree = $.fn.zTree.getZTreeObj("commonTree");
            
            var node = zTree.getNodesByParam("id", curUser.orgId, null);
            $scope.myobj = [];
            var mobj={};
            mobj.isSelect = null;
            mobj.nodes = node;
            $scope.myobj.push(mobj);
            
            //开始部门多级下拉赋值
//            var arr = $scope.rowRole.userDepart.split("|");
//            $scope.j=0,$scope.rowRole.myobj = [];
//            //递归
//            digui(useList);
//            function digui(useList){
//                 var obj = {};
//                if(useList.length==0)return;
//                //部门Key为空
//                if(arr.length==1&&arr[0]==""){
//                    obj.select = "";
//                    obj.myfull = useList;
//                    obj.selectHide = false;
//                    $scope.rowRole.myobj.push(obj);
//                    return;
//                //部门Key不为空
//                }else{
//                    while($scope.j<=(arr.length-1)){
//                        for(var i=0;i<useList.length;i++){
//                            if(useList[i].groupKey == arr[$scope.j]){
//                                obj.select = useList[i];
//                                obj.myfull = useList;
//                                obj.selectHide = false;
//                                $scope.rowRole.myobj.push(obj);
//                                $scope.j++;
//                                digui(obj.select.son);
//                            }
//                        }
//
//                    }
//                }
//                
//            }
            $scope.selectChange = function(org,i){
            	if($scope.curSelect && $scope.curSelect.pId == org.pId && $scope.curSelect.isParent){
            		$scope.myobj.pop();
            	}else if(i+1<$scope.myobj.length){
            		$scope.myobj = $scope.myobj.slice(0,i+1);
            	}
            	$scope.curSelect = org;
            	if(org.isParent){
            		var mobj={};
                    mobj.isSelect = null;
                    mobj.nodes = org.children;
            		$scope.myobj.push(mobj);
            	}
            }
            //获取当前组织及父组织
            $scope.getAllPId = function(orgId){
            	var treeNode = zTree.getNodesByParam("id", orgId, null);
            	if(treeNode[0]){
            		$scope.orgIds.push(treeNode[0]);
            		if(treeNode[0].pId && treeNode[0].id!=curUser.orgId){
            			$scope.getAllPId(treeNode[0].pId);
            		}
            	}
            }
            //默认选中当前组织
            $scope.defaultSelect = function(orgId){
            	$scope.orgIds = [];
            	$scope.getAllPId(orgId);
            	for(var i=0;i<$scope.orgIds.length;i++){
            		$scope.myobj[i].isSelect = $scope.orgIds[$scope.orgIds.length-1-i];
            		$scope.selectChange($scope.orgIds[$scope.orgIds.length-1-i],$scope.myobj.length);
            	}
            }
            
            if($scope.user.orgId){
            	$scope.defaultSelect($scope.user.orgId);
            }else{
            	$scope.defaultSelect(curOrgId);
            }
            
            //重写下拉Change事件 i 是当前点击的索引值
//            $scope.selectChange = function(i){
//                //当前点击不是最后一个
//                var s = $scope.rowRole.myobj[i].select;
//                if(s && s.son.length!=0){
//                    //当前myobj只有一个值
//                   if($scope.rowRole.myobj.length <= i+1){
//                       var obj = {};
//                       obj.select = "";
//                       obj.myfull = s.son;
//                       obj.selectHide = false;
//                       $scope.rowRole.myobj.push(obj);
//                    //当前myobj有多个值
//                   }else{
//                       for(var k=0;k<i+2;k++){
//                           $scope.rowRole.myobj[k].selectHide = false;
//                       }
//                        $scope.rowRole.myobj[i+1].select = ""
//                       for(var j=i+2;j<$scope.rowRole.myobj.length;j++){
//                           $scope.rowRole.myobj[j].selectHide = true;
//                       }
//                   }
//                //当前点击是最后一个
//                }else{
//                    for(var n=i+1;n<$scope.rowRole.myobj.length;n++){
//                       $scope.rowRole.myobj[n].selectHide = true;
//                   }
//                }
//            }
            //把右边存在的角色或用户组左边选中
            $scope.setSelect = function (type) {
                $scope.getselect = function (a,b){
                     angular.forEach(a, function (v, k) {
                            angular.forEach(b, function (rv, rk) {
                                if (v.id == rv.id)
                                    rv.isSelected = true;
                            })
                        })
                     return b;
                }
                switch (type) {
                    case 'myRole':
                      $scope.roleData = $scope.getselect($scope.user.myRole,$scope.roleData);
                        break;
                    case 'myGroup':
                        $scope.groupData = $scope.getselect($scope.user.myGroup,$scope.groupData);
                        break;
                }
                
            }
            $scope.setSelect('myRole');
            $scope.setSelect('myGroup');
           
            //添加角色到右边
            $scope.addToRight = function(type){
                switch (type) {
                    case 'myRole':
                      toRight($scope.user.myRole,$scope.roleData);
                        break;
                    case 'myGroup':
                        toRight($scope.user.myGroup,$scope.groupData);
                        break;
                }
                function toRight(a,b){
                    angular.forEach(b, function (rv, rk) {
                        if (rv.isSelected){
                            var bool = true;
                            for(var i=0;i<a.length;i++){
                                if(rv.id == a[i].id){
                                    bool = false;
                                    break;
                                }
                            }
                            if(bool){
                                rv.isMine = false;
                                a.push(rv);
                            }
                        }
                    })
                }
                 
            }
            //删除角色到左边
            $scope.deleteToLeft = function(type){
                switch (type) {
                    case 'myRole':
                      toLeft($scope.user.myRole,$scope.roleData);
                        break;
                    case 'myGroup':
                        toLeft($scope.user.myGroup,$scope.groupData);
                        break;
                }
                function toLeft(a, b) {
                    $scope.deleteObj = [];
                    angular.forEach(a, function (mr, mk) {
                        if (mr.isMine) {
                            angular.forEach(b, function (rv, rk) {
                                if (mr.id == rv.id) {
                                    rv.isSelected = false;
                                }
                            })
                            $scope.deleteObj.push(mr);
                        }
                    });
                    //删除右边
                    angular.forEach($scope.deleteObj, function (v, k) {
                        angular.forEach(a, function (mv, mk) {
                            if (v.id == mv.id) {
                                a.splice(mk, 1);
                            }
                        })

                    })
                }
                
                 
            }
            
            //点击左边选项事件
            $scope.toSelect = function(obj){
                obj.isSelected = !obj.isSelected;
            }
            //点击右边选项事件
            $scope.toMelect = function(obj){
                obj.isMine = !obj.isMine;
            }
            //保存
            $scope.saveMA = function(obj){
            	var saveUser = {};
            	if($scope.user.userId){
            		saveUser.userId = $scope.user.userId;
            	}
            	saveUser.userName = obj.userName;
            	saveUser.name = obj.name;
            	saveUser.password = obj.password;
            	saveUser.mobile = obj.mobile;
            	saveUser.post = obj.post;
            	saveUser.mail = obj.mail;
            	saveUser.state = 1;
            	saveUser.myRole = obj.myRole;
            	saveUser.orgId = $scope.curOrg.orgguid;
            	saveUser.orgName = $scope.curOrg.orgname;
            	saveUser.delicateState = 1;
            	
            	$modalInstance.close(saveUser);
                
            }
             $scope.roleSearch = function(search){
            	 $scope.searchTxt = search;
            	 $scope.getRoleSelect();
             }
             $scope.groupSearch = function(search){
            	 $scope.keyword = search;
            	 $scope.getGroupSelect();
             }
             $scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
		  };
		
        

        
        
        
        
        //权限弹窗
		var rowRoleCtrl = function($scope, $modalInstance,mrole) {
			$scope.mrole = mrole;
			
			usersService.getUserPower({userId:mrole.userId},function(response){
				$scope.myRoleFunctions = response.data.funcPowerList;
				$scope.myRoleDataPowers = response.data.dataPowerList;
				
			},function(response){
				
			});
            
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
                	onCheck:function(event,treeId, treeNode){
                		
//                		$scope.checkFunction(treeNode);
                		$scope.checkProject(treeNode);
                		$scope.pIds = [];
                		angular.forEach($scope.myRoleDataPowers, function (value, key) {
                            if(value.checked){
                            	if(!value.chkDisabled){
                            		$scope.pIds.push(value.id);
                            	}
                            }
                        })
                        
                        $scope.fIds = [];
                		var treeObj = $.fn.zTree.getZTreeObj("checkTree");
                     	angular.forEach(treeObj.getCheckedNodes(true), function (value, key) {
                     		$scope.fIds.push(value.id);
                     	});
                	},
                   beforeDrag: function (treeId, treeNodes) {
                       return false;
                   },
                   beforeDrop:function (treeId, treeNodes, targetNode, moveType) {
                       return false;
                   }

                }
            };
            
            $scope.checkFunction = function(treeNode){
            	angular.forEach($scope.myRoleFunctions, function (value, key) {
                    if (value.id == treeNode.id) {
                    	value.checked = treeNode.checked;
                    }else if(value.pId == treeNode.id){
                    	value.checked = treeNode.checked;
                    	$scope.checkFunction(value);
                    }
                })
            }
            
            $scope.checkProject = function(treeNode){
            	angular.forEach($scope.myRoleDataPowers, function (value, key) {
                    if (value.id == treeNode.id) {
                    	value.checked = treeNode.checked;
                    }else if(value.pId == treeNode.id){
                    	value.checked = treeNode.checked;
                    	$scope.checkFunction(value);
                    }
                })
            }
            
            $scope.exp = true;
            $scope.expChange = function(){
                $scope.exp = !$scope.exp;
            }
            
             $scope.modifySave = function(){
            	 var userModel = {};
            	 userModel.userId = $scope.mrole.userId;
            	 userModel.delicateState = 1;
            	 userModel.projGuidList = $scope.pIds;
            	 userModel.functionIdList = $scope.fIds;
                usersService.modifyUserPower(userModel,function(response){
                	if(response.header.code == -1){
                		new w.Window().alert({title:"提示", width: 300, height: 160,content: response.header.message});
                	}
                    $modalInstance.dismiss('cancel');
                }, function(response){
                	new w.Window().alert({title:"提示", width: 300, height: 160,content: "操作失败"});
                })
            }
             
             $scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
		  };
		
		$scope.setRowRole = function(l){
			var modalInstance = $modal.open({
					templateUrl: 'rowRole.html',
					controller: rowRoleCtrl,
					windowClass: 'app-modal-window',
					size: "",
					resolve: {
                        mrole: function () {
		                    return l;
		                }
					}
				});
        };
        
  }]);
});

