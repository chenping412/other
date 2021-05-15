//process.env.VUE_APP_SERVICE 是 vue-cli 环境变量配置，运行不同打包模式，输出不同变量，以此配置 hostConfig
console.log('当前打包环境是：' + process.env.VUE_APP_SERVICE);

let hostConfig = {
    domain: '.dev.0so.cn',
    orderHost: 'http://order.dev.0so.cn/api',
    // orderHost: 'http://10.1.1.132:81/api',
    partnerHost: 'http://partner.dev.0so.cn/api',
    accountingHost: 'http://accounting.dev.0so.cn/api',
    fileHost: 'http://file.dev.0so.cn/api',
    ossHost: 'http://oss.dev.0so.cn/api',
    productHost: 'http://product.dev.0so.cn/api',
    messageHost: 'http://message.dev.0so.cn/api',
    logisticsHost: 'http://logistics.dev.0so.cn/api',
    inquiryHost : 'http://inquiry.dev.0so.cn',
    wwwHost : 'http://www.dev.0so.cn',
    ssoHost:'http://sso.dev.0so.cn',
    dingTalkHost:'http://dingtalk.dev.0so.cn',

    
    //11：周栋森，132：陈平
    brandAllowChangeAllRelatedLoginUserId:[11,132],
    partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,132],
    partnerAllowChangeAllFollowerUserId39567:[11,132],
    partnerAllowChangeOrderPaymentMethod:[11,132],
    productAllowChangeApprovalInfo:[132],
    productAllowChangeBaseInfo:[132],
};

