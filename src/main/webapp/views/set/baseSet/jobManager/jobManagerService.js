define(['app', 'ajaxService'], function (app) {

    app.register.service('jobManagerService', ['ajaxService', function (ajaxService) {

    	//获取调度任务列表
        this.getJobList = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "job/getJobList.g", successFunction, errorFunction);
        };
        
        this.jobStop = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "job/jobStop.g", successFunction, errorFunction);
        };
        
        this.jobStart = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "job/jobStart.g", successFunction, errorFunction);
        };
        
        //提交修改
        this.updateJob = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "job/updateJob.g", successFunction, errorFunction);
        };
        
        //添加job
        this.addJob = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "job/addJob.g", successFunction, errorFunction);
        };
        
        this.deleteJob = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "job/deleteJob.g", successFunction, errorFunction);
        };
     
    }]);
});