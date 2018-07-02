define(['app', 'ajaxService'], function (app) {

    app.register.service('traceMainServices', ['ajaxService', function (ajaxService) {
    	
    	this.labGroupList=[
	       {"id":"1","name":"标准标签"},
	       {"id":"2","name":"业务标签"}
	    ];
    	this.approvalList= [
			{"id":"发起","name":"发起"},
			{"id":"退回" ,"name":"退回"},
			{"id":"终止" ,"name":"终止"},
			{"id":"通过" ,"name":"通过"}
		];
    	
    	this.followStatus=[
			{"id":"0","name":"不跟踪"},
			{"id":"1" ,"name":"跟踪"}
    	];
    	
    	this.followType=[
			{"id":"trackForBusiness","name":"商业活动"},
			{"id":"trackForSale" ,"name":"地产营销"}
    	];
        
    	//用途类型
    	this.expUserFor=[
			{"id":"forCstRetVisit","name":"客户回访"},
			{"id":"trackForSale" ,"name":"地产营销"},
			{"id":"forPorjFix" ,"name":"产品定位"},
			{"id":"forSale" ,"name":"项目营销"},
			{"id":"forOther" ,"name":"其他"},
    	];
    	
        //获取标签分类
        this.getLabelSelect = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "labelexpjob/getQueryLabelSelect.g", successFunction, errorFunction);
        };

        //表格请求
        this.getTableData = function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "labelexpjob/labelexpjobList.g", successFunction, errorFunction);
        };
        
        //导出所提取的客户
        this.expData = function (info, successFunction, errorFunction) {
        	ajaxService.AjaxDownload(info, "labelexpjob/expData.g");
        };
        
        this.deleteExpJob=function (info, successFunction, errorFunction) {
            ajaxService.AjaxFormPost(info, "labelexpjob/labelexpjobDelete.g", successFunction, errorFunction);
        };
        
        this.exportList=function (info, successFunction, errorFunction) {
        	ajaxService.AjaxDownload(info, "labelexpjob/exportExpData.g");
        };

    }]);
});