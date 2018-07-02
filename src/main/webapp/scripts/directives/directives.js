define(['echarts3','angular'], function(echarts3){
	
	
	var commonDirectives = angular.module("commonDirectives", []);
	//tab切换指令
	commonDirectives.directive("tabsNav", function(){
        return {
            restrict: "AEC",
            link: function(scope, element, attrs){
                var element = $(element);
                var content = element.siblings(".tabs-content").children(".tab-inside");
                var tabs = element.find(".tab-nav");
                var index = (attrs.activeindex != undefined ? +attrs.activeindex : 0);
                tabs.eq(index).addClass("active");
                content.eq(index).show();
                tabs.click(function(){
                    $(this).addClass("active").siblings().removeClass("active");
                    var indexCurrent = 0;
                    var that = this;
                    $(this).parent().children(".tab-nav").each(function(index,li){
                        if(this === that){
                            indexCurrent = index
                        }
                    })
                    content.eq(indexCurrent).show().siblings().hide();
                });
            }
        }
    })
    //返回按钮指令
    .directive('backButton', function(){
        return {
            restrict: 'AC',
            link: function(scope, element, attrs) {
                element.bind('click', goBack);
                function goBack() {
                    history.back();
                    scope.$apply();
                }
            }
        }
    })
    //设置项目-流程分析指令
    .directive('projectProcess', [function () {
        return {
            restrict: "AE",
            scope:{
                title: "@",
                usedDays: "@",
                baseline: "@"
            },
            template: '<div class="project-process">' +
                        '<div class="process-title">{{title}}<b>{{usedDays}}</b>天</div>' +
                            //'<div class="process-bar clearfix">' +
                            //    '<div class="process-bar-inside pull-right exceeding" ng-show="baseline<usedDays" ng-style={"width":((usedDays-baseline)/usedDays*100+"%")}></div>' +
                            //    '<div class="process-bar-inside pull-left" ng-show="baseline>=usedDays" ng-style={"width":((usedDays/baseline)*100+"%")}></div>' +
                            //'</div>' +
                            '<div class="process-bar-num clearfix">' +
                                '<span class="process-bar-num-real" ng-class="{maxWidth: (usedDays - baseline) >= 0}" ng-style={"width":((usedDays/baseline)*100*0.66+"%")}></span>' +
                                '<span class="process-bar-num-over" ng-show="((usedDays - baseline) > 0)" ng-class="{maxWidth: usedDays*2 >= baseline*3}" ng-style={"width":((usedDays/baseline)*100*0.66+"%")}></span>' +
                                '<span ng-show="((usedDays - baseline) > 0)">超出：{{usedDays-baseline}}天</span>' +
                                '<span ng-show="((usedDays - baseline) <= 0)">所用时间：{{usedDays}}天</span>' +
                            '</div>' +
                            '<div class="process-bar-base clearfix">' +
                                '<span class="process-bar-base-in"></span><p class="process-bar-base-title">平均基线：{{baseline}}天</p>' +
                            '</div>' +
                            //'<div class="process-info clearfix">' +
                            //    '<span ng-class="{pullLeft:baseline<usedDays,pullRight:baseline>=usedDays}">平均基线：{{baseline}}天</span>' +
                            //    '<span class="pull-right" ng-show="usedDays>baseline">超出：{{usedDays-baseline}}天</span>' +
                            //    '<span class="pull-left" ng-show="usedDays<=baseline">所用时间：{{usedDays}}天</span>' +
                            //'</div>' +
                        '</div>'
        }
    }])
	//弹出一级菜单指令
	.directive("navbarBrand", [function() {
        return {
            restrict: "AC",
            link: function(scope, element, attrs) {
                var $menuPop, height, popBind;
                element.on("click", function(event){
                    $("#nav-pop-mask").fadeIn("fast", function(){
                        $(this).css("opacity", 0.5);
                    });
                    var h = $("#nav-pop").height();
                    $("#nav-pop").css({"opacity":0, "top": -h}).show().animate({"top":0,"opacity":1}, 100);
                    

                    $("#nav-pop-mask").bind("click", function(){
                        $("#nav-pop-mask").fadeOut("fast", function(){
                            $(this).css("opacity", 0.5);
                        });
                        var h = $("#nav-pop").height();
                        $("#nav-pop").animate({"top":-h,"opacity":0}, 100, function(){
                            $(this).hide();
                        });
                        $("#nav-pop-mask").unbind();
                        $("#nav-pop").unbind();
                    });
                    $("#nav-pop").click(function(){
                        $("#nav-pop-mask").trigger("click");
                    })
                });
                
            }
        }
    }])
	//console.log(angular);
	//angular.module('directives', []);

    //回到顶部指令
    .directive("goTopBtn", ["$timeout", function($timeout) {
        return {
            restrict: "AC",
            template: "<a href='javascript:;' class='animated'></a>",
            link: function(scope, element, attrs) {
                //var $menuPop, height, popBind;
                element.on("click", "a", function(event){
                    $("html,body").animate({"scrollTop": 0});
                });

                scope.$on("$destroy", function(){
                    $(window).unbind("scroll", checkScroll);
                });

                function checkScroll(){
                    var scrollTop = $(window).scrollTop();
                    timer && $timeout.cancel(timer);
                    timer = $timeout(function(){
                        if(scrollTop <= 100){
                            element.fadeOut("fast");
                        }else{
                            element.fadeIn("fast");
                        }
                    },100)
                }

                checkScroll();//计算是显示“回到顶部按钮”还是隐藏

                var timer = null;
                
                $(window).scroll(checkScroll);
                
            }
        }
    }])
    .directive("datePickerYm",function(){
        return {
            restrict:"A",
            link:function(scope, element, attr){
                element.bind("click", function () {
                    window.WdatePicker({
                        onpicked: function () {
                            var that = this;
                            scope.$apply(function(){
                                scope.dateYM = that.value
                            });
                        },
                        dateFmt:'yyyy年MM月'
                    });
                });
            }
        };
    })
    .directive("startDateYmd",function(){
        return {
            restrict:"A",
            link:function(scope, element, attr){
                element.bind("click", function () {
                    window.WdatePicker({
                        onpicked: function () {
                            var that = this;
                            scope.$apply(function(){
                                scope.startDate = that.value
                            });
                        },
                        oncleared:function(){
                            scope.$apply(function(){
                                scope.startDate = "";
                            });
                        },
                        dateFmt:'yyyy-MM-dd'
                    });
                });
            }
        };
    })
    .directive("endDateYmd",function(){
        return {
            restrict:"A",
            link:function(scope, element, attr){
                element.bind("click", function () {
                    window.WdatePicker({
                        onpicked: function () {
                            var that = this;
                            scope.$apply(function(){
                                scope.endDate = that.value
                            });
                        },
                        oncleared:function(){
                            scope.$apply(function(){
                                scope.endDate = "";
                            });
                        },
                        dateFmt:'yyyy-MM-dd'
                    });
                });
            }
        };
    })
    .directive("levelTwoMenu", function(){
        return {
            restrict:"A",
            link:function(scope, element, attr){
                element.bind("mouseenter", function () {
                    $(element).find("ul").show();
                });
                element.bind("mouseleave", function () {
                    $(element).find("ul").hide();
                });
            }
        };
    })
    .directive("levelThreeMenu", function(){
        return {
            restrict:"A",
            link:function(scope, element, attr){
                element.bind("click", function () {
                    $(element).closest("ul").hide();
                });
            }
        };
    })
    //百分条指令
    .directive('percentScale', function(){
        return {
            restrict: "AE",
            scope:{
                featureTitle: "=",
                arr: "="
            },
            template: '<div class="clearfix has{{arr.length}}">' +
                            '<div class="customer-feature-title">{{featureTitle}}</div>' +
                            '<div class="customer-feature-percent"><div class="customer-feature-percent-outer">' +
                                '<div class="customer-feature-percent-nums">' +
                                    '<span class="s{{$index+1}}" ng-repeat="p in arr" ng-style={"width":(($index==0?(p.percent):($index==1?(arr[0].percent+arr[1].percent):($index==2)?(arr[0].percent+arr[1].percent+arr[2].percent):($index==3?(arr[0].percent+arr[1].percent+arr[2].percent+arr[3].percent):($index==4?(arr[0].percent+arr[1].percent+arr[2].percent+arr[3].percent+arr[4].percent):($index==5?(arr[0].percent+arr[1].percent+arr[2].percent+arr[3].percent+arr[4].percent+arr[5].percent):($index==6?(arr[0].percent+arr[1].percent+arr[2].percent+arr[3].percent+arr[4].percent+arr[5].percent+arr[6].percent):($index==7?(arr[0].percent+arr[1].percent+arr[2].percent+arr[3].percent+arr[4].percent+arr[5].percent+arr[6].percent+arr[7].percent):($index==8?(arr[0].percent+arr[1].percent+arr[2].percent+arr[3].percent+arr[4].percent+arr[5].percent+arr[6].percent+arr[7].percent+arr[8].percent):($index==9?(arr[0].percent+arr[1].percent+arr[2].percent+arr[3].percent+arr[4].percent+arr[5].percent+arr[6].percent+arr[7].percent+arr[8].percent+arr[9].percent):10)))))))))+"%")}></span>' +
                                    /*'<span></span>' +
                                    '<span></span>' +
                                    '<span></span>' +*/
                                '</div>' +
                                '<div class="customer-feature-percent-text clearfix">' +
                                    '<span class="s{{$index+1}}" ng-class="{clear: $index%4==0}" ng-repeat="p in arr"><i></i>{{p.name}} <b>{{p.percent}}</b>%</span>' +
                                    /*'<span><i></i>{{arr[0].name}} <b>{{arr[0].percent}}</b>%</span>' +
                                    '<span><i></i>45-54 <b>20</b>%</span>' +
                                    '<span><i></i>20-34 <b>15</b>%</span>' +
                                    '<span><i></i>55-64 <b>8</b>%</span>' +*/
                                '</div>' +
                            '</div></div>' +
                        '</div>'
        }
    })
    //客户概览左右切换指令
    .directive('listSlide', function(){
        return {
            restrict: "ACE",
            scope: {
                onepage: "@",//获取每屏显示的item数量
                customerSorts: "="
            },
            link: function(scope, element, attrs){
                scope.$watch('customerSorts', function(x,y){
                    if(x != undefined){
                        render();
                    }
                });

                //console.log(scope.onepage);
                var element = $(element);
                //获取容器
                var container = element.find(".page-container")
                //获取上一页跟下一页按钮
                var prevBtn = element.find(".arrow-prev");
                var nextBtn = element.find(".arrow-next");
                var currentIndex, items, onepage, pages
                function render(){
                    currentIndex = 1;//默认显示第一屏
                    items = element.find(".client-show-header-r-item");
                    onepage = (scope.onepage && (+scope.onepage)) || 1;
                    //console.log(typeof onepage);
                    pages = Math.ceil(items.length/onepage);
                    //遍历item设置left坐标
                    angular.forEach(items, function(item, index){
                        //console.log(item);
                        $(item).css({"left": index*33.333 + "%"});
                    });
                    setBtnStyle();
                }
                render();
                
                //设置上一页下一页按钮样式             
                function setBtnStyle(){
                    if(currentIndex == 1){
                        prevBtn.addClass("has-no");
                    }else{
                        prevBtn.removeClass("has-no");
                    }
                    if(currentIndex >= pages){
                        nextBtn.addClass("has-no");
                    }else{
                        nextBtn.removeClass("has-no");
                    }
                }
                setBtnStyle();


                var goToPage = function(){
                    //console.log(111);
                    //console.log(container.html());
                    container.animate({"left": -100*(currentIndex-1) + "%"});
                }

                nextBtn.click(function(){
                    if(currentIndex>=pages){
                        return;
                    }
                    currentIndex++;
                    goToPage();
                    setBtnStyle()
                });

                prevBtn.click(function(){
                    if(currentIndex<=1){
                        return;
                    }
                    currentIndex--;
                    goToPage();
                    setBtnStyle()
                })


                //console.log(pages);
                //console.log(scope);
                //console.log(element);
                //console.log(attrs);
            }
        }
    })
	
    .directive("scrollFixTop", [function($timeout){
        return {
            restrict: "AE",
            link: function(scope, ele, attr){
                //console.log(ele);
                var ele = $(ele);
                ele.css({"position":"relative"});
                
                var scrollHeader = ele.find(".scroll-header");
                
                var scrollMain = ele.find(".scroll-main");
                var eleHeight = 0, scrollHeaderHeight = 0, scrollMainHeight = 0;

                //console.log("scrollMainW:" + scrollMain.width());

                function getMainHeight(){
                    return scrollMain.outerHeight();
                }


                scope.getMainHeight = function() {
                    return scrollMain.outerHeight();  
                };

                scope.$watch(scope.getMainHeight, function(){
                    eleHeight = ele.height();
                    scrollHeaderHeight = scrollHeader.outerHeight();
                    scrollMainHeight = scrollMain.outerHeight();
                    if(eleHeight - scrollHeaderHeight < scrollMainHeight){
                        //console.log(eleHeight - scrollHeaderHeight);
                        scrollMain.css({"height": (eleHeight - scrollHeaderHeight), "overflow": "auto"});
                        //console.log("w2: " + scrollMain.width());
                        scrollHeader.css({"paddingRight":17})
                    }
                });

                
            }
        }
    }])
    //登录界面轮换背景图片指令
    .directive("slideBg", ["$timeout", function($timeout){
        return {
            restrict: "AE",
            scope: {
                slideTime: "@"
            },
            link: function(scope, element, attrs){
                //console.log("scope");
                //console.dir(scope);
                var $element = $(element);
                var imgs = attrs.imgs.split(",");
                var imgsUploaded = [];
                var imgsInitWidthHeight = [];//保存图片原始的宽高
                var i = 0;
                var time = +attrs.time * 1000;//切换渐变时间
                
                //console.log(imgs);
                createNext();
                function createNext(){
                    if(i == imgs.length){
                        //当已经加载完所有图片开始进行初始化绑定事件
                        init();
                        //console.log(imgsUploaded);
                        return;
                    }
                    var img = new Image();
                    img.src = imgs[i] + "?" + (+new Date());
                    //console.log(img);
                    img.onload = function(){
                        //console.log("w:" + img.width + " h: " + img.height);
                        imgsUploaded.push(img);
                        imgsInitWidthHeight.push({
                            "w": img.width,
                            "h": img.height
                        })
                        i++;
                        createNext();//继续加载下一张图片
                    }
                }

                function init(){
                    render();
                    bind();
                }

                //
                var $imgs = null;
                function render(){
                    for(var j=0, len=imgsUploaded.length; j<len; j++){
                        $element.append(imgsUploaded[j])
                    }
                    //默认显示第一个
                    $imgs = $element.find("img");
                    $imgs.hide();
                    $imgs.eq(0).fadeIn();
                }

                function bind(){
                    //绑定事件
                    windowResize();
                    goChangeImg();
                }

                var changeImg = null;
                var imgIndex = 0;
                function goChangeImg(){
                    changeImg = $timeout(function(){
                        //console.log("length:" + $imgs.length);
                        $imgs.eq(imgIndex).fadeOut();
                        if(imgIndex == $imgs.length-1){
                            imgIndex = 0;
                            $imgs.eq(imgIndex).fadeIn()
                        }else{
                            $imgs.eq(imgIndex+1).fadeIn();
                        }
                        imgIndex ++;
                        goChangeImg();
                    },time)
                }


                scope.$on("$destroy", function(){
                    $(window).unbind("resize", windowResize);
                });

                function windowResize(){
                    timer && $timeout.cancel(timer);
                    timer = $timeout(function(){
                        if($imgs == null){
                            return;
                        }
                        //console.log(1111111);
                        var width = $(window).width();
                        var height = $(window).height();
                        //$imgs.css({width: width})
                        $imgs.each(function(index, img){
                            

                            var w = width;
                            var h = (w/imgsInitWidthHeight[index].w)*imgsInitWidthHeight[index].h;

                            if(h<height){
                                h = height;
                            }

                            $(img).css({width: w, height: h, top: -(h-height) + "px"});

                            //console.log(img.width);
                            //var w = width;
                            //var h = width/imgsInitWidthHeight[index].w*
                        })

                    },100)
                }

                //checkScroll();//计算是显示“回到顶部按钮”还是隐藏

                var timer = null;
                
                $(window).resize(windowResize);

            }
        }
    }])
    
    //iframe盒子
    .directive("iframeBox", ["$timeout", function($timeout){
        return {
            restrict: "AE",
            scope: {
                iframeHref: "="
            },
            link: function(scope, element, attrs){
                //alert(scope.href);
                var $element = $(element);


                // 建议的正则
                function isURL(str){
                    return str.indexOf("http") == 0;
                }
                
                


                scope.$watch('iframeHref', function(href){
                    if(href == undefined){
                        return;
                    }

                    if(!isURL(href)){
                        return;
                    }
                    //console.log("haha");
                    //console.log(a);
                    //alert(href);

                    //<iframe ng-src="{{href}}" frameborder="0" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" allowtransparency="yes"></iframe>

                    var iframe = document.createElement("iframe");
                    iframe.src = href;
                    iframe.width = "100%";
                    iframe.height = "100%";
                    iframe.frameborder = "no";
                    iframe.border = 0;
                    $(iframe).css({border:"0", frameborder: "no"});

                    $element.append(iframe);

                    $timeout(function(){
                        //alert(1111);
                        $(window).trigger("resize");
                    },500)


                });

                resize();

                function resize(){
                    //console.log("resize");
                    $element.css({position:"relative", top:0});
                    var offset = $element.offset();
                    var top = offset.top;
                    //console.log(top);
                    $element.css({"width":"100%", "height": $(window).height()-top-4, "backgroundColor":"#fff", "position":"absolute", "left":0, "top": top});
                }

                $(window).bind("resize", resize);


                scope.$on("$destroy", function(){
                    $(window).unbind("resize", resize);
                })





            }
        }
    }])

    //日期时间
    .directive("isDate", [function(){
        return {
            restrict: "AE",
            scope: {
                "dateTime": "="
            },
            link: function(scope, element, attrs){

                element.bind("click", function () {
                    window.WdatePicker({
                        onpicked: function () {
                            var that = this;
                            scope.$apply(function(){
                                scope.dateTime = that.value;
                            });
                        },
                        oncleared:function(){
                            scope.$apply(function(){
                                scope.dateTime = "";
                            });
                        }
                    });
                });
            }
        }
    }])

    //时分秒时间
    .directive("isTime", [function(){
        return {
            restrict: "AE",
            scope: {
                "time": "="
            },
            link: function(scope, element, attrs){

                element.bind("click", function () {
                    window.WdatePicker({
                        onpicked: function () {
                            var that = this;
                            scope.$apply(function(){
                                scope.dateTime = that.value;
                            });
                        },
                        oncleared:function(){
                            scope.$apply(function(){
                                scope.dateTime = "";
                            });
                        },
                        dateFmt:'H:mm:ss'
                    });
                });
            }
        }
    }])

	//图表控件
	.directive("isEcharts", function(){
        return {
            restrict: "AE",
            scope: {
                option: "="
            },
            link: function(scope, element, attrs){
                var myChart = null;

                if(angular.isObject(scope.option)){
                    if(element.width() != 0){
                        myChart = echarts3.init(element[0]);
                    }
                    
                }else{
                    if(scope.option != undefined && element.width() != 0){
                        myChart.setOption(scope.option);
                    }
                }

                scope.$watch("option", function(a){
                    if(!angular.isObject(scope.option)){
                        return;
                    }
                    if (myChart && myChart.dispose && element.width() != 0) {
                        //myChart.dispose();
                        //2016-08-03修改日志：先清空对象，再删除元素节点，替换Dispose方法
                        myChart.clear();
                        $(element).find("div").remove();
                    }
                    myChart = echarts3.init(element[0]);
                    myChart.setOption(scope.option);
                });

/*
                var changeWindow = function(){
                    scope.$apply(function(){
                        if(!angular.isObject(scope.option) ||  element.width() == 0){
                            return;
                        }
                        if (myChart && myChart.dispose) {
                            myChart.dispose();
                        }
                        scope.option.animation = false;
                        myChart = echarts3.init(element[0]);
                        myChart.setOption(scope.option);
                    })
                }

                $(window).bind("resize", changeWindow);

                scope.$on("$destroy", function(){
                    $(window).unbind("resize", changeWindow);
                });*/
                
            }
        }
    })
    .directive("zYree",[function(){
    	return {
    		restrict:"AE",
    		scope:{
    			setting:"=",
    			znodes:"=",
                currentselect:"="
    		},
    		link:function(scope,element, attrs){
    			var myzTree = null;
    			if(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)){
    				myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
    			}
    			//用于初始化
    			scope.$watch("znodes",function(newVal, oldVal){
    				if(oldVal === newVal)return;
    				if(!(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)))return;
                    myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
                    
    				//像这样就可以调用它自身的方法
    				myzTree.expandAll(false);
                     var nodes = myzTree.getNodes();
                      if (nodes.length>0){
                          if(scope.currentselect){
                              myzTree.selectNode(scope.currentselect);
                          }else{
                              myzTree.selectNode(nodes[0]);
                          }
                             
                          //var allnodes = myzTree.transformToArray(nodes);
                          //给是目录的节点加背景
                          /*angular.forEach(allnodes,function(value,key){
                              if(value.isParent){
                                  $("#"+value.tId+"_a").addClass("diy_hasABack");
                              }
                          })*/
                      }
    			});
    			
    		}
    	}
    }])
    .directive("zFree",[function(){
    	return {
    		restrict:"AE",
    		scope:{
    			setting:"=",
    			znodes:"=",
                currentselect:"="
    		},
    		link:function(scope,element, attrs){
    			var myzTree = null;
    			if(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)){
    				myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
    			}
    			//用于初始化
    			scope.$watch("znodes",function(newVal, oldVal){
    				if(oldVal === newVal)return;
    				if(!(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)))return;
                    myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
                    
    				//默认展开，像这样就可以调用它自身的方法
    				 myzTree.expandAll(true);
                     var nodes = myzTree.getNodes();
                    
                   /* //设置上线下线
                    angular.forEach(nodes,function(v,k){
                        if(!v.isParent){
                            v.name = v.name+"("+v.status+")"
                        }
                    })*/
                      if (nodes.length>0){
                          if(scope.currentselect){
                              myzTree.selectNode(scope.currentselect);
                          }else{
                              myzTree.selectNode(nodes[0]);
                          }
                             
                          var allnodes = myzTree.transformToArray(nodes);
                          //给是目录的节点加背景
                          angular.forEach(allnodes,function(value,key){
                              if(value.isParent){
                                  $("#"+value.tId+"_a").addClass("diy_hasABack");
                              }
                          })
                      }
    			});
    			
    		}
    	}
    }])
    .directive("zTree",[function(){
    	return {
    		restrict:"AE",
    		scope:{
    			setting:"=",
    			znodes:"="
    		},
    		link:function(scope,element, attrs){
    			var myzTree = null;
    			if(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)){
    				myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
    			}
    			//用于初始化
    			scope.$watch("znodes",function(newVal, oldVal){
                   // console.log(newVal + oldVal+"  j  ")
    				if(oldVal === newVal)return;
    				if(!(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)))return;
                    myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
                    
    				//像这样就可以调用它自身的方法
    				myzTree.expandAll(true);
                    // var nodes = myzTree.getNodes();
                      //if (nodes.length>0){
                          //var node = myzTree.selectNode(nodes[0]);
                          //var allnodes = myzTree.transformToArray(nodes);
                          //给是目录的节点加背景
                          /*angular.forEach(allnodes,function(value,key){
                              if(value.isParent){
                                  $("#"+value.tId+"_a").addClass("diy_hasABack");
                              }
                          })*/
                         /* $("#commonTree_"+nodes[0].id+"_a").click();*/
                          //console.log(nodes[0].id)
                     // }
    			});
    			
    		}
    	}
    }])
    .directive("checkTree",[function(){
    	return {
    		restrict:"AE",
    		scope:{
    			setting:"=",
    			znodes:"="
    		},
    		link:function(scope,element, attrs){
    			var myzTree = null;
              
    			if(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)){
                    myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
    			}
    			//用于初始化
    			scope.$watch("znodes",function(newVal, oldVal){
    				if(oldVal === newVal)return;
    				if(!(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)))return;
                    myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
    				//像这样就可以调用它自身的方法
    				myzTree.expandAll(true);
                    myzTree.setting.check.chkboxType = { Y: "ps", N: "s" };
    			});
    			
    		}
    	}
    }])
    .directive("superCheckTree",[function(){
    	return {
    		restrict:"AE",
    		scope:{
    			setting:"=",
    			znodes:"=",
                zid:"="
    		},
    		link:function(scope,element, attrs){
    			var myzTree = null;
                //动态设置id
                $(element[0]).attr("id",scope.zid);
                
    			if(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)){
                    myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
                    //得到节点
                    var nodes = myzTree.getNodes();
                    //把节点转化成数组
                    var arr = myzTree.transformToArray(nodes);
                    //赋值选中的节点
                    angular.forEach(arr,function(zv,zk){
                        zv.checked = false;
                        zv.current = false;
                        for(var i=0;i<scope.znodes.length;i++){
                            if(scope.znodes[i].current && scope.znodes[i].id == zv.id){
                                zv.checked = true;
                                zv.current = true;
                                break;
                            }
                        }
                    })
                    //刷新树
                    myzTree.refresh();
    			}
    			//用于初始化
    			scope.$watch("znodes",function(newVal, oldVal){
    				if(oldVal === newVal)return;
    				if(!(angular.isObject(scope.setting)&&angular.isObject(scope.znodes)))return;
                    //动态设置id
                    $(element[0]).attr("id",scope.zid);
                    myzTree = $.fn.zTree.init($("#"+element[0].id),scope.setting,scope.znodes);
    				//像这样就可以调用它自身的方法
    				myzTree.expandAll(false);
                    myzTree.setting.check.chkboxType = { Y: "ps", N: "ps" };
                    
                    //得到节点
                    var nodes = myzTree.getNodes();
                    //把节点转化成数组
                    var arr = myzTree.transformToArray(nodes);
                    //赋值选中的节点
                    angular.forEach(arr,function(zv,zk){
                        zv.checked = false;
                        zv.current = false;
                        for(var i=0;i<scope.znodes.length;i++){
                            if(scope.znodes[i].current && scope.znodes[i].id == zv.id){
                                zv.checked = true;
                                zv.current = true;
                                break;
                            }
                        }
                    })
                    //刷新树
                    myzTree.refresh();
    			});
    			
    		}
    	}
    }])
    //无限级下拉Select BY TANG
    .directive("multiSelect",[function(){
    	return {
    		restrict:"AE",
            replace:true,
    		scope:{
                collects:"=",//统一Select数据集合
    			skey:"="//当前值数组
    		},
            template: '<div ng-repeat="m in myobj" class="item-left others-right">'+
                            '<select ng-model="m.select" ng-hide="m.selectHide" '+
            'ng-change="selectChange($index)" class=" form-control '+
            'label-extract-select" ng-options="us.name for us in m.myfull">'+
                               ' <option value="">请选择</option>'+
                            '</select>'+
                        '</div>',
    		link: function (scope, element, attrs) {
                scope.$watch('collects',function(ov,nv){
                    if(ov == undefined || ov == "undefined")return;
                    //开始部门多级下拉赋值
                    var arr = scope.skey;
                    scope.j = 0, scope.myobj = [];
                    //递归
                    digui(scope.collects);
                    function digui(useList) {
                        var obj = {};
                        if (useList.length == 0) return;
                        //部门Key为空
                        if (!arr||arr.length == 1 && arr[0] == "") {
                            obj.select = "";
                            obj.myfull = useList;
                            obj.selectHide = false;
                            scope.myobj.push(obj);
                            return;
                            //部门Key不为空
                        } else {
                            while (scope.j <= (arr.length - 1)) {
                                for (var i = 0; i < useList.length; i++) {
                                    if (useList[i].groupKey == arr[scope.j]) {
                                        obj.select = useList[i];
                                        obj.myfull = useList;
                                        obj.selectHide = false;
                                        scope.myobj.push(obj);
                                        scope.j++;
                                        digui(obj.select.son);
                                    }
                                }

                            }
                        }

                    }
                })

    		},
            controller: [ "$scope", function (scope) {
                //重写下拉Change事件 i 是当前点击的索引值
                scope.selectChange = function(i){
                    //当前点击不是最后一个
                    var s = scope.myobj[i].select;
                    if(s && s.son.length!=0){
                        //当前myobj只有一个值
                       if(scope.myobj.length <= i+1){
                           var obj = {};
                           obj.select = "";
                           obj.myfull = s.son;
                           obj.selectHide = false;
                           scope.myobj.push(obj);
                        //当前myobj有多个值
                       }else{
                           for(var k=0;k<i+2;k++){
                               scope.myobj[k].selectHide = false;
                           }
                            scope.myobj[i+1].select = ""
                           for(var j=i+2;j<scope.myobj.length;j++){
                               scope.myobj[j].selectHide = true;
                           }
                       }
                    //当前点击是最后一个
                    }else{
                        for(var n=i+1;n<scope.myobj.length;n++){
                           scope.myobj[n].selectHide = true;
                       }
                    }
                }
            }]
    	}
    }])
	.directive("isStopPropagation", function(){
		return {
			restrict: "AE",
			link: function(scope, element, attrs){
				element.bind("click", function(event){
					//console.log(3333);
					event.stopPropagation();
				})	
			}
		}
	})
    //点击事件区域指令
    .directive("zoneClick", function(){
		return {
			restrict: "AE",
            scope:{
                skey:"=",
                sid:"="
            },
			link: function(scope, element, attrs){
                scope.$watch('skey', function (o, n) {
                    if(o != n) return;
                    $(element[0]).attr("id",scope.sid);
                      $(document).bind('mousedown', function (event) {
                          var $target = $(event.target);
                          
                          if (!($target.parents().andSelf().is("#"+scope.sid))) {
                              scope.$apply(function(){
                                  return scope.skey = false;
                                })
                          }else{
                              scope.$apply(function(){
                                  return scope.skey = true;
                                })
                          }
                      });
                  });
			}
		}
	})
    //到页面指定位置 BY TANG VERSION 2 
    .directive("toLocate", function () {
        return {
            restrict: "AE", 
            scope:{
                tid:"@",
                pscope:"@"
            },
            link: function (scope, element, attrs) {
                element.bind("click", function (event) {
                    event.stopPropagation();
                    var scroll_offset = $("#"+scope.tid).offset();
                    if(scope.pscope == undefined){
                        $("body,html").animate({
                            scrollTop: scroll_offset.top
                        }, 1000);
                    }else{
                        $("."+scope.pscope).animate({
                            scrollTop: scroll_offset.top
                        }, 1000);
                    }
                    
                })
            }
        }
    })
     /*兼容IE的PlaceHolder 可行的方案 BY TANG JIDE*/
    .directive('pHolder', [function () {
        return {
            restrict: 'AE',
            scope: {
                inputid: '@', //指定input的id
                content: '@', //placeholder的内容
                tops: '@', //绝对定位的相对上边距值
                lefts: '@', //绝对定位的相对左边距值
                setp: '@' //初始控制显示隐藏
            },
            replace: true,
            template: '<span ng-show="plaShow" style="top:{{tops}}px;left:{{lefts}}px;" class="placeHolder-text" >{{content}}</span>',
            link: function (scope, ele, attr) {
                //has text ? 
                if (!scope.setp) {
                    scope.plaShow = true;
                } else {
                    scope.plaShow = false;
                }
                var tag = $("#" + scope.inputid);
                $(ele[0]).on('click', function (e) {
                    scope.$apply(function () {
                        return scope.plaShow = false;
                    })
                    $("#" + scope.inputid).focus();
                })
                $("#" + scope.inputid).on('click', function (e) {
                    scope.$apply(function () {
                        return scope.plaShow = false;
                    })
                })
                $("#" + scope.inputid).blur(function () {
                        if ($(this).val() == "") {
                            scope.$apply(function () {
                                return scope.plaShow = true;
                            })
                        }
                    })


                
            }
        }
    }])
    
    .directive("assignSpanButton", function ($compile) { //自定义带权限按钮
    	return {
    		replace: true,
    		template: "<span  ></span>",
    		link: function(scope, el, attr) {
    			var b = false;
    			if(scope.modulesCode.indexOf("'" + attr.modulecode + "'") > 0) {
    				b = true;
    			}
    			$(el).html(attr.modtext);
    			if (!b) {
    				//无权限则替换ng-click方法并重新编译
    				var text = el.context.outerHTML;
    				text = text.replace('assign-span-button=""', '');
    				text = text.replace('assign-span-button', ''); //兼容IE8
    				text = text.replace(/ng-click="([^"]*)"/g, 'ng-click="noPermission()"');
    				
    				el.replaceWith($compile(text)(scope));
    			}
    		}
    	}
    })
    
	.directive("assignLiButton", function ($compile) { //自定义带权限按钮
    	return {
    		replace: true,
    		template: "<li  ></li>",
    		link: function(scope, el, attr) {
    			var b = false;
    			if(scope.modulesCode.indexOf("'" + attr.modulecode + "'") > 0) {
    				b = true;
    			}
    			$(el).html(attr.modtext);
    			if (!b) {
    				//无权限则替换ng-click方法并重新编译
    				var text = el.context.outerHTML;
    				text = text.replace('assign-li-button=""', '');
    				text = text.replace('assign-li-button', ''); //兼容IE8
    				text = text.replace(/ng-click="([^"]*)"/g, 'ng-click="noPermission()"');
    				
    				el.replaceWith($compile(text)(scope));
    			}
    		}
    	}
    })
    
    .directive("assignAButton", function ($compile) { //自定义带权限按钮
    	return {
    		replace: true,
    		template: "<a  ></a>",
    		link: function(scope, el, attr) {
    			var b = false;
    			if(scope.modulesCode.indexOf("'" + attr.modulecode + "'") > 0) {
    				b = true;
    			}
    			$(el).html(attr.modtext);
    			if (!b) {
    				//无权限则替换ng-click方法并重新编译
    				var text = el.context.outerHTML;
    				text = text.replace('assign-a-button=""', '');
    				text = text.replace('assign-a-button', ''); //兼容IE8
    				text = text.replace(/ng-click="([^"]*)"/g, 'ng-click="noPermission()"');
    				
    				el.replaceWith($compile(text)(scope));
    			}
    		}
    	}
    })
    
})