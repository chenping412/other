
//增加当前页动画
testAnim('.section1', '.left', 'fadeInLeft');
testAnim('.section1', '.right', 'fadeInRight');
testAnim('.section1', '.mid', 'fadeInUp');
testAnim('#banner', '.img2', 'fadeInUp');
testAnim('#banner', '.img3', 'fadeInDown');
testAnim('#banner', '.img4', 'fadeInRight');
testAnim('#banner', '.img5', 'fadeInLeft');
testAnim('#banner', 'p', 'fadeInLeft');

function section3Show(){
    show('.section3', '.item1', 'fadeInDown');
    setTimeout(function () {
        show('.section3', '.item2', 'fadeInDown');
    }, 200);
    setTimeout(function () {
        show('.section3', '.item3', 'fadeInDown');
    }, 400);
    setTimeout(function () {
        show('.section3', '.item4', 'fadeInDown');
    }, 600);
    setTimeout(function () {
        show('.section3', '.item5', 'fadeInDown');
    }, 800);
    setTimeout(function () {
        show('.section3', '.item6', 'fadeInDown');
    }, 1000);
}

$(window).on('scroll', function () {
    testAnim('.section1', '.left', 'fadeInLeft');
    testAnim('.section1', '.right', 'fadeInRight');
    testAnim('.section1', '.mid', 'fadeInUp');
    testAnim('.section2', '.bot', 'fadeInUp');

    section3Show();

    testAnim('.section4', '.left', 'fadeInLeft');
    testAnim('.section4', '.right', 'fadeInRight');
    testAnim('.section5', '.left', 'fadeInDown');
    testAnim('.section5', '.right', 'fadeInUp');
});