if(process.env.VUE_APP_SERVICE === 'test'){
    console.log('这里是test环境')
    hostConfig = {
        domain: '.dev.0so.cn',
        orderHost: 'http://10.1.1.132:81/api',
        partnerHost: 'http://partner.dev.0so.cn/api',
        accountingHost: 'http://accounting.dev.0so.cn/api',
        fileHost: 'http://file.dev.0so.cn/api',
        ossHost: 'http://oss.dev.0so.cn/api',
        // productHost: 'http://product.dev.0so.cn/api',
        productHost: 'http://10.1.1.132:5000/api',
        messageHost: 'http://message.dev.0so.cn/api',
        logisticsHost: 'http://logistics.dev.0so.cn/api',
        inquiryHost : 'http://10.1.1.132:80',
        wwwHost : 'http://www.dev.0so.cn',
        ssoHost:'http://sso.dev.0so.cn',
        dingTalkHost:'http://dingtalk.dev.0so.cn',

        //11：周栋森，132：陈平
        brandAllowChangeAllRelatedLoginUserId:[11,132],
        partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,132],
        partnerAllowChangeAllFollowerUserId39567:[11,132],
        partnerAllowChangeOrderPaymentMethod:[11,132],
        productAllowChangeApprovalInfo:[],
        productAllowChangeBaseInfo:[],
    };
}else if(process.env.VUE_APP_SERVICE === 'dev'){
    console.log('这里是dev环境')
    hostConfig = {
        domain: '.dev.0so.cn',
        orderHost: 'http://order.dev.0so.cn/api',
        partnerHost: 'http://partner.dev.0so.cn/api',
        accountingHost: 'http://accounting.dev.0so.cn/api',
        fileHost: 'http://file.dev.0so.cn/api',
        ossHost: 'http://oss.dev.0so.cn/api',
        productHost: 'http://product.dev.0so.cn/api',
        messageHost: 'http://message.dev.0so.cn/api',
        logisticsHost: 'http://logistics.dev.0so.cn/api',
        inquiryHost : 'http://inquiry.dev.0so.cn',
        wwwHost : 'http://www.dev.0so.cn',
        ssoHost:'http://sso.dev.0so.cn',
        dingTalkHost:'http://dingtalk.dev.0so.cn',

        //11：周栋森，132：陈平
        brandAllowChangeAllRelatedLoginUserId:[11,132],
        partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,132],
        partnerAllowChangeAllFollowerUserId39567:[11,132],
        partnerAllowChangeOrderPaymentMethod:[11,132],
        productAllowChangeApprovalInfo:[],
        productAllowChangeBaseInfo:[],
    };
}else if(process.env.VUE_APP_SERVICE === 'staging'){
    console.log('这里是staging环境')
    hostConfig = {
        domain: '.staging.0so.cn',
        orderHost: 'http://order.staging.0so.cn/api',
        partnerHost: 'http://partner.staging.0so.cn/api',
        accountingHost: 'http://accounting.staging.0so.cn/api',
        fileHost: 'http://file.staging.0so.cn/api',
        ossHost: 'http://oss.staging.0so.cn/api',
        productHost: 'http://product.staging.0so.cn/api',
        messageHost: 'http://message.staging.0so.cn/api',
        logisticsHost: 'http://logistics.staging.0so.cn/api',
        inquiryHost : 'http://inquiry.staging.0so.cn',
        wwwHost : 'http://www.staging.0so.cn',
        ssoHost:'http://sso.staging.0so.cn',
        dingTalkHost:'http://dingtalk.staging.0so.cn',

        //11：周栋森，411：陈平，420：石鑫
        brandAllowChangeAllRelatedLoginUserId:[11,420],
        partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,411],
        partnerAllowChangeAllFollowerUserId39567:[11,420],
        partnerAllowChangeOrderPaymentMethod:[11,420],
        productAllowChangeApprovalInfo:[],
        productAllowChangeBaseInfo:[411],
    };
}else if(process.env.VUE_APP_SERVICE === 'product'){
    console.log('这里是product环境')
    hostConfig = {
        domain: '.0so.com',
        orderHost: 'https://order.0so.com/api',
        partnerHost: 'https://partner.0so.com/api',
        accountingHost: 'https://accounting.0so.com/api',
        fileHost: 'https://file.0so.com/api',
        ossHost: 'https://oss.0so.com/api',
        productHost: 'https://product.0so.com/api',
        messageHost: 'https://message.0so.com/api',
        logisticsHost: 'https://logistics.0so.com/api',
        inquiryHost : 'https://inquiry.0so.com',
        wwwHost : 'https://www.0so.com',
        ssoHost:'https://sso.0so.com',
        dingTalkHost:'https://dingtalk.0so.com',

        //以下为login_user_id
        //周栋森：11 ,肖文佳：67 ,肖文先：346 ,林健：343，王英 294,杨瑞娟 308;刘海威 433, 蔡达锋697,
        //胡佳敏 24，杨信仪 309，王玉玲:25，李冠频:404，
        //询报价----赵英强：364, 叶锦虹：401, 张恩涵：1265, 胡茂欣：849, 周霞：786, 吴明燕：328, 徐燕丽: 319, 陈泽玲：331, 何诺宜：1358, 杨梦：99, 吴曼洁：356, 赵迪：1402，杨倩：1428, 吴凤懿：1439, 周阳:1536
        //物流部---刘伟：43，陈弢：342, 李洁：417，刘锦翠: 358，覃亚光:1359, 董虎子：1423
        brandAllowChangeAllRelatedLoginUserId:[11,294,308,433,24,404,309,25], //品牌跟进人
        partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,67,294,308,433,697,24,309,404,25], //零搜集团合作伙伴跟进人
        partnerAllowChangeAllFollowerUserId39567:[346,343,11,697,24,309,404,25], //39567合作伙伴跟进人
        partnerAllowChangeOrderPaymentMethod:[24,309,25,417,358,473], //合作伙伴付款方式
        productAllowChangeApprovalInfo:[43,342,417,1359,1423], //物流部 核准池核准及产品详情页物流信息修改权限
        productAllowChangeBaseInfo:[24,309,25,364,401,1265,849,786,328,319,331,1358,99,417,358,356,1402,1428,1439,1536], //询报价组 产品基本信息修改
    };
}
export default hostConfig