define(['app', 'ajaxService'], function (app) {

    app.register.service('forsaleServices', ['ajaxService', function (ajaxService) {
        
        //获取页面数据
        this.getDataA = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "trackAnalysis/getTrackListA.g", successFunction, errorFunction);
        };
         //获取下拉数据
        this.getDataB = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "trackAnalysis/getTrackListB.g", successFunction, errorFunction);
        };
        //跟踪客户列表
        this.getCstList = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "trackAnalysis/getCstList.g", successFunction, errorFunction);
        };
        
        this.download=function (info, successFunction, errorFunction) {
        	ajaxService.AjaxDownload(info, "trackAnalysis/expData.g");
        };

    }]);
});