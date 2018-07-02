require.config({
    baseUrl: "",
    urlArgs: 'ver=' + (+new Date()),
    waitSeconds: 0,
    paths: {
        'app': 'scripts/app',
        'util': 'scripts/util',
        'config': 'scripts/config',
        'angular': 'vender/angular-1.2.28/angular.min',
        'ngRoute': 'vender/angular-1.2.28/angular-route',
        'angular-ui-router': 'scripts/angular-ui-router',
        'angularAMD': 'scripts/angularAMD',
        'ocLazyLoad': 'scripts/ocLazyLoad.require',
        'ngAnimate': 'vender/angular-1.2.28/angular-animate.min',
        'jquery': 'vender/jquery/jquery-1.9.1.min',
        'ui-bootstrap': 'scripts/ui-bootstrap-tpls-0.11.0',
        'angular-sanitize': 'vender/angular-1.2.28/angular-sanitize',
        'blockUI': 'scripts/block-ui',
        'modApi': 'scripts/modulesApi',
        
        'chart': 'scripts/services/chart',
		'echarts3': 'scripts/echarts.min',
		
        'directives': 'scripts/directives/directives',
        'filters': 'scripts/filter/filters',
        'ajaxService': 'scripts/services/ajaxServices',
        'toastr': 'scripts/angular-toastr.min',
        'Upload': 'vender/ngFileUpload/ng-file-upload.min',
        'UploadShim': 'vender/ngFileUpload/ng-file-upload-shim.min',
        'widget': 'scripts/widget',
        'window': 'scripts/window',
        'slider': 'vender/angular-1.2.28/slider',
        'WdatePicker': 'vender/My97DatePicker/WdatePicker',
		'ztree':'vender/ztree/jquery.ztree.core-3.5',
        'ztree-exedit': 'vender/ztree/jquery.ztree.exedit-3.5',
        'ztree-excheck': 'vender/ztree/jquery.ztree.excheck-3.5',
        
        /*client*/
       
        'clientShowServices':'views/client/clientShow/clientShowServices',
        'clientPortraitServices':'views/client/clientPortrait/clientPortraitServices',
        'companyPortraitServices':'views/client/clientPortrait/companyPortrait/companyPortraitServices',
        'personPortraitServices':'views/client/clientPortrait/personPortrait/personPortraitServices',
        
        'clientSearchServices':'views/client/clientSearch/clientSearchServices',
        /*trace*/
        'traceMainServices':'views/trace/traceMain/traceMainServices',
        'forsaleServices':'views/trace/forsale/forsaleServices',
        'forbusinessServices':'views/trace/forbusiness/forbusinessServices',
        
        /*system*/
        'signinServices': 'views/set/signin/signinServices',
        'modifyServices': 'views/set/modify/modifyServices',
        'desensitizationService':'views/set/baseSet/desensitizationSet/desensitizationService',
        'myRoleService':'views/set/baseSet/role/myRoleService',
        'usersService':'views/set/baseSet/users/usersService',
        'sysCodeService':'views/sysCode/sysCodeService',
        'jobManagerService':'views/set/baseSet/jobManager/jobManagerService',
        'labelStandardService':'views/set/labels/labelStandard/labelStandardService',
        'labelBusinessService':'views/set/labels/labelBusiness/labelBusinessService',
        'configLabelService' : 'views/set/labels/configLabel/configLabelService',
        'phoneConflictService':'views/set/conflict/phoneConflict/phoneConflictService',
        'modulesService': 'views/set/baseSet/sysModules/sysModulesService',
        'projectServices':'views/set/mapping/projMapping/projectServices',
        'operLogService':'views/set/operLog/operLogService',
        'jobManagerService':'views/set/baseSet/jobManager/jobManagerService'
    },
    shim: {
    	'toastr': ['angular'],
        'Upload': ['angular', 'UploadShim'],
        'angular-ui-router': ['angular'],
        'slider': ['angular', 'jquery'],
        'angular': ['jquery'],
        'ngRoute':['angular'],
        'util': ['angular'],
        'angularAMD': ['angular'],
        'ocLazyLoad': ['angular'],
        'ngAnimate': ['angular'],
        'ui-bootstrap': ['angular'],
        'angular-sanitize': ['angular'],
        'blockUI': ['angular'],
		'echarts': ['angular'],
        'directives': ['angular'],
        'filters': ['angular']
    },
    deps: ['app']
});