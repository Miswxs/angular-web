define(['app', 'ajaxService'], function (app) {

    app.register.service('operLogService', ['ajaxService', function (ajaxService) {

        //获取列表数据
        this.getOperLogList = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "operLog/getOperLogList.g", successFunction, errorFunction);
        };
        
        //导出数据
        this.exportDatas = function (info) {
            ajaxService.AjaxDownload(info, "operLog/exportDatas.g");
        };
    }]);
});