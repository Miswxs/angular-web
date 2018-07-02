define(['app', 'ajaxService'], function (app) {

    app.register.service('modifyServices', ['ajaxService', function (ajaxService) {
        
        
        //修改
        this.domodify = function (info, successFunction, errorFunction) {
            return ajaxService.AjaxPostNoBlock(info, "api/set/modify/data.json", successFunction, errorFunction);
        };


    }]);
});