define( [ 'app', 'window', 'jquery', 'labelBusinessService' ,'WdatePicker'],
		function(app, w, $) { app.register .controller( 'labelBusinessController',
			['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', 
			 '$interval', '$timeout', 'labelBusinessService', '$http',
		function($location, $modal, $filter, $scope, $rootScope, $state,
				$interval, $timeout, labelBusinessService, $http) {
				
			$scope.initializeController = function() {
				$scope.hasGetConditions = false;// 初始化默认没有加载属性列表
				$scope.getLabelGroup();
				$scope.getTemplateList();
				$scope.getAllTempFromCode();
				$scope.getExpSelect();
			}
			
			
			//初始加载标签分组
			$scope.getLabelGroup = function(){
				labelBusinessService.getLabelGroup({}, function(response){
					$scope.labGroups = response.data;
					if($scope.labGroups.length > 0){
						$scope.labGroup = $scope.labGroups[0];
					}
					$scope.getLabelList(null);
				}, function(response){
					
				});
	        }
			
			$scope.mySetting = {
	                view: {
	                    selectedMulti: false,
	                    showIcon: false,
	                    showLine: false,
	                    dblClickExpand: false,
	                    addDiyDom: function (treeId, treeNode) {
	                        var spaceWidth = 20;
	                        var switchObj = $("#" + treeNode.tId + "_switch"),
	                            icoObj = $("#" + treeNode.tId + "_ico");
	                        switchObj.remove();
	                        icoObj.before(switchObj);

	                        if (treeNode.level > 0) {
	                            var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
	                            switchObj.before(spaceStr);
	                        }
	                    }

	                },
	                edit: {
	                    enable: true,
	                    showRemoveBtn: function (treeId, treeNode) {
	                        return false;
	                    },
	                    showRenameBtn: function (treeId, treeNode) {
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
	                        $scope.currentSelect = treeNode;
	                    },
	                    beforeClick: function (treeId, treeNode, clickFlag) {
//	                        $scope.$apply(function (){
//	                            labelBusinessService.initLabelList({"groupId":treeNode.groupId}, function (response, status) {
//	                                angular.forEach(response, function (value, key) {
//	                                    if (value.groupId == treeNode.groupId) {
//	                                         $scope.myInitLabel = value.labelList;
//	                                    }
//	                                })
//	                            }, function (response, status) {
//	                               
//	                            })
//
//	                        })
	                    	$scope.labGroup = treeNode;
	                    	$scope.getLabelList(null);
	                    },
	                    beforeDrag: function (treeId, treeNodes) {
	                        return false;
	                    },
	                    beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
	                        return false;
	                    }

	                }

	            };
			
			$scope.getTemplateList = function(){
				labelBusinessService.getTemplateList({},function(response){
					$scope.templates = response.data.featureNodes;
//					var arr = [];
//					for(var i=0;i<response.data.length;i++){
//						if($scope.isRoot(response.data,response.data[i])){
//							var obj = {};
//							obj.id = response.data[i].id;
//							obj.name = response.data[i].name;
//							obj.value = response.data[i].value;
//							obj.pId = response.data[i].pId;
//							obj.object = response.data[i].object;
//							obj.checked = false;
//							obj.children = $scope.getStructTemp(response.data,response.data[i]);
//							arr.push(obj);
//						}
//					}
					$scope.templateList = response.data.featureTree;
					
				},function(response){
					
				});
			}
			
			$scope.getAllTempFromCode = function(){
				labelBusinessService.getAllTempFromCode({},function(response){
					$scope.fromCodeFea = response.data;
				},function(response){
					
				});
			}
			
			
            //查询标签-->查询
            $scope.searchLabel = function(searchTxt){
            	$scope.getLabelList(searchTxt);
               // labelBusinessService.anyService({"key":$scope.keyword},function(){},function(){});
            }
            
            /**************添加标签**************/
		    $scope.addLabel = function(){
		        var modalInstance = $modal.open({
		            templateUrl: 'addlabel.html',
		            controller: addlabelCtrl,
		            windowClass: 'app-modal-window',
		            size: 'lg',
		            resolve: {
		                templates:function(){
                            return $scope.templates;
                        },
                        templateList:function(){
                            return $scope.templateList;
                        },
                        fromCodeFea:function(){
                        	return $scope.fromCodeFea;
                        },labGroup:function(){
                        	return $scope.labGroup;
                        }
		            }
		        });
		        modalInstance.result.then(function (label) {
		        	labelBusinessService.submitLabel(label,function(response){
	   					if(response.header.code == -1){
	   					}else{
	   						var countName = $scope.labGroup.name;
	   						var count = countName.substring(countName.indexOf("(")+1,countName.indexOf(")"));
	   						countName = countName.substring(0,countName.indexOf("(")+1)+(count*1+1)+")";
	   						var zTree = $.fn.zTree.getZTreeObj("commonTree");
	   						$scope.labGroup.name = countName;
	   						var node = zTree.getNodeByParam("value",$scope.labGroup.value,null);
	   						if(node){
	   							node.name = countName;
	   							zTree.updateNode(node);
	   						}
	   						$scope.getLabelList(null);
	   					}
	   				},function(response){
	                   })
		        }, function () { });
		    }
		    
		    var addlabelCtrl = function ($scope,$modalInstance,templates,templateList,fromCodeFea,labGroup) {
		    	
		    	$scope.templates = templates;
		    	$scope.templateList = templateList;
		    	$scope.fromCodeFea = fromCodeFea;
		    	
		    	//下拉树类型设置
                $scope.myRoleSetting = {
                    view: {
                        selectedMulti: false,
                        showIcon:false,
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
                       },onClick : function(event, treeId, treeNode){
                    	   $scope.getTempFromCodeByPid(treeId, treeNode);
                       }

                    }
                };
                
                $scope.getSelectByCstType = function(cstType){
                	angular.forEach(templateList,function(value,key){
                		if(value.value == cstType){
                			$scope.templateList = value.children;
                		}
                	});
                }
		    	
		    	$scope.roleToken = 1;
		    	$scope.customTypes = templateList;
                $scope.cLabel = {};
                $scope.cLabel.id = uuid(32,16);
 				$scope.cLabel.type = 2;
 				$scope.cLabel.customerType = "1";
 				$scope.getSelectByCstType($scope.cLabel.customerType+"");
			    $scope.cLabel.order = "YW"+getCurrentDate()+randomWord(4);
			    $scope.cLabel.roles = [{
			    	"id": uuid(32,16),
			    	"ruleFrameName":"规则"+$scope.roleToken,
				    "condiction": [{
				        "id": uuid(32,16),
				        "operObj": [{"feature":"","options":$scope.templateList}],
				        "curSelect":{},
				        "feaObj":[],
				        "curFeaObj":[],
				        "pfeaList":[],
				        "feaRuleSymbol":"等于",
				        "isTree":false,
					    "rightName":"" ,
					    "rightValue":"",
					    "rigthId":"",
					    "value":""
				    }]
			    	
			    }];
                $scope.ismainwindow = 'add';
                
                $scope.changeCstType = function(labCstType){
                	$scope.getSelectByCstType(labCstType);
                	$scope.roleToken = 1;
                	$scope.cLabel.roles = [{
       				    "id": uuid(32,16),
       				    "ruleFrameName":"规则"+$scope.roleToken,
       				    "condiction": [{
       				        "id": uuid(32,16),
       				        "operObj": [{"feature":"","options":$scope.templateList}],
       				        "curSelect":{},
       				        "feaObj":[],
       				        "curFeaObj":[],
       				        "pfeaList":[],
       				        "feaRuleSymbol":"等于",
       				        "isTree":false,
       				        "rightName":"" ,
       					    "rightValue":"",
       					    "rigthId":"",
    					    "value":""
       				    }]
       				}];
                }
                
                $scope.getTempFromCodeByPid = function(treeId,treeNode){
    				var rootIsChecked = false;
    				if(treeNode.checked && treeNode.check_Child_State!=1){
    					rootIsChecked = true;
    	    		}
    				if(!treeNode.isParent){
    					labelBusinessService.getTempFromCodeByPid({pId:treeNode.id},function(response){
    						if(response.data && response.data.length > 0){
    				    		var zTree = $.fn.zTree.getZTreeObj(treeId);
    				    		zTree.addNodes(treeNode, response.data);
    				    		if(rootIsChecked){
    				    			zTree.checkNode(treeNode, true, true);
    				    		}
    				    	}
    					},function(response){
    						
    					});
    				}else{
    					var zTree = $.fn.zTree.getZTreeObj(treeId);
    					if(treeNode.open){
    						zTree.expandNode(treeNode, false, true, true);
    					}else
    						zTree.expandNode(treeNode, true, true, true);
    				}
    				
    			}
                
                $scope.getFeaObjs = function(codType){
               	 var feaObj = [];
               	 angular.forEach($scope.fromCodeFea,function(value,key){
               		 if(value.codType == codType){
               			 //var obj = clone1(value.children);
               			 feaObj = value.children;
               		 }
               	 });
               	 return feaObj;
                }
                
                $scope.getTempFromCode = function(codType,ruleOptId,ruleId){
               	 labelBusinessService.getTempFromCode({codType:codType},function(response){
               		 angular.forEach($scope.cLabel.roles,function(value,key){
               			 if(value.id == ruleId){
               				 angular.forEach(value.condiction,function(val,k){
               					 if(val.id == ruleOptId){
               						 val.feaObj = response.data;
               					 }
               				 });
               			 }
               		 });
               	 },function(response){
               		 
               	 });
                }
                
                $scope.changeSelect = function(ruleOptId,ruleId,opt,oIndex){
               	 angular.forEach($scope.cLabel.roles,function(value,key){
    					if(value.id == ruleId){
    						angular.forEach(value.condiction,function(val,k){
    		 					if(val.id == ruleOptId){
    		 						if(opt.object && opt.object.isleaf==0){
    		 							val.operObj = val.operObj.slice(0,oIndex+1);
    		 							if(opt.object.isfromCode==1){
    		 								//$scope.getTempFromCode(opt.object.tsourcechannel,ruleOptId,ruleId);
    		 								val.feaObj = $scope.getFeaObjs(opt.object.tsourcechannel);
    		 								val.isTree = true;
    		 							}else{
    		 								val.feaObj = clone1(opt.children);
    		 								val.isTree = false;
    		 							}
    		 						}
    		 						else{
    		 							val.feaObj = [];
   		 							val.rightName = "";
   		 							val.rightValue = "";
   		 							val.rightId="";
    		 							if(val.curSelect.pId && opt.pId && val.curSelect.pId==opt.pId && val.curSelect.children.length>0){
    		 								var optIsLeaf = false;
    		 								if(val.curSelect.object && val.curSelect.object.isleaf==0){
    		 									optIsLeaf = true;
    		 								}
    		 								if(!optIsLeaf){
    		 									val.operObj.pop();
    		 								}
    		 							}else if(oIndex+1 < val.operObj.length){
    		 								val.operObj = val.operObj.slice(0,oIndex+1);
    		 							}
    		 							if(opt.children && opt.children.length > 0){
    		 								var opts = clone1(opt.children);
    		 								val.operObj.push({"feature":"","options":opts});
    		 							}
    		 						}
    		 						val.curSelect = clone1(opt);
    		 					}
    		 				})
    					}
    				})
    				
                }
                
   			//添加标签-->添加标签重置
   			$scope.resetRoles = function(){
   				$scope.cLabel.id = uuid(32,16);
   				$scope.cLabel.name = "";
   				$scope.cLabel.type = 2;
   				$scope.cLabel.customerType = 1;
   				$scope.cLabel.order = "YW"+getCurrentDate()+randomWord(4);
//   				$scope.cLabel.selectedLevelOne = "";
//   				$scope.cLabel.selectedLevelTwo = "";
//   				$scope.cLabel.selectedLevelThree = "";
   				$scope.cLabel.describe = "";
   				$scope.roleToken = 1;
   				$scope.cLabel.roles = [{
   				    "id": uuid(32,16),
   				    "ruleFrameName":"规则"+$scope.roleToken,
   				    "condiction": [{
   				        "id": uuid(32,16),
   				        "operObj": [{"feature":"","options":$scope.templateList}],
   				        "curSelect":{},
   				        "feaObj":[],
   				        "curFeaObj":[],
   				        "pfeaList":[],
   				        "feaRuleSymbol":"等于",
   				        "isTree":false,
   				        "rightName":"" ,
   					    "rightValue":"",
   					    "rigthId":"",
					    "value":""
   				    }]
   				}];
   			}
               //添加标签-->提交添加标签
   			$scope.submitRoles = function(){
   				if(!$scope.cLabel.name || $scope.cLabel.name==""){
   					new w.Window().alert({
   			             title: "提示",
   			             width: 300,
   			             height: 160,
   			             content: '请输入标签名称！',
   			             hasCloseBtn: true
   			         });
   					return ;
   				}
   				
   				var label = {};
   				label.labGuid = $scope.cLabel.id;
   				label.labName = $scope.cLabel.name;
   				label.labCode = $scope.cLabel.order;
   				label.labInfo = $scope.cLabel.describe;
   				label.labType = $scope.cLabel.type;
   				label.labDir = labGroup.value;
   				label.labCstType = $scope.cLabel.customerType*1;
   				label.querysql = "";
   				label.ruleFrames = [];
   				
   				angular.forEach($scope.cLabel.roles,function(value,key){
   					var ruleFrame = {};
   					ruleFrame.feaGuid = value.id;
   					ruleFrame.feaTitle = value.ruleFrameName;
   					ruleFrame.labGuid = $scope.cLabel.id;
   					ruleFrame.feaIsrule = 1;
   					ruleFrame.feaOrder = key+1;
   					ruleFrame.ruleList = [];
//   					if(label.querysql==""){
//   						label.querysql = label.querysql+"select cstGUID,cstName," +"\'"+$scope.cLabel.id+"\' labelGUID,"+"\'"+$scope.cLabel.name+"\' labelName,"+$scope.cLabel.type+"  lab_type,"+
//   								"Current_Age cstage," +"concat(DATE_FORMAT (curdate() ,\'%Y-%m-%d\'),time_format(CURTIME(),\' %H:%i:%s\')) createTime,"+
//   								"mobileTel firsttel,email,Postal_Address addres,0 clickNum from r_t_e_cst where ("
//   					}else
//   						label.querysql = label.querysql+" or ("
//   					var optSql = "";
   					angular.forEach(value.condiction,function(val,k){
   						var rule = {};
   						rule.feaGuid = val.id;
   						rule.feaPguid = value.id;
   						rule.feaTmpGuid = val.curSelect.id;
   						rule.feaTitle = val.curSelect.name;
   						rule.feaCode = val.curSelect.value;
   						rule.labGuid = $scope.cLabel.id;
   						rule.feaRuleSymbol = val.feaRuleSymbol;
   						rule.tSourcechannel = val.curSelect.object.tsourcechannel;
   						rule.feaValue = val.value?val.value:null;
   						rule.feaTabName = val.curSelect.object.ttabName;
						rule.feaTabField = val.curSelect.object.tTabField;
						rule.tableType = val.curSelect.object.tabletype;
						rule.tMarkField = val.curSelect.object.tMarkField!=null?val.curSelect.object.tMarkField:'';
						rule.tMarkFieldValue = val.curSelect.object.tMarkFieldValue!=null?val.curSelect.object.tMarkFieldValue:'';
   						rule.feaIsrule = 0;
   						rule.feaOrder = key+1;
   						rule.feaRuleOrder = 0;
   						rule.isoption = val.curSelect.object.isoption;
   						rule.ruleValueList = [];
   						
   						if(val.isTree){
							var treeObj = $.fn.zTree.getZTreeObj(val.id+"tr");
		                    var nodes = treeObj.getCheckedNodes(true);
		                    
		                    angular.forEach(val.curFeaObj, function (obj, i) {
		                    	var ruleValue = {};
								ruleValue.feaGuid = uuid(32,16);
								ruleValue.feaPguid = val.id;
								ruleValue.feaTmpGuid = obj.id;
								ruleValue.feaTitle = val.curSelect.name;
								ruleValue.feaCode = val.curSelect.value;
								ruleValue.labGuid = $scope.cLabel.id;
								ruleValue.feaRuleSymbol = val.feaRuleSymbol;
								ruleValue.feaName = obj.name;
								ruleValue.feaValue = obj.value;
								ruleValue.feaTabName = val.curSelect.object.ttabName;
								ruleValue.feaTabField = val.curSelect.object.tTabField;
								ruleValue.tSourcechannel = val.curSelect.object.tsourcechannel;
								ruleValue.feaIsrule = 0;
								ruleValue.feaOrder = key+1;
								ruleValue.feaRuleOrder = i+1;
								
								rule.ruleValueList.push(ruleValue);
		                    });
						}else{
							angular.forEach(val.feaObj,function(v,index){
								if(v.checked){
									var ruleValue = {};
									ruleValue.feaGuid = uuid(32,16);
									ruleValue.feaPguid = val.id;
									ruleValue.feaTmpGuid = v.id;
									ruleValue.feaTitle = val.curSelect.name;
									ruleValue.feaCode = val.curSelect.value;
									ruleValue.labGuid = $scope.cLabel.id;
									ruleValue.feaRuleSymbol = val.feaRuleSymbol;
									if(v.object){
										ruleValue.feaName = v.object.feaTemName;
										ruleValue.feaValue = v.object.feaTemValue;
										ruleValue.feaTabName = v.object.tTabName;
										ruleValue.feaTabField = v.object.tTabField;
										ruleValue.feaSqlExpress = v.object.tFeaExpress;
										ruleValue.feaSqlParam = v.object.tFeaParam;
									}
									ruleValue.feaIsrule = 0;
									ruleValue.feaOrder = key+1;
									ruleValue.feaRuleOrder = index+1;
									
									rule.ruleValueList.push(ruleValue);
								}
							});
						}
   						ruleFrame.ruleList.push(rule);
   					});
   					label.ruleFrames.push(ruleFrame);
   				});
   				
   				$modalInstance.close(label);
   				
   			}
   			//添加标签-->添加规则集合，初始也只有一行规则
   			$scope.addRoles = function(){
   				if($scope.roleToken >= 5){
   					return false;
   				}
   				$scope.roleToken += 1; 
   				$scope.cLabel.roles.push({
   					"id":uuid(32,16),
   					"ruleFrameName":"规则"+$scope.roleToken,
   					"condiction":[{
   				        "id": uuid(32,16),
   				        "operObj": [{"feature":"","options":$scope.templateList}],
   				        "curSelect":{},
   				        "feaObj":[],
   				        "curFeaObj":[],
   				        "pfeaList":[],
   				        "feaRuleSymbol":"等于",
   				        "isTree":false,
   				        "rightName":"" ,
   					    "rightValue":"",
   					    "rigthId":"",
					    "value":""
   				    }]
   					})
   			}
   			//添加标签-->删除规则事件
   			$scope.removeRoles = function(currentId){
   				angular.forEach($scope.cLabel.roles,function(value,key){
   					if(value.id == currentId){
   						$scope.cLabel.roles.splice(key,1);
   						return;
   					}
   				})
   			}
   			//添加标签-->行规则的删除
   			$scope.removeRowRoles = function(obj){
   					angular.forEach($scope.cLabel.roles,function(value,key){
   						angular.forEach(value.condiction,function(son,s){
   							if(son.id == obj.id){
   								value.condiction.splice(s,1);
   								return;
   							}
   						})
   					});
   			}
   			//添加标签-->行规则添加
   			$scope.addRowRoles = function(obj){
                   if(obj.length >= 10)return;
   				obj.push({
   			        "id": uuid(32,16),
   			        "operObj": [{"feature":"","options":$scope.templateList}],
   			        "curSelect":{},
   			        "feaObj":[],
   			        "curFeaObj":[],
   			        "pfeaList":[],
   			        "feaRuleSymbol":"等于",
   			        "rightName":"" ,
   				    "rightValue":"" ,
   				    "rigthId":"",
				    "value":""  
   			    });
   			}
   			
   			//添加标签-->表单多选 下拉DropDown
   			$scope.clickDropdown = function(myRole){
   				//myRole.isdropdown = !myRole.isdropdown;
//   				console.log(myRole);
//                   var tempArray = myRole.rigthId;
//                       angular.forEach(myRole.feaObj, function(tv, tk) {
//                       	if(tempArray.indexOf(tv.id+"") != -1){
//                       		tv.checked = true;
//                       	}
////                           tv.current = false;
////                           angular.forEach(tempArray, function(value, key) {
////                               if (value == tv.title) {
////                                   tv.current = true;
////                               }
////                           })
//                       })
   			}
   			$scope.leaveDropdown = function(myRole){
   				myRole.isdropdown = false;
   			}
   			//添加标签-->提交多选下拉
   			$scope.submitSelect = function(myRole){
   				
                   myRole.isdropdown = false;
                   myRole.rightName = "";
                   myRole.rightValue = "";
                   myRole.rigthId="";
                   myRole.curFeaObj = [];
                   if(myRole.isTree){
   					var treeObj = $.fn.zTree.getZTreeObj(myRole.id+"tr");
                       var nodes = treeObj.getCheckedNodes(true);
                       angular.forEach(nodes, function (value, key) {
                       	var node = treeObj.getNodesByParam("id", value.pId, null);
                       	if(value.level==0 && value.check_Child_State!=1){
                       		myRole.rightName += value.name + ";";
   	                        myRole.rightValue += value.value + ";";
   	                        myRole.rigthId += value.id+";";
   	                        myRole.curFeaObj.push(value);
                       	}
                       	if(node && node[0] && node[0].check_Child_State == 1 && value.check_Child_State!=1){
                       		myRole.rightName += value.name + ";";
       	                    myRole.rightValue += value.value + ";";
       	                    myRole.rigthId += value.id+";";
       	                    myRole.curFeaObj.push(value);
                       	}
                       	
                       });
   				}else{
   					angular.forEach(myRole.feaObj, function (value, key) {
   	                    if (value.checked) {
   	                        myRole.rightName += value.name + ";";
   	                        myRole.rightValue += value.id + ";";
   	                        myRole.rigthId += value.id+";";
   	                        myRole.curFeaObj.push(value);
   	                        //value.checked = false;
   	                    }
   	                })
   				}
   			}
   			
   			$scope.cancel = function(){
   				$modalInstance.dismiss('cancel');
   			}
   			
		 }
             
/********************************************添加标签结束**********************************************/             
	
		   //提取数据-->字段数据、跟踪类型、跟进字段
		   $scope.getExpSelect = function(){
  		        	labelBusinessService.getExpSelect({},function(response){
  		        		$scope.expFieldList = response.data.expFieldList;
  		        		$scope.followFieldList = response.data.followFieldList;
  		        		$scope.expUserForList = response.data.expUserForList;
  		        		$scope.projSelect = response.data.projSelect;
  		        		//tempFieldInfo = response;
  		        	},function(response,status){})
  		    }
		    
			//切换页面与添加标签
			$scope.ismainwindow = 'showlabel';
			$scope.changeMainWindow = function(){
				$scope.ismainwindow = 'showlabel';
			}
			//初始加载标签
			$scope.getLabelList = function(searchTxt){
				labelBusinessService.getLabelList({searchTxt:searchTxt,labGroup:$scope.labGroup.value},function(response){
				$scope.myInitLabel = response.data;
                $scope.isEmpty();
			},function(response,status){
			})}
			//删除选项蒙板
			$scope.deleteMask  = false;
			$scope.showDeleteMask = function(){
                   $scope.deleteMask = !$scope.deleteMask;
				
			}
            $scope.isEmpty = function(){
                //没有内容就不显示删除按钮
                if($scope.myInitLabel.length == 0){
                    $scope.hasLabel = false;
                }else{
                    $scope.hasLabel = true;
                }
            }
			//添加已选删除标签
			$scope.deleteSelected = [];
			$scope.addLabelDelete = function(comm){
				comm.showdelete = !comm.showdelete;
				var bool = false;
				if(comm.showdelete){
					if($scope.deleteSelected.length>0){
						angular.forEach($scope.deleteSelected,function(value,key){
							if(value === comm){ 
								bool = true; 
							}
						});
					}
					if(!bool){
						$scope.deleteSelected.push(comm);
					}
				}else{
					angular.forEach($scope.deleteSelected,function(value,key){
						if(value === comm){ 
							$scope.deleteSelected.splice(key,1);
						}
					})
				}
			}
			//执行删除标签
			$scope.deleteLabel = function(){
				if($scope.deleteSelected.length < 1){
					new w.Window().alert({
			             title: "提示",
			             width: 300,
			             height: 160,
			             content: '请选中需要删除的标签！',
			             hasCloseBtn: true
			         });
				}else{
					new w.Window().confirm({
	                    width:400,
	                    height:200,
	                    content:"删除后该标签以及标签的特征都会被删除，确定要删除？",
	                    title:"提示",
	                    text4ConfirmBtn:"确定",
	                    text4CancelBtn:"取消",
	                    handler4ConfirmBtn:function(){
	                    	labelBusinessService.delLabelBusiness($scope.deleteSelected,function(response){
	                    		var countName = $scope.labGroup.name;
		   						var count = countName.substring(countName.indexOf("(")+1,countName.indexOf(")"));
		   						countName = countName.substring(0,countName.indexOf("(")+1)+(count*1-$scope.deleteSelected.length)+")";
		   						var zTree = $.fn.zTree.getZTreeObj("commonTree");
		   						$scope.labGroup.name = countName;
		   						var node = zTree.getNodeByParam("value",$scope.labGroup.value,null);
		   						if(node){
		   							node.name = countName;
		   							zTree.updateNode(node);
		   						}
		   						$scope.deleteSelected = [];
	                    		$scope.isEmpty();
	                            $scope.deleteMask = false;
	                            $scope.getLabelList(null);
	        				},function(response,status){
	        				});
	                    },
	                    handler4CancelBtn:function(){
	                    }
	                    
	                });
				}
				
				
			}
			
            //提取标签
            $scope.extractLabel = function(label){
            	$scope.label = label;
                $scope.ismainwindow = 'extract';
 				$scope.extract = {
 		        		"order":("BJTS"+getCurrentDate()+randomWord(4)),
                        "useType":$scope.expUserForList[0],
                        "isdropdown":false,
                        "projShow":true,
                        "startDate":null,
                        "endDate":null,
                        "useTypeSonName":"",
                        "useTypeSonId":""
 			        };
                 //把外面的Scope值赋值到里面的Scope中去
                 //存储选中的标签
                 $scope.extract.labelName = label.labName;
                 $scope.extract.yfollow = 0;
                 $scope.extract.useForList = $scope.expUserForList;
                 $scope.extract.fieldInfo = $scope.expFieldList;
                 $scope.extract.followFieldInfo=$scope.followFieldList;
                 $scope.extract.lastExtractTime = label.lastexptime;
                 $scope.extract.projSelect = $scope.projSelect;
               
            }
            //提交提取标签
            $scope.saveModalExtract = function (extract) {
            	var expFieldList = [];
            	var followFieldList = [];
            	angular.forEach(extract.fieldInfo,function(value,key){
            		if(value.checked){
            			expFieldList.push(value);
            			value.checked = false;
            		}
            	});
            	if(expFieldList == null || expFieldList.length == 0){
            		new w.Window().alert({
            			title:"提示",
            			content:"请选择提取客户的字段名称",
            			width:300,
            			height:160,
            			hasCloseBtn:true
            		});
            		return false;
            	}
            	
            	if(extract.useType.value=="forSale" && (extract.useTypeSonId == null || extract.useTypeSonId == '')){
            		new w.Window().alert({
                        title:"提示",
                        content:"请选择项目",
                        width:300,
                        height:160,
                        hasCloseBtn:true
                    });
            		return false;
            	}
            	
            	if(extract.yfollow == 1){
            		if(typeof(extract.startDate) == "undefined" || extract.startDate == null || typeof(extract.endDate) == "undefined" || extract.endDate == null){
            			new w.Window().alert({
                            title:"提示",
                            content:"请选择跟进周期",
                            width:300,
                            height:160,
                            hasCloseBtn:true
                        });
            			return false;
            		}
            		
                	angular.forEach(extract.followFieldInfo,function(value,key){
                		if(value.checked){
                			followFieldList.push(value);
                			value.checked = false;
                		}
                	});
                	if(followFieldList == null || followFieldList.length == 0){
            			new w.Window().alert({
                            title:"提示",
                            content:"请选择跟进字段名称",
                            width:300,
                            height:160,
                            hasCloseBtn:true
                        });
                		return false;
            		}
            	}
            	
            	if($scope.label.exectime == null){
            		$scope.startNewJob(extract, expFieldList, followFieldList, 2);
            	}else{
            		var content = "上次数据更新时间"+$scope.label.exectime+"，您可以选择马上提取上次的客户信息，也 可选择提取最新的客户信息，但提取最新客户需要等待数据更新任务执行完成后才能导出。"
                    //content = "请您等待数据更新任务执行完成后，再导出客户数据，谢谢。";
                    new w.Window().confirm({
                        width:400,
                        height:200,
                        content:content,
                        title:"提示",
                        hasCloseBtn:true,
                        text4ConfirmBtn:"上次客户",
                        text4CancelBtn:"最新客户",
                        handler4ConfirmBtn:
                        	function(){
                            	//执行导出
                        		$scope.startNewJob(extract, expFieldList, followFieldList, 1);
                        	},
                        handler4CancelBtn:
                        	function(){
                        		$scope.startNewJob(extract, expFieldList, followFieldList, 2);
                        	}
                        
                    });
            	}
                    
            }
            
            $scope.startNewJob = function(extract, expFieldList, followFieldList, isNew){
            	var _guid = uuid(32,16);
             	var _job = {
         			"jobGuid" : _guid,
         			"jobLabGuid" : $scope.label.labGuid,
         			"jobOddNumber" : extract.order,
         			"jobLabName" : $scope.label.labName,
         			"jobLabType" : $scope.label.labType,
         			"jobStatus" : 0,
         			"jobExpField" : 1,
         			"jobFor" : extract.useType.value,
         			"jobForname" : extract.useType.name,
         			"jobProjguid" : extract.useTypeSonId,
         			"jobProjname" : extract.useTypeSonName,
         			"jobInfo" : extract.jobInfo,
         			"jobTrack" : extract.yfollow,
         			"jobTrackStarttime" : extract.yfollow==1?extract.startDate:null,
                 	"jobTrackEndtime" : extract.yfollow==1?extract.endDate:null,
         			"jobTrackField" : 2,
         			"jobResCount" : 0,
         			"jobCreator" : $rootScope.userName,
         			"jobCreatorid" : $rootScope.userId,
         			"expFieldList":expFieldList,
         			"followFieldList":followFieldList,
         			"isNew":isNew
             	};
             	
             	labelBusinessService.expLabelData(_job, function(res) {
             		$scope.ismainwindow = 'showlabel';
     				$scope.extract = {};
     				$scope.getLabelList(null);
//             		toastr.success("操作成功", '提示', {
//     					closeButton: true,
//     					timeOut: 3000
//     				});
             	}, function(res) {
//             		toastr.warning("操作失败", '提示', {
//     					closeButton: true,
//     					timeOut: 3000
//     				});
             	});
                //window.location.href = "#/app/label/queryExtract";
            }
            
            $scope.selectUseType = function(useType){
            	if(useType.value=="forSale"){
            		$scope.extract.projShow = true;
            	}else{
            		$scope.extract.projShow = false;
            	}
            }
            
            $scope.searchProj = function(projName){
            	var projs = [];
            	angular.forEach($scope.projSelect,function(value,key){
            		if(value.name.indexOf($.trim(projName))!=-1){
            			projs.push(value);
            		}
            	});
            	$scope.extract.projSelect = projs;
            }
            
            $scope.selectProj = function(proj){
            	$scope.extract.useTypeSonName = proj.name;
            	$scope.extract.useTypeSonId = proj.id;
            	$scope.extract.isdropdown = false;
            }
            
            $scope.showSelect = function(){
            	$scope.extract.isdropdown = true;
            }
            $scope.hideSelect = function(){
            	$scope.extract.isdropdown = false;
            }
            //取消提取标签
            $scope.cancel = function () {
                $scope.ismainwindow = 'showlabel';
                angular.forEach($scope.extract.fieldInfo,function(value,key){
                    if(value.current){
                        value.current = false;
                    }
                })
            };
		  //查看标签详细
//		    $scope.seeLabelModal = function (label) {
//                //给规则赋值
//                labelBusinessService.anyService(label,function(response){
//                    //遍历规则
//                    angular.forEach(label.roles,function(value,key){
//                        //遍历行规则
//                        angular.forEach(value.condiction,function(v,k){
//                            //遍历初始前面两个级联的下拉
//                            angular.forEach($scope.selectInfo1,function(sv,sk){
//                                if(v.groupKey == sv.groupKey){
//                                    //让第一个下拉选中
//                                    v.selectedLevelOne = sv;
//                                    //遍历子集
//                                    angular.forEach(v.selectedLevelOne.LevelTwo,function(msv,msk){
//                                        //让第二个下拉选中
//                                        if(v.leftKey == msv.leftKey){
//                                            v.selectedLevelTwo = msv;
//                                        }
//                                    })
//                                }
//                                    
//                            });
//                            //第二个下拉选中类型，推出后面的内容
//                            if(v.operType == "oper1"){
//                                //赋值操作符下拉
//                                v.operObj = $scope.initSelectInfo2.oper1;
//                                //让第三个下拉选中
//                                angular.forEach($scope.initSelectInfo2.oper1,function(tv,tk){
//                                    if(v.operKey == tv.operKey)
//                                     v.selectedLevelThree = tv;
//                                })
//                                //根据特征对应的存值字段来取相应的类型数据
//                                angular.forEach($scope.mySelectObj,function(jv,jk){
//                                    if(v.selectCode == jv.selectCode){
//                                        //赋值给下拉对象
//                                        v.sinSelectObj = jv.selectList;
//                                        angular.forEach(v.sinSelectObj,function(dv,dk){
//                                            //赋值选中项
//                                            if(v.rightValue == dv.name) v.rightValue = dv;
//                                        })
//                                    }
//                                })
//                            }
//                            if(v.operType == "oper2"){
//                                //赋值操作符下拉
//                                 v.operObj = $scope.initSelectInfo2.oper2;
//                                //让第三个下拉选中
//                                angular.forEach($scope.initSelectInfo2.oper2,function(tv,tk){
//                                    if(v.operKey == tv.operKey)
//                                     v.selectedLevelThree = tv;
//                                })
//                                //根据特征对应的存值字段来取相应的类型数据
//                                angular.forEach($scope.mySelectObj,function(jv,jk){
//                                    if(v.selectCode == jv.selectCode){
//                                        v.sinSelectObj = jv.selectList;
//                                        //把多选拆分
//                                        var temparray = (v.rightValue).split(";")
//                                        angular.forEach(v.sinSelectObj,function(dv,dk){
//                                            angular.forEach(temparray,function(gv,gk){
//                                                //让每个项选中
//                                                if(gv == dv.title){
//                                                    dv.current = true;
//                                                }
//                                            })
//                                        })
//                                    }
//                                })
//                            }
//                           
//                        })
//                    })
//                    //传给模态
//                    $scope.seeLabelModalOpen(label);
//                },function(response,status){})
//		    };
		    $scope.seeLabelModalOpen = function(label){
		        var modalInstance = $modal.open({
		            templateUrl: 'seeLabelDetail.html',
		            controller: seeLabelInstanceCtrl,
		            windowClass: 'app-modal-window',
		            size: 'lg',
		            resolve: {
		            	label: function () {
		                    return label;
		                },
		                templates:function(){
                            return $scope.templates;
                        },
                        templateList:function(){
                            return $scope.templateList;
                        },
                        fromCodeFea:function(){
                        	return $scope.fromCodeFea;
                        }
		            }
		        });
		        modalInstance.result.then(function (label) {
		        	labelBusinessService.updateLabelBusiness(label,function(response){
		        		$scope.getLabelList(null);
                    },function(response){
                    })
		        }, function () {});
		    }

		var seeLabelInstanceCtrl = function ($scope,$modalInstance,label,templates,templateList,fromCodeFea) {
				$scope.CLDetail = {};
				$scope.CLDetail.label = label;
				$scope.customTypes = templateList;
				
				var tempList;
                angular.forEach(templateList,function(value,key){
                	if(value.value == (label.labCstType+"")){
                		tempList = value.children;
                	}
                });
                templateList = tempList;
				
				$scope.CLDetail.label.customerType = $scope.CLDetail.label.labCstType+"";
				$scope.CLDetail.rules = [];
				
				//查询标签已选特征
				labelBusinessService.getLabelDeatil({labGuid:label.labGuid},function(response){
					if(response.data != null && response.data.length > 0){
						angular.forEach(response.data,function(value,key){
							if(value.feaIsrule == 1){
								var rule = {};
								rule.id = value.feaGuid;
								rule.ruleFrameName = value.feaTitle;
								rule.condiction = [];
								angular.forEach(response.data,function(val,k){ 
									if(val.feaPguid == value.feaGuid){
										var condiction = {};
										condiction.id = val.feaGuid;
										condiction.operObj = $scope.getOperObj(val.feaTmpGuid);
										condiction.curSelect = $scope.getFeatureTmpById(val.feaTmpGuid);
										condiction.feaRuleSymbol = val.feaRuleSymbol;
										condiction.rightName = "";
										condiction.rightValue = "";
										condiction.rightId = "";
										condiction.curFeaObj = [];
										if(condiction.curSelect && condiction.curSelect.object.isoption!=1){
											condiction.value = val.feaValue;
										}else{
											var checkedFeaId = [];
											angular.forEach(response.data,function(v,index){
												if(v.feaPguid == val.feaGuid){
													if(v.ptempList && v.ptempList.length > 0){
														condiction.pfeaList = v.ptempList;
													}
													condiction.rightName += v.feaName+";";
													condiction.rightValue += v.feaValue+";";
													condiction.rightId += v.feaTmpGuid+";";
													condiction.curFeaObj.push({"id":v.feaTmpGuid,"name":v.feaName,"value":v.feaValue});
													checkedFeaId.push(v.feaTmpGuid);
												}
											});
											if(condiction.operObj[condiction.operObj.length-1].feature)
												condiction.curSelect = condiction.operObj[condiction.operObj.length-1].feature;
											if(condiction.curSelect.object.isfromCode==1){
												condiction.isTree = true;
												condiction.feaObj = $scope.getTreeFeaObjs(condiction.curSelect.object.tsourcechannel);
												//$scope.getTempFromCode(condiction.curSelect.object.tsourcechannel,condiction.id,rule.id);
											}else{
												condiction.isTree = false;
												if(condiction.curSelect && condiction.curSelect.children){
													var cloneObj = clone1(condiction.curSelect.children);
													angular.forEach(cloneObj,function(obj,i){
														angular.forEach(checkedFeaId,function(o,j){
															if(o == obj.id){
																obj.checked=true;
															}
														});
													});
													condiction.feaObj = cloneObj;
												}
											}
										}
										
										rule.condiction.push(condiction);
									}
								});
								$scope.CLDetail.rules.push(rule);
								//表单中添加规则按钮事件,添加规则集合，初始也只有一行规则
								$scope.roleToken = $scope.CLDetail.rules.length;
							}
						});
					}else
						$scope.roleToken = 0;
				},function(response){
					
				});
				
				$scope.getTreeFeaObjs = function(codType){
	            	 var feaObj = [];
	            	 angular.forEach(fromCodeFea,function(value,key){
	            		 if(value.codType == codType){
	            			 feaObj = value.children;
	            		 }
	            	 });
	            	 return feaObj;
	             }
				
				//获取已选条件分组以及附件分组选项
				$scope.getOperObj = function(feaTmpGuid){
					var operObj = [];
					var myTmpList = templateList;
					var arr = $scope.getFeatureTmpAndParentById(null,feaTmpGuid);
					if(arr && arr.length > 0){
						for(var i=0;i<arr.length;i++){
							var select = {};
							angular.forEach(myTmpList,function(value,key){
								if(value.id == arr[arr.length-1-i].id){
									select.feature = value;
								}
							});
							select.options = myTmpList;
							operObj.push(select);
							if(select.feature.children)
								myTmpList = select.feature.children;
						}
					}
					return operObj;
				}
				//获取已选条件分组以及附件分组
				$scope.getFeatureTmpAndParentById = function(arr,feaTmpGuid){
					if(!arr){
						arr = [];
					}
					var obj = $scope.getFeatureTmpById(feaTmpGuid);
					if(obj){
						arr.push(obj);
						if(obj.pId){
							arr = $scope.getFeatureTmpAndParentById(arr,obj.pId);
						}
					}
					return arr;
				}
				//根据特征guid回去特征项
				$scope.getFeatureTmpById = function(feaTmpGuid){
					var obj;
					angular.forEach(templates,function(value,key){
						if(value.id == feaTmpGuid){
							obj = value;
						}
					});
					return obj;
				}
				//获得默认选中的树结构
				$scope.getTempFromCodeChk = function(codType,ruleOptId,ruleId){
	            	 labelBusinessService.getTempFromCodeChk({codType:codType},function(response,status){
	            		 angular.forEach($scope.CLDetail.rules,function(value,key){
	            			 if(value.id == ruleId){
	            				 angular.forEach(value.condiction,function(val,k){
	            					 if(val.id == ruleOptId){
	            						 val.feaObj = clone1(response.data);
	            					 }
	            				 });
	            			 }
	            		 });
	            	 },function(response,status){
	            		 
	            	 });
	             }
				
				$scope.getTempFromCodeByPid = function(treeId,treeNode){
					var rootIsChecked = false;
					if(treeNode.checked && treeNode.check_Child_State!=1){
						rootIsChecked = true;
		    		}
					if(!treeNode.isParent){
						labelBusinessService.getTempFromCodeByPid({pId:treeNode.id},function(response){
							if(response.data && response.data.length > 0){
					    		var zTree = $.fn.zTree.getZTreeObj(treeId);
					    		zTree.addNodes(treeNode, response.data);
					    		if(rootIsChecked){
					    			zTree.checkNode(treeNode, true, true);
					    		}
					    		
					    		angular.forEach($scope.CLDetail.rules,function(value,key){
					    			angular.forEach(value.condiction,function(val,k){
					    				if(val.id == treeId){
					    					angular.forEach(val.curFeaObj,function(v,index){
					    						var cnode = zTree.getNodesByParam("id", v.id, null);
					    						if(cnode && cnode[0]){
					    							zTree.checkNode(cnode[0], true, true);
					    						}
					    					});
					    					
					    					angular.forEach(val.pfeaList,function(v,index){
					    						var cnode = zTree.getNodesByParam("id", v, null);
					    						if(cnode && cnode[0]){
					    							cnode[0].checked = true;
					    							cnode[0].check_Child_State = 1;
					    							zTree.updateNode(cnode[0],null);
					    						}
					    					});
					    				}
					    			});
					    		});
					    	}
						},function(response){
							
						});
					}else{
						var zTree = $.fn.zTree.getZTreeObj(treeId);
						if(treeNode.open){
							zTree.expandNode(treeNode, false, true, true);
						}else
							zTree.expandNode(treeNode, true, true, true);
					}
					
				}
				
				$scope.getTempFromCode = function(codType,ruleOptId,ruleId){
	            	 labelBusinessService.getTempFromCode({codType:codType},function(response){
	            		 angular.forEach($scope.CLDetail.rules,function(value,key){
	            			 if(value.id == ruleId){
	            				 angular.forEach(value.condiction,function(val,k){
	            					 if(val.id == ruleOptId){
	            						 val.feaObj = clone1(response.data);
	            					 }
	            				 });
	            			 }
	            		 });
	            	 },function(response){
	            		 
	            	 });
	             }
				
				$scope.ischeck = true;
                //提交添加标签
                $scope.submitRoles = function(){
                    labelBusinessService.submitLabelService({"newLabel":$scope.CLDetail},function(response){
                        new w.Window().alert({
                             title: "提示",
                             width: 300,
                             height: 160,
                             content: '添加标签成功！',
                             hasCloseBtn: true
                         });
                    },function(response,status){
                    })
                }

                //删除规则事件
                $scope.removeRoles = function(currentId){
                    angular.forEach($scope.CLDetail.rules,function(value,key){
                        if(value.id == currentId){
                            $scope.CLDetail.rules.splice(key,1);
                            return;
                        }
                    })
                }

                //规则中，行规则的删除
                $scope.removeRowRoles = function(obj){
                        angular.forEach($scope.CLDetail.rules,function(value,key){
                            angular.forEach(value.condiction,function(son,s){
                                if(son.id == obj.id){
                                    value.condiction.splice(s,1);
                                    return;
                                }
                            })
                        });
                }
                
                //添加标签-->行规则添加
    			$scope.addRowRoles = function(obj){
                    if(obj.length >= 10)return;
    				obj.push({
    			        "id": uuid(32,16),
    			        "operObj": [{"feature":"","options":templateList}],
    			        "curSelect":{},
    			        "feaObj":[],
    			        "curFeaObj":[],
    			        "pfeaList":[],
    			        "feaRuleSymbol":"等于",
    			        "isTree":false,
    			        "rightName":"" ,
    				    "rightValue":"",
					    "rigthId":"",
					    "value":""
    			    });
    			}
                
    			//添加标签-->添加规则集合，初始也只有一行规则
    			$scope.addRoles = function(){
    				if($scope.roleToken >= 5){
    					return false;
    				}
    				$scope.roleToken += 1; 
    				$scope.CLDetail.rules.push({
    					"id":uuid(32,16),
    					"ruleFrameName":"规则"+$scope.roleToken,
    					"condiction":[{
    				        "id": uuid(32,16),
    				        "operObj": [{"feature":"","options":templateList}],
    				        "curSelect":{},
    				        "feaObj":[],
    				        "curFeaObj":[],
    				        "pfeaList":[],
    				        "feaRuleSymbol":"等于",
    				        "isTree":false,
    				        "rightName":"" ,
    					    "rightValue":"",
    					    "rigthId":"",
    					    "value":""  
    				    }]
    					})
    			}
    			
    			//下拉树类型设置
                $scope.myRoleSetting = {
                    view: {
                        selectedMulti: false,
                        showIcon:false,
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
                       },onClick : function(event, treeId, treeNode){
                    	   $scope.getTempFromCodeByPid(treeId, treeNode);
                       }
                    }
                };
                
                $scope.changeSelect = function(ruleOptId,ruleId,opt,oIndex){
               	 angular.forEach($scope.CLDetail.rules,function(value,key){
    					if(value.id == ruleId){
    						angular.forEach(value.condiction,function(val,k){
    		 					if(val.id == ruleOptId){
    		 						if(opt.object && opt.object.isleaf==0){
    		 							val.operObj = val.operObj.slice(0,oIndex+1);
    		 							if(opt.object.isfromCode==1){
     		 								//$scope.getTempFromCode(opt.object.tsourcechannel,ruleOptId,ruleId);
    		 								val.feaObj = $scope.getTreeFeaObjs(opt.object.tsourcechannel);
     		 								val.isTree = true;
     		 							}else{
     		 								val.feaObj = clone1(opt.children);
     		 								val.isTree = false;
     		 							}
    		 						}
    		 						else{
    		 							val.feaObj = [];
    		 							val.rightName = "";
    		 							val.rightValue = "";
    		 							val.rightId = "";
    		 							val.curFeaObj = [];
    		 							if(val.curSelect.pId && opt.pId && val.curSelect.pId==opt.pId && val.curSelect.children.length>0){
    		 								var optIsLeaf = false;
     		 								if(val.curSelect.object && val.curSelect.object.isleaf==0){
     		 									optIsLeaf = true;
     		 								}
     		 								if(!optIsLeaf){
     		 									val.operObj.pop();
     		 								}
    		 							}else if(oIndex+1 < val.operObj.length){
    		 								val.operObj = val.operObj.slice(0,oIndex+1);
    		 							}
    		 							if(opt.children && opt.children.length > 0){
    		 								var cloneObj = clone1(opt.children);
    		 								val.operObj.push({"feature":"","options":cloneObj});
    		 								
    		 							}
    		 							
    		 						}
    		 						val.curSelect = opt;
    		 					}
    		 				})
    					}
    				})
                }

                //表单多选 下拉DropDown
                $scope.clickDropdown = function(myRole){
                	var treeObj = $.fn.zTree.getZTreeObj(myRole.id+"tr");
                    //myRole.isdropdown = !myRole.isdropdown;
                    var tempArray = (myRole.rightId).split(";");
                        angular.forEach(tempArray, function(value, key) {
                        	var node = treeObj.getNodesByParam("id", value, null);
                        	if(node && node[0]){
                        		treeObj.checkNode(node[0], true, true);
                        		angular.forEach(myRole.pfeaList, function (val, k) {
                        			var tnode = treeObj.getNodesByParam("id", val, null);
                        			if(tnode && tnode[0]){
                        				tnode[0].checked = true;
                        				tnode[0].check_Child_State = 1;
                        				treeObj.updateNode(tnode[0],null);
                        			}
                        		});
                        	}
                        })
                }
                $scope.leaveDropdown = function(myRole){
                    myRole.isdropdown = false;
                }
                //添加标签-->提交多选下拉
                $scope.submitSelect = function(myRole){
                    myRole.isdropdown = false;
                    myRole.rightName = "";
                    myRole.rightValue = "";
                    myRole.rightId = "";
                    myRole.curFeaObj = [];
                    if(myRole.isTree){
    					var treeObj = $.fn.zTree.getZTreeObj(myRole.id+"tr");
                        var nodes = treeObj.getCheckedNodes(true);
                        angular.forEach(nodes, function (value, key) {
                        	var node = treeObj.getNodesByParam("id", value.pId, null);
                        	if(value.level==0 && value.check_Child_State!=1){
                        		myRole.rightName += value.name + ";";
    	                        myRole.rightValue += value.value + ";";
    	                        myRole.rightId += value.id + ";";
    	                        myRole.curFeaObj.push(value);
                        	}
                        	if(node && node[0] && node[0].check_Child_State == 1 && value.check_Child_State!=1){
                        		myRole.rightName += value.name + ";";
                        		myRole.rightValue += value.value + ";";
    	                        myRole.rightId += value.id + ";";
    	                        myRole.curFeaObj.push(value);
                        	}
                        	
                        });
    				}else{
	                    angular.forEach(myRole.feaObj, function (value, key) {
	                        if (value.checked) {
	                            myRole.rightName += value.name + ";";
	                            myRole.rightValue += value.value + ";";
    	                        myRole.rightId += value.id + ";";
    	                        myRole.curFeaObj.push(value);
	                        }
	                    })
    				}
    			}

                $scope.randomWord = function(min){
                    var str = "",
                        range = min,
                        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                    for(var i=0; i<range; i++){
                        var pos = Math.round(Math.random() * (arr.length-1));
                        str += arr[pos];
                    }
                    return str;
                }
            
				$scope.saveModifyLabel = function(labelObj){
					if(!labelObj.label.labName || labelObj.label.labName==""){
						new w.Window().alert({
				             title: "提示",
				             width: 300,
				             height: 160,
				             content: '请输入标签名称！',
				             hasCloseBtn: true
				         });
						return ;
					}
					
					$scope.ischeck = true;
					var label = {};
					label.labGuid = labelObj.label.labGuid;
					label.labName = labelObj.label.labName;
					label.labInfo = labelObj.label.labInfo;
					label.querysql = "";
					label.ruleFrames = [];
					
					angular.forEach(labelObj.rules,function(value,key){
						var ruleFrame = {};
						ruleFrame.feaGuid = value.id;
						ruleFrame.feaTitle = value.ruleFrameName;
						ruleFrame.labGuid = labelObj.label.labGuid;
						ruleFrame.feaIsrule = 1;
						ruleFrame.feaOrder = key+1;
						ruleFrame.ruleList = [];

						angular.forEach(value.condiction,function(val,k){
							var rule = {};
							rule.feaGuid = val.id;
							rule.feaPguid = value.id;
							rule.feaTmpGuid = val.curSelect.id;
							rule.feaTitle = val.curSelect.name;
							rule.feaCode = val.curSelect.value;
							rule.labGuid = labelObj.label.labGuid;
							rule.feaRuleSymbol = val.feaRuleSymbol;
							rule.feaTabName = val.curSelect.object.ttabName;
							rule.feaTabField = val.curSelect.object.tTabField;
							rule.tSourcechannel = val.curSelect.object.tsourcechannel;
							rule.feaValue = val.value?val.value:null;
							rule.tableType = val.curSelect.object.tabletype;
							rule.tMarkField = val.curSelect.object.tMarkField!=null?val.curSelect.object.tMarkField:'';
							rule.tMarkFieldValue = val.curSelect.object.tMarkFieldValue!=null?val.curSelect.object.tMarkFieldValue:'';
							rule.isoption = val.curSelect.object.isoption;
							rule.feaIsrule = 0;
							rule.feaOrder = key+1;
							rule.feaRuleOrder = 0;
							rule.ruleValueList = [];
							
							if(val.isTree){
								var treeObj = $.fn.zTree.getZTreeObj(val.id+"tr");
			                    var nodes = treeObj.getCheckedNodes(true);
			                    
			                    angular.forEach(val.curFeaObj, function (obj, i) {
			                    	var ruleValue = {};
									ruleValue.feaGuid = uuid(32,16);
									ruleValue.feaPguid = val.id;
									ruleValue.feaTmpGuid = obj.id;
									ruleValue.feaTitle = val.curSelect.name;
									ruleValue.feaCode = val.curSelect.value;
									ruleValue.labGuid = labelObj.label.labGuid;
									ruleValue.feaRuleSymbol = val.feaRuleSymbol;
									ruleValue.feaName = obj.name;
									ruleValue.feaValue = obj.value;
									ruleValue.feaTabName = val.curSelect.object.ttabName;
									ruleValue.feaTabField = val.curSelect.object.tTabField;
									ruleValue.tSourcechannel = val.curSelect.object.tsourcechannel;
									ruleValue.feaIsrule = 0;
									ruleValue.feaOrder = key+1;
									ruleValue.feaRuleOrder = i+1;
									rule.ruleValueList.push(ruleValue);
			                    });
							}else{
								angular.forEach(val.feaObj,function(v,index){
									if(v.checked){
										var ruleValue = {};
										ruleValue.feaGuid = uuid(32,16);
										ruleValue.feaPguid = val.id;
										ruleValue.feaTmpGuid = v.id;
										ruleValue.feaTitle = val.curSelect.name;
										ruleValue.feaCode = val.curSelect.value;
										ruleValue.labGuid = labelObj.label.labGuid;
										ruleValue.feaRuleSymbol = val.feaRuleSymbol;
										if(v.object){
											
											ruleValue.feaName = v.object.feaTemName;
											ruleValue.feaValue = v.object.feaTemValue;
											ruleValue.feaTabName = v.object.tTabName;
											ruleValue.feaTabField = v.object.tTabField;
											ruleValue.feaSqlExpress = v.object.tFeaExpress;
											ruleValue.feaSqlParam = v.object.tFeaParam;
										}
										ruleValue.feaIsrule = 0;
										ruleValue.feaOrder = key+1;
										ruleValue.feaRuleOrder = index+1;
										
										rule.ruleValueList.push(ruleValue);
									}
								});
							}
							
							ruleFrame.ruleList.push(rule);
						});
						label.ruleFrames.push(ruleFrame);
					});
					
					$modalInstance.close(label);
				}
				$scope.modifyCLabel = function(){
					$scope.ischeck = false;
				}
		        $scope.cancel = function () {
		        	$scope.ischeck = true;
		            $modalInstance.dismiss('cancel');
		        };
		       
		        
		    };
		    //查看标签详细结束
		}]);

});

function randomWord (min){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(var i=0; i<range; i++){
        var pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}
/*得到当前日期
 * 格式：yyyymmdd
 * */
function getCurrentDate (){
	var d = new Date(),m = "",day = "";
	(d.getMonth()<10)?(m ="0"+(d.getMonth()+1)):(m = (d.getMonth()+1));
	(d.getDate()<10)?(day ="0"+d.getDate()):(day = d.getDate());
	return ""+d.getFullYear()+m+day;
}

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

