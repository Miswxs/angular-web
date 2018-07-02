define(['app', 'ajaxService'], function (app) {

    app.register.service('sysCodeService', ['ajaxService', function (ajaxService) {
    	
        //删除左边树节点
    	this.delCode = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "syscode/delCode.g", successFunction, errorFunction);
    	}
        //添加节点
    	this.insertCode = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "syscode/insertCode.g", successFunction, errorFunction);
    	}
    	
        //修改节点
    	this.updateCode = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "syscode/updateCode.g", successFunction, errorFunction);
    	}
    	
    	//得到数据结构
    	this.myZNnodes = function(info, successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "syscode/getNodes.g", successFunction, errorFunction);
        }
    	
    }]);
});

