// var apiHost = "http://api.giiso.ai/openapi";
// var apiHost = "http://172.16.33.4:8081/open-portal";
var apiHost = "/open-portal";

$(".giiso").click(function () {
    window.open("http://www.giiso.com/")
})

//QQ对话
$("div.qq").click(function () {
    window.open("http://wpa.qq.com/msgrd?v=3&uin=2020601975&site=在线客服&menu=yes")
})

$("#use-btn").click(function () {
    $("#apply-tel").val('')
    $("#apply-username").val('')
    $("#trial-function").val('')
    $("#apply-company").val('')
    $("#user-post").val('')
    $("#use .form-row span").hide();
    $("#use").show();
})

$("#use .close").click(function () {
    $("#use").hide();
})

$("#apply_success .close").click(function () {
    $("#apply_success").hide();
})

//百度统计
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?c75284ab5239ce712b1960388318069a";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

$(".register").click(function () {
    registerFormReset();
    $("#register").show();
    $("#btn_reset").hide();
    $("#login").hide();
    $("#btn_register").show();
    $(".checkbox").show();
    $("#register h3").eq(0).show();
    $("#register h3").eq(1).hide();
    getImgCheckCode();
})

$("#register .close").click(function () {
    $("#register").hide();
})

$(".reset").click(function () {
    registerFormReset();
    $("#register").show();
    $("#btn_reset").show();
    $("#login").hide();
    $("#btn_register").hide();
    $(".checkbox").hide();
    $("#register h3").eq(1).show();
    $("#register h3").eq(0).hide();
    $("#register .help").show();
    getImgCheckCode();
})

$(".login").click(function () {
    loginFormReset();
    $("#login").show();
    $("#login .faild").hide();
})

$("#login .close").click(function () {
    $("#login").hide();
})

$("#pc-header .header-inner .product-service").mouseover(function () {
    $("#pc-header").removeClass("header");
    $("#pc-header").addClass("header-white");
})
// $("#pc-header .header-inner .document-center").mouseover(function () {
//     $("#pc-header").removeClass("header");
//     $("#pc-header").addClass("header-white");
// })

$("#pc-header .header-inner .product-service").mouseout(function () {
    var hh = $(document).scrollTop();
    if (hh >= 180) {
        $("#pc-header").removeClass("header");
        $("#pc-header").addClass("header-white");
    } else {
        $("#pc-header").removeClass("header-white");
        $("#pc-header").addClass("header");
    }
})
// $("#pc-header .header-inner .document-center").mouseout(function () {
//     var hh = $(document).scrollTop();
//     if (hh >= 180) {
//         $("#pc-header").removeClass("header");
//         $("#pc-header").addClass("header-white");
//     } else {
//         $("#pc-header").removeClass("header-white");
//         $("#pc-header").addClass("header");
//     }
// })

$("#close").click(function () {
    $("#nav").hide();
})

$("#open").on("click", function (e) {
    $("#nav").show();

    $(document).one("click", function () {
        $("#nav").hide();
    });

    e.stopPropagation();
});
$("#nav").on("click", function (e) {
    e.stopPropagation();
});

function getScrollTop() {
    var hh = $(document).scrollTop();
    if (hh >= 55) {
        $("#pc-header").removeClass("header");
        $("#mobile-header").removeClass("header");
        $("#pc-header").addClass("header-white");
        $("#mobile-header").addClass("header-white");
    } else {
        $("#pc-header").removeClass("header-white");
        $("#mobile-header").removeClass("header-white");
        $("#pc-header").addClass("header");
        $("#mobile-header").addClass("header");
    }

}
getScrollTop();


$(function () {
    $('#register_img_check_code').attr("maxlength", "4")
    $('#register_tel_check_code').attr("maxlength", "6")
    $(document).on("scroll", function () {
        getScrollTop();
    });
})


// 注册模块注册模块注册模块注册模块注册模块注册模块注册模块注册模块注册模块注册模块注册模块注册模块注册模块注册模块

