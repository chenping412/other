projectPath="http://"+window.location.host+"/HMMP/";

// 首页侧边栏点击事件
$('.sidebar-wrap ul li:first-child').on('click', function () {
    $(this).siblings('li').toggle();
    $(this).children('.icon-downTriangle').toggle().siblings('.icon-arrow-left-copy').toggle();

})

// 点击头部导航，显示不同的页面
$('.platform-header .tab').on('click', 'li', function () {
    $(this).addClass('tab-active').siblings().removeClass('tab-active');
    console.log("点击了："+$(this).html())
    if ($(this).html() == '订单管理') {
        $('.platform-sidebar').show();
        $('.order-manage-sidebar').show();
        $('.finance-manage-sidebar').hide();
        $('.user-data-sidebar').hide();
        $('.product-manage-sidebar').hide();
        $('.supply-manage-sidebar').hide();
        $('.agent-manage-sidebar').hide();
        $('.order-manage').show().siblings('.finance-manage').hide().siblings('.user-data').hide().siblings('.product-manage').hide().siblings('.agent-manage').hide().siblings('.supply-manage').hide();
    } else if ($(this).html() == '财务报表') {
        $('.platform-sidebar').show();
        $('.finance-manage-sidebar').show();
        $('.order-manage-sidebar').hide();
        $('.user-data-sidebar').hide();
        $('.product-manage-sidebar').hide();
        $('.supply-manage-sidebar').hide();
        $('.agent-manage-sidebar').hide();
        $('.finance-manage').show().siblings('.order-manage').hide().siblings('.user-data').hide().siblings('.product-manage').hide().siblings('.agent-manage').hide().siblings('.supply-manage').hide();
    } else if ($(this).html() == '基础资料') {
        $('.platform-sidebar').show();
        $('.user-data-sidebar').show();
        $('.order-manage-sidebar').hide();
        $('.finance-manage-sidebar').hide();
        $('.product-manage-sidebar').hide();
        $('.supply-manage-sidebar').hide();
        $('.agent-manage-sidebar').hide();
        $('.user-data').show().siblings('.order-manage').hide().siblings('.finance-manage').hide().siblings('.product-manage').hide().siblings('.agent-manage').hide().siblings('.supply-manage').hide();
    } else if ($(this).html() == '产品管理') {
        $('.platform-sidebar').show();
        $('.product-manage-sidebar').show();
        $('.user-data-sidebar').hide();
        $('.order-manage-sidebar').hide();
        $('.finance-manage-sidebar').hide();
        $('.supply-manage-sidebar').hide();
        $('.agent-manage-sidebar').hide();
        $('.product-manage').show().siblings('.order-manage').hide().siblings('.user-data').hide().siblings('.finance-manage').hide().siblings('.agent-manage').hide().siblings('.supply-manage').hide();
    } else if ($(this).html() == '供应商管理') {
        $('.platform-sidebar').show();
        $('.supply-manage-sidebar').show();
        $('.agent-manage-sidebar').hide();
        $('.product-manage-sidebar').hide();
        $('.user-data-sidebar').hide();
        $('.order-manage-sidebar').hide();
        $('.finance-manage-sidebar').hide();
        $('.supply-manage').show().siblings('.order-manage').hide().siblings('.user-data').hide().siblings('.finance-manage').hide().siblings('.product-manage').hide().siblings('.agent-manage').hide();
    } else if ($(this).html() == '客户管理') {
        $('.platform-sidebar').show();
        $('.agent-manage-sidebar').show();
        $('.supply-manage-sidebar').hide();
        $('.product-manage-sidebar').hide();
        $('.user-data-sidebar').hide();
        $('.order-manage-sidebar').hide();
        $('.finance-manage-sidebar').hide();
        $('.agent-manage').show().siblings('.order-manage').hide().siblings('.user-data').hide().siblings('.finance-manage').hide().siblings('.product-manage').hide().siblings('.supply-manage').hide();
    }
    else {
        $('.welcome-image').show().siblings('.platform-sidebar').hide();
    }
})
//2 头部用户图标，点击显示悬浮框
$('.platform-header .tab').children('.user-info').on('click', function () {
    $(this).children('.personal-info').show();
})

// 查询工具侧边栏点击事件
$('.sidebar-wrap').on('click', '.list', function () {
    $(this).addClass('sidebar-active').siblings().removeClass('sidebar-active').parent('ul').siblings().children('li').removeClass('sidebar-active')
})

