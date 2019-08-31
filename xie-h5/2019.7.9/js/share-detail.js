/**
 * Created by GIISO on 2019/7/17.
 */
function getRootPath_dc() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    if (webName == "") {
        return window.location.protocol + '//' + window.location.host;
    }
    else {
        return window.location.protocol + '//' + window.location.host + '/' + webName;
    }
}


//获取传过来的值
function getParamer(paramer) {

    var url = window.location.href.split("?")[1];
    /*获取url里"?"后面的值*/
    if (url.indexOf("&") > 0) {                                      /*判断是否是一个参数还是多个参数*/
        urlParamArry = url.split("&");
        /*分开每个参数，并放到数组里*/
        for (var i = 0; i < urlParamArry.length; i++) {
            var paramerName = urlParamArry[i].split("=");
            /*把每个参数名和值分开，并放到数组里*/
            if (paramer == paramerName[0]) {                     /*匹配输入的参数和数组循环出来的参数是否一样*/
                return paramerName[1];
                /*返回想要的参数值*/
            }
        }
    } else {                                                              /*判断只有个参数*/
        var paramerValue = url.split("=")[1];
        return paramerValue;
    }

}
/**
 * js截取字符串，中英文都能用
 * @param str：需要截取的字符串
 * @param len: 需要截取的长度
 */
function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("......");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
}

try {
    var jcompanykey;
    var jpersonid;
    var jpersonname;
    var jindex;

    var isWeixn;
    var isAndroid;
    var isiOS;
    var timer;
    var entid;
    jcompanykey = '9ab70a65890b7519388413097b3397c0';

    $(function () {
        var cardid = getParamer("cardid");//名片id
        entid = getParamer("id");//企业id

        var u = navigator.userAgent, app = navigator.appVersion;
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);    //ios终端
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {  //判断微信内置浏览器
            isWeixn = true;
        } else {
            isWeixn = false;
        }

        if (isAndroid) {
            var jumpUrl;
            if (cardid != null && cardid != "" && cardid != "undefined" && cardid != 0) {
                if (jcompanykey) {
                    jumpUrl = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                } else if (jpersonid) {
                    jumpUrl = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                } else {
                    jumpUrl = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                }
            }
            else {
                if (jcompanykey) {
                    jumpUrl = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                } else if (jpersonid) {
                    jumpUrl = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                } else {
                    jumpUrl = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                }
            }

            $('.appBtn').attr('href', jumpUrl);
        }
        firstJump();
    })


    function firstJump() {
        var cardid = getParamer("cardid");//名片id
        if (cardid != null && cardid != "" && cardid != "undefined" && cardid != 0) {
            if (jcompanykey) {
                if (isAndroid) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                } else if (isiOS) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                }
            } else if (jpersonid) {
                if (isAndroid) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                } else if (isiOS) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                }
            } else if (jindex) {
                if (isAndroid) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                } else if (isiOS) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=2&data=' + cardid;
                }
            }
        } else {
            if (jcompanykey) {
                if (isAndroid) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                } else if (isiOS) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                }
            } else if (jpersonid) {
                if (isAndroid) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                } else if (isiOS) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                }
            } else if (jindex) {
                if (isAndroid) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                } else if (isiOS) {
                    window.location.href = 'myqslapp://com.good.companygroup?type=1&data=' + entid;
                }
            }

        }

    }

    function openApp() {
        if (isWeixn) {
            alert('请点击右上角,选择在浏览器中打开.');
        } else {
            if (isiOS) {

                var hasApp = true, t = 1000;

                timer = setTimeout(function () {

                    if (!hasApp) {

                        //没有安装app
                        var r = confirm("您没有安装企示录APP，请先安装企示录APP!");
                        if (r == true) {
                            window.location.href = "http://www.myqsl.cn/MM2/andios/myh5.html";//在指定时间内没有拉起APP，可以判断：用户没有安装app,直接跳转到H5下载页面
                            //window.location.href = "https://itunes.apple.com/cn/app/%E4%BC%81%E7%A4%BA%E5%BD%95/id1367096301?mt=8";
                        }

                    }
                }, 2000);
                var t1 = Date.now();
                setTimeout(function () {    //t的时间就是触发APP启动的时间，若APP启动了，再次返回页面时t2这行代码执行，hasApp即为true。反之若APP没有启动即为false

                    var t2 = Date.now();
                    hasApp = !(!t1 || t2 - t1 < t + 150);
                }, t);

            } else if (isAndroid) {
                var hasApp = true, t = 1000;

                timer = setTimeout(function () {

                    if (!hasApp) {

                        //没有安装app
                        var r = confirm("您没有安装企示录APP，请先安装企示录APP!");
                        if (r == true) {
                            window.location.href = "http://www.myqsl.cn/MM2/andios/myh5.html";//在指定时间内没有拉起APP，可以判断：用户没有安装app,直接跳转到H5下载页面
                        }

                    }
                }, 2000);
                var t1 = Date.now();
                setTimeout(function () {    //t的时间就是触发APP启动的时间，若APP启动了，再次返回页面时t2这行代码执行，hasApp即为true。反之若APP没有启动即为false

                    var t2 = Date.now();
                    hasApp = !(!t1 || t2 - t1 < t + 150);
                }, t);
            }
        }
    }

    $(document).on('visibilitychange webkitvisibilitychange', function () {
        var tag = document.hidden || document.webkitHidden;
        if (tag) {
            clearTimeout(timer);
        }
    })

    $(window).on('pagehide', function () {
        clearTimeout(timer);
    })

    function openEntInfo() {
        if (isWeixn) {
            alert('请点击右上角,选择在浏览器中打开.');
        } else {
            location.href = "http://www.myqsl.cn/MM2/h5/entdetail.html?id=" + entid;
        }
    }

} catch (e) {

}


