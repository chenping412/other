/**
 * Created by GIISO on 2018/7/20.
 */


//tab选项卡函数----------------------------------
function tabChange(){
    var tabChange=$('.tab-change');
    var tabs=tabChange.find('.tabs').find('.tab');
    var items=tabChange.find('.items').find('.item');

    tabs.on('click',function(){
        var index=$(this).index();
        tabs.removeClass('active').eq(index).addClass('active');
        items.hide().eq(index).show();
    });
}

//弹窗浮层关闭按钮统一执行代码
$('.model-view').find('.close').on('click',function(){
    $(this).parents('.model-view').hide();
});