$('.sidebar-wrap').on('click', '.one-list', function () {
    $(this).addClass('sidebar-active').parent('.sidebar-product').siblings().children('li').removeClass('sidebar-active')
})

// 产品管理侧边栏点击事件
$('.product-manage-sidebar').on('click', 'li', function () {
	var sd = new Date();
	var ed = new Date();
	ed.setDate(ed.getDate() + 7);
    var sy = sd.getFullYear();
    var ey = ed.getFullYear();
    var sm = sd.getMonth();
    var em = ed.getMonth();
    sm = sm + 1;
    em = em + 1;
    var std = sd.getDate();
    var etd = ed.getDate();
    if (sm < 10) {
    	sm = '0' + sm;
    }
    if (em < 10) {
    	em = '0' + em;
    }
    if (std < 10) {
    	std = '0' + std;
    }
    if (etd < 10) {
    	etd = '0' + etd;
    }
    var startDate = sy + '-' + sm + '-' + std;
    var endDate = ey + '-' + em + '-' + etd;
    $('.welcome-image').hide();
    if ($(this).html() == '我的酒店') {
        $('.product-manage').children().attr('src', projectPath +'admin/queryHotelList');
    }
    /*else if ($(this).html() == '我的产品') {
        $('.product-manage').children().attr('src', projectPath+'admin/queryPricePlanList');
    }*/
    else if ($(this).html() == '珠海每日控房') {
        $('.product-manage').children().attr('src', projectPath+'admin/queryRoomControlList');
    }else if ($(this).html() == '港澳每日控房') {
        $('.product-manage').children().attr('src', projectPath+'admin/overseaQueryRoomControlList');
    }else if ($(this).html() == '配额报表') {
    	$('.product-manage').children().attr('src', projectPath+'admin/overseaQueryRoomControlList');
    }else if ($(this).html() == '动态报价') {
        $('.product-manage').children().attr('src', projectPath+'admin/dynamicPriceController/dynamicPage?beginDate='+startDate);
    }else if ($(this).html() == '区间报价') {
        $('.product-manage').children().attr('src', projectPath+'admin/dynamicPriceController/intervalPage?beginDate='+startDate+'&endDate='+endDate);
    }else if ($(this).html() == '酒店映射') {
        $('.product-manage').children().attr('src', projectPath+'admin/dltHotelMappingForPage');
    }else if ($(this).html() == '售卖房型映射') {
        $('.product-manage').children().attr('src', projectPath+'admin/dltRoomMappingForPage');
    }else if ($(this).html() == '报价同步开关') {
        $('.product-manage').children().attr('src', projectPath+'admin/dltRoomDateSyncSwitch');
    }
})

