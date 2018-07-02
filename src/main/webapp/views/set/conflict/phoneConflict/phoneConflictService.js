define(['app', 'ajaxService'], function (app) {

    app.register.service('phoneConflictService', ['ajaxService', function (ajaxService) {
		
        this.getConflics = function (reqdata, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(reqdata, "conflic/getDCstConflicList.g", successFunction, errorFunction);
        };
        
        this.getConflicDetail = function (reqdata, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(reqdata, "conflic/DCstConflicDetail.g", successFunction, errorFunction);
        };
        
        this.DCstConflicDeal = function (reqdata, successFunction, errorFunction) {
            ajaxService.AjaxJsonPost(JSON.stringify(reqdata), "conflic/DCstConflicDeal.g", successFunction, errorFunction);
        };
    }]);
});
