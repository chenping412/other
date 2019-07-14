/**
 * Created by Administrator on 2019/7/7.
 */

var searchStr=location.search;
$('#nav').find('a').each(function(){

    var href = $(this).attr('href')
    if(href && href!=''){
        $(this).attr('href', href+searchStr)
    }
});

var infoHref =$('#company-info').attr('href');
if(infoHref){
    $('#company-info').attr('href', infoHref+searchStr);
}


 function searchOjb() {
    var str = location.search.slice(1);
    var res = {};
    if (!str) {
        return res;
    }
    str.split("&").forEach(function (v, k, arr) {
        var param = v.split('=');
        res[param[0]] = param[1];
    });
    return res;
}
var apiHost= '';
var imgHost=apiHost+ '/MM2/img/';
var pdfHost=apiHost+ '/MM2/img/';
var mvHost=apiHost+ '/MM2/mv/';
if (location.hostname == "172.16.1.27" || location.hostname == "localhost") {
    apiHost= 'http://'+location.hostname+':8090';
    imgHost= 'http://www.myqsl.cn/MM2/img/';
    pdfHost= 'http://www.myqsl.cn/MM2/img/';
    mvHost= 'http://www.myqsl.cn/MM2/mv/';
}