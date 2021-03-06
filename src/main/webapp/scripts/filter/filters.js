define(['app', 'jquery', 'chart'], function (app) {

    app.register.filter('addDataKey', [function () {
        return function (arr) {
            return {
                data: arr
            }
        }
	}]);


    app.register.filter('toPie1', ['charts', function (charts) {
        return function (dataObj) {
            return charts.pie1(dataObj);
        }
	}]);


    app.register.filter('toPie2', ['charts', function (charts) {
        return function (dataObj) {
            return charts.pie2(dataObj);
        }
	}]);

    //标签上线与下线的显示控制
    app.register.filter("filterLabel", function () {
            return function (arr, text) {
                var tempArray = [];
                switch (text) {
                    case 'online':
                        angular.forEach(arr, function (value, key) {
                            if (value.status == "上线")
                                tempArray.push(value);
                        })
                        arr = tempArray;
                        break;
                    case 'offline':
                        angular.forEach(arr, function (value, key) {
                            if (value.status == "下线")
                                tempArray.push(value);
                        })
                        arr = tempArray;
                        break;
                }
                return arr;
            }
        })
        //标签长度控制
    app.register.filter("filterLength", function () {
        return function (input, text) {
        	if (input && input.length > 20) {
                input = input.substring(0, 20) + "...";
            }
            return input;
        }
    })
    //邮箱长度控制
     app.register.filter("filterEMLen", function () {
        return function (input, text) {
            if (input && input.length > 10) {
                input = input.substring(0, 10);
            }
            return input;
        }
    })
    app.register.filter("filterSelect", function () {
        return function (arr, text, checked) {
            var s = text.split("#");
            var temp = [];
            angular.forEach(arr, function (v, k) {
                var bool = false;
                for (var i = 0; i < s.length; i++) {
                    if (s[i] == v.id.toString()) {
                        if (checked && checked.id == s[i]){
                            bool = false;
                        }else{
                            bool = true;
                        }
                            
                        break;
                    }
                }
                if (!bool) {
                    temp.push(v);
                }

            })
            return temp;
        }
    });
    app.register.filter("important", function(){
		return function(str, keyword){
			if(keyword == undefined || keyword == ""){
				return str;
			};
			//console.log(str);
			//console.log("yes")
			var regexp = new RegExp(keyword, "g");
			return str.replace(regexp, '<span class="important">' + keyword + '</span>');
		}
	});
})
