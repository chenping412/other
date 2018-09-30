projectPath = "http://" + window.location.host + "/HMMP/";

//点击保存按钮后，返回上一页
function go() {
    window.history.go(-1);
}

//限定字数
limitStr($('.meituan-whitelist-wrap .list3')); //添加美团酒店页面

limitStr($('.check-merchant-wrap .list2')); //查看商家页面
limitStr($('.check-merchant-wrap .list4')); //查看商家页面
limitStr($('.check-port-wrap .list2')); //查看接口页面

limitStr($('.role-manage-wrap .list4')); //角色管理页面
function limitStr(arr){
     for(var i=0; i<arr.length;i++){
        if($(arr[i]).html().length>9){
            $(arr[i]).attr('title',$(arr[i]).html()).html($(arr[i]).html().slice(0,9)+'...')
        }
     }
}

function secondLimitStr(arr, len){
    for(var i=0; i<arr.length;i++){
        if($(arr[i]).html().length>len){
            $(arr[i]).attr('title',$(arr[i]).html()).html($(arr[i]).html().slice(0,len)+'...')
        }
    }
}

//输入框删除输入值
inputChangeEvent( $('input'));
inputChangeEvent( $('textarea'));
inputChangeEvent( $('textarea'));
// inputChangeEvent( $('.error-reminder'));
function inputChangeEvent(ele){
    ele.on('input',function(){
        if ($(this).val() =='') {
            $(this).next('.empty').hide()
        }else{
            $(this).next('.empty').show()
        }
    })
}

$('.error-reminder').on('input',function() {
    if ($(this).val() !='') {
        $(this).parent('.f_ui-valid-item').next('.empty').show()
    }else{
        $(this).parent('.f_ui-valid-item').next('.empty').hide()
    }
})

$('.empty').click(function () {
    $(this).prev('input').val('');
    $(this).prev('textarea').val('');
    $(this).hide()
})

//filter-bar input框点击显示下拉框
$('.filter-bar .select-box-value').click(function (event) {
    if ($(this).siblings('.filter-bar-drop-box').css("display") == "none") {
        $('.filter-bar-drop-box').hide();
        $(this).siblings('.filter-bar-drop-box').show();
    }
    $('.filter-bar-drop-box').on('click', 'li', function () {
        // $(this).parent().parent('.filter-bar-drop-box').siblings('input').val($(this).html());
        $(this).parent().parent('.filter-bar-drop-box').siblings('.select-box-value').first().val($(this).html());
        $('.filter-bar-drop-box').hide();
    })
    event.stopPropagation();
})
$("body").on('click', function () {
    $('.filter-bar-drop-box').hide();
    $('.form-list-drop-box').hide();
})

//点击form-list切换下拉框的内容
$('.form-list .row').children('.list').children('.select-box-value').click(function (event) {
    if ($(this).siblings('.form-list-drop-box').css("display") == "none") {
        $('.form-list-drop-box').hide();
        $(this).siblings('.form-list-drop-box').show()
    }

    $('.form-list-drop-box').on('click', 'li', function () {
        // console.log($(this).html())
        // $(this).parent().parent('.form-list-drop-box').siblings('input').val($(this).html());
        $(this).parent().parent('.form-list-drop-box').siblings('.select-box-value').val($(this).html());
        $('.form-list-drop-box').hide();

        $('#test-test').val($(this).attr('value'))

        // console.log($(this).parent().parent('.form-list-drop-box').siblings('input').val())
    })
    event.stopPropagation();
})

//点击切换下拉框的内容
$('.search-conent .row').children('.data').children('input').focus(function () {
    $(this).css('border', '1px solid rgba(218, 223, 226, 1)')
    $(this).siblings('.drop-box-list').show()
    $('.drop-box-list').on('click', 'li', function () {
        $(this).parent().parent('.drop-box-list').siblings('input').val($(this).html());
        $('.drop-box-list').hide();
    })
})
$('.search-conent .row').children('.data').children('input').blur(function () {
    $(this).css('border', '0px')
})

