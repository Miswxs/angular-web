//用来定义Option
define(['app'], function(app) {
    app.register.factory("echarts", function() {
        return {
            pie1: function(options) {
                var defaultOptions = {
                    title: {
                        text: options.name || '',
                        subtext: options.subname || '',
                        left: options.titleLeft || 'center',
                        top: 10,
                        textStyle: {
                            fontWeight: 500
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: options.legendLeft || '60%',
                        top: options.legendTop || '36%',
                        itemWidth: 5,
                        itemHeight: 5,
                        align: 'left',
                        data: options.legendData || [],
                        textStyle: {
                            fontWeight: 400,
                            fontFamily: "微软雅黑"
                        }
                    },
                    series: [{
                        "name": options.name || "",
                        type: 'pie',
                        radius: options.radius || ['30%', '50%'],
                        center: options.center || ['50%', '65%'],
                        avoidLabelOverlap: false,
                        clockwise: false,
                        data: options.seriesData || [],
                        label: {
                            normal: {
                                show: true,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }],
                    color: options.color || [
                        '#ffc000', '#92d050', '#00b0f0', '#E87C25', '#27727B',
                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                    ]
                };
                return defaultOptions;
            },
            bar1: function(opt) {
                var options = {
                    title: {
                        text: opt.name || '',
                        left: '8%',
                        top: 10,
                        textStyle: {
                            fontWeight: 500
                        }
                    },
                    grid: {
                        left: '5%',
                        right: '1%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        boundaryGap: [0, 0]
                    },
                    yAxis: {
                        type: 'category',
                        position: 'left',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false,
                            length: 500
                        },
                        data: opt.yAxis || []
                    },
                    series: [{
                        name: opt.name || '',
                        type: 'bar',
                        data: opt.seriesData || []
                    }],
                    barWidth: 12
                };

                return options;
            },
            bar2: function(opt) {
                var options = {
                    title: {
                        text: opt.name || '',
                        left: '3%',
                        top: 10,
                        textStyle: {
                            fontWeight: 500
                        }
                    },
                    color: opt.color || ["#828593"],
                    backgroundColor: "#f5f5f5",
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        nameLocation: 'start',
                        type: opt.xType || 'category',
                        data: opt.xData || [],
                        axisLine:{
                            lineStyle:{
                                color:"#999",
                                width:2
                            }
                        },
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        max: opt.yMax,
                        axisLine:{
                            lineStyle:{
                                color:"#999",
                                width:2
                            }
                        },
                    }],
                    series: [{
                        name: opt.seriesName || '',
                        type: 'bar',
                        barWidth: '60%',
                        data: opt.data || [100, 520, 2000, 3340, 3900, 3300, 2200]
                    }]
                }
                return options;
            },
            bar3:function(opt){
                var  option = {
                        
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            left: '5%',
                            top:'0%',
                            bottom:'10%',
                            containLabel: true
                        },
                        color:opt.color || [],

                        xAxis: {
                            show:false,
                            type: 'value',
                            position:'top',
                            boundaryGap: [0, 0],
                            axisLine:{
                                lineStyle:{
                                    color:"#333"
                                }
                            },
                            splitLine:{
                                show:false
                            },
                            axisTick:{
                                inside:true,
                                length:'1'
                            }

                        },
                        yAxis: {
                            type: 'category',
                            data: opt.yAxisData || [],
                            axisLine:{
                                lineStyle:{
                                    color:"#999",
                                    width:2
                                }
                            },
                            axisTick:{
                                show:false
                            }
                        },
                        series: opt.seriesData || []
                    };
                return option;
            },
            line1: function(opt) {
                var options = {
                    title: {
                        text: opt.name || '',
                        subtext: opt.subName || '',
                        left: '3%',
                        top: 10,
                        textStyle: {
                            fontWeight: 500
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '10%',
                        top:'20%',
                        bottom:'10%'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine:{
                            lineStyle:{
                                color:"#999",
                                width:2
                            }
                        },
                        data: opt.xData||[]
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                color:"#999",
                                width:"2"
                            }
                        },
                        max: opt.yMax ||'auto'
                    },
                    backgroundColor: "#f5f5f5",
                    color: opt.color || ['#c23531', '#2f4554'],
                    series: [{
                        name: opt.seriesName || '',
                        type: 'line',
                        data: opt.data||'',
                        markPoint: {
                            data:[{type:'max',name:'最大值'}]
                        },
                        markLine: {
                        	symbol: ['none', 'none'],
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }]
                }
                return options;
            },
            //客流到访趋势图表
            visitTrend: function(opt) {
                var options = {
                    color:['#828593'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    splitLine: { //这个是x跟y轴轴的线      
                        show: true,
                        lineStyle: {
                            color: "#dedede",
                            type: "solid"
                        }
                    },
                    axisLine: { //x轴、y轴的深色轴线
                        show: true,
                        lineStyle: {
                            color: "#dedede",
                        }
                    },
                    grid: {
                       x:40,
                       x2:50,
                       y:40,
                       y2:60
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: opt.xAxisData || "",
                        axisLine: {
                            lineStyle: { color: "#dedede",width:2 }
                        },
                        axisLabel: {
                            textStyle: { color: '#666' }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisLine: {
                            lineStyle: { color: "#dedede",width:2 }
                        },
                        axisLabel: {
                            textStyle: { color: '#666' }
                        }

                    },
                    series: [{
                        splitNumber: 12,
                        name: opt.seriesName || '',
                        type: 'line',
                        data: opt.seriesData || [],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }]
                }
                return options;
            },
            //成交金额区段分析图表
            dealSum: function(opt) {
                var options = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['认购', '签约'],
                        icon: 'bar',
                        top: 20
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                        borderColor: '#dedede'
                    },
                    xAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: { color: "#dedede",width:2 }
                        },
                        axisLabel: {
                            textStyle: { color: '#666' }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: opt.yAxisData || [],
                        axisLine: {
                            lineStyle: { color: "#dedede" }
                        },
                        axisLabel: {
                            textStyle: { color: '#666' }
                        }
                    },
                    series: [{
                        name: '认购',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        // data: [320, 302, 301, 334, 390, 330],
                        // data: opt.seriesData[0][0],
                        data: opt.seriesData[0] || [],
                        itemStyle: {
                            normal: { color: '#ce5461' }
                        }
                    }, {
                        name: '签约',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        // data: [120, 132, 101, 134, 90, 230],
                        // data: opt.seriesData[0][1],
                        data: opt.seriesData[1] || [],
                        itemStyle: {
                            normal: { color: '#828593' }
                        }
                    }]
                }
                return options;
            },
            //到访次数分布图表
            visitNum: function(opt) {
                var options = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    color: ["#bbbdc4", "#999ca7", "#777b8a", "#54586c"],
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        icon: 'bar',
                        data: opt.legendData || []
                    },
                    series: [{
                        name: "到访次数分布",
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: opt.data || []
                    }]
                }
                return options;
            },
            //客户转化率分析图表
            customerConversion: function(opt) {
                var options = {
                    color: ["#bbbdc4", "#999ca7", "#777b8a", "#54586c", ],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c}"
                    },
                    calculable: true,
                    series: [{
                        name: '客户转化率分析',
                        type: 'funnel',
                        left: '10%',
                        top: 60,
                        //x2: 80,
                        bottom: 60,
                        width: '60%',
                        // height: {totalHeight} - y - y2,
                        min: 0,
                        max: opt.max||100,
                        minSize: '0%',
                        maxSize: '100%',
                        sort: 'ascending',
                        gap: 2,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            },
                            emphasis: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                lineStyle: {
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        },
                        data: opt.seriesData || []
                    }]
                };
                return options;
            },
        	//消费子业态
			customerChildFormat: function(opt) {
                    var options = {
                        color: ['#828593'],
						tooltip : {
							trigger: 'axis',
							axisPointer : {            // 坐标轴指示器，坐标轴触发有效
								type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
							}
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						xAxis : [
							{
								type : 'value'
							}
						],
						yAxis : [
							{
								type : 'category',
								data : opt.dataY || [],
								axisTick: {
									alignWithLabel: true
								}
							}
						],
						series : [
							{
								name:'',
								type:'bar',
								barWidth: '45%',
								data:opt.data || []
							}
						]
                    }

                    return options;
                },
				//结束
		  	
			mixBarAndSpline: function(opt) {
                var options = {
					tooltip : {
						trigger: 'axis'
					},
					legend: {
						data:['消费额','平均单价']
					},
					
					splitLine: { //这个是x跟y轴轴的线      
                        show: true,
                        lineStyle: {
                            color: "#dedede",
                            type: "solid"
                        }
                    },
                    axisLine: { //x轴、y轴的深色轴线
                        show: true,
                        lineStyle: {
                            color: "#dedede",
                        }
                    },
					xAxis : [
						{
							type : 'category',
							position: 'bottom',
							boundaryGap: true,
							axisTick : {    // 轴标记
								show:false,
								length: 10,
								lineStyle: {
									color: '#666666',
									type: 'solid',
									width: 1
								}
							},
							axisLabel : {
								show:true,
								rotate: 0,
								margin: 2,
								formatter: '{value}',
								textStyle: {
									color: '#666666',
									fontSize: 13,
									fontStyle: 'normal',
									fontWeight: 'normal'
								}
							},
							splitArea : {
								show: false,
								areaStyle:{
									color:['#666666']
								}
							},
							data : opt.category
						}
					],
					yAxis : [
						{
							type : 'value',
							position: 'left',
							opposite: true,
							//min: 0,
							//max: 300,
							//splitNumber: 5,
							boundaryGap: [0,0.1],
							axisLine : {    // 轴线
								show: false,
								lineStyle: {
									color: '#666666',
									type: 'dashed',
									width: 2
								}
							},
							axisTick : {    // 轴标记
								show:false,
								length: 10,
								lineStyle: {
									color: '#666666',
									type: 'solid',
									width: 2
								}
							},
							axisLabel : {
								show:true,
								interval: 'auto',    // {number}
								margin: 0,
								formatter: function (value) {
									// Function formatter
									return value 
								},   // Template formatter!
								textStyle: {
									color: '#666666',
									fontSize: 12,
									fontStyle: 'normal',
									fontWeight: 'normal'
								}
							},
							
							splitArea : {
								show: false,
								areaStyle:{
									color:['rgba(205,92,92,0.3)','rgba(255,215,0,0.3)']
								}
							},
							name: opt.bar.name || ''
								
							
						},
						{
							type : 'value',
							
							splitLine : {
								show: false
							},
							name: opt.line.name || ''
								
						}
					],
					series : [
						
						{
							name: opt.bar.seriesName,
							type: 'bar',
							data: opt.bar.seriesData,
							barWidth : 40,
							itemStyle: {
								normal: { color: '#828593' }
							}
						},
						{
							name:opt.line.seriesName,
							type: 'line',
							//yAxisIndex: 1,
							data: opt.line.seriesData,
							itemStyle: {
								normal: { color: '#ce5461' }
							}
						}
					]
				};
                return options;
            }
				//结束
        }
    });



})
