define(['app', 'window', 'jquery','projectServices','ztree','toastr','Upload'], function (app, w) {
    app.register.controller('ProjectCtrlController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state','projectServices', 'toastr', '$http','Upload', 
    	                                              function ($location, $modal, $filter, $scope, $rootScope, $state, projectServices, toastr, $http, Upload) {

      $scope.initializeController = function () {
          //$rootScope.layout.hasSubs = true;
//		  $scope.detailsLoaded = false;//初始时候不显示搜索明细列表
		  
		  $scope.PageSize = 10;// 默认显示一页页码数
		  $scope.currentPage = 1;
		  $scope.TotalRows = 0;
		  
		  //默认初始区域
	      $scope.company = "";
		  $scope.area = "";
		  $scope.city = "";
		  $scope.project = "";
		  
		  $scope.getYeTai();
		  
      };
      
      //获取业态
      $scope.getYeTai = function(){
    	  projectServices.getYeTai({}, function (response, status){
    		  		$scope.belongsFormats = response.data.yeTaiList;
    		  		$scope.belongsFormat = "";
//    		  		$scope.belongsFormat = $scope.belongsFormats[0];
    	  		}, function(response, status){
    				toastr.warning('获取数据失败', '提示', {
    					closeButton: true,
    					timeOut: 5000
    				});
    	  	});
      };
      
      //获取接入系统和组织架构
      $scope.getXiTongOrg = function(yeTaiId){
    	  projectServices.getXiTongOrg({'yeTaiId':yeTaiId}, function (response, status){
    		  		$scope.accessSystems = response.data.xiTongList;
    		  		$scope.accessSystem = "";
    		  		
    		  		$scope.companys = response.data.orgList;
    		  		$scope.company = "";
    		  		$scope.area = "";
    		  		$scope.city = "";
    	  		}, function(response, status){
    				toastr.warning('获取数据失败', '提示', {
    					closeButton: true,
    					timeOut: 5000
    				});
    	  	});
      };
      
      //yeTai改变
      $scope.changeYeTai = function(){
    	  if($scope.belongsFormat == "" || $scope.belongsFormat == null){
    		  $scope.accessSystem = "";
    		  $scope.company = "";
    		  $scope.area = "";
    		  $scope.city = "";
    	  }
    	  if($scope.belongsFormat != "" && $scope.belongsFormat != null){
    		  var yeTaiId = $scope.belongsFormat.id;
    		  $scope.getXiTongOrg(yeTaiId);
    	  }
      };
      
      
      
      
      $scope.getCompany = function(){
    	  projectServices.getCompany(null, function(response, status){
    		 $scope.loaded = true;//表示已经成功加载数据
    		 $scope.belongsFormats = response.data.belongsFormat;
 			 //$scope.belongsFormatSelected = $scope.belongsFormats[0];
 			 $scope.accessSystems = response.data.sysapp;
 			 //$scope.accessSystemSelected = $scope.accessSystems[0];
		     $scope.companys = response.data.group;
			 //$scope.company = $scope.companys[0];
			 
			 $scope.area = "";
			 $scope.city = "";
			 
			}, function(response, status){
				toastr.warning('获取数据失败', '提示', {
					closeButton: true,
					timeOut: 5000
				});
			});	
      };
      
      //company改变
      $scope.changeCompany = function(){
    	  $scope.area = "";
    	  $scope.city = "";
      };
      
      //区域改变
      $scope.changeArea = function(){
    	  $scope.city = "";
      };
      
      
        //查询明细页码切换
		$scope.pageChanged = function () {
			$scope.getDetails(null);
		};
        
        var searchvo = {};
        
	    //点击查询
		$scope.search = function(){
			$scope.currentPage = 1;
			
			if($scope.belongsFormat == "" || $scope.belongsFormat == null){
				new w.Window().alert({
	    			title: "错误提示",
	    			width: 300,
	    			height: 160,
	    			content: '请选择业态',
	    			hasCloseBtn: true
	    		});
	    		return false;
			}
			if($scope.company == "" || $scope.company == null){
				$scope.companySeach = "-1";
			}else{
				$scope.companySeach = $scope.company.id;
			}
			if($scope.area == "" || $scope.area == null){
				$scope.areaSeach = "-1";
			}else{
				$scope.areaSeach = $scope.area.id;
			}
			if($scope.city == "" || $scope.city == null){
				$scope.citySeach = "-1";
			}else{
				$scope.citySeach = $scope.city.id;
			}
			if($scope.accessSystem == "" || $scope.accessSystem == null){
				//获取该系统下的所有的系统
				$scope.xitongId = "-1";
			}else{
				$scope.xitongId = $scope.accessSystem.id;
			}
			
			$scope.yeTaiId = $scope.belongsFormat.id;
			$scope.projName =$.trim($scope.keywordSearch);//搜索关键词
			
			//进入查询明细
			$scope.getDetails();
		};

		//获取查询明细
		$scope.getDetails = function (search) {
			
			var searchInfo = $scope.createSearchInfo();
			projectServices.getDetails(searchInfo, function(response, status){
				//填充内容
				$scope.formatList = response.data.formatList;
				$scope.TotalRows = response.data.TotalRows;
				$scope.PageSize = response.data.PageSize;
				
				$scope.detailsLoaded = true;
			}, function(response, status){
				toastr.warning('获取数据失败', '提示', {
					closeButton: true,
					timeOut: 5000
				});
			});
		};

		//生成传给后台的查询对象
		$scope.createSearchInfo = function () {
			var searchInfo = {};
			searchInfo.currentPage = $scope.currentPage;
			searchInfo.PageSize = $scope.PageSize;
			searchInfo.sourceApp = $scope.yeTaiId;
			searchInfo.xitongId = $scope.xitongId;//所属系统
			searchInfo.projName = $scope.keyword;//搜索关键词
			searchInfo.companyId = $scope.companySeach;
			searchInfo.areaId = $scope.areaSeach;
			searchInfo.cityId = $scope.citySeach;

			return searchInfo;
			
		};

		$scope.modifyMapping = function(curObj, industryName){
			
			curObj.industryName = industryName;
			projectServices.getGroup({}, function(data){
			var modalInstance = $modal.open({
				templateUrl: 'modifyMapping.html',
				controller: modifyMappingInstanceCtrl,
				windowClass: 'app-modal-window',
				size: "",
				resolve: {
					structure: function(){
		        		return data;
		        	},
		        	curObj : function(){
		        		return curObj;
		        	}
				}
			});
		
			modalInstance.result.then(function(data){
				$scope.getDetails();
			});
			
			});
			
        };	
        
      //修改组织映射关系
		var modifyMappingInstanceCtrl = function($scope, $modalInstance, curObj, structure) {
			
			 $scope.initializeForEditController = function () {
				 
				  $scope.getYeTai();
				  
		      };
			  $scope.row = curObj;
			  $scope.belongsFormat = structure.belongsFormat;
			  $scope.myZnodes = structure.data.group;
			  
			  
			  	$scope.app_name = curObj.appName;
				$scope.cityOrgName = curObj.beorgName;
				$scope.row.projName = curObj.projName;
				$scope.row.projCode = curObj.projCode;
				$scope.row.uniguid = curObj.projGUID;
				$scope.row.parentProjCode = curObj.parentProjCode;
				$scope.xprojName = curObj.beprojName;
				$scope.xprojCode = curObj.beprojCode;
				$scope.row.rootprojName = curObj.parentProjName;
				$scope.xrootprojName = curObj.beparentProjName;
				$scope.groupOrgName = curObj.beorgName;
				$scope.row.lastModifyUser = curObj.modifyUserName;
				$scope.row.createTime = curObj.createTime;
				$scope.row.lastModifyTime = ((curObj.modifyTime!=null && curObj.modifyTime!="")?curObj.modifyTime:curObj.createTime);
				$scope.row.createUser = curObj.creator;
				$scope.row.industryName = curObj.industryName;
				$scope.industryName = curObj.industryName;
				$scope.row.industryOrgName = curObj.orgName;
				$scope.row.xprojGUID = curObj.beprojGUID;
				$scope.row.mappingguid = curObj.mappingGUID;
				$scope.orgname = curObj.orgName;
				$scope.row.origuid = curObj.beorgGUID;
				$scope.city = "";
				$scope.area = "";
				
				 //获取业态
			    $scope.getYeTai = function(){
			    	  projectServices.getYeTai({}, function (response, status){
			    		  		$scope.industryNames = response.data.yeTaiList;
			    	  		}, function(response, status){
			    				toastr.warning('获取数据失败', '提示', {
			    					closeButton: true,
			    					timeOut: 5000
			    				});
			    	  	});
			    };
				
			     //选择业态
			    $scope.selectIndustryName = function(o){
			    	$scope.industryName = o;
			    	$scope.row.industryName = o;
			    };
			      	      
				//组织z-tree
				$scope.mySettingMenu = {
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
					data: {
						simpleData: {
							enable: true
						}
					},
					callback: {
						/*beforeClick: function(treeId, treeNode){
							var check = (treeNode && !treeNode.isParent);
							if (!check)return check;
						},*/
						onClick: function(e, treeId, treeNode){
							var zTree = $.fn.zTree.getZTreeObj("selectMenu");
							$scope.$apply(function(){
		                    	   $scope.orgname = treeNode.name;
		                    	   $scope.orgguid = treeNode.id;
		                    	   projectServices.getProjs({'orgid':treeNode.id}, function(response, status){
		       							$scope.projects = response.data;
		       						}, function(response, status){
			       						toastr.warning('获取数据失败', '提示', {
			       							closeButton: true,
			       							timeOut: 5000
			       						});
		       						});
		                       });
							zTree.expandNode(treeNode);
							var cityObj = $("#citySel");
							cityObj.val(treeNode.name);
						}
					}
					
				};
				
				$scope.searchUniProj=function(searchTxt){
					projectServices.getProjs({'orgid':$scope.orgguid,"searchTxt":searchTxt}, function(response, status){
							$scope.projects = response.data;
					}, function(response, status){
   						toastr.warning('获取数据失败', '提示', {
   							closeButton: true,
   							timeOut: 5000
   						});
					});
				}
				
			  //选择项目
			  $scope.selection = function(city) {
				$scope.row.origuid = $scope.row.xprojGUID;
				$scope.row.uniguid = city.projGUID;
				$scope.row.projGUID = city.projGUID;
				$scope.row.projName = city.projName;
				$scope.row.parentguid = city.parentGUID;
				$scope.row.projCode = city.projCode;
				$scope.row.modifyuser = $rootScope.userName;
				$scope.row.modifyuserid = $rootScope.userId;
				
				$scope.row.creator = $rootScope.userName;
				$scope.row.creatorid = $rootScope.userId;
				$scope.row.mappingdatatype = 1;
				$scope.row.mappingstatus = 1;
				$scope.row.mappingname = "项目映射";
				
				$scope.row.industryOrgName = $scope.orgname;
				
				$scope.row.rootprojName = city.parentProjName;
				$scope.row.parentProjCode = city.parentProjCode;
				
			  };

			  $scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
			
			var info = {};
			
			$scope.changeyt = function(a){
				info.yt = a.value;
			};
			
			$scope.ok = function(){
				var windowParams = {title: "提示",height:180,width:300};  //提示
				if($scope.row.industryName == null || $scope.row.industryName == '' || $scope.row.industryName == undefined){
					windowParams.content = "请选择所属业态";
				}
				if(windowParams.content == null || windowParams.content == undefined){     
					var _param = $scope.row;
					projectServices.updateMbprojDeng(_param, function(response, status){
							$scope.row.mappingguid = response.data.success_guid;
							toastr.success(response.header.message, '提示', {
								closeButton: true,
								timeOut: 5000
							});
							
							$modalInstance.close();
						}, function(response, status){
							if(response.header.code == -1){
							toastr.warning("修改项目映射失败", '提示', {
								closeButton: true,
								timeOut: 5000
							});
						}
					});
				
				}else{
					new w.Window().alert(windowParams);
				}
			};
	
		};
		  
		// 对Date的扩展，将 Date 转化为指定格式的String
		// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
		// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
		// 例子： 
		// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
		// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
		Date.prototype.Format = function (fmt) { //author: edson.di 
		    var o = {
		        "M+": this.getMonth() + 1, //月份 
		        "d+": this.getDate(), //日 
		        "h+": this.getHours(), //小时 
		        "m+": this.getMinutes(), //分 
		        "s+": this.getSeconds(), //秒 
		        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		        "S": this.getMilliseconds() //毫秒 
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		 };
        
		
		//修改项目信息
		var mappingBanInstanceCtrl = function($scope, $modalInstance, curObjb) {
			$scope.curProj = curObjb;
			$scope.gprojName = curObjb.projName;
			$scope.xprojName = curObjb.beprojName;
			$scope.rootprojName = curObjb.parentProjName;
			
			var info = {};
			info.projGUID = $scope.curProj.projGUID;
			info.xprojGUID = $scope.curProj.beprojGUID;
			
			projectServices.getBuildings(info, function(response, status){
				
				$scope.formatList = response.data.build;
//				$scope.floorNumList = response.data.floorNumList;
				$scope.choosebuilds = response.data.choosebuilds;
				
				
				}, function(response, status){
					toastr.warning('获取数据失败', '提示', {
						closeButton: true,
						timeOut: 5000
					});
			})
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
			
			
			$scope.assignBuild = function(row) {
//				row.uniguid = row.building.codevalue;
				row.xbldGUID = row.uniguid;
//				row.xbldName = row.building.codename;
				row.creator = $rootScope.userName;
				row.creatorid = $rootScope.userId;
				row.modifyuser = $rootScope.userName;
				row.modifyuserid = $rootScope.userId;
				row.mappingdatatype = 2;
				row.origuid = row.gbldGUID;
				row.mappingstatus = 1;
				row.mappingname = "楼栋映射";
			};
			
			
			$scope.ok = function(){
				
				var paramList = [];
				angular.forEach($scope.formatList, function(item, index){
					if ( item.mappingguid || item.uniguid) {
						paramList.push(item);
					}
				});
				
				projectServices.updatebuildingdeng({jsonString: JSON.stringify(paramList)}, function(response, status){
						toastr.success(response.header.message, '提示', {
							closeButton: true,
							timeOut: 5000
						});
						$modalInstance.close({});
					}, function(response, status){
						toastr.warning(response.header.message, '提示', {
						closeButton: true,
						timeOut: 5000
					});
				});
				
			};
	
		  };

		$scope.mappingBan = function(curObjb){
			
			var modalInstance = $modal.open({
				templateUrl: 'mappingBan.html',
				controller: mappingBanInstanceCtrl,
				windowClass: 'app-modal-window',
				size: "",
				resolve: {
//					structure: function(){
//		        		return data;
//		        	},
		        	curObjb : function(){
		        		return curObjb;
		        	}
				}
			});
			
        };	
     	

		
	
        
        $scope.exportAll = function(){
        	if($scope.belongsFormat == "" || $scope.belongsFormat == null){
				new w.Window().alert({
	    			title: "错误提示",
	    			width: 300,
	    			height: 160,
	    			content: '请选择业态',
	    			hasCloseBtn: true
	    		});
	    		return false;
			}
			if($scope.company == "" || $scope.company == null){
				$scope.companySeach = "-1";
			}else{
				$scope.companySeach = $scope.company.id;
			}
			if($scope.area == "" || $scope.area == null){
				$scope.areaSeach = "-1";
			}else{
				$scope.areaSeach = $scope.area.id;
			}
			if($scope.city == "" || $scope.city == null){
				$scope.citySeach = "-1";
			}else{
				$scope.citySeach = $scope.city.id;
			}
			if($scope.accessSystem == "" || $scope.accessSystem == null){
				//获取该系统下的所有的系统
				$scope.xitongId = "-1";
			}else{
				$scope.xitongId = $scope.accessSystem.id;
			}
			
			var xitongId = $scope.xitongId;
        	var projName = $scope.keyword;
        	var yeTaiName = $scope.belongsFormat.name;
        	var xitongName = $scope.accessSystem.name;
        	var sourceApp = $scope.yeTaiId;
        	var companyId = $scope.companySeach;
        	var areaId = $scope.areaSeach;
        	var cityId = $scope.citySeach;
        	
        	$scope.exportBuildMapping({
        		"sourceApp":sourceApp,
        		"companyId":companyId,
        		"areaId":areaId,
        		"cityId":cityId,
        		"xitongId":xitongId,
        		"projName":projName,
        		"yeTaiName":yeTaiName
        	});
        	
			/*var Header = "<tbody>";
			Header += "<tr>";
			Header += "<th colspan='6'>接入系统</th>";
			Header += "<th colspan='5'>客户数据管理平台[本地]</th>";
			Header += "<th rowspan='2'>最近修改人</th>";
			Header += "<th rowspan='2'>最近修改时间</th>";
			Header += "<th rowspan='2'>操作</th>";
			Header += "</tr>";
			Header += "<tr>";
			Header += "<th>序号</th>";
			Header += "<th>系统名称</th>";
			Header += "<th>组织</th>";
			Header += "<th>项目名称</th>";
			Header += "<th>项目编号</th>";
			Header += "<th>父级项目</th>";
			Header += "<th>业态</th>";
			Header += "<th>所属组织</th>";
			Header += "<th>项目名称</th>";
			Header += "<th>项目编号</th>";
			Header += "<th>父级项目</th>";
			Header += "</tr>";
			
        	angular.element($('#tab')).tableExport({ type: 'excel', //类型 txt，data，cvs，json，pdf，jpn
        		                                     escape: 'false', //读取table元素写入execl的一个参数
        		                                     consoleLog : 'false', //console 是否打印
        		                                     Header : Header       //头文件 主要处理多表头，没有多表头不需要此参数
            });*/
        }
        
        $scope.exportBuildMapping = function(info){
        	if($scope.TotalRows == 0){
        		toastr.warning("暂无数据", '提示', {
        			closeButton: true,
        			timeOut: 5000
        		});
        	}else{
        		projectServices.exportBuildMapping(info);
        	}
        };
        
        //导入
        var importInInstanceCtrl = function($scope, $modalInstance) {
        	
        	$scope.importTemplate = function(){
    			projectServices.getYeTai({}, function(response){
    				var modalInstance = $modal.open({
    					templateUrl: 'importTemplate.html',
    					controller: importTemplateInstanceCtrl,
    					windowClass: 'app-modal-window',
    					size: "",
    					resolve: {
    						structure: function(){
    			        		return response.data;
    			        	}
    					}
    				});
    			})
            };	
            
    		//导出为模板
    		var importTemplateInstanceCtrl = function($scope, $modalInstance, structure) {
    			
    			$scope.selected = {};
    		    $scope.selected.exbelongsFormats = structure.yeTaiList;
    		    $scope.selected.exbelongsFormat = "";
    		    
    			//yeTai改变
    		    $scope.changeExYeTai = function(a){
    		    	if(a == "" || a == null){
    		    		  $scope.selected.exaccessSystem = "";
    		    		  $scope.selected.excompany = "";
    		    		  $scope.selected.exarea = "";
    		    		  $scope.selected.excity = "";
    		    	  }
    		    	  if(a != "" && a != null){
    		    		  var yeTaiId = a.id;
    		    		  $scope.getExXiTongOrg(yeTaiId);
    		    	  }
    		    }
    		    
    		    //company改变
    		    $scope.changeExCompany = function(excompany){
    		    	$scope.selected.excity = "";
    		    	$scope.selected.exarea = "";
    		    };
    		      
    		    //区域改变
    		    $scope.changeExArea = function(exarea){
    		    	$scope.selected.excity = "";
    		    };
    		    
    			$scope.cancel = function() {
    				$modalInstance.dismiss('cancel');
    			};
    			
    			$scope.exportBuildMappingTemp = function(){
    	        	if($scope.selected.exbelongsFormat == "" || $scope.selected.exbelongsFormat == null){
    					new w.Window().alert({
    		    			title: "错误提示",
    		    			width: 300,
    		    			height: 160,
    		    			content: '请选择业态',
    		    			hasCloseBtn: true
    		    		});
    		    		return false;
    				}
    	        	
    	        	if($scope.selected.company == "" || $scope.selected.company == null){
    					$scope.selected.companySeach = "-1";
    				}else{
    					$scope.selected.companySeach = $scope.selected.company.id;
    				}
    				if($scope.selected.area == "" || $scope.selected.area == null){
    					$scope.selected.areaSeach = "-1";
    				}else{
    					$scope.selected.areaSeach = $scope.selected.area.id;
    				}
    				if($scope.selected.city == "" || $scope.selected.city == null){
    					$scope.selected.citySeach = "-1";
    				}else{
    					$scope.selected.citySeach = $scope.city.id;
    				}
    				if($scope.selected.accessSystem == "" || $scope.selected.accessSystem == null){
    					//获取该系统下的所有的系统
    					$scope.selected.xitongId = "-1";
    				}else{
    					$scope.selected.xitongId = $scope.selected.accessSystem.id;
    				}
    	        	
    	        	var yeTaiName = $scope.selected.exbelongsFormat.name;
    	        	var xitongName = $scope.selected.exaccessSystem.name;
    	        	var companyId = $scope.selected.companySeach;
    	        	var areaId = $scope.selected.areaSeach;
    	        	var cityId = $scope.selected.citySeach;
    	        	
    				var xitongId = $scope.selected.xitongId;
    				var sourceApp = $scope.selected.exbelongsFormat.id;
    				$scope.cancel();
    				projectServices.exportBuildMappingTemp({"xitongId":xitongId, "sourceApp":sourceApp, "companyId":companyId, "areaId":areaId, "cityId":cityId, "yeTaiName":yeTaiName, "xitongName":xitongName});
    	        };
    	        
    	        //获取接入系统和组织架构
    			$scope.getExXiTongOrg = function(yeTaiId){
    				projectServices.getXiTongOrg({'yeTaiId':yeTaiId}, function (response, status){
    		    		$scope.selected.exaccessSystems = response.data.xiTongList;
    		    		$scope.selected.exaccessSystem = "";
    		    		$scope.selected.excompanys = response.data.orgList;
    		    		$scope.selected.excompany = "";
    		    		$scope.selected.exarea = "";
    		    		$scope.selected.excity = "";
    		    	}, function(response, status){
    		    		toastr.warning('获取数据失败', '提示', {
    		    			closeButton: true,
    		    			timeOut: 5000
    		    		});
    		    	});
    		    };
    			
    		};   
        	
        	
        	
        	$scope.imported = true;
        	//改变选择文件
			$scope.fileChange = function(files){
				if(files != null){
					$scope.fileInfo = files[0];
					$scope.imported = false;
				}
			}
			$scope.doImport = function(){
				if($scope.fileInfo == null){
					alert("请先选择后缀为.xls或.xlsx的文件");
					return;
				}else{
					var filename = $scope.fileInfo.name;
					filename = filename.substr(filename.lastIndexOf("."));
					if(filename != null && filename != '' && (filename == '.xls' || filename == '.xlsx')){
						$scope.cancel();
						$scope.upload($scope.fileInfo);
					}else{
						alert("请先选择后缀为.xls或.xlsx的文件");
					}
				}
//				//利用ng-file-upload导入文件$scope.fileInfo,在成功回调后面设置已经导入 
				$scope.imported = true;

			}
			
			$scope.upload = function (file){
				Upload.upload({
					url:"system/doprojExeclMappImport.g",
					file: file
				}).success(function(response){
					toastr.success(response.data, '提示', {
						closeButton: true,
						timeOut: 5000
					});
				}).error(function(){
					toastr.error('上传失败', '提示', {
						closeButton: true,
						timeOut: 5000
					});
				});
			}
			
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
        	
        };
		
		$scope.importIn = function(){
	        var modalInstance = $modal.open({
        		templateUrl: 'importIn.html',
        		controller: importInInstanceCtrl,
        		windowClass: 'app-modal-window',
        		size: "",
        		resolve: {
//	        			  structure: function(){
//	        			      return data;
//	        			     }
	        		}
	        	});
	        };
  }]);
});