//个人资料页面，设置第一次显示时的页面样式
$('.user-data-wrap .form-list').find('input').css({'border':'0px','background':'#fff'}).end().find('textarea').css({'border':'0px','background':'#fff'})

//点击修改按钮，出现修改界面，并隐藏修改按钮
$('.user-data-edit').on('click', function () {
    $('.form-list').find('input').removeAttr('readonly', 'true').css({'border': '1px solid rgba(218, 223, 226, 1)'}).focus(function(){
        $(this).css({'border': '1px solid rgba(161, 161, 161, 1)'})
    });
    $('.need-readonly').attr('readonly', 'true').css({'border': '1px solid rgba(218, 223, 226, 1)','background':'#f7f7f7'}).focus(function(){
        $(this).css({'border': '1px solid rgba(218, 223, 226, 1)'})
    });
    $('textarea').removeAttr('readonly', 'true').css({'border': '1px solid rgba(218, 223, 226, 1)'}).focus(function(){
        $(this).css({'border': '1px solid rgba(161, 161, 161, 1)'})
    });
    $('.search-footer').show().prev('.baseline').show();
    $(this).hide();
})



//------------------------ 树形图 ---------------------------------
// 角色管理页面 ,点击第一层加号，全列收起

//第一级加号减号的呈现
$('.select-tree .select-tree-first-layer').children('.select-tree-box').children('.icon-show').show().end().children('.icon-hide').hide()
$('.select-tree .select-tree-first-layer').eq(0).children('.select-tree-box').children('.icon-hide').show().end().children('.icon-show').hide()

$('.select-tree').on('click','.iconSH', function () {
    if($(this).hasClass('icon-hide')){
            //找自己有没有孩子
            if($(this).parent('.select-tree-box').parent('li').children('ul').length==0){
                return false;
            }else{
                $(this).hide().siblings('.icon-show').show()
                $(this).parent().siblings().hide(300);
        }
    }else{
        if($(this).parent('.select-tree-box').parent('li').children('ul').length==0){
            return false;
        }else{
            $(this).hide().siblings('.icon-hide').show()
            $(this).parent().siblings().show(300);
        }

    }
    
})

// 树形图input框背景图切换
$('.select-tree-left').find('input[type="checkbox"]').on('click', function () {
    if ($(this)[0].checked == false) {
        $(this).siblings('.icon-fuxuan').hide().siblings('.icon-fuxuan1').show();
    } else {
        $(this).siblings('.icon-fuxuan').show().siblings('.icon-fuxuan1').hide();
    }
})

//树形图 第一级按钮全选，全不选

$('.select-tree-left').find('.check-all').on('click', function () {
    
    if ($(this)[0].checked) {
        
        $(this).parents(".select-tree-first-layer").find("input[type='checkbox']").prop('checked', true).end().find('.icon-fuxuan').show().end().find('.icon-fuxuan1').hide();
        //判断点击的按钮的父级元素对应的右边的元素
        var fname = $(this).parent().parent('.select-tree-first-layer').data('layer')
        $('.select-tree-right ul').siblings('.placeholder-style').hide().end().show().find('li[data-layer=' + fname + ']').show().find('.select-tree-second-layer').show().find('.select-tree-third-layer').show() //找到对应的右边的元素，隐藏占位样式，显示点击选中的角色权限
        
        //20171125新增-----判断添加到右侧时，是否有children li标签，有的话，前面的+-图标需要更换
        
        if($('.select-tree-right ul').find('li[data-layer=' + fname + ']').children('ul').children('li').length != 0){
            $('.select-tree-right ul').find('li[data-layer=' + fname + ']').children('.select-tree-box').children('.icon-show').hide().siblings('.icon-hide').show()
        }

    } else {
        $(this).parents(".select-tree-first-layer").find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();

        // 如果取消选中，将右边对应的元素隐藏
        var fname = $(this).parent().parent('li').data('layer')
        $('.select-tree-right ul').find('li[data-layer=' + fname + ']').hide()
        if ($('.select-tree-left').find('.check-all:checked').length == 0) {
            $('.select-tree-right ul').siblings('.placeholder-style').show().end().hide()
        }

    }
})

