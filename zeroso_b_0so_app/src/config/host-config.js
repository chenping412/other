
//process.env.VUE_APP_SERVICE 是 vue-cli 环境变量配置，运行不同打包模式，输出不同变量，以此配置 hostConfig
console.log('当前打包环境是：' + process.env.VUE_APP_SERVICE);

let hostConfig = {
    domain: '.dev.0so.cn',
    orderHost: 'http://order.dev.0so.cn/api',
    // orderHost: 'http://10.1.1.132:81/api',
    partnerHost: 'http://partner.dev.0so.cn/api',
    accountingHost: 'http://accounting.dev.0so.cn/api',
    fileHost: 'http://file.dev.0so.cn/api',
    productHost: 'http://product.dev.0so.cn/api',
    // productHost: 'http://10.1.1.132:5000/api',
    messageHost: 'http://message.dev.0so.cn/api',
    logisticsHost: 'http://logistics.dev.0so.cn/api',
    inquiryHost : 'http://inquiry.dev.0so.cn',
    // inquiryHost : 'http://10.1.1.132:80',
    ssoHost:'http://sso.dev.0so.cn',

    
    //11：周栋森，132：陈平
    brandAllowChangeAllRelatedLoginUserId:[11,132],
    partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,132],
    partnerAllowChangeAllFollowerUserId39567:[11],
};

if(process.env.VUE_APP_SERVICE === 'test'){
    console.log('这里是test环境')
    hostConfig = {
        domain: '.dev.0so.cn',
        orderHost: 'http://10.1.1.132:81/api',
        partnerHost: 'http://partner.dev.0so.cn/api',
        accountingHost: 'http://accounting.dev.0so.cn/api',
        fileHost: 'http://file.dev.0so.cn/api',
        productHost: 'http://product.dev.0so.cn/api',
        messageHost: 'http://message.dev.0so.cn/api',
        logisticsHost: 'http://logistics.dev.0so.cn/api',
        inquiryHost : 'http://10.1.1.132:80',
        ssoHost:'http://sso.dev.0so.cn',

        //11：周栋森，132：陈平
        brandAllowChangeAllRelatedLoginUserId:[11,132],
        partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,132],
        partnerAllowChangeAllFollowerUserId39567:[11,132],
    };
}else if(process.env.VUE_APP_SERVICE === 'dev'){
    console.log('这里是dev环境')
    hostConfig = {
        domain: '.dev.0so.cn',
        orderHost: 'http://order.dev.0so.cn/api',
        partnerHost: 'http://partner.dev.0so.cn/api',
        accountingHost: 'http://accounting.dev.0so.cn/api',
        fileHost: 'http://file.dev.0so.cn/api',
        productHost: 'http://product.dev.0so.cn/api',
        messageHost: 'http://message.dev.0so.cn/api',
        logisticsHost: 'http://logistics.dev.0so.cn/api',
        inquiryHost : 'http://inquiry.dev.0so.cn',
        ssoHost:'http://sso.dev.0so.cn',

        //11：周栋森，132：陈平
        brandAllowChangeAllRelatedLoginUserId:[11,132],
        partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,132],
        partnerAllowChangeAllFollowerUserId39567:[11,132],
    };
}else if(process.env.VUE_APP_SERVICE === 'staging'){
    console.log('这里是staging环境')
    hostConfig = {
        domain: '.staging.0so.cn',
        orderHost: 'http://order.staging.0so.cn/api',
        partnerHost: 'http://partner.staging.0so.cn/api',
        accountingHost: 'http://accounting.staging.0so.cn/api',
        fileHost: 'http://file.staging.0so.cn/api',
        productHost: 'http://product.staging.0so.cn/api',
        messageHost: 'http://message.staging.0so.cn/api',
        logisticsHost: 'http://logistics.staging.0so.cn/api',
        inquiryHost : 'http://inquiry.staging.0so.cn',
        ssoHost:'http://sso.staging.0so.cn',

        //11：周栋森，411：陈平，420：石鑫
        brandAllowChangeAllRelatedLoginUserId:[11,420],
        partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,411],
        partnerAllowChangeAllFollowerUserId39567:[11,420],
    };
}else if(process.env.VUE_APP_SERVICE === 'product'){
    console.log('这里是product环境')
    hostConfig = {
        domain: '.0so.com',
        orderHost: 'https://order.0so.com/api',
        partnerHost: 'https://partner.0so.com/api',
        accountingHost: 'https://accounting.0so.com/api',
        fileHost: 'https://file.0so.com/api',
        productHost: 'https://product.0so.com/api',
        messageHost: 'https://message.0so.com/api',
        logisticsHost: 'https://logistics.0so.com/api',
        inquiryHost : 'https://inquiry.0so.com',
        ssoHost:'https://sso.0so.com',

        //login_user_id 周栋森：11 ,肖文佳：67 ,肖文先：346 ,林健：343，王英 294,杨瑞娟 308;刘海威 login_user_id 433
        brandAllowChangeAllRelatedLoginUserId:[11,294,308,433],
        partnerAllowChangeAllFollowerUserIdZerosoCompany:[11,67,294,308,433],
        partnerAllowChangeAllFollowerUserId39567:[346,343,11],
    };
}


export default hostConfig