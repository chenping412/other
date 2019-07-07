/**
 * Created by Administrator on 2019/7/7.
 */

var searchStr=location.search;

$('#nav').find('a').each(function(){

    var href = $(this).attr('href')
    console.log(href,searchStr);
    if(href && href!=''){
        $(this).attr('href', href+searchStr)
    }
})