//树形图 第二级按钮
$('.select-tree-left  .check-second-floor').on('click', function () {

    var allLengthS = $(this).parents('.select-tree-first-layer').find('.check-second-floor').length //所有的二级
    var checkedLengthS = $(this).parents('.select-tree-first-layer').find('.check-second-floor:checked').length  //选中的二级
    // console.log($(this).parents('.select-tree-first-layer').find('.check-second-floor:checked').length)
    // console.log(checkedLengthS)
    if (checkedLengthS != allLengthS) {
        $(this).parents('.select-tree-first-layer').children().children('.check-all').prop('checked', false).parent().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();
        if ($(this)[0].checked) {
            //如果二级不全选中，判断选中的是哪一个，并把这个显示在页面
            var fname = $(this).parents('.select-tree-second-layer').parents('.select-tree-first-layer').data('layer') //获取对应第一级的自定义属性值
            $('.select-tree-right ul').siblings('.placeholder-style').hide().end().show().find('li[data-layer=' + fname + ']').show() //移除占位样式，显示树形图
            var arr = $('.select-tree-right ul').find('li[data-layer=' + fname + ']').find('.select-tree-second-layer'); //获取第二级存在的元素，判断个数

            if(checkedLengthS==1){//如果只有一个选中，就显示一个，其他隐藏，否则就显示当前，不隐藏其他的
                for (var i = 0; i < arr.length; i++) {
                    if ($(arr[i]).find('span').html() == $(this).next('span').html()) {
                        $(arr[i]).show().children('ul').children().show().end().end().siblings('.select-tree-second-layer').hide() 
                    }
                }
            }else{
                for (var i = 0; i < arr.length; i++) {
                    if ($(arr[i]).find('span').html() == $(this).next('span').html()) {
                        $(arr[i]).show().children('ul').children().show().end()
                    }
                }
            }
            
        } else {
            var fname = $(this).parents('.select-tree-second-layer').parents('.select-tree-first-layer').data('layer');
            var sname = $(this).parents('.select-tree-second-layer').data('layer') //第二级元素

            var allLengthF = $('.select-tree-left .check-all').length
            var checkedLengthF = $('.select-tree-left .check-all:checked').length
            var siblingsCheckedLength = $(this).parents('.select-tree-second-layer').parents('.select-tree-first-layer').siblings('.select-tree-first-layer').find('.check-second-floor:checked').length
            var siblingsCheckedThirdLength = $(this).parents('.select-tree-second-layer').parents('.select-tree-first-layer').siblings('.select-tree-first-layer').find('.check-third-floor:checked').length


            if (checkedLengthS == 0) {
                //如果当前二级选中的个数为0，判断一级兄弟里的二级选中个数，如果都为0，则隐藏
                $('.select-tree-right ul').find('li[data-layer=' + fname + ']').hide(); //
                //如果当前二级选中个数为0，判断一级元素的个数
                if(checkedLengthF==0 && siblingsCheckedLength==0 && siblingsCheckedThirdLength==0){
                    $('.select-tree-right ul').hide().siblings('.placeholder-style').show();
                }
            } else {
                //判断对应的二级是哪一个
                var arrFather = $('.select-tree-right ul').find('li[data-layer=' + sname + ']');
                var _this = $(this)

                for (var i = 0; i < arrFather.length; i++) {
                    if ($(arrFather[i]).find('span').html() == _this.parents('li[data-layer=' + sname + ']').find('span').html()) {
                        // $(arrFather[i]).hide().siblings('.select-tree-second-layer').show().find('.select-tree-third-layer').show(); //将取消选中右边对应的二级隐藏
                        $(arrFather[i]).hide()
                    }
                }
            }
        }

    } else {
        $(this).parents('.select-tree-first-layer').children().children('.check-all').prop('checked', true).parent().find('.icon-fuxuan').show().end().find('.icon-fuxuan1').hide();
        //二级全部选中的，对应的右边也显示
        var fname = $(this).parents('.select-tree-second-layer').parents('.select-tree-first-layer').data('layer')
        $('.select-tree-right ul').siblings('.placeholder-style').hide().end().show().find('li[data-layer=' + fname + ']').show().find('.select-tree-second-layer').show().find('.select-tree-third-layer').show()
    }
    if ($(this)[0].checked) {
        $(this).parents(".select-tree-second-layer").find("input[type='checkbox']").prop('checked', true).end().find('.icon-fuxuan').show().end().find('.icon-fuxuan1').hide();
    } else {
        $(this).parents(".select-tree-second-layer").find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();

    }
})

