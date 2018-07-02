define(['app', 'ajaxService'], function (app) {

    app.register.service('modulesService', ['ajaxService', function (ajaxService) {
    	
        //删除左边树节点
    	this.delModule = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "modules/delModule.g", successFunction, errorFunction);
    	}
        //添加节点
    	this.insertModule= function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "modules/insertModule.g", successFunction, errorFunction);
    	}
    	
        //修改节点
    	this.updateModule = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "modules/updateModule.g", successFunction, errorFunction);
    	}
    	
    	//得到数据结构
    	this.myZNnodes = function(info, successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "modules/getAllModules.g", successFunction, errorFunction);
        }
    	
    }]);
});