//手机号验证
$("#register_tel").on("input", function () {
    if ($("#register_tel").val() == "" || $("#register_tel").val() == undefined) {
        $(this).parent().find("span").eq(0).fadeIn();
        $(this).parent().find("span").eq(1).hide();
    } else if (!(/^1[34578]\d{9}$/.test($("#register_tel").val()))) {
        $(this).parent().find("span").eq(1).fadeIn();
        $(this).parent().find("span").eq(0).hide();
    } else {
        $(this).parent().find("span").fadeOut();
    }
})
//图形验证码验证
$("#register_img_check_code").on("input", function () {
    var self = this
    if ($("#register_img_check_code").val() == "" || $("#register_img_check_code").val() == undefined) {
        $(self).parent().find("span").eq(0).fadeIn();
    } else {
        $(self).parent().find("span").eq(0).fadeOut();
    }
    //图形验证码异步校验
    if ($("#register_img_check_code").val().length == 4) {
        $.ajax({
            url: apiHost + "/common/checkCode",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                vcode: $("#register_img_check_code").val().toUpperCase(),
            },
            success: function (data) {
                if (data.code == 0) {
                    if (data.data.isOk == true) {
                        $(".register_tel_check_code").removeAttr("disabled")
                        $(self).parent().find("span").eq(1).fadeOut();
                    } else {
                        getImgCheckCode();
                        $(self).parent().find("span").eq(1).fadeIn();
                    }
                }
            }
        })
    }
})
//手机验证码验证
$("#register_tel_check_code").on("input", function () {
    if ($("#register_tel_check_code").val() == "" || $("#register_tel_check_code").val() == undefined) {
        $(this).parent().find("span").fadeIn();
    } else {
        $(this).parent().find("span").fadeOut();
    }
})
//密码验证
$("#register_password").on("input", function () {
    if ($("#register_password").val() == "" || $("#register_password").val() == undefined) {
        $(this).parent().find("span").eq(0).fadeIn();
        $(this).parent().find("span").eq(1).hide();
    } else if ($("#register_password").val().length < 6) {
        $(this).parent().find("span").eq(1).fadeIn();
        $(this).parent().find("span").eq(0).hide();
    } else {
        $(this).parent().find("span").fadeOut();
    }
    if ($("#register_confirm_password").val() != $("#register_password").val()) {
        $("#register_confirm_password").parent().find("span").fadeIn();
    }
})
//确认密码验证
$("#register_confirm_password").on("input", function () {
    if ($("#register_confirm_password").val() != $("#register_password").val()) {
        $(this).parent().find("span").fadeIn();
    } else {
        $(this).parent().find("span").fadeOut();
    }
})
//是否同意服务条款
$("#register_terms_service").on("change", function () {
    if ($(this).is(":checked")) {
        $("#btn_register").removeAttr("disabled")
    } else {
        $("#btn_register").attr("disabled", "disabled");
    }
})

//表单重置
function registerFormReset() {
    $("#register_tel").val("")
    $("#register_img_check_code").val("")
    $("#register_tel_check_code").val("")
    $("#register_password").val("")
    $("#register_confirm_password").val("")
    $("#register .form-row span").hide();
}

function loginFormReset() {
    $("#login_tel").val("")
    $("#login_password").val("")
}

// 点击注册
function register() {
    if ($("#register_tel").val() == "" || $("#register_tel").val() == undefined) {
        $("#register_tel").parent().find("span").eq(0).fadeIn();
        $("#register_tel").parent().find("span").eq(1).hide();
        return;
    } else if (!(/^1[34578]\d{9}$/.test($("#register_tel").val()))) {
        $("#register_tel").parent().find("span").eq(1).fadeIn();
        $("#register_tel").parent().find("span").eq(0).hide();
        return;
    } else if ($("#register_img_check_code").val() == "" || $("#register_img_check_code").val() == undefined) {
        $("#register_img_check_code").parent().find("span").fadeIn();
        return;
    } else if ($("#register_tel_check_code").val() == "" || $("#register_tel_check_code").val() == undefined) {
        $("#register_tel_check_code").parent().find("span").fadeIn();
        return;
    } else if ($("#register_password").val() == "" || $("#register_password").val() == undefined) {
        $("#register_password").parent().find("span").eq(0).fadeIn();
        $("#register_password").parent().find("span").eq(1).hide();
        return;
    } else if ($("#register_password").val().length < 6) {
        $("#register_password").parent().find("span").eq(1).fadeIn();
        $("#register_password").parent().find("span").eq(0).hide();
        return;
    } else if ($("#register_confirm_password").val() != $("#register_password").val()) {
        $("#register_confirm_password").parent().find("span").fadeIn()
        return;
    } else {
        $.ajax({
            url: apiHost + "/auth/regist/mobile",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                mobile: $("#register_tel").val(),
                password: MD5($("#register_password").val()),
                vcode: $("#register_tel_check_code").val(),
            },
            success: function (data) {
                if (data.code == 0) {
                    $("#login").show();
                    $("#register").hide()
                } else {
                    $("#register_error").show();
                }
            }
        })
    }
}

