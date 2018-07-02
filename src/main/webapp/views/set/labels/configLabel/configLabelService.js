define(['app', 'ajaxService'], function (app) {

    app.register.service('configLabelService', ['ajaxService', function (ajaxService) {
        
        //得到数据结构
    	this.myZNnodes = function(successFunction, errorFunction){
        	ajaxService.AjaxPost({}, "label/getTemplateList.g", successFunction, errorFunction);
        }
        //得到标签详细
    	this.myRequestData = function(info,successFunction, errorFunction){
        	ajaxService.AjaxPost(info, "api/labels/configLabel/requestData.json", successFunction, errorFunction);
        }
        //SAVE ORG MODIFY DATA
    	this.modifyFeature = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "label/saveLabelConf.g", successFunction, errorFunction);
        }
    	this.delLabelConf = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "label/delLabelConf.g", successFunction, errorFunction);
    	}
    	this.onlineLabelConf = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "label/onlineLabelConf.g", successFunction, errorFunction);
    	}
        //删除左边树节点
    	this.deleteNodeService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/configLabel/delectNode.json", successFunction, errorFunction);
    	}
        //添加节点
    	this.addNodeService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/configLabel/addNode.json", successFunction, errorFunction);
    	}
        //修改节点
    	this.modifyNodeService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/configLabel/modifyNode.json", successFunction, errorFunction);
    	}
         //任意请求
    	this.anyService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/configLabel/anyService.json", successFunction, errorFunction);
    	}
    }]);
});

