define(['app', 'ajaxService'], function (app) {

    app.register.service('desensitizationService', ['ajaxService', function (ajaxService) {

    	//获取脱敏列表
        this.getDetails = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "sysDelicate/SysDelicateList.g", successFunction, errorFunction);
        };
        
        //提交修改
        this.modifyDesens = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "sysDelicate/SysDelicateEdit.g", successFunction, errorFunction);
        };
        
        //保存修改
        this.SysDelicateSave = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "sysDelicate/SysDelicateSave.g", successFunction, errorFunction);
        };
    }]);
});