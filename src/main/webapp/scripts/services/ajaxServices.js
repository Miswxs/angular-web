define(['app','blockUI'], function (app,bok) {

    app.register.service('ajaxService', ['$http', '$q', function ($http, $q) {

        // setting timeout of 1 second to simulate a busy server.

        this.AjaxPost = function (data, route, successFunction, errorFunction) {
        	 var blockUI = new bok.BlockUI();
        	//console.dir(data);
        	var deferred = $q.defer();
            blockUI.start();
            setTimeout(function () {
                $http.post(route, data).success(function (response, status, headers, config) {
                    blockUI.stop();
                    successFunction(response, status);
                    deferred.resolve(response);
                }).error(function (response) {
                    blockUI.stop();
                    if (response.IsAuthenicated == false) { window.location = "/index.html"; }
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 300);
            return deferred.promise;
        }
        
        this.AjaxFormPost = function (data, route, successFunction, errorFunction) {
        	 var blockUI = new bok.BlockUI();
			var deferred = $q.defer();
            blockUI.start();
	
			var transform = function(data){
			   return $.param(data);
		  	}
					
			var header = {
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					transformRequest: transform
   			};
				
            setTimeout(function () {
                $http.post(route,data,header).success(function (response, status, headers, config) {
                	
                	blockUI.stop();
                    successFunction(response, status);
                    deferred.resolve(response);
                }).error(function (response) {
                    blockUI.stop();
                    if (response.header && response.header.code == 3) { window.location = "/index.html"; }
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 300);
            return deferred.promise;
        }
        //不显示加载图标
        this.AjaxFormOtherPost = function (data, route, successFunction, errorFunction) {
			var deferred = $q.defer();
	
			var transform = function(data){
			   return $.param(data);
		  	}
					
			var header = {
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					transformRequest: transform
   			};
				
            setTimeout(function () {
                $http.post(route,data,header).success(function (response, status, headers, config) {
                	
                    successFunction(response, status);
                    deferred.resolve(response);
                }).error(function (response) {
                    if (response.header && response.header.code == 3) { window.location = "/index.html"; }
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 300);
            return deferred.promise;
        }
        
        this.AjaxJsonPost = function (data, route, successFunction, errorFunction) {
        	 var blockUI = new bok.BlockUI();
			var deferred = $q.defer();
            blockUI.start();
	
			var transform = function(data){
			   return $.param(data);
		  	}
					
			var header = {
					headers: { 'content-Type': 'application/json','dataType':'json'}
   			};
				
            setTimeout(function () {
                $http.post(route,data,header).success(function (response, status, headers, config) {
                	
                	blockUI.stop();
                    successFunction(response, status);
                    deferred.resolve(response);
                }).error(function (response) {
                    blockUI.stop();
                    if (response.header && response.header.code == 3) { window.location = "/index.html"; }
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 300);
            return deferred.promise;
        }
        
        this.AjaxFormPostNoBlock = function (data, route, successFunction, errorFunction) {
			var deferred = $q.defer();
			var transform = function(data){
			   return $.param(data);
		  	}
			
			var header = {
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					transformRequest: transform
   			};
				
            setTimeout(function () {
                $http.post(route,data,header).success(function (response, status, headers, config) {
                	successFunction(response, status);
                	deferred.resolve(response);
                }).error(function (response) {
                    if (response.header.code == 3) { window.location = "/index.html"; }
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 300);
            return deferred.promise;
        }

        this.AjaxPostNoBlock = function (data, route, successFunction, errorFunction) {
			var deferred = $q.defer();
            setTimeout(function () {
                $http.post(route, data).success(function (response, status, headers, config) {
                	
                	successFunction(response, status);
                	deferred.resolve(response);
                }).error(function (response) {
                    if (response.IsAuthenicated == false) { window.location = "/index.html"; }
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 300);
            return deferred.promise;
        }

        this.AjaxPostWithNoAuthenication = function (data, route, successFunction, errorFunction) {
        	 var blockUI = new bok.BlockUI();
			var deferred = $q.defer();
            blockUI.start();
            setTimeout(function () {
                $http.post(route, data).success(function (response, status, headers, config) {
                	
                	blockUI.stop();
                    successFunction(response, status);
                    deferred.resolve(response);
                }).error(function (response) {
                    blockUI.stop();
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 300);
            return deferred.promise;
        }

        this.AjaxGet = function (route, successFunction, errorFunction) {
        	 var blockUI = new bok.BlockUI();
			var deferred = $q.defer();
            blockUI.start();
            setTimeout(function () {
                $http({ method: 'GET', url: route }).success(function (response, status, headers, config) {
                	
                	blockUI.stop();
                    successFunction(response, status);
                    deferred.resolve(response);
                }).error(function (response) {
                    blockUI.stop();
                    if (response.IsAuthenicated == false) { window.location = "/index.html"; }
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 300);
            return deferred.promise;
        }

        this.AjaxGetWithData = function (data, route, successFunction, errorFunction) {
        	 var blockUI = new bok.BlockUI();
			var deferred = $q.defer();
            blockUI.start();
            //data += "&random=" + Math.random() * 100;
            setTimeout(function () {
                $http({ method: 'GET', url: route, params: data }).success(function (response, status, headers, config) {
                	
                	blockUI.stop();
                    if (response.ReturnStatus == true){
                        successFunction(response, status);
                        deferred.resolve(response);
                    }else {
                        //if (response.IsAuthenicated == false) { window.location = "/index.html"; }
                        errorFunction(response);
                        deferred.reject(response);
                    }
                }).error(function (response) {
                    blockUI.stop();
                    if (response.IsAuthenicated == false) { window.location = "/index.html"; }
                    errorFunction(response);
                });
            }, 300);
            return deferred.promise;
        }


        this.AjaxGetWithNoBlock = function (data, route, successFunction, errorFunction) {
			var deferred = $q.defer();
            setTimeout(function () {
                $http({ method: 'GET', url: route, params: data }).success(function (response, status, headers, config) {
                	
                	successFunction(response, status);
                	deferred.resolve(response);
                }).error(function (response) {
                    ;
                    if (response.IsAuthenicated == false) { window.location = "/index.html"; }
                    errorFunction(response);
                    deferred.reject(response);
                });
            }, 0);
            return deferred.promise;
        }

		this.AjaxDownload = function (data, route) {
			var form=$("<form>");//定义一个form表单
			form.attr("style","display:none");
			form.attr("target","");
			form.attr("method","post");
			form.attr("action",route);
			$("body").append(form);//将表单放置在web中
			for (items in data){
				var input1=$("<input>");
				input1.attr("type","hidden");
				input1.attr("name",items);
				input1.attr("value",data[items]);
				form.append(input1);
			}
			form.submit().remove();//表单提交
        }
    } ]);
});