//订单管理
$('.order-manage-sidebar').on('click', 'li', function () {
    $('.welcome-image').hide();
    if ($(this).html() == '我的订单') {
        $('.order-manage').children().attr('src', projectPath +'admin/orderManage');
    } else if ($(this).html() == '手工录单') {
        $('.order-manage').children().attr('src', projectPath +'admin/toAddOrder');
    } else if ($(this).html() == '订单申诉') {
        $('.order-manage').children().attr('src', projectPath +'admin/orderAppealController/order/page');
    } else if ($(this).html() == '查房') {
		var sd = new Date();
		var ed = new Date();
		ed.setDate(ed.getDate() + 1);
        var sy = sd.getFullYear();
        var ey = ed.getFullYear();
        var sm = sd.getMonth();
        var em = ed.getMonth();
        sm = sm + 1;
        em = em + 1;
        var sday = sd.getDate();
        var eday = ed.getDate();
        if (sm < 10) {
        	sm = '0' + sm;
        }
        if (em < 10) {
        	em = '0' + em;
        }
        if (sday < 10) {
        	sday = '0' + sday;
        }
        if (eday < 10) {
        	eday = '0' + eday;
        }
        var startDate = sy + '-' + sm + '-' + sday;
        var endDate = ey + '-' + em + '-' + eday;
        $('.order-manage').children().attr('src', projectPath +'admin/searchRoom?dateType=2&startDate=' + startDate + '&endDate=' + endDate + '&orderState=confirmed&cityCode=ZHH');
    }
})
// 财务报表侧边栏点击事件
$('.finance-manage-sidebar').on('click', 'li', function () {
    $('.welcome-image').hide();
    if ($(this).html() == '供应商出账销账') {
        $('.finance-manage').children().attr('src', projectPath +'admin/supplyBillController/page?payType=1');
    } else if ($(this).html() == '供应商销账记录') {
        $('.finance-manage').children().attr('src',  projectPath +'admin/supplyBillController/listSupplyBillOffPage?payType=1');
    } else if ($(this).html() == '供应商返佣出账销账') {
        $('.finance-manage').children().attr('src',  projectPath +'admin/supplyBillController/page?payType=0');
    } else if ($(this).html() == '供应商返佣销账记录') {
        $('.finance-manage').children().attr('src',  projectPath +'admin/supplyBillController/listSupplyBillOffPage?payType=0');
    } else if ($(this).html() == '客户出账销账') {
        $('.finance-manage').children().attr('src',  projectPath +'admin/agentBillController/pageSum');
    } else if ($(this).html() == '客户销账记录') {
        $('.finance-manage').children().attr('src',  projectPath +'admin/agentBillController/listAgentBillOffPage');
    } else if ($(this).html() == '订单申诉') {
    	$('.finance-manage').children().attr('src',  projectPath +'admin/orderAppealController/page')
    } else if ($(this).html() == '订单解锁') {
    	$('.finance-manage').children().attr('src',  projectPath +'admin/orderLockController/page')
    } else if ($(this).html() == '应收报表') {
    	$('.finance-manage').children().attr('src',  projectPath +'admin/reportController/receivable')
    } else if ($(this).html() == '应收毛利报表') {
    	$('.finance-manage').children().attr('src',  projectPath +'admin/reportController/receivableProfit')
    } else if ($(this).html() == '应付报表') {
    	$('.finance-manage').children().attr('src',  projectPath +'admin/reportController/payable')
    } else if ($(this).html() == '珠海毛利日报表') {
        $('.finance-manage').children().attr('src',  projectPath +'admin/reportController/dailyProfit?city=ZHH')
    } else if ($(this).html() == '港澳毛利日报表') {
        $('.finance-manage').children().attr('src',  projectPath +'admin/reportController/dailyProfit?city=HKG')
    }

})

// 供应商管理侧边栏点击事件
$('.supply-manage-sidebar').on('click', 'li', function () {
    $('.welcome-image').hide();
    if ($(this).html() == '我的供应商') {
        $('.supply-manage').children().attr('src', projectPath +'admin/supplyController/page');
    }
});

//客户管理侧边栏点击事件
$('.agent-manage-sidebar').on('click', 'li', function () {
    $('.welcome-image').hide();
    if ($(this).html() == '我的客户') {
        console.log('客户管理');
        $('.agent-manage').children().attr('src', projectPath +'admin/agentController/page');
    }
});



// 用户管理侧边栏点击事件
$('.user-data-sidebar').on('click', 'li', function () {
    $('.welcome-image').hide();
    if ($(this).html() == '修改密码') {
        $('.user-data').children().attr('src', projectPath +'admin/toChangePersonalPassword');
    } else if ($(this).html() == '部门管理') {
        $('.user-data').children().attr('src', projectPath +'admin/department/listByPage')
    }  else if ($(this).html() == '员工管理') {
        $('.user-data').children().attr('src', projectPath +'admin/queryUserList')
    } else if ($(this).html() == '角色管理') {
        $('.user-data').children().attr('src', projectPath +'admin/queryRoleInfoList');
    } else if ($(this).html() == '个人资料') {
        $('.user-data').children().attr('src', projectPath +'admin/toPersonalProfile');
    } else if ($(this).html() == '我的客户') {
        $('.user-data').children().attr('src', projectPath +'admin/agentController/page');
    } else if ($(this).html() == '我的供应商') {
        $('.user-data').children().attr('src', projectPath +'admin/supplyController/page');
    } else if ($(this).html() == '我的酒店') {
        $('.user-data').children().attr('src', projectPath +'admin/queryBaseHotelList');
    } else if ($(this).html() == '汇率设置') {
        $('.user-data').children().attr('src',  projectPath +'admin/queryExchangeList');
    } else if ( $(this).html() == '我的银行账号' ) {
    	$('.user-data').children().attr('src',  projectPath +'admin/bankAccountController/page');
    } else if ( $(this).html() == '日历管理' ) {
    	$('.user-data').children().attr('src',  projectPath +'admin/calendarController/page');
    } else if ( $(this).html() == '区间报价信息' ) {
    	$('.user-data').children().attr('src',  projectPath +'admin/intervalInfoController/editPage');
    }
})