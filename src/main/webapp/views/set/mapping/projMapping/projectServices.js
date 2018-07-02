define(['app', 'ajaxService'], function (app) {

    app.register.service('projectServices', ['ajaxService', function (ajaxService) {
    	//获取业态
    	this.getYeTai = function(info, successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "system/getYeTai.g", successFunction, errorFunction);
    	};
    	//获取接入系统和组织架构
    	this.getXiTongOrg = function(info, successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "system/getXiTongOrg.g", successFunction, errorFunction);
    	};
    	
    	  //获取组织数据
        this.getGroup = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "system/getOrgTree.g", successFunction, errorFunction);
        }; 
    	
    	//业态
        this.getBelongsFormat = function (success,successFunction, errorFunction) {
        	ajaxService.AjaxPost(success,"system/getSysIndustry.g", successFunction, errorFunction);
        };
        
        this.getCompany = function (success,successFunction, errorFunction) {
        	ajaxService.AjaxPost(success,"system/getSysOrgs.g", successFunction, errorFunction);
        };
        
        //查询明细
        this.getDetails = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "system/getListData.g", successFunction, errorFunction);
        };
        
        // 获取父级项目
        this.getParentProjs = function(info, successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "system/getParentProjs.g", successFunction, errorFunction);
        };
        
        this.getProjs = function(info, successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "system/getProjs.g", successFunction, errorFunction);
        };
        
        this.getBuildings = function(info, successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "system/getBuildings.g", successFunction, errorFunction);
        };
        
        //更新项目信息
        this.updateMbproj  = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "system/updateMbproj.g", successFunction, errorFunction);
        };
        
        
        //更新项目信息
        this.updateMbprojDeng  = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "system/updateMbprojDeng.g", successFunction, errorFunction);
        };
        
        //更新楼栋信息
        this.updatebuilding  = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info,"system/updatebuilding.g", successFunction, errorFunction);
        };
        
      //更新楼栋信息
        this.updatebuildingdeng = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info,"system/updatebuildingdeng.g", successFunction, errorFunction);
        };
        
        
      //导出模板
        this.exportBuildMappingTemp = function (info) {
            ajaxService.AjaxDownload(info, "system/exportTemplete.g");
        };
        
      //导出数据
        this.exportBuildMapping = function (info) {
            ajaxService.AjaxDownload(info, "system/exportBuildMapping.g");
        };
    }]);
});