//banner轮播设置---------------------------------------------------------------------------------------------------------
function setBannerSwiper(){
    var bannerSwiper=new Swiper('#banner', {
        autoplay: 4000,
        autoplayDisableOnInteraction: false,
        loop: true,
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
    $('#banner').mouseover(function(){
        bannerSwiper.stopAutoplay();
    });
    $('#banner').mouseout(function(){
        bannerSwiper.startAutoplay();
    });
}
//banner轮播图2和3设置
var bannerApiUrl=apiHost + '/get_post/?post_slug=index_banner_pc';
if($(window).width()<=768){
    bannerApiUrl=apiHost + '/get_post/?post_slug=index_banner_phone';
}
$.ajax({
    url: bannerApiUrl,
    data: {},
    success: function (data) {
        if (data.status == 'ok' && data.post && data.post.attachments && data.post.attachments.length > 0) {
            var arr = data.post.attachments;

            var content = '<div class="page page1 swiper-slide">'
                +'<img class="img1" src="images/index-banner-bj1.png">'
                +'<img class="img2 move1" src="images/front-screen%20copy@1x.png">'
                +'<img class="img3 move2" src="images/front-screen%20copy@1x.png">'
                +'<img class="img4 move3" src="images/Group-3@2x.png">'
                +'<img class="img5" src="images/index-banner-p2.png">'
                +'<img class="img-phone" src="images/index-banner-01-phone.png">'
                +'<p class="p1"><img class="title-logo" src="images/Giiso-LOGO-2017-white.png">资讯机器人</p>'
                +'<p class="p2 move3"><span>服务模式</span>智能资讯云，以机器人的综合能力为核心竞争优势，赋能应用端效率提升和降低成本</p>'
                +'<p class="p3 move3"><span>两大核心技术</span>智能语义+知识图谱</p>'
                +'<p class="p4 move3"><span>五大功能特长</span>写作、采编、审核、发布、追踪</p>'
                +'</div>';
            for (var i = 0; i < arr.length; i++) {
                var href= arr[i].caption == '' ? 'javascript:;' : arr[i].caption;
                content += '<a href="'+href+'" class="page swiper-slide" style="background-image: url(' + arr[i].url + ')" target="_blank"></a>';
            }
            $('#banner').find('.swiper-wrapper').html(content);
        }
        setBannerSwiper();
    },
    error: function () {
        setBannerSwiper();
    }
});




//行业动态数据渲染-------------------------------------------------------------------------------------------------------
getNewsList(function(newsList){
    var firstNews = newsList[0];
    var otherNewsList = newsList.slice(1,13);
    $('#first-news').find('.img').attr('style', 'background-image: url(' + firstNews.imgUrl + ')');
    $('#first-news').find('a').attr('href', 'hangyedongtai-detail.html?id=' + firstNews.id);
    $('#first-news').find('h3 a').html(firstNews.title);
    $('#first-news').find('p').html('<span>' + firstNews.time + '</span>浏览量：' + firstNews.num);
    var content = ''
    for (var i = 0; i < otherNewsList.length; i++) {
        if (i % 3 == 0) {
            content += '<ul class="swiper-slide">';
        }
        content += '<li>'
            + '<a class="img" href="hangyedongtai-detail.html?id=' + otherNewsList[i].id + '" style="background-image: url(' + otherNewsList[i].imgUrl + ')"></a>'
            + '<h5><a href="hangyedongtai-detail.html?id=' + otherNewsList[i].id + '">' + otherNewsList[i].title + '</a></h5>'
            + '<p>' + otherNewsList[i].time + ' | 浏览量：' + otherNewsList[i].num + '</p>'
            + '</li>';
        if (i % 3 == 2) {
            content += '</ul>';
        }
    }
    $('#news-swiper').find('.swiper-wrapper').html(content);
    new Swiper('#news-swiper', {
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        loop: true,
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
});




//公司简介配置
$.ajax({
    url: apiHost + '/get_post/?post_slug=index_giiso_info',
    data: {},
    success: function (data) {
        if (data.status == 'ok' && data.post && data.post.content) {
            $('#giiso-info').find('.bot').html(data.post.content)
        }
        $('#giiso-info').show();
    },
    error: function () {
        $('#giiso-info').show();
    }
});


//giiso里程碑配置
$.ajax({
    url: apiHost + '/get_tag_posts/?tag_slug=giiso_course',
    data: {},
    success: function (data) {
        if (data.status == 'ok' && data.posts && data.posts.length>0) {
            var arr=data.posts.slice(0,6);
            var content='';
            for(var i=arr.length-1;i>=0;i--){
                content+='<li class="item'+(arr.length-i)+'">'
                    +'<div class="top">'
                    +arr[i].content
                    +'</div><div class="ball">'
                    +'<h5>'+arr[i].title+'</h5>'
                    +'<i></i><span></span></div></li>';
            }
            $('#giiso_course').find('ul').html(content);
        }
        $('#giiso_course').show();
        setTimeout(function(){
            section3Show();
        },100)
    },
    error: function () {
        $('#giiso_course').show();
        setTimeout(function(){
            section3Show();
        },100)
    }
});


//团队介绍轮播----------------------------------------------------------------------------------------------------------
function teamSwiper(){
    new Swiper('#team', {
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        loop: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next'
    });

    $('#team').find('.swiper-wrapper').on('click', function () {
        window.location.href = 'tuanduijieshao.html';
    });
}
$.ajax({
    url: apiHost + '/get_post/?post_slug=index_team',
    data: {},
    success: function (data) {
        if (data.status == 'ok' && data.post && data.post.attachments && data.post.attachments.length > 0) {
            var arr = data.post.attachments;
            var content='';
            for (var i = 0; i < arr.length; i++) {
                content+='<div class="swiper-slide">'
                    +'<div class="pic" style="background-image: url('+arr[i].url+')"></div>'
                    +'<p>'+arr[i].title+'</p></div>'
            }
            $('#team').find('.swiper-wrapper').html(content)
        }
        $('#team').show();
        teamSwiper();
    },
    error: function () {
        $('#team').show();
        teamSwiper();
    }
});




//人才招募数据渲染-----------------------------------------------------------------------------------------------------------------

getJobList(function(list){
    var renContent = '';
    for (var i = 0; i < 8; i++) {
        if (list[i]) {
            renContent += '<li><a href="rencaizhaomu.html">' + list[i].name + '<span>' + list[i].address + '</span></a></li>'
        }
    }
    $('#rencai-list').html(renContent);
});




//合作伙伴图片配置
$.ajax({
    url: apiHost + '/get_post/?post_slug=index_partner',
    data: {},
    success: function (data) {
        if (data.status == 'ok' && data.post && data.post.attachments && data.post.attachments.length > 0) {
            var arr = data.post.attachments;
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].caption.indexOf('pc') > -1){
                    $('#partner').find('.pic').css('background-image',"url('"+arr[i].url+"')");
                }else if(arr[i].caption.indexOf('phone') > -1){
                    $('#partner').find('.phone').attr('src',arr[i].url);
                }
            }
        }
        $('#partner').show();
    },
    error: function () {
        $('#partner').show();
    }
});


