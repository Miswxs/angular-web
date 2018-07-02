define(['app', 'ajaxService'], function (app) {

    app.register.service('forbusinessServices', ['ajaxService', function (ajaxService) {
    	
    	//商业活动跟踪详情
    	this.getBusinessTrackDetail = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "trackAnalysis/getBusinessTrackDetail.g", successFunction, errorFunction);
        };
    	
        //商业活动跟踪效果分析
    	this.getBusinessTrackAnalysis = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "trackAnalysis/getBusinessTrackAnalysis.g", successFunction, errorFunction);
        };
    	
        //跟踪客户列表
        this.getCstList = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "trackAnalysis/getCstList.g", successFunction, errorFunction);
        };
    	
        this.download=function (info, successFunction, errorFunction) {
        	ajaxService.AjaxDownload(info, "trackAnalysis/expData.g");
        };
    	
    	
        
        //获取页面数据
        this.getData = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "api/clientSearch/data.json", successFunction, errorFunction);
        };
         //获取下拉数据
        this.getSelectData = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "api/clientSearch/selectData.json", successFunction, errorFunction);
        };
        //客户数据预览
         this.customData = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "api/clientSearch/customData.json", successFunction, errorFunction);
        };
        //获取跟踪客户列表数据
         this.getTrackCustomers = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "api/trace/forbusiness/trackCustomers.json", successFunction, errorFunction);
        };
        //获取图表数据
         this.getChartData = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "api/trace/forbusiness/chartData.json", successFunction, errorFunction);
        };

    }]);
});