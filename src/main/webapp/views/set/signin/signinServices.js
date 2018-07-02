define(['app', 'ajaxService'], function (app) {

    app.register.service('signinServices', ['ajaxService', function (ajaxService) {
        
        
        //登录
        this.login = function (info, successFunction, errorFunction) {
        	return ajaxService.AjaxFormPostNoBlock(info, "auth/login.g", successFunction, errorFunction);
        	
            //return ajaxService.AjaxPost(info, "api/signin/login.json", successFunction, errorFunction);
        };
        
        this.loginIdata = function (reqdata, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(reqdata, "auth/loginIdata.g", successFunction, errorFunction);
        };
        
        this.loginSSO = function(reqdata, successFunction, errorFunction) {
        	ajaxService.AjaxFormPost({}, "auth/loginSSO.g", successFunction, errorFunction);
        };
    }]);
});