(function () {
    var customerid = getParamer("customerid");   //获取html页面传值
    var cardid = getParamer("cardid");                  //获取html页面传值
    var entid = getParamer("id"); //企业的id

    var path = getRootPath_dc();
    if (location.hostname == "172.16.1.27" || location.hostname == "172.20.10.5" || location.hostname == "localhost") {
        path = 'http://' + location.hostname + ':8090/MM2';
    }

    if (cardid && cardid != 'undefined') {
        $.ajax({
            type: 'post',
            url: path + '/register/queryBusinessCardByIdH5.json',
            dataType: 'json',
            data: JSON.stringify({
                "cardid": cardid
            }), // Request body
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $("#name").html(response.name);
                $("#post").html(response.title);
                $("#mobile").html(response.mobile);
                $("#entname").html(response.companyname);
                $("#entEmail").html(response.email);
                $("#web").html(response.website);
                $("#location").html(response.address);
                $("#imageId").attr("src", path + "/img/" + response.spare1).show();//企业LOGO
                $("#carimg").attr("src", path + "/cardimg/" + response.carimg).show();
                $('#section-card').show();
                $('#loading').hide();
            }, error: function () {
                $('#loading').hide();
            }
        });

    }


    if (entid && entid != 'undefined') {
        $("#ent-detail-url").attr('href', 'entdetail.html?id=' + entid + '&customerid=' + customerid);

        $.ajax({
            type: 'post',
            url: path + '/register/queryEntDetailByIdH5.json',
            dataType: 'json',

            data: JSON.stringify({
                "id": entid
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $("#entname").html(response.entName);
                $("#entEmail").html(response.entEmail);
                $("#web").html(response.entWebsite);
                $("#location").html(response.entAddress);

                $("#imageId").attr("src", path + "/img/" + response.picPath1).show();//企业LOGO
                if (response.entDesc) {
                    $("#summary").html(response.entDesc);
                    $('#section-summary').show();
                }

                if (response.entContact) $("#entdetail-logo").css('background-image', 'url("' + path + "/img/" + response.picPath1 + '")');

                if (response.entContact) $("#entContact").html(response.entContact).show();
                if (response.entPhone) $("#entPhone").html(response.entPhone).parent().show().attr('href', 'tel:' + response.entPhone);
                // if(response.entEmail) $("#entEmail").html(response.entEmail).parent().show();
                if (response.entWebsite) {
                    $("#entWebsite").html(response.entWebsite).parent().show();
                    if (response.websiteflag == 1) $("#entWebsite").parent().attr('href', response.entWebsite);
                }
                if (response.entAddress) $("#entAddress").html(response.entAddress).parent().show();
                $("#section-info").show();

                $('#loading').hide();
            }, error: function () {
                $('#loading').hide();
            }
        });
        $.ajax({
            type: 'post',
            url: path + '/register/getEntFileListH5.json',
            dataType: 'json',
            data: JSON.stringify({
                "entid": entid,
                filetype: '003'
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.code == 200 && data.data && data.data[0] && data.data[0].filetypeurl) {
                    $("#vr-iframe").attr("src", data.data[0].filetypeurl);
                }
            }
        })
        $.ajax({
            type: 'post',
            url: path + '/register/getEntFileListH5.json',
            dataType: 'json',
            data: JSON.stringify({
                "entid": entid,
                filetype: '001'
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.code == 200 && data.data && data.data[0] && data.data[0].filetypeurl) {
                    $("#video").attr({
                        "src": path + "/mv/" + data.data[0].filetypeurl,
                        "poster": path + "/img/" + data.data[0].filetypeimg
                    });
                    $('#section-video').show();
                }
            }
        })
    }else {
        $('#loading').hide();
    }


})();