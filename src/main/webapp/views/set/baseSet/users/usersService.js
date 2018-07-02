define(['app', 'ajaxService'], function (app) {

    app.register.service('usersService', ['ajaxService', function (ajaxService) {

        this.getDetails = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "muser/userList.g", successFunction, errorFunction);
        };
        
        this.sysUserExport = function (info) {
            ajaxService.AjaxDownload(info, "muser/sysUserExport.g");
        };
        
        this.updateUserState = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "muser/updateUserState.g", successFunction, errorFunction);
        };
        //功能角色列表
        this.getRoleSelect = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "muser/getRoleSelect.g", successFunction, errorFunction);
        };
        //数据角色列表
        this.getGroupSelect = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "muser/getGroupSelect.g", successFunction, errorFunction);
        };
        
        //修改用户数据权限
        this.modifyUserPower = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "muser/modifyUserPower.g", successFunction, errorFunction);
        };
        //获取当前用户组数据权限
        this.getGroupPower = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "group/groupDataPower.g", successFunction, errorFunction);
        };
        
        //add a user group JS service
        this.saveUserInfo = function (info, successFunction, errorFunction) {
            ajaxService.AjaxJsonPost(JSON.stringify(info), "muser/saveUserInfo.g", successFunction, errorFunction);
        };
        
        //用户详情
        this.getUserDetail = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "muser/getUserDetail.g", successFunction, errorFunction);
        };
        
        this.updateUserInfo = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "muser/updateUserInfo.g", successFunction, errorFunction);
        };
        
        this.getUserPower = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "muser/getUserPower.g", successFunction, errorFunction);
        };
        
        //update a user group JS service
        this.updateGroup = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "group/updateGroup.g", successFunction, errorFunction);
        };
        
        //删除用户组
        this.delGroup = function(info,successFunction, errorFunction){
    		ajaxService.AjaxFormPost(info, "group/delGroup.g", successFunction, errorFunction);
    	}
        
        //得到数据结构
        this.myZNnodes = function(successFunction, errorFunction){
        	ajaxService.AjaxFormPost({}, "mborg/getMbOrglist.g", successFunction, errorFunction);
        }
        
        //查询用户组人员
        this.getGroupUser = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "group/getGroupUsers.g", successFunction, errorFunction);
        }
    }]);
});