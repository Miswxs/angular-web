define(['app', 'ajaxService'], function (app) {

    app.register.service('clientShowServices', ['ajaxService', function (ajaxService) {
        
        //获取概览数据A
        this.getDataA = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "customer/getClientShowA.g", successFunction, errorFunction);
        };
        
        //获取概览数据B
        this.getDataB = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "customer/getClientShowB.g", successFunction, errorFunction);
        };      
        //获取概览数据C
        this.getDataC = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "customer/getClientShowC.g", successFunction, errorFunction);
        };
        
    }]);
});