//树形图 第三级按钮
$('.check-third-floor').on('click', function () {
    //判断三级选中的个数
    var allLengthT = $(this).parents('.select-tree-second-layer').find('.check-third-floor').length
    var checkedLengthT = $(this).parents('.select-tree-second-layer').find('.check-third-floor:checked').length
    var checkedLengthTss = $(this).parents('.select-tree-second-layer').siblings('.select-tree-second-layer').find('.check-third-floor:checked').length  //当前选中的三级的兄弟，选中的长度

    if (checkedLengthT != allLengthT) {
        $(this).parents('.select-tree-second-layer').find('.check-second-floor').prop('checked', false).siblings('.icon-fuxuan').hide().siblings('.icon-fuxuan1').show();
        if ($(this)[0].checked) {
            //如果三级不全选中，判断是哪一个选中，右边显示
            var fname = $(this).parents('.select-tree-second-layer').parents('li').data('layer') //第一级元素
            var sname = $(this).parents('.select-tree-second-layer').data('layer') //第二级元素            
            $('.select-tree-right ul').siblings('.placeholder-style').hide().end().show().find('li[data-layer=' + fname + ']').show()
            //获取所有的二级
            var allS = $(this).parents('li[data-layer=' + fname + ']').find('.select-tree-second-layer').find('.check-second-floor')
            for (var i = 0; i < allS.length; i++) {
                //判断对应的二级是哪一个
                var arrFather = $('.select-tree-right ul').find('li[data-layer=' + fname + ']').find('.select-tree-second-layer');
                var _this = $(this)
                if($(allS[i])[0].checked){
                    for (var i = 0; i < arrFather.length; i++) {
                        if ($(arrFather[i]).find('span').html() == _this.parents('li[data-layer=' + sname + ']').find('span').html()) {
                            $(arrFather[i]).show();    
                        }
                    }
                }
                else{
                    for (var i = 0; i < arrFather.length; i++) {
                        if ($(arrFather[i]).find('span').html() == _this.parents('li[data-layer=' + sname + ']').find('span').html()) {
                                //判断兄弟的三级选中的个数，
                                // var checkedLengthTss = _this.parents('li[data-layer=' + sname + ']').siblings('.select-tree-second-layer').find('.check-third-floor:checked').length 
                                if(checkedLengthTss==0){
                                    $(arrFather[i]).show().siblings('.select-tree-second-layer').hide();
                                }else{
                                    $(arrFather[i]).show()
                                }                         
                        }
                    }
                }
            }
            
            
            //找第三级
            var arr = $('.select-tree-right ul').find('li[data-layer=' + sname + ']').find('.select-tree-third-layer')
            var arrLeft = $('.select-tree-left ul').find('li[data-layer=' + sname + ']').find('.select-tree-third-layer')
            for (var i = 0; i < arr.length; i++) {
                if ($(arr[i]).find('span').html() == $(this).next('span').html()) {
                    //当当前三级选中只有一个的时候，兄弟隐藏
                   if(checkedLengthT==1){
                        $(arr[i]).show().siblings('.select-tree-third-layer').hide()
                   }else{
                        $(arr[i]).show()
                   }
                }
            }

        } else {
            //获取二级选中的长度
            var allLengthS = $('.select-tree-left .check-second-floor').length
            var checkedLengthS = $('.select-tree-left .check-second-floor:checked').length

            if (checkedLengthT == 0) {
                //如果三级选中的个数为0，判断二级选中的个数
                var fname = $(this).parents('.select-tree-second-layer').parents('li').data('layer') //第一级元素
                var sname = $(this).parents('.select-tree-second-layer').data('layer') //第二级元素

                $('.select-tree-right ul').find('li[data-layer=' + sname + ']').hide();//当前三级对应的二级隐藏

                //如果二级选中的个数为0 则二级对应的一级隐藏
                if(checkedLengthS==0){
                    //二级选中的个数为0，判断当前取消选中的三级的兄弟选中的个数
                    if(checkedLengthTss==0){
                        $('.select-tree-right ul').find('li[data-layer=' + fname + ']').hide();
                            //如果当前二级选中个数为0，判断一级元素的个数
                            var allLengthF = $('.select-tree-left .check-all').length
                            var checkedLengthF = $('.select-tree-left .check-all:checked').length
                                if(checkedLengthF==0){
                                    $('.select-tree-right ul').hide().siblings('.placeholder-style').show();
                                }
                    }
                    
                }

            } else {
                var sname = $(this).parents('.select-tree-second-layer').data('layer') //第二级元素
                //找右边对应的第三级
                var arr = $('.select-tree-right ul').find('li[data-layer=' + sname + ']').find('.select-tree-third-layer')

                for (var i = 0; i < arr.length; i++) {
                    if ($(arr[i]).find('span').html() == $(this).next('span').html()) {
                        $(arr[i]).hide()
                    }
                }
            }
        }


    } else {
        $(this).parents('.select-tree-second-layer').find('.check-second-floor').prop('checked', true).siblings('.icon-fuxuan').show().siblings('.icon-fuxuan1').hide();
        //选中的，对应的右边也显示
        var fname = $(this).parents('.select-tree-second-layer').parents('li').data('layer');
        var sname = $(this).parents('.select-tree-second-layer').data('layer');
        $('.select-tree-right ul').siblings('.placeholder-style').hide().end().show().find('li[data-layer=' + fname + ']').show().find('li[data-layer=' + sname + ']')
            .find('.select-tree-third-layer').show()
    }

    // 判读二级选中的个数
    var allLengthS = $(this).parents('.select-tree-first-layer').find('.check-second-floor').length
    var checkedLengthS = $(this).parents('.select-tree-first-layer').find('.check-second-floor:checked').length

    if (checkedLengthS == allLengthS) {
        $(this).parents('.select-tree-first-layer').children().children('.check-all').prop('checked', true).parent().find('.icon-fuxuan').show().end().find('.icon-fuxuan1').hide();
        //选中的，对应的右边也显示
        var fname = $(this).parents('.select-tree-second-layer').parents('li').data('layer');
        var sname = $(this).parents('.select-tree-second-layer').data('layer');
        $('.select-tree-right ul').siblings('.placeholder-style').hide().end().show().find('li[data-layer=' + fname + ']').show().find('.select-tree-second-layer').show().find('.select-tree-third-layer').show()
    } else {
        $(this).parents('.select-tree-first-layer').children().children('.check-all').prop('checked', false).parent().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();
    }

})

