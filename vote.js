var domain = "http://fyb.eastmoney.com/2017/api/"
var common = {
    /*通用请求接口*/
    ajax: function(options) {
        var p = options || {};
        var url = p.url || domain + p.type;
        $.ajax({
            url: url,
            crossDomain: true,
            data: p.data,
            dataType: 'jsonp',
            type: 'get',
            beforeSend: function() {
                if (p.beforeSend)
                    p.beforeSend();
            },
            complete: function() {
                if (p.complete)
                    p.complete();
            },
            success: function(result) {
                if (!result)
                    return;
                if (result.Status == 1) {
                    if (p.success)
                        p.success(result.Result, result.Message);
                } else {
                    if (p.error)
                        p.error(result.Status, result.Message);
                    else
                        alert('错误：' + result.Message);

                }
            },
            error: function(result, b) {
                if (b == "timeout")
                    alert('网络不给力，请稍后再试！');
                else
                    alert('网络不给力，请稍后再试！');
            }
        });
    },
    GetRequest: function(key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    }
}
var showtype = "";
var ccode = common.GetRequest("code");
var list_code = "";

var load_demo = {

    //注册事件
    loadevent: function() {

        //PC
        $("#rank-kg").on("click", "li", function() {
            $(this).addClass("current").siblings().removeClass("current");
            ;var code = $(this).data("code");
            $("#hy_txt").text($(this).children("a").text().replace("业", ""));
            load_demo.loadMenu2(code);
        })
        $("#rank-cg").on("click", "li", function() {
            $(this).addClass("current").siblings().removeClass("current");
            // $("#head_txt").text("2016年度" + $(this).children("a").text());
            $(".selConTit").text("2017年度" + $(this).children("a").text());
            var code = $(this).data("code");
            load_demo.loadvote(code);
        })
        $("#changimg").on("click", function() {
            $('#imgPVCode').attr('src', domain + 'YZM?rnd=' + ((new Date()).getTime()));
        })
        $("#vote").on("click", function() {
            load_demo.vote();
        })
        $("#look").on("click", function() {
            location.href = 'result.html?code=' + showtype;
        })
        $("#back").on("click", function() {
            location.href = 'found.html?code=' + showtype;
        });

        //wap头部点击
        $("#tabs-wap").on("click", "li", function() {
            $(this).addClass("current").siblings().removeClass("current");
            var code = $(this).data("code");
            load_demo.loadWapList(code);
        });
        //wap头部点击对应子项的点击
        $("#tabs-list").on("click", "li", function() {
            $(this).addClass("current").siblings().removeClass("current");
            var code = $(this).data("code");
            load_demo.loadWapRank(code);
            //load_demo.wapVote(code);

            //wap头部点击对应子项的评选说明
            load_demo.loadWapTxt(code);
            list_code = $(this).data("code");

            //加载wap投票排行
            load_demo.wapRankResult(code);
        });

        $("#rankbox").on("click", "label", function() {
            var count = 0
            if ($("#rankbox input:checked").length > 3) {
                alert("最多只能选择三项！");
                $("input", this).attr("checked", false);
            }
        })

        //wap投票
        $("#ranks-table").on("click", "li", function() {
            if ($(this).hasClass("current")) {
                $(this).removeClass("current");
            } else {
                $(this).addClass("current");
            }
            if ($("#ranks-table .current").length > 3) {
                $(window).scrollTop($('body').height())
                $("#show_message").addClass("show_img3").show();
                $(this).removeClass("current");
                $(".lock").show();
            }

        });
        $(".sure").on("click", function() {
            $("#show_message").removeClass();
            if ($("#ranks-table .current").length > 3) {
                $(window).scrollTop($('body').height());
                $(this).removeClass("current");
                $("#show_message").addClass("show_img3").show();
                $(".lock").show();
                return false;
            } else if (!$("#ranks-table li").hasClass("current")) {
                $("#show_message").addClass("show_img2").show();
                $(".lock").show();
                return false;
            } else {
                if ($("#ranks-table li").hasClass("current")) {
                    var wap_vote = [];
                    $("#ranks-table .current").each(function(i) {
                        wap_vote.push($(this).attr("data-code"));
                    });
                    load_demo.wapVoteSend(wap_vote);
                } else {
                    $(".lock,.show_info").show().click(function() {
                        $(".lock,.show_info").hide();
                    });
                }

            }
        })

    },

    //加载一层菜单
    loadMenu1: function() {
        var menu1 = $("#rank-kg");
        menu1.html("");
        var c = 0;
        var index = 0;
        $.each(fybdata, function(i, item) {
            var li = $('<li data-code=' + item.code + '><a href="javascript:void(0)">' + item.name.replace("业", "") + '评选</a></li>');
            menu1.append(li);
            if (item.Items[ccode]) {
                index = c;
            }
            c++;
        });
        $("#rank-kg li").eq(index).click();
    },

    //加载二层菜单
    loadMenu2: function(code) {
        var data = fybdata[code].Items;
        if (data == undefined)
            return;
        var menu2 = $("#rank-cg");
        $("#cgtype").text(fybdata[code].name + "评选");
        menu2.html("");
        var c = 0;
        var index = 0;
        $.each(data, function(i, item) {
            //if ($("#rankbox").length > 0 || item.max1 != 0) {
            var li = $('<li data-code=' + item.code + '><a href="javascript:void(0)">' + item.name + '</a></li>');
            menu2.append(li);
            if (ccode == item.code) {
                index = c;
            }
            c++;
            //}
        })
        $("#rank-cg li").eq(index).click();
    },

    //wap加载头部
    loadWap: function() {
        var menu = $("#tabs-wap");
        menu.html("");
        var c = 0;
        var index = 0;
        $.each(fybdata, function(i, item) {
            if (item.type == 1) {
                var li = $('<li data-code=' + item.code + '><a href="javascript:void(0)">' + item.name + '</a></li>');
                menu.append(li);
                if (item.Items[ccode]) {
                    index = c;
                }
                c++;
            }
        });
        $("#tabs-wap li").eq(index).click();
    },

    //wap加载头部对应子项
    loadWapList: function(code) {
        var data = fybdata[code].Items;
        if (data == undefined)
            return;
        var menu2 = $("#tabs-list");
        menu2.html("");
        var c = 0;
        var index = 0;
        $.each(data, function(i, item) {
            var li = $('<li data-code=' + item.code + '><a href="javascript:void(0)">' + item.name + '</a></li>');
            menu2.append(li);
            if (ccode == item.code) {
                index = c;
            }
            c++;
        });
        $("#tabs-list li").eq(index).click();
    },

    //wap加载子项对应的投票
    loadWapRank: function(code) {
        if (list_code == code) {
            return false;
        }
        var data, bigdata;
        var icon = 1;
        $.each(fybdata, function(i, item) {
            if (item.Items[code]) {
                data = item.Items[code];
                bigdata = item;
                return false;
            }
        })
        var ranks_table = $("#ranks-table");
        if (ranks_table.length > 0) {
            ranks_table.html("");
            if (data.max1 != 0) {
                $.each(data.Items, function(i, item) {
                    ranks_table.append("<li  data-code=" + item.code + "><em>" + icon + "</em><p>" + item.name + "</p><p class='ps'><span>得票率:</span><span>" + item.num + "</span></p><a href='javascript:void(0)'></a></li>");
                    icon++;
                });
                $(".bottom").show();
                $("#pximg").attr("src", "images/px.jpg");
            } else {
                $.each(data.Items, function(i, item) {
                    ranks_table.append("<li class='minli'><p>" + item.name + "</p></li>");
                });
                $(".bottom").hide();
                $("#pximg").attr("src", "images/px1.jpg");
            }
        }
        $("#ranks-table li").each(function() {

            if ($(this).children("p").not(".ps").text().length > 19) {
                $(this).children("p").not(".ps").css("margin-top", "0rem");
            }

        })
        var stitle = "2017东方财富风云榜-" + data.name + "评选网络投票结果出炉，究竟花落谁家？";
        emH5.Share({
            title: stitle,
            desc: "2017东方财富风云榜评选网络投票结果公示！",
            link: "http://fyb.eastmoney.com/2017/h5/vote.aspx?code=" + data.code,
            imgUrl: "http://fyb.eastmoney.com/2017/h5/images/share/" + bigdata.code + ".jpg"
        });

    },

    //wap投票绑定
    wapVote: function(code) {
        var data, bigdata;
        $.each(fybdata, function(i, item) {
            if (item.Items[code]) {
                data = item.Items[code];
                bigdata = item;
                return false;
            }
        })
        var ranks_table = $("#ranks-table");
        if (ranks_table.length > 0) {
            ranks_table.html("");
            $.each(data.Items, function(i, item) {
                ranks_table.append("<li><p>" + item.name + "</p><p class='ps'>" + item.num + "</p><a href='javascript:void(0)' class='ic-1' data-code=" + item.code + "></a></li>");
            })
        }

    },

    //wap对应的评选规则
    loadWapTxt: function(code) {
        if (list_code == code) {
            return false;
        }
        var tabs_txt = $("#tabs_txt");
        tabs_txt.html("");
        var data = "";
        $.each(fybdata, function(i, item) {
            if (item.Items[code]) {
                data = item.Items[code];
                return false;
            }
        });

        if (data.dec.indexOf("<br/>") != -1) {
            data.dec = data.dec.split("<br/>");
        }
        if (typeof data.dec == "string") {
            tabs_txt.append("<span>" + data.dec + "</span>")
        } else {
            for (var i = 0; i < data.dec.length; i++) {

                tabs_txt.append("<span>" + data.dec[i] + "</span>")
            }
        }

    },

    //加载参加单位或排行
    loadvote: function(code) {
        var data, bigdata;
        $.each(fybdata, function(i, item) {
            if (item.Items[code]) {
                data = item.Items[code];
                bigdata = item;
                return false;
            }
        })
        var rankbox = $("#rankbox");

        if (rankbox.length > 0) {
            showtype = data.code;
            $("#explaindata").html(data.dec);
            $("#decdata").html(bigdata.dec);
            rankbox.html("");
            if (data.max1 != 0) {
                $(".hidebox").show();
                $("#itemtip").html("（最多只能选择三项）");
                $.each(data.Items, function(i, item) {
                    rankbox.append($('<label><input type="checkbox" value="' + item.code + '" /><span>' + item.name + '</span></label>'));
                })
            } else {
                $(".hidebox").hide();
                $("#itemtip").html("（以上均为产品候选名单，将根据评选标准决定最终获奖名单。）");
                $.each(data.Items, function(i, item) {
                    rankbox.append($('<label><span>' + item.name + '</span></label>'));
                })

            }
        } else {
            var ranktable = $("#rank-table");
            showtype = data.code;
            $("#explaindata").html(data.dec);
            $("#decdata").html(bigdata.dec);
            ranktable.html("");
            var _html = "<table>";
            var index = 1;
            $.each(data.Items, function(i, item) {
                //if (code == "0215" || code == "0216") {
                if (false) {
                    _html += '<tr class="' + (index % 2 == 0 ? "bg1" : "") + '"><td></td><td>' + item.name + '</td><td class="ztxt"></td></tr>';
                    index++;
                    $("#jstips").html("以下均为候选产品，获奖产品将根据评选标准产生，最终获奖名单将不晚于2017年1月3日揭晓，敬请期待。")
                } else {
                    _html += '<tr class="' + (index % 2 == 0 ? "bg1" : "") + '"><td>' + index + '</td><td>' + item.name + '</td><td class="ztxt">' + item.num + '</td></tr>';
                    index++;
                }
            })
            _html += "</table>"
            ranktable.html(_html);
        }
    },

    //投票
    vote: function() {
        var phone = $("#phone").val();
        var yzm = $("#yzm").val();
        if (phone == "") {
            alert("请填写手机号码！");
        } else if (yzm == "") {
            alert("请填写图片验证码！");
        } else if (!/1\d{10}/.test(phone)) {
            alert("手机号码格式错误！");
        } else if (!/\d{4}/.test(yzm)) {
            alert("图片验证码错误！");
        } else {
            var votes = [];
            $("#rankbox input:checked").each(function(i, v) {
                votes.push($(v).val());
            })
            if (votes.length == 0) {
                alert("请选择选项！");
            } else if (votes.length > 3) {
                alert("最多只能选择三项！");
            } else {

                common.ajax({
                    type: "Vote",
                    data: {
                        type: showtype,
                        uid: phone,
                        email: $("#email").val(),
                        codes: votes.join(','),
                        yzm: yzm
                    },
                    success: function(data, m) {
                        $("#rankbox input").attr("checked", false);
                        $("#phone").val("");
                        $("#yzm").val("");
                        $("#email").val("");
                        alert(m);
                    },
                    complete: function() {
                        $('#imgPVCode').attr('src', domain + 'YZM?rnd=' + ((new Date()).getTime()));
                    }
                });
            }
        }
    },

    //wap投票
    wapVoteSend: function(code) {
        var typeCode = "";
        var typeName = "";
        $("#tabs-list li").each(function() {
            if ($(this).hasClass("current")) {
                typeCode = $(this).attr("data-code");
            }
        });
        $("#show_message").removeClass();
        common.ajax({
            type: "Vote",
            data: {
                type: typeCode,
                uid: wap_uid,
                codes: code.join(','),
                yzm: wap_yzm
            },
            success: function(data, m) {
                $("#ranks-table li").removeClass("current");
                $("#show_message").addClass("show_img1").show();
                $(".lock").show();
            },
            complete: function() {
            },
            error: function(result, message) {
                if (result == -3) {
                    $("#show_message").addClass("show_img4").show();
                    $(".lock").show();
                } else if (result == -4) {
                    $("#show_message").addClass("show_img3").show();
                    $(".lock").show();
                }
            }

        });
    },

    //wap投票结果
    wapRankResult: function(code) {
        var data, bigdata, numbers;
        numbers = 0;
        $("#result-rank").html("");
        $.each(fybdata, function(i, item) {
            if (item.Items[code]) {
                data = item.Items[code];
                bigdata = item;
                return false;
            }
        });
        $.each(data.Items, function(i, item) {
            numbers++;
            if (numbers > 10) {
                return false;
            } else {
                //if (code == "0215" || code == "0216" || code == "0306" || code=="0801") {
                if (false) {
                    $("#tpname").html("候选产品");
                    $("#rtitle").hide();
                    $("#result-rank").append("<li class='clear'><p>将不晚于2017年1月3日全面揭晓，<br />敬请期待！</p></li>");
                    return false;
                } else {
                    $("#rtitle").show();
                    $("#tpname").html("投票结果");
                    $("#result-rank").append("<li class='clear'><span class='rank-sort'>" + numbers + "</span><span class='rank-name'>" + item.name + "</span></li>");
                }
            }
        });
    },
    //首页设置
    setHomepage: function(url) {
        $("#sethomepage").on("click", function() {
            try {
                this.style.behavior = "url(#default#homepage)",
                this.setHomePage(url)
            } catch (t) {
                if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
                    } catch (t) {
                        window.open("http://emres.dfcfw.com/setindex/select.html")
                    }
                    var e = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
                    e.setCharPref("browser.startup.homepage", url)
                } else
                    window.open("http://emres.dfcfw.com/setindex/select.html")
            }
            return !1
        });

    },

    //收藏设置
    addFav: function(url) {
        $("#addfavlink").on("click", function() {
            try {
                window.external.addFavorite(url, '东方财富网')
            } catch (t) {
                try {
                    window.sidebar.addPanel('东方财富网', url, "")
                } catch (t) {
                    var e = navigator.userAgent.toLowerCase();
                    e.indexOf("ipad") >= 0 || e.indexOf("iphone") >= 0 || e.indexOf("android") >= 0 ? alert("加入收藏失败，请使用浏览器的“添加书签”功能") : alert("加入收藏失败，请使用Ctrl+D进行添加")
                }
            }
            return !1
        })
    },

    //首页侧边滚动
    indexScroll: function() {
        $(window).scroll(function() {
            if ($(window).scrollTop() > 700) {
                $("#langke_fixed").stop(true, false).animate({
                    top: $(window).scrollTop()
                }, 600)
            }
        });
    },
    //初始化
    _init: function(status) {
        if (status == "wap") {
            load_demo.loadevent();
            load_demo.loadWap();
        } else {
            load_demo.loadevent();
            load_demo.loadMenu1();
            load_demo.setHomepage('http://www.eastmoney.com');
            load_demo.addFav('http://www.eastmoney.com');
            load_demo.indexScroll();
        }

    }
}
