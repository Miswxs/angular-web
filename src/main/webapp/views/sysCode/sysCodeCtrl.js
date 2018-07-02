define( [ 'app', 'window', 'jquery', 'sysCodeService','WdatePicker'],
		
		function(app, w, $) { app.register .controller( 'sysCodeController',
			['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', 
			 '$interval', '$timeout', 'sysCodeService', '$http',
			 
		function($location, $modal, $filter, $scope, $rootScope, $state,
				$interval, $timeout, sysCodeService, $http) {
				
			$scope.initializeController = function() {
				$scope.hasGetConditions = false;// 初始化默认没有加载属性列表
				$scope.getMyZnodes();
                $("#rMenu ul").bind('click',function(){
                	$("#rMenu ul").hide();
                });
			}
		    
			
		  	//初始化zTree数据
		  	$scope.getMyZnodes = function () {
		  	    sysCodeService.myZNnodes({id:""}, function (response, status) {
//		  	    	$scope.curOrgId = response.data.curOrg.orgguid;
//	            	$scope.tempOrgName = response.data.curOrg.orgname;
	                $scope.myZnodes = response.data.codeList;
//	                $scope.code = $scope.myZnodes[0];
		  	    }, function (response, status) {
		  	    })
		  	}
		  	
            //保存修改
            $scope.saveModify = function(code){
            	
            	var _parentNode = $scope.currNode.getParentNode();
            	
            	if (code.options != "add") {
            		code.options = "update";
            		var param = code;
                    sysCodeService.updateCode(param,function(response){
                    	var _orga = response.data.code;
                    	var zTree = $.fn.zTree.getZTreeObj("commonTree");
    		            //$scope.getMyZnodes();
    		            var node = zTree.getNodeByParam("codId",_orga.codId,null);
    		            if(node){
    		            	node.codType = _orga.codType;
    		            	node.codType1= _orga.codType1;
    		            	node.codType2= _orga.codType2;
    		            	node.codName= _orga.codName;
    		            	node.codValue= _orga.codValue;
    		            	node.codName1= _orga.codName1;
    		            	node.codName2= _orga.codName2;
    		            	node.codValue1= _orga.codValue1;
    		            	node.codValue2= _orga.codValue2;
    		            	node.codLevel= _orga.codLevel;
    		            	node.codIsleaf= _orga.codIsleaf;
    		            	node.codIsroot= _orga.codIsroot;
    		            	node.codParentvalue= _orga.codParentvalue;
    		            	node.codParentid= _orga.codParentid;
    		            	node.codOrder= _orga.codOrder;
    		            	node.codDyn= _orga.codDyn;
    		            	node.codSql= _orga.codSql;
    		            	node.codPath= _orga.codPath;
    		            	node.codNamepath= _orga.codNamepath;
    		            	node.codStatus= _orga.codStatus;
    		            	node.codParentname= _orga.codParentname;
    		            	node.codParentnamepath= _orga.codParentnamepath;
    		            	node.codParentpath= _orga.codParentpath;
    		            	node.options= _orga.options;
    		            	zTree.updateNode(node);
    		            }
    		            
//    		            toastr.success('修改码表成功！', '提示', {
//    						closeButton: true,
//    						timeOut: 3000
//    					});
                    },function(response, status){
                    	
//                    	toastr.warning('修改码表失败！', '提示', {
//    						closeButton: true,
//    						timeOut: 3000
//    					});
                    })
            	} else {
            		var param = code;
            		sysCodeService.insertCode(param, function(response){
            			var _orga = response.data.code;
                    	var zTree = $.fn.zTree.getZTreeObj("commonTree");
                    	
                    	var node = zTree.getNodeByParam("codId",_orga.codId,null);
    		            if(node){
    		            	node.codType = _orga.codType;
    		            	node.codType1= _orga.codType1;
    		            	node.codType2= _orga.codType2;
    		            	node.codName= _orga.codName;
    		            	node.codValue= _orga.codValue;
    		            	node.codName1= _orga.codName1;
    		            	node.codName2= _orga.codName2;
    		            	node.codValue1= _orga.codValue1;
    		            	node.codValue2= _orga.codValue2;
    		            	node.codLevel= _orga.codLevel;
    		            	node.codIsleaf= _orga.codIsleaf;
    		            	node.codIsroot= _orga.codIsroot;
    		            	node.codParentvalue= _orga.codParentvalue;
    		            	node.codParentid= _orga.codParentid;
    		            	node.codOrder= _orga.codOrder;
    		            	node.codDyn= _orga.codDyn;
    		            	node.codSql= _orga.codSql;
    		            	node.codPath= _orga.codPath;
    		            	node.codNamepath= _orga.codNamepath;
    		            	node.codStatus= _orga.codStatus;
    		            	node.codParentname= _orga.codParentname;
    		            	node.codParentnamepath= _orga.codParentnamepath;
    		            	node.codParentpath= _orga.codParentpath;
    		            	node.options= _orga.options;
    		            	zTree.updateNode(node);
    		            }
    		            
//    		            toastr.success(response.header.message, '提示', {
//     						closeButton: true,
//     						timeOut: 3000
//     					});
            		}, function(response){
//            			toastr.warning("添加码表失败！", '提示', {
//     						closeButton: true,
//     						timeOut: 3000
//     					});
            		});
            	}
            }
		  
            //默认选中第一个
            /* $scope.selectFirst = function(){
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                zTree.selectNode($scope.myZnodes[0]);
            }*/
		  	var newCount = 100;var log, className = "dark", curDragNodes, autoExpandNode;
           
		  	$scope.mySetting = {
//		  			async: {
//		  				enable: true,
//		  				contentType: "application/x-www-form-urlencoded",
//		  				dataType: "json",
//		  				autoParam: ["id"],
//		  				type: "post",
//		  				url: "syscode/getNodes"
//		  			},
		  			view: {
		  				removeHoverDom: function(treeId, treeNode) {
		  					$("#addBtn_"+treeNode.tId).unbind().remove();
		  				},
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
		  				key: {
			  				name: "codName"
			  			},
		  				simpleData: {
		  					enable: true,
		  					rootPId: null,
		  					idKey: "codId",
		  					pIdKey: "codParentid"
		  				}
		  			},
		  			callback: {
		  				onClick: function(e, treeId, treeNode){
		  					$scope.currNode = treeNode;
		  					var _tmp = {
	  							"codId": treeNode.codId,
	  							"codType": treeNode.codType,
	  							"codType1": treeNode.codType1,
	  							"codType2": treeNode.codType2,
	  							"codName": treeNode.codName,
	  							"codValue": treeNode.codValue,
	  							"codName1": treeNode.codName1,
	  							"codName2": treeNode.codName2,
	  							"codValue1": treeNode.codValue1,
	  							"codValue2": treeNode.codValue2,
	  							"codLevel": treeNode.codLevel,
	  							"codIsleaf": treeNode.children && treeNode.children.length > 0?1:0,
	  							"codIsroot": treeNode.codIsroot,
	  							"codParentvalue": treeNode.codParentvalue,
	  							"codParentid": treeNode.codParentid,
	  							"codOrder": treeNode.codOrder,
	  							"codDyn": treeNode.codDyn,
	  							"codSql": treeNode.codSql,
	  							"codPath": treeNode.codPath,
	  							"codNamepath": treeNode.codNamepath,
	  							"codStatus": treeNode.codStatus,
	  							"codParentname": treeNode.codParentname,
	  							"codParentnamepath": treeNode.getParentNode()?treeNode.getParentNode().codNamepath:null,
	  							"codParentpath": treeNode.getParentNode()?treeNode.getParentNode().codPath:null,
	  							"options": treeNode.options
		  					};
		  					$scope.$apply(function(){
		  						$scope.code = _tmp;
		  					});
                        },
                       beforeRename: function(treeId, treeNode, newName, isCancel) {
                            var tipsContent = "请填写组织名称";
                            if(newName.length>8){
                                tipsContent = "组织名称过长（10字以内）！";
                            }
                           /*失去，复得焦点*/
                            if(newName == ""||newName.length>8){
                                $("#"+treeNode.tId+"_input").blur();
                               new w.Window().alert({
                                   title:"提示",
                                   width:300,
                                   height:160,
                                   content:tipsContent,
                                   hasCloseBtn:true,
                                   handler4AlertBtn: function(){
                                        $("#"+treeNode.tId+"_input").focus();
                                   }
                                });
                                 
                                return false;
                            }else{
                                sysCodeService.modifyNodeService({name:newName},function(response){
                                    return true;
                                },function (response, status) {
                                    return false;
                                })

                            }
                        },
                       beforeDrag: function (treeId, treeNodes) {
                           return false;
                       },
                       beforeDrop:function (treeId, treeNodes, targetNode, moveType) {
                           return false;
                       },
		  			   onExpand: function(event, treeId, treeNode) {
		  					if (treeNode === autoExpandNode) {
		  						className = (className === "dark" ? "":"dark");
		  					}
		  				},
		  				onRightClick: function(event, treeId, treeNode) {
//		  					if(treeNode.isParent){
//		  						$scope.delShow = false;
//		  					}else{
//		  						$scope.delShow = true;
//		  					}
		  					
		  					$scope.currNode = treeNode;
		  					var _tmp = {
	  							"codId": treeNode.codId,
	  							"codType": treeNode.codType,
	  							"codType1": treeNode.codType1,
	  							"codType2": treeNode.codType2,
	  							"codName": treeNode.codName,
	  							"codValue": treeNode.codValue,
	  							"codName1": treeNode.codName1,
	  							"codName2": treeNode.codName2,
	  							"codValue1": treeNode.codValue1,
	  							"codValue2": treeNode.codValue2,
	  							"codLevel": treeNode.level,
	  							"codIsleaf": treeNode.codIsleaf,
	  							"codIsroot": treeNode.codIsroot,
	  							"codParentvalue": treeNode.codParentvalue,
	  							"codParentid": treeNode.codParentid,
	  							"codOrder": treeNode.codOrder,
	  							"codDyn": treeNode.codDyn,
	  							"codSql": treeNode.codSql,
	  							"codParentname": treeNode.codParentname,
	  							"codPath": treeNode.codPath,
	  							"codNamepath": treeNode.codNamepath,
	  							"codStatus": treeNode.codStatus
		  					};
		  					
		  					$scope.$apply(function(){
		  						$scope.code = _tmp;
		  					})
		  					
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
		  						$("#rMenu").css({"top":y+10+"px", "left":x+20+"px", "visibility":"visible"});

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
                           
		  				}
		  			}
		  	};
		  	
		  	$scope.changeOrgName = function() {
		  		$scope.code.codNamepath = $scope.code.codParentnamepath + "/" + $scope.code.codName;
		  	};
		  	
            $scope.addTreeNode = function () {
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                var newNode = { codName: ""};
                var _guid = uuid(32, 16);
                
                
                if (zTree.getSelectedNodes()[0]) {
                	var selectNode = zTree.getSelectedNodes()[0];
                	
                	if (selectNode.options == "add" ) {
                		 new w.Window().alert({
      	                   title:"提示",
      	                   width:300,
      	                   height:160,
      	                   content:"当前码表项还未保存，请先保存！",
      	                   hasCloseBtn:true
      	                });
                		return;
                	}
                	
                	newNode = {
						"codId": _guid,
						"codType": $scope.code.codType,
						"codType1": "",
						"codType2": "",
						"codName": "新增项",
						"codValue": "",
						"codName1": "",
						"codName2": "",
						"codValue1": "",
						"codValue2": "",
						"codLevel": $scope.code.codLevel*1+1*1,
						"codIsleaf": 1,
						"codIsroot": 0,
						"codParentname": $scope.code.codName,
						"codParentvalue": $scope.code.codValue,
						"codParentid": $scope.code.codId,
						"codParentnamepath": $scope.code.codNamepath,
						"codParentpath": $scope.code.codPath,
						"codOrder": "",
						"codDyn": 0,
						"codSql": "",
						"codPath": $scope.code.codPath + "." + _guid,
    		  			"codNamepath": "",
    		  			"codStatus": 1,
                        "options": "add"
                    };
                	zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
                } else {
                    zTree.addNodes(null, newNode);
                }
//                var snode = zTree.getNodesByParam("id", _guid, null);
//                zTree.editName(snode[0]);
            }
            $scope.removeTreeNode = function(){
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                var snodes =  zTree.getSelectedNodes();
                var tipsContent = "确认删除\""+snodes[0].codName+"\"组织？";
                if(snodes[0].isParent){
                    tipsContent = "确认删除\""+snodes[0].codName+"\"组织及其子组织？";
                }
                new w.Window().confirm({
                     title: "温馨提示",
                     width: 300,
                     height: 160,
                     content: tipsContent,
                     handler4ConfirmBtn:function(){
                    	 
                    	 var param = {codPath: snodes[0].codPath};
                    	 
                         sysCodeService.delCode(param, function(response){
                        	 if(response.header.code == -1){
//                        		 toastr.warning(response.header.message, '提示', {
//             						closeButton: true,
//             						timeOut: 3000
//             					});
                        	 }else{
                        		 zTree.removeChildNodes(snodes[0]);
                            	 zTree.removeNode(snodes[0]);
                            	 
//                            	 toastr.success("删除成功！", '提示', {
//              						closeButton: true,
//              						timeOut: 3000
//              					});
                        	 }
                        },function(response, status){
                        });
                     },
                     hasCloseBtn: true
                 });
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
