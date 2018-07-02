define(['app', 'window', 'jquery', 'modulesService', 'toastr', 'WdatePicker'],
function(app, w, $) {
    app.register.controller('sysModulesServiceController', ['$location', '$modal', '$filter', '$scope', '$rootScope', '$state', '$interval', '$timeout', 'modulesService', 'toastr', '$http',

    function($location, $modal, $filter, $scope, $rootScope, $state, $interval, $timeout, modulesService, toastr, $http) {

        $scope.initializeController = function() {
            $scope.hasGetConditions = false; // 初始化默认没有加载属性列表
            $scope.getMyZnodes();
            $scope.moduleNowClick = $rootScope.moduleNowClick;
            $("#rMenu ul").bind('click',
            function() {
                $("#rMenu ul").hide();
            });
        }

        //初始化zTree数据
        $scope.getMyZnodes = function() {
            modulesService.myZNnodes({
                id: ""
            },
            function(response, status) {
                $scope.myZnodes = response.data.modulesList;
            },
            function(response, status) {})
        }

        //保存修改
        $scope.saveModify = function(code) {
            var _parentNode = $scope.currNode.getParentNode();
            if (code.options != "add") {
                code.options = "update";
                var param = code;
                modulesService.updateModule(param,
                function(response) {
                    var _orga = response.data.sysModule;
                    var zTree = $.fn.zTree.getZTreeObj("commonTree");
                    //$scope.getMyZnodes();
                    var node = zTree.getNodeByParam("modGuid", _orga.modGuid, null);
                    if (node) {
                        node.modGuid = _orga.modGuid,
                        node.modName = _orga.modName,
                        node.modCode = _orga.modCode,
                        node.modOpentarget = _orga.modOpentarget,
                        node.modSort = _orga.modSort,
                        node.modStatus = _orga.modStatus,
                        node.modPguid = _orga.modPguid,
                        node.modLevel = _orga.modLevel,
                        node.modKind = _orga.modKind,
                        node.modType = _orga.modType,
                        node.modCss = _orga.modCss,
                        node.modImage = _orga.modImage,
                        node.modHtmlurl = _orga.modHtmlurl,
                        node.modCtrlurl = _orga.modCtrlurl,
                        node.modServiceurl = _orga.modServiceurl,
                        node.modClassfordata = _orga.modClassfordata,
                        node.modRemark = _orga.modRemark,
                        node.modIsroot = _orga.modIsroot,
                        node.modIsleaf = _orga.modIsleaf,
                        node.modUrl = _orga.modUrl,
                        node.modPath = _orga.modPath,
                        node.modCreatetime = _orga.modCreatetime,
                        node.modModifytime = _orga.modModifytime,
                        node.iconSkin = _orga.iconSkin,
                        node.options = "common";
                        zTree.updateNode(node);
                    }

                    toastr.success('修改成功！', '提示', {
                        closeButton: true,
                        timeOut: 3000
                    });
                },
                function(response, status) {
                    toastr.warning('修改失败！', '提示', {
                        closeButton: true,
                        timeOut: 3000
                    });
                })
            } else {
                var param = code;
                modulesService.insertModule(param,
                function(response) {
                    var _orga = response.data.module;
                    var zTree = $.fn.zTree.getZTreeObj("commonTree");
                    var node = zTree.getNodeByParam("modGuid", _orga.modGuid, null);
                    
                    if (node) {
                        node.modGuid = _orga.modGuid,
                        node.modName = _orga.modName,
                        node.modCode = _orga.modCode,
                        node.modOpentarget = _orga.modOpentarget,
                        node.modSort = _orga.modSort,
                        node.modStatus = _orga.modStatus,
                        node.modPguid = _orga.modPguid,
                        node.modLevel = _orga.modLevel,
                        node.modKind = _orga.modKind,
                        node.modType = _orga.modType,
                        node.modCss = _orga.modCss,
                        node.modImage = _orga.modImage,
                        node.modHtmlurl = _orga.modHtmlurl,
                        node.modCtrlurl = _orga.modCtrlurl,
                        node.modServiceurl = _orga.modServiceurl,
                        node.modClassfordata = _orga.modClassfordata,
                        node.modRemark = _orga.modRemark,
                        node.modIsroot = _orga.modIsroot,
                        node.modIsleaf = _orga.modIsleaf,
                        node.modUrl = _orga.modUrl,
                        node.modPath = _orga.modPath,
                        node.modCreatetime = _orga.modCreatetime,
                        node.modModifytime = _orga.modModifytime,
                        node.iconSkin = _orga.iconSkin,
                        node.options = "common";
                        zTree.updateNode(node);
                    }

                    toastr.success(response.header.message, '提示', {
                        closeButton: true,
                        timeOut: 3000
                    });
                },
                function(response) {
                    toastr.warning("添加失败！", '提示', {
                        closeButton: true,
                        timeOut: 3000
                    });
                });
            }
        }

        //默认选中第一个
        /* $scope.selectFirst = function(){
                var zTree = $.fn.zTree.getZTreeObj("commonTree");
                zTree.selectNode($scope.myZnodes[0]);
            }*/
        var newCount = 100;
        var log, className = "dark",
        curDragNodes, autoExpandNode;

        $scope.mySetting = {
            view: {
                removeHoverDom: function(treeId, treeNode) {
                    $("#addBtn_" + treeNode.tId).unbind().remove();
                },
                selectedMulti: false,
                showIcon: false,
                showLine: false,
                dblClickExpand: false,
                addDiyDom: function(treeId, treeNode) {
                    var spaceWidth = 20;
                    var switchObj = $("#" + treeNode.tId + "_switch"),
                    icoObj = $("#" + treeNode.tId + "_ico");
                    switchObj.remove();
                    icoObj.before(switchObj);

                    if (treeNode.level > 0) {
                        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
                        switchObj.before(spaceStr);
                    }
                }

            },
            edit: {
                enable: true,
                showRemoveBtn: function(treeId, treeNode) {
                    return false;
                },
                showRenameBtn: function(treeId, treeNode) {
                    return false;
                }
            },
            data: {
                key: {
                    name: "modName"
                },
                simpleData: {
                    enable: true,
                    rootPId: null,
                    idKey: "modGuid",
                    pIdKey: "modPguid"
                }
            },
            callback: {
                onClick: function(e, treeId, treeNode) {
                    $scope.currNode = treeNode;
                    var _tmp = {
                        "modGuid": treeNode.modGuid,
                        "modName": treeNode.modName,
                        "modCode": treeNode.modCode,
                        "modOpentarget": treeNode.modOpentarget,
                        "modSort": treeNode.modSort,
                        "modStatus": treeNode.modStatus,
                        "modPguid": treeNode.modPguid,
                        "modLevel": treeNode.modLevel,
                        "modKind": treeNode.modKind,
                        "modType": treeNode.modType,
                        "modCss": treeNode.modCss,
                        "modImage": treeNode.modImage,
                        "modHtmlurl": treeNode.modHtmlurl,
                        "modCtrlurl": treeNode.modCtrlurl,
                        "modServiceurl": treeNode.modServiceurl,
                        "modClassfordata": treeNode.modClassfordata,
                        "modRemark": treeNode.modRemark,
                        "modIsroot": treeNode.modIsroot,
                        "modIsleaf": treeNode.modIsleaf,
                        "modUrl": treeNode.modUrl,
                        "modPath": treeNode.modPath,
                        "modCreatetime": treeNode.modCreatetime,
                        "modModifytime": treeNode.modModifytime,
                        "iconSkin": treeNode.iconSkin,
                        "options": treeNode.options
                    };

                    $scope.$apply(function() {
                        $scope.module = _tmp;
                    });
                },
                beforeRename: function(treeId, treeNode, newName, isCancel) {
                    var tipsContent = "请填写模块名称";
                    if (newName.length > 6) {
                        tipsContent = "模块名称过长（6字以内）！";
                    }
                    /*失去，复得焦点*/
                    if (newName == "" || newName.length > 8) {
                        $("#" + treeNode.tId + "_input").blur();
                        new w.Window().alert({
                            title: "提示",
                            width: 300,
                            height: 160,
                            content: tipsContent,
                            hasCloseBtn: true,
                            handler4AlertBtn: function() {
                                $("#" + treeNode.tId + "_input").focus();
                            }
                        });

                        return false;
                    } else {
                        modulesService.modifyNodeService({
                            name: newName
                        },
                        function(response) {
                            return true;
                        },
                        function(response, status) {
                            return false;
                        })

                    }
                },
                beforeDrag: function(treeId, treeNodes) {
                    return false;
                },
                beforeDrop: function(treeId, treeNodes, targetNode, moveType) {
                    return false;
                },
                onExpand: function(event, treeId, treeNode) {
                    if (treeNode === autoExpandNode) {
                        className = (className === "dark" ? "": "dark");
                    }
                },
                onRightClick: function(event, treeId, treeNode) {
                    $scope.currNode = treeNode;
                    var _tmp = {
                        "modGuid": treeNode.modGuid,
                        "modName": treeNode.modName,
                        "modCode": treeNode.modCode,
                        "modOpentarget": treeNode.modOpentarget,
                        "modSort": treeNode.modSort,
                        "modStatus": treeNode.modStatus,
                        "modPguid": treeNode.modPguid,
                        "modLevel": treeNode.modLevel,
                        "modKind": treeNode.modKind,
                        "modType": treeNode.modType,
                        "modCss": treeNode.modCss,
                        "modImage": treeNode.modImage,
                        "modHtmlurl": treeNode.modHtmlurl,
                        "modCtrlurl": treeNode.modCtrlurl,
                        "modServiceurl": treeNode.modServiceurl,
                        "modClassfordata": treeNode.modClassfordata,
                        "modRemark": treeNode.modRemark,
                        "modIsroot": treeNode.modIsroot,
                        "modIsleaf": treeNode.modIsleaf,
                        "modUrl": treeNode.modUrl,
                        "modPath": treeNode.modPath,
                        "modCreatetime": treeNode.modCreatetime,
                        "modModifytime": treeNode.modModifytime,
                        "iconSkin": treeNode.iconSkin,
                        "options": treeNode.options
                    };

                    $scope.$apply(function() {
                        $scope.module = _tmp;
                    })

                    var zTree = $.fn.zTree.getZTreeObj("commonTree");
                    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                        zTree.cancelSelectedNode();
                        showRMenu("root", event.clientX, event.clientY);
                    } else if (treeNode && !treeNode.noR) {
                        zTree.selectNode(treeNode);
                        showRMenu("node", event.clientX, event.clientY);
                    }
                    var rMenu = $("#rMenu");
                    function showRMenu(type, x, y) {
                        $("#rMenu ul").show();
                        if (type == "root") {
                            $("#m_del").hide();
                            $("#m_check").hide();
                            $("#m_unCheck").hide();
                        } else {
                            $("#m_del").show();
                            $("#m_check").show();
                            $("#m_unCheck").show();
                        }
                        $("#rMenu").css({
                            "top": y + 10 + "px",
                            "left": x + 20 + "px",
                            "visibility": "visible"
                        });

                        $("body").bind("mousedown", onBodyMouseDown);
                    }
                    function hideRMenu() {
                        if ($("#rMenu")) $("#rMenu").css({
                            "visibility": "hidden"
                        });
                        $("body").unbind("mousedown", onBodyMouseDown);
                    }
                    function onBodyMouseDown(event) {
                        if (! (event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
                            $("#rMenu").css({
                                "visibility": "hidden"
                            });
                        }
                    }

                }
            }
        };

        $scope.changeOrgName = function() {
            $scope.module.codNamepath = $scope.module.codParentnamepath + "/" + $scope.module.codName;
        };
        
        $scope.changeKind = function(module) {
        	if (module.modKind == "1") {
        		module.iconSkin = "treeModule";
        	} else if (module.modKind == "2") {
        		module.iconSkin = "treeMenu";
        	} else if (module.modKind == "3") {
        		module.iconSkin = "treeButton";
        	} else if (module.modKind == "4") {
        		module.iconSkin = "treeProcess";
        	}
        }
        

        $scope.addTreeNode = function() {
            var zTree = $.fn.zTree.getZTreeObj("commonTree");
            var newNode = {
            	modName: ""
            };
            var _guid = uuid(32, 16);

            if (zTree.getSelectedNodes()[0]) {
                var selectNode = zTree.getSelectedNodes()[0];

                if (selectNode.options == "add") {
                    new w.Window().alert({
                        title: "提示",
                        width: 300,
                        height: 160,
                        content: "当前码表项还未保存，请先保存！",
                        hasCloseBtn: true
                    });
                    return;
                }
                
                newNode = {
                    "modGuid": _guid,
                    "modName": "新增项",
                    "modCode": "",
                    "modOpentarget": "",
                    "modSort": 0,
                    "modStatus": 2,
                    "modPguid": $scope.module.modGuid,
                    "modLevel": $scope.module.modLevel * 1 + 1 * 1,
                    "modKind": "",
                    "modType": "",
                    "modCss": "",
                    "modImage": "",
                    "modHtmlurl": "",
                    "modCtrlurl": "",
                    "modServiceurl": "",
                    "modClassfordata": "",
                    "modRemark": "",
                    "modIsroot": 0,
                    "modIsleaf": 1,
                    "modUrl": "",
                    "modPath": $scope.module.modIsroot == 1 ? $scope.module.modGuid +  "." + _guid : $scope.module.modPath + "." + _guid,
                    "modCreatetime": "",
                    "modModifytime": "",
                    "iconSkin": "",
                    "options": "add"
                };
                zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
            } else {
                zTree.addNodes(null, newNode);
            }
        }

        $scope.removeTreeNode = function() {
            var zTree = $.fn.zTree.getZTreeObj("commonTree");
            var snodes = zTree.getSelectedNodes();
            var tipsContent = "确认删除\"" + snodes[0].codName + "\"组织？";
            if (snodes[0].isParent) {
                tipsContent = "确认删除\"" + snodes[0].codName + "\"组织及其子组织？";
            }
            new w.Window().confirm({
                title: "温馨提示",
                width: 300,
                height: 160,
                content: tipsContent,
                handler4ConfirmBtn: function() {

                    var param = {
                        codPath: snodes[0].codPath
                    };

                    modulesService.delCode(param,
                    function(response) {
                        if (response.header.code == -1) {
                            toastr.warning(response.header.message, '提示', {
                                closeButton: true,
                                timeOut: 3000
                            });
                        } else {
                            zTree.removeChildNodes(snodes[0]);
                            zTree.removeNode(snodes[0]);

                            toastr.success("删除成功！", '提示', {
                                closeButton: true,
                                timeOut: 3000
                            });
                        }
                    },
                    function(response, status) {});
                },
                hasCloseBtn: true
            });
        }
    }]);

});

function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
    i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8: r];
            }
        }
    }

    return uuid.join('');
}