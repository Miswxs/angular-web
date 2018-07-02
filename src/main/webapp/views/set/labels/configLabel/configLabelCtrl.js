define( [ 'app', 'window', 'jquery', 'configLabelService' ,'WdatePicker'],
		function(app, w, $) { app.register .controller( 'configLabelController',
			['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', 
			 '$interval', '$timeout', 'configLabelService', '$http',
		function($location, $modal, $filter, $scope, $rootScope, $state,
				$interval, $timeout, configLabelService, $http) {
			$scope.initializeController = function() {
				$scope.hasGetConditions = false;// 初始化默认没有加载属性列表
				$scope.getMyZnodes();
                $scope.orgSonType = [
                      {name:'业态公司',value:'A'},
                      {name:'区域公司',value:'B'},
                      {name:'城市公司',value:'C'},
                      {name:'部门',value:'D'}];
               //隐藏右键
               $("#rMenu ul").bind('click',function(){
                   $("#rMenu ul").hide();
               });
               //标签是否上线
               $scope.isOnline = "下线";
                $scope.isSql = true;
                //判断点击区域是否在树中
                $(document).bind('mousedown',function(event){
                   
                     var $target = $(event.target);
                    if($target.parents().andSelf().is(".label_tree_zone") ){
                        $scope.isOutTree = false;
                    }else{
                        $scope.isOutTree = true;
                    }
                });
                //控制右健
                $scope.isP = false;
			}
		    
		  	//初始化zTree数据
		  	$scope.getMyZnodes = function () {
		  	    configLabelService.myZNnodes(function (response, status) {
		  	        $scope.myZnodes = response.data;
		  	    }, function (response, status) {
		  	    	
		  	    })
                configLabelService.myRequestData({},function(response){
                    $scope.orgaList = response;
                    $scope.orga = response[0];
                },function(){})
		  	}
		  	$scope.isBtn = "modify";
            //保存修改
            $scope.saveModify = function(orga){
            	var reqObj = {};
                reqObj.feaTemGuid = orga.feaTemGuid;
                reqObj.feaTemDir = orga.feaTemDir;
                reqObj.feaTemType = 1;
                reqObj.feaTemSubtype = 1;
                reqObj.feaTemCode = orga.feaTemCode;
                reqObj.feaTemTitle = orga.feaTemTitle;
                reqObj.feaTemPguid = orga.feaTemPguid;
                reqObj.tSourcechannel = orga.tsourcechannel;
                reqObj.isfromCode = orga.isfromCode;
                reqObj.isoption = orga.isoption;
                reqObj.isleaf = orga.isleaf;
                reqObj.isdel = orga.isdel;
                reqObj.isdisabled = orga.isdisabled;
                
                if(orga.isleaf!=null){
                	reqObj.feaTemName = orga.feaTemName;
                    reqObj.feaTemValue = orga.feaTemValue;
                    reqObj.feaTemPname = orga.feaTemPname;
                    reqObj.feaTemPvalue = orga.feaTemPvalue;
                	reqObj.tTabName = orga.ttabName;
                	reqObj.tTabField = orga.tTabField;
                	reqObj.tFieldType = orga.tFieldType*1;
                	reqObj.tMarkField = orga.tMarkField;
                	reqObj.tMarkFieldValue = orga.tMarkFieldValue;
                    reqObj.tFeaExpress = orga.tFeaExpress;
                    reqObj.tabletype = orga.tabletype*1;
                    reqObj.tFeaParam = orga.tFeaParam;
                	//reqObj.defcheck = orga.defcheck;
                	if(orga.isleaf==1){
                		
                	}
                }
                
                $scope.isBtn = "modify";
                configLabelService.modifyFeature(reqObj,function(response){
                	if(response.header.code == -1){
//                		toastr.warning(response.header.message, '提示', {
//        					closeButton: true,
//        					timeOut: 3000
//        				});
                	}else{
                		var zTree = $.fn.zTree.getZTreeObj("commonTree");
                		$scope.curNode.object = orga;
                		if(reqObj.isleaf==1){
                			if(reqObj.isdel==1){
                				$scope.curNode.name = reqObj.feaTemName+"（删除）";
                			}else
                				$scope.curNode.name = reqObj.isdisabled==1?reqObj.feaTemName+"（上线）":reqObj.feaTemName+"（下线）";
                    		$scope.curNode.value = reqObj.feaTemValue;
                		}else{
                			if(reqObj.isdel==1)
                				$scope.curNode.name = reqObj.feaTemTitle+"（删除）";
                			else
                				$scope.curNode.name = reqObj.isdisabled==1?reqObj.feaTemTitle+"（上线）":reqObj.feaTemTitle+"（下线）";
                    		$scope.curNode.value = reqObj.feaTemCode;
                		}
                		
                		zTree.updateNode($scope.curNode);
//                		toastr.success(response.header.message, '提示', {
//        					closeButton: true,
//        					timeOut: 3000
//        				});
                	}
                },function(response){
//                	toastr.warning('操作失败', '提示', {
//    					closeButton: true,
//    					timeOut: 3000
//    				});
                })
            }
            
            //右边菜单
		  	var className = "dark", curDragNodes, autoExpandNode,tempEditNode;
            
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
		  				drag: {
		  					autoExpandTrigger: true,
		  					prev: function(treeId, nodes, targetNode) {
		  						var pNode = targetNode.getParentNode();
		  						if ((pNode && pNode.dropInner === false&&(nodes[0].pId != pNode.id))||!pNode) {
		  							return false;
		  						} else {
		  							for (var i=0,l=curDragNodes.length; i<l; i++) {
		  								var curPNode = curDragNodes[i].getParentNode();
		  								if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
		  									return false;
		  								}
		  							}
		  						}
		  						return true;
		  					},
		  					inner: function(treeId, nodes, targetNode) {
		  						if (targetNode && targetNode.dropInner === false) {
		  							return false;
		  						} else {
		  							for (var i=0,l=curDragNodes.length; i<l; i++) {
		  								if (!targetNode && curDragNodes[i].dropRoot === false) {
		  									return false;
		  								} else if (curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
		  									return false;
		  								}
		  							}
		  						}
		  						return true;
		  					},
		  					next: function(treeId, nodes, targetNode) {
		  						var pNode = targetNode.getParentNode();
		  						if ((pNode && pNode.dropInner === false&&(nodes[0].pId != pNode.id))||!pNode) {
		  							return false;
		  						} else {
		  							for (var i=0,l=curDragNodes.length; i<l; i++) {
		  								var curPNode = curDragNodes[i].getParentNode();
		  								if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
		  									return false;
		  								}
		  							}
		  						}
		  						return true;
		  					}
		  				},
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
                         beforeClick: function(treeId, treeNode, clickFlag){
//                              if(!treeNode.isParent){
//                              configLabelService.myRequestData({}, function (response) {
//                                  angular.forEach(response,function(ov,ok){
//                                      if(treeNode.labelId == ov.labelId)
//                                          $scope.orga = ov;
//                                  })
//                              }, function () {})
//                              }
                        },
                        onClick:function(event, treeId, treeNode){
                            if(treeNode.object){
                            	var zTree = $.fn.zTree.getZTreeObj("commonTree");
                            	var node = zTree.getNodesByParam("value", treeNode.object.feaTemDir, null);
                            	if(node && node[0]){
                            		$scope.featureTypeName = node[0].name;
                            	}
                        	}else{
                        		$scope.$apply(function(){
                                	$scope.featureTypeName = "";
    		  					});
                        	}
                            $scope.$apply(function(){
                            	$scope.curFeature = treeNode.object;
                            	$scope.curNode = treeNode;
                            	if(treeNode.object){
                            		$scope.isOnline = treeNode.object.isdisabled==1?"下线":"上线";
                            	}
		  					});
                        },
                        
                       beforeRename: function (treeId, treeNode, newName, isCancel) {
                            var tipsContent = "请填写名称";
                            if(newName.length>8){
                                tipsContent = "名称过长（8字以内）！";
                            }
                            if((newName == "" || newName.length>8) && $scope.isOutTree){
                                //treeObj.removeNode(treeNode);
                                new w.Window().alert({
                                    title:"提示",
                                    content:tipsContent,
                                    hasAlertBtn:true,
                                    width:300,
                                    height:160,
                                    handler4AlertBtn:function(){
                                        var treeObj = $.fn.zTree.getZTreeObj("commonTree");
                                        treeObj.editName(treeNode);
                                        $scope.$apply(function(){
                                            $scope.isOutTree = false;
                                        })
                                        
                                    }
                                })
                                return false;
                            }else if( (newName == "" || newName.length>8) && !$scope.isOutTree){
                                return false;
                            }else if(newName.length>0&&newName.length<=8){
                                configLabelService.modifyNodeService({name:newName},function(response){
                                    return true;
                                },function (response, status) {
                                    return false;
                                })

                            }
                       },
		  				beforeDrag: function(treeId, treeNodes) {
		  					className = (className === "dark" ? "":"dark");
		  					for (var i=0,l=treeNodes.length; i<l; i++) {
		  						if (treeNodes[i].drag === false) {
		  							curDragNodes = null;
		  							return false;
		  						} else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
		  							curDragNodes = null;
		  							return false;
		  						}
		  					}
		  					curDragNodes = treeNodes;
		  					return true;
		  				},
		  				beforeDrop: function(treeId, treeNodes, targetNode, moveType, isCopy) {
		  					className = (className === "dark" ? "":"dark");
		  					return true;
		  				},
		  				beforeDragOpen: function(treeId, treeNode) {
		  					autoExpandNode = treeNode;
		  					return true;
		  				},
		  				onDrag: function(event, treeId, treeNodes) {
		  					className = (className === "dark" ? "":"dark");
		  				},
		  				onDrop: function(event, treeId, treeNodes, targetNode, moveType, isCopy) {
		  					className = (className === "dark" ? "":"dark");
                            //拖完后刷新下,可以更新View中的样式。
                            var zTree = $.fn.zTree.getZTreeObj("commonTree");
                            zTree.refresh();
		  				},
		  				onExpand: function(event, treeId, treeNode) {
		  					if (treeNode === autoExpandNode) {
		  						className = (className === "dark" ? "":"dark");
		  					}
		  				},
		  				onRightClick: function(event, treeId, treeNode) {
		  					$scope.$apply(function(){
                            	$scope.curFeature = treeNode.object;
                            	$scope.curNode = treeNode;
                            	if(treeNode.object){
                            		$scope.isOnline = treeNode.object.isdisabled==1?"下线":"上线";
                            	}
		  					});
		  					var zTree = $.fn.zTree.getZTreeObj("commonTree");
		  					if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
		  						zTree.cancelSelectedNode();
		  						showRMenu("root", event.clientX, event.clientY);
		  					} else if (treeNode && !treeNode.noR) {
		  						zTree.selectNode(treeNode);
		  						showRMenu("node", event.clientX, event.clientY);
		  					}
		  					var rMenu = $("#rMenu");
		  					function showRMenu(type, x, y) {
		  						$("#rMenu ul").show();
		  						if (type=="root") {
		  							$("#m_del").hide();
		  							$("#m_check").hide();
		  							$("#m_unCheck").hide();
		  						} else {
		  							$("#m_del").show();
		  							$("#m_check").show();
		  							$("#m_unCheck").show();
		  						}
                                //加上滚动条的高度，就可以正常显示
		  						$("#rMenu").css({"top":(y + 10 +  $(window).scrollTop()) + "px", "left":x+20+"px", "visibility":"visible"});

		  						$("body").bind("mousedown", onBodyMouseDown);
		  					}
		  					function hideRMenu() {
		  						if ($("#rMenu")) $("#rMenu").css({"visibility": "hidden"});
		  						$("body").unbind("mousedown", onBodyMouseDown);
		  					}
		  					function onBodyMouseDown(event){
		  						if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
		  							$("#rMenu").css({"visibility" : "hidden"});
		  						}
		  					}
                            //目录与叶子节点显示不同菜单
                            if(treeNode.object!=null && treeNode.object.isleaf==1){
                                $scope.$apply(function(){
                                    $scope.isP = false;
                                })
                            }else{
                                $scope.$apply(function(){
                                    $scope.isP = true;
                                })
                            }
                            
		  					
		  				}
		  			}
		  		
		  	};
		  	
            //添加标签
            $scope.addCFLabel = function(){
                $scope.isBtn = 'add';
                var obj = {}; 
                var _guid = uuid(32, 16);
                obj.feaTemGuid = _guid;
                if($scope.curNode){
                	//obj.feaTemDir = $scope.curNode.value;
                	obj.feaTemPguid = $scope.curNode.id;
                	if($scope.curNode.object){
                		obj.feaTemDir = $scope.curNode.object.feaTemDir;
                		obj.feaTemTitle = $scope.curNode.object.feaTemTitle;
                		obj.feaTemCode = $scope.curNode.object.feaTemCode;
                    	obj.feaTemPname = $scope.curNode.object.feaTemName;
                    	obj.feaTemPvalue = $scope.curNode.object.feaTemValue;
                    	obj.ttabName = $scope.curNode.object.ttabName;
                    	obj.tTabField = $scope.curNode.object.tTabField;
                    	obj.tFieldType = $scope.curNode.object.tFieldType*1;
                    	obj.tFeaExpress = $scope.curNode.object.tFeaExpress;
                    	obj.tabletype = $scope.curNode.object.tabletype*1;
                    	obj.tFeaParam = $scope.curNode.object.tFeaParam;
                    	obj.tMarkField = $scope.curNode.object.tMarkField;
                    	obj.tMarkFieldValue = $scope.curNode.object.tMarkFieldValue;
                    	obj.isfromCode = $scope.curNode.object.isfromCode;
                    	obj.isoption = $scope.curNode.object.isoption;
                	}
                	obj.isdel = 0;
                	obj.isdisabled = 1;
                	obj.isleaf = 1;
                }
                $scope.addTreeNode(obj);
            }
            //修改标签与分组
            $scope.modifyTreeNode = function(){
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                var treeNode = zTree.getSelectedNodes()[0];
                 zTree.editName(treeNode);
            }
		  	//添加分组
            $scope.addGroupTreeNode = function () {
            	$scope.isBtn = 'add';
                var obj = {}; 
                var _guid = uuid(32, 16);
                obj.feaTemGuid = _guid;
                if($scope.curNode){
                	obj.feaTemDir = $scope.curNode.value;
                	obj.feaTemPguid = $scope.curNode.id;
                	obj.tFieldType = 2;
                	obj.isdel = 0;
                	obj.isdisabled = 1;
                	obj.isleaf = 0;
                	obj.defcheck = 0;
                	obj.tabletype = 1;
                	obj.isfromCode = 0;
                }
            	
                $scope.isOutTree = false;
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                var newNode = { id:obj.feaTemGuid,name: "",isParent:true,object:obj};
                 
                if (zTree.getSelectedNodes()[0]) {
                    newNode.checked = zTree.getSelectedNodes()[0].checked;
                    newNode.pId = zTree.getSelectedNodes()[0].id;
                    zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
                } else {
                    zTree.addNodes(null, newNode);
                }
                var snode = zTree.getNodesByParam("name", "", null);
                
                zTree.editName(snode[0]);
                 $("#"+snode[0].tId+"_input").attr("placeholder","分组名称需在8字以内");
                 
            }
            //删除标签与分组
            $scope.removeTreeNode = function(){
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                var snodes =  zTree.getSelectedNodes();
                var tipsContent = "确认删除\""+snodes[0].name+"\"特征值？";
                if(snodes[0].isParent){
                    tipsContent = "确认删除\""+snodes[0].name+"\"特征项及其特征值？";
                }
                new w.Window().confirm({
                     title: "温馨提示",
                     width: 300,
                     height: 160,
                     content: tipsContent,
                     handler4ConfirmBtn:function(){
                    	 configLabelService.delLabelConf({feaTemGuid:snodes[0].id},function(response){
                    		 var zTree = $.fn.zTree.getZTreeObj("commonTree");
                        	 zTree.removeChildNodes(snodes[0]);
                        	 zTree.removeNode(snodes[0]);
                        	 
//                        	 toastr.success("删除成功！", '提示', {
//          						closeButton: true,
//          						timeOut: 3000});
                    	 },function(response){
                    		 
                    	 });
                    	 
                     },
                     hasCloseBtn: true
                 });
                
                
            }
            //标签上线、下线
            $scope.handleLabel = function(){
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                var snodes =  zTree.getSelectedNodes();
                var isdisabled;
                if($scope.curFeature.isdisabled==1){
                	isdisabled = 2
                }else{
                	isdisabled = 1
                }
                configLabelService.onlineLabelConf({feaTemGuid:snodes[0].id,isdisabled:isdisabled},function(response){
                    ($scope.isOnline =="下线")?($scope.isOnline = "上线"):($scope.isOnline = "下线");
                    $scope.curFeature.isdisabled = isdisabled;
                    var online = $scope.curFeature.isdisabled==1?"上线":"下线";
                    if($scope.curFeature.isleaf == 0){
                    	snodes[0].name = $scope.curFeature.feaTemTitle+"（"+online+"）";
                    	if(snodes[0].children && snodes[0].children.length > 0){
                    		angular.forEach(snodes[0].children,function(value,key){
                    			value.name = value.object.feaTemName+"（"+online+"）";
                    			zTree.updateNode(value);
                    		});
                    	}
                    }else
                    	snodes[0].name = $scope.curFeature.feaTemName+"（"+online+"）";
                    snodes[0].object = $scope.curFeature;
                    zTree.updateNode(snodes[0]);
                },function(){})
            }
            //显示Sql
            $scope.showSqls = function(s){
                $scope.isSql = false;
                $scope.sql = s;
            }
            
            $scope.addTreeNode = function (obj) {
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                var newNode = { name: ""};
                
                if (zTree.getSelectedNodes()[0]) {
                	var selectNode = zTree.getSelectedNodes()[0];
                	
                	if (selectNode.options == "add" ) {
                		 new w.Window().alert({
      	                   title:"提示",
      	                   width:300,
      	                   height:160,
      	                   content:"当前组织信息还未保存，请先保存！",
      	                   hasCloseBtn:true
      	                });
                		return;
                	}
                	
                	newNode = {
                		"id": obj.feaTemGuid,
                        "name": "新增节点",
                        "value": "newNode",
                        "pId": selectNode.id,
                        "object":obj
                        
                    };

                	zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
                	
                } else {
                    zTree.addNodes(null, newNode);
                }
//                var snode = zTree.getNodesByParam("id", _guid, null);
//                zTree.editName(snode[0]);
            }
			
		}]);

});


function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
}

function ajaxDataFilter(treeId, parentNode, responseData) {
	    if (responseData) {
	      for(var i =0; i < responseData.length; i++) {
	    	
	    	if(responseData[i].object){
	    		if(responseData[i].object.isdisabled==1){
	    			responseData[i].name += "(上线)";
	    		}else if(responseData[i].object.isdisabled==0){
	    			responseData[i].name += "(下线)";
	    		}
	    	}
	        
	      }
	    }
	    return responseData;
	};