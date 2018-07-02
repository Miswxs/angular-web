define(['app', 'ajaxService'], function (app) {

    app.register.service('myRoleService', ['ajaxService', function (ajaxService) {

        //获取角色列表
        this.getRoleList = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "system/role/roleList.g", successFunction, errorFunction);
        };
        //获取角色详情
        this.getRoleDetail = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "system/role/getRoleDetail.g", successFunction, errorFunction);
        };
        //获取角色权限
        this.geAllRolePower = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "system/role/geAllRolePower.g", successFunction, errorFunction);
        };
        //添加角色
        this.addRowRole = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "system/role/addRole.g", successFunction, errorFunction);
        };
        
        //添加角色
        this.updateRole = function (info, successFunction, errorFunction) {
            ajaxService.AjaxPost(info, "system/role/updateRole.g", successFunction, errorFunction);
        };
        
        //删除角色
        this.deleteRole = function(info,successFunction, errorFunction){
    		ajaxService.AjaxPost(info, "system/role/deleteRole.g", successFunction, errorFunction);
    	}
        //得到数据结构
        this.myZNnodes = function(successFunction, errorFunction){
        	ajaxService.AjaxFormPost({}, "mborg/getMbOrglist.g", successFunction, errorFunction);
        }
        this.getRoleUsers = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "system/role/getRoleUsers.g", successFunction, errorFunction);
        }
        
        this.getUserList = function(info,successFunction, errorFunction){
        	ajaxService.AjaxFormPost(info, "system/role/getUserList.g", successFunction, errorFunction);
        }
        
        this.updateRoleUsers = function(info,successFunction, errorFunction){
        	ajaxService.AjaxPost(info, "system/role/updateRoleUsers.g", successFunction, errorFunction);
        }
     
    }]);
});