define(['app', 'window', 'jquery','WdatePicker', 'chart', 'filters', 'clientShowServices'], function (app, w, $) {
	//console.dir(app);
	app.register.controller('ClientShowController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', '$interval', '$timeout', 'util', 'echarts', 'clientShowServices', function ($location, $modal, $filter, $scope, $rootScope, $state, $interval, $timeout, util, echarts, clientShowServices) {

		$scope.initializeController = function () {
			$scope.loaded = true;//初始化未加载过数据，则隐藏内容区
			//dimensionType dimensionId
			$scope.getDataA(null, null);
			$scope.getDataB(null, null);
			$scope.getDataC(null, null);
		}

		$scope.getDataA = function(type, guid) {
			clientShowServices.getDataA(
							{
								type : type,
								guid : guid
							},
							function(response,status) {
								// 全部客户
								$scope.allCustomer = response.data;
								//近五年的新增客户情况数据
				                $scope.addedCustomersChart=echarts.bar3(setBar3(response.data.lable));
				                function setBar3(data){
				                	var obj={};
				                	var yAxisData=[];
				                	var zsCst=[];
				                	var qzCst=[];
				                	for(var i=1;i<=5;i++){
				                		yAxisData.push(data[5-i].title);
				                		qzCst.push(data[5-i].finished);
				                		zsCst.push(data[5-i].noFinished);
				                	}
				                	obj={
			                			"text":"近五年的新增客户情况",
					                	"color": ["#ce5461","#828593"],
					                	"yAxisData":yAxisData,
					                	"seriesData": [{
					                        "name": "潜在客户",
					                        "type": "bar",
					                        "barGap":0,
					                        "data": qzCst
					                    },{
					                        "name": "正式客户",
					                        "type": "bar",
					                        "data": zsCst
					                    }]
				                	}
				                	return obj;
				                }
	
							}, function(response,status) {
								// toastr.warning('获取数据失败',
								// '提示', {
								// closeButton:
								// true,
								// timeOut: 5000
								// });
							})
	
		}
	
		$scope.getDataB = function(type, guid) {
			clientShowServices
					.getDataB(
							{
								type : type,
								guid : guid
							},
							function(response,status) {								
								// 分类客户占比
								$scope.customerTypeProportion = setChart(response.data.customerTypeProportion);
								
								$scope.customerFormat = response.data.customerFormat;								
								
								//dataToChartConfig.dataToPie2Con($scope.customerTypeProportion);
								// 点击切换环形图
								$scope.currentIndex = 0;
								$scope.pageIndex = 0;
								$scope.chartsType = function(index){
									$scope.currentIndex = index;
									$scope.pageIndex = index;
								};
								//描绘OPtion后重新装载
				                function setChart(response){
				                    var temp = [];
				                     angular.forEach(response,function(v,k){
				                         var ta = {};
				                         var tmp={};
				                         tmp.name = v.title;
				                         tmp.subname = v.finished;
				                         tmp.radius=["45%","67%"];
				                         tmp.seriesData = [{"value":v.finished, "percent":v.fpercent, "name":v.fpercent+"%"},
									                      {"value":v.noFinished, "percent":v.nfpercent, "name":""}];
				                         tmp.color=["#828593","#f1f3f3"];				                
				                         ta.option = echarts.pie1(tmp);
				                         temp.push(ta);
				                    })
				                     return temp;
				                }
							}, function(
									response,status) {
								// toastr.warning('获取数据失败',
								// '提示', {
								// closeButton:
								// true,
								// timeOut: 5000
								// });
							})
		}
		$scope.getDataC = function(type, guid) {
			clientShowServices.getDataC(
							{
								type : type,
								guid : guid
							},
							function(response,status) {
								//datac = response.data;
								//柱状图下拉数据
								$scope.selectBar = response.data.customerRegister;
				                $scope.selectCurrent =response.data.customerRegister[0];
				                //柱状图
				                $scope.customerRegister = echarts.bar2(response.data.customerRegister[0]);
				                //选择类别
				                $scope.selectChange = function(i){
				                    $scope.customerRegister = echarts.bar2(i)
				                }
				                //拆线图
				                $scope.activeCustomer = echarts.line1(response.data.activeCustomer);
				                $scope.activeMember = echarts.line1(response.data.activeMember);
	
							}, function(response,status) {
								//				toastr.warning('获取数据失败', '提示', {
								//					closeButton: true,
								//					timeOut: 5000
								//				});
							})
		}		

	}]);
});