// 密码重置
function reset() {
    if ($("#register_tel").val() == "" || $("#register_tel").val() == undefined) {
        $("#register_tel").parent().find("span").eq(0).fadeIn();
        $("#register_tel").parent().find("span").eq(1).hide();
        return;
    } else if (!(/^1[34578]\d{9}$/.test($("#register_tel").val()))) {
        $("#register_tel").parent().find("span").eq(1).fadeIn();
        $("#register_tel").parent().find("span").eq(0).hide();
        return;
    } else if ($("#register_img_check_code").val() == "" || $("#register_img_check_code").val() == undefined) {
        $("#register_img_check_code").parent().find("span").fadeIn();
        return;
    } else if ($("#register_tel_check_code").val() == "" || $("#register_tel_check_code").val() == undefined) {
        $("#register_tel_check_code").parent().find("span").fadeIn();
        return;
    } else if ($("#register_password").val() == "" || $("#register_password").val() == undefined) {
        $("#register_password").parent().find("span").eq(0).fadeIn();
        $("#register_password").parent().find("span").eq(1).hide();
        return;
    } else if ($("#register_password").val().length < 6) {
        $("#register_password").parent().find("span").eq(1).fadeIn();
        $("#register_password").parent().find("span").eq(0).hide();
        return;
    } else if ($("#register_confirm_password").val() != $("#register_password").val()) {
        $("#register_confirm_password").parent().find("span").fadeIn()
        return;
    } else {
        $.ajax({
            url: apiHost + "/common/findPassword",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                mobile: $("#register_tel").val(),
                password: MD5($("#register_password").val()),
                vcode: $("#register_tel_check_code").val(),
            },
            success: function (data) {
                if (data.code == 0) {
                    $("#register").hide();
                    $("#login_resiter").show();
                    $("#user_info").hide();

                } else {
                    $("#register_error").text(data.msg);
                    $("#register_error").show();
                }
            }
        })
    }
}

//获取图形验证码
function getImgCheckCode() {
    $.ajax({
        url: apiHost + "/common/getVerifyCode",
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {},
        success: function (data) {
            $(".register_img_check_code").attr("src", "data:image/png;base64," + data.data)
        }
    })
}

//获取手机验证码
function getTelCheckCode() {
    var count = 60;

    function CountDown() {
        $(".register_tel_check_code").attr("disabled", "true");
        $(".register_tel_check_code").text(count + "s");
        if (count == 0) {
            $(".register_tel_check_code").text("发送").removeAttr("disabled");
            clearInterval(countdown);
        }
        count--;
    }

    CountDown();
    var countdown = setInterval(CountDown, 1000);

    $.ajax({
        url: apiHost + "/auth/getCode",
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {
            mobile: $("#register_tel").val(),
        },
        success: function (data) {
        }
    })

}


// 登录模块登录模块登录模块登录模块登录模块登录模块登录模块登录模块登录模块登录模块登录模块登录模块登录模块登录模块

//手机号验证
$("#login_tel").on("input", function () {
    if ($("#login_tel").val() == "" || $("#login_tel").val() == undefined) {
        $(this).parent().find("span").eq(0).fadeIn();
        $(this).parent().find("span").eq(1).hide();
    } else if (!(/^1[34578]\d{9}$/.test($("#login_tel").val()))) {
        $(this).parent().find("span").eq(1).fadeIn();
        $(this).parent().find("span").eq(0).hide();
    } else {
        $(this).parent().find("span").fadeOut();
    }
})

//密码验证
$("#login_password").on("input", function () {
    if ($("#login_password").val() == "" || $("#login_password").val() == undefined) {
        $(this).parent().find("span").eq(0).fadeIn();
        $(this).parent().find("span").eq(1).hide();
    } else if ($("#login_password").val().length < 6) {
        $(this).parent().find("span").eq(1).fadeIn();
        $(this).parent().find("span").eq(0).hide();
    } else {
        $(this).parent().find("span").fadeOut();
    }
})