//树形图右侧盒子-点击清空所有
$('.select-tree-right').find('.clear-all').on('click', function () {
    $(this).parent('.title').siblings('li').hide();
    $('.select-tree-left').find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();
    showPlaceHolderStyle();
})


//树形图右侧盒子-点击单个li的小叉，隐藏这个元素，并更改左边对应的选中
$('.select-tree-right').on('click', '.icon-del', function () {
    var myLayer = $(this).parent('.select-tree-box').parent();
    
    //判断自己是哪一级，
    if(myLayer.hasClass('select-tree-first-layer')){   //如果点击的按钮在第一级
        var fname = myLayer.data('layer'); //获取对应的第一级自定义属性名

        //如果是第一级，将下属全部隐藏
        myLayer.hide()
        //根据自定义属性名，找到对应的左边的元素，点击x时将左边对应选中的取消选中
        $('.select-tree-left').find('li[data-layer=' + fname + ']').find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();
        // showPlaceHolderStyle()

        var checkedLengthF = $('.select-tree-left').find('.select-tree-first-layer').find('.check-all:checked').length; //获取第一级选中的长度

        if(checkedLengthF ==0){
            showPlaceHolderStyle()
        }

    }else if(myLayer.hasClass('select-tree-second-layer')){  //如果点击的按钮在第二级

        var fname = myLayer.parents('.select-tree-first-layer').data('layer'); //获取对应的第一级的自定义属性名
        var sname = myLayer.data('layer'); //获取对应的第二级自定义属性名
        var allLengthS = $('.select-tree-left').find('li[data-layer=' + fname + ']').find('.select-tree-second-layer').length; //获取二级的长度
        var checkedLengthS = $('.select-tree-left').find('li[data-layer=' + fname + ']').find('.check-second-floor:checked').length; //获取第二级选中的长度

        if(checkedLengthS==1){
            //如果同级只有一个，将上一级下边的全部隐藏
            myLayer.parents('li[data-layer=' + fname + ']').hide(); //对应的一级下面的元素全部隐藏
            $('.select-tree-left').find('li[data-layer=' + fname + ']').find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();

            //同时判断一级有几个选中，
            var checkedLengthF = $('.select-tree-left').find('.select-tree-first-layer').find('.check-all:checked').length; //获取第一级选中的长度
            if(checkedLengthF ==0){
                showPlaceHolderStyle()
            }

        }else{
             //如果同级有两个，点击的时候只隐藏自己
             myLayer.hide();
             $('.select-tree-left').find('li[data-layer=' + fname + ']').find('li[data-layer=' + sname + ']').find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();
        }

    }else if(myLayer.hasClass('select-tree-third-layer')){  //如果点击的按钮在第三级
        var fname = myLayer.parents('.select-tree-first-layer').data('layer'); //获取对应的第一级的自定义属性名
        var sname = myLayer.parents('.select-tree-second-layer').data('layer'); //获取对应的第二级自定义属性名
        
        var allLengthT = $('.select-tree-left').find('li[data-layer=' + fname + ']').find('li[data-layer=' + sname + ']').find('.select-tree-third-layer').length; //获取三级的长度
        var checkedLengthT = $('.select-tree-left').find('li[data-layer=' + fname + ']').find('li[data-layer=' + sname + ']').find('.check-third-floor:checked').length //获取三级选中的长度

        if(checkedLengthT ==1){
            //如果同级只有一个，将上一级下边的全部隐藏
            myLayer.parents('li[data-layer=' + sname + ']').hide(); //对应的一级下面的元素全部隐藏
            $('.select-tree-left').find('li[data-layer=' + fname + ']').find('li[data-layer=' + sname + ']').find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();

            //再判断二级的选中的长度
            var allLengthS = $('.select-tree-left').find('li[data-layer=' + fname + ']').find('.select-tree-second-layer').length; //获取二级的长度
           
            var checkedLengthS = $('.select-tree-left').find('li[data-layer=' + fname + ']').find('.check-second-floor:checked').length; //获取第二级选中的长度
            if(checkedLengthS==0){
                myLayer.parents('li[data-layer=' + fname + ']').hide(); //对应的一级下面的元素全部隐藏
                $('.select-tree-left').find('li[data-layer=' + fname + ']').find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();

                //同时判断一级有几个选中，
                var checkedLengthF = $('.select-tree-left').find('.select-tree-first-layer').find('.check-all:checked').length; //获取第一级选中的长度
                if(checkedLengthF ==0){
                    showPlaceHolderStyle()
                }
            }

        }else{
            // myLayer.hide();
            // $('.select-tree-left').find('li[data-layer=' + fname + ']').find('li[data-layer=' + sname + ']').find('.select-tree-third-layer').find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();
            var thisText = $(this).prev('span').html();
            //获取右侧对应三级元素,隐藏
            var arr = $('.select-tree-left').find('li[data-layer=' + fname + ']').find('li[data-layer=' + sname + ']').find('.select-tree-third-layer')
            console.log(thisText)
            for(var i=0; i<arr.length; i++){
                if($(arr[i]).find('span').html()==thisText){
                    myLayer.hide();
                    $(arr[i]).find("input[type='checkbox']").prop('checked', false).end().find('.icon-fuxuan').hide().end().find('.icon-fuxuan1').show();
                }
               
            }
        }
    }


})

