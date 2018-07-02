define(function(){
	return angular.module("utilModule", [])
	.factory("util",["$timeout", function($timeout){
		return {
			setMaxHeightSame: function(colA, colB, hasOffset){

				$(colA).height("auto");
				$(colB).height("auto");

				//if($(colA).length <= 0 || )

				$timeout(function(){
					//alert(2222);
					var colAHeight = $(colA).height();
					var colBHeight = $(colB).height();
					if($(colA).length <= 0 || $(colB).length <= 0){
						return false;
					}
					if(hasOffset){
						var topHeight = $(colA).offset().top - $(colA).offsetParent().offset().top;
						if((colAHeight + topHeight) > colBHeight){
							$(colB).height(colAHeight + topHeight);
						}else{
							$(colA).height(colBHeight - 1 - topHeight);
						}
					}else{
						if(colAHeight > colBHeight){
							$(colB).height(colAHeight - 2);
						}else{
							$(colA).height(colBHeight + 2);
						}
					}

				},100);
				
			}
		}
	}])
})