
var robotApiHost = "http://172.16.21.47:8889";
if(location.host != 'writer.giiso.com'){
    robotApiHost = "http://172.16.21.47:8889";
}


$(function () {
    $('#register_img_check_code').attr("maxlength", "4")
    $('#register_tel_check_code').attr("maxlength", "6")
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
    var self = this;

    if ($("#register_img_check_code").val() == "" || $("#register_img_check_code").val() == undefined) {
        $(self).parent().find("span").eq(0).fadeIn();
    } else {
        $(self).parent().find("span").eq(0).fadeOut();
    }
    //图形验证码异步校验
    if ($("#register_img_check_code").val().length == 4) {
        $.ajax({
            url: robotApiHost + "/common/checkCode.do",
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
                        $(".register_tel_check_code").removeAttr("disabled");
                        $(self).parent().find("span").eq(1).fadeOut();
                    } else {

                        getImgCheckCode();
                        $(self).parent().find("span").eq(1).fadeIn();
                    }
                }
            }
        })
    }else {
        $(self).parent().find("span").eq(1).fadeOut();
        $(".register_tel_check_code").attr("disabled","disabled");
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

//完善资料页面输入清空提示
$("#form2").find('input').on("input", function () {
    $(this).parent().find("span").hide();
});
$("#form2").find('textarea').on("input", function () {
    $(this).parent().find("span").hide();
});

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

//点击下一步
function clickNext(){
    if ($("#register_tel").val() == "" || $("#register_tel").val() == undefined) {
        $("#register_tel").parent().find("span").eq(0).fadeIn();
        $("#register_tel").parent().find("span").eq(1).hide();
        return;
    } else if (!(/^1[34578]\d{9}$/.test($("#register_tel").val()))) {
        $("#register_tel").parent().find("span").eq(1).fadeIn();
        $("#register_tel").parent().find("span").eq(0).hide();
        return;
    } else if ($("#register_img_check_code").val() == "" || $("#register_img_check_code").val() == undefined) {
        $("#register_img_check_code").parent().find("span").eq(0).fadeIn();
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
        $("#register_confirm_password").parent().find("span").fadeIn();
        return;
    } else {
        $.ajax({
            url: robotApiHost + "/auth/regist/verify.do",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                mobile: $("#register_tel").val(),
                vcode: $("#register_tel_check_code").val()
            },
            success: function (data) {
                if (data.code == 0) {
                    $('.model-step').find('.step').eq(1).addClass('active');
                    $('#form1').hide();
                    $('#form2').show();
                } else {
                    $("#register_error").html(data.msg).show();
                }
            }
        })
    }
}

// 点击注册
function register() {
    if ($("#register_tel").val() == "" || $("#register_tel").val() == undefined) {
        $("#register_error").html('手机号码不能为空').show();
        return;
    }else if ($("#register_password").val() == "" || $("#register_password").val() == undefined) {
        $("#register_error").html('密码不能为空').show();
        return;
    } else if ($("#register_name").val() == "" || $("#register_name").val() == undefined) {
        $("#register_name").parent().find("span").eq(0).fadeIn();
        return;
    } else if ($("#register_company").val() == "" || $("#register_company").val() == undefined) {
        $("#register_company").parent().find("span").eq(0).fadeIn();
        return;
    } else if ($("#register_post").val() == "" || $("#register_post").val() == undefined) {
        $("#register_post").parent().find("span").fadeIn();
        return;
    } else if ($("#register_require").val() == "" || $("#register_require").val() == undefined) {
        $("#register_require").parent().find("span").fadeIn();
        return;
    } else {
        $.ajax({
            url: robotApiHost + "/auth/regist/mobile.do",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                mobile: $("#register_tel").val(),
                password: MD5($("#register_password").val()),
                vcode: $("#register_tel_check_code").val(),
                name: $("#register_name").val(),
                company: $("#register_company").val(),
                position: $("#register_post").val(),
                request: $("#register_require").val(),
                information: $("#register_find").val(),
            },
            success: function (data) {
                if (data.code == 0) {
                    window.location.href='register-success.html';
                } else {
                    $("#register_error").html(data.msg).show();
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
        $("#register_img_check_code").parent().find("span").eq(0).fadeIn();
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
            url: robotApiHost + "/common/findPassword.do",
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
                    window.location.href='forget-password-success.html';

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
        url: robotApiHost + "/common/getVerifyCode.do",
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

    if ($("#register_tel").val() == "" || $("#register_tel").val() == undefined) {
        $("#register_tel").parent().find("span").eq(0).fadeIn();
        $("#register_tel").parent().find("span").eq(1).hide();
        return false;
    } else if (!(/^1[34578]\d{9}$/.test($("#register_tel").val()))) {
        $("#register_tel").parent().find("span").eq(1).fadeIn();
        $("#register_tel").parent().find("span").eq(0).hide();
        return false;
    } else {
        $("#register_tel").parent().find("span").fadeOut();
    }

    var count = 60;
    function CountDown() {
        $(".register_tel_check_code").attr("disabled", "true");
        $(".register_tel_check_code").text(count + "s");
        if (count == 0) {
            $(".register_tel_check_code").text("重新获取").removeAttr("disabled");
            clearInterval(countdown);
        }
        count--;
    }

    CountDown();
    var countdown = setInterval(CountDown, 1000);

    $.ajax({
        url: robotApiHost + "/auth/getCode.do",
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
            url: robotApiHost + "/auth/login.do",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: data,
            success: function (res) {
                if (res.code == '0') {
                    if (res.data == true) {
                        window.location.href="dist/index.html";
                    } else {
                        $("#login .faild").show();
                    }
                }
            }
        })
    }
}