//判断如果树形图右侧没有li标签，则显示占位样式
function showPlaceHolderStyle() {
        $('.placeholder-style').show().siblings('ul').hide();
}


//新增和编辑角色页面，点击保存按钮，保存右侧树形显示的数据

storeSelecTreeData( $('.add-role-wrap .save'))

function storeSelecTreeData(btn){
    var arr =[]
    btn.on('click',function(){
        
            $('.select-tree-right .select-tree-first-layer').each(function(){
                
                if($(this).css('display') !='none'){ //遍历第一级是否隐藏
        
                    arr.push( $(this).data('layer') ) ; //取到显示的第一级属性
        
                    $(this).children('ul').children('.select-tree-second-layer').each(function(){
                        if($(this).css('display') !='none'){
                            arr.push( $(this).data('layer'))  //取到显示的第二级属性
        
                            $(this).children('ul').children('.select-tree-third-layer').each(function(){
                                if( $(this).css('display') !='none'){
                                    arr.push( $(this).data('layer')) //取到显示的第三级属性
                                }
                            })
                        }
                    })
                }
            })
            if($('.select-tree-right').children('ul').css('display') == 'none'){
                arr = [] //如果右侧显示的内容全部清空，则保存的数据也清空
            }
        
            var saveArr = [] //将保存的数组去重
            for(var i=0; i<arr.length; i++){
                if(saveArr.indexOf( arr[i] )==-1){
                    saveArr.push( arr[i] )
                }
            }

            console.log(saveArr)  //最终保存的数据
        })
}

