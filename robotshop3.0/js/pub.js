/**
 * Created by GIISO on 2017/11/25.
 */

/*用户信息登录模块~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var robotApiHost = "http://robot.giiso.com/open-portal";
if(location.host != 'robot.giiso.com'){
    robotApiHost = "http://172.16.33.4:8081/open-portal";
}

//退出登录
$("#user_info .login_out").click(function () {
    $.ajax({
        url: robotApiHost + "/auth/logout",
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {},
        success: function (res) {
            if (res.code == 0) {
                $("#login_resiter").show();
                $("#user_info").hide().find('.user_info').html('欢迎您，robot');
                $('#apply-use').attr('href','login.html');
            }
        }
    })
})

$("#user_info .user_info").click(function () {
    window.open("shop-mgr-build/index.html")
});

//获取用户详情信息
function getUserInfo() {
    $.ajax({
        url: robotApiHost + "/member/detail",
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {},
        success: function (data) {
            if (data.code == 0) {
                $("#login_resiter").hide();
                $("#user_info").show().find('.user_info').html('欢迎您，'+data.data.mobile);
                $('#apply-use').attr('href','shop-mgr-build/index.html');
            }
        }
    })
}
getUserInfo();

//QQ对话~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$("div.qq").click(function () {
    window.open("http://wpa.qq.com/msgrd?v=3&uin=2020601975&site=在线客服&menu=yes")
});

//百度统计
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?c75284ab5239ce712b1960388318069a";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?fc35f3c630ccbdad57baf00a2c0cb481";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();




/*wordpress数据接入模块~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//var apiHost = 'http://172.16.25.6/wordpress_robot_shop/';
var apiHost = 'http://wordpress.giiso.com/wordpress_robot_shop/';


//获取url参数,并转换成对象
var searchObj=function() {
    var str=location.search.slice(1);
    var res = {};
    if (!str) {
        return res;
    }
    str.split("&").forEach(function(v, k, arr) {
        var param = v.split('=');
        res[param[0]] = param[1];
    });
    return res;
};

var navListOld=['采集机器人','编辑机器人','写作机器人','推荐机器人','分析机器人'];

var apiList = [
    {
        api: '资讯搜索',
        robot: '采集机器人',
        robotText: '采集机器人拥有全方位资讯信息收集的能力，帮助您从不同的维度智能聚合想要的资讯，节省信息收集的时间。',
        icon: 'images/api-ico_search.png',
        menuIcon: 'images/menu-ico_search.png',
        slug: 'product_search',
        showType:'hot',
        hotApiText: '全面搜索精准呈现资讯',
        hotNum: '1'
    },
    {
        api: '人物图谱',
        robot: '推荐机器人',
        robotText: '推荐机器人xxxxxxxxxxxxxxxxxxxxxxxxx',
        icon: 'images/api-ico_tupu.png',
        menuIcon: 'images/menu-ico_tupu.png',
        slug: 'product_tupu',
        showType:'new'
    },
    {
        api: '百科词云',
        robot: '编辑机器人',
        robotText: '编辑机器人根据输入的文本内容，智能化提供文本的分类、分词、关键词提取等工作，极大提高文本处理效率。',
        icon: 'images/api-ico_baike.png',
        menuIcon: 'images/menu-ico_baike.png',
        slug: 'product_baike',
        showType:'new'
    },
    {
        api: '热门资讯',
        robot: '推荐机器人',
        robotText: '推荐机器人xxxxxxxxxxxxxxxxxxxxxxxxx',
        icon: 'images/api-ico_hotNews.png',
        menuIcon: 'images/menu-ico_hotNews.png',
        slug: 'product_hotnews',
        showType:'new',
        hotApiText: '实时掌握全网热点动态',
        hotNum: '3'
    },
    {
        api: '相似资讯',
        robot: '采集机器人',
        robotText: '采集机器人拥有全方位资讯信息收集的能力，帮助您从不同的维度智能聚合想要的资讯，节省信息收集的时间。',
        icon: 'images/api-ico_relatedNews.png',
        menuIcon: 'images/menu-ico_relatedNews.png',
        slug: 'product_relatednews',
        hotApiText: '深度挖掘展现同类信息',
        hotNum: '2'
    },
    {
        api: '文本分类',
        robot: '编辑机器人',
        robotText: '编辑机器人根据输入的文本内容，智能化提供文本的分类、分词、关键词提取等工作，极大提高文本处理效率。',
        icon: 'images/api-ico_classify.png',
        menuIcon: 'images/menu-ico_classify.png',
        slug: 'product_classify',
        hotApiText: '自动识别标记内容标签',
        hotNum: '4'
    },
    {
        api: '智能分词',
        robot: '编辑机器人',
        robotText: '编辑机器人根据输入的文本内容，智能化提供文本的分类、分词、关键词提取等工作，极大提高文本处理效率。',
        icon: 'images/api-ico_textcatgory.png',
        menuIcon: 'images/menu-ico_textcatgory.png',
        slug: 'product_textcatgory'
    },
    {
        api: '关键词提取',
        robot: '编辑机器人',
        robotText: '编辑机器人根据输入的文本内容，智能化提供文本的分类、分词、关键词提取等工作，极大提高文本处理效率。',
        icon: 'images/api-ico_getKeywords.png',
        menuIcon: 'images/menu-ico_getKeywords.png',
        slug: 'product_getkeywords',
        hotApiText: '分析提取资讯核心词汇',
        hotNum: '6'
    },
    {
        api: '资讯追踪',
        robot: '采集机器人',
        robotText: '采集机器人拥有全方位资讯信息收集的能力，帮助您从不同的维度智能聚合想要的资讯，节省信息收集的时间。',
        icon: 'images/api-ico_trace.png',
        menuIcon: 'images/menu-ico_trace.png',
        slug: 'product_trace'
    },
    {
        api: '资讯频道',
        robot: '采集机器人',
        robotText: '采集机器人拥有全方位资讯信息收集的能力，帮助您从不同的维度智能聚合想要的资讯，节省信息收集的时间。',
        icon: 'images/api-ico_channel.png',
        menuIcon: 'images/menu-ico_channel.png',
        slug: 'product_channel'
    },
    {
        api: '实体提取',
        robot: '编辑机器人',
        robotText: '编辑机器人根据输入的文本内容，智能化提供文本的分类、分词、关键词提取等工作，极大提高文本处理效率。',
        icon: 'images/api-ico_extract.png',
        menuIcon: 'images/menu-ico_extract.png',
        slug: 'product_extract'
    },
    {
        api: '传播轨迹',
        robot: '分析机器人',
        robotText: '分析机器人在信息大爆炸时代，通过智能语义以及大数据分析技术，能在海量的资讯里及时挖掘您想要的信息。',
        icon: 'images/api-ico_track.png',
        menuIcon: 'images/menu-ico_track.png',
        slug: 'product_track'
    },
    {
        api: '领域热词',
        robot: '分析机器人',
        robotText: '分析机器人在信息大爆炸时代，通过智能语义以及大数据分析技术，能在海量的资讯里及时挖掘您想要的信息。',
        icon: 'images/api-ico_hotword.png',
        menuIcon: 'images/menu-ico_hotword.png',
        slug: 'product_hotword'
    },
    {
        api: '文本摘要',
        robot: '写作机器人',
        robotText: '写作机器人根据用户个性化的写作目的，快速自动生成文章、标题、摘要，极大提高文章写作效率，是您内容创作的得力助手。',
        icon: 'images/api-ico_summary.png',
        menuIcon: 'images/menu-ico_summary.png',
        slug: 'product_summary',
        hotApiText: '提炼概括文章中心思想',
        hotNum: '5'
    }

];


//获取api列表数据

function getApiList(callBack) {
    $.ajax({
        url: apiHost, data: {
            json:'get_tag_posts',
            tag_slug:'product',
            count:1000
        }, success: function (data) {
            var arr = [];
            if (data.status == 'ok' && data.posts && data.posts.length > 0) {
                var res=data.posts;
                for (var i = 0; i < data.posts.length; i++) {

                    var robot=robotText=icon=menuIcon=showType=hotApiText=hotNum='';

                    if(res[i].custom_fields.robot)  robot=res[i].custom_fields.robot[0];
                    if(res[i].custom_fields.robotText)  robotText=res[i].custom_fields.robotText[0];
                    if(res[i].custom_fields.icon)  icon=res[i].custom_fields.icon[0];
                    if(res[i].custom_fields.menuIcon)  menuIcon=res[i].custom_fields.menuIcon[0];
                    if(res[i].custom_fields.showType)  showType=res[i].custom_fields.showType[0];
                    if(res[i].custom_fields.hotApiText)  hotApiText=res[i].custom_fields.hotApiText[0];
                    if(res[i].custom_fields.hotNum)  hotNum=res[i].custom_fields.hotNum[0];
                    arr.push({
                        api: res[i].title,
                        slug: res[i].slug,
                        robot: robot,
                        robotText: robotText,
                        icon: icon,
                        menuIcon: menuIcon,
                        showType: showType,
                        hotApiText: hotApiText,
                        hotNum: hotNum
                    })
                }
            } else {
                arr = apiList;
            }
            if (callBack) callBack(arr);
        },
        error: function () {
            if (callBack) callBack(apiList);
        }
    })
}