//登录
function login(params) {
    if ($("#login_tel").val() == "" || $("#login_tel").val() == undefined) {
        $("#login_tel").parent().find("span").eq(0).fadeIn();
        $("#login_tel").parent().find("span").eq(1).hide();
        return;
    } else if (!(/^1[34578]\d{9}$/.test($("#login_tel").val()))) {
        $("#login_tel").parent().find("span").eq(1).fadeIn();
        $("#login_tel").parent().find("span").eq(0).hide();
        return;
    } else if ($("#login_password").val() == "" || $("#login_password").val() == undefined) {
        $("#login_password").parent().find("span").eq(0).fadeIn();
        $("#login_password").parent().find("span").eq(1).hide();
        return;
    } else if ($("#login_password").val().length < 6) {
        $("#login_password").parent().find("span").eq(1).fadeIn();
        $("#login_password").parent().find("span").eq(0).hide();
        return;
    } else {
        var data;
        if (params) {
            data = params;
        } else {
            data = {
                username: $("#login_tel").val(),
                pwd: MD5($("#login_password").val()),
            }
        }
        $.ajax({
            url: apiHost + "/auth/login",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: data,
            success: function (res) {
                if (res.code == 0) {
                    if (res.data == true) {
                        getUserInfo();
                        $("#login .faild").hide();
                        window.open("/shop-mgr-build/index.html")
                    } else {
                        $("#login .faild").show();
                    }
                }
            }
        })
    }
}

//退出登录
$("#user_info .login_out").click(function () {
    $.ajax({
        url: apiHost + "/auth/logout",
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {},
        success: function (res) {
            if (res.code == 0) {
                $("#login_resiter").show();
                $("#user_info").hide();
            }
        }
    })
})

$("#user_info .user_info").click(function () {
    window.open("/shop-mgr-build/index.html")
})

//获取用户详情信息
function getUserInfo() {
    $.ajax({
        url: apiHost + "/member/detail",
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {},
        success: function (data) {
            if (data.code == 0) {
                $("#login_resiter").hide();
                $("#user_info").show();
                $("#login").hide();
                $("#register").hide();
            }
        }
    })
}

//页面刷新，自动获取用户信息，显示是否登录
getUserInfo();

//申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用

//手机号验证
$("#apply-tel").on("input", function () {
    if ($("#apply-tel").val() == "" || $("#apply-tel").val() == undefined) {
        $(this).parent().find("span").eq(0).fadeIn();
        $(this).parent().find("span").eq(1).hide();
    } else if (!(/^1[34578]\d{9}$/.test($("#apply-tel").val()))) {
        $(this).parent().find("span").eq(1).fadeIn();
        $(this).parent().find("span").eq(0).hide();
    } else {
        $(this).parent().find("span").fadeOut();
    }
})

//用户姓名验证
$("#apply-username").on("input", function () {
    if ($("#apply-username").val() == "" || $("#apply-username").val() == undefined) {
        $(this).parent().find("span").fadeIn();
    } else {
        $(this).parent().find("span").fadeOut();
    }
})

//试用功能描述
$("#trial-function").on("input", function () {
    if ($("#trial-function").val() == "" || $("#trial-function").val() == undefined) {
        $(this).parent().find("span").fadeIn();
    } else {
        $(this).parent().find("span").fadeOut();
    }
})

//试用申请
function useApply() {
    if ($("#apply-tel").val() == "" || $("#apply-tel").val() == undefined) {
        $("#apply-tel").parent().find("span").eq(0).fadeIn();
        $("#apply-tel").parent().find("span").eq(1).hide();
        return;
    } else if (!(/^1[34578]\d{9}$/.test($("#apply-tel").val()))) {
        $("#apply-tel").parent().find("span").eq(1).fadeIn();
        $("#apply-tel").parent().find("span").eq(0).hide();
        return;
    } else if ($("#apply-username").val() == "" || $("#apply-username").val() == undefined) {
        $("#apply-username").parent().find("span").fadeIn();
        return;
    } else if ($("#trial-function").val() == "" || $("#trial-function").val() == undefined) {
        $("#trial-function").parent().find("span").fadeIn();
        return;
    } else {
        $.ajax({
            url: apiHost + "/common/trialApply",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                mobile: $("#apply-tel").val(),
                username: $("#apply-username").val(),
                remark: $("#trial-function").val(),
                company: $("#apply-company").val(),
                position: $("#user-post").val(),
            },
            success: function (res) {
                if (res.code == 0) {
                    $("#use").hide();
                    $("#apply_success").show();
                } else {
                    $("#use .faild").show();
                }
            }
        })
    }
}
