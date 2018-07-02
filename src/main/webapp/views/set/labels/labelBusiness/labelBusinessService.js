define(['app', 'ajaxService'], function (app) {

    app.register.service('labelBusinessService', ['ajaxService', function (ajaxService) {
    	
    	//初始加载标签分组
    	this.getLabelGroup = function(info,successFunction, errorFunction){
        	ajaxService.AjaxPost(info, "label/getLabelGroup.g", successFunction, errorFunction);
        }
    	
    	//初始加载的标签
    	this.getLabelList = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "label/getLabelBusinessList.g", successFunction, errorFunction);
        }
    	//得到特征项
    	this.getTemplateList = function(info,successFunction, errorFunction){
        	ajaxService.AjaxPost({}, "label/getTemplateSelect.g", successFunction, errorFunction);
        }
    	//获得提取数据下拉选项
    	this.getExpSelect = function(info,successFunction, errorFunction){
        	ajaxService.AjaxPost({}, "label/getExpSelect.g", successFunction, errorFunction);
        }
    	//特征项来源码表，根据codType
    	this.getTempFromCode = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "label/getTempFromCode.g", successFunction, errorFunction);
        }
    	//源码表根据pId
    	this.getTempFromCodeByPid = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormOtherPost(info, "label/getTempFromCodeByPid.g", successFunction, errorFunction);
        }
    	//特征项来源码表
    	this.getAllTempFromCode = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "label/getAllTempFromCode.g", successFunction, errorFunction);
        }
    	//特征项来源码表，根据codType
    	this.getTempFromCodeChk = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "label/getTempFromCodeChk.g", successFunction, errorFunction);
        }
    	//删除标签
    	this.delLabelBusiness = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "label/delLabelBusiness.g", successFunction, errorFunction);
    	}
    	//标签详情
    	this.getLabelDeatil = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "label/getLabelDeatil.g", successFunction, errorFunction);
    	}
    	this.updateLabelBusiness = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "label/updateLabelBusiness.g", successFunction, errorFunction);
    	}
    	//一行规则中的下拉多选数据
    	this.dropdownService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/form-select/dropdown-select.json", successFunction, errorFunction);
    	}
    	//特征对应表单数据统一获取方法
    	this.getFeatureDataService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/form-select/select-fun-value.json", successFunction, errorFunction);
    	}
    	//添加标签
    	this.submitLabel = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "label/addLabelBusinessNew.g", successFunction, errorFunction);
    	}
    	//提取数据-->字段数据
    	this.getFieldService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/theCustomerInfo.json", successFunction, errorFunction);
    	}
    	//提取数据-->跟踪类型
    	this.getFollowService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/followType.json", successFunction, errorFunction);
    	}
    	//提取数据-->跟进字段
    	this.getFollowFieldService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/theFollowFieldInfo.json", successFunction, errorFunction);
    	}
    	//提取数据-->保存
    	this.saveModalObjService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/saveModalCommon.json", successFunction, errorFunction);
    	}
        //提取数据-->用途分类
        this.getUseType = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/useType.json", successFunction, errorFunction);
    	}
    	//查看标签保存
    	this.saveModifyService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/saveLabelCommon.json", successFunction, errorFunction);
    	}
        //任意请求
        this.anyService = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "api/labels/labelBusiness/saveLabelCommon.json", successFunction, errorFunction);
    	}
        
        
        this.expLabelData = function(info, successFunction, errorFunction) {
        	ajaxService.AjaxPost(info, "labelexpjob/addExportJob.g", successFunction, errorFunction);
        }
        
    }]);
});