//编辑个人信息
$('.check-role-list').find('input[type="checkbox"]').on('click',function(){
    console.log($(this).prop('checked'))
    if($(this).prop('checked')==true){
        $(this).siblings('.icon-fuxuan').show().siblings('.icon-fuxuan1').hide()
    }else{
        $(this).siblings('.icon-fuxuan').hide().siblings('.icon-fuxuan1').show()
    }
})

//点击是否显示按钮，切换图片
$('.table-list-content .row li').find('.icon-a').on('click', function () {
    $(this).css('display', 'none').siblings('.icon-Artboard2').css('display', 'block')
})
$('.table-list-content .row li').find('.icon-Artboard2').on('click', function () {
    $(this).css('display', 'none').siblings('.icon-a').css('display', 'block')
})

$('.tmc-add .icon-Artboard2').on('click', function () {
	$('.tmc-add .icon-a').removeClass('dsn');
	$(this).addClass('dsn');
})
$('.tmc-add .icon-a').on('click', function () {
	$('.tmc-add .icon-Artboard2').removeClass('dsn');
	$(this).addClass('dsn');
})

/**
 * @param dataSourceJSON 下拉框数据源，是一个lsit的JSON串
 * @param labelInputId  页面显示的名字
 * @param valueInputId  提交到后台的值
 */
function  initAutocomplete(dataSourceJSON, labelTargt, valueTarget,changeFunction) {
    // console.log("initAutocomplete.dataSourceJSON="+dataSourceJSON);
    if (null != dataSourceJSON && "" != dataSourceJSON && undefined != dataSourceJSON && "[]" != dataSourceJSON){
        var projects = JSON.parse(dataSourceJSON);
        initAutocompleteObject(projects,labelTargt, valueTarget,changeFunction);
    }
}

/**
 * @param dataSourceJSON 下拉框数据源，是一个lsit的JSON串
 * @param labelInputId  页面显示的名字
 * @param valueInputId  提交到后台的值
 */
