define(['app', 'ajaxService'], function (app) {

    app.register.service('companyPortraitServices', ['ajaxService', function (ajaxService) {
        
    	this.sourceBizList=[{"id":"全部","name":"全部"},
    	                    {"id":"地产","name":"地产"},
    	                    {"id":"物业","name":"物业"},
    	                    {"id":"会员","name":"会员"},
    	                    {"id":"租户","name":"租户"},
    	                    {"id":"O+","name":"O+"}]
    	 //获取页面数据
        this.getClientDetail_1 = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "clientDetail/detailA.g", successFunction, errorFunction);
        };
        this.getClientDetail_2 = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "clientDetail/detailB.g", successFunction, errorFunction);
        };
        this.getClientFollowrecoders = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "clientDetail/cstFollowRecord.g", successFunction, errorFunction);
        };
        //意向项目
        this.getIntention_proj = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "clientDetail/intentionProj.g", successFunction, errorFunction);
        };
        //已购房产
        this.getIntention_bld = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "clientDetail/intentionBld.g", successFunction, errorFunction);
        };

    }]);
});