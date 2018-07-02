define(['app', 'window', 'jquery', 'WdatePicker', 'chart', 'filters', 'clientSearchServices'], function(app, w, $) {
    //console.dir(app);
    app.register.controller('clientSearchController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state','$stateParams', '$interval', '$timeout', 'util', 'echarts', 'clientSearchServices', function($location, $modal, $filter, $scope, $rootScope, $state,$stateParams, $interval, $timeout, util, echarts, clientSearchServices) {

        $scope.initializeController = function() {
            
        		$scope.jobGUID = $stateParams.jobGUID;
        		//全局对象
                $scope.myObj = [];                
                
                $scope.isShow = false;
                //默认选中个人客户,客户列表状态为显示。
                $scope.clientType=1;
                $scope.myObj.isPerson = true;
                $scope.myObj.personList=true;
                $scope.myObj.companyList=false;

                /*标签条件*/
                $scope.tagsType = [{ "name": "全部", "value": "1" }, { "name": "任一", "value": "2" }];
                $scope.labels = $scope.tagsType[0];
                //已经选择的标签
                $scope.myObj.selectLabels = [];
                //默认不勾选其他补充条件
                $scope.myObj.current = false;
                //默认不显示客户数据预览
                $scope.myObj.showPerview = false;
                //已经勾选提取客户字段
                $scope.myObj.selected = [];
                $scope.myObj.extraClause=[];
                $scope.myObj.treeCheckedTr=[];
                $scope.myObj.treeCheckedWr=[];
                //项目
                $scope.myObj.projChecked=[];
                $scope.myObj.projNames='';
                //参数
                $scope.obj={};
                
                $scope.myObj.id = "dropid";
                $scope.myObj.liveZoneValue = "";
                $scope.myObj.workZoneValue = "";

                $scope.myObj.liveId="liveArea";
                $scope.myObj.workId="workArea";
                $scope.myObj.projId="proj";
                //between组件
                $scope.between=[];
                $scope.tmpParams = {};
                $scope.getAllData();
            }
        	
        	$scope.getAllData=function(){
        		//标签
                $scope.getData();
                //补充条件
                $scope.getSelectData();
                //导出字段
                $scope.getExportField();
                //初始化父节点
                $scope.getCityTree("","2");
        	}
        
        	//修改功能
        	$scope.doModify=function(){
        		clientSearchServices.modify({"jobGUID":$scope.jobGUID},function(response){
    				$scope.labelHis=response.data.obj[0];
    				$scope.extraHis=response.data.obj[2];
    				$scope.fieldHis=response.data.obj[1];
    				$scope.workZoneHis=response.data.obj[3];
    				$scope.liveZoneHis=response.data.obj[4];
    				$scope.projHis=response.data.obj[5];
    				if($scope.labelHis.length>0){
    					if($scope.labelHis[0].ruleType=="与"){
        					$scope.labels = $scope.tagsType[0];
        				}else{
        					$scope.labels = $scope.tagsType[1];
        				}
    				}
    				$scope.doRecovery();
    				$scope.setHisTree();
    			},function(response){});
        	}
        
            //页面数据
        	$scope.getData = function() {
                clientSearchServices.getData({'cstType':$scope.clientType}, function(response) {
                	$scope.record=response.data.record;
                    if(typeof(response.data.labels.standard)!=='undefined'){
                    	$scope.standardLabels = response.data.labels.standard;
	                    $scope.standardLabels.isMore=false;                    
	                    $scope.partStandardLabels = getPartData($scope.standardLabels.data);
                    }
                    
                    if(typeof(response.data.labels.business)!=='undefined'){	
                    	$scope.businessLabels = response.data.labels.business;
	                    $scope.businessLabels.isMore=false;
	                    $scope.partBusinessLabels = getPartData($scope.businessLabels.data);
                    }
                }, function() {})
            };
            //其他补充条件下拉数据
            $scope.getSelectData = function() {
                clientSearchServices.getSelectData({"cstType":$scope.clientType}, function(response) {
                   $scope.myObj.strComponent = response.data.strComponent;
                   $scope.myObj.proj=response.data.projectList;
                }, function() {})
            }
            //城市树
            $scope.getCityTree = function(pId,level) {
            	clientSearchServices.getCityTree({"pId":pId,"level":level}, function(response) {
            		$scope.myObj.liveZone = angular.copy(response.data.cityTree);
            		$scope.myObj.workZone = angular.copy(response.data.cityTree);
            	}, function() {})
            }
	        //提取客户字段
	        $scope.getExportField = function() {
	        	clientSearchServices.getExportField({"cstType":$scope.clientType}, function(response) {
	        		$scope.fields = response.data.fields;
	        		$scope.setDate($scope.fields);
	        		if($scope.jobGUID!=""){
	        			$scope.doModify();
	        		}
	        	}, function() {})
	        }
	        
	        $scope.setDate=function(obj) {
                angular.forEach(obj, function(v, k) {
                    angular.forEach(v.child, function(vs, ks) {
                    	if(vs.current==true){
                    		$scope.myObj.selected.push(vs); 
                    	}
                    })
                })
            };

            //客户类型选择
	        $scope.selectRadio = function(i) {
                $scope.clientType = i;
                $scope.fields=[];
                // 点击切换时还原成列表隐藏状态
                $scope.myObj.showPerview = false;
                if (i == 1) {
                	$scope.businessLabels={};
                	$scope.standardLabels={};
                	$scope.partStandardLabels=[];
                	$scope.partBusinessLabels=[];
                	$scope.doReset();                	
                   $scope.myObj.isPerson=true;
                   $scope.myObj.personList=true;
                   $scope.myObj.companyList=false;
                   $scope.getData();
                   $scope.getExportField();
                } else {
                	$scope.businessLabels={};
                	$scope.standardLabels={};
                	$scope.partStandardLabels=[];
                	$scope.partBusinessLabels=[];
                	$scope.doReset();                	
                   $scope.myObj.isPerson=false;
                   $scope.myObj.personList=false;
                   $scope.myObj.companyList=true;
                   $scope.getData();
                   $scope.getExportField();
                }
            };
            //更多,收起
        $scope.showMore = function(type) {
            switch (type) {
                case 'standard':
                    if (!$scope.standardLabels.isMore) {
                        $scope.standardLabels.isMore = true;
                        $scope.partStandardLabels = $scope.standardLabels.data;
                    } else {
                        $scope.standardLabels.isMore = false;
                        $scope.partStandardLabels = getPartData($scope.standardLabels.data);
                    }
                    break;
                case 'business':
                    if (!$scope.businessLabels.isMore) {
                        $scope.businessLabels.isMore = true;
                        $scope.partBusinessLabels = $scope.businessLabels.data;
                    } else {
                        $scope.businessLabels.isMore = false;
                        $scope.partBusinessLabels = getPartData($scope.businessLabels.data);
                    }
                    break;
            }
        }

        //延迟显示Dropdown
        $scope.delayShow = function(item) {
                item.setTime = setTimeout(calback, 1000);

                function calback() {
                    $scope.$apply(function() {
                        return item.dropdown = true;
                    })
                    clearInterval(item.setTime);
                }
            }
            //清除
        $scope.clearTimes = function(item) {
            item.dropdown = false;
            clearInterval(item.setTime);
        }
        
        $scope.expData=function(){
        	if($scope.record.jobProcessStatus=="通过"){
        		var item=$scope.record;
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
            		clientSearchServices.expData(item,function(){},function(res){
                    	toastr.warning(res.header.message, '提示', {
        					closeButton: true,
        					timeOut: 3000
        				});
            		});
            	}
        	}else{
        		new w.Window().alert({
                    title:"提示",
                    content:"你好，该提数申请未通过！当前状态为："+$scope.record.jobProcessStatus,
                    width:300,
                    height:180,
                    hasCloseBtn:true,
                    autoClose:true,
                    setTime:1000*5
                })
        		return;
        	}
        }

        //点击选择标签(不能超过五个)
        $scope.addLabels = function(item) {
	        	if(item.doSelect==false || item.doSelect==undefined){
	                if ($scope.myObj.selectLabels.length <= 4) {
	                    for (var i = 0; i < $scope.myObj.selectLabels.length; i++) {
	                        if (item.labGuid == $scope.myObj.selectLabels[i].labGuid) {
	                            return;
	                        }
	                    }
	                    //设置选中样式
	                    item.doSelect = true;
	                    $scope.myObj.selectLabels.push(item);
	                }
	        	}else if(item.doSelect==true){
	                  for (var i = 0; i < $scope.myObj.selectLabels.length; i++) {
	                        if (item.labGuid == $scope.myObj.selectLabels[i].labGuid) {
	                             $scope.myObj.selectLabels.splice(i, 1);
	                        }
	                    } 
	                  item.doSelect = false;
	              }
            }
            //删除已选标签
        $scope.deleteLabels = function(item) {
                for (var i = 0; i < $scope.myObj.selectLabels.length; i++) {
                    if (item.labGuid == $scope.myObj.selectLabels[i].labGuid) {
                        for (var j = 0; j < $scope.partStandardLabels.length; j++) {
                            if (item.labGuid == $scope.partStandardLabels[j].labGuid) {
                                //取消选中样式
                                $scope.partStandardLabels[j].doSelect = false;
                                $scope.myObj.selectLabels.splice(i, 1);
                                return;
                            }
                        }
                        for (var j = 0; j < $scope.partBusinessLabels.length; j++) {
                            if (item.labGuid == $scope.partBusinessLabels[j].labGuid) {
                                //取消选中样式
                                $scope.partBusinessLabels[j].doSelect = false;
                                $scope.myObj.selectLabels.splice(i, 1);
                                return;
                            }
                        }

                    }
                }
            }
            //其他补充条件
        	$scope.setOthers = function(item) {
                item.current = !item.current;
                for (var i = 0; i < $scope.myObj.selected.length; i++){
                	if(item.codName==$scope.myObj.selected[i].codName && item.current==false){
                		$scope.myObj.selected.splice(i,1);
                	}
                }
                if(item.current==true){
                	$scope.myObj.selected.push(item);
                }
                
            }
        	//其他补充条件改变时-下拉框类型
        	$scope.strChange=function(tt,table,field){
        		var idx;
        		if(typeof(tt)!=undefined && tt!=null){
	        		tt.table=table;
	        		tt.rule="等于";
	        		idx=checkRepeatOper($scope.myObj.extraClause,tt);
	        		if(idx!=-1){
	        			$scope.myObj.extraClause.splice(idx,1);
	        		}
	        		$scope.myObj.extraClause.push(tt);
        		}else{
        			tt={};
        			tt.table=table;
        			tt.codValue1=field;
        			idx=checkRepeatOper($scope.myObj.extraClause,tt);
	        		if(idx!=-1){
	        			$scope.myObj.extraClause.splice(idx,1);
	        		}
        		}
        	}
        	$scope.scopeChange=function(fieldName,fieldValue,table,value,flag){
        		if(table=="r_t_l_cst_pro_evt"){
        			if(flag=="begin"){value=$("#beginDate").val();}
        			else{value=$("#endDate").val();}
        		}
        		var obj={};
        		if(typeof(value)!=undefined && value !=""){
	        		obj.table=table;
	        		obj.codName=fieldName;
	        		obj.codValue1=fieldValue;
	        		obj.codValue=value;
	        		obj.rule="介于";
	        		obj.flag=flag;
	        		$scope.between.push(obj);
	        		if($scope.between.length>1){
	        			for(var i=0;i<$scope.between.length-1;i++){
		        			if($scope.between[i].table ==table 
		        					&& $scope.between[i].codValue1 ==fieldValue
		        					&& $scope.between[i].flag==flag){
		        				$scope.between.splice(i,1);
		        			}
		        		}
	        		}        		
        		}
        		var idx=checkScopeRight(obj,$scope.between);
        		if(idx !=-1){
        			if(obj.flag=="begin"){
        				obj.codValues=value+","+$scope.between[idx].codValue;
        			}else{
        				obj.codValues=$scope.between[idx].codValue+","+value;
        			}
        			var index=checkRepeatOper($scope.myObj.extraClause,obj);
            		if(index!=-1){
            			$scope.myObj.extraClause.splice(index,1);
            		}
        			$scope.myObj.extraClause.push(obj);
        		}
        	}
        	
            //查询
        	$scope.doSearch = function() {
                /*if($scope.myObj.selectLabels.length<=0){
                	new w.Window().alert({
						title: "错误提示",
						width: 300,
						height: 160,
						content: "请至少选择一个标签查询",
						hasCloseBtn: true
					});
                	return;
                }*/
                	$scope.myObj.showPerview = true;
	                var labelArr=[];
	                var extraArr=[];
	                var fieldArr=[];
	                var paramObj={};
	                angular.forEach($scope.myObj.selectLabels, function(v, k) {
	                	paramObj={};
	                	paramObj.param_table="l_cst_label_storage";
	                	paramObj.param_fieldname=v.labName;
	                	paramObj.param_fieldvalue="labelGUID";
	                	paramObj.param_value1=v.labGuid;
	                	if($scope.labels.value==1){paramObj.param_rule="与";}
	                	else{paramObj.param_rule="或";}
	                	paramObj.param_type="1";
	                	labelArr.push(paramObj);
	                })
	                angular.forEach($scope.myObj.selected, function(v, k) {
	                	if(v.current==true){
	                		paramObj={};
	                		paramObj.param_table=v.codValue1;
	                    	paramObj.param_fieldname=v.codName;
	                    	paramObj.param_fieldvalue=v.codValue;
	                    	paramObj.param_type="3";
	                    	fieldArr.push(paramObj);
	                    	
	                	}
	                })
	                if($("#beginDate").val()!="" && $("#endDate").val()!=""){
	                	paramObj={};
	                	paramObj.param_table="r_t_l_cst_pro_evt";
                		paramObj.param_fieldname="事件时间";
                		paramObj.param_fieldvalue="Evt_begin_date";                	
            			paramObj.param_value1=$("#beginDate").val();
            			paramObj.param_value2=$("#endDate").val();                		
                		paramObj.param_rule="介于";
                		paramObj.param_type="2";
                		extraArr.push(paramObj);
	                }
	                angular.forEach($scope.myObj.extraClause, function(v, k) {
	                		paramObj={};
	                		paramObj.param_table=v.table;
	                		paramObj.param_fieldname=v.codName;
	                		paramObj.param_fieldvalue=v.codValue1;
	                		if(v.rule=="等于"){
	                			paramObj.param_value1=v.codValue;
	                		}else if(v.rule=="介于"){
	                			paramObj.param_value1=v.codValues.split(",")[0];
	                			paramObj.param_value2=v.codValues.split(",")[1];
	                		}else{
	                			paramObj.param_value1=v.codValue;
	                		}
	                		paramObj.param_rule=v.rule;
	                		paramObj.param_type="2";
	                		extraArr.push(paramObj);
	                })
	                if($scope.myObj.treeCheckedTr.length>0){
	                	var treeObj={};
	                	var tree=[];
	                	treeObj.param_table = $scope.myObj.treeCheckedTr[0].table;
	                	treeObj.param_fieldname = $scope.myObj.treeCheckedTr[0].codName;
	                	treeObj.param_fieldvalue = $scope.myObj.treeCheckedTr[0].codValue1;
	                	treeObj.param_value1 = $scope.myObj.treeCheckedTr[0].codValue;
	                	treeObj.param_value2 = $scope.myObj.treeCheckedTr[0].level;
	                	treeObj.param_rule = $scope.myObj.treeCheckedTr[0].rule;
	                	treeObj.param_type = "2";
	                	angular.forEach($scope.myObj.treeCheckedTr, function(v, k) {
	                		paramObj={};
	                		paramObj.param_table=v.table;
	                		paramObj.param_fieldname=v.codName;
	                		paramObj.param_fieldvalue=v.codValue1;
	                		paramObj.param_value1=v.codValue;
	                		paramObj.param_value2=v.level;
	                		paramObj.param_rule=v.rule;
	                		paramObj.param_type="2";
	                		tree.push(paramObj);
	                	})
	                	treeObj.tree=tree;
	                	extraArr.push(treeObj);
	                }
	                if($scope.myObj.treeCheckedWr.length>0){
	                	var treeObj={};
	                	var tree=[];
	                	treeObj.param_table = $scope.myObj.treeCheckedWr[0].table;
	                	treeObj.param_fieldname = $scope.myObj.treeCheckedWr[0].codName;
	                	treeObj.param_fieldvalue = $scope.myObj.treeCheckedWr[0].codValue1;
	                	treeObj.param_value1 = $scope.myObj.treeCheckedWr[0].codValue;
	                	treeObj.param_value2 = $scope.myObj.treeCheckedWr[0].level;
	                	treeObj.param_rule = $scope.myObj.treeCheckedWr[0].rule;
	                	treeObj.param_type = "2";
	                	angular.forEach($scope.myObj.treeCheckedWr, function(v, k) {
	                		paramObj={};
	                		paramObj.param_table=v.table;
	                		paramObj.param_fieldname=v.codName;
	                		paramObj.param_fieldvalue=v.codValue1;
	                		paramObj.param_value1=v.codValue;
	                		paramObj.param_value2=v.level;
	                		paramObj.param_rule=v.rule;
	                		paramObj.param_type="2";
	                		tree.push(paramObj);
	                	})
	                	treeObj.tree=tree;
	                	extraArr.push(treeObj);
	                }
	                //项目
	                if($scope.myObj.projChecked.length>0){
	                	var treeObj={};
	                	var tree=[];
	                	treeObj.param_table = $scope.myObj.projChecked[0].table;
	                	treeObj.param_fieldname = $scope.myObj.projChecked[0].codName;
	                	treeObj.param_fieldvalue = $scope.myObj.projChecked[0].codValue1;
	                	treeObj.param_value1 = $scope.myObj.projChecked[0].codValue;
	                	treeObj.param_value2 = $scope.myObj.projChecked[0].level;
	                	treeObj.param_rule = $scope.myObj.projChecked[0].rule;
	                	treeObj.param_type = "2";
	                	angular.forEach($scope.myObj.projChecked, function(v, k) {
	                		paramObj={};
	                		paramObj.param_table=v.table;
	                		paramObj.param_fieldname=v.codName;
	                		paramObj.param_fieldvalue=v.codValue1;
	                		paramObj.param_value1=v.codValue;
	                		paramObj.param_value2=v.level;
	                		paramObj.param_rule=v.rule;
	                		paramObj.param_type="2";
	                		tree.push(paramObj);
	                	})
	                	treeObj.tree=tree;
	                	extraArr.push(treeObj);
	                }
	                $scope.obj={
	                	"labelList":labelArr,
	                	"extraList":extraArr,
	                	"fieldList":fieldArr
	                }
	                
	                clientSearchServices.cstData($scope.obj, function(response) {
	                	if(response.header.code==0){
	                		$scope.customData = response.data.cstList;
	                		$scope.cstNum=response.data.cstNum;
	                	}else{
	                		new w.Window().alert({
								title: "错误提示",
								width: 300,
								height: 160,
								content: response.header.message,
								hasCloseBtn: true
							});
	                	}                        
	                    $("html,body").animate({ scrollTop: $("#zdatas").offset().top - 200 }, 500);
	                 }, function() {})
            }
        	
       $scope.doRecovery=function(){
    	   //标签
    	   angular.forEach($scope.partStandardLabels, function(v, k) {
    		   angular.forEach($scope.labelHis,function(a,b){
    			   if(v.labGuid==a.colValue){
    				   v.doSelect = true;
    				   $scope.myObj.selectLabels.push(v);
    			   }
    		   })               
           })
           angular.forEach($scope.partBusinessLabels, function(v, k) {
        	   angular.forEach($scope.labelHis,function(a,b){
    			   if(v.labGuid==a.colValue){
    				   v.doSelect = true;
    				   $scope.myObj.selectLabels.push(v);
    			   }
    		   })
	        })
	        //勾选字段
	        //debugger;
	        $scope.myObj.selected=[];
	        for (var i = 0; i < $scope.fields.length; i++){
        		for (var j = 0; j < $scope.fields[i].child.length; j++){
        			for(var k=0;k<$scope.fieldHis.length;k++){
        				if($scope.fieldHis[k].colEnName==$scope.fields[i].child[j].codValue){
        					$scope.fields[i].child[j].current=true;
        					$scope.myObj.selected.push($scope.fields[i].child[j]);
        				}
        			}
        		}
        	}
    	   //补充条件
    	   
    	   angular.forEach($scope.myObj.strComponent,function(item,index){
    		   	item.evType="";
	       		item.begin = "";
	       		item.end = "";
	       		angular.forEach($scope.extraHis,function(v,k){	       			
	       			if(v.ruleType=="等于" && v.colEnName==item.codValue){
	       				for(var i=0;i<item.child.length;i++){
	       					if(v.colValue==item.child[i].codValue){
	       						item.evType=item.child[i];
	       						$scope.strChange(item.evType,item.codValue1,item.codValue);
	       					}
	       				}
	       			}
	       			if(v.ruleType=="介于"){
	       				if(v.colEnName==item.codValue){
		       				item.begin = v.colValue;
		    	       		item.end = v.colValue1;
		    	       		$scope.scopeChange(item.codName,item.codValue,item.codValue1,item.begin,'begin');
		    	       		$scope.scopeChange(item.codName,item.codValue,item.codValue1,item.end,'end');
	       				}else if(v.colEnName=="Evt_begin_date"){
	       					item.beginDate=v.colValue;
	       					item.endDate=v.colValue1;
	       				}
	       			}
	       		})	       		
       		})
       } 	
        //重置
        $scope.doReset = function() {
        	
        	angular.forEach($scope.myObj.strComponent,function(item,index){
        		item.evType="";
        		item.begin = "";
        		item.end = "";
        	})
        	$scope.myObj.liveZoneValue = "";
        	$scope.myObj.workZoneValue = "";
        	$scope.myObj.projNames="";
        	$("#beginDate").val("");
        	$("#endDate").val("");
        	 
            //已经选择的标签
            $scope.myObj.selectLabels = [];            
            //已选择的补充条件
            $scope.myObj.extraClause=[];
            
            $scope.myObj.treeCheckedTr=[];
            $scope.myObj.treeCheckedWr=[];
            $scope.myObj.projChecked=[];
            $scope.between=[];            
            
            angular.forEach($scope.partStandardLabels, function(v, k) {
                v.doSelect = false;
            })
            angular.forEach($scope.partBusinessLabels, function(v, k) {
	            v.doSelect = false;
	        })
                //其他条件
            $scope.myObj.current = false;
            //提取字段数据
            $scope.fields = reSetCheck($scope.fields);
            //已勾选的提取字段
            $scope.myObj.selected=[];
            $scope.setDate($scope.fields);
           
        }

        //导出弹窗
        $scope.exportFile = function(obj,cstnum) {
        	clientSearchServices.getExpApply({"jobGuid":$scope.jobGUID},function(response){
            	if(response.header.code==0){
            		var modalInstance = $modal.open({
                        templateUrl: 'extractInfo.html',
                        controller: extractInfoCtrl,
                        windowClass: 'app-modal-window',
                        size: "lg",
                        resolve: {
                        	obj:function(){
                        		return obj;
                        	},
                        	cstnum:function(){
                        		return cstnum;
                        	},
                        	purpose: function() {
                                return response.data.purpose;
                            },
                            followType: function() {
                                return response.data.followType;
                            },
                            projectList: function() {
                                return response.data.projectList;
                            },
                            job:function(){
                            	return response.data.expJob
                            }
                        }
                    });            		
            	}else{
            		alert(response.header.message);
            	}
            },function(){})
        };
        var extractInfoCtrl = function($scope, $modalInstance,obj,cstnum, purpose, followType, projectList,job) {        	
            
        	$scope.purpose = purpose;
            $scope.followType = followType;
            $scope.projectList = projectList;
            $scope.einfo = [];
            $scope.einfo.type = "";
            $scope.einfo.followCurrent = "";
            $scope.einfo.project={};  
            $scope.einfo.followStatus = 1;
            
            $scope.allProjectList = projectList;
            //退回数据
            $scope.status=null;
            $scope.backId=null;
            //页面参数
            $scope.expParam=obj;
            //提数单号
            $scope.einfo.expApplyNo="TS"+getCurrentDate()+randomWord(4);
            $scope.einfo.uuid=uuid(32,16);
            $scope.dropChoose = function(item) {
                $scope.einfo.project.title = item.title;
                $scope.einfo.project.value = item.value;
            }  
            
            $scope.changProjNameKeyword = function() {
            	var tmpProjectList = new Array();
            	 angular.forEach($scope.allProjectList, function(v, k) {
                     v.doSelect = false;
                     if(v.title != null && v.title != "" && v.title.indexOf($scope.einfo.project.title) != -1){
                    	 tmpProjectList[tmpProjectList.length] = v;
                     }
                 });
                 $scope.projectList = tmpProjectList;
            }   
            
            if(job!=null){
            	$scope.einfo.activeName=job.jobName;
            	$scope.einfo.project.value=job.jobProjguid;
	            $scope.einfo.project.title=job.jobProjname;
	            $scope.einfo.expApplyNo=job.jobOddNumber;
	            $scope.einfo.activeBudget=job.jobBudget;
	            $scope.einfo.describe=job.jobDescribe;
	            $scope.einfo.followStatus=job.jobTrack;
	            $scope.einfo.followBegin=job.jobTrackStarttime;
	            $scope.einfo.followEnd=job.jobTrackEndtime;
	            
	            angular.forEach(followType, function(item, key){
	            	if(item.value==job.jobTrackType){
	            		$scope.einfo.followCurrent=item;
	            	}
	            });
	            $scope.status=job.jobProcessstatus;
	            $scope.backId=job.jobProcInstID;
	            $scope.jobGuid=job.jobGuid;
            }
            
            $scope.doSubmit = function() {
            	var windowParams = {title: "提示",height:180,width:300};  //提示
            	if($scope.einfo.project.title==null||typeof($scope.einfo.project.title) == undefined || $scope.einfo.project.title ==''){
					windowParams.content = "请选择项目";
				}else if($scope.einfo.activeName==null||typeof($scope.einfo.activeName) == undefined || $scope.einfo.activeName ==''){
					windowParams.content = "请输入活动名称";
				}else if($scope.einfo.activeBudget==null||typeof($scope.einfo.activeBudget) == undefined || $scope.einfo.activeBudget ==''){
					windowParams.content = "请输入活动预算";
				}else if(!(/^([1-9]\d*\.?\d*)|(0\.\d*[1-9])$/.test($scope.einfo.activeBudget))){
					windowParams.content = "活动预算只能输入数值型";
				}else if($scope.einfo.followStatus == null || typeof($scope.einfo.followStatus) == undefined || $scope.einfo.followStatus ==''){
            		windowParams.content = "请选择跟踪状态";
            	}else if($scope.einfo.followStatus=='1'){
            		if($scope.einfo.followCurrent == null || typeof($scope.einfo.followCurrent) == undefined || $scope.einfo.followCurrent ==''){
                		windowParams.content = "请选择业务类型";
                	}else if($("#followBegin").val()==""){
                		windowParams.content = "请选择跟踪开始时间";
                	}else if($("#followEnd").val()==""){
                		windowParams.content = "请选择跟踪结束时间";
                	}
            	}
              if(windowParams.content == null || windowParams.content == undefined){
            	  if("退回"==$scope.status||"未提交"==$scope.status){
            		  $scope.expParam.jobGuid=$scope.jobGuid;
            	  }else{
            		  $scope.expParam.jobGuid=$scope.einfo.uuid;
            	  }
            	  $scope.expParam.jobName=$scope.einfo.activeName;
                  $scope.expParam.jobProjguid=$scope.einfo.project.value;
                  $scope.expParam.jobProjname=$scope.einfo.project.title;
                  $scope.expParam.jobOddNumber=$scope.einfo.expApplyNo;
                  $scope.expParam.jobBudget=$scope.einfo.activeBudget;
                  $scope.expParam.jobDescribe=$scope.einfo.describe;
                  $scope.expParam.jobTrack=$scope.einfo.followStatus;
                  $scope.expParam.jobTrackStarttime=$("#followBegin").val()!=""?$("#followBegin").val():null;
                  $scope.expParam.jobTrackEndtime=$("#followEnd").val()!=""?$("#followEnd").val():null;
                  $scope.expParam.jobTrackType=$scope.einfo.followCurrent.value;
                  $scope.expParam.jobTrackTypename=$scope.einfo.followCurrent.title;
                  $scope.expParam.jobResCount=cstnum;
                  $scope.expParam.jobProcessStatus=$scope.status;
                  $scope.expParam.jobProcInstID=$scope.backId;
                  clientSearchServices.doSubmit($scope.expParam,function(response){
                	  if(response.header.code==0){
                		  if(!response.data.isPass){
                			var url =response.data.url;
                			// 创建一个 form  
  	            		    var form1 = document.createElement("form");  
  	            		    form1.id = "form1";  
  	            		    form1.name = "form1";  
  	            		    // 添加到 body 中  
  	            		    document.body.appendChild(form1);  
  	            		    // form 的提交方式   
  	            		    form1.method = "post";  
  	            		    // form 提交路径  
  	            		    form1.action = url;
  	            		    form1.target = "_blank";
  	            		    // 对该 form 执行提交  
  	            		    form1.submit();  
  	            		    // 删除该 form  
  	            		    document.body.removeChild(form1);
                		  }else{
                			  new w.Window().alert({
          						title: "提示",
          						width: 300,
          						height: 160,
          						content: "特权组用户跳过BPM审批流程",
          						hasCloseBtn: true
          					 });
                		  }
                		  $modalInstance.close();
                	  }else{
                		  new w.Window().alert({
        						title: "提示",
        						width: 300,
        						height: 160,
        						content: response.header.message,
        						hasCloseBtn: true
        					});
                	  }
                  },function(response){
                	  
                  });
              }else{
            	  new w.Window().alert(windowParams);
	  			}        	  
            }
            $scope.doSave = function() {
            	var windowParams = {title: "提示",height:180,width:300};  //提示
            	if($scope.einfo.project.title==null||typeof($scope.einfo.project.title) == undefined || $scope.einfo.project.title ==''){
					windowParams.content = "请选择项目";
				}else if($scope.einfo.activeName==null||typeof($scope.einfo.activeName) == undefined || $scope.einfo.activeName ==''){
					windowParams.content = "请输入活动名称";
				}else if($scope.einfo.activeBudget==null||typeof($scope.einfo.activeBudget) == undefined || $scope.einfo.activeBudget ==''){
					windowParams.content = "请输入活动预算";
				}else if(!(/^([1-9]\d*\.?\d*)|(0\.\d*[1-9])$/.test($scope.einfo.activeBudget))){
					windowParams.content = "活动预算只能输入数值型";
				}else if($scope.einfo.followStatus == null || typeof($scope.einfo.followStatus) == undefined || $scope.einfo.followStatus ==''){
            		windowParams.content = "请选择跟踪状态";
            	}else if($scope.einfo.followStatus=='1'){
            		if($scope.einfo.followCurrent == null || typeof($scope.einfo.followCurrent) == undefined || $scope.einfo.followCurrent ==''){
                		windowParams.content = "请选择业务类型";
                	}else if($("#followBegin").val()==""){
                		windowParams.content = "请选择跟踪开始时间";
                	}else if($("#followEnd").val()==""){
                		windowParams.content = "请选择跟踪结束时间";
                	}
            	}
            	if(windowParams.content == null || windowParams.content == undefined){ 
            		if("退回"==$scope.status||"未提交"==$scope.status){
              		  $scope.expParam.jobGuid=$scope.jobGuid;
              	  }else{
              		  $scope.expParam.jobGuid=$scope.einfo.uuid;
              	  }
            		$scope.expParam.jobName=$scope.einfo.activeName;
                    /*$scope.expParam.jobFor=$scope.einfo.type.value;
                    $scope.expParam.jobForname=$scope.einfo.type.title;*/
                    $scope.expParam.jobProjguid=$scope.einfo.project.value;
                    $scope.expParam.jobProjname=$scope.einfo.project.title;
                    $scope.expParam.jobOddNumber=$scope.einfo.expApplyNo;
                    $scope.expParam.jobBudget=$scope.einfo.activeBudget;
                    /*$scope.expParam.jobActiveZone=$scope.einfo.activeZone;*/
                    $scope.expParam.jobDescribe=$scope.einfo.describe;
                    $scope.expParam.jobTrack=$scope.einfo.followStatus;
                    $scope.expParam.jobTrackStarttime=$("#followBegin").val()!=""?$("#followBegin").val():null;
                    $scope.expParam.jobTrackEndtime=$("#followEnd").val()!=""?$("#followEnd").val():null;
                    $scope.expParam.jobTrackType=$scope.einfo.followCurrent.value;
                    $scope.expParam.jobTrackTypename=$scope.einfo.followCurrent.title;
                    $scope.expParam.jobResCount=cstnum;
                    clientSearchServices.doSave($scope.expParam,function(response){
                  	  if (response.header.code == 0) {
                  		new w.Window().alert({
      						title: "提示",
      						width: 300,
      						height: 160,
      						content: response.header.message,
      						hasCloseBtn: true
      					});
                  	  }
                    },function(response){});
                    $modalInstance.close();
              }else{
            	  new w.Window().alert(windowParams);
              }
            	//$modalInstance.close();
            }
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        };


        //导出
        $scope.doExport = function() {
                if($scope.cstNum>100000){
                	new w.Window().confirm({
                        title: "提示",
                        content: "已超出系统限制范围（100000个客户），最终导出结果只有100000个客户，请您确认是否继续？",
                        hasCloseBtn: true,
                        confirmBtnClass: "btn-red",
                        width: 450,
                        height: 200,
                        handler4ConfirmBtn: function() {
                            $scope.exportFile($scope.obj,100000);
                        }
                    })
                }else{
                	$scope.exportFile($scope.obj,$scope.cstNum);
                }
            }
            //显示10条
        function getPartData(obj) {
            var temp = [];
            for (var i = 0; i < obj.length; i++) {
                if (i < 12) {
                    temp.push(obj[i]);
                } else {
                    break;
                }
            }
            return temp;
        }
        //重置CheckBox
        function reSetCheck(obj) {
        	for (var i = 0; i < obj.length; i++){
        		for (var j = 0; j < obj[i].child.length; j++){        			
        			if(obj[i].child[j].codValue!="cstName"&&obj[i].child[j].codName!="手机号码"
        				&&obj[i].child[j].codName!="性别"&&obj[i].child[j].codName!="邮箱地址"
        					&&obj[i].child[j].codName!="居住区域"){
        				obj[i].child[j].current=false;
        			}
        		}
        	}
        	return obj;
        };

        /*居住-工作区域下拉菜单树形结构 start*/

        //表单多选 下拉DropDown
        // debugger;
        $scope.clickDropdown = function(obj) {
        	//$scope.getCityTree();
            obj.isdropdown = true;

        };
        $scope.leaveDropdown = function(obj) {
            obj.isdropdown = false;
        };
        
        //设置历史选中节点
        $scope.setHisTree=function(){        	
        	if($scope.workZoneHis.length>0){
        		var treeObj = $.fn.zTree.getZTreeObj($scope.myObj.id + "wr");
        		angular.forEach($scope.workZoneHis,function(v,k){
        			var node=treeObj.getNodeByParam("id",v.colValue);
        			node.checked = true;
        			treeObj.selectNode(node);
        			treeObj.updateNode(node);
        		})
        		$scope.myObj.workZone.isdropdown=false;
        		$scope.submitSelect($scope.myObj.workZone,$scope.myObj.workZoneValue,'wr');
        	}
        	if($scope.liveZoneHis.length>0){
        		var treeObj = $.fn.zTree.getZTreeObj($scope.myObj.id + "tr");
        		angular.forEach($scope.liveZoneHis,function(v,k){
        			var node=treeObj.getNodeByParam("id",v.colValue);
        			node.checked = true;
        			treeObj.selectNode(node);
        			treeObj.updateNode(node);
        		})
        		$scope.myObj.liveZone.isdropdown=false;
        		$scope.submitSelect($scope.myObj.liveZone,$scope.myObj.liveZoneValue,'tr');
        	}
        	if($scope.projHis.length>0){
        		var treeComponent={};
        		angular.forEach($scope.projHis,function(v,k){
        			treeComponent.table=v.table;
        			treeComponent.codName=v.colCnName;
        			treeComponent.codValue1=v.colEnName;
            		treeComponent.codValue=v.colValue;
            		treeComponent.rule=v.ruleType;
            		treeComponent.level=2;
            		$scope.myObj.projChecked.push(treeComponent);
        		})
        		$scope.myObj.proj.isdropdown=false;
        		$scope.submitCheck($scope.myObj.proj);
        	}
        }
        
        //提交多选下拉
        $scope.submitSelect = function(obj, val, str) {
            obj.isdropdown = false;
            val = "";
            var ids=[];
            //得到所有选中的节点
            /*var treeObj = $.fn.zTree.getZTreeObj($scope.myObj.id + str);
            var nodes = treeObj.getCheckedNodes(true);
            angular.forEach(nodes, function(v, k) {
                if (v.isParent!=true) {
                    val += v.name + ",";
                }
            })*/
            
            if (str == "tr") {
            	angular.forEach($scope.myObj.treeCheckedTr, function(v, k) {
                    val += v.codName + ",";
                })
                $scope.myObj.liveZoneValue = val;
            } else {
            	angular.forEach($scope.myObj.treeCheckedWr, function(v, k) {
                    val += v.codName + ",";
                })
                $scope.myObj.workZoneValue = val;
            }

        }


        //居住 区域
        $scope.myRoleSettingTr = {
            view: {
                selectedMulti: false,
                showIcon: true,
                showLine: false,
                dblClickExpand: true,
            },
            edit: {
                enable: false,
                showRemoveBtn: function(treeId, treeNode) {
                    return false;
                },
                showRenameBtn: function(treeId, treeNode) {
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
                beforeDrag: function(treeId, treeNodes) {
                    return false;
                },
                beforeDrop: function(treeId, treeNodes, targetNode, moveType) {
                    return false;
                },
                beforeExpand:function(treeId, treeNode) {
                	$scope.getSubCity(treeId, treeNode,"tr");
                	return false;
                },
                onClick : function(event, treeId, treeNode){
                	$scope.getSubCity(treeId, treeNode,"tr");
                },
                onCheck : function(event, treeId, treeNode){
                	$scope.getCheckedTree(treeId, treeNode,"tr");
                }
            }
        };
        //工作区域
        $scope.myRoleSettingWr = {
            view: {
                selectedMulti: false,
                showIcon: true,
                showLine: false,
                dblClickExpand: true,
            },
            edit: {
                enable: false,
                showRemoveBtn: function(treeId, treeNode) {
                    return false;
                },
                showRenameBtn: function(treeId, treeNode) {
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
                beforeDrag: function(treeId, treeNodes) {
                    return false;
                },
                beforeDrop: function(treeId, treeNodes, targetNode, moveType) {
                    return false;
                },
                beforeExpand:function(treeId, treeNode) {
                	$scope.getSubCity(treeId, treeNode,"wr");
                	return false;
                },
                onClick : function(event, treeId, treeNode){
                	$scope.getSubCity(treeId, treeNode,"wr");
                },
                onCheck : function(event, treeId, treeNode){
                	$scope.getCheckedTree(treeId, treeNode,"wr");
                }
            }
        };
        /*下拉菜单树形结构 end*/
        
        $scope.getSubCity=function(treeId, treeNode,str){
        	var zTree = $.fn.zTree.getZTreeObj(treeId);
        	if(treeNode.children==undefined){
        		clientSearchServices.getCityTree({"pId":treeNode.id,"level":""},function(response){
            		var rootIsChecked = false;
    				if(treeNode.checked && treeNode.check_Child_State!=1){
    					rootIsChecked = true;
    	    		}
            		if(response.data.cityTree && response.data.cityTree.length > 0){
    		    		zTree.addNodes(treeNode, response.data.cityTree,true );
    		    		if(rootIsChecked){
    		    			zTree.checkNode(treeNode, true, true);
    		    		}
            		}
            	},function(){})
        	}
        	zTree.expandNode(treeNode,!treeNode.open);
        }
        $scope.getCheckedTree=function(treeId, treeNode,str){
        	var treeComponent={};
        	var idx=-1;
        	var treeObj = $.fn.zTree.getZTreeObj($scope.myObj.id +str);
            var nodes = treeObj.getCheckedNodes(true);
    		treeComponent.table="r_t_e_cst";
    		if (str == "tr") {
    			treeComponent.codName=treeNode.name;
    			treeComponent.codValue1="live_place_detlcode";
            } else {
            	treeComponent.codName=treeNode.name;
            	treeComponent.codValue1="work_place_detlcode";
            }
    		treeComponent.codValue=treeNode.id;
    		treeComponent.rule="tree";
    		treeComponent.level=treeNode.lv;
    		if (str == "tr") {
    			idx=checkRepeatOper($scope.myObj.treeCheckedTr,treeComponent);
    			if(idx !=-1){
    				$scope.$apply(function(){
    					$scope.myObj.treeCheckedTr.splice(idx,1);
    				})
        		}        		
        		if(treeNode.checked){
        			$scope.$apply(function(){
        				$scope.myObj.treeCheckedTr.push(treeComponent);
        			})
        		}else{
        			$scope.myObj.treeCheckedTr=[];
        			for(var i=0;i<nodes.length;i++){
        				if(nodes[i].children==undefined||nodes[i].children.length==0){
        					treeComponent={};
            				treeComponent.table="r_t_e_cst";
            				treeComponent.codValue1="live_place_detlcode";
            				treeComponent.codName=nodes[i].name;
            				treeComponent.codValue=nodes[i].id;
            				treeComponent.rule="tree";
            	    		treeComponent.level=nodes[i].lv;
            				$scope.myObj.treeCheckedTr.push(treeComponent);
        				}
        			}
        		}
    		}else{
    			idx=checkRepeatOper($scope.myObj.treeCheckedWr,treeComponent);
    			if(idx !=-1){
    				$scope.$apply(function(){
    					$scope.myObj.treeCheckedWr.splice(idx,1);
    				})
        		}
    			if(treeNode.checked){
    				$scope.$apply(function(){
    					$scope.myObj.treeCheckedWr.push(treeComponent);
    				})
    			}else{
    				$scope.myObj.treeCheckedWr=[];
    				for(var i=0;i<nodes.length;i++){
        				if(nodes[i].children==undefined||nodes[i].children.length==0){
        					treeComponent={};
            				treeComponent.table="r_t_e_cst";
            				treeComponent.codValue1="work_place_detlcode";
            				treeComponent.codName=nodes[i].name;
            				treeComponent.codValue=nodes[i].id;
            				treeComponent.rule="tree";
            	    		treeComponent.level=nodes[i].lv;
            				$scope.myObj.treeCheckedWr.push(treeComponent);
        				}
        			}
    			}
    		}
        }

        $scope.deleteSelected=function(treeNode ,str ){

            var treeObj = $.fn.zTree.getZTreeObj($scope.myObj.id +str);
            var nodes = treeObj.getCheckedNodes(true);
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].id==treeNode.codValue){
                        nodes[i].checked=false;
                        treeObj.updateNode(nodes[i],true);
                        if(str=='tr'){
                        	for(var j=0;j<$scope.myObj.treeCheckedTr.length;j++)
                                if($scope.myObj.treeCheckedTr[j].codValue==treeNode.codValue){
                                     $scope.myObj.treeCheckedTr.splice(j,1);
                            };
                        }else if(str=='wr'){
                        	for(var j=0;j<$scope.myObj.treeCheckedWr.length;j++)
                                if($scope.myObj.treeCheckedWr[j].codValue==treeNode.codValue){
                                     $scope.myObj.treeCheckedWr.splice(j,1);
                            };
                        }
                  treeObj.refresh();
                }
            }
            
        };
        /*新增项目 补充字段 begin*/
        $scope.submitCheck = function(obj) {
        	$scope.myObj.projNames=""
            obj.isdropdown = false;
            for (var i = 0; i < $scope.myObj.projChecked.length; i++) {
            	$scope.myObj.projNames +=$scope.myObj.projChecked[i].codName+",";
            }
        };
        $scope.doCheck=function(item){
        	var treeComponent={};
        	var idx=-1;
    		treeComponent.table="r_t_l_cst_pro_evt";
			treeComponent.codName=item.title;
			treeComponent.codValue1="projGUID";
    		treeComponent.codValue=item.value;
    		treeComponent.rule="tree";
    		treeComponent.level=2;
			idx=checkRepeatOper($scope.myObj.projChecked,treeComponent);
			if(idx !=-1){
				$scope.myObj.projChecked.splice(idx,1);
    		}
			if(item.checked){
				item.checked=false;
			}else{
				item.checked=true;
			}
    		if(item.checked){
    			$scope.myObj.projChecked.push(treeComponent);
    		}
        };
        $scope.emptyArr=function(){
        	$scope.myObj.projChecked=[];
            for (var i = 0; i < $scope.myObj.proj.length; i++) {
                $scope.myObj.proj[i].checked=false;
            }
        };
        $scope.deleteCheck=function(item){
            for (var i = 0; i <$scope.myObj.projChecked.length; i++) {
                if ($scope.myObj.projChecked[i].codName==item.codName) {
                   $scope.myObj.projChecked.splice(i,1);
                   for (var i = 0; i < $scope.myObj.proj.length; i++) {
                       if ($scope.myObj.proj[i].title==item.codName) {
                            $scope.myObj.proj[i].checked=false;
                       }
                   }
                }
            }
      }
        /*新增项目 补充字段 end*/
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
/*检查范围组件是否存在另一个匹配的范围*/
function checkScopeRight(obj,arr){
	var flag,idx=-1;
	if(obj.flag=='begin'){
		flag='end';
	}
	if(obj.flag=='end'){
		flag='begin';
	}
	for(var i=0;i<arr.length;i++){
		if(arr[i].table==obj.table && arr[i].codValue1==obj.codValue1&& arr[i].flag==flag){
			idx= i;
			break;
		}
	}
	return idx;
}
/*检查其他补充条件是否有重复的操作 并更新*/
function checkRepeatOper(arr,obj){
	var idx=-1;
	for(var i=0;i<arr.length;i++){
		if(obj.rule !="tree"){
			if(arr[i].table==obj.table && arr[i].codValue1==obj.codValue1){
				idx=i;
				break;
			}
		}else{
			if(arr[i].table==obj.table && arr[i].codValue1==obj.codValue1 && arr[i].codValue==obj.codValue){
				idx=i;
				break;
			}
		}
	}
	return idx;
}