define(['app', 'ajaxService'], function (app) {

    app.register.service('clientPortraitServices', ['ajaxService', function (ajaxService) {
        
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
         //获取企业客户搜索列表
        this.getClientList = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "clientDetail/cstList.g", successFunction, errorFunction);
        };
        this.getClient = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost(info, "clientDetail/cstByCardId.g", successFunction, errorFunction);
        };
    }]);
});