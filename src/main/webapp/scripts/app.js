"use strict";

define(['angularAMD', 'config', 'util', 'window', 'blockUI', 'directives', 'jquery', 'ui-bootstrap', 'angular-sanitize', 'angular-ui-router', 
        'slider','toastr','Upload','ztree','ztree-exedit','ztree-excheck','ocLazyLoad','echarts3'], function (angularAMD, config, util, w ,bok) {

	var blockUI = new bok.BlockUI();
    //console.log(util)
    var app = angular.module("app", ['ngSanitize', 'ui.bootstrap', 'ui.router', 'utilModule', 'commonDirectives', 'ui.slider','toastr', 'ngFileUpload','oc.lazyLoad']);
    
    
    app.config(function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.withCredentials = true;
    });

    app.filter("deletePoint", function(){
        return function(str){
            var str = str.slice(0,str.length-1);
            var num = parseInt(+str);
            return num + "%";
        }
    })


    //设置block ui
    /*app.config(function (blockUIConfigProvider) {
        blockUIConfigProvider.message("数据正在加载中");
        blockUIConfigProvider.delay(1);
        blockUIConfigProvider.autoBlock(false);
    });*/


    // 设置拦截器
    app.config(['$httpProvider', function($httpProvider) {

        var interceptor = function($q, $rootScope) {
            return {
                "response": function(response) {

                    if (response && response.data && response.data.header && response.data.header.code) {
                        switch (response.data.header.code) {
                            // 对应401未授权的请求
                            case 3:
                                $rootScope.$broadcast("auth:loginRequired");
                                break;
                            case 4: 
                            	$rootScope.$broadcast("server:connotOperation"); 
                            	break;
                        }
                    }

                    return response;
                },
                "responseError": function(rejection) {
                   // console.log("no");
                    //dir(rejection)
                    switch (rejection.status) {
                            // 对应401未授权的请求
                        case 401:
                            $rootScope
                                .$broadcast("auth:loginRequired")
                            break;
                            // 对应403禁止的请求
                        case 403:
                            $rootScope
                                .$broadcast("auth:forbidden")
                            break;
                            // 对应404页面找不到
                        case 404:
                            $rootScope
                                .$broadcast("page:notFound")
                            break;
                            // 对应500服务器错误
                        case 500:
                            $rootScope
                                .$broadcast("server:error")
                            break;
                    }
                    return $q.reject(rejection);
                }
            }
        }

        // 注入拦截器
        $httpProvider.interceptors.push(interceptor);

    }]);

    app.run(["$rootScope", "$state", "$stateParams", "$location", function($rootScope, $state, $stateParams, $location){
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        //身份验证事件绑定
        // 对应401未授权的请求
        $rootScope.$on("auth:loginRequired", function() {
            // console.log("auth:loginRequired");
            // 跳转到登录界面
            if ($location.$$path.split("/").join(".")
                    .slice(1) == "access.signin") {
                // 如果当前已经是登录界面则不用继续调整到登录界面
                return false;
            }
            $state.go("access.signin");
        });

        // 对应403禁止的请求
        $rootScope.$on("auth:forbidden", function() {
            // console.log("auth:forbidden");
        });

        // 对应404页面找不到
        $rootScope.$on("page:notFound", function() {
            // console.log("page:notFound");
        });

        // 对应500服务器错误
        $rootScope.$on("server:error", function() {
            // console.log("server:error");
        });
        
        // 对应的没有操作功能权限
		$rootScope.$on("server:connotOperation",
		function() {
			//$state.go("access.forbidden");
		});

    }]);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        
            $stateProvider
            .state("app", angularAMD.route({
                "abstract": !0,
                url: "/app",
                views: {
                    "": {
                        templateUrl: "views/layout.html?" + config.templateVersion
                    }
                }
            }))
            //客户
             .state("app.client", angularAMD.route({
                url: "/client",
                templateUrl: "views/direct/direct.html?" + config.templateVersion,
                controllerUrl: "views/direct/directCtrl",
                resolve: {
                    deps: ["$ocLazyLoad", function(a) {
                        return a.load(["views/client/client.css"])
                    }]
                }
            }))
            
            .state("app.clientShow", angularAMD.route({
                url: "/clientShow",
                templateUrl: "views/client/clientShow/clientShow.html?" + config.templateVersion,
                controllerUrl: "views/client/clientShow/clientShowCtrl",
                resolve: {
                    deps: ["$ocLazyLoad", function(a) {
                        return a.load(["views/client/client.css"])
                    }]
                }
            }))
            
            .state("app.client.portrait", angularAMD.route({
                "abstract": !0,
                url: "/portrait",
                template:'<div ui-view></div>'
            }))
            .state("app.client.portrait.clientPortrait", angularAMD.route({
                url: "/clientPortrait",
                templateUrl: "views/client/clientPortrait/clientProtrait.html?" + config.templateVersion,
                controllerUrl: "views/client/clientPortrait/clientProtraitCtrl"
            }))
            .state("app.client.portrait.companyPortrait", angularAMD.route({
            	url: "/companyPortrait/:cstGUID",
            	templateUrl: "views/client/clientPortrait/companyPortrait/companyPortrait.html?" + config.templateVersion,
            	controllerUrl: "views/client/clientPortrait/companyPortrait/companyPortraitCtrl"
            }))
            .state("app.client.portrait.personPortrait", angularAMD.route({
            	url: "/personPortrait/:cstGUID",
            	templateUrl: "views/client/clientPortrait/personPortrait/personPortrait.html?" + config.templateVersion,
            	controllerUrl: "views/client/clientPortrait/personPortrait/personPortraitCtrl"            	
            }))
             .state("app.clientSearch", angularAMD.route({
                url: "/clientSearch/:jobGUID",
                templateUrl: "views/client/clientSearch/clientSearch.html?" + config.templateVersion,
                controllerUrl: "views/client/clientSearch/clientSearchCtrl",
                resolve: {
                    deps: ["$ocLazyLoad", function(a) {
                        return a.load(["views/client/client.css"])
                    }]
                }
            }))
            //跟踪分析
            .state("app.trace", angularAMD.route({
                url: "/trace",
                templateUrl: "views/direct/direct.html?" + config.templateVersion,
                controllerUrl: "views/direct/directCtrl",
                resolve: {
                    deps: ["$ocLazyLoad", function(a) {
                        return a.load(["views/trace/trace.css"])
                    }]
                }
            }))
             .state("app.traceMain",angularAMD.route({
                url:"/traceMain",
                templateUrl:"views/trace/traceMain/traceMain.html?" + config.templateVersion,
                controllerUrl:"views/trace/traceMain/traceMainCtrl",
                resolve: {
                    deps: ["$ocLazyLoad", function(a) {
                        return a.load(["views/trace/trace.css"])
                    }]
                }
            }))
            .state("app.trace.forsale",angularAMD.route({
                url:"/forsale/:jobGUID",
                templateUrl:"views/trace/forsale/forsale.html?" + config.templateVersion,
                controllerUrl:"views/trace/forsale/forsaleCtrl",
                resolve: {
                    deps: ["$ocLazyLoad", function(a) {
                        return a.load(["views/trace/trace.css"])
                    }]
                }
            }))
             .state("app.trace.forbusiness",angularAMD.route({
                url:"/forbusiness/:jobGUID",
                templateUrl:"views/trace/forbusiness/forbusiness.html?" + config.templateVersion,
                controllerUrl:"views/trace/forbusiness/forbusinessCtrl",
                resolve: {
                    deps: ["$ocLazyLoad", function(a) {
                        return a.load(["views/trace/trace.css"])
                    }]
                }
            }))
            //系统设置
             .state("app.system", angularAMD.route({
                url: "/system",
                templateUrl: "views/direct/direct.html?" + config.templateVersion,
                controllerUrl: "views/direct/directCtrl",
                 resolve:{
                    deps:["$ocLazyLoad",function(a){
                        return a.load(["views/set/set.css"])
                    }]
                }
            }))
            
            .state("app.system.base",angularAMD.route({
                url:"/base",
                templateUrl:"views/set/baseSet/baseSet.html?" + config.templateVersion,
                controllerUrl:"views/set/baseSet/baseSetCtrl"
            }))
            .state("app.system.base.user", angularAMD.route({
                url: "/user",
                templateUrl: "views/set/baseSet/users/users.html?" + config.templateVersion,
                controllerUrl: "views/set/baseSet/users/usersCtrl"
            }))
            .state("app.system.base.role", angularAMD.route({
                url: "/role",
                templateUrl: "views/set/baseSet/role/myRole.html?" + config.templateVersion,
                controllerUrl: "views/set/baseSet/role/myRoleCtrl"
            }))
            .state("app.system.base.desensitizationSet", angularAMD.route({
                url: "/desensitizationSet",
                templateUrl: "views/set/baseSet/desensitizationSet/desensitization.html?" + config.templateVersion,
                controllerUrl: "views/set/baseSet/desensitizationSet/desensitizationCtrl"
            }))
            .state("app.system.base.sysCode", angularAMD.route({
                url: "/sysCode",
                templateUrl: "views/sysCode/sysCode.html?" + config.templateVersion,
                controllerUrl: "views/sysCode/sysCodeCtrl"
            }))
            .state("app.system.base.jobManager", angularAMD.route({
            	url: "/jobManager",
            	templateUrl: "views/set/baseSet/jobManager/jobManager.html?" + config.templateVersion,
            	controllerUrl: 'views/set/baseSet/jobManager/jobManagerCtrl'
		    }))
            .state("app.system.label",angularAMD.route({
                url:"/label",
                templateUrl:"views/set/labels/label.html?" + config.templateVersion,
                controllerUrl:"views/set/labels/labelCtrl"
            }))
            .state("app.system.label.standard", angularAMD.route({
                url: "/standard",
                templateUrl: "views/set/labels/labelStandard/labelStandard.html?" + config.templateVersion,
                controllerUrl: "views/set/labels/labelStandard/labelStandardCtrl"
            }))
            .state("app.system.label.business", angularAMD.route({
                url: "/business",
                templateUrl: "views/set/labels/labelBusiness/labelBusiness.html?" + config.templateVersion,
                controllerUrl: "views/set/labels/labelBusiness/labelBusinessCtrl"
            }))
            .state("app.system.label.configLabel",angularAMD.route({
				url : "/configLabel",
				templateUrl : "views/set/labels/configLabel/configLabel.html?"+ config.templateVersion,
				controllerUrl : 'views/set/labels/configLabel/configLabelCtrl'
			}))
            .state("app.system.mainData",angularAMD.route({
                url:"/mainData",
                templateUrl:"views/set/conflict/conflict.html?" + config.templateVersion,
                controllerUrl:"views/set/conflict/conflictCtrl"
            }))
            .state("app.system.mainData.conflic", angularAMD.route({
                url: "/conflic",
                templateUrl: "views/set/conflict/phoneConflict/phoneConflict.html?" + config.templateVersion,
                controllerUrl: "views/set/conflict/phoneConflict/phoneConflictCtrl"
            }))
            .state("app.system.mapping",angularAMD.route({
                url:"/mapping",
                templateUrl:"views/set/mapping/mapping.html?" + config.templateVersion,
                controllerUrl:"views/set/mapping/mappingCtrl"
            }))
            .state("app.system.mapping.projMapping",angularAMD.route({
                url:"/projMapping",
                templateUrl:"views/set/mapping/projMapping/project.html?" + config.templateVersion,
                controllerUrl:"views/set/mapping/projMapping/projectCtrl"
            }))
            .state("app.system.operlog",angularAMD.route({
                url:"/operlog",
                templateUrl:"views/set/operLog/operLog.html?" + config.templateVersion,
                controllerUrl:"views/set/operLog/operLogCtrl"
            }))
             .state("app.set.modify",angularAMD.route({
                url:"/modify",
                templateUrl:"views/set/modify/modify.html?" + config.templateVersion,
                controllerUrl:"views/set/modify/modifyCtrl"
            }))
            
            
            .state("access", angularAMD.route({
                url: "/access",
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            }))
            .state("access.signin", angularAMD.route({
                url: "/signin",
                templateUrl: "views/set/signin/signin.html?" + config.templateVersion,
                controllerUrl: "views/set/signin/signinCtrl"
            }))
            .state("access.forbidden", angularAMD.route({
            	url: "/forbidden",
            	templateUrl: "views/forbidden/forbidden.html?" + config.templateVersion
            }))
            .state("app.system.base.sysModules", angularAMD.route({
            	url: "/sysModules",
            	templateUrl: "views/set/baseSet/sysModules/sysModules.html?" + config.templateVersion,
            	controllerUrl: 'views/set/baseSet/sysModules/sysModulesCtrl'
            }))
            //任务调度页面
            .state("app.jobManager", angularAMD.route({
            	url: "/jobManager",
            	templateUrl: "views/set/baseSet/jobManager/jobManager.html?" + config.templateVersion,
            	controllerUrl: 'views/set/baseSet/jobManager/jobManagerCtrl'
            }))
            //由于“仪表盘”会根据角色不定导致地址不定，所以把登录后的匹配路径设置到客户概览里
            $urlRouterProvider.otherwise("/app/clientShow");

      }]);

    var time = 0;
    var indexController = function($scope, $rootScope, $http,$q,
            $location, $window, $state) {
        $scope.initializeController = function() {

            $scope.Title = "数据管理平台";

            // 获取导航以及
            $scope.initializeApplication(
                    $scope.initializeApplicationComplete,
                    $scope.initializeApplicationError);

        }
        
        $scope.clickModule = function(module) {
        	if($rootScope.modulesCode.indexOf("'" + module.name + "'") < 0) {
        		//提示无权限
        		new w.Window().alert({
					title:"错误提示",
					content: "您没有操作权限！",
					hasCloseBtn: true,
					width: 300,
					height:150
				})
        		return false;
        	}
			var moduleToGo = (module.name!=''?module.name:'app.clientShow');
			if (module.value.modKind == 2) {
				$rootScope.moduleNowClick = module;
				$state.go(moduleToGo);
			}
		}

        $rootScope.layout = {};

        // 弹出导航颜色样式数组
        $scope.popMenuBg = [ 'bg-info', 'bg-primary', 'bg-success',
                'bg-warning', 'bg-danger', 'bg-inverse', 'bg-primary',
                'bg-success', 'bg-info', 'bg-primary', 'bg-success',
                'bg-warning', 'bg-danger', 'bg-inverse', 'bg-primary',
                'bg-success' ];
        
        $scope.getPathModules = function(appname, modules) {
			var a = [];
			var b = appname.split(".");
			
			var _name_ = [];
			var name = "";
			var _module_ = modules;
			var _children_ = [];
			for (var i=0; i<b.length; i++) {
				_name_.push(b[i]);
				name = _name_.join(".");
				if (angular.isArray(_module_)) { //如果当前是一个数组
					var _c_module_ = _checkForNowModule(name, _module_);
					if (_c_module_ != null) {
						a.push(_c_module_);
						_module_ = _c_module_.children;
					}
				} else {
					_module_ = modules.children;
					a.push(modules);
				}
			}
			return a;
		}
		
		
		function _checkForNowModule(name, arr) {
			var _ret_module_ = null;
			for (var a=0; a<arr.length; a++) {
				var _module_ = arr[a];
				if (name === arr[a].name) { //如果匹配上了名字，则返回当前module
					_ret_module_ = _module_;
					break;
				}
			}
			return _ret_module_;
		}
        
        //设置链接
         $scope.unHref = function(h){
            var a = "";
            a = "#/" + h.split(".").join("/");
            return a;
        }
        //导航菜单-->鼠标移入
         $scope.menter = function(n,obj){
             angular.forEach(obj,function(v,k){
                 v.dropdown = false;
             })
             n.dropdown = true;
         }
        
        // 设置二级导航
        function getRootMenu(menu) {
            if (menu == null) {
                return {}
            }
            // console.log(menu)
            if (menu.ParentID == null) {
                $scope.rootMenu = menu;
            } else {
                // console.log("no");
                // console.log(111);
                // console.log("now3");
                // console.dir($rootScope.menuItems);
                getParentMenu(menu, $rootScope.menuItems);
                getRootMenu(parentMenu)
            }
            // angular.forEach()
        }
        var parentMenu = null;
        function getParentMenu(menu, items) {
            // console.log("start");
            // console.log(menu);
            angular.forEach(items, function(item, index) {
                // console.log("menu");
                // console.log(menu);
                // console.log("menuId:" + item.menuId + " parentId: " +
                // menu.parentId);
                if (item.menuId == menu.parentId) {
                    // alert(3333);
                    // console.log("same");
                    parentMenu = item;
                }
                if (item.subMenus && item.subMenus.length > 0) {
                    getParentMenu(menu, item.subMenus);
                }
            });
            // return parentMenu;
        }
        
        $scope.initializeApplication = function(successFunction, errorFunction) {
        	var url = window.location.href;
        	var cst = "";
        	if(url.lastIndexOf('=') > 0){
        		cst = url.substring(url.lastIndexOf('=')+1, url.length);
        	}
        	
			var path = $location.$$path.split("/").join(".").slice(1);
			if ($rootScope && !$rootScope.moduleNowClick && path != "access.signin") {
				blockUI.start();
				
				$.ajax({
					type: "POST",
     			    url: "auth/initData.g?cst="+cst,
     			    async: false,
     			    success: function(response){
     				   if (response.header.code == 0) {// 如果是已经登录的，且又是在登录界面，则跳转到仪表盘，暂时屏蔽，否则在登录界面刷新会跳转到仪表盘
            				/*
            				 * if($location.$$path.split("/").join(".").slice(1) ==
            				 * "access.signin"){ $state.go("app.dashboard"); }
            				 */
            				$rootScope.modules = response.data.modules; //有权限的模块
        					$rootScope.modulesCode = response.data.modulesCode; //有权限的模块名称
        					$rootScope.allModules = response.data.allModules; //所有模块
            				$rootScope.userName = response.data.user.userName;
            				$rootScope.userId = response.data.user.userId;
            				$rootScope.orgId = response.data.user.orgId;
            				$rootScope.userType = response.data.user.userType;
            				$rootScope.pathModules = $scope.getPathModules(path, $rootScope.allModules);
            				if ($rootScope.pathModules.length > 0) {
            					$rootScope.moduleNowClick = $rootScope.pathModules[$rootScope.pathModules.length -1];
            				}
                				
            			}else if(response.header.code == 4){
                        	window.location.href=response.header.message;
                        } else {// 跳转到登录界面
            				if ($location.$$path.split("/").join(".").slice(1) == "access.signin") { // 如果当前已经是登录界面则不用继续调整到登录界面
            					return false;
            				}
            				$state.go("access.signin");
            			}
     				   	blockUI.stop();
     			    },
     			    failure: function(response) {
						// 提示请求失败
						new w.Window().alert({
							width: 300,
							height: 200,
							content: "请求失败"
						})
						blockUI.stop();
     			    }
				});
				
//				$scope.AjaxGet("auth/initData", successFunction, errorFunction).then(function() {
//					blockUI.stop();
//				});
			} else {
				$state.go("access.signin");
			}
		
		};
		
		$scope.noPermission = function() {
        	new w.Window().alert({
				title:"错误提示",
				content: "您没有操作权限！",
				hasCloseBtn: true,
				width: 300,
				height:150
			})
    		return false;
        }

        $scope.AjaxGet = function(route, successFunction, errorFunction) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			setTimeout(function() {
				$http({
					method : 'GET',
					url : route
				}).success(function(response, status, headers, config) {
					successFunction(response, status);
					deferred.resolve();
				}).error(function(response) {
					errorFunction(response);
					deferred.reject();
				});
			}, 1);
			return promise;
		};
		//路由Active
        $scope.isPortrait = function(h){
            var bool = false;
            if(($state.$current.name == 'app.client.portrait.personPortrait' || $state.$current.name == 'app.client.portrait.companyPortrait') && h == "app.client.portrait.clientPortrait"
              || ($state.$current.name == 'app.trace.forsale') && h == "app.trace.traceMain"){
                bool = true;
            }
            return bool;
        }
        
        // 退出登录
		$scope.exitSign = function() {
			$http({
				method : 'GET',
				url : "auth/logout.g"
			}).success(function(response, status) {
				// 退出成功后跳转到登录界面
				$state.go("access.signin");
			}).error(function(response, status) {
				toastr.warning('获取数据失败', '提示', {
					closeButton : true,
					timeOut : 5000
				});
			});
		}

    };

    app.filter('strToDate', [ function() {
        return function(text) {
            if (text == null || text == '') {
                return '未知';
            } else {
                var date = text.replace(/-/ig, "/");
                var date_time = Date.parse(date);
                var str = date.substring(0, 4);
                if (str == '1970') {
                    return '未知';
                }
                return new Date(date_time);
            }
        }
    } ]);
	
	app.filter("highlight", function($sce, $log){
		var fn = function(text, search){
			$log.info("text: " + text);
			$log.info("search: " + search);
	
			if (!search) {
				return $sce.trustAsHtml(text);
			}
			text = encodeURI(text);
			search = encodeURI(search);
	
			var regex = new RegExp(search, 'gi')
			var result = text.replace(regex, '<span class="highlightedText">$&</span>');
			result = decodeURI(result);
			$log.info("result: " + result );
			return $sce.trustAsHtml(result);
		};
	
		return fn;
	});

    indexController.$inject = [ '$scope', '$rootScope', '$http','$q',
            '$location', '$window', '$state' ];
    app.controller("indexController", indexController);
    angularAMD.bootstrap(app);
    return app;
});