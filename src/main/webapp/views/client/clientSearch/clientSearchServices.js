define(['app', 'ajaxService'], function (app) {

    app.register.service('clientSearchServices', ['ajaxService', function (ajaxService) {
        
        //获取页面数据
        this.getData = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "clientSearch/getLabels.g", successFunction, errorFunction);
        };
        //获取下拉数据
        this.getCityTree = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "clientSearch/getCityTree.g", successFunction, errorFunction);
        };
         //获取下拉数据
        this.getSelectData = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "clientSearch/getSelectData.g", successFunction, errorFunction);
        };
        //获取下拉数据
        this.getExportField = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "clientSearch/getExportField.g", successFunction, errorFunction);
        };
        //客户数据预览
         this.cstData = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "clientSearch/getCstData.g", successFunction, errorFunction);
        };
        
      //提数申请数据
        this.getExpApply = function (info, successFunction, errorFunction) {
           ajaxService.AjaxFormPost(info, "clientSearch/getExpApply.g", successFunction, errorFunction);
       };
       
       this.modify = function (info, successFunction, errorFunction) {
           ajaxService.AjaxFormPost(info, "clientSearch/modify.g", successFunction, errorFunction);
       };
       
       this.doSubmit = function (info, successFunction, errorFunction) {
    	   ajaxService.AjaxPost(info, "clientSearch/submit.g", successFunction, errorFunction);
       };
       
       this.doSave = function (info, successFunction, errorFunction) {
    	   ajaxService.AjaxPost(info, "clientSearch/save.g", successFunction, errorFunction);
       };
       
       //导出所提取的客户
       this.expData = function (info, successFunction, errorFunction) {
       	ajaxService.AjaxDownload(info, "labelexpjob/expData.g");
       };

    }]);
});