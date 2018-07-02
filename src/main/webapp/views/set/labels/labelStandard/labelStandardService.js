define(['app', 'ajaxService'], function (app) {

    app.register.service('labelStandardService', ['ajaxService', function (ajaxService) {
        
    	//初始加载的标签
    	this.getLabelStandardList = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "label/getLabelStandardList.g", successFunction, errorFunction);
        }
    	
    	//单个标签上线与下线
    	this.changeLabelStatus = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "labelStandard/changeLabelStatus.g", successFunction, errorFunction);
    	}
    	//标签上线与下线
    	this.handleLabelService = function(info,successFunction, errorFunction){
    		if (info.labStatus && info.labStatus == 1) {//下线
    			ajaxService.AjaxFormPost(info, "labelStandard/changeLabelsStatusOffline.g", successFunction, errorFunction);
    		} else if (info.labStatus && info.labStatus == 2) { //上线
    			ajaxService.AjaxFormPost(info, "labelStandard/changeLabelsStatusOnline.g", successFunction, errorFunction);
    		}
//    		ajaxService.AjaxFormPost(info, "labelStandard/changeLabelsStatus", successFunction, errorFunction);
    	}
   /* 	//标签上线与下线
    	this.handleLabelService = function(info,successFunction, errorFunction){
//    		ajaxService.AjaxPost(info, "api/labels/labelStandard/deleteAllLabels.json", successFunction, errorFunction);
    		ajaxService.AjaxFormPost(info, "labelStandard/changeLabelsStatus.g", successFunction, errorFunction);
    	}*/
    	//提取数据-->保存
    	this.saveModalObjService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelStandard/saveModalCommon.json", successFunction, errorFunction);
    	}
    	
    	//标签详情
    	this.getLabelDeatil = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "label/getLabelDeatil.g", successFunction, errorFunction);
    	}
        
    }]);
});