function  initAutocompleteObject(dataSource, labelTargt, valueTarget,changeFunction) {
    if (!labelTargt) {
        labelTargt = 'project';
    }
    if (!valueTarget) {
        valueTarget = 'project-id';
    }

    $( "#" + labelTargt ).autocomplete({
        minLength: 0,
        source: dataSource,
        focus: function( event, ui ) {
            $( "#" + labelTargt ).val( ui.item.label );
            return false;
        },
        select: function( event, ui ) {
            $( "#" + labelTargt ).val( ui.item.label );
            $( "#" + valueTarget ).val( ui.item.value );

            if (undefined != changeFunction){
                changeFunction(event, ui);
            }
            return false;
        },
        change: function(event, ui) {
        	var labelValue = $( "#" + labelTargt ).val();
        	if (!labelValue) {
        		$( "#" + valueTarget ).val( null );
        	}
        	if (!ui.item) {
        		$( "#" + valueTarget ).val( null );
        	}
        }
    });

    $( "#" + labelTargt ).focus(function () {
        $(this).autocomplete("search");
    });
}

/**
 * 分销商联想
 * 
 * @returns
 */
function initAgentAutocomplete() {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath + 'admin/agentController/autocomplete',
		success : function(data) {
			if (data.result && data.result == 1) {
				initAutocomplete(JSON.stringify(data.obj), 'agentName',
						'agentCode');
			} else {
				new Tip({
					msg : data.errorReason,
					timer : 1000,
					type : 2
				});
			}
		}
	});
}

/**
 * 供应商联想
 * 
 * @returns
 */
function initSupplyAutocomplete(callback) {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath + 'admin/supplyController/autocomplete',
		success : function(data) {
			if (data.result && data.result == 1) {
				initAutocomplete(JSON.stringify(data.obj), 'supplyName',
						'supplyCode',callback);
			} else {
				new Tip({
					msg : data.errorReason,
					timer : 1000,
					type : 2
				});
			}
		}
	});
}

/**
 * 酒店联想
 * 
 * @returns
 */
function initHotelAutocomplete(callback) {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath + 'admin/getAutoCompleteHotelList',
		success : function(data) {
			if (data) {
				initAutocomplete(JSON.stringify(data), 'hotelName', 'hotelId',callback);
			} else {
				console.log('酒店联想未返回数据');
			}
		}
	});
}

function initPagination(callback) {
	console.log('typeof callback == function', typeof callback === 'function');
	if (!typeof callback === 'function') {
		console.error('No function can be found!');
		return;
	}
	var currentPage = $("#currentPage").val();
	var totalPage = $("#totalPages").val();
	var totalRecords = $("#totalCount").val();
	// 生成分页
	// 有些参数是可选的，比如lang，若不传有默认值
	new Pager({
		pno : currentPage,
		// 总页码
		total : totalPage,
		// 总数据条数
		totalRecords : totalRecords,
		isShowTotalRecords : true,
		isGoPage : true,
		mode : 'click', // 默认值是link，可选link或者click
		click : function(n) {
			$("#currentPage").val(n);
			callback();
			// 手动选中按钮
			this.selectPage(n);
			return false;
		}
	});
}

/**
 * 部门联想
 *
 * @returns
 */
function initDeptAutocomplete(callback) {
    $.ajax({
        type : 'POST',
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        context : document.body,
        url : projectPath + 'admin/department/autocomplete',
        success : function(data) {
            if (data.result && data.result == 1) {
                initAutocomplete(JSON.stringify(data.obj), 'deptName',
                    'deptNo',callback);
            } else {
                new Tip({
                    msg : data.errorReason,
                    timer : 1000,
                    type : 2
                });
            }
        }
    });
}

/**
 * 空字符判断
 */
function checkEmpty(str){
	if(str == ''|| typeof(str) == "undefined" || str == null){
		return false;
	}
	return true;
}

function initDatepicker(){
    $( "#beginDate" ).datepicker({
        // defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        yearRange:"2017:2028",
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
            $( "#endDate" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    $( "#endDate" ).datepicker({
        // defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        yearRange:"2017:2028",
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
            $( "#beginDate" ).datepicker( "option", "maxDate", selectedDate );
        }